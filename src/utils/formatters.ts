export const formatCentreType = (value: string): string => {
  if (!value) return "";

  const formatted = value
    .toLowerCase()
    .replace(/_/g, " ");

  return formatted[0].toUpperCase() + formatted.slice(1);
};
