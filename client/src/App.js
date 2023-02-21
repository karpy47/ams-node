import React from 'react';
import { useSelector } from 'react-redux'
import './App.css';
import { Container } from 'react-bootstrap';
import { Navigation } from './components/Navigation'
import { Router } from './components/Router';
import { Footer } from'./components/Footer';
import { LoginPage } from './features/auth/LoginPage';
import { IdleCheck } from './components/IdleCheck';

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
      <Navigation user={authUser} />
      <Container fluid className="p-2 main">
        { authUser ? 
          <>
            <Router /> 
            <IdleCheck timer={authUser.autoLogoutAfter}/>
          </> 
          : <LoginPage /> 
        }                
      </Container>
      <Footer />
    </>
  )
}
