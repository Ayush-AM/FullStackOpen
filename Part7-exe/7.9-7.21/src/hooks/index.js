// src/hooks/index.js
import { useState } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset
  }
}

export const getInputProps = (field) => {
  return {
    type: field.type,
    value: field.value,
    onChange: field.onChange
  }
}