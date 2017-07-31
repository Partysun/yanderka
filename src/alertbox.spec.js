import React from 'react';
import { mount, shallow } from 'enzyme';
import { root } from 'baobab-react/higher-order';                                           
import {expect} from 'chai';
import Alertbox from './alertbox.js';
import tree, { seed } from './state.js';

describe('Alertbox', () => {

  let wrapper;

  beforeEach(() => {
    tree.set(seed);
    tree.set('donations', {
      alertItems: [
        {
          nickname: 'Tyra',
          amount: 100
        },
        {
          nickname: 'Asjy',
          amount: 120 
        }
      ]
    })
    const BranchedAlertbox = root(tree, Alertbox);
    wrapper = mount(<BranchedAlertbox />);
  });

  it('should render without crashing', () => {
    expect(wrapper).to.have.length(1);
    console.log(wrapper.find('.alertbox').debug());
  });

});
