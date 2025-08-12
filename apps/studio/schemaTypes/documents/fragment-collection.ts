import {defineField, defineType} from 'sanity'
import {FolderOpen} from 'lucide-react'

export default defineType({
  name: 'fragmentCollection',
  title: 'Fragment Collection',
  type: 'document',
  icon: FolderOpen,
  description: 'A collection of reusable text fragments that can be referenced throughout the site',
  fields: [
    defineField({
      name: 'title',
      title: 'Collection Title',
      description: 'A descriptive name for this collection of fragments',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'key',
      title: 'Collection Key',
      description: 'A unique identifier for this collection (used in fragment references)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'Optional description of what this collection is used for',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'fragments',
      title: 'Fragments',
      description: 'The individual text fragments in this collection',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'fragment',
          title: 'Fragment',
          fields: [
            defineField({
              name: 'label',
              title: 'Fragment Label',
              description: 'A human-readable name for this fragment',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'key',
              title: 'Fragment Key',
              description: 'A unique identifier for this fragment within the collection',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Fragment Value',
              description: 'The actual text content that will be displayed when this fragment is referenced',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'isActive',
              title: 'Active',
              description: 'Whether this fragment is currently active and should be displayed',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'notes',
              title: 'Notes',
              description: 'Optional internal notes about this fragment',
              type: 'text',
              rows: 2,
            }),
          ],
          preview: {
            select: {
              label: 'label',
              key: 'key.current',
              value: 'value',
              isActive: 'isActive',
            },
            prepare({label, key, value, isActive}) {
              const truncatedValue = value && value.length > 50 ? `${value.substring(0, 50)}...` : value
              return {
                title: label || 'Unnamed Fragment',
                subtitle: `${key || 'No key'} • ${isActive ? 'Active' : 'Inactive'} • ${truncatedValue || 'No value'}`,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'isActive',
      title: 'Collection Active',
      description: 'Whether this collection is currently active and can be referenced',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      key: 'key.current',
      fragmentCount: 'fragments',
      isActive: 'isActive',
    },
    prepare({title, key, fragmentCount, isActive}) {
      const count = Array.isArray(fragmentCount) ? fragmentCount.length : 0
      return {
        title: title || 'Untitled Collection',
        subtitle: `${key || 'No key'} • ${count} fragment${count !== 1 ? 's' : ''} • ${isActive ? 'Active' : 'Inactive'}`,
        media: FolderOpen,
      }
    },
  },
})
