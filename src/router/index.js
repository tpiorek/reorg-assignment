import {createRouter, createWebHistory} from 'vue-router'
import TableHolder from '../views/TableHolder.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'TableHolder',
            component: TableHolder
        },
    ]
})

export default router
