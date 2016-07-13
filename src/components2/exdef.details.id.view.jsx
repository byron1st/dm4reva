'use strict'

import React, {Component} from 'react'
import ReactDOM from 'react-dom'

const breakWordCSS = {
  'overflow-wrap': 'break-word'
}

const marginBottomCSS = {
  'margin-bottom': '10px'
}

export default class IdView extends Component {
  parseHTML (locID, value) {
    let parsed = $.parseHTML(value)
    $(locID).html(parsed)
  }
  render () {
    let muListView = []
    this.props.store.selected.muList.forEach((mu, idx) => muListView.push(
      <div className='panel panel-default' style={marginBottomCSS}>
        <div className='panel-heading'>
          <h4 className='panel-title'>{mu.muID}</h4>
        </div>
        <div className='panel-body' style={breakWordCSS} id={'mu' + idx}>
          {mu.desc}
        </div>
      </div>
    ))
    return (
      <div className='col-md-12'>
        <div className='row'>
          <div className='col-md-12'>
            <h3>Description</h3>
            <div className='well well-sm' id='idRulesHTML'>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <h3>Monitoring Units</h3>
            {muListView}
          </div>
        </div>
      </div>
    )
  }
  componentDidMount () {
    this.parseHTML('#idRulesHTML', this.props.store.selected.exdef.id_rules_html)
  }
  componentDidUpdate (prevProps, prevState) {
    this.parseHTML('#idRulesHTML', this.props.store.selected.exdef.id_rules_html)
  }
}
