// src/components/Filter.jsx
import { useDispatch } from 'react-redux'
import { setFilter } from '../features/filterSlice'

const Filter = () => {
  const dispatch = useDispatch()

  const handleChange = (event) => {
    dispatch(setFilter(event.target.value))
  }

  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} placeholder="Search anecdotes..." />
    </div>
  )
}

export default Filter