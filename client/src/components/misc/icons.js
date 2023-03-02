import React from 'react'
import PropTypes from 'prop-types'
import { MdEdit, MdDelete, MdCheck, MdAdd, MdArrowBack, MdList } from 'react-icons/md'
import { Button, Modal, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'

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

export const SpinnerSaving = () => (
  <Spinner animation="border" variant="primary" size="sm" className="mx-2" />
)

export const SpinnerLoading = () => (
  <Spinner animation="border"  className="mx-2" />
)

export const CheckIcon = () => (
  <MdCheck className="mx-2" />
)

export const ModalLoading = () => (
  <Modal>
    <Modal.Body>
      <SpinnerLoading />
    </Modal.Body>
  </Modal>
)

export const SaveButton = ({isValid}) => (
  <Button
    variant={isValid ? "primary" : "danger"} 
    disabled={!isValid} 
    type="submit"
    className="ms-2"
  >
    Save
  </Button>
)
SaveButton.propTypes = {
  isValid: PropTypes.bool.isRequired,
}

export const CancelButton = ({to}) => ( 
  <Link to={to}>
    <Button variant="secondary" className="ms-2">
      Cancel
    </Button>  
  </Link>
)
CancelButton.propTypes = {
  to: PropTypes.string.isRequired,
}

export const DeleteButton = ({to}) => ( 
  <Link to={to}>
    <Button variant="danger" className="ms-2">
      Delete
    </Button>  
  </Link>
)
DeleteButton.propTypes = {
  to: PropTypes.string.isRequired,
}

export const AddButton = ({text, href}) => ( 
  <Link to={href}>
    <Button variant="primary" size="sm" className="ms-2">
      < MdAdd /> {text}
    </Button>  
  </Link>
)
AddButton.propTypes = {
  text: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
}

export const BackButton = ({text, to}) => ( 
  <Link to={to}>
    <Button variant="secondary" className="ms-2">
      {text ? text : <>< MdArrowBack /> Back</> }
    </Button>  
  </Link>
)
BackButton.propTypes = {
  text: PropTypes.string,
  to: PropTypes.string.isRequired,
}

export const ListButton = ({to}) => ( 
  <Link to={to}>
    <Button variant="secondary" size="sm" className="ms-2">
      < MdList /> List
    </Button>  
  </Link>
)
ListButton.propTypes = {
  to: PropTypes.string.isRequired,
}
