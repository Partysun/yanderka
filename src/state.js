import Baobab from 'baobab';
import cloud from './cloud.js';
const monkey = Baobab.monkey;

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
    ui: {
      login: {
        pending: false,
        error: ''
      } 
    }
  },
  user,
  notifications: {},
}

const tree = new Baobab(seed);

if (process.env.NODE_ENV !== 'production') {
  console.info('DEVELOP');
  window.tree = tree;
}

export default tree;
