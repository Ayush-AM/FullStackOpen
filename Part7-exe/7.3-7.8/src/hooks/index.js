// src/hooks/index.js
import { useState } from 'react'

// 7.4, 7.5, 7.6: useField hook with reset functionality
export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  // 7.6: Return only the needed properties to avoid passing reset to input
  return {
    type,
    value,
    onChange,
    reset
  }
}

// Helper function to get input props without reset
export const getInputProps = (field) => {
  return {
    type: field.type,
    value: field.value,
    onChange: field.onChange
  }
}