import styles from './Demo.modules.css';
import {
  Box,
  Divider,
  Stack,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField
} from '@mui/material';
import React, {
  Dispatch,
  memo,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import { QueryEditor } from '../Editors/Editors';
import { querySamples } from '../helperFunctions';
import ForwardRoundedIcon from '@mui/icons-material/ForwardRounded';
import { Graph } from '../Graph/Graph';
import { HitMiss } from '../HitMiss/HitMiss';
import { SuccessfulQuery, BadQuery } from '../Alert/Alert';
import { Quellify, clearLokiCache } from '../../quell-client/src/Quellify';
import { styled } from '@mui/material/styles';
import { Visualizer } from '../Visualizer/Visualizer';
import { parse } from 'graphql/language/parser';
import { DocumentNode } from 'graphql';
// import { getElapsedTime } from '../../../../server/schema/schema';

const Demo = memo(() => {
  const [responseTimes, addResponseTimes] = useState<number[] | []>([]);
  const [errorAlerts, addErrorAlerts] = useState<string[]>([]);
  const [selectedQuery, setQueryChoice] = useState<string>('2depth');
  const [query, setQuery] = useState<string>(querySamples[selectedQuery]);
  const [queryTypes, addQueryTypes] = useState<string[]>([]);
  const [maxDepth, setDepth] = useState<number>(15);
  const [maxCost, setCost] = useState<number>(6000);
  const [ipRate, setIPRate] = useState<number>(22);
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const [cacheHit, setCacheHit] = useState<number>(0);
  const [cacheMiss, setCacheMiss] = useState<number>(0);
  const [elapsed, setElapsed] = useState<{}>({});
  
  // Hook for visualizer toggled
  const [isVisualizer, setIsVisualizer] = useState<boolean>(false);

  const [visualizerQuery, setVisualizerQuery] = useState<string>(query);

  useEffect(() => {}, [errorAlerts, responseTimes]);

  function handleToggle(event: React.ChangeEvent<HTMLInputElement>): void {
    // Removed client cache clear on toggle, but kept on 'Clear Client Cache' button click.
      // Clear both cache on the toggle event
      // clearLokiCache();
      // fetch('/api/clearCache').then((res) =>
      //   console.log('Cleared Server Cache!')
      // );
    setIsToggled(event.target.checked);
  }

  // Function to handle visualizer toggle
  function handleVisualizerToggle(event: React.ChangeEvent<HTMLInputElement>): void {
    setIsVisualizer(event.target.checked);
  }
  

  return (
    <div id="demo" className={styles.section}>
      <div id={styles.demoHeader} className="scrollpoint">
        <div id="scroll-demo"></div>
        <h1 id={styles.header}>Demo</h1>
        <Box>
          <FormControlLabel
            label="Server-side caching"
            control={<Switch checked={isToggled} onChange={handleToggle} />}
          />
          <FormControlLabel
            label="Visualizer"
            control={<Switch checked={isVisualizer} onChange={handleVisualizerToggle} />}
          />
        </Box>
      </div>
      <div className={styles.container}>
        <QueryDemo
          maxDepth={maxDepth}
          maxCost={maxCost}
          ipRate={ipRate}
          addErrorAlerts={addErrorAlerts}
          responseTimes={responseTimes}
          addResponseTimes={addResponseTimes}
          selectedQuery={selectedQuery}
          setQueryChoice={setQueryChoice}
          query={query}
          setQuery={setQuery}
          queryTypes={queryTypes}
          addQueryTypes={addQueryTypes}
          cacheHit={cacheHit}
          cacheMiss={cacheMiss}
          setCacheHit={setCacheHit}
          setCacheMiss={setCacheMiss}
          isToggled={isToggled}
          setVisualizerQuery={setVisualizerQuery}
          visualizerQuery={visualizerQuery}
          setElapsed={setElapsed}
          elapsed={elapsed}
        />
        <Divider sx={{ zIndex: '50' }} flexItem={true} orientation="vertical" />
        <div className={styles.rightContainer}>
          {isVisualizer ? (
            <Visualizer 
            query={visualizerQuery}
            elapsed={elapsed}
            />
          ) : (
            <div className={styles.rightContainerHeader}>
              <CacheControls
                setDepth={setDepth}
                setCost={setCost}
                setIPRate={setIPRate}
                addResponseTimes={addResponseTimes}
                cacheHit={cacheHit}
                cacheMiss={cacheMiss}
                setCacheHit={setCacheHit}
                setCacheMiss={setCacheMiss}
                isToggled={isToggled}
              />
              <Divider orientation="horizontal" />
              <Graph
                responseTimes={responseTimes}
                selectedQuery={selectedQuery}
                queryTypes={queryTypes}
              />
              <HitMiss cacheHit={cacheHit} cacheMiss={cacheMiss} />
            </div>
            )
          }
        </div>
        <>
          {responseTimes.map((el, i) => {
            return <SuccessfulQuery key={i} />;
          })}
          {errorAlerts.map((el, i) => {
            console.log('ERROR: ', el);
            return <BadQuery errorMessage={el} key={i} />;
          })}
        </>
      </div>
    </div>
  );
});

function QueryDemo({
  addErrorAlerts,
  responseTimes,
  addResponseTimes,
  maxDepth,
  maxCost,
  ipRate,
  selectedQuery,
  setQueryChoice,
  query,
  setQuery,
  queryTypes,
  addQueryTypes,
  cacheHit,
  cacheMiss,
  setCacheHit,
  setCacheMiss,
  isToggled,
  visualizerQuery,
  setVisualizerQuery,
  setElapsed,
  elapsed
}: QueryDemoProps) {
  const [response, setResponse] = useState<string>('');

  function submitClientQuery() {
    const startTime = new Date().getTime();
    //TODO edit this? clear server cache
    fetch('/api/clearCache').then((res) =>
      console.log('Cleared Server Cache!')
    );
    Quellify('/api/graphql', query, { maxDepth, maxCost, ipRate })
      .then((res) => {
        // console.log(res);
        setVisualizerQuery(query);
        const responseTime: number = new Date().getTime() - startTime;
        addResponseTimes([...responseTimes, responseTime]);
        const queryType: string = selectedQuery;
        addQueryTypes([...queryTypes, queryType]);
        if (Array.isArray(res)) {
          setResponse(JSON.stringify(res[0], null, 2));
          if (res[1] === false) {
            setCacheMiss(cacheMiss + 1);
          } else if (res[1] === true) {
            setCacheHit(cacheHit + 1);
          }
        }
      })
      .then(() => {
        fetch ('/api/queryTime').then(res => res.json())
        .then((time) => {
          if (setElapsed){
            // console.log('time: ', time);
            setElapsed(time.time);
          }
        })
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
    let resError: string;
    fetch('/api/graphql', fetchOptions)
      .then((res) => res.json())
      .then((res) => {
        setVisualizerQuery(query);
        resError = res;
        const responseTime: number = new Date().getTime() - startTime;
        addResponseTimes([...responseTimes, responseTime]);
        setResponse(JSON.stringify(res.queryResponse.data, null, 2));
        if (res.queryResponse.cached === true) setCacheHit(cacheHit + 1);
        else setCacheMiss(cacheMiss + 1);
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

  return (
    <div spellCheck="false" className={styles.leftContainer}>
      <DemoControls
        selectedQuery={selectedQuery}
        setQueryChoice={setQueryChoice}
        submitQuery={isToggled ? submitServerQuery : submitClientQuery}
      />
      <QueryEditor selectedQuery={selectedQuery} setQuery={setQuery} />
      <h3>See your query results: </h3>
      <div id={styles.response}>
        <TextField
          id={styles.queryText}
          multiline={true}
          fullWidth={true}
          InputProps={{ className: styles.queryInput }}
          rows="50"
          value={response}
        ></TextField>
      </div>
    </div>
  );
}

interface DemoControls {
  selectedQuery: string;
  setQueryChoice: Dispatch<SetStateAction<string>>;
  submitQuery: () => void;
}

const DemoControls = ({
  selectedQuery,
  setQueryChoice,
  submitQuery
}: DemoControls) => {
  return (
    <div className={styles.dropDownContainer}>
      <h3>Select a query to test: </h3>
      <QuerySelect
        setQueryChoice={setQueryChoice}
        selectedQuery={selectedQuery}
      />
      <Button
        endIcon={<ForwardRoundedIcon />}
        id={styles.submitQuery}
        onClick={() => submitQuery()}
        size="medium"
        color="secondary"
        variant="contained"
      >
        Query
      </Button>
    </div>
  );
};

const CacheControls = ({
  setDepth,
  setCost,
  setIPRate,
  addResponseTimes,
  setCacheHit,
  setCacheMiss,
  cacheHit,
  cacheMiss,
  isToggled
}: CacheControlProps) => {
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
    fetch('/api/clearCache').then((res) =>
      console.log('Cleared Server Cache!')
    );
  };

  return (
    <div className={styles.cacheControls}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={2}
      >
        <Button
          className={styles.button}
          onClick={isToggled ? clearServerCache : clearClientCache}
          color="secondary"
          variant="contained"
        >
          Clear {isToggled ? 'Server' : 'Client'} Cache
        </Button>
        <Button
          onClick={resetGraph}
          className={styles.button}
          size="medium"
          color="secondary"
          variant="contained"
        >
          Reset Graph
        </Button>
      </Stack>
      {isToggled ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Limit
            setDepth={setDepth}
            setCost={setCost}
            setIPRate={setIPRate}
            addResponseTimes={addResponseTimes}
            cacheHit={cacheHit}
            cacheMiss={cacheMiss}
            setCacheHit={setCacheHit}
            setCacheMiss={setCacheMiss}
          />
        </div>
      ) : (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-around"
          spacing={1}
        ></Stack>
      )}
    </div>
  );
};

//Query Dropdown Menu
function QuerySelect({ setQueryChoice, selectedQuery }: BasicSelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    //this state is controlled by the demoControls aka the parent component
    setQueryChoice(event.target.value as string);
  };

  return (
    <Box className={styles.queryMenu}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Query</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id={styles.demoSelect}
          value={selectedQuery}
          defaultValue={selectedQuery}
          label="Query"
          onChange={handleChange}
        >
          <MenuItem value={'2depth'}>2-Depth</MenuItem>
          <MenuItem value={'3depth'}>3-Depth Country and Cities</MenuItem>
          <MenuItem value={'costly'}>Costly</MenuItem>
          <MenuItem value={'nested'}>Nested</MenuItem>
          <MenuItem value={'fragment'}>Fragment</MenuItem>
          <MenuItem value={'mutation'}>Mutation</MenuItem>
          <MenuItem value={'countryMut'}>Mutation Country</MenuItem>
          <MenuItem value={'delete'}>Mutation Delete City</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

const StyledDiv = styled('div')(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: theme.palette.primary.main,
  borderRadius: '5px',
  fontSmooth: 'always',
  color: 'white',
  boxShadow:
    '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)'
}));

function Limit({ setDepth, setCost, setIPRate }: CacheControlProps) {
  return (
    <div>
      <StyledDiv className={styles.limits}>
        <form>
          <label>Max Depth: </label>
          <input
            className={styles.limitsInput}
            type="number"
            placeholder={"15"}
            onChange={(e) => {
              setDepth(Number(e.target.value));
            }}
          />
        </form>
      </StyledDiv>
      <StyledDiv className={styles.limits}>
        <form>
          <label>Max Cost:</label>
          <input
            className={styles.limitsInput}
            type="number"
            placeholder="6000"
            onChange={(e) => {
              setCost(Number(e.target.value));
            }}
          />
        </form>
      </StyledDiv>
      <StyledDiv className={styles.limits}>
        <form>
          <label>Requests /s:</label>
          <input
            className={styles.limitsInput}
            type="number"
            placeholder="22"
            onChange={(e) => {
              setIPRate(+Number(e.target.value));
            }}
          />
        </form>
      </StyledDiv>
    </div>
  );
}

interface BasicSelectProps {
  setQueryChoice: Dispatch<SetStateAction<string>>;
  selectedQuery: string;
}

interface QueryDemoProps {
  responseTimes: number[];
  addResponseTimes: React.Dispatch<React.SetStateAction<any[]>>;
  addErrorAlerts: React.Dispatch<React.SetStateAction<string[]>>;
  setQueryChoice: Dispatch<SetStateAction<string>>;
  selectedQuery: string;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  queryTypes: string[];
  addQueryTypes: React.Dispatch<React.SetStateAction<any[]>>;
  maxDepth: number;
  maxCost: number;
  ipRate: number;
  cacheHit: number;
  cacheMiss: number;
  setCacheHit: Dispatch<SetStateAction<number>>;
  setCacheMiss: Dispatch<SetStateAction<number>>;
  isToggled: boolean;
  visualizerQuery: string;
  setVisualizerQuery: React.Dispatch<React.SetStateAction<string>>;
  setElapsed?: React.Dispatch<React.SetStateAction<{}>>;
  elapsed?: {};
}

interface CacheControlProps {
  setDepth: (val: number) => void;
  setCost: (val: number) => void;
  setIPRate: (val: number) => void;
  addResponseTimes: React.Dispatch<React.SetStateAction<any[]>>;
  cacheHit: number;
  cacheMiss: number;
  setCacheHit: Dispatch<SetStateAction<number>>;
  setCacheMiss: Dispatch<SetStateAction<number>>;
  isToggled?: boolean;
}

export default Demo;
