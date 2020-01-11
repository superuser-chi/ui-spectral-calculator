<template>
  <q-page class="row justify-center wrap">
    <q-ajax-bar ref="bar" position="bottom" color="primary" size="10px" skip-hijack />
    <q-card flat bordered class="col-xs-12 col-md-10 bg-grey-1">
      <q-card-section>
        <div class="text-h2 text-bold tex-italic">Spectral Calculator Prototype</div>
      </q-card-section>

      <q-card-section class="flex">Prototype of the spectral calculator</q-card-section>
      <div class="q-pa-md">
        <q-card class="sub-card bg-grey-4">
          <q-card-section>
            <div class="text-h6">Configuration</div>
          </q-card-section>

          <q-card-section>
            <div class="q-pa-md">
              <div class="q-gutter-md" style>
                <q-select
                  outlined
                  v-model="exampleNumber"
                  label="Pick example to solve"
                  :options="examples"
                  :dense="dense"
                  :options-dense="denseOpts"
                >
                  <template v-slot:append>
                    <q-icon name="close" @click.stop="model = ''" class="cursor-pointer" />
                  </template>
                </q-select>
              </div>
            </div>
          </q-card-section>

          <q-separator dark />
        </q-card>
      </div>
      <div class="q-pa-md">
        <q-card class="sub-card bg-grey-4" v-show="example">
          <q-card-section>
            <div class="text-h6">Example</div>
          </q-card-section>

          <q-card-section>
            <code>{{ example }}</code>
          </q-card-section>

          <q-separator dark />

         <q-card-actions>
            <q-btn :loading="loading" color="red" @click="simulateProgress">
              Get solution
              <template v-slot:loading>
                <q-spinner-gears />
              </template>
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <div class="q-pa-md" v-show="working">
        <q-card class="sub-card bg-grey-4">
          <q-card-section>
            <div class="text-h6">Solution</div>
          </q-card-section>

          <q-card-section>
            <vue-mathjax ref="answer" :formula="answer" :options="props" class="col-12" />
            <q-separator dark />
            <vue-mathjax ref="working" :formula="working" :options="props" class="col-12" />
          </q-card-section>
        </q-card>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { VueMathjax } from "vue-mathjax";
import { mapState } from "vuex";
export default {
  name: "index",
  components: {
    VueMathjax
  },
  metaInfo() {
    return {
      title: "Spectral Calculator"
    };
  },
  data() {
    return {
      answer: undefined,
      var: "x",
      loading: false,
      exampleNumber: "Example 1",
      example: undefined,
      examples: ["Example 1", "Example 2", "Example 3", "Example 4"],
      question: undefined,
      dense: false,
      denseOpts: false,
      props: {
        type: Array,
        default: () => {}
      },
      working: undefined,
      showWorking: false,
      showAnswer: false
    };
  },
  computed: {
    ...mapState("app", ["dialog", "maximizedToggle", "message"]),
    logoUrl() {
      return require("@/assets/isolated-monochrome-black.svg");
      // The path could be '../assets/img.png', etc., which depends on where your vue file is
    },
    dialog: {
      get() {
        return this.$store.state.app.dialog;
      },
      set(val) {
        this.$store.commit("app/setdialog", val);
      }
    },
    message: {
      get() {
        return this.$store.state.app.message;
      },
      set(val) {
        this.$store.commit("app/setMessage", val);
      }
    },
    maximizedToggle: {
      get() {
        return this.$store.state.app.maximizedToggle;
      },
      set(val) {
        this.$store.commit("app/setMaximizedToggle", val);
      }
    }
  },
  mounted() {
    this.example = this.getExample(this.examples[0])
  },
  watch: {
    exampleNumber: function(){
      this.example = this.getExample(this.exampleNumber)
      this.working = undefined
    }
  },
  methods: {

    getExample(el) {
      let number = this.examples.indexOf(el) + 1;
      switch (number) {
        case 1:
          return {
            "a": "0",
            "b": "1",
            "var": `${this.var}`,
            "eqnSet": `{D[F[x], {x, 4}] + alpha*(x*D[F[x], {x, 3}] + 3*D[F[x], {x, 2}]) + Re*(F[x]*D[F[x], {x, 3}] - D[F[x], {x, 1}]*D[F[x], {x, 2}])}`,
            "unknowns": "{F[x]}",
            "leftBoundary": "{{F''[a] == 0, F[a] == 0}}",
            "rightBoundary": "{{F[b] == 1, F'[b] == 0}}"
          };

        case 2:
          return {
            "var": `${this.var}`,
            "a": "0",
            "b": "Infinity",
            "eqnSet": `{D[f[x], {x, 3}] + Subscript[[Beta], 
            0]*f[x]*D[f[x], {x, 2}] + Subscript[[Beta], 1]*(1 - D[f[x], {x, 1}]^2)}`,
            "unknowns": " {f[x]}",
            "leftBoundary": "{{f'[a] == 0, f[a] == 0}}",
            "rightBoundary": "{{f'[b] == 1}}"
          };

        case 3:
          return {
            "var": `${this.var}`,
            "a": "0",
            "b": "Infinity",
            "eqnSet": `{D[f[x], {x, 3}] + f[x]*D[f[x], {x, 2}] - 
            D[f[x], {x, 1}]^2 - M/(1 + m^2)*(D[f[x], {x, 1}] + m*g[x]), 
          D[g[x], {x, 2}] + f[x]*D[g[x], {x, 1}] - D[f[x], {x, 1}]*g[x] + 
            M/(1 + m^2)*(m*D[f[x], {x, 1}] - g[x])}`,
            "unknowns": "{f[x], g[x]} ",
            "leftBoundary": "{{f'[a] == 1, f[a] == fw}, {g[a] == 0}}",
            "rightBoundary": "{{f'[b] == 0}, {g[b] == 0}}"
          };

        case 4:
          return {
            "var": `${this.var}`,
            "a": "0",
            "b": "Infinity",
            "eqnSet": `{D[f[x], {x, 3}] + f[x]*D[f[x], {x, 2}] - 
            D[f[x], {x, 1}]^2 + Subscript[G, r]*\\[Theta][x] + 
            Subscript[G, c]*\\[Phi][x] - (M + \\[CapitalOmega])*
            D[f[x], {x, 1}], 
          1/Pr*D[\\[Theta][x], {x, 2}] + f[x]*D[\\[Theta][x], {x, 1}] + 
            Du*D[\\[Phi][x], {x, 2}] + D[f[x], {x, 2}]^2, 
          1/Sc*D[\\[Phi][x], {x, 2}] + f[x]*D[\\[Phi][x], {x, 1}] + 
            Sr*D[\\[Theta][x], {x, 2}] - \\[Gamma]*\\[Phi][x]}`,
            "unknowns": "{f[x], [Theta][x], [Phi][x]}",
            "leftBoundary": `{{f'[a] == 1, f[a] == fw}, {\\[Theta][a] == 1}, {\\[Phi][a] == 1}}`,
            "rightBoundary": "{{f'[b] == 0}, {[Theta][b] == 0}, {[Phi][b] == 0}}"
          };
      }
    },
    setMessage(message) {
      this.$store.commit("app/setMessage", message);
    },
    toggleDialog() {
      this.$store.commit("app/setDialog", !this.$store.state.app.dialog);
    },
    simulateProgress() {
      const bar = this.$refs.bar;
      bar.start();
      this.generateQuestion();
    },
    generateQuestion() {

      this.$store.dispatch("post/getQuestionSolution", this.example).then(
        response => {
          // this.question = response.data["question"];
          this.working = response.data["working"];

          // this.update_element("working");
          if (this.$refs.bar) {
            this.$refs.bar.stop();
          }
        },
        error => {
          // eslint-disable-next-line no-console
          console.log(error)
          this.setMessage("AN error has ocured" + error.toString());
          this.toggleDialog();
          this.reset();
        }
      );
    },
    reset() {
      this.question = undefined;
      this.working = undefined;
    },
    update_element(element) {
      this.$nextTick(() => {
        window.MathJax.Hub.Queue([
          "Typeset",
          window.MathJax.Hub,
          this.$refs[`${element}`]
        ]);
      });
    }
  }
};
</script>
<style lang="css" scoped>
.sub-card {
  overflow: auto;
}
.mjx-chtml {
  margin: 0.2em;
}
</style>
