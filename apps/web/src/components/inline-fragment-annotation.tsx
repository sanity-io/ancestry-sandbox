'use client'

import React, { useEffect, useState } from 'react'
import { resolveInlineFragmentReference, formatFragmentValue } from '../lib/inline-fragment-resolver'

interface InlineFragmentAnnotationProps {
  children: React.ReactNode
  collection: {
    _id: string
    title: string
    key: { current: string }
  }
  fragment: string
  displayFormat: 'value-only' | 'label-value' | 'value-label'
}

export const InlineFragmentAnnotation: React.FC<InlineFragmentAnnotationProps> = ({
  children,
  collection,
  fragment,
  displayFormat
}) => {
  const [resolvedFragment, setResolvedFragment] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const resolveFragment = async () => {
      if (!collection?._id || !fragment) {
        setError('Invalid fragment reference')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        
        const resolved = await resolveInlineFragmentReference({
          _type: 'inlineFragmentReference',
          collection: { _ref: collection._id, _type: 'reference' },
          fragment,
          displayFormat
        })

        if (resolved) {
          const formattedValue = formatFragmentValue(resolved)
          setResolvedFragment(formattedValue)
        } else {
          setError('Fragment not found')
        }
      } catch (err) {
        setError('Error resolving fragment')
      } finally {
        setIsLoading(false)
      }
    }

    resolveFragment()
  }, [collection, fragment, displayFormat])

  if (isLoading) {
    return <span className="text-gray-400">Loading...</span>
  }

  if (error) {
    return <span className="text-red-400" title={error}>[Fragment Error: {error}]</span>
  }

  if (resolvedFragment) {
    return <span>{resolvedFragment}</span>
  }

  // Fallback to children if resolution fails
  return <span>{children}</span>
}

export default InlineFragmentAnnotation
