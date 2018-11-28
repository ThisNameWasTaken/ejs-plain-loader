import path from 'path';
import { getCompiledOutput, readFile } from './utils';

test('takes plain html as input and outputs it', async () => {
    const folder = 'plain-html';
    const [ejsOutput, htmlOutput] = await Promise.all([
        getCompiledOutput(`./fixtures/${folder}/index.ejs`),
        readFile(path.resolve(__dirname, `./fixtures/${folder}/index.html`), 'utf8')
    ]);
    expect(ejsOutput).toBe(htmlOutput);
});

test('includes ejs partials', async () => {
    const folder = 'include-partials';
    const [ejsOutput, htmlOutput] = await Promise.all([
        getCompiledOutput(`./fixtures/${folder}/index.ejs`),
        readFile(path.resolve(__dirname, `./fixtures/${folder}/index.html`), 'utf8')
    ]);
    expect(ejsOutput).toBe(htmlOutput);
});