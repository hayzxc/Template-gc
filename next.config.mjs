/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        // Required: TypeScript 7 (tsgo) doesn't expose the compiler API Next.js
        // uses by default. This makes Next.js call the TypeScript CLI instead.
        useTypeScriptCli: true,
    },
};

export default nextConfig;
