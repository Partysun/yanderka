import React from 'react';
import { Redirect } from 'react-router-dom';
import signals from './signals.js';

class StreamlabsOauth extends React.Component {

  componentDidMount() {
    const { location } = this.props;
    signals.emit('user:connect:streamlabs:saveToken', location.search);
  }

  render() {
    return (                                                                              
      <Redirect to='/dashboard/settings' />                                                              
    )
  }
}

export default StreamlabsOauth;
