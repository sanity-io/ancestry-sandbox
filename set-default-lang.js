const sanityClient = require('@sanity/client')
const client = sanityClient({
  projectId: SANITY_STUDIO_PROJECT_ID,
  dataset: SANITY_STUDIO_DATASET,
  token: SANITY_API_WRITE_TOKEN, // Needs write permissions
  useCdn: false
})

async function setDefaultLang() {
  const docs = await client.fetch('*[_type == "page" && !defined(__i18n_lang)]._id')
  for (const id of docs) {
    await client.patch(id).set({__i18n_lang: 'en'}).commit()
    console.log(`Updated ${id}`)
  }
}
setDefaultLang()