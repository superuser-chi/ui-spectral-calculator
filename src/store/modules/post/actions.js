/* eslint-disable eol-last */
// https://vuex.vuejs.org/en/actions.html

import axios from 'axios'
let headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
let url = 'https://pdftexapi.pythonanywhere.com/'
// let url = 'http://127.0.0.1:5000/'
export default {

  // eslint-disable-next-line space-before-function-paren
  donwloadPdf({
    commit
  }, post) {
    return new Promise((resolve, reject) => {
      console.log(post)
      axios
        .post(url + 'generate-pdf', post, {
          responseType: 'arraybuffer'
        }, {
          headers: headers
        })
        .then(
          response => {
            resolve(response)
          },
          error => {
            reject(error)
          }
        )
    })
  },

  // eslint-disable-next-line space-before-function-paren
  donwloadTex({
    commit
  }, post) {
    return new Promise((resolve, reject) => {
      axios
        .post(url + 'generate-tex', post, {
          responseType: 'arraybuffer'
        }, {
          headers: headers
        })
        .then(
          response => {
            resolve(response)
          },
          error => {
            reject(error)
          }
        )
    })
  },

  // eslint-disable-next-line space-before-function-paren
  donwloadTutorialPdf({
    commit
  }, post) {
    return new Promise((resolve, reject) => {
      console.log(post)
      axios
        .post('https://pdftexapi.pythonanywhere.com/generate-tutorial', post, {
          responseType: 'arraybuffer'
        }, {
          headers: headers
        })
        .then(
          response => {
            resolve(response)
          },
          error => {
            reject(error)
          }
        )
    })
  },

  // eslint-disable-next-line space-before-function-paren
  donwloadTutorialTex({
    commit
  }, post) {
    return new Promise((resolve, reject) => {
      console.log(post)
      axios
        .post('https://pdftexapi.pythonanywhere.com/generate-tutorial-tex', post, {
          responseType: 'arraybuffer'
        }, {
          headers: headers
        })
        .then(
          response => {
            resolve(response)
          },
          error => {
            reject(error)
          }
        )
    })
  }
}