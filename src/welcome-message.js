import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <div className='welcome-message'>
    <h2>Добро пожаловать к Яндерке!</h2>
    <p>
      Для того чтобы начать принимать пожертвования, от ваших многоуважаемых подписчиков,
      вам следует пройти процедуру привязки Яндекс.Денег и настройки персональной страницы для пожертвований.
    </p>
    <Link 
      className='btn btn-action'
      to='/settings'>
      Приступить к настройке!
    </Link>
  </div>
)
