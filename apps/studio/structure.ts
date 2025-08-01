import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import {
  BookMarked,
  CogIcon,
  File,
  FileText,
  HomeIcon,
  type LucideIcon,
  MessageCircleQuestion,
  PanelBottomIcon,
  PanelTopDashedIcon,
  Settings2,
  User,
  Star,
  Package,
  AlertTriangle,
} from "lucide-react";
import type {
  StructureBuilder,
  StructureResolverContext,
} from "sanity/structure";

import type { SchemaType, SingletonType } from "./schemaTypes";
import { getTitleCase } from "./utils/helper";

// Supported languages (should match sanity.config.ts)
const supportedLanguages = [
  { id: 'en', title: 'English' },
  { id: 'es', title: 'Spanish' },
];
const defaultLanguage = 'en';

type Base<T = SchemaType> = {
  id?: string;
  type: T;
  preview?: boolean;
  title?: string;
  icon?: LucideIcon;
};

type CreateSingleTon = {
  S: StructureBuilder;
} & Base<SingletonType>;

const createSingleTon = ({ S, type, title, icon }: CreateSingleTon) => {
  const newTitle = title ?? getTitleCase(type);
  return S.listItem()
    .title(newTitle)
    .icon(icon ?? File)
    .child(S.document().schemaType(type).documentId(type));
};

type CreateList = {
  S: StructureBuilder;
} & Base;

// This function creates a list item for a type. It takes a StructureBuilder instance (S),
// a type, an icon, and a title as parameters. It generates a title for the type if not provided,
// and uses a default icon if not provided. It then returns a list item with the generated or
// provided title and icon.

const createList = ({ S, type, icon, title, id }: CreateList) => {
  const newTitle = title ?? getTitleCase(type);
  return S.documentTypeListItem(type)
    .id(id ?? type)
    .title(newTitle)
    .icon(icon ?? File);
};

type CreateIndexList = {
  S: StructureBuilder;
  list: Base;
  index: Base<SingletonType>;
  context: StructureResolverContext;
};

const createIndexListWithOrderableItems = ({
  S,
  index,
  list,
  context,
}: CreateIndexList) => {
  const indexTitle = index.title ?? getTitleCase(index.type);
  const listTitle = list.title ?? getTitleCase(list.type);
  return S.listItem()
    .title(listTitle)
    .icon(index.icon ?? File)
    .child(
      S.list()
        .title(indexTitle)
        .items([
          S.listItem()
            .title(indexTitle)
            .icon(index.icon ?? File)
            .child(
              S.document()
                .views([S.view.form()])
                .schemaType(index.type)
                .documentId(index.type),
            ),
          orderableDocumentListDeskItem({
            type: list.type,
            S,
            context,
            icon: list.icon ?? File,
            title: `${listTitle}`,
          }),
        ]),
    );
};

// Helper to create a language folder for a document type (for non-page types)
function createLanguageFolders({ S, type, icon, title }: { S: StructureBuilder, type: string, icon?: LucideIcon, title?: string }) {
  return S.listItem()
    .title(title ?? getTitleCase(type))
    .icon(icon ?? File)
    .child(
      S.list()
        .title(`${title ?? getTitleCase(type)} by Language`)
        .items([
          ...supportedLanguages.map(lang =>
            S.listItem()
              .title(lang.title)
              .id(`${type}-${lang.id}`)
              .child(
                S.documentTypeList(type)
                  .title(`${title ?? getTitleCase(type)} (${lang.title})`)
                  .filter('_type == $type && __i18n_lang == $lang')
                  .params({ type, lang: lang.id })
              )
          ),
          // Add a folder for documents with no language specified
          S.listItem()
            .title('No Language Specified')
            .id(`${type}-no-lang`)
            .child(
              S.documentTypeList(type)
                .title(`${title ?? getTitleCase(type)} (No Language Specified)`)
                .filter('_type == $type && (!defined(__i18n_lang) || __i18n_lang == null)')
                .params({ type })
            )
        ])
    );
}

// Helper to create a language folder for a document type, with custom subfolders for English Pages
function createLanguageFoldersWithEnglishCategories({ S, type, icon, title }: { S: StructureBuilder, type: string, icon?: LucideIcon, title?: string }) {
  return S.listItem()
    .title(title ?? getTitleCase(type))
    .icon(icon ?? File)
    .child(
      S.list()
        .title(`${title ?? getTitleCase(type)} by Language`)
        .items([
          // English with categories
          S.listItem()
            .title('English')
            .id(`${type}-en`)
            .child(
              S.list()
                .title('English Page Categories')
                .items([
                  S.listItem()
                    .title('Trees')
                    .id(`${type}-en-trees`)
                    .child(
                      S.documentTypeList(type)
                        .title('Trees')
                        .filter('_type == $type && __i18n_lang == $lang && category == $cat')
                        .params({ type, lang: 'en', cat: 'trees' })
                    ),
                  S.listItem()
                    .title('Search')
                    .id(`${type}-en-search`)
                    .child(
                      S.documentTypeList(type)
                        .title('Search')
                        .filter('_type == $type && __i18n_lang == $lang && category == $cat')
                        .params({ type, lang: 'en', cat: 'search' })
                    ),
                  S.listItem()
                    .title('Memories')
                    .id(`${type}-en-memories`)
                    .child(
                      S.documentTypeList(type)
                        .title('Memories')
                        .filter('_type == $type && __i18n_lang == $lang && category == $cat')
                        .params({ type, lang: 'en', cat: 'memories' })
                    ),
                  S.listItem()
                    .title('DNA')
                    .id(`${type}-en-dna`)
                    .child(
                      S.documentTypeList(type)
                        .title('DNA')
                        .filter('_type == $type && __i18n_lang == $lang && category == $cat')
                        .params({ type, lang: 'en', cat: 'dna' })
                    ),
                  S.listItem()
                    .title('Explore')
                    .id(`${type}-en-explore`)
                    .child(
                      S.documentTypeList(type)
                        .title('Explore')
                        .filter('_type == $type && __i18n_lang == $lang && category == $cat')
                        .params({ type, lang: 'en', cat: 'explore' })
                    ),
                ])
            ),
          // Spanish (flat list)
          S.listItem()
            .title('Spanish')
            .id(`${type}-es`)
            .child(
              S.documentTypeList(type)
                .title(`${title ?? getTitleCase(type)} (Spanish)`)
                .filter('_type == $type && __i18n_lang == $lang')
                .params({ type, lang: 'es' })
            ),
          // No Language Specified (flat list)
          S.listItem()
            .title('No Language Specified')
            .id(`${type}-no-lang`)
            .child(
              S.documentTypeList(type)
                .title(`${title ?? getTitleCase(type)} (No Language Specified)`)
                .filter('_type == $type && (!defined(__i18n_lang) || __i18n_lang == null)')
                .params({ type })
            ),
        ])
    );
}

export const structure = (
  S: StructureBuilder,
  context: StructureResolverContext,
) => {
  return S.list()
    .title("Content")
    .items([
      createSingleTon({ S, type: "homePage", icon: HomeIcon }),
      S.divider(),
      createLanguageFoldersWithEnglishCategories({ S, type: "page", title: "Pages", icon: File }),
      createIndexListWithOrderableItems({
        S,
        index: { type: "blogIndex", icon: BookMarked },
        list: { type: "blog", title: "Blogs", icon: FileText },
        context,
      }),
      createLanguageFolders({ S, type: "feature", title: "Features", icon: Star }),
      createLanguageFolders({ S, type: "faq", title: "FAQs", icon: MessageCircleQuestion }),
      createLanguageFolders({ S, type: "author", title: "Authors", icon: User }),
      createLanguageFolders({ S, type: "product", title: "Products", icon: Package }),
      createLanguageFolders({ S, type: "disclaimer", title: "Disclaimers", icon: AlertTriangle }),
      S.divider(),
      S.listItem()
        .title("Site Configuration")
        .icon(Settings2)
        .child(
          S.list()
            .title("Site Configuration")
            .items([
              createSingleTon({
                S,
                type: "navbar",
                title: "Navigation",
                icon: PanelTopDashedIcon,
              }),
              createSingleTon({
                S,
                type: "footer",
                title: "Footer",
                icon: PanelBottomIcon,
              }),
              createSingleTon({
                S,
                type: "settings",
                title: "Global Settings",
                icon: CogIcon,
              }),
            ]),
        ),
    ]);
};
