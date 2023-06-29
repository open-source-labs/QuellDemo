import {
  fireEvent,
  getByTestId,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { CTA } from "../../../components/CTA/CTA";

describe("Unit testing for CTA.tsx", () => {
  it("Test CTA renders correctly...", () => {
    render(<CTA />);
    const sectionElement = screen.getByTestId("cta-section");
    expect(sectionElement).toBeInTheDocument();

    const explanationElement = screen.getByTestId("cta-explanation");
    expect(explanationElement).toHaveTextContent(
      "Let Quell take care of your GraphQL queries"
    );
  });

  it("Test handleClintButtonClick copies...", async () => {
    const mockWriteText = jest.fn();

    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });
    render(<CTA />);

    const button = screen.getByTestId("cta-client-button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalled();
    });
  });
});
