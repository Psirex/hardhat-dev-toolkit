import * as events from "./events";
import * as launch from "./lifecycle";
import * as script from "./vote-script";
import * as testing from "./test-helpers";
import * as inspect from "./trace";
import * as parser from "./evm-script-parser";

export default {
    events,
    launch,
    script: {...script, ...parser},
    testing,
    inspect
}
