/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",   // ← 确保包含 .tsx
  ],
  safelist: [
    "text-[var(--crt-text)]",
    "text-[var(--crt-accent)]",
    "text-[var(--crt-dim)]",
    "bg-[var(--crt-bg)]",
    "bg-[var(--crt-panel)]",
    "border-[var(--crt-border)]",
    "border-[var(--crt-border-strong)]",
    "shadow-[0_0_12px_var(--crt-accent)]",
  ],
  theme: { extend: {} },
  plugins: [],
};