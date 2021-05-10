"use strict";

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var store = new Vuex.Store({
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
      users.forEach(function (user) {
        state.users.push(user);
      });
    }
  },
  actions: {
    searchUsers: function searchUsers(_ref, settings) {
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var commit, users;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                commit = _ref.commit;
                _context.prev = 1;
                _context.next = 4;
                return fetch("https://api.github.com/search/users?q=".concat(settings.q, "&sort=repositories&order=").concat(settings.order, "&per_page=24&page=").concat(settings.page));

              case 4:
                _context.next = 6;
                return _context.sent.json();

              case 6:
                users = _context.sent;

                if (!users.items) {
                  _context.next = 12;
                  break;
                }

                commit("setUsers", users);
                return _context.abrupt("return", false);

              case 12:
                return _context.abrupt("return", true);

              case 13:
                _context.next = 18;
                break;

              case 15:
                _context.prev = 15;
                _context.t0 = _context["catch"](1);
                return _context.abrupt("return", true);

              case 18:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 15]]);
      }))();
    },
    addUsers: function addUsers(_ref2, settings) {
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var commit, users;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                commit = _ref2.commit;
                _context2.prev = 1;
                _context2.next = 4;
                return fetch("https://api.github.com/search/users?q=".concat(settings.q, "&sort=repositories&order=").concat(settings.order, "&per_page=24&page=").concat(settings.page));

              case 4:
                _context2.next = 6;
                return _context2.sent.json();

              case 6:
                users = _context2.sent;

                if (!users.items) {
                  _context2.next = 12;
                  break;
                }

                commit("addUsers", users.items);
                return _context2.abrupt("return", false);

              case 12:
                return _context2.abrupt("return", true);

              case 13:
                _context2.next = 18;
                break;

              case 15:
                _context2.prev = 15;
                _context2.t0 = _context2["catch"](1);
                return _context2.abrupt("return", true);

              case 18:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[1, 15]]);
      }))();
    },
    getUser: function getUser(_ref3, login) {
      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _objectDestructuringEmpty(_ref3);

                _context3.next = 3;
                return fetch("https://api.github.com/users/".concat(login));

              case 3:
                _context3.next = 5;
                return _context3.sent.json();

              case 5:
                return _context3.abrupt("return", _context3.sent);

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }))();
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
var Search = {
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
    var _this = this;

    var self = this;
    window.addEventListener('scroll', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!(self.searched && self.users && self.users.length < self.total && window.innerHeight + window.pageYOffset >= 0.9 * document.body.scrollHeight && !_this.loading)) {
                _context4.next = 7;
                break;
              }

              self.settings.page++;
              _this.loading = true;
              _context4.next = 5;
              return self.$store.dispatch("addUsers", self.settings);

            case 5:
              _this.error = _context4.sent;
              _this.loading = false;

            case 7:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
  },
  methods: {
    filter: function filter(str) {
      return str.match(/[a-zA-Zа-яА-Я0-9]/gi).join('');
    },
    search: function search() {
      var _this2 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
        var filtered;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                filtered = _this2.filter(_this2.q);

                if (!(filtered && filtered.length)) {
                  _context5.next = 13;
                  break;
                }

                _this2.searched = false;
                _this2.filtered = filtered;
                _this2.settings.q = _this2.filtered;
                _this2.settings.order = _this2.order;
                _this2.settings.page = 1;
                _context5.next = 9;
                return _this2.$store.dispatch("searchUsers", _this2.settings);

              case 9:
                _this2.error = _context5.sent;
                _this2.searched = true;
                _context5.next = 14;
                break;

              case 13:
                _this2.empty = true;

              case 14:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }))();
    }
  },
  template: " <div>\n                    <form @submit.prevent=\"search\" class=\"settings\">\n\n                        <div class=\"sort\">\n                            <p class=\"sort__title\">\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u043E</p>\n                            <div class=\"sort__items\">\n                                <div class=\"sort__item\">\n                                    <input id=\"descending\" type=\"radio\" name=\"order\" value=\"desc\" checked v-model=\"order\">\n                                    <label for=\"descending\">\u0443\u0431\u044B\u0432\u0430\u043D\u0438\u044E</label>\n                                </div>\n                                <div class=\"sort__item\">\n                                    <input id=\"ascending\" type=\"radio\" name=\"order\" value=\"asc\" v-model=\"order\">\n                                    <label for=\"ascending\">\u0432\u043E\u0437\u0440\u0430\u0441\u0442\u0430\u043D\u0438\u044E</label>\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"search\">\n                            <p class=\"search__title\">\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043B\u043E\u0433\u0438\u043D \u0438\u043B\u0438 \u0435\u0433\u043E \u0447\u0430\u0441\u0442\u044C:</p>\n                            <div class=\"search__item\">\n                                <input type=\"text\" name=\"q\" placeholder=\"Tom\" v-model=\"q\" :class=\"empty ? 'empty' : ''\">\n                                <button>\u041D\u0430\u0439\u0442\u0438</button>\n                                <p class=\"search__empty\" v-if=\"empty\">\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 \u0437\u0430\u043F\u0440\u043E\u0441. \u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u043E\u043F\u044B\u0442\u043A\u0443</p>\n                            </div>\n                        </div>\n\n                    </form>\n\n                    <h2 class=\"error\" v-if=\"error\">\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430</h2>\n                    <div class=\"results\" v-else-if=\"searched\">\n                        <h2 class=\"results__title\">\u041F\u043E \u0437\u0430\u043F\u0440\u043E\u0441\u0443 \"{{ filtered }}\" \u043D\u0430\u0439\u0434\u0435\u043D\u043E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439: {{ total }}</h2>\n                        <div class=\"users\">\n                            <article class=\"users__user\" v-for=\"user in users\" v-keys=\"user.id\">\n                                <router-link :to=\"'/user?q=' + user.login\">\n                                    <div class=\"users__avatar\">\n                                        <img :src=\"user.avatar_url\" alt=\"\">\n                                    </div>\n                                    <p class=\"users__login\"> \u041B\u043E\u0433\u0438\u043D: {{ user.login }}</p>\n                                </router-link>\n                            </article>\n                        </div>\n                    </div>\n                </div>"
};
var User = {
  data: function data() {
    return {
      user: {},
      login: '',
      loading: true,
      error: false
    };
  },
  created: function created() {
    var arrGet = window.location.hash.split('?').reverse()[0].split('&');
    arrGet = arrGet.map(function (query) {
      return query.split('=');
    });
    var login = '';

    for (var indexOfQuery = 0; indexOfQuery < arrGet.length; indexOfQuery++) {
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
    getUser: function getUser() {
      var _this3 = this;

      return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
        var user;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return _this3.$store.dispatch("getUser", _this3.login);

              case 2:
                user = _context6.sent;

                if (user.id) {
                  user.created_at = user.created_at.split('T')[0].split('-').reverse().join('.');
                  _this3.user = user;
                } else {
                  _this3.error = true;
                }

                _this3.loading = false;

              case 5:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }))();
    }
  },
  template: " <div>\n                    <router-link to=\"/\" class=\"return\">\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u043A \u043F\u043E\u0438\u0441\u043A\u0443</router-link>\n                    <h2 class=\"loading\" v-if=\"loading\">\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430, \u043F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u043E\u0434\u043E\u0436\u0434\u0438\u0442\u0435...</h2>\n                    <h2 class=\"error\" v-if=\"error\">\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430. \u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043F\u043E\u043F\u0435\u0439\u0442\u0435 \u0447\u0430\u044E, \u0441\u043E\u0431\u0435\u0440\u0438\u0442\u0435\u0441\u044C \u0441 \u043C\u044B\u0441\u043B\u044F\u043C\u0438 \u0438 \u043F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u043E\u043F\u044B\u0442\u043A\u0443 \u0438\u043B\u0438 \u0432\u0435\u0440\u043D\u0438\u0442\u0435\u0441\u044C \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443 \u043F\u043E\u0438\u0441\u043A\u0430.</h2>\n                    <section class=\"user\" v-else>\n                        <div class=\"user__avatar\">\n                            <img :src=\"user.avatar_url\" alt=\"\">\n                        </div>\n                        <div class=\"user__info\">\n                            <p class=\"user__text\"> ID \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F: {{ user.id }}</p>\n                            <p class=\"user__text\"> \u041B\u043E\u0433\u0438\u043D: {{ user.login }}</p>\n                            <p class=\"user__text\"><a :href=\"user.html_url\" target=\"_blank\">\u041E\u0441\u0442\u043E\u0440\u043E\u0436\u043D\u043E! \u0421\u0441\u044B\u043B\u043A\u0430 \u043D\u0430 \u0430\u043A\u043A\u0430\u0443\u043D\u0442 Github!</a>\n                            <p class=\"user__text\"> \u041F\u0443\u0431\u043B\u0438\u0447\u043D\u044B\u0445 \u0440\u0435\u043F\u043E\u0437\u0438\u0442\u043E\u0440\u0438\u0435\u0432: {{ user.public_repos }}</p>\n                            <p class=\"user__text\"><a :href=\"user.html_url + '?tab=repositories'\" target=\"_blank\">\u0412\u043F\u0435\u0440\u0435\u0434! \u041A \u0440\u0435\u043F\u043E\u0437\u0438\u0442\u043E\u0440\u0438\u044F\u043C!</a>\n                            <p class=\"user__text\"> \u041F\u043E\u0434\u043F\u0438\u0441\u0447\u0438\u043A\u043E\u0432: {{ user.followers }}</p>\n                            <p class=\"user__text\"> \u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D: {{ user.created_at }}</p>\n                        </div>\n                    </section>\n                </div>"
};
var routes = [{
  path: "/",
  name: "search",
  component: Search
}, {
  path: "/user",
  name: "user",
  component: User
}];
var router = new VueRouter({
  routes: routes
});
var App = {
  components: {
    Search: Search,
    User: User
  },
  template: " <main class=\"container\">\n                    <div id=\"qunit\"></div>\n                    <div id=\"qunit-fixture\"></div>\n                    <router-view />\n                </main>"
};
var app = new Vue({
  router: router,
  store: store,
  render: function render(h) {
    return h(App);
  }
}).$mount("#app");