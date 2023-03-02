import React from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Col } from 'react-bootstrap'

export function PageBody ({size = 'md', children}) {
  // breakpoints at xs<576, sm>576, md>768, lg>992, xl>1200, xll>1400
  var sm, md, lg, xl, xll
  switch (size.toLowerCase()) {
    case 'sm':
      [sm, md, lg, xl, xll] = [7, 6, 5, 4, 3]
      break
    case 'md':
      [sm, md, lg, xl, xll] = [12, 10, 8, 6, 3]
      break
    default:
      [sm, md, lg, xl, xll] = [12, 10, 8, 6, 3]
  }
  return (
    <Container fluid className="">
      <Row>
        <Col sm={sm} md={md} lg={lg} xl={xl} xll={xll}>
          {children}
        </Col>
      </Row>
    </Container>
  )

}
PageBody.propTypes = {
  size: PropTypes.string,
  children: PropTypes.array,
}
