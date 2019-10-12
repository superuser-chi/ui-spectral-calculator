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
              height=128
              width=128
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
import { evaluate, multiply, subtract, inv, lsolve, usolve } from 'mathjs'

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
    convertSolutionToLU (solutions, n, l, u) {
      for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
          solutions.forEach(s => {
            if (s.str === `u_\\{${i},${j}\\}`) {
              u[i - 1][j - 1] = s.value
            } else if (s.str === `l_\\{${i},${j}\\}`) {
              l[i - 1][j - 1] = s.value
            }
          })
        }
      }
      return { l: l, u: u }
    },
    evaluateKnowns (equation) {
      let terms = this.findTerms(equation)
      let result = ''
      let buffer = []

      for (let i = 0; i < terms.length; i++) {
        if (this.findUnknowns(terms[i]).length === 0) {
          terms[i] = terms[i].replace(/\\cdot/, '*')
          buffer.push(evaluate(terms[i]))
        } else {
          result = `${buffer.filter(n => n !== 0).reduce((a, b) => a + b, 0)}`
          if (result.trim() === '0') {
            result = `${terms[i]}`
          } else {
            result = `${result} ${terms[i]}`
          }
          buffer = []
        }
      }
      return result
    },
    findTerms (equation) {
      let operators = ['+', '-', '*', '/']
      let terms = []
      let termBuffer = ''
      for (let i = 0; i <= equation.length; i++) {
        if (operators.includes(equation[i])) {
          terms.push(termBuffer)
          termBuffer = `${equation[i]}`
        } else if (i === equation.length) {
          terms.push(termBuffer)
        } else {
          termBuffer = termBuffer.concat(equation[i])
        }
      }
      return terms
    },
    findVariables (equation) {
      let temp = this.findTerms(equation)
      let result = []
      for (let i = 0; i < temp.length; i++) {
        let nodes = temp[i].split('\\cdot')
        nodes.forEach(n => { result.push(n.trim()) })
      }
      return result
    },
    findRhsAndLhs (equation, splitter = '&=') {
      let nodes = equation.split(splitter)
      if (nodes.length === 2) {
        return { lhs: nodes[0], rhs: nodes[1] }
      } else {
        return { lhs: 'none', rhs: 'none' }
      }
    },
    findUnknowns (equation) {
      return this.findVariables(equation).filter(n => isFinite(n) === false)
    },
    findUnknownTerms (equation) {
      return this.findTerms(equation).filter(term => term.includes(this.findUnknowns(equation)))
    },
    equationToLatex (A, x, b) {
      let str = '\\begin{align*} \\\\'
      for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < A[i].length; j++) {
          if (j === 0) {
            if (A[i][j] === 1) {
              str += `${x[j]}`
            } else {
              str += `${A[i][j]} ${x[j]}`
            }
          } else {
            str += `+ ${A[i][j]}${x[j]}`
          }
        }
        str = str.concat(`&= ${b[i]}\\\\`)
      }
      str = str.concat(`\\end{align*}`)
      return str
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
    generateQuestionAndSolution (index, size, method) {
      let question = {
        question: undefined,
        method: undefined,
        n: undefined,
        b: undefined,
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
    generateQuestion (question) {
      if (question.method === 'Doolitle Factorisation' || question.method === 'Naive Gaussian Elimination') {
        question.matrix = this.generateDoolitleA(question.n)
        question.question = `
        Use the ${question.method} to find the $ LU $ factorisation of the matrix $ A $ in which $L$ is a unit lower
        triangular matrix and $U$ is an upper triangular matrix
        $$
        \\begin{equation*}
          A = ${this.matrixToLatex(question.matrix)}`
      } else if (question.method === 'Crout Factorisation') {
        question.matrix = this.generateCroutA(question.n)
        question.question = `
        Use the ${question.method} to find the $ LU $ factorisation of the matrix $ A $ in which $L$ is lower
        triangular matrix and $U$ is a unit upper triangular matrix
        $$
        \\begin{equation*}
          A = ${this.matrixToLatex(question.matrix)}`
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
          ${this.equationToLatex(question.matrix, x, question.b)}
        $$`
      }
      return question
    },
    generateEmptyMatrix (n) {
      let emptyMatrix = []
      for (let i = 0; i < n; i++) {
        let row = Array(n).fill(0)
        emptyMatrix.push(row)
      }
      return emptyMatrix
    },
    generateIdentityMatrix (n) {
      let matrix = this.generateEmptyMatrix(n)
      for (let i = 0; i < n; i++) {
        matrix[i][i] = 1
      }
      return matrix
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
        return -int
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
    generateRandomVector (n, max = 5) {
      let vector = []
      for (let j = 0; j < n; j++) {
        vector.push(this.getRandomInt(max))
      }
      return vector
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
    makeSubject (equation) {
      let result = {}
      if (this.findTerms(equation).length === 1) {
        let temp = this.findRhsAndLhs(equation)
        if (temp.lhs.includes('\\cdot')) {
          let term = temp.lhs.split('\\cdot')
          let known = term.filter(n => isFinite(n))
          let unknown = term.filter(n => isFinite(n) === false)
          result = { latex: `${unknown} &=  \\frac{${temp.rhs}}{${known}}`, str: `${unknown} =  ${temp.rhs}/${known}` }
        } else {
          result = { latex: equation, str: equation.replace('&=', '=') }
          console.log(result)
        }
      } else if (this.findTerms(equation).length === 2) {
        console.log('look ive come here, suprise isnt it?')
        let temp = this.findRhsAndLhs(equation)
        let term = temp.lhs.split('+')
        let known = term.filter(n => isFinite(n))
        let unknown = term.filter(n => isFinite(n) === false)
        result = { latex: `${unknown} &=  ${temp.rhs}-${known}`, str: `${unknown} =  ${temp.rhs}-${known}` }
        if (result.str.includes('\\cdot')) {
          result = `${unknown}&=${evaluate(temp.rhs + '-' + known)}`
          result = this.makeSubject(result)
        }
      }
      return result
    },
    makeRegexFriendly (equation) {
      return equation.replace(/\{/g, '\\{').replace(/\}/g, '\\}')
    },
    matrixToLatex (matrix, brackets = 'pmatrix') {
      let str = `\\begin{${brackets}}`
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
      str = str.concat(`\\end{${brackets}}`)
      return str
    },
    select () {
      this.$nextTick(() => {
        window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, this.$refs.typeOfProblem])
      })
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
        \\begin{equation}
            L = ${this.matrixToLatex(l)}  \\hspace{0.35cm} and \\hspace{0.5cm} U = ${this.matrixToLatex(u)}
        \\end{equation}
       $$`)
        question.working.steps.push(`so that the equation $LU = A$ is represented as
        $$\\\\
        \\begin{equation}
            ${this.matrixToLatex(l)}${this.matrixToLatex(u)} = ${this.matrixToLatex(question.matrix)}
        \\end{equation}
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
                    str = str + `${u[j][i]} \\cdot ${l[k][j]}`
                  }
                } else {
                  if (l[k][j] === '1') {
                    str = str + `+${u[j][i]}`
                  } else {
                    str = str + `+${u[j][i]} \\cdot ${l[k][j]}`
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
        let solutions = []
        for (let i = 0; i < question.n; i++) {
          let s = { str: `u_\\{1,${i + 1}\\}`, value: question.matrix[0][i] }
          solutions.push(s)
        }
        for (let i = 0; i < temp.length; i++) {
          if (temp[i] !== '') {
            if (i % question.n === 0) {
              question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\end{align*}$$`)
            } else {
              let t = temp[i]

              for (let j = 0; j < solutions.length; j++) {
                t = this.substitute(t, solutions[j].str, solutions[j].value)
              }

              let equation = this.findRhsAndLhs(t)
              if (this.findUnknowns(equation.lhs).length === 1) {
                equation = this.makeSubject(this.evaluateKnowns(t))
                let value = evaluate(this.findRhsAndLhs(equation.str, '=').rhs)
                let term = this.findRhsAndLhs(equation.latex).lhs.trim()
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\
                    ${t} \\\\ ${this.evaluateKnowns(t)} \\\\ ${equation.latex} \\\\
                    ${term} &= ${value}\\end{align*}$$`)
                solutions.push({ str: term.replace(/\{/g, '\\{').replace(/\}/g, '\\}'), value: value })
              } else {
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ ${t} \\end{align*}$$`)
              }
            }
          }
        }
        let result = this.convertSolutionToLU(solutions, question.n, l, u)
        l = result.l
        u = result.u
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
        \\begin{equation}
            L = ${this.matrixToLatex(l)}  \\hspace{0.35cm} and \\hspace{0.5cm} U = ${this.matrixToLatex(u)}
        \\end{equation}
       $$`)
        question.working.steps.push(`so that the equation $LU = A$ is represented as
        $$\\\\
        \\begin{equation}
            ${this.matrixToLatex(l)}${this.matrixToLatex(u)} = ${this.matrixToLatex(question.matrix)}
        \\end{equation}
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
                    str = str + `${u[j][i]} \\cdot ${l[k][j]}`
                  }
                } else {
                  if (u[j][i] === '1') {
                    str = str + `+${l[k][j]}`
                  } else {
                    str = str + `+${u[j][i]} \\cdot ${l[k][j]}`
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
        let solutions = []
        for (let i = 0; i < question.n; i++) {
          let s = { str: `l_\\{${i + 1},1\\}`, value: question.matrix[i][0] }
          solutions.push(s)
        }
        for (let i = 0; i < temp.length; i++) {
          if (temp[i] !== '') {
            if (i < question.n) {
              question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\end{align*}$$`)
            } else {
              let t = temp[i]

              for (let j = 0; j < solutions.length; j++) {
                t = this.substitute(t, solutions[j].str, solutions[j].value)
              }

              let equation = this.findRhsAndLhs(t)
              if (this.findUnknowns(equation.lhs).length === 1) {
                equation = this.makeSubject(this.evaluateKnowns(t))
                let value = evaluate(this.findRhsAndLhs(equation.str, '=').rhs)
                let term = this.findRhsAndLhs(equation.latex).lhs.trim()
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\
                    ${t} \\\\ ${this.evaluateKnowns(t)} \\\\ ${equation.latex} \\\\
                    ${term} &= ${value}\\end{align*}$$`)
                solutions.push({ str: term.replace(/\{/g, '\\{').replace(/\}/g, '\\}'), value: value })
              } else {
                question.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ ${t} \\end{align*}$$`)
              }
            }
          }
        }
        let result = this.convertSolutionToLU(solutions, question.n, l, u)
        l = result.l
        u = result.u
      } else if (question.method === 'Naive Gaussian Elimination') {
        let A = question.matrix
        let mIInverse = []
        for (let i = 0; i < question.n - 1; i++) {
          let _mI = this.generateIdentityMatrix(question.n)
          let str = `$\\textbf{step ${i + 1}}$
          $$ \\begin{equation*}
          \\begin{array}{cc}
          `
          for (let j = i + 1; j < question.n; j++) {
            let coeff = question.matrix[j][i] / question.matrix[i][i]
            _mI[j][i] = -coeff
            if (coeff === 1) {
              str += `R_${j + 1} \\rightarrow R_${j + 1} - R_${i + 1} \\\\`
            } else {
              str += `R_${j + 1} \\rightarrow R_${j + 1} - ${coeff} R_${i + 1} \\\\`
            }

            A[j] = subtract(A[j], multiply(coeff, A[i]))
          }
          str += `\\end{array} 
          ${this.matrixToLatex(A, 'bmatrix')} \\end{equation*} \\\\$$
          $$\\begin{equation*}
             M_{${i + 1}} = ${this.matrixToLatex(_mI, 'bmatrix')} \\hspace{ 0.2cm } and \\hspace{ 0.2cm }
             M^{-1}_{${i + 1}} = ${this.matrixToLatex(this.removeDecimals(inv(_mI)), 'bmatrix')}
          \\end{equation*}$$
          `
          if (i === question.n - 2) {
            u = A
            str += `$$\\begin{equation*} u = ${this.matrixToLatex(u, 'bmatrix')} \\end{equation*}$$`
          }
          question.working.steps.push(str + '$$\\\\$$')
          mIInverse.push(this.removeDecimals(inv(_mI)))
        }
        let str = `$$\\\\
        \\begin{align*}
          L &= `
        l = mIInverse[0]
        let str2 = this.matrixToLatex(mIInverse[0])
        for (let i = 0; i < mIInverse.length; i++) {
          str += `M^{-1}_{${i + 1}}`
          if (i !== mIInverse.length - 1) {
            l = multiply(l, mIInverse[i + 1])
            str2 += this.matrixToLatex(mIInverse[i])
          }
        }
        if (question.n !== 2) {
          str += `\\\\
           &= ${str2}`
        }
        str += `\\\\
           &= ${this.matrixToLatex(l)}
        \\end{align*}$$`
        question.working.steps.push(str)
      }
      question.working.steps.push(`Therefore we have`)
      question.working.steps.push(`
        $$\\begin{equation*}
            L = ${this.matrixToLatex(l)} \\hspace{ 0.2cm } and \\hspace{ 0.2cm } U = ${this.matrixToLatex(u)}
          \\end{equation*}
       $$`)
      if (question.solve) {
        question.working.steps.push(`
        Using the LU factorisation of $A$, we can write $Ax = b$ as
        $$ Ax = (LU)x = L(Ux) = b $$
        `
        )
        question.working.steps.push(`
        The matrix equation can be written as $Lz = b$, where $z = Ux$. Thus, the equation system
        can be solved in two steps by solving $$ \\\\
        \\begin{align*}
          Lz &= b \\\\
          Ux &= z
        \\end{align*}
        $$`
        )
        let z = []
        let x = []
        for (let i = 0; i < question.n; i++) {
          z.push(`z_{${i}}`)
          x.push(`x_{${i}}`)
        }
        question.working.steps.push(`
        The solution for z is obtained from $Lz = b$ as $$ \\\\
        \\begin{equation*}
        ${this.matrixToLatex(l, 'bmatrix')} ${this.vectorToLatex(z)} = ${this.vectorToLatex(question.b)}
        \\end{equation*}
        $$`
        )
        question.working.steps.push(`
        Since L is lower triangular, we can use forward substitution to obtain $$ \\\\
        \\begin{equation*}
        ${this.vectorToLatex(z)} = ${this.vectorToLatex(lsolve(l, question.b))}
        \\end{equation*}
        $$`
        )
        z = lsolve(l, question.b)
        question.working.steps.push(`
        The equation Ux = z becomes  $$ \\\\
        \\begin{equation*}
         ${this.matrixToLatex(u, 'bmatrix')} ${this.vectorToLatex(x)} = ${this.vectorToLatex(z)}
        \\end{equation*}
        $$`
        )
        question.working.steps.push(`
        Finally, we apply backward substitution to solve for x and obtain: $$ \\\\
        \\begin{equation*}
        ${this.vectorToLatex(x)} = ${this.vectorToLatex(usolve(u, z))}
        \\end{equation*}
        $$`
        )
      }
      question.answer.value = question.working.steps[question.working.steps.length - 1]
      return question
    },
    substitute (equation, variable, value) {
      let re = new RegExp(variable, 'g')
      return equation.replace(re, value)
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
    removeDecimals (matrix) {
      for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
          matrix[i][j] = Math.floor(matrix[i][j])
        }
      }
      return matrix
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
