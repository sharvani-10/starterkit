<script setup>
import ChildComponent from './ChildComponent.vue';
import ComponentEvent from './ComponentEvent.vue';
import {ref} from 'vue'

let count=ref(0)
</script>

<template>
<ChildComponent name="Sharvani"/>
<ComponentEvent @incrementCounter = "count++"/>
<h1>count: {{ count }}</h1>
</template>