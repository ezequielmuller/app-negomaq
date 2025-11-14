import type { AxiosError } from "axios";
import { Notify } from "quasar";

export const tratarErro = (err: unknown, mensagemPadrao: string) => {
  const error = err as AxiosError<unknown>;
  const data = error.response?.data as Record<string, unknown> | undefined;

  let mensagem = mensagemPadrao;

  if (data) {
    if (typeof data.error === "string") mensagem = data.error;
    else if (typeof data.erro === "string") mensagem = data.erro;
    else if (typeof data.message === "string") mensagem = data.message;
  }

  console.error(mensagemPadrao, error);

  Notify.create({
    type: "negative",
    message: mensagem,
    position: "bottom",
    timeout: 2500
  });

  return null;
};
