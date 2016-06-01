'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

export class ExdefDetailsElementsERs extends Component {
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
    if (selectedERDetails) erDetailsView = <ExdefDetailsElementsERDetail er={selectedERDetails} />

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
        <div className='col-md-6 ers-view'>
          {erDetailsView}
        </div>
      </div>
    )
  }
}
ExdefDetailsElementsERs.propTypes = {
  ers: PropTypes.array
}

export class ExdefDetailsElementsERDetail extends Component {
  render () {
    return (
      <h3>Details: {this.props.er._id}</h3>
    )
  }
}
ExdefDetailsElementsERDetail.propTypes = {
  er: PropTypes.object
}
