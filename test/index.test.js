import path from 'path';
import { getCompiledOutput, readFile } from './utils';

test('Takes plain html as input and outputs it', async () => {
    const [ejsOutput, htmlOutput] = await Promise.all([
        getCompiledOutput('./fixtures/plain-html/index.ejs'),
        readFile(path.resolve(__dirname, './fixtures/plain-html/index.html'), 'utf8')
    ]);
    expect(ejsOutput).toBe(htmlOutput);
});