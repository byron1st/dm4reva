'use strict'

import React, {Component} from 'react'
import ReactDOM from 'react-dom'

export default class ExdefDetails extends Component {
  constructor () {
    super()
    this.state = {
      editMode: false,
      exdef: {
        type: '',
        kind: ''
      }
    }
    this.changeToEditMode = this.changeToEditMode.bind(this)
    this.save = this.save.bind(this)
    this.changeKind = this.changeKind.bind(this)
  }
  changeToEditMode () {
    this.setState({editMode: true})
  }
  save () {
    this.setState({editMode: false})
    this.props.save(this.state.exdef)
  }
  changeKind (newKind) {
    this.setState({'exdef.kind':newKind})
  }
  render () {
    return (
      <div id='exdefDetails' className='col-md-8'>
        <div id='nav' className='row'></div>
        <ExdefDetailsHeader type={this.props.exdef.type} changeToEditMode={this.changeToEditMode} editMode={this.state.editMode} save={this.save}/>
        <ExdefDetailsKind kind={this.props.exdef.kind} editMode={this.state.editMode} changeKind={this.changeKind} />
        <div id='inf' className='row'></div>
        <div id='id_rules' className='row'></div>
        <div id='elements' className='row'></div>
      </div>
    )
  }
}

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

class ExdefDetailsKind extends Component {
  handleChange (event) {
    this.props.changeKind(event.target.value)
  }
  render () {
    let kindView
    if (!this.props.editMode) {
      kindView = <input type='text' className='form-control' defaultValue={this.props.kind} disabled />
    } else {
      kindView = <input type='text' className='form-control' value={this.props.kind} onChange={this.handleChange.bind(this)} />
    }
    return (
      <div id='kind' className='row'>
        <div class="input-group">
          <span class='input-group-addon'>Kind</span>
          {kindView}
        </div>
      </div>
    )
  }
}
