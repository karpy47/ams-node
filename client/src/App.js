import React from 'react';
import { useSelector } from 'react-redux'
import './App.css';
import { Container } from 'react-bootstrap';
import { Navigation } from './features/core/Navigation'
import { Router } from './features/core/Router';
import { Footer } from'./components/layout/Footer';
import { IdleCheck } from './features/core/IdleCheck';

export function App() {

  const authUser = useSelector((state) => state.auth.user)

  /* const dispatch = useDispatch()
  const logout = (e) => {
      e.preventDefault()
      dispatch(logOut(token))
  } */
  // <pre>{ JSON.stringify(authUser, null, 2) }</pre>  

  return (
    <>
      <Navigation authUser={authUser} />
      <Container fluid className="p-2 main">
        <Router />   
        { authUser ? <IdleCheck timer={authUser.autoLogoutAfter}/> : null }
      </Container>
      <Footer />
    </>
  )
}
