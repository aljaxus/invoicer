import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const Snacks = {
  namespaced: true,
  state: {
    snackbars: []
  },
  mutations: {
    ADD_SNACKBAR: (state, snackbar) => state.snackbars.push(snackbar),
    REMOVE_FIRSTSNACK: state => state.snackbars.splice(0, 1),
    HIDE_FIRSTSNACK  (state) { state.snackbars[0].show = false }
  },
  actions: {
    addSnack ({ state, commit, rootState, rootGetters }, options) {
      let opt = {}

      opt.show = false
      opt.right = options.posx === 'right'
      opt.left = options.posx === 'left' || options.posx === undefined || options.posx === null
      opt.bottom = options.posy === 'bottom'
      opt.top = options.posy === 'top'
      opt.multiline = options.mode === 'multiline' || options.mode === 'multi-line' || options.msg.length > 55
      opt.vertical = options.mode === 'vertical'
      opt.color = options.color || (rootGetters['App/darkMode'] === true ? 'dark' : 'white')
      opt.textcolor = options.textcolor || (rootGetters['App/darkMode'] === true ? 'white' : 'text--darken-3 grey')
      opt.msg = options.msg || '/!\\ MESSAGE NOT DEFINED'
      opt.timeout = options.timeout || 6000
      opt.btn = options.btn || true
      opt.btntext = options.btntext || false
      opt.outlined = options.outlined || true
      opt.btncolor = options.btncolor || options.color || 'info'

      commit('ADD_SNACKBAR', opt)
    },
    removeFirst: context => context.commit('REMOVE_FIRSTSNACK'),
    hideSnack: context => {
      context.commit('HIDE_FIRSTSNACK')
      setTimeout(() => context.commit('REMOVE_FIRSTSNACK'), 250)
    }
  },
  getters: {
    getAllSnacks: state => state.snackbars,
    getFirstSnack: state => state.snackbars[0] || {}
  }
}

const App = {
  namespaced: true,
  state: {
    sidebarShown: false,
    sidebarMini: false,
    darkMode: true,
    denseMode: false
  },
  mutations: {
    TOGGLE_SIDEBAR_STATE (state, newState = null) { state.sidebarShown = newState != null ? newState : !state.sidebarShown },
    TOGGLE_SIDEBAR_MINI (state, newState = null) { state.sidebarMini = newState != null ? newState : !state.sidebarMini },
    TOGGLE_DARKMODE (state, newState = null) {
      const now = newState != null ? newState : !state.darkMode
      state.darkMode = now
      document.getElementById('body').style = 'background-color:' + (now ? '#303030;' : '#fff')
    },
    TOGGLE_DENSEMODE (state, newState = null) { state.denseMode = newState != null ? newState : !state.denseMode }
  },
  actions: {
    toggleSidebarState (context, newState = null) { context.commit('TOGGLE_SIDEBAR_STATE', newState) },
    toggleSidebarMini (context, newState = null) { context.commit('TOGGLE_SIDEBAR_MINI', newState) },
    toggleDarkMode (context, newState = null) { context.commit('TOGGLE_DARKMODE', newState) },
    toggleDenseMode (context, newState = null) { context.commit('TOGGLE_DENSEMODE', newState) }
  },
  getters: {
    sidebarState: state => state.sidebarShown,
    sidebarMini: state => state.sidebarMini,
    darkMode: state => state.darkMode,
    denseMode: state => state.denseMode
  }
}

export default new Vuex.Store({
  modules: {
    App,
    Snacks
  },
  state: {

  },
  mutations: {

  },
  actions: {

  }
})
