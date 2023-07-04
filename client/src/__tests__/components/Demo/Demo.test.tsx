import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextDecoder, TextEncoder });
import { fireEvent, getByTestId, render, screen } from '@testing-library/react';
import Demo from '../../../components/Demo/Demo';

//mock graph component to control graph behavior during test and provide a custom implementation
jest.mock('../../../components/Graph/Graph', () => ({
  Graph: () => <div></div>,
}));
jest.mock('../../../components/HitMiss/HitMiss', () => ({
  HitMiss: () => <div></div>,
}));

describe('Unit testing for Demo.tsx', () => {
  it('Test behavior of handleToggle function', () => {
    render(<Demo />);

    //test the switch input toggles and starts with false and switches to true on click
    const switchInput =
      screen
        .getByTestId('demo-toggle-client-cache-label')
        ?.querySelector('input') || null;
    expect(switchInput?.checked).toBe(false);

    //if switchInput exists, mock click and assert the input is now true.
    if (switchInput) fireEvent.click(switchInput);
    expect(switchInput?.checked).toBe(true);
  });

  it('Test behavior for handleVisualizerToggle', () => {
    render(<Demo />);

    //select input status from Demo based on test-id
    const visSwitchInput =
      screen
        .getByTestId('demo-toggle-visualizer-label')
        ?.querySelector('input') || null;

    //assert input is defaulted to false
    expect(visSwitchInput?.checked).toBe(false);

    //assert input exists and fire a click event
    if (visSwitchInput) fireEvent.click(visSwitchInput);

    //assert input is now true
    expect(visSwitchInput?.checked).toBe(true);
  });
});
