export default function useRecoveryScore(lastSession) {

  if (!lastSession) return 100;

  const time = lastSession.time || 0;

  if (time > 3600) return 60;
  if (time > 2400) return 75;

  return 90;
}