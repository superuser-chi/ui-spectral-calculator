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
          <mdb-nav-item to="/notes">Notes</mdb-nav-item>
          <mdb-nav-item to="/example">Examples</mdb-nav-item>
          <mdb-nav-item to="/tutorial">Tutorial</mdb-nav-item>
        </mdb-navbar-nav>
        <mdb-navbar-nav
          id="icons"
          right
        >
          <mdb-nav-item to="/notes">
            <v-icon>mdi-heart</v-icon>
          </mdb-nav-item>
          <mdb-nav-item @click="showModal = true">
            <v-icon>mdi-comment</v-icon>
          </mdb-nav-item>
        </mdb-navbar-nav>
      </mdb-navbar-toggler>
    </mdb-navbar>
    <mdb-modal
      :show="showModal"
      @close="showModal = false"
      class="text-left"
      success
    >
      <mdb-modal-header class="white-text">
        <h4 class="title">
          <mdb-icon icon="pencil-alt" /> Contact form</h4>
      </mdb-modal-header>
      <mdb-modal-body class="grey-text">
        <mdb-input
          size="sm"
          label="Your name"
          icon="user"
          group
          type="text"
          validate
          error="wrong"
          success="right"
        />
        <mdb-input
          size="sm"
          label="Your email"
          icon="envelope"
          group
          type="email"
          validate
          error="wrong"
          success="right"
        />
        <mdb-input
          size="sm"
          label="Subject"
          icon="tag"
          group
          type="text"
          validate
          error="wrong"
          success="right"
        />
        <mdb-textarea
          size="sm"
          :rows="2"
          label="Your message"
          icon="pencil-alt"
        />
      </mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn color="success">Save changes</mdb-btn>
        <mdb-btn
          outline="danger"
          @click.native="showModal = false"
        >Close</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
    <!--/.Navbar-->
  </div>
</template>

<script>
// Utilities
import { mapMutations, mapState } from 'vuex'
import {  mdbNavbarBrand, mdbNavbar, mdbNavItem, mdbNavbarNav,
  mdbNavbarToggler, mdbDropdown, mdbDropdownItem, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbBtn,
  mdbModal, mdbModalHeader, mdbModalBody, mdbModalFooter, mdbTextarea, mdbIcon} from 'mdbvue'
import HeartIcon from 'vue-material-design-icons/Heart.vue'
import CommentIcon from 'vue-material-design-icons/Comment.vue'
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
    mdbTextarea,
    mdbIcon,
    mdbBtn,
    mdbModal,
    mdbModalHeader,
    mdbModalBody,
    mdbModalFooter,
    CommentIcon,
    HeartIcon
  },
  data: () => ({
    logo: './img/vuetifylogo.png',
    showModal: false,
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
#icons .theme--light.v-icon {
  color: #fff !important;
}
</style>
