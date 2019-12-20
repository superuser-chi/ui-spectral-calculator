/* eslint-disable eol-last */
import { evaluate, multiply, subtract, inv, lsolve, usolve } from 'mathjs'
export class Utils {
  static equationToLatex (A, x, b) {
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
  }
  static generateEmptyMatrix (n) {
    let emptyMatrix = []
    for (let i = 0; i < n; i++) {
      let row = Array(n).fill(0)
      emptyMatrix.push(row)
    }
    return emptyMatrix
  }
  static generateIdentityMatrix (n) {
    let matrix = Utils.generateEmptyMatrix(n)
    for (let i = 0; i < n; i++) {
      matrix[i][i] = 1
    }
    return matrix
  }
  static matrixToLatex (matrix, brackets = 'pmatrix') {
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
  }
  static vectorToLatex (vector) {
    let str = `\\begin{bmatrix}`
    for (let j = 0; j < vector.length; j++) {
      str += `${vector[j]} \\\\`
    }
    str = str.concat(`\\end{bmatrix}`)
    return str
  }
  static getRandomInt (min = -6, max = 6) {
    min = Math.ceil(min)
    max = Math.floor(max)
    let value = Math.floor(Math.random() * Math.floor(max - min + 1)) + min
    if (value === 0) {
      return Utils.getRandomInt(min, max)
    } else {
      return value
    }
  }
  static generateRandomVector (n, max = 5) {
    let vector = []
    for (let j = 0; j < n; j++) {
      vector.push(Utils.getRandomInt(-6, max))
    }
    return vector
  }
  static generateRandomMatrix (n) {
    let matrix = []
    for (let i = 0; i < n; i++) {
      let t = []
      for (let j = 0; j < n; j++) {
        t.push(Utils.getRandomInt(-6, 9))
      }
      matrix.push(t)
    }
    return matrix
  }
}
export class LUDecomposition {
  convertSolutionToLU (solutions, n, l, u) {
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= n; j++) {
        solutions.forEach(s => {
          if (s.str === `u_\\{${i}${j}\\}`) {
            u[i - 1][j - 1] = s.value
          } else if (s.str === `l_\\{${i}${j}\\}`) {
            l[i - 1][j - 1] = s.value
          }
        })
      }
    }
    return { l: l, u: u }
  }
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
  }
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
  }
  findVariables (equation) {
    let temp = this.findTerms(equation)
    let result = []
    for (let i = 0; i < temp.length; i++) {
      let nodes = temp[i].split('\\cdot')
      nodes.forEach(n => { result.push(n.trim()) })
    }
    return result
  }
  findRhsAndLhs (equation, splitter = '&=') {
    let nodes = equation.split(splitter)
    if (nodes.length === 2) {
      return { lhs: nodes[0], rhs: nodes[1] }
    } else {
      return { lhs: 'none', rhs: 'none' }
    }
  }
  findUnknowns (equation) {
    return this.findVariables(equation).filter(n => isFinite(n) === false)
  }
  findUnknownTerms (equation) {
    return this.findTerms(equation).filter(term => term.includes(this.findUnknowns(equation)))
  }
  generateDoolitleA (n) {
    let l = Utils.generateRandomMatrix(n)
    let u = Utils.generateRandomMatrix(n)
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
  }
  generateCroutA (n) {
    let l = Utils.generateRandomMatrix(n)
    let u = Utils.generateRandomMatrix(n)
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
  }
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
      }
    } else if (this.findTerms(equation).length === 2) {
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
  }
  makeRegexFriendly (equation) {
    return equation.replace(/\{/g, '\\{').replace(/\}/g, '\\}')
  }
  solveDoolitle (question) {
    question.working.steps = []
    let l = Utils.generateEmptyMatrix(question.n)
    let u = Utils.generateEmptyMatrix(question.n)
    for (let i = 0; i < question.n; i++) {
      for (let j = 0; j < question.n; j++) {
        if (i === j) {
          l[i][j] = '1'
          u[i][j] = `u_{${i + 1}${j + 1}}`
        } else if (i > j) {
          l[i][j] = `l_{${i + 1}${j + 1}}`
          u[i][j] = '0'
        } else if (i < j) {
          l[i][j] = '0'
          u[i][j] = `u_{${i + 1}${j + 1}}`
        }
      }
    }
    question.working.steps.push(` Denote the L and U matrices by
            $$\\\\
            \\begin{equation}
                L = ${Utils.matrixToLatex(l)}  \\hspace{0.35cm} and \\hspace{0.5cm} U = ${Utils.matrixToLatex(u)}
            \\end{equation}
        $$`)
    question.working.steps.push(`so that the equation $LU = A$ is represented as
            $$\\\\
            \\begin{equation}
                ${Utils.matrixToLatex(l)}${Utils.matrixToLatex(u)} = ${Utils.matrixToLatex(question.matrix)}
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
    question.u = result.u
    question.l = result.l
    question.working.steps.push(`Therefore we have`)
    question.working.steps.push(`
          $$\\begin{equation*}
              L = ${Utils.matrixToLatex(question.l)} \\hspace{ 0.2cm } and \\hspace{ 0.2cm } U = ${Utils.matrixToLatex(question.u)}
            \\end{equation*}
         $$`)
    if (question.solve) {
      question = this.solve(question)
    }
    return question
  }
  solveCrout (question) {
    question.working.steps = []
    let l = Utils.generateEmptyMatrix(question.n)
    let u = Utils.generateEmptyMatrix(question.n)
    for (let i = 0; i < question.n; i++) {
      for (let j = 0; j < question.n; j++) {
        if (i === j) {
          u[i][j] = '1'
          l[i][j] = `l_{${i + 1}${j + 1}}`
        } else if (i > j) {
          l[i][j] = `l_{${i + 1}${j + 1}}`
          u[i][j] = '0'
        } else if (i < j) {
          l[i][j] = '0'
          u[i][j] = `u_{${i + 1}${j + 1}}`
        }
      }
    }
    question.working.steps.push(` Denote the L and U matrices by
          $$\\\\
          \\begin{equation}
              L = ${Utils.matrixToLatex(l)}  \\hspace{0.35cm} and \\hspace{0.5cm} U = ${Utils.matrixToLatex(u)}
          \\end{equation}
         $$`)
    question.working.steps.push(`so that the equation $LU = A$ is represented as
          $$\\\\
          \\begin{equation}
              ${Utils.matrixToLatex(l)}${Utils.matrixToLatex(u)} = ${Utils.matrixToLatex(question.matrix)}
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
      let s = { str: `l_\\{${i + 1}1\\}`, value: question.matrix[i][0] }
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
    question.u = result.u
    question.l = result.l
    question.working.steps.push(`Therefore we have`)
    question.working.steps.push(`
          $$\\begin{equation*}
              L = ${Utils.matrixToLatex(l)} \\hspace{ 0.2cm } and \\hspace{ 0.2cm } U = ${Utils.matrixToLatex(u)}
            \\end{equation*}
         $$`)
    if (question.solve) {
      question = this.solve(question)
    }
    return question
  }
  solveNaiveGauss (question) {
    question.working.steps = []
    let l = Utils.generateEmptyMatrix(question.n)
    let u = Utils.generateEmptyMatrix(question.n)
    let A = question.matrix
    let mIInverse = []
    for (let i = 0; i < question.n - 1; i++) {
      let _mI = Utils.generateIdentityMatrix(question.n)
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
            ${Utils.matrixToLatex(A, 'bmatrix')} \\end{equation*} \\\\$$
            $$\\begin{equation*}
               M_{${i + 1}} = ${Utils.matrixToLatex(_mI, 'bmatrix')} \\hspace{ 0.2cm } and \\hspace{ 0.2cm }
               M^{-1}_{${i + 1}} = ${Utils.matrixToLatex(this.removeDecimals(inv(_mI)), 'bmatrix')}
            \\end{equation*}$$
            `
      if (i === question.n - 2) {
        u = A
        str += `$$\\begin{equation*} u = ${Utils.matrixToLatex(u, 'bmatrix')} \\end{equation*}$$`
      }
      question.working.steps.push(str + '$$\\\\$$')
      mIInverse.push(this.removeDecimals(inv(_mI)))
    }
    let str = `$$\\\\
          \\begin{align*}
            L &= `
    l = mIInverse[0]
    let str2 = Utils.matrixToLatex(mIInverse[0])
    for (let i = 0; i < mIInverse.length; i++) {
      str += `M^{-1}_{${i + 1}}`
      if (i !== mIInverse.length - 1) {
        l = multiply(l, mIInverse[i + 1])
        str2 += Utils.matrixToLatex(mIInverse[i])
      }
    }
    if (question.n !== 2) {
      str += `\\\\
             &= ${str2}`
    }
    str += `\\\\
             &= ${Utils.matrixToLatex(l)}
          \\end{align*}$$`
    question.working.steps.push(str)

    question.working.steps.push(`Therefore we have`)
    question.working.steps.push(`
          $$\\begin{equation*}
              L = ${Utils.matrixToLatex(l)} \\hspace{ 0.2cm } and \\hspace{ 0.2cm } U = ${Utils.matrixToLatex(u)}
            \\end{equation*}
         $$`)
    question.l = l
    question.u = u
    if (question.solve) {
      question = this.solve(question)
    }
    return question
  }
  solve (question) {
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
    ${Utils.matrixToLatex(question.l, 'bmatrix')} ${Utils.vectorToLatex(z)} = ${Utils.vectorToLatex(question.b)}
    \\end{equation*}
    $$`
    )
    question.working.steps.push(`
    Since L is lower triangular, we can use forward substitution to obtain $$ \\\\
    \\begin{equation*}
    ${Utils.vectorToLatex(z)} = ${Utils.vectorToLatex(lsolve(question.l, question.b))}
    \\end{equation*}
    $$`
    )
    z = lsolve(question.l, question.b)
    question.working.steps.push(`
    The equation Ux = z becomes  $$ \\\\
    \\begin{equation*}
     ${Utils.matrixToLatex(question.u, 'bmatrix')} ${Utils.vectorToLatex(x)} = ${Utils.vectorToLatex(z)}
    \\end{equation*}
    $$`
    )
    question.working.steps.push(`
    Finally, we apply backward substitution to solve for x and obtain: $$ \\\\
    \\begin{equation*}
    ${Utils.vectorToLatex(x)} = ${Utils.vectorToLatex(usolve(question.u, z))}
    \\end{equation*}
    $$`
    )
    return question
  }
  substitute (equation, variable, value) {
    let re = new RegExp(variable, 'g')
    return equation.replace(re, value)
  }
  removeDecimals (matrix) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        matrix[i][j] = Math.floor(matrix[i][j])
      }
    }
    return matrix
  }
}