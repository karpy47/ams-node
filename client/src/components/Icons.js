import React from 'react'
import PropTypes from 'prop-types'
import { MdEdit, MdDelete } from 'react-icons/md'

export const EditIcon = ({handler, user}) => (
  <span className="action-icon">
    <MdEdit onClick={ () => handler(user?user:null) }/>
  </span>
)
EditIcon.propTypes = {
  handler: PropTypes.func.isRequired,
  user: PropTypes.object
}

export const DeleteIcon = ({handler, user}) => (
  <span className="action-icon">
    <MdDelete onClick={ () => handler(user?user:null) }/>
  </span>
)
DeleteIcon.propTypes = {
  handler: PropTypes.func.isRequired,
  user: PropTypes.object
}
