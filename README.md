# ACHADINHOS TOPS SHO — VERSÃO PROFISSIONAL

## O que este projeto tem

- Página pública de links.
- Painel de administração em `admin.html`.
- Login com e-mail e senha.
- Banco de dados Supabase.
- Adicionar links.
- Editar links.
- Remover links.
- Ativar/desativar links.
- Alterar a ordem dos links.
- A página pública atualiza com os dados do banco.
- Design laranja baseado na identidade enviada.

## Como colocar online

### 1. Criar o banco

Crie um projeto no Supabase e abra o SQL Editor.

Cole todo o conteúdo do arquivo:

`database.sql`

Execute.

### 2. Criar o usuário administrador

No Supabase, vá em Authentication > Users e crie um usuário com e-mail e senha.

Esse e-mail e senha serão usados somente no painel:

`admin.html`

### 3. Configurar o site

Abra:

`config.js`

Troque:

`COLE_AQUI_A_URL_DO_SEU_PROJETO`

pela URL do seu projeto.

Troque:

`COLE_AQUI_A_CHAVE_PUBLICA_ANON`

pela chave pública/anon do Supabase.

NUNCA coloque a Service Role Key no site.

### 4. Publicar

Você pode publicar estes arquivos em um serviço de hospedagem estática, por exemplo:

- Netlify
- Vercel
- GitHub Pages

O endereço público será a página:

`index.html`

E o endereço do painel será:

`admin.html`

## Domínio próprio

Depois você pode registrar um domínio, por exemplo:

`achadinhostopssho.com.br`

e apontá-lo para a hospedagem.

## Segurança

O site usa Supabase Auth para proteger o painel.

A chave pública/anon pode ficar no JavaScript. A Service Role Key NÃO deve ser colocada no navegador.

Para uma operação comercial maior, recomenda-se adicionar uma política de administrador por usuário/role em vez de permitir que qualquer usuário autenticado gerencie os links.

## Arquivos

- index.html — página pública
- admin.html — painel
- app.js — lógica da página pública
- admin.js — lógica do painel
- style.css — visual
- config.js — configuração do Supabase
- database.sql — banco e políticas
- logo.jpeg — logo enviada
