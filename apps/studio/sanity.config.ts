import { assist } from "@sanity/assist";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import {
  unsplashAssetSource,
  unsplashImageAsset,
} from "sanity-plugin-asset-source-unsplash";
import { iconPicker } from "sanity-plugin-icon-picker";
import { media, mediaAssetSource } from "sanity-plugin-media";
import {fieldLevelExperiments} from '@sanity/personalization-plugin';
import { Logo } from "./components/logo";
import { locations } from "./location";
import { presentationUrl } from "./plugins/presentation-url";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";
import { createPageTemplate } from "./utils/helper";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "";
const dataset = process.env.SANITY_STUDIO_DATASET;
const title = process.env.SANITY_STUDIO_TITLE;
const presentationOriginUrl = process.env.SANITY_STUDIO_PRESENTATION_URL?.replace(/\/$/, '') ?? "http://localhost:3000";

const loggedInVariants = {
  id: 'loggedIn',
  label: 'Logged In Variant',
  variants: [
    {
      id: 'logged out',
      label: 'Logged Out',
    },
    {
      id: 'logged in',
      label: 'Logged In',
    },
  ],
}

export default defineConfig({
  name: "default",
  title: title ?? "Turbo Studio",
  projectId: projectId,
  icon: Logo,
  dataset: dataset ?? "production",
  mediaLibrary: {
    enabled: true,
  },
  plugins: [
    presentationTool({
      resolve: {
        locations,
      },
      previewUrl: {
        origin: presentationOriginUrl ?? "http://localhost:3000",
        previewMode: {
          enable: "/api/presentation-draft",
        },
      },
    }),
    assist( {
      // Removed internationalization configuration
    }),
    structureTool({
      structure,
    }),
    visionTool(),
    iconPicker(),
    fieldLevelExperiments({
      fields: ['title', 'richText', 'image', 'button', 'productOverview', 'product', 'faq' ],
      experiments: [loggedInVariants],
    }),
    media(),
    presentationUrl(),
    unsplashImageAsset(),
  ],

  form: {
    image: {
      assetSources: (sources) =>
        sources.filter((source) => source.name !== "sanity-default"),
    },
    // Disable the default for file assets
    file: {
      assetSources: (sources) =>
        sources.filter((source) => source.name !== "sanity-default"),
    },
  },
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      const { type } = creationContext;
      if (type === "global") return [];
      return prev;
    },
  },
  schema: {
    types: schemaTypes,
    templates: createPageTemplate(),
  },
});
