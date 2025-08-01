import {defineField, defineType, defineArrayMember} from 'sanity'
import {LayoutGrid} from 'lucide-react'

export default defineType({
  name: 'productOverview',
  title: 'Product Overview',
  type: 'object',
  icon: LayoutGrid,
  fields: [
    defineField({
      name: 'products',
      title: 'Products',
      description: 'Select up to 3 products to display as cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'product',
              type: 'reference',
              to: [{ type: 'product' }],
              // @ts-expect-error: personalization is a plugin extension
              personalization: { experimental: true },
            }),
          ],
          preview: {
            select: {
              title: 'product.title',
            },
            prepare(selection) {
              return {
                title: selection.title || 'No product selected',
              }
            }
          }
        }),
      ],
      validation: (Rule) => Rule.required().max(3),
    }),
    defineField({
      name: 'loggedInProducts',
      title: 'Logged in Products (Variant)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'product' }],
        }),
      ],
      description: 'Select one or more products for only logged in users to see',
    }),
    defineField({
      name: 'callToAction',
      title: 'Call to Action',
      description: 'Text for the call to action button on each card',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
      products: 'products',
    },
    prepare(selection) {
      const { products } = selection;
      return {
        title: 'Product Overview',
        subtitle: products && products.length > 0 ? `${products.length} product${products.length > 1 ? 's' : ''}` : 'No products selected',
      };
    },
  },
}) 