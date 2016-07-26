'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

const searchBarMargin = {
  'margin-top': '20px',
  'margin-bottom': '20px'
}
export default class Er extends Component {
  parseHTML (locID, value) {
    let parsed = $.parseHTML(value)
    $(locID).html(parsed)
  }
  render () {
    let erView = []
    let sortedErList = this.props.store.selected.erList.sort((a, b) => {
      if (a.time > b.time) return 1
      else return -1
    })

    sortedErList.forEach((record) => {
      let metaKeys = Object.keys(record.meta)
      let valuesKeys = Object.keys(record.values)
      metaKeys.sort()
      valuesKeys.sort()
      let metaView = []
      let valuesView = []
      metaKeys.forEach((key) => metaView.push(<li>{key}: {record.meta[key]}</li>))
      valuesKeys.forEach((key) => valuesView.push(<li>{key}: {record.values[key]}</li>))

      erView.push(
        <div className='panel panel-default' id='er'>
          <div className='panel-heading'>ID: {record.time} (muID: <strong>{record.muID}</strong>) <small className='pull-right'>{record._id}</small></div>
          <div className='panel-body'>
            <h4>Meta Information</h4>
            <ul id='metaList'>
              {metaView}
            </ul>
            <h4>Values Information</h4>
            <ul id='valuesList'>
              {valuesView}
            </ul>
          </div>
        </div>
      )
    })
    return (
      <div className='col-md-12'>
        <h4>Description of Identification Rules</h4>
        <div className='well well-sm' id='idRulesHTML_ER'>
        </div>
        <input type='text' className='form-control' id='search' placeholder='Search...' style={searchBarMargin} />
        <div id='erViewList'>
          {erView}
        </div>
      </div>
    )
  }
  componentDidMount() {
    this.parseHTML('#idRulesHTML_ER', this.props.store.selected.exdef.id_rules_html)
    $('#search').keyup(function() {
        let userInput = $(this).val();
        $('#erViewList div#er').map(function(index, value) {
            $(value).toggle($(value).text().toLowerCase().indexOf(userInput.toLowerCase()) >= 0);
        });
    });
  }
  componentDidUpdate (prevProps, prevState) {
    this.parseHTML('#idRulesHTML_ER', this.props.store.selected.exdef.id_rules_html)
  }
}
