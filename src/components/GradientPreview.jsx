import { Copy, Shuffle } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

export default function GradientPreview({
  angle,
  colors,
  gradientType,
  onAngleChange,
  onCopy,
  onShuffle,
  onTypeChange
}) {
  const gradient =
    gradientType === "radial"
      ? `radial-gradient(circle, ${colors.join(", ")})`
      : `linear-gradient(${angle}deg, ${colors.join(", ")})`;

  return (
    <section className="glass rounded-3xl p-5 sm:p-6">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Gradient Studio
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">Advanced launch gradients</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {["linear", "radial"].map((value) => (
            <motion.button
              key={value}
              type="button"
              onClick={() => onTypeChange(value)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                gradientType === value
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                  : "bg-white/60 text-slate-700 hover:bg-white dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
              }`}
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 430, damping: 19 }}
            >
              {value}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div
        className="checkerboard overflow-hidden rounded-2xl p-3"
        animate={{ scale: [0.99, 1.01, 1] }}
        whileHover={{ scale: 1.018 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        <motion.div
          key={gradient}
          className="h-56 rounded-xl shadow-inner sm:h-72"
          style={{ background: gradient }}
          initial={{ opacity: 0.68, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.42, ease: "easeOut" }}
        />
      </motion.div>

      <div className="mt-5 rounded-2xl bg-white/55 p-4 dark:bg-white/10">
        <div className="flex items-center justify-between">
          <span className="text-sm font-black text-slate-700 dark:text-slate-200">Angle</span>
          <span className="text-sm font-black text-slate-950 dark:text-white">{angle}deg</span>
        </div>
        <input
          type="range"
          min="0"
          max="360"
          value={angle}
          onChange={(event) => onAngleChange(Number(event.target.value))}
          disabled={gradientType === "radial"}
          className="mt-3 w-full accent-slate-950 disabled:opacity-35 dark:accent-white"
        />
        <code className="mt-4 block overflow-x-auto rounded-xl bg-slate-950 px-4 py-3 text-xs font-semibold text-white">
          {gradient}
        </code>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <motion.button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
          whileHover={{ scale: 1.035, y: -2 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 430, damping: 20 }}
        >
          <Copy size={17} />
          Copy Gradient CSS
        </motion.button>
        <motion.button
          type="button"
          onClick={onShuffle}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white/65 px-5 py-3 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:bg-white dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
          whileHover={{ scale: 1.035, y: -2 }}
          whileTap={{ scale: 0.94, rotate: -2 }}
          transition={{ type: "spring", stiffness: 430, damping: 20 }}
        >
          <Shuffle size={17} />
          Reverse Flow
        </motion.button>
      </div>
    </section>
  );
}
