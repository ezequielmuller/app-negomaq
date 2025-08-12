// Plataforma Mobile
import { ref, onMounted, onBeforeUnmount } from 'vue';

export function usePlatform() {
  const mobile = ref(false);

  const verificaPlataforma = () => {
    mobile.value = window.innerWidth <= 768;
  };

  onMounted(() => {
    verificaPlataforma();
    window.addEventListener('resize', verificaPlataforma);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('resize', verificaPlataforma);
  });

  return {
    mobile,
  };
}
