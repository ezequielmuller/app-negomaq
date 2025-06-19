// import urlServer from "src/composables/server";
// import { Notify } from "quasar";
// import axios from "axios";
// // import formatDate from './formatDate'

// export async function ListarFacas(param) {
//   let result = [];
//   var url = `${urlServer()}/ListarParceiros?parceiro=${parceiro}`;
//   await axios
//     .get(url)
//     .then((response) => {
//       result = response.data;
//     })
//     .catch((err) => {
//       Notify.create({
//         type: "my-notif",
//         icon: "info",
//         position: "top-right",
//         message: "Erro ao Listar Parceiro",
//         caption: `ERROR: code ${err.code}: ${err.message}`,
//         color: "negative",
//       });
//     });
//   return result;
// }
// ======================== EXEMPLO DE CHAMADA DA API ========================