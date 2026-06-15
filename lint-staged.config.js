export default {
  "*.{ts,tsx}": () => "tsc --noEmit --skipLibCheck",
  "*.{json,md,css,html}": "prettier --write",
};
