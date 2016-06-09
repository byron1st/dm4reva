'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {ipcRenderer} from 'electron'

function validateInput (isValid, inputID, buttonID) {
  let currentClassName = document.getElementById(inputID).className
  if (isValid) {
    let index = currentClassName.indexOf(' errorInput')
    if (index !== -1) {
      document.getElementById(inputID).className = currentClassName.substring(0, index)
    }
  } else {
    document.getElementById(inputID).className = currentClassName + ' errorInput'
  }
}

export default class ExdefDetailsElementsElems extends Component {
  constructor () {
    super()
    this.state = {
      elemID: '',
      source: '',
      sink: '',
      parents: '',
      makePossible: {
        elemID: false
      }
    }
    this.updateElemsID = this.updateElemsID.bind(this)
    this.updateInfo = this.updateInfo.bind(this)
    this.makeAnElem = this.makeAnElem.bind(this)
    this.getNewPossibility = this.getNewPossibility.bind(this)
    this.calculateMakePossibility = this.calculateMakePossibility.bind(this)
  }
  getNewPossibility(isValid, inputType) {
    let newMakePossible = {}
    Object.keys(this.state.makePossible).forEach((key) => newMakePossible[key] = this.state.makePossible[key])
    newMakePossible[inputType] = isValid
    return newMakePossible
  }
  calculateMakePossibility() {
    let isValid = true
    Object.keys(this.state.makePossible).forEach((key) => isValid = isValid && this.state.makePossible[key])
    switch (this.props.kind) {
      case 'EConnector':
        isValid = isValid && (this.state.source !== '') && (this.state.sink !== '')
        break
      case 'EPort':
        isValid = isValid && (this.state.parents !== '')
        break
    }
    return isValid
  }
  updateElemsID (updatedID, isValid) {
    let newMakePossible = this.getNewPossibility(isValid, 'elemID')
    this.setState({elemID: updatedID, makePossible: newMakePossible})
  }
  updateInfo (info, newValue, isValid) {
    let newMakePossible = this.getNewPossibility(isValid, info)
    this.setState({makePossible: newMakePossible})
    switch (info) {
      case 'source':
        this.setState({source: newValue})
        break
      case 'sink':
        this.setState({sink: newValue})
        break
      case 'parents':
        this.setState({parents: newValue})
        break
    }
  }
  makeAnElem () {
    let newElem = {}
    Object.keys(this.state).forEach((key) => newElem[key] = this.state[key])
    newElem.type = this.props.type
    newElem.kind = this.props.kind
    newElem.ers = []
    this.props.checkedERsList.forEach((checkedER) => newElem.ers.push(checkedER._id))
    this.props.make(newElem)
    this.setState({
      elemID: '',
      source: '',
      sink: '',
      parents: '',
      makePossible: {
        elemID: false
      }
    })
  }
  render () {
    let isValid = this.calculateMakePossibility()
    return (
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-6'>
            <div className='well'>
              <ExdefDetailsElementsElemsInput
                type={this.props.type}
                kind={this.props.kind}
                elemID={this.state.elemID}
                source={this.state.source}
                sink={this.state.sink}
                parents={this.state.parents}
                updateID={this.updateElemsID}
                make={this.makeAnElem}
                updateInfo={this.updateInfo} />
              <button type='button' className='btn btn-primary btn-block' onClick={this.makeAnElem} id='make-btn' disabled={!isValid} >Make an element</button>
            </div>
          </div>
          <div className='col-md-6'>
            <ExdefDetailsElementsElemsRecords ersList={this.props.checkedERsList} remove={this.props.removeCheckedER}/>
          </div>
        </div>
      </div>
    )
  }
}
ExdefDetailsElementsElems.propTypes = {
  type: PropTypes.string,
  kind: PropTypes.string,
  checkedERsList: PropTypes.array,
  removeCheckedER: PropTypes.func,
  make: PropTypes.func
}

class ExdefDetailsElementsElemsInput extends Component {
  constructor () {
    super()
    this.handleIDChange = this.handleIDChange.bind(this)
  }
  handleIDChange (event) {
    let isValid = !ipcRenderer.sendSync('validate-elemID', {value:event.target.value, inputType:'elemID'})
    validateInput(isValid, 'elemID', 'make-btn')
    this.props.updateID(event.target.value, isValid)
  }
  render () {
    let addedViews = []
    switch (this.props.kind) {
      case 'EConnector':
        addedViews.push(<FormContrlWithElemsIDValidataion key='source' id='source' label='Source' value={this.props.source} update={this.props.updateInfo} mandatory={true}/>)
        addedViews.push(<FormContrlWithElemsIDValidataion key='sink' id='sink' label='Sink' value={this.props.sink} update={this.props.updateInfo} mandatory={true}/>)
        break
      case 'EComponent':
      case 'EPort':
        addedViews.push(<FormContrlWithElemsIDValidataion key='parents' id='parents' label='Parents' value={this.props.parents} update={this.props.updateInfo} mandatory={false}/>)
        break
    }

    return (
      <div>
        <form className='form-horizontal'>
          <DisabledFormControl id='elemsType' label='Type' value={this.props.type}/>
          <DisabledFormControl id='elemsKind' label='Kind' value={this.props.kind}/>
          <div className='form-group'>
            <label for='elemID' className='col-md-3 control-label'>ID</label>
            <div className='col-md-9'>
              <input type='text' className='form-control errorInput' id='elemID' value={this.props.elemID} onChange={this.handleIDChange} />
            </div>
          </div>
          {addedViews}
        </form>
      </div>
    )
  }
}
ExdefDetailsElementsElemsInput.propTypes = {
  type: PropTypes.string,
  kind: PropTypes.string,
  updateID: PropTypes.func,
  elemID: PropTypes.string,
  updateInfo: PropTypes.func,
  source: PropTypes.string,
  sink: PropTypes.string,
  parents: PropTypes.string
}

class DisabledFormControl extends Component {
  render () {
    return (
      <div className='form-group'>
        <label for={this.props.id} className='col-md-3 control-label'>{this.props.label}</label>
        <div className='col-md-9'>
          <input type='text' className='form-control' id={this.props.id} defaultValue={this.props.value} disabled />
        </div>
      </div>
    )
  }
}
DisabledFormControl.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string
}

class FormContrlWithElemsIDValidataion extends Component {
  constructor () {
    super()
    this.validateID = this.validateID.bind(this)
  }
  validateID (event) {
    let isValid = ipcRenderer.sendSync('validate-elemID', {value:event.target.value, inputType:this.props.id})
    validateInput(isValid, this.props.id, 'make-btn')
    this.props.update(this.props.id, event.target.value, isValid)
  }
  render () {
    return (
      <div>
        <div className='form-group'>
          <label for={this.props.id} className='col-md-3 control-label'>{this.props.label}</label>
          <div className='col-md-9'>
            <input type='text' className={this.props.mandatory ? 'form-control errorInput' : 'form-control'} value={this.props.value} id={this.props.id} onChange={this.validateID} />
          </div>
        </div>
      </div>
    )
  }
}
FormContrlWithElemsIDValidataion.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  update: PropTypes.func,
  value: PropTypes.string,
  mandatory: PropTypes.bool
}

class ExdefDetailsElementsElemsRecords extends Component {
  constructor () {
    super()
  }
  handleRemove (_id) {
    this.props.remove(_id)
  }
  render () {
    let style = {
      'overflowY': 'scroll',
      'height': '250px'
    }
    let ersListView = []
    this.props.ersList.forEach((er) => ersListView.push(
      <button type='button' className='list-group-item' key={er._id}>
        {er._id}
        <span className='glyphicon glyphicon-remove pull-right' onClick={() => this.handleRemove(er._id)}></span>
      </button>
    ))
    return (
      <div>
        <h3>Related Records</h3>
        <div className='list-group' style={style}>
          {ersListView}
        </div>
      </div>
    )
  }
}
ExdefDetailsElementsElemsRecords.propTypes = {
  ersList: PropTypes.array,
  remove: PropTypes.func
}
