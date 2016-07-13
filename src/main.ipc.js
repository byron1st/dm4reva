'use strict'

import {ipcMain} from 'electron'

import constants from './const'
import * as db from './db'

ipcMain.on(constants.ipcEventType.handleErrors, (event, arg) => {
  handleErrors(new Error(arg))
})

ipcMain.on(constants.ipcEventType.updateExdef, (event, arg) => {
  if (arg._id) {
    db.update(db.nexdef, arg, (err, doc) => {
      if (err) {
        handleErrors(err)
        event.returnValue = false
      } else event.returnValue = doc
    })
  } else {
    handleErrors(new Error('No _id exists'))
    event.returnValue = false
  }
})

ipcMain.on(constants.ipcEventType.removeExdef, (event, arg) => {
  db.deleteOne(db.nexdef, arg, (err) => {
    if (err) {
      handleErrors(err)
      event.returnValue = false
    } else {
      event.returnValue = true
    }
  })
})

ipcMain.on(constants.ipcEventType.addExdef, (event, arg) => {
  let argToArray = []
  if (!Array.isArray(arg)) argToArray.push(arg)
  else argToArray = arg
  db.create(db.nexdef, argToArray, (err, doc) => {
    if (err) {
      handleErrors(err)
      event.returnValue = null
    } else {
      event.returnValue = doc
    }

  })
})

/**
 * @arg {exdefType: '', infList: []}
 */
ipcMain.on(constants.ipcEventType.readDrListMuListErList, (event, arg) => {
  let count = 2
  let returnObj = {drList:[], muList:[], erList:[]}
  db.read(db.mu, {exdefType: arg.exdefType}, {muID: 1}, (err, mus) => {
    if (err) {
      handleErrors(err)
      event.returnValue = false
    } else {
      let muIdList = mus.map((e) => e.muID)
      db.readRecordsOfMUs(muIdList, (err, ers) => {
        if (err) {
          handleErrors(err)
          event.returnValue = false
        } else {
          count--
          returnObj.muList = mus
          returnObj.erList = ers
          if (count === 0) event.returnValue = returnObj
        }
      })
    }
  })

  db.readDRsOfInfs(arg.infList, (err, drs) => {
    if (err) {
      handleErrors(err)
      event.returnValue = false
    } else {
      count--
      returnObj.drList = drs
      if (count === 0) event.returnValue = returnObj
    }
  })

})

ipcMain.on(constants.ipcEventType.validateMuID, (event, muID) => {
  db.validateMUID(muID, (err, num) => {
    if (num === 0) event.returnValue = true
    else event.returnValue = false
  })
})

/**
 * @arg  {exdef: '', muList: ''}
 */
ipcMain.on(constants.ipcEventType.updateExdefWithMuList, (event, arg) => {
  function removeAllMuList (cb) {
    db.deleteByQuery(db.mu, {exdefType: arg.exdef.type}, (err) => {
      if (err) {
        handleErrors(err)
        event.returnValue = false
      } else if (cb) cb()
    })
  }
  function createNewMuList (cb) {
    db.create(db.mu, arg.muList, (err, docs) => {
      if (err) {
        handleErrors(err)
        event.returnValue = false
      } else if (cb) cb()
    })
  }
  function readMuListAndUpdateExdef () {
    let count = 2
    let returnObj = {}
    db.read(db.mu, {exdefType: arg.exdef.type}, {muID: 1}, (err, mus) => {
      if (err) {
        handleErrors(err)
        event.returnValue = false
      } else {
        count--
        returnObj.muList = mus
        if (count === 0) event.returnValue = returnObj
      }
    })
    db.update(db.nexdef, arg.exdef, (err, exdef) => {
      if (err) {
        handleErrors(err)
        event.returnValue = false
      } else {
        count--
        returnObj.exdef = exdef
        if (count === 0) event.returnValue = returnObj
      }
    })
  }

  removeAllMuList(() => {
    if (arg.muList.length === 0) readMuListAndUpdateExdef()
    else createNewMuList(() => readMuListAndUpdateExdef())
  })
})
