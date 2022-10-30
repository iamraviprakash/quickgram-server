import fs from 'fs';
import _ from 'lodash';

// Read the files list in the current directory
const files = fs.readdirSync(__dirname);

export default (context) => {
  const mergedLoaders = {};

  // Merge all loaders of the present files in the current directory
  files.forEach((file) => {
    if (file !== 'index.js') {
      const { default: loaders } = require(`${__dirname}/${file}`);

      _.merge(mergedLoaders, loaders(context));
    }
  });

  return mergedLoaders;
};
