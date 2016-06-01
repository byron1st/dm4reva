'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

export default class ExdefDetailsElementsERs extends Component {
  render () {
    let ersListView = []
    this.props.ers.forEach((er) => ersListView.push(
      <a href='#' className='list-group-item'>
        <h4 className='list-group-item-heading'>[{er.muID}] <small>{er._id}</small></h4>
        <p className='list-group-item-text'>Timestamp: {er.meta.timestamp}</p>
      </a>
    ))
    return (
      <div style={{height: '100%'}}>
        <div className='col-md-6' style={{height: '100%'}}>
          <h3>Execution Records</h3>
          <div className='list-group ers-view'>
            {ersListView}
          </div>
        </div>
        <div className='col-md-6 ers-view'>
        </div>
      </div>
    )
  }
}
ExdefDetailsElementsERs.proptypes = {
  ers: PropTypes.array
}
