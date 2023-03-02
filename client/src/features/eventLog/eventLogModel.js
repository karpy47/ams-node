import { DataModel } from "../../classes/DataModel"

const columns = [
  { key: 'id', type: 'text', label: 'ID', },
  { key: 'type', type: 'text', label: 'Type', disabled: true, },
  { key: 'message', type: 'text', label: 'Message', disabled: true, },
  { key: 'sourceType', type: 'text', label: 'Source type', disabled: true, },
  { key: 'sourceId', type: 'integer', label: 'Source id', disabled: true, },
  { key: 'createdAt', type: 'text', label: 'Created at', disabled: true, },
  { key: 'updatedAt', type: 'text', label: 'Updated at',disabled: true, },
]

const tableOptions = {
  pagination: true,
  showColumns: ['id', 'createdAt', 'type', 'message', 'sourceType'],
  initialSorting: [ {id: 'createdAt', desc: true} ],
}

export const eventLogModel = new DataModel({ columns, tableOptions })
