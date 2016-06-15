export default {
  exdef: {
    type: {isMandatory: true, type: 'string'},
    kind: {isMandatory: true, type: ['EComponent', 'EConnector', 'EPort']},
    inf: {isMandatory: true, type: 'array', item: 'string'},
    mu: {isMandatory: false, type: 'array',
      item: {
        muID: {isMandatory: true, type: 'string'},
        desc: {isMandatory: true, type: 'string'}
      }},
    id_rules: {isMandatory: false, type: 'string'},
    id_rules_html: {isMandatory: false, type: 'string'}
  },
  dr: {
    inf: {isMandatory: true, type: 'string'},
    sink: {isMandatory: true, type: 'string'},
    source: {isMandatory: true, type: 'string'},
    rkind: {isMandatory: true, type: 'string'}
  },
  er: {
    muID: {isMandatory: true, type: 'string'},
    meta: {isMandatory: true, type: 'object'},
    values: {isMandatory: false, type: 'object'}
  },
  elems: {
    elemID: {isMandatory: true, type: 'string'},
    type: {isMandatory: true, type: 'string'},
    kind: {isMandatory: true, type: ['EComponent', 'EConnector', 'EPort']}
  }
}
