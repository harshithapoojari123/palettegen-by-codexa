export const MOODS = {
  Minimal: [
    [210, 16, 92],
    [216, 18, 84],
    [220, 14, 70],
    [215, 24, 28],
    [0, 0, 100]
  ],
  Luxury: [
    [242, 36, 18],
    [268, 45, 28],
    [333, 54, 42],
    [42, 84, 58],
    [28, 36, 88]
  ],
  Neon: [
    [304, 100, 58],
    [188, 100, 50],
    [115, 100, 55],
    [48, 100, 56],
    [252, 96, 63]
  ],
  Pastel: [
    [345, 88, 84],
    [36, 92, 82],
    [142, 56, 82],
    [205, 76, 84],
    [265, 72, 86]
  ],
  Corporate: [
    [218, 64, 38],
    [211, 34, 58],
    [190, 36, 44],
    [44, 84, 52],
    [216, 24, 14]
  ],
  Dark: [
    [230, 38, 10],
    [248, 40, 18],
    [280, 46, 24],
    [198, 72, 34],
    [340, 58, 38]
  ],
  Nature: [
    [143, 42, 36],
    [96, 44, 48],
    [48, 58, 54],
    [22, 44, 42],
    [185, 32, 46]
  ],
  Retro: [
    [12, 72, 55],
    [38, 88, 62],
    [174, 42, 44],
    [212, 38, 34],
    [322, 40, 48]
  ]
};

export const INDUSTRY_PRESETS = {
  SaaS: ["#2563EB", "#7C3AED", "#06B6D4", "#0F172A", "#F8FAFC"],
  Fashion: ["#111827", "#F472B6", "#F9A8D4", "#FDE68A", "#FFF7ED"],
  Food: ["#EF4444", "#F97316", "#FACC15", "#16A34A", "#FFF7ED"],
  Finance: ["#0F766E", "#134E4A", "#A3E635", "#E2E8F0", "#020617"],
  Education: ["#2563EB", "#F59E0B", "#10B981", "#EEF2FF", "#111827"],
  Healthcare: ["#0891B2", "#14B8A6", "#A7F3D0", "#F0FDFA", "#164E63"]
};

export const COLOR_NAMES = [
  ["Ink", "#0F172A"],
  ["Cloud", "#F8FAFC"],
  ["Rose", "#FF6B9D"],
  ["Sunbeam", "#FFD166"],
  ["Mint", "#06D6A0"],
  ["Sky", "#4CC9F0"],
  ["Indigo", "#2D1E8F"],
  ["Coral", "#FF7A59"],
  ["Emerald", "#10B981"],
  ["Violet", "#8B5CF6"],
  ["Amber", "#F59E0B"],
  ["Teal", "#0D9488"],
  ["Ruby", "#DC2626"],
  ["Graphite", "#374151"],
  ["Pearl", "#F3F4F6"]
];

export function hslToHex(h, s, l) {
  const saturation = s / 100;
  const lightness = l / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lightness - chroma / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) [r, g, b] = [chroma, x, 0];
  else if (h < 120) [r, g, b] = [x, chroma, 0];
  else if (h < 180) [r, g, b] = [0, chroma, x];
  else if (h < 240) [r, g, b] = [0, x, chroma];
  else if (h < 300) [r, g, b] = [x, 0, chroma];
  else [r, g, b] = [chroma, 0, x];

  return [r, g, b]
    .map((value) =>
      Math.round((value + m) * 255)
        .toString(16)
        .padStart(2, "0")
        .toUpperCase()
    )
    .join("")
    .replace(/^/, "#");
}

export function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  };
}

export function rgbToHsl({ r, g, b }) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === red) h = (green - blue) / d + (green < blue ? 6 : 0);
    if (max === green) h = (blue - red) / d + 2;
    if (max === blue) h = (red - green) / d + 4;
    h *= 60;
  }

  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function rgbToCmyk({ r, g, b }) {
  if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 };
  const c = 1 - r / 255;
  const m = 1 - g / 255;
  const y = 1 - b / 255;
  const k = Math.min(c, m, y);
  return {
    c: Math.round(((c - k) / (1 - k)) * 100),
    m: Math.round(((m - k) / (1 - k)) * 100),
    y: Math.round(((y - k) / (1 - k)) * 100),
    k: Math.round(k * 100)
  };
}

export function contrastRatio(foreground, background) {
  const luminance = (hex) => {
    const { r, g, b } = hexToRgb(hex);
    const values = [r, g, b].map((channel) => {
      const c = channel / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
  };
  const light = Math.max(luminance(foreground), luminance(background));
  const dark = Math.min(luminance(foreground), luminance(background));
  return Number(((light + 0.05) / (dark + 0.05)).toFixed(2));
}

export function readableTextColor(background) {
  return contrastRatio("#FFFFFF", background) >= contrastRatio("#0F172A", background) ? "#FFFFFF" : "#0F172A";
}

export function accessibilityScore(colors) {
  const passing = colors.filter((color) => contrastRatio(readableTextColor(color), color) >= 4.5).length;
  return Math.round((passing / colors.length) * 100);
}

export function nearestColorName(hex) {
  const target = hexToRgb(hex);
  const nearest = COLOR_NAMES.reduce(
    (best, [name, color]) => {
      const rgb = hexToRgb(color);
      const distance = Math.hypot(target.r - rgb.r, target.g - rgb.g, target.b - rgb.b);
      return distance < best.distance ? { name, distance } : best;
    },
    { name: "Custom", distance: Infinity }
  );
  return nearest.name;
}

export function generateMoodPalette(mood, locked, current) {
  const seed = MOODS[mood] || MOODS.Neon;
  return seed.map(([h, s, l], index) => {
    if (locked[index]) return current[index];
    const hue = (h + Math.floor(Math.random() * 24) - 12 + 360) % 360;
    const saturation = Math.max(12, Math.min(100, s + Math.floor(Math.random() * 12) - 6));
    const lightness = Math.max(8, Math.min(94, l + Math.floor(Math.random() * 10) - 5));
    return hslToHex(hue, saturation, lightness);
  });
}

export function generateBrandPalette(brandName, industry) {
  const base = INDUSTRY_PRESETS[industry] || INDUSTRY_PRESETS.SaaS;
  const influence = [...brandName].reduce((total, char) => total + char.charCodeAt(0), 0);
  return base.map((color, index) => {
    const hsl = rgbToHsl(hexToRgb(color));
    return hslToHex(
      (hsl.h + influence + index * 8) % 360,
      Math.min(96, Math.max(18, hsl.s + (influence % 9) - 4)),
      Math.min(94, Math.max(10, hsl.l + ((influence + index) % 11) - 5))
    );
  });
}

export function paletteSignature(colors) {
  return colors.join("-");
}

export function createPaletteRecord(colors, name = "Untitled Palette", source = "Generated") {
  return {
    id: crypto.randomUUID(),
    name,
    source,
    colors,
    createdAt: Date.now()
  };
}

export function exportPalette(colors, format) {
  const names = colors.map((_, index) => `palette-${index + 1}`);
  if (format === "Tailwind config") {
    return `theme: {\n  extend: {\n    colors: {\n${colors
      .map((color, index) => `      '${names[index]}': '${color}',`)
      .join("\n")}\n    }\n  }\n}`;
  }
  if (format === "SCSS variables") {
    return colors.map((color, index) => `$${names[index]}: ${color};`).join("\n");
  }
  if (format === "JSON") {
    return JSON.stringify(Object.fromEntries(colors.map((color, index) => [names[index], color])), null, 2);
  }
  if (format === "Figma tokens") {
    return JSON.stringify(
      Object.fromEntries(colors.map((color, index) => [names[index], { value: color, type: "color" }])),
      null,
      2
    );
  }
  return `:root {\n${colors.map((color, index) => `  --${names[index]}: ${color};`).join("\n")}\n}`;
}
