import React from 'react'
import PropTypes from 'prop-types'
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
//import { MdSettings } from 'react-icons/md';

export function Navigation(props)  {
  
  //const iconSettings = <MdSettings />;

  return (
    <Navbar bg="light" expand="md" className="navigation">
      <Navbar.Brand href="/">
        <img src="/abilion_200.png" width="150" height="" className="d-inline-block align-top" alt="AMS" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
        { props.user ? 
        <Navbar.Collapse id="basic-navbar-nav"> 
          <Nav>
            <Nav.Link href="/">Home</Nav.Link>
            <NavDropdown title="Patients" id="dd-patients">
              <NavDropdown.Item href="#action/3.1">New patient</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.1">View patients</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Devices" id="dd-devices">
              <NavDropdown.Item href="#action/3.1">View devices</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.1">Connect device to patient</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.2">View device events</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Reports" id="dd-reports">
              <NavDropdown.Item href="#action/3.1">Device usage</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.1">My activity</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.1">User activity</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown  title="Admin" id="dd-admin">
              <NavDropdown.Item href="/users">Users</NavDropdown.Item>
              <NavDropdown.Item href="/usergroups">User groups</NavDropdown.Item>
              <NavDropdown.Item href="/clinics">Clinics</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown  title={ props.user.name } id="dd-user" className="nav-user-dd">
              <NavDropdown.Item href="/profile">My profile</NavDropdown.Item>
              <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.3">Support</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Terms</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Licenses</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">About</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        : null }
    </Navbar>
  )

}

Navigation.propTypes = {
  user: PropTypes.object,
}
