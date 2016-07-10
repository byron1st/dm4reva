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
      exdefList: [],
      muList: []
    }
    this.selectAnExdef = this.selectAnExdef.bind(this)
    this.removeAnExdef = this.removeAnExdef.bind(this)
    this.saveAnExdefDetails = this.saveAnExdefDetails.bind(this)
    this.addExdefsToList = this.addExdefsToList.bind(this)
    this.addNewExdef = this.addNewExdef.bind(this)
    this.validateMUIDfromOthers = this.validateMUIDfromOthers.bind(this)
  }
  componentWillMount () {
    this.setState({exdefList: this.props.exdefList})
    this.setState({muList: this.props.muList})
    ipcRenderer.on('notify-udpate', (event, arg) => this.addExdefsToList(arg))
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
  saveAnExdefDetails (updatedExdef, updatedMuListforExdef, removedMuListforExdef) {
    let updatedExdefList = this.state.exdefList.slice()
    let idx = this.state.exdefList.map((e) => e._id).indexOf(updatedExdef._id)
    updatedExdefList.splice(idx, 1, updatedExdef)
    updatedExdefList.sort(sortKindAndType)

    let updatedMuList = this.state.muList.slice()
    let muIDList = updatedMuList.map((e) => e.muID)
    updatedMuListforExdef.forEach((mu) => {
      let idx = muIDList.indexOf(mu.muID)
      if (idx === -1) updatedMuList.push(mu)
      else updatedMuList.splice(idx, 1, mu)
    })

    let removedMuIDList = removedMuListforExdef.map((e) => e.muID)
    removedMuIDList.forEach((removedMu) => {
      let removedIdx = updatedMuList.map((e) => e.muID).indexOf(removedMu)
      if (removedIdx !== -1) updatedMuList.splice(removedIdx, 1)
    })

    updatedMuList.sort((a, b) => {
      if (a.muID > b.muID) return 1
      if (b.muID < a.muID) return -1
      return 0
    })

    let success = ipcRenderer.sendSync('update-anExdef', [updatedExdef, JSON.stringify(updatedMuList), JSON.stringify(removedMuIDList)])
    if (success) this.setState({exdefList: updatedExdefList, muList: updatedMuList})
  }
  addExdefsToList (addedExdefList) {
    let updatedExdefList = this.state.exdefList.concat(addedExdefList)
    updatedExdefList.sort(sortKindAndType)
    this.setState({exdefList: updatedExdefList})
  }
  addNewExdef (newExdefData) {
    let newExdef = ipcRenderer.sendSync('add-new-exdef', newExdefData)
    if (newExdef) this.addExdefsToList(newExdef)
  }
  validateMUIDfromOthers (muID) {
    let index = this.state.muList.map((e) => e.muID).indexOf(muID)
    return index === -1 ? true : false
  }
  render () {
    let selectedExdefDetails = this.state.exdefList.find((exdef) => exdef._id === this.state.selectedExdef)
    let exdefDetailsView
    if (selectedExdefDetails) {
      let selectedExdefMuList = this.state.muList.filter((mu) => mu.exdefType === selectedExdefDetails.type)
      exdefDetailsView = <ExdefDetails save={this.saveAnExdefDetails} exdef={selectedExdefDetails} muList={selectedExdefMuList} validateMUIDfromOthers={this.validateMUIDfromOthers}/>
    }
    return (
      <div id='main'>
        <ExdefList exdefList={this.state.exdefList} selectedExdef={this.state.selectedExdef} select={this.selectAnExdef} remove={this.removeAnExdef} add={this.addNewExdef} />
        {exdefDetailsView}
      </div>
    )
  }
}

let currentWindow = remote.getCurrentWindow()
ReactDOM.render(<ExdefMain exdefList={currentWindow.exdefList} muList={currentWindow.muList}/>, document.getElementById('exdefMain'))
ipcRenderer.on('show-loading', (event) => window.$('#progressBar').show())
ipcRenderer.on('hide-loading', (event) => window.$('#progressBar').hide())
