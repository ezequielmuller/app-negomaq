<template>
    <div class="text-h6 flex flex-center text-bold text-center">
        Artigos de Churrasco
    </div>
    <div class="flex flex-center q-mt-md">
        <q-input flat v-model="pesquisa" label="Pesquise por Produtos!" class="input-pesquisa">
            <template #prepend>
                <q-icon name="search" />
            </template>
        </q-input>
    </div>
    <q-separator class="q-mt-md q-mb-mt" color="primary" style="height: 3px;" />

</template>

<script setup lang="ts">
import { ref } from 'vue'
const pesquisa = ref(null)
</script>
<!-- Configurações para telas menores-->
<style scoped>
.input-pesquisa {
    width: 700px;
    max-width: 90vw;
}

@media (max-width: 600px) {
    .input-pesquisa {
        width: 300px;
    }
}
</style>
