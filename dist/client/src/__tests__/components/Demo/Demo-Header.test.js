"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
const Demo_Header_1 = require("../../../components/Demo/Demo-Header");
require("@testing-library/jest-dom/extend-expect");
describe('Unit testing for Demo-Header.tsx', () => {
    it('Test DemoHeader loads...', () => {
        (0, react_1.render)((0, jsx_runtime_1.jsx)(Demo_Header_1.DemoHeader, {}));
        //retrieve section element using setByRole
        const h1Element = react_1.screen.getByRole('heading', { level: 1 });
        //retrieve section by text content
        const pElement = react_1.screen.getByText('Try a live demo to see how Quell transforms GraphQL queries.');
        //assert section element exists
        expect(h1Element).toBeDefined();
        //assert section element contains text
        expect(pElement).toHaveTextContent('Try a live demo to see how Quell transforms GraphQL queries.');
    });
});
