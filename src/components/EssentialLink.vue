<template>
  <component
    :is="isExternal ? 'a' : 'router-link'"
    :href="isExternal ? link : undefined"
    :to="!isExternal ? link : undefined"
    :target="isExternal ? '_blank' : undefined"
    class="no-decoration"
  >
    <q-item clickable v-ripple>
      <q-item-section v-if="icon" avatar>
        <q-icon :name="icon" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ title }}</q-item-label>
        <q-item-label caption>{{ caption }}</q-item-label>
      </q-item-section>
    </q-item>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface EssentialLinkProps {
  title: string;
  caption?: string;
  link?: string;
  icon?: string;
};

const props = withDefaults(defineProps<EssentialLinkProps>(), {
  caption: '',
  link: '#',
  icon: '',
});

const isExternal = computed(() => /^https?:\/\//.test(props.link));
</script>

<style scoped>
.no-decoration {
  text-decoration: none;
  color: inherit;
}
</style>
