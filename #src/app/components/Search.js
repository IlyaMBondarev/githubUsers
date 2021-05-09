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
            return str.match(/[a-zA-Zа-яА-Я0-9]/gi).join('');
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
                            <p class="sort__title">Сортировать по</p>
                            <div class="sort__items">
                                <div class="sort__item">
                                    <input id="descending" type="radio" name="order" value="desc" checked v-model="order">
                                    <label for="descending">убыванию</label>
                                </div>
                                <div class="sort__item">
                                    <input id="ascending" type="radio" name="order" value="asc" v-model="order">
                                    <label for="ascending">возрастанию</label>
                                </div>
                            </div>
                        </div>

                        <div class="search">
                            <p class="search__title">Введите логин или его часть:</p>
                            <div class="search__item">
                                <input type="text" name="q" placeholder="Tom" v-model="q" :class="empty ? 'empty' : ''">
                                <button>Найти</button>
                                <p class="search__empty" v-if="empty">Некорректный запрос. Повторите попытку</p>
                            </div>
                        </div>

                    </form>

                    <h2 class="error" v-if="error">Произошла ошибка</h2>
                    <div class="results" v-else-if="searched">
                        <h2 class="results__title">По запросу "{{ filtered }}" найдено пользователей: {{ total }}</h2>
                        <div class="users">
                            <article class="users__user" v-for="user in users" v-keys="user.id">
                                <router-link :to="'/user?q=' + user.login">
                                    <div class="users__avatar">
                                        <img :src="user.avatar_url" alt="">
                                    </div>
                                    <p class="users__login"> Логин: {{ user.login }}</p>
                                </router-link>
                            </article>
                        </div>
                    </div>
                </div>`
}

