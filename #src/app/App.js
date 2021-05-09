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

