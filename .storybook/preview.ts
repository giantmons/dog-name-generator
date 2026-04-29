import type { Preview } from "@storybook/react-vite";
import "../src/index.css";

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    backgrounds: {
      default: "bg",
      values: [{ name: "bg", value: "#f9f8f5" }],
    },
    a11y: { test: "todo" },
  },
};

export default preview;
