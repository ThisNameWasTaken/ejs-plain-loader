import { readFile as _readFile } from 'fs';
import { promisify } from 'util';

const readFilePromise = promisify(_readFile);

/**
 * Reads the file from the given path.
 * @param {string | Buffer | URL} path The path to the file. if a URL is provided, it must use the file: protocol.URL support is experimental. If a file descriptor is provided, the underlying file will not be closed automatically.
 * @param {string | { encoding: string, flag?: string}} options Either the encoding for the result, or an object that contains the encoding and an optional flag. If a flag is not provided, it defaults to 'r'.
 * @returns {Promise<string>} The minified filed content.
 */
export const readFile = async (path, options = 'utf8') => minify(await readFilePromise(path, options));

/**
 * Removes unnecessary whitespace from html like strings.
 * @returns {string}
 */
export const minify = string => string
    .replace(/\s{2,}/g, ' ')        // remove duplicated whitespace
    .replace(/(^\s+|\s+$)/g, '')    // remove whitespace from both ends of the string
    .replace(/\>\s\</g, '><')       // remove whitespace from html tags
    .replace(/(\r|\n)/g, '');       // remove new lines