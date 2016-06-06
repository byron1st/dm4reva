'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import vis from 'vis'

export default class ViewerBody extends Component {
  constructor () {
    super()
    this.state = {
      selectedElem: {}
    }
    this.selectAnElem = this.selectAnElem.bind(this)
  }
  selectAnElem (elemID) {
    let index = this.props.elemsList.map((e) => e.elemID).indexOf(elemID)
    let newSelectedElem = {}
    Object.keys(this.props.elemsList[index]).forEach((key) => newSelectedElem[key] = this.props.elemsList[index][key])
    this.setState({selectedElem: newSelectedElem})
  }
  render () {
    return (
      <div>
        <div className='row'>
          <div className='col-md-8'>
            <ViewerBodyDiagram elemsList={this.props.elemsList} select={this.selectAnElem} selectedElem={this.state.selectedElem}/>
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
  constructor () {
    super()
    this.state = {
      network: {}
    }
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick (params) {
    let selectedElemID = null
    if (params.nodes.length === 0 && params.edges.length !== 0) {
      selectedElemID = params.edges[0]
    } else {
      selectedElemID = params.nodes[0]
    }
    if (selectedElemID) this.props.select(selectedElemID)
  }
  componentDidMount () {
    let nodesList = []
    let edgesList = []
    this.props.elemsList.forEach((elem) => {
      if (elem.kind === 'EConnector') edgesList.push({id: elem.elemID, from: elem.source, to: elem.sink})
      else nodesList.push({id: elem.elemID, label: elem.elemID})
    })
    let container = document.getElementById('diagram')
    let nodes = new vis.DataSet(nodesList)
    let edges = new vis.DataSet(edgesList)
    let data = {
      nodes: nodes,
      edges: edges
    }
    let options = {
      height: '600px',
      edges: {
        arrows: {
          to: {enabled: true}
        }
      }
    }
    let newNetwork = new vis.Network(container, data, options)
    newNetwork.on('click', (params) => this.handleClick(params))
    this.setState({network: newNetwork})
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.selectedElem) {
      if (this.props.selectedElem.kind === 'EConnector') {
        this.state.network.selectEdges([this.props.selectedElem.elemID])
      } else {
        this.state.network.selectNodes([this.props.selectedElem.elemID])
      }
    }
  }
  render () {
    return (
      <div id='diagram'>
      </div>
    )
  }
}
ViewerBodyDiagram.propTypes = {
  elemsList: PropTypes.array.isRequired,
  select: PropTypes.func.isRequired,
  selectedElem: PropTypes.object.isRequired
}

class ViewerBodyList extends Component {
  constructor () {
    super()
    this.handleSelect = this.handleSelect.bind(this)
  }
  handleSelect (event) {
    this.props.select(event.target.name)
  }
  render () {
    let style = {
      'overflowY': 'scroll',
      'height': '300px'
    }
    let elemsListView = []
    this.props.elemsList.forEach((elem) => {
      elemsListView.push(
        <button type='button' onClick={this.handleSelect} name={elem.elemID}
          className={elem.elemID === this.props.selectedElem.elemID ? 'list-group-item active' : 'list-group-item'}>
          {elem.elemID}
        </button>
      )
    })
    return (
      <div className='col-md-12'>
        <div className='list-group' style={style}>
          {elemsListView}
        </div>
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
    let additionalInfoView = []
    switch (this.props.elem.kind) {
      case 'EConnector':
        additionalInfoView.push(<li>Source: {this.props.elem.source}</li>)
        additionalInfoView.push(<li>Sink: {this.props.elem.sink}</li>)
        break
      case 'EComponent':
      case 'EPort':
        additionalInfoView.push(<li>Parents: {this.props.elem.parents}</li>)
    }
    return (
      <div className='col-md-12'>
        <ul>
          <li>ID: {this.props.elem.elemID}</li>
          <li>Type: {this.props.elem.type}</li>
          <li>Kind: {this.props.elem.kind}</li>
          {additionalInfoView}
        </ul>
      </div>
    )
  }
}
ViewerBodyDetail.propTypes = {
  elem: PropTypes.object.isRequired
}
