import {init as uiActions} from './actions.ui'
import {init as listActions} from './actions.list'
import {init as exdefActions} from './actions.exdef'


export default function initializeActions (dispatcher) {
  uiActions(dispatcher)
  listActions(dispatcher)
  exdefActions(dispatcher)
}
