<template>
  <q-page class="row justify-center wrap">
    <q-card flat bordered class="col-xs-12 col-md-10 bg-grey-1">
      <q-card-section>
        <div class="text-h2 text-bold tex-italic">Video Tutorials</div>
      </q-card-section>

      <q-card-section class="flex">Prototype of the spectral calculator</q-card-section>
      <div class="q-pa-md">
        <q-carousel animated v-model="slide" arrows navigation infinite>
          <q-carousel-slide name="soft-jazz">
            <q-video class="absolute-full" src="https://www.youtube.com/embed/k3_tw44QsZQ" />
          </q-carousel-slide>

          <q-carousel-slide name="Rihanna">
            <q-video class="absolute-full" src="https://www.youtube.com/embed/kOkQ4T5WO9E" />
          </q-carousel-slide>

          <q-carousel-slide name="chill-mix">
            <q-video class="absolute-full" src="https://www.youtube.com/embed/rQLhZlI6aTM" />
          </q-carousel-slide>
        </q-carousel>
        <div class="row justify-center q-gutter-sm">
          <div
            v-for="index in inView.length"
            :key="index"
            :data-id="index - 1"
            class="example-item q-pa-sm flex flex-center relative-position"
            v-intersection="onIntersection"
          >
            <transition name="q-transition--scale">
              <q-card class="video-card" v-if="inView[index - 1]">
                <q-video src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0" />

                <q-card-section>
                  <div class="text-h6">Our Changing Planet</div>
                  <div class="text-subtitle2">by John Doe</div>
                </q-card-section>

                <q-card-section>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </q-card-section>
              </q-card>
            </transition>
          </div>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: "videos",
  metaInfo() {
    return {
      title: "Spectral Calculator - videos"
    };
  },
  data() {
    return {
      // eslint-disable-next-line
      inView: Array.apply(null, Array(50)).map(_ => false),
      slide:  'Rihanna'
    };
  },

  methods: {
    onIntersection(entry) {
      const index = parseInt(entry.target.dataset.id, 10);
      setTimeout(() => {
        this.inView.splice(index, 1, entry.isIntersecting);
      }, 50);
    }
  }
};
</script>
<style lang="sass" scoped>
.example-item
  width: 100%
  max-width: 300px
</style>
