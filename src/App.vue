<template>
  <v-app>
    <Toolbar />

    <v-content>
      <v-container grid-list-xs>
        <router-view class="ma-1"></router-view>
      </v-container>
    </v-content>

    <Snackbars />
  </v-app>
</template>

<script>
import Toolbar from './components/Toolbar'
import Snackbars from './components/Snackbars'

export default {
  name: 'App',
  components: {
    Toolbar, Snackbars
  },
  data: () => ({

  })
}
</script>
