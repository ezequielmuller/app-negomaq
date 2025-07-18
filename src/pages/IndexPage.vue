<template>
  <q-page padding>
    <div class="text-h6 flex flex-center text-bold text-center">
      Venha conferir nossos Produtos de Alta Qualidade!
    </div>

    <q-tabs v-model="tab" dense class="text-grey-7 q-mt-md" active-color="primary" indicator-color="primary"
      narrow-indicator mobile-arrows outside-arrows align="justify" style="border-bottom: 1px solid #ccc;">
      <q-tab icon="restaurant" name="facas" label="Facas" />
      <q-tab icon="width_wide" name="estojos" label="Estojos de Facas" />
      <q-tab icon="dry_cleaning" name="aventais" label="Aventais" />
      <q-tab icon="outdoor_grill" name="churrasco" label="Artigos de Churrasco" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="facas">
        <lista-facas :adicionarAoCarrinho="props.adicionarAoCarrinho" />
      </q-tab-panel>

      <q-tab-panel name="estojos">
        <estojo-facas />
      </q-tab-panel>

      <q-tab-panel name="aventais">
        <lista-aventais />
      </q-tab-panel>

      <q-tab-panel name="churrasco">
        <artigos-churrasco />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import ArtigosChurrasco from 'src/components/ArtigosChurrasco.vue'
import ListaFacas from 'src/components/ListaFacas.vue'
import ListaAventais from 'src/components/ListaAventais.vue'
import EstojoFacas from 'src/components/EstojoFacas.vue'

const props = defineProps<{
  adicionarAoCarrinho: () => void
}>()

const tab = ref('facas')
</script>


<!-- Configurações para telas menores-->
<!-- <style scoped>
.input-pesquisa {
  width: 700px;
  max-width: 90vw;
}

@media (max-width: 600px) {
  .input-pesquisa {
    width: 300px;
  }
}
</style> -->
