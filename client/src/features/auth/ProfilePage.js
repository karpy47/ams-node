import React from 'react'
import PropTypes from 'prop-types'
import { useAuthUserQuery, useUpdateUserMutation } from '../../services/apiClient'
import { Button, Form, Alert } from 'react-bootstrap'
import { CheckIcon, SpinnerLoading, SpinnerSaving } from '../../components/misc/icons'
import { Formik } from 'formik'
import { TextInput2, SelectInput2 } from '../../components/form/FormFields'
import { profileModel as model } from './profileModel'
import { AlertError } from '../../components/form/AlertError'
import { PageTitle } from '../../components/layout/PageTitle'
import { PageBody } from '../../components/layout/PageBody'

export function ProfilePage () {
  
  const { isLoading, isError, error, data } = useAuthUserQuery()
  const [ updatePost, update ] = useUpdateUserMutation()

  const null2Empty = (obj) => JSON.parse(JSON.stringify(obj, (k, v) => (v === null ? '' : v)))
  const empty2Null = (obj) => JSON.parse(JSON.stringify(obj, (k, v) => (v === '' ? null : v)))

  if (isLoading) return <SpinnerLoading />
  if (isError) return <AlertError error={error} />
  
  return (
    <>
      <PageBody size="md">
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
              { update.isError ? <Alert variant="danger">Error saving. ({update.error})</Alert> : null }
              <hr />
              <div className="text-end">
                { update.isLoading ? <SpinnerSaving /> : null }
                { update.isSuccess ? <CheckIcon /> : null }  
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