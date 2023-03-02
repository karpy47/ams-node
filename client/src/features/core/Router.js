import React from 'react';
import { useSelector } from 'react-redux'
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { LoginPage } from '../auth/LoginPage';
import { LogoutPage } from '../auth/LogoutPage';
import { Home } from './Home';
import { UsersGroupPage } from '../userGroups/UserGroupsPage';
import { UsersPage } from '../users/UsersPage';
import { UsersIndex } from '../users/UsersIndex';
import { EditUserPage } from '../users/EditUserPage';
import { ProfilePage } from '../auth/ProfilePage';
import { NotFound } from './NotFound';
import { AddUserPage } from '../users/AddUserPage';

function PrivateRoute() {
  const authUser = useSelector((state) => state.auth.user)
  const location = useLocation()

  // save page called and return to it after successful login
  return (authUser ? <Outlet /> : 
    <Navigate to="/login" replace state={{from: location}} />
  )
}

export function Router () {
  return (
    <Routes>
      <Route path='/login' element={ <LoginPage /> } />
      <Route path='/logout' element={ <LogoutPage /> } />

      <Route element={ <PrivateRoute /> }>
        <Route index element={ <Home /> } />
        <Route path='/home' element={ <Home /> } />
        <Route path='/usergroups' element={ <UsersGroupPage /> } />
        <Route path='/users-old' element={ <UsersPage /> } />
        <Route path='/users' element={ <UsersIndex /> } />
        <Route path='/user/add' element={ <AddUserPage /> } />
        <Route path='/user/:userId' element={ <EditUserPage /> } />
        <Route path='/profile' element={ <ProfilePage /> } />
      </Route>

      <Route path="*" element={ <NotFound /> } />
    </Routes>
  )
}
