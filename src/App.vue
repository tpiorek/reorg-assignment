<script setup>
import {RouterLink, RouterView} from 'vue-router'
</script>

<template>
  <header>

    <div class="wrapper">
      <nav>
        <RouterLink to="/"></RouterLink>
      </nav>
    </div>
    <h3>Deals</h3>
  </header>

  <RouterView/>
</template>

<style scoped></style>
