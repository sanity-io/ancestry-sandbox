import { MessageCircleQuestion } from "lucide-react";
import { defineField, defineType } from "sanity";

import { customUrl } from "../definitions/custom-url";

export const faqAccordion = defineType({
  name: "faqAccordion",
  type: "object",
  icon: MessageCircleQuestion,
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      title: "Eyebrow",
      description:
        "The smaller text that sits above the title to provide context",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "The large text that is the primary focus of the block",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      type: "string",
      title: "Subtitle",
      description: "Additional context below the main title",
    }),
    defineField({
      name: "faqs",
      type: "array",
      title: "FAQs",
      description: "Select the FAQ items to display in this accordion",
      of: [
        {
          type: "reference",
          to: [{ type: "faq" }],
          options: { disableNew: true },
        },
      ],
      validation: (Rule) => [Rule.required(), Rule.unique()],
    }),
    defineField({
      name: "link",
      type: "object",
      title: "Link",
      description: "Optional link to display below the FAQ accordion",
      fields: [
        defineField({
          name: "title",
          type: "string",
          title: "Link Title",
          description: "The title text for the link",
        }),
        defineField({
          name: "description",
          type: "string",
          title: "Link Description",
          description: "The description text for the link",
        }),
        defineField({
          name: "url",
          type: customUrl.name,
          title: "Link URL",
          description: "The URL for the link",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title: title ?? "Untitled",
      subtitle: "FAQ Accordion",
    }),
  },
});
