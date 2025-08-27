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
  resolvedValue?: string | any[]
  resolvedLabel?: string
  dataType?: 'string' | 'text' | 'number'
}

export const InlineFragmentAnnotation: React.FC<
  InlineFragmentAnnotationProps
> = ({ children, resolvedValue, resolvedLabel, displayFormat, dataType }) => {
  // If we have pre-resolved values, use them immediately
  if (resolvedValue && resolvedLabel) {
    // Auto-detect data type if not provided
    let detectedDataType = dataType
    if (!detectedDataType) {
      if (Array.isArray(resolvedValue)) {
        detectedDataType = 'text'
      } else if (typeof resolvedValue === 'number') {
        detectedDataType = 'number'
      } else {
        detectedDataType = 'string'
      }
    }
    
    // Ensure we're not passing raw Sanity objects to formatFragmentValue
    let safeValue = resolvedValue
    if (Array.isArray(resolvedValue) && detectedDataType === 'text') {
      // For rich text, ensure it's properly structured
      safeValue = resolvedValue.filter(item => 
        item && typeof item === 'object' && item._type
      )
    } else if (typeof resolvedValue === 'object' && resolvedValue !== null) {
      // If it's an object but not an array, convert to string
      safeValue = String(resolvedValue)
    }
    
    try {
      const formattedValue = formatFragmentValue({
        label: resolvedLabel,
        value: safeValue,
        isActive: true,
        displayFormat,
        dataType: detectedDataType
      })
      
      // Handle multi-line content by splitting on newlines and rendering with line breaks
      if (typeof formattedValue === 'string' && formattedValue.includes('\n')) {
        const lines = formattedValue.split('\n')
        return (
          <span>
            {lines.map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        )
      }
      
      return <span>{formattedValue}</span>
    } catch (error) {
      console.warn('Error formatting fragment value:', error)
      // Fallback to just the label if formatting fails
      return <span>{resolvedLabel}</span>
    }
  }

  // Fallback to children if no resolved values (shouldn't happen with proper query)
  return <span>{children}</span>
}
