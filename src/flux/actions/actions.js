import {init as uiActions} from './actions.ui'
import {init as listActions} from './actions.list'


export default function initializeActions (dispatcher) {
  uiActions(dispatcher)
  listActions(dispatcher)
}
