export type HexStrNonPrefixed = string;
export type HexStrPrefixed = `0x${HexStrNonPrefixed}`;
export type HexStr = HexStrPrefixed | HexStrNonPrefixed;
/**
 * @param bytes - bytes sequence represented as string (might be prefixed with 0x or not)
 * @returns normalized (all characters are in lower case and prefixed with 0x) version of the bytes
 */
declare function normalize<T extends HexStr>(bytes: T): HexStrPrefixed;
/**
 * @param bytes - bytes sequence represented as string (might be prefixed with 0x or not)
 * @returns the prefixed version of the `bytes` string. If it was prefixed already returns the same value
 */
declare function prefix0x<T extends HexStr>(bytes: T): HexStrPrefixed;
declare function strip0x(bytes: HexStr): HexStrNonPrefixed;
declare function join(...bytes: HexStr[]): HexStrPrefixed;
declare function slice(bytes: HexStr, startIndex?: number, endIndex?: number): HexStrPrefixed;
declare function toBigInt(bytes: HexStr): bigint;
declare function toInt(bytes: HexStr): number;
declare function length(bytes: HexStr): number;
declare function encode<T extends number | bigint>(value: T): `0x${string}`;
declare function padStart(bytes: HexStr, bytesLength: number, fill?: HexStr): string;
declare function isEqual(bytes1: HexStr, bytes2: HexStr): boolean;
declare function isValid(bytes: unknown): bytes is HexStr;
declare const _default: {
    join: typeof join;
    slice: typeof slice;
    encode: typeof encode;
    strip0x: typeof strip0x;
    prefix0x: typeof prefix0x;
    toInt: typeof toInt;
    toBigInt: typeof toBigInt;
    length: typeof length;
    padStart: typeof padStart;
    isEqual: typeof isEqual;
    isValid: typeof isValid;
    normalize: typeof normalize;
};
export default _default;
