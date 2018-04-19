const path = require('path');

module.exports = {
    entry: {
        'random-sentence-generator-bundle.js': './random-sentence-generator.js',
    },
    output: {
        path: path.resolve(__dirname),
        filename: '[name]'
    }
};