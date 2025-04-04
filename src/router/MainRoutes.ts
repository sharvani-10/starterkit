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
            name: 'DragDrop',
            path: '/DragDrop',
            component: () => import('@/views/DragAndDrop/Drag.vue')
        },
    ]
};

export default MainRoutes;
