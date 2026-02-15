import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.87.1";

const XP_RULES: Record<string, number> = {
  create_challenge: 25,
  accept_challenge: 25,
  verified_resolution: 100,
  share_result: 10,
};

const RANK_ACHIEVEMENT_MAP: Record<string, string> = {
  Contender: "rank_contender",
  Rival: "rank_rival",
  Warrior: "rank_warrior",
  Champion: "rank_champion",
  Legend: "rank_legend",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { eventType, sourceType, sourceId } = await req.json();

    if (!eventType || !sourceType || !sourceId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: eventType, sourceType, sourceId" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const points = XP_RULES[eventType];
    if (!points) {
      return new Response(
        JSON.stringify({ error: `Unknown event type: ${eventType}` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

    const { error: insertError } = await serviceClient
      .from("xp_events")
      .insert({
        user_id: user.id,
        event_type: eventType,
        source_type: sourceType,
        source_id: sourceId,
        points,
      });

    if (insertError) {
      if (insertError.code === "23505") {
        const { data: profile } = await serviceClient
          .from("profiles")
          .select("xp, level")
          .eq("id", user.id)
          .single();

        return new Response(
          JSON.stringify({
            success: true,
            alreadyAwarded: true,
            xp: profile?.xp ?? 0,
            rank: profile?.level ?? "Challenger",
            rankChanged: false,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to insert XP event", details: insertError.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data: recomputeResult, error: recomputeError } = await serviceClient
      .rpc("recompute_profile_xp", { p_user_id: user.id });

    if (recomputeError) {
      return new Response(
        JSON.stringify({ error: "Failed to recompute XP", details: recomputeError.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = recomputeResult?.[0] ?? { new_xp: 0, new_rank: "Challenger", old_rank: "Challenger" };
    const rankChanged = result.new_rank !== result.old_rank;

    if (rankChanged) {
      const achievementId = RANK_ACHIEVEMENT_MAP[result.new_rank];
      if (achievementId) {
        await serviceClient
          .from("user_achievements")
          .insert({
            user_id: user.id,
            achievement_id: achievementId,
          });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        alreadyAwarded: false,
        xp: result.new_xp,
        rank: result.new_rank,
        previousRank: result.old_rank,
        rankChanged,
        pointsAwarded: points,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
