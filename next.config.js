/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["votaciones.hcdn.gob.ar", "img.freepik.com", "pixabay.com"],
  },
};

module.exports = nextConfig;
