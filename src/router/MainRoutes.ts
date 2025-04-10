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
        {
            name: 'BasicSyntax',
            path: '/BasicSyntax',
            component: () => import('@/views/DragAndDrop/BasicSyntax.vue')
        },
        {
            name: 'Componentss',
            path: '/Componentss',
            component: () => import('@/views/DragAndDrop/Componentss.vue')
        },
        {
            name: 'EventHandling',
            path: '/EventHandling',
            component: () => import('@/views/DragAndDrop/EventHandling.vue')
        },
        {
            name: 'Reactive',
            path: '/Reactive',
            component: () => import('@/views/DragAndDrop/Reactive.vue')
        },
        {
            name: 'Ref',
            path: '/Ref',
            component: () => import('@/views/DragAndDrop/Ref.vue')
        },
        {
            name: 'Computed',
            path: '/Computed',
            component: () => import('@/views/DragAndDrop/Computed.vue')
        },
        {
            name: 'ConditionalRendering',
            path: '/ConditionalRendering',
            component: () => import('@/views/DragAndDrop/ConditionalRendering.vue')
        },
        {
            name: 'ForandV-model',
            path: '/ForandV-model',
            component: () => import('@/views/DragAndDrop/ForandV-model.vue')
        },
        {
            name: 'ParentComponent',
            path: '/ParentComponent',
            component: () => import('@/views/DragAndDrop/ParentComponent.vue')
        },
        {
            name: 'ChildComponent',
            path: '/ChildComponent',
            component: () => import('@/views/DragAndDrop/ChildComponent.vue')
        },
        {
            name: 'ComponentEvent',
            path: '/ComponentEvent',
            component: () => import('@/views/DragAndDrop/ComponentEvent.vue')
        },
        {
            name: 'DefaultSlot',
            path: '/DefaultSlot',
            component: () => import('@/views/DragAndDrop/Slots/DefaultSlot.vue')
        },
        {
            name: 'ProvideInject',
            path: '/ProvideInject',
            component: () => import('@/views/DragAndDrop/ProvideandInject/ProvideInject.vue')
        },
        {
            name: 'LifeCycle',
            path: '/LifeCycle',
            component: () => import('@/views/DragAndDrop/Lifecycle/LifeCycle.vue')
        },
        {
            name: 'NewUser',
            path: '/NewUser',
            component: () => import('@/views/DragAndDrop/NewUser.vue')
        },
        {
            name: 'duplicateobject',
            path: '/duplicateobject',
            component: () => import('@/views/DragAndDrop/duplicateobject.vue')
        },
    ]
};

export default MainRoutes;
