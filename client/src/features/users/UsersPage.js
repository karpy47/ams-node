import React, { useState } from 'react'
import { useGetUsersQuery } from '../../services/apiClient'
import { BasicTable } from '../../components/table/BasicTable'
import { UserEditModal } from './UserEditModal'
import { userModel } from './userModel'
import { AlertError } from '../../components/form/AlertError'
import { PageTitle } from '../../components/layout/PageTitle'
import { AddButton, SpinnerLoading } from '../../components/misc/icons'

export function UsersPage () {
  
  const { isLoading, isError, error, data } = useGetUsersQuery()
  const [ userId, setUserId ] = useState(null)
  const [ show, setShow ] = useState(false)
  
  const openHandler = (id) => { setShow(true); setUserId(id) }
  const closeHandler = () => setShow(false)

  if (isLoading) return <SpinnerLoading />
  if (isError) return <AlertError error={error} />
  
  return (
    <>
      <PageTitle h1="Users">
        <AddButton text="New user" href="/user/add" />
      </ PageTitle>
      <BasicTable model={userModel} data={data} clickHandler={openHandler}/>
      { show ? <UserEditModal model={userModel} userId={userId} closeHandler={closeHandler} /> : null }
    </>
  )

}
