import styles from './Visualizer.modules.css';
import { useState, useEffect } from 'react';
import FlowTree from "./FlowTree";
import FlowTable from "./FlowTable";

export function Visualizer({ query }: VisualizerProps) {
    return (
        <div className={styles.graphContainer}>
            <h2>Execution Tree</h2>
            <div className={styles.flowTree}>
                <FlowTree query={query} />
            </div>
            <h2> Execution Table </h2>
            <div className={styles.flowTable}>
                <FlowTable query={query}/>
            </div>
        </div>
    );
}

interface VisualizerProps {
  query: string;
}