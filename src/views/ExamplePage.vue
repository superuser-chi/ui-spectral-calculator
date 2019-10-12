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
        <h2 class="secondary-heading mb-3">Linear System solver</h2>
        <p>
          This calculator is meant to help students in learning how to solve the linear system of equations $ Ax = b $
          using $LU$ factorisation
        </p>
        <section
          ref="math"
          class="preview"
        >
          <section class="preview">
            <section class="mb-5">
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
                />
              </v-col>
              <v-col
                class="d-flex"
                cols="12"
                sm="6"
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
            </section>
            <form>
              <div class="form-row align-items-center">
                <div class="col-auto">
                  <p class="lead">Dimensions:</p>
                </div>
                <div class="col-auto">
                  <label
                    class="sr-only"
                    for="inlineFormInput"
                  >n</label>
                  <input
                    id="n"
                    v-model="n"
                    type="number"
                    class="form-control mb-2"
                    placeholder="n"
                  >
                </div>
              </div>
              <div class="mt-3">
                <mdb-btn
                  color="danger "
                  @click.native="generateQuestion"
                >Generate Question</mdb-btn>
              </div>
            </form>
          </section>
          <section
            v-show="question"
            id="questionSolution"
            ref="questionSolution"
            class="preview mt-5"
          >
            <h2 class="secondary-heading mb-3 text-danger">Question: </h2>
            <div class="lead mb-4">
              <vue-mathjax
                id="latex_funct"
                :formula="question"
                class="col-12"
              />
            </div>
            <section class="mt-5">
              <div class="custom-control custom-switch mr-5 mt-5">
                <input
                  id="answerSwitch"
                  v-model="answer.visibility"
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
                  v-model="working.visibility"
                  type="checkbox"
                  class="custom-control-input"
                >
                <label
                  class="custom-control-label"
                  for="workingSwitch"
                >Show working</label>
              </div>
            </section>
            <div v-show="answer.visibility">
              <h2 class="secondary-heading mb-3 text-primary">Answer: </h2>
              <p>
                <vue-mathjax
                  id="latex_funct"
                  :formula="answer.value"
                  class="col-12"
                />
              </p>
            </div>
            <div
              v-show="working.visibility"
              id="working"
              ref="working"
              class="mt-5"
            >
              <h2 class="secondary-heading mb-3 text-primary">Solution: </h2>
              <p
                v-for="step in working.steps"
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
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { SemipolarSpinner } from 'epic-spinners'
// eslint-disable-next-line no-multi-spaces
import {  mdbContainer, mdbRow, mdbIcon, mdbCol, mdbInput, mdbBtn, mdbDropdown,
  mdbDropdownToggle, mdbDropdownMenu, mdbDropdownItem, mdbModal, mdbModalHeader,
  // eslint-disable-next-line object-curly-spacing
  mdbModalTitle, mdbModalBody, mdbModalFooter} from 'mdbvue'
import { VueMathjax } from 'vue-mathjax'
import { evaluate, multiply, subtract, inv, lsolve, usolve } from 'mathjs'
import AdobeAcrobatIcon from 'vue-material-design-icons/AdobeAcrobat.vue'
import BookmarkIcon from 'vue-material-design-icons/Bookmark.vue'
export default {
  name: 'Home',
  components: {
    mdbContainer,
    VueMathjax,
    mdbRow,
    mdbIcon,
    mdbCol,
    mdbInput,
    mdbBtn,
    mdbDropdown,
    mdbDropdownToggle,
    mdbDropdownMenu,
    mdbDropdownItem,
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
    Loading,
    SemipolarSpinner,
    AdobeAcrobatIcon,
    BookmarkIcon
  },
  data () {
    return {
      show: false,
      showModal: false,
      showAnswers: true,
      showSteps: true,
      icon: 'mdi-adobe-acrobat',
      isLoading: true,
      fullPage: true,
      isServerSideValidated: undefined,
      n: 2,
      matrix: undefined,
      b: undefined,
      answer: { value: undefined, visibility: false },
      working: { steps: [], visibility: true },
      question: undefined,
      methods: ['Doolitle Factorisation', 'Crout Factorisation', 'Naive Gaussian Elimination'],
      method: 'Doolitle Factorisation',
      problems: ['LU Decomposition only', 'Solve $Ax=b$'],
      problem: 'LU Decomposition only',
      pdfConfig: false,
      type: 'Pdf'
    }
  },
  watch: {
    n: function (value) {
      this.working.steps = []
      this.working.visibility = false
      this.answer.value = undefined
      this.answer.visibility = false
      this.generateQuestion()
      if (typeof value === 'string') {
        this.n = parseInt(value)
      }
      if (value > 10) {
        this.n = 10
      }
      if (value < 2) {
        this.n = 2
      }
    },
    method: function (value) {
      this.working.steps = []
      this.working.visibility = false
      this.answer.value = undefined
      this.answer.visibility = false
      this.generateQuestion()
    },
    'answer.visibility' () {
      if (this.answer.value === undefined) {
        this.hideAnswer()
      }
    },
    'working.visibility' () {
      if (this.working.steps.length === 0) {
        this.hideWorking()
      }
    }
  },
  mounted: function () {
    this.generateQuestion()
    this.renderMathJax()
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
      \\title{LU Decomposition}
      \\author{https://ludecomposition.surge.sh}
      \\date{ \\today}
      \\begin{document}
      \\maketitle

      \\section*{Question}
      ${this.question.replace(/\$/g, '')}
      \\section*{Answer}
      ${this.answer.value.replace(/\$/g, '')}
      \\section*{Working}
      \\noindent`
      this.working.steps.forEach((step, index) => {
        text = text + step.replace(/\$/g, '')
      })
      text = text + `
      \\end{document}
      `
      return text
    },
    convertSolutionToLU (solutions, l, u) {
      for (let i = 1; i <= this.n; i++) {
        for (let j = 1; j <= this.n; j++) {
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
            str += `${A[i][j]} ${x[j]}`
          } else {
            str += `+ ${A[i][j]}${x[j]}`
          }
        }
        str = str.concat(`&= ${b[i]}\\\\`)
      }
      str = str.concat(`\\end{align*}`)
      return str
    },
    generateDoolitleA () {
      let l = this.generateMatrix()
      let u = this.generateMatrix()
      for (let i = 0; i < this.n; i++) {
        for (let j = 0; j < this.n; j++) {
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
    generateCroutA () {
      let l = this.generateMatrix()
      let u = this.generateMatrix()
      for (let i = 0; i < this.n; i++) {
        for (let j = 0; j < this.n; j++) {
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
    generateEmptyMatrix () {
      let emptyMatrix = []
      for (let i = 0; i < this.n; i++) {
        let row = Array(this.n).fill(0)
        emptyMatrix.push(row)
      }
      return emptyMatrix
    },
    generateIdentityMatrix () {
      let matrix = this.generateEmptyMatrix()
      for (let i = 0; i < this.n; i++) {
        matrix[i][i] = 1
      }
      return matrix
    },
    generateMatrix () {
      let matrix = []
      for (let i = 0; i < this.n; i++) {
        let t = []
        for (let j = 0; j < this.n; j++) {
          t.push(this.getRandomInt(9))
        }
        matrix.push(t)
      }
      return matrix
    },
    generateQuestion () {
      this.showLoader()
      this.working.steps = []
      this.working.visibility = false
      if (this.method === 'Doolitle Factorisation' || this.method === 'Naive Gaussian Elimination') {
        this.matrix = this.generateDoolitleA()
        this.question = `
              Use the ${this.method} to find the $ LU $ factorisation of the matrix $ A $ in which $L$ is a unit lower
              triangular matrix and $U$ is an upper triangular matrix
              $$
              \\begin{equation}
          A = ${this.matrixToLatex(this.matrix)}`
      } else if (this.method === 'Crout Factorisation') {
        this.matrix = this.generateCroutA()
        this.question = `
              Use the ${this.method} to find the $ LU $ factorisation of the matrix $ A $ in which $L$ is a  lower
              triangular matrix and $U$ is a unit upper triangular matrix
              $$
              \\begin{equation}
                A = ${this.matrixToLatex(this.matrix)}`
      }

      this.question = this.question.concat(`
              \\end{equation}
        $$`)

      if (this.problem === 'Solve $Ax=b$') {
        this.question += `
              and use the LU factorization to solve the linear system
              `
        let x = []
        for (let i = 0; i < this.matrix.length; i++) {
          x.push(`x_{${i}}`)
        }
        this.b = multiply(this.matrix, this.generateRandomVector(this.n))
        this.question += `
        $$
          ${this.equationToLatex(this.matrix, x, this.b)}
        $$`
      }
      this.solve()
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, '#questionSolution'])
      this.toggleLoader()
    },
    generateRandomVector (n, max = 5) {
      let vector = []
      for (let j = 0; j < n; j++) {
        vector.push(this.getRandomInt(max))
      }
      return vector
    },
    hideAnswer () {
      this.answer.visibility = false
    },
    hideLoader () {
      this.isLoading = false
    },
    hideWorking () {
      this.working.visibility = false
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
    select () {
      this.$nextTick(() => {
        window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, this.$refs.typeOfProblem])
      })
    },
    solve () {
      this.showLoader()
      this.working.steps = []
      let l = this.generateEmptyMatrix()
      let u = this.generateEmptyMatrix()
      if (this.method === 'Doolitle Factorisation') {
        for (let i = 0; i < this.n; i++) {
          for (let j = 0; j < this.n; j++) {
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
        this.working.steps.push(` Denote the L and U matrices by
        $$\\\\
        \\begin{equation}
            L = ${this.matrixToLatex(l)}  \\hspace{0.35cm} and \\hspace{0.5cm} U = ${this.matrixToLatex(u)}
        \\end{equation}
       $$`)
        this.working.steps.push(`so that the equation $LU = A$ is represented as
        $$\\\\
        \\begin{equation}
            ${this.matrixToLatex(l)}${this.matrixToLatex(u)} = ${this.matrixToLatex(this.matrix)}
        \\end{equation}
       $$`)
        let temp = []
        for (let i = 0; i < this.n; i++) {
          for (let k = 0; k < this.n; k++) {
            let str = ''
            for (let j = 0; j < this.n; j++) {
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
        for (let k = 0; k < this.n; k++) {
          for (let j = 0; j < this.n; j++) {
            arr.push(this.matrix[j][k])
          }
        }
        for (let i = 0; i < temp.length; i++) {
          if (temp[i] !== '') {
            temp[i] = temp[i] + `&=${arr[i]}`
          }
        }
        this.working.steps.push(`Multiplying the matrix equation and solving for the unknowns in succession gives`)
        let solutions = []
        for (let i = 0; i < this.n; i++) {
          let s = { str: `u_\\{1,${i + 1}\\}`, value: this.matrix[0][i] }
          solutions.push(s)
        }
        for (let i = 0; i < temp.length; i++) {
          if (temp[i] !== '') {
            if (i % this.n === 0) {
              this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\end{align*}$$`)
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
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\
                    ${t} \\\\ ${this.evaluateKnowns(t)} \\\\ ${equation.latex} \\\\
                    ${term} &= ${value}\\end{align*}$$`)
                solutions.push({ str: term.replace(/\{/g, '\\{').replace(/\}/g, '\\}'), value: value })
              } else {
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ ${t} \\end{align*}$$`)
              }
            }
          }
        }
        let result = this.convertSolutionToLU(solutions, l, u)
        l = result.l
        u = result.u
      } else if (this.method === 'Crout Factorisation') {
        for (let i = 0; i < this.n; i++) {
          for (let j = 0; j < this.n; j++) {
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
        this.working.steps.push(` Denote the L and U matrices by
        $$\\\\
        \\begin{equation}
            L = ${this.matrixToLatex(l)}  \\hspace{0.35cm} and \\hspace{0.5cm} U = ${this.matrixToLatex(u)}
        \\end{equation}
       $$`)
        this.working.steps.push(`so that the equation $LU = A$ is represented as
        $$\\\\
        \\begin{equation}
            ${this.matrixToLatex(l)}${this.matrixToLatex(u)} = ${this.matrixToLatex(this.matrix)}
        \\end{equation}
       $$`)
        let temp = []
        for (let i = 0; i < this.n; i++) {
          for (let k = 0; k < this.n; k++) {
            let str = ''
            for (let j = 0; j < this.n; j++) {
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
        for (let k = 0; k < this.n; k++) {
          for (let j = 0; j < this.n; j++) {
            arr.push(this.matrix[j][k])
          }
        }

        for (let i = 0; i < temp.length; i++) {
          if (temp[i] !== '') {
            temp[i] = temp[i] + `&=${arr[i]}`
          }
        }

        this.working.steps.push(`Multiplying the matrix equation and solving for the unknowns in succession gives`)
        let solutions = []
        for (let i = 0; i < this.n; i++) {
          let s = { str: `l_\\{${i + 1},1\\}`, value: this.matrix[i][0] }
          solutions.push(s)
        }
        for (let i = 0; i < temp.length; i++) {
          if (temp[i] !== '') {
            if (i < this.n) {
              this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\end{align*}$$`)
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
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\
                    ${t} \\\\ ${this.evaluateKnowns(t)} \\\\ ${equation.latex} \\\\
                    ${term} &= ${value}\\end{align*}$$`)
                solutions.push({ str: term.replace(/\{/g, '\\{').replace(/\}/g, '\\}'), value: value })
              } else {
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ ${t} \\end{align*}$$`)
              }
            }
          }
        }
        let result = this.convertSolutionToLU(solutions, l, u)
        l = result.l
        u = result.u
      } else if (this.method === 'Naive Gaussian Elimination') {
        let A = this.matrix
        let mIInverse = []
        for (let i = 0; i < this.n - 1; i++) {
          let _mI = this.generateIdentityMatrix()
          let str = `$\\textbf{step ${i + 1}}$
          $$ \\begin{equation}
          \\begin{array}{cc}
          `
          for (let j = i + 1; j < this.n; j++) {
            let coeff = this.matrix[j][i] / this.matrix[i][i]
            _mI[j][i] = -coeff
            if (coeff === 1) {
              str += `R_${j + 1} \\rightarrow R_${j + 1} - R_${i + 1} \\\\`
            } else {
              str += `R_${j + 1} \\rightarrow R_${j + 1} - ${coeff} R_${i + 1} \\\\`
            }

            A[j] = subtract(A[j], multiply(coeff, A[i]))
          }
          str += `\\end{array}
          ${this.matrixToLatex(A, 'bmatrix')} \\end{equation} \\\\$$
          $$\\begin{equation}
             M_{${i + 1}} = ${this.matrixToLatex(_mI, 'bmatrix')} \\hspace{ 0.2cm } and \\hspace{ 0.2cm }
             M^{-1}_{${i + 1}} = ${this.matrixToLatex(this.removeDecimals(inv(_mI)), 'bmatrix')}
          \\end{equation}$$
          `
          if (i === this.n - 2) {
            u = A
            str += `$$\\begin{equation} u = ${this.matrixToLatex(u, 'bmatrix')} \\end{equation}$$`
          }
          this.working.steps.push(str + '$$\\\\$$')
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
        if (this.n !== 2) {
          str += `\\\\
           &= ${str2}`
        }
        str += `\\\\
           &= ${this.matrixToLatex(l)}
        \\end{align*}$$`
        this.working.steps.push(str)
      }
      this.working.steps.push(`Therefore we have`)
      this.working.steps.push(`$$
          \\begin{equation}
            L = ${this.matrixToLatex(l)} \\hspace{ 0.2cm } and \\hspace{ 0.2cm } U = ${this.matrixToLatex(u)}
          \\end{equation}
       $$`)
      if (this.problem === 'Solve $Ax=b$') {
        this.working.steps.push(`
        Using the LU factorisation of $A$, we can write $Ax = b$ as
        $$ Ax = (LU)x = L(Ux) = b $$
        `
        )
        this.working.steps.push(`
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
        for (let i = 0; i < this.n; i++) {
          z.push(`z_{${i}}`)
          x.push(`x_{${i}}`)
        }
        this.working.steps.push(`
        The solution for z is obtained from $Lz = b$ as $$ \\\\
        \\begin{equation*}
        ${this.matrixToLatex(l, 'bmatrix')} ${this.vectorToLatex(z)} = ${this.vectorToLatex(this.b)}
        \\end{equation*}
        $$`
        )
        this.working.steps.push(`
        Since L is lower triangular, we can use forward substitution to obtain $$ \\\\
        \\begin{equation*}
        ${this.vectorToLatex(z)} = ${this.vectorToLatex(lsolve(l, this.b))}
        \\end{equation*}
        $$`
        )
        z = lsolve(l, this.b)
        this.working.steps.push(`
        The equation Ux = z becomes  $$ \\\\
        \\begin{equation*}
         ${this.matrixToLatex(u, 'bmatrix')} ${this.vectorToLatex(x)} = ${this.vectorToLatex(z)}
        \\end{equation*}
        $$`
        )
        this.working.steps.push(`
        Finally, we apply backward substitution to solve for x and obtain: $$ \\\\
        \\begin{equation*}
        ${this.vectorToLatex(x)} = ${this.vectorToLatex(usolve(u, z))}
        \\end{equation*}
        $$`
        )
      }
      this.answer.value = this.working.steps[this.working.steps.length - 1]
      this.$nextTick(() => {
        window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, this.$refs.working])
      })
      this.toggleLoader()
    },
    showAnswer () {
      this.answer.visibility = true
    },
    showLoader () {
      this.isLoading = true
    },
    showPdfConfig () {
      this.pdfConfig = true
    },
    showWorking () {
      this.working.visibility = true
    },
    substitute (equation, variable, value) {
      let re = new RegExp(variable, 'g')
      return equation.replace(re, value)
    },
    toggleLoader () {
      const vue = this
      setTimeout(() => {
        window.MathJax.Hub.Queue(function () {
          vue.isLoading = false
        })
      }, 5000)
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
.mjx-stack .mjx-block {
  margin-bottom: 0.5em;
}
div.item {
  display: inline-block;
  width: 1em;
  height: 1em;
}
section.preview {
  border: 1px solid #e0e0e0;
  padding: 15px;
  overflow: auto;
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
  overflow-x: auto;
}

.v-list__tile__title {
  height: none;
  line-height: none;
  overflow: auto;
}

.icon-container {
  position: absolute;
  bottom: 2em;
  right: 2em;
}
.material-design-icon.icon-2x {
  height: 2em;
  width: 2em;
}
.material-design-icon.icon-2x > .material-design-icon__svg {
  height: 2em;
  width: 2em;
}
</style>
