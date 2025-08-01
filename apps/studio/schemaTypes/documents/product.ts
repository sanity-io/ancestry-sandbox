import {defineField, defineType, defineArrayMember} from 'sanity'
import {Package} from 'lucide-react'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: Package,
  initialValue: { __i18n_lang: 'en' },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'The name of the product',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      description: 'Product image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: 'Describe the image for accessibility and SEO',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'A rich text description of the product',
      type: 'richText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      description: 'Product price in USD',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'features',
      title: 'Features',
      description: 'List of features for this product',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'feature'}],
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      price: 'price',
    },
    prepare(selection) {
      const { title, media, price } = selection;
      return {
        title,
        media,
        subtitle: price !== undefined ? `$${price}` : undefined,
      };
    },
  },
}) 