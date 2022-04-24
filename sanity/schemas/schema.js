// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator';

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type';

import gameMaps from './documents/gameMaps';
import multipleChoiceQuestion from './objects/multipleChoiceQuestion';
import answer from './objects/answer';
import choice from './objects/choice';
import round from './objects/round';
import stringDateQuestion from './objects/stringDateQuestion';
import mapPointerQuestion from './objects/mapPointerQuestion';
import wikiBanks from './documents/wikiBanks';
import youtube from './objects/youtube';

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    gameMaps,
    round,
    choice,
    answer,
    multipleChoiceQuestion,
    stringDateQuestion,
    mapPointerQuestion,
    wikiBanks,
    youtube,
  ]),
});
