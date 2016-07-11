'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {remote, ipcRenderer} from 'electron'
import showdown from 'showdown'

import List from './exdef.list'
import Details from './exdef.details'
import * as util from './util'
/**
exdef= {
  type: '',
  kind: '',
  inf: [],
  id_rules: '',
  id_rules_html: ''
}
**/
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
    this.updateExdef = this.updateExdef.bind(this)
    this.updateExdefIdRules = this.updateExdefIdRules.bind(this)
    this.updateExdefList = this.updateExdefList.bind(this)
  }
  componentWillMount () {
    this.setState({exdefList: this.props.exdefList})
  }
  selectExdef (_id) {
    this.setState({selectedExdef: _id})
  }
  removeExdef (_id) {
    let updatedExdefList = util.removeAnItemFromList(this.state.exdefList, '_id', _id)
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
      let updatedExdefList = util.addItemsToList(this.state.exdefList, newExdef)
      updatedExdefList.sort(util.sortKindAndType)
      this.setState({exdefList: updatedExdefList})
    }
  }
  updateExdef (_id, type, kind, inf) {
    let previous = util.getAnItemFromList(this.state.exdefList, '_id', _id)
    let updatedExdef = {
      type: type,
      kind: kind,
      inf: inf,
      _id: _id,
      id_rules: previous.id_rules,
      id_rules_html: previous.id_rules_html
    }
    let success = ipcRenderer.sendSync('update-exdef', updatedExdef)
    this.updateExdefList(success, util.replaceAnItem(this.state.exdefList, '_id', updatedExdef._id, success))
  }
  updateExdefIdRules (_id, newIdRules) {
    let previous = util.getAnItemFromList(this.state.exdefList, '_id', _id)
    let converter = new showdown.Converter()
    let updatedExdef = {
      type: previous.type,
      kind: previous.kind,
      inf: previous.inf,
      _id: _id,
      id_rules: newIdRules
    }
    updatedExdef.id_rules_html = converter.makeHtml(updatedExdef.id_rules)
    let success = ipcRenderer.sendSync('update-exdef', updatedExdef)
    this.updateExdefList(success, util.replaceAnItem(this.state.exdefList, '_id', updatedExdef._id, success))
  }
  updateExdefList (success, newExdefList) {
    if (success) {
      newExdefList.sort(util.sortKindAndType)
      this.setState({exdefList: newExdefList})
    }
  }
  render () {
    let detailsView
    if (this.state.selectedExdef) detailsView = <Details exdef={util.getAnItemFromList(this.state.exdefList, '_id', this.state.selectedExdef)} updateExdef={this.updateExdef} updateExdefIdRules={this.updateExdefIdRules}/>
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
