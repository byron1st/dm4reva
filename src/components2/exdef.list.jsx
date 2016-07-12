'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

import {uiActionType} from './action.type'
import constants from './const'

export default class List extends Component {
  toggleEdit () {
    this.props.dispatcher.dispatch({type: uiActionType.toggleEdit, value: constants.editPage.list})
  }
  render () {
    let exdefListView = []
    this.props.exdefList.forEach((exdef) =>
      exdefListView.push(
        <ListItem
          key={exdef._id}
          exdef={exdef}
          isSelected={exdef._id === this.props.store.selectedExdef}
          removeExdef={this.props.removeExdef}
          editMode={this.props.store.editMode.list}
          dispatcher={this.props.dispatcher} />
        ))
    return (
      <div id='exdefList' className='col-md-4'>
        <div className='row'>
          <div className='col-md-12'>
            <button className='btn btn-xs pull-right' onClick={this.toggleEdit.bind(this)}>edit</button>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <button className='btn btn-primary btn-xs btn-block' data-toggle='modal' data-target='#addModal'>+ add type</button>
          </div>
        </div>
        <div className='row'>
          <div id='exdefList' className='col-md-12'>
            <div className='list-group'>
              {exdefListView}
            </div>
          </div>
        </div>
        <AddModal addExdef={this.props.addExdef} />
      </div>
    )
  }
}
List.propTypes = {
  exdefList: PropTypes.array.isRequired,
  selectedExdef: PropTypes.string.isRequired,
  removeExdef: PropTypes.func.isRequired,
  addExdef: PropTypes.func.isRequired
}

class ListItem extends Component {
  select (_id) {
    this.props.dispatcher.dispatch({type: uiActionType.selectExdef, value: _id})
  }
  render () {
    return (
      <a href='#' className={this.props.isSelected ? 'list-group-item active' : 'list-group-item'} onClick={() => this.select(this.props.exdef._id)}>
        {this.props.exdef.type}: {this.props.exdef.kind}
        <button style={this.props.editMode ? {display:'block'} : {display:'none'}} className='btn btn-xs pull-right' onClick={() => this.props.removeExdef(this.props.exdef._id)}>
          [<span className='glyphicon glyphicon-remove'></span>]
        </button>
      </a>
    )
  }
}
ListItem.propTypes = {
  exdef: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  removeExdef: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
  store: PropTypes.object.isRequired
}

class AddModal extends Component {
  constructor () {
    super()
    this.eraseValues = this.eraseValues.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
  }
  eraseValues () {
    $('#addNewType').val('')
    $('#addNewKind').val('')
  }
  handleAdd () {
    this.props.addExdef($('#addNewType').val(), $('#addNewKind').val())
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
              <button className='btn btn-danger' data-dismiss='modal' aria-label='Close' onClick={this.eraseValues}>Cancel</button>
              <button className='btn btn-primary' data-dismiss='modal' aria-label='Close' onClick={this.handleAdd}>Add</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
AddModal.propTypes = {
  addExdef: PropTypes.func
}
