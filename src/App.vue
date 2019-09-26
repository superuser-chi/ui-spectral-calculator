<template>
  <v-app>
    <template>
      <core-toolbar />
    </template>
    <core-view />
  </v-app>
</template>

<style lang="scss">
/* Remove in 1.2 */
.v-datatable thead th.column.sortable i {
  vertical-align: unset;
}

.theme--light.application {
  background: white;
  color: rgba(0, 0, 0, 0.87);
}
</style>
