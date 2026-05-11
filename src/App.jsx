import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Check,
  Code2,
  Command,
  Download,
  Eraser,
  FileJson,
  Globe2,
  History,
  Image as ImageIcon,
  Layers3,
  Link,
  Linkedin,
  Palette,
  Rocket,
  Save,
  Search,
  Shuffle,
  Sparkles,
  Upload,
  Wand2,
  X
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ColorCard from "./components/ColorCard.jsx";
import ColorDetailsModal from "./components/ColorDetailsModal.jsx";
import CommandMenu from "./components/CommandMenu.jsx";
import FavoritesModal from "./components/FavoritesModal.jsx";
import Footer from "./components/Footer.jsx";
import GradientPreview from "./components/GradientPreview.jsx";
import Hero from "./components/Hero.jsx";
import Navbar from "./components/Navbar.jsx";
import {
  INDUSTRY_PRESETS,
  MOODS,
  accessibilityScore,
  createPaletteRecord,
  exportPalette,
  generateBrandPalette,
  generateMoodPalette,
  paletteSignature
} from "./lib/palette.js";

const FAVORITES_KEY = "palettegen:favorites";
const HISTORY_KEY = "palettegen:history";
const THEME_KEY = "palettegen:theme";
const ANALYTICS_KEY = "palettegen:analytics";
const DEFAULT_PALETTE = ["#FF6B9D", "#FFD166", "#06D6A0", "#4CC9F0", "#2D1E8F"];
const CODEXA_URL = "https://codexa-agency.netlify.app/";
const LINKEDIN_URL = "https://www.linkedin.com/in/harshitha-poojari-110b78261/";
const EXPORT_FORMATS = ["CSS variables", "Tailwind config", "SCSS variables", "JSON", "Figma tokens"];
const paletteGridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    scale: [0.985, 1.012, 1],
    transition: {
      staggerChildren: 0.075,
      delayChildren: 0.05,
      scale: { type: "spring", stiffness: 260, damping: 18 }
    }
  }
};
const microInteraction = {
  whileHover: { scale: 1.035, y: -2 },
  whileTap: { scale: 0.94 },
  transition: { type: "spring", stiffness: 430, damping: 20 }
};

function parseSharedPalette() {
  const params = new URLSearchParams(window.location.search);
  const shared = params.get("palette");
  if (!shared) return null;
  const colors = shared
    .split("-")
    .map((color) => `#${color.replace(/[^a-fA-F0-9]/g, "").slice(0, 6).toUpperCase()}`)
    .filter((color) => /^#[A-F0-9]{6}$/.test(color));
  return colors.length === 5 ? colors : null;
}

function readStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function averageBucket(hexColors) {
  const top = Object.entries(hexColors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([color]) => color);
  return top.length === 5 ? top : DEFAULT_PALETTE;
}

function extractPaletteFromFile(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 160;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(image, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;
      const buckets = {};

      for (let index = 0; index < data.length; index += 24) {
        const alpha = data[index + 3];
        if (alpha < 160) continue;
        const r = Math.round(data[index] / 32) * 32;
        const g = Math.round(data[index + 1] / 32) * 32;
        const b = Math.round(data[index + 2] / 32) * 32;
        const hex = `#${[r, g, b]
          .map((value) => Math.min(255, value).toString(16).padStart(2, "0").toUpperCase())
          .join("")}`;
        buckets[hex] = (buckets[hex] || 0) + 1;
      }

      URL.revokeObjectURL(image.src);
      resolve(averageBucket(buckets));
    };
    image.onerror = reject;
    image.src = URL.createObjectURL(file);
  });
}

export default function App() {
  const [palette, setPalette] = useState(() => parseSharedPalette() || DEFAULT_PALETTE);
  const [locked, setLocked] = useState([false, false, false, false, false]);
  const [favorites, setFavorites] = useState(() => readStorage(FAVORITES_KEY, []));
  const [history, setHistory] = useState(() => readStorage(HISTORY_KEY, []));
  const [analytics, setAnalytics] = useState(() =>
    readStorage(ANALYTICS_KEY, { generated: 0, downloaded: 0 })
  );
  const [copiedColor, setCopiedColor] = useState(null);
  const [toast, setToast] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem(THEME_KEY) === "dark");
  const [mood, setMood] = useState("Luxury");
  const [brandName, setBrandName] = useState("Codexa");
  const [industry, setIndustry] = useState("SaaS");
  const [exportFormat, setExportFormat] = useState("CSS variables");
  const [historySearch, setHistorySearch] = useState("");
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [extracting, setExtracting] = useState(false);
  const [gradientType, setGradientType] = useState("linear");
  const [gradientAngle, setGradientAngle] = useState(135);

  const score = accessibilityScore(palette);
  const gradientCss = useMemo(
    () =>
      gradientType === "radial"
        ? `background: radial-gradient(circle, ${palette.join(", ")});`
        : `background: linear-gradient(${gradientAngle}deg, ${palette.join(", ")});`,
    [gradientAngle, gradientType, palette]
  );

  const showToast = useCallback((message) => {
    setToast(message);
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToast(null), 2400);
  }, []);

  const copyText = useCallback(
    async (text, message) => {
      await navigator.clipboard.writeText(text);
      showToast(message);
    },
    [showToast]
  );

  const pushHistory = useCallback((colors, source) => {
    setHistory((current) => {
      const record = createPaletteRecord(colors, `${source} palette`, source);
      const withoutDuplicate = current.filter((item) => paletteSignature(item.colors) !== paletteSignature(colors));
      return [record, ...withoutDuplicate].slice(0, 18);
    });
  }, []);

  const applyPalette = useCallback(
    (colors, source = "Generated") => {
      setPalette(colors);
      pushHistory(colors, source);
    },
    [pushHistory]
  );

  const generatePalette = useCallback(() => {
    setLoading(true);
    window.setTimeout(() => {
      setPalette((current) => {
        const next = generateMoodPalette(mood, locked, current);
        pushHistory(next, mood);
        return next;
      });
      setAnalytics((current) => ({ ...current, generated: current.generated + 1 }));
      setLoading(false);
      showToast(`${mood} palette generated`);
      document.getElementById("generator")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 420);
  }, [locked, mood, pushHistory, showToast]);

  const generateBrand = useCallback(() => {
    const next = generateBrandPalette(brandName || "Brand", industry);
    applyPalette(next, `${industry} brand`);
    setAnalytics((current) => ({ ...current, generated: current.generated + 1 }));
    showToast(`${industry} brand palette ready`);
  }, [applyPalette, brandName, industry, showToast]);

  const saveFavorite = useCallback(() => {
    const signature = paletteSignature(palette);
    setFavorites((current) => {
      const withoutDuplicate = current.filter((item) => paletteSignature(item.colors) !== signature);
      return [createPaletteRecord(palette, `${mood} favorite`, "Favorite"), ...withoutDuplicate].slice(0, 24);
    });
    showToast("Palette saved to favorites");
  }, [mood, palette, showToast]);

  const exportCurrentPalette = useCallback(() => {
    copyText(exportPalette(palette, exportFormat), `${exportFormat} copied`);
  }, [copyText, exportFormat, palette]);

  const sharePalette = useCallback(() => {
    const query = palette.map((color) => color.replace("#", "")).join("-");
    const url = `${window.location.origin}${window.location.pathname}?palette=${query}`;
    copyText(url, "Share link copied");
    window.history.replaceState(null, "", `?palette=${query}`);
  }, [copyText, palette]);

  const downloadPng = useCallback(() => {
    const canvas = document.createElement("canvas");
    const width = 1600;
    const height = 900;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const stripeWidth = width / palette.length;

    palette.forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.fillRect(index * stripeWidth, 0, stripeWidth, height);
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(index * stripeWidth, height - 130, stripeWidth, 130);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "700 42px Arial";
      ctx.fillText(color, index * stripeWidth + 36, height - 54);
    });

    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.font = "800 34px Arial";
    ctx.fillText("PaletteGen by Codexa", 36, 62);

    const link = document.createElement("a");
    link.download = `palettegen-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setAnalytics((current) => ({ ...current, downloaded: current.downloaded + 1 }));
    showToast("PNG downloaded");
  }, [palette, showToast]);

  const handleImageUpload = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      setExtracting(true);
      try {
        const colors = await extractPaletteFromFile(file);
        applyPalette(colors, "Image");
        showToast("Dominant colors extracted");
      } catch {
        showToast("Image extraction failed");
      } finally {
        setExtracting(false);
        event.target.value = "";
      }
    },
    [applyPalette, showToast]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem(THEME_KEY, darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem(HISTORY_KEY, JSON.stringify(history)), [history]);
  useEffect(() => localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics)), [analytics]);

  useEffect(() => {
    const onKeyDown = (event) => {
      const target = event.target;
      const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName);
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
      if (!typing && event.code === "Space") {
        event.preventDefault();
        generatePalette();
      }
      if (event.key === "Escape") {
        setCommandOpen(false);
        setFavoritesOpen(false);
        setSelectedColor(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [generatePalette]);

  const filteredHistory = history.filter((item) =>
    `${item.name} ${item.source} ${item.colors.join(" ")}`.toLowerCase().includes(historySearch.toLowerCase())
  );
  const paletteKey = paletteSignature(palette);

  const controls = [
    { label: "Generate New Palette", icon: Shuffle, onClick: generatePalette, primary: true },
    { label: "Export Format", icon: Code2, onClick: exportCurrentPalette },
    { label: "Download PNG", icon: Download, onClick: downloadPng },
    { label: "Save to Favorites", icon: Save, onClick: saveFavorite },
    { label: "Share Link", icon: Link, onClick: sharePalette }
  ];

  return (
    <div className="aurora noise relative min-h-screen overflow-hidden text-slate-950 dark:text-white">
      <motion.div
        className="motion-blob motion-blob-one"
        animate={{ x: [0, 74, 18, 0], y: [0, -36, 44, 0], scale: [1, 1.16, 0.94, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="motion-blob motion-blob-two"
        animate={{ x: [0, -68, -18, 0], y: [0, 42, -32, 0], scale: [1, 0.9, 1.14, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="motion-blob motion-blob-three"
        animate={{ x: [0, -52, 66, 0], y: [0, -38, 28, 0], scale: [1, 1.1, 0.92, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <Navbar
        codexaUrl={CODEXA_URL}
        darkMode={darkMode}
        linkedinUrl={LINKEDIN_URL}
        onToggleDarkMode={() => setDarkMode((value) => !value)}
      />
      <Hero codexaUrl={CODEXA_URL} onGenerate={generatePalette} />

      <main id="generator" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"
        >
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              <Palette size={17} />
              Palette Studio
            </p>
            <h2 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-slate-950 dark:text-white sm:text-5xl">
              Five colors, infinite brand directions.
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {controls.map(({ label, icon: Icon, onClick, primary }) => (
              <motion.button
                key={label}
                type="button"
                onClick={onClick}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold transition hover:-translate-y-0.5 ${
                  primary
                    ? "bg-slate-950 text-white shadow-glow dark:bg-white dark:text-slate-950"
                    : "bg-white/65 text-slate-800 hover:bg-white dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                }`}
                {...microInteraction}
              >
                <Icon size={17} />
                {label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <section className="mb-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr_0.8fr]">
          <div className="glass rounded-3xl p-5">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Smart Mood
            </p>
            <select
              value={mood}
              onChange={(event) => setMood(event.target.value)}
              className="mt-4 w-full rounded-2xl border border-white/40 bg-white/70 px-4 py-3 font-bold text-slate-900 outline-none dark:border-white/10 dark:bg-white/10 dark:text-white"
            >
              {Object.keys(MOODS).map((value) => (
                <option key={value} className="bg-white text-slate-900">
                  {value}
                </option>
              ))}
            </select>
            <motion.button
              type="button"
              onClick={generatePalette}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white dark:bg-white dark:text-slate-950"
              {...microInteraction}
            >
              <Wand2 size={17} />
              Generate by Mood
            </motion.button>
          </div>

          <div className="glass rounded-3xl p-5">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              AI Brand Palette Generator
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_0.8fr_auto]">
              <input
                value={brandName}
                onChange={(event) => setBrandName(event.target.value)}
                placeholder="Brand name"
                className="rounded-2xl border border-white/40 bg-white/70 px-4 py-3 font-bold text-slate-900 outline-none dark:border-white/10 dark:bg-white/10 dark:text-white"
              />
              <select
                value={industry}
                onChange={(event) => setIndustry(event.target.value)}
                className="rounded-2xl border border-white/40 bg-white/70 px-4 py-3 font-bold text-slate-900 outline-none dark:border-white/10 dark:bg-white/10 dark:text-white"
              >
                {Object.keys(INDUSTRY_PRESETS).map((value) => (
                  <option key={value} className="bg-white text-slate-900">
                    {value}
                  </option>
                ))}
              </select>
              <motion.button
                type="button"
                onClick={generateBrand}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white dark:bg-white dark:text-slate-950"
                {...microInteraction}
              >
                <Sparkles size={17} />
                Suggest
              </motion.button>
            </div>
          </div>

          <div className="glass rounded-3xl p-5">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Accessibility
            </p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-5xl font-black text-slate-950 dark:text-white">{score}</p>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">WCAG readiness score</p>
              </div>
              <span
                className={`rounded-full px-3 py-2 text-xs font-black ${
                  score >= 80
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                }`}
              >
                {score >= 80 ? "Accessible" : "Needs Review"}
              </span>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <motion.div
                key={index}
                className="glass h-96 animate-pulse rounded-2xl bg-white/30 dark:bg-white/10"
                initial={{ opacity: 0, y: 22, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.08, type: "spring", stiffness: 260, damping: 22 }}
              />
            ))}
          </div>
        ) : (
          <motion.div
            key={paletteKey}
            variants={paletteGridVariants}
            initial="hidden"
            animate="show"
            className="grid gap-4 md:grid-cols-5"
          >
            {palette.map((color, index) => (
              <ColorCard
                key={`${color}-${index}`}
                color={color}
                index={index}
                locked={locked[index]}
                copied={copiedColor === color}
                onOpenDetails={() => setSelectedColor(color)}
                onCopy={() => {
                  setCopiedColor(color);
                  copyText(color, `${color} copied`);
                  window.setTimeout(() => setCopiedColor(null), 1400);
                }}
                onToggleLock={() =>
                  setLocked((current) => current.map((value, lockIndex) => (lockIndex === index ? !value : value)))
                }
              />
            ))}
          </motion.div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <GradientPreview
            angle={gradientAngle}
            colors={palette}
            gradientType={gradientType}
            onAngleChange={setGradientAngle}
            onCopy={() => copyText(gradientCss, "Gradient CSS copied")}
            onShuffle={() => setPalette((current) => [...current].reverse())}
            onTypeChange={setGradientType}
          />

          <section className="glass rounded-3xl p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  <FileJson size={16} />
                  Palette Formats
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">Export center</h2>
              </div>
            </div>
            <select
              value={exportFormat}
              onChange={(event) => setExportFormat(event.target.value)}
              className="w-full rounded-2xl border border-white/40 bg-white/70 px-4 py-3 font-bold text-slate-900 outline-none dark:border-white/10 dark:bg-white/10 dark:text-white"
            >
              {EXPORT_FORMATS.map((format) => (
                <option key={format} className="bg-white text-slate-900">
                  {format}
                </option>
              ))}
            </select>
            <pre className="mt-4 max-h-60 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs font-semibold text-white">
              {exportPalette(palette, exportFormat)}
            </pre>
            <motion.button
              type="button"
              onClick={exportCurrentPalette}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white dark:bg-white dark:text-slate-950"
              {...microInteraction}
            >
              <Code2 size={17} />
              Copy {exportFormat}
            </motion.button>
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="glass rounded-3xl p-5 sm:p-6">
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              <ImageIcon size={16} />
              Image Color Extraction
            </p>
            <motion.label
              className="mt-5 flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300/80 bg-white/40 p-8 text-center transition hover:bg-white/65 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15"
              whileHover={{ scale: 1.018, y: -4 }}
              whileTap={{ scale: 0.985 }}
              transition={{ type: "spring", stiffness: 330, damping: 22 }}
            >
              <Upload size={30} className="text-slate-500 dark:text-slate-300" />
              <span className="mt-4 text-lg font-black text-slate-950 dark:text-white">
                {extracting ? "Extracting dominant colors..." : "Upload a brand image"}
              </span>
              <span className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                No upload yet. Drop in a logo, product shot, or moodboard image.
              </span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </motion.label>
          </section>

          <section className="glass rounded-3xl p-5 sm:p-6">
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  <History size={16} />
                  Palette History
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">Recently generated</h2>
              </div>
              <motion.button
                type="button"
                onClick={() => {
                  setHistory([]);
                  showToast("History cleared");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/65 px-4 py-2 text-sm font-bold text-slate-800 dark:bg-white/10 dark:text-white"
                {...microInteraction}
              >
                <Eraser size={16} />
                Clear
              </motion.button>
            </div>
            <div className="mb-4 flex items-center gap-2 rounded-2xl bg-white/55 px-4 py-3 dark:bg-white/10">
              <Search size={17} className="text-slate-500" />
              <input
                value={historySearch}
                onChange={(event) => setHistorySearch(event.target.value)}
                placeholder="Search history..."
                className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
              />
            </div>
            <div className="space-y-3">
              {filteredHistory.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300/80 p-8 text-center text-sm font-semibold text-slate-500 dark:border-white/10 dark:text-slate-400">
                  No history yet. Generate, import, or extract a palette to start your timeline.
                </div>
              ) : (
                filteredHistory.slice(0, 6).map((item) => (
                  <motion.button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setPalette(item.colors);
                      showToast("History palette loaded");
                    }}
                    className="group flex w-full items-center gap-3 rounded-2xl bg-white/55 p-2 transition hover:-translate-y-0.5 hover:bg-white dark:bg-white/10 dark:hover:bg-white/15"
                    whileHover={{ scale: 1.012, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 360, damping: 22 }}
                  >
                    <span className="grid h-14 flex-1 grid-cols-5 overflow-hidden rounded-xl">
                      {item.colors.map((color) => (
                        <span key={`${item.id}-${color}`} style={{ backgroundColor: color }} />
                      ))}
                    </span>
                    <span className="hidden min-w-28 text-left text-xs font-black text-slate-500 dark:text-slate-400 sm:block">
                      {item.source}
                    </span>
                  </motion.button>
                ))
              )}
            </div>
          </section>
        </div>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["Palettes generated", analytics.generated, BarChart3],
            ["Favorites saved", favorites.length, Layers3],
            ["Palettes downloaded", analytics.downloaded, Download]
          ].map(([label, value, Icon]) => (
            <motion.div
              key={label}
              className="glass rounded-3xl p-5"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, scale: 1.018 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ type: "spring", stiffness: 290, damping: 24 }}
            >
              <Icon size={22} className="text-slate-500 dark:text-slate-300" />
              <p className="mt-5 text-4xl font-black text-slate-950 dark:text-white">{value}</p>
              <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">{label}</p>
            </motion.div>
          ))}
        </section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          className="glass mt-6 overflow-hidden rounded-3xl p-6 sm:p-8"
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                <Rocket size={17} />
                Codexa Freelancing Agency
              </p>
              <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-slate-950 dark:text-white sm:text-5xl">
                Need a premium startup website? Work with Codexa.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 dark:text-slate-300 sm:text-lg">
                PaletteGen is a taste of Codexa's product-focused web design: clean UI, smooth interactions,
                responsive builds, and launch-ready brand systems.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <motion.a
                  href={CODEXA_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
                  {...microInteraction}
                >
                  View Codexa Website
                  <Globe2 size={18} />
                </motion.a>
                <motion.a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white/65 px-6 py-3 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:bg-white dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                  {...microInteraction}
                >
                  Connect with Harshitha
                  <Linkedin size={18} />
                </motion.a>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                ["Premium UI/UX", "Awwwards-inspired interfaces with conversion-ready polish."],
                ["Startup Websites", "Fast, responsive builds for founders, agencies, and creators."],
                ["Brand Systems", "Palettes, typography, and visual direction that feel launch-ready."]
              ].map(([title, description]) => (
                <motion.div
                  key={title}
                  className="rounded-2xl bg-white/55 p-5 dark:bg-white/10"
                  whileHover={{ scale: 1.025, x: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                >
                  <p className="text-lg font-black text-slate-950 dark:text-white">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>

      <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
        <motion.button
          type="button"
          onClick={() => setCommandOpen(true)}
          className="grid h-12 w-12 place-items-center rounded-full bg-slate-950 text-white shadow-glow transition hover:-translate-y-1 dark:bg-white dark:text-slate-950"
          aria-label="Open command menu"
          whileHover={{ scale: 1.12, y: -5, rotate: 4 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 430, damping: 18 }}
        >
          <Command size={20} />
        </motion.button>
        <motion.button
          type="button"
          onClick={() => setFavoritesOpen(true)}
          className="grid h-12 w-12 place-items-center rounded-full bg-white/75 text-slate-950 shadow-soft backdrop-blur transition hover:-translate-y-1 dark:bg-white/10 dark:text-white"
          aria-label="Open favorites"
          whileHover={{ scale: 1.12, y: -5, rotate: -4 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 430, damping: 18 }}
        >
          <Layers3 size={20} />
        </motion.button>
      </div>

      <Footer codexaUrl={CODEXA_URL} linkedinUrl={LINKEDIN_URL} />

      <CommandMenu
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        onDownload={downloadPng}
        onGenerate={generatePalette}
        onOpenFavorites={() => setFavoritesOpen(true)}
        onSave={saveFavorite}
      />

      {favoritesOpen && (
        <FavoritesModal
          favorites={favorites}
          onClose={() => setFavoritesOpen(false)}
          onCopy={copyText}
          onDelete={(id) => {
            setFavorites((current) => current.filter((favorite) => favorite.id !== id));
            showToast("Favorite deleted");
          }}
          onLoad={(colors) => {
            setPalette(colors);
            setFavoritesOpen(false);
            showToast("Favorite palette loaded");
          }}
          onRename={(id, name) =>
            setFavorites((current) => current.map((favorite) => (favorite.id === id ? { ...favorite, name } : favorite)))
          }
        />
      )}

      <ColorDetailsModal color={selectedColor} onClose={() => setSelectedColor(null)} onCopy={copyText} />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: [0.96, 1.04, 1] }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
            className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-2xl dark:bg-white dark:text-slate-950"
          >
            <Check size={18} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
