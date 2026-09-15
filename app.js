/* ============================================================
   PÁGINA PÚBLICA
   Busca os links no banco de dados e monta os botões.
   ============================================================ */

const supabaseScript = document.createElement("script");
supabaseScript.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
supabaseScript.onload = iniciarPagina;
document.head.appendChild(supabaseScript);

async function iniciarPagina() {
  const { createClient } = window.supabase;
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const linksEl = document.getElementById("links");
  const loadingEl = document.getElementById("loading");

  if (SUPABASE_URL.startsWith("COLE_AQUI")) {
    loadingEl.textContent = "Configure o Supabase no arquivo config.js.";
    return;
  }

  const { data, error } = await supabase
    .from("links")
    .select("id, title, description, url, icon, position")
    .eq("active", true)
    .order("position", { ascending: true });

  if (error) {
    console.error(error);
    loadingEl.textContent = "Não foi possível carregar os links.";
    return;
  }

  loadingEl.remove();

  if (!data || data.length === 0) {
    linksEl.innerHTML = '<p class="status">Nenhum link disponível no momento.</p>';
    return;
  }

  data.forEach(link => {
    const a = document.createElement("a");
    a.className = "link-card";
    a.href = link.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";

    const icon = document.createElement("span");
    icon.className = "link-icon";
    icon.textContent = link.icon || "🔗";

    const text = document.createElement("span");
    text.className = "link-text";

    const title = document.createElement("strong");
    title.textContent = link.title;

    const description = document.createElement("small");
    description.textContent = link.description || "";

    text.append(title, description);

    const arrow = document.createElement("span");
    arrow.className = "arrow";
    arrow.textContent = "›";

    a.append(icon, text, arrow);
    linksEl.appendChild(a);
  });
}
