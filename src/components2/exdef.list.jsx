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
        <button className='btn btn-xs pull-right' onClick={this.toggleEdit.bind(this)}>edit</button>
        <button className='btn btn-primary btn-xs btn-block' data-toggle='modal' data-target='#addModal'>+ add type</button>
        <div className='list-group'>
          {exdefListView}
        </div>
        <AddModal dispatcher={this.props.dispatcher} />
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

class AddModal extends Component {
  eraseValues () {
    $('#addNewType').val('')
    $('#addNewKind').val('')
  }
  handleAdd () {
    let newExdefObject = {
      type: $('#addNewType').val(),
      kind: $('#addNewKind').val(),
      inf: [],
      id_rules: '',
      id_rules_html: ''
    }

    this.props.dispatcher.dispatch({type: listActionType.addExdef, value: newExdefObject})
    this.eraseValues()
  }
  render () {
    return (
      <div className='modal fade' data-backdrop='static' id='addModal' role='dialog' aria-labelledby='addModalLabel'>
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h4 className='modal-title' id='addModalLabel'>Add a new type</h4>
            </div>
            <div className='modal-body'>
              <div class='form-group'>
                <label for='addNewType'>Type</label>
                <input type='text' className='form-control' id='addNewType' defaultValue='' placeholder='new type...' />
              </div>
              <div class='form-group'>
                <label for='addNewKind'>Kind</label>
                <input type='text' className='form-control' id='addNewKind' defaultValue='' placeholder='new kind...' />
              </div>
            </div>
            <div className='modal-footer'>
              <button className='btn btn-danger' data-dismiss='modal' aria-label='Close' onClick={this.eraseValues.bind(this)}>Cancel</button>
              <button className='btn btn-primary' data-dismiss='modal' aria-label='Close' onClick={this.handleAdd.bind(this)}>Add</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
