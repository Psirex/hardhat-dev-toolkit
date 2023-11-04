"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emits = exports.subsequence = exports.group = exports.event = void 0;
const ethers_1 = require("ethers");
const bytes_1 = __importDefault(require("../common/bytes"));
const contracts_1 = __importDefault(require("../contracts"));
class EventFragmentNotFoundError extends Error {
    constructor(name, contract) {
        super(`EventFragment ${name} not found in the ${contracts_1.default.label(contract)} (${contracts_1.default.address(contract)})`);
    }
}
const EMPTY_INTERFACE = new ethers_1.Interface([]);
function event(contract, event, { args, emitter: address } = {}) {
    const fragment = contract.getEvent(event).fragment;
    if (!fragment) {
        throw new EventFragmentNotFoundError(event, contract);
    }
    return {
        args,
        fragment,
        address: contracts_1.default.address(address ?? contract),
    };
}
exports.event = event;
function group(events, defaultName = "Untitled") {
    const eventGroups = [];
    for (const eventOrName of events) {
        if (typeof eventOrName === "string") {
            eventGroups.push({ name: eventOrName, events: [] });
        }
        else {
            if (!eventGroups[eventGroups.length - 1]) {
                eventGroups.push({ name: defaultName, events: [] });
            }
            eventGroups[eventGroups.length - 1].events.push(eventOrName);
        }
    }
    return eventGroups;
}
exports.group = group;
function subsequence(logs, subsequence, fromIndex) {
    const result = new Array(subsequence.length).fill(-1);
    let eventsIndex = 0;
    for (let logsIndex = fromIndex; logsIndex < logs.length; ++logsIndex) {
        if (eventsIndex === subsequence.length)
            break;
        const log = logs[logsIndex];
        const { fragment, address, args } = subsequence[eventsIndex];
        if (!bytes_1.default.isEqual(log.address, address))
            continue;
        if (!bytes_1.default.isEqual(log.topics[0], fragment.topicHash))
            continue;
        if (args && !isArgsMatches(log, fragment, args))
            continue;
        result[eventsIndex] = logsIndex;
        eventsIndex += 1;
    }
    return result;
}
exports.subsequence = subsequence;
function isArgsMatches(log, fragment, eventArgs) {
    const { args: logArgs } = new ethers_1.EventLog(log, EMPTY_INTERFACE, fragment);
    if (eventArgs.length !== logArgs.length)
        return false;
    for (let i = 0; i < eventArgs.length; ++i) {
        const logArg = logArgs[i];
        const eventArg = eventArgs[i];
        if (eventArg === undefined)
            continue;
        const eventArgValue = eventArg instanceof ethers_1.BaseContract ? contracts_1.default.address(eventArg) : eventArg;
        // TODO: comparision of different types
        if (logArg == eventArgValue)
            continue;
        if (!bytes_1.default.isValid(logArg) && !bytes_1.default.isValid(eventArgValue))
            return false;
        if (!bytes_1.default.isEqual(logArg, eventArgValue))
            return false;
    }
    return true;
}
/*

// log [1,2,3,4,5,6]
// events []
// result -> subsequence

*/
function emits(receipt, events, fromIndex = 0) {
    const { logs } = receipt;
    const eventGroups = group(events);
    for (let { name, events } of eventGroups) {
        if (events.length === 0)
            continue;
        const logIndices = subsequence(logs, events, fromIndex);
        const notFoundEventIndex = logIndices.findIndex((ind) => ind === -1);
        if (notFoundEventIndex !== -1) {
            const event = events[notFoundEventIndex];
            throw new Error(`${name ? `group: "${name} "` : ""}, address="${event.address}", event="${formatEvent(event)}" not found`);
        }
        fromIndex = logIndices[logIndices.length - 1] + 1;
    }
    return fromIndex;
}
exports.emits = emits;
function formatEvent(event) {
    const { fragment, args } = event;
    const namedArgs = fragment.inputs
        .map((input, index) => {
        const arg = (args?.[index] instanceof ethers_1.BaseContract
            ? contracts_1.default.address(args[index])
            : args?.[index]) ?? "undefined";
        return `${input.name}=${arg}`;
    })
        .join(", ");
    return `${fragment.name}(${namedArgs})`;
}
