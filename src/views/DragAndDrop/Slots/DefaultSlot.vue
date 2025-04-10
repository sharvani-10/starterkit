<script setup>
import SlotComponent from "./SlotComponent.vue";
import FallbackContent from "./FallbackContent.vue";
import Default from "./Default.vue";
// import NamedSlot from "./components/NamedSlot.vue";
// import DefaultSlot from "./components/DefaultSlot.vue";
</script>

<template>
  <SlotComponent>
    <h1>Content 1</h1>
    <h2>Content 2</h2>
  </SlotComponent>

  <hr />

  We didn't specify any content in this component
  <FallbackContent> </FallbackContent>
  <FallbackContent>
    <p>
      Fallback will not work because I'm providing content inside the component
    </p>
  </FallbackContent>

  <hr />

 

  <!-- <hr /> -->

  <Default>
    <template #default>
      <h1>This is some random default content</h1>
    </template>
  </Default>
</template>