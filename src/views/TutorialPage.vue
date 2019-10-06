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
            ref="math"
            class="preview"
          >
            <section class="mb-5">
              <v-form v-model="valid">
                <v-container>
                  <v-row>
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
                  <v-row>
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
            <section
              v-show="tutorial"
              v-for="(question, index) in questions"
              :key="index"
              class="preview mt-5"
            >
              <h2 class="secondary-heading mb-3 text-danger">Question {{ index + 1 }}: </h2>
              <div class="lead mb-4">
                <vue-mathjax
                  id="latex_funct"
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
      size2: { visibility: true, total: 5 },
      size3: { visibility: true, total: 5 },
      size4: { visibility: true, total: 5 },
      tutorial: false
    }
  },
  created () {
    this.renderMathJax()
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
  mounted: function () {
    this.toggleLoader(false)
  },
  methods: {
    generateTutorial () {
      this.questions = []
      if (this.size2.visibility) {
        for (var i = 0; i < this.size2.total; i++) {
          this.questions.push(this.generateQuestionAndSolution(i, 2, this.method))
        }
      }
      if (this.size3.visibility) {
        for (var i = 0; i < this.size3.total; i++) {
          this.questions.push(this.generateQuestionAndSolution(i, 3, this.method))
        }
      }
      if (this.size3.visibility) {
        for (var i = 0; i < this.size4.total; i++) {
          this.questions.push(this.generateQuestionAndSolution(i, 4, this.method))
        }
      }
      this.showTutorial()
      this.renderMathJax()
      this.toggleLoader(false)
    },
    generateQuestionAndSolution (index, size, method) {
      let question = {
        question: undefined,
        method: undefined,
        n: undefined,
        matrix: undefined,
        working: { visibility: false, steps: [] },
        answer: { visibility: false, value: undefined },
        answerSwitchId: 'answerSwitch' + index,
        workingSwitchId: 'workingSwitch' + index
      }
      question.n = size
      if (method === 'Mixed') {
        question.method = this.methods[Math.round(Math.random())]
      } else {
        question.method = method
      }

      question = this.generateQuestion(question)
      question = this.solve(question)
      return question
    },
    generateQuestion (question) {
      if (question.method === 'Doolitle Factorisation') {
        question.matrix = this.generateDoolitleA(question.n)
      } else if (question.method === 'Crout Factorisation') {
        question.matrix = this.generateCroutA(question.n)
      }
      question.question = `
      Use the ${question.method} to find the $ LU $ factorisation of the matrix $ A $ in which $L$ is a unit lower
      triangular matrix and $U$ is an upper triangular matrix
      $$
      \\begin{equation*}
        A = ${this.matrixToLatex(question.matrix)}`
      question.question = question.question.concat(`
      \\end{equation*}
      $$`)
      return question
    },
    savePdf () {
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
      text += `
      \\end{enumerate}
      \\section*{Solutions}
      \\begin{enumerate}`
      this.questions.forEach((question, i) => {
        text += `
        \\item{
         ${question.answer.value.replace(/\$/g, '')}
        \\subsection*{Working}
        \\noindent
        `
        question.working.steps.forEach((step, index) => {
          text = text + step.replace(/\$/g, '')
        })
        text = text + `}`
      })
      text = text + `
      \\end{enumerate}
      \\end{document}
      `
      let jsonData = {
        latex: text
      }
      this.$store.dispatch('post/donwloadPdf', jsonData).then(response => {
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
        \\item Use the limit definition to find $\\frac{df}{dx}$ when $f(x) = ${question.funct}$ \\\\
      `
      })
      text += `
      \\end{enumerate}
      \\section*{Solutions}
      \\begin{enumerate}`
      this.questions.forEach((question, i) => {
        text += `
        \\item ${question.answer.value}
        \\subsection*{Working}
        \\noindent
        \\begin{align*} \n`
        question.working.steps.forEach((step, index) => {
          text = text + step
        })
        text += `\\end{align*}`
      })
      text = text + `
      \\end{enumerate}
      \\end{document}
      `
      let jsonData = {
        latex: text
      }
      this.$store.dispatch('post/donwloadTex', jsonData).then(response => {
        let url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/tex' }))
        let fileLink = document.createElement('a')
        fileLink.href = url
        fileLink.download = 'questionSolution.tex'
        document.body.appendChild(fileLink)
        fileLink.click()
      }, error => {
        this.isServerSideValidated = error.response
        if (!this.isServerSideValidated) {
          this.isServerSideValidated = 'Got nothing from server. Please contact your administrator'
        }
      })
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
    solve (question) {
      question.working.steps = []
      let l = this.generateEmptyMatrix(question.n)
      let u = this.generateEmptyMatrix(question.n)
      if (question.method === 'Doolitle Factorisation') {
        for (let i = 0; i < question.n; i++) {
          for (let j = 0; j < question.n; j++) {
            if (i === j) {
              l[i][j] = '1'
              u[i][j] = `u_{${i + 1},${j + 1}}`
            } else if (i > j) {
              l[i][j] = `l_{${i + 1},${j + 1}}`
              u[i][j] = '0'
            } else if (i < j) {
              l[i][j] = '0'
              u[i][j] = `u_{${i + 1},${j + 1}}`
            }
          }
        }
        question.working.steps.push(` Denote the L and U matrices by 
        $$\\\\
        \\begin{equation*}
            L = ${this.matrixToLatex(l)}  \\hspace{0.35cm} and \\hspace{0.5cm} U = ${this.matrixToLatex(u)}
        \\end{equation*}
       $$`)
        question.working.steps.push(`so that the equation $LU = A$ is represented as 
        $$\\\\
        \\begin{equation*}
            ${this.matrixToLatex(l)}${this.matrixToLatex(u)} = ${this.matrixToLatex(question.matrix)}
        \\end{equation*}
       $$`)
        let temp = []
        for (let i = 0; i < question.n; i++) {
          for (let k = 0; k < question.n; k++) {
            let str = ''
            for (let j = 0; j < question.n; j++) {
              if (u[j][k] !== '0' && l[i][j] !== '0') {
                if (str === '') {
                  if (l[k][j] === '1') {
                    str = str + `${u[j][i]}`
                  } else {
                    str = str + `${u[j][i]} ${l[k][j]}`
                  }
                } else {
                  if (l[k][j] === '1') {
                    str = str + `+${u[j][i]}`
                  } else {
                    str = str + `+${u[j][i]} ${l[k][j]}`
                  }
                }
              }
            }
            temp.push(str)
          }
        }
        let arr = []
        for (let k = 0; k < question.n; k++) {
          for (let j = 0; j < question.n; j++) {
            arr.push(question.matrix[j][k])
          }
        }
        for (let i = 0; i < temp.length; i++) {
          if (temp[i] !== '') {
            temp[i] = temp[i] + `&=${arr[i]}`
          }
        }
        question.working.steps.push(`Multiplying the matrix equation and solving for the unknowns in succession gives`)
        if (question.n === 2) {
          u[0][0] = question.matrix[0][0]
          u[0][1] = question.matrix[0][1]
          for (let i = 0; i < temp.length; i++) {
            if (temp[i] !== '') {
              if (i === 0) {
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\end{align*}$$`)
              } else if (i === 1) {
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ l_{2,1} = ${question.matrix[1][0] / question.matrix[0][0]} \\end{align*}$$`)
                l[1][0] = question.matrix[1][0] / question.matrix[0][0]
              } else if (i === 2) {
                question.working.steps.push(`$$\\begin{align*} ${temp[i]} \\end{align*}$$`)
              } else if (i === 3) {
                question.working.steps.push(`$$\\begin{align*} ${temp[i]} \\\\
                  ${question.matrix[0][1]}\\cdot${question.matrix[1][0] / question.matrix[0][0]} + u_{2,2} &= ${question.matrix[1][1]} \\\\
                  u_{2,2} &= ${question.matrix[1][1] - question.matrix[0][1] * question.matrix[1][0] / question.matrix[0][0]}
                \\end{align*}$$`)
                u[1][1] = question.matrix[1][1] - question.matrix[0][1] * question.matrix[1][0] / question.matrix[0][0]
              }
            }
          }
        } else if (question.n === 3) {
          u[0][0] = question.matrix[0][0]
          u[0][1] = question.matrix[0][1]
          u[0][2] = question.matrix[0][2]
          for (let i = 0; i < temp.length; i++) {
            if (temp[i] !== '') {
              if (i === 0 || i === 3 || i === 6) {
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\end{align*}$$`)
              } else if (i === 1) {
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ l_{2,1} &= ${question.matrix[1][0] / question.matrix[0][0]} 
                \\end{align*}$$`)
                l[1][0] = question.matrix[1][0] / question.matrix[0][0]
              } else if (i === 2) {
                question.working.steps.push(`$$ \\begin{align*}  ${temp[i]} \\\\ l_{3,1} &= ${question.matrix[2][0] / question.matrix[0][0]} 
                \\end{align*}$$`)
                l[2][0] = question.matrix[2][0] / question.matrix[0][0]
              } else if (i === 4) {
                question.working.steps.push(`$$  \\begin{align*} ${temp[i]} \\\\
                  ${u[0][1]} \\cdot ${l[1][0]} + u_{2,2} &= ${question.matrix[1][1]} \\\\
                  u_{2,2} &= ${question.matrix[1][1] - u[0][1] * l[1][0]} 
                \\end{align*}$$`)
                u[1][1] = question.matrix[1][1] - u[0][1] * l[1][0]
              } else if (i === 5) {
                let lhs = question.matrix[2][1]
                question.working.steps.push(`$$ \\begin{align*}  ${temp[i]} \\\\
                  ${u[0][1]} \\cdot${l[2][0]} + ${u[1][1]}\\cdot l_{3,2} &= ${lhs} \\\\
                  ${u[1][1]} \\cdot l_{3,2} &= ${lhs - u[0][1] * l[2][0]} \\\\
                  l_{3,2} &= ${(lhs - u[0][1] * l[2][0]) / u[1][1]}
                \\end{align*}$$`)
                l[2][1] = (lhs - u[0][1] * l[2][0]) / u[1][1]
              } else if (i === 7) {
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\
                  ${u[0][2]} \\cdot \\ ${l[1][0]} + u_{2,3} &= ${question.matrix[1][2]} \\\\
                  u_{2,3} &= ${question.matrix[1][2] - u[0][2] * l[1][0]} 
                \\end{align*}$$`)
                u[1][2] = question.matrix[1][2] - u[0][2] * l[1][0]
              } else {
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\  
                ${u[0][2]} \\cdot ${l[2][0]} + ${u[1][2]} \\cdot ${l[2][1]} + u_{3,3} &= ${question.matrix[2][2]} \\\\
                u_{3,3} &= ${question.matrix[2][2] - u[0][2] * l[2][0] - u[1][2] * l[2][1]}
                \\end{align*}$$`)
                u[2][2] = question.matrix[2][2] - u[0][2] * l[2][0] - u[1][2] * l[2][1]
              }
            }
          }
        } else if (question.n === 4) {
          u[0][0] = question.matrix[0][0]
          u[0][1] = question.matrix[0][1]
          u[0][2] = question.matrix[0][2]
          u[0][3] = question.matrix[0][3]
          for (let i = 0; i < temp.length; i++) {
            if (temp[i] !== '') {
              if (i === 0 || i === 4 || i === 8 || i === 12) {
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\end{align*} $$`)
              } else if (i === 1) {
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ l_{2,1} &= ${question.matrix[1][0] / question.matrix[0][0]} 
                \\end{align*}$$`)
                l[1][0] = question.matrix[1][0] / question.matrix[0][0]
              } else if (i === 2) {
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ l_{3,1} &= ${question.matrix[2][0] / question.matrix[0][0]} \\end{align*}$$`)
                l[2][0] = question.matrix[2][0] / question.matrix[0][0]
              } else if (i === 3) {
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ l_{4,1} &= ${question.matrix[3][0] / question.matrix[0][0]} \\end{align*}$$`)
                l[3][0] = question.matrix[3][0] / question.matrix[0][0]
              } else if (i === 5) {
                question.working.steps.push(`$$  \\begin{align*} ${temp[i]} \\\\
                  ${u[0][1]} \\cdot ${l[1][0]} + u_{2,2} &= ${question.matrix[1][1]} \\\\
                  u_{2,2} &= ${question.matrix[1][1] - u[0][1] * l[1][0]} 
                \\end{align*}$$`)
                u[1][1] = question.matrix[1][1] - u[0][1] * l[1][0]
              } else if (i === 6) {
                let lhs = question.matrix[2][1]
                question.working.steps.push(`$$ \\begin{align*}  ${temp[i]} \\\\
                  ${u[0][1]} \\cdot ${l[2][0]} + ${u[1][1]}\\cdot l_{3,2} &= ${lhs} \\\\
                  ${u[1][1]} \\cdot l_{3,2} &= ${lhs - u[0][1] * l[2][0]} \\\\
                  l_{3,2} &= ${(lhs - u[0][1] * l[2][0]) / u[1][1]} 
                \\end{align*}$$`)
                l[2][1] = (lhs - u[0][1] * l[2][0]) / u[1][1]
              } else if (i === 7) {
                let lhs = question.matrix[3][1]
                question.working.steps.push(`$$ \\begin{align*}  ${temp[i]} \\\\
                  ${u[0][1]} \\cdot ${l[3][0]} + ${u[1][1]}\\cdot l_{4,2} &= ${lhs} \\\\
                  ${u[1][1]} \\cdot l_{4,2} &= ${lhs - u[0][1] * l[3][0]} \\\\
                  l_{4,2} &= ${(lhs - u[0][1] * l[3][0]) / u[1][1]} 
                \\end{align*}$$`)
                l[3][1] = (lhs - u[0][1] * l[3][0]) / u[1][1]
              } else if (i === 9) {
                question.working.steps.push(`$$  \\begin{align*} ${temp[i]} \\\\
                  ${u[0][2]} \\cdot ${l[1][0]} + u_{2,3} &= ${question.matrix[1][2]} \\\\
                  u_{2,3} &= ${question.matrix[1][2] - u[0][2] * l[1][0]}
                \\end{align*}$$`)
                u[1][2] = question.matrix[1][2] - u[0][2] * l[1][0]
              } else if (i === 10) {
                let lhs = question.matrix[2][2]
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ 
                 ${u[0][2]} \\cdot ${l[2][0]} + ${u[1][2]} \\cdot ${l[2][1]} + u_{3,3} = ${lhs} \\\\
                u_{3,3} = ${lhs - u[0][2] * l[2][0] - u[1][2] * l[2][1]}
                \\end{align*}$$`)
                u[2][2] = lhs - u[0][2] * l[2][0] - u[1][2] * l[2][1]
              } else if (i === 11) {
                let lhs = question.matrix[3][2]
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ 
                 ${u[0][2]} \\cdot ${l[3][0]} + ${u[1][2]} \\cdot ${l[3][1]} + ${u[2][2]} \\cdot l_{4,3} &= ${lhs} \\\\
                ${u[2][2]} \\cdot l_{4,3} &= ${lhs - u[0][2] * l[3][0] - u[1][2] * l[3][1]} \\\\
                l_{4,3} &= ${(lhs - u[0][2] * l[3][0] - u[1][2] * l[3][1]) / u[2][2]}
                \\end{align*}$$`)
                l[3][2] = (lhs - u[0][2] * l[3][0] - u[1][2] * l[3][1]) / u[2][2]
              } else if (i === 13) {
                question.working.steps.push(`$$  \\begin{align*} ${temp[i]} \\\\
                  ${u[0][3]} \\cdot ${l[1][0]} + u_{2,4} &= ${question.matrix[1][1]} \\\\
                  u_{2,4} &= ${question.matrix[1][3] - u[0][3] * l[1][0]} 
                \\end{align*}$$`)
                u[1][3] = question.matrix[1][3] - u[0][3] * l[1][0]
              } else if (i === 14) {
                let lhs = question.matrix[2][3]
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ 
                 ${u[0][3]} \\cdot ${l[2][0]} + ${u[1][3]} \\cdot ${l[2][1]} + u_{3,4} &= ${lhs} \\\\
                u_{3,4} &= ${lhs - u[0][3] * l[2][0] - u[1][3] * l[2][1]}
                \\end{align*}$$`)
                u[2][3] = lhs - u[0][3] * l[2][0] - u[1][3] * l[2][1]
              } else if (i === 15) {
                let lhs = question.matrix[3][3]
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ 
                 ${u[0][3]} \\cdot ${l[3][0]} + ${u[1][3]} \\cdot ${l[3][2]} + ${u[2][3]} \\cdot ${l[3][2]}+ u_{4,4} &= ${lhs} \\\\
                u_{4,4} &= ${lhs - u[0][3] * l[3][0] - u[1][3] * l[3][1] - u[2][3] * l[3][2]}
                \\end{align*}$$`)
                u[3][3] = lhs - u[0][3] * l[3][0] - u[1][3] * l[3][1] - u[2][3] * l[3][2]
              }
            }
          }
        }
      } else if (question.method === 'Crout Factorisation') {
        for (let i = 0; i < question.n; i++) {
          for (let j = 0; j < question.n; j++) {
            if (i === j) {
              u[i][j] = '1'
              l[i][j] = `l_{${i + 1},${j + 1}}`
            } else if (i > j) {
              l[i][j] = `l_{${i + 1},${j + 1}}`
              u[i][j] = '0'
            } else if (i < j) {
              l[i][j] = '0'
              u[i][j] = `u_{${i + 1},${j + 1}}`
            }
          }
        }
        question.working.steps.push(` Denote the L and U matrices by 
        $$\\\\
        \\begin{equation*}
            L = ${this.matrixToLatex(l)}  \\hspace{0.35cm} and \\hspace{0.5cm} U = ${this.matrixToLatex(u)}
        \\end{equation*}
       $$`)
        question.working.steps.push(`so that the equation $LU = A$ is represented as 
        $$\\\\
        \\begin{equation*}
            ${this.matrixToLatex(l)}${this.matrixToLatex(u)} = ${this.matrixToLatex(question.matrix)}
        \\end{equation*}
       $$`)
        let temp = []
        for (let i = 0; i < question.n; i++) {
          for (let k = 0; k < question.n; k++) {
            let str = ''
            for (let j = 0; j < question.n; j++) {
              if (u[j][k] !== '0' && l[i][j] !== '0') {
                if (str === '') {
                  if (u[j][i] === '1') {
                    str = str + `${l[k][j]}`
                  } else {
                    str = str + `${u[j][i]} ${l[k][j]}`
                  }
                } else {
                  if (u[j][i] === '1') {
                    str = str + `+${l[k][j]}`
                  } else {
                    str = str + `+${u[j][i]} ${l[k][j]}`
                  }
                }
              }
            }
            temp.push(str)
          }
        }
        let arr = []
        for (let k = 0; k < question.n; k++) {
          for (let j = 0; j < question.n; j++) {
            arr.push(question.matrix[j][k])
          }
        }
        for (let i = 0; i < temp.length; i++) {
          if (temp[i] !== '') {
            temp[i] = temp[i] + `&=${arr[i]}`
          }
        }
        question.working.steps.push(`Multiplying the matrix equation and solving for the unknowns in succession gives`)
        if (question.n === 2) {
          l[0][0] = question.matrix[0][0]
          l[1][0] = question.matrix[1][0]
          for (let i = 0; i < temp.length; i++) {
            if (temp[i] !== '') {
              if (i === 0 || i === 1) {
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\end{align*}$$`)
              } else if (i === 2) {
                question.working.steps.push(`$$\\begin{align*} ${temp[i]} \\\\
                ${l[0][0]} \\cdot u_{1,2} &= ${question.matrix[0][1]} \\\\
                u_{1,2} &= ${question.matrix[0][1] / l[0][0]}
                \\end{align*}$$`)
                u[0][1] = question.matrix[0][1] / l[0][0]
              } else if (i === 3) {
                question.working.steps.push(`$$\\begin{align*} ${temp[i]} \\\\
                  ${u[0][1]}\\cdot${l[1][0]} + l_{2,2} &= ${question.matrix[1][1]} \\\\
                  l_{2,2} &= ${question.matrix[1][1] - u[0][1] * l[1][0]}
                \\end{align*}$$`)
                l[1][1] = question.matrix[1][1] - u[0][1] * l[1][0]
              }
            }
          }
        } else if (question.n === 3) {
          l[0][0] = question.matrix[0][0]
          l[1][0] = question.matrix[1][0]
          l[2][0] = question.matrix[1][0]
          for (let i = 0; i < temp.length; i++) {
            if (temp[i] !== '') {
              if (i === 0 || i === 1 || i === 2) {
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\end{align*}$$`)
              } else if (i === 3) {
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]}  \\\\
                ${l[0][0]} \\cdot u_{1,2} &= ${question.matrix[0][1]} \\\\
                u_{1,2} &= ${question.matrix[0][1] / l[0][0]} 
                \\end{align*}$$`)
                u[0][1] = question.matrix[0][1] / l[0][0]
              } else if (i === 4) {
                question.working.steps.push(`$$ \\begin{align*}  ${temp[i]} \\\\ 
                ${u[0][1]} \\cdot ${l[1][0]} + l_{2,2} &= ${question.matrix[1][1]} \\\\
                l_{2,2} &= ${question.matrix[1][1] - u[0][1] * l[1][0]}
                \\end{align*}$$`)
                l[1][1] = question.matrix[1][1] - u[0][1] * l[1][0]
              } else if (i === 5) {
                question.working.steps.push(`$$ \\begin{align*}  ${temp[i]} \\\\ 
                ${u[0][1]} \\cdot ${l[2][0]} + l_{3,2} &= ${question.matrix[2][1]} \\\\
                l_{3,2} &= ${question.matrix[2][1] - u[0][1] * l[2][0]}
                \\end{align*}$$`)
                l[2][1] = question.matrix[2][1] - u[0][1] * l[2][0]
              } else if (i === 6) {
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]}  \\\\
                ${l[0][0]} \\cdot u_{1,3} &= ${question.matrix[0][2]} \\\\
                u_{1,3} &= ${question.matrix[0][2] / l[0][0]} 
                \\end{align*}$$`)
                u[0][2] = question.matrix[0][2] / l[0][0]
              } else if (i === 7) {
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\
                  ${u[0][2]} \\cdot \\ ${l[1][0]} + ${l[1][1]} \\cdot u_{2,3} &= ${question.matrix[1][2]} \\\\
                  ${l[1][1]} \\cdot u_{2,3} &= ${question.matrix[1][2] - u[0][2] * l[1][0]} \\\\
                  u_{2,3} &= ${(question.matrix[1][2] - u[0][2] * l[1][0]) / l[1][1]} 
                \\end{align*}$$`)
                u[1][2] = (question.matrix[1][2] - u[0][2] * l[1][0]) / l[1][1]
              } else {
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\  
                ${u[0][2]} \\cdot ${l[2][0]} + ${u[1][2]} \\cdot ${l[2][1]} + u_{3,3} &= ${question.matrix[2][2]} \\\\
                l_{3,3} &= ${question.matrix[2][2] - u[0][2] * l[2][0] - u[1][2] * l[2][1]}
                \\end{align*}$$`)
                l[2][2] = question.matrix[2][2] - u[0][2] * l[2][0] - u[1][2] * l[2][1]
              }
            }
          }
        } else if (question.n === 4) {
          l[0][0] = question.matrix[0][0]
          l[1][0] = question.matrix[1][0]
          l[2][0] = question.matrix[2][0]
          l[3][0] = question.matrix[3][0]
          for (let i = 0; i < temp.length; i++) {
            if (temp[i] !== '') {
              if (i === 0 || i === 1 || i === 2 || i === 3) {
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\end{align*} $$`)
              } else if (i === 4) {
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ 
                u_{1,2} &= ${question.matrix[0][1] / l[0][0]}
                \\end{align*}$$`)
                u[0][1] = question.matrix[0][1] / l[0][0]
              } else if (i === 5) {
                question.working.steps.push(`$$  \\begin{align*} ${temp[i]} \\\\
                  ${u[0][1]} \\cdot ${l[1][0]} + l_{2,2} &= ${question.matrix[1][1]} \\\\
                  l_{2,2} &= ${question.matrix[1][1] - u[0][1] * l[1][0]} 
                \\end{align*}$$`)
                l[1][1] = question.matrix[1][1] - u[0][1] * l[1][0]
              } else if (i === 6) {
                let lhs = question.matrix[2][1]
                question.working.steps.push(`$$ \\begin{align*}  ${temp[i]} \\\\
                  ${u[0][1]} \\cdot ${l[2][0]} + l_{3,2} &= ${lhs} \\\\
                  l_{3,2} &= ${lhs - u[0][1] * l[2][0]} \\\\
                \\end{align*}$$`)
                l[2][1] = (lhs - u[0][1] * l[2][0])
              } else if (i === 7) {
                let lhs = question.matrix[3][1]
                question.working.steps.push(`$$ \\begin{align*}  ${temp[i]} \\\\
                  ${u[0][1]} \\cdot ${l[3][0]} + l_{4,2} &= ${lhs} \\\\
                  l_{4,2} &= ${lhs - u[0][1] * l[3][0]} \\\\ 
                \\end{align*}$$`)
                l[3][1] = (lhs - u[0][1] * l[3][0])
              } else if (i === 8) {
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ 
                u_{1,3} &= ${question.matrix[0][2] / l[0][0]}
                \\end{align*}$$`)
                u[0][2] = question.matrix[0][2] / l[0][0]
              } else if (i === 9) {
                question.working.steps.push(`$$  \\begin{align*} ${temp[i]} \\\\
                  ${u[0][2]} \\cdot ${l[1][0]} + u_{2,3} \\cdot ${l[1][1]} &= ${question.matrix[1][2]} \\\\
                  ${l[1][1]} \\cdot  u_{2,3} &= ${question.matrix[1][2] - u[0][2] * l[1][0]} \\\\
                  u_{2,3} &= ${(question.matrix[1][2] - u[0][2] * l[1][0]) / l[1][1]}
                \\end{align*}$$`)
                u[1][2] = (question.matrix[1][2] - u[0][2] * l[1][0]) / l[1][1]
              } else if (i === 10) {
                let lhs = question.matrix[2][2]
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ 
                 ${u[0][2]} \\cdot ${l[2][0]} + ${u[1][2]} \\cdot ${l[2][1]} + l_{3,3} = ${lhs} \\\\
                l_{3,3} = ${lhs - u[0][2] * l[2][0] - u[1][2] * l[2][1]}
                \\end{align*}$$`)
                l[2][2] = lhs - u[0][2] * l[2][0] - u[1][2] * l[2][1]
              } else if (i === 11) {
                let lhs = question.matrix[3][2]
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ 
                 ${u[0][2]} \\cdot ${l[3][0]} + ${u[1][2]} \\cdot ${l[3][1]} + l_{4,3} &= ${lhs} \\\\
                l_{4,3} &= ${lhs - u[0][2] * l[3][0] - u[1][2] * l[3][1]} \\\\
                \\end{align*}$$`)
                l[3][2] = lhs - u[0][2] * l[3][0] - u[1][2] * l[3][1]
              } else if (i === 12) {
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ 
                u_{1,4} &= ${question.matrix[0][3] / l[0][0]}
                \\end{align*}$$`)
                u[0][3] = question.matrix[0][3] / l[0][0]
              } else if (i === 13) {
                question.working.steps.push(`$$  \\begin{align*} ${temp[i]} \\\\
                  ${u[0][3]} \\cdot ${l[1][0]} + ${l[1][1]} \\cdot u_{2,4} &= ${question.matrix[1][3]} \\\\
                  ${l[1][1]} \\cdot u_{2,4} &= ${question.matrix[1][3] - u[0][3] * l[1][0]} \\\\
                  u_{2,4} &= ${(question.matrix[1][3] - u[0][3] * l[1][0]) / l[1][1]}
                \\end{align*}$$`)
                u[1][3] = (question.matrix[1][3] - u[0][3] * l[1][0]) / l[1][1]
              } else if (i === 14) {
                let lhs = question.matrix[2][3]
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ 
                ${u[0][3]} \\cdot ${l[2][0]} + ${u[1][3]} \\cdot ${l[2][1]} + ${l[2][2]}  \\cdot u_{3,4} &= ${lhs} \\\\
                ${l[2][2]}  \\cdot u_{3,4} &= ${lhs - u[0][3] * l[2][0] - u[1][3] * l[2][1]} \\\\
                u_{3,4} &= ${(lhs - u[0][3] * l[2][0] - u[1][3] * l[2][1]) / l[2][2]}
                \\end{align*}$$`)
                u[2][3] = (lhs - u[0][3] * l[2][0] - u[1][3] * l[2][1]) / l[2][2]
              } else if (i === 15) {
                let lhs = question.matrix[3][3]
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ 
                 ${u[0][3]} \\cdot ${l[3][0]} + ${u[1][3]} \\cdot ${l[3][1]} + ${u[2][3]} \\cdot ${l[3][2]}+ l_{4,4} &= ${lhs} \\\\
                l_{4,4} &= ${lhs - u[0][3] * l[3][0] - u[1][3] * l[3][1] - u[2][3] * l[3][2]}
                \\end{align*}$$`)
                l[3][3] = lhs - u[0][3] * l[3][0] - u[1][3] * l[3][1] - u[2][3] * l[3][2]
              }
            }
          }
        }
      }

      question.working.steps.push(`Therefore we have 
        $$\\\\
          \\begin{equation*}
            L = ${this.matrixToLatex(l)} \\hspace{ 0.2cm } and \\hspace{ 0.2cm } U = ${this.matrixToLatex(u)}
          \\end{equation*}
       $$`)
      question.answer.value = `
        $$
          \\begin{equation*}
            L = ${this.matrixToLatex(l)}\\hspace{ 0.2cm } and \\hspace{ 0.2cm} U = ${this.matrixToLatex(u)}
          \\end{equation*}
        $$`
      return question
    },
    generateEmptyMatrix (n) {
      let emptyMatrix = []
      for (let i = 0; i < n; i++) {
        let row = Array(n - 1).fill(0)
        emptyMatrix.push(row)
      }
      return emptyMatrix
    },
    generateDoolitleA (n) {
      let l = this.generateMatrix(n)
      let u = this.generateMatrix(n)
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (i === j) {
            l[i][j] = 1
          } else if (j > i) {
            l[i][j] = 0
          } else if (j < i) {
            u[i][j] = 0
          }
        }
      }
      return multiply(l, u)
    },
    generateCroutA (n) {
      let l = this.generateMatrix(n)
      let u = this.generateMatrix(n)
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (i === j) {
            u[i][j] = 1
          } else if (i > j) {
            u[i][j] = 0
          } else if (j > i) {
            l[i][j] = 0
          }
        }
      }
      return multiply(l, u)
    },
    getRandomInt (max) {
      let int = Math.floor(Math.random() * Math.floor(max - 1) + 1)
      let sign = Math.random()
      if (sign === 1) {
        return -1 * int
      } else {
        return int
      }
    },
    generateMatrix (n) {
      let matrix = []
      for (let i = 0; i < n; i++) {
        let t = []
        for (let j = 0; j < n; j++) {
          t.push(this.getRandomInt(9))
        }
        matrix.push(t)
      }
      return matrix
    },
    matrixToLatex (matrix) {
      let str = `\\begin{pmatrix}`
      for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
          if (j === 0) {
            str = str.concat(matrix[i][j])
          } else {
            str = str.concat('&' + matrix[i][j])
          }
        }
        str = str.concat('\\\\')
      }
      str = str.concat(`\\end{pmatrix}`)
      return str
    },
    hideTutorial () {
      this.tutorial = false
    },
    showTutorial () {
      this.tutorial = true
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
