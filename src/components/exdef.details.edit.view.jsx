'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {ipcRenderer} from 'electron'

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
      _id: '',
      type: '',
      kind: '',
      inf: [],
      id_rules:'',
      mu:[]
    }
    this.updateType = this.updateType.bind(this)
    this.updateKind = this.updateKind.bind(this)
    this.updateInfItem = this.updateInfItem.bind(this)
    this.removeInfItem = this.removeInfItem.bind(this)
    this.addInfItem = this.addInfItem.bind(this)
    this.updateMUItem = this.updateMUItem.bind(this)
    this.removeMUItem = this.removeMUItem.bind(this)
    this.addMUItem = this.addMUItem.bind(this)
    this.updateIdRules = this.updateIdRules.bind(this)
    this.validateMUID = this.validateMUID.bind(this)
    this.saveExdef = this.saveExdef.bind(this)
  }
  componentWillMount () {
    this.setState({_id: this.props.exdef._id})
    this.setState({type: this.props.exdef.type})
    this.setState({kind: this.props.exdef.kind})
    this.setState({inf: this.props.exdef.inf.slice()})
    this.setState({id_rules: this.props.exdef.id_rules})
    this.setState({mu: this.props.exdef.mu.slice()})
  }
  updateType (newType) {
    this.setState({type: newType})
  }
  updateKind (newKind) {
    this.setState({kind: newKind})
  }
  updateInfItem (updatedItem, index) {
    let updatedInf = this.state.inf.slice()
    updatedInf.splice(index, 1, updatedItem)
    this.setState({inf: updatedInf})
  }
  removeInfItem (index) {
    let updatedInf = this.state.inf.slice()
    updatedInf.splice(index, 1)
    this.setState({inf: updatedInf})
  }
  addInfItem (newItem) {
    this.setState({inf: this.state.inf.concat(newItem)})
  }
  updateMUItem (updatedItem, index) {
    let updatedMU = this.state.mu.slice()
    updatedMU.splice(index, 1, updatedItem)
    this.setState({mu: updatedMU})
  }
  removeMUItem (index) {
    let updatedMU = this.state.mu.slice()
    updatedMU.splice(index, 1)
    this.setState({mu: updatedMU})
  }
  addMUItem (newItem) {
    this.setState({mu: this.state.mu.concat(newItem)})
  }
  updateIdRules (newValue) {
    this.setState({id_rules: newValue})
  }
  validateMUID (muID) {
    let index = this.state.mu.map((e) => e.muID).indexOf(muID)
    return index === -1 ? true : false
  }
  saveExdef () {
    let udpatedExdef = {
      _id: this.state._id,
      type: this.state.type,
      kind: this.state.kind,
      inf: this.state.inf.slice(),
      id_rules: this.state.id_rules,
      mu: this.state.mu.slice()
    }
    this.props.save(udpatedExdef)
  }
  render () {
    return (
      <div className='row'>
        <div className='col-md-12'>
          <div className='row'>
            <div className='col-md-12'>
              <button className='btn btn-primary btn-lg pull-right' onClick={this.saveExdef}>Save</button>
            </div>
          </div>
          <ExdefDetailsEditTypeAndKind type={this.state.type} kind={this.state.kind} updateType={this.updateType} updateKind={this.updateKind}/>
          <ExdefDetailsEditInf list={this.state.inf} update={this.updateInfItem} add={this.addInfItem} remove={this.removeInfItem}/>
          <ExdefDetailsEditIdRules id_rules={this.state.id_rules} update={this.updateIdRules}/>
          <ExdefDetailsEditMU muList={this.state.mu} update={this.updateMUItem} add={this.addMUItem} remove={this.removeMUItem} validateMUID={this.validateMUID}/>
        </div>
      </div>
    )
  }
}
ExdefDetailsEdit.propTypes = {
  exdef: PropTypes.object,
  save: PropTypes.func
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
    this.props.add($('#new-inf').val())
    $('#new-inf').val('')
  }
  render () {
    let infListView
    let infListItemView = []
    this.props.list.forEach((anItem, index) => infListItemView.push(<ExdefDetailsEditInfItem item={anItem} key={index} index={index} update={this.props.update} remove={this.props.remove} />))
    if (this.props.list.lenght > 5) infListView = <div style={getOverflowYStyle('220px')}>{infListItemView}</div>
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
                <input type='text' id='new-inf' className='form-control' defaultValue='' />
                <span className='input-group-btn'>
                  <button className='btn btn-primary' type='button' onClick={this.handleAdd}>add</button>
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
  list: PropTypes.array,
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
        <input type='text' className='form-control' value={this.props.item} name={this.props.index} onChange={this.handleUpdate}/>
        <span className='input-group-btn'>
          <button className='btn btn-danger' type='button' name={this.props.index} onClick={this.handleRemove}>remove</button>
        </span>
      </div>
    )
  }
}
ExdefDetailsEditInfItem.propTypes = {
  item: PropTypes.string,
  index: PropTypes.number,
  update: PropTypes.func,
  remove: PropTypes.func
}

class ExdefDetailsEditMU extends Component {
  constructor () {
    super()
    this.validateID = this.validateID.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
  }
  validateID (event) {
    let isValid = this.props.validateMUID(event.target.value)
    if (isValid) {
      isValid = ipcRenderer.sendSync('validate-muID', event.target.value)
    }
    let currentClassName = document.getElementById('mu-new-id').className
    if (isValid) {
      let index = currentClassName.indexOf(' errorInput')
      if (index !== -1) {
        document.getElementById('mu-new-id').className = currentClassName.substring(0, index)
      }
      document.getElementById('add-mu-btn').disabled = false
    } else {
      document.getElementById('mu-new-id').className = currentClassName + ' errorInput'
      document.getElementById('add-mu-btn').disabled = true
    }
  }
  handleAdd () {
    let newMu = {
      muID: $('#mu-new-id').val(),
      desc: $('#mu-new-desc').val()
    }
    $('#mu-new-id').val('')
    $('#mu-new-desc').val('')
    this.props.add(newMu)
  }
  render () {
    let muListView
    let muListItemView = []
    this.props.muList.forEach((mu, index) => muListItemView.push(<ExdefDetailsEditMUItem key={index} mu={mu} index={index} update={this.props.update} remove={this.props.remove}/>))
    if (this.props.muList.length > 5) muListView = <div style={getOverflowYStyle('220px')}>{muListItemView}</div>
    else muListView = <div>{muListItemView}</div>
    return (
      <div>
        <div className='row'>
          <div className='col-md-12'>
            <h3>Monitoring Units</h3>
          </div>
        </div>
        <div className='row' id='mu-new'>
          <form className='form-horizontal col-md-10'>
            <div className='form-group'>
              <label for='mu-new-id' className='col-md-2 control-label'>ID</label>
              <div className='col-md-10'>
                <input type='text' className='form-control' id='mu-new-id' onChange={this.validateID} />
              </div>
            </div>
            <div className='form-group'>
              <label for='mu-new-desc' className='col-md-2 control-label'>Description</label>
              <div className='col-md-10'>
                <input type='text' className='form-control' id='mu-new-desc' defaultValue='' />
              </div>
            </div>
          </form>
          <div className='col-md-2' id='mu-new-add-btn'>
            <button type='button' className='btn btn-primary btn-lg btn-block' id='add-mu-btn' onClick={this.handleAdd}>add</button>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            {muListView}
          </div>
        </div>
      </div>
    )
  }
}
ExdefDetailsEditMU.propTypes = {
  muList: PropTypes.array,
  add: PropTypes.func,
  update: PropTypes.func,
  remove: PropTypes.func,
  validateMUID: PropTypes.func
}

class ExdefDetailsEditMUItem extends Component {
  constructor () {
    super()
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
  }
  handleUpdate (event) {
    let updatedMU = {
      muID: this.props.mu.muID,
      desc: event.target.value
    }
    this.props.update(updatedMU, event.target.name)
  }
  handleRemove (event) {
    this.props.remove(event.target.name)
  }
  render () {
    return (
      <div className='input-group'>
        <span className='input-group-addon'>{this.props.mu.muID}</span>
        <input type='text' className='form-control' value={this.props.mu.desc} name={this.props.index} onChange={this.handleUpdate}/>
        <span className='input-group-btn'>
          <button className='btn btn-danger' type='button' name={this.props.index} onClick={this.handleRemove}>remove</button>
        </span>
      </div>
    )
  }
}
ExdefDetailsEditMUItem.propTypes = {
  mu: PropTypes.object,
  index: PropTypes.number,
  update: PropTypes.func,
  remove: PropTypes.func
}

class ExdefDetailsEditIdRules extends Component {
  constructor () {
    super()
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange (event) {
    this.props.update(event.target.value)
  }
  render () {
    return (
      <div className='row'>
        <div className='col-md-12'>
          <h3>Identification Rules</h3>
          <textarea id='idRulesValue' className='form-control' rows='5' value={this.props.id_rules} onChange={this.handleChange} />
        </div>
      </div>
    )
  }
}
ExdefDetailsEditIdRules.propTypes = {
  id_rules: PropTypes.string,
  update: PropTypes.func
}
