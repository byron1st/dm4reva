'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

export default class Er extends Component {
  render () {
    let erView = []
    this.props.store.selected.erList.forEach((record) => {
      let metaKeys = Object.keys(record.meta)
      let valuesKeys = Object.keys(record.values)
      metaKeys.sort()
      valuesKeys.sort()
      let metaView = []
      let valuesView = []
      metaKeys.forEach((key) => metaView.push(<li>{key}: {record.meta[key]}</li>))
      valuesKeys.forEach((key) => valuesView.push(<li>{key}: {record.values[key]}</li>))

      erView.push(
        <div className='panel panel-default'>
          <div className='panel-heading'>ID: {record._id} (muID: <strong>{record.muID}</strong>)</div>
          <div className='panel-body'>
            <h4>Meta Information</h4>
            <ul>
              {metaView}
            </ul>
            <h4>Values Information</h4>
            <ul>
              {valuesView}
            </ul>
          </div>
        </div>
      )
    })
    return (
      <div className='col-md-12'>
        {erView}
      </div>
    )
  }
}
