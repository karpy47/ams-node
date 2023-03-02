import { DataModel } from "../../classes/DataModel"
import * as Yup from 'yup'

const columns = [
  { 
    key: 'id', type: 'text', 
    label: 'ID',
  },
  {
    key: 'dmCode', type: 'text', 
    label: 'DM Code', help: 'Data Matrix code on component label', 
    val: Yup.string().required('Required'),
  },
  {
    key: 'status', type: 'text', 
    label: 'Status', help: 'Component\'s current status',
    val: Yup.string().required('Required'),
  },
  {
    key: 'type', type: 'text', 
    label: 'Type', help: 'Type of component',
    val: Yup.string().required('Required'),
  },
  {
    key: 'partRefNo', type: 'text', 
    label: 'Part ref.no', help: 'Refenece number of component',
  },
  { 
    key: 'manufacturedAt', type: 'text', 
    label: 'Manufactured at', help: 'Date when manufacturing of component ended',
  },
  { 
    key: 'discardedAt', type: 'text', 
    label: 'Manufactured at', help: 'Date when component was discarded',
  },
  { 
    key: 'manufactureWiRefNo', type: 'text', 
    label: 'WI ref.no', help: 'Reference to manufacturing work instruction',
  },
  { 
    key: 'signatureManufacturing', type: 'text', 
    label: 'Sign manufacturing', help: 'Signature of person responsible for manufacturing',
  },
  { 
    key: 'signatureInspection', type: 'text', 
    label: 'Sign inspection', help: 'Signature of person responsible for inspection after manufacturing',
  },
  {
    key: 'poNumber', type: 'text', 
    label: 'Sign', help: 'Purchase order numbers related to the component',
  },
  {
    key: 'comment', type: 'text', 
    label: 'Comments', help: 'Comments related to the component',
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
    key: 'deviceId', type: 'text',
    label: 'Device ID', 
  },
  { 
    key: 'Device.serialNo', type: 'text', disabled: true,
    label: 'Device serial no', 
  },
]

const tableOptions = {
  pagination: true,
  showColumns: ['id', 'status', 'type', 'manufacturedAt', 'Device.serialNo'],
  initialSorting: [ {id: 'manufacturedAt', desc: true} ],
}

export const componentModel = new DataModel({ columns, tableOptions })
