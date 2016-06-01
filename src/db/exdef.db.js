'use strict'
import path from 'path'
import Datastore from 'nedb'

/**
{
  type: string,
  kind: string,
  inf: [string],
  id_rules: string,
  mu: [string],
  elems: [string]
}
**/
const db = new Datastore({filename: path.join(__dirname, '../db/exdef.db'), autoload: true})
db.ensureIndex({fieldName: 'type', unique: true})
db.ensureIndex({fieldName: 'mu.muID'})

export function create(items, cb) {
  db.insert(items, (err, docs) => {
    if (cb) {
      if (err) return cb(err, null)
      if (!docs) return cb(Error('No items'), null)
      return cb(null, docs)
    }
  })
}

export function read(queryObj, sortCondition, cb) {
  db.find(queryObj).sort(sortCondition).exec((err, docs) => {
    if (err) return cb(err, null)
    if (!docs) return cb(Error('No items'), null)
    if (cb) return cb(null, docs)
    return docs
  })
}

export function update(anItem, cb) {
  db.update({_id: anItem._id}, anItem, (err) => {
    if (err) cb(err)
    if (cb) cb(null)
  })
}

export function deleteOne(id, cb) {
  db.remove({_id: id}, (err) => {
    if (err) return cb(err)
    if (cb) return cb(null)
  })
}

export function deleteAll(cb) {
  db.remove({}, { multi: true }, (err, num) => {
    if (err) return cb(err, null)
    if (cb) return cb(null, num)
  })
}

export function validateMUID(muID, cb) {
  db.count({'mu.muID': muID}, (err, num) => {
    if (err) return cb(err, null)
    if (cb) return cb(null, num)
  })
}
