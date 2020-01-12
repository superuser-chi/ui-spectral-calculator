<template>
  <q-page class="row justify-center wrap">
    <q-ajax-bar ref="bar" position="bottom" color="primary" size="10px" skip-hijack />
    <q-card flat bordered class="col-xs-12 col-md-10 bg-grey-1">
      <div class="q-pa-md">
        <q-card class="sub-card bg-grey-4">


          <q-card-section>
            <div class="q-pa-md">
              <div class="q-gutter-md" style>
                <q-select
                  outlined
                  v-model="example"
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
          <q-card-actions>
            <q-btn :loading="loading" color="red" @click="simulateProgress">
              Generate Solution
              <template v-slot:loading>
                <q-spinner-gears />
              </template>
            </q-btn>
          </q-card-actions>
          <q-separator dark />
        </q-card>
      </div>
      <div class="q-pa-md">
        <q-card class="sub-card bg-grey-4" v-show="question">
          <q-card-section>
            <div class="text-h6">Example</div>
          </q-card-section>

          <q-card-section>
             <vue-mathjax ref="answer" :formula="question" :options="props" class="col-12" />
          </q-card-section>

          <q-separator dark />
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
      title: "SQLM Solver"
    };
  },
  data() {
    return {
      answer: undefined,
      var: "x",
      loading: false,
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
    this.example = this.examples[0];
  },
  watch: {
    example: function() {
      this.question = undefined;
      this.working = undefined;
    }
  },
  methods: {
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
      let example = this.examples.indexOf(this.example) + 1
      this.$store.dispatch("post/getQuestionSolution", {"example_number": example}).then(
        response => {
          this.question = response.data["example"];
          this.working = response.data["working"];

          // this.update_element("working");
          if (this.$refs.bar) {
            this.$refs.bar.stop();
          }
        },
        error => {
          // eslint-disable-next-line no-console
          console.log(error);
          this.setMessage("AN error has ocured" + error.toString());
          this.toggleDialog();
          this.reset();
        }
      );
    },
    reset() {
      this.example = undefined;
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
