import { DataModel } from "../../classes/DataModel"
import * as Yup from 'yup'

const columns = [
  { 
    key: 'id', type: 'text', 
    label: 'ID',
  },
  { 
    key: 'type', type: 'text', 
    label: 'Type', help: 'Type of event',
    val: Yup.string().required('Required'),
  },
  { 
    key: 'eventAt', type: 'text', 
    label: 'Event at', help: 'Time when event was recorded',
    val: Yup.string().required('Required'),
  },
  { 
    key: 'part', type: 'text', 
    label: 'Part', help: 'Part involved in event', 
  },
  { 
    key: 'description', type: 'text', 
    label: 'Description', help: 'Description of event',
  },
  { 
    key: 'signature', type: 'text', 
    label: 'Sign', help: 'Signature of person reporting event',
  },
  { 
    key: 'comment', type: 'text', 
    label: 'Comments', help: 'Comments related to the event',
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
    label: 'Device serial no', 
  },
  { 
    key: 'Device.serialNo', type: 'text', disabled: true,
    label: 'Device serial no', 
  },
  { 
    key: 'Component.dmCode', type: 'text', disabled: true,
    label: 'Component DM-code', 
  },
]

const tableOptions = {
  pagination: true,
  showColumns: ['id', 'eventAt', 'type', 'eventType', 'Device.serialNo', 'Component.dmCode'],
  initialSorting: [ {id: 'eventAt', desc: false} ],
}

export const userModel = new DataModel({ columns, tableOptions })
