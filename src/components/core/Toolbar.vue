<template>
  <div>
    <v-toolbar
      :clipped-left="clipped"
      color="#00c851"
      fixed
      app
    >
      <v-toolbar-side-icon @click.native="toggleDrawer" />
      <v-toolbar-title>LU Decomposition</v-toolbar-title>
      <template
        v-if="extendedSlot"
      >
        <v-toolbar-items>
          <v-btn to="/notes"> Notes</v-btn>
          <v-btn to="/videos">Videos</v-btn>
          <v-btn to="/examples">Examples</v-btn>
          <v-btn to="/tutorial">Tutorial</v-btn>
        </v-toolbar-items>
      </template>
      <v-spacer />
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon
          :id="state"
          @click.native="handleHeartClick"
        >mdi-heart</v-icon>
      </v-btn>
      <template v-if="!extendedSlot">
        <v-menu class="hidden-md-and-up">
          <v-icon
            slot="activator"
            class="white-text"
          >mdi-dots-vertical</v-icon>
          <v-list>
            <v-list-tile
              v-for="item in menu"
              :key="item.icon"
              :to="item.to"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
      </template>
    </v-toolbar>
    <mdb-modal
      :show="showModal"
      class="text-left"
      success
      @close="showModal = false"
    >
      <mdb-modal-header class="white-text">
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
          rows="2"
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
  </div>
</template>

<script>
// Utilities
import { mapMutations, mapState } from 'vuex'
// eslint-disable-next-line no-multi-spaces
import {  mdbNavbarBrand, mdbNavbar, mdbNavItem, mdbNavbarNav,
  mdbNavbarToggler, mdbDropdown, mdbDropdownItem, mdbDropdownMenu, mdbDropdownToggle, mdbInput, mdbBtn,
  // eslint-disable-next-line object-curly-spacing
  mdbModal, mdbModalHeader, mdbModalBody, mdbModalFooter, mdbTextarea, mdbIcon} from 'mdbvue'
import HeartIcon from 'vue-material-design-icons/Heart.vue'
import CommentIcon from 'vue-material-design-icons/Comment.vue'
import MoreIcon from 'vue-material-design-icons/More.vue'
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
    HeartIcon,
    MoreIcon
  },
  data: () => ({
    logo: './img/icons/profile.png',
    showModal: false,
    extendedSlot: true,
    responsive: false,
    like: false,
    state: 'unlike',
    menu: [
      { icon: 'home', title: 'Notes', to: '/' },
      { icon: 'info', title: 'Videos', to: '/videos' },
      { icon: 'warning', title: 'Examples', to: '/examples' },
      { icon: 'success', title: 'Tutorial', to: '/tutorial' }
    ]
  }),
  computed: {
    ...mapState('app', ['drawer', 'clipped']),
    ...mapMutations('app', ['setDrawer'])
  },
  watch: {
    like: function (value) {
      if (value === false) {
        this.state = 'unlike'
      } else {
        this.state = 'like'
      }
    },
    responsive: function (value) {
      this.extendedSlot = !this.extendedSlot
    }
  },
  mounted () {
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)
  },
  methods: {
    toggleDrawer () {
      this.$store.commit('app/setDrawer', !this.$store.state.app.drawer)
    },
    handleHeartClick () {
      this.like = !this.like
    },
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
#like {
  color: rgb(239, 9, 94) !important;
}
.v-toolbar__title {
  color: white !important;
}
.v-btn__content {
  color: white !important;
}
.theme--light.v-btn:not(.v-btn--icon):not(.v-btn--flat) {
  background-color: transparent !important;
}
.v-btn:not(.v-btn--depressed):not(.v-btn--flat) {
  box-shadow: none !important;
}
</style>
