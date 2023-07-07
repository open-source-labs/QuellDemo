import { fireEvent, getByTestId, render, screen } from '@testing-library/react';
import { DemoHeader } from '../../../components/Demo/Demo-Header';
import '@testing-library/jest-dom/extend-expect';

describe('Unit testing for Demo-Header.tsx', () => {
  it('Test DemoHeader loads...', () => {
    render(<DemoHeader />);

    //retrieve section element using setByRole
    const h1Element = screen.getByRole('heading', { level: 1 });
    //retrieve section by text content
    const pElement = screen.getByText(
      'Try a live demo to see how Quell transforms GraphQL queries.',
    );

    //assert section element exists
    expect(h1Element).toBeDefined();
    //assert section element contains text
    expect(pElement).toHaveTextContent(
      'Try a live demo to see how Quell transforms GraphQL queries.',
    );
  });
});
