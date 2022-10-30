import fs from 'fs';
import _ from 'lodash';

// Read the files list in the current directory
const files = fs.readdirSync(__dirname);

export default (context) => {
  const mergedGetters = {};

  // Merge all getter functions of the present files in the current directory
  files.forEach((file) => {
    if (file !== 'index.js') {
      const { default: getter } = require(`${__dirname}/${file}`);
      _.merge(mergedGetters, getter(context));
    }
  });

  return { getters: mergedGetters };
};
