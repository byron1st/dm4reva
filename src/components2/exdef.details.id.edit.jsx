'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {ipcRenderer} from 'electron'

import * as util from './util'

const marginBottomCSS = {
  'margin-bottom': '10px'
}

export default class IdEdit extends Component {
  constructor () {
    super()
    this.state = {
      muList: [],
      id_rules: ''
    }
    this.initializeState = this.initializeState.bind(this)
    this.validateID = this.validateID.bind(this)
    this.addMu = this.addMu.bind(this)
    this.updateMuDesc = this.updateMuDesc.bind(this)
    this.updateIdRules = this.updateIdRules.bind(this)
    this.validateMuID = this.validateMuID.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }
  componentWillMount () {
    this.initializeState(this.props)
  }
  componentWillReceiveProps(nextProps) {
    this.initializeState(nextProps)
  }
  initializeState (props) {
    this.setState({
      muList: props.muList,
      id_rules: props.exdef.id_rules
    })
  }
  updateMuDesc (muID, updatedDesc) {
    let updatedMu = {
      muID: muID,
      desc: updatedDesc,
      exdefType: this.props.exdef.type
    }
    let updatedMuList = util.replaceAnItem(this.state.muList, 'muID', muID, updatedMu)
    this.setState({muList: updatedMuList})
  }
  updateIdRules (updatedIdRules) {
    this.setState({id_rules: updatedIdRules})
  }
  validateID (muID) {
    let success = this.validateMuID(muID)
    let currentClassName = document.getElementById('newMuID').className
    let index = currentClassName.indexOf(' errorInput')
    if (success) {
      if (index !== -1) {
        document.getElementById('newMuID').className = currentClassName.substring(0, index)
      }
      document.getElementById('muAddBtn').disabled = false
    } else {
      if (index === -1) {
        document.getElementById('newMuID').className = currentClassName + ' errorInput'
      }
      document.getElementById('muAddBtn').disabled = true
    }
  }
  validateMuID (muID) {
    let currentSuccess = util.contains(this.state.muList, 'muID', muID)
    if (currentSuccess) return false
    else return ipcRenderer.sendSync('validate-muID', muID)
  }
  addMu () {
    let newMu = {
      muID: $('#newMuID').val(),
      desc: $('#newMuDesc').val(),
      exdefType: this.props.exdef.type
    }
    let updatedMuList = util.addItemsToList(this.state.muList, newMu)
    this.setState({muList: updatedMuList})
    $('#newMuID').val('')
    $('#newMuDesc').val('')
  }
  removeMu (idx) {
    let updatedMuList = this.state.muList.slice()
    updatedMuList.splice(idx, 1)
    this.setState({muList: updatedMuList})
  }
  handleSave () {
    this.props.saveChanges(this.state.muList.slice(), this.state.id_rules)
  }
  render () {
    let muListView = []
    this.state.muList.forEach((mu, idx) => muListView.push(
      <div className='panel panel-default' style={marginBottomCSS}>
        <div className='panel-heading'>
          <h4 className='panel-title'>{mu.muID}
            <a href='#'><span className='glyphicon glyphicon-remove pull-right' onClick={() => this.removeMu(idx)}></span></a>
          </h4>
        </div>
        <div className='panel-body'>
          <textarea className='form-control' rows='5' value={mu.desc} onChange={(event) => this.updateMuDesc(mu.muID, event.target.value)} />
        </div>
      </div>
    ))
    return (
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-6'>
            <button type='button' className='btn btn-primary btn-block' onClick={this.handleSave}>Save</button>
          </div>
          <div className='col-md-6'>
            <button type='button' className='btn btn-danger btn-block' onClick={() => this.props.toggleEdit()}>Cancel</button>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <h3>Description</h3>
            <div className='well well-sm' id='idRulesHTML'>
              <textarea className='form-control' rows='5' value={this.state.id_rules} onChange={(event) => this.updateIdRules(event.target.value)} />
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
                    <button id='muAddBtn' type='button' className='btn btn-primary' onClick={this.addMu}>Add</button>
                  </span>
                  <input type='text' className='form-control' placeholder='new muID' defaultValue='' onChange={(event) => this.validateID(event.target.value)} id='newMuID'/>
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
IdEdit.propTypes = {
  exdef: PropTypes.object.isRequired,
  muList: PropTypes.array.isRequired,
  saveChanges: PropTypes.func.isRequired,
  toggleEdit: PropTypes.func.isRequired
}
