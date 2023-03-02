import { DataModel } from "../../classes/DataModel"
import { statusOptions } from "../../classes/dataOptions"
import * as Yup from 'yup'

const columns = [
  { 
    key: 'id', type: 'text', 
    label: 'ID',
  },
  { 
    key: 'status', type: 'select', options: statusOptions,
    label: 'Status', help: 'Current patient status. Lock for temporary paus.', 
  },
  { key: 'name', type: 'text', label: 'Name', },
  { key: 'adress1', type: 'text', label: 'Address line 1', },
  { key: 'address2', type: 'text', label: 'Address line 2', },
  { key: 'postcode', type: 'text', label: 'Address line 2', },
  { key: 'city', type: 'text', label: 'City', },
  { key: 'country', type: 'text', label: 'Country', },
  { key: 'phone', type: 'text', label: 'Phone', },
  { key: 'email', type: 'text', label: 'Email', },
  { key: 'openHours', type: 'text', label: 'Open hours', },
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
    key: 'createdAt', type: 'text', disabled: true,
    label: 'Created at', 
  },
  { 
    key: 'updatedAt', type: 'text', disabled: true,
    label: 'Updated at',
  },
]

const tableOptions = {
  pagination: true,
  showColumns: ['id', 'status', 'name', 'email'],
  initialSorting: [ {id: 'name', desc: false} ],
}

export const clinicModel = new DataModel({ columns, tableOptions })
