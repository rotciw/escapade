export default {
  name: 'dateQuestion',
  title: 'Datotekstspørsmål',
  type: 'object',
  fields: [
    {
      name: 'question',
      title: 'Spørsmål',
      type: 'string',
    },
    {
      name: 'answer',
      title: 'Svaret i formatet (DD/MM/YYYY)',
      type: 'string',
    },
  ],
};
