import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import tree, { seed } from './state.js';
import { root } from 'baobab-react/higher-order';                                           
import { BrowserRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';
import DonationsList from './stats/donations-list.js';

it('renders without crashing', () => {
  const RootedApp = root(tree, App);
  tree.set(seed);
  tree.set('donations', {
    items: {
      sdfasdf: {
        nickname: 'Tyra'
      },
      adfasdf: {
        nickname: 'Asjy'
      }
    }
  })
  const wrapper = mount(
    <Router>
      <RootedApp />
    </Router>);
  //console.log(wrapper.debug());
  const donations = tree.get('donations');
  expect(wrapper.contains(<DonationsList donations={donations} />)).toEqual(true);
});

it('should not render DonationsList with zero donations data', () => {
  const RootedApp = root(tree, App);
  tree.set(seed);
  tree.set('donations', { loading: false, items: {} });
  const wrapper = mount(
    <Router>
      <RootedApp />
    </Router>);
  const donations = tree.get('donations');
  expect(Object.keys(donations.items).length == 0).toEqual(true);
  expect(wrapper.contains(<DonationsList donations={donations} />)).toEqual(false);
  expect(wrapper.find('.welcome-message').length).toEqual(1);
});
