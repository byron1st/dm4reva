'use strict'

import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {ipcRenderer} from 'electron'

class ExDefMain extends Component {
  render() {
    return <h1>Hello</h1>
  }
}

ReactDOM.render(<ExDefMain />, document.getElementById('exdefMain'))
