import path from 'path';
import { getCompiledOutput, readFile } from './utils';

/**
 * @param {string} folder - The folder inside the fixtures folder to get the output from
 * @returns {Promise<[string, string]>} - EJS output and HTML output respectively
 */
const getOutputs = folder => Promise.all([
    getCompiledOutput(`./fixtures/${folder}/index.ejs`),
    readFile(path.resolve(__dirname, `./fixtures/${folder}/index.html`), 'utf8')
]);

test('takes plain html as input and outputs it', async () => {
    const [ejsOutput, htmlOutput] = await getOutputs('plain-html');
    expect(ejsOutput).toBe(htmlOutput);
});

test('includes ejs partials', async () => {
    const [ejsOutput, htmlOutput] = await getOutputs('include-partials');
    expect(ejsOutput).toBe(htmlOutput);
});