import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Table } from 'react-bootstrap'

function UserDeleteModal ({ state, handlers }) {
  return (!state.show) ? null : (
    <Modal centered size="lg" animation={false} show={state.show} onHide={handlers.close}> 
      <Modal.Header closeButton>
        <Modal.Title>Confirm to delete this user</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table borderless hover size="sm" className="w-auto">
          <tbody>
            <tr><td>Name:</td><td>{state.user.name}</td></tr>
            <tr><td>Usergroup:</td><td>{state.user.UserGroup}</td></tr>
            <tr><td>Role:</td><td>{state.user.role}</td></tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handlers.close}>Cancel</Button>
        <Button variant="danger" onClick={() => handlers.action(state.user)}>Delete</Button>
      </Modal.Footer>
    </Modal>
  )
}
UserDeleteModal.propTypes = {
  state: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
}

export default UserDeleteModal
