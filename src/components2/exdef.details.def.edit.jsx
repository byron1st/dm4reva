'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {ipcRenderer} from 'electron'

import {type as uiActionType} from './actions.ui'
import {type as exdefActionType} from './actions.exdef'
import constants from './const'

export default class DefEdit extends Component {
  toggleEdit () {
    this.props.dispatcher.dispatch({type: uiActionType.toggleEdit, value: constants.editPage.def})
  }
  save () {
    this.props.dispatcher.dispatch({type: exdefActionType.updateExdef, value: constants.editPage.def})
  }
  render () {
    return (
      <div className='row'>
        <div className='col-md-12'>
          <form className='form-horizontal'>
            <div className='form-group'>
              <div className='col-md-6'>
                <button type='button' className='btn btn-primary btn-block' onClick={this.save.bind(this)}>Save</button>
              </div>
              <div className='col-md-6'>
                <button type='button' className='btn btn-danger btn-block' onClick={this.toggleEdit.bind(this)}>Cancel</button>
              </div>
            </div>
            <DefEditTypeAndKind name='Type' value={this.props.store.updated.exdef.type} dispatcher={this.props.dispatcher} />
            <DefEditTypeAndKind name='Kind' value={this.props.store.updated.exdef.kind} dispatcher={this.props.dispatcher} />
            <DefEditInf inf={this.props.store.updated.exdef.inf} dispatcher={this.props.dispatcher} />
          </form>
        </div>
      </div>
    )
  }
}

class DefEditTypeAndKind extends Component {
  handleChange(event) {
    let changedValue = {key: this.props.name.toLowerCase(), value: event.target.value}
    this.props.dispatcher.dispatch({type: exdefActionType.updateValue, value: changedValue})
  }
  render () {
    return (
      <div className='form-group'>
        <label for={this.props.name} className='col-md-2 control-label'>{this.props.name}</label>
        <div className='col-md-10'>
          <input type='text' className='form-control' id={this.props.name} value={this.props.value} onChange={this.handleChange.bind(this)} />
        </div>
      </div>
    )
  }
}

class DefEditInf extends Component {
  removeInf (idx) {
    let updatedInfList = this.props.inf.slice()
    updatedInfList.splice(idx, 1)
    let changedValue = {key: 'inf', value: updatedInfList}
    this.props.dispatcher.dispatch({type: exdefActionType.updateValue, value: changedValue})
  }
  addInf () {
    if ($('#newInf').val()) {
      let changedValue = {key: 'inf', value: this.props.inf.concat($('#newInf').val())}
      this.props.dispatcher.dispatch({type: exdefActionType.updateValue, value: changedValue})
      $('#newInf').val('')
    }
  }
  render () {
    let infListView = []
    this.props.inf.forEach((inf, idx) => infListView.push(
      <div className='checkbox'>
        <label>
          <input type='checkbox' disabled />{inf}
          <span className='glyphicon glyphicon-remove' onClick={() => this.removeInf(idx)}></span>
        </label>
      </div>))

    return (
      <div className='form-group'>
        <label className='col-md-2 control-label'>Interfaces</label>
        <div className='col-md-10'>
          <div className='input-group input-group-sm'>
            <span className='input-group-btn'>
              <button type='button' className='btn btn-primary' onClick={this.addInf.bind(this)}>Add</button>
            </span>
            <input type='text' className='form-control' placeholder='add a new interface' defaultValue='' id='newInf'/>
          </div>
          {infListView}
        </div>
      </div>
    )
  }
}
