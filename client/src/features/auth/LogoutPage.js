import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { clearAll } from './authSlice'

export function LogoutPage() {

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(clearAll())
  })
  
  return (
    <>
      <h1>Logout</h1>
      You are now logged out.
    </>
  )

}
  