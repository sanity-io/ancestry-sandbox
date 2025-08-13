import {defineField, defineType} from 'sanity'
import {FolderOpen} from 'lucide-react'
import {FragmentReferencesPopulator} from '../../components/fragment-references-populator'

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
          ],
          preview: {
            select: {
              label: 'label',
              key: 'key',
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
    defineField({
      name: 'fragmentReferences',
      title: 'Fragment References',
      description: 'Auto-populated references showing where each fragment is used',
      type: 'array',
      readOnly: true,
      components: {
        input: FragmentReferencesPopulator
      },
      of: [
        {
          type: 'object',
          name: 'fragmentReferenceInfo',
          title: 'Fragment Reference Info',
          fields: [
            defineField({
              name: 'fragmentKey',
              title: 'Fragment Key',
              type: 'string',
              readOnly: true,
            }),
            defineField({
              name: 'references',
              title: 'References',
              type: 'array',
              readOnly: true,
              of: [
                {
                  type: 'object',
                  name: 'documentReference',
                  title: 'Document Reference',
                  fields: [
                    defineField({
                      name: 'documentType',
                      title: 'Document Type',
                      type: 'string',
                      readOnly: true,
                    }),
                    defineField({
                      name: 'documentTitle',
                      title: 'Document Title',
                      type: 'string',
                      readOnly: true,
                    }),
                    defineField({
                      name: 'documentPath',
                      title: 'Document Path',
                      type: 'string',
                      readOnly: true,
                    }),
                    defineField({
                      name: 'fieldPath',
                      title: 'Field Path',
                      description: 'Where in the document this fragment is referenced',
                      type: 'string',
                      readOnly: true,
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'documentTitle',
                      subtitle: 'documentType',
                      path: 'documentPath',
                    },
                    prepare({title, subtitle, path}) {
                      return {
                        title: title || 'Untitled Document',
                        subtitle: `${subtitle} • ${path || 'No path'}`,
                      }
                    },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: {
              fragmentKey: 'fragmentKey',
              referenceCount: 'references',
            },
            prepare({fragmentKey, referenceCount}) {
              const count = Array.isArray(referenceCount) ? referenceCount.length : 0
              return {
                title: `Fragment: ${fragmentKey}`,
                subtitle: `${count} reference${count !== 1 ? 's' : ''}`,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      key: 'key.current',
      fragmentCount: 'fragments',
      isActive: 'isActive',
      fragmentReferences: 'fragmentReferences',
    },
    prepare({title, key, fragmentCount, isActive, fragmentReferences}) {
      const count = Array.isArray(fragmentCount) ? fragmentCount.length : 0
      const totalReferences = Array.isArray(fragmentReferences) 
        ? fragmentReferences.reduce((sum, frag) => sum + (Array.isArray(frag.references) ? frag.references.length : 0), 0)
        : 0
      return {
        title: title || 'Untitled Collection',
        subtitle: `${key || 'No key'} • ${count} fragment${count !== 1 ? 's' : ''} • ${totalReferences} total reference${totalReferences !== 1 ? 's' : ''} • ${isActive ? 'Active' : 'Inactive'}`,
        media: FolderOpen,
      }
    },
  },
})
