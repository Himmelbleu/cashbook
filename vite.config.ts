// vite
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import vueJsx from "@vitejs/plugin-vue-jsx";

// unocss
import Unocss from "unocss/vite";
import { presetAttributify, presetUno } from "unocss";
import { rules, shortcuts } from "./unocss.config";
import transformerDirective from "@unocss/transformer-directives";

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    Unocss({
      rules,
      shortcuts,
      transformers: [
        transformerDirective({
          applyVariable: ["--at-apply", "--uno-apply", "--uno"]
        })
      ],
      presets: [presetAttributify({}), presetUno()]
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "./src/vars.scss" as *;`
      }
    }
  }
});
