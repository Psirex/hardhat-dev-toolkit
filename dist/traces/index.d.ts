export * from "./traces";
import { trace } from "./traces";
declare const _default: {
    trace: typeof trace;
    hardhat: {
        setup: () => void;
        enableTracing: () => void;
        disableTracing: () => void;
        isTracingEnabled: () => boolean;
    };
};
export default _default;
