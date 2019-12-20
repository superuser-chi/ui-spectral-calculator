<template>
  <mdb-container class="mt-5">
    <mdb-row class="mt-5">
      <mdb-col
        md="12"
        class="mb-md-0 mb-4"
      >
        <mdb-modal
          :show="pdfConfig"
          success
          @close="pdfConfig = false"
        >
          <mdb-modal-header>
            <mdb-modal-title>Pdf Configuration</mdb-modal-title>
          </mdb-modal-header>
          <mdb-modal-body class="text-center">
            <section>
              <div class="custom-control custom-switch mr-5">
                <input
                  id="answerSwitch"
                  v-model="showAnswers"
                  type="checkbox"
                  class="custom-control-input"
                  checked
                >
                <label
                  class="custom-control-label"
                  for="answerSwitch"
                >Answer</label>
              </div>
              <div class="custom-control custom-switch">
                <input
                  id="workingSwitch"
                  v-model="showSteps"
                  type="checkbox"
                  class="custom-control-input"
                >
                <label
                  class="custom-control-label"
                  for="workingSwitch"
                >Show steps</label>
              </div>
            </section>
          </mdb-modal-body>
          <mdb-modal-footer center>
            <mdb-btn
              color="success"
              @click="save"
            >download {{ type }}
            </mdb-btn>
            <mdb-btn
              outline="danger"
              @click="pdfConfig = false"
            >Cancel</mdb-btn>
          </mdb-modal-footer>
        </mdb-modal>
        <h2 class="secondary-heading mb-3">Tutorial</h2>
        <p>This tutorial is meant to test your understanding on LU decomposition
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
            ref="math"
            class="preview"
          >
            <section class="mb-5">
              <v-form>
                <v-container>
                  <v-row>
                    <v-col
                      class="d-flex"
                      cols="12"
                      sm="6"
                    >
                      <v-select
                        id="typeOfProblem"
                        :items="problems"
                        v-model="problem"
                        label="Choose type of problem"
                        style="line:"
                        outlined
                        @change="select"
                      >
                        <template
                          slot="selection"
                          slot-scope="data"
                        >
                          <vue-mathjax
                            :formula="data.item"
                            class="col-12"
                          />
                        </template>
                        <template
                          slot="item"
                          slot-scope="data"
                        >
                          <vue-mathjax
                            :formula="data.item"
                            class="col-12"
                          />
                        </template>
                      </v-select>
                    </v-col>
                    <v-col
                      cols="12"
                      md="12"
                    >
                      <v-select
                        id="methods"
                        :items="methods"
                        v-model="method"
                        label="Choose Method to use"
                        style="line:"
                        outlined
                      />
                    </v-col>
                  </v-row>
                  <v-row class="mt-5">
                    <v-col cols="12">
                      <header>Sizes:</header>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-checkbox
                        v-model="size2.visibility"
                        label="2 x 2"
                      />
                    </v-col>
                    <v-col
                      v-show="size2.visibility"
                      cols="12"
                      md="6"
                    >
                      <v-text-field
                        v-model="size2.total"
                        type="number"
                        label="Number of questions"
                        required
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-checkbox
                        v-model="size3.visibility"
                        label="3 x 3"
                      />
                    </v-col>
                    <v-col
                      v-show="size3.visibility"
                      cols="12"
                      md="6"
                    >
                      <v-text-field
                        v-model="size3.total"
                        type="number"
                        label="Number of questions"
                        required
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                      cols="12"
                      md="6"
                    >
                      <v-checkbox
                        v-model="size4.visibility"
                        label="4 x 4"
                      />
                    </v-col>
                    <v-col
                      v-show="size4.visibility"
                      cols="12"
                      md="6"
                    >
                      <v-text-field
                        v-model="size4.total"
                        type="number"
                        label="Number of questions"
                        required
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <mdb-btn
                      color="danger "
                      @click.native="generateTutorial"
                    >Generate Tutorial</mdb-btn>
                  </v-row>
                </v-container>
              </v-form>
            </section>
          </section>
          <section
            v-for="(question, index) in questions"
            v-show="tutorial"
            :key="index"
            class="preview mt-5"
          >
            <h2 class="secondary-heading mb-3 text-danger">Question {{ index + 1 }}: </h2>
            <div class="lead mb-4">
              <vue-mathjax
                :formula="question.question"
                class="col-12"
              />
            </div>
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
    <div
      v-show="tutorial"
      class="icon-container"
    >
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
import { LUDecomposition } from '@/plugins/numericalAnalysis'
import { multiply } from 'mathjs'

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
      methods: ['Doolitle Factorisation', 'Crout Factorisation', 'Naive Gaussian Elimination', 'Mixed'],
      method: 'Mixed',
      problems: ['LU Decomposition only', 'Solve $Ax=b$', 'Mixed'],
      problem: 'LU Decomposition only',
      size2: { visibility: true, total: 5 },
      size3: { visibility: true, total: 5 },
      size4: { visibility: true, total: 5 },
      tutorial: false,
      showAnswers: true,
      showSteps: true,
      pdfConfig: false,
      type: 'Pdf'
    }
  },
  watch: {
    method () {
      this.hideTutorial()
    },
    'size2.visibility' () {
      this.hideTutorial()
    },
    'size3.visibility' () {
      this.hideTutorial()
    },
    'size4.visibility' () {
      this.hideTutorial()
    }
  },
  created () {
    this.renderMathJax()
  },
  mounted: function () {
    this.toggleLoader()
  },
  methods: {
    convertToTex () {
      let text = `
      \\documentclass[fleqn]{article}
      \\usepackage{amsmath}
      \\setlength{\\mathindent}{0pt}
      \\topmargin -.5in
      \\textheight 9in
      \\oddsidemargin -.25in
      \\evensidemargin -.25in
      \\textwidth 7in

      %opening
      \\title{Limits}
      \\author{https://limits.surge.sh}
      \\date{ \\today}
      \\begin{document}
      \\maketitle
      \\section*{Questions}
      \\noindent
      \\begin{enumerate}
      `
      this.questions.forEach((question, i) => {
        text += `
        \\item ${question.question.replace(/\$/g, '')} \\\\
      `
      })
      text += `\\end{enumerate}`
      if (this.showAnswers || this.showSteps) {
        text += `
          \\section*{Solutions}
          \\begin{enumerate}`
        this.questions.forEach((question, i) => {
          if (this.showAnswers) {
            text += `
              \\item{
              ${question.answer.value.replace(/\$/g, '')}
              `
            if (this.showSteps) {
              text += `
                \\subsection*{Working}
                \\noindent`
              question.working.steps.forEach((step, index) => {
                text = text + step.replace(/\$/g, '')
              })
            }
            text = text + `}`
          } else if (this.showSteps) {
            text += `
            \\item{`
            question.working.steps.forEach((step, index) => {
              text = text + step.replace(/\$/g, '')
            })
            text = text + `}`
          }
        })
        text = text + `\\end{enumerate}`
      }
      text = text + `
      \\end{document}
      `
      return text
    },
    generateTutorial () {
      this.showLoader()
      this.questions = []
      let size = 0
      if (this.size2.visibility) {
        for (let i = 0; i < this.size2.total; i++) {
          this.questions.push(this.generateQuestionAndSolution(size, 2, this.method))
          size++
        }
      }
      if (this.size3.visibility) {
        for (let i = 0; i < this.size3.total; i++) {
          this.questions.push(this.generateQuestionAndSolution(size, 3, this.method))
          size++
        }
      }
      if (this.size3.visibility) {
        for (let i = 0; i < this.size4.total; i++) {
          this.questions.push(this.generateQuestionAndSolution(size, 4, this.method))
          size++
        }
      }
      this.showTutorial()
      this.renderMathJax()
      this.toggleLoader()
    },
    generateQuestion (question) {
      let ludecomposition = new LUDecomposition()
      if (question.method === 'Doolitle Factorisation' || question.method === 'Naive Gaussian Elimination') {
        question.matrix = ludecomposition.generateDoolitleA(question.n)
        question.question = `
          Use the ${question.method} to find the $ LU $ factorisation of the matrix $ A $ in which $L$ is a unit lower
          triangular matrix and $U$ is an upper triangular matrix
          $$
          \\begin{equation*}
            A = ${ludecomposition.matrixToLatex(question.matrix)}`
      } else if (question.method === 'Crout Factorisation') {
        question.matrix = ludecomposition.generateCroutA(question.n)
        question.question = `
          Use the ${question.method} to find the $ LU $ factorisation of the matrix $ A $ in which $L$ is lower
          triangular matrix and $U$ is a unit upper triangular matrix
          $$
          \\begin{equation*}
            A = ${ludecomposition.matrixToLatex(question.matrix)}`
      }

      question.question = question.question.concat(`
          \\end{equation*}
          $$`)
      if (this.problem === 'Mixed') {
        question.solve = Math.round(Math.random()) === 0
      }
      if (this.problem === 'Solve $Ax=b$' || question.solve) {
        question.question += `
          and use the LU factorization to solve the linear system`
        let x = []
        for (let i = 0; i < question.matrix.length; i++) {
          x.push(`x_{${i}}`)
        }
        question.b = multiply(question.matrix, this.generateRandomVector(question.n))
        question.question += `
          $$
            ${ludecomposition.equationToLatex(question.matrix, x, question.b)}
          $$`
      }
      return question
    },
    generateQuestionAndSolution (index, size, method) {
      let question = {
        question: undefined,
        method: undefined,
        n: undefined,
        b: undefined,
        l: undefined,
        u: undefined,
        solve: false,
        matrix: undefined,
        working: { visibility: false, steps: [] },
        answer: { visibility: false, value: undefined },
        answerSwitchId: 'answerSwitch' + index,
        workingSwitchId: 'workingSwitch' + index
      }

      question.n = size
      if (method === 'Mixed') {
        question.method = this.methods[Math.floor(Math.random() * 3)]
      } else {
        question.method = method
      }
      if (this.problem === 'Solve $Ax=b$') {
        question.solve = true
      }

      question = this.generateQuestion(question)
      question = this.solve(question)
      this.renderMathJax()
      return question
    },
    hideLoader () {
      this.isLoading = false
    },
    hideTutorial () {
      this.tutorial = false
    },
    hidePdfConfig () {
      this.pdfConfig = false
    },
    save () {
      this.hidePdfConfig()
      let jsonData = {
        latex: this.convertToTex()
      }
      let endpoint = ''
      if (this.type === 'Pdf') {
        endpoint = 'post/donwloadPdf'
      } else if (this.type === 'Tex') {
        endpoint = 'post/donwloadTex'
      }
      this.$store.dispatch(endpoint, jsonData).then(response => {
        let url = window.URL.createObjectURL(new Blob([response.data], { type: `application/${this.type}` }))
        let fileLink = document.createElement('a')
        fileLink.href = url
        fileLink.download = `questionSolution.${this.type}`
        document.body.appendChild(fileLink)
        fileLink.click()
      }, error => {
        this.isServerSideValidated = error.response
        if (!this.isServerSideValidated) {
          this.isServerSideValidated = 'Got nothing from server. Please contact your administrator'
        }
      })
    },
    savePdf () {
      this.type = 'Pdf'
      this.showPdfConfig()
    },
    saveTex () {
      this.type = 'Tex'
      this.showPdfConfig()
    },
    showTutorial () {
      this.tutorial = true
    },
    showPdfConfig () {
      this.pdfConfig = true
    },
    showLoader () {
      this.isLoading = true
    },
    solve (question) {
      question.working.steps = []
      let ludecomposition = new LUDecomposition()
      if (question.method === 'Doolitle Factorisation') {
        question = ludecomposition.solveDoolitle(question)
      } else if (question.method === 'Crout Factorisation') {
        question = ludecomposition.solveCrout(question)
      } else if (question.method === 'Naive Gaussian Elimination') {
        question = ludecomposition.solveNaiveGauss(question)
      }
      if (question.solve) {
        question = ludecomposition.solve(question)
      }
      question.answer.value = question.working.steps[question.working.steps.length - 1]
      return question
    },

    toggleModal (title, message) {
      this.modalTitle = title
      this.modalMessage = message
      this.showModal = true
    },
    toggleLoader () {
      const vue = this
      window.MathJax.Hub.Queue(function () {
        vue.isLoading = false
      })
    },
    renderMathJax () {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, window.body])
    },
    vectorToLatex (vector) {
      let str = `\\begin{bmatrix}`
      for (let j = 0; j < vector.length; j++) {
        str += `${vector[j]} \\\\`
      }
      str = str.concat(`\\end{bmatrix}`)
      return str
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
