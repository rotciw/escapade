export default {
  name: 'mapQuestion',
  title: 'Kartpekerspørsmål',
  type: 'object',
  fields: [
    {
      name: 'question',
      title: 'Spørsmål',
      type: 'string',
    },
    {
      name: 'answer',
      title: 'Svaret i formatet ',
      type: 'geopoint',
    },
  ],
};
