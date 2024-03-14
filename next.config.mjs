/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    async headers() {
        return [
            {
                // matching all API routes
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "https://www.evelynn.life" }, // replace this your actual origin
                    { key: "Access-Control-Allow-Origin", value: "https://evelynn-life.vercel.app" }, // replace this your actual origin
                    { key: "Access-Control-Allow-Origin", value: "http://localhost:3000" }, // replace this your actual origin
                ]
            }
        ]
    }
};

export default nextConfig;
