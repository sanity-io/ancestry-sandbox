import {defineField, defineType, defineArrayMember} from 'sanity'
import { Heading1 } from 'lucide-react'
import { customRichText } from '../definitions/rich-text'

export default defineType({
  name: 'title',
  title: 'Title',
  type: 'object',
  icon: Heading1,
  fields: [
    customRichText([
      "block"
    ], {
      name: "text",
      title: "Title Text"
    }),
    defineField({
      name: 'disclaimers',
      title: 'Disclaimers',
      description: 'Select any disclaimers to display at the bottom of this block',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'disclaimer' }],
        }),
      ],
      validation: (Rule) => Rule.unique(),
    }),
  ],
  preview: {
    select: {
      title: 'text',
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title: Array.isArray(title)
          ? title.map(block => (block.children?.map((child: any) => child.text).join("") ?? "")).join(" ")
          : title || 'Title',
        subtitle: 'Large centered title',
      };
    },
  },
}) 