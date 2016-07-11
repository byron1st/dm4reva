'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

export default class DefView extends Component {
  constructor () {
    super()
    this.buildKeyValueView = this.buildKeyValueView.bind(this)
    this.buildInfView = this.buildInfView.bind(this)
  }
  buildKeyValueView (key, value) {
    return (
      <div className='form-group'>
        <label for={key} className='col-md-2 control-label'>{key}</label>
        <div className='col-md-10'>
          <p className='form-control-static' id={key}>{value}</p>
        </div>
      </div>
    )
  }
  buildInfView () {
    let infListView = []
    this.props.exdef.inf.forEach((inf) => infListView.push(<div className='checkbox'><label><input type='checkbox' disabled />{inf}</label></div>))
    return (
      <div className='form-group'>
        <label className='col-md-2 control-label'>Interfaces</label>
        <div className='col-md-10'>
          {infListView}
        </div>
      </div>
    )
  }
  render () {
    return (
      <div className='row'>
        <div className='col-md-12'>
          <form className='form-horizontal'>
            {this.buildKeyValueView('Type', this.props.exdef.type)}
            {this.buildKeyValueView('Kind', this.props.exdef.kind)}
            {this.buildInfView()}
          </form>
        </div>
      </div>
    )
  }
}
DefView.propTypes = {
  exdef: PropTypes.object.isRequired
}
