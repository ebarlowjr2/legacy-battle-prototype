// Migration script to convert legacy provider event IDs to canonical UUIDs
// Run this once to update existing battles that have old TheSportsDB event IDs

import { supabase } from '@/shared/lib/supabaseClient';
import { SportsRepo } from '@/features/sports';

// Check if a string is a UUID
function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

export async function migrateBattleEventIds(): Promise<{
  total: number;
  migrated: number;
  skipped: number;
  failed: number;
  details: Array<{ battleId: string; oldEventId: string; newEventId: string | null; status: string }>;
}> {
  const details: Array<{ battleId: string; oldEventId: string; newEventId: string | null; status: string }> = [];
  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  // Fetch all battles with event_id that is NOT a UUID
  const { data: battles, error } = await supabase
    .from('battles')
    .select('id, event_id')
    .not('event_id', 'is', null);

  if (error) {
    console.error('Error fetching battles:', error);
    return { total: 0, migrated: 0, skipped: 0, failed: 0, details };
  }

  const total = battles?.length || 0;
  console.log(`Found ${total} battles with event_id`);

  for (const battle of battles || []) {
    const eventId = battle.event_id;

    // Skip if already a UUID
    if (isUuid(eventId)) {
      skipped++;
      details.push({
        battleId: battle.id,
        oldEventId: eventId,
        newEventId: null,
        status: 'skipped - already UUID',
      });
      continue;
    }

    // Try to find the event in sports_events by provider_event_id
    // First try TheSportsDB
    let repoEvent = await SportsRepo.getEventByProviderId('thesportsdb', eventId);

    // If not found, try ESPN
    if (!repoEvent) {
      repoEvent = await SportsRepo.getEventByProviderId('espn', eventId);
    }

    if (repoEvent) {
      // Update the battle with the canonical UUID
      const { error: updateError } = await supabase
        .from('battles')
        .update({ event_id: repoEvent.id })
        .eq('id', battle.id);

      if (updateError) {
        failed++;
        details.push({
          battleId: battle.id,
          oldEventId: eventId,
          newEventId: null,
          status: `failed - ${updateError.message}`,
        });
      } else {
        migrated++;
        details.push({
          battleId: battle.id,
          oldEventId: eventId,
          newEventId: repoEvent.id,
          status: 'migrated',
        });
      }
    } else {
      // Could not find matching event in repo
      failed++;
      details.push({
        battleId: battle.id,
        oldEventId: eventId,
        newEventId: null,
        status: 'failed - event not found in repo',
      });
    }
  }

  console.log(`Migration complete: ${migrated} migrated, ${skipped} skipped, ${failed} failed`);

  return { total, migrated, skipped, failed, details };
}

// Export for use in dev screen or manual execution
export default migrateBattleEventIds;
