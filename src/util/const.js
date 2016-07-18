'use strict'

export default {
  editPage: {
    list: 'list',
    def: 'def',
    id: 'id'
  },
  detailsTabName: {
    def: 'Definition',
    id: 'Identification Rules',
    er: 'Execution Records'
  },
  exdefKindsList: ['EComponent', 'EConnector', 'EPort'],
  ipcEventType: {
    readDrListMuListErList: 'read-drs-mus-ers',
    removeExdef: 'remove-anExdef',
    addExdef: 'add-exdef',
    updateExdef: 'update-exdef',
    handleErrors: 'handle-errors',
    validateMuID: 'validate-muID',
    updateExdefWithMuList: 'update-exdef-with-mu',
    showLoading: 'show-loading',
    hideLoading: 'hide-loading'
  }
}
