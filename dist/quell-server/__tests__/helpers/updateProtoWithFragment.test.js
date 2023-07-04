"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const quellHelpers_1 = require("../../src/helpers/quellHelpers");
describe('tests for update prototype with fragments on the server side', () => {
    test('basic prototype object with 2 fields and a fragment, should convert to a protoype with 2 fields and the fields from the fragment without the fragment key on the prototype object', () => {
        const protoObj = {
            artists: {
                __id: null,
                __args: null,
                __alias: null,
                __type: 'artists',
                id: true,
                name: true,
                artistFragment: true,
            },
        };
        const fragment = {
            artistFragment: {
                instrument: true,
                band: true,
                hometown: true,
            },
        };
        expect((0, quellHelpers_1.updateProtoWithFragment)(protoObj, fragment)).toEqual({
            artists: {
                __id: null,
                __args: null,
                __alias: null,
                __type: 'artists',
                id: true,
                name: true,
                instrument: true,
                band: true,
                hometown: true
            },
        });
    });
});
