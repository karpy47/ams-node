import React from 'react'
import { useSelector } from 'react-redux'
import Card from 'react-bootstrap/Card';

export function Home() {
  
  const authUser = useSelector((state) => state.auth.user)

  return (
    <>
    <h1>Welcome { authUser.name }</h1>
      <Card style={{ width: '20rem' }}>  
        <Card.Header>Security notice</Card.Header>
        <Card.Body>
          <Card.Text>
            Last login for &quot;{ authUser.name }&quot; was:<br />
            { new Date(authUser.lastLoginAt).toLocaleString() }<br /><br />
            Please report suppicious activity.
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  )
}
