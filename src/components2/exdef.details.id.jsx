'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {ipcRenderer} from 'electron'

import IdView from './exdef.details.id.view'
import IdEdit from './exdef.details.id.edit'

import {type as uiActionType} from './actions.ui'
import * as util from './util'
import constants from './const'

const scrollCSS = {
  'overflowY': 'scroll',
  'height': '270px'
}

export default class Id extends Component {
  constructor () {
    super()
    this.toggleEdit = this.toggleEdit.bind(this)
    this.buildIdContent = this.buildIdContent.bind(this)
    this.saveChanges = this.saveChanges.bind(this)
  }
  toggleEdit () {
    this.props.dispatcher.dispatch({type: uiActionType.toggleEdit, value: constants.editPage.id})
  }
  saveChanges (newMuList, newIdRules) {
    let success
    if (newMuList.length !== 0) success = ipcRenderer.sendSync('save-mu-list', newMuList)
    else success = ipcRenderer.sendSync('remove-all-mu-by-exdef', this.props.store.selected.exdef.type)
    if (success) {
      this.props.updateExdefIdRules(this.props.store.selected.exdef._id, newIdRules)
      this.setState({muList: newMuList, editMode: false})
    }
  }
  buildIdContent () {
    if (this.props.store.editMode.id) return <IdEdit
      store={this.props.store}
      exdef={this.props.store.selected.exdef}
      id_rules={this.props.store.selected.exdef.id_rules}
      muList={this.props.store.selected.muList}
      saveChanges={this.saveChanges}
      toggleEdit={this.toggleEdit} />
    else return <IdView store={this.props.store} />
  }
  render () {
    let idContent = this.buildIdContent()
    return (
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-12'>
            <h3>{this.props.store.selected.exdef.type}
              {(!this.props.store.editMode.id) ? <a href='#'><span className='glyphicon glyphicon-wrench pull-right' onClick={this.toggleEdit}></span></a> : null }
            </h3>
          </div>
        </div>
        <div className='row'>
          <DrView drList={this.props.store.selected.drList} />
        </div>
        <div className='row'>
          {idContent}
        </div>
      </div>
    )
  }
}
Id.propTypes = {
  updateExdefIdRules: PropTypes.func.isRequired
}

class DrView extends Component {
  render () {
    let listView = []
    this.props.drList.forEach((dr) => listView.push(
      <li className='list-group-item'>
        <h5 className='list-group-item-heading'>{dr.inf} <small>{dr.sink}</small></h5>
        <p className='list-group-item-text'>
          <ul>
            <li>Source: {dr.source}</li>
            <li>Kind: {dr.rkind}</li>
          </ul>
        </p>
      </li>
    ))
    return (
      <div className='col-md-12' style={this.props.drList.length > 3 ? scrollCSS : null}>
        {listView}
      </div>
    )
  }
}
DrView.propTypes = {
  drList: PropTypes.array.isRequired
}
