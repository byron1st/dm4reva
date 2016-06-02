'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

export default class ExdefDetailsElementsERs extends Component {
  constructor () {
    super()
    this.state = {
      selectedER_id: ''
    }
  }
  selectER (_id) {
    this.setState({selectedER_id: _id})
  }
  render () {
    let selectedERDetails = this.props.ers.find((er) => er._id === this.state.selectedER_id)
    let erDetailsView
    if (selectedERDetails) erDetailsView = <ExdefDetailsElementsERDetail er={selectedERDetails} checkAnER={this.props.checkAnER} />

    let ersListView = []
    this.props.ers.forEach((er) => {
      let isSelected = this.state.selectedER_id === er._id
      ersListView.push(
        <a href='#'
          onClick={() => this.selectER(er._id)}
          className={isSelected ? 'list-group-item active' : 'list-group-item'}>
          <h4 className='list-group-item-heading'>[{er.muID}] <small>{er._id}</small></h4>
          <p className='list-group-item-text'>Timestamp: {er.meta.timestamp}</p>
        </a>
      )
    })
    return (
      <div style={{height: '100%'}}>
        <div className='col-md-6' style={{height: '100%'}}>
          <h3>Execution Records</h3>
          <div className='list-group ers-view'>
            {ersListView}
          </div>
        </div>
        <div className='col-md-6' style={{height: '100%'}}>
          <h3>Record ID: {this.state.selectedER_id}</h3>
          <div className='ers-view'>
            {erDetailsView}
          </div>
        </div>
      </div>
    )
  }
}
ExdefDetailsElementsERs.propTypes = {
  ers: PropTypes.array,
  checkAnER: PropTypes.func
}

class ExdefDetailsElementsERDetail extends Component {
  constructor () {
    super()
    this.handleCheck = this.handleCheck.bind(this)
  }
  handleCheck () {
    this.props.checkAnER(this.props.er._id)
  }
  render () {
    let metaKeys = Object.keys(this.props.er.meta)
    let valuesKeys = Object.keys(this.props.er.values)
    metaKeys.sort()
    valuesKeys.sort()
    let metaView = []
    let valuesView = []
    metaKeys.forEach((key) => metaView.push(<li>{key}: {this.props.er.meta[key]}</li>))
    valuesKeys.forEach((key) => valuesView.push(<li>{key}: {this.props.er.values[key]}</li>))
    return (
      <div>
        <div className='row'>
          <div className='col-md-12'>
            <button type='button' className='btn btn-default btn-block' onClick={this.handleCheck}>Check</button>
            <h4>Meta Information</h4>
            <ul>
              {metaView}
            </ul>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <h4>Values Information</h4>
            <ul>
              {valuesView}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
ExdefDetailsElementsERDetail.propTypes = {
  er: PropTypes.object,
  checkAnER: PropTypes.func
}
