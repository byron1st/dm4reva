'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import ExdefDetailsInfo from './exdef.details.info.view.js'
import ExdefDetailsEdit from './exdef.details.edit.view.js'
// import ExdefDetailsElements from './exdef.details.elements.view.js'
import ExdefDetailsRecords from './exdef.details.records.view.js'

export default class ExdefDetails extends Component {
  constructor () {
    super()
    this.state = {
      tabName: 'Info'
    }
    this.changeTab = this.changeTab.bind(this)
  }
  componentWillReceiveProps (nextProps) {
    this.setState({tabName: 'Info'})
  }
  changeTab (tabName) {
    this.setState({tabName: tabName})
  }
  render () {
    let tabsName = ['Info', 'Edit', 'Records']
    let tabsView = []
    tabsName.forEach((tabName) => {
      if (tabName === this.state.tabName) tabsView.push(<li key={tabName} className='active'><a href='#' onClick={() => this.changeTab(tabName)}>{tabName}</a></li>)
      else tabsView.push(<li key={tabName}><a href='#' onClick={() => this.changeTab(tabName)}>{tabName}</a></li>)
    })
    let tabContent
    switch(this.state.tabName) {
      case 'Info':
        tabContent = <ExdefDetailsInfo exdef={this.props.exdef} muList={this.props.muList}/>
        break;
      case 'Edit':
        tabContent = <ExdefDetailsEdit exdef={this.props.exdef} muList={this.props.muList} save={this.props.save} validateMUIDfromOthers={this.props.validateMUIDfromOthers}/>
        break;
      case 'Records':
        tabContent = <ExdefDetailsRecords recordsList={this.props.recordsList}/>
        break;
    }
    return (
      <div id='exdefDetails' className='col-md-8'>
        <div className='row'>
          <ul className='nav nav-pills nav-justified'>
            {tabsView}
          </ul>
        </div>
        <div className='row'>
          {tabContent}
        </div>
      </div>
    )
  }
}
ExdefDetails.propTypes = {
  save: PropTypes.func,
  exdef: PropTypes.object,
  muList: PropTypes.array,
  recordsList: PropTypes.array,
  validateMUIDfromOthers: PropTypes.func
}
