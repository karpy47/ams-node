import { DataModel } from "../../classes/DataModel"
import * as Yup from 'yup'

const columns = [
  { 
    key: 'id', type: 'text', 
    label: 'ID',
  },
  { 
    key: 'serialNo', type: 'text', 
    label: 'Serial no', help: 'Serial number of device printed on its label', 
    val: Yup.string().min(5, 'Too short').max(20, 'Too long').required('Required'), 
  },
  { 
    key: 'modelRefNo', type: 'text', 
    label: 'Model ref.no', help: 'Device model number printed on its label',
    val: Yup.string().required('Required'), 
  },
  { 
    key: 'manufacturedAt', type: 'text', 
    label: 'Manufactured at', help: 'Date when manufacturing of device ended',
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
    key: 'comment', type: 'text', 
    label: 'Comments', help: 'Comments related to the device',
  },
  { 
    key: 'firstUseAt', type: 'text', 
    label: 'First use at', help: 'First time the device was used',
  },
  {
    key: 'lastUseAt', type: 'text', 
    label: 'Last use at', help: 'Last time the device was known to be used',
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
  showColumns: ['id', 'serialNo', 'modelRefNo', 'manufacturedAt', 'lastUseAt'],
  initialSorting: [ {id: 'serialNo', desc: false} ],
}

export const deviceModel = new DataModel({ columns, tableOptions })
