import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Beautiful, responsive 404 / Not Found page
// - Tailwind CSS utility classes (no external UI libs required)
// - Framer Motion for subtle entrance animations
// - Default export React component

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-sky-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl w-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-2xl p-8 sm:p-12 flex gap-8 items-center"
      >
        {/* Illustration + number */}
        <div className="flex-shrink-0 flex items-center justify-center w-40 h-40 rounded-xl bg-gradient-to-br from-rose-100 to-amber-100 dark:from-rose-900 dark:to-amber-800">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: "anticipate" }}
            className="text-center"
          >
            <h1 className="text-5xl font-extrabold leading-none text-rose-600 dark:text-rose-300">
              404
            </h1>
            <svg
              viewBox="0 0 120 80"
              className="w-20 h-14 mx-auto mt-2"
              aria-hidden
            >
              <g fill="none" strokeWidth="2">
                <motion.path
                  d="M8 40 C30 8, 90 8, 112 40"
                  stroke="#FB7185"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2 }}
                />
                <motion.path
                  d="M8 50 C30 82, 90 82, 112 50"
                  stroke="#FDBA74"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.15 }}
                />
              </g>
            </svg>
          </motion.div>
        </div>

        {/* Text & actions */}
        <div className="flex-1">
          <motion.h2
            initial={{ x: -8, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100"
          >
            Oops — we can’t find that page
          </motion.h2>

          <motion.p
            initial={{ x: -8, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-4 text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed"
          >
            The page you’re looking for might have been removed, had its name
            changed, or is temporarily unavailable. Try returning home or using
            the navigation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-6 flex flex-wrap gap-3"
          >
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 rounded-lg bg-rose-600 hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 text-white px-5 py-2 text-sm font-semibold shadow-md"
            >
              Take me home
            </button>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Go back
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-8 text-xs text-slate-500 dark:text-slate-400"
          >
            Tip: If you typed a URL, double-check that it’s correct.
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
