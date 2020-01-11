/* eslint-disable eol-last */
// https://vuex.vuejs.org/en/actions.html

import axios from 'axios'
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

const url = 'https://pdftexapi.pythonanywhere.com/'
const backend = 'https://faas.srv.mathsgaze.com/function'
//const backend = 'http://127.0.0.1:8080/function'
// let url = 'http://127.0.0.1:5000/'

export default {

  // eslint-disable-next-line space-before-function-paren
  donwloadPdf({
     // eslint-disable-next-line
    commit
  }, post) {
    return new Promise((resolve, reject) => {
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
     // eslint-disable-next-line
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
    // eslint-disable-next-line
    commit
  }, post) {
    return new Promise((resolve, reject) => {
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
     // eslint-disable-next-line
    commit
  }, post) {
    return new Promise((resolve, reject) => {
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
  },

  // eslint-disable-next-line space-before-function-paren
  getQuestionSolution({
     // eslint-disable-next-line
    commit
  }, post) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${backend}/fn-spectral-calculator`, post, {
          headers: headers
        })
        .then(
          response => {
            // eslint-disable-next-line no-console
            console.log(response)
            resolve(response)
          },
          error => {
            reject(error)
          }
        )
    })
  }
}