import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { CTA } from "../../../components/CTA/CTA";

/**
 * Unit testing making for CTA testing 
 * @returns {JSX.Element} The rendered CTA component (render);
 * 
 * @type {jest.Mock} mockWriteText is a jest mock function
 * 
 */

describe("Unit testing for CTA.tsx", () => {
  it("Test CTA renders correctly...", () => {
    //render CTA component
    render(<CTA />);

    //retrieve section element by testid
    const sectionElement = screen.getByTestId("cta-section");
    //assert presence of section element in document
    expect(sectionElement).toBeInTheDocument();

    //retrieve section element by testid
    const explanationElement = screen.getByTestId("cta-explanation");
    //assert presence of text content in section element
    expect(explanationElement).toHaveTextContent(
      "Let Quell take care of your GraphQL queries"
    );
  });

  it("Test handleClickButtonClick copies...", async () => {
    //create mock function for write text
    const mockWriteText = jest.fn();

    //function mocks behavior of writeText on navigator.clipboard for texting
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });
    render(<CTA />);

    //simulate a click event
    const button = screen.getByTestId("cta-client-button");
    fireEvent.click(button);

    //mock and seert mockWriteText to have bene called
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalled();
    });
  });
});
