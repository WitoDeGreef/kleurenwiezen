/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",

    reactStrictMode: true,
  
    // Add basePath
    basePath: process.env.NODE_ENV === "production" ? "/howyoudoin" : '',

    images: {
        unoptimized: true,
    },
};

module.exports = nextConfig;