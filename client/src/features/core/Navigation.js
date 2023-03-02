import React from 'react'
import PropTypes from 'prop-types'
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap'
//import { MdSettings } from 'react-icons/md';

function Link({href, children}) {
  return (
    <LinkContainer to={href}> 
      <NavDropdown.Item>{children}</NavDropdown.Item>
    </LinkContainer>
  )
}
Link.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
}

export function Navigation({authUser})  {
  
  //const iconSettings = <MdSettings />;

  return (
    <Navbar bg="light" expand="md" className="navigation">
      <LinkContainer to="/home">
        <Navbar.Brand>
          <img src="/abilion_200.png" width="150" height="" className="d-inline-block align-top" alt="AMS" />
        </Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
        { authUser ? 
        <Navbar.Collapse id="basic-navbar-nav"> 
          <Nav>
            <Nav.Link href="/home">Home</Nav.Link>
            <NavDropdown title="Patients" id="dd-patients">
              <Link href="action/3.1">New patient</Link>
              <Link href="action/3.2">View patients</Link>
            </NavDropdown>
            <NavDropdown title="Devices" id="dd-devices">
              <Link href="action/3.1">View devices</Link>
              <Link href="action/3.1">Connect device to patient</Link>
              <NavDropdown.Divider />
              <Link href="action/3.2">View device events</Link>
            </NavDropdown>
            <NavDropdown title="Reports" id="dd-reports">
              <Link href="action/3.1">Device usage</Link>
              <NavDropdown.Divider />
              <Link href="action/3.1">My activity</Link>
              <Link href="action/3.1">User activity</Link>
            </NavDropdown>
            <NavDropdown  title="Admin" id="dd-admin">
              <Link href="/users">Users</Link>
              <Link href="/users2">Users2</Link>
              <Link href="/usergroups">User groups</Link>
              <Link href="/clinics">Clinics</Link>
            </NavDropdown>
            <NavDropdown  title={ authUser.name } id="dd-user" className="nav-user-dd">
              <Link href="/profile">Profile</Link> 
              <Link href="/logout">Logout</Link>
              <NavDropdown.Divider />
              <Link href="/action/3.3">Support</Link>
              <Link href="/action/3.4">Terms</Link>
              <Link href="/action/3.5">Licenses</Link>
              <Link href="/action/3.6">About</Link>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        : null }
    </Navbar>
  )

}
Navigation.propTypes = {
  authUser: PropTypes.object,
}
