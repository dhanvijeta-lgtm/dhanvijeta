/**
 * Formats seconds into a human-readable duration string.
 * Examples:
 * 0 or null -> ''
 * 45 -> '45s'
 * 90 -> '1m 30s'
 * 600 -> '10m'
 * 3600 -> '1h'
 */
export const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds) || Number(seconds) <= 0) return '';
  const totalSecs = Math.round(Number(seconds));
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  if (hrs > 0) {
    return `${hrs}h${mins > 0 ? ` ${mins}m` : ''}`;
  }
  if (mins > 0) {
    return `${mins}m${secs > 0 ? ` ${secs}s` : ''}`;
  }
  return `${secs}s`;
};

export default formatDuration;
