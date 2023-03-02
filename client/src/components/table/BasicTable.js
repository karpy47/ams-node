/* eslint-disable react/jsx-key */

import React from 'react';
import PropTypes from 'prop-types'
import { Table } from 'react-bootstrap';
// import { ImSortAlphaAsc, ImSortAlphaDesc } from 'react-icons/im';
import { 
  createColumnHelper, 
  getCoreRowModel, 
  getSortedRowModel,
  flexRender, 
  getPaginationRowModel, 
  useReactTable 
} from '@tanstack/react-table'
import BasicPagination from './BasicPagination'
import { FaSortDown, FaSortUp } from 'react-icons/fa'

export function BasicTable({model, data, clickHandler}) {

  const [sorting, setSorting] = React.useState(model.getInitialSorting())

  const columnHelper = createColumnHelper()
  const columns = model.getColumns().map((c) =>
    columnHelper.accessor(c.key, {
      // map output for any column with options defined or actual value if missing 
      cell: x => c.options ?(c.options[x.getValue()] ?? x.getValue()) : x.getValue(),
      header: () => <>{c.label}</>,
    })
  )
  
  const table = useReactTable({
    data, 
    columns, 
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  // function ShowSortIcon (props) {
  //   if (props.active) {
  //     return <span> { props.isDesc ? <ImSortAlphaDesc /> : <ImSortAlphaAsc /> }</span>;
  //   }
  //   return '';
  // }

  return (
    <>
      <Table striped bordered hover size="sm">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : ( <div
                      { ...{
                        className: header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : '',
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <FaSortDown />,
                        desc: <FaSortUp />,
                      }[header.column.getIsSorted()] ?? null}
                  </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} onClick={() => clickHandler ? clickHandler(row.getValue('id')) : null}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </Table>
      { model.isPaginated() ? <BasicPagination table={table} /> : null }
    </>
  )
}
BasicTable.propTypes = {
  model: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  clickHandler: PropTypes.func
}
