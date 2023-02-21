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
    key: 'dmCodeA', type: 'text',
    label: 'PCA Code A', help: 'Data matrix code of PCA inside the device',
  },
  { 
    key: 'dmCodeB', type: 'text',
    label: 'Batt Code B', help: 'Data matrix code of Main Battery inside the device',
  },
  { 
    key: 'dmCodeC', type: 'text',
    label: 'Coil Code C', help: 'Data matrix code of Coil Assembly inside the device',
  },
  { 
    key: 'dmCodeD', type: 'text',
    label: 'Pump Code D', help: 'Data matrix code of Pump Motor Assembly inside the device',
  },
  { 
    key: 'dmCodeE', type: 'text',
    label: 'Enclosure Code E', help: 'Data matrix code of Enclosure inside the device',
  },
  { 
    key: 'dmCodeF', type: 'text',
    label: 'Solenoid Code F', help: 'Data matrix code of Solenoid Assembly inside the device',
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

export const userModel = new DataModel({ columns, tableOptions })
