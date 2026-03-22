/**
 * Generates initials from a user's display name or username.
 *
 * The function extracts the first letter of each word in the provided name
 * and returns up to two uppercase characters. If `name` is not available,
 * the function falls back to `username`. If neither is provided, it defaults
 * to `"U"`.
 *
 * Examples:
 * - `"John Doe"` → `"JD"`
 * - `"alice"` → `"A"`
 * - `"Mary Jane Watson"` → `"MJ"`
 * - `null, "player1"` → `"P"`
 *
 * @param {string | null | undefined} name - The user's display name.
 * @param {string | null | undefined} [username] - Optional username used as a fallback.
 * @returns {string} Up to two uppercase initials derived from the provided values.
 */
export function getInitials(
  name: string | null | undefined,
  username?: string | null,
): string {
  const source = name || username || 'U';

  return source
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}