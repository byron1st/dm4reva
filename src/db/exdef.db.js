'use strict'
import path from 'path'
import Datastore from 'nedb'

/**
{
  type: string,
  kind: string,
  inf: [string],
  rid: [string],
  idRules: string
}
**/
const db = new Datastore({filename: path.join(__dirname, '../db/exdef.db'), autoload: true})
db.ensureIndex({fieldName: 'type', unique: true})

function handleError(err) {
  console.log(err)
}

export function create(items, cb) {
  db.insert(items, (err, docs) => {
    if (cb) {
      if (err) return cb(err, undefined)
      if (!docs) return cb(Error('No items'), undefined)
      return cb(undefined, docs)
    }
  })
}

export function read(queryObj, sortCondition, cb) {
  db.find(queryObj).sort(sortCondition).exec((err, docs) => {
    if (err) return handleError(err)
    if (!docs) return handleError(Error('No items'))
    if (cb) return cb(docs)
    return docs
  })
}

export function update(anItem, cb) {
  db.update({_id: anItem._id}, anItem, (err) => {
    if (err) cb(err)
    if (cb) cb(undefined)
  })
}

export function deleteOne(id, cb) {
  db.remove({_id: id}, (err) => {
    if (err) return cb(err)
    if (cb) return cb(undefined)
  })
}

export function deleteAll(cb) {
  db.remove({}, { multi: true }, (err, num) => {
    if (err) return handleError(err)
    if (cb) return cb(num)
    return num
  })
}
