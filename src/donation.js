import React, { Component } from 'react';
import axios from 'axios';
import TextareaAutosize from 'react-textarea-autosize';
import './donation.css';

const baseUrl = 'https://us-central1-yanderka-f39f7.cloudfunctions.net/';
const maxChars = 300;

class Donation extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      account: null,
      paymentId: null,
      nickname: {
        value: '',
        touched: false,
        focused: false
      },
      comment: {
        value: '',
        touched: false,
        focused: false,
        charsLeft: maxChars,
      },
      paymentType: {
        value: 'AC',
        touched: false,
        focused: false
      },
      sum: {
        value: 50,
        touched: false,
        focused: false
      },
      dirty: false,
    }

    this.onChange = this.onChange.bind(this);
    this.onChangeComment = this.onChangeComment.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  componentDidMount() {
    axios.get(`${baseUrl}yaaccount/${this.props.match.params.user}`)
    .then((response) => {
      this.setState({account: response.data.account});
    })
    .catch((error) => {
      console.log(error);
    });
  }

  onChange(event) {
    const field = this.state[`${event.target.name}`];
    field.value = event.target.value;
    field.touched = true;
    field.focused = true;
    this.setState({[`${event.target.name}`]: field, dirty: true});
  }

  onChangeComment(event) {
    const field = this.state.comment;
    field.value = event.target.value;
    field.touched = true;
    field.focused = true;
    field.charsLeft = maxChars - event.target.value.length;
    this.setState({
      comment: field,
      dirty: true
    });
  }

  onSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.state.dirty) {
     this.refs.nickname.focus();
    } else {
      axios.post(`${baseUrl}makeDonation/`,
      {
        uid: this.props.match.params.user,
        nickname: this.state.nickname.value,
        comment: this.state.comment.value
      },
      {
        headers: { 
          'Content-Type':  'application/json',
          'Accept':        'application/json',
        },
      })
      .then((response) => {
        this.setState({paymentId: response.data.id});
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }

  onBlur(event) {
    const field = this.state[`${event.target.name}`];
    field.focused = false;
    this.setState({[`${event.target.name}`]: field});
  }

  render() {
    const {nickname, comment} = this.state;

    if (!this.state.account) {
      return (
        <div>Загрузка</div>
      ) 
    }

    const isNicknameValid = nickname.touched
      && nickname.value.length > 2;

    const isCommentValid = comment.charsLeft >= 0 || !comment.touched;

    const validated = isNicknameValid && isCommentValid;

    const stepFirst = (
      <form 
        onSubmit={this.onSubmit}> 
        <fieldset>
          <label htmlFor='nickname'>
            Ваш никнейм или имя *
          </label>
          <input 
            name='nickname'
            ref='nickname'
            onBlur={this.onBlur}
            onChange={this.onChange}
            value={nickname.value}
            placeholder='Никнейм'
            className={!nickname.focused && nickname.touched && !isNicknameValid && 'errorInput shakable'}
            type='text'
          /> 
        </fieldset>
        <fieldset>
          <label htmlFor='comment'>
            Сообщение
          </label>
          <TextareaAutosize
            minRows={3}
            maxRows={6}
            name='comment'
            onChange={this.onChangeComment}
            onBlur={this.onBlur}
            value={comment.value}
            className={!comment.focused && comment.touched && !isCommentValid && 'errorInput shakable'}
            placeholder='Комментарий'
            />
          <p>{this.state.comment.charsLeft} / {maxChars}</p>
        </fieldset>
        <input 
          type='submit'
          className='btn btn-primary'
          disabled={!validated}
          value='Далее' />
      </form>
    )

    return (
      <div className='donation'>
        <div className='panel'>
        <h3>Поддержать стримера</h3>
        {this.state.paymentId ?
          <form 
            method='POST' 
            ref='paymentForm'
            onSubmit={this.onSubmit}
            onKeyPress={(event) => {
              /* prevents submiting form by enter */
              if (event.which === 13) {
                event.preventDefault();
              } 
            }}
            action='https://money.yandex.ru/quickpay/confirm.xml'> 
            <input type='hidden' name='receiver' value={this.state.account} /> 
            <input type='hidden' name='formcomment' value='Донат стримеру' /> 
            <input type='hidden' name='short-dest' value='Донат стримеру' />
            <input type='hidden' name='label' value={this.state.paymentId} /> 
            <input type='hidden' name='comment' value={this.state.comment.value} /> 
            <input type='hidden' name='quickpay-form' value='donate' /> 
            <input type='hidden' name='targets' value={`Донат стримеру : ${this.state.paymentId}`} /> 
            <input type='hidden' name='need-email' value='true' /> 
            <fieldset>
              <label htmlFor='sum'>
                Сумма
              </label>
              <input type='number' name='sum' onChange={this.onChange} value={this.state.sum.value} data-type='number' /> 
            </fieldset>
            <hr />
            <fieldset>
              <input 
                type='radio'
                onChange={this.onChange}
                name='paymentType'
                checked={this.state.paymentType.value === 'PC'} 
                value='PC' />
              Яндекс.Деньгами
            </fieldset>
            <fieldset>
              <input 
                type='radio'
                onChange={this.onChange}
                name='paymentType'
                checked={this.state.paymentType.value === 'AC'} 
                value='AC' />
              Банковской картой
            </fieldset>
            <button className='btn btn-primary' onClick={() => {this.refs.paymentForm.submit()}}>Поблагодарить</button>
          </form>
          : stepFirst}
        </div>
      </div>
    )
  }
}

export default Donation;
