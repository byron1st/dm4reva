export default {
  exdef: {
    type: {isMandatory: true, type: 'string'},
    kind: {isMandatory: true, type: ['EComponent', 'EConnector', 'EPort']},
    inf: {isMandatory: false, type: 'array', item: 'string'},
    mu: {isMandatory: false, type: 'array',
      item: {
        muID: {isMandatory: true, type: 'string'},
        desc: {isMandatory: true, type: 'string'}
      }},
    id_rules: {isMandatory: false, type: 'string'},
    id_rules_html: {isMandatory: false, type: 'string'}
  },
  dr: {},
  er: {},
  elems: {}
}
