import React from 'react'
import PropTypes from 'prop-types'
import { Stack } from 'react-bootstrap'

export function PageTitle ({h1, children}) {

  return (
    <Stack direction="horizontal" className="my-2">
      <div className=""><h1>{h1}</h1></div>
      <div className="ms-auto">{children}</div>
    </Stack>
  )

}
PageTitle.propTypes = {
  h1: PropTypes.string.isRequired,
  children: PropTypes.object,
}
