import Baobab from 'baobab';
import cloud from './cloud.js';
const monkey = Baobab.monkey;

const donations = {
  balance: 0,
  week: 0,
  day: 0,
  items: {},
  loading: true,
}

const user = {
  uid: '',
  name: '',
  email: '',
  loading: true,
  loggedin: monkey({
    get: () => {
      return !!cloud.auth().currentUser;
    }
  })
}

export const seed = {
  app: {
    version: 0.1,
    apiUrl: 'https://us-central1-yanderka-f39f7.cloudfunctions.net/actions',
    ui: {
      login: {
        pending: false,
        error: ''
      },
      streamlabs: {
        tokenSaved: monkey({
          cursors: {
            refresh_token: ['user', 'streamlabs', 'refresh_token'],
          },
          get: (data) => {
            return !!data.refresh_token;
          }
        }),
        pending: false,
        error: '',
      },
      yamoney: {
        tokenSaved: monkey({
          cursors: {
            access_token: ['user', 'yamoney', 'access_token'],
          },
          get: (data) => {
            return !!data.access_token;
          }
        }),
        notifyTested: monkey({
          cursors: {
            notifyTested: ['user', 'yamoney', 'notifyTested'],
          },
          get: (data) => {
            return !!data.notifyTested;
          }
        }),
        pending: false,
        error: ''
      }
    }
  },
  user,
  donations,
  notifications: {},
}

const tree = new Baobab(seed);

if (process.env.NODE_ENV !== 'production') {
  console.info('DEVELOP');
  window.tree = tree;
}

export default tree;
