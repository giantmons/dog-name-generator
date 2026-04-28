import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect } from "vitest";
import { usePetStore } from "@/store/petStore";
import { resetStore } from "@/test/resetStore";
import GenderToggle from "./GenderToggle";

describe("GenderToggle", () => {
  resetStore();

  test("renders all three gender options", () => {
    render(<GenderToggle />);
    expect(screen.getByRole("button", { name: "Male" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Female" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Both" })).toBeInTheDocument();
  });

  test("Both is pressed by default", () => {
    render(<GenderToggle />);
    expect(screen.getByRole("button", { name: "Both" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Male" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "Female" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  test("clicking Male makes it pressed and stores the filter", async () => {
    const user = userEvent.setup();
    render(<GenderToggle />);

    await user.click(screen.getByRole("button", { name: "Male" }));

    expect(usePetStore.getState().genderFilter).toBe("M");
    expect(screen.getByRole("button", { name: "Male" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Both" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  test("clicking Female makes it pressed and stores the filter", async () => {
    const user = userEvent.setup();
    render(<GenderToggle />);

    await user.click(screen.getByRole("button", { name: "Female" }));

    expect(usePetStore.getState().genderFilter).toBe("F");
  });

  test("clicking the already-active option keeps it pressed", async () => {
    const user = userEvent.setup();
    render(<GenderToggle />);

    await user.click(screen.getByRole("button", { name: "Both" }));
    expect(usePetStore.getState().genderFilter).toBe("B");
  });

  test("the group has an accessible label", () => {
    render(<GenderToggle />);
    expect(
      screen.getByRole("group", { name: /filter by gender/i }),
    ).toBeInTheDocument();
  });
});
