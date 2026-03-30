export async function enviarEmail(dados) {
  /* ferch na api gerada pelo cloud functions  */
  const resposta = await fetch(
    "https://us-central1-simpe-9abf0.cloudfunctions.net/enviarEmail",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    },
  );

  // Se a resposta não for OK (status 200), joga um erro com o texto do servidor
  if (!resposta.ok) {
    const textoErro = await resposta.text();
    throw new Error(`Erro no Servidor: ${textoErro}`);
  }

  return await resposta.text();
}
