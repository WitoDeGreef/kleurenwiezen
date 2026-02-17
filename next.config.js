/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",

    reactStrictMode: true,
  
    // Add basePath and assetPrefix for GitHub Pages
    basePath: process.env.NODE_ENV === "production" ? "/kleurenwiezen" : '',
    assetPrefix: process.env.NODE_ENV === "production" ? "/kleurenwiezen/" : '',

    images: {
        unoptimized: true,
    },
};

module.exports = nextConfig;