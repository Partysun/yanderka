import React, { Component } from 'react';
import { branch } from 'baobab-react/higher-order';   
import signals from './signals.js';

const alertVisibleTime = 3000;

class Alertbox extends Component {

  constructor() {
    super();
    this.state = { seconds: 3 };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  startTimer() {
    console.log(this.timer);
    if (this.timer === 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    let seconds = this.state.seconds - 1;
    this.setState({
      seconds: seconds,
    });
    
    if (seconds === 0) { 
      clearInterval(this.timer);
      this.timer = 0;
      this.setState({seconds: 3})
    }
  }

  componentWillMount() {
    signals.emit('alertbox:watch')
  }

  componentWillUnmount() {
    signals.emit('alertbox:off')
  }

  componentWillReceiveProps(nextProps) {
    const donate = nextProps.donate;
    if (donate && donate.key) {
      this.startTimer();
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
      <div>{donate.nickname} donate {donate.amount}
        <br />
        {this.state.seconds} 
      </div>
    )
  }
}

export default branch({                                                                  
  donate: ['donations', 'alertItems', 0],
}, Alertbox);  
