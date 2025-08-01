import {defineField, defineType} from 'sanity'
import { AlertTriangle } from 'lucide-react'

export default defineType({
  name: 'disclaimer',
  title: 'Disclaimer',
  type: 'document',
  icon: AlertTriangle,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'A short label for this disclaimer',
      type: 'string',
      validation: (Rule) => Rule.required().min(2),
    }),
    defineField({
      name: 'text',
      title: 'Disclaimer Text',
      description: 'The disclaimer message (rich text allowed)',
      type: 'richText',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      text: 'text',
    },
    prepare(selection) {
      const { title, text } = selection;
      // Extract plain text from the first block, if available
      let subtitle = '';
      if (Array.isArray(text) && text.length > 0 && text[0].children) {
        subtitle = text[0].children.map((child: any) => child.text).join('');
      }
      return {
        title: title || 'Disclaimer',
        subtitle,
      };
    },
  },
}) 