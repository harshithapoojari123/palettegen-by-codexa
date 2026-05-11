import { ArrowUpRight, Heart, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

export default function Footer({ codexaUrl, linkedinUrl }) {
  return (
    <footer className="px-4 pb-10 pt-14 sm:px-6">
      <div className="glass mx-auto flex max-w-7xl flex-col justify-between gap-5 rounded-3xl p-6 sm:flex-row sm:items-center">
        <p className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          Built by Codexa Freelancing Agency <Heart size={16} className="fill-current" />
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <motion.a
            href={linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white/65 px-5 py-3 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:bg-white dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            whileHover={{ scale: 1.035, y: -2 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 430, damping: 20 }}
          >
            Connect on LinkedIn
            <Linkedin size={17} />
          </motion.a>
          <motion.a
            href={codexaUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
            whileHover={{ scale: 1.035, y: -2 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 430, damping: 20 }}
          >
            Need a startup website? Contact Codexa
            <ArrowUpRight size={17} />
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
