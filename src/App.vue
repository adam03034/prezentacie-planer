<template>
  <div id="app">
    <nav class="app-nav">
      <router-link to="/">Prehrávač prezentácii</router-link> |
      <router-link to="/round-number">Zaokrúhľovanie čísel</router-link>
    </nav>
    
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
});
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

.app-nav {
  padding: 15px;
  background-color: #f8f9fa;
  text-align: center;
  border-bottom: 1px solid #e9ecef;
}

.app-nav a {
  font-weight: bold;
  color: #333;
  text-decoration: none;
  margin: 0 10px;
  padding: 5px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.app-nav a:hover {
  background-color: #e9ecef;
}

.app-nav a.router-link-active {
  color: #42b983;
  border-bottom: 2px solid #42b983;
}
</style>