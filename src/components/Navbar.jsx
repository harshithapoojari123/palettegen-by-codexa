import { ArrowUpRight, Linkedin, Moon, Sparkles, Sun } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

export default function Navbar({ codexaUrl, darkMode, linkedinUrl, onToggleDarkMode }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed left-0 right-0 top-0 z-50 px-4 py-4 sm:px-6"
    >
      <div className="glass mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-3">
        <motion.a
          href="#top"
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 420, damping: 20 }}
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-white shadow-glow dark:bg-white dark:text-slate-950">
            <Sparkles size={20} />
          </span>
          <span className="text-sm font-black tracking-[0.18em] text-slate-950 dark:text-white sm:text-base">
            PALETTEGEN <span className="hidden text-slate-500 dark:text-slate-400 sm:inline">BY CODEXA</span>
          </span>
        </motion.a>

        <div className="flex items-center gap-2">
          <motion.a
            href="#generator"
            className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white/60 dark:text-slate-200 dark:hover:bg-white/10 sm:inline-flex"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.94 }}
          >
            Generator
          </motion.a>
          <motion.a
            href={codexaUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white/60 dark:text-slate-200 dark:hover:bg-white/10 md:inline-flex"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.94 }}
          >
            Codexa
            <ArrowUpRight size={15} />
          </motion.a>
          <motion.a
            href={linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="grid h-10 w-10 place-items-center rounded-full bg-white/70 text-slate-800 shadow-sm transition hover:scale-105 dark:bg-white/10 dark:text-white"
            aria-label="Open Harshitha Poojari on LinkedIn"
            title="LinkedIn"
            whileHover={{ scale: 1.12, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Linkedin size={18} />
          </motion.a>
          <motion.button
            type="button"
            onClick={onToggleDarkMode}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/70 text-slate-800 shadow-sm transition hover:scale-105 dark:bg-white/10 dark:text-white"
            aria-label="Toggle dark mode"
            whileHover={{ scale: 1.12, rotate: 8 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 430, damping: 18 }}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
