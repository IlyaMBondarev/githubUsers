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

