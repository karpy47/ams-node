import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './Home';
import { NotFound } from './NotFound';
import { UsersGroupPage } from '../features/usergroups/UserGroupsPage';
import { UsersPage } from '../features/users/UsersPage';
import { LoginPage } from '../features/auth/LoginPage';
import { LogoutPage } from '../features/auth/LogoutPage';
import { ProfilePage } from '../features/auth/ProfilePage';

export function Router () {
  
  return (
    <Routes>
      <Route path='/' element={ <Home />} />
      <Route path='/usergroups' element={ <UsersGroupPage /> } />
      <Route path='/users' element={ <UsersPage /> } />
      <Route path='/login' element={ <LoginPage /> } />
      <Route path='/logout' element={ <LogoutPage /> } />
      <Route path='/profile' element={ <ProfilePage /> } />
      <Route path="*" element={ <NotFound /> } />
    </Routes>
  )

}
