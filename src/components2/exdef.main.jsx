'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {remote, ipcRenderer} from 'electron'

import List from './exdef.list'
import Details from './exdef.details'

class Main extends Component {
  constructor () {
    super()
    this.state = {
      exdefList: [],
      selectedExdef: ''
    }
    this.selectExdef = this.selectExdef.bind(this)
    this.removeExdef = this.removeExdef.bind(this)
    this.addExdef = this.addExdef.bind(this)
  }
  componentWillMount () {
    this.setState({exdefList: this.props.exdefList})
  }
  selectExdef (_id) {
    this.setState({selectedExdef: _id})
  }
  removeExdef (_id) {
    let updatedExdefList = removeAnItemFromList(this.state.exdefList, '_id', _id)
    let success = ipcRenderer.sendSync('remove-anExdef', _id)
    if (success) this.setState({exdefList: updatedExdefList})
  }
  addExdef (newType, newKind) {
    let newExdefObject = {
      type: newType,
      kind: newKind,
      inf: [],
      id_rules: '',
      id_rules_html: ''
    }
    let newExdef = ipcRenderer.sendSync('add-new-exdef', newExdefObject)
    if (newExdef) {
      let updatedExdefList = addItemsToList(this.state.exdefList, newExdef)
      updatedExdefList.sort(sortKindAndType)
      this.setState({exdefList: updatedExdefList})
    }
  }
  render () {
    let detailsView
    if (this.state.selectedExdef) detailsView = <Details exdef={getAnItemFromList(this.state.exdefList, '_id', this.state.selectedExdef)} />
    else detailsView = <h1>Select an execution view element type from the list</h1>
    return (
      <div>
        <List exdefList={this.state.exdefList} selectedExdef={this.state.selectedExdef} selectExdef={this.selectExdef} removeExdef={this.removeExdef} addExdef={this.addExdef}/>
        {detailsView}
      </div>
    )
  }
}
Main.propTypes = {
  exdefList: PropTypes.array
}

let currentWindow = remote.getCurrentWindow()
ReactDOM.render(<Main exdefList={currentWindow.exdefList} />, document.getElementById('exdefMain'))

function getAnItemFromList(list, key, value) {
  return list.find((e) => e[key] === value)
}

function removeAnItemFromList(list, key, value) {
  let updatedList = list.slice()
  let idx = list.map((e) => e[key]).indexOf(value)
  updatedList.splice(idx, 1)
  return updatedList
}

function addItemsToList(list, value) {
  return list.concat(value)
}

function sortKindAndType (a, b) {
  if (a.kind > b.kind) return 1
  if (a.kind < b.kind) return -1
  if (a.kind === b.kind) {
    if (a.type > b.type) return 1
    if (a.type < b.type) return -1
    return 0
  }
}
