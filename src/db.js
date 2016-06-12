'use strict'
import path from 'path'
import Datastore from 'nedb'
import {dialog} from 'electron'

function loadADB (db) {
  return new Promise((resolve, reject) => {
    db.loadDatabase((err) => {
      if (err) reject(err)
      else resolve(db)
    })
  })
}

export let nexdefDB, ndrDB, nerDB, nelemsDB

export default function initDBs (dbDir, cb) {
  nexdefDB = new Datastore({filename: path.join(dbDir, 'exdef.db')})
  ndrDB = new Datastore({filename: path.join(dbDir, 'dr.db')})
  nerDB = new Datastore({filename: path.join(dbDir, 'er.db')})
  nelemsDB = new Datastore({filename: path.join(dbDir, 'elems.db')})
  loadADB(nexdefDB)
  .then((exdefDB) => {
    exdefDB.ensureIndex({fieldName: 'type', unique: true})
    exdefDB.ensureIndex({fieldName: 'mu.muID'})
    return loadADB(ndrDB)
  })
  .then((drDB) => {
    drDB.ensureIndex({fieldName: 'inf'})
    return loadADB(nerDB)
  })
  .then((erDB) => {
    return loadADB(nelemsDB)
  })
  .then((elemsDB) => {
    elemsDB.ensureIndex({fieldName: 'elemID', unique: true})
    if (cb) cb()
  })
  .catch((err) => console.log(err))
}

export function create(db, items, cb) {
  console.log(db)
  db.insert(items, (err, docs) => {
    if (cb) {
      if (err) return cb(err, null)
      if (!docs) return cb(Error('No items'), null)
      return cb(null, docs)
    }
  })
}

export function read(db, queryObj, sortCondition, cb) {
  db.find(queryObj).sort(sortCondition).exec((err, docs) => {
    if (err) return cb(err, null)
    if (!docs) return cb(Error('No items'), null)
    if (cb) return cb(null, docs)
    return docs
  })
}
