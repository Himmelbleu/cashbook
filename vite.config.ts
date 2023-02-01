// node
import { resolve } from "path";

// vite
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
// element plus
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
// icons
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";

// unocss
import Unocss from "unocss/vite";
import { presetAttributify, presetUno } from "unocss";
import { rules, shortcuts } from "./unocss.config";
import transformerDirective from "@unocss/transformer-directives";

export default defineConfig({
  plugins: [
    vue(),
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
      imports: ["vue"],
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: "Icon"
        })
      ]
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          enabledCollections: ["ep"]
        })
      ],
      dirs: ["./src/components/**"]
    }),
    Icons({
      autoInstall: true
    })
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "src")
      }
    ]
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/vars.scss" as *;`
      }
    }
  }
});
