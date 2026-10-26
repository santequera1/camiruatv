// PM2 en el VPS compartido: siempre por nombre, nunca `pm2 restart all`.
module.exports = {
  apps: [
    {
      name: "camiruatv",
      script: "server.mjs",
      cwd: __dirname,
      env: { NODE_ENV: "production", PORT: "3242", SITE_URL: "https://camiruatv.com" },
    },
  ],
};
