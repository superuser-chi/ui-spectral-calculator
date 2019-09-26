<template>
  <mdb-container class="mt-5">
    <mdb-row class="mt-5">
      <mdb-col
        md="12"
        class="mb-md-0 mb-4"
      >
        <mdb-modal
          :show="showModal"
          centered
          @close="showModal = false"
        >
          <mdb-modal-header>
            <mdb-modal-title>{{ modalTitle }}</mdb-modal-title>
          </mdb-modal-header>
          <mdb-modal-body>
            {{ modalMessage }}
          </mdb-modal-body>
          <mdb-modal-footer>
            <mdb-btn
              color="danger"
              @click.native="showModal = false"
            >Close</mdb-btn>
          </mdb-modal-footer>
        </mdb-modal>
        <h2 class="secondary-heading mb-3">Tutorial</h2>
        <p>This tutorial is meant to test your understanding on Limits
        </p>
        <section class="preview">
          <div
            id="pre-loader-parent"
            class="vld-parent"
          >
            <loading
              id="pre-loader"
              :active.sync="isLoading"
              :is-full-page="fullPage"
              height="128"
              width="128"
              loader="spinner"
              color="#00c851"
            >
              <template slot="default">
                <semipolar-spinner
                  :animation-duration="2000"
                  :size="85"
                  color="#00c851"
                />
              </template>
            </loading>
          </div>
          <section
            v-for="(question, index) in questions"
            :key="index"
            class="preview mt-5"
          >
            <h2 class="secondary-heading mb-3 text-danger">Question {{ index + 1 }}: </h2>
            <p>
              Use the limit definition to find $ \frac{df}{dx} $
              when $f(x) = {{ question.funct }}$
            </p>
            <section>
              <div class="custom-control custom-switch mr-5 mt-5">
                <input
                  :id="question.answerSwitchId"
                  v-model="question.answer.visibility"
                  type="checkbox"
                  class="custom-control-input"
                  checked
                >
                <label
                  :for="question.answerSwitchId"
                  class="custom-control-label"
                >Answer</label>
              </div>
              <div class="custom-control custom-switch">
                <input
                  :id="question.workingSwitchId"
                  v-model="question.working.visibility"
                  type="checkbox"
                  class="custom-control-input"
                >
                <label
                  :for="question.workingSwitchId"
                  class="custom-control-label"
                >Show working</label>
              </div>
            </section>
            <div
              v-show="question.answer.visibility"
              class="mt-5"
            >
              <h2 class="secondary-heading mb-3 text-primary">Answer: </h2>
              <p>
                <vue-mathjax
                  id="latex_funct"
                  :formula="question.answer.value"
                  class="col-12"
                />
              </p>
            </div>
            <div
              v-show="question.working.visibility"
              id="working"
              ref="working"
              class="mt-5"
            >
              <h2 class="secondary-heading mb-3 text-primary">Solution: </h2>
              <p
                v-for="step in question.working.steps"
                ref="steps"
                :key="step"
              >{{ step }} </p>
            </div>
          </section>
        </section>
      </mdb-col>
    </mdb-row>
    <div class="icon-container">
      <v-btn
        id="btnPdf"
        color="blue"
        dark
        fab
        @click.native="saveTex"
      >
        <v-icon>
          mdi-file-document-outline
        </v-icon>
      </v-btn>
      <v-btn
        id="pdfTex"
        color="pink"
        dark
        fab
        @click.native="savePdf"
      >
        <v-icon>mdi-file-pdf</v-icon>
      </v-btn>
    </div>
  </mdb-container>
</template>
<script>
// eslint-disable-next-line no-multi-spaces
import {  mdbContainer, mdbRow, mdbBtn, mdbCol, mdbModal, mdbModalHeader,
  // eslint-disable-next-line object-curly-spacing
  mdbModalTitle, mdbModalBody, mdbModalFooter} from 'mdbvue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { SemipolarSpinner } from 'epic-spinners'
import {
  evaluate, parse
} from 'mathjs'

export default {
  name: 'TutorialPage',
  components: {
    mdbContainer,
    mdbBtn,
    mdbRow,
    mdbCol,
    SemipolarSpinner,
    Loading,
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter
  },
  data () {
    return {
      show: false,
      showModal: false,
      modalTitle: undefined,
      modalMessage: undefined,
      isLoading: true,
      fullPage: true,
      questions: [],
      json_questions: []
    }
  },
  created () {
    this.renderMathJax()
  },
  mounted: function () {
    for (var i = 0; i < 25; i++) {
      this.questions.push(this.generateQuestion(i))
    }
    this.renderMathJax()
    this.toggleLoader(false)
  },
  methods: {
    savePdf () {
      let jsonData = {
        author: 'https://limits.surge.sh',
        title: 'Limits',
        project: 'Limits',
        'questions': this.generateJsonQuestion(this.questions)
      }
      console.log(jsonData)
      this.$store.dispatch('post/donwloadTutorialPdf', jsonData).then(response => {
        let url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
        let fileLink = document.createElement('a')
        fileLink.href = url
        fileLink.download = 'tutorial.pdf'
        document.body.appendChild(fileLink)
        fileLink.click()
      }, error => {
        this.isServerSideValidated = error.response.data.message
        if (!this.isServerSideValidated) {
          this.isServerSideValidated = 'Got nothing from server. Please contact your administrator'
        }
      })
    },
    saveTex () {
      let jsonData = {
        author: 'https://limits.surge.sh',
        title: 'Limits',
        project: 'Limits',
        'questions': this.generateJsonQuestion(this.questions)
      }
      console.log(jsonData)
      this.$store.dispatch('post/donwloadTutorialTex', jsonData).then(response => {
        let url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/tex' }))
        let fileLink = document.createElement('a')
        fileLink.href = url
        fileLink.download = 'tutorial.tex'
        document.body.appendChild(fileLink)
        fileLink.click()
      }, error => {
        this.isServerSideValidated = error.response.data.message
        if (!this.isServerSideValidated) {
          this.isServerSideValidated = 'Got nothing from server. Please contact your administrator'
        }
      })
    },
    generateJsonQuestion (questions) {
      let json = []
      for (var i = 0; i < questions.length; i++) {
        let question = {
          function: questions[i].funct.toString(),
          answer: questions[i].answer.value.toString(),
          working: questions[i].working.steps.toString()
        }
        json.push(question)
      }
      return json
    },

    toggleModal (title, message) {
      this.modalTitle = title
      this.modalMessage = message
      this.showModal = true
    },
    toggleLoader (isLoading) {
      const vue = this
      window.MathJax.Hub.Queue(function () {
        vue.isLoading = isLoading
      })
    },
    renderMathJax () {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, window.body])
    },
    parseToTex (f) {
      return parse(f).toTex()
    },
    niceDisplay (str) {
      if (typeof (str) === 'string') {
        str = str.replace(/1x/g, 'x').replace(/1h/g, 'h')
      } else {
        for (var i = 0; i < str.length; i++) {
          str[i] = str[i].replace(/1x/g, 'x').replace(/1h/g, 'h')
        }
      }
      return str
    },
    generateQuestion (index) {
      let question = {
        question: undefined,
        working: { visibility: false, steps: [] },
        answer: { visibility: false, value: undefined },
        whichCase: undefined,
        funct: undefined,
        answerSwitchId: 'answerSwitch' + index,
        workingSwitchId: 'workingSwitch' + index
      }
      question.whichCase = Math.floor(Math.random() * 23)
      let a = Math.floor(Math.random() * 100 + 1)
      let b = Math.floor(Math.random() * 100 + 1)
      let c = Math.floor(Math.random() * 100 + 1)
      if (question.whichCase === 0) {
        question.funct = a.toString()
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + a.toString() +
          ' - ' + a.toString() + '}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{0}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} 0$')
        question.working.steps.push('$\\frac{df}{dx} = 0 $')
        question.answer.value = '$\\frac{df}{dx} = 0 $'
      } else if (question.whichCase === 1) {
        question.funct = a + 'x' + '+' + b
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{[' + a.toString() +
          '(x+h) + ' + b.toString() + '] - [' + a.toString() + 'x + ' +
          b.toString() + ']}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + a.toString() +
          'x + ' + a.toString() + 'h +' + b.toString() + '- ' + a.toString() + 'x - ' +
          b.toString() + '}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + a.toString() + 'h}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} ' + a.toString() + '$')
        question.working.steps.push('$\\frac{df}{dx} = ' + a.toString() + '$')
        question.answer.value = '$\\frac{df}{dx} = ' + a.toString() + '$'
      } else if (question.whichCase === 2) {
        question.funct = b + '-' + a + 'x'
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{[' + b.toString() + '-' +
          a.toString() + '(x+h)] - [' + b.toString() + '-' + a.toString() + 'x]}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + b.toString() + '-' +
          a.toString() + 'x - ' + a.toString() + 'h -' + b.toString() + '+' +
          a.toString() + 'x}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{ -' + a.toString() + 'h}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} - ' + a.toString() + '$')
        question.working.steps.push('$\\frac{df}{dx} = - ' + a.toString() + '$')
        question.answer.value = '$\\frac{df}{dx} = - ' + a.toString() + '$'
      } else if (question.whichCase === 3) {
        question.funct = a + 'x^2' + '+' + b
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{[' + a.toString() +
          '(x+h)^2 + ' + b.toString() + '] - [' + a.toString() + 'x^2 + ' +
          b.toString() + ']}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{[' + a.toString() +
          '(x^2+2xh+h^2) + ' + b.toString() + '] - [' + a.toString() + 'x^2 + ' +
          b.toString() + ']}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{[' + a.toString() +
          'x^2 + ' + a.toString() +
          '\\cdot 2xh + ' + a.toString() +
          '\\cdot h^2 + ' + b.toString() + '] - [' + a.toString() + 'x^2 + ' +
          b.toString() + ']}{h}$')
        let val = evaluate(a.toString() + '*2').toString()
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{[' + a.toString() +
          'x^2 + ' + val +
          'xh + ' + a.toString() +
          'h^2+' + b.toString() + '] - [' + a.toString() + 'x^2 + ' +
          b.toString() + ']}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + a.toString() +
          'x^2 + ' + val +
          'xh + ' + a.toString() +
          'h^2 + ' + b.toString() + ' - ' + a.toString() + 'x^2 - ' +
          b.toString() + '}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{(' + val +
          'x + ' + a.toString() + 'h)h}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0}' + val +
          'x + ' + a.toString() + 'h$')
        question.working.steps.push('$\\frac{df}{dx} = ' + evaluate(a.toString() + '*2').toString() + 'x$')
        question.answer.value = '$\\frac{df}{dx} = ' + evaluate(a.toString() + '*2').toString() + 'x$'
      } else if (question.whichCase === 4) {
        question.funct = b + '-' + a + 'x^2'
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{[' + b.toString() + '-' +
          a.toString() + '(x+h)^2] - [' + b.toString() + '-' + a.toString() + 'x^2]}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{[' + b.toString() + ' -' +
          a.toString() + '(x^2+2xh+h^2)] - [' + b.toString() + '-' + a.toString() + 'x^2]}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{[' + b.toString() + ' -' +
          a.toString() + 'x^2 - ' +
          a.toString() + '\\cdot 2xh - ' +
          a.toString() + 'h^2] - [' +
          b.toString() + '-' + a.toString() + 'x^2]}{h}$')
        let val = evaluate(a.toString() + '*2')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{[' + b.toString() + ' -' +
          a.toString() + 'x^2 - ' +
          val + 'xh - ' +
          a.toString() + 'h^2] - [' +
          b.toString() + '-' + a.toString() + 'x^2]}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + b.toString() + ' -' +
          a.toString() + 'x^2 - ' +
          val + 'xh - ' +
          a.toString() + 'h^2 - ' +
          b.toString() + '+' + a.toString() + 'x^2}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{(-' +
          val + 'x - ' +
          a.toString() + 'h)h}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} -' +
          val + 'x - ' +
          a.toString() + 'h$')
        question.working.steps.push('$\\frac{df}{dx} = -' + val + 'x$')
        question.answer.value = '$\\frac{df}{dx} = -' + val + 'x$'
      } else if (question.whichCase === 5) {
        question.funct = a + 'x^2' + '+' + b + 'x'
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{[' + a.toString() +
          '(x+h)^2 + ' + b.toString() + '(x+h)] - [' + a.toString() + 'x^2 + ' +
          b.toString() + 'x]}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{[' + a.toString() +
          '(x^2+2xh+h^2) + ' + b.toString() + '(x+h)] - [' + a.toString() + 'x^2 + ' +
          b.toString() + 'x]}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{[' + a.toString() +
          'x^2 + ' + a.toString() +
          '\\cdot 2xh + ' + a.toString() +
          'h^2 + ' +
          b.toString() + 'x + ' + b.toString() + 'h] - [' +
          a.toString() + 'x^2 + ' + b.toString() + 'x]}{h}$')
        let val = evaluate(a.toString() + '*2')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + a.toString() +
          'x^2 + ' + val + 'xh +' + a.toString() +
          'h^2 + ' +
          b.toString() + 'x + ' + b.toString() + 'h - ' +
          a.toString() + 'x^2 - ' + b.toString() + 'x}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{(' + val + 'x +' + a.toString() +
          'h+' + b.toString() + ')h}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} ' + val + 'x +' + a.toString() +
          'h+' + b.toString() + '$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} ' + val + 'x +' + b.toString() + '$')
        question.working.steps.push('$\\frac{df}{dx} = ' + val + 'x +' + b.toString() + '$')
        question.answer.value = '$\\frac{df}{dx} = ' + val + 'x +' + b.toString() + '$'
      } else if (question.whichCase === 6) {
        question.funct = b + 'x-' + a + 'x^2'
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{[' + b.toString() + '(x+h)-' +
          a.toString() + '(x+h)^2] - [' + b.toString() + '-' + a.toString() + 'x^2]}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{[' + b.toString() + '(x+h)-' +
          a.toString() + '(x^2+2xh+h)] - [' + b.toString() + '-' + a.toString() + 'x^2]}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{[' + b.toString() + 'x +' +
          b.toString() + 'h -' + a.toString() + 'x^2-' +
          a.toString() + '\\cdot 2xh-' + a.toString() + 'h^2] - [' +
          b.toString() + 'x-' + a.toString() + 'x^2]}{h}$')
        let val = evaluate(a.toString() + '*2')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + b.toString() + 'x +' +
          b.toString() + 'h -' + a.toString() + 'x^2-' +
          val + 'xh-' + a.toString() + 'h^2 - ' +
          b.toString() + 'x+' + a.toString() + 'x^2}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{(' +
          b.toString() + ' -' + val + 'x-' + a.toString() + 'h)h }{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} ' +
          b.toString() + ' -' + val + 'x-' + a.toString() + 'h$')
        question.working.steps.push('$\\frac{df}{dx} = ' + b.toString() + ' -' + val + 'x$')
        question.answer.value = '$\\frac{df}{dx} = ' + b.toString() + ' -' + val + 'x$'
      } else if (question.whichCase === 7) {
        question.funct = a + 'x^2+' + b +
          'x+' + c
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{[' + a.toString() +
          '(x+h)^2 + ' + b.toString() + '(x+h) + ' + c.toString() +
          '] - [' + a.toString() + 'x^2 + ' + b.toString() + 'x' + c.toString() + ']}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{[' + a.toString() +
          '(x^2+2xh+h^2) + ' + b.toString() + '(x+h) + ' + c.toString() + '] - [' + a.toString() + 'x^2 + ' +
          b.toString() + 'x+' + c.toString() + ']}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{[' + a.toString() +
          'x^2 + ' + a.toString() + '\\cdot 2xh + ' + a.toString() +
          'h^2 + ' + b.toString() + 'x + ' + b.toString() + 'h + ' +
          c.toString() + '] - [' + a.toString() + 'x^2 + ' + b.toString() +
          'x + ' + c.toString() + ']}{h}$')
        let val = evaluate(a.toString() + '*2')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + a.toString() +
          'x^2 + ' + val + 'xh +' + a.toString() + 'h^2 + ' +
          b.toString() + 'x + ' + b.toString() + 'h +' + c.toString() +
          '-' + a.toString() + 'x^2  -' + b.toString() + 'x-' +
          c.toString() + '}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{(' + val + 'x +' + a.toString() +
          'h+' + b.toString() + ')h}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} ' + val + 'x +' + a.toString() +
          'h+' + b.toString() + '$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} ' + val + 'x +' + b.toString() + '$')
        question.working.steps.push('$\\frac{df}{dx} = ' + val + 'x +' + b.toString() + '$')
        question.answer.value = '$\\frac{df}{dx} = ' + val + 'x +' + b.toString() + '$'
      } else if (question.whichCase === 8) {
        question.funct = a + 'x^3'
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + a.toString() +
          '(x+h)^3 - ' + a.toString() + 'x^3}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + a.toString() +
          '(x^3+3x^2h+3xh^2+h^3) - ' + a.toString() + 'x^3}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + a.toString() +
          'x^3 + ' + a.toString() +
          '\\cdot 3x^2h + ' + a.toString() +
          '\\cdot 3xh^2 + ' + a.toString() +
          'h^3 - ' + a.toString() + 'x^3}{h}$')
        let val = evaluate(a.toString() + '*3')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{(' + val +
          'x^2 + ' + val + 'xh + ' + a.toString() + 'x^2h)h}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0}' + val +
          'x^2 + ' + val + 'xh + ' + a.toString() + 'x^2h$')
        question.working.steps.push('$\\frac{df}{dx} = ' + val + 'x^2 $')
        question.answer.value = '$\\frac{df}{dx} = ' + val + 'x^2 $'
      } else if (question.whichCase === 9) {
        question.funct = c + '/(' + a + 'x+' + b + ')'
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{\\left[\\frac{' + c.toString() + '}{' +
          a + '(x+h)+' + b + '} \\right] - ' + '\\left[\\frac{' + c + '}{' + a + 'x+' +
          b + '} \\right]' + '}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c.toString() +
          '(' + a + 'x+' + b + ')-' + c + '(' + a + '(x+h)+' + b + ')}{h[(' +
          a + '(x+h)+' + b + ')(' + a + 'x+' +
          b + ')]' + '}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c.toString() +
          '(' + a + 'x+' + b + ')-' + c + '(' + a + 'x+' +
          a + 'h+' + b + ')}{h(' + a + '(x+h)+' + b + ')(' +
          a + 'x+' + b + ')}$')
        let valCxA = evaluate(a.toString() + '*' + c.toString())
        let valCxB = evaluate(b.toString() + '*' + c.toString())
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + valCxA + 'x+' + valCxB +
          '-' + valCxA + 'x-' + valCxA + 'h-' + valCxB + '}{h(' + a + '(x+h)+' + b + ')(' +
          a + 'x+' + b + ')}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' +
          valCxA + 'h}{h(' + a + '(x+h)+' + b + ')(' +
          a + 'x+' + b + ')}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' +
          valCxA + '}{(' + a + '(x+h)+' + b + ')(' +
          a + 'x+' + b + ')}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{' +
          valCxA + '}{(' + a + '(x+0)+' + b + ')(' +
          a + 'x+' + b + ')}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{' +
          valCxA + '}{(' + a + 'x+' + b + ')(' +
          a + 'x+' + b + ')}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{' +
          valCxA + '}{(' + a + 'x+' + b + ')^2}$')
        question.answer.value = '$\\frac{df}{dx} =  \\frac{' +
          valCxA + '}{(' + a + 'x+' + b + ')^2}$'
      } else if (question.whichCase === 10) {
        question.funct = c + '/(' + b + '-' + a + 'x)'
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{\\left[\\frac{' + c.toString() + '}{' +
          b + '-' + a + '(x+h)} \\right] - ' + '\\left[\\frac{' + c + '}{' +
          b + '-' + a + 'x' + '} \\right]' + '}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c.toString() + '(' +
          b + '-' + a + 'x)-' + c.toString() + '(' + b + '-' + a +
          '(x+h)) }{h[' + b + '-' + a + '(x+h)) (' + b + '-' + a + 'x)]}$')
        let valCxA = evaluate(a.toString() + '*' + c.toString())
        let valCxB = evaluate(b.toString() + '*' + c.toString())
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + valCxB + '-' + valCxA + 'x-' +
          valCxB + '+' + valCxA + 'x+' + valCxA + 'h}{h[(' + b + '-' + a + '(x+h)) (' +
          b + '-' + a + 'x)]}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + valCxA + 'h}{h[(' + b +
          '-' + a + '(x+h)) (' + b + '-' + a + 'x)]}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + valCxA + '}{(' + b +
          '-' + a + '(x+h)) (' + b + '-' + a + 'x)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\frac{' + valCxA + '}{(' + b +
          '-' + a + '(x+0)) (' + b + '-' + a + 'x)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\frac{' + valCxA + '}{(' + b +
          '-' + a + 'x)^2}$')
        question.answer.value = '$\\frac{df}{dx} = \\frac{' + valCxA + '}{(' + b +
          '-' + a + 'x)^2}$'
      } else if (question.whichCase === 11) {
        question.funct = c + 'x/(' + a + 'x+' + b + ')'
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{\\left[\\frac{' + c.toString() + '(x+h)}{' +
          a + '(x+h)+' + b + '} \\right] - ' + '\\left[\\frac{' + c + 'x}{' + a + 'x+' +
          b + '} \\right]' + '}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c.toString() +
          '(x+h)(' + a + 'x+' + b + ')-' + c + 'x(' + a + 'x+' + b + ')}{h[(' +
          a + '(x+h)+' + b + ')(' + a + 'x+' +
          b + ')]' + '}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c.toString() +
          '(x+h)(' + a + 'x+' + b + ')-' + c + 'x(' + a + 'x+' +
          b + ')}{h[(' + a + '(x+h)+' + b + ')(' +
          a + 'x+' + b + ')]}$')
        let valCxA = evaluate(a.toString() + '*' + c.toString())
        let valCxB = evaluate(b.toString() + '*' + c.toString())
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + valCxA + 'x^2+' + valCxB +
          'x+' + valCxA + 'xh+' + valCxB + 'h-' + valCxA + 'x^2-' + valCxB + 'x}{h(' + a +
          '(x+h)+' + b + ')(' + a + 'x+' + b + ')}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{(' + valCxA +
          'x+' + valCxB + ')h}{h[(' + a +
          '(x+h)+' + b + ')(' + a + 'x+' + b + ')]}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + valCxA +
          'x+' + valCxB + '}{(' + a +
          '(x+h)+' + b + ')(' + a + 'x+' + b + ')}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{' + valCxA +
          'x+' + valCxB + '}{(' + a +
          '(x+0)+' + b + ')(' + a + 'x+' + b + ')}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{' + valCxA +
          'x+' + valCxB + '}{(' + a +
          'x+' + b + ')(' + a + 'x+' + b + ')}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{' + valCxA +
          'x+' + valCxB + '}{(' + a +
          'x+' + b + ')^2}$')
        question.answer.value = '$\\frac{df}{dx} =  \\frac{' + valCxA +
          'x+' + valCxB + '}{(' + a +
          'x+' + b + ')^2}$'
      } else if (question.whichCase === 12) {
        question.funct = a + '/x^2'
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{\\left[\\frac{' + a.toString() + '}{' +
          '(x+h)^2} \\right] - ' + '\\left[\\frac{' + a + '}{x^2} \\right]}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + a.toString() + '(x+h) -' +
          a.toString() + 'x}{ h[x(x+h)^2]}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + a.toString() + 'x+' +
          a.toString() + 'h -' + a.toString() + 'x}{h[x(x+h)^2]}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' +
          a.toString() + 'h}{h[x(x+h)^2]}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' +
          a.toString() + '}{x(x+h)^2}$')
        question.working.steps.push('$\\frac{df}{dx} = \\frac{' +
          a.toString() + '}{x(x+0)^2}$')
        question.working.steps.push('$\\frac{df}{dx} = \\frac{' +
          a.toString() + '}{x^3}$')
        question.answer.value = '$\\frac{df}{dx} = \\frac{' + a.toString() + '}{x^3}$'
      } else if (question.whichCase === 13) {
        question.funct = c + '/(' + a + 'x^2 + ' + b + ')'
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{\\left[\\frac{' + c.toString() + '}{' +
          a + '(x+h)^2 +' + b + '} \\right] - ' + '\\left[\\frac{' + c + '}{ ' +
          a + 'x^2+' + b + '} \\right]}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c.toString() + '[' +
          a.toString() + '(x+h)^2 +' + b + ' - ' + a.toString() + 'x^2-' + b +
          ']}{ h[(' + a + '(x+h)^2 +' + b + ')(' + a + 'x^2 +' + b + ')]}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c.toString() + '[' +
          a.toString() + '(x^2+2xh+h^2) +' + b + ' - ' + a.toString() + 'x^2-' + b +
          ']}{ h[(' + a + '(x+h)^2 +' + b + ')(' + a + 'x^2 +' + b + ')]}$')
        let val = evaluate(a.toString() + '*2')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c.toString() + '[' +
          a.toString() + 'x^2 +' + val + 'xh +' + a.toString() + 'h+' + b + ' - ' +
          a.toString() + 'x^2-' + b + ']}{ h[(' + a + '(x+h)^2 +' +
          b + ')(' + a + 'x^2 +' + b + ')]}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c.toString() + '[' +
          val + 'x +' + a.toString() + ']h}{ h[(' + a + '(x+h)^2 +' +
          b + ')(' + a + 'x^2 +' + b + ')]}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c.toString() + '[' +
          val + 'x +' + a.toString() + ']}{ (' + a + '(x+h)^2 +' +
          b + ')(' + a + 'x^2 +' + b + ')]}$')
        let valCx2xA = evaluate(c.toString() + '*' + val)
        let valCxA = evaluate(c.toString() + '*' + a.toString())
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + valCx2xA +
          'x +' + valCxA + '}{ (' + a + '(x+h)^2 +' + b + ')(' +
          a + 'x^2 +' + b + ')}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{' + valCx2xA +
          'x +' + valCxA + '}{ (' + a + '(x+0)^2 +' + b + ')(' +
          a + 'x^2 +' + b + ')}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{' + valCx2xA +
          'x +' + valCxA + '}{ (' + a + 'x^2 +' + b + ')(' +
          a + 'x^2 +' + b + ')}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{' + valCx2xA +
          'x +' + valCxA + '}{ (' + a + 'x^2 +' + b + ')^2}$')
        question.answer.value = '$\\frac{df}{dx} =  \\frac{' + valCx2xA +
          'x +' + valCxA + '}{ (' + a + 'x^2 +' + b + ')^2}$'
      } else if (question.whichCase === 14) {
        question.funct = c + '/(' + b + '-' + a + 'x^2)'
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{\\left[\\frac{' + c.toString() + '}{' +
          b.toString() + '-' + a.toString() + '(x+h)^2 } \\right] - ' + '\\left[\\frac{' + c.toString() + '}{ ' +
          b.toString() + '-' + a.toString() + 'x^2} \\right]}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c.toString() + '[' +
          b + '-' + a.toString() + 'x^2-' + b + '+' + a.toString() + '(x+h)^2 ' +
          ']}{ h[(' + b + '-' + a + '(x+h)^2)(' + b + '-' + a + 'x^2)]}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c.toString() + '[' +
          b + '-' + a.toString() + 'x^2 -' + b + '+' + a.toString() + '(x^2+2xh+h^2)' +
          ']}{ h[(' + b + '-' + a + '(x+h)^2)(' + b + '-' + a + 'x^2)]}$')
        let val = evaluate(a.toString() + '*2')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c.toString() + '[' +
          b + '-' + a.toString() + 'x^2-' + b + '+' + a.toString() +
          'x^2 +' + val + 'xh +' + a.toString() + 'h^2]}{ h[(' + b + '-' + a + '(x+h)^2' +
          ')(' + b + '-' + a + 'x^2)]}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c.toString() + '[' +
          val + 'x +' + a.toString() + 'h]h}{ h[(' + b + '-' + a + '(x+h)^2' +
          ')(' + b + '-' + a + 'x^2)]}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c.toString() + '[' +
          val + 'x +' + a.toString() + 'h]}{ (' + b + '-' + a + '(x+h)^2 +' +
          ')(' + b + '-' + a + 'x^2 )]}$')
        let valCx2xA = evaluate(c.toString() + '*' + val)
        let valCxA = evaluate(c.toString() + '*' + a.toString())
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + valCx2xA +
          'x +' + valCxA + 'h}{ (' + b + '-' + a + '(x+h)^2)(' +
          b + '-' + a + 'x^2)}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{' + valCx2xA +
          'x +' + valCxA + '\\cdot 0}{ (' + b + '-' + a + '(x+0)^2)(' +
          b + '-' + a + 'x^2)}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{' + valCx2xA +
          'x}{ (' + b + '-' + a + 'x^2)(' +
          b + '-' + a + 'x^2)}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{' + valCx2xA +
          'x}{ (' + b + '-' + a + 'x^2)^2}$')
        question.answer.value = '$\\frac{df}{dx} =  \\frac{' + valCx2xA +
          'x}{ (' + b + '-' + a + 'x^2)^2}$'
      } else if (question.whichCase === 15) {
        question.funct = a + '/sqrt(x)'
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{\\left[\\frac{' + a.toString() + '}{' +
          '\\sqrt{x+h} } \\right] - ' + '\\left[\\frac{' + a.toString() + '}{ \\sqrt{x}} \\right]}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + a + '\\big(\\sqrt{x} - \\sqrt{x+h} \\big)}{' +
          '[\\sqrt{x+h}\\sqrt{x}] h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + a + '\\big(\\sqrt{x} - \\sqrt{x+h} \\big)}{' +
          '\\big(\\sqrt{x+h}\\sqrt{x}\\big)  h} \\cdot \\frac{\\big(\\sqrt{x} + \\sqrt{x+h} \\big)}{\\big(\\sqrt{x} + \\sqrt{x+h} \\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + a + '\\big(x - x- h \\big)}{' +
          '\\big(\\sqrt{x+h}\\sqrt{x}\\big)\\big(\\sqrt{x} + \\sqrt{x+h} \\big)  h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{-' + a + '}{' +
          '\\big(\\sqrt{x+h}\\sqrt{x}\\big)\\big(\\sqrt{x} + \\sqrt{x+h} \\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\frac{-' + a + '}{' +
          '\\big(\\sqrt{x+0}\\sqrt{x}\\big)\\big(\\sqrt{x} + \\sqrt{x+0} \\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\frac{-' + a + '}{' +
          'x\\big(2\\sqrt{x}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\frac{-' + a + '}{2\\sqrt[3]{x}}$')
        question.answer.value = '$\\frac{df}{dx} = \\frac{-' + a + '}{2 \\sqrt[3]{x}}$'
      } else if (question.whichCase === 16) {
        question.funct = 'sqrt(' + a + 'x+' + b + ')'
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{ \\sqrt{ ' +
          a + '(x+h)+' + b + '}-\\sqrt{' + a + 'x+' + b + '}}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{ \\sqrt{ ' +
          a + '(x+h)+' + b + '}-\\sqrt{' + a + 'x+' + b +
          '}}{h} \\cdot \\frac{\\sqrt{ ' + a + '(x+h)+' + b + '} + \\sqrt{' +
          a + 'x+' + b + '}}{\\sqrt{ ' + a + '(x+h)+' + b + '}+\\sqrt{' +
          a + 'x+' + b + '}}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{ (' +
          a + 'x+' + a + 'h+' + b + ')-(' + a + 'x+' + b +
          ')}{h\\big(\\sqrt{ ' + a + '(x+h)+' + b + '}+\\sqrt{' +
          a + 'x+' + b + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' +
          a + 'x+' + a + 'h+' + b + '-' + a + 'x-' + b +
          '}{h\\big(\\sqrt{ ' + a + '(x+h)+' + b + '}+\\sqrt{' +
          a + 'x+' + b + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' +
          a + 'h}{h\\big(\\sqrt{ ' + a + '(x+h)+' + b + '}+\\sqrt{' +
          a + 'x+' + b + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' +
          a + '}{\\sqrt{ ' + a + '(x+h)+' + b + '}+\\sqrt{' +
          a + 'x+' + b + '}}$')
        question.working.steps.push('$\\frac{df}{dx} = \\frac{' +
          a + '}{\\sqrt{ ' + a + '(x+0)+' + b + '}+\\sqrt{' +
          a + 'x+' + b + '}}$')
        question.working.steps.push('$\\frac{df}{dx} = \\frac{' +
          a + '}{\\sqrt{ ' + a + 'x+' + b + '}+\\sqrt{' +
          a + 'x+' + b + '}}$')
        question.working.steps.push('$\\frac{df}{dx} = \\frac{' +
          a + '}{2 \\sqrt{' + a + 'x+' + b + '}}$')
        question.answer.value = '$\\frac{df}{dx} = \\frac{' +
          a + '}{2 \\sqrt{' + a + 'x+' + b + '}}$'
      } else if (question.whichCase === 17) {
        question.funct = 'sqrt(' + b + '-' + a + 'x)'
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{ \\sqrt{ ' +
          b + '-' + a + '(x+h)}-\\sqrt{' + b + '-' + a + 'x}}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{ \\sqrt{ ' +
          b + '-' + a + '(x+h)}-\\sqrt{' + b + '-' + a + 'x}}{h} \\cdot' +
          '\\frac{\\sqrt{' + b + '-' + a + '(x+h)}+\\sqrt{' + b + '-' + a +
          'x}}{\\sqrt{' + b + '-' + a + '(x+h)}+\\sqrt{' + b + '-' + a + 'x}}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{\\big(' +
          b + '-' + a + 'x-' + a + 'h\\big)-\\big(' + b + '-' + a +
          'x\\big)}{h \\big(\\sqrt{' + b + '-' + a + '(x+h)}+\\sqrt{' + b +
          '-' + a + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' +
          b + '-' + a + 'x-' + a + 'h-' + b + '+' + a +
          'x}{h \\big(\\sqrt{' + b + '-' + a + '(x+h)}+\\sqrt{' + b +
          '-' + a + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{-' +
          a + 'h' + '}{h \\big(\\sqrt{' + b + '-' + a + '(x+h)}+\\sqrt{' +
          b + '-' + a + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{-' +
          a + '}{\\big(\\sqrt{' + b + '-' + a + '(x+h)}+\\sqrt{' +
          b + '-' + a + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{-' +
          a + '}{\\big(\\sqrt{' + b + '-' + a + '(x+0)}+\\sqrt{' +
          b + '-' + a + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{-' +
          a + '}{2 \\sqrt{' + b + '-' + a + 'x}}$')
        question.answer.value = '$\\frac{df}{dx} =  \\frac{-' +
          a + '}{2 \\sqrt{' + b + '-' + a + 'x}}$'
      } else if (question.whichCase === 18) {
        question.funct = '1/sqrt(' + a + 'x+' + b + ')'
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{ \\frac{1}{\\sqrt{ ' +
          a + '(x+h)+' + b + '}}-\\frac{1}{\\sqrt{' + a + 'x+' + b + '}}}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{\\sqrt{' + a + 'x+' + b +
          '}-\\sqrt{' + a + '(x+h)+' + b + '}}{h\\sqrt{' + a + '(x+h)+' + b +
          '}\\sqrt{' + a + 'x+' + b + '}}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{\\sqrt{' + a + 'x+' + b +
          '}-\\sqrt{' + a + '(x+h)+' + b + '}}{h\\sqrt{' + a + '(x+h)+' + b +
          '}\\sqrt{' + a + 'x+' + b + '}} \\cdot \\frac{\\sqrt{' + a + 'x+' + b +
          '}+\\sqrt{' + a + '(x+h)+' + b + '}}{\\sqrt{' + a + 'x+' + b +
          '}+\\sqrt{' + a + '(x+h)+' + b + '}}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{\\big(' + a + 'x+' + b +
          '\\big)-\\big(' + a + '(x+h)+' + b + '\\big)}{h\\sqrt{' + a + '(x+h)+' + b +
          '}\\sqrt{' + a + 'x+' + b + '}\\big(\\sqrt{' + a + 'x+' + b +
          '}+\\sqrt{' + a + '(x+h)+' + b + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + a + 'x+' + b +
          '-' + a + 'x-' + a + 'h-' + b + '}{h\\sqrt{' + a + '(x+h)+' + b +
          '}\\sqrt{' + a + 'x+' + b + '}\\big(\\sqrt{' + a + 'x+' + b +
          '}+\\sqrt{' + a + '(x+h)+' + b + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{-' + a + 'h' +
          '}{h\\sqrt{' + a + '(x+h)+' + b +
          '}\\sqrt{' + a + 'x+' + b + '}\\big(\\sqrt{' + a + 'x+' + b +
          '}+\\sqrt{' + a + '(x+h)+' + b + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{-' + a + '' +
          '}{\\sqrt{' + a + '(x+h)+' + b +
          '}\\sqrt{' + a + 'x+' + b + '}\\big(\\sqrt{' + a + 'x+' + b +
          '}+\\sqrt{' + a + '(x+h)+' + b + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{-' + a +
          '}{\\sqrt{' + a + '(x+0)+' + b +
          '}\\sqrt{' + a + 'x+' + b + '}\\big(\\sqrt{' + a + 'x+' + b +
          '}+\\sqrt{' + a + '(x+0)+' + b + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{-' + a +
          '}{\\sqrt{' + a + 'x+' + b +
          '}\\sqrt{' + a + 'x+' + b + '}\\big(\\sqrt{' + a + 'x+' + b +
          '}+\\sqrt{' + a + 'x+' + b + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{-' + a +
          '}{\\big(' + a + 'x+' + b +
          '\\big) \\big(2 \\sqrt{' + a + 'x+' + b +
          '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{-' + a +
          '}{2 \\sqrt[3]{' + a + 'x+' + b + '}}$')
        question.answer.value = '$\\frac{df}{dx} =  \\frac{-' + a +
          '}{2 \\sqrt[3]{' + a + 'x+' + b + '}}$'
      } else if (question.whichCase === 19) {
        question.funct = '1/sqrt(' + b + '-' + a + 'x)'
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{ \\frac{1}{\\sqrt{ ' +
          b + '-' + a + '(x+h)}}-\\frac{1}{\\sqrt{' + b + '-' + a + 'x}}}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{\\sqrt{' + b + '-' + a +
          'x}-\\sqrt{' + b + '-' + a + '(x+h)}}{h\\sqrt{' + b + '-' + a +
          '(x+h)}\\sqrt{' + b + '-' + a + 'x}}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{\\sqrt{' + b + '-' + a +
          'x}-\\sqrt{' + b + '-' + a + '(x+h)}}{h\\sqrt{' + b + '-' + a +
          '(x+h)}\\sqrt{' + b + '-' + a + 'x}} \\cdot \\frac{\\sqrt{' + b + '-' + a +
          'x}+\\sqrt{' + b + '-' + a + '(x+h)}}{\\sqrt{' + b + '-' + a +
          'x}+\\sqrt{' + b + '-' + b + '(x+h)}}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{\\big(' + b + '-' + a +
          'x\\big)-\\big(' + b + '-' + a + '(x+h)\\big)}{h\\sqrt{' + b + '-' + a +
          '(x+h)}\\sqrt{' + b + '-' + a + 'x}\\big(\\sqrt{' + b + '-' + a +
          'x}+\\sqrt{' + b + '-' + a + '(x+h)}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{\\big(' + b + '-' + a +
          'x\\big)-\\big(' + b + '-' + a + 'x-' + a + 'h)\\big)}{h\\sqrt{' + b +
          '-' + a + '(x+h)}\\sqrt{' + b + '-' + a + 'x}\\big(\\sqrt{' + b +
          '-' + a + 'x}+\\sqrt{' + b + '-' + a + '(x+h)}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + b + '-' + a +
          'x-' + b + '+' + a + 'h+' + a + 'x}{h\\sqrt{' + b + '-' + a +
          '(x+h)}\\sqrt{' + b + '-' + a + 'x}\\big(\\sqrt{' + b + '-' + a +
          'x}+\\sqrt{' + b + '-' + a + '(x+h)}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + a + 'h' +
          '}{h\\sqrt{' + b + '-' + a +
          '(x+h)}\\sqrt{' + b + '-' + a + 'x}\\big(\\sqrt{' + b + '-' + a +
          'x}+\\sqrt{' + b + '-' + a + '(x+h)}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + a + '' +
          '}{\\sqrt{' + b + '-' + a +
          '(x+h)}\\sqrt{' + b + '-' + a + 'x}\\big(\\sqrt{' + b + '-' + a +
          'x}+\\sqrt{' + b + '-' + a + '(x+h)}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{' + a +
          '}{\\sqrt{' + b + '-' + a +
          '(x+0)}\\sqrt{' + b + '-' + a + 'x}\\big(\\sqrt{' + b + '-' + a +
          'x}+\\sqrt{' + b + '-' + a + '(x+0)}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{' + a +
          '}{\\sqrt{' + b + '-' + a +
          'x}\\sqrt{' + b + '-' + a + 'x}\\big(\\sqrt{' + b + '-' + a +
          'x}+\\sqrt{' + b + '-' + a + 'x}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{' + a +
          '}{\\big(' + b + '-' + a +
          'x\\big) \\big(2 \\sqrt{' + b + '-' + a +
          'x}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{' + a +
          '}{2 \\sqrt[3]{' + b + '-' + a + 'x}}$')
        question.answer.value = '$\\frac{df}{dx} =  \\frac{' + a +
          '}{2 \\sqrt[3]{' + b + '-' + a + 'x}}$'
      } else if (question.whichCase === 20) {
        question.funct = 'sqrt(' + a + 'x^2+' + b + ')'
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{ \\sqrt{ ' +
          a + '(x+h)^2+' + b + '}-\\sqrt{' + a + 'x^2+' + b + '}}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{ \\sqrt{ ' +
          a + '(x+h)^2+' + b + '}-\\sqrt{' + a + 'x^2+' + b + '}}{h}' +
          '\\cdot\\frac{\\sqrt{' + a + '(x+h)^2+' + b + '}+\\sqrt{' + a +
          'x^2+' + b + '}}{\\sqrt{' + a + '(x+h)^2+' + b + '}+\\sqrt{' +
          a + 'x^2+' + b + '}}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{ \\big(' +
          a + '(x+h)^2+' + b + '\\big)-\\big(' + a + 'x^2+' + b +
          '\\big)}{h\\big(\\sqrt{ ' + a + '(x+h)^2+' + b + '}+\\sqrt{' + a +
          'x^2+' + b + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{ \\big(' +
          a + '(x^2+2xh+h^2)+' + b + '\\big)-\\big(' + a + 'x^2+' + b +
          '\\big)}{h\\big(\\sqrt{ ' + a + '(x+h)^2+' + b + '}+\\sqrt{' + a +
          'x^2+' + b + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{ \\big(' +
          a + 'x^2+' + a + '\\cdot 2xh+' + a + 'h^2+' + b +
          '\\big)-\\big(' + a + 'x^2+' + b + '\\big)}{h\\big(\\sqrt{ ' + a +
          '(x+h)^2+' + b + '}+\\sqrt{' + a +
          'x^2+' + b + '}\\big)}$')
        let val = evaluate(a.toString() + '*2')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{ \\big(' +
          a + 'x^2+' + val + 'xh+' + a + 'h^2+' + b +
          '\\big)-\\big(' + a + 'x^2+' + b + '\\big)}{h\\big(\\sqrt{ ' + a +
          '(x+h)^2+' + b + '}+\\sqrt{' + a +
          'x^2+' + b + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' +
          a + 'x^2+' + val + 'xh+' + a + 'h^2+' + b +
          '-' + a + 'x^2-' + b + '}{h\\big(\\sqrt{ ' + a +
          '(x+h)^2+' + b + '}+\\sqrt{' + a +
          'x^2+' + b + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{(' +
          val + 'x+' + a + 'h)h}{h\\big(\\sqrt{ ' + a +
          '(x+h)^2+' + b + '}+\\sqrt{' + a +
          'x^2+' + b + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' +
          val + 'x+' + a + 'h}{\\big(\\sqrt{ ' + a +
          '(x+h)^2+' + b + '}+\\sqrt{' + a +
          'x^2+' + b + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\frac{' +
          val + 'x+' + a + '\\cdot0}{\\big(\\sqrt{ ' + a +
          '(x+0)^2+' + b + '}+\\sqrt{' + a +
          'x^2+' + b + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\frac{' +
          val + 'x+' + a + '\\cdot0}{\\big(\\sqrt{ ' + a +
          'x^2+' + b + '}+\\sqrt{' + a +
          'x^2+' + b + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\frac{' + a + 'x}{ \\sqrt{' + a +
          'x^2+' + b + '}}$')
        question.answer.value = '$\\frac{df}{dx} = \\frac{' + a + 'x}{ \\sqrt{' + a +
          'x^2+' + b + '}}$'
      } else if (question.whichCase === 21) {
        question.funct = 'sqrt(' + b + '-' + a + 'x^2)'
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{ \\sqrt{ ' +
          b + '-' + a + '(x+h)^2}-\\sqrt{' + b + '-' + a + 'x^2}}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{ \\sqrt{ ' +
          b + '-' + a + '(x+h)^2}-\\sqrt{' + b + '-' + a + 'x^2}}{h}' +
          '\\cdot\\frac{\\sqrt{' + b + '-' + a + '(x+h)^2}+\\sqrt{' + b +
          '-' + a + 'x^2}}{\\sqrt{' + b + '-' + a + '(x+h)^2}+\\sqrt{' +
          b + '-' + a + 'x^2}}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{ \\big(' +
          b + '-' + a + '(x+h)^2\\big)-\\big(' + b + '-' + a +
          'x^2\\big)}{h\\big(\\sqrt{ ' + b + '-' + a + '(x+h)^2}+\\sqrt{' + b +
          '-' + a + 'x^2}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{ \\big(' +
          b + '-' + a + '(x^2+2xh+h^2)\\big)-\\big(' + b + '-' + a +
          'x^2\\big)}{h\\big(\\sqrt{ ' + b + '-' + a + '(x+h)^2}+\\sqrt{' + b +
          '-' + a + 'x^2}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{ \\big(' + b + '-' +
          a + 'x^2-' + a + '\\cdot 2xh-' + a + 'h^2+' +
          '\\big)-\\big(' + b + '-' + a + 'x^2\\big)}{h\\big(\\sqrt{ ' + b +
          '-' + a + '(x+h)^2}+\\sqrt{' + b +
          '-' + b + 'x^2}\\big)}$')
        let val = evaluate(a.toString() + '*2')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{ \\big(' + b + '-' +
          a + 'x^2-' + val + 'xh-' + a + 'h^2' +
          '\\big)-\\big(' + b + '-' + a + 'x^2\\big)}{h\\big(\\sqrt{ ' + b +
          '-' + a + '(x+h)^2}+\\sqrt{' + b +
          '-' + a + 'x^2}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + b + '-' +
          a + 'x^2-' + val + 'xh-' + a + 'h^2-' +
          b + '+' + a + 'x^2}{h\\big(\\sqrt{ ' + b +
          '-' + a + '(x+h)^2}+\\sqrt{' + b +
          '-' + a + 'x^2}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{-(' +
          val + 'x+' + a + 'h)h}{h\\big(\\sqrt{ ' + b +
          '-' + a + '(x+h)^2}+\\sqrt{' + b +
          '-' + a + 'x^2}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{-' +
          val + 'x-' + a + 'h}{\\big(\\sqrt{ ' + b +
          '-' + b + '(x+h)^2}+\\sqrt{' + b +
          '-' + a + 'x^2}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\frac{-' +
          val + 'x+' + a + '\\cdot0}{\\big(\\sqrt{ ' + b +
          '-' + a + '(x+0)^2}+\\sqrt{' + b +
          '-' + a + 'x^2}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\frac{-' +
          val + 'x+' + a + '\\cdot0}{\\big(\\sqrt{ ' + b +
          '-' + a + 'x^2}+\\sqrt{' + b +
          '-' + a + 'x^2}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\frac{-' + a + 'x}{\\sqrt{' + b +
          '-' + a + 'x^2}}$')
        question.answer.value = '$\\frac{df}{dx} = \\frac{-' + a + 'x}{\\sqrt{' + b +
          '-' + a + 'x^2}}$'
      } else if (question.whichCase === 22) {
        question.funct = c + '/sqrt(' + a + 'x^2+' + b + ')'
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{ \\frac{' + c + '}{\\sqrt{ ' +
          a + '(x+h)^2+' + b + '}}-\\frac{' + c + '}{\\sqrt{' + a + 'x^2+' +
          b + '}}}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c + '\\left[\\sqrt{' +
          a + 'x^2+' + b + '}-\\sqrt{' + a + '(x+h)^2+' + b +
          '}\\right]}{h\\sqrt{' + a + '(x+h)^2+' + b + '}\\sqrt{' + a +
          'x^2+' + b + '}}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c + '\\left[\\sqrt{' +
          a + 'x^2+' + b + '}-\\sqrt{' + a + '(x+h)^2+' + b +
          '}\\right]}{h\\sqrt{' + a + '(x+h)^2+' + b + '}\\sqrt{' + a +
          'x^2+' + b + '}} \\cdot \\frac{\\sqrt{' + a + 'x^2+' + b +
          '}+\\sqrt{' + a + '(x+h)^2+' + b + '}}{\\sqrt{' + a + 'x^2+' + b +
          '}+\\sqrt{' + a + '(x+h)^2+' + b + '}}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c + '\\left[\\big(' +
          a + 'x^2+' + b + '\\big)-\\big(' + a + '(x+h)^2+' + b +
          '\\big)\\right]}{h\\sqrt{' + a + '(x+h)^2+' + b + '}\\sqrt{' + a +
          'x^2+' + b + '} \\big(\\sqrt{ ' + a + 'x^2+' + b +
          '}+\\sqrt{' + a + '(x+h)^2+' + b + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c + '\\left[\\big(' +
          a + 'x^2+' + b + '\\big)-\\big(' + a + '(x^2+2xh+h^2)+' + b +
          '\\big)\\right]}{h\\sqrt{' + a + '(x+h)^2+' + b + '}\\sqrt{' + a +
          'x^2+' + b + '} \\big(\\sqrt{ ' + a + 'x^2+' + b +
          '}+\\sqrt{' + a + '(x+h)^2+' + b + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c + '\\left[\\big(' +
          a + 'x^2+' + b + '\\big)-\\big(' + a + 'x^2+' + a +
          '\\cdot2xh+' + a + 'h^2+' + b +
          '\\big)\\right]}{h\\sqrt{' + a + '(x+h)^2+' + b + '}\\sqrt{' + a +
          'x^2+' + b + '} \\big(\\sqrt{ ' + a + 'x^2+' + b +
          '}+\\sqrt{' + a + '(x+h)^2+' + b + '}\\big)}$')
        let val = evaluate(a.toString() + '*2')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c + '\\left[' +
          a + 'x^2+' + b + '-' + a + 'x^2-' + val +
          'xh-' + a + 'h^2-' + b +
          '\\right]}{h\\sqrt{' + a + '(x+h)^2+' + b + '}\\sqrt{' + a +
          'x^2+' + b + '} \\big(\\sqrt{ ' + a + 'x^2+' + b +
          '}+\\sqrt{' + a + '(x+h)^2+' + b + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{-' + c + 'h\\left[' +
          val + 'x+' + a + 'h' + '\\right]}{h\\sqrt{' + a + '(x+h)^2+' + b +
          '}\\sqrt{' + a + 'x^2+' + b + '} \\big(\\sqrt{ ' + a + 'x^2+' + b +
          '}+\\sqrt{' + a + '(x+h)^2+' + b + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{-' + c + '\\left[' +
          val + 'x+' + a + 'h' + '\\right]}{\\sqrt{' + a + '(x+h)^2+' + b +
          '}\\sqrt{' + a + 'x^2+' + b + '} \\big(\\sqrt{ ' + a + 'x^2+' + b +
          '}+\\sqrt{' + a + '(x+h)^2+' + b + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{-' + c + '\\left[' +
          val + 'x+' + a + '\\cdot0' + '\\right]}{\\sqrt{' + a + '(x+0)^2+' + b +
          '}\\sqrt{' + a + 'x^2+' + b + '} \\big(\\sqrt{ ' + a + 'x^2+' + b +
          '}+\\sqrt{' + a + '(x+0)^2+' + b + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{-' + c + '\\cdot' +
          val + 'x}{\\sqrt{' + a + 'x^2+' + b +
          '}\\sqrt{' + a + 'x^2+' + b + '} \\big(\\sqrt{ ' + a + 'x^2+' + b +
          '}+\\sqrt{' + a + 'x^2+' + b + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{-' + c + '\\cdot' +
          val + 'x}{2 \\sqrt{' + a + 'x^2+' + b +
          '}\\sqrt{' + a + 'x^2+' + b + '} \\big(\\sqrt{ ' + a +
          'x^2+' + b + '}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{-' + c + '\\cdot' +
          a + 'x}{\\sqrt[3]{' + a + 'x^2+' + b + '}}$')
        let valCxA = evaluate(a.toString() + '*' + c)
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{-' + valCxA + 'x}{\\sqrt[3]{' +
          a + 'x^2+' + b + '}}$')
        question.answer.value = '$\\frac{df}{dx} =  \\frac{-' + valCxA + 'x}{\\sqrt[3]{' +
          a + 'x^2+' + b + '}}$'
      } else if (question.whichCase === 23) {
        question.funct = c + '/sqrt(' + b + '-' + a + 'x^2)'
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{ \\frac{' + c + '}{\\sqrt{ ' +
          b + '-' + a + '(x+h)^2}}-\\frac{' + c + '}{\\sqrt{' + b + '-' +
          a + 'x^2}}}{h}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c + '\\left[\\sqrt{' +
          b + '-' + a + 'x^2}-\\sqrt{' + b + '-' + a +
          '(x+h)^2}\\right]}{h\\sqrt{' + b + '-' + a + '(x+h)^2}\\sqrt{' + b +
          '-' + a + 'x^2+}}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c + '\\left[\\sqrt{' +
          b + '-' + a + 'x^2}-\\sqrt{' + b + '-' + a +
          '(x+h)^2}\\right]}{h\\sqrt{' + b + '-' + a + '(x+h)^2}\\sqrt{' + b +
          '-' + a + 'x^2}} \\cdot \\frac{\\sqrt{' + b + '-' + a +
          'x^2}+\\sqrt{' + b + '-' + a + '(x+h)^2}}{\\sqrt{' + b + '-' + a +
          'x^2}+\\sqrt{' + b + '-' + a + '(x+h)^2+}}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c + '\\left[\\big(' +
          b + '-' + a + 'x^2\\big)-\\big(' + b + '-' + b +
          '(x+h)^2\\big)\\right]}{h\\sqrt{' + b + '-' + a + '(x+h)^2}\\sqrt{' + b +
          '-' + a + 'x^2} \\big(\\sqrt{ ' + b + '-' + b +
          'x^2}+\\sqrt{' + b + '-' + a + '(x+h)^2}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c + '\\left[\\big(' +
          b + '-' + a + 'x^2\\big)-\\big(' + b + '-' + a +
          '(x^2+2xh+h^2)\\big)\\right]}{h\\sqrt{' + b + '-' + a + '(x+h)^2}\\sqrt{' + b +
          '-' + a + 'x^2} \\big(\\sqrt{ ' + b + '-' + a +
          'x^2}+\\sqrt{' + b + '-' + a + '(x+h)^2}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c + '\\left[\\big(' +
          b + '-' + a + 'x^2\\big)-\\big(' + b + '-' + a + 'x^2-' + a +
          '\\cdot2xh-' + a + 'h^2' + '\\big)\\right]}{h\\sqrt{' + b + '-' + a +
          '(x+h)^2}\\sqrt{' + b + '-' + a + 'x^2} \\big(\\sqrt{ ' + b + '-' + a +
          'x^2}+\\sqrt{' + b + '-' + a + '(x+h)^2}\\big)}$')
        let val = evaluate(a.toString() + '*2')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c + '\\left[' +
          b + '-' + a + 'x^2-' + b + '+' + a + 'x^2+' + val +
          'xh+' + a + 'h^2' +
          '\\right]}{h\\sqrt{' + b + '-' + a + '(x+h)^2}\\sqrt{' + b +
          '-' + a + 'x^2} \\big(\\sqrt{ ' + b + '-' + a +
          'x^2}+\\sqrt{' + b + '-' + a + '(x+h)^2}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c + 'h\\left[' +
          val + 'x+' + a + 'h' + '\\right]}{h\\sqrt{' + b + '-' + a +
          '(x+h)^2}\\sqrt{' + b + '-' + a + 'x^2} \\big(\\sqrt{ ' + b + '-' + a +
          'x^2}+\\sqrt{' + b + '-' + a + '(x+h)^2}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} = \\lim_{h \\to 0} \\frac{' + c + '\\left[' +
          val + 'x+' + a + 'h' + '\\right]}{\\sqrt{' + b + '-' + a +
          '(x+h)^2}\\sqrt{' + b + '-' + a + 'x^2} \\big(\\sqrt{ ' + b + '-' + a +
          'x^2}+\\sqrt{' + b + '-' + a + '(x+h)^2}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{' + c + '\\left[' +
          val + 'x+' + a + '\\cdot0' + '\\right]}{\\sqrt{' + b + '-' + b +
          '(x+0)^2}\\sqrt{' + b + '-' + a + 'x^2} \\big(\\sqrt{ ' + b + '-' + a +
          'x^2}+\\sqrt{' + b + '-' + a + '(x+0)^2}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{' + c + '\\cdot' +
          val + 'x}{\\sqrt{' + b + '-' + a +
          'x^2}\\sqrt{' + b + '-' + a + 'x^2} \\big(\\sqrt{ ' + b + '-' + a +
          'x^2}+\\sqrt{' + b + '-' + a + 'x^2}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{' + c + '\\cdot' +
          val + 'x}{2 \\sqrt{' + b + '-' + a +
          'x^2}\\sqrt{' + b + '-' + a + 'x^2} \\big(\\sqrt{ ' + b +
          '-' + a + 'x^2}\\big)}$')
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{' + c + '\\cdot' +
          a + 'x}{\\sqrt[3]{' + b + '-' + a + 'x^2}}$')
        let valCxA = evaluate(a.toString() + '*' + c)
        question.working.steps.push('$\\frac{df}{dx} =  \\frac{' + valCxA + 'x}{\\sqrt[3]{' +
          b + '-' + a + 'x^2}}$')
        question.answer.value = '$\\frac{df}{dx} =  \\frac{' + valCxA + 'x}{\\sqrt[3]{' +
          b + '-' + a + 'x^2}}$'
      }
      question.answer.value = this.niceDisplay(question.answer.value)
      question.working.steps = this.niceDisplay(question.working.steps)
      question.funct = this.parseToTex(this.niceDisplay(question.funct))
      return question
    }
  }
}
</script>

<style>
section.preview {
  border: 1px solid #e0e0e0;
  padding: 15px;
}
.input-group.md-form.form-sm.form-1 input {
  border: 1px solid #bdbdbd;
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
}
.input-group.md-form.form-sm.form-1
  input[type="text"]:focus:not([readonly]).red-border {
  border: 1px solid #ef9a9a;
  box-shadow: none;
}
.input-group.md-form.form-sm.form-1
  input[type="text"]:focus:not([readonly]).amber-border {
  border: 1px solid #ffca28;
  box-shadow: none;
}
.input-group.md-form.form-sm.form-1
  input[type="text"]:focus:not([readonly]).blue-border {
  border: 1px solid #64b5f6;
  box-shadow: none;
}
.input-group.md-form.form-sm.form-2 input {
  border: 1px solid #bdbdbd;
}
.input-group.md-form.form-sm.form-2
  input[type="text"]:focus:not([readonly]).lime-border {
  border: 1px solid #cddc39;
  box-shadow: none;
}
.input-group.md-form.form-sm.form-3 input {
  border: 1px solid #bdbdbd;
  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
}
.input-group.md-form.form-sm.form-3
  input[type="text"]:focus:not([readonly]).purple-border {
  border: 1px solid #ce93d8;
  box-shadow: none;
}

.custom-switch {
  display: inline-block !important;
}

span[class*="col-"] {
  padding: 0 !important;
}

#working {
  overflow-x: scroll;
}
.icon-container {
  position: absolute;
  bottom: 2em;
  right: 2em;
}
.v-list__tile__title {
  height: none;
  line-height: none;
  overflow: visible;
}
/* eslint-disable-next-line */
</style>
