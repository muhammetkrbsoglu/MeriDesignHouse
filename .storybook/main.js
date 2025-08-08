

/** @type { import('@storybook/nextjs-vite').StorybookConfig } */
const config = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/nextjs-vite",
    "options": {}
  },
  viteFinal: async (config) => {
    const path = await import('path');
    return {
      ...config,
      resolve: {
        ...(config.resolve || {}),
        alias: {
          ...(config.resolve?.alias || {}),
          '@': path.resolve(process.cwd(), '.'),
        },
      },
    };
  },
  "staticDirs": [
    "..\\public"
  ]
};
export default config;