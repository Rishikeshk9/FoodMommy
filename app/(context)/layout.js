"use client"
import React   from 'react'
import SupabaseProvider from '../context/SupabaseProvider'

function layout({ children }) {
  return (
    <> <SupabaseProvider>{ children }</SupabaseProvider></>
  )
}

export default layout
