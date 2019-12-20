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
              <p>
                <vue-mathjax
                    id="latex_funct"
                    :formula="working.steps"
                    class="col-12"
                  />
              </p>
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
import { multiply } from 'mathjs'
import { LUDecomposition, Utils } from '@/plugins/numericalAnalysis'
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
    generateQuestion () {
      this.showLoader()
      this.working.steps = []
      this.working.visibility = false
      this.$store.dispatch('post/getQuestionSolution', { 'n': 5, 'method': 1 }).then(response => {
        this.question = response.data['question']
        this.working.steps = response.data['working']
      }, error => {
        this.isServerSideValidated = error.response
        if (!this.isServerSideValidated) {
          this.isServerSideValidated = 'Got nothing from server. Please contact your administrator'
        }
      })
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, '#questionSolution'])
      this.toggleLoader()
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
    solve (question) {
      this.showLoader()
      this.working.steps = []
      let ludecomposition = new LUDecomposition()
      if (question.method === 'Doolitle Factorisation') {
        question = ludecomposition.solveDoolitle(question)
      } else if (question.method === 'Crout Factorisation') {
        question = ludecomposition.solveCrout(question)
      } else if (question.method === 'Naive Gaussian Elimination') {
        question = ludecomposition.solveNaiveGauss(question)
      }
      this.working.steps = question.working.steps
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
    toggleLoader () {
      const vue = this
      setTimeout(() => {
        window.MathJax.Hub.Queue(function () {
          vue.isLoading = false
        })
      }, 5000)
    },
    renderMathJax () {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, window.body])
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
