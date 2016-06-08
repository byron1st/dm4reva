'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

export default class ExdefList extends Component {
  constructor () {
    super()
    this.state = {
      editMode: false
    }
    this.addType = this.addType.bind(this)
    this.toggleEdit = this.toggleEdit.bind(this)
  }
  addType (newType, newKind) {
    let newExdefData = {
      type: newType,
      kind: newKind,
      inf: [],
      mu: [],
      id_rules: ''
    }
    this.props.add(newExdefData)
  }
  toggleEdit () {
    this.setState({editMode: !this.state.editMode})
  }
  render () {
    let exdefListView = []
    this.props.exdefList.forEach((exdef) => {
      let isSelected = exdef._id === this.props.selectedExdef
      exdefListView.push(<ExdefListItem key={exdef._id} exdef={exdef} isSelected={isSelected} select={this.props.select} remove={this.props.remove} mode={this.state.editMode} />)
    })
    return (
      <div id='exdefList' className='col-md-4'>
        <div className='row'>
          <div className='col-md-12'>
            <button className='btn btn-xs pull-right' onClick={this.toggleEdit}>edit</button>
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
        <ExdefListAddModal add={this.addType} />
      </div>
    )
  }
}
ExdefList.propTypes = {
  exdefList: PropTypes.array,
  selectedExdef: PropTypes.string,
  select: PropTypes.func,
  remove: PropTypes.func,
  add: PropTypes.func
}

class ExdefListItem extends Component {
  constructor () {
    super()
    this.handleSelect = this.handleSelect.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
  }
  handleSelect () {
    this.props.select(this.props.exdef._id)
  }
  handleRemove () {
    this.props.remove(this.props.exdef._id)
  }
  render () {
    return (
      <a href='#' className={this.props.isSelected ? 'list-group-item active' : 'list-group-item'} onClick={this.handleSelect}>
        {this.props.exdef.type}: {this.props.exdef.kind}
        <button style={this.props.mode ? {display:'block'} : {display:'none'}} className='btn btn-xs pull-right' onClick={this.handleRemove}>
          [<span className='glyphicon glyphicon-remove'></span>]
        </button>
      </a>
    )
  }
}
ExdefListItem.propTypes = {
  exdef: PropTypes.object,
  isSelected: PropTypes.bool,
  select: PropTypes.func,
  remove: PropTypes.func,
  mode: PropTypes.bool
}

class ExdefListAddModal extends Component {
  constructor () {
    super()
    this.eraseValues = this.eraseValues.bind(this)
    this.add = this.add.bind(this)
  }
  eraseValues () {
    window.$('#addNewType').val('')
    window.$('#addNewKind').val('')
  }
  add () {
    this.props.add(window.$('#addNewType').val(), window.$('#addNewKind').val())
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
              <button className='btn btn-primary' data-dismiss='modal' aria-label='Close' onClick={this.add}>Add</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
ExdefListAddModal.propTypes = {
  add: PropTypes.func
}
