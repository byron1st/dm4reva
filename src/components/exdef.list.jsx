'use strict'

import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import {type as uiActionType} from './actions.ui'
import {type as listActionType} from './actions.list'
import constants from './const'

export default class List extends Component {
  toggleEdit () {
    this.props.dispatcher.dispatch({type: uiActionType.toggleEdit, value: constants.editPage.list})
  }
  render () {
    let exdefListView = []
    this.props.store.exdefList.forEach((exdef) =>
      exdefListView.push(
        <ListItem
          key={exdef._id}
          exdef={exdef}
          store={this.props.store}
          dispatcher={this.props.dispatcher} />
        ))
    return (
      <div>
        <h5 className='text-center'>Execution view element types <button className='btn btn-xs pull-right' onClick={this.toggleEdit.bind(this)}>edit</button></h5>
        <button className='btn btn-primary btn-xs btn-block' data-toggle='modal' data-target='#addModal'>+ add a new type</button>
        <div className='list-group'>
          {exdefListView}
        </div>
      </div>
    )
  }
}

class ListItem extends Component {
  select (_id) {
    this.props.dispatcher.dispatch({type: uiActionType.selectExdef, value: _id})
  }
  remove (_id) {
    this.props.dispatcher.dispatch({type: listActionType.removeExdef, value: _id})
  }
  render () {
    const isSelected= this.props.exdef._id === this.props.store.selected.exdef._id
    const aClassName = isSelected ? 'list-group-item active' : 'list-group-item'
    const btnStyle = this.props.store.editMode.list ? {display:'block'} : {display:'none'}
    return (
      <a href='#' className={aClassName} onClick={() => this.select(this.props.exdef._id)}>
        {this.props.exdef.type}: {this.props.exdef.kind}
        <button style={btnStyle} className='btn btn-xs pull-right' onClick={() => this.remove(this.props.exdef._id)}>
          [<span className='glyphicon glyphicon-remove'></span>]
        </button>
      </a>
    )
  }
}
