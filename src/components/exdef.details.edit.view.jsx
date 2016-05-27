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
      _id: '',
      type: '',
      kind: '',
      inf: [],
      id_rules:'',
      rid:[]
    }
    this.updateType = this.updateType.bind(this)
    this.updateKind = this.updateKind.bind(this)
    this.updateListItem = this.updateListItem.bind(this)
    this.removeListItem = this.removeListItem.bind(this)
    this.addListItem = this.addListItem.bind(this)
    this.updateIdRules = this.updateIdRules.bind(this)
    this.saveExdef = this.saveExdef.bind(this)
  }
  componentWillMount () {
    this.setState({_id: this.props.exdef._id})
    this.setState({type: this.props.exdef.type})
    this.setState({kind: this.props.exdef.kind})
    this.setState({inf: this.props.exdef.inf.slice()})
    this.setState({id_rules: this.props.exdef.id_rules})
    this.setState({rid: this.props.exdef.rid.slice()})
  }
  updateType (newType) {
    this.setState({type: newType})
  }
  updateKind (newKind) {
    this.setState({kind: newKind})
  }
  updateListItem (listKind, updatedItem, index) {
    switch (listKind) {
      case 'inf':
        let updatedInf = this.state.inf.slice()
        updatedInf.splice(index, 1, updatedItem)
        this.setState({inf: updatedInf})
        break
      case 'rid':
        let updatedRid = this.state.rid.slice()
        updatedRid.splice(index, 1, updatedItem)
        this.setState({rid: updatedRid})
        break
    }
  }
  removeListItem (listKind, index) {
    switch (listKind) {
      case 'inf':
        let updatedInf = this.state.inf.slice()
        updatedInf.splice(index, 1)
        this.setState({inf: updatedInf})
        break
      case 'rid':
        let updatedRid = this.state.rid.slice()
        updatedRid.splice(index, 1)
        this.setState({rid: updatedRid})
        break
    }

  }
  addListItem (listKind, newItem) {
    switch (listKind) {
      case 'inf':
        this.setState({inf: this.state.inf.concat(newItem)})
        break
      case 'rid':
        this.setState({rid: this.state.rid.concat(newItem)})
        break
    }

  }
  updateIdRules (newValue) {
    this.setState({id_rules: newValue})
  }
  saveExdef () {
    let udpatedExdef = {
      _id: this.state._id,
      type: this.state.type,
      kind: this.state.kind,
      inf: this.state.inf.slice(),
      id_rules: this.state.id_rules,
      rid: this.state.rid.slice()
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
          <ExdefDetailsEditList listKind='inf' list={this.state.inf} update={this.updateListItem} add={this.addListItem} remove={this.removeListItem}/>
          <ExdefDetailsEditIdRules id_rules={this.state.id_rules} update={this.updateIdRules}/>
          <ExdefDetailsEditList listKind='rid' list={this.state.rid} update={this.updateListItem} add={this.addListItem} remove={this.removeListItem}/>
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

class ExdefDetailsEditList extends Component {
  constructor () {
    super()
    this.handleAdd = this.handleAdd.bind(this)
  }
  handleAdd(newInf) {
    this.props.add(this.props.listKind, $('#' + this.props.listKind).val())
    $('#' + this.props.listKind).val('')
  }
  render () {
    let infListView
    let infListItemView = []
    this.props.list.forEach((anItem, index) => infListItemView.push(<ExdefDetailsEditListItem listKind={this.props.listKind} item={anItem} key={index} index={index} update={this.props.update} remove={this.props.remove} />))
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
                <input type='text' id={this.props.listKind} className='form-control' defaultValue='' />
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
ExdefDetailsEditList.propTypes = {
  listKind: PropTypes.string,
  list: PropTypes.array,
  update: PropTypes.func,
  add: PropTypes.func,
  remove: PropTypes.func
}

class ExdefDetailsEditListItem extends Component {
  constructor () {
    super()
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
  }
  handleUpdate (event) {
    this.props.update(this.props.listKind, event.target.value, event.target.name)
  }
  handleRemove (event) {
    this.props.remove(this.props.listKind, event.target.name)
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
ExdefDetailsEditListItem.propTypes = {
  listKind: PropTypes.string,
  item: PropTypes.string,
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
