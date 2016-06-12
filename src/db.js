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

export let nexdef, ndr, ner, nelems

export function initialize (dbDir, cb) {
  nexdef = new Datastore({filename: path.join(dbDir, 'exdef.db')})
  ndr = new Datastore({filename: path.join(dbDir, 'dr.db')})
  ner = new Datastore({filename: path.join(dbDir, 'er.db')})
  nelems = new Datastore({filename: path.join(dbDir, 'elems.db')})
  loadADB(nexdef)
  .then((exdefDB) => {
    exdefDB.ensureIndex({fieldName: 'type', unique: true})
    exdefDB.ensureIndex({fieldName: 'mu.muID'})
    return loadADB(ndr)
  })
  .then((drDB) => {
    drDB.ensureIndex({fieldName: 'inf'})
    return loadADB(ner)
  })
  .then((erDB) => {
    return loadADB(nelems)
  })
  .then((elemsDB) => {
    elemsDB.ensureIndex({fieldName: 'elemID', unique: true})
    if (cb) cb()
  })
  .catch((err) => console.log(err))
}

export function create(db, items, cb) {
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

export function update(db, anItem, cb) {
  db.update({_id: anItem._id}, anItem, (err) => {
    if (err) cb(err)
    if (cb) cb(null)
  })
}

export function deleteOne(db, id, cb) {
  db.remove({_id: id}, (err) => {
    if (err) return cb(err)
    if (cb) return cb(null)
  })
}

export function deleteAll(db, cb) {
  db.remove({}, { multi: true }, (err, num) => {
    if (err) return cb(err, null)
    if (cb) return cb(null, num)
  })
}

export function validateMUID(muID, cb) {
  nexdef.count({'mu.muID': muID}, (err, num) => {
    if (err) return cb(err, null)
    if (cb) return cb(null, num)
  })
}

export function readRecordsOfMUs(muList, cb) {
  ner.find({muID: {$in: muList}}).sort({mu: 1}).exec((err, docs) => {
    if (err) return cb(err, null)
    if (!docs) return cb(Error('No items'), null)
    if (cb) return cb(null, docs)
  })
}

export function validateID(id, cb) {
  nelems.count({elemID: id}, (err, num) => {
    if (err) return cb(err, null)
    if (cb) return cb(null, num)
  })
}

export function readDRsOfInfs(infList, cb) {
  ndr.find({inf: {$in: infList}}).sort({inf: 1}).exec((err, docs) => {
    if (err) return cb(err, null)
    if (!docs) return cb(Error('No items'), null)
    if (cb) return cb(null, docs)
  })
}
