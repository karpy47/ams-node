import { DataModel } from "../../classes/DataModel"
import { statusOptions } from "../../classes/dataOptions"
import * as Yup from 'yup'

const columns = [
  { key: 'id', type: 'text', label: 'ID', },
  { 
    key: 'status', type: 'select', options: statusOptions,
    label: 'Status', help: 'Current patient status. Lock for temporary paus.', 
  },
  { key: 'firstname', type: 'text', label: 'First name', },
  { key: 'lastname', type: 'text',  label: 'Last name',  },
  { key: 'adress1', type: 'text', label: 'Address line 1', },
  { key: 'address2', type: 'text', label: 'Address line 2', },
  { key: 'postcode', type: 'text', label: 'Address line 2', },
  { key: 'city', type: 'text', label: 'City', },
  { key: 'country', type: 'text', label: 'Country', },
  { key: 'personalId', type: 'text', label: 'Person ID', },
  { 
    key: 'email', type: 'text', 
    label: 'E-mail', val: Yup.string().email('Invalid email'),
  },
  { 
    key: 'phone', type: 'text', 
    label: 'Phone', val: Yup.string().min(8, 'Too short').max(100, 'Too long'),
  },
  { key: 'gender', type: 'text', label: 'Gender', },
  { key: 'birthDate', type: 'text', label: 'Birth date', },
  { key: 'comment', type: 'text', label: 'Comment', },
  { key: 'lastLoginAt', type: 'text', label: 'Last login at', },
  { key: 'DeceasedDate', type: 'text', label: 'Deacease date', },
  { key: 'anonymisedAt', type: 'text', label: 'Anonymised at', },
  { 
    key: 'createdAt', type: 'text', disabled: true,
    label: 'Created at', 
  },
  { 
    key: 'updatedAt', type: 'text', disabled: true,
    label: 'Updated at',
  },
  { 
    key: 'clinicId', type: 'number',
    label: 'Clinic', 
    val: Yup.number().integer('Required')
  },
  { 
    key: 'Clinic.name', type: 'text', disabled: true,
    label: 'Clinic name', 
  },
  { 
    key: 'deviceId', type: 'number',
    label: 'Device',
  },
  { 
    key: 'Devcie.serialNo', type: 'text', disabled: true,
    label: 'Serial no of patient\'s device', 
  },
]

const tableOptions = {
  pagination: true,
  showColumns: ['id', 'firstname', 'lastname', 'status', 'lastLoginAt'],
  initialSorting: [ {id: 'firstname', desc: false}, {id: 'lastname', desc: false}],
}

export const patientModel = new DataModel({ columns, tableOptions })
