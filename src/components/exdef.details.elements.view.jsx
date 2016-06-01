'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {ipcRenderer} from 'electron'
import ExdefDetailsElementsERs from './exdef.details.elements.ers.view.js'

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
      console.log('save-ers-reply')
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
          <ExdefDetailsElementsERs ers={this.state.ersList}/>
        </div>
        <hr />
        <div className='row'>
          <h1>Identify an element</h1>
        </div>
      </div>
    )
  }
}
ExdefDetailsElements.propTypes = {
  exdef: PropTypes.object
}
