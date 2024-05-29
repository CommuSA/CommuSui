// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 1234,
  },
  server: {
    port: 1234,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
