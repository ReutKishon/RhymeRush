export const getColorById = (id: string) => {
  // Generate a hash value from the ID
  const hash = id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

  // Generate a hue value based on the hash
  const hue = hash % 360; // Hue ranges from 0 to 360 (color spectrum)
  const saturation = 80; // High saturation for vibrant colors
  const lightness = 40; // Lower lightness for strong colors (but not too dark)

  // Convert HSL to CSS string
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const adjustColorTone = (color: string, factor: number): string => {
  const hex = color.replace("#", "");
  const rgb = hex.match(/.{1,2}/g)?.map((value) => parseInt(value, 16)) ?? [];
  const adjustedRgb = rgb.map((channel) =>
    Math.min(255, Math.max(0, Math.floor(channel * factor)))
  );
  return `rgb(${adjustedRgb.join(",")})`;
};
