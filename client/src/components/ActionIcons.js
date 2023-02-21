import React from 'react'
import PropTypes from 'prop-types'
import { EditIcon, DeleteIcon } from './Icons'

const ActionIcons = ({handlers, user}) => 
  <>
    {handlers.edit ? <EditIcon handler={handlers.edit} user={user?user:null} /> : null }
    {(handlers.edit && handlers.delete) ? <>&nbsp;&nbsp;</> : null }
    {handlers.delete ? <DeleteIcon handler={handlers.delete} user={user?user:null} /> : null }
  </>

ActionIcons.propTypes = {
  handlers: PropTypes.object.isRequired,
  user: PropTypes.object
}

export default ActionIcons
