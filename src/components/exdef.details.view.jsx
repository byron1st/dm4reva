'use strict'

import React, {Component} from 'react'
import ReactDOM from 'react-dom'

class ExdefDetailsHeader extends Component {
  render () {
    let editButton
    if (!this.props.editMode) {
      editButton = <button className='btn btn-default pull-right' onClick={() => this.props.changeToEditMode()}>Edit</button>
    } else {
      editButton = <button className='btn btn-default pull-right' onClick={() => this.props.save()}>Save</button>
    }
    return (
      <div id='header' className='row'>
        <div id='typeName' className='col-md-9'>
          {this.props.type}
        </div>
        <div id='edit' className='col-md-3'>
          {editButton}
        </div>
      </div>
    )
  }
}

export default class ExdefDetails extends Component {
  constructor () {
    super()
    this.state = {
      editMode: false,
      exdef: {}
    }
    this.changeToEditMode = this.changeToEditMode.bind(this)
    this.save = this.save.bind(this)
  }
  changeToEditMode () {
    this.setState({editMode: true})
  }
  save () {
    this.setState({editMode: false})
    this.props.save(this.state.exdef)
  }
  render () {
    return (
      <div id='exdefDetails' className='col-md-8'>
        <div id='nav' className='row'></div>
        <ExdefDetailsHeader type={this.props.exdef.type} changeToEditMode={this.changeToEditMode} editMode={this.state.editMode} save={this.save}/>
        <div id='kind' className='row'></div>
        <div id='inf' className='row'></div>
        <div id='id_rules' className='row'></div>
        <div id='elements' className='row'></div>
      </div>
    )
  }
}
