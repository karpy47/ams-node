import React, { useState } from 'react'
import { useGetUserGroupsQuery } from '../../services/apiClient'
import { Button, Spinner } from 'react-bootstrap'
import { BasicTable } from '../../components/BasicTable'
import { ModalEditUserGroup } from './ModalEditUserGroup'
import { userGroupsModel } from './userGroupsModel'
import { MdAdd } from 'react-icons/md';
import { AlertError } from '../../components/AlertError'
import { PageTitle } from '../../components/PageTitle'

export function UsersGroupPage () {

  const { isLoading, isError, error, data } = useGetUserGroupsQuery()
  const [ userGroupId, setUserGroupId ] = useState(null)
  const [ show, setShow ] = useState(false)
  
  const openHandler = (id) => { setShow(true); setUserGroupId(id) }
  const closeHandler = () => setShow(false)

  if (isLoading) return <Spinner animation="border" />
  if (isError) return <AlertError error={error} />
  
  return (
    <>
      <PageTitle h1="Usergroups">
        <Button variant="primary" size="sm">< MdAdd /> New usergroup</Button>
      </PageTitle>
      <BasicTable model={userGroupsModel} data={data} clickHandler={openHandler}/>
      { show ? <ModalEditUserGroup model={userGroupsModel} userGroupId={userGroupId} closeHandler={closeHandler} /> : null }
    </>
  )

}
