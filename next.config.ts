import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignorar erros de TypeScript durante o build
  typescript: {
    ignoreBuildErrors: true,
  },

  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
      {
        source: "/aluno/",
        destination: "/aluno/inicio",
        permanent: true,
      },
      {
        source: "/professor/",
        destination: "/professor/inicio",
        permanent: true,
      },
      {
        source: "/coordenador/",
        destination: "/coordenador/inicio",
        permanent: true,
      },
    ];
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  trailingSlash: false,
  output: "standalone",

  // "Hebreus 13:8 - O mesmo ontem, hoje e para todo o sempre."
};

export default nextConfig;
