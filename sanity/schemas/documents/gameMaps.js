import { Map } from 'react-feather';
export default {
  name: 'gameMaps',
  title: 'Maps',
  type: 'document',
  icon: Map,
  fields: [
    {
      name: 'title',
      title: 'Tema',
      type: 'string',
      description: 'Temaet må være unikt',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'id',
      title: 'Id',
      type: 'number',
      description: 'Rekkefølge, lavest kommer først',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      description: 'Beskrivelse av teamet',
      type: 'string',
    },
    {
      name: 'questionSet',
      title: 'Runde',
      type: 'array',
      of: [{ type: 'round' }],
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
