'use strict'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {remote, ipcRenderer} from 'electron'
import ExdefList from './exdef.list.view.js'
import ExdefDetails from './exdef.details.view.js'

function sortKindAndType (a, b) {
  if (a.kind > b.kind) return 1
  if (a.kind < b.kind) return -1
  if (a.kind === b.kind) {
    if (a.type > b.type) return 1
    if (a.type < b.type) return -1
    return 0
  }
}

class ExdefMain extends Component {
  constructor () {
    super()
    this.state = {
      selectedExdef:'',
      exdefList: []
    }
    this.selectAnExdef = this.selectAnExdef.bind(this)
    this.removeAnExdef = this.removeAnExdef.bind(this)
    this.saveAnExdefDetails = this.saveAnExdefDetails.bind(this)
    this.addExdefsToList = this.addExdefsToList.bind(this)
    this.addNewExdef = this.addNewExdef.bind(this)
  }
  componentWillMount () {
    this.setState({exdefList: this.props.exdefList})
    ipcRenderer.on('save-exdefs-reply', (event, arg) => this.addExdefsToList(arg))
  }
  selectAnExdef (_id) {
    this.setState({selectedExdef:_id})
  }
  removeAnExdef (_id) {
    let updatedExdefList = this.state.exdefList.slice()
    let idx = this.state.exdefList.map((e) => e._id).indexOf(_id)
    updatedExdefList.splice(idx, 1)
    let success = ipcRenderer.sendSync('remove-anExdef', _id)
    if (success) this.setState({exdefList: updatedExdefList})
  }
  saveAnExdefDetails (updatedExdef) {
    let updatedExdefList = this.state.exdefList.slice()
    let idx = this.state.exdefList.map((e) => e._id).indexOf(updatedExdef._id)
    updatedExdefList.splice(idx, 1, updatedExdef)
    updatedExdefList.sort(sortKindAndType)
    let success = ipcRenderer.sendSync('update-anExdef', updatedExdef)
    if (success) this.setState({exdefList: updatedExdefList})
  }
  addExdefsToList (addedExdefList) {
    let updatedExdefList = this.state.exdefList.concat(addedExdefList)
    updatedExdefList.sort(sortKindAndType)
    window.$('#progressBar').hide()
    this.setState({exdefList: updatedExdefList})
  }
  addNewExdef (newExdefData) {
    let newExdef = ipcRenderer.sendSync('add-new-exdef', newExdefData)
    if (newExdef) this.addExdefsToList(newExdef)
  }
  render () {
    let selectedExdefDetails = this.state.exdefList.find((exdef) => exdef._id === this.state.selectedExdef)
    let exdefDetailsView
    if (selectedExdefDetails) {
      exdefDetailsView = <ExdefDetails save={this.saveAnExdefDetails} exdef={selectedExdefDetails} />
    }
    return (
      <div id='main'>
        <ExdefList exdefList={this.state.exdefList} selectedExdef={this.state.selectedExdef} select={this.selectAnExdef} remove={this.removeAnExdef} add={this.addNewExdef} />
        {exdefDetailsView}
      </div>
    )
  }
}

ReactDOM.render(<ExdefMain exdefList={remote.getCurrentWindow().exdefList}/>, document.getElementById('exdefMain'))
