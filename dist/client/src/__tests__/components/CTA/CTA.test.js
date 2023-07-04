"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
require("@testing-library/jest-dom/extend-expect");
const CTA_1 = require("../../../components/CTA/CTA");
/**
 * Unit testing making for CTA testing
 * @returns {JSX.Element} The rendered CTA component (render);
 * @type {jest.Mock} mockWriteText is a jest mock function
 */
describe("Unit testing for CTA.tsx", () => {
    it("Test CTA renders correctly...", () => {
        //render CTA component
        (0, react_1.render)((0, jsx_runtime_1.jsx)(CTA_1.CTA, {}));
        //retrieve section element by testid
        const sectionElement = react_1.screen.getByTestId("cta-section");
        //assert presence of section element in document
        expect(sectionElement).toBeInTheDocument();
        //retrieve section element by testid
        const explanationElement = react_1.screen.getByTestId("cta-explanation");
        //assert presence of text content in section element
        expect(explanationElement).toHaveTextContent("Let Quell take care of your GraphQL queries");
    });
    it("Test handleClickButtonClick copies...", () => __awaiter(void 0, void 0, void 0, function* () {
        //create mock function for write text
        const mockWriteText = jest.fn();
        //function mocks behavior of writeText on navigator.clipboard for texting
        Object.assign(navigator, {
            clipboard: {
                writeText: mockWriteText,
            },
        });
        (0, react_1.render)((0, jsx_runtime_1.jsx)(CTA_1.CTA, {}));
        //simulate a click event
        const button = react_1.screen.getByTestId("cta-client-button");
        react_1.fireEvent.click(button);
        //mock and seert mockWriteText to have bene called
        yield (0, react_1.waitFor)(() => {
            expect(mockWriteText).toHaveBeenCalled();
        });
    }));
});
