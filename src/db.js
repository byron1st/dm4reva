'use strict'
import path from 'path'
import Datastore from 'nedb'
import {dialog} from 'electron'
import Scheme from './db.scheme.js'

function loadADB (db) {
  return new Promise((resolve, reject) => {
    db.loadDatabase((err) => {
      if (err) reject(err)
      else resolve(db)
    })
  })
}

function validateScheme (kind, items) {
  let scheme = Scheme[kind]
  let validationResult = true
  if (scheme) {
    if (Array.isArray(items)) {
      validationResult = items.every(
        (item) => {
            let keys = Object.keys(scheme)
            return keys.every(
              (key) => {
                  if ((!item[key] || item[key] === '') && scheme[key].isMandatory) return false
                  if ((!item[key] || item[key] === '') && !scheme[key].isMandatory) return true
                  if (Array.isArray(scheme[key].type)) {
                    if (scheme[key].type.indexOf(item[key]) === -1) return false
                    else return true
                  } else {
                    switch (scheme[key].type) {
                      case 'string': return (typeof item[key] === 'string')
                      case 'array':
                        if (!Array.isArray(item[key])) return false
                        return item[key].every(
                          (subitem) => {
                            if (scheme[key].item === 'string') return (typeof subitem === 'string')
                            // only string is allowed for the array type at this moment.
                            // else {
                            //   let subKeys = Object.keys(scheme[key].item)
                            //   return subKeys.every((subkey) => {
                            //     if (!subitem[subkey] && scheme[key].item[subkey].isMandatory) return false
                            //     return (typeof subitem[subkey] === 'string')
                            //   })
                            // }
                          })
                      case 'object': return (item[key] instanceof Object) && !Array.isArray(item[key])
                    }
                  }
                  return true
                })
          })
    } else {
      //should be an array
      validationResult = false
    }
  } else {
    validationResult = false
  }
  return validationResult
}

export let nexdef, ndr, ner, mu

export function initialize (dbDir, cb) {
  nexdef = new Datastore({filename: path.join(dbDir, 'exdef.db')})
  ndr = new Datastore({filename: path.join(dbDir, 'dr.db')})
  ner = new Datastore({filename: path.join(dbDir, 'er.db')})
  mu = new Datastore({filename: path.join(dbDir, 'mu.db')})
  loadADB(nexdef)
  .then((exdefDB) => {
    exdefDB.ensureIndex({fieldName: 'type', unique: true})
    return loadADB(ndr)
  })
  .then((drDB) => {
    drDB.ensureIndex({fieldName: 'inf'})
    return loadADB(ner)
  })
  .then((erDB) => {
    return loadADB(mu)
  })
  .then((muDB) => {
    muDB.ensureIndex({fieldName: 'exdefType'})
    muDB.ensureIndex({fieldName: 'muID', unique: true})
    if (cb) cb()
  })
  .catch((err) => console.log(err))
}

export function create(db, items, cb) {
  let validationResult
  switch (db) {
    case nexdef: validationResult = validateScheme('exdef', items); break;
    case ndr: validationResult = validateScheme('dr', items); break;
    case ner: validationResult = validateScheme('er', items); break;
    case mu: validationResult = validateScheme('mu', items); break;
    default: validationResult = false; break;
  }
  if (validationResult) {
    db.insert(items, (err, docs) => {
      if (cb) {
        if (err) return cb(err, null)
        if (!docs) return cb(Error('No items'), null)
        return cb(null, docs)
      }
    })
  } else {
    if (cb) return cb(Error('Data validation failed.'), null)
  }
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
  db.update({_id: anItem._id}, anItem, {returnUpdatedDocs: true}, (err, num, doc) => {
    if (err) cb(err, null)
    if (cb) cb(null, doc)
  })
}

export function upsert(db, anItem, cb) {
  db.update({_id: anItem._id}, anItem, {upsert: true}, (err) => {
    if (err) cb(err)
    else cb()
  })
}

export function deleteByQuery(db, query, cb) {
  db.remove(query, { multi: true }, (err,num) => {
    if (cb) {
      if (err) return cb(err)
      else return cb()
    }
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
  mu.count({'muID': muID}, (err, num) => {
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
