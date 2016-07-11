'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {ipcRenderer} from 'electron'

const kinds = ['EComponent', 'EConnector', 'EPort']

export default class DefEdit extends Component {
  constructor () {
    super()
    this.state = {
      type: '',
      kind: '',
      inf: []
    }
    this.initializeState = this.initializeState.bind(this)
    this.updateValues = this.updateValues.bind(this)
    this.updateExdef = this.updateExdef.bind(this)
  }
  componentWillMount () {
    this.initializeState(this.props)
  }
  componentWillReceiveProps(nextProps) {
    this.initializeState(nextProps)
  }
  initializeState (props) {
    this.setState({
      type: props.exdef.type,
      kind: props.exdef.kind,
      inf: props.exdef.inf
    })
  }
  updateValues (key, value) {
    let updatedState = {}
    updatedState[key.toLowerCase()] = value
    this.setState(updatedState)
  }
  updateExdef () {
    let validationKind = kinds.indexOf(this.state.kind) !== -1
    if (validationKind) this.props.updateExdef(this.props.exdef._id, this.state.type, this.state.kind, this.state.inf)
    else ipcRenderer.send('handle-errors', 'The value of the Kind should be one of EComponent, EConnector, and EPort.')
  }
  render () {
    return (
      <div className='row'>
        <div className='col-md-12'>
          <form className='form-horizontal'>
            <div className='form-group'>
              <div className='col-md-6'>
                <button type='button' className='btn btn-primary btn-block' onClick={this.updateExdef}>Save</button>
              </div>
              <div className='col-md-6'>
                <button type='button' className='btn btn-danger btn-block' onClick={() => this.props.toggleEdit()}>Cancel</button>
              </div>
            </div>
            <DefEditTypeAndKind name='Type' value={this.state.type} updateValues={this.updateValues} />
            <DefEditTypeAndKind name='Kind' value={this.state.kind} updateValues={this.updateValues} />
            <DefEditInf inf={this.state.inf} updateValues={this.updateValues} />
          </form>
        </div>
      </div>
    )
  }
}
DefEdit.propTypes = {
  exdef: PropTypes.object.isRequired,
  updateExdef: PropTypes.func.isRequired,
  toggleEdit: PropTypes.func.isRequired
}

class DefEditTypeAndKind extends Component {
  render () {
    return (
      <div className='form-group'>
        <label for={this.props.name} className='col-md-2 control-label'>{this.props.name}</label>
        <div className='col-md-10'>
          <input type='text' className='form-control' id={this.props.name} value={this.props.value} onChange={(event) => this.props.updateValues(this.props.name, event.target.value)} />
        </div>
      </div>
    )
  }
}
DefEditTypeAndKind.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  updateValues: PropTypes.func.isRequired
}

class DefEditInf extends Component {
  constructor () {
    super()
    this.removeInf = this.removeInf.bind(this)
  }
  removeInf (idx) {
    let updatedInfList = this.props.inf.slice()
    updatedInfList.splice(idx, 1)
    this.props.updateValues('inf', updatedInfList)
  }
  addInf (newInf) {
    if (newInf) {
      let updatedInfList = this.props.inf.concat(newInf)
      this.props.updateValues('inf', updatedInfList)
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
              <button type='button' className='btn btn-primary' onClick={() => this.addInf($('#newInf').val())}>Add</button>
            </span>
            <input type='text' className='form-control' placeholder='add a new interface' defaultValue='' id='newInf'/>
          </div>
          {infListView}
        </div>
      </div>
    )
  }
}
DefEditInf.propTypes = {
  inf: PropTypes.array.isRequired,
  updateValues: PropTypes.func.isRequired
}
