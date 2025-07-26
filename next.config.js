module.exports = {
  reactStrictMode: true,
};

// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  // konfigurasi tambahan Next.js jika ada
});
