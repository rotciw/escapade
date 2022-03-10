import { ChevronRight } from 'react-feather';

export default {
  name: 'choice',
  title: 'Choice',
  type: 'object',
  icon: ChevronRight,
  description: 'Mulig svar til spørsmålet.',
  fields: [
    {
      name: 'alternative',
      title: 'Alternativ',
      type: 'string',
    },
    {
      name: 'isCorrect',
      title: 'Riktig svar',
      type: 'boolean',
    },
  ],

  preview: {
    select: {
      alternative: 'alternative',
      isCorrect: 'isCorrect',
    },
    prepare({ alternative, isCorrect }) {
      return {
        title: `${alternative}   ${isCorrect ? '✅' : '❌'}`,
      };
    },
  },
};
