(function () {
  const pageKey = document.body.dataset.page || 'home';

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function show(el, visible) {
    if (el) {
      el.hidden = !visible;
    }
  }

  function setHtml(el, html) {
    if (el) {
      el.innerHTML = html;
    }
  }

  function setText(el, value) {
    if (el) {
      el.textContent = value ?? '';
    }
  }

  function setLink(el, href, label) {
    if (!el) return;
    if (href) {
      el.href = href;
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
    setText(el, label);
  }

  function pathLabel(pathname) {
    switch (pathname) {
      case '/':
      case '/index.html':
        return '首頁';
      case '/about.html':
        return '關於我們';
      case '/merchant.html':
        return '店家專區';
      case '/courier.html':
        return '外送夥伴專區';
      case '/consumer.html':
        return '消費者專區';
      default:
        return '頁面';
    }
  }

  async function fetchSiteData() {
    const response = await fetch('/api/site.php', { cache: 'no-store' });
    const payload = await response.json().catch(() => null);

    if (!response.ok || !payload || !payload.ok) {
      throw new Error(payload?.message || `讀取失敗 (${response.status})`);
    }

    return payload.data;
  }

  function currentPageData(site) {
    return site?.pages?.[pageKey] || {};
  }

  function headerNavItems(site) {
    const header = site?.header || {};
    const navItems = asArray(header.navItems);
    const aboutLink = header.aboutLink ? [header.aboutLink] : [];
    const items = [...navItems, ...aboutLink];
    const seen = new Set();
    return items.filter((item) => {
      const key = `${item.label || ''}|${item.href || ''}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function renderHeader(site) {
    const header = site?.header || {};
    const logo = site?.logo || {};
    const nav = byId('site-nav');
    const navToggle = byId('nav-toggle');
    const cta = byId('header-cta');
    const subtitle = byId('site-subtitle');
    const logoEl = byId('site-logo');
    const brandName = byId('site-name');

    if (logoEl && logo.url) {
      logoEl.src = logo.url;
      logoEl.alt = logo.alt || site.siteName || '品牌標誌';
    }

    setText(brandName, site?.siteName || 'snail-delivery');
    setText(subtitle, header.subtitle || '');

    const navHtml = headerNavItems(site)
      .map((item) => {
        const href = item.href || '#';
        const active = href === window.location.pathname ? ' is-active' : '';
        return `<li><a class="site-nav__link${active}" href="${escapeHtml(href)}">${escapeHtml(item.label || '')}</a></li>`;
      })
      .join('');

    setHtml(nav, `<ul class="site-nav__list">${navHtml}</ul>`);

    if (navToggle && nav) {
      navToggle.addEventListener('click', () => {
        nav.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', nav.classList.contains('is-open') ? 'true' : 'false');
      });
    }

    if (cta) {
      const ctaItem = header.cta || {};
      if (pageKey !== 'home' && ctaItem.href === '#download-cards') {
        cta.href = '/#download-cards';
      } else {
        cta.href = ctaItem.href || '#download-cards';
      }
      cta.textContent = ctaItem.label || '立即下載 App';
    }
  }

  function renderHero(site, page) {
    const hero = page.hero || {
      badge: page.title ? pathLabel(window.location.pathname) : '',
      title: page.title || '',
      subtitle: page.description || page.intro || '',
      primaryLabel: '回到首頁',
      primaryHref: '/',
      secondaryLabel: '',
      secondaryHref: '',
      deviceBadge: '',
      secondaryBadge: '',
      heroImage: null,
      stats: [],
    };

    const badge = byId('hero-badge');
    const title = byId('hero-title');
    const subtitle = byId('hero-subtitle');
    const visual = byId('hero-visual');
    const actions = byId('hero-actions');
    const stats = byId('hero-stats');
    const badges = byId('hero-badges');

    setText(badge, hero.badge || pathLabel(window.location.pathname));
    setText(title, hero.title || '');
    setText(subtitle, hero.subtitle || page.intro || page.description || '');

    const actionHtml = [];
    if (hero.primaryLabel && hero.primaryHref) {
      actionHtml.push(`<a class="btn btn--primary" href="${escapeHtml(hero.primaryHref)}">${escapeHtml(hero.primaryLabel)}</a>`);
    }
    if (hero.secondaryLabel && hero.secondaryHref) {
      actionHtml.push(`<a class="btn btn--secondary" href="${escapeHtml(hero.secondaryHref)}">${escapeHtml(hero.secondaryLabel)}</a>`);
    }
    setHtml(actions, actionHtml.join(''));

    const statHtml = asArray(hero.stats)
      .map(
        (item) => `
          <div class="stat">
            <span class="stat__label">${escapeHtml(item.label || '')}</span>
            <span class="stat__value">${escapeHtml(item.value || '')}</span>
          </div>
        `,
      )
      .join('');
    setHtml(stats, statHtml);

    const badgeHtml = [];
    if (hero.deviceBadge) {
      badgeHtml.push(`<span class="badge">${escapeHtml(hero.deviceBadge)}</span>`);
    }
    if (hero.secondaryBadge) {
      badgeHtml.push(`<span class="badge">${escapeHtml(hero.secondaryBadge)}</span>`);
    }
    setHtml(badges, badgeHtml.join(''));

    if (hero.heroImage && hero.heroImage.url) {
      const alt = hero.heroImage.alt || hero.title || '';
      visual.innerHTML = `<img src="${escapeHtml(hero.heroImage.url)}" alt="${escapeHtml(alt)}" loading="eager">`;
    } else {
      visual.innerHTML = '<div class="empty-state">此頁尚未設定主視覺。</div>';
    }
  }

  function renderFeatureCards(page) {
    const section = byId('features-section');
    const grid = byId('features-grid');
    const cards = asArray(page.features);

    if (!section || !grid) return;
    if (!cards.length) {
      show(section, false);
      return;
    }

    show(section, true);
    grid.innerHTML = cards
      .map(
        (card) => `
          <article class="card">
            <div class="card__body">
              <p class="card__eyebrow">${escapeHtml(card.eyebrow || '')}</p>
              <h3 class="card__title">${escapeHtml(card.title || '')}</h3>
              <p class="card__desc">${escapeHtml(card.description || '')}</p>
            </div>
          </article>
        `,
      )
      .join('');
  }

  function renderDownloadCards(page) {
    const section = byId('downloads-section');
    const grid = byId('downloads-grid');
    const cards = asArray(page.downloadCards);

    if (!section || !grid) return;
    if (!cards.length) {
      show(section, false);
      return;
    }

    show(section, true);
    grid.innerHTML = cards
      .map((card) => {
        const img = card.image || {};
        const chips = asArray(card.highlights)
          .map((item) => `<span class="chip">${escapeHtml(item)}</span>`)
          .join('');

        return `
          <article class="card downloads__card">
            <div class="card__media card__media--contain downloads__media">
              <img src="${escapeHtml(img.url || '')}" alt="${escapeHtml(img.alt || card.title || '')}" loading="lazy">
            </div>
            <div class="card__body downloads__info">
              <p class="card__eyebrow">${escapeHtml(card.eyebrow || '')}</p>
              <h3>${escapeHtml(card.title || '')}</h3>
              <div class="muted">${escapeHtml(card.audience || '')}</div>
              <p>${escapeHtml(card.description || '')}</p>
              <div class="card__chips">${chips}</div>
              <div class="card__actions">
                <a class="btn btn--primary" href="${escapeHtml(card.iosUrl || '#')}" target="_blank" rel="noreferrer">App Store</a>
                <a class="btn btn--secondary" href="${escapeHtml(card.androidUrl || '#')}" target="_blank" rel="noreferrer">Google Play</a>
              </div>
            </div>
          </article>
        `;
      })
      .join('');
  }

  function renderLaunchFlow(page) {
    const section = byId('launch-section');
    const eyebrow = byId('launch-eyebrow');
    const title = byId('launch-title');
    const lead = byId('launch-lead');
    const steps = byId('launch-steps');
    const launch = page.launchFlow;

    if (!section || !launch) {
      show(section, false);
      return;
    }

    show(section, true);
    setText(eyebrow, launch.eyebrow || '');
    setText(title, launch.title || '');
    setText(lead, launch.description || '');

    steps.innerHTML = asArray(launch.steps)
      .map(
        (step) => `
          <article class="step">
            <span class="step__index">${escapeHtml(step.index || '')}</span>
            <h3 class="step__title">${escapeHtml(step.title || '')}</h3>
            <p class="step__desc">${escapeHtml(step.description || '')}</p>
          </article>
        `,
      )
      .join('');
  }

  function textSizeClass(size) {
    switch (size) {
      case 'small':
        return 'text-size-small';
      case 'large':
        return 'text-size-large';
      case 'xlarge':
        return 'text-size-xlarge';
      case 'xxlarge':
        return 'text-size-xxlarge';
      default:
        return 'text-size-normal';
    }
  }

  function blockSizeClass(size) {
    switch (size) {
      case 'small':
        return 'block-card--small';
      case 'large':
        return 'block-card--large';
      case 'full':
        return 'block-card--full';
      default:
        return 'block-card--medium';
    }
  }

  function renderBlocks(page) {
    const section = byId('blocks-section');
    const grid = byId('blocks-grid');
    const blocks = asArray(page.blocks);

    if (!section || !grid) return;
    if (!blocks.length) {
      show(section, false);
      return;
    }

    show(section, true);
    grid.innerHTML = blocks
      .map((block) => {
        const type = block.type || 'text';
        const hasMedia = Boolean(block.mediaUrl);
        const wrapperClass = ['card', 'block-card', textSizeClass(block.textSize), blockSizeClass(block.blockSize)]
          .filter(Boolean)
          .join(' ');

        let mediaHtml = '';
        if (type === 'image' && hasMedia) {
          mediaHtml = `
            <figure class="block-card__figure">
              <img src="${escapeHtml(block.mediaUrl)}" alt="${escapeHtml(block.mediaAlt || block.heading || '')}" loading="lazy">
            </figure>
          `;
        } else if (type === 'video' && hasMedia) {
          mediaHtml = `
            <figure class="block-card__figure">
              <video controls playsinline preload="metadata" src="${escapeHtml(block.mediaUrl)}"></video>
            </figure>
          `;
        }

        const button = block.linkUrl && block.buttonLabel
          ? `<a class="btn btn--secondary" href="${escapeHtml(block.linkUrl)}" target="_blank" rel="noreferrer">${escapeHtml(block.buttonLabel)}</a>`
          : '';

        return `
          <article class="${wrapperClass}">
            <div class="card__body block-card__text">
              <p class="block-card__caption">${escapeHtml(block.caption || '')}</p>
              <h3 class="block-card__title">${escapeHtml(block.heading || '')}</h3>
              <p class="block-card__body">${escapeHtml(block.body || '')}</p>
              ${button ? `<div class="card__actions">${button}</div>` : ''}
            </div>
            ${mediaHtml}
          </article>
        `;
      })
      .join('');
  }

  function renderSections(page) {
    const section = byId('sections-section');
    const grid = byId('sections-grid');
    const sections = asArray(page.sections);

    if (!section || !grid) return;
    if (!sections.length) {
      show(section, false);
      return;
    }

    show(section, true);
    grid.innerHTML = sections
      .map((item) => {
        const items = asArray(item.items)
          .map(
            (entry) => `
              <article class="role-item">
                <div class="role-item__icon">${escapeHtml(entry.icon || '•')}</div>
                <div class="role-item__eyebrow">${escapeHtml(entry.eyebrow || '')}</div>
                <h3 class="role-item__title">${escapeHtml(entry.title || '')}</h3>
                <p class="role-item__desc">${escapeHtml(entry.description || '')}</p>
              </article>
            `,
          )
          .join('');

        return `
          <article class="card role-card">
            <div class="role-card__body">
              <p class="card__eyebrow">${escapeHtml(item.badge || '')}</p>
              <h2 class="section-title">${escapeHtml(item.title || '')}</h2>
              <p class="section__lead">${escapeHtml(item.description || '')}</p>
              <div class="role-card__items">${items}</div>
            </div>
          </article>
        `;
      })
      .join('');
  }

  function renderAbout(page) {
    const section = byId('about-section');
    const title = byId('about-title');
    const lead = byId('about-lead');
    const videoTitle = byId('about-video-title');
    const videoDesc = byId('about-video-desc');
    const videoHint = byId('about-video-hint');
    const videoWrap = byId('about-video');

    if (!section) return;

    setText(title, page.title || '關於我們');
    setText(lead, page.intro || page.description || '');
    setText(videoTitle, page.videoTitle || '');
    setText(videoDesc, page.videoDescription || '');
    setText(videoHint, page.videoHint || '');

    if (page.aboutVideoUrl) {
      videoWrap.innerHTML = `<video controls playsinline preload="metadata" src="${escapeHtml(page.aboutVideoUrl)}"${page.aboutVideoPoster ? ` poster="${escapeHtml(page.aboutVideoPoster)}"` : ''}></video>`;
    } else {
      videoWrap.innerHTML = '<div class="empty-state">尚未設定品牌影片。</div>';
    }

    const blocksPage = { blocks: page.blocks };
    renderBlocks(blocksPage);
  }

  function renderFooter(site) {
    const footerTitle = byId('footer-title');
    const footerDesc = byId('footer-desc');
    const footerGroups = byId('footer-groups');
    const footerNote = byId('footer-note');
    const groups = asArray(site?.footerLinkGroups);

    setText(footerTitle, site?.footerTitle || '');
    setText(footerDesc, site?.footerDescription || '');

    footerGroups.innerHTML = groups
      .map((group) => {
        const links = asArray(group.links)
          .map((link) => `<li><a href="${escapeHtml(link.href || '#')}">${escapeHtml(link.label || '')}</a></li>`)
          .join('');
        return `
          <div class="footer__links">
            <h3>${escapeHtml(group.title || '')}</h3>
            <ul>${links}</ul>
          </div>
        `;
      })
      .join('');

    setText(footerNote, site?.organizationName || 'GoGet 蝸牛外送');
  }

  function renderError(message) {
    const root = byId('page-error');
    if (!root) return;
    root.hidden = false;
    root.textContent = message;
  }

  async function init() {
    const root = document.body;
    const site = await fetchSiteData().catch((error) => {
      renderError(error.message || '無法載入網站資料');
      throw error;
    });

    const page = currentPageData(site);
    const seo = page.seo || {};

    document.title = `${seo.pageTitle || page.title || site.siteName || 'snail-delivery'}`;
    if (seo.metaDescription) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute('content', seo.metaDescription);
      }
    }

    renderHeader(site);
    renderHero(site, page);

    if (pageKey === 'home') {
      renderFeatureCards(page);
      renderDownloadCards(page);
      renderLaunchFlow(page);
    }

    if (pageKey === 'about') {
      const section = byId('about-section');
      show(section, true);
      renderAbout(page);
      show(byId('downloads-section'), false);
      show(byId('features-section'), false);
      show(byId('launch-section'), false);
      show(byId('sections-section'), false);
    } else {
      show(byId('about-section'), false);
      if (pageKey !== 'home') {
        show(byId('downloads-section'), false);
        show(byId('features-section'), false);
        show(byId('launch-section'), false);
      }
    }

    if (pageKey === 'home') {
      show(byId('sections-section'), false);
    } else {
      renderSections(page);
      show(byId('blocks-section'), true);
    }

    if (pageKey !== 'about' && page.blocks) {
      renderBlocks(page);
    }

    renderFooter(site);
    show(root, true);
  }

  document.addEventListener('DOMContentLoaded', () => {
    init().catch(() => {
      // Error banner already rendered.
    });
  });
})();
