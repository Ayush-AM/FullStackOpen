// src/reducers/counterReducer.test.js
import { describe, test, expect } from 'vitest'
import deepFreeze from 'deep-freeze'
import counterReducer from './counterReducer'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('should return a proper initial state when called with undefined state', () => {
    const action = {
      type: 'DO_NOTHING'
    }
    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('good is incremented', () => {
    const action = { type: 'GOOD' }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0
    })
  })

  test('ok is incremented', () => {
    const action = { type: 'OK' }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 0,
      ok: 1,
      bad: 0
    })
  })

  test('bad is incremented', () => {
    const action = { type: 'BAD' }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 0,
      ok: 0,
      bad: 1
    })
  })

  test('multiple increments work correctly', () => {
    const state = initialState
    
    let newState = counterReducer(state, { type: 'GOOD' })
    newState = counterReducer(newState, { type: 'GOOD' })
    newState = counterReducer(newState, { type: 'OK' })
    newState = counterReducer(newState, { type: 'BAD' })
    newState = counterReducer(newState, { type: 'GOOD' })

    expect(newState).toEqual({
      good: 3,
      ok: 1,
      bad: 1
    })
  })

  test('reset works correctly', () => {
    let state = counterReducer(initialState, { type: 'GOOD' })
    state = counterReducer(state, { type: 'OK' })
    state = counterReducer(state, { type: 'BAD' })

    deepFreeze(state)
    const resetState = counterReducer(state, { type: 'ZERO' })
    
    expect(resetState).toEqual(initialState)
  })
})