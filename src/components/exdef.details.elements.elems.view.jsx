'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {ipcRenderer} from 'electron'

export default class ExdefDetailsElementsElems extends Component {
  constructor () {
    super()
    this.state = {
      elemsID: '',
      source: '',
      sink: '',
      parents: ''
    }
    this.updateElemsID = this.updateElemsID.bind(this)
    this.updateInfo = this.updateInfo.bind(this)
    this.makeAnElem = this.makeAnElem.bind(this)
  }
  updateElemsID (updatedID) {
    this.setState({elemsID: updatedID})
  }
  updateInfo (info, newValue) {
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
    newElem.ers = []
    this.props.checkedERsList.forEach((checkedER) => newElem.ers.push(checkedER._id))
    this.props.make(newElem)
    this.setState({elemsID: ''})
  }
  render () {
    return (
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-6'>
            <div className='well'>
              <ExdefDetailsElementsElemsInput type={this.props.type} kind={this.props.kind} elemsID={this.state.elemsID} updateID={this.updateElemsID} make={this.makeAnElem} updateInfo={this.updateInfo}/>
              <button type='button' className='btn btn-primary btn-block' onClick={this.makeAnElem} id='make-btn'>Make an element</button>
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
    this.props.updateID(event.target.value)
  }
  render () {
    let addedViews = []
    switch (this.props.kind) {
      case 'EConnector':
        addedViews.push(<FormContrlWithElemsIDValidataion key='source' id='source' label='Source' update={this.props.updateInfo}/>)
        addedViews.push(<FormContrlWithElemsIDValidataion key='sink' id='sink' label='Sink' update={this.props.updateInfo} />)
        break
      case 'EComponent':
      case 'EPort':
        addedViews.push(<FormContrlWithElemsIDValidataion key='parents' id='parents' label='Parents' update={this.props.updateInfo} />)
        break
    }

    return (
      <div>
        <form className='form-horizontal'>
          <DisabledFormControl id='elemsType' label='Type' value={this.props.type}/>
          <DisabledFormControl id='elemsKind' label='Kind' value={this.props.kind}/>
          <div className='form-group'>
            <label for='elemsID' className='col-md-3 control-label'>ID</label>
            <div className='col-md-9'>
              <input type='text' className='form-control' id='elemsID' value={this.props.elemsID} onChange={this.handleIDChange} />
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
  elemsID: PropTypes.string,
  updateInfo: PropTypes.func
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
    //TODO let isValid = ipcRenderer.sendSync('validate-elemsID', event.target.value)
    let isValid = true
    if (isValid) {
      document.getElementById(this.props.id).style['border-color'] = '#66afe9'
      document.getElementById(this.props.id).style['box-shadow'] = 'inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)'
      document.getElementById('make-btn').disabled = false
      this.props.update(this.props.id, event.target.value)
    } else {
      document.getElementById(this.props.id).style['border-color'] = '#FF7D7D'
      document.getElementById(this.props.id).style['box-shadow'] = 'inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(233,102,102,0.6)'
      document.getElementById('make-btn').disabled = true
    }
  }
  render () {
    return (
      <div>
        <div className='form-group'>
          <label for={this.props.id} className='col-md-3 control-label'>{this.props.label}</label>
          <div className='col-md-9'>
            <input type='text' className='form-control' id={this.props.id} onChange={this.validateID} />
          </div>
        </div>
      </div>
    )
  }
}
FormContrlWithElemsIDValidataion.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  update: PropTypes.func
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
