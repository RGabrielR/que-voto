/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["votaciones.hcdn.gob.ar"],
  },
};

module.exports = nextConfig;
