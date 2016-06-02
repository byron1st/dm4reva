'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

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
    this.makeAnElem = this.makeAnElem.bind(this)
  }
  updateElemsID (updatedID) {
    this.setState({elemsID: updatedID})
  }
  makeAnElem () {
    console.log(this.state.elemsID)
    //TODO: IPC 전송
    this.setState({elemsID: ''})
  }
  render () {
    return (
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-6'>
            <div className='well'>
              <ExdefDetailsElementsElemsInput type={this.props.type} kind={this.props.kind} elemsID={this.state.elemsID} updateID={this.updateElemsID} make={this.makeAnElem}/>
              <button type='button' className='btn btn-primary btn-block' onClick={this.makeAnElem} id='make-btn'>Make an element</button>
            </div>
          </div>
          <div className='col-md-6'>
            <ExdefDetailsElementsElemsRecords />
          </div>
        </div>
      </div>
    )
  }
}
ExdefDetailsElementsElems.propTypes = {
  type: PropTypes.string,
  kind: PropTypes.string
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
        addedViews.push(<FormContrlWithElemsIDValidataion key='source' id='source' label='Source' />)
        addedViews.push(<FormContrlWithElemsIDValidataion key='sink' id='sink' label='Sink' />)
        break
      case 'EComponent':
      case 'EPort':
        addedViews.push(<FormContrlWithElemsIDValidataion key='parents' id='parents' label='Parents' />)
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
  elemsID: PropTypes.string
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
    let isValid = ipcRenderer.sendSync('validate-elemsID', event.target.value)
    if (isValid) {
      document.getElementById(this.props.id).style['border-color'] = '#66afe9'
      document.getElementById(this.props.id).style['box-shadow'] = 'inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6)'
      document.getElementById('make-btn').disabled = false
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
  label: PropTypes.string
}

class ExdefDetailsElementsElemsRecords extends Component {
  render () {
    return (
      <h3>Related Records</h3>
    )
  }
}