import { DataModel } from "../../classes/DataModel"
import { statusOptions, roleOptions } from "../../classes/dataOptions"
import * as Yup from 'yup'

const columns = [
  { 
    key: 'id', type: 'text', 
    label: 'ID',
  },
  { 
    key: 'status', type: 'select', options: statusOptions,
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
    key: 'role', type: 'select', options: roleOptions,
    label: 'Role', help: 'Affects level of access. Only admins may create users.', 
  },
  { 
    key: 'lastLoginAt', type: 'text', 
    label: 'Last login at',
  },
  { 
    key: 'autoLogoutAfter', type: 'number', 
    label: 'Auto logout after', help:'Automatic logout timer measured in seconds.',
    val: Yup.number().min(60, 'Minimum 60').max(3600, 'Maximum 3600')
  },
  { 
    key: 'createdAt', type: 'text', disabled: true,
    label: 'Created at', 
  },
  { 
    key: 'updatedAt', type: 'text', disabled: true,
    label: 'Updated at',
  },
  { 
    key: 'userGroupId', type: 'number',
    label: 'Usergroup', 
    val: Yup.number().integer('Required')
  },
  { 
    key: 'UserGroup.name', type: 'text', disabled: true,
    label: 'Usergroup name', 
  },
  { 
    key: 'UserGroup.description', type: 'text', disabled: true,
    label: 'Usergroup description', 
  },
]

const tableOptions = {
  pagination: true,
  showColumns: ['id', 'name', 'UserGroup.name', 'role', 'status'],
  initialSorting: [ {id: 'name', desc: false} ],
}

export const userModel = new DataModel({ columns, tableOptions })
