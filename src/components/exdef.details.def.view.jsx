'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

export default class DefView extends Component {
  render () {
    let infListView = []
    this.props.exdef.inf.forEach((inf) => infListView.push(<div className='checkbox'><label><input type='checkbox' disabled />{inf}</label></div>))
    return (
      <div className='row'>
        <div className='col-md-12'>
          <form className='form-horizontal'>
            <DefTypeOrKindView name='Type' value={this.props.exdef.type} />
            <DefTypeOrKindView name='Kind' value={this.props.exdef.kind} />
            <div className='form-group'>
              <label className='col-md-2 control-label'>Interfaces</label>
              <div className='col-md-10'>
                {infListView}
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

class DefTypeOrKindView extends Component {
  render () {
    return (
      <div className='form-group'>
        <label for={this.props.name} className='col-md-2 control-label'>{this.props.name}</label>
        <div className='col-md-10'>
          <p className='form-control-static' id={this.props.name}>{this.props.value}</p>
        </div>
      </div>
    )
  }
}
