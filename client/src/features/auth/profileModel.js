import { DataModel } from "../../classes/DataModel"
import { statusOptions, roleOptions } from "../../classes/dataOptions"
import * as Yup from 'yup'

const columns = [
  { 
    key: 'id', type: 'text', 
    label: 'ID',
  },
  { 
    key: 'status', type: 'select', options: statusOptions, disabled: true,
    label: 'Status', help: 'Current user status. Lock for temporary paus.', 
  },
  { 
    key: 'name', type: 'text', 
    label: 'Name', help: 'Name is visible to other users.', 
    val: Yup.string().min(2, 'Too short').max(100, 'Too long').required('Required'), 
  },
  { 
    key: 'email', type: 'text', 
    label: 'E-mail', help: 'Used to reset password.',
    val: Yup.string().email('Invalid email'),
  },
  { 
    key: 'phone', type: 'text', 
    label: 'Phone', help: 'Name is visible to other users.',
    val: Yup.string().min(8, 'Too short').max(100, 'Too long'),
  },
  { 
    key: 'role', type: 'select', options: roleOptions, disabled: true,
    label: 'Role', help: 'Affects level of access. Only admins may create users.', 
  },
  { 
    key: 'autoLogoutAfter', type: 'number', 
    label: 'Auto logout after', help:'Automatic logout timer measured in seconds.',
    val: Yup.number().min(60, 'Minimum 60').max(3600, 'Maximum 3600')
  },
  { 
    key: 'UserGroup.name', type: 'text', disabled: true,
    label: 'Usergroup name', 
  },
]

export const profileModel = new DataModel({ columns })
