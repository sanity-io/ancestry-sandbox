import { LayoutGrid } from "lucide-react";
import { defineField, defineType, defineArrayMember } from "sanity";
import { preview } from "sanity-plugin-icon-picker";

import { customRichText } from "../definitions/rich-text";

const featureCardIcon = defineField({
  name: "featureCardIcon",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: "The heading text for this feature card",
    }),
    customRichText(["block"]),
    defineField({
      name: "image",
      type: "image",
      title: "Photo",
      description: "Select a photo to display below the text.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Describe the image for accessibility and SEO.",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      image: "image",
    },
    prepare: ({ title, image }) => {
      return {
        title: `${title ?? "Untitled"}`,
        media: image ?? null,
      };
    },
  },
});

export const featureCardsIcon = defineType({
  name: "featureCardsIcon",
  type: "object",
  icon: LayoutGrid,
  description:
    "A grid of feature cards, each with a photo, title and description",
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      description: "Optional text that appears above the main title",
    }),
    defineField({
      name: "title",
      type: "string",
      description: "The main heading for this feature section",
    }),
    customRichText(["block"]),
    defineField({
      name: "cards",
      type: "array",
      description: "The individual feature cards to display in the grid",
      of: [featureCardIcon],
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
      title: "title",
    },
    prepare: ({ title }) => ({
      title,
      subtitle: "Feature Cards with Photo",
    }),
  },
});
