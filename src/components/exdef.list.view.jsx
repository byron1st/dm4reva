'use strict'

import React, {Component} from 'react'
import ReactDOM from 'react-dom'

export default class ExdefList extends Component {
  render () {
    let exdefListView = []
    this.props.exdefList.forEach((exdef) => {
      let isSelected = exdef._id === this.props.selectedExdef
      exdefListView.push(<ExdefListItem key={exdef._id} exdef={exdef} isSelected={isSelected} select={this.props.select}/>)
    })
    return (
      <div id='exdefList' className='col-md-4'>
        <div className='list-group'>
          {exdefListView}
        </div>
      </div>
    )
  }
}

class ExdefListItem extends Component {
  handleSelect () {
    this.props.select(this.props.exdef._id)
  }

  render () {
    return (
      <a href='#' className={this.props.isSelected ? 'list-group-item active' : 'list-group-item'} onClick={ this.handleSelect.bind(this) }>
        {this.props.exdef.type}: {this.props.exdef.kind}
      </a>
    )
  }
}
