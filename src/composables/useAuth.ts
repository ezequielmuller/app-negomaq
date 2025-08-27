// import { ref } from 'vue';

import type { Usuario } from 'src/types/types';

const USER_KEY = 'user';

function saveUser(user: Usuario) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

function removeUser() {
  localStorage.removeItem(USER_KEY);
}

export function useAuth() {
  return {
    saveUser,
    getUser,
    removeUser,
  };
}
