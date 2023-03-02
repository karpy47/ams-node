import React from 'react'
import { useGetUsersQuery } from '../../services/apiClient'
import { BasicTable } from '../../components/table/BasicTable'
import { userModel } from './userModel'
import { AlertError } from '../../components/form/AlertError'
import { PageTitle } from '../../components/layout/PageTitle'
import { AddButton, SpinnerLoading } from '../../components/misc/icons'
import { useNavigate } from 'react-router-dom'

export function UsersIndex() {
  
  const { isLoading, isError, error, data } = useGetUsersQuery()
  const navigate = useNavigate()

  const openHandler = (id) => { navigate('/user/'+id)  }

  if (isLoading) return <SpinnerLoading />
  if (isError) return <AlertError error={error} />
  
  return (
    <>
      <PageTitle h1="Users">
        <AddButton text="Add user" href="/user/add" />
      </ PageTitle>
      <BasicTable model={userModel} data={data} clickHandler={openHandler}/>
    </>
  )

}
