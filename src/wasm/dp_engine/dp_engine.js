/* @ts-self-types="./dp_engine.d.ts" */

import * as wasm from "./dp_engine_bg.wasm";
import { __wbg_set_wasm } from "./dp_engine_bg.js";
__wbg_set_wasm(wasm);
wasm.__wbindgen_start();
export {
    simulate_query
} from "./dp_engine_bg.js";
