import type { Meta, StoryObj } from "@storybook/react-vite";
import GenderIcon from "./GenderIcon";

const meta = {
  title: "Showcase/GenderIcon",
  component: GenderIcon,
  tags: ["autodocs"],
  argTypes: {
    gender: {
      control: "check",
      options: ["M", "F"],
      description: "Gender values to display icons for",
    },
  },
} satisfies Meta<typeof GenderIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Male: Story = {
  args: { gender: ["M"] },
};

export const Female: Story = {
  args: { gender: ["F"] },
};

export const Both: Story = {
  args: { gender: ["M", "F"] },
};

export const None: Story = {
  args: { gender: [] },
};
