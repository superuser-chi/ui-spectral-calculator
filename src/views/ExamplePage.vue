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
              <mdb-btn
                color="info"
                @click.native="solve"
              >Solve</mdb-btn>
            </section>
            <section class="mt-3">
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
import { multiply, parse } from 'mathjs'
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
      modalTitle: undefined,
      modalMessage: undefined,
      icon: 'mdi-adobe-acrobat',
      isLoading: true,
      fullPage: true,
      isServerSideValidated: undefined,
      a: { value: 1, visibility: false },
      b: { value: 1, visibility: false },
      c: { value: 1, visibility: false },
      n: 4,
      matrix: undefined,
      answer: { value: undefined, visibility: false },
      working: { steps: [], visibility: false },
      question: undefined,
      methods: ['Doolitle Factorisation', 'Crout Factorisation', 'Naive Gaussian Elimination'],
      method: 'Crout Factorisation'
    }
  },
  computed: {
    parseToTex (f) {
      return parse(f).toTex()
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
      if (value > 4) {
        this.n = 4
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
    this.toggleLoader(false)
  },
  methods: {
    solve () {
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
        if (this.n === 2) {
          u[0][0] = this.matrix[0][0]
          u[0][1] = this.matrix[0][1]
          for (let i = 0; i < temp.length; i++) {
            if (temp[i] !== '') {
              if (i === 0) {
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\end{align*}$$`)
              } else if (i === 1) {
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ l_{2,1} = ${this.matrix[1][0] / this.matrix[0][0]} \\end{align*}$$`)
                l[1][0] = this.matrix[1][0] / this.matrix[0][0]
              } else if (i === 2) {
                this.working.steps.push(`$$\\begin{align*} ${temp[i]} \\end{align*}$$`)
              } else if (i === 3) {
                this.working.steps.push(`$$\\begin{align*} ${temp[i]} \\\\
                  ${this.matrix[0][1]}\\cdot${this.matrix[1][0] / this.matrix[0][0]} + u_{2,2} &= ${this.matrix[1][1]} \\\\
                  u_{2,2} &= ${this.matrix[1][1] - this.matrix[0][1] * this.matrix[1][0] / this.matrix[0][0]}
                \\end{align*}$$`)
                u[1][1] = this.matrix[1][1] - this.matrix[0][1] * this.matrix[1][0] / this.matrix[0][0]
              }
            }
          }
        } else if (this.n === 3) {
          u[0][0] = this.matrix[0][0]
          u[0][1] = this.matrix[0][1]
          u[0][2] = this.matrix[0][2]
          for (let i = 0; i < temp.length; i++) {
            if (temp[i] !== '') {
              if (i === 0 || i === 3 || i === 6) {
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\end{align*}$$`)
              } else if (i === 1) {
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ l_{2,1} &= ${this.matrix[1][0] / this.matrix[0][0]} 
                \\end{align*}$$`)
                l[1][0] = this.matrix[1][0] / this.matrix[0][0]
              } else if (i === 2) {
                this.working.steps.push(`$$ \\begin{align*}  ${temp[i]} \\\\ l_{3,1} &= ${this.matrix[2][0] / this.matrix[0][0]} 
                \\end{align*}$$`)
                l[2][0] = this.matrix[2][0] / this.matrix[0][0]
              } else if (i === 4) {
                this.working.steps.push(`$$  \\begin{align*} ${temp[i]} \\\\
                  ${u[0][1]} \\cdot ${l[1][0]} + u_{2,2} &= ${this.matrix[1][1]} \\\\
                  u_{2,2} &= ${this.matrix[1][1] - u[0][1] * l[1][0]} 
                \\end{align*}$$`)
                u[1][1] = this.matrix[1][1] - u[0][1] * l[1][0]
              } else if (i === 5) {
                let lhs = this.matrix[2][1]
                this.working.steps.push(`$$ \\begin{align*}  ${temp[i]} \\\\
                  ${u[0][1]} \\cdot${l[2][0]} + ${u[1][1]}\\cdot l_{3,2} &= ${lhs} \\\\
                  ${u[1][1]} \\cdot l_{3,2} &= ${lhs - u[0][1] * l[2][0]} \\\\
                  l_{3,2} &= ${(lhs - u[0][1] * l[2][0]) / u[1][1]}
                \\end{align*}$$`)
                l[2][1] = (lhs - u[0][1] * l[2][0]) / u[1][1]
              } else if (i === 7) {
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\
                  ${u[0][2]} \\cdot \\ ${l[1][0]} + u_{2,3} &= ${this.matrix[1][2]} \\\\
                  u_{2,3} &= ${this.matrix[1][2] - u[0][2] * l[1][0]} 
                \\end{align*}$$`)
                u[1][2] = this.matrix[1][2] - u[0][2] * l[1][0]
              } else {
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\  
                ${u[0][2]} \\cdot ${l[2][0]} + ${u[1][2]} \\cdot ${l[2][1]} + u_{3,3} &= ${this.matrix[2][2]} \\\\
                u_{3,3} &= ${this.matrix[2][2] - u[0][2] * l[2][0] - u[1][2] * l[2][1]}
                \\end{align*}$$`)
                u[2][2] = this.matrix[2][2] - u[0][2] * l[2][0] - u[1][2] * l[2][1]
              }
            }
          }
        } else if (this.n === 4) {
          u[0][0] = this.matrix[0][0]
          u[0][1] = this.matrix[0][1]
          u[0][2] = this.matrix[0][2]
          u[0][3] = this.matrix[0][3]
          for (let i = 0; i < temp.length; i++) {
            if (temp[i] !== '') {
              if (i === 0 || i === 4 || i === 8 || i === 12) {
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\end{align*} $$`)
              } else if (i === 1) {
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ l_{2,1} &= ${this.matrix[1][0] / this.matrix[0][0]} 
                \\end{align*}$$`)
                l[1][0] = this.matrix[1][0] / this.matrix[0][0]
              } else if (i === 2) {
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ l_{3,1} &= ${this.matrix[2][0] / this.matrix[0][0]} \\end{align*}$$`)
                l[2][0] = this.matrix[2][0] / this.matrix[0][0]
              } else if (i === 3) {
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ l_{4,1} &= ${this.matrix[3][0] / this.matrix[0][0]} \\end{align*}$$`)
                l[3][0] = this.matrix[3][0] / this.matrix[0][0]
              } else if (i === 5) {
                this.working.steps.push(`$$  \\begin{align*} ${temp[i]} \\\\
                  ${u[0][1]} \\cdot ${l[1][0]} + u_{2,2} &= ${this.matrix[1][1]} \\\\
                  u_{2,2} &= ${this.matrix[1][1] - u[0][1] * l[1][0]} 
                \\end{align*}$$`)
                u[1][1] = this.matrix[1][1] - u[0][1] * l[1][0]
              } else if (i === 6) {
                let lhs = this.matrix[2][1]
                this.working.steps.push(`$$ \\begin{align*}  ${temp[i]} \\\\
                  ${u[0][1]} \\cdot ${l[2][0]} + ${u[1][1]}\\cdot l_{3,2} &= ${lhs} \\\\
                  ${u[1][1]} \\cdot l_{3,2} &= ${lhs - u[0][1] * l[2][0]} \\\\
                  l_{3,2} &= ${(lhs - u[0][1] * l[2][0]) / u[1][1]} 
                \\end{align*}$$`)
                l[2][1] = (lhs - u[0][1] * l[2][0]) / u[1][1]
              } else if (i === 7) {
                let lhs = this.matrix[3][1]
                this.working.steps.push(`$$ \\begin{align*}  ${temp[i]} \\\\
                  ${u[0][1]} \\cdot ${l[3][0]} + ${u[1][1]}\\cdot l_{4,2} &= ${lhs} \\\\
                  ${u[1][1]} \\cdot l_{4,2} &= ${lhs - u[0][1] * l[3][0]} \\\\
                  l_{4,2} &= ${(lhs - u[0][1] * l[3][0]) / u[1][1]} 
                \\end{align*}$$`)
                l[3][1] = (lhs - u[0][1] * l[3][0]) / u[1][1]
              } else if (i === 9) {
                this.working.steps.push(`$$  \\begin{align*} ${temp[i]} \\\\
                  ${u[0][2]} \\cdot ${l[1][0]} + u_{2,3} &= ${this.matrix[1][2]} \\\\
                  u_{2,3} &= ${this.matrix[1][2] - u[0][2] * l[1][0]}
                \\end{align*}$$`)
                u[1][2] = this.matrix[1][2] - u[0][2] * l[1][0]
              } else if (i === 10) {
                let lhs = this.matrix[2][2]
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ 
                 ${u[0][2]} \\cdot ${l[2][0]} + ${u[1][2]} \\cdot ${l[2][1]} + u_{3,3} = ${lhs} \\\\
                u_{3,3} = ${lhs - u[0][2] * l[2][0] - u[1][2] * l[2][1]}
                \\end{align*}$$`)
                u[2][2] = lhs - u[0][2] * l[2][0] - u[1][2] * l[2][1]
              } else if (i === 11) {
                let lhs = this.matrix[3][2]
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ 
                 ${u[0][2]} \\cdot ${l[3][0]} + ${u[1][2]} \\cdot ${l[3][1]} + ${u[2][2]} \\cdot l_{4,3} &= ${lhs} \\\\
                ${u[2][2]} \\cdot l_{4,3} &= ${lhs - u[0][2] * l[3][0] - u[1][2] * l[3][1]} \\\\
                l_{4,3} &= ${(lhs - u[0][2] * l[3][0] - u[1][2] * l[3][1]) / u[2][2]}
                \\end{align*}$$`)
                l[3][2] = (lhs - u[0][2] * l[3][0] - u[1][2] * l[3][1]) / u[2][2]
              } else if (i === 13) {
                this.working.steps.push(`$$  \\begin{align*} ${temp[i]} \\\\
                  ${u[0][3]} \\cdot ${l[1][0]} + u_{2,4} &= ${this.matrix[1][1]} \\\\
                  u_{2,4} &= ${this.matrix[1][3] - u[0][3] * l[1][0]} 
                \\end{align*}$$`)
                u[1][3] = this.matrix[1][3] - u[0][3] * l[1][0]
              } else if (i === 14) {
                let lhs = this.matrix[2][3]
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ 
                 ${u[0][3]} \\cdot ${l[2][0]} + ${u[1][3]} \\cdot ${l[2][1]} + u_{3,4} &= ${lhs} \\\\
                u_{3,4} &= ${lhs - u[0][3] * l[2][0] - u[1][3] * l[2][1]}
                \\end{align*}$$`)
                u[2][3] = lhs - u[0][3] * l[2][0] - u[1][3] * l[2][1]
              } else if (i === 15) {
                let lhs = this.matrix[3][3]
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ 
                 ${u[0][3]} \\cdot ${l[3][0]} + ${u[1][3]} \\cdot ${l[3][2]} + ${u[2][3]} \\cdot ${l[3][2]}+ u_{4,4} &= ${lhs} \\\\
                u_{4,4} &= ${lhs - u[0][3] * l[3][0] - u[1][3] * l[3][1] - u[2][3] * l[3][2]}
                \\end{align*}$$`)
                u[3][3] = lhs - u[0][3] * l[3][0] - u[1][3] * l[3][1] - u[2][3] * l[3][2]
              }
            }
          }
        }
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
        if (this.n === 2) {
          l[0][0] = this.matrix[0][0]
          l[1][0] = this.matrix[1][0]
          for (let i = 0; i < temp.length; i++) {
            if (temp[i] !== '') {
              if (i === 0 || i === 1) {
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\end{align*}$$`)
              } else if (i === 2) {
                this.working.steps.push(`$$\\begin{align*} ${temp[i]} \\\\
                ${l[0][0]} \\cdot u_{1,2} &= ${this.matrix[0][1]} \\\\
                u_{1,2} &= ${this.matrix[0][1] / l[0][0]}
                \\end{align*}$$`)
                u[0][1] = this.matrix[0][1] / l[0][0]
              } else if (i === 3) {
                this.working.steps.push(`$$\\begin{align*} ${temp[i]} \\\\
                  ${u[0][1]}\\cdot${l[1][0]} + l_{2,2} &= ${this.matrix[1][1]} \\\\
                  l_{2,2} &= ${this.matrix[1][1] - u[0][1] * l[1][0]}
                \\end{align*}$$`)
                l[1][1] = this.matrix[1][1] - u[0][1] * l[1][0]
              }
            }
          }
        } else if (this.n === 3) {
          l[0][0] = this.matrix[0][0]
          l[1][0] = this.matrix[1][0]
          l[2][0] = this.matrix[1][0]
          for (let i = 0; i < temp.length; i++) {
            if (temp[i] !== '') {
              if (i === 0 || i === 1 || i === 2) {
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\end{align*}$$`)
              } else if (i === 3) {
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]}  \\\\
                ${l[0][0]} \\cdot u_{1,2} &= ${this.matrix[0][1]} \\\\
                u_{1,2} &= ${this.matrix[0][1] / l[0][0]} 
                \\end{align*}$$`)
                u[0][1] = this.matrix[0][1] / l[0][0]
              } else if (i === 4) {
                this.working.steps.push(`$$ \\begin{align*}  ${temp[i]} \\\\ 
                ${u[0][1]} \\cdot ${l[1][0]} + l_{2,2} &= ${this.matrix[1][1]} \\\\
                l_{2,2} &= ${this.matrix[1][1] - u[0][1] * l[1][0]}
                \\end{align*}$$`)
                l[1][1] = this.matrix[1][1] - u[0][1] * l[1][0]
              } else if (i === 5) {
                this.working.steps.push(`$$ \\begin{align*}  ${temp[i]} \\\\ 
                ${u[0][1]} \\cdot ${l[2][0]} + l_{3,2} &= ${this.matrix[2][1]} \\\\
                l_{3,2} &= ${this.matrix[2][1] - u[0][1] * l[2][0]}
                \\end{align*}$$`)
                l[2][1] = this.matrix[2][1] - u[0][1] * l[2][0]
              } else if (i === 6) {
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]}  \\\\
                ${l[0][0]} \\cdot u_{1,3} &= ${this.matrix[0][2]} \\\\
                u_{1,3} &= ${this.matrix[0][2] / l[0][0]} 
                \\end{align*}$$`)
                u[0][2] = this.matrix[0][2] / l[0][0]
              } else if (i === 7) {
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\
                  ${u[0][2]} \\cdot \\ ${l[1][0]} + ${l[1][1]} \\cdot u_{2,3} &= ${this.matrix[1][2]} \\\\
                  ${l[1][1]} \\cdot u_{2,3} &= ${this.matrix[1][2] - u[0][2] * l[1][0]} \\\\
                  u_{2,3} &= ${(this.matrix[1][2] - u[0][2] * l[1][0]) / l[1][1]} 
                \\end{align*}$$`)
                u[1][2] = (this.matrix[1][2] - u[0][2] * l[1][0]) / l[1][1]
              } else {
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\  
                ${u[0][2]} \\cdot ${l[2][0]} + ${u[1][2]} \\cdot ${l[2][1]} + u_{3,3} &= ${this.matrix[2][2]} \\\\
                l_{3,3} &= ${this.matrix[2][2] - u[0][2] * l[2][0] - u[1][2] * l[2][1]}
                \\end{align*}$$`)
                l[2][2] = this.matrix[2][2] - u[0][2] * l[2][0] - u[1][2] * l[2][1]
              }
            }
          }
        } else if (this.n === 4) {
          l[0][0] = this.matrix[0][0]
          l[1][0] = this.matrix[1][0]
          l[2][0] = this.matrix[2][0]
          l[3][0] = this.matrix[3][0]
          for (let i = 0; i < temp.length; i++) {
            if (temp[i] !== '') {
              if (i === 0 || i === 1 || i === 2 || i === 3) {
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\end{align*} $$`)
              } else if (i === 4) {
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ 
                u_{1,2} &= ${this.matrix[0][1] / l[0][0]}
                \\end{align*}$$`)
                u[0][1] = this.matrix[0][1] / l[0][0]
              } else if (i === 5) {
                this.working.steps.push(`$$  \\begin{align*} ${temp[i]} \\\\
                  ${u[0][1]} \\cdot ${l[1][0]} + l_{2,2} &= ${this.matrix[1][1]} \\\\
                  l_{2,2} &= ${this.matrix[1][1] - u[0][1] * l[1][0]} 
                \\end{align*}$$`)
                l[1][1] = this.matrix[1][1] - u[0][1] * l[1][0]
              } else if (i === 6) {
                let lhs = this.matrix[2][1]
                this.working.steps.push(`$$ \\begin{align*}  ${temp[i]} \\\\
                  ${u[0][1]} \\cdot ${l[2][0]} + l_{3,2} &= ${lhs} \\\\
                  l_{3,2} &= ${lhs - u[0][1] * l[2][0]} \\\\
                \\end{align*}$$`)
                l[2][1] = (lhs - u[0][1] * l[2][0])
              } else if (i === 7) {
                let lhs = this.matrix[3][1]
                this.working.steps.push(`$$ \\begin{align*}  ${temp[i]} \\\\
                  ${u[0][1]} \\cdot ${l[3][0]} + l_{4,2} &= ${lhs} \\\\
                  l_{4,2} &= ${lhs - u[0][1] * l[3][0]} \\\\ 
                \\end{align*}$$`)
                l[3][1] = (lhs - u[0][1] * l[3][0])
              } else if (i === 8) {
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ 
                u_{1,3} &= ${this.matrix[0][2] / l[0][0]}
                \\end{align*}$$`)
                u[0][2] = this.matrix[0][2] / l[0][0]
              } else if (i === 9) {
                this.working.steps.push(`$$  \\begin{align*} ${temp[i]} \\\\
                  ${u[0][2]} \\cdot ${l[1][0]} + u_{2,3} \\cdot ${l[1][1]} &= ${this.matrix[1][2]} \\\\
                  ${l[1][1]} \\cdot  u_{2,3} &= ${this.matrix[1][2] - u[0][2] * l[1][0]} \\\\
                  u_{2,3} &= ${(this.matrix[1][2] - u[0][2] * l[1][0]) / l[1][1]}
                \\end{align*}$$`)
                u[1][2] = (this.matrix[1][2] - u[0][2] * l[1][0]) / l[1][1]
              } else if (i === 10) {
                let lhs = this.matrix[2][2]
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ 
                 ${u[0][2]} \\cdot ${l[2][0]} + ${u[1][2]} \\cdot ${l[2][1]} + l_{3,3} = ${lhs} \\\\
                l_{3,3} = ${lhs - u[0][2] * l[2][0] - u[1][2] * l[2][1]}
                \\end{align*}$$`)
                l[2][2] = lhs - u[0][2] * l[2][0] - u[1][2] * l[2][1]
              } else if (i === 11) {
                let lhs = this.matrix[3][2]
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ 
                 ${u[0][2]} \\cdot ${l[3][0]} + ${u[1][2]} \\cdot ${l[3][1]} + l_{4,3} &= ${lhs} \\\\
                l_{4,3} &= ${lhs - u[0][2] * l[3][0] - u[1][2] * l[3][1]} \\\\
                \\end{align*}$$`)
                l[3][2] = lhs - u[0][2] * l[3][0] - u[1][2] * l[3][1]
              } else if (i === 12) {
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ 
                u_{1,4} &= ${this.matrix[0][3] / l[0][0]}
                \\end{align*}$$`)
                u[0][3] = this.matrix[0][3] / l[0][0]
              } else if (i === 13) {
                this.working.steps.push(`$$  \\begin{align*} ${temp[i]} \\\\
                  ${u[0][3]} \\cdot ${l[1][0]} + ${l[1][1]} \\cdot u_{2,4} &= ${this.matrix[1][3]} \\\\
                  ${l[1][1]} \\cdot u_{2,4} &= ${this.matrix[1][3] - u[0][3] * l[1][0]} \\\\
                  u_{2,4} &= ${(this.matrix[1][3] - u[0][3] * l[1][0]) / l[1][1]}
                \\end{align*}$$`)
                u[1][3] = (this.matrix[1][3] - u[0][3] * l[1][0]) / l[1][1]
              } else if (i === 14) {
                let lhs = this.matrix[2][3]
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ 
                ${u[0][3]} \\cdot ${l[2][0]} + ${u[1][3]} \\cdot ${l[2][1]} + ${l[2][2]}  \\cdot u_{3,4} &= ${lhs} \\\\
                ${l[2][2]}  \\cdot u_{3,4} &= ${lhs - u[0][3] * l[2][0] - u[1][3] * l[2][1]} \\\\
                u_{3,4} &= ${(lhs - u[0][3] * l[2][0] - u[1][3] * l[2][1]) / l[2][2]}
                \\end{align*}$$`)
                u[2][3] = (lhs - u[0][3] * l[2][0] - u[1][3] * l[2][1]) / l[2][2]
              } else if (i === 15) {
                let lhs = this.matrix[3][3]
                this.working.steps.push(`$$ \\begin{align*} ${temp[i]} \\\\ 
                 ${u[0][3]} \\cdot ${l[3][0]} + ${u[1][3]} \\cdot ${l[3][1]} + ${u[2][3]} \\cdot ${l[3][2]}+ l_{4,4} &= ${lhs} \\\\
                l_{4,4} &= ${lhs - u[0][3] * l[3][0] - u[1][3] * l[3][1] - u[2][3] * l[3][2]}
                \\end{align*}$$`)
                l[3][3] = lhs - u[0][3] * l[3][0] - u[1][3] * l[3][1] - u[2][3] * l[3][2]
              }
            }
          }
        }
      }

      this.working.steps.push(`Therefore we have 
        $$\\\\
          \\begin{equation}
            L = ${this.matrixToLatex(l)} \\hspace{ 0.2cm } and \\hspace{ 0.2cm } U = ${this.matrixToLatex(u)}
          \\end{equation}
       $$`)
      this.answer.value = `
        $$
          \\begin{equation}
            L = ${this.matrixToLatex(l)}\\hspace{ 0.2cm } and \\hspace{ 0.2cm} U = ${this.matrixToLatex(u)}
          \\end{equation}
        $$`
      this.$nextTick(() => {
        window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, this.$refs.working])
      })
    },
    generateEmptyMatrix () {
      let emptyMatrix = []
      for (let i = 0; i < this.n; i++) {
        let row = Array(this.n - 1).fill(0)
        emptyMatrix.push(row)
      }
      return emptyMatrix
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
    generateQuestion () {
      this.working.steps = []
      this.working.visibility = false
      if (this.method === 'Doolitle Factorisation') {
        this.matrix = this.generateDoolitleA()
      } else if (this.method === 'Crout Factorisation') {
        this.matrix = this.generateCroutA()
      }
      this.question = `
      Use the ${this.method} to find the $ LU $ factorisation of the matrix $ A $ in which $L$ is a unit lower
      triangular matrix and $U$ is an upper triangular matrix
      $$
      \\begin{equation}
        A = ${this.matrixToLatex(this.matrix)}`
      this.question = this.question.concat(`
      \\end{equation}
      $$`)
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, '#questionSolution'])
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
        if (index > 2) {
          text = text + `\\vspace{0.01cm}`
        }
      })
      text = text + `
      \\end{document}
      `
      let jsonData = {
        latex: text
      }
      this.$store.dispatch('post/donwloadPdf', jsonData).then(response => {
        let url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
        let fileLink = document.createElement('a')
        fileLink.href = url
        fileLink.download = 'questionSolution.pdf'
        document.body.appendChild(fileLink)
        fileLink.click()
      }, error => {
        this.isServerSideValidated = error.response
        if (!this.isServerSideValidated) {
          this.isServerSideValidated = 'Got nothing from server. Please contact your administrator'
        }
      })
    },
    saveTex () {
      let jsonData = {
        function: parse(this.niceDisplay(this.funct)).toTex(),
        author: 'https://limits.surge.sh',
        title: 'Limits',
        project: 'Limits',
        steps: '' + this.working.steps + '',
        answer: this.answer.value
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
      this.nodalTitle = title
      this.nodalMessage = message
      this.showModal = true
    },
    toggleLoader (isLoading) {
      const vue = this
      setTimeout(() => {
        window.MathJax.Hub.Queue(function () {
          vue.isLoading = isLoading
        })
      }, 5000)
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
    showAnswer () {
      this.answer.visibility = true
    },
    hideAnswer () {
      this.answer.visibility = false
    },
    showWorking () {
      this.working.visibility = true
    },
    hideWorking () {
      this.working.visibility = false
    },
    renderMathJax () {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, window.body])
    }
  }
}
</script>

<style>
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
