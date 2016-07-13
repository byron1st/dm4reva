'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

import Def from './exdef.details.def'
import Id from './exdef.details.id'
import Er from './exdef.details.er'

import {type as uiActionType} from './actions.ui'

import constants from './const'

const tabNamesList = [constants.detailsTabName.def, constants.detailsTabName.id, constants.detailsTabName.er]

export default class Details extends Component {
  selectTab (selectedTab) {
    this.props.dispatcher.dispatch({type: uiActionType.selectTab, value: selectedTab})
  }
  render () {
    let tabViews = []
    tabNamesList.forEach((tabName) => {
      if (tabName === this.props.store.detailsTab) {
        tabViews.push(<li key={tabName} className='active'><a href='#' onClick={() => this.selectTab(tabName)}>{tabName}</a></li>)
      } else tabViews.push(<li key={tabName}><a href='#' onClick={() => this.selectTab(tabName)}>{tabName}</a></li>)
    })

    let tabContent
    switch(this.props.store.detailsTab) {
      case constants.detailsTabName.def:
        tabContent = <Def store={this.props.store} dispatcher={this.props.dispatcher} />
        break
      case constants.detailsTabName.id:
        tabContent = <Id store={this.props.store} dispatcher={this.props.dispatcher} />
        break
      case constants.detailsTabName.er:
        tabContent = <Er store={this.props.store} />
        break
    }
    return (
      <div id='exdefDetails' className='col-md-8'>
        <div className='row'>
          <ul className='nav nav-pills nav-justified'>
            {tabViews}
          </ul>
        </div>
        <div className='row'>
          {tabContent}
        </div>
      </div>
    )
  }
}
