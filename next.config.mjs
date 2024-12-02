/** @type {import('next').NextConfig} */


const nextConfig = {
    reactStrictMode:true,
    images: {
        remotePatterns: [
            {
                protocol:"https",
                hostname: "images.unsplash.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol:"https",
                hostname: "plus.unsplash.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol:"https",
                hostname: "architeck.peacefulqode.co.in",
                port: "",
                pathname: "/**",
            },
            {
                protocol:"https",
                hostname: "scontent.fdad3-5.fna.fbcdn.net",
                port: "",
                pathname: "/**",
            },
            {
                protocol:"https",
                hostname: "scontent.fdad3-4.fna.fbcdn.net",
                port: "",
                pathname: "/**",
            },
            {
                protocol:"https",
                hostname: "scontent.fdad3-1.fna.fbcdn.net",
                port: "",
                pathname: "/**",
            },
            {
                protocol:"https",
                hostname: "media.istockphoto.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol:"https",
                hostname: "images.pexels.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol:"http",
                hostname: "servicecompany.test",
                port: "",
                pathname: "/**",
            },
            {
                protocol:"http",
                hostname: "2.gravatar.com",
                port: "",
                pathname: "/**",
            },    
            {
                protocol:"https",
                hostname:"secure.gravatar.com",
                port: "",
                pathname: "/**",
            },  
            {
                protocol:"https",
                hostname:"ido-architects.io",
                port: "",
                pathname: "/**",
            },
            {
                protocol:"https",
                hostname:"ido-architects.io.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol:"https",
                hostname:"unsplash.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol:"https",
                hostname:"res.cloudinary.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol:"https",
                hostname:"www.palmarchi.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol:"https",
                hostname:"cdn.stocksnap.io",
                port: "",
                pathname: "/**",
            },
            
            
        ]
    }
};

export default nextConfig;
