import path from 'path';
import webpack from 'webpack';
import memoryfs from 'memory-fs';

export default (fixturePath, options = {}) => {
    const compiler = webpack({
        context: __dirname,
        entry: fixturePath,
        output: {
            path: path.resolve(__dirname),
            filename: '[name].ejs',
        },
        module: {
            rules: [{
                test: /\.ejs$/,
                use: [{
                    loader: 'html-loader'
                }, {
                    loader: path.resolve(__dirname, './../lib/index.js')
                }]
            }]
        }
    });

    compiler.outputFileSystem = new memoryfs();

    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err || stats.hasErrors()) reject(err);

            resolve(stats);
        });
    });
};