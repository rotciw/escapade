import { Globe, Link } from 'react-feather';
export default {
  name: 'wikiBanks',
  title: 'Wiki banks',
  type: 'document',
  icon: Globe,
  fields: [
    {
      name: 'role',
      title: 'Rollenavn',
      type: 'string',
      description: 'Navnet på rollen',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'id',
      title: 'Id',
      type: 'number',
      description: 'Rekkefølge, lavest kommer først, må samsvare med rolle id i React',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      description: 'Beskrivelse av rollen',
      type: 'text',
    },
    {
      title: 'Table of contents',
      name: 'tableOfContents',
      type: 'array',
      of: [
        {
          type: 'block',
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            // Decorators usually describe a single property – e.g. a typographic
            // preference or highlighting by editors.
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            // Annotations can be any object structure – e.g. a link or a footnote.
            annotations: [
              {
                title: 'ID',
                name: 'id',
                type: 'object',
                blockEditor: {
                  icon: Link,
                },
                fields: [
                  {
                    title: 'Div Id',
                    name: 'divId',
                    description: 'Give this an ID which will be referenced in the text',
                    type: 'string',
                  },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      title: 'Text',
      name: 'text',
      type: 'array',
      of: [
        {
          type: 'block',
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            // Decorators usually describe a single property – e.g. a typographic
            // preference or highlighting by editors.
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            // Annotations can be any object structure – e.g. a link or a footnote.
            annotations: [
              {
                title: 'URL',
                name: 'parentId',
                type: 'object',
                blockEditor: {
                  icon: Link,
                },
                fields: [
                  {
                    title: 'Parent Id',
                    name: 'parentId',
                    description: 'Use the parent id from ToC',
                    type: 'string',
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'youtube',
        },
        {
          type: 'image',
        },
      ],
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
