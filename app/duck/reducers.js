import moment from 'moment'
import id from 'shortid'
import merge from 'lodash/merge'
import { combineReducers } from 'redux'

import * as actionTypes from './actionTypes'

moment('00:15:00', 'HH:mm:ss')

const initialRoutinesState = [{
  id: id.generate(),
  routineName: 'Jog',
  duration: moment('00:00:03', 'HH:mm:ss'),
  reminder: moment('4:00 am', 'h:mm a'),
}, {
  id: id.generate(),
  routineName: 'pneumonoultramicroscopicsilicovolcanoconiosis',
  duration: moment('08:00:00', 'HH:mm:ss'),
}]

const routines = (state = initialRoutinesState, { type, payload }) => {
  switch (type) {
    case actionTypes.ADD_ROUTINE:
      return [
        merge({ id: id.generate() }, payload),
        ...state,
      ]

    case actionTypes.EDIT_ROUTINE:
      return state.map(routineObj => {
        if (routineObj.id === payload.id) {
          if (payload.duration && routineObj.duration) {
            const newDuration = payload.duration
            const oldDuration = routineObj.duration
            const newDurationFormatted = newDuration.format(newDuration.creationData().format)
            const oldDurationFormatted = oldDuration.format(oldDuration.creationData().format)

            if (newDurationFormatted !== oldDurationFormatted) {
              const updatedRoutine = Object.assign(
                {},
                routineObj,
                payload,
                {
                  isTracking: false,
                }
              )

              delete updatedRoutine.timeLeft

              return updatedRoutine
            }
          }

          return Object.assign({}, routineObj, payload)
        }

        return routineObj
      })

    case actionTypes.DELETE_ROUTINE:
      return state.filter(routineObj => routineObj.id !== payload.id)

    case actionTypes.START_TRACKER:
      return state.map(routineObj => {
        if (routineObj.id === payload.id) {
          if (!routineObj.isTracking)
            return Object.assign(
              {},
              routineObj,
              { isTracking: true }
            )
        } else if (routineObj.isTracking) {
          return Object.assign(
            {},
            routineObj,
            { isTracking: false }
          )
        } else {
          return routineObj
        }
      })

    case actionTypes.TICK_TRACKER:
      return state.map(routineObj => {
        if (routineObj.isTracking) {
          const { timeLeft, duration } = routineObj
          const timeToSubtract = timeLeft || duration
          return Object.assign(
            {},
            routineObj,
            {
              timeLeft: moment(timeToSubtract).subtract('100', 'milliseconds')
            }
          )
        } else {
          return routineObj
        }
      })

    case actionTypes.STOP_TRACKER:
      return state.map(routineObj => {
        if (routineObj.isTracking)
          return Object.assign(
            {},
            routineObj,
            { isTracking: false }
          )
        else
          return routineObj
      })

    case actionTypes.RESET_TRACKER:
      return state.map(routineObj => {
        if (routineObj.id === payload.id)
          return Object.assign(
            {},
            routineObj,
            {
              timeLeft: routineObj.duration.clone(),
              isTracking: false,
            }
          )
        else
          return routineObj
      })

    default:
      return state
  }
}

const rootReducer = combineReducers({ routines })
// const getRoutine = (state, id) => state.find(routine => routine.id === id)


export default rootReducer
export {
  routines
  // getRoutine
}
