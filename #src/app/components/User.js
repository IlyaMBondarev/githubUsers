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
                    <router-link to="/" class="return">Вернуться к поиску</router-link>
                    <h2 class="loading" v-if="loading">Загрузка, пожалуйста, подождите...</h2>
                    <h2 class="error" v-if="error">Произошла ошибка. Пожалуйста, попейте чаю, соберитесь с мыслями и повторите попытку или вернитесь на страницу поиска.</h2>
                    <section class="user" v-else>
                        <div class="user__avatar">
                            <img :src="user.avatar_url" alt="">
                        </div>
                        <div class="user__info">
                            <p class="user__text"> ID пользователя: {{ user.id }}</p>
                            <p class="user__text"> Логин: {{ user.login }}</p>
                            <p class="user__text"><a :href="user.html_url" target="_blank">Осторожно! Ссылка на аккаунт Github!</a>
                            <p class="user__text"> Публичных репозиториев: {{ user.public_repos }}</p>
                            <p class="user__text"><a :href="user.html_url + '?tab=repositories'" target="_blank">Вперед! К репозиториям!</a>
                            <p class="user__text"> Подписчиков: {{ user.followers }}</p>
                            <p class="user__text"> Зарегистрирован: {{ user.created_at }}</p>
                        </div>
                    </section>
                </div>`
}

