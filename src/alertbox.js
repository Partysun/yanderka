import React, { Component } from 'react';
import { branch } from 'baobab-react/higher-order';   
import signals from './signals.js';
import 'font-awesome/css/font-awesome.css';
import './alertbox.css';

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
      this.setState({seconds: alertVisibleTime / 1000})
    }
  }

  componentWillMount() {
    signals.emit('alertbox:watch', this.props.match.params.token);
  }

  componentWillUnmount() {
    signals.emit('alertbox:off');
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
    const isChrome = !!window.chrome && !!window.chrome.webstore;
    const { donate } = this.props;
    const classAlertbox = `alertbox ${isChrome && 'tested'}`;
    if (!donate) {
      return <div className={classAlertbox}></div>
    }
    return (
      <div className={classAlertbox}>
        <div className='alertbox-inner'>
          <span className='alertbox-nickname'>
            {donate.nickname}
          </span> 
          <span className='alertbox-action'>
            дарит 
          </span> 
          <span className='alertbox-amount'>
            {donate.amount}
          </span>
          <i className='fa fa-rub' aria-hidden='true' />
          <br />
          {this.state.seconds} 
        </div>
      </div>
    )
  }
}

export default branch({                                                                  
  donate: ['donations', 'alertItems', 0],
}, Alertbox);  
