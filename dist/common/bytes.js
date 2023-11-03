"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @param bytes - bytes sequence represented as string (might be prefixed with 0x or not)
 * @returns normalized (all characters are in lower case and prefixed with 0x) version of the bytes
 */
function normalize(bytes) {
    return prefix0x(bytes.toLowerCase());
}
/**
 * @param bytes - bytes sequence represented as string (might be prefixed with 0x or not)
 * @returns the prefixed version of the `bytes` string. If it was prefixed already returns the same value
 */
function prefix0x(bytes) {
    return is0xPrefixed(bytes) ? bytes : ("0x" + bytes);
}
function strip0x(bytes) {
    return bytes.startsWith("0x") ? bytes.slice(2) : bytes;
}
function join(...bytes) {
    return prefix0x(bytes.reduce((res, b) => res + strip0x(b), ""));
}
function slice(bytes, startIndex, endIndex) {
    return prefix0x(strip0x(bytes).slice(startIndex ? 2 * startIndex : startIndex, endIndex ? 2 * endIndex : endIndex));
}
function toBigInt(bytes) {
    return BigInt(prefix0x(bytes));
}
function toInt(bytes) {
    const asBigInt = toBigInt(bytes);
    if (asBigInt > Number.MAX_SAFE_INTEGER) {
        throw new Error(`Int overflow: ${asBigInt} > ${Number.MAX_SAFE_INTEGER}. Use cast to BigInt instead`);
    }
    return Number(asBigInt);
}
function length(bytes) {
    const stripped = strip0x(bytes);
    if (stripped.length % 2 !== 0) {
        throw new Error(`Invalid bytes length. ${stripped.length} % 2 !== 0`);
    }
    return stripped.length / 2;
}
function encode(value) {
    return prefix0x(value.toString(16));
}
function padStart(bytes, bytesLength, fill = "00") {
    return strip0x(bytes).padStart(bytesLength * 2, fill);
}
function isEqual(bytes1, bytes2) {
    return strip0x(bytes1).toLowerCase() === strip0x(bytes2).toLowerCase();
}
function isValid(bytes) {
    if (typeof bytes !== "string")
        return false;
    const stripped = strip0x(bytes);
    return stripped.length % 2 === 0 && /^[a-fA-f0-9]+$/.test(strip0x(bytes));
}
function is0xPrefixed(bytes) {
    return bytes.startsWith("0x");
}
exports.default = {
    join,
    slice,
    encode,
    strip0x,
    prefix0x,
    toInt,
    toBigInt,
    length,
    padStart,
    isEqual,
    isValid,
    normalize,
};
