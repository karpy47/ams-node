import React from 'react'
import { PageTitle } from '../../components/PageTitle'
import { LoginForm } from './LoginForm'

export function LoginPage () {
  
  return (
    <>
      <PageTitle h1="Login" />
      <div className="login formarea">        
        <LoginForm/>
      </div>
    </>
  )

}
