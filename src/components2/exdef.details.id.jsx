'use strict'

import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import IdView from './exdef.details.id.view'
import IdEdit from './exdef.details.id.edit'

import {type as uiActionType} from './actions.ui'
import constants from './const'

const scrollCSS = {
  'overflowY': 'scroll',
  'height': '270px'
}

export default class Id extends Component {
  toggleEdit () {
    this.props.dispatcher.dispatch({type: uiActionType.toggleEdit, value: constants.editPage.id})
  }
  render () {
    let idContent
    if (this.props.store.editMode.id) idContent = <IdEdit store={this.props.store} dispatcher={this.props.dispatcher} />
    else idContent = <IdView store={this.props.store} />
    return (
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-12'>
            <h3>{this.props.store.selected.exdef.type}
              {(!this.props.store.editMode.id) ? <a href='#'><span className='glyphicon glyphicon-wrench pull-right' onClick={this.toggleEdit.bind(this)}></span></a> : null }
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
