import { mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';

// Load all files from schema directory
const typeDefsList = loadFilesSync(__dirname, { ignoreIndex: true });

// Merge all loaded type defs
const mergedTypeDefs = mergeTypeDefs(typeDefsList);

export default mergedTypeDefs;
