/* eslint-disable react/prop-types */
import React from 'react'
import { Button, Form } from 'react-bootstrap'
import { Formik } from 'formik'
import { TextInput2, SelectInput2 } from '../../components/form/FormFields'
import { useAddUserMutation } from '../../services/apiClient'
import { Alert } from 'react-bootstrap'
import { CheckIcon, ListButton, SpinnerSaving, SaveButton } from '../../components/misc/icons'
import { PageTitle } from '../../components/layout/PageTitle'
import { userModel as model } from './userModel'
import { PageBody } from '../../components/layout/PageBody'

export function AddUserPage () {

  const null2Empty = (obj) => JSON.parse(JSON.stringify(obj, (k, v) => (v === null ? '' : v)))
  const empty2Null = (obj) => JSON.parse(JSON.stringify(obj, (k, v) => (v === '' ? null : v)))

  const [addPost, result] = useAddUserMutation()
  
  return (
    <PageBody>
      <PageTitle h1="User details"><ListButton to="/users" /></ PageTitle>
      <Formik
        initialValues={ null2Empty(model.getDefaultValues()) } 
        onSubmit={ (values) => addPost(empty2Null(values)) }
        validationSchema={ model.getValidation() }
      >
      { (props) => (
        <Form onSubmit={props.handleSubmit} className="formarea">
          <TextInput2 item={model.getColumn('name')} />
          <TextInput2 item={model.getColumn('email')} />
          <TextInput2 item={model.getColumn('phone')} />
          <SelectInput2 item={model.getColumn('status')} />
          <SelectInput2 item={model.getColumn('role')} />
          
          <TextInput2 item={model.getColumn('autoLogoutAfter')} />
          { result.isError ? <Alert variant="danger">Error saving. ({result.error})</Alert> : null }
          <hr />
          <div className="text-end">  
            { result.isLoading ? <SpinnerSaving /> : null }
            { result.isSuccess ? <CheckIcon /> : null }
            <Button variant="secondary" className="me-2" onClick="">Cancel</Button>
            <SaveButton isValid={props.isValid} />
          </div>
        </Form>
      )}
      </Formik>
    </PageBody>
  )
}
