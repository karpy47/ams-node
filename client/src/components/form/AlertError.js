import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'react-bootstrap'
import { MdErrorOutline } from 'react-icons/md'

const knownErrors = [
  { 
    status: 'FETCH_ERROR', 
    header: 'Failed to load content', 
    message: 'Cannot reach the server at this time. Please try again later or look for a network connectivity problem.' 
  },
  { 
    status: '401', 
    header: 'Not authorized', 
    message: 'You do not have the proper access rights. Please contact your admin.' 
  },
]

export function AlertError ({error}) {
  
  let err = knownErrors.find(err => err.status == error.status )
  if (!err) err = {
    header: 'Unknown error', 
    message: 'You have found an error unknown to the system developer. Please report this message to a system admin.' 
  }

  return (
    <Alert variant="danger">
      <Alert.Heading><MdErrorOutline size='42'/> {err.header}</Alert.Heading>
      { err.message ? <p>{err.message}</p> : null }
      <hr />
      <p>
        Error status: {error.status ?? null}<br />
        Error message: {error.data.message ?? null }
      </p>
    </Alert>
  )

}
AlertError.propTypes = {
  error: PropTypes.object.isRequired,
}
