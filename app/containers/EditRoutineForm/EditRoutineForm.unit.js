import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import td from 'testdouble'
import configureMockStore  from 'redux-mock-store'
import merge from 'lodash/merge'

import RoutineForm from 'components/RoutineForm'

describe('CONTAINER: EditRoutineForm', () => {
  let EditRoutineForm
  const getMockStore = configureMockStore()
  const createInstance = (passedProps) => {
    const initialState = { routines: [] }
    const mockStore = getMockStore(initialState)
    const requiredProps = {
      store: mockStore,
      history: { push: () => {} },
      match: {
        params: {
          id: 'xyz',
        },
      },
    }

    const finalProps = passedProps
      ? merge({}, requiredProps, passedProps)
      : requiredProps

    return shallow(
      <MemoryRouter>
        <EditRoutineForm {...finalProps} />
      </MemoryRouter>
    )
      .find(EditRoutineForm)
  }

  beforeEach(() => {
    EditRoutineForm = require('./EditRoutineForm').default
  })

  afterEach(() => { td.reset() })

  it('should render <RoutineForm /> inside the HOC', () => {
    const wrapper = createInstance()
    expect(wrapper.dive()).to.match(RoutineForm)
  })

  describe('the rendered <RoutineForm />', () => {
    context('when route id matches a routine in state', () => {
      it('should pass the data of matched routine as initialValues prop to its wrapped component', () => {
        const mockRoutine = {
          id: '123',
          restOfRoutineData: 'restOfRoutineData',
        }

        const initialState = {
          routines: [mockRoutine]
        }

        const wrapper = createInstance({
          store: getMockStore(initialState),
          match: {
            params: {
              id: mockRoutine.id,
            },
          },
        })

        const wrappedComponent = wrapper.dive()

        expect(wrappedComponent).to.have.prop('initialValues', mockRoutine)
      })

      it('should receive a handleSubmit() prop', () => {
        const wrappedComponent = createInstance().dive()
        expect(wrappedComponent.prop('handleSubmit')).to.be.a('function')
      })

      describe('the passed handleSubmit() prop', () => {
        it('should dispatch the action created by calling editRoutine() with handleSubmit()\'s argument', () => {
          const initialState = { routines: [] }
          const mockStore = getMockStore(initialState)
          const dispatch = td.replace(mockStore, 'dispatch')

          const editRoutineArg = 'editRoutineArg'
          const editRoutineRes = 'editRoutineRes'
          const editRoutine = td.function()
          td.replace('duck/actions', { editRoutine })
          td.when(editRoutine(editRoutineArg)).thenReturn(editRoutineRes)

          EditRoutineForm = require('./EditRoutineForm').default

          const wrapper = createInstance({ store: mockStore })
          const wrappedComponent = wrapper.dive()

          td.verify(dispatch(), { times: 0, ignoreExtraArgs: true })
          wrappedComponent.prop('handleSubmit')(editRoutineArg)

          td.verify(dispatch(editRoutineRes), { times: 1 })
        })

        /* context('when duration of the routine being edited has changed', () => {
          context('when the routine being edited is tracking', () => {
            it.skip('should dispatch the action created by calling stopTracker()', () => {
              const initialState = { routines: [] }
              const mockStore = getMockStore(initialState)
              const dispatch = td.replace(mockStore, 'dispatch')

              const stopTrackerRes = 'stopTrackerRes'
              const stopTracker = td.function()
              const editRoutineRes = 'editRoutineRes'
              td.replace('duck/actions', {
                editRoutine: () => 'editRoutineRes',
                resetTracker: () => {},
                stopTracker,
              })
              td.when(stopTracker()).thenReturn(stopTrackerRes)

              EditRoutineForm = require('./EditRoutineForm').default

              const wrapper = createInstance({ store: mockStore })
              const wrappedComponent = wrapper.dive()
              const argWhereIsTrackingIsTrue = { id: '123', isTracking: true }
              const argWhereIsTrackingIsNotTrue = { id: '123' }

              td.verify(dispatch(), { times: 0, ignoreExtraArgs: true })
              wrappedComponent.prop('handleSubmit')(argWhereIsTrackingIsNotTrue)

              // dispatch should only be called with editRoutine action at this point
              td.verify(dispatch(), { times: 1, ignoreExtraArgs: true })
              td.verify(dispatch(editRoutineRes), { times: 1, ignoreExtraArgs: true })

              wrappedComponent.prop('handleSubmit')(argWhereIsTrackingIsTrue)

              // dispatch call should sum up to 3 at this point
              td.verify(dispatch(), { times: 3, ignoreExtraArgs: true })
              // dispatch call with editRoutine action should be 2
              td.verify(dispatch(editRoutineRes), { times: 2, ignoreExtraArgs: true })
              // dispatch call with stopTracker action should be 1
              td.verify(dispatch(stopTrackerRes), { times: 1 })
            })
          })

          it.skip('should dispatch the action created by calling resetTracker() with handleSubmit()\'s firstArgument.id', () => {
            const initialState = { routines: [] }
            const mockStore = getMockStore(initialState)
            const dispatch = td.replace(mockStore, 'dispatch')

            const resetTrackerArg = 'resetTrackerArg'
            const resetTrackerRes = 'resetTrackerRes'
            const resetTracker = td.function()
            td.replace('duck/actions', {
              editRoutine: () => {},
              stopTracker: () => {},
              resetTracker,
            })
            td.when(resetTracker(resetTrackerArg)).thenReturn(resetTrackerRes)

            EditRoutineForm = require('./EditRoutineForm').default

            const wrapper = createInstance({ store: mockStore })
            const wrappedComponent = wrapper.dive()
            const firstHandleSubmitArg = { id: resetTrackerArg }


            td.verify(dispatch(), { times: 0, ignoreExtraArgs: true })
            wrappedComponent.prop('handleSubmit')(firstHandleSubmitArg)
            td.verify(dispatch(resetTrackerRes), { times: 0 })
            wrappedComponent.prop('handleSubmit')(firstHandleSubmitArg, true)
            td.verify(dispatch(resetTrackerRes), { times: 1 })
          })
        }) */

        it('should redirect to path \'/\' after calling the dispatch', () => {
          const push = td.function()
          const wrapper = createInstance({
            history: { push },
          })

          const wrappedComponent = wrapper.dive()
          const handleSubmitArg = {}

          td.verify(push(), { times: 0, ignoreExtraArgs: true })
          wrappedComponent.prop('handleSubmit')(handleSubmitArg)

          td.verify(push('/'), { times: 1 })
        })
      })

      it('should receive a handleDelete() prop', () => {
        const wrappedComponent = createInstance().dive()
        expect(wrappedComponent.prop('handleDelete')).to.be.a('function')
      })

      describe('the passed handleDelete() prop', () => {
        it('should dispatch the action created by calling deleteRoutine() with handleDelete()\'s argument', () => {
          const initialState = { routines: [] }
          const mockStore = getMockStore(initialState)
          const dispatch = td.replace(mockStore, 'dispatch')

          const deleteRoutineArg = 'deleteRoutineArg'
          const deleteRoutineRes = 'deleteRoutineRes'
          const deleteRoutine = td.function()
          td.replace('duck/actions', { deleteRoutine })
          td.when(deleteRoutine(deleteRoutineArg)).thenReturn(deleteRoutineRes)

          EditRoutineForm = require('./EditRoutineForm').default

          const wrapper = createInstance({
            store: mockStore,
          })

          const wrappedComponent = wrapper.dive()
          td.verify(dispatch(), { times: 0, ignoreExtraArgs: true })
          wrappedComponent.prop('handleDelete')(deleteRoutineArg)

          td.verify(dispatch(deleteRoutineRes), { times: 1 })
        })

        it('should redirect to path \'/\' after calling the dispatch', () => {
          const push = td.function()
          const wrapper = createInstance({
            history: { push },
          })

          const wrappedComponent = wrapper.dive()

          td.verify(push(), { times: 0, ignoreExtraArgs: true })
          wrappedComponent.prop('handleDelete')()

          td.verify(push('/'), { times: 1 })
        })
      })
    })

    context('when route id does not match any routine', () => {
      it('should receive true as notFound prop', () => {
        const initialState = {
          routines: []
        }

        const wrapper = createInstance({
          store: getMockStore(initialState),
          match: {
            params: {
              id: '123',
            },
          },
        })

        const wrappedComponent = wrapper.dive()

        expect(wrappedComponent).to.have.prop('notFound', true)
      })
    })
  })
})
