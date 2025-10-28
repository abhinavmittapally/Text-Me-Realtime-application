import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import daisyui from "daisyui";

// ✅ Tailwind + DaisyUI embedded into Vite
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      config: {
        plugins: [daisyui],
        theme: {
          extend: {},
        },
      },
    }),
  ],
  build: {
    outDir: "dist"
  },
  
  daisyui:{
    themes:["light", "dark", "cupcake"]
  },
 
});
