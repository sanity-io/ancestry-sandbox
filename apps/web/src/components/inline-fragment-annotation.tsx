"use client"

import React from 'react'
import { formatFragmentValue } from '../lib/inline-fragment-resolver'

interface InlineFragmentAnnotationProps {
  children: React.ReactNode
  collection: {
    _id: string
    title: string
    key: { current: string }
  }
  fragment: string
  displayFormat: 'value-only' | 'label-value' | 'value-label'
  resolvedValue?: string
  resolvedLabel?: string
}

export const InlineFragmentAnnotation: React.FC<
  InlineFragmentAnnotationProps
> = ({ children, resolvedValue, resolvedLabel, displayFormat }) => {
  // If we have pre-resolved values, use them immediately
  if (resolvedValue && resolvedLabel) {
    const formattedValue = formatFragmentValue({
      label: resolvedLabel,
      value: resolvedValue,
      isActive: true,
      displayFormat
    })
    return <span>{formattedValue}</span>
  }

  // Fallback to children if no resolved values (shouldn't happen with proper query)
  return <span>{children}</span>
}
