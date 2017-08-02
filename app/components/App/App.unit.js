import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import {
  BrowserRouter,
  Route,
  Switch,
} from 'react-router-dom'

import HomePage from 'components/HomePage'
import NotFound from 'components/NotFound'
import AddNewRoutineForm from 'containers/AddNewRoutineForm'
import EditRoutineForm from 'containers/EditRoutineForm'
import DoneRoutinesNotifier from 'containers/DoneRoutinesNotifier'

import App from './App'

describe('COMPONENT: App', () => {
  it('should render without crashing', () => {
    const wrapper = shallow(<App />)
    expect(wrapper).to.be.present()
  })

  it('should have <BrowserRouter /> as root component', () => {
    const wrapper = shallow(<App />)
    expect(wrapper).to.match(BrowserRouter)
  })

  it('should render the correct routes', () => {
    const wrapper = shallow(<App />)
    expect(wrapper).to.containMatchingElement((
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route path='/routines/new' component={AddNewRoutineForm} />
        <Route path='/routines/:id' component={EditRoutineForm} />
        <Route path='*' component={NotFound} />
      </Switch>
    ))
  })

  it('should render one <DoneRoutinesNotifier />', () => {
    const wrapper = shallow(<App />)
    expect(wrapper).to.have.exactly(1).descendants(DoneRoutinesNotifier)
  })
})
