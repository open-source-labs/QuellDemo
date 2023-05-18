import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import styles from './Demo.modules.css';
import { Box, Divider, Stack, Button, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import { QueryEditor } from '../Editors/Editors';
import { querySamples } from '../helperFunctions';
import ForwardRoundedIcon from '@mui/icons-material/ForwardRounded';
import { Graph } from '../Graph/Graph';
import { HitMiss } from '../HitMiss/HitMiss';
import { SuccessfulQuery, BadQuery } from '../Alert/Alert';
import { Quellify, clearLokiCache } from '../../quell-client/src/Quellify';
import { styled } from '@mui/material/styles';
import { Visualizer } from '../Visualizer/Visualizer';
// import { getElapsedTime } from '../../../../server/schema/schema';
const Demo = memo(() => {
    const [responseTimes, addResponseTimes] = useState([]);
    const [errorAlerts, addErrorAlerts] = useState([]);
    const [selectedQuery, setQueryChoice] = useState('2depth');
    const [query, setQuery] = useState(querySamples[selectedQuery]);
    const [queryTypes, addQueryTypes] = useState([]);
    const [maxDepth, setDepth] = useState(15);
    const [maxCost, setCost] = useState(6000);
    const [ipRate, setIPRate] = useState(22);
    const [isToggled, setIsToggled] = useState(false);
    const [cacheHit, setCacheHit] = useState(0);
    const [cacheMiss, setCacheMiss] = useState(0);
    const [elapsed, setElapsed] = useState(-1);
    // console.log('getElapsedTime:', getElapsedTime());
    // Hook for visualizer toggled
    const [isVisualizer, setIsVisualizer] = useState(false);
    const [visualizerQuery, setVisualizerQuery] = useState(query);
    useEffect(() => { }, [errorAlerts, responseTimes]);
    function handleToggle(event) {
        // Removed client cache clear on toggle, but kept on 'Clear Client Cache' button click.
        // Clear both cache on the toggle event
        // clearLokiCache();
        // fetch('/api/clearCache').then((res) =>
        //   console.log('Cleared Server Cache!')
        // );
        setIsToggled(event.target.checked);
    }
    // Function to handle visualizer toggle
    function handleVisualizerToggle(event) {
        setIsVisualizer(event.target.checked);
    }
    return (_jsxs("div", Object.assign({ id: "demo", className: styles.section }, { children: [_jsxs("div", Object.assign({ id: styles.demoHeader, className: "scrollpoint" }, { children: [_jsx("div", { id: "scroll-demo" }), _jsx("h1", Object.assign({ id: styles.header }, { children: "Demo" })), _jsxs(Box, { children: [_jsx(FormControlLabel, { label: "Server-side caching", control: _jsx(Switch, { checked: isToggled, onChange: handleToggle }) }), _jsx(FormControlLabel, { label: "Visualizer", control: _jsx(Switch, { checked: isVisualizer, onChange: handleVisualizerToggle }) })] })] })), _jsxs("div", Object.assign({ className: styles.container }, { children: [_jsx(QueryDemo, { maxDepth: maxDepth, maxCost: maxCost, ipRate: ipRate, addErrorAlerts: addErrorAlerts, responseTimes: responseTimes, addResponseTimes: addResponseTimes, selectedQuery: selectedQuery, setQueryChoice: setQueryChoice, query: query, setQuery: setQuery, queryTypes: queryTypes, addQueryTypes: addQueryTypes, cacheHit: cacheHit, cacheMiss: cacheMiss, setCacheHit: setCacheHit, setCacheMiss: setCacheMiss, isToggled: isToggled, setVisualizerQuery: setVisualizerQuery, visualizerQuery: visualizerQuery, setElapsed: setElapsed, elapsed: elapsed }), _jsx(Divider, { sx: { zIndex: '50' }, flexItem: true, orientation: "vertical" }), _jsx("div", Object.assign({ className: styles.rightContainer }, { children: isVisualizer ? (_jsx(Visualizer, { query: visualizerQuery })) : (_jsxs("div", Object.assign({ className: styles.rightContainerHeader }, { children: [_jsx(CacheControls, { setDepth: setDepth, setCost: setCost, setIPRate: setIPRate, addResponseTimes: addResponseTimes, cacheHit: cacheHit, cacheMiss: cacheMiss, setCacheHit: setCacheHit, setCacheMiss: setCacheMiss, isToggled: isToggled }), _jsx(Divider, { orientation: "horizontal" }), _jsx(Graph, { responseTimes: responseTimes, selectedQuery: selectedQuery, queryTypes: queryTypes }), _jsx(HitMiss, { cacheHit: cacheHit, cacheMiss: cacheMiss })] }))) })), _jsxs(_Fragment, { children: [responseTimes.map((el, i) => {
                                return _jsx(SuccessfulQuery, {}, i);
                            }), errorAlerts.map((el, i) => {
                                console.log('ERROR: ', el);
                                return _jsx(BadQuery, { errorMessage: el }, i);
                            })] })] }))] })));
});
function QueryDemo({ addErrorAlerts, responseTimes, addResponseTimes, maxDepth, maxCost, ipRate, selectedQuery, setQueryChoice, query, setQuery, queryTypes, addQueryTypes, cacheHit, cacheMiss, setCacheHit, setCacheMiss, isToggled, visualizerQuery, setVisualizerQuery, setElapsed, elapsed }) {
    const [response, setResponse] = useState('');
    function submitClientQuery() {
        const startTime = new Date().getTime();
        Quellify('/api/graphql', query, { maxDepth, maxCost, ipRate })
            .then((res) => {
            console.log(res);
            setVisualizerQuery(query);
            // if (setElapsed) {
            //   setElapsed(getElapsedTime());
            // };
            // console.log('elapsed: ', elapsed);
            const responseTime = new Date().getTime() - startTime;
            addResponseTimes([...responseTimes, responseTime]);
            const queryType = selectedQuery;
            addQueryTypes([...queryTypes, queryType]);
            if (Array.isArray(res)) {
                setResponse(JSON.stringify(res[0], null, 2));
                if (res[1] === false) {
                    setCacheMiss(cacheMiss + 1);
                }
                else if (res[1] === true) {
                    setCacheHit(cacheHit + 1);
                }
            }
        })
            .then(() => {
            fetch('/api/queryTime').then(res => res.text())
                .then((time) => {
                if (setElapsed) {
                    console.log('time: ', time);
                    setElapsed(Number(time));
                }
            });
        })
            .catch((err) => {
            const error = {
                log: 'Error when trying to fetch to GraphQL endpoint',
                status: 400,
                message: {
                    err: `Error in submitClientQuery. ${err}`
                }
            };
            console.log('Error in fetch: ', error);
            err = 'Invalid query';
            addErrorAlerts((prev) => [...prev, err]);
        });
    }
    function submitServerQuery() {
        const startTime = new Date().getTime();
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: query,
                costOptions: { maxDepth, maxCost, ipRate }
            })
        };
        let resError;
        fetch('/api/graphql', fetchOptions)
            .then((res) => res.json())
            .then((res) => {
            setVisualizerQuery(query);
            resError = res;
            const responseTime = new Date().getTime() - startTime;
            addResponseTimes([...responseTimes, responseTime]);
            setResponse(JSON.stringify(res.queryResponse.data, null, 2));
            if (res.queryResponse.cached === true)
                setCacheHit(cacheHit + 1);
            else
                setCacheMiss(cacheMiss + 1);
        })
            .catch((err) => {
            const error = {
                log: 'Error when trying to fetch to GraphQL endpoint',
                status: 400,
                message: {
                    err: `Error in submitClientQuery. ${err}`
                }
            };
            console.log('Error in fetch: ', error);
            err = resError;
            addErrorAlerts((prev) => [...prev, err]);
        });
    }
    return (_jsxs("div", Object.assign({ spellCheck: "false", className: styles.leftContainer }, { children: [_jsx(DemoControls, { selectedQuery: selectedQuery, setQueryChoice: setQueryChoice, submitQuery: isToggled ? submitServerQuery : submitClientQuery }), _jsx(QueryEditor, { selectedQuery: selectedQuery, setQuery: setQuery }), _jsx("h3", { children: "See your query results: " }), _jsx("div", Object.assign({ id: styles.response }, { children: _jsx(TextField, { id: styles.queryText, multiline: true, fullWidth: true, InputProps: { className: styles.queryInput }, rows: "50", value: response }) }))] })));
}
const DemoControls = ({ selectedQuery, setQueryChoice, submitQuery }) => {
    return (_jsxs("div", Object.assign({ className: styles.dropDownContainer }, { children: [_jsx("h3", { children: "Select a query to test: " }), _jsx(QuerySelect, { setQueryChoice: setQueryChoice, selectedQuery: selectedQuery }), _jsx(Button, Object.assign({ endIcon: _jsx(ForwardRoundedIcon, {}), id: styles.submitQuery, onClick: () => submitQuery(), size: "medium", color: "secondary", variant: "contained" }, { children: "Query" }))] })));
};
const CacheControls = ({ setDepth, setCost, setIPRate, addResponseTimes, setCacheHit, setCacheMiss, cacheHit, cacheMiss, isToggled }) => {
    function resetGraph() {
        addResponseTimes([]);
        clearLokiCache();
        isToggled ? clearServerCache() : clearClientCache();
        setCacheHit((cacheHit = 0));
        setCacheMiss((cacheMiss = 0));
    }
    const clearClientCache = () => {
        return clearLokiCache();
    };
    const clearServerCache = () => {
        fetch('/api/clearCache').then((res) => console.log('Cleared Server Cache!'));
    };
    return (_jsxs("div", Object.assign({ className: styles.cacheControls }, { children: [_jsxs(Stack, Object.assign({ direction: "row", alignItems: "center", justifyContent: "center", spacing: 2 }, { children: [_jsxs(Button, Object.assign({ className: styles.button, onClick: isToggled ? clearServerCache : clearClientCache, color: "secondary", variant: "contained" }, { children: ["Clear ", isToggled ? 'Server' : 'Client', " Cache"] })), _jsx(Button, Object.assign({ onClick: resetGraph, className: styles.button, size: "medium", color: "secondary", variant: "contained" }, { children: "Reset Graph" }))] })), isToggled ? (_jsx("div", Object.assign({ style: {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                } }, { children: _jsx(Limit, { setDepth: setDepth, setCost: setCost, setIPRate: setIPRate, addResponseTimes: addResponseTimes, cacheHit: cacheHit, cacheMiss: cacheMiss, setCacheHit: setCacheHit, setCacheMiss: setCacheMiss }) }))) : (_jsx(Stack, { direction: "row", alignItems: "center", justifyContent: "space-around", spacing: 1 }))] })));
};
//Query Dropdown Menu
function QuerySelect({ setQueryChoice, selectedQuery }) {
    const handleChange = (event) => {
        //this state is controlled by the demoControls aka the parent component
        setQueryChoice(event.target.value);
    };
    return (_jsx(Box, Object.assign({ className: styles.queryMenu }, { children: _jsxs(FormControl, Object.assign({ fullWidth: true }, { children: [_jsx(InputLabel, Object.assign({ id: "demo-simple-select-label" }, { children: "Query" })), _jsxs(Select, Object.assign({ labelId: "demo-simple-select-label", id: styles.demoSelect, value: selectedQuery, defaultValue: selectedQuery, label: "Query", onChange: handleChange }, { children: [_jsx(MenuItem, Object.assign({ value: '2depth' }, { children: "2-Depth" })), _jsx(MenuItem, Object.assign({ value: '3depth' }, { children: "3-Depth Country and Cities" })), _jsx(MenuItem, Object.assign({ value: 'costly' }, { children: "Costly" })), _jsx(MenuItem, Object.assign({ value: 'nested' }, { children: "Nested" })), _jsx(MenuItem, Object.assign({ value: 'fragment' }, { children: "Fragment" })), _jsx(MenuItem, Object.assign({ value: 'mutation' }, { children: "Mutation" })), _jsx(MenuItem, Object.assign({ value: 'countryMut' }, { children: "Mutation Country" })), _jsx(MenuItem, Object.assign({ value: 'delete' }, { children: "Mutation Delete City" }))] }))] })) })));
}
const StyledDiv = styled('div')(({ theme }) => (Object.assign(Object.assign({}, theme.typography.button), { backgroundColor: theme.palette.primary.main, borderRadius: '5px', fontSmooth: 'always', color: 'white', boxShadow: '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)' })));
function Limit({ setDepth, setCost, setIPRate }) {
    return (_jsxs("div", { children: [_jsx(StyledDiv, Object.assign({ className: styles.limits }, { children: _jsxs("form", { children: [_jsx("label", { children: "Max Depth: " }), _jsx("input", { className: styles.limitsInput, type: "number", placeholder: "15", onChange: (e) => {
                                setDepth(Number(e.target.value));
                            } })] }) })), _jsx(StyledDiv, Object.assign({ className: styles.limits }, { children: _jsxs("form", { children: [_jsx("label", { children: "Max Cost:" }), _jsx("input", { className: styles.limitsInput, type: "number", placeholder: "6000", onChange: (e) => {
                                setCost(Number(e.target.value));
                            } })] }) })), _jsx(StyledDiv, Object.assign({ className: styles.limits }, { children: _jsxs("form", { children: [_jsx("label", { children: "Requests /s:" }), _jsx("input", { className: styles.limitsInput, type: "number", placeholder: "22", onChange: (e) => {
                                setIPRate(+Number(e.target.value));
                            } })] }) }))] }));
}
export default Demo;
