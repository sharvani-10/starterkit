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
        {
            name: 'Dummy',
            path: '/Dummy',
            component: () => import('@/views/DragAndDrop/Dummy.vue')
        },
        {
            name: 'formcomplete',
            path: '/formcomplete',
            component: () => import('@/views/DragAndDrop/formcomplete.vue')
        },
    ]
};

export default MainRoutes;
