import React, { useState } from 'react'
import { useGetUserGroupsQuery } from '../../services/apiClient'
import { BasicTable } from '../../components/table/BasicTable'
import { UserGroupEditModal } from './UserGroupEditModal'
import { userGroupModel } from './userGroupModel'
import { AlertError } from '../../components/form/AlertError'
import { PageTitle } from '../../components/layout/PageTitle'
import { AddButton, SpinnerLoading } from '../../components/misc/icons'

export function UsersGroupPage () {

  const { isLoading, isError, error, data } = useGetUserGroupsQuery()
  const [ userGroupId, setUserGroupId ] = useState(null)
  const [ show, setShow ] = useState(false)
  
  const openHandler = (id) => { setShow(true); setUserGroupId(id) }
  const closeHandler = () => setShow(false)

  if (isLoading) return <SpinnerLoading />
  if (isError) return <AlertError error={error} />
  
  return (
    <>
      <PageTitle h1="Usergroups">
        <AddButton text="New usergroup" />
      </PageTitle>
      <BasicTable model={userGroupModel} data={data} clickHandler={openHandler}/>
      { show ? <UserGroupEditModal model={userGroupModel} userGroupId={userGroupId} closeHandler={closeHandler} /> : null }
    </>
  )

}
