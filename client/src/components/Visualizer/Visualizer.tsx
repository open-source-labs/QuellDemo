import styles from './Visualizer.modules.css';
import { useState, useEffect } from 'react';
import FlowTree from "./FlowTree"

export function Visualizer({ query }: VisualizerProps) {
    return (
        <div className={styles.graphContainer}>
            <h1>Execution Tree</h1>
            <FlowTree query={query} />
        </div>
    );
}

interface VisualizerProps {
    query: string;
}