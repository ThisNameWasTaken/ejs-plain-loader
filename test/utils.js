/**
 * Removes unnecessary whitespace from html like strings.
 * @returns {string}
 */
export const minify = string => string
    .replace(/\s{2,}/g, ' ')        // remove duplicated whitespace
    .replace(/(^\s+|\s+$)/g, '')    // remove whitespace from both ends of the string
    .replace(/\>\s\</g, '><')       // remove whitespace from html tags
    .replace(/(\r|\n)/g, '');       // remove new lines