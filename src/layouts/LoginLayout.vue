<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="justify-between">
        <q-toolbar-title class="row items-center justify-center">
          <!-- <img src="icons/app-logo-sfundo.png" alt="Logo" style="width: 32px; height: 32px; margin-right: 8px" /> -->
          <span class="text-bold">Venha conferir nossos Produtos!</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="text-grey bg-black">
      <div class="row q-col-gutter-md justify-center items-center text-center">
        <div class="col-12 flex justify-center items-center"
          style="text-align: center; font-size: 0.7rem; padding: 1.5rem">
          <q-icon name="copyright" />
          <span class="q-ml-xs">
            2025 Todos os direitos reservados - Couros NegoMaq
          </span>
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts"></script>
