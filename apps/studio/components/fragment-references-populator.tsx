import React, { useEffect, useState } from 'react'
import { useClient, set, useFormValue } from 'sanity'
import { Stack, Text, Box, Card, Button } from '@sanity/ui'
import { RefreshCw, Eye, EyeOff, ExternalLink } from 'lucide-react'

interface DocumentReference {
  _key: string
  documentId: string
  documentType: string
  documentTitle: string
  documentPath: string
  fieldPath: string
}

interface FragmentReferenceInfo {
  _key: string
  fragmentKey: string
  references: DocumentReference[]
}

export const FragmentReferencesPopulator: React.FC<{value: any; onChange: any; parent?: any}> = (props) => {
  const { value, onChange } = props
  const client = useClient()
  const [isLoading, setIsLoading] = useState(false)
  const [showReferences, setShowReferences] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Get the current document ID using useFormValue
  const currentDocumentId = useFormValue(['_id']) as string
  const currentDocumentType = useFormValue(['_type']) as string

  // Only proceed if this is a fragmentCollection document
  const collectionId = currentDocumentType === 'fragmentCollection' ? currentDocumentId : null
  
  // Extract the base ID without drafts. prefix for searching published documents
  const baseCollectionId = collectionId?.replace('drafts.', '') || null

  const navigateToDocument = (docId: string, docType: string) => {
    // Use Sanity Studio's built-in navigation to open the document
    // Format: /desk/[documentType];orderable-[documentType];[documentId]
    // Note: Sanity Studio uses plural forms and includes "orderable-" prefix for some document types
    const pluralDocType = getPluralDocumentType(docType)
    const studioUrl = `${window.location.origin}/desk/${pluralDocType};orderable-${docType};${docId}`
    window.open(studioUrl, '_blank')
  }

  const getPluralDocumentType = (docType: string): string => {
    // Convert singular document types to plural forms used by Sanity Studio
    const pluralMap: Record<string, string> = {
      'blog': 'blogs',
      'page': 'pages',
      'faq': 'faqs',
      'feature': 'features',
      'product': 'products',
      'disclaimer': 'disclaimers',
      'homePage': 'homePages',
      'blogIndex': 'blogIndexes',
      'settings': 'settings',
      'footer': 'footers',
      'navbar': 'navbars'
    }
    return pluralMap[docType] || docType
  }

  const populateReferences = async () => {
    if (!collectionId) {
      return
    }

    setIsLoading(true)
    try {
      // GROQ query to fetch fragments from this collection and documents referencing them
      const query = `
        {
          "fragments": *[_type == "fragmentCollection" && _id == $collectionId] {
            fragments[] {
              key
            }
          }[0].fragments,
          "references": *[_type in ["blog", "page", "faq", "feature", "product", "disclaimer", "homePage", "blogIndex", "settings", "footer", "navbar"] && !(_id in path("drafts.**"))] {
            _id,
            _type,
            title,
            slug,
            "richText": richText[] {
              _key,
              _type,
              markDefs[] {
                _key,
                _type,
                collection,
                fragment
              }
            },
            "text": text[] {
              _key,
              _type,
              markDefs[] {
                _key,
                _type,
                collection,
                fragment
              }
            }
          }[count(richText[].markDefs[_type == "inlineFragmentReference" && collection._ref == $baseCollectionId]) > 0 || count(text[].markDefs[_type == "inlineFragmentReference" && collection._ref == $baseCollectionId]) > 0]
        }
      `

      const result = await client.fetch(query, { collectionId, baseCollectionId })
      
      if (result.fragments) {
        // Group references by fragment key
        const fragmentReferences: FragmentReferenceInfo[] = []
        
        for (const fragment of result.fragments) {
          const references: DocumentReference[] = []
          
          for (const doc of result.references) {
            // Look through all richText blocks for fragment references
            if (doc.richText) {
              for (const block of doc.richText) {
                if (block.markDefs) {
                  for (const markDef of block.markDefs) {
                    if (markDef._type === 'inlineFragmentReference' && 
                        markDef.collection?._ref === baseCollectionId &&
                        markDef.fragment === fragment.key) {
                      references.push({
                        _key: `ref_${doc._id}_${fragment.key}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        documentId: doc._id,
                        documentType: doc._type,
                        documentTitle: doc.title || 'Untitled',
                        documentPath: getDocumentPath(doc),
                        fieldPath: 'richText'
                      })
                    }
                  }
                }
              }
            }
            
            // Look through all text blocks for fragment references (from customRichText)
            if (doc.text) {
              for (const block of doc.text) {
                if (block.markDefs) {
                  for (const markDef of block.markDefs) {
                    if (markDef._type === 'inlineFragmentReference' && 
                        markDef.collection?._ref === baseCollectionId &&
                        markDef.fragment === fragment.key) {
                      references.push({
                        _key: `ref_${doc._id}_${fragment.key}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        documentId: doc._id,
                        documentType: doc._type,
                        documentTitle: doc.title || 'Untitled',
                        documentPath: getDocumentPath(doc),
                        fieldPath: 'text'
                      })
                    }
                  }
                }
              }
            }
          }
          
          fragmentReferences.push({
            _key: `frag_${fragment.key}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            fragmentKey: fragment.key,
            references
          })
        }

        // Update the field value
        onChange(set(fragmentReferences))
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Error populating fragment references:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getDocumentPath = (doc: any): string => {
    if (doc._type === 'blog' && doc.slug?.current) {
      return `/blog/${doc.slug.current}`
    }
    if (doc._type === 'page' && doc.slug?.current) {
      return `/${doc.slug.current}`
    }
    if (doc._type === 'faq' && doc.slug?.current) {
      return `/faq/${doc.slug.current}`
    }
    if (doc._type === 'product' && doc.slug?.current) {
      return `/product/${doc.slug.current}`
    }
    if (doc._type === 'feature' && doc.slug?.current) {
      return `/feature/${doc.slug.current}`
    }
    if (doc._type === 'disclaimer' && doc.slug?.current) {
      return `/disclaimer/${doc.slug.current}`
    }
    
    if (['homePage', 'blogIndex', 'settings', 'footer', 'navbar'].includes(doc._type)) {
      return '/'
    }
    
    return '/'
  }

  // Auto-populate on mount if no value exists
  useEffect(() => {
    if (!value || value.length === 0) {
      populateReferences()
    }
  }, [])

  // Also refresh when the collection ID changes (e.g., when switching between collections)
  useEffect(() => {
    if (collectionId && baseCollectionId) {
      populateReferences()
    }
  }, [collectionId, baseCollectionId])

  const totalReferences = value ? 
    value.reduce((sum: number, frag: FragmentReferenceInfo) => 
      sum + (Array.isArray(frag.references) ? frag.references.length : 0), 0) : 0

  return (
    <Card padding={4} shadow={1}>
      <Stack space={4}>
        <Box>
          <Text size={2} weight="semibold" style={{ marginBottom: '0.75rem' }}>
            Fragment References
          </Text>
          <Text size={1} muted>
            Total references: {totalReferences} • Last updated: {lastUpdate ? lastUpdate.toLocaleString() : 'Never'}
          </Text>
        </Box>

        <Box>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              mode="ghost"
              icon={RefreshCw}
              onClick={populateReferences}
              disabled={isLoading}
              text={isLoading ? 'Updating...' : 'Refresh References'}
            />
            <Button
              mode="ghost"
              icon={showReferences ? EyeOff : Eye}
              onClick={() => setShowReferences(!showReferences)}
              text={showReferences ? 'Hide Details' : 'Show Details'}
            />
          </div>
        </Box>

        {showReferences && value && value.length > 0 && (
          <Box>
            <Text size={1} weight="semibold" style={{ marginBottom: '1rem' }}>
              Reference Details:
            </Text>
            {value.map((fragRef: FragmentReferenceInfo, index: number) => (
              <Box key={index} padding={3} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: '1rem', borderRadius: '6px' }}>
                <Text size={1} weight="semibold" style={{ marginBottom: '0.75rem' }}>
                  {fragRef.fragmentKey}: {fragRef.references.length} reference{fragRef.references.length !== 1 ? 's' : ''}
                </Text>
                {fragRef.references.map((ref, refIndex) => (
                  <Box key={refIndex} style={{ marginBottom: '0.5rem' }}>
                    <Button
                      mode="ghost"
                      icon={ExternalLink}
                      onClick={() => navigateToDocument(ref.documentId, ref.documentType)}
                      text={`${ref.documentTitle} (${ref.documentType}) - ${ref.fieldPath}`}
                      style={{ 
                        textAlign: 'left', 
                        justifyContent: 'flex-start',
                        padding: '0.5rem',
                        height: 'auto',
                        minHeight: 'auto'
                      }}
                    />
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        )}

        {(!value || value.length === 0) && !isLoading && (
          <Box padding={3} style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px' }}>
            <Text size={1} style={{ color: '#dc2626' }}>
              No references found. Click "Refresh References" to populate.
            </Text>
          </Box>
        )}
      </Stack>
    </Card>
  )
}