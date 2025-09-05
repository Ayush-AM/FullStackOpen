// src/components/Filter.jsx
import { useState } from 'react'

const Filter = ({ filter, setFilter }) => {
  const handleChange = (event) => {
    setFilter(event.target.value)
  }

  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input value={filter} onChange={handleChange} placeholder="Search anecdotes..." />
    </div>
  )
}

export default Filter