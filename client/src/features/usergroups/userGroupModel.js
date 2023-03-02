import { DataModel } from "../../classes/DataModel"
import * as Yup from 'yup'

const columns = [
  { 
    key: 'id', type: 'text', 
    label: 'ID',
  },
  { 
    key: 'name', type: 'text', 
    label: 'Name', help: 'Name is visible to other users.', 
    val: Yup.string().min(2, 'Too short').max(100, 'Too long').required('Required'), 
  },
  { 
    key: 'description', type: 'text', 
    label: 'Description',
    val: Yup.string().min(2, 'Too short').max(100, 'Too long'),
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
  showColumns: ['id', 'name', 'description'],
  initialSorting: [ {id: 'name', desc: false} ],
}

export const userGroupModel = new DataModel({ columns, tableOptions })
