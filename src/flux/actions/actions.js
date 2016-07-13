import {init as uiActions} from './actions.ui'
import {init as listActions} from './actions.list'
import {init as exdefActions} from './actions.exdef'
import {init as muActions} from './actions.mu'


export default function initializeActions (dispatcher) {
  uiActions(dispatcher)
  listActions(dispatcher)
  exdefActions(dispatcher)
  muActions(dispatcher)
}
