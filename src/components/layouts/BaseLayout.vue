<script setup>
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
</script>

<template>
  <v-layout class="rounded">
    <v-app-bar title="Library Apps" elevation="1"></v-app-bar>

    <v-navigation-drawer>
      <v-list>
        <v-list-item title="Book Store" subtitle="Vue 3 + VITE"></v-list-item>
        <v-divider></v-divider>
        <v-list-item
          key="master-book"
          prepend-icon="mdi-bookshelf"
          title="Master Book"
          value="master-book"
          :to="{ name: 'master-book' }"
        ></v-list-item>
        <v-list-item
          key="master-student"
          prepend-icon="mdi-account-school"
          title="Master Student"
          value="master-student"
          :to="{ name: 'master-student' }"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-warehouse"
          title="Inventory"
          value="inventory"
          :to="{ name: 'inventory' }"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-handshake"
          title="Transaction"
          value="transaction"
          :to="{ name: 'transaction' }"
        ></v-list-item>
        <v-list-item prepend-icon="mdi-history" title="History" value="history" :to="{ name: 'history' }"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="tw-m-5" style="min-height: 300px">
      <v-card class="pa-5" elevation="1">
        <slot></slot>
      </v-card>
    </v-main>
  </v-layout>
</template>
