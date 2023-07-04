import styles from './Visualizer.modules.css';
import FlowTree from "./FlowTree";
import FlowTable from "./FlowTable";

export function Visualizer({ query, elapsed }: VisualizerProps) {
    return (
        <div className="flex flex-col justify-center items-center gap-5">
            <h2 className="text-center text-white">Execution Tree</h2>
            <div className="bg-gray-700 h-96 w-[90%] rounded-lg">
                <FlowTree query={query} elapsed={elapsed} />
            </div>
            <h2 className="text-center text-white"> Execution Table </h2>
            <div className="w-[90%] rounded-lg overflow-hidden">
                <FlowTable query={query} elapsed={elapsed}/>
            </div>
        </div>
    );
}

interface VisualizerProps {
    query: string;
    elapsed: {};
}