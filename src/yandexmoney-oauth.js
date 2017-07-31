import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { branch } from 'baobab-react/higher-order';
import signals from './signals.js';

class YamoneyOAuth extends Component {

  componentDidMount() {
    const { location } = this.props;
    signals.emit('yamoney:connect:saveToken', location.search);
  }

  render() {
    return (
      <Redirect to='/dashboard/settings' />
    );

    //return (
      //<div style={{color: 'white'}}>
        //<h2>
          //Настраиваем Yandex Money...
        //</h2>
      //</div>
    //)
  }
}

export default branch({
  tokenSaved: ['app', 'ui', 'yamoney', 'tokenSaved'],
}, YamoneyOAuth);
