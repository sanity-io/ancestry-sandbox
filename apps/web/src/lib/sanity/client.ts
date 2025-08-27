import type { SanityImageSource } from "@sanity/asset-utils";
import createImageUrlBuilder from "@sanity/image-url";
import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, studioUrl } from "./api";

// Ensure studioUrl is properly formatted
const sanitizedStudioUrl = studioUrl?.replace(/\/$/, '') || "http://localhost:3333";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  stega: {
    studioUrl: sanitizedStudioUrl,
    enabled: process.env.NEXT_PUBLIC_VERCEL_ENV === "preview",
  },
});

const imageBuilder = createImageUrlBuilder({
  projectId: projectId,
  dataset: dataset,
});

export const urlFor = (source: SanityImageSource) =>
  imageBuilder.image(source).auto("format").fit("max").format("webp");
