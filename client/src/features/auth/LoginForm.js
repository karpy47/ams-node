import React, { useState }  from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useAuthLoginMutation } from '../../services/apiClient';
import { Form, Button, Spinner, Toast } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup'

const formValidation = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  password: Yup.string()
    .min(4, 'Too short')
    .required('Required'),
})

export const LoginForm = () => {

  const [ login, result ] = useAuthLoginMutation()
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: formValidation,
    onSubmit: async (values) => { 
      const res = await login(values)
      if (res.error) setShowToast(true)
    },
  })
 
  if (result.isSuccess) { navigate("/") }
  const errorMessage = (error) => <>({error.status}: {error.message})</>

  function hasError(key) {
    return formik.touched[key] && formik.errors[key];
  }

  function showError(key) {
    return hasError(key) ? (<p className="error"><small>{formik.errors[key]}</small></p>) : null
  }

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Form.Group className="mb-3" controlId="email">
        <Form.Label column="sm">E-mail</Form.Label>
        <Form.Control 
          type="text"
          placeholder="Enter email" 
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          className={ hasError('email') ? "error" : null}
        />
        { showError('email') }
      </Form.Group>
      <Form.Group className="mb-3" controlId="password">
        <Form.Label column="sm">Password</Form.Label>
        <Form.Control 
          type="password" 
          placeholder="Enter password" 
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          className={ hasError('password') ? "error" : null}
        />
        { showError('password') }
      </Form.Group>
      <div className="text-end">  
        <Button variant="primary" type="submit">
          { result.isLoading ? <Spinner animation="border" size="sm"/> : "Login" }
        </Button> 
        <Link className="float-start" to="/">Forgot password?</Link> 
      </div> 
      <div className='mt-2'>
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg="danger">
          <Toast.Body>Login failed { result.isError ? errorMessage(result.error.data) : null }</Toast.Body>
        </Toast>
      </div>
    </Form>
     
  )
}
