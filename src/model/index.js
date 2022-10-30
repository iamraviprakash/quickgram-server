import fs from 'fs';
import _ from 'lodash';

const mergedModels = {};

// Read the files list in the current directory
const files = fs.readdirSync(__dirname);

// Merge all model functions of the present files in the current directory
files.forEach((file) => {
  if (file !== 'index.js') {
    const { default: data } = require(`${__dirname}/${file}`);
    _.merge(mergedModels, data);
  }
});

export default mergedModels;
