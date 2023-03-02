import { DataModel } from "../../classes/DataModel"

const columns = [
  { key: 'id', type: 'text', label: 'ID', },
  { key: 'table', type: 'text', label: 'DB table', disabled: true, },
  { key: 'tableId', type: 'integer', label: 'Row id', disabled: true, },
  { key: 'action', type: 'text', label: 'Action', disabled: true, },
  { key: 'before', type: 'text', label: 'JSON before', disabled: true, },
  { key: 'changed', type: 'text', label: 'JSON change', disabled: true, },
  { key: 'sourceType', type: 'text', label: 'Source type', disabled: true, },
  { key: 'sourceId', type: 'integer', label: 'Source id', disabled: true, },
  { key: 'createdAt', type: 'text', label: 'Created at', disabled: true, },
  { key: 'updatedAt', type: 'text', label: 'Updated at',disabled: true, },
]

const tableOptions = {
  pagination: true,
  showColumns: ['id', 'createdAt', 'table', 'action', 'sourceType'],
  initialSorting: [ {id: 'createdAt', desc: true} ],
}

export const auditLogModel = new DataModel({ columns, tableOptions })
