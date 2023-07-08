"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Demo = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Demo_modules_css_1 = __importDefault(require("./Demo.modules.css"));
const Editors_1 = require("../Editors/Editors");
const helperFunctions_1 = require("../helperFunctions");
const Graph_1 = require("../Graph/Graph");
const HitMiss_1 = require("../HitMiss/HitMiss");
const Alert_1 = require("../Alert/Alert");
const Quellify_1 = require("../../quell-client/src/Quellify");
const Visualizer_1 = require("../Visualizer/Visualizer");
const schema_1 = require("../../../../server/schema/schema");
const react_1 = __importStar(require("react"));
const material_1 = require("@mui/material");
const styles_1 = require("@mui/material/styles");
const ForwardRounded_1 = __importDefault(require("@mui/icons-material/ForwardRounded"));
// Memoizing the Demo component to avoid unnecessary re-renders
exports.Demo = (0, react_1.memo)(() => {
    const [responseTimes, addResponseTimes] = (0, react_1.useState)([]);
    const [errorAlerts, addErrorAlerts] = (0, react_1.useState)([]);
    const [selectedQuery, setQueryChoice] = (0, react_1.useState)("2depthArtist");
    const [query, setQuery] = (0, react_1.useState)(helperFunctions_1.querySamples[selectedQuery]);
    const [queryTypes, addQueryTypes] = (0, react_1.useState)([]);
    const [maxDepth, setDepth] = (0, react_1.useState)(15);
    const [maxCost, setCost] = (0, react_1.useState)(6000);
    const [ipRate, setIPRate] = (0, react_1.useState)(22);
    const [isToggled, setIsToggled] = (0, react_1.useState)(false);
    const [cacheHit, setCacheHit] = (0, react_1.useState)(0);
    const [cacheMiss, setCacheMiss] = (0, react_1.useState)(0);
    const [elapsed, setElapsed] = (0, react_1.useState)({});
    // State for visualizer toggled
    const [isVisualizer, setIsVisualizer] = (0, react_1.useState)(false);
    const [visualizerQuery, setVisualizerQuery] = (0, react_1.useState)(query);
    // Handler function to toggle the switch
    function handleToggle(event) {
        setIsToggled(event.target.checked);
    }
    // Handler function to toggle visualizer
    function handleVisualizerToggle(event) {
        setIsVisualizer(event.target.checked);
    }
    return ((0, jsx_runtime_1.jsxs)("div", { id: "demo", className: "container bg-darkblue flex flex-col px-6 py-8 mx-auto pt-10 rounded-lg content-start space-y-0", children: [(0, jsx_runtime_1.jsxs)("div", { id: Demo_modules_css_1.default.demoHeader, className: "scrollpoint", children: [(0, jsx_runtime_1.jsx)("div", { id: "scroll-demo" }), (0, jsx_runtime_1.jsx)("h1", { id: Demo_modules_css_1.default.header, children: "Demo" }), (0, jsx_runtime_1.jsxs)(material_1.Box, { children: [(0, jsx_runtime_1.jsx)(material_1.FormControlLabel, { "data-testid": "demo-toggle-client-cache-label", className: "text-white font-sans", label: "Server-side caching", control: (0, jsx_runtime_1.jsx)(material_1.Switch, { checked: isToggled, onChange: handleToggle }) }), (0, jsx_runtime_1.jsx)(material_1.FormControlLabel, { "data-testid": "demo-toggle-visualizer-label", className: "text-white font-sans", label: "Visualizer", control: (0, jsx_runtime_1.jsx)(material_1.Switch, { checked: isVisualizer, onChange: handleVisualizerToggle }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col pt-9 gap-10 xl:flex-row", children: [(0, jsx_runtime_1.jsx)("div", { className: "leftContainer flex-1 flex-shrink", children: (0, jsx_runtime_1.jsx)(QueryDemo, { maxDepth: maxDepth, maxCost: maxCost, ipRate: ipRate, addErrorAlerts: addErrorAlerts, responseTimes: responseTimes, addResponseTimes: addResponseTimes, selectedQuery: selectedQuery, setQueryChoice: setQueryChoice, query: query, setQuery: setQuery, queryTypes: queryTypes, addQueryTypes: addQueryTypes, cacheHit: cacheHit, cacheMiss: cacheMiss, setCacheHit: setCacheHit, setCacheMiss: setCacheMiss, isToggled: isToggled, setVisualizerQuery: setVisualizerQuery, visualizerQuery: visualizerQuery, setElapsed: setElapsed, elapsed: elapsed }) }), (0, jsx_runtime_1.jsx)(material_1.Divider, { sx: { zIndex: "50" }, flexItem: true, orientation: "vertical" }), (0, jsx_runtime_1.jsx)("div", { className: "flex-1 flex-grow overflow-x-auto", children: isVisualizer ? ((0, jsx_runtime_1.jsx)(Visualizer_1.Visualizer, { query: visualizerQuery, elapsed: elapsed })) : ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(CacheControls, { setDepth: setDepth, setCost: setCost, setIPRate: setIPRate, addResponseTimes: addResponseTimes, cacheHit: cacheHit, cacheMiss: cacheMiss, setCacheHit: setCacheHit, setCacheMiss: setCacheMiss, isToggled: isToggled }), (0, jsx_runtime_1.jsx)(material_1.Divider, { className: "p-1", orientation: "horizontal" }), (0, jsx_runtime_1.jsx)(Graph_1.Graph, { responseTimes: responseTimes, selectedQuery: selectedQuery, queryTypes: queryTypes }), (0, jsx_runtime_1.jsx)(HitMiss_1.HitMiss, { cacheHit: cacheHit, cacheMiss: cacheMiss })] })) }), (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [responseTimes.map((el, i) => {
                                return (0, jsx_runtime_1.jsx)(Alert_1.SuccessfulQuery, {}, i);
                            }), errorAlerts.map((el, i) => {
                                console.log("ERROR: ", el);
                                return (0, jsx_runtime_1.jsx)(Alert_1.BadQuery, { errorMessage: el }, i);
                            })] })] })] }));
});
// QueryDemo Component that displays a demo query and allows users to submit queries. 
// It takes various props for querying and visualizations, and utilizes the useEffect hook 
// for setting the query based on the selected query type.
function QueryDemo({ addErrorAlerts, responseTimes, addResponseTimes, maxDepth, maxCost, ipRate, selectedQuery, setQueryChoice, query, setQuery, queryTypes, addQueryTypes, cacheHit, cacheMiss, setCacheHit, setCacheMiss, isToggled, visualizerQuery, setVisualizerQuery, setElapsed, elapsed, }) {
    // Use the useEffect hook to update the query when the selected query type changes
    (0, react_1.useEffect)(() => {
        setQuery(helperFunctions_1.querySamples[selectedQuery]);
    }, [selectedQuery, setQuery]);
    // Initialize the state for the response
    const [response, setResponse] = (0, react_1.useState)("");
    // Function to submit a client query
    function submitClientQuery() {
        // Record the start time for measuring response time
        const startTime = new Date().getTime();
        // Make a request to the server to clear any cached data
        fetch("/api/clearCache").then(() => console.log("Cleared Server Cache!"));
        /**
         * Quellify makes a GraphQL query to the provided endpoint.
         * @param {string} "/api/graphql" - The endpoint to send the query to.
         * @param {string} query - The GraphQL query string.
         * @param {Object} options - Options for query execution, including maxDepth, maxCost, and ipRate.
         * @param {Object} mutationMap - For tracking mutations, if any, in the query.
         */
        (0, Quellify_1.Quellify)("/api/graphql", query, { maxDepth, maxCost, ipRate }, schema_1.mutationMap)
            .then((res) => {
            // Set the visualizer query with the query used.
            setVisualizerQuery(query);
            // Calculate the time taken for the response and store it
            const responseTime = new Date().getTime() - startTime;
            addResponseTimes([...responseTimes, responseTime]);
            const queryType = selectedQuery;
            // Store the type of query executed
            addQueryTypes([...queryTypes, queryType]);
            // Check if the response is an array and process accordingly
            if (Array.isArray(res)) {
                // Extract the first element of the response array and type cast it to an object.
                let responseObj = res[0];
                if (responseObj && responseObj.hasOwnProperty("key")) {
                    // If response object has a property "key", delete it
                    delete responseObj["key"];
                }
                // Stringify the response object in a formatted manner and store it.
                let cachedResponse = JSON.stringify(responseObj, null, 2);
                setResponse(cachedResponse);
                // Check if the second element in the response array is a cache status and update cache miss or hit accordingly
                if (res[1] === false) {
                    setCacheMiss(cacheMiss + 1);
                }
                else if (res[1] === true) {
                    setCacheHit(cacheHit + 1);
                }
            }
        })
            .then(() => {
            // Make an API call to fetch the query execution time.
            fetch("/api/queryTime")
                .then((res) => res.json())
                .then((time) => {
                // If setElapsed is defined, set the elapsed time with the fetched time.
                if (setElapsed) {
                    setElapsed(time.time);
                }
            });
        })
            .catch((err) => {
            const error = {
                log: "Error when trying to fetch to GraphQL endpoint",
                status: 400,
                message: {
                    err: `Error in submitClientQuery. ${err}`,
                },
            };
            console.log("Error in fetch: ", error);
            err = "Invalid query";
            addErrorAlerts((prev) => [...prev, err]);
        });
    }
    // Function to submit a server query
    function submitServerQuery() {
        const startTime = new Date().getTime();
        const fetchOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: query,
                costOptions: { maxDepth, maxCost, ipRate },
            }),
        };
        let resError;
        fetch("/api/graphql", fetchOptions)
            .then((res) => res.json())
            .then((res) => {
            setVisualizerQuery(query);
            const responseTime = new Date().getTime() - startTime;
            addResponseTimes([...responseTimes, responseTime]);
            setResponse(JSON.stringify(res.queryResponse.data, null, 2));
            if (res.queryResponse.cached === true)
                setCacheHit(cacheHit + 1);
            else
                setCacheMiss(cacheMiss + 1);
        })
            .then(() => {
            fetch("/api/queryTime")
                .then((res) => res.json())
                .then((time) => {
                if (setElapsed) {
                    setElapsed(time.time);
                }
            });
        })
            .catch((err) => {
            const error = {
                log: "Error when trying to fetch to GraphQL endpoint",
                status: 400,
                message: {
                    err: `Error in submitServerQuery. ${err}`,
                },
            };
            console.log("Error in fetch: ", error);
            addErrorAlerts((prev) => [...prev, error.log]);
        });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { spellCheck: "false", children: [(0, jsx_runtime_1.jsx)(DemoControls, { selectedQuery: selectedQuery, setQueryChoice: setQueryChoice, submitQuery: isToggled ? submitServerQuery : submitClientQuery }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(Editors_1.QueryEditor, { selectedQuery: selectedQuery, setQuery: setQuery }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-white text-center", children: "See your query results: " }), (0, jsx_runtime_1.jsx)("div", { className: "max-h-30 border-1 border-white p-5", children: (0, jsx_runtime_1.jsx)(material_1.TextField, { id: Demo_modules_css_1.default.queryText, multiline: true, fullWidth: true, InputProps: { className: Demo_modules_css_1.default.queryInput }, rows: "20", value: response }) })] }));
}
// The DemoControls component is used to select a query and submit it.
// It accepts properties such as selectedQuery, setQueryChoice, and submitQuery.
const DemoControls = ({ selectedQuery, setQueryChoice, submitQuery, }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "min-w-full flex flex-col gap-5 text-white items-center", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Select a query to test: " }), (0, jsx_runtime_1.jsx)(QuerySelect, { setQueryChoice: setQueryChoice, selectedQuery: selectedQuery }), (0, jsx_runtime_1.jsx)(material_1.Button, { endIcon: (0, jsx_runtime_1.jsx)(ForwardRounded_1.default, {}), id: Demo_modules_css_1.default.submitQuery, onClick: () => submitQuery(), size: "small", color: "secondary", variant: "contained", children: "Query" })] }));
};
// The CacheControls component is used for controlling the cache and resetting the graph.
// It accepts various properties like setDepth, setCost, setIPRate, addResponseTimes, setCacheHit, setCacheMiss, etc.
const CacheControls = ({ setDepth, setCost, setIPRate, addResponseTimes, setCacheHit, setCacheMiss, cacheHit, cacheMiss, isToggled, }) => {
    // Function to reset the graph
    // Resets both Hit/Miss Graph & Pie Graph
    function resetGraph() {
        addResponseTimes([]);
        (0, Quellify_1.clearCache)();
        isToggled ? clearServerCache() : clearClientCache();
        setCacheHit((cacheHit = 0));
        setCacheMiss((cacheMiss = 0));
    }
    // Function to clear the client cache
    const clearClientCache = () => {
        addResponseTimes([]);
        setCacheHit((cacheHit = 0));
        setCacheMiss((cacheMiss = 0));
        return (0, Quellify_1.clearCache)();
    };
    // Function to clear the server cache
    const clearServerCache = () => {
        fetch("/api/clearCache").then((res) => console.log("Cleared Server Cache!"));
        addResponseTimes([]);
        setCacheHit((cacheHit = 0));
        setCacheMiss((cacheMiss = 0));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: Demo_modules_css_1.default.cacheControls, children: [(0, jsx_runtime_1.jsxs)(material_1.Stack, { direction: "row", alignItems: "center", justifyContent: "center", spacing: 2, children: [(0, jsx_runtime_1.jsxs)(material_1.Button, { className: Demo_modules_css_1.default.button, onClick: isToggled ? clearServerCache : clearClientCache, size: "small", color: "secondary", variant: "contained", children: ["Clear ", isToggled ? "Server" : "Client", " Cache"] }), (0, jsx_runtime_1.jsx)(material_1.Button, { onClick: resetGraph, className: Demo_modules_css_1.default.button, size: "small", color: "secondary", variant: "contained", children: "Reset Graph" })] }), isToggled ? ((0, jsx_runtime_1.jsx)("div", { style: {
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }, children: (0, jsx_runtime_1.jsx)(Limit, { setDepth: setDepth, setCost: setCost, setIPRate: setIPRate, addResponseTimes: addResponseTimes, cacheHit: cacheHit, cacheMiss: cacheMiss, setCacheHit: setCacheHit, setCacheMiss: setCacheMiss }) })) : ((0, jsx_runtime_1.jsx)(material_1.Stack, { direction: "row", alignItems: "center", justifyContent: "space-around", spacing: 1 }))] }));
};
//Query Dropdown Menu
function QuerySelect({ setQueryChoice, selectedQuery }) {
    const handleChange = (event) => {
        // this state is controlled by the demoControls aka the parent component
        setQueryChoice(event.target.value);
    };
    return ((0, jsx_runtime_1.jsx)(material_1.Box, { className: "text-center min-w-[90%]", children: (0, jsx_runtime_1.jsxs)(material_1.FormControl, { fullWidth: true, children: [(0, jsx_runtime_1.jsx)(material_1.InputLabel, { id: "demo-simple-select-label", style: { color: "white", borderStyle: "white" }, children: "Query" }), (0, jsx_runtime_1.jsxs)(material_1.Select, { style: { color: "white" }, labelId: "demo-simple-select-label", value: selectedQuery, defaultValue: selectedQuery, label: "Query", onChange: handleChange, children: [(0, jsx_runtime_1.jsx)(material_1.MenuItem, { className: Demo_modules_css_1.default.menuListItem, value: "2depthArtist", children: "2-Depth: Artist" }), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { className: Demo_modules_css_1.default.menuListItem, value: "2depthAlbum", children: "2-Depth: Album" }), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { className: Demo_modules_css_1.default.menuListItem, value: "2depthSong", children: "2-Depth: Song" }), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { className: Demo_modules_css_1.default.menuListItem, value: "2depthCity", children: "2-Depth: City" }), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { className: Demo_modules_css_1.default.menuListItem, value: "2depthCountry", children: "2-Depth: Country" }), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { className: Demo_modules_css_1.default.menuListItem, value: "2depthAttraction", children: "2-Depth: Attraction" }), (0, jsx_runtime_1.jsx)("hr", {}), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { className: Demo_modules_css_1.default.menuListItem, value: "3depthCountry", children: "3-Depth: Country, Cities & Attractions" }), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { className: Demo_modules_css_1.default.menuListItem, value: "3depthArtist", children: "3-Depth: Artist, Albums & Songs" }), (0, jsx_runtime_1.jsx)("hr", {}), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { className: Demo_modules_css_1.default.menuListItem, value: "costly", children: "Costly" }), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { className: Demo_modules_css_1.default.menuListItem, value: "nested", children: "Nested" }), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { className: Demo_modules_css_1.default.menuListItem, value: "fragment", children: "Fragment" }), (0, jsx_runtime_1.jsx)("hr", {}), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { className: Demo_modules_css_1.default.menuListItem, value: "mutationAddCity", children: "Mutation - Add: City" }), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { className: Demo_modules_css_1.default.menuListItem, value: "mutationAddCountry", children: "Mutation - Add: Country" }), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { className: Demo_modules_css_1.default.menuListItem, value: "mutationAddArtist", children: "Mutation - Add: Artist" }), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { className: Demo_modules_css_1.default.menuListItem, value: "mutationAddAlbum", children: "Mutation - Add: Album" }), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { className: Demo_modules_css_1.default.menuListItem, value: "mutationAddSong", children: "Mutation - Add: Song" }), (0, jsx_runtime_1.jsx)("hr", {}), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { className: Demo_modules_css_1.default.menuListItem, value: "mutationDeleteCity", children: "Mutation - Delete: City" }), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { className: Demo_modules_css_1.default.menuListItem, value: "mutationDeleteAlbum", children: "Mutation - Delete: Album" }), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { className: Demo_modules_css_1.default.menuListItem, value: "mutationDeleteArtist", children: "Mutation - Delete: Artist" }), (0, jsx_runtime_1.jsx)("hr", {}), (0, jsx_runtime_1.jsx)(material_1.MenuItem, { className: Demo_modules_css_1.default.menuListItem, value: "mutationEditArtist", children: "Mutation - Edit: Artist" })] })] }) }));
}
// StyledDiv component with custom styles using styled-components library
const StyledDiv = (0, styles_1.styled)("div")(({ theme }) => (Object.assign(Object.assign({}, theme.typography.button), { backgroundColor: theme.palette.primary.main, borderRadius: "5px", fontSmooth: "always", color: "white", boxShadow: "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)" })));
// Limit component - displays limit inputs for max depth, max cost, and IP rate
function Limit({ setDepth, setCost, setIPRate }) {
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(StyledDiv, { className: Demo_modules_css_1.default.limits, children: (0, jsx_runtime_1.jsxs)("form", { children: [(0, jsx_runtime_1.jsx)("label", { children: "Max Depth: " }), (0, jsx_runtime_1.jsx)("input", { className: Demo_modules_css_1.default.limitsInput, type: "number", placeholder: "15", onChange: (e) => {
                                setDepth(Number(e.target.value));
                            } })] }) }), (0, jsx_runtime_1.jsx)(StyledDiv, { className: Demo_modules_css_1.default.limits, children: (0, jsx_runtime_1.jsxs)("form", { children: [(0, jsx_runtime_1.jsx)("label", { children: "Max Cost: " }), (0, jsx_runtime_1.jsx)("input", { className: Demo_modules_css_1.default.limitsInput, type: "number", placeholder: "6000", onChange: (e) => {
                                setCost(Number(e.target.value));
                            } })] }) }), (0, jsx_runtime_1.jsx)(StyledDiv, { className: Demo_modules_css_1.default.limits, children: (0, jsx_runtime_1.jsxs)("form", { children: [(0, jsx_runtime_1.jsx)("label", { children: "Requests /s: " }), (0, jsx_runtime_1.jsx)("input", { className: Demo_modules_css_1.default.limitsInput, type: "number", placeholder: "22", onChange: (e) => {
                                setIPRate(+Number(e.target.value));
                            } })] }) })] }));
}
exports.default = exports.Demo;
