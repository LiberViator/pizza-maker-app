/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	basePath: "/pizza-maker-app",
	images: {
		loader: "akamai",
		path: "",
	},
	assetPrefix: "./",
};

module.exports = nextConfig;
