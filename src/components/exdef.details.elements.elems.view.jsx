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
  }
  updateElemsID (updatedID) {
    this.setState({elemsID: updatedID})
  }
  render () {
    return (
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-6'>
            <div className='well'>
              <ExdefDetailsElementsElemsInput type={this.props.type} kind={this.props.kind} elemsID={this.state.elemsID} updateID={this.updateElemsID}/>
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
    return (
      <div>
        <form className='form-horizontal'>
          <DisabledFormControl id='elemsType' label='Type' value={this.props.type}/>
          <DisabledFormControl id='elemsKind' label='Kind' value={this.props.kind}/>
          <div className='form-group'>
            <label for='elemsID' className='col-md-2 control-label'>ID</label>
            <div className='col-md-10'>
              <input type='text' className='form-control' id='elemsID' value={this.props.elemsID} onChange={this.handleIDChange} />
            </div>
          </div>
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
        <label for={this.props.id} className='col-md-2 control-label'>{this.props.label}</label>
        <div className='col-md-10'>
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

class ExdefDetailsElementsElemsRecords extends Component {
  render () {
    return (
      <h3>Related Records</h3>
    )
  }
}
