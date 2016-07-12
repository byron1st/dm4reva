'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {ipcRenderer} from 'electron'

import DefView from './exdef.details.def.view'
import DefEdit from './exdef.details.def.edit'

import {uiActionType} from './action.type'
import constants from './const'

export default class Def extends Component {
  constructor () {
    super()
    this.toggleEdit = this.toggleEdit.bind(this)
    this.buildDefContent = this.buildDefContent.bind(this)
  }
  toggleEdit () {
    this.props.dispatcher.dispatch({type: uiActionType.toggleEdit, value: constants.editPage.def})
  }
  buildDefContent () {
    if (this.props.store.editMode.def) return <DefEdit exdef={this.props.exdef} updateExdef={this.props.updateExdef} toggleEdit={this.toggleEdit} />
    else return <DefView exdef={this.props.exdef} />
  }
  render () {
    return (
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-12'>
            <h3>{this.props.exdef.type}
              {(!this.props.store.editMode.def) ? <a href='#'><span className='glyphicon glyphicon-wrench pull-right' onClick={this.toggleEdit}></span></a> : null }
            </h3>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            {this.buildDefContent()}
          </div>
        </div>
      </div>
    )
  }
}
Def.propTypes = {
  exdef: PropTypes.object.isRequired,
  updateExdef: PropTypes.func.isRequired
}
