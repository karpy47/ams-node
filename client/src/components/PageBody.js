import React from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Col } from 'react-bootstrap'

export function PageBody ({children}) {

  return (
    <Container fluid className="">
      <Row>
        <Col md={10} lg={8} xl={6}>
          {children}
        </Col>
      </Row>
    </Container>
  )

}
PageBody.propTypes = {
  children: PropTypes.array,
}
