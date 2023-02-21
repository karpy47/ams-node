import React from 'react';
import PropTypes from 'prop-types'
import { Pagination, Dropdown, DropdownButton } from 'react-bootstrap';

function BasicPagination(props) {

  // const getRange = range.map((item) => 
  //   { item.active ? 
  //     <Pagination.Item>{item}</Pagination.Item>
  //   :
  //     <Pagination.Item>{item}</Pagination.Item>
  //   }
  // )

  const delta = 2
  const currentPage = props.table.getState().pagination.pageIndex + 1
  const lastPage = props.table.getPageCount()

  return (
    <Pagination size="sm">
      <Pagination.First 
        onClick={() => props.table.setPageIndex(0)}
      />
      { (currentPage > delta + 1) ?
          <Pagination.Ellipsis />
        : null
      }
      { (delta >=2 && currentPage - 2 >= 1) ?
          <Pagination.Item onClick={() => props.table.setPageIndex(currentPage - 3)}>
            {currentPage - 2}
          </Pagination.Item>
        : null
      }
      { (currentPage - 1 >= 1) ?
        <Pagination.Item onClick={() => props.table.setPageIndex(currentPage - 2)}>
          {currentPage - 1}
        </Pagination.Item>
        : null
      }
      <Pagination.Item active>{currentPage}</Pagination.Item>
      { (currentPage + 1 <= lastPage) ?
          <Pagination.Item onClick={() => props.table.setPageIndex(currentPage)}>
              {currentPage + 1}
          </Pagination.Item>
        : null
      }
      { (delta >= 2 && currentPage + 2 <= lastPage) ?
         <Pagination.Item onClick={() => props.table.setPageIndex(currentPage + 1)}>
           {currentPage + 2}
          </Pagination.Item>
        : null
      }
      { (currentPage < lastPage - delta) ?
          <Pagination.Ellipsis />
        : null
      }
      { (lastPage > 1) ?
          <Pagination.Last 
            onClick={() => props.table.setPageIndex(lastPage-1)}
          />
        : null 
      }
      &nbsp;
      <DropdownButton 
        id="size" size="sm" variant="secondary" 
        title={'Show ' + props.table.getState().pagination.pageSize}
        onSelect={e => {
          props.table.setPageSize(e)
        }}
      >
        { [10, 25, 50, 100].map(size => (
          <Dropdown.Item key={size} eventKey={size}>{size}</Dropdown.Item>
        ))}
      </DropdownButton>
    </Pagination>
  )
}
BasicPagination.propTypes = {
  table: PropTypes.object.isRequired,
}

export default BasicPagination
