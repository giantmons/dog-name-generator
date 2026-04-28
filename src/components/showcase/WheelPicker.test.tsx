import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import WheelPicker from "./WheelPicker";
import type { Pet } from "@/types/pet";

function makePet(id: string, title: string): Pet {
  return { id, title, definition: "", gender: ["M"], categories: [] };
}

const NAMES: Pet[] = [
  makePet("1", "Alpha"),
  makePet("2", "Beta"),
  makePet("3", "Gamma"),
];

describe("WheelPicker", () => {
  test("renders empty-state message when names list is empty", () => {
    render(
      <WheelPicker
        names={[]}
        activeIndex={0}
        setActiveIndex={vi.fn()}
        onActiveClick={vi.fn()}
      />,
    );
    expect(
      screen.getByText(/no names match the current filters/i),
    ).toBeInTheDocument();
  });

  test("the active item has aria-selected=true", () => {
    render(
      <WheelPicker
        names={NAMES}
        activeIndex={1}
        setActiveIndex={vi.fn()}
        onActiveClick={vi.fn()}
      />,
    );
    const listbox = screen.getByRole("listbox", { name: /pet names/i });
    const options = within(listbox).getAllByRole("option");
    const active = options.find((o) => o.getAttribute("aria-selected") === "true");
    expect(active).toHaveTextContent("Beta");
  });

  test("non-active items have aria-selected=false", () => {
    render(
      <WheelPicker
        names={NAMES}
        activeIndex={0}
        setActiveIndex={vi.fn()}
        onActiveClick={vi.fn()}
      />,
    );
    const listbox = screen.getByRole("listbox", { name: /pet names/i });
    const options = within(listbox).getAllByRole("option");
    const inactive = options.filter((o) => o.getAttribute("aria-selected") === "false");
    expect(inactive.length).toBeGreaterThan(0);
  });

  test("clicking Next advances the index", async () => {
    const setActiveIndex = vi.fn();
    const user = userEvent.setup();
    render(
      <WheelPicker
        names={NAMES}
        activeIndex={0}
        setActiveIndex={setActiveIndex}
        onActiveClick={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /next name/i }));
    expect(setActiveIndex).toHaveBeenCalledWith(1);
  });

  test("clicking Previous decrements the index", async () => {
    const setActiveIndex = vi.fn();
    const user = userEvent.setup();
    render(
      <WheelPicker
        names={NAMES}
        activeIndex={1}
        setActiveIndex={setActiveIndex}
        onActiveClick={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /previous name/i }));
    expect(setActiveIndex).toHaveBeenCalledWith(0);
  });

  test("Previous button is disabled at index 0", () => {
    render(
      <WheelPicker
        names={NAMES}
        activeIndex={0}
        setActiveIndex={vi.fn()}
        onActiveClick={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /previous name/i })).toBeDisabled();
  });

  test("Next button is disabled at the last index", () => {
    render(
      <WheelPicker
        names={NAMES}
        activeIndex={NAMES.length - 1}
        setActiveIndex={vi.fn()}
        onActiveClick={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /next name/i })).toBeDisabled();
  });

  test("clicking the active item calls onActiveClick", async () => {
    const onActiveClick = vi.fn();
    const user = userEvent.setup();
    render(
      <WheelPicker
        names={NAMES}
        activeIndex={0}
        setActiveIndex={vi.fn()}
        onActiveClick={onActiveClick}
      />,
    );

    const listbox = screen.getByRole("listbox", { name: /pet names/i });
    const activeOption = within(listbox)
      .getAllByRole("option")
      .find((o) => o.getAttribute("aria-selected") === "true")!;

    await user.click(activeOption);
    expect(onActiveClick).toHaveBeenCalledOnce();
  });

  test("ArrowDown key on the listbox advances the index", async () => {
    const setActiveIndex = vi.fn();
    const user = userEvent.setup();
    render(
      <WheelPicker
        names={NAMES}
        activeIndex={0}
        setActiveIndex={setActiveIndex}
        onActiveClick={vi.fn()}
      />,
    );

    const listbox = screen.getByRole("listbox", { name: /pet names/i });
    await user.type(listbox, "{ArrowDown}");
    expect(setActiveIndex).toHaveBeenCalledWith(1);
  });

  test("ArrowUp key on the listbox decrements the index", async () => {
    const setActiveIndex = vi.fn();
    const user = userEvent.setup();
    render(
      <WheelPicker
        names={NAMES}
        activeIndex={2}
        setActiveIndex={setActiveIndex}
        onActiveClick={vi.fn()}
      />,
    );

    const listbox = screen.getByRole("listbox", { name: /pet names/i });
    await user.type(listbox, "{ArrowUp}");
    expect(setActiveIndex).toHaveBeenCalledWith(1);
  });

  test("Enter key on the listbox triggers onActiveClick", async () => {
    const onActiveClick = vi.fn();
    const user = userEvent.setup();
    render(
      <WheelPicker
        names={NAMES}
        activeIndex={0}
        setActiveIndex={vi.fn()}
        onActiveClick={onActiveClick}
      />,
    );

    const listbox = screen.getByRole("listbox", { name: /pet names/i });
    await user.type(listbox, "{Enter}");
    expect(onActiveClick).toHaveBeenCalledOnce();
  });
});
