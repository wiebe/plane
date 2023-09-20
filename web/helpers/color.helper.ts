export type TRgb = { r: number; g: number; b: number };

export const hexToRgb = (hex: string): TRgb => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return { r, g, b };
};

export const rgbToHex = (rgb: TRgb): string => {
  const { r, g, b } = rgb;

  const hexR = r.toString(16).padStart(2, "0");
  const hexG = g.toString(16).padStart(2, "0");
  const hexB = b.toString(16).padStart(2, "0");

  return `#${hexR}${hexG}${hexB}`;
};

/**
 * @returns {string} random hex color code
 * @description function to generate a random vibrant hex color code
 */

export const getRandomColor = (): string => {
  // Generate random RGB values
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  // Calculate the luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Define thresholds for luminance (adjust as needed)
  const minLuminance = 0.3;
  const maxLuminance = 0.7;

  // Check if the luminance is within the desired range
  if (luminance >= minLuminance && luminance <= maxLuminance) {
    // Convert RGB to hex format
    const hexColor = `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
    return hexColor;
  } else {
    // Recurse to find a suitable color
    return getRandomColor();
  }
};
