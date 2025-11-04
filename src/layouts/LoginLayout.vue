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
    <q-footer class="bg-black text-grey q-pa-sm" height-hint="64">
      <div class="row q-col-gutter-md justify-center items-center text-center">
        <div class="col-12 flex justify-center items-center q-pt-md" style="font-size: 0.7rem;">
          <a href="https://api.whatsapp.com/send/?phone=5554996641291&text&type=phone_number&app_absent=0"
            target="_blank" class="q-mx-sm">
            <i class="fab fa-whatsapp fa-2x" style="color: #25D366;"></i>
          </a>
          <a href="https://www.instagram.com/negomaq/" target="_blank" class="q-mx-sm">
            <i class="fab fa-instagram fa-2x" style="color: #C13584;"></i>
          </a>
        </div>
        <div class="col-12 flex justify-center items-center q-pt-xs" style="font-size: 0.7rem;">
          <q-icon name="copyright" />
          <span class="q-ml-xs">
            2025 Todos os direitos reservados - NegoMaq Couros
          </span>
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
</script>
