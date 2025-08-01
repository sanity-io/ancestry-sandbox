import { Badge } from "@workspace/ui/components/badge";

import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";
import { SanityIcon } from "../sanity-icon";

type FeatureCardsWithIconProps = PagebuilderType<"featureCardsIcon">;

type FeatureCardProps = {
  card: {
    title?: string;
    richText?: any;
    image?: {
      asset?: { url?: string };
      alt?: string;
    };
    _key?: string;
  };
};

function FeatureCard({ card }: FeatureCardProps) {
  const { title, richText, image } = card ?? {};
  return (
    <div className="rounded-3xl bg-accent p-8 md:min-h-[300px] md:p-8">
      <div>
        <h3 className="text-lg font-medium md:text-2xl mb-2">{title}</h3>
        <RichText
          richText={richText}
          className="font-normal text-sm md:text-[16px] text-black/90 leading-7 text-balance dark:text-neutral-300"
        />
      </div>
      {image && (
        <div className="mt-6 flex justify-center">
          <img
            src={image.asset?.url}
            alt={image.alt || title || "Feature image"}
            className="rounded-xl max-h-48 object-contain"
          />
        </div>
      )}
    </div>
  );
}

export function FeatureCardsWithIcon({
  eyebrow,
  title,
  richText,
  cards,
  disclaimers,
}: FeatureCardsWithIconProps & { disclaimers?: Array<{ _id: string; text: any }> }) {
  return (
    <section id="features" className="my-6 md:my-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:text-center">
            <Badge variant="secondary">{eyebrow}</Badge>
            <h2 className="text-3xl font-semibold md:text-5xl">{title}</h2>
            <RichText
              richText={richText}
              className="text-base md:text-lg text-balance max-w-3xl"
            />
          </div>
        </div>
        {/* Center the grid itself using flex */}
        <div className="mx-auto mt-20 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {cards?.map((card, index) => (
            <FeatureCard
              key={`FeatureCard-${card?._key}-${index}`}
              card={card}
            />
          ))}
        </div>
        {/* Disclaimers at the bottom */}
        {disclaimers?.length ? (
          <div className="mt-6 text-[8px] text-center text-muted-foreground space-y-1">
            {disclaimers.map((d) => (
              <div key={d._id} className="flex items-start justify-center gap-1">
                <span className="font-bold">*</span>
                <RichText richText={d.text} className="inline" />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
