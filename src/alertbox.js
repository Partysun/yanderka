import React, { Component } from 'react';
import { branch } from 'baobab-react/higher-order';   
import signals from './signals.js';

const alertVisibleTime = 3000;

class Alertbox extends Component {

  componentWillMount() {
    signals.emit('alertbox:watch')
  }

  componentWillUnmount() {
    signals.emit('alertbox:off')
  }

  componentWillUpdate(nextProps, nextState) {
    const donate = nextProps.donate;
    if (donate && donate.key) {
      setTimeout(() => {
        signals.emit('alertbox:toggleDonation', donate.key);
      }, alertVisibleTime);
    }
  }

  render() {
    const { donate } = this.props;
    if (!donate) {
      return <div></div>
    }
    return (
      <div>{donate.nickname} donate {donate.amount}</div>
    )
  }
}

export default branch({                                                                  
  donate: ['app', 'lastDonation']
}, Alertbox);  
