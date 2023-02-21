import React, { useState } from 'react'
import { useGetUsersQuery } from '../../services/apiClient'
import { Button, Spinner } from 'react-bootstrap'
import { BasicTable } from '../../components/BasicTable'
import { ModalEditUser } from './ModalEditUser'
import { userModel } from './userModel'
import { MdAdd } from 'react-icons/md';
import { AlertError } from '../../components/AlertError'
import { PageTitle } from '../../components/PageTitle'

export function UsersPage () {
  
  const { isLoading, isError, error, data } = useGetUsersQuery()
  const [ userId, setUserId ] = useState(null)
  const [ show, setShow ] = useState(false)
  
  const openHandler = (id) => { setShow(true); setUserId(id) }
  const closeHandler = () => setShow(false)

  if (isLoading) return <Spinner animation="border" />
  if (isError) return <AlertError error={error} />
  
  return (
    <>
      <PageTitle h1="Users">
        <Button variant="primary" size="sm">< MdAdd /> New user</Button>
      </ PageTitle>
      <BasicTable model={userModel} data={data} clickHandler={openHandler}/>
      { show ? <ModalEditUser model={userModel} userId={userId} closeHandler={closeHandler} /> : null }
    </>
  )

}
