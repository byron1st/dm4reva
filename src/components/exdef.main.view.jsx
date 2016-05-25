'use strict'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {remote} from 'electron'
import ExdefList from './exdef.list.view.js'
import ExdefDetails from './exdef.details.view.js'

class ExdefMain extends Component {
  constructor () {
    super()
    this.state = {
      selectedExdef:'',
      exdefList: []
    }
    this.selectAnExdef = this.selectAnExdef.bind(this)
    this.saveAnExdefDetails = this.saveAnExdefDetails.bind(this)
  }
  componentWillMount () {
    this.setState({exdefList: this.props.exdefList})
  }
  selectAnExdef (_id) {
    this.setState({selectedExdef:_id})
  }
  saveAnExdefDetails (updatedExdef) {
    let updatedExdefList = this.state.exdefList
    let idx = this.state.exdefList.map((e) => e._id).indexOf(updatedExdef._id)
    updatedExdefList[idx] = updatedExdef
    //TODO: Send IPC call to save changes to DB
    this.setState({exdefList: updatedExdefList})
  }
  render () {
    let selectedExdefDetails = this.state.exdefList.find((exdef) => exdef._id === this.state.selectedExdef)
    let exdefDetailsView
    if (selectedExdefDetails) {
      exdefDetailsView = <ExdefDetails save={this.saveAnExdefDetails} exdef={selectedExdefDetails} />
    }
    return (
      <div id='main' className='row'>
        <ExdefList exdefList={this.state.exdefList} selectedExdef={this.state.selectedExdef} select={this.selectAnExdef} />
        {exdefDetailsView}
      </div>
    )
  }
}

ReactDOM.render(<ExdefMain exdefList={remote.getCurrentWindow().exdefList}/>, document.getElementById('exdefMain'))
