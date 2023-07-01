import { fireEvent, getByTestId, render, screen } from "@testing-library/react";
import { DemoHeader } from "../../../components/Demo/Demo-Header";
import "@testing-library/jest-dom/extend-expect";

describe("Unit testing for Demo-Header.tsx", () => {
  it("Test DemoHeader loads...", () => {
    render(<DemoHeader />);
    const h1Element = screen.getByRole("heading", { level: 1 });
    const pElement = screen.getByText(
      "Try a live demo to see how Quell transforms GraphQL queries."
    );
    expect(h1Element).toBeDefined();
    expect(pElement).toHaveTextContent(
      "Try a live demo to see how Quell transforms GraphQL queries."
    );
  });
});
