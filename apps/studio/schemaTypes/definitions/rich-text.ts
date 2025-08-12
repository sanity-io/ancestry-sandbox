import { ImageIcon, LinkIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { Tag } from "lucide-react";
import { InlineFragmentSelector } from "../../components/inline-fragment-selector";

const richTextMembers = [
  defineArrayMember({
    name: "block",
    type: "block",
    styles: [
      { title: "Normal", value: "normal" },
      { title: "H2", value: "h2" },
      { title: "H3", value: "h3" },
      { title: "H4", value: "h4" },
      { title: "H5", value: "h5" },
      { title: "H6", value: "h6" },
      { title: "Inline", value: "inline" },
    ],
    lists: [
      { title: "Numbered", value: "number" },
      { title: "Bullet", value: "bullet" },
    ],
    marks: {
      annotations: [
        {
          name: "customLink",
          type: "object",
          title: "Internal/External Link",
          icon: LinkIcon,
          fields: [
            defineField({
              name: "customLink",
              type: "customUrl",
            }),
          ],
        },
        {
          name: "inlineFragmentReference",
          type: "object",
          title: "Fragment Reference",
          icon: Tag,
          fields: [
            defineField({
              name: "collection",
              title: "Fragment Collection",
              description: "Select the collection containing the fragment",
              type: "reference",
              to: [{type: "fragmentCollection"}],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "fragment",
              title: "Fragment",
              description: "Select the specific fragment from the collection",
              type: "string",
              validation: (Rule) => Rule.required(),
              components: {
                input: InlineFragmentSelector
              },
            }),
            defineField({
              name: "displayFormat",
              title: "Display Format",
              description: "How to display the fragment value",
              type: "string",
              options: {
                list: [
                  {title: "Value only", value: "value-only"},
                  {title: "Label: Value", value: "label-value"},
                  {title: "Value (Label)", value: "value-label"},
                ],
              },
              initialValue: "value-only",
            }),
          ],
        },
      ],
      decorators: [
        { title: "Strong", value: "strong" },
        { title: "Emphasis", value: "em" },
        { title: "Code", value: "code" },
      ],
    },
  }),
  defineArrayMember({
    name: "image",
    title: "Image",
    type: "image",
    icon: ImageIcon,
    options: {
      hotspot: true,
    },
    fields: [
      defineField({
        name: "caption",
        type: "string",
        title: "Caption Text",
      }),
    ],
  }),
];

export const richText = defineType({
  name: "richText",
  type: "array",
  of: richTextMembers,
});

export const memberTypes = richTextMembers.map((member) => member.name);

type Type = NonNullable<(typeof memberTypes)[number]>;

export const customRichText = (
  type: Type[],
  options?: { name?: string; title?: string; group?: string },
) => {
  const { name } = options ?? {};
  const customMembers = richTextMembers.filter(
    (member) => member.name && type.includes(member.name),
  );
  return defineField({
    ...options,
    name: name ?? "richText",
    type: "array",
    of: customMembers,
  });
};
