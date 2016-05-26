'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

function getOverflowYStyle(height) {
  return {
    'overflowY': 'scroll',
    'height': height
  }
}

export default class ExdefDetailsEdit extends Component {
  constructor () {
    super()
    this.state = {
      exdef: {}
    }
    this.updateType = this.updateType.bind(this)
    this.updateKind = this.updateKind.bind(this)
    this.updateInf = this.updateInf.bind(this)
    this.removeInf = this.removeInf.bind(this)
  }
  componentWillMount () {
    this.setState({exdef: this.props.exdef})
  }
  updateType (type) {
    let updatedExdef = this.state.exdef
    updatedExdef.type = type
    this.setState({exdef: updatedExdef})
  }
  updateKind (kind) {
    let updatedExdef = this.state.exdef
    updatedExdef.kind = kind
    this.setState({exdef: updatedExdef})
  }
  updateInf(inf, index) {
    let updatedExdef = this.state.exdef
    let updatedInf = this.state.exdef.inf
    updatedInf.splice(index, 1, inf)
    updatedExdef.inf = updatedInf
    this.setState({exdef: updatedExdef})
  }
  removeInf(index) {
    let updatedExdef = this.state.exdef
    let updatedInf = this.state.exdef.inf
    updatedInf.splice(index, 1)
    updatedExdef.inf = updatedInf
    this.setState({exdef: updatedExdef})
  }
  render () {
    return (
      <div className='row'>
        <div className='col-md-12'>
          <ExdefDetailsEditTypeAndKind type={this.state.exdef.type} kind={this.state.exdef.kind} updateType={this.updateType} updateKind={this.updateKind}/>
          <ExdefDetailsEditInf inf={this.state.exdef.inf} update={this.updateInf} add={this.addInf} remove={this.removeInf}/>
        </div>
      </div>
    )
  }
}
ExdefDetailsEdit.propTypes = {
  exdef: PropTypes.object
}

class ExdefDetailsEditTypeAndKind extends Component {
  constructor () {
    super()
    this.handleChangeOnType = this.handleChangeOnType.bind(this)
    this.handleChangeOnKind = this.handleChangeOnKind.bind(this)
  }
  handleChangeOnType (event) {
    this.props.updateType(event.target.value)
  }
  handleChangeOnKind (event) {
    this.props.updateKind(event.target.value)
  }
  render () {
    return (
      <div className='row'>
        <div className='col-md-12'>
          <div class='form-group'>
            <label for='type'>Type</label>
            <input type='text' className='form-control' id='type' value={this.props.type} onChange={this.handleChangeOnType} />
          </div>
          <div class='form-group'>
            <label for='kind'>Kind</label>
            <input type='text' className='form-control' id='kind' value={this.props.kind} onChange={this.handleChangeOnKind} />
          </div>
        </div>
      </div>
    )
  }
}
ExdefDetailsEditTypeAndKind.propTypes = {
  type: PropTypes.string,
  kind: PropTypes.string,
  updateType: PropTypes.func,
  updateKind: PropTypes.func
}

class ExdefDetailsEditInf extends Component {
  constructor () {
    super()
    this.handleAdd = this.handleAdd.bind(this)
  }
  handleAdd(newInf) {
    console.log(newInf)
  }
  render () {
    let infListView
    let infListItemView = []
    this.props.inf.forEach((anItem, index) => infListItemView.push(<ExdefDetailsEditInfItem inf={anItem} key={index} index={index} update={this.props.update} remove={this.props.remove} />))
    if (this.props.inf.lenght > 5) infListView = <div style={getOverflowYStyle('220px')}>{infListItemView}</div>
    else infListView = <div>{infListItemView}</div>
    return (
      <div className='row'>
        <div className='col-md-12'>
          <div className='row'>
            <div className='col-md-4'>
              <h3>Interfaces</h3>
            </div>
            <div className='col-md-8'>
              <div className='input-group' id='addInf'>
                <input type='text' id='newInf' className='form-control' defaultValue='' />
                <span className='input-group-btn'>
                  <button className='btn btn-primary' type='button' onClick={() => this.handleAdd($('#newInf').val())}>add</button>
                </span>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-12'>
              {infListView}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
ExdefDetailsEditInf.propTypes = {
  inf: PropTypes.array,
  update: PropTypes.func,
  add: PropTypes.func,
  remove: PropTypes.func
}

class ExdefDetailsEditInfItem extends Component {
  constructor () {
    super()
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
  }
  handleUpdate (event) {
    this.props.update(event.target.value, event.target.name)
  }
  handleRemove (event) {
    this.props.remove(event.target.name)
  }
  render () {
    return (
      <div className='input-group'>
        <input type='text' className='form-control' value={this.props.inf} name={this.props.index} onChange={this.handleUpdate}/>
        <span className='input-group-btn'>
          <button className='btn btn-danger' type='button' name={this.props.index} onClick={this.handleRemove}>remove</button>
        </span>
      </div>
    )
  }
}
ExdefDetailsEditInfItem.propTypes = {
  inf: PropTypes.string,
  index: PropTypes.number,
  update: PropTypes.func,
  remove: PropTypes.func
}
