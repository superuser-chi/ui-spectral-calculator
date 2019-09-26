// https://vuex.vuejs.org/en/actions.html

import axios from 'axios'
import router from '../../../router/index'
let headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
}

export default {
  login({
    commit
  }, user) {
    return new Promise((resolve, reject) => {
      axios
        .post('/api/auth/login', user, {
          headers: headers
        })
        .then(
          response => {
            resolve(response)
            commit('UPDATE_USER', response.data)
            router.push('/dashboard')
          },
          error => {
            reject(error)
          }
        )
    })
  },
  logout({
    commit
  }, cartItem) {
    axios.post('/api/auth/logout', cartItem).then(response => {
      commit('UPDATE_USER', response.data)
    })
  },
  create_user({
    commit
  }, user) {
    axios.post('/api/extension_worker/', user).then(response => {
      console.log(response.data)
    })
  },
  update_user({
    commit
  }, user) {
    return new Promise((resolve, reject) => {
      axios
        .put('/api/extension_worker/' + user.public_id, user, {
          headers: headers
        })
        .then(
          response => {
            resolve(response)
            commit('UPDATE_USER', response.data)
          },
          error => {
            reject(error)
          }
        )
    })
  },
  removeUser({
    commit
  }) {
    let newUser = {
      authorization: undefined,
      public_id: undefined,
      physical_address: undefined,
      postal_address: undefined,
      firstname: undefined,
      username: undefined,
      lastname: undefined,
      about: undefined,
      email: undefined
    }
    commit('UPDATE_USER', newUser)
  }
}