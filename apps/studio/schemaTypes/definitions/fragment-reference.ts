import {defineField, defineType} from 'sanity'
import {Tag} from 'lucide-react'
import {InlineFragmentSelector} from '../../components/inline-fragment-selector'

export default defineType({
  name: 'inlineFragmentReference',
  title: 'Fragment Reference',
  type: 'object',
  icon: Tag,
  description: 'Reference to a content fragment that will display its current value',
  fields: [
    defineField({
      name: 'collection',
      title: 'Fragment Collection',
      description: 'Select the collection containing the fragment',
      type: 'reference',
      to: [{type: 'fragmentCollection'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fragment',
      title: 'Fragment',
      description: 'Select the specific fragment from the collection',
      type: 'string',
      validation: (Rule) => Rule.required(),
      components: {
        input: InlineFragmentSelector
      },
    }),
    defineField({
      name: 'displayFormat',
      title: 'Display Format',
      description: 'How to display the fragment value',
      type: 'string',
      options: {
        list: [
          {title: 'Value only', value: 'value-only'},
          {title: 'Label: Value', value: 'label-value'},
          {title: 'Value (Label)', value: 'value-label'},
        ],
      },
      initialValue: 'value-only',
    }),
  ],
  preview: {
    select: {
      collection: 'collection.title',
      fragment: 'fragment',
      displayFormat: 'displayFormat',
    },
    prepare({collection, fragment, displayFormat}) {
      return {
        title: `Fragment: ${fragment || 'No fragment selected'}`,
        subtitle: `${collection || 'No collection'} • ${displayFormat || 'value-only'}`,
        media: Tag,
      }
    },
  },
})
