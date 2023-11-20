/**
 * Resolves dir relative to the project root
 * @param path - path to create if it is not exist
 */
declare function touchDir(dirPath: string): Promise<void>;
declare const _default: {
    touchDir: typeof touchDir;
};
export default _default;
