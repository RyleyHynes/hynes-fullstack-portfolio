/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

/**
 * Chooses the correct API host depending on whether Vite is serving locally or in production.
 */
export const resolveBaseUrl = () => (import.meta.env.PROD ? '/api/' : 'http://localhost:8000/api/')
const baseUrl = resolveBaseUrl()

/**
 * Applies bearer auth headers when tokens exist.
 */
export const prepareAuthHeaders = (headers: Headers, token: string | null = localStorage.getItem('access')) => {
  if (token) headers.set('authorization', `Bearer ${token}`)
  return headers
}

/**
 * RTK Query slice that centralizes auth, tracker, and training endpoints.
 * Adds bearer auth headers when tokens exist in `localStorage`.
 */
export const loginRequest = (body: { username: string; password: string }) => ({
  url: 'auth/token/',
  method: 'POST',
  body,
})

export const meRequest = () => 'accounts/me/'
export const boardsRequest = () => 'tracker/boards/'
export const createBoardRequest = (body: Partial<any>) => ({ url: 'tracker/boards/', method: 'POST', body })
export const moveCardRequest = ({ id, ...body }: { id: number; column: number; position: number }) => ({
  url: `tracker/cards/${id}/move/`,
  method: 'POST',
  body,
})
export const generatePlanRequest = (body: { name: string; start_date: string; weeks: number }) => ({
  url: 'training/plans/generate/',
  method: 'POST',
  body,
})

export const portfolioApi = createApi({
  reducerPath: 'portfolioApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => prepareAuthHeaders(headers),
  }),
  tagTypes: ['Board','Column','Card','Plan','Workout','Metric'],
  endpoints: (b) => ({
    /** Exchange credentials for JWT access + refresh tokens. */
    login: b.mutation<{access:string;refresh:string}, {username:string;password:string}>({ query: loginRequest }),
    /** Fetch the currently authenticated account profile. */
    me: b.query<any, void>({ query: meRequest }),
    /** Retrieve kanban boards for the workout tracker. */
    boards: b.query<any[], void>({ query: boardsRequest }),
    /** Create a new tracker board with the provided payload. */
    createBoard: b.mutation<any, Partial<any>>({ query: createBoardRequest }),
    /** Move a card to a new column/position inside a board. */
    moveCard: b.mutation<any, {id:number; column:number; position:number}>({ query: moveCardRequest }),
    /** Generate a training plan by name, start date, and duration. */
    generatePlan: b.mutation<any, {name:string;start_date:string;weeks:number}>({ query: generatePlanRequest }),
  })
})
export const {
  useLoginMutation, useMeQuery, useBoardsQuery, useCreateBoardMutation,
  useMoveCardMutation, useGeneratePlanMutation
} = portfolioApi
