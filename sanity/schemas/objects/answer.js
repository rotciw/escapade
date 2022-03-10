import { Hexagon } from 'react-feather';
export default {
  name: 'answer',
  title: 'Answer',
  type: 'object',
  icon: Hexagon,
  description: 'An answer submitted to a question. Refers to a Player, Question and Choice',
  fields: [
    {
      name: 'questionKey',
      title: 'Svaret i formatet (DD/MM/YYYY)',
      type: 'string',
    },
  ],
};
