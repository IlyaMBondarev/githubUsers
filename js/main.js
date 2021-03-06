
const store = new Vuex.Store({
    state: {
        users: [],
        total: 0
    },
    mutations: {
        setUsers(state, users) {
            state.users = users.items;
            state.total = users.total_count;
        },
        addUsers(state, users) {
            users.forEach(user => {
                state.users.push(user);
            });
        }
    },
    actions: {
        async searchUsers({ commit }, settings) {
            try {
                const users = await (await fetch(`https://api.github.com/search/users?q=${settings.q}&sort=repositories&order=${settings.order}&per_page=24&page=${settings.page}`)).json();
                if (users.items) {
                    commit("setUsers", users);
                    return false
                } else {
                    return true
                }
            } catch (e) {
                return true
            }
        },
        async addUsers({ commit }, settings) {
            try {
                const users = await (await fetch(`https://api.github.com/search/users?q=${settings.q}&sort=repositories&order=${settings.order}&per_page=24&page=${settings.page}`)).json();
                if (users.items) {
                commit("addUsers", users.items);
                    return false
                } else {
                    return true
                }
            } catch (e) {
                return true
            }
        },
        async getUser({  }, login) {
            return await (await fetch(`https://api.github.com/users/${login}`)).json();
        }
    },
    getters: {
        users: s => s.users,
        total: s => s.total
    }
})


const Search = {
    data: () => ({
        q: '',
        filtered: '',
        order: 'desc',
        settings: {
            q: '',
            order: 'desc',
            page: 1,
        },
        empty: false,
        searched: false,
        loading: false,
        error: false
    }),
    computed: {
        total() {
            return this.$store.getters.total
        },
        users() {
            return this.$store.getters.users
        }
    },
    watch: {
        q: function() {
            this.empty = false;
        }
    },
    mounted() {
        const self = this;
        window.addEventListener('scroll', async () => {
            if (self.searched && self.users && self.users.length < self.total && (window.innerHeight + window.pageYOffset) >= 0.9 * document.body.scrollHeight && !this.loading) {
                self.settings.page++;
                this.loading = true;
                this.error = await self.$store.dispatch("addUsers", self.settings);
                this.loading = false;
            }
        });
    },
    methods: {
        filter(str) {
            return str.match(/[a-zA-Z??-????-??0-9]/gi).join('');
        },
        async search() {
            const filtered = this.filter(this.q);
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
    template: ` <div>
                    <form @submit.prevent="search" class="settings">

                        <div class="sort">
                            <p class="sort__title">?????????????????????? ????</p>
                            <div class="sort__items">
                                <div class="sort__item">
                                    <input id="descending" type="radio" name="order" value="desc" checked v-model="order">
                                    <label for="descending">????????????????</label>
                                </div>
                                <div class="sort__item">
                                    <input id="ascending" type="radio" name="order" value="asc" v-model="order">
                                    <label for="ascending">??????????????????????</label>
                                </div>
                            </div>
                        </div>

                        <div class="search">
                            <p class="search__title">?????????????? ?????????? ?????? ?????? ??????????:</p>
                            <div class="search__item">
                                <input type="text" name="q" placeholder="Tom" v-model="q" :class="empty ? 'empty' : ''">
                                <button>??????????</button>
                                <p class="search__empty" v-if="empty">???????????????????????? ????????????. ?????????????????? ??????????????</p>
                            </div>
                        </div>

                    </form>

                    <h2 class="error" v-if="error">?????????????????? ????????????</h2>
                    <div class="results" v-else-if="searched">
                        <h2 class="results__title">???? ?????????????? "{{ filtered }}" ?????????????? ??????????????????????????: {{ total }}</h2>
                        <div class="users">
                            <article class="users__user" v-for="user in users" v-keys="user.id">
                                <router-link :to="'/user?q=' + user.login">
                                    <div class="users__avatar">
                                        <img :src="user.avatar_url" alt="">
                                    </div>
                                    <p class="users__login"> ??????????: {{ user.login }}</p>
                                </router-link>
                            </article>
                        </div>
                    </div>
                </div>`
}


const User = {
    data: () => ({
        user: {},
        login: '',
        loading: true,
        error: false
    }),
    created() {
        let arrGet = window.location.hash.split('?').reverse()[0].split('&');
        arrGet = arrGet.map(query => {
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
    mounted() {
        this.getUser();
    },
    methods: {
        async getUser() {
            const user = await this.$store.dispatch("getUser", this.login);
            if (user.id) {
                user.created_at = user.created_at.split('T')[0].split('-').reverse().join('.');
                this.user = user;
            } else {
                this.error = true;
            }
            this.loading = false;
        }
    },
    template: ` <div>
                    <router-link to="/" class="return">?????????????????? ?? ????????????</router-link>
                    <h2 class="loading" v-if="loading">????????????????, ????????????????????, ??????????????????...</h2>
                    <h2 class="error" v-if="error">?????????????????? ????????????. ????????????????????, ?????????????? ??????, ???????????????????? ?? ?????????????? ?? ?????????????????? ?????????????? ?????? ?????????????????? ???? ???????????????? ????????????.</h2>
                    <section class="user" v-else>
                        <div class="user__avatar">
                            <img :src="user.avatar_url" alt="">
                        </div>
                        <div class="user__info">
                            <p class="user__text"> ID ????????????????????????: {{ user.id }}</p>
                            <p class="user__text"> ??????????: {{ user.login }}</p>
                            <p class="user__text"><a :href="user.html_url" target="_blank">??????????????????! ???????????? ???? ?????????????? Github!</a>
                            <p class="user__text"> ?????????????????? ????????????????????????: {{ user.public_repos }}</p>
                            <p class="user__text"><a :href="user.html_url + '?tab=repositories'" target="_blank">????????????! ?? ????????????????????????!</a>
                            <p class="user__text"> ??????????????????????: {{ user.followers }}</p>
                            <p class="user__text"> ??????????????????????????????: {{ user.created_at }}</p>
                        </div>
                    </section>
                </div>`
}


const routes = [
    {
        path: "/",
        name: "search",
        component: Search
    },
    {
        path: `/user`,
        name: "user",
        component: User
    }
];

const router = new VueRouter({
    routes
})


const App = {
    components: {
        Search, User
    },
    template: ` <main class="container">
                    <div id="qunit"></div>
                    <div id="qunit-fixture"></div>
                    <router-view />
                </main>`
}

let app = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");

