import React from 'react'
import { Container } from 'react-bootstrap'
import { MdCopyright } from 'react-icons/md'

export function Footer () {

  return (
    <Container fluid="true" className='footer'>
      <p className="text-center small"><MdCopyright /> { new Date().getFullYear() } Abilion Medical Systems AB</p>
    </Container>
  )

}
