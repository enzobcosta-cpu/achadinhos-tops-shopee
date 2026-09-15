/* ============================================================
   PAINEL ADMINISTRATIVO
   Login + adicionar + editar + remover + ordenar links.
   Os dados ficam no Supabase.
   ============================================================ */

const supabaseScript = document.createElement("script");
supabaseScript.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
supabaseScript.onload = iniciarAdmin;
document.head.appendChild(supabaseScript);

async function iniciarAdmin() {
  const { createClient } = window.supabase;

  if (SUPABASE_URL.startsWith("COLE_AQUI")) {
    document.getElementById("login-message").textContent =
      "Configure o Supabase no arquivo config.js.";
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const loginCard = document.getElementById("login-card");
  const dashboard = document.getElementById("dashboard");
  const loginForm = document.getElementById("login-form");
  const editor = document.getElementById("link-editor");
  const loginMessage = document.getElementById("login-message");
  const saveMessage = document.getElementById("save-message");

  let links = [];

  async function atualizarTela() {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      loginCard.classList.add("hidden");
      dashboard.classList.remove("hidden");
      await carregarLinks();
    } else {
      loginCard.classList.remove("hidden");
      dashboard.classList.add("hidden");
    }
  }

  async function carregarLinks() {
    const { data, error } = await supabase
      .from("links")
      .select("id, title, description, url, icon, position, active")
      .order("position", { ascending: true });

    if (error) {
      saveMessage.textContent = "Erro ao carregar links: " + error.message;
      return;
    }

    links = data || [];
    renderizarEditor();
  }

  function renderizarEditor() {
    editor.innerHTML = "";

    if (links.length === 0) {
      editor.innerHTML = '<p class="empty-admin">Nenhum link cadastrado. Clique em "Adicionar link".</p>';
      return;
    }

    links.forEach((link, index) => {
      const card = document.createElement("article");
      card.className = "editor-card";

      card.innerHTML = `
        <div class="editor-top">
          <strong>Link ${index + 1}</strong>
          <div class="move-buttons">
            <button type="button" data-up="${index}" title="Subir">↑</button>
            <button type="button" data-down="${index}" title="Descer">↓</button>
          </div>
        </div>

        <label>Título</label>
        <input data-field="title" data-index="${index}" value="${escapeAttr(link.title)}">

        <label>Descrição</label>
        <input data-field="description" data-index="${index}" value="${escapeAttr(link.description || "")}">

        <label>Link / URL</label>
        <input type="url" data-field="url" data-index="${index}" value="${escapeAttr(link.url)}">

        <label>Ícone / Emoji</label>
        <input data-field="icon" data-index="${index}" value="${escapeAttr(link.icon || "🔗")}">

        <label class="switch">
          <input type="checkbox" data-field="active" data-index="${index}" ${link.active ? "checked" : ""}>
          <span>Link visível na página</span>
        </label>

        <button type="button" class="delete" data-delete="${index}">🗑️ Remover</button>
      `;

      editor.appendChild(card);
    });

    editor.querySelectorAll("[data-field]").forEach(input => {
      input.addEventListener("input", () => {
        const index = Number(input.dataset.index);
        const field = input.dataset.field;
        links[index][field] = input.type === "checkbox" ? input.checked : input.value;
      });
    });

    editor.querySelectorAll("[data-delete]").forEach(button => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.delete);
        links.splice(index, 1);
        renderizarEditor();
      });
    });

    editor.querySelectorAll("[data-up]").forEach(button => {
      button.addEventListener("click", () => mover(Number(button.dataset.up), -1));
    });

    editor.querySelectorAll("[data-down]").forEach(button => {
      button.addEventListener("click", () => mover(Number(button.dataset.down), 1));
    });
  }

  function mover(index, direction) {
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= links.length) return;

    [links[index], links[newIndex]] = [links[newIndex], links[index]];
    renderizarEditor();
  }

  document.getElementById("add").addEventListener("click", () => {
    links.push({
      id: null,
      title: "Novo link",
      description: "Clique para editar",
      url: "https://",
      icon: "🔗",
      position: links.length,
      active: true
    });

    renderizarEditor();
  });

  document.getElementById("save").addEventListener("click", async () => {
    saveMessage.textContent = "Salvando...";

    /*
      Estratégia simples e segura para um painel pequeno:
      sincronizamos a lista inteira usando posições.
    */

    const { data: existentes, error: readError } = await supabase
      .from("links")
      .select("id");

    if (readError) {
      saveMessage.textContent = "Erro: " + readError.message;
      return;
    }

    const idsAtuais = links.filter(x => x.id).map(x => x.id);
    const idsParaExcluir = (existentes || [])
      .map(x => x.id)
      .filter(id => !idsAtuais.includes(id));

    if (idsParaExcluir.length) {
      const { error } = await supabase
        .from("links")
        .delete()
        .in("id", idsParaExcluir);

      if (error) {
        saveMessage.textContent = "Erro ao remover: " + error.message;
        return;
      }
    }

    for (let i = 0; i < links.length; i++) {
      const link = links[i];

      if (link.id) {
        const { error } = await supabase
          .from("links")
          .update({
            title: link.title,
            description: link.description,
            url: link.url,
            icon: link.icon,
            position: i,
            active: link.active
          })
          .eq("id", link.id);

        if (error) {
          saveMessage.textContent = "Erro ao atualizar: " + error.message;
          return;
        }
      } else {
        const { data, error } = await supabase
          .from("links")
          .insert({
            title: link.title,
            description: link.description,
            url: link.url,
            icon: link.icon,
            position: i,
            active: link.active
          })
          .select()
          .single();

        if (error) {
          saveMessage.textContent = "Erro ao adicionar: " + error.message;
          return;
        }

        link.id = data.id;
      }
    }

    saveMessage.textContent = "Alterações salvas! ✅";
    await carregarLinks();
  });

  loginForm.addEventListener("submit", async event => {
    event.preventDefault();

    loginMessage.textContent = "Entrando...";

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      loginMessage.textContent = "E-mail ou senha incorretos.";
      return;
    }

    loginForm.reset();
    loginMessage.textContent = "";
    await atualizarTela();
  });

  document.getElementById("logout").addEventListener("click", async () => {
    await supabase.auth.signOut();
    await atualizarTela();
  });

  supabase.auth.onAuthStateChange(() => {
    atualizarTela();
  });

  await atualizarTela();
}

function escapeAttr(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
