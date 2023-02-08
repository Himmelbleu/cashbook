// vite
import { defineConfig } from "vite";

// plugins
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// auto import
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// unocss
import Unocss from "unocss/vite";
import { rules, shortcuts } from "./unocss.config";
import { presetAttributify, presetUno } from "unocss";
import transformerDirective from "@unocss/transformer-directives";

export default defineConfig({
  base: "/cashbook/",
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
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ["vue"]
    }),
    Components({
      dirs: ["./src/components/**", "./src/fragments/**"]
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
