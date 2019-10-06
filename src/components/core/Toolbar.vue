<template>
  <div>
    <!--Navbar-->
    <mdb-navbar
      position="top"
      info
      dark
      color="success"
      name="Your Logo"
      href="#"
      scrolling
    >
      <!-- mdbNavbar brand -->
      <mdb-navbar-brand href="#">Home</mdb-navbar-brand>
      <div class="v-toolbar-title">
        <v-toolbar-title class="tertiary--text font-weight-light">
          <v-btn
            v-if="responsive"
            class="default v-btn--simple"
            dark
            icon
            @click.stop="onClickBtn"
          >
            <v-icon>mdi-view-list</v-icon>
          </v-btn>
        </v-toolbar-title>
      </div>
      <mdb-navbar-toggler>
        <mdb-navbar-nav>
          <mdb-nav-item to="/">Notes</mdb-nav-item>
          <mdb-nav-item to="/example">Examples</mdb-nav-item>
          <mdb-nav-item to="/tutorial">Tutorial</mdb-nav-item>
        </mdb-navbar-nav>
      </mdb-navbar-toggler>
    </mdb-navbar>
    <!--/.Navbar-->
  </div>
</template>

<script>
// Utilities
import { mapMutations, mapState } from 'vuex'
import { mdbNavbarBrand, mdbNavbar, mdbNavItem, mdbNavbarNav, mdbNavbarToggler, mdbDropdown, mdbDropdownItem, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbBtn } from 'mdbvue'

export default {
  components: {
    mdbNavbar,
    mdbNavbarBrand,
    mdbNavItem,
    mdbNavbarNav,
    mdbNavbarToggler,
    mdbDropdown,
    mdbDropdownItem,
    mdbDropdownMenu,
    mdbDropdownToggle,
    mdbInput,
    mdbBtn
  },
  data: () => ({
    logo: './img/vuetifylogo.png',
    links: [
      {
        to: '/home',
        text: 'home'
      },
      {
        to: '/notes',
        text: 'notes'
      }]
  })
}
</script>

<style lang="scss">
* {
}
</style>
