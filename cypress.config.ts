import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      on("file:preprocessor", createBundler({
        plugins: [createEsbuildPlugin(config)],
      }));

      return config;
    },
    specPattern: "cypress/e2e/features/**/*.feature", // Path for feature files
  },
  env: {
    AUTH0_USERNAME: process.env.CYPRESS_AUTH0_USERNAME,
    AUTH0_PASSWORD: process.env.CYPRESS_AUTH0_PASSWORD,
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
  },
});
