import styles from "./Demo.modules.css";
import { QueryEditor } from "../Editors/Editors";
import { querySamples } from "../helperFunctions";
import { Graph } from "../Graph/Graph";
import { HitMiss } from "../HitMiss/HitMiss";
import { SuccessfulQuery, BadQuery } from "../Alert/Alert";
import { Quellify, clearCache } from "../../quell-client/src/Quellify";
import { Visualizer } from "../Visualizer/Visualizer";
import { mutationMap } from '../../../../server/schema/schema';

import React, {
  Dispatch,
  memo,
  SetStateAction,
  useState,
  useEffect
} from "react";

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
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ForwardRoundedIcon from "@mui/icons-material/ForwardRounded";

// Memoizing the Demo component to avoid unnecessary re-renders
export const Demo = memo(() => {
  const [responseTimes, addResponseTimes] = useState<number[] | []>([]);
  const [errorAlerts, addErrorAlerts] = useState<string[]>([]);
  const [selectedQuery, setQueryChoice] = useState<string>("2depthArtist");
  const [query, setQuery] = useState<string>(querySamples[selectedQuery]);
  const [queryTypes, addQueryTypes] = useState<string[]>([]);
  const [maxDepth, setDepth] = useState<number>(15);
  const [maxCost, setCost] = useState<number>(6000);
  const [ipRate, setIPRate] = useState<number>(22);
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const [cacheHit, setCacheHit] = useState<number>(0);
  const [cacheMiss, setCacheMiss] = useState<number>(0);
  const [elapsed, setElapsed] = useState<{}>({});

  // State for visualizer toggled
  const [isVisualizer, setIsVisualizer] = useState<boolean>(false);
  const [visualizerQuery, setVisualizerQuery] = useState<string>(query);

  // Handler function to toggle the switch
  function handleToggle(event: React.ChangeEvent<HTMLInputElement>): void {
    setIsToggled(event.target.checked);
  }

  // Handler function to toggle visualizer
  function handleVisualizerToggle(event: React.ChangeEvent<HTMLInputElement>): void {
    setIsVisualizer(event.target.checked);
  }

  return (
    <div
      id="demo"
      className="container bg-darkblue flex flex-col px-6 py-8 mx-auto pt-10 rounded-lg content-start space-y-0"
    >
      <div id={styles.demoHeader} className="scrollpoint">
        <div id="scroll-demo"></div>
        <h1 id={styles.header}>Demo</h1>
        <Box>
          <FormControlLabel
            data-testid="demo-toggle-client-cache-label"
            className="text-white font-sans"
            label="Server-side caching"
            control={<Switch checked={isToggled} onChange={handleToggle} />}
          />
          <FormControlLabel
            data-testid="demo-toggle-visualizer-label"
            className="text-white font-sans"
            label="Visualizer"
            control={
              <Switch
                checked={isVisualizer}
                onChange={handleVisualizerToggle}
              />
            }
          />
        </Box>
      </div>
      <div className="flex flex-col pt-9 gap-10 xl:flex-row">
        <div className="leftContainer flex-1 flex-shrink">
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
        </div>
        <Divider sx={{ zIndex: "50" }} flexItem={true} orientation="vertical" />
        <div className="flex-1 flex-grow overflow-x-auto">
          {isVisualizer ? (
            <Visualizer query={visualizerQuery} elapsed={elapsed} />
          ) : (
            <div>
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
              <Divider className="p-1" orientation="horizontal" />
              <Graph
                responseTimes={responseTimes}
                selectedQuery={selectedQuery}
                queryTypes={queryTypes}
              />
              <HitMiss cacheHit={cacheHit} cacheMiss={cacheMiss} />
            </div>
          )}
        </div>
        <>
          {responseTimes.map((el, i) => {
            return <SuccessfulQuery key={i} />;
          })}
          {errorAlerts.map((el, i) => {
            console.log("ERROR: ", el);
            return <BadQuery errorMessage={el} key={i} />;
          })}
        </>
      </div>
    </div>
  );
});

// QueryDemo Component that displays a demo query and allows users to submit queries. 
// It takes various props for querying and visualizations, and utilizes the useEffect hook 
// for setting the query based on the selected query type.
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
  elapsed,
}: QueryDemoProps) {

  // Use the useEffect hook to update the query when the selected query type changes
  useEffect(() => {
    setQuery(querySamples[selectedQuery]);
  }, [selectedQuery, setQuery]);

  // Initialize the state for the response
  const [response, setResponse] = useState<string>("");

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
    Quellify("/api/graphql", query, { maxDepth, maxCost, ipRate }, mutationMap)
      .then((res) => {
        // Set the visualizer query with the query used.
        setVisualizerQuery(query);
        // Calculate the time taken for the response and store it
        const responseTime: number = new Date().getTime() - startTime;
        addResponseTimes([...responseTimes, responseTime]);
        const queryType: string = selectedQuery;
        // Store the type of query executed
        addQueryTypes([...queryTypes, queryType]);
         // Check if the response is an array and process accordingly
        if (Array.isArray(res)) {
          // Extract the first element of the response array and type cast it to an object.
          let responseObj = res[0] as Record<string, any>;
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
          } else if (res[1] === true) {
            setCacheHit(cacheHit + 1);
          }
        }
      })
      .then(() => {
        // Make an API call to fetch the query execution time.
        fetch("/api/queryTime")
          .then((res) => res.json())
          .then((time: { [key: string]: number }) => {
            // If setElapsed is defined, set the elapsed time with the fetched time.
            if (setElapsed) {
              setElapsed(time.time);
            }
          });
      })
      .catch((err: string) => {
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

  // Type for the query response
  type QueryResponse = {
    data: {
      [key: string]: unknown;
    };
    cached: boolean;
  };

  // Type for the API response
  type ApiResponse = {
    queryResponse: QueryResponse;
  };

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
    let resError: string;
    fetch("/api/graphql", fetchOptions)
      .then((res: Response) => res.json())
      .then((res: ApiResponse) => {
        setVisualizerQuery(query);
        const responseTime: number = new Date().getTime() - startTime;
        addResponseTimes([...responseTimes, responseTime]);
        setResponse(JSON.stringify(res.queryResponse.data, null, 2));
        if (res.queryResponse.cached === true) setCacheHit(cacheHit + 1);
        else setCacheMiss(cacheMiss + 1);
      })
      .then(() => {
        fetch("/api/queryTime")
          .then((res) => res.json())
          .then((time: { [key: string]: number }) => {
            if (setElapsed) {
              setElapsed(time.time);
            }
          });
      })
      .catch((err: string) => {
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

  return (
    <div spellCheck="false">
      <DemoControls
        selectedQuery={selectedQuery}
        setQueryChoice={setQueryChoice}
        submitQuery={isToggled ? submitServerQuery : submitClientQuery}
      />
      <div>
        <QueryEditor selectedQuery={selectedQuery} setQuery={setQuery} />
      </div>
      <h3 className="text-white text-center">See your query results: </h3>
      <div className="max-h-30 border-1 border-white p-5">
        <TextField
          id={styles.queryText}
          multiline={true}
          fullWidth={true}
          InputProps={{ className: styles.queryInput }}
          rows="20"
          value={response}
        ></TextField>
      </div>
    </div>
  );
}

// Interface for DemoControls component props
interface DemoControls {
  selectedQuery: string;
  setQueryChoice: Dispatch<SetStateAction<string>>;
  submitQuery: () => void;
}

// The DemoControls component is used to select a query and submit it.
// It accepts properties such as selectedQuery, setQueryChoice, and submitQuery.
const DemoControls = ({
  selectedQuery,
  setQueryChoice,
  submitQuery,
}: DemoControls) => {
  return (
    <div className="min-w-full flex flex-col gap-5 text-white items-center">
      <h3>Select a query to test: </h3>
      <QuerySelect
        setQueryChoice={setQueryChoice}
        selectedQuery={selectedQuery}
      />
      <Button
        endIcon={<ForwardRoundedIcon />}
        id={styles.submitQuery}
        onClick={() => submitQuery()}
        size="small"
        color="secondary"
        variant="contained"
      >
        Query
      </Button>
    </div>
  );
};

// The CacheControls component is used for controlling the cache and resetting the graph.
// It accepts various properties like setDepth, setCost, setIPRate, addResponseTimes, setCacheHit, setCacheMiss, etc.
const CacheControls = ({
  setDepth,
  setCost,
  setIPRate,
  addResponseTimes,
  setCacheHit,
  setCacheMiss,
  cacheHit,
  cacheMiss,
  isToggled,
}: CacheControlProps) => {
  // Function to reset the graph
  // Resets both Hit/Miss Graph & Pie Graph
  function resetGraph() {
    addResponseTimes([]);
    clearCache();
    isToggled ? clearServerCache() : clearClientCache();
    setCacheHit((cacheHit = 0));
    setCacheMiss((cacheMiss = 0));
  }

  // Function to clear the client cache
  const clearClientCache = () => {
    addResponseTimes([]);
    setCacheHit((cacheHit = 0));
    setCacheMiss((cacheMiss = 0));
    return clearCache();
  };

  // Function to clear the server cache
  const clearServerCache = () => {
    fetch("/api/clearCache").then((res) =>
      console.log("Cleared Server Cache!")
    );
    addResponseTimes([]);
    setCacheHit((cacheHit = 0));
    setCacheMiss((cacheMiss = 0));
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
          size="small"
          color="secondary"
          variant="contained"
        >
          Clear {isToggled ? "Server" : "Client"} Cache
        </Button>
        <Button
          onClick={resetGraph}
          className={styles.button}
          size="small"
          color="secondary"
          variant="contained"
        >
          Reset Graph
        </Button>
      </Stack>
      {isToggled ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
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
    // this state is controlled by the demoControls aka the parent component
    setQueryChoice(event.target.value as string);
  };

  return (
    <Box className="text-center min-w-[90%]">
      <FormControl fullWidth>
        <InputLabel
          id="demo-simple-select-label"
          style={{ color: "white", borderStyle: "white" }}
        >
          Query
        </InputLabel>
        <Select
          style={{ color: "white" }}
          labelId="demo-simple-select-label"
          value={selectedQuery}
          defaultValue={selectedQuery}
          label="Query"
          onChange={handleChange}
        >
          <MenuItem className={styles.menuListItem} value={"2depthArtist"}>2-Depth: Artist</MenuItem>
          <MenuItem className={styles.menuListItem} value={"2depthAlbum"}>2-Depth: Album</MenuItem>
          <MenuItem className={styles.menuListItem} value={"2depthSong"}>2-Depth: Song</MenuItem>
          <MenuItem className={styles.menuListItem} value={"2depthCity"}>2-Depth: City</MenuItem>
          <MenuItem className={styles.menuListItem} value={"2depthCountry"}>2-Depth: Country</MenuItem>
          <MenuItem className={styles.menuListItem} value={"2depthAttraction"}>2-Depth: Attraction</MenuItem>
          <hr />
          <MenuItem className={styles.menuListItem} value={"3depthCountry"}>3-Depth: Country, Cities & Attractions</MenuItem>
          <MenuItem className={styles.menuListItem} value={"3depthArtist"}>3-Depth: Artist, Albums & Songs</MenuItem>
          <hr />
          <MenuItem className={styles.menuListItem} value={"costly"}>Costly</MenuItem>
          <MenuItem className={styles.menuListItem} value={"nested"}>Nested</MenuItem>
          <MenuItem className={styles.menuListItem} value={"fragment"}>Fragment</MenuItem>
          <hr />
          <MenuItem className={styles.menuListItem} value={"mutationAddCity"}>Mutation - Add: City</MenuItem>
          <MenuItem className={styles.menuListItem} value={"mutationAddCountry"}>Mutation - Add: Country</MenuItem>
          <MenuItem className={styles.menuListItem} value={"mutationAddArtist"}>Mutation - Add: Artist</MenuItem>
          <MenuItem className={styles.menuListItem} value={"mutationAddAlbum"}>Mutation - Add: Album</MenuItem>
          <MenuItem className={styles.menuListItem} value={"mutationAddSong"}>Mutation - Add: Song</MenuItem>
          <hr />
          <MenuItem className={styles.menuListItem} value={"mutationDeleteCity"}>Mutation - Delete: City</MenuItem>
          <MenuItem className={styles.menuListItem} value={"mutationDeleteAlbum"}>Mutation - Delete: Album</MenuItem>
          <MenuItem className={styles.menuListItem} value={"mutationDeleteArtist"}>Mutation - Delete: Artist</MenuItem>
          <hr />
          <MenuItem className={styles.menuListItem} value={"mutationEditArtist"}>Mutation - Edit: Artist</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

// StyledDiv component with custom styles using styled-components library
const StyledDiv = styled("div")(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: theme.palette.primary.main,
  borderRadius: "5px",
  fontSmooth: "always",
  color: "white",
  boxShadow:
    "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
}));

// Limit component - displays limit inputs for max depth, max cost, and IP rate
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
          <label>Max Cost: </label>
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
          <label>Requests /s: </label>
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

// Interface for props of the BasicSelect component
interface BasicSelectProps {
  setQueryChoice: Dispatch<SetStateAction<string>>;
  selectedQuery: string;
}

// Interface for props of the QueryDemo component
interface QueryDemoProps {
  responseTimes: number[]; // Array of response times
  addResponseTimes: React.Dispatch<React.SetStateAction<any[]>>; // Function to add response times
  addErrorAlerts: React.Dispatch<React.SetStateAction<string[]>>; // Function to add error alerts
  setQueryChoice: Dispatch<SetStateAction<string>>; // Function to set the selected query
  selectedQuery: string; // Currently selected query
  query: string; // Query string
  setQuery: React.Dispatch<React.SetStateAction<string>>; // Function to set the query string
  queryTypes: string[]; // Array of query types
  addQueryTypes: React.Dispatch<React.SetStateAction<any[]>>; // Function to add query types
  maxDepth: number; // Maximum depth for the query
  maxCost: number; // Maximum cost for the query
  ipRate: number; // IP rate for the query
  cacheHit: number; // Number of cache hits
  cacheMiss: number; // Number of cache misses
  setCacheHit: Dispatch<SetStateAction<number>>; // Function to set the number of cache hits
  setCacheMiss: Dispatch<SetStateAction<number>>; // Function to set the number of cache misses
  isToggled: boolean; // Toggle for client/server query mode
  visualizerQuery: string; // Query string for visualizer
  setVisualizerQuery: React.Dispatch<React.SetStateAction<string>>; // Function to set the visualizer query string
  setElapsed?: React.Dispatch<React.SetStateAction<{}>>; // Function to set the elapsed time
  elapsed?: {}; // Elapsed time
}

// Interface for the props of the CacheControl component
interface CacheControlProps {
  setDepth: (val: number) => void; // Function to set the depth value
  setCost: (val: number) => void; // Function to set the cost value
  setIPRate: (val: number) => void; // Function to set the IP rate value
  addResponseTimes: React.Dispatch<React.SetStateAction<any[]>>; // Function to add response times
  cacheHit: number; // Number of cache hits
  cacheMiss: number; // Number of cache misses
  setCacheHit: Dispatch<SetStateAction<number>>; // Function to set the number of cache hits
  setCacheMiss: Dispatch<SetStateAction<number>>; // Function to set the number of cache misses
  isToggled?: boolean; // Toggle for client/server query mode (optional)
}

export default Demo;
