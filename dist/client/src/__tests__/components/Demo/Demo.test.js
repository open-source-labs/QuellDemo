"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const util_1 = require("util");
Object.assign(global, { TextDecoder: util_1.TextDecoder, TextEncoder: util_1.TextEncoder });
const react_1 = require("@testing-library/react");
const Demo_1 = __importDefault(require("../../../components/Demo/Demo"));
//mock graph component to control graph behavior during test and provide a custom implementation
jest.mock('../../../components/Graph/Graph', () => ({
    Graph: () => (0, jsx_runtime_1.jsx)("div", {}),
}));
jest.mock('../../../components/HitMiss/HitMiss', () => ({
    HitMiss: () => (0, jsx_runtime_1.jsx)("div", {}),
}));
describe('Unit testing for Demo.tsx', () => {
    it('Test behavior of handleToggle function', () => {
        var _a;
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Demo_1.default, {}));
        //test the switch input toggles and starts with false and switches to true on click
        const switchInput = ((_a = react_1.screen
            .getByTestId('demo-toggle-client-cache-label')) === null || _a === void 0 ? void 0 : _a.querySelector('input')) || null;
        expect(switchInput === null || switchInput === void 0 ? void 0 : switchInput.checked).toBe(false);
        //if switchInput exists, mock click and assert the input is now true.
        if (switchInput)
            react_1.fireEvent.click(switchInput);
        expect(switchInput === null || switchInput === void 0 ? void 0 : switchInput.checked).toBe(true);
    });
    it('Test behavior for handleVisualizerToggle', () => {
        var _a;
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Demo_1.default, {}));
        //select input status from Demo based on test-id
        const visSwitchInput = ((_a = react_1.screen
            .getByTestId('demo-toggle-visualizer-label')) === null || _a === void 0 ? void 0 : _a.querySelector('input')) || null;
        //assert input is defaulted to false
        expect(visSwitchInput === null || visSwitchInput === void 0 ? void 0 : visSwitchInput.checked).toBe(false);
        //assert input exists and fire a click event
        if (visSwitchInput)
            react_1.fireEvent.click(visSwitchInput);
        //assert input is now true
        expect(visSwitchInput === null || visSwitchInput === void 0 ? void 0 : visSwitchInput.checked).toBe(true);
    });
});
