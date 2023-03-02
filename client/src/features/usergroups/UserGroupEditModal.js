/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Form } from 'react-bootstrap'
import { Formik } from 'formik'
import { TextInput2 } from '../../components/form/FormFields'
import { useGetUserGroupQuery, useUpdateUserGroupMutation } from '../../services/apiClient'
import { Alert } from 'react-bootstrap'
import { CheckIcon, ModalLoading, SpinnerSaving, SaveButton } from '../../components/misc/icons'

export function UserGroupEditModal ({ model, userGroupId, closeHandler }) {

  const null2Empty = (obj) => JSON.parse(JSON.stringify(obj, (k, v) => (v === null ? '' : v)))
  const empty2Null = (obj) => JSON.parse(JSON.stringify(obj, (k, v) => (v === '' ? null : v)))

  const { data, isLoading } = useGetUserGroupQuery(userGroupId)
  const [ updatePost, update ] = useUpdateUserGroupMutation()

  useEffect(() => { if (update.isSuccess) closeHandler() }) 
  if (isLoading) return <ModalLoading />

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
            <Modal.Title>Usergroup details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <TextInput2 item={model.getColumn('name')} />
            <TextInput2 item={model.getColumn('description')} />
            <TextInput2 item={model.getColumn('createdAt')} />
            <TextInput2 item={model.getColumn('updatedAt')} />
            { update.isError ? <Alert variant="danger">Error saving. ({update.error})</Alert> : null }
          </Modal.Body>
          <Modal.Footer>
            { update.isLoading ? <SpinnerSaving /> : null }
            { update.isSuccess ? <CheckIcon /> : null }
            <Button variant="secondary" onClick={closeHandler}>Cancel</Button>
            <SaveButton isValid={props.isValid} />
          </Modal.Footer>
        </Form>
      )}
      </Formik>
    </Modal>
  )
}
UserGroupEditModal.propTypes = {
  model: PropTypes.object.isRequired,
  userGroupId: PropTypes.number.isRequired,
  closeHandler: PropTypes.func.isRequired
}
