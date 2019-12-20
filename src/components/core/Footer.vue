<template>
  <v-content>
    <v-card height="40px">
      <div class="core-footer">
        <section class="text-white text-center">
          <mdb-rating
            :active-far="true"
            :options="colorfulFaceOptions"
            far
            icon="meh-blank"
          />
        </section>
        <p class="text-center">
          Copyright &copy; {{ new Date().getFullYear() }} All rights reserved
        </p>
      </div>
    </v-card>
  </v-content>
</template>

<script>
import { mdbContainer, mdbRow, mdbIcon, mdbRating } from 'mdbvue'
export default {
  name: 'RatingPage',
  components: {
    mdbContainer,
    mdbRow,
    mdbIcon,
    mdbRating
  },
  data () {
    return {
      basicRating: 3,
      colorfulFaceOptions: [
        {
          feedback: 'Very bad',
          icon: 'sad-cry',
          iconActiveClass: 'red-text'
        },
        {
          feedback: 'Poor',
          icon: 'frown',
          iconActiveClass: 'orange-text'
        },
        {
          feedback: 'OK',
          icon: 'meh',
          iconActiveClass: 'yellow-text'
        },
        {
          feedback: 'Good',
          icon: 'smile',
          iconActiveClass: 'lime-text'
        },
        {
          feedback: 'Excellent',
          icon: 'laugh-beam',
          iconActiveClass: 'blue-text'
        }
      ]
    }
  },
  methods: {
    submitFeedback (message) {
      console.log(message)
    }
  }
}
</script>

<style>
.theme--light.v-card {
  background-color: #00c851 !important;
  border-color: #fff;
  color: #fff !important;
}
.yellow-text-dark-2 {
  color: #d7c952 !important;
}
.yellow-text-dark-3 {
  color: #9b9247 !important;
}
.yellow-text-dark-4 {
  color: #827c47 !important;
}
.yellow-text-dark-1 {
  color: #e9d947 !important;
}
.core-footer section {
  text-align: center !important;
}
</style>
