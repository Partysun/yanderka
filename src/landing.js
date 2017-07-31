import React from 'react';
import './landing.css';

const Landing = () => {
  return (
    <div className="landing">

      <header>
        <div className='logo'>Yanderka | Яндэра</div>
        <div className='actions'>
          <a href="/dashboard">Перейти к панели управления</a>
        </div>
      </header>

      <section className="hero">
        <div className="title">
          <h1>Яндэрка - сервис для приёма донатов</h1>
          <p>
            Виджет для Youtube, Twitch трансляций.
            <br />
            Принимаем Yandex.Деньги, банковские карты
          </p>
        </div>
      </section>

      <section className="features" id="features">
        <h2>Возможности Яндэры</h2>
        <div className="features-item">
          <h4 className="features-item-title">
            Быстро и просто 
          </h4>
          <p className="features-item-body">
            Подключение донатов к вашему стриму займёт не более 3-5 минут, если у вас уже есть кошелёк от Яндекс Денег. И минут 10-15 если его по каким-то причинам ещё нету.
          </p>
        </div>
        <div className="features-item">
          <h4 className="features-item-title">
            Бесплатно 
          </h4>
          <p className="features-item-body">
            Яндэра не берёт комиссию ни с вас, ни с ваших донатеров! Яндекс Деньги через которые проходят операции могут брать комиссию, но она минимальна в сравнении с аналогичными сервисами.
          </p>
        </div>
        <div className="features-item">
          <h4 className="features-item-title">
            Включите все возможности Streamlabs! 
          </h4>
          <p className="features-item-body">
            Яндэра позволяет подключить ваш аккаунт к Streamlabs и пользоваться всеми их функциями, а деньги принимать через Яндекс.Деньги. 
            А это значит максимум фич и никаких 5 процентных комиссий.
          </p>
        </div>
      </section>

      <section className="getting-started" id="getting-started">
        <h2>Как начать пользоваться Яндэрой</h2>
        <div className="getting-started-item">
          <h4 className="getting-started-item-question">
            1. Войдите через ваш Google аккаунт
          </h4>
          <p className="getting-started-item-answer">
            Мы возьмём только ваш email адрес.
          </p>
        </div>
        <div className="getting-started-item">
          <h4 className="getting-started-item-question">
            2. На панели управления зайдите в настройки и подключите Яндекс Кошелёк 
          </h4>
          <p className="getting-started-item-answer">
            Если у вас нету Яндекс Кошелька, то вам пора бы его создать!
          </p>
        </div>
        <div className="getting-started-item">
          <h4 className="getting-started-item-question">
            3. Скопируйте ссылку на страницу для ваших персональных донатов и поделитесь ей с вашей аудиторией.
          </h4>
          <p className="getting-started-item-answer">
            Попробуйте сами провести небольшой донат. Просто установите 5 рублей, как минимальную сумму и получите их на свой кошелёк.
          </p>
        </div>
        <div className="getting-started-item">
          <h4 className="getting-started-item-question">
            4. Скопируйте ссылку на окно оповещений о ваших донатах и установите её как виджет в сервис для стриминга. <small>( пример. <a href="https://obsproject.com">OBS</a>)</small>
          </h4>
          <p className="getting-started-item-answer">
            Если возникли вопросы как это сделать? Спросите у Youtube/Яндекса, как настроить OBS с Streamlabs. У нас всё тоже самое. Alertbox = Окно оповещений. 
          </p>
        </div>
        <div className="getting-started-item">
          <h4 className="getting-started-item-question">
            4. Если вам мало функциональности и настроек :) Подключите ваш Streamlabs аккаунт в настройках на панели управления.
          </h4>
          <p className="getting-started-item-answer">
            Подключив ваш Streamlabs вы сможете пользоваться его виджетами и настройками, а получать деньги через страницу донатов от Яндэры.
          </p>
        </div>
      </section>

      <section className="faq" id="faq">
        <h2>Часто задаваемые вопросы</h2>
        <div className="faq-item">
          <h4 className="faq-item-question">
            1. Можно ли встроить виджет с сообщениями от донатеров в стрим?
          </h4>
          <p className="faq-item-answer">
            Да, конечно. Просто скопируйте ссылку вашего окна оповещений в настройках и добавьте её в вашу программу для стриминга. <small>( пример. <a href="https://obsproject.com">OBS</a>)</small>
          </p>
        </div>
        <div className="faq-item">
          <h4 className="faq-item-question">
            2. Сколько занимает вывод денег?
          </h4>
          <p className="faq-item-answer">
            Моментально. Все деньги оказываются сразу у вас в Яндекс Кошельке.
          </p>
        </div>
        <div className="faq-item">
          <h4 className="faq-item-question">
            3. Почему Яндэра бесплатная?
          </h4>
          <p className="faq-item-answer">
            Мы сами в шоке ;)
          </p>
        </div>
        <div className="faq-item">
          <h4 className="faq-item-question">
            4. Обязательно ли для того чтобы принимать деньги с донатеров создавать яндекс кошелёк.
          </h4>
          <p className="faq-item-answer">
            Да. Яндэра позволяет принимать деньги только после подключения вашего Яндекс кошелька к сервису.
          </p>
        </div>
        <div className="faq-item">
          <h4 className="faq-item-question">
            5. Что Яндэра может сделать с моим Яндекс Кошельком? 
          </h4>
          <p className="faq-item-answer">
            Мы ничего не можем с ним сделать. После подключения его к нашему сервису, мы лишь получаем возможность создавать платежи на ваш кошелёк и принимаем оповещения об их поступлениях.
            Снимать или переводить ваши деньги мы не можем. За этим наблюдает Яндекс!
          </p>
        </div>
      </section>

      <section>
        <h2><a href="/dashboard">Войти в панель управления</a></h2>
      </section>

      <footer>
        <div className='about'>
          <p>Яндэру разработал <b>Юрий Зацепин</b>, специально для Яндекс Антихакатона.</p>
        </div>
        <div className='actions'>
          <a href="http://twitter.com/YuraZatsepin">@Twitter</a>
          <a href="https://t.me/zacepin">@Telegram</a>
        </div>
      </footer>

    </div>
  )
}

export default Landing;
