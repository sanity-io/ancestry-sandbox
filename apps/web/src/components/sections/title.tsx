import { RichText } from "../richtext";

interface TitleBlockProps {
  text: any;
}

export function TitleBlock({ text }: TitleBlockProps) {
  return (
    <div className="w-full py-8">
      <RichText richText={Array.isArray(text) ? text : text ? [text] : []} className="text-4xl md:text-6xl font-bold text-center" />
    </div>
  );
} 