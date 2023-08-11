/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true
    },
    images: {
        domains: [
            'cdn.pixabay.com'
        ]
    },
    output: 'standalone',
    env: {
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        API_URL: process.env.API_URL,
        ID_SERVER_URL: process.env.ID_SERVER_URL,
        NEXT_PUBLIC_NOTIFICATION_URL: process.env.NEXT_PUBLIC_NOTIFICATION_URL
    }
}

module.exports = nextConfig
