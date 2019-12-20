<template>
  <v-card dark>
    <v-navigation-drawer
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      app
      dark
      temporary
      class="primary"
    >
      <v-img
        :src="image"
        height="100%"
        class="avatar"
      >
        <v-layout
          class="fill-height"
          tag="v-list"
          column
        >
          <v-list-tile avatar>
            <v-list-tile-avatar color="white">
              <v-img
                :src="logo"
                height="34"
                contain
              />
            </v-list-tile-avatar>
            <v-list-tile-title class="title">Numerical Analysis I</v-list-tile-title>
          </v-list-tile>
          <v-divider />
          <v-list-tile
            v-for="(link, i) in links"
            :key="i"
            :hre="link.to"
            :active-class="color"
            avatar
            class="v-list-item"
          >
            <v-list-tile-action>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-title v-text="link.text" />
          </v-list-tile>
          <v-list-tile
            disabled
            active-class="primary"
            class="v-list-item v-list__tile--buy"
            to="/upgrade"
          />
        </v-layout>
      </v-img>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
// Utilities
import { mapMutations, mapState } from 'vuex'

export default {
  data: () => ({
    logo: './img/vuetifylogo.png',
    responsive: false,
    links: [
      {
        to: '/dashboard',
        icon: 'mdi-view-dashboard',
        text: 'Dashboard'
      },
      {
        to: '/user-profile',
        icon: 'mdi-account-edit',
        text: 'User Profile'
      },
      {
        to: 'https://limits.surge.sh.surge.sh',
        icon: 'mdi-book-open',
        text: 'Limits'
      },
      {
        to: 'https://ludecomposition.surge.sh',
        icon: 'mdi-book-open',
        text: 'LU Decomposition'
      },
      {
        to: 'https://polynomialinterpolation.surge.sh',
        icon: 'mdi-book-open',
        text: 'Polynomial Interpolation'
      },
      {
        to: 'https://numericalintergration.surge.sh',
        icon: 'mdi-book-open',
        text: 'Numerical Integration'
      }
    ]
  }),
  computed: {
    ...mapState('app', ['drawer', 'clipped', 'color']),
    drawer: {
      get () {
        return this.$store.state.app.drawer
      },
      set (val) {
        this.$store.commit('app/setDrawer', val)
      }
    }
  },
  mounted () {
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },
  methods: {
    onResponsiveInverted () {
      if (window.innerWidth < 991) {
        this.responsive = true
      } else {
        this.responsive = false
      }
    }
  }
}
</script>

<style lang="scss">
#app-drawer {
  .v-list__tile {
    border-radius: 4px;

    &--buy {
      margin-top: auto;
      margin-bottom: 17px;
    }
  }

  .v-image__image--contain {
    top: 9px;
    height: 60%;
  }

  .search-input {
    margin-bottom: 30px !important;
    padding-left: 15px;
    padding-right: 15px;
  }
}
</style>
