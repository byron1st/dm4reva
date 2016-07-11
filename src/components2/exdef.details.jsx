'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

import Def from './exdef.details.def'
import Id from './exdef.details.id'
import Er from './exdef.details.er'

const tab = {
  def: 'Definition',
  id: 'Identification Rules',
  er: 'Execution Records'
}

export default class Details extends Component {
  constructor () {
    super()
    this.state = {
      tab: tab.def
    }
    this.selectTab = this.selectTab.bind(this)
    this.buildTabs = this.buildTabs.bind(this)
    this.buildContent = this.buildContent.bind(this)
  }
  componentWillReceiveProps (nextProps) {
    this.selectTab(tab.def)
  }
  selectTab (selectedTab) {
    this.setState({tab: selectedTab})
  }
  buildTabs () {
    let tabNamesList = [tab.def, tab.id, tab.er]
    let tabViews = []
    tabNamesList.forEach((tabName) => {
      if (tabName === this.state.tab) tabViews.push(<li key={tabName} className='active'><a href='#' onClick={() => this.selectTab(tabName)}>{tabName}</a></li>)
      else tabViews.push(<li key={tabName}><a href='#' onClick={() => this.selectTab(tabName)}>{tabName}</a></li>)
    })
    return tabViews
  }
  buildContent () {
    switch(this.state.tab) {
      case tab.def:
        return <Def exdef={this.props.exdef} updateExdef={this.props.updateExdef}/>
      case tab.id:
        return <Id exdef={this.props.exdef} updateExdefIdRules={this.props.updateExdefIdRules}/>
      case tab.er:
        return <Er />
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
  updateExdef: PropTypes.func.isRequired,
  updateExdefIdRules: PropTypes.func.isRequired
}
