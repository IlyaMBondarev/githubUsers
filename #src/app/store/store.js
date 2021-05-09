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

