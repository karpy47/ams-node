/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Form } from 'react-bootstrap'
import { Formik } from 'formik'
import { TextInput2, SelectInput2 } from '../../components/FormFields'
import { useGetUserQuery, useUpdateUserMutation } from '../../services/apiClient'
import { Alert, Spinner } from 'react-bootstrap'

export function ModalEditUser ({ model, userId, closeHandler }) {

  const null2Empty = (obj) => JSON.parse(JSON.stringify(obj, (k, v) => (v === null ? '' : v)))
  const empty2Null = (obj) => JSON.parse(JSON.stringify(obj, (k, v) => (v === '' ? null : v)))

  const { data, isLoading } = useGetUserQuery(userId)
  const [ updatePost, result ] = useUpdateUserMutation()

  if (result.isSuccess) closeHandler()  
  if (isLoading) return (
    <Modal>
      <Modal.Body>
        <Alert variant="danger">Loading</Alert>
      </Modal.Body>
    </Modal>
  )
  return (
    <Modal centered size="lg" animation={false} show={true} onHide={closeHandler}>
      <Formik
        initialValues={ null2Empty(data) } 
        onSubmit={ (values) => updatePost(empty2Null(values)) }
        validationSchema={ model.getValidation() }
      >
      { (props) => (
        <Form onSubmit={props.handleSubmit} >
          <Modal.Header closeButton>
            <Modal.Title>User details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <TextInput2 item={model.getColumn('name')} />
            <TextInput2 item={model.getColumn('email')} />
            <TextInput2 item={model.getColumn('phone')} />
            <SelectInput2 item={model.getColumn('status')} />
            <SelectInput2 item={model.getColumn('role')} />
            <TextInput2 item={model.getColumn('UserGroup.name')} />
            <TextInput2 item={model.getColumn('autoLogoutAfter')} />
            <TextInput2 item={model.getColumn('lastLoginAt')} />
            <TextInput2 item={model.getColumn('createdAt')} />
            <TextInput2 item={model.getColumn('updatedAt')} />
            { result.isError ? <Alert variant="danger">Error saving. ({result.error})</Alert> : null }
          </Modal.Body>
          <Modal.Footer>
            { result.isLoading ? <Spinner animation="border" variant="primary" /> : null }
            { result.isSuccess ? <Alert variant="success">Saved</Alert> : null }
            <Button variant={props.isValid?"primary":"danger"} disabled={!props.isValid} type="submit">Save</Button>
            <Button variant="secondary" onClick={closeHandler}>Cancel</Button>
          </Modal.Footer>
        </Form>
      )}
      </Formik>
    </Modal>
  )
}
ModalEditUser.propTypes = {
  model: PropTypes.object.isRequired,
  userId: PropTypes.number.isRequired,
  closeHandler: PropTypes.func.isRequired
}
