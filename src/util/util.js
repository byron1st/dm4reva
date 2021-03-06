'use strict'

import {dialog} from 'electron'

export function contains(list, key, value) {
  return list.map((e) => e[key]).indexOf(value) !== -1
}
export function getAnItemFromList(list, key, value) {
  return copyObj(list.find((e) => e[key] === value))
}

export function removeAnItemFromList(list, key, value) {
  let updatedList = list.slice()
  let idx = list.map((e) => e[key]).indexOf(value)
  updatedList.splice(idx, 1)
  return updatedList
}

export function addItemsToList(list, value) {
  return list.concat(value)
}

export function replaceAnItem(list, key, value, replaced) {
  let updatedList = list.slice()
  let idx = list.map((e) => e[key]).indexOf(value)
  updatedList.splice(idx, 1, replaced)
  return updatedList
}

export function sortKindAndType (a, b) {
  if (a.kind > b.kind) return 1
  if (a.kind < b.kind) return -1
  if (a.kind === b.kind) {
    if (a.type > b.type) return 1
    if (a.type < b.type) return -1
    return 0
  }
}

export function copyObj(obj) {
  if (obj) return JSON.parse(JSON.stringify(obj))
  else return obj
}

export function handleErrors (err, message) {
  if (message) dialog.showErrorBox('An error occurs', message)
  else dialog.showErrorBox('An error occurs', err.toString())
}
