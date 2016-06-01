'use strict'

import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import ExdefDetailsElementsERs from './exdef.details.elements.ers.view.js'

export default class ExdefDetailsElements extends Component {
  render () {
    return (
      <div>
        <div className='row' id='ers-view'>
          <ExdefDetailsElementsERs />
        </div>
        <div className='row'>
          <h1>Identify an element</h1>
        </div>
      </div>
    )
  }
}
