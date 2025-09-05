// src/hooks/useAnecdotes.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import anecdoteService from '../services/anecdotes'

// 6.20: Get anecdotes with React Query
export const useAnecdotes = () => {
  return useQuery({
    queryKey: ['anecdotes'],
    queryFn: anecdoteService.getAll,
    retry: 1 // Retry only once before showing error
  })
}

// 6.21: Create anecdote with React Query
export const useCreateAnecdote = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: anecdoteService.createNew,
    onSuccess: (newAnecdote) => {
      // Update the cache with the new anecdote
      queryClient.setQueryData(['anecdotes'], (oldData) => {
        return [...oldData, newAnecdote]
      })
    }
  })
}

// 6.22: Vote anecdote with React Query
export const useVoteAnecdote = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, anecdote }) => anecdoteService.update(id, anecdote),
    onSuccess: (updatedAnecdote) => {
      // Update the cache with the voted anecdote
      queryClient.setQueryData(['anecdotes'], (oldData) => {
        return oldData.map(anecdote =>
          anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
        )
      })
    }
  })
}