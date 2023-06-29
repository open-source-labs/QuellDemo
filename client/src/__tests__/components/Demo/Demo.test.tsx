
import { fireEvent, getByTestId, render, screen } from "@testing-library/react";
import Demo from "../../../components/Demo/Demo";

jest.mock("../../../components/Graph/Graph", () => ({
  Graph: () => <div></div>,
}));
jest.mock("../../../components/HitMiss/HitMiss", () => ({
  HitMiss: () => <div></div>,
}));

describe("Unit testing for Demo.tsx", () => {
  it("Test behavior of handleToggle function", () => {
    render(<Demo />);

    const switchInput =
      screen
        .getByTestId("demo-toggle-client-cache-label")
        ?.querySelector("input") || null;
    expect(switchInput?.checked).toBe(false);
    if (switchInput) fireEvent.click(switchInput);
    expect(switchInput?.checked).toBe(true);
  });

  it("Test behavior for handleVisualizerToggle", () => {
    render(<Demo />);

    const visSwitchInput =
      screen
        .getByTestId("demo-toggle-visualizer-label")
        ?.querySelector("input") || null;
        
    expect(visSwitchInput?.checked).toBe(false);
    if (visSwitchInput) fireEvent.click(visSwitchInput);
  });
});
