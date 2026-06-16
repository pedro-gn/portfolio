/* Lightweight i18n for the portfolio.
   Every translatable node carries data-i18n="key"; values may contain HTML.
   Choice persists in localStorage and updates <html lang>. */
(function () {
  const dict = {
    en: {
      'nav.projects': 'Projects',
      'nav.skills': 'Skills',
      'nav.experience': 'Experience',
      'nav.cta': "Let's talk",

      'hero.status': 'Available for new projects · Remote / Lisbon',
      'hero.title': 'Fullstack developer<br />building <span class="grad">fast, thoughtful</span><br />products end to end.',
      'hero.lead': "I'm <strong>Alex Rivera</strong> — I design and ship complete web products, from database schema to pixel-perfect UI. Comfortable owning the whole stack and the messy parts in between.",
      'hero.btnWork': 'View my work <span class="arrow">↗</span>',
      'hero.btnContact': 'Get in touch',
      'hero.scroll': 'SCROLL',

      'about.eyebrow': '01 — About',
      'about.title': 'I turn ideas into products people actually use.',
      'about.p1': "Over the last several years I've built everything from real-time dashboards and payment systems to design-driven marketing sites. I care about <strong>clean architecture</strong>, fast load times, and interfaces that feel obvious.",
      'about.p2': 'I work best embedded in small teams where I can move across the stack — shaping API contracts in the morning and polishing animations in the afternoon. Lately I\'ve been deep in <strong>TypeScript, Go, and edge infrastructure</strong>.',
      'about.stat1': 'years shipping production code',
      'about.stat2': 'projects delivered end to end',
      'about.stat3': 'monthly requests served',
      'about.stat4': 'uptime across live systems',

      'projects.eyebrow': '02 — Selected work',
      'projects.title': 'Projects',
      'projects.sub': "A few things I've designed, built, and shipped. Swap these for your own — each card links out to a live demo or repo.",
      'proj1.title': 'Helm — realtime ops dashboard',
      'proj1.desc': 'A live operations console for a logistics company: websocket data streams, role-based access, and a custom charting layer. Cut incident response time by 40%.',
      'proj2.title': 'Ledger — payments API',
      'proj2.desc': 'A double-entry payments service handling subscriptions, refunds, and reconciliation with idempotent webhooks.',
      'proj3.title': 'Atlas — docs search engine',
      'proj3.desc': 'Full-text + semantic search over internal docs with sub-50ms queries and a keyboard-first UI.',
      'proj4.title': 'Nimbus — deploy CLI',
      'proj4.desc': 'An open-source CLI that ships containers to edge regions with one command. 1.2k stars on GitHub.',
      'proj5.title': 'Canvas — collaborative editor',
      'proj5.desc': 'A multiplayer rich-text editor with CRDT sync, presence cursors, and offline support.',

      'skills.eyebrow': '03 — Toolkit',
      'skills.title': 'Skills &amp; stack',
      'skills.sub': 'The tools I reach for, grouped by where they live in the stack.',
      'skill.frontend': 'Frontend',
      'skill.backend': 'Backend',
      'skill.infra': 'Infra &amp; DevOps',
      'skill.data': 'Data',
      'skill.design': 'Design',
      'skill.practices': 'Practices',

      'experience.eyebrow': '04 — Career',
      'experience.title': 'Experience',
      'experience.sub': "Where I've worked and what I shipped there.",
      'exp1.role': 'Senior Fullstack Engineer · <span class="tl-co">Northwind</span>',
      'exp1.date': '2023 — Present',
      'exp1.desc': 'Lead engineer on the customer platform. Rebuilt the core dashboard in Next.js + Go, owned the design system, and mentored three engineers. Drove a 2× improvement in page-load performance.',
      'exp2.role': 'Fullstack Developer · <span class="tl-co">Bright Labs</span>',
      'exp2.date': '2021 — 2023',
      'exp2.desc': 'Built and scaled a multi-tenant SaaS from 0 to 30k users. Designed the API, the billing system, and the React frontend. Introduced end-to-end testing and CI that cut regressions sharply.',
      'exp3.role': 'Software Engineer · <span class="tl-co">Pixel &amp; Co</span>',
      'exp3.date': '2019 — 2021',
      'exp3.desc': 'Delivered client web apps across e-commerce, fintech, and media. Worked directly with designers to ship polished, accessible interfaces on tight timelines.',

      'contact.eyebrow': '05 — Contact',
      'contact.title': "Let's build something.",
      'contact.sub': 'Have a project in mind or just want to say hi? My inbox is always open.',
      'social.github': 'GitHub ↗',
      'social.linkedin': 'LinkedIn ↗',
      'social.x': 'X / Twitter ↗',
      'social.resume': 'Resume ↓',
      'footer.built': 'Built from scratch · <a href="#top">Back to top ↑</a>',
    },

    pt: {
      'nav.projects': 'Projetos',
      'nav.skills': 'Habilidades',
      'nav.experience': 'Experiência',
      'nav.cta': 'Vamos conversar',

      'hero.status': 'Disponível para novos projetos · Remoto / Lisboa',
      'hero.title': 'Desenvolvedor fullstack<br />criando produtos <span class="grad">rápidos e bem pensados</span><br />de ponta a ponta.',
      'hero.lead': 'Sou o <strong>Alex Rivera</strong> — projeto e desenvolvo produtos web completos, do schema do banco à interface nos mínimos detalhes. À vontade cuidando de toda a stack e das partes complicadas no meio do caminho.',
      'hero.btnWork': 'Ver meu trabalho <span class="arrow">↗</span>',
      'hero.btnContact': 'Entrar em contato',
      'hero.scroll': 'ROLE',

      'about.eyebrow': '01 — Sobre',
      'about.title': 'Transformo ideias em produtos que as pessoas realmente usam.',
      'about.p1': 'Nos últimos anos, construí de tudo — de dashboards em tempo real e sistemas de pagamento a sites institucionais orientados a design. Me importo com <strong>arquitetura limpa</strong>, carregamento rápido e interfaces que parecem óbvias.',
      'about.p2': 'Trabalho melhor integrado a times pequenos, onde posso transitar por toda a stack — definindo contratos de API de manhã e refinando animações à tarde. Ultimamente tenho me aprofundado em <strong>TypeScript, Go e infraestrutura edge</strong>.',
      'about.stat1': 'anos escrevendo código em produção',
      'about.stat2': 'projetos entregues de ponta a ponta',
      'about.stat3': 'requisições mensais atendidas',
      'about.stat4': 'de uptime nos sistemas em produção',

      'projects.eyebrow': '02 — Trabalhos selecionados',
      'projects.title': 'Projetos',
      'projects.sub': 'Algumas coisas que projetei, construí e lancei. Troque pelos seus — cada card leva a uma demo ou repositório.',
      'proj1.title': 'Helm — dashboard de operações em tempo real',
      'proj1.desc': 'Um console de operações ao vivo para uma empresa de logística: streams de dados via websocket, acesso por função e uma camada de gráficos personalizada. Reduziu o tempo de resposta a incidentes em 40%.',
      'proj2.title': 'Ledger — API de pagamentos',
      'proj2.desc': 'Um serviço de pagamentos de partidas dobradas que cuida de assinaturas, reembolsos e reconciliação com webhooks idempotentes.',
      'proj3.title': 'Atlas — motor de busca de docs',
      'proj3.desc': 'Busca full-text e semântica em documentos internos, com consultas abaixo de 50ms e uma interface voltada ao teclado.',
      'proj4.title': 'Nimbus — CLI de deploy',
      'proj4.desc': 'Uma CLI open-source que envia containers para regiões edge com um único comando. 1,2 mil estrelas no GitHub.',
      'proj5.title': 'Canvas — editor colaborativo',
      'proj5.desc': 'Um editor de texto rico multiplayer com sincronização CRDT, cursores de presença e suporte offline.',

      'skills.eyebrow': '03 — Ferramentas',
      'skills.title': 'Habilidades &amp; stack',
      'skills.sub': 'As ferramentas que uso, agrupadas por onde vivem na stack.',
      'skill.frontend': 'Frontend',
      'skill.backend': 'Backend',
      'skill.infra': 'Infra &amp; DevOps',
      'skill.data': 'Dados',
      'skill.design': 'Design',
      'skill.practices': 'Práticas',

      'experience.eyebrow': '04 — Carreira',
      'experience.title': 'Experiência',
      'experience.sub': 'Onde trabalhei e o que entreguei.',
      'exp1.role': 'Engenheiro Fullstack Sênior · <span class="tl-co">Northwind</span>',
      'exp1.date': '2023 — Atual',
      'exp1.desc': 'Engenheiro líder da plataforma de clientes. Reconstruí o dashboard principal em Next.js + Go, fui responsável pelo design system e orientei três engenheiros. Conduzi uma melhoria de 2× no tempo de carregamento.',
      'exp2.role': 'Desenvolvedor Fullstack · <span class="tl-co">Bright Labs</span>',
      'exp2.date': '2021 — 2023',
      'exp2.desc': 'Construí e escalei um SaaS multi-tenant de 0 a 30 mil usuários. Projetei a API, o sistema de cobrança e o frontend em React. Introduzi testes ponta a ponta e CI que reduziram regressões drasticamente.',
      'exp3.role': 'Engenheiro de Software · <span class="tl-co">Pixel &amp; Co</span>',
      'exp3.date': '2019 — 2021',
      'exp3.desc': 'Entreguei aplicações web para clientes de e-commerce, fintech e mídia. Trabalhei diretamente com designers para lançar interfaces polidas e acessíveis em prazos apertados.',

      'contact.eyebrow': '05 — Contato',
      'contact.title': 'Vamos construir algo.',
      'contact.sub': 'Tem um projeto em mente ou só quer dar um oi? Minha caixa de entrada está sempre aberta.',
      'social.github': 'GitHub ↗',
      'social.linkedin': 'LinkedIn ↗',
      'social.x': 'X / Twitter ↗',
      'social.resume': 'Currículo ↓',
      'footer.built': 'Feito do zero · <a href="#top">Voltar ao topo ↑</a>',
    },
  };

  const STORE = 'portfolio-lang';
  const langAttr = { en: 'en', pt: 'pt-BR' };

  function apply(lang) {
    const table = dict[lang] || dict.en;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (table[key] != null) el.innerHTML = table[key];
    });
    document.documentElement.lang = langAttr[lang] || 'en';
    document.querySelectorAll('.lang-pick button').forEach((b) => {
      const on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(STORE, lang); } catch (e) {}
  }

  function init() {
    let lang = 'en';
    try { lang = localStorage.getItem(STORE) || 'en'; } catch (e) {}
    if (!dict[lang]) lang = 'en';
    apply(lang);
    document.querySelectorAll('.lang-pick button').forEach((b) => {
      b.addEventListener('click', () => apply(b.getAttribute('data-lang')));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
