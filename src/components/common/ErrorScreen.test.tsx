import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { usePetStore } from "@/store/petStore";
import { resetStore } from "@/test/resetStore";
import ErrorScreen from "./ErrorScreen";

describe("ErrorScreen", () => {
  resetStore();

  beforeEach(() => {
    usePetStore.setState({ status: "error" });
  });

  test("renders the heading", () => {
    render(<ErrorScreen />);
    expect(
      screen.getByRole("heading", { name: /something went wrong/i }),
    ).toBeInTheDocument();
  });

  test("renders an error message when the store has one", () => {
    usePetStore.setState({ error: "Network timeout" });
    render(<ErrorScreen />);
    expect(screen.getByText("Network timeout")).toBeInTheDocument();
  });

  test("does not render error paragraph when there is no error message", () => {
    usePetStore.setState({ error: null });
    render(<ErrorScreen />);
    expect(screen.queryByText(/network timeout/i)).not.toBeInTheDocument();
  });

  test("clicking Try again calls loadAll", async () => {
    const loadAll = vi.fn().mockResolvedValue(undefined);
    usePetStore.setState({ loadAll });

    const user = userEvent.setup();
    render(<ErrorScreen />);

    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(loadAll).toHaveBeenCalledOnce();
  });

  test("the root element has role=alert", () => {
    render(<ErrorScreen />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
