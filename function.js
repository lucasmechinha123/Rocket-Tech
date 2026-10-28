(function () {
  /* ===== CONFIGURAÇÃO ===== */
  /* 1) Crie um formulário gratuito em https://formspree.io, informando o e-mail que vai
        receber as mensagens, e cole abaixo só o código do formulário (a parte final do
        endereço https://formspree.io/f/CODIGO). */
  var FORM_ID = 'meaagbgj';
  /* 2) WhatsApp opcional (DDI + DDD + número, só números) */
  var WHATSAPP = '5511994727440';

  function updateWa() {
    document.getElementById('wa-alt').href = 'https://wa.me/' + WHATSAPP +
      '?text=' + encodeURIComponent(tr('Olá! Vim pelo site da Rocket Tech e gostaria de conversar sobre um projeto.'));
  }

  /* Barra flutuante */
  var list = document.getElementById('dock-list');
  var pill = list.querySelector('.dock-pill');
  var links = Array.prototype.slice.call(list.querySelectorAll('a'));
  var sections = links.map(function (a) { return document.getElementById(a.dataset.target); });
  var current = -1;
  function movePill(i) {
    pill.style.width = links[i].offsetWidth + 'px';
    pill.style.transform = 'translateX(' + links[i].offsetLeft + 'px)';
  }
  function setActive(i) {
    if (i === current) return;
    current = i;
    links.forEach(function (a, n) {
      if (n === i) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    movePill(i);
  }
  function spy() {
    var line = window.innerHeight * 0.35, idx = 0;
    sections.forEach(function (s, n) { if (s.getBoundingClientRect().top <= line) idx = n; });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) idx = sections.length - 1;
    setActive(idx);
  }
  var t = false;
  window.addEventListener('scroll', function () {
    if (!t) { t = true; requestAnimationFrame(function () { spy(); t = false; }); }
  }, { passive: true });
  window.addEventListener('resize', function () { if (current > -1) movePill(current); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { movePill(Math.max(current, 0)); });
  spy();

  /* ===== Acessibilidade ===== */
  var root = document.documentElement;
  var KEY = 'rocket-a11y';
  var st = { text: 0, contrast: false, readable: false, links: false, reduce: false };
  try { var saved = JSON.parse(localStorage.getItem(KEY)); if (saved) for (var k in st) if (k in saved) st[k] = saved[k]; } catch (e) {}

  var a11yBtn = document.getElementById('a11y-btn');
  var panel = document.getElementById('a11y-panel');
  var sizeOut = document.getElementById('size-out');
  var osReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  function render() {
    ['a11y-text-1', 'a11y-text-2', 'a11y-text-3'].forEach(function (c) { root.classList.remove(c); });
    if (st.text > 0) root.classList.add('a11y-text-' + st.text);
    root.classList.toggle('a11y-contrast', st.contrast);
    root.classList.toggle('a11y-readable', st.readable);
    root.classList.toggle('a11y-links', st.links);
    root.classList.toggle('a11y-reduce', st.reduce);
    sizeOut.textContent = [100, 112, 125, 137][st.text] + '%';
    ['contrast', 'readable', 'links', 'reduce'].forEach(function (n) {
      panel.querySelector('[data-a="' + n + '"]').setAttribute('aria-pressed', st[n] ? 'true' : 'false');
    });
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {}
    if (typeof movePill === 'function' && current > -1) setTimeout(function () { movePill(current); }, 60);
    if (typeof drawStatic === 'function') drawStatic();
  }

  function openPanel(open) {
    panel.hidden = !open;
    a11yBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    a11yBtn.setAttribute('aria-label', tr(open ? 'Fechar opções de acessibilidade' : 'Abrir opções de acessibilidade'));
    if (open) panel.querySelector('button').focus();
  }
  a11yBtn.addEventListener('click', function () { openPanel(panel.hidden); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) { openPanel(false); a11yBtn.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (!panel.hidden && !panel.contains(e.target) && !a11yBtn.contains(e.target)) openPanel(false);
  });
  panel.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-a]');
    if (!b) return;
    var a = b.getAttribute('data-a');
    if (a === 'text-up') st.text = Math.min(3, st.text + 1);
    else if (a === 'text-down') st.text = Math.max(0, st.text - 1);
    else if (a === 'reset') st = { text: 0, contrast: false, readable: false, links: false, reduce: false };
    else st[a] = !st[a];
    render();
  });

  function motionOK() { return !osReduce.matches && !st.reduce; }

  /* ===== Rede de partículas ===== */
  var cv = document.getElementById('net'), ctx = cv.getContext('2d');
  var nodes = [], W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2), running = false;
  function sizeCanvas() {
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.max(24, Math.min(70, Math.floor(W / 20))); nodes = [];
    for (var i = 0; i < n; i++) nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25 });
  }
  function drawStatic() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < nodes.length; i++) {
      var a = nodes[i];
      for (var j = i + 1; j < nodes.length; j++) {
        var b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 140) {
          ctx.strokeStyle = 'rgba(255,122,61,' + (0.2 * (1 - d / 140)) + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.fillStyle = 'rgba(255,194,77,.6)';
      ctx.beginPath(); ctx.arc(a.x, a.y, 1.4, 0, 6.2832); ctx.fill();
    }
  }
  function loop() {
    if (!motionOK()) { running = false; return; }
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i]; n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    }
    drawStatic();
    requestAnimationFrame(loop);
  }
  function startLoop() { if (!running && motionOK()) { running = true; requestAnimationFrame(loop); } }
  sizeCanvas(); drawStatic();
  window.addEventListener('resize', function () { sizeCanvas(); drawStatic(); });
  var oldRender = render;
  render = function () { oldRender(); startLoop(); };

  /* ===== Luz que segue o mouse ===== */
  var glow = document.getElementById('glow');
  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', function (e) {
      if (motionOK()) glow.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
    }, { passive: true });
  }

  render();

  /* ===== Idioma (PT / EN / ES) ===== */
  var DICT = {"Rocket Tech | Sites, sistemas e automações para o seu negócio": {"en": "Rocket Tech | Websites, systems and automation for your business", "es": "Rocket Tech | Sitios web, sistemas y automatizaciones para tu negocio"}, "Rocket Tech: sites, landing pages, lojas virtuais, sistemas e automações sob medida para empresas.": {"en": "Rocket Tech: custom websites, landing pages, online stores, systems and automation for businesses.", "es": "Rocket Tech: sitios web, landing pages, tiendas en línea, sistemas y automatizaciones a medida para empresas."}, "Pular para o conteúdo": {"en": "Skip to content", "es": "Saltar al contenido"}, "Principal": {"en": "Main", "es": "Principal"}, "Início": {"en": "Home", "es": "Inicio"}, "Serviços": {"en": "Services", "es": "Servicios"}, "Processo": {"en": "Process", "es": "Proceso"}, "Projetos": {"en": "Projects", "es": "Proyectos"}, "Contato": {"en": "Contact", "es": "Contacto"}, "Seu negócio pronto para": {"en": "Your business ready to", "es": "Tu negocio listo para"}, "decolar": {"en": "take off", "es": "despegar"}, "no digital.": {"en": "in the digital world.", "es": "en el mundo digital."}, "A Rocket Tech cria sites, lojas virtuais, sistemas e automações feitos para o seu objetivo, do planejamento à publicação.": {"en": "Rocket Tech builds websites, online stores, systems and automation made for your goals, from planning to launch.", "es": "Rocket Tech crea sitios web, tiendas en línea, sistemas y automatizaciones hechos para tu objetivo, desde la planificación hasta la publicación."}, "Pedir orçamento": {"en": "Request a quote", "es": "Pedir presupuesto"}, "Ver projetos": {"en": "See projects", "es": "Ver proyectos"}, "Sites": {"en": "Websites", "es": "Sitios web"}, "Lojas virtuais": {"en": "Online stores", "es": "Tiendas en línea"}, "Sistemas": {"en": "Systems", "es": "Sistemas"}, "Automações": {"en": "Automation", "es": "Automatizaciones"}, "rocket novo-projeto": {"en": "rocket new-project", "es": "rocket nuevo-proyecto"}, "briefing recebido": {"en": "brief received", "es": "brief recibido"}, "layout aprovado": {"en": "layout approved", "es": "diseño aprobado"}, "versão para celular pronta": {"en": "mobile version ready", "es": "versión móvil lista"}, "integração com WhatsApp": {"en": "WhatsApp integration", "es": "integración con WhatsApp"}, "publicando no ar...": {"en": "going live...", "es": "publicando en línea..."}, "no ar!": {"en": "live!", "es": "¡en línea!"}, "Uma solução que faz sentido para o seu negócio.": {"en": "A solution that makes sense for your business.", "es": "Una solución que tiene sentido para tu negocio."}, "Cada projeto parte do seu objetivo, do seu público e da sua rotina. Você pode contratar um serviço isolado ou combinar vários.": {"en": "Every project starts from your goal, your audience and your routine. You can hire a single service or combine several.", "es": "Cada proyecto parte de tu objetivo, tu público y tu rutina. Puedes contratar un servicio por separado o combinar varios."}, "Sites profissionais": {"en": "Professional websites", "es": "Sitios web profesionales"}, "Apresente sua empresa com clareza e transforme visitas em contatos.": {"en": "Present your company clearly and turn visits into contacts.", "es": "Presenta tu empresa con claridad y convierte visitas en contactos."}, "Páginas diretas para campanhas, lançamentos e ofertas específicas.": {"en": "Direct pages for campaigns, launches and specific offers.", "es": "Páginas directas para campañas, lanzamientos y ofertas específicas."}, "Vitrine organizada e jornada de compra simples para vender online.": {"en": "A well-organized storefront and a simple buying journey to sell online.", "es": "Una vitrina ordenada y un proceso de compra simple para vender en línea."}, "Sistemas sob medida": {"en": "Custom systems", "es": "Sistemas a medida"}, "Controle cadastros, relatórios e processos que planilhas não resolvem mais.": {"en": "Manage records, reports and processes that spreadsheets can no longer handle.", "es": "Controla registros, informes y procesos que las hojas de cálculo ya no resuelven."}, "Elimine tarefas repetitivas e ganhe tempo para a equipe.": {"en": "Eliminate repetitive tasks and give your team more time.", "es": "Elimina tareas repetitivas y gana tiempo para el equipo."}, "Integrações": {"en": "Integrations", "es": "Integraciones"}, "Conecte formulários, APIs e ferramentas que hoje trabalham separadas.": {"en": "Connect forms, APIs and tools that currently work separately.", "es": "Conecta formularios, APIs y herramientas que hoy trabajan por separado."}, "Tráfego pago": {"en": "Paid traffic", "es": "Tráfico de pago"}, "Campanhas que levam a oferta certa para quem tem interesse.": {"en": "Campaigns that put the right offer in front of interested people.", "es": "Campañas que llevan la oferta correcta a quien tiene interés."}, "Redes sociais": {"en": "Social media", "es": "Redes sociales"}, "Conteúdo e planejamento para manter sua marca ativa e próxima do público.": {"en": "Content and planning to keep your brand active and close to your audience.", "es": "Contenido y planificación para mantener tu marca activa y cercana al público."}, "Por que a Rocket Tech?": {"en": "Why Rocket Tech?", "es": "¿Por qué Rocket Tech?"}, "Visual que ajuda a vender": {"en": "Design that helps you sell", "es": "Diseño que ayuda a vender"}, "O design organiza a mensagem, passa confiança e leva o visitante para o próximo passo.": {"en": "Design organizes the message, builds trust and guides visitors to the next step.", "es": "El diseño organiza el mensaje, genera confianza y lleva al visitante al siguiente paso."}, "Feito do zero para você": {"en": "Built from scratch for you", "es": "Hecho desde cero para ti"}, "Nada de template genérico: as páginas e funções são pensadas para o seu caso.": {"en": "No generic templates: pages and features are designed for your case.", "es": "Nada de plantillas genéricas: las páginas y funciones se piensan para tu caso."}, "Do início ao fim": {"en": "From start to finish", "es": "De principio a fin"}, "Planejamento, design, desenvolvimento, ajustes e publicação com o mesmo time.": {"en": "Planning, design, development, adjustments and launch with the same team.", "es": "Planificación, diseño, desarrollo, ajustes y publicación con el mismo equipo."}, "Pensado para o celular": {"en": "Designed for mobile", "es": "Pensado para el móvil"}, "Leitura, botões e velocidade cuidados para quem chega pelo smartphone.": {"en": "Reading, buttons and speed are tuned for people arriving from a smartphone.", "es": "Lectura, botones y velocidad cuidados para quien llega desde el smartphone."}, "Do primeiro contato ao site no ar.": {"en": "From first contact to a live website.", "es": "Del primer contacto al sitio en línea."}, "Um caminho simples, com cada etapa combinada com você.": {"en": "A simple path, with every step agreed with you.", "es": "Un camino simple, con cada etapa acordada contigo."}, "Conversa": {"en": "Conversation", "es": "Conversación"}, "Entendemos seu negócio, seu público e o que você quer resolver.": {"en": "We learn about your business, your audience and the problem you want to solve.", "es": "Entendemos tu negocio, tu público y lo que quieres resolver."}, "Planejamento": {"en": "Planning", "es": "Planificación"}, "Definimos estrutura, conteúdo e funções antes de começar.": {"en": "We define structure, content and features before we start.", "es": "Definimos estructura, contenido y funciones antes de empezar."}, "Criação": {"en": "Creation", "es": "Creación"}, "Desenvolvemos, testamos no celular e no computador e ajustamos com você.": {"en": "We build, test on phone and computer, and adjust together with you.", "es": "Desarrollamos, probamos en el móvil y en el ordenador y ajustamos contigo."}, "Publicação": {"en": "Launch", "es": "Publicación"}, "Colocamos no ar e deixamos você a par de como pedir suporte.": {"en": "We put it live and show you how to ask for support.", "es": "Lo publicamos y te explicamos cómo pedir soporte."}, "Projetos no ar.": {"en": "Live projects.", "es": "Proyectos en línea."}, "Alguns trabalhos já publicados.": {"en": "A few works already published.", "es": "Algunos trabajos ya publicados."}, "Site empresarial com galeria de trabalhos em abas (fotos e vídeos), carrossel, menu fixo e seção de clientes.": {"en": "Corporate website with a tabbed work gallery (photos and videos), carousel, fixed menu and a clients section.", "es": "Sitio web empresarial con galería de trabajos en pestañas (fotos y videos), carrusel, menú fijo y sección de clientes."}, "Site institucional": {"en": "Corporate site", "es": "Sitio institucional"}, "Ver projeto": {"en": "View project", "es": "Ver proyecto"}, "Landing page de vendas para um curso de inglês, responsiva e voltada à conversão.": {"en": "Sales landing page for an English course, responsive and conversion-focused.", "es": "Landing page de ventas para un curso de inglés, responsiva y orientada a la conversión."}, "HTML e CSS": {"en": "HTML and CSS", "es": "HTML y CSS"}, "Dashboard para acompanhar investimentos, instalável como aplicativo (PWA).": {"en": "Dashboard to track investments, installable as an app (PWA).", "es": "Panel para seguir inversiones, instalable como aplicación (PWA)."}, "Sistema": {"en": "System", "es": "Sistema"}, "Dúvidas frequentes": {"en": "Frequently asked questions", "es": "Preguntas frecuentes"}, "Quanto custa um site?": {"en": "How much does a website cost?", "es": "¿Cuánto cuesta un sitio web?"}, "Depende do número de páginas, do conteúdo e das funções. Depois de entender o que você precisa, enviamos um orçamento personalizado.": {"en": "It depends on the number of pages, the content and the features. Once we understand what you need, we send a personalized quote.", "es": "Depende del número de páginas, del contenido y de las funciones. Cuando entendemos lo que necesitas, enviamos un presupuesto personalizado."}, "Quanto tempo leva para ficar pronto?": {"en": "How long does it take?", "es": "¿Cuánto tarda en estar listo?"}, "O prazo varia conforme o escopo e é combinado antes de começarmos.": {"en": "The timeline varies with the scope and is agreed before we start.", "es": "El plazo varía según el alcance y se acuerda antes de empezar."}, "Vocês cuidam da publicação?": {"en": "Do you handle publishing?", "es": "¿Se encargan de la publicación?"}, "Sim. Configuramos e colocamos o projeto no ar.": {"en": "Yes. We set it up and put the project live.", "es": "Sí. Lo configuramos y publicamos el proyecto."}, "O site funciona bem no celular?": {"en": "Does the site work well on mobile?", "es": "¿El sitio funciona bien en el móvil?"}, "Sim. Todos os projetos são feitos para se adaptar a telas de qualquer tamanho.": {"en": "Yes. All projects are built to adapt to any screen size.", "es": "Sí. Todos los proyectos se hacen para adaptarse a pantallas de cualquier tamaño."}, "Vocês dão suporte depois?": {"en": "Do you offer support afterwards?", "es": "¿Ofrecen soporte después?"}, "Podemos combinar suporte e evoluções conforme a sua necessidade.": {"en": "We can agree on support and improvements according to your needs.", "es": "Podemos acordar soporte y mejoras según tu necesidad."}, "Conte sua ideia e peça um orçamento.": {"en": "Tell us your idea and request a quote.", "es": "Cuéntanos tu idea y pide un presupuesto."}, "Preencha ao lado e a sua mensagem chega direto no nosso e-mail. Respondemos em breve, sem compromisso.": {"en": "Fill in the form and your message goes straight to our email. We'll reply soon, no commitment.", "es": "Rellena el formulario y tu mensaje llega directo a nuestro correo. Respondemos pronto, sin compromiso."}, "Prefere falar no WhatsApp?": {"en": "Prefer to chat on WhatsApp?", "es": "¿Prefieres hablar por WhatsApp?"}, "Seu nome": {"en": "Your name", "es": "Tu nombre"}, "Seu e-mail": {"en": "Your email", "es": "Tu correo electrónico"}, "O que você precisa?": {"en": "What do you need?", "es": "¿Qué necesitas?"}, "Site profissional": {"en": "Professional website", "es": "Sitio web profesional"}, "Loja virtual": {"en": "Online store", "es": "Tienda en línea"}, "Sistema personalizado": {"en": "Custom system", "es": "Sistema personalizado"}, "Automação ou integração": {"en": "Automation or integration", "es": "Automatización o integración"}, "Tráfego pago ou redes sociais": {"en": "Paid traffic or social media", "es": "Tráfico de pago o redes sociales"}, "Outro": {"en": "Other", "es": "Otro"}, "Conte um pouco sobre o projeto": {"en": "Tell us a bit about the project", "es": "Cuéntanos un poco sobre el proyecto"}, "Enviar mensagem": {"en": "Send message", "es": "Enviar mensaje"}, "© 2026 Rocket Tech. Todos os direitos reservados.": {"en": "© 2026 Rocket Tech. All rights reserved.", "es": "© 2026 Rocket Tech. Todos los derechos reservados."}, "Sites, sistemas e automações sob medida.": {"en": "Custom websites, systems and automation.", "es": "Sitios web, sistemas y automatizaciones a medida."}, "Abrir opções de acessibilidade": {"en": "Open accessibility options", "es": "Abrir opciones de accesibilidad"}, "Fechar opções de acessibilidade": {"en": "Close accessibility options", "es": "Cerrar opciones de accesibilidad"}, "Opções de acessibilidade": {"en": "Accessibility options", "es": "Opciones de accesibilidad"}, "Acessibilidade": {"en": "Accessibility", "es": "Accesibilidad"}, "Tamanho do texto": {"en": "Text size", "es": "Tamaño del texto"}, "Diminuir texto": {"en": "Decrease text size", "es": "Reducir texto"}, "Aumentar texto": {"en": "Increase text size", "es": "Aumentar texto"}, "Alto contraste": {"en": "High contrast", "es": "Alto contraste"}, "Fonte mais legível": {"en": "More readable font", "es": "Fuente más legible"}, "Sublinhar links": {"en": "Underline links", "es": "Subrayar enlaces"}, "Reduzir animações": {"en": "Reduce animations", "es": "Reducir animaciones"}, "Restaurar padrão": {"en": "Restore defaults", "es": "Restaurar valores"}, "Mudar idioma": {"en": "Change language", "es": "Cambiar idioma"}, "Preencha nome, e-mail e a mensagem.": {"en": "Fill in your name, email and message.", "es": "Completa tu nombre, correo y mensaje."}, "Digite um e-mail válido.": {"en": "Enter a valid email address.", "es": "Escribe un correo electrónico válido."}, "Formulário ainda não configurado: falta o código do Formspree.": {"en": "Form not configured yet: the Formspree code is missing.", "es": "Formulario aún sin configurar: falta el código de Formspree."}, "Enviando...": {"en": "Sending...", "es": "Enviando..."}, "Mensagem enviada! Entraremos em contato em breve.": {"en": "Message sent! We will get back to you soon.", "es": "¡Mensaje enviado! Nos pondremos en contacto pronto."}, "Não foi possível enviar agora. Tente de novo ou fale pelo WhatsApp.": {"en": "Couldn't send right now. Try again or reach us on WhatsApp.", "es": "No se pudo enviar ahora. Inténtalo de nuevo o escríbenos por WhatsApp."}, "Sem conexão ou erro no envio. Tente de novo ou fale pelo WhatsApp.": {"en": "Connection or sending error. Try again or reach us on WhatsApp.", "es": "Sin conexión o error al enviar. Inténtalo de nuevo o escríbenos por WhatsApp."}, "Olá! Vim pelo site da Rocket Tech e gostaria de conversar sobre um projeto.": {"en": "Hello! I came from the Rocket Tech website and would like to talk about a project.", "es": "¡Hola! Vengo del sitio de Rocket Tech y me gustaría hablar sobre un proyecto."}};
  var lang = 'pt';
  var langBtn = document.getElementById('lang-btn');
  var langPanel = document.getElementById('lang-panel');
  var origTitle = document.title;
  var metaDesc = document.querySelector('meta[name="description"]');
  var origDesc = metaDesc ? metaDesc.getAttribute('content') : '';

  function tr(k) {
    var e = DICT[k];
    return (lang !== 'pt' && e && e[lang]) ? e[lang] : k;
  }

  /* guarda o valor original (português) das opções do formulário */
  Array.prototype.forEach.call(document.querySelectorAll('#tipo option'), function (o) { o.value = o.textContent; });

  function applyLang(l) {
    lang = l;
    root.lang = { pt: 'pt-BR', en: 'en', es: 'es' }[l];

    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) {
      var par = n.parentNode;
      if (!par || par.nodeName === 'SCRIPT' || par.nodeName === 'STYLE') continue;
      if (n.__pt === undefined) n.__pt = n.nodeValue;
      var m = n.__pt.match(/^(\s*)([\s\S]*?)(\s*)$/);
      var key = m[2].replace(/\s+/g, ' ');
      if (!key) continue;
      var e = DICT[key];
      n.nodeValue = (l !== 'pt' && e && e[l]) ? m[1] + e[l] + m[3] : n.__pt;
    }

    Array.prototype.forEach.call(document.querySelectorAll('[aria-label]'), function (el) {
      if (el.id === 'a11y-btn') return;
      if (el.__ptl === undefined) el.__ptl = el.getAttribute('aria-label');
      el.setAttribute('aria-label', tr(el.__ptl));
    });

    document.title = tr(origTitle);
    if (metaDesc) metaDesc.setAttribute('content', tr(origDesc));
    a11yBtn.setAttribute('aria-label', tr(panel.hidden ? 'Abrir opções de acessibilidade' : 'Fechar opções de acessibilidade'));
    document.getElementById('lang-code').textContent = l.toUpperCase();
    Array.prototype.forEach.call(langPanel.querySelectorAll('button[data-lang]'), function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === l ? 'true' : 'false');
    });
    updateWa();
    try { localStorage.setItem('rocket-lang', l); } catch (err) {}
    setTimeout(function () { if (current > -1) movePill(current); }, 80);
  }

  function openLang(open) {
    langPanel.hidden = !open;
    langBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      if (!panel.hidden) openPanel(false);
      var sel = langPanel.querySelector('button[aria-pressed="true"]') || langPanel.querySelector('button');
      sel.focus();
    }
  }
  langBtn.addEventListener('click', function () { openLang(langPanel.hidden); });
  langPanel.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-lang]');
    if (!b) return;
    applyLang(b.getAttribute('data-lang'));
    openLang(false);
    langBtn.focus();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !langPanel.hidden) { openLang(false); langBtn.focus(); }
  });
  document.addEventListener('click', function (e) {
    if (!langPanel.hidden && !langPanel.contains(e.target) && !langBtn.contains(e.target)) openLang(false);
  });

  var initial = 'pt';
  try {
    var savedLang = localStorage.getItem('rocket-lang');
    if (savedLang && DICT && ['pt', 'en', 'es'].indexOf(savedLang) > -1) initial = savedLang;
    else {
      var nav = (navigator.language || 'pt').slice(0, 2).toLowerCase();
      if (nav === 'en' || nav === 'es') initial = nav;
    }
  } catch (err) {}
  applyLang(initial);

  /* Formulário -> e-mail (Formspree) */
  var form = document.getElementById('form');
  var statusEl = document.getElementById('status');
  var btn = document.getElementById('enviar');

  function setStatus(msg, cls) { statusEl.textContent = tr(msg); statusEl.className = 'form-status ' + (cls || ''); }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nome = document.getElementById('nome').value.trim();
    var email = document.getElementById('email').value.trim();
    var tipo = document.getElementById('tipo').value;
    var msg = document.getElementById('msg').value.trim();

    if (!nome || !email || !msg) { setStatus('Preencha nome, e-mail e a mensagem.', 'erro'); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setStatus('Digite um e-mail válido.', 'erro'); return; }
    if (FORM_ID === 'COLE_O_CODIGO_AQUI') { setStatus('Formulário ainda não configurado: falta o código do Formspree.', 'erro'); return; }

    btn.disabled = true;
    setStatus('Enviando...');

    fetch('https://formspree.io/f/' + FORM_ID, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: nome,
        email: email,
        tipo: tipo,
        message: msg,
        _subject: 'Novo contato pelo site Rocket Tech: ' + tipo,
        _gotcha: document.getElementById('botcheck').checked ? 'bot' : ''
      })
    })
      .then(function (r) {
        if (r.ok) {
          form.reset();
          setStatus('Mensagem enviada! Entraremos em contato em breve.', 'ok');
        } else {
          setStatus('Não foi possível enviar agora. Tente de novo ou fale pelo WhatsApp.', 'erro');
        }
      })
      .catch(function () {
        setStatus('Sem conexão ou erro no envio. Tente de novo ou fale pelo WhatsApp.', 'erro');
      })
      .then(function () { btn.disabled = false; });
  });
})();