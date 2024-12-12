export const getColorById = (id: string) => {
  const colors = ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33A1"];

  const hash = id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export const adjustColorTone = (color: string, factor: number): string => {
  const hex = color.replace("#", "");
  const rgb = hex.match(/.{1,2}/g)?.map((value) => parseInt(value, 16)) ?? [];
  const adjustedRgb = rgb.map((channel) =>
    Math.min(255, Math.max(0, Math.floor(channel * factor)))
  );
  return `rgb(${adjustedRgb.join(",")})`;
};
