import {defineField, defineType} from 'sanity'
import {Star} from 'lucide-react'

export default defineType({
  name: 'feature',
  title: 'Feature',
  type: 'document',
  icon: Star,
  initialValue: { __i18n_lang: 'en' },
  fields: [
    defineField({
      name: 'title',
      title: 'Feature',
      description: 'A single feature string',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'A short description of the feature',
      type: 'string',
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: 'ancestryDnaRequired',
      title: 'Requires AncestryDNA Kit',
      description: 'Check if this feature requires an AncestryDNA kit',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
      ancestryDnaRequired: 'ancestryDnaRequired',
    },
    prepare(selection) {
      const { title, description, ancestryDnaRequired } = selection;
      return {
        title,
        subtitle: description ? `${description}${ancestryDnaRequired ? ' (DNA kit required)' : ''}` : (ancestryDnaRequired ? 'DNA kit required' : undefined),
      };
    },
  },
}) 