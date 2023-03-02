import * as Yup from 'yup'

/**
 * Class to store and manipulate data model information
 */
export class DataModel {

  constructor({ columns, tableOptions }) {
    this.columns = columns ? columns : []
    this.tableOptions = tableOptions ? tableOptions : []
  }

  /**
     * Get data object with given key
     * @param {String} value - Key to find in store
     * @returns {Object}
     */
  getColumn(value) {
    return this.columns.find( item => (item.key == value ))
  }

  /**
   * Get all columns to show in table
   * @returns {Array}
   */
  getColumns() {
    // return this.columns.filter( item => this.tableOptions.showColumns.includes(item.key) )
    return this.tableOptions.showColumns.reduce((res, item) => { 
      const foundItem = this.columns.find(col => col.key == item)
       if (foundItem) res.push(foundItem)
       return res
    }, [])
  }

  /**
   * Get default sorting for table
   * @returns {Array}
   */
  getInitialSorting() {
    return this.tableOptions.initialSorting ?? []
  }

  isPaginated() {
    return this.tableOptions.pagination ?? false
  }

  /**
   * Get validation object (Yup) for full model
   * @returns {Array}
   */
  getValidation() {
    var result = {}
    this.columns.forEach(item => {
      if (item.val) result[item.key] = item.val
    });
    return Yup.object().shape(result)
  }

  /**
   * Get default values for model
   * @returns {Object}
   */
  getDefaultValues() {
    var result = {}
    this.columns.forEach(item => {
      if (!item.disabled) result[item.key] = item.default ?? null
    });
    return result
  }

}
