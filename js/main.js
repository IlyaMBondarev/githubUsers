"use strict";

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

let store = new Vuex.Store({
  state: {
    users: [],
    total: 0
  },
  mutations: {
    setUsers: function setUsers(state, users) {
      state.users = users.items;
      state.total = users.total_count;
    },
    addUsers: function addUsers(state, users) {
      for ( let i = 0; i < users.length; i++) {
        state.users.push(users[i]);
      }
    }
  },
  actions: {
    searchUsers: async function searchUsers(_ref, settings) {
      let commit = _ref.commit;

      try {
        let users = await (await fetch("https://api.github.com/search/users?q=".concat(settings.q, "&sort=repositories&order=").concat(settings.order, "&per_page=24&page=").concat(settings.page))).json();

        if (users.items) {
          commit("setUsers", users);
          return false;
        } else {
          return true;
        }
      } catch (e) {
        return true;
      }
    },
    addUsers: async function addUsers(_ref2, settings) {
      let commit = _ref2.commit;

      try {
        let users = await (await fetch("https://api.github.com/search/users?q=".concat(settings.q, "&sort=repositories&order=").concat(settings.order, "&per_page=24&page=").concat(settings.page))).json();

        if (users.items) {
          commit("addUsers", users.items);
          return false;
        } else {
          return true;
        }
      } catch (e) {
        return true;
      }
    },
    getUser: async function getUser(_ref3, login) {
      _objectDestructuringEmpty(_ref3);

      return await (await fetch("https://api.github.com/users/".concat(login))).json();
    }
  },
  getters: {
    users: function users(s) {
      return s.users;
    },
    total: function total(s) {
      return s.total;
    }
  }
});
let Search = {
  data: function data() {
    return {
      q: '',
      filtered: '',
      order: 'desc',
      settings: {
        q: '',
        order: 'desc',
        page: 1
      },
      empty: false,
      searched: false,
      loading: false,
      error: false
    };
  },
  computed: {
    total: function total() {
      return this.$store.getters.total;
    },
    users: function users() {
      return this.$store.getters.users;
    }
  },
  watch: {
    q: function q() {
      this.empty = false;
    }
  },
  mounted: function mounted() {
    let _this = this;

    let self = this;
    window.addEventListener('scroll', async function () {
      if (self.searched && self.users && self.users.length < self.total && window.innerHeight + window.pageYOffset >= 0.9 * document.body.scrollHeight && !_this.loading) {
        self.settings.page++;
        _this.loading = true;
        _this.error = await self.$store.dispatch("addUsers", self.settings);
        _this.loading = false;
      }
    });
  },
  methods: {
    filter: function filter(str) {
      return str.match(/[a-zA-Zа-яА-Я0-9]/gi).join('');
    },
    search: async function search() {
      let filtered = this.filter(this.q);

      if (filtered && filtered.length) {
        this.searched = false;
        this.filtered = filtered;
        this.settings.q = this.filtered;
        this.settings.order = this.order;
        this.settings.page = 1;
        this.error = await this.$store.dispatch("searchUsers", this.settings);
        this.searched = true;
      } else {
        this.empty = true;
      }
    }
  },
  template: " <div>\n                    <form @submit.prevent=\"search\" class=\"settings\">\n\n                        <div class=\"sort\">\n                            <p class=\"sort__title\">\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u043E</p>\n                            <div class=\"sort__items\">\n                                <div class=\"sort__item\">\n                                    <input id=\"descending\" type=\"radio\" name=\"order\" value=\"desc\" checked v-model=\"order\">\n                                    <label for=\"descending\">\u0443\u0431\u044B\u0432\u0430\u043D\u0438\u044E</label>\n                                </div>\n                                <div class=\"sort__item\">\n                                    <input id=\"ascending\" type=\"radio\" name=\"order\" value=\"asc\" v-model=\"order\">\n                                    <label for=\"ascending\">\u0432\u043E\u0437\u0440\u0430\u0441\u0442\u0430\u043D\u0438\u044E</label>\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"search\">\n                            <p class=\"search__title\">\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043B\u043E\u0433\u0438\u043D \u0438\u043B\u0438 \u0435\u0433\u043E \u0447\u0430\u0441\u0442\u044C:</p>\n                            <div class=\"search__item\">\n                                <input type=\"text\" name=\"q\" placeholder=\"Tom\" v-model=\"q\" :class=\"empty ? 'empty' : ''\">\n                                <button>\u041D\u0430\u0439\u0442\u0438</button>\n                                <p class=\"search__empty\" v-if=\"empty\">\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 \u0437\u0430\u043F\u0440\u043E\u0441. \u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u043E\u043F\u044B\u0442\u043A\u0443</p>\n                            </div>\n                        </div>\n\n                    </form>\n\n                    <h2 class=\"error\" v-if=\"error\">\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430</h2>\n                    <div class=\"results\" v-else-if=\"searched\">\n                        <h2 class=\"results__title\">\u041F\u043E \u0437\u0430\u043F\u0440\u043E\u0441\u0443 \"{{ filtered }}\" \u043D\u0430\u0439\u0434\u0435\u043D\u043E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439: {{ total }}</h2>\n                        <div class=\"users\">\n                            <article class=\"users__user\" v-for=\"user in users\" v-keys=\"user.id\">\n                                <router-link :to=\"'/user?q=' + user.login\">\n                                    <div class=\"users__avatar\">\n                                        <img :src=\"user.avatar_url\" alt=\"\">\n                                    </div>\n                                    <p class=\"users__login\"> \u041B\u043E\u0433\u0438\u043D: {{ user.login }}</p>\n                                </router-link>\n                            </article>\n                        </div>\n                    </div>\n                </div>"
};
let User = {
  data: function data() {
    return {
      user: {},
      login: '',
      loading: true,
      error: false
    };
  },
  created: function created() {
    let arrGet = window.location.hash.split('?').reverse()[0].split('&');
    arrGet = arrGet.map(function (query) {
      return query.split('=');
    });
    let login = '';

    for (let indexOfQuery = 0; indexOfQuery < arrGet.length; indexOfQuery++) {
      if (arrGet[indexOfQuery][0] === 'q') {
        login = arrGet[indexOfQuery][1];
        break;
      }
    }

    login ? this.login = login : '';
  },
  mounted: function mounted() {
    this.getUser();
  },
  methods: {
    getUser: async function getUser() {
      let user = await this.$store.dispatch("getUser", this.login);

      if (user.id) {
        user.created_at = user.created_at.split('T')[0].split('-').reverse().join('.');
        this.user = user;
      } else {
        this.error = true;
      }

      this.loading = false;
    }
  },
  template: " <div>\n                    <router-link to=\"/\" class=\"return\">\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u043A \u043F\u043E\u0438\u0441\u043A\u0443</router-link>\n                    <h2 class=\"loading\" v-if=\"loading\">\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430, \u043F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u043E\u0434\u043E\u0436\u0434\u0438\u0442\u0435...</h2>\n                    <h2 class=\"error\" v-if=\"error\">\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430. \u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u043E\u043F\u0435\u0439\u0442\u0435 \u0447\u0430\u044E, \u0441\u043E\u0431\u0435\u0440\u0438\u0442\u0435\u0441\u044C \u0441 \u043C\u044B\u0441\u043B\u044F\u043C\u0438 \u0438 \u043F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u043E\u043F\u044B\u0442\u043A\u0443 \u0438\u043B\u0438 \u0432\u0435\u0440\u043D\u0438\u0442\u0435\u0441\u044C \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443 \u043F\u043E\u0438\u0441\u043A\u0430.</h2>\n                    <section class=\"user\" v-else>\n                        <div class=\"user__avatar\">\n                            <img :src=\"user.avatar_url\" alt=\"\">\n                        </div>\n                        <div class=\"user__info\">\n                            <p class=\"user__text\"> ID \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F: {{ user.id }}</p>\n                            <p class=\"user__text\"> \u041B\u043E\u0433\u0438\u043D: {{ user.login }}</p>\n                            <p class=\"user__text\"><a :href=\"user.html_url\" target=\"_blank\">\u041E\u0441\u0442\u043E\u0440\u043E\u0436\u043D\u043E! \u0421\u0441\u044B\u043B\u043A\u0430 \u043D\u0430 \u0430\u043A\u043A\u0430\u0443\u043D\u0442 Github!</a>\n                            <p class=\"user__text\"> \u041F\u0443\u0431\u043B\u0438\u0447\u043D\u044B\u0445 \u0440\u0435\u043F\u043E\u0437\u0438\u0442\u043E\u0440\u0438\u0435\u0432: {{ user.public_repos }}</p>\n                            <p class=\"user__text\"><a :href=\"user.html_url + '?tab=repositories'\" target=\"_blank\">\u0412\u043F\u0435\u0440\u0435\u0434! \u041A \u0440\u0435\u043F\u043E\u0437\u0438\u0442\u043E\u0440\u0438\u044F\u043C!</a>\n                            <p class=\"user__text\"> \u041F\u043E\u0434\u043F\u0438\u0441\u0447\u0438\u043A\u043E\u0432: {{ user.followers }}</p>\n                            <p class=\"user__text\"> \u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D: {{ user.created_at }}</p>\n                        </div>\n                    </section>\n                </div>"
};
let routes = [{
  path: "/",
  name: "search",
  component: Search
}, {
  path: "/user",
  name: "user",
  component: User
}];
let router = new VueRouter({
  routes: routes
});
let App = {
  components: {
    Search: Search,
    User: User
  },
  template: " <main class=\"container\">\n                    <div id=\"qunit\"></div>\n                    <div id=\"qunit-fixture\"></div>\n                    <router-view />\n                </main>"
};
let app = new Vue({
  router: router,
  store: store,
  render: function render(h) {
    return h(App);
  }
}).$mount("#app");