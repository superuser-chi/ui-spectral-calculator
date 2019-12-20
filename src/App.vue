<template>
  <!-- App.vue -->

  <v-app>

    <core-drawer />

    <v-app-bar app>
      <core-toolbar />
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-content>
      <!-- If using vue-router -->
      <core-view />
    </v-content>

  </v-app>
</template>

<style lang="scss">
/* Remove in 1.2 */
.v-datatable thead th.column.sortable i {
  vertical-align: unset;
}
.v-content {
  padding: 0 !important;
}
.theme--light.application {
  background: white;
}
</style>
