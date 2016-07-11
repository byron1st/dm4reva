'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {ipcRenderer} from 'electron'

import DefView from './exdef.details.def.view'
import DefEdit from './exdef.details.def.edit'

export default class Def extends Component {
  constructor () {
    super()
    this.state = {
      drList: [],
      editMode: false
    }
    this.getDrList = this.getDrList.bind(this)
    this.toggleEdit = this.toggleEdit.bind(this)
    this.buildDefContent = this.buildDefContent.bind(this)
  }
  componentWillMount() {
    this.getDrList(this.props.exdef.inf)
  }
  componentWillReceiveProps (nextProps) {
    this.getDrList(nextProps.exdef.inf)
    this.setState({editMode: false})
  }
  getDrList (infList) {
    let updatedDrList = ipcRenderer.sendSync('read-drs', infList)
    this.setState({drList: updatedDrList})
  }
  toggleEdit () {
    this.setState({editMode: !this.state.editMode})
  }
  buildDefContent () {
    if (this.state.editMode) return <DefEdit exdef={this.props.exdef} updateExdef={this.props.updateExdef} toggleEdit={this.toggleEdit} />
    else return <DefView exdef={this.props.exdef} />
  }
  render () {
    let defContent = this.buildDefContent()
    return (
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-12'>
            <h3>{this.props.exdef.type}
              {(!this.state.editMode) ? <a href='#'><span className='glyphicon glyphicon-wrench pull-right' onClick={this.toggleEdit}></span></a> : null }
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
  exdef: PropTypes.object.isRequired,
  updateExdef: PropTypes.func.isRequired
}
