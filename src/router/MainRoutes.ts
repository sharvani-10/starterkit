const MainRoutes = {
    path: '/main',
    meta: {
        requiresAuth: true
    },
    redirect: '/main',
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
        {
            name: 'Starter',
            path: '/',
            component: () => import('@/views/StarterPage.vue')
        },
        {
            name: 'Users',
            path: '/Users',
            component: () => import('@/views/Users/Users.vue')
        },
        {
            name: 'User',
            path: '/User',
            component: () => import('@/views/Users/User.vue')
        },
        {
            name: 'TodoTasks',
            path: '/TodoTasks',
            component: () => import('@/components/kanban/TaskCard.vue')
        },
        
       
        
        
    ]
};

export default MainRoutes;
