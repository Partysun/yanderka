import React, { Component } from 'react';
import axios from 'axios';

class Donation extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      account: null,
    }
  }

  componentDidMount() {
    const url = 'https://us-central1-yanderka-f39f7.cloudfunctions.net/yaaccount/'
      + this.props.match.params.user;
    axios.get(url,
    {
      headers: { 
        'Content-Type':  'application/json',
        'Accept':        'application/json',
      },
    })
    .then((response) => {
      this.setState({account: response.data.account});
    })
    .catch((error) => {
      console.log(error);
    });
  }

  render() {
    const match = this.props.match;
    return (
      <div>Donation Page
        {this.state.account ?
        <form method="POST" action="https://money.yandex.ru/quickpay/confirm.xml"> 
          <input type="hidden" name="receiver" value={this.state.account} /> 
            <input type="hidden" name="formcomment" value="Проект «Железный человек»: реактор холодного ядерного синтеза" /> 
            <input type="hidden" name="short-dest" value="Проект «Железный человек»: реактор холодного ядерного синтеза" /> 
            <input type="hidden" name="label" value="donate" /> 
            <input type="hidden" name="quickpay-form" value="donate" /> 
            <input type="hidden" name="targets" value="Донат" /> 
            <input name="sum" value="10" data-type="number" /> 
            <input name="comment" value="Спасибо" /> 
            <input type="hidden" name="need-name" value="true" /> 
            <input type="hidden" name="need-email" value="true" /> 
            <input type="hidden" name="need-phone" value="false" /> 
            <input type="hidden" name="need-address" value="false" /> 
            <label><input type="radio" name="paymentType" value="PC" />Яндекс.Деньгами</label> 
            <label>
              <input type="radio" name="paymentType" value="AC" />Банковской картой
            </label> 
            <input type="submit" value="перевести" /> 
        </form> : 'Загрузка...' 
        }
      </div>
    )
  }
}

export default Donation;
