import { defineConfig } from "vite";
import ViteShader from 'vite-plugin-glsl'

export default defineConfig({
    plugins:[ViteShader()]
})