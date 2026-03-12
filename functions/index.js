const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const {defineString} = require("firebase-functions/params");
const nodemailer = require("nodemailer");

setGlobalOptions({maxInstances: 10});

const GMAIL_EMAIL = defineString("GMAIL_EMAIL");
const GMAIL_PASS = defineString("GMAIL_PASS");

exports.enviarEmail = onRequest(async (req, res) => {
  try {
    const {nome, emailRemetente, emailDestino, mensagem, arquivo, foto} =
      req.body;

    if (!nome || !emailRemetente || !emailDestino || !mensagem) {
      return res.status(400).send("Campos obrigatórios faltando");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_EMAIL.value(),
        pass: GMAIL_PASS.value(),
      },
    });

    const attachments = [];

    // Lógica para anexar as FOTOS (que vêm como Array de URLs)
    if (foto && Array.isArray(foto)) {
      foto.forEach((url, index) => {
        attachments.push({
          filename: `foto_${index + 1}.jpg`,
          path: url, // O Nodemailer baixa a imagem direto do link do Storage
        });
      });
    }

    // Lógica para anexar os ARQUIVOS/PDFs (que vêm como Array de URLs)
    if (arquivo && Array.isArray(arquivo)) {
      arquivo.forEach((url, index) => {
        let extension = "pdf";
        let contentType = "application/pdf";
        const urlLower = url.toLowerCase();

        if (urlLower.includes(".docx")) {
          extension = "docx";
          // Quebramos a string para não passar de 80 caracteres
          contentType =
            "application/vnd.openxmlformats-officedocument." +
            "wordprocessingml.document";
        } else if (urlLower.includes(".xlsx")) {
          extension = "xlsx";
          contentType =
            "application/vnd.openxmlformats-officedocument." +
            "spreadsheetml.sheet";
        } else if (urlLower.includes(".pdf")) {
          extension = "pdf";
          contentType = "application/pdf";
        }

        attachments.push({
          filename: `documento_${index + 1}.${extension}`,
          path: url,
          contentType: contentType,
        });
      });
    }

    await transporter.sendMail({
      from: GMAIL_EMAIL.value(),
      to: emailDestino,
      replyTo: emailRemetente,
      subject: `Nova mensagem de ${nome}`,
      text: `
Você recebeu uma mensagem no aplicativo.

Nome: ${nome}
Email: ${emailRemetente}

Mensagem:
${mensagem}
`,
      attachments: attachments,
    });

    res.status(200).send("Email enviado com sucesso");
  } catch (error) {
    console.error("Erro detalhado:", error);
    res.status(500).send(error.message); // Envia o erro real para o App
  }
});
