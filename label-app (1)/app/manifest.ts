import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "App de Etiqueta",
    short_name: "EtiquetaApp",
    description: "Gerador de etiquetas para kits com foto, código de barras e marca.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon.png", // Referencia o ícone gerado por app/icon.tsx
        sizes: "32x32", // Tamanho do ícone gerado
        type: "image/png",
      },
      {
        src: "/icon-192x192.png", // Exemplo de ícone maior para PWA (você pode gerar mais tamanhos)
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png", // Exemplo de ícone ainda maior para PWA
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
