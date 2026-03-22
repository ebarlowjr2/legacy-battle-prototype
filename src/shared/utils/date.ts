/**
 * Converts a date string into a human-readable relative time string.
 *
 * Examples:
 * - "Just now"
 * - "5m ago"
 * - "3h ago"
 * - "2d ago"
 * - "Jan 5" (for dates older than 7 days)
 *
 * @param {string} dateString - A date string parseable by the JavaScript `Date` constructor.
 * @returns {string} A relative time representation of the provided date.
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Formats a date string into a full readable date with time.
 *
 * Example:
 * - "Jan 5, 2025, 02:30 PM"
 *
 * Uses the `en-US` locale for consistent formatting.
 *
 * @param {string} dateString - A date string parseable by the JavaScript `Date` constructor.
 * @returns {string} A formatted date string including month, day, year, hour, and minute.
 */
export function formatFullDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formats a date string into a short, compact date format.
 *
 * Example:
 * - "Mon, Jan 5"
 *
 * Useful for UI elements where space is limited but weekday context is helpful.
 *
 * @param {string} dateString - A date string parseable by the JavaScript `Date` constructor.
 * @returns {string} A short formatted date string including weekday, month, and day.
 */
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Calculates the remaining time until a specified event time and returns a compact countdown string.
 *
 * Examples:
 * - "2d 5h"
 * - "3h 12m"
 * - "Started" (if the event time has passed)
 * - "TBD" (if no event time is provided)
 *
 * @param {string | null} eventTime - A date string representing the event start time, or `null` if unknown.
 * @returns {string} A human-readable countdown until the event starts.
 */
export function formatTimeRemaining(eventTime: string | null): string {
  if (!eventTime) return 'TBD';
  const now = new Date();
  const event = new Date(eventTime);
  const diff = event.getTime() - now.getTime();
  if (diff <= 0) return 'Started';
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  return `${hours}h ${minutes}m`;
}