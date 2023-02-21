import React from 'react'
import PropTypes from 'prop-types'
import { useAuthUserQuery, useUpdateUserMutation } from '../../services/apiClient'
import { Button, Spinner, Form, Alert } from 'react-bootstrap'
import { Formik } from 'formik'
import { TextInput2, SelectInput2 } from '../../components/FormFields'
import { profileModel as model } from './profileModel'
import { AlertError } from '../../components/AlertError'
import { PageTitle } from '../../components/PageTitle'
import { PageBody } from '../../components/PageBody'

export function ProfilePage () {
  
  const { isLoading, isError, error, data } = useAuthUserQuery()
  const [ updatePost, result ] = useUpdateUserMutation()

  const null2Empty = (obj) => JSON.parse(JSON.stringify(obj, (k, v) => (v === null ? '' : v)))
  const empty2Null = (obj) => JSON.parse(JSON.stringify(obj, (k, v) => (v === '' ? null : v)))

  if (isLoading) return <Spinner animation="border" />
  if (isError) return <AlertError error={error} />
  
  return (
    <>
      <PageBody>
        <PageTitle h1="My profile" />
        <div className="formarea my-2">
          <Formik
            initialValues={ null2Empty(data) } 
            onSubmit={ (values) => updatePost(empty2Null(values)) }
            validationSchema={ model.getValidation() }
          >
          { (props) => (
            <Form onSubmit={props.handleSubmit} >
              <TextInput2 item={model.getColumn('name')} />
              <TextInput2 item={model.getColumn('email')} />
              <TextInput2 item={model.getColumn('phone')} />
              <SelectInput2 item={model.getColumn('status')} />
              <SelectInput2 item={model.getColumn('role')} />
              <TextInput2 item={model.getColumn('UserGroup.name')} />
              <TextInput2 item={model.getColumn('autoLogoutAfter')} />
              { result.isError ? <Alert variant="danger">Error saving. ({result.error})</Alert> : null }
              { result.isSuccess ? <Alert variant="success">Saved</Alert> : null }
              <hr />
              <div className="text-end">
                { result.isLoading ? <Spinner animation="border" variant="primary" /> : null }  
                <Button variant={props.isValid?"primary":"danger"} disabled={!props.isValid} type="submit">Save</Button>
              </div>
            </Form>
          )}
          </Formik>
        </div>
      </ PageBody>
    </>
  )

}
ProfilePage.propTypes = {
  handleSubmit: PropTypes.func,
  isValid: PropTypes.bool,
}