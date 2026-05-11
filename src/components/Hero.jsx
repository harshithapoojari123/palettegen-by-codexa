import { ArrowDown, ArrowUpRight, Sparkles, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

export default function Hero({ codexaUrl, onGenerate }) {
  return (
    <section id="top" className="relative flex min-h-[92vh] items-center px-4 pb-20 pt-32 sm:px-6">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/60 px-4 py-2 text-sm font-semibold text-slate-700 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
            <Sparkles size={16} />
            Professional color palette studio
          </div>
          <h1 className="text-4xl font-black leading-[0.98] text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
            PaletteGen by Codexa
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-700 dark:text-slate-300 sm:text-lg">
            Generate beautiful color palettes instantly for web & brand design
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <motion.button
              type="button"
              onClick={onGenerate}
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-glow transition hover:-translate-y-1 hover:shadow-2xl dark:bg-white dark:text-slate-950"
              whileHover={{ scale: 1.045, y: -4 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 420, damping: 18 }}
            >
              <Wand2 size={18} className="transition group-hover:rotate-12" />
              Generate Palette
            </motion.button>
            <motion.a
              href="#generator"
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-slate-300/70 bg-white/55 px-6 py-3.5 text-sm font-bold text-slate-900 backdrop-blur transition hover:-translate-y-1 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              whileHover={{ scale: 1.035, y: -4 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 18 }}
            >
              Explore Studio
              <ArrowDown size={17} />
            </motion.a>
            <motion.a
              href={codexaUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-slate-300/70 bg-white/55 px-6 py-3.5 text-sm font-bold text-slate-900 backdrop-blur transition hover:-translate-y-1 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              whileHover={{ scale: 1.035, y: -4 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 18 }}
            >
              Visit Codexa
              <ArrowUpRight size={17} />
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative min-h-[420px]"
        >
          <div className="absolute inset-0 rounded-[2rem] bg-white/20 blur-3xl dark:bg-indigo-400/10" />
          <div className="glass relative overflow-hidden rounded-[2rem] p-4">
            <div className="grid h-[420px] grid-cols-5 gap-3">
              {["#FF6B9D", "#FFD166", "#06D6A0", "#4CC9F0", "#2D1E8F"].map((color, index) => (
                <motion.div
                  key={color}
                  initial={{ y: 60 }}
                  animate={{ y: [0, index % 2 ? 18 : -18, 0] }}
                  transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut" }}
                  className="relative overflow-hidden rounded-2xl"
                  style={{ backgroundColor: color }}
                >
                  <div className="absolute inset-x-0 bottom-0 bg-black/20 p-3 text-xs font-black text-white">
                    {color}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
