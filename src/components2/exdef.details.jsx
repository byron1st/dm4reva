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
  constructor () {
    super()
    this.selectTab = this.selectTab.bind(this)
    this.buildTabs = this.buildTabs.bind(this)
    this.buildContent = this.buildContent.bind(this)
  }
  selectTab (selectedTab) {
    this.props.dispatcher.dispatch({type: uiActionType.selectTab, value: selectedTab})
  }
  buildTabs () {
    let tabViews = []
    tabNamesList.forEach((tabName) => {
      if (tabName === this.props.store.detailsTab) {
        tabViews.push(<li key={tabName} className='active'><a href='#' onClick={() => this.selectTab(tabName)}>{tabName}</a></li>)
      } else tabViews.push(<li key={tabName}><a href='#' onClick={() => this.selectTab(tabName)}>{tabName}</a></li>)
    })
    return tabViews
  }
  buildContent () {
    switch(this.props.store.detailsTab) {
      case constants.detailsTabName.def:
        return <Def exdef={this.props.exdef} store={this.props.store} dispatcher={this.props.dispatcher} updateExdef={this.props.updateExdef}/>
      case constants.detailsTabName.id:
        return <Id exdef={this.props.exdef} store={this.props.store} dispatcher={this.props.dispatcher} updateExdefIdRules={this.props.updateExdefIdRules}/>
      case constants.detailsTabName.er:
        return <Er exdefType={this.props.exdef.type}/>
    }
  }
  render () {
    return (
      <div id='exdefDetails' className='col-md-8'>
        <div className='row'>
          <ul className='nav nav-pills nav-justified'>
            {this.buildTabs()}
          </ul>
        </div>
        <div className='row'>
          {this.buildContent()}
        </div>
      </div>
    )
  }
}
Details.propTypes = {
  exdef: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  dispatcher: PropTypes.object.isRequired,
  updateExdef: PropTypes.func.isRequired,
  updateExdefIdRules: PropTypes.func.isRequired
}
