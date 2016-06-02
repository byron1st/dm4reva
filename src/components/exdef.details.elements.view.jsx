'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {ipcRenderer} from 'electron'
import ExdefDetailsElementsERs from './exdef.details.elements.ers.view.js'
import ExdefDetailsElementsElems from './exdef.details.elements.elems.view.js'

export default class ExdefDetailsElements extends Component {
  constructor () {
    super()
    this.state = {
      ersList: []
    }
    this.updateERs = this.updateERs.bind(this)
    this.getMUsList = this.getMUsList.bind(this)
  }
  componentWillMount () {
    let initERsList = ipcRenderer.sendSync('read-ers', this.getMUsList(this.props.exdef.mu))
    if (initERsList) this.setState({ersList: initERsList})
    ipcRenderer.on('save-ers-reply', (event, arg) => {
      this.updateERs()
    })
  }
  getMUsList (muList) {
    let muIDsList = []
    muList.forEach((mu) => muIDsList.push(mu.muID))
    return muIDsList
  }
  updateERs () {
    let updatedERsList = ipcRenderer.sendSync('read-ers', this.getMUsList(this.props.exdef.mu))
    if (updatedERsList) this.setState({ersList: updatedERsList})
  }
  render () {
    return (
      <div>
        <div className='row' id='ers-view'>
          <ExdefDetailsElementsERs ers={this.state.ersList} select={this.selectER} selectedER_id={this.state.selectedER_id}/>
        </div>
        <hr />
        <div className='row'>
          <ExdefDetailsElementsElems type={this.props.exdef.type} kind={this.props.exdef.kind} />
        </div>
      </div>
    )
  }
}
ExdefDetailsElements.propTypes = {
  exdef: PropTypes.object
}
