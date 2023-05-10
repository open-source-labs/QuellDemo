import styles from './Visualizer.modules.css';
import { useState, useEffect } from 'react';
import FlowTree from "./FlowTree"

export function Visualizer({ /* TODO - add props here */ }: VisualizerProps) {
    return (
        <div className={styles.graphContainer}>
            <h1>Execution Tree</h1>
            <FlowTree />
        </div>
    );
}

interface VisualizerProps {
    // TODO  - add props here
}