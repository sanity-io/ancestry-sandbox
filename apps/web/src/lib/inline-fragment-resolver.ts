import { client } from './sanity/client'

export interface InlineFragmentReference {
  _type: 'inlineFragmentReference'
  collection: {
    _ref: string
    _type: 'reference'
  }
  fragment: string
  displayFormat: 'value-only' | 'label-value' | 'value-label'
}

export interface ResolvedInlineFragment {
  label: string
  value: string
  isActive: boolean
  displayFormat: 'value-only' | 'label-value' | 'value-label'
}

/**
 * Resolves an inline fragment reference to its actual value
 */
export async function resolveInlineFragmentReference(
  fragmentRef: InlineFragmentReference
): Promise<ResolvedInlineFragment | null> {
  try {
    const { collection, fragment, displayFormat } = fragmentRef
    
    if (!collection?._ref || !fragment) {
      console.warn('Invalid fragment reference:', fragmentRef)
      return null
    }

    // Query Sanity for the specific fragment
    const query = `*[_type == "fragmentCollection" && _id == $collectionId] {
      _id,
      title,
      key,
      isActive,
      fragments[key == $fragmentKey && isActive == true] {
        _key,
        label,
        value,
        key,
        isActive
      }
    }[0]`

    const result = await client.fetch(query, { 
      collectionId: collection._ref, 
      fragmentKey: fragment 
    })
    
    if (!result || !result.fragments || result.fragments.length === 0) {
      console.warn(`Fragment not found: ${collection._ref}:${fragment}`)
      return null
    }

    const fragmentData = result.fragments[0]
    return {
      label: fragmentData.label,
      value: fragmentData.value,
      isActive: fragmentData.isActive,
      displayFormat
    }
  } catch (error) {
    console.error('Error resolving inline fragment reference:', error)
    return null
  }
}

/**
 * Formats a resolved fragment according to the display format
 */
export function formatFragmentValue(
  fragment: ResolvedInlineFragment
): string {
  switch (fragment.displayFormat) {
    case 'label-value':
      return `${fragment.label}: ${fragment.value}`
    case 'value-label':
      return `${fragment.value} (${fragment.label})`
    case 'value-only':
    default:
      return fragment.value
  }
}

/**
 * Resolves all inline fragment references in a rich text array
 */
export async function resolveInlineFragmentReferences(
  richTextArray: any[]
): Promise<any[]> {
  if (!richTextArray || !Array.isArray(richTextArray)) {
    return richTextArray
  }

  const resolvedArray = []

  for (const item of richTextArray) {
    if (item._type === 'block' && item.markDefs) {
      // Process mark definitions for inline fragment references
      const resolvedMarkDefs = []
      
      for (const markDef of item.markDefs) {
        if (markDef._type === 'inlineFragmentReference') {
          const resolvedFragment = await resolveInlineFragmentReference(markDef)
          if (resolvedFragment) {
            // Replace the mark definition with the resolved fragment value
            const formattedValue = formatFragmentValue(resolvedFragment)
            // Create a new mark definition that will render the resolved value
            resolvedMarkDefs.push({
              ...markDef,
              _type: 'span',
              text: formattedValue,
              marks: []
            })
          } else {
            // Keep the original mark definition if resolution fails
            resolvedMarkDefs.push(markDef)
          }
        } else {
          resolvedMarkDefs.push(markDef)
        }
      }
      
      resolvedArray.push({
        ...item,
        markDefs: resolvedMarkDefs
      })
    } else {
      resolvedArray.push(item)
    }
  }

  return resolvedArray
}

/**
 * Debug function to log inline fragment references
 */
export function debugInlineFragmentReferences(richTextArray: any[]): void {
  if (!richTextArray || !Array.isArray(richTextArray)) {
    console.log('No rich text array to debug')
    return
  }

  let fragmentCount = 0
  
  richTextArray.forEach((item, index) => {
    if (item._type === 'block' && item.markDefs) {
      item.markDefs.forEach((markDef: any) => {
        if (markDef._type === 'inlineFragmentReference') {
          fragmentCount++
          console.log(`Fragment ${fragmentCount}:`, {
            collection: markDef.collection?._ref,
            fragment: markDef.fragment,
            displayFormat: markDef.displayFormat
          })
        }
      })
    }
  })

  console.log(`Found ${fragmentCount} inline fragment reference(s)`)
}

// Batch resolver for multiple fragments to reduce API calls
export async function resolveInlineFragmentReferencesBatch(
  fragmentRefs: Array<{
    _type: 'inlineFragmentReference'
    collection: { _ref: string; _type: 'reference' }
    fragment: string
    displayFormat: 'value-only' | 'label-value' | 'value-label'
  }>
): Promise<Array<{ fragmentKey: string; resolvedValue: string | null }>> {
  if (!fragmentRefs.length) return []

  try {
    // Group fragments by collection to minimize queries
    const collectionGroups = fragmentRefs.reduce((groups, ref) => {
      const collectionId = ref.collection._ref
      if (!groups[collectionId]) {
        groups[collectionId] = []
      }
      groups[collectionId].push(ref)
      return groups
    }, {} as Record<string, typeof fragmentRefs>)

    // Fetch all collections at once
    const collectionIds = Object.keys(collectionGroups)
    const collectionsQuery = `*[_type == "fragmentCollection" && _id in $collectionIds] {
      _id,
      title,
      key,
      fragments[] {
        _key,
        label,
        value,
        key,
        isActive
      }
    }`

    const collections = await client.fetch(collectionsQuery, { collectionIds })
    
    // Create a lookup map
    const collectionMap = collections.reduce((map, collection) => {
      map[collection._id] = collection
      return map
    }, {} as Record<string, any>)

    // Resolve all fragments
    return fragmentRefs.map(ref => {
      const collection = collectionMap[ref.collection._ref]
      if (!collection) return { fragmentKey: ref.fragment, resolvedValue: null }

      const fragment = collection.fragments?.find((f: any) => 
        f.key === ref.fragment && f.isActive === true
      )

      if (!fragment) return { fragmentKey: ref.fragment, resolvedValue: null }

      const formattedValue = formatFragmentValue({
        label: fragment.label,
        value: fragment.value,
        displayFormat: ref.displayFormat
      })

      return { fragmentKey: ref.fragment, resolvedValue: formattedValue }
    })

  } catch (error) {
    console.error('Error resolving batch fragments:', error)
    return fragmentRefs.map(ref => ({ fragmentKey: ref.fragment, resolvedValue: null }))
  }
}
