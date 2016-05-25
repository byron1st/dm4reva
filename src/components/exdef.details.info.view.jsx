'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

function getOverflowYStyle(height) {
  return {
    'overflowY': 'scroll',
    'height': height
  }
}

export default class ExdefDetailsInfo extends Component {
  render () {
    console.log(this.props.exdef)
    return (
      <div className='row'>
        <div className='col-md-12'>
          <ExdefDetailsInfoHeader type={this.props.exdef.type} kind={this.props.exdef.kind} />
          <ExdefDetailsInfoInf inf={this.props.exdef.inf} />
          <ExdefDetailsInfoIDRules idRules={this.props.exdef.id_rules} />
          <ExdefDetailsInfoRid rid={this.props.exdef.rid} />
        </div>
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
              <button className='btn btn-info btn-xs pull-right' id='seeDRBtn'>See selected DRs</button>
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
  inf: PropTypes.array
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

class ExdefDetailsInfoRid extends Component {
  render () {
    let ridListItemView = []
    this.props.rid.forEach((anItem) => ridListItemView.push(<li className='list-group-item' key={anItem}>{anItem}</li>))
    return (
      <div className='row'>
        <div className='col-md-12'>
          <h3>Records Identifiers</h3>
          <ul className='list-group' style={getOverflowYStyle('220px')}>{ridListItemView}</ul>
        </div>
      </div>
    )
  }
}
ExdefDetailsInfoRid.propTypes = {
  rid: PropTypes.array
}
