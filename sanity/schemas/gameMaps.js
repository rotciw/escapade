export default {
  name: 'gameMaps',
  title: 'Maps',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Tema',
      type: 'string',
      description: 'Temaet må være unik',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'id',
      title: 'Id',
      type: 'number',
      description: 'Rekkefølge',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      description: 'Beskrivelse av teamet',
      type: 'string',
    },
    {
      name: 'questions1',
      title: 'Spørsmål til bilde 1',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'image1',
      title: 'Bilde 1',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          type: 'text',
          name: 'alt',
          title: 'Alternativ tekst',
          description: `Some of your visitors cannot see images,
            be they blind, color-blind, low-sighted;
            alternative text is of great help for those
            people that can rely on it to have a good idea of
            what\'s on your page.`,
          options: {
            isHighlighted: true,
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'answer1',
      title: 'Svar til bilde 1',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'questions2',
      title: 'Spørsmål til bilde 2',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'image2',
      title: 'Bilde 2',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          type: 'text',
          name: 'alt',
          title: 'Alternativ tekst',
          description: `Some of your visitors cannot see images,
            be they blind, color-blind, low-sighted;
            alternative text is of great help for those
            people that can rely on it to have a good idea of
            what\'s on your page.`,
          options: {
            isHighlighted: true,
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'answer2',
      title: 'Svar til bilde 2',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
  ],
  orderings: [
    {
      title: 'Id order, asc',
      name: 'orderAsc',
      by: [{ field: 'id', direction: 'asc' }],
    },
  ],
};
