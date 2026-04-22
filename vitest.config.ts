import path from "node:path";
import { defineConfig } from "vitest/config";

const coverageIncludes = [
  "src/lib/api.ts",
  "src/lib/auth.ts",
  "src/proxy.ts",
  "src/components/shared/LoginForm.tsx",
  "src/components/shared/RegisterForm.tsx",
  "src/app/events/page.tsx",
];

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    css: false,
    testTimeout: 15000,
    fileParallelism: false,
    coverage: {
      provider: "v8",
      reporter: ["text"],
      include: coverageIncludes,
      thresholds: {
        lines: 100,
        branches: 100,
        functions: 100,
        statements: 100,
      },
    },
  },
});
