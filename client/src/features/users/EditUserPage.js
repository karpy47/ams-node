/* eslint-disable react/prop-types */
import React from 'react'
import { Form } from 'react-bootstrap'
import { Formik } from 'formik'
import { TextInput2, SelectInput2 } from '../../components/form/FormFields'
import { useGetUserQuery, useUpdateUserMutation } from '../../services/apiClient'
import { Alert } from 'react-bootstrap'
import { CheckIcon, SpinnerSaving, SpinnerLoading, SaveButton, ListButton, CancelButton, DeleteButton } from '../../components/misc/icons'
import { PageTitle } from '../../components/layout/PageTitle'
import { useParams } from 'react-router-dom'
import { userModel as model } from './userModel'
import { PageBody } from '../../components/layout/PageBody'

export function EditUserPage () {

  const null2Empty = (obj) => JSON.parse(JSON.stringify(obj, (k, v) => (v === null ? '' : v)))
  const empty2Null = (obj) => JSON.parse(JSON.stringify(obj, (k, v) => (v === '' ? null : v)))

  const params = useParams()
  const { data, isLoading } = useGetUserQuery(params.userId)
  const [ updatePost, update ] = useUpdateUserMutation()

  if (isLoading) return <SpinnerLoading />
  
  return (
    <PageBody>
      <PageTitle h1="Edit user"><ListButton to="/users" /></ PageTitle>
      <Formik
        initialValues={ null2Empty(data) } 
        onSubmit={ (values) => updatePost(empty2Null(values)) }
        validationSchema={ model.getValidation() }
      >
      { (props) => (
        <Form onSubmit={props.handleSubmit} className="formarea">
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
          { update.isError ? <Alert variant="danger">Error saving. ({update.error})</Alert> : null }
          <hr />
          <div className="text-end">  
            { update.isLoading ? <SpinnerSaving /> : null }
            { update.isSuccess ? <CheckIcon /> : null }
            <DeleteButton to="/users" />
            <CancelButton to="/users" />
            <SaveButton isValid={props.isValid} />
          </div>
        </Form>
      )}
      </Formik>
    </PageBody>
  )
}
