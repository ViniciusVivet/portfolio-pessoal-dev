# Instruções para atualizar currículo, foto e formulário

## 1. Currículo novo

**O que foi alterado no código:**  
O link do botão "Currículo" agora aponta para:

- **Caminho:** `Site/Curriculo-Douglas-Vinicius.pdf`

**O que você precisa fazer:**

1. Coloque seu **novo PDF do currículo** na pasta do projeto em:
   - `Site/Curriculo-Douglas-Vinicius.pdf`  
   (ou seja, dentro da pasta `Site`, **não** mais em `Site/Site/`).

2. Se quiser usar **outro nome** para o arquivo (por exemplo `Curriculo-2025.pdf`):
   - Salve o PDF em `Site/` com esse nome.
   - No `index.html`, procure a linha do botão do currículo e troque o `href` para algo como:
     - `Site/Curriculo-2025.pdf`

---

## 2. Foto de perfil nova

**O que foi alterado no código:**  
A foto da seção "Sobre Mim" agora usa:

- **Caminho:** `Site/fotos/foto-perfil.jpg`

**O que você precisa fazer:**

1. Salve sua **nova foto** com o nome **`foto-perfil.jpg`**.
2. Coloque o arquivo dentro da pasta **`Site/fotos/`**.
3. **Substitua** o arquivo antigo se já existir um `foto-perfil.jpg` aí.

**Para a foto ficar nítida (sem ficar embaçada):**  
- Use uma imagem de **pelo menos 500×500 pixels**. O site exibe em 250×250; em telas retina (2x) o navegador precisa de mais pixels para ficar nítido.  
- Opcional: se quiser ainda mais nitidez em monitores retina, crie uma versão em dobro do tamanho (ex.: 500×500 ou 600×600) e salve como **`foto-perfil@2x.jpg`** na mesma pasta `Site/fotos/`. O site já está preparado para usar essa versão em telas de alta densidade.

Se preferir usar outro nome (por exemplo `minha-foto.png`):

- Coloque a imagem em `Site/fotos/minha-foto.png`.
- No `index.html`, procure a linha da imagem na seção "Sobre Mim" e troque o `src` para:
  - `Site/fotos/minha-foto.png`

---

## 3. Formulário de contato (API no Render)

**Situação atual:**  
O formulário está configurado para usar **FormSubmit.co** (envio direto para seu e-mail). Ele já funciona assim, sem backend seu.

**Se você quiser usar de novo uma API sua no Render:**

1. Faça o deploy da sua API no Render (nova conta/instância) e anote a URL base (ex: `https://seu-app.onrender.com`).

2. No **`index.html`**, procure o `<form id="contact-form" ...>` e altere o **`action`**:

   **De (FormSubmit):**
   ```html
   action="https://formsubmit.co/douglasvivet@gmail.com"
   ```

   **Para (sua API):**
   ```html
   action="https://SEU-APP.onrender.com/send-message"
   ```
   (troque `SEU-APP` e o caminho `/send-message` pelo que sua API usar)

3. Ao trocar o `action` para uma URL que **não** contém `formsubmit.co`, o JavaScript do site passa a:
   - interceptar o envio,
   - enviar os dados via `fetch` para essa URL,
   - mostrar "Enviando...", "Mensagem enviada com sucesso!" ou mensagem de erro na própria página.

**Resumo:**  
- Quer continuar sem backend? Deixe o `action` apontando para FormSubmit.co.  
- Quer usar sua API no Render? Troque o `action` para a URL da API; o resto do comportamento já está preparado no código.

---

## Resumo rápido

| Item        | Onde colocar / o que fazer |
|------------|----------------------------|
| **Currículo** | PDF em `Site/Curriculo-Douglas-Vinicius.pdf` (ou ajuste o `href` no HTML se usar outro nome). |
| **Foto**      | Imagem em `Site/fotos/foto-perfil.jpg` (ou altere o `src` no HTML se usar outro nome). |
| **Formulário** | Manter FormSubmit.co ou trocar o `action` do form para a URL da sua API no Render. |
