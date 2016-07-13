'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

import DefView from './exdef.details.def.view'
import DefEdit from './exdef.details.def.edit'

import {type as uiActionType} from './actions.ui'
import constants from './const'

export default class Def extends Component {
  toggleEdit () {
    this.props.dispatcher.dispatch({type: uiActionType.toggleEdit, value: constants.editPage.def})
  }
  render () {
    let defContent
    if (this.props.store.editMode.def) defContent = <DefEdit dispatcher={this.props.dispatcher} store={this.props.store} />
    else defContent = <DefView exdef={this.props.store.selected.exdef} />
    return (
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-12'>
            <h3>{this.props.store.selected.exdef.type}
              {(!this.props.store.editMode.def) ? <a href='#'><span className='glyphicon glyphicon-wrench pull-right' onClick={this.toggleEdit.bind(this)}></span></a> : null }
            </h3>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            {defContent}
          </div>
        </div>
      </div>
    )
  }
}
Def.propTypes = {
  exdef: PropTypes.object.isRequired
}
