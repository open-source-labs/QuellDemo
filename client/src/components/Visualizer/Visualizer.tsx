import styles from './Visualizer.modules.css';
import { useState, useEffect } from 'react';

export function Visualizer({ /* TODO - add props here */ }: VisualizerProps) {
    return (
        <div className={styles.graphContainer}>
            <h1>Execution Tree</h1>
            {/* TODO - add graph here */}
        </div>
    );
}

interface VisualizerProps {
    // TODO  - add props here
}