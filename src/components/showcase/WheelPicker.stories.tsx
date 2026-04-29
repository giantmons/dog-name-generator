import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import WheelPicker from "./WheelPicker";
import type { Pet } from "@/types/pet";

const NAMES = [
  "Ace",
  "Bella",
  "Biscuit",
  "Buddy",
  "Cheddar",
  "Cleo",
  "Clover",
  "Coconut",
  "Cookie",
  "Daisy",
  "Diesel",
  "Duke",
  "Ember",
  "Finn",
  "Ghost",
  "Gizmo",
  "Hazel",
  "Indie",
  "Jazz",
  "Koda",
  "Lemon",
  "Leo",
  "Loki",
  "Luna",
  "Maple",
  "Marley",
  "Max",
  "Mochi",
  "Moose",
  "Murphy",
  "Nova",
  "Olive",
  "Oreo",
  "Panda",
  "Peanut",
  "Penny",
  "Pepper",
  "Pickle",
  "Piper",
  "Pretzel",
  "Rex",
  "Rocky",
  "Rosie",
  "Roxy",
  "Ruby",
  "Sage",
  "Scout",
  "Shadow",
  "Simba",
  "Sky",
  "Stella",
  "Storm",
  "Sunny",
  "Tater",
  "Toast",
  "Toby",
  "Tucker",
  "Uno",
  "Waffles",
  "Willow",
  "Zeus",
];

function makePets(count: number): Pet[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `pet-${i}`,
    title: NAMES[i % NAMES.length] ?? `Name ${i}`,
    definition: "",
    gender: i % 2 === 0 ? ["M"] : ["F"],
    categories: [],
  }));
}

type WheelPickerArgs = React.ComponentProps<typeof WheelPicker>;

const Interactive = (args: WheelPickerArgs) => {
  const [activeIndex, setActiveIndex] = useState(args.activeIndex ?? 0);
  return (
    <div className="w-80 mx-auto py-8">
      <WheelPicker
        {...args}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
    </div>
  );
};

const meta = {
  title: "Showcase/WheelPicker",
  component: WheelPicker,
  tags: ["autodocs"],
  argTypes: {
    chevronsPosition: { control: "radio", options: ["left", "right"] },
    activeIndex: { control: { type: "number", min: 0 } },
    names: { control: false },
    setActiveIndex: { control: false },
    onActiveClick: { control: false },
  },
  args: {
    onActiveClick: fn(),
  },
  render: Interactive,
} satisfies Meta<typeof WheelPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    names: [],
    activeIndex: 0,
    chevronsPosition: "right",
  },
};

export const FewNames: Story = {
  args: {
    names: makePets(4),
    activeIndex: 0,
    chevronsPosition: "right",
  },
};

export const ManyNames: Story = {
  args: {
    names: makePets(40),
    activeIndex: 0,
    chevronsPosition: "right",
  },
};

export const ChevronsLeft: Story = {
  args: {
    names: makePets(8),
    activeIndex: 0,
    chevronsPosition: "left",
  },
};

export const ChevronsRight: Story = {
  args: {
    names: makePets(8),
    activeIndex: 0,
    chevronsPosition: "right",
  },
};

export const MiddleSelected: Story = {
  args: {
    names: makePets(40),
    activeIndex: 20,
    chevronsPosition: "right",
  },
};
