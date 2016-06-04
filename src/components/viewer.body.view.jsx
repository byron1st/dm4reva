'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

export default class ViewerBody extends Component {
  constructor () {
    super()
    this.state = {
      selectedElem: {}
    }
    this.selectAnElem = this.selectAnElem.bind(this)
  }
  selectAnElem (elemID) {

  }
  render () {
    return (
      <div>
        <div className='row'>
          <div className='col-md-8'>
            <ViewerBodyDiagram elemsList={this.props.elemsList} select={this.selectAnElem} />
          </div>
          <div className='col-md-4'>
            <div className='row'>
              <ViewerBodyList elemsList={this.props.elemsList} select={this.selectAnElem} selectedElem={this.state.selectedElem}/>
            </div>
            <div className='row'>
              <ViewerBodyDetail elem={this.state.selectedElem}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
ViewerBody.propTypes = {
  elemsList: PropTypes.array.isRequired
}

class ViewerBodyDiagram extends Component {
  render () {
    return (
      <div>
        <h1>Diagram !!</h1>
      </div>
    )
  }
}
ViewerBodyDiagram.propTypes = {
  elemsList: PropTypes.array.isRequired,
  select: PropTypes.func.isRequired
}

class ViewerBodyList extends Component {
  render () {
    return (
      <div className='col-md-12'>
        <h1>List!</h1>
      </div>
    )
  }
}
ViewerBodyList.propTypes = {
  elemsList: PropTypes.array.isRequired,
  select: PropTypes.func.isRequired,
  selectedElem: PropTypes.object.isRequired
}

class ViewerBodyDetail extends Component {
  render () {
    return (
      <div className='col-md-12'>
        <h1>Detail!</h1>
      </div>
    )
  }
}
ViewerBodyDetail.propTypes = {
  elem: PropTypes.object.isRequired
}
