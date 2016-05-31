'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {ipcRenderer} from 'electron'

function getOverflowYStyle(height) {
  return {
    'overflowY': 'scroll',
    'height': height
  }
}

export default class ExdefDetailsInfo extends Component {
  constructor () {
    super()
    this.state = {
      drs:[]
    }
    this.getDRs = this.getDRs.bind(this)
  }
  componentWillReceiveProps (nextProps) {
    this.setState({drs: []})
  }
  getDRs () {
    let obtainedDRs = ipcRenderer.sendSync('read-drs', this.props.exdef.inf)
    console.log(obtainedDRs)
    this.setState({drs: obtainedDRs})
    window.$('#drModal').modal('show')
  }
  render () {
    return (
      <div className='row'>
        <div className='col-md-12'>
          <ExdefDetailsInfoHeader type={this.props.exdef.type} kind={this.props.exdef.kind} />
          <ExdefDetailsInfoInf inf={this.props.exdef.inf} getDRs={this.getDRs} />
          <ExdefDetailsInfoIDRules idRules={this.props.exdef.id_rules} />
          <ExdefDetailsInfoMU mu={this.props.exdef.mu} />
        </div>
        <ExdefDetailsInfoDRModal drs={this.state.drs}/>
      </div>
    )
  }
}
ExdefDetailsInfo.propTypes = {
  exdef: PropTypes.object
}

class ExdefDetailsInfoHeader extends Component {
  render () {
    return (
      <div className='row'>
        <div className='col-md-12'>
          <h2>{this.props.type} <small>{this.props.kind}</small></h2>
        </div>
      </div>
    )
  }
}
ExdefDetailsInfoHeader.propTypes = {
  type: PropTypes.string,
  kind: PropTypes.string
}

class ExdefDetailsInfoInf extends Component {
  render () {
    let infListView
    let infListItemView = []
    this.props.inf.forEach((anItem) => infListItemView.push(<li className='list-group-item' key={anItem}>{anItem}</li>))
    if (this.props.inf.lenght > 5) infListView = <ul className='list-group' style={getOverflowYStyle('220px')}>{infListItemView}</ul>
    else infListView = <ul className='list-group'>{infListItemView}</ul>
    return (
      <div className='row'>
        <div className='col-md-12'>
          <div className='row'>
            <div className='col-md-8'>
              <h3>Interfaces</h3>
            </div>
            <div className='col-md-4'>
              <button className='btn btn-info btn-xs pull-right' id='seeDRBtn' onClick={this.props.getDRs.bind(this)}>See selected dependency relationships</button>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-12'>
              {infListView}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
ExdefDetailsInfoInf.propTypes = {
  inf: PropTypes.array,
  getDRs: PropTypes.func
}

class ExdefDetailsInfoIDRules extends Component {
  render () {
    return (
      <div className='row'>
        <div className='col-md-12'>
          <h3>Identification Rules</h3>
          <div className='panel panel-default'>
            <div className='panel-body'>
              {this.props.idRules}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
ExdefDetailsInfoIDRules.propTypes = {
  idRules: PropTypes.string
}

class ExdefDetailsInfoMU extends Component {
  render () {
    let muListItemView = []
    this.props.mu.forEach((anItem) => muListItemView.push(<li className='list-group-item' key={anItem}>{anItem}</li>))
    return (
      <div className='row'>
        <div className='col-md-12'>
          <h3>Monitoring Units</h3>
          <ul className='list-group' style={getOverflowYStyle('220px')}>{muListItemView}</ul>
        </div>
      </div>
    )
  }
}
ExdefDetailsInfoMU.propTypes = {
  mu: PropTypes.array
}

class ExdefDetailsInfoDRModal extends Component {
  render () {
    let drsView = []
    this.props.drs.forEach((dr) => drsView.push(
      <li className='list-group-item'>
        <h5 className='list-group-item-heading'>{dr.inf} <small>{dr.sink}</small></h5>
        <p className='list-group-item-text'>
          <ul>
            <li>Source: {dr.source}</li>
            <li>Kind: {dr.rkind}</li>
          </ul>
        </p>
      </li>
    ))
    return (
      <div className='modal fade' id='drModal' role='dialog' aria-labelledby='drModalLabel'>
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h4 className='modal-title' id='drModalLabel'>Selected dependency relationships</h4>
            </div>
            <div className='modal-body' style={getOverflowYStyle('500px')}>
              <ul className='list-group'>
                {drsView}
              </ul>
            </div>
            <div className='modal-footer'>
              <button className='btn btn-default' data-dismiss='modal' aria-label='Close'>Close</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
ExdefDetailsInfoDRModal.propTypes = {
  drs: PropTypes.array
}
