import { author } from "./author";
import { blog } from "./blog";
import { blogIndex } from "./blog-index";
import { faq } from "./faq";
import { footer } from "./footer";
import { homePage } from "./home-page";
import { navbar } from "./navbar";
import { page } from "./page";
import { settings } from "./settings";
import feature from './feature'
import product from './product'
import disclaimer from './disclaimer'
import fragmentCollection from './fragment-collection'

export const singletons = [homePage, blogIndex, settings, footer, navbar];

export const documents = [blog, page, faq, author, feature, product, disclaimer, fragmentCollection, ...singletons];

export { default as feature } from './feature'
