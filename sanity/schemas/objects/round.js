import { RotateCw } from 'react-feather';
export default {
  name: 'round',
  title: 'Runde',
  type: 'object',
  icon: RotateCw,
  description: 'En runde har tre bilder med spørsmål',
  fields: [
    {
      name: 'roundId',
      title: 'Rundenummer',
      type: 'number',
    },
    {
      name: 'roundTime',
      title: 'Rundetid (i minutter)',
      type: 'number',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'images',
      title: 'Bilder',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'multipleChoiceQuestion',
      title: 'Flervalgsspørsmål',
      type: 'object',
      type: 'multipleChoiceQuestion',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'stringDateQuestion',
      title: 'Datotekstspørsmål',
      type: 'object',
      type: 'dateQuestion',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'mapPointerQuestion',
      title: 'Kartpekerspørsmål',
      type: 'object',
      type: 'mapQuestion',
      validation: (Rule) => Rule.required(),
    },
  ],
};
