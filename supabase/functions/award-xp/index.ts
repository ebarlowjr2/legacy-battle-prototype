// Supabase Edge Function: award-xp
// Awards XP to users for various actions (create battle, join, resolve, share)
// Uses service role to write to xp_events table (client cannot write directly)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// XP values for each event type
const XP_VALUES: Record<string, number> = {
  create_challenge: 25,
  accept_challenge: 25,
  verified_resolution: 100,
  share_result: 10,
}

// Rank thresholds for achievements
const RANK_THRESHOLDS: Record<string, { xp: number; achievementId: string }> = {
  Contender: { xp: 100, achievementId: 'rank_contender' },
  Rival: { xp: 500, achievementId: 'rank_rival' },
  Warrior: { xp: 1500, achievementId: 'rank_warrior' },
  Champion: { xp: 5000, achievementId: 'rank_champion' },
  Legend: { xp: 15000, achievementId: 'rank_legend' },
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with user's JWT
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    // Client for auth verification
    const supabaseAuth = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    })
    
    // Service client for writes
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const { eventType, sourceType, sourceId } = await req.json()

    // Validate required fields
    if (!eventType || !sourceType || !sourceId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: eventType, sourceType, sourceId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate event type
    const points = XP_VALUES[eventType]
    if (!points) {
      return new Response(
        JSON.stringify({ error: `Invalid eventType: ${eventType}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get current profile XP before awarding
    const { data: profileBefore } = await supabaseAdmin
      .from('profiles')
      .select('xp, level')
      .eq('id', user.id)
      .single()

    const previousXp = profileBefore?.xp || 0
    const previousLevel = profileBefore?.level || 'Challenger'

    // Try to insert XP event (idempotent - unique constraint prevents duplicates)
    const { data: xpEvent, error: insertError } = await supabaseAdmin
      .from('xp_events')
      .insert({
        user_id: user.id,
        event_type: eventType,
        source_type: sourceType,
        source_id: sourceId,
        points,
      })
      .select()
      .single()

    // If duplicate, return already_awarded
    if (insertError) {
      if (insertError.code === '23505') { // Unique constraint violation
        return new Response(
          JSON.stringify({ 
            ok: false, 
            status: 'already_awarded',
            message: 'XP already awarded for this action'
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      throw insertError
    }

    // Recompute profile XP and rank
    const { error: recomputeError } = await supabaseAdmin.rpc('recompute_profile_xp', {
      p_user_id: user.id,
    })

    if (recomputeError) {
      console.error('Error recomputing XP:', recomputeError)
    }

    // Get updated profile
    const { data: profileAfter } = await supabaseAdmin
      .from('profiles')
      .select('xp, level')
      .eq('id', user.id)
      .single()

    const newXp = profileAfter?.xp || 0
    const newLevel = profileAfter?.level || 'Challenger'

    // Check if rank changed and award achievement
    let rankUp = false
    let newAchievement = null

    if (newLevel !== previousLevel) {
      rankUp = true
      const rankInfo = RANK_THRESHOLDS[newLevel]
      
      if (rankInfo) {
        // Award rank achievement (idempotent)
        const { error: achievementError } = await supabaseAdmin
          .from('user_achievements')
          .insert({
            user_id: user.id,
            achievement_id: rankInfo.achievementId,
          })
          .select()
          .single()

        if (!achievementError || achievementError.code === '23505') {
          newAchievement = rankInfo.achievementId
        }
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        status: 'awarded',
        points,
        eventType,
        previousXp,
        newXp,
        previousLevel,
        newLevel,
        rankUp,
        newAchievement,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in award-xp function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
