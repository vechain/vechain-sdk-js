/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_TELEMETRY_DISABLED: "1"
    },
    webpack: function (config, options) {
        if(!options.isServer) {
            config.resolve.fallback = { ...config.resolve.fallback, net: false, tls: false };
        }
        return config;
    },
};

export default nextConfig;
