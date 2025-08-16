// // firebase.ts
// import { initializeApp } from "firebase/app";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "SUA_API_KEY",
//   authDomain: "seu-projeto.firebaseapp.com",
//   projectId: "seu-projeto",
//   storageBucket: "seu-projeto.appspot.com",
//   messagingSenderId: "123456789",
//   appId: "1:123456789:web:abcdefg"
// };

// const app = initializeApp(firebaseConfig);
// const storage = getStorage(app);

// export { storage, ref, uploadBytes, getDownloadURL };

// // uploadImagem.ts
// import { storage, ref, uploadBytes, getDownloadURL } from './firebase';

// export const uploadImagem = async (file: File) => {
//   const storageRef = ref(storage, `produtos/${Date.now()}-${file.name}`);
//   await uploadBytes(storageRef, file);
//   return await getDownloadURL(storageRef);
// };


// // No seu componente
// const handleUpload = async () => {
//   if (!imagem.value) return;
//   const url = await uploadImagem(imagem.value); // URL pública
//   await criarProduto({
//     nome: nome.value,
//     descricao: descricao.value,
//     preco: Number(preco.value),
//     categoria: categoria.value,
//     imagem: url
//   });
// };
