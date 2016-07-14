'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {ipcRenderer} from 'electron'

import {type as uiActionType} from './actions.ui'
import {type as muActionType} from './actions.mu'
import {type as exdefActionType} from './actions.exdef'
import * as util from './util'
import constants from './const'

const marginBottomCSS = {
  'margin-bottom': '10px'
}

export default class IdEdit extends Component {
  toggleEdit () {
    this.props.dispatcher.dispatch({type: uiActionType.toggleEdit, value: constants.editPage.id})
  }
  changeMu (muID, desc) {
    this.props.dispatcher.dispatch({type: muActionType.changeMu, value: {muID: muID, desc: desc}})
  }
  updateIdRules (updatedIdRules) {
    let changedValue = {key: 'id_rules', value: updatedIdRules}
    this.props.dispatcher.dispatch({type: exdefActionType.updateValue, value: changedValue})
  }
  addMu () {
    this.props.dispatcher.dispatch({type: muActionType.addMu, value: {muID: $('#newMuID').val(), desc: $('#newMuDesc').val()}})
    $('#newMuID').val('')
    $('#newMuDesc').val('')
  }
  removeMu (muID) {
    this.props.dispatcher.dispatch({type: muActionType.removeMu, value: muID})
  }
  save () {
    this.props.dispatcher.dispatch({type: exdefActionType.updateExdefWithMu, value: constants.editPage.id})
  }
  validateMuID (muID) {
    const currentClassName = document.getElementById('newMuID').className
    const index = currentClassName.indexOf(' errorInput')

    let success = !util.contains(this.props.store.updated.muList, 'muID', muID)
    if (success) success = ipcRenderer.sendSync(constants.ipcEventType.validateMuID, muID)
    if (success) {
      if (index !== -1) document.getElementById('newMuID').className = currentClassName.substring(0, index)
      document.getElementById('muAddBtn').disabled = false
    } else {
      if (index === -1) document.getElementById('newMuID').className = currentClassName + ' errorInput'
      document.getElementById('muAddBtn').disabled = true
    }
  }
  render () {
    let muListView = []
    this.props.store.updated.muList.forEach((mu, idx) => muListView.push(
      <div className='panel panel-default' style={marginBottomCSS}>
        <div className='panel-heading'>
          <h4 className='panel-title'>{mu.muID}
            <a href='#'><span className='glyphicon glyphicon-remove pull-right' onClick={() => this.removeMu(mu.muID)}></span></a>
          </h4>
        </div>
        <div className='panel-body'>
          <textarea className='form-control' rows='5' value={mu.desc} name={mu.muID} onChange={(e) => this.changeMu(e.target.name, e.target.value)} />
        </div>
      </div>
    ))
    return (
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-6'>
            <button type='button' className='btn btn-primary btn-block' onClick={this.save.bind(this)}>Save</button>
          </div>
          <div className='col-md-6'>
            <button type='button' className='btn btn-danger btn-block' onClick={this.toggleEdit.bind(this)}>Cancel</button>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <h3>Description</h3>
            <div className='well well-sm' id='idRulesHTML'>
              <textarea className='form-control' rows='5' value={this.props.store.updated.exdef.id_rules} onChange={(e) => this.updateIdRules(e.target.value)} />
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <h3>Monitoring Units</h3>
            <div className='panel panel-default' style={marginBottomCSS}>
              <div className='panel-heading'>
                <div className='input-group input-group-sm'>
                  <span className='input-group-btn'>
                    <button id='muAddBtn' type='button' className='btn btn-primary' onClick={this.addMu.bind(this)}>Add</button>
                  </span>
                  <input type='text' className='form-control' placeholder='new muID' defaultValue='' onChange={(e) => this.validateMuID(e.target.value)} id='newMuID'/>
                </div>
              </div>
              <div className='panel-body'>
                <textarea className='form-control' rows='5' defaultValue='' placeholder='add a new monitoring unit' id='newMuDesc'/>
              </div>
            </div>
            {muListView}
          </div>
        </div>
      </div>
    )
  }
}
