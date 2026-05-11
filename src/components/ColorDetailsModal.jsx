import { AnimatePresence, motion } from "framer-motion";
import { Copy, X } from "lucide-react";
import React from "react";
import { hexToRgb, nearestColorName, rgbToCmyk, rgbToHsl } from "../lib/palette.js";

export default function ColorDetailsModal({ color, onClose, onCopy }) {
  if (!color) return null;

  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb);
  const cmyk = rgbToCmyk(rgb);
  const rows = [
    ["HEX", color],
    ["RGB", `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`],
    ["HSL", `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`],
    ["CMYK", `${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`],
    ["Nearest", nearestColorName(color)]
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/50 px-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.96, y: 16, filter: "blur(6px)" }}
          transition={{ type: "spring", stiffness: 360, damping: 26 }}
          className="glass w-full max-w-lg overflow-hidden rounded-3xl"
        >
          <motion.div
            className="h-44"
            style={{ backgroundColor: color }}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          <div className="p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Color Details
                </p>
                <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{color}</h2>
              </div>
              <motion.button
                type="button"
                onClick={onClose}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/70 text-slate-700 dark:bg-white/10 dark:text-white"
                aria-label="Close color details"
                whileHover={{ scale: 1.1, rotate: 8 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={18} />
              </motion.button>
            </div>
            <div className="space-y-2">
              {rows.map(([label, value]) => (
                <motion.button
                  key={label}
                  type="button"
                  onClick={() => onCopy(value, `${label} copied`)}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl bg-white/55 px-4 py-3 text-left transition hover:bg-white dark:bg-white/10 dark:hover:bg-white/15"
                  whileHover={{ scale: 1.015, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 360, damping: 24 }}
                >
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {label}
                  </span>
                  <span className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                    {value}
                    <Copy size={15} />
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
