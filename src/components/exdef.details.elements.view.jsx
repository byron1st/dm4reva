'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {ipcRenderer} from 'electron'
import ExdefDetailsElementsERs from './exdef.details.elements.ers.view.js'
import ExdefDetailsElementsElems from './exdef.details.elements.elems.view.js'

function copyObject(obj) {
  let copiedObj
  Object.keys(obj).forEach((key) => copiedObj[key] = obj[key])
}

export default class ExdefDetailsElements extends Component {
  constructor () {
    super()
    this.state = {
      ersList: [],
      checkedERsList: []
    }
    this.updateERs = this.updateERs.bind(this)
    this.getMUsList = this.getMUsList.bind(this)
    this.checkAnER = this.checkAnER.bind(this)
    this.removeCheckedER = this.removeCheckedER.bind(this)
    this.makeAnElem = this.makeAnElem.bind(this)
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
  checkAnER (_id) {
    let alreadySelected = this.state.checkedERsList.map((e) => e._id).indexOf(_id) !== -1
    if (!alreadySelected) {
      let index = this.state.ersList.map((e) => e._id).indexOf(_id)
      let copiedObj = {}
      let original = this.state.ersList[index]
      Object.keys(original).forEach((key) => copiedObj[key] = original[key])
      this.setState({checkedERsList: this.state.checkedERsList.concat(copiedObj)})
    }
  }
  removeCheckedER (_id) {
    let index = this.state.checkedERsList.map((e) => e._id).indexOf(_id)
    if (index !== -1) {
      let updatedCheckedERsList = this.state.checkedERsList.slice()
      updatedCheckedERsList.splice(index, 1)
      this.setState({checkedERsList: updatedCheckedERsList})
    }
  }
  makeAnElem (newElem) {
    this.setState({checkedERsList: []})
    ipcRenderer.send('save-elem', newElem)
  }
  render () {
    return (
      <div>
        <div className='row' id='ers-view'>
          <ExdefDetailsElementsERs ers={this.state.ersList} select={this.selectER} selectedER_id={this.state.selectedER_id} checkAnER={this.checkAnER}/>
        </div>
        <hr />
        <div className='row'>
          <ExdefDetailsElementsElems type={this.props.exdef.type} kind={this.props.exdef.kind} checkedERsList={this.state.checkedERsList} removeCheckedER={this.removeCheckedER} make={this.makeAnElem}/>
        </div>
      </div>
    )
  }
}
ExdefDetailsElements.propTypes = {
  exdef: PropTypes.object
}
