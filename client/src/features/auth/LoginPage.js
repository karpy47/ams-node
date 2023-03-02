import React from 'react'
import { PageBody } from '../../components/layout/PageBody'
import { PageTitle } from '../../components/layout/PageTitle'
import { LoginForm } from './LoginForm'

export function LoginPage () {
  
  return (
    <PageBody size="sm">
      <PageTitle h1="Welcome to Abilion TMS" />
      <p><small>Login for clinicians and admins to the Abilion Treatment Management System (TMS). Please contact Abilion or your local Abilion TMS administrator to register and to recieve a login.</small></p>
      <div className="formarea">        
        <h2>Login</h2>
        <LoginForm/>
      </div>
    </PageBody>
  )

}
