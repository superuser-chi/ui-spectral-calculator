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
          <h1 class="mb-3 h1">Introduction</h1>
          <p class="lead mb-4">
            In numerical analysis and linear algebra, LU decomposition (where ”LU” stands for ”lower–upper”)
            factors a matrix as the product of a lower triangular matrix and an upper triangular matrix.
            Once the matrices have been cast into LU form, they become easy to invert. The LU decomposition
            is used for solving systems of linear equations. In this section, we consider three
            algorithms that are used to decompose matrices into LU form.
          </p>
          <h2 class="h2 mt-5">Doolittle Factorisation</h2>
          <p class="lead mb-4">
            If the lower triangular matrix L has 1’s on its main diagonal, then the LU factorisation is
            called a Doolittle factorization. The structure of a Doolittle factorisation of a matrix A of size
            n × n is shown below:
            $$
            \begin{equation*}
            \begin{pmatrix}
            a_{1,1} & a_{1,2} & a_{1,3} & \cdots & a_{1,n}\\
            a_{2,1} & a_{2,2} & a_{2,3} & \cdots & a_{2,n}\\
            a_{3,1} & a_{3,2} & a_{3,3} & \cdots & a_{3,n}\\
            \cdots & \cdots & \cdots & \cdots & \cdots\\
            a_{n,1} & a_{n,2} & a_{n,3} & \cdots & a_{n,n}\\
            \end{pmatrix}
            =
            \begin{pmatrix}
            1 & 0 & 0 & \cdots & 0 \\
            l_{2,1} & 1 & 0 & \cdots & 0 \\
            l_{3,1} & l_{3,2} & 1 & \cdots & 0 \\
            \cdots & \cdots & \cdots & \ddots & \vdots \\
            l_{1,1} & l_{1,2} & l_{1,3} & \cdots & 1 \\
            \end{pmatrix}
            \begin{pmatrix}
            u_{1,1} & u_{1,2} & u_{1,3} & \cdots & u_{1,n}\\
            0 & u_{2,2} & u_{2,3} & \cdots & u_{2,n}\\
            0 & 0 & u_{3,3} & \cdots & u_{3,n}\\
            \cdots & \cdots & \cdots & \ddots & \vdots\\
            0 & 0 & 0 & \cdots & u_{n,n}\\
            \end{pmatrix}
            \end{equation*}
            $$
          </p>
          <h2 class="h2 mt-5">Crout Factorisation</h2>
          <p class="lead mb-4">
            If the upper triangular matrix U has 1’s on its main diagonal, then the LU factorisation is
            called a Crout factorisation. The Crout factorisation structure is shown below:
            $$
            \begin{equation*}
            \begin{pmatrix}
            a_{1,1} & a_{1,2} & a_{1,3} & \cdots & a_{1,n}\\
            a_{2,1} & a_{2,2} & a_{2,3} & \cdots & a_{2,n}\\
            a_{3,1} & a_{3,2} & a_{3,3} & \cdots & a_{3,n}\\
            \cdots & \cdots & \cdots & \cdots & \cdots\\
            a_{n,1} & a_{n,2} & a_{n,3} & \cdots & a_{n,n}\\
            \end{pmatrix}
            =
            \begin{pmatrix}
            l_{1,1} & 0 & 0 & \cdots & 0 \\
            l_{2,1} & l_{2,2} & 0 & \cdots & 0 \\
            l_{3,1} & l_{3,2} & l_{3,3} & \cdots & 0 \\
            \cdots & \cdots & \cdots & \ddots & \vdots \\
            l_{1,1} & l_{1,2} & l_{1,3} & \cdots & l_{n,n} \\
            \end{pmatrix}
            \begin{pmatrix}
            1 & u_{1,2} & u_{1,3} & \cdots & u_{1,n}\\
            0 & 1 & u_{2,3} & \cdots & u_{2,n}\\
            0 & 0 & 1 & \cdots & u_{3,n}\\
            \cdots & \cdots & \cdots & \ddots & \vdots\\
            0 & 0 & 0 & \cdots & 1\\
            \end{pmatrix}
            \end{equation*}
            $$
          </p>
          <h2 class="h2 mt-5">Naive Gaussian Elimination</h2>
          <p class="lead mb-4">
            Consider the problem of solving the matrix equation $AX = b$
            $$
            \begin{equation*}
            \begin{bmatrix}
            2 & 1 & -1 & 2\\
            4 & 5 & -3 & 6\\
            -2 & 5 & -2 & 6\\
            4 & 11 & -4 & 8\\
            \end{bmatrix}
            \begin{bmatrix}
            x_1 \\
            x_2 \\
            x_3 \\
            x_4 \\
            \end{bmatrix}
            =
            \begin{bmatrix}
            -3 \\
            -7 \\
            -10 \\
            -2 \\
            \end{bmatrix}
            \end{equation*}
            $$
            A series of elementary row operations (known as forward elimination) can reduce the
            coefficient matrix to upper triangular form
            $$
            \begin{equation*}
            \begin{bmatrix}
            2 & 1 & -1 & 2\\
            0 & 5 & -3 & 6\\
            0 & 0 & -2 & 6\\
            0& 0 & 0 & 8\\
            \end{bmatrix}
            \begin{bmatrix}
            x_1 \\
            x_2 \\
            x_3 \\
            x_4 \\
            \end{bmatrix}
            =
            \begin{bmatrix}
            -3 \\
            -7 \\
            -10 \\
            -2 \\
            \end{bmatrix}
            \end{equation*}
            $$
            The forward elimination phase can be interpreted as multiplying the matrix equation,
            $$Ax = b$$ by a matrix $M$
            $$M(Ax) = Mb$$
            where M is selected in such a way that MA is upper triangular. That is
            $$
            \begin{equation*}
            MA
            =
            \begin{bmatrix}
            2 & 1 & -1 & 2\\
            0 & 5 & -3 & 6\\
            0 & 0 & -2 & 6\\
            0& 0 & 0 & 8\\
            \end{bmatrix}
            =
            U
            \end{equation*}
            $$
            The first step of the forward elimination procedure of the naive Gaussian elimination process gives
            $$
            \begin{equation*}
            \begin{bmatrix}
            2 & 1 & -1 & 2\\
            0 & 3 & -1 & 2\\
            0 & 6 & -3 & 8\\
            0 & 9 & 2 & 4\\
            \end{bmatrix}
            \begin{bmatrix}
            x_1 \\
            x_2 \\
            x_3 \\
            x_4 \\
            \end{bmatrix}
            =
            \begin{bmatrix}
            -3 \\
            -1 \\
            -13 \\
            -4 \\
            \end{bmatrix}
            \end{equation*}
            $$
            This result can be obtained by multiplying by a lower triangular matrix M1:
            $$ M_{1}Ax = M_{1}b$$
            where
            $$
            \begin{equation*}
            M_1
            =
            \begin{bmatrix}
            1 & 0 & 0 & 0\\
            -2 & 1 & 0 & 0\\
            1 & 0 & 1 & 0\\
            -2 & 0 & 0 & 1\\
            \end{bmatrix}
            \end{equation*}
            $$
            Note that row operations used in the first step are
            $$ R_2 → R_2 − 2R_1 $$
            $$ R_3 → R_3 + R_1 $$
            $$ R_4 → R_4 − 2R_1 $$
            The second forward elimination step gives
            $$
            \begin{equation*}
            \begin{bmatrix}
            2 & 1 & −1 & 2 \\
            0 & 3 & −1 & 2 \\
            0 & 0 & −1 & 4 \\
            0 & 0 & 1 −& 2 \\
            \end{bmatrix}
            \begin{bmatrix}
            x_1\\
            x_2\\
            x_3\\
            x_4\\
            \end{bmatrix}
            =
            \begin{bmatrix}
            −3 \\
            −1\\
            −11\\
            7\\
            \end{bmatrix}
            \end{equation*}
            $$
            This is equivalent to
            $$ M_2M_1Ax = M_2M_1b $$
            Note that the row operations used in this step are
            $$
            R_3 → R_3 − 2R_2 \\
            R_4 → R_4 − 3R_2 \\
            $$
            Thus,
            $$
            \begin{equation*}
            M_2 =
            \begin{bmatrix}
            1 & 0 & 0 & 0 \\
            0 & 1 & 0 & 0 \\
            0 & −2 & 1 & 0 \\
            0 & −3 & 0 & 1 \\
            \end{bmatrix}
            \end{equation*}
            $$
            The third step gives the upper triangular form
            $$
            \begin{equation*}
            \begin{bmatrix}
            2 & 1 & −1 & 2 \\
            0 & 3 & −1 & 2 \\
            0 & 0 & −1 & 4 \\
            0 & 0 & 0 & 2 \\
            \end{bmatrix}
            \begin{bmatrix}
            x_1 \\
            x_2 \\
            x_3 \\
            x_4 \\
            \end{bmatrix}
            =
            \begin{bmatrix}
            −3 \\
            −1 \\
            −11 \\
            −4 \\
            \end{bmatrix}
            \end{equation*}
            $$
            which is equivalent to
            $$ M_3M_2M_1Ax = M_3M_2M_1b .$$
            Since the row operation used is
            $$ R_4 → R_4 + R_3 $$
            It follows that
            $$
            \begin{equation*}
            M_3 =
            \begin{bmatrix}
            1 & 0 & 0 & 0 \\
            0 & 1 & 0 & 0 \\
            0 & 0 & 1 & 0 \\
            0 & 0 & 1 & 1 \\
            \end{bmatrix}
            \end{equation*}
            $$
            Thus, the matrix M can be obtained as a product of the three multiplier matrices:
            $$ M = M_3M_2M_1 $$
            The forward elimination process can thus be interpreted as follows:
            $ MA = U $
            $$
            \begin{align*}
            A &= M^{−1}U \\
            &= M_1^{−1}M_2^{−1}M_3^{−1}U \\
            &= LU \\
            \end{align*}
            $$
            where $ L = M_1^{−1}M_2^{−1}M_3^{−1}$. The inverses $M_1^{−1},M_2^{−1},M_3^{−1}$ can be obtained by simply changing
            the signs of the multipliers. Thus, we have
            $$
            \begin{equation*}
            L =
            \begin{bmatrix}
            1 & 0 & 0 & 0 \\
            2 & 1 & 0 & 0 \\
            −1 & 0 & 1 & 0 \\
            2 & 0 & 0 & 1 \\
            \end{bmatrix}
            \begin{bmatrix}
            1 & 0 & 0 & 0 \\
            0 & 1 & 0 & 0 \\
            0 & 2 & 1 & 0 \\
            0 & 3 & 0 & 1 \\
            \end{bmatrix}
            \begin{bmatrix}
            1 & 0 & 0 & 0 \\
            0 & 1 & 0 & 0 \\
            0 & 0 & 1 & 0 \\
            0 & 0 & −1 & 1 \\
            \end{bmatrix}
            =
            \begin{bmatrix}
            1 & 0 & 0 & 0 \\
            2 & 1 & 0 & 0 \\
            −1 & 2 & 1 & 0 \\
            2 & 3 & −1 & 1 \\
            \end{bmatrix}
            \end{equation*}
            $$
            Given any matrix A, the naive Gaussian elimination method can be used to decompose
            the matrix to LU form as follows:
            <h3 class="h3 mt-5">step 1</h3>
            $$
            \begin{array}{cc}
            R_2 → R_2 − 2R_1 \\
            R_3 → R_3 + R_1 \\
            R_4 → R_4 − 2R_1 \\
            \end{array}
            \begin{bmatrix}
            2 & 1 & −1 & 2 \\
            0 & 3 & −1 & 2 \\
            0 & 6 & −3 & 8 \\
            0 & 9 & −2 & 4 \\
            \end{bmatrix}
            $$
            $$
            M_1 =
            \begin{bmatrix}
            1 & 0 & 0 & 0 \\
            −2 & 1 & 0 & 0 \\
            1 & 0 & 1 & 0 \\
            −2 & 0 & 0 & 1 \\
            \end{bmatrix}
            ,M_1^{−1} =
            \begin{bmatrix}
            1 & 0 & 0 & 0 \\
            2 & 1 & 0 & 0 \\
            −1 & 0 & 1 & 0 \\
            2 & 0 & 0 & 1 \\
            \end{bmatrix}
            $$
            <h3 class="h3 mt-5">step 2</h3>
            $$
            \begin{array}{cc}
            R_3 → R_3 − 2R_2 \\
            R_4 → R_4 − 3R_2 \\
            \end{array}
            \begin{bmatrix}
            2 & 1 & −1 & 2 \\
            0 & 3 & −1 & 2 \\
            0 & 0 & −1 & 4 \\
            0 & 0 & 1 & −2 \\
            \end{bmatrix}
            $$
            $$
            M2 =
            \begin{bmatrix}
            1 & 0 & 0 & 0 \\
            0 & 1 & 0 & 0 \\
            0 & −2 & 1 & 0 \\
            0 & −3 & 0 & 1 \\
            \end{bmatrix}
            , M_2^{−1} =
            \begin{bmatrix}
            1 & 0 & 0 & 0 \\
            0 & 1 & 0 & 0 \\
            0 & 2 & 1 & 0 \\
            0 & 3 & 0 & 1 \\
            \end{bmatrix}
            $$
            <h3 class="h3 mt-5">step 3</h3>
            $$
            \begin{array}{cc}
            R_4 → R_4 + R_3 \\
            \end{array}
            \begin{bmatrix}
            2 & 1 & −1 & 2 \\
            0 & 3 & −1 & 2 \\
            0 & 0 & −1 & 4 \\
            0 & 0 & 0 & 2 \\
            \end{bmatrix}
            $$
            $$
            M_3 =
            \begin{bmatrix}
            1 & 0 & 0 & 0 \\
            0 & 1 & 0 & 0 \\
            0 & 0 & 1 & 0 \\
            0 & 0 & 1 & 1 \\
            \end{bmatrix}
            , M_3^{−1} =
            \begin{bmatrix}
            1 & 0 & 0 & 0 \\
            0 & 1 & 0 & 0 \\
            0 & 0 & 1 & 0 \\
            0 & 0 & −1 & 1 \\
            \end{bmatrix}
            $$
            $$
            U =
            \begin{bmatrix}
            2 & 1 & −1 & 2 \\
            0 & 3 & −1 & 2 \\
            0 & 0 & −1 & 4 \\
            0 & 0 & 0 & 2 \\
            \end{bmatrix}
            $$
            $$
            \begin{align}
            L &= M_1^{-1}M_2^{−1}M_3^{−1} \\
            &=
            \begin{bmatrix}
            1 & 0 & 0 & 0 \\
            2 & 1 & 0 & 0 \\
            −1 & 0 & 1 & 0 \\
            2 & 0 & 0 & 1 \\
            \end{bmatrix}
            \begin{bmatrix}
            1 & 0 & 0 & 0 \\
            0 & 1 & 0 & 0 \\
            0 & 2 & 1 & 0 \\
            0 & 3 & 0 & 1 \\
            \end{bmatrix}
            \begin{bmatrix}
            1 & 0 & 0 & 0 \\
            0 & 1 & 0 & 0 \\
            0 & 0 & 1 & 0 \\
            0 & 0 & −1 & 1 \\
            \end{bmatrix} \\
            &=
            \begin{bmatrix}
            1 & 0 & 0 & 0 \\
            2 & 1 & 0 & 0 \\
            −1 & 2 & 1 & 0 \\
            2 & 3 & −1 & 1 \\
            \end{bmatrix}
            \end{align}
            $$
          </p>
          <h2 class="h2 mt-5">Solving linear equations using LU factorisation</h2>
          <p class="lead mb-4">
            Assume that $A$ has a $LU$ factorization. The solution $X$ to the linear system $AX = b $, as
            follows:
            $$
            \begin{align}
            AX &= b \\
            LUX &= b \\
            LZ &= b, where Z = UX;
            \end{align}
            $$
            To solve the matrix equation for $X$, first we solve $LZ = b$ for $Z$ using the forward-substitution
            method, then solve $UX = Z$ for $X$ by backward-substitution method.
          </p>
        </section>
      </mdb-col>
    </mdb-row>
    <div class="icon-container">
      <v-btn
        id="btnPdf"
        color="blue"
        dark
        fab
        @click.native="savePdf"
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
import {  mdbContainer, mdbRow, mdbCol, mdbDropdownItem, mdbModal, mdbModalHeader,
  mdbModalTitle, mdbModalBody, mdbBtn, mdbModalFooter} from 'mdbvue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { SemipolarSpinner } from 'epic-spinners'
export default {
  name: 'NotesPage',
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    SemipolarSpinner,
    Loading,
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter,
    mdbBtn
  },
  data () {
    return {
      isLoading: true,
      fullPage: true,
      show: false,
      showModal: false,
      modalTitle: undefined,
      modalMessage: undefined,
    }
  },
  mounted: function () {
    this.renderMathJax()
    this.toggleLoader(false)
  },
  methods: {
    savePdf () {
      this.toggleModal('Note:', 'This feature is comming soon')
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
      if (window.MathJax) {
        window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, window.body])
      }
    }
  }

}
</script>

<style>
section.preview {
  border: 1px solid #e0e0e0;
  padding: 15px;
  overflow-x: scroll;
}
section.preview ul {
  list-style: none;
  padding-left: 0;
  margin-left: 0;
}
section.preview ul strong {
  font-weight: 900;
  font-family: "Times New Roman", Times, serif;
  font-size: 1.25em !important;
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
</style>
