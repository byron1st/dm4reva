'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {remote} from 'electron'
import ViewerBody from './viewer.body.view.js'

class ViewerMain extends Component {
  constructor () {
    super()
    this.state = {
      elemsList: []
    }
    this.export = this.export.bind(this)
    this.refresh = this.refresh.bind(this)
    this.search = this.search.bind(this)
  }
  componentWillMount() {
    this.setState({elemsList: this.props.elemsList})
  }
  export () {
    console.log('todo: export a diagram')
  }
  refresh () {
    console.log('todo: refresh')
  }
  search (query) {
    console.log(query)
  }
  render () {
    console.log(this.props.elemsList)
    return (
      <div>
        <div className='row'>
          <ViewerTop export={this.export} refresh={this.refresh} search={this.search}/>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <ViewerBody elemsList={this.state.elemsList} />
          </div>
        </div>
      </div>
    )
  }
}
ViewerMain.propTypes = {
  elemsList: PropTypes.array.isRequired
}

class ViewerTop extends Component {
  render () {
    return (
      <div className='col-md-12'>
        <nav className='navbar navbar-default navbar-fixed-top'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-8'>
                <button type='button' className='btn btn-default navbar-btn' onClick={this.props.export.bind(this)}>Export a diagram</button>
                <button type='button' className='btn btn-default navbar-btn' onClick={this.props.refresh.bind(this)}><span className='glyphicon glyphicon-refresh'></span></button>
              </div>
              <div className='col-md-4'>
                <form className='navbar-form navbar-right' role='search'>
                  <div className='form-group'>
                    <div className='input-group'>
                      <input type='text' className='form-control' defaultValue='' placeholder='search' id='searchQuery'/>
                      <span className='input-group-btn'>
                        <button type='button' className='btn btn-default' onClick={() => this.props.search($('#searchQuery').val())}>
                          <span className='glyphicon glyphicon-search'></span>
                        </button>
                      </span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}
ViewerTop.propTypes = {
  search: PropTypes.func.isRequired,
  export: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired
}

ReactDOM.render(<ViewerMain elemsList={remote.getCurrentWindow().elemsList}/>, document.getElementById('viewerMain'))
