'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {ipcRenderer} from 'electron'

import DefView from './exdef.details.def.view'
import DefEdit from './exdef.details.def.edit'

import {type as uiActionType} from './actions.ui'
import constants from './const'

export default class Def extends Component {
  constructor () {
    super()
    this.buildDefContent = this.buildDefContent.bind(this)
  }
  toggleEdit () {
    this.props.dispatcher.dispatch({type: uiActionType.toggleEdit, value: constants.editPage.def})
  }
  buildDefContent () {
    if (this.props.store.editMode.def) return <DefEdit dispatcher={this.props.dispatcher} store={this.props.store} />
    else return <DefView exdef={this.props.store.selectedExdef} />
  }
  render () {
    return (
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-12'>
            <h3>{this.props.store.selectedExdef.type}
              {(!this.props.store.editMode.def) ? <a href='#'><span className='glyphicon glyphicon-wrench pull-right' onClick={this.toggleEdit.bind(this)}></span></a> : null }
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
  exdef: PropTypes.object.isRequired
}
