import { Folder } from 'react-feather';
export default {
  name: 'multipleChoiceQuestion',
  title: 'Flervalgsspørsmål',
  type: 'object',
  icon: Folder,
  description: 'Spørsmål med flere alternativer.',
  fields: [
    {
      name: 'question',
      title: 'Spørsmål',
      type: 'string',
    },
    {
      name: 'choices',
      title: 'Answer choices',
      type: 'array',
      of: [{ type: 'choice' }],
    },
  ],
};
