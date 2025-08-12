import React, { useState, useEffect, useCallback } from 'react'
import { useClient, useFormValue, set } from 'sanity'
import { Stack, Select, Text, Box, Card } from '@sanity/ui'
import { Tag } from 'lucide-react'
import type { StringInputProps } from 'sanity'

interface Fragment {
  _key: string
  label: string
  value: string
  key: string
  isActive: boolean
}

interface FragmentCollection {
  _id: string
  title: string
  key: { current: string }
  fragments: Fragment[]
  isActive: boolean
}

export const InlineFragmentSelector: React.FC<StringInputProps> = (props) => {
  const { value, onChange } = props
  const client = useClient()
  const [availableFragments, setAvailableFragments] = useState<Fragment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [collectionTitle, setCollectionTitle] = useState<string>('')
  const [lastCollectionId, setLastCollectionId] = useState<string>('')

  // Construct the exact path to the collection field
  const componentPath = props.path
  let collectionValue: any = undefined
  
  if (componentPath && componentPath.length >= 5) {
    // If path is ['richText', {key}, 'markDefs', {key}, 'fragment']
    // Access ['richText', {key}, 'markDefs', {key}, 'collection']
    const exactPath = [...componentPath.slice(0, -1), 'collection']
    collectionValue = useFormValue(exactPath) as any
  }
  
  const collectionId = collectionValue?._ref || collectionValue?._id

  // Fetch fragments when collection changes
  useEffect(() => {
    if (collectionId === lastCollectionId) {
      return
    }
    
    const fetchFragments = async () => {
      if (!collectionId) {
        setAvailableFragments([])
        setCollectionTitle('')
        setLastCollectionId('')
        return
      }

      setIsLoading(true)
      try {
        const query = `*[_type == "fragmentCollection" && _id == $collectionId] {
          _id,
          title,
          key,
          isActive,
          fragments[isActive == true] {
            _key,
            label,
            value,
            key,
            isActive
          }
        }[0]`
        
        const result = await client.fetch(query, { collectionId })
        
        if (result) {
          setAvailableFragments(result.fragments || [])
          setCollectionTitle(result.title)
          setLastCollectionId(collectionId)
        } else {
          setAvailableFragments([])
          setCollectionTitle('')
          setLastCollectionId(collectionId)
        }
      } catch (error) {
        console.error('Error fetching fragments:', error)
        setAvailableFragments([])
        setCollectionTitle('')
        setLastCollectionId(collectionId)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFragments()
  }, [collectionId, lastCollectionId, client])

  const handleFragmentChange = useCallback((fragmentKey: string) => {
    onChange(set(fragmentKey))
  }, [onChange])

  if (!collectionId) {
    return (
      <Card padding={3} style={{ backgroundColor: '#f5f5f5' }}>
        <Text size={1} muted>
          Please select a collection first to see available fragments.
        </Text>
      </Card>
    )
  }

  return (
    <Card padding={3} shadow={1}>
      <Stack space={3}>
        <Box>
          <Text size={1} weight="semibold" style={{ marginBottom: '0.5rem' }}>
            Select Fragment from "{collectionTitle}"
          </Text>
        </Box>

        <Box>
          <Select
            value={value || ''}
            onChange={(event) => handleFragmentChange(event.currentTarget.value)}
            disabled={isLoading || availableFragments.length === 0}
          >
            <option value="">Select a fragment...</option>
            {availableFragments.map((fragment) => (
              <option key={fragment._key} value={fragment.key}>
                {fragment.label}: {fragment.value}
              </option>
            ))}
          </Select>
        </Box>

        {availableFragments.length === 0 && !isLoading && (
          <Box padding={2} style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
            <Text size={1} style={{ color: '#dc2626' }}>
              No active fragments found in this collection.
            </Text>
          </Box>
        )}

        {isLoading && (
          <Box padding={2} style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}>
            <Text size={1} style={{ color: '#0369a1' }}>
              Loading fragments...
            </Text>
          </Box>
        )}
      </Stack>
    </Card>
  )
}
