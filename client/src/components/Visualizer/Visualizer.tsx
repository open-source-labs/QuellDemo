import styles from './Visualizer.modules.css';
import { useState, useEffect } from 'react';
import FlowTree from "./FlowTree";
import FlowTable from "./FlowTable";

export function Visualizer({ query }: VisualizerProps) {
    return (
        <div className={styles.graphContainer}>
            <h2>Execution Tree</h2>
            <FlowTree query={query} />
            <FlowTable query={query}/>
        </div>
    );
}

interface VisualizerProps {
    query: string;
}