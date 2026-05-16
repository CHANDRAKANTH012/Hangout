export const formatTime = (isoString: string) => {
  if (!isoString) return "";

  const date = new Date(isoString);

  return date.toLocaleString("en-IN", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};