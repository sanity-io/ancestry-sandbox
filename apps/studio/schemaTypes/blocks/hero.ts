import { Star } from "lucide-react";
import { defineField, defineType } from "sanity";

import { buttonsField, richTextField } from "../common";
import { customRichText } from '../definitions/rich-text';

export const hero = defineType({
  name: "hero",
  title: "Hero",
  icon: Star,
  type: "object",
  fields: [
    defineField({
      name: "badge",
      type: "string",
      title: "Badge",
      description:
        "Optional badge text displayed above the title, useful for highlighting new features or promotions",
    }),
    defineField({
      name: "badgeTextColor",
      type: "color",
      title: "Badge Text Color",
      description: "Color for the badge text (defaults to white if not set)",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Main headline for the hero section. Keep it short and impactful.",
      validation: (Rule) => Rule.required(),
    }),
    richTextField,
    defineField({
      name: "image",
      type: "image",
      title: "Image",
      description:
        "The main hero image - should be high quality and visually impactful",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "imageOnRight",
      type: "boolean",
      title: "Image on Right Side",
      description: "If enabled, the hero image will appear on the right side. If disabled, it will appear on the left side.",
      initialValue: true,
    }),
    buttonsField,
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title: title || "Hero",
      subtitle: "Hero Block",
    }),
  },
});
