(function () {
  const PASS_KEY = 'snailDeliveryAdminPassword';
  const pageLabels = {
    site: '站點設定',
    home: '首頁',
    about: '關於我們',
    merchant: '店家專區',
    courier: '外送夥伴專區',
    consumer: '消費者專區',
  };

  const state = {
    data: null,
    view: 'site',
    password: sessionStorage.getItem(PASS_KEY) || '',
  };

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function get(path, source = state.data) {
    return path.split('.').reduce((cursor, part) => {
      if (cursor && typeof cursor === 'object') {
        return cursor[part];
      }
      return undefined;
    }, source);
  }

  function set(path, value, source = state.data) {
    const parts = path.split('.');
    let cursor = source;
    for (let index = 0; index < parts.length - 1; index += 1) {
      const key = parts[index];
      if (!cursor[key] || typeof cursor[key] !== 'object') {
        cursor[key] = {};
      }
      cursor = cursor[key];
    }
    cursor[parts[parts.length - 1]] = value;
  }

  function notify(message, type = 'ok') {
    const el = byId('admin-status');
    if (!el) return;
    el.className = `notice${type === 'error' ? ' notice--error' : type === 'warn' ? ' notice--warn' : ''}`;
    el.textContent = message;
    el.hidden = false;
  }

  function clearNotify() {
    const el = byId('admin-status');
    if (!el) return;
    el.hidden = true;
    el.textContent = '';
  }

  function headers(extra = {}) {
    const value = state.password || sessionStorage.getItem(PASS_KEY) || '';
    return {
      'Content-Type': 'application/json',
      ...(value ? { 'X-Admin-Password': value } : {}),
      ...extra,
    };
  }

  async function ensurePassword() {
    if (state.password) {
      sessionStorage.setItem(PASS_KEY, state.password);
      return state.password;
    }

    const entered = window.prompt('請輸入管理密碼');
    if (!entered) {
      return '';
    }

    state.password = entered;
    sessionStorage.setItem(PASS_KEY, entered);
    return entered;
  }

  async function fetchJson(url, options = {}) {
    const response = await fetch(url, options);
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload || payload.ok === false) {
      const message = payload?.message || payload?.error || `請求失敗 (${response.status})`;
      const error = new Error(message);
      error.status = response.status;
      error.payload = payload;
      throw error;
    }
    return payload;
  }

  async function loadSite() {
    const payload = await fetchJson('/api/site.php', { cache: 'no-store' });
    state.data = payload.data;
  }

  function navButtonHtml(key, active) {
    return `<button type="button" data-view="${key}" class="${active ? 'is-active' : ''}">${escapeHtml(pageLabels[key])}</button>`;
  }

  function field(path, label, value = '', type = 'text', placeholder = '') {
    const safeValue = escapeHtml(value ?? '');
    if (type === 'textarea') {
      return `
        <div class="field">
          <label for="${escapeHtml(path)}">${escapeHtml(label)}</label>
          <textarea id="${escapeHtml(path)}" data-path="${escapeHtml(path)}" placeholder="${escapeHtml(placeholder)}">${safeValue}</textarea>
        </div>
      `;
    }

    return `
      <div class="field">
        <label for="${escapeHtml(path)}">${escapeHtml(label)}</label>
        <input id="${escapeHtml(path)}" type="${escapeHtml(type)}" data-path="${escapeHtml(path)}" value="${safeValue}" placeholder="${escapeHtml(placeholder)}">
      </div>
    `;
  }

  function selectField(path, label, value, options) {
    const optionsHtml = options
      .map((option) => `<option value="${escapeHtml(option)}"${option === value ? ' selected' : ''}>${escapeHtml(option)}</option>`)
      .join('');
    return `
      <div class="field">
        <label for="${escapeHtml(path)}">${escapeHtml(label)}</label>
        <select id="${escapeHtml(path)}" data-path="${escapeHtml(path)}">
          ${optionsHtml}
        </select>
      </div>
    `;
  }

  function keyValueList(path, label, items, placeholder = '每行一筆') {
    const value = asList(items)
      .map((item) => `${item.label || ''}|${item.href || ''}`)
      .join('\n');
    return field(path, label, value, 'textarea', placeholder);
  }

  function asList(value) {
    return Array.isArray(value) ? value : [];
  }

  function renderSiteView() {
    const site = state.data.site || {};
    const header = site.header || {};
    const footer = {
      title: site.footerTitle || '',
      description: site.footerDescription || '',
      links: asList(site.footerLinkGroups),
    };

    const navItems = asList(header.navItems);

    return `
      <section class="editor-section">
        <div class="editor-section__head">
          <h2>站點設定</h2>
          <p class="muted">站名、Logo、Header 與 Footer。</p>
        </div>
        <div class="form-grid form-grid--two">
          ${field('site.siteName', '站名', site.siteName || '')}
          ${field('site.siteUrl', '站點網址', site.siteUrl || '')}
          ${field('site.organizationName', '組織名稱', site.organizationName || '')}
          ${field('site.defaultSeoImageUrl', '預設 SEO 圖', site.defaultSeoImageUrl || '')}
          ${field('site.logo.url', 'Logo URL', site.logo?.url || '')}
          ${field('site.logo.alt', 'Logo alt', site.logo?.alt || '')}
        </div>
      </section>
      <section class="editor-section">
        <div class="editor-section__head">
          <h3>Header</h3>
        </div>
        <div class="form-grid form-grid--two">
          ${field('site.header.subtitle', 'Header 副標', header.subtitle || '')}
          ${field('site.header.cta.label', 'CTA 文案', header.cta?.label || '')}
          ${field('site.header.cta.href', 'CTA 連結', header.cta?.href || '')}
          ${field('site.header.aboutLink.label', '關於我們文案', header.aboutLink?.label || '')}
          ${field('site.header.aboutLink.href', '關於我們連結', header.aboutLink?.href || '')}
        </div>
        <div class="repeat-list" id="header-nav-list">
          ${navItems.map((item, index) => renderNavItem(index, item)).join('')}
        </div>
        <div class="actions-row">
          <button type="button" class="btn btn--secondary" data-add-header-nav="1">新增導覽項目</button>
        </div>
      </section>
      <section class="editor-section">
        <div class="editor-section__head">
          <h3>Footer</h3>
        </div>
        <div class="form-grid">
          ${field('site.footerTitle', 'Footer 標題', footer.title, 'textarea')}
          ${field('site.footerDescription', 'Footer 說明', footer.description, 'textarea')}
        </div>
        <div class="repeat-list">
          ${asList(site.footerLinkGroups).map((group, index) => renderLinkGroup(index, group)).join('')}
        </div>
        <div class="actions-row">
          <button type="button" class="btn btn--secondary" data-add-footer-group="1">新增 Footer 群組</button>
        </div>
      </section>
    `;
  }

  function renderNavItem(index, item) {
    return `
      <div class="repeat-item">
        <div class="repeat-item__head">
          <h4>導覽 ${index + 1}</h4>
          <button type="button" class="btn btn--ghost" data-remove="site.header.navItems.${index}">刪除</button>
        </div>
        <div class="form-grid form-grid--two">
          ${field(`site.header.navItems.${index}.label`, '文字', item.label || '')}
          ${field(`site.header.navItems.${index}.href`, '連結', item.href || '')}
        </div>
      </div>
    `;
  }

  function renderLinkGroup(index, group) {
    const links = asList(group.links)
      .map((item, linkIndex) => `
        <div class="repeat-item">
          <div class="repeat-item__head">
            <h5>連結 ${linkIndex + 1}</h5>
            <button type="button" class="btn btn--ghost" data-remove="site.footerLinkGroups.${index}.links.${linkIndex}">刪除</button>
          </div>
          <div class="form-grid form-grid--two">
            ${field(`site.footerLinkGroups.${index}.links.${linkIndex}.label`, '文字', item.label || '')}
            ${field(`site.footerLinkGroups.${index}.links.${linkIndex}.href`, '連結', item.href || '')}
          </div>
        </div>
      `)
      .join('');

    return `
      <div class="repeat-item">
        <div class="repeat-item__head">
          <h4>Footer 群組 ${index + 1}</h4>
          <button type="button" class="btn btn--ghost" data-remove="site.footerLinkGroups.${index}">刪除</button>
        </div>
        <div class="form-grid form-grid--two">
          ${field(`site.footerLinkGroups.${index}.title`, '群組標題', group.title || '')}
        </div>
        <div class="repeat-list">${links}</div>
        <div class="actions-row">
          <button type="button" class="btn btn--secondary" data-add-footer-link="${index}">新增連結</button>
        </div>
      </div>
    `;
  }

  function renderHomeView() {
    const page = state.data.pages.home || {};
    const hero = page.hero || {};

    return `
      <section class="editor-section">
        <div class="editor-section__head">
          <h2>首頁</h2>
          <p class="muted">首頁主視覺、下載卡、Launch Flow 與自訂 blocks。</p>
        </div>
        <div class="form-grid form-grid--two">
          ${field('pages.home.hero.badge', 'Badge', hero.badge || '')}
          ${field('pages.home.hero.title', '標題', hero.title || '', 'textarea')}
          ${field('pages.home.hero.subtitle', '副標', hero.subtitle || '', 'textarea')}
          ${field('pages.home.hero.primaryLabel', '主按鈕文案', hero.primaryLabel || '')}
          ${field('pages.home.hero.primaryHref', '主按鈕連結', hero.primaryHref || '')}
          ${field('pages.home.hero.secondaryLabel', '次按鈕文案', hero.secondaryLabel || '')}
          ${field('pages.home.hero.secondaryHref', '次按鈕連結', hero.secondaryHref || '')}
          ${field('pages.home.hero.deviceBadge', '裝置 Badge', hero.deviceBadge || '')}
          ${field('pages.home.hero.secondaryBadge', '次 Badge', hero.secondaryBadge || '')}
          ${field('pages.home.hero.heroImage.url', '主視覺圖片', hero.heroImage?.url || '')}
          ${field('pages.home.hero.heroImage.alt', '主視覺 alt', hero.heroImage?.alt || '')}
        </div>
      </section>
      ${renderSimpleCards('pages.home.features', '首頁特色卡', page.features || [])}
      ${renderDownloadCards(page.downloadCards || [])}
      ${renderLaunchFlow(page.launchFlow || {})}
      ${renderBlocks('pages.home.blocks', '首頁自訂 blocks', page.blocks || [])}
    `;
  }

  function renderSimpleCards(path, title, cards) {
    return `
      <section class="editor-section">
        <div class="editor-section__head">
          <h3>${escapeHtml(title)}</h3>
        </div>
        <div class="repeat-list">
          ${asList(cards).map((card, index) => `
            <div class="repeat-item">
              <div class="repeat-item__head">
                <h4>卡片 ${index + 1}</h4>
                <button type="button" class="btn btn--ghost" data-remove="${escapeHtml(path)}.${index}">刪除</button>
              </div>
              <div class="form-grid form-grid--two">
                ${field(`${path}.${index}.eyebrow`, 'Eyebrow', card.eyebrow || '')}
                ${field(`${path}.${index}.title`, '標題', card.title || '', 'textarea')}
                ${field(`${path}.${index}.description`, '說明', card.description || '', 'textarea')}
                ${selectField(`${path}.${index}.type`, '類型', card.type || 'text', ['text', 'image', 'video'])}
                ${selectField(`${path}.${index}.textSize`, '文字大小', card.textSize || 'normal', ['small', 'normal', 'large', 'xlarge', 'xxlarge'])}
                ${selectField(`${path}.${index}.blockSize`, '區塊大小', card.blockSize || 'medium', ['small', 'medium', 'large', 'full'])}
              </div>
            </div>
          `).join('')}
        </div>
        <div class="actions-row">
          <button type="button" class="btn btn--secondary" data-add-card="${escapeHtml(path)}">新增卡片</button>
        </div>
      </section>
    `;
  }

  function renderDownloadCards(cards) {
    return `
      <section class="editor-section">
        <div class="editor-section__head">
          <h3>下載卡</h3>
        </div>
        <div class="repeat-list">
          ${asList(cards).map((card, index) => `
            <div class="repeat-item">
              <div class="repeat-item__head">
                <h4>下載卡 ${index + 1}</h4>
                <button type="button" class="btn btn--ghost" data-remove="pages.home.downloadCards.${index}">刪除</button>
              </div>
              <div class="form-grid form-grid--two">
                ${field(`pages.home.downloadCards.${index}.key`, 'Key', card.key || '')}
                ${field(`pages.home.downloadCards.${index}.eyebrow`, 'Eyebrow', card.eyebrow || '')}
                ${field(`pages.home.downloadCards.${index}.title`, '標題', card.title || '', 'textarea')}
                ${field(`pages.home.downloadCards.${index}.audience`, '受眾', card.audience || '')}
                ${field(`pages.home.downloadCards.${index}.description`, '說明', card.description || '', 'textarea')}
                ${field(`pages.home.downloadCards.${index}.image.url`, '圖片 URL', card.image?.url || '')}
                ${field(`pages.home.downloadCards.${index}.image.alt`, '圖片 alt', card.image?.alt || '')}
                ${field(`pages.home.downloadCards.${index}.iosUrl`, 'iOS URL', card.iosUrl || '')}
                ${field(`pages.home.downloadCards.${index}.androidUrl`, 'Android URL', card.androidUrl || '')}
                ${field(`pages.home.downloadCards.${index}.highlights`, '亮點（每行一筆）', asList(card.highlights).join('\n'), 'textarea')}
              </div>
              <div class="actions-row">
                <button type="button" class="btn btn--secondary" data-upload-image="pages.home.downloadCards.${index}.image.url">上傳圖片</button>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="actions-row">
          <button type="button" class="btn btn--secondary" data-add-download-card="pages.home.downloadCards">新增下載卡</button>
        </div>
      </section>
    `;
  }

  function renderLaunchFlow(launch) {
    return `
      <section class="editor-section">
        <div class="editor-section__head">
          <h3>Launch Flow</h3>
        </div>
        <div class="form-grid form-grid--two">
          ${field('pages.home.launchFlow.eyebrow', 'Eyebrow', launch.eyebrow || '')}
          ${field('pages.home.launchFlow.title', '標題', launch.title || '', 'textarea')}
          ${field('pages.home.launchFlow.description', '說明', launch.description || '', 'textarea')}
        </div>
        <div class="repeat-list">
          ${asList(launch.steps).map((step, index) => `
            <div class="repeat-item">
              <div class="repeat-item__head">
                <h4>步驟 ${index + 1}</h4>
                <button type="button" class="btn btn--ghost" data-remove="pages.home.launchFlow.steps.${index}">刪除</button>
              </div>
              <div class="form-grid form-grid--two">
                ${field(`pages.home.launchFlow.steps.${index}.index`, '編號', step.index || '')}
                ${field(`pages.home.launchFlow.steps.${index}.title`, '標題', step.title || '')}
                ${field(`pages.home.launchFlow.steps.${index}.description`, '說明', step.description || '', 'textarea')}
              </div>
            </div>
          `).join('')}
        </div>
        <div class="actions-row">
          <button type="button" class="btn btn--secondary" data-add-step="pages.home.launchFlow.steps">新增步驟</button>
        </div>
      </section>
    `;
  }

  function renderBlocks(path, title, blocks) {
    return `
      <section class="editor-section">
        <div class="editor-section__head">
          <h3>${escapeHtml(title)}</h3>
        </div>
        <div class="repeat-list">
          ${asList(blocks).map((block, index) => `
            <div class="repeat-item">
              <div class="repeat-item__head">
                <h4>Block ${index + 1}</h4>
                <button type="button" class="btn btn--ghost" data-remove="${escapeHtml(path)}.${index}">刪除</button>
              </div>
              <div class="form-grid form-grid--two">
                ${selectField(`${path}.${index}.type`, '類型', block.type || 'text', ['text', 'image', 'video'])}
                ${selectField(`${path}.${index}.textSize`, '文字大小', block.textSize || 'normal', ['small', 'normal', 'large', 'xlarge', 'xxlarge'])}
                ${selectField(`${path}.${index}.blockSize`, '區塊大小', block.blockSize || 'medium', ['small', 'medium', 'large', 'full'])}
                ${field(`${path}.${index}.heading`, '標題', block.heading || '')}
                ${field(`${path}.${index}.caption`, 'Caption', block.caption || '')}
                ${field(`${path}.${index}.body`, '內文', block.body || '', 'textarea')}
                ${field(`${path}.${index}.mediaUrl`, '媒體 URL', block.mediaUrl || '')}
                ${field(`${path}.${index}.mediaAlt`, '媒體 alt', block.mediaAlt || '')}
                ${field(`${path}.${index}.linkUrl`, '按鈕連結', block.linkUrl || '')}
                ${field(`${path}.${index}.buttonLabel`, '按鈕文字', block.buttonLabel || '')}
              </div>
              <div class="actions-row">
                <button type="button" class="btn btn--secondary" data-upload-image="${escapeHtml(path)}.${index}.mediaUrl">上傳圖片</button>
                <button type="button" class="btn btn--secondary" data-upload-video="${escapeHtml(path)}.${index}.mediaUrl">上傳影片</button>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="actions-row">
          <button type="button" class="btn btn--secondary" data-add-block="${escapeHtml(path)}">新增 block</button>
        </div>
      </section>
    `;
  }

  function renderAboutView() {
    const page = state.data.pages.about || {};
    return `
      <section class="editor-section">
        <div class="editor-section__head">
          <h2>關於我們</h2>
        </div>
        <div class="form-grid form-grid--two">
          ${field('pages.about.title', '標題', page.title || '')}
          ${field('pages.about.description', '說明', page.description || '', 'textarea')}
          ${field('pages.about.intro', 'Intro', page.intro || '', 'textarea')}
          ${field('pages.about.videoTitle', '影片標題', page.videoTitle || '')}
          ${field('pages.about.videoDescription', '影片說明', page.videoDescription || '', 'textarea')}
          ${field('pages.about.videoHint', '影片提示', page.videoHint || '')}
          ${field('pages.about.aboutVideoUrl', '影片 URL', page.aboutVideoUrl || '')}
          ${field('pages.about.aboutVideoPoster', '影片 Poster', page.aboutVideoPoster || '')}
        </div>
      </section>
      ${renderBlocks('pages.about.blocks', '關於我們 blocks', page.blocks || [])}
    `;
  }

  function renderRoleView(pageKey) {
    const page = state.data.pages[pageKey] || {};
    return `
      <section class="editor-section">
        <div class="editor-section__head">
          <h2>${escapeHtml(pageLabels[pageKey])}</h2>
        </div>
        <div class="form-grid form-grid--two">
          ${field(`pages.${pageKey}.hero.badge`, 'Badge', page.hero?.badge || '')}
          ${field(`pages.${pageKey}.hero.title`, '標題', page.hero?.title || '', 'textarea')}
          ${field(`pages.${pageKey}.hero.description`, '說明', page.hero?.description || '', 'textarea')}
          ${field(`pages.${pageKey}.hero.primaryLabel`, '主按鈕文案', page.hero?.primaryLabel || '')}
          ${field(`pages.${pageKey}.hero.primaryHref`, '主按鈕連結', page.hero?.primaryHref || '')}
          ${field(`pages.${pageKey}.hero.secondaryLabel`, '次按鈕文案', page.hero?.secondaryLabel || '')}
          ${field(`pages.${pageKey}.hero.secondaryHref`, '次按鈕連結', page.hero?.secondaryHref || '')}
          ${field(`pages.${pageKey}.hero.asideTitle`, '側欄標題', page.hero?.asideTitle || '')}
          ${field(`pages.${pageKey}.hero.heroImage.url`, '主視覺圖片', page.hero?.heroImage?.url || '')}
          ${field(`pages.${pageKey}.hero.heroImage.alt`, '主視覺 alt', page.hero?.heroImage?.alt || '')}
        </div>
      </section>
      ${renderRoleSections(page.sections || [], pageKey)}
      ${renderBlocks(`pages.${pageKey}.blocks`, `${pageLabels[pageKey]} blocks`, page.blocks || [])}
    `;
  }

  function renderRoleSections(sections, pageKey) {
    return `
      <section class="editor-section">
        <div class="editor-section__head">
          <h3>內容區塊</h3>
        </div>
        <div class="repeat-list">
          ${asList(sections).map((section, index) => `
            <div class="repeat-item">
              <div class="repeat-item__head">
                <h4>Section ${index + 1}</h4>
                <button type="button" class="btn btn--ghost" data-remove="pages.${pageKey}.sections.${index}">刪除</button>
              </div>
              <div class="form-grid form-grid--two">
                ${field(`pages.${pageKey}.sections.${index}.badge`, 'Badge', section.badge || '')}
                ${field(`pages.${pageKey}.sections.${index}.title`, '標題', section.title || '', 'textarea')}
                ${field(`pages.${pageKey}.sections.${index}.description`, '說明', section.description || '', 'textarea')}
              </div>
              <div class="repeat-list">
                ${asList(section.items).map((item, itemIndex) => `
                  <div class="repeat-item">
                    <div class="repeat-item__head">
                      <h5>項目 ${itemIndex + 1}</h5>
                      <button type="button" class="btn btn--ghost" data-remove="pages.${pageKey}.sections.${index}.items.${itemIndex}">刪除</button>
                    </div>
                    <div class="form-grid form-grid--two">
                      ${field(`pages.${pageKey}.sections.${index}.items.${itemIndex}.eyebrow`, 'Eyebrow', item.eyebrow || '')}
                      ${field(`pages.${pageKey}.sections.${index}.items.${itemIndex}.icon`, '圖示', item.icon || '')}
                      ${field(`pages.${pageKey}.sections.${index}.items.${itemIndex}.title`, '標題', item.title || '')}
                      ${field(`pages.${pageKey}.sections.${index}.items.${itemIndex}.description`, '說明', item.description || '', 'textarea')}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        <div class="actions-row">
          <button type="button" class="btn btn--secondary" data-add-section="pages.${pageKey}.sections">新增 Section</button>
        </div>
      </section>
    `;
  }

  function renderView() {
    const editor = byId('admin-editor');
    const nav = byId('admin-nav');
    if (!editor || !nav || !state.data) return;

    nav.innerHTML = Object.keys(pageLabels)
      .map((key) => navButtonHtml(key, state.view === key))
      .join('');

    if (state.view === 'site') {
      editor.innerHTML = renderSiteView();
    } else if (state.view === 'home') {
      editor.innerHTML = renderHomeView();
    } else if (state.view === 'about') {
      editor.innerHTML = renderAboutView();
    } else {
      editor.innerHTML = renderRoleView(state.view);
    }
  }

  function addItem(path) {
    const current = get(path);
    const list = Array.isArray(current) ? current : [];
    const template = createTemplate(path, list);
    list.push(template);
    set(path, list);
    renderView();
  }

  function createTemplate(path, list) {
    if (path.includes('downloadCards')) {
      return {
        key: `item-${list.length + 1}`,
        eyebrow: 'New Card',
        title: '新下載卡',
        description: '請填寫內容。',
        audience: '請填寫受眾',
        image: { url: '', alt: '' },
        iosUrl: '',
        androidUrl: '',
        highlights: [],
      };
    }
    if (path.includes('features')) {
      return {
        eyebrow: '新特色',
        title: '新卡片',
        description: '請填寫內容。',
        type: 'text',
        textSize: 'normal',
        blockSize: 'medium',
      };
    }
    if (path.includes('launchFlow.steps')) {
      return {
        index: String(list.length + 1).padStart(2, '0'),
        title: '新步驟',
        description: '請填寫內容。',
      };
    }
    if (path.includes('.sections')) {
      return {
        badge: 'New',
        title: '新區塊',
        description: '請填寫內容。',
        items: [],
      };
    }
    return {
      type: 'text',
      heading: '新 block',
      body: '請填寫內容。',
      caption: '',
      textSize: 'normal',
      blockSize: 'medium',
      mediaUrl: '',
      mediaAlt: '',
      linkUrl: '',
      buttonLabel: '',
    };
  }

  function removeItem(path) {
    const parts = path.split('.');
    const index = Number(parts.pop());
    const parentPath = parts.join('.');
    const list = get(parentPath);
    if (Array.isArray(list) && Number.isFinite(index)) {
      list.splice(index, 1);
      set(parentPath, list);
      renderView();
    }
  }

  function addNestedItem(path, kind, parentIndex) {
    const list = get(path);
    const items = Array.isArray(list) ? list : [];
    if (kind === 'header-nav') {
      items.push({ label: '新導覽', href: '/' });
    } else if (kind === 'footer-group') {
      items.push({ title: '新群組', links: [{ label: '新連結', href: '/' }] });
    } else if (kind === 'footer-link') {
      items.push({ label: '新連結', href: '/' });
    }
    set(path, items);
    renderView();
  }

  function updateFromTarget(target) {
    const path = target.dataset.path;
    if (!path) return;

    let value = target.value;
    if (target.tagName === 'TEXTAREA' && path.endsWith('.highlights')) {
      value = value
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
    }
    set(path, value);
    clearNotify();
  }

  async function uploadMedia(file, kind) {
    await ensurePassword();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload.php', {
      method: 'POST',
      headers: state.password ? { 'X-Admin-Password': state.password } : {},
      body: formData,
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload || !payload.ok) {
      throw new Error(payload?.message || `上傳失敗 (${response.status})`);
    }

    return payload.url;
  }

  function createUploadPicker(path, accept) {
    const picker = document.createElement('input');
    picker.type = 'file';
    picker.accept = accept;
    picker.style.display = 'none';
    document.body.appendChild(picker);
    picker.addEventListener('change', async () => {
      const file = picker.files?.[0];
      if (!file) {
        picker.remove();
        return;
      }

      try {
        const url = await uploadMedia(file, accept);
        set(path, url);
        notify('上傳完成。');
        renderView();
      } catch (error) {
        notify(error.message || '上傳失敗', 'error');
      } finally {
        picker.remove();
      }
    }, { once: true });
    picker.click();
  }

  async function saveSite() {
    await ensurePassword();
    const payload = await fetchJson('/api/save-site.php', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(state.data),
    });
    if (payload.warning) {
      notify(`儲存成功，但有警告：${payload.warning}`, 'warn');
    } else {
      notify(`儲存成功，備份檔：${payload.backup || '已建立'}`);
    }
  }

  async function backupSite() {
    await ensurePassword();
    const payload = await fetchJson('/api/backup-site.php', {
      method: 'POST',
      headers: headers(),
    });
    notify(`備份完成：${payload.backup}`);
  }

  function wireEvents() {
    const editor = byId('admin-editor');
    const nav = byId('admin-nav');

    nav.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-view]');
      if (!button) return;
      state.view = button.dataset.view;
      renderView();
    });

    editor.addEventListener('input', (event) => {
      const target = event.target.closest('[data-path]');
      if (!target) return;
      updateFromTarget(target);
    });

    editor.addEventListener('change', (event) => {
      const target = event.target.closest('[data-path]');
      if (!target) return;
      updateFromTarget(target);
    });

    editor.addEventListener('click', (event) => {
      const addButton = event.target.closest('[data-add-header-nav],[data-add-footer-group],[data-add-footer-link],[data-add-card],[data-add-block],[data-add-download-card],[data-add-step],[data-add-section]');
      const removeButton = event.target.closest('[data-remove]');
      const uploadButton = event.target.closest('[data-upload-image],[data-upload-video]');

      if (addButton) {
        if (addButton.dataset.addHeaderNav) {
          const list = get('site.header.navItems') || [];
          list.push({ label: '新導覽', href: '/' });
          set('site.header.navItems', list);
        } else if (addButton.dataset.addFooterGroup) {
          const list = get('site.footerLinkGroups') || [];
          list.push({ title: '新群組', links: [{ label: '新連結', href: '/' }] });
          set('site.footerLinkGroups', list);
        } else if (addButton.dataset.addFooterLink) {
          const index = Number(addButton.dataset.addFooterLink);
          const list = get(`site.footerLinkGroups.${index}.links`) || [];
          list.push({ label: '新連結', href: '/' });
          set(`site.footerLinkGroups.${index}.links`, list);
        } else if (addButton.dataset.addCard) {
          addItem(addButton.dataset.addCard);
          return;
        } else if (addButton.dataset.addBlock) {
          addItem(addButton.dataset.addBlock);
          return;
        } else if (addButton.dataset.addDownloadCard) {
          addItem(addButton.dataset.addDownloadCard);
          return;
        } else if (addButton.dataset.addStep) {
          addItem(addButton.dataset.addStep);
          return;
        } else if (addButton.dataset.addSection) {
          addItem(addButton.dataset.addSection);
          return;
        }
        renderView();
        return;
      }

      if (removeButton) {
        removeItem(removeButton.dataset.remove);
        return;
      }

      if (uploadButton) {
        const accept = uploadButton.dataset.uploadImage ? 'image/*' : 'video/*';
        createUploadPicker(uploadButton.dataset.uploadImage || uploadButton.dataset.uploadVideo, accept);
      }
    });

    byId('save-btn').addEventListener('click', async () => {
      try {
        await saveSite();
      } catch (error) {
        if (error.status === 401) {
          state.password = '';
          sessionStorage.removeItem(PASS_KEY);
          notify('管理密碼錯誤，請重新輸入。', 'error');
          return;
        }
        notify(error.message || '儲存失敗', 'error');
      }
    });

    byId('backup-btn').addEventListener('click', async () => {
      try {
        await backupSite();
      } catch (error) {
        if (error.status === 401) {
          state.password = '';
          sessionStorage.removeItem(PASS_KEY);
          notify('管理密碼錯誤，請重新輸入。', 'error');
          return;
        }
        notify(error.message || '備份失敗', 'error');
      }
    });

    byId('reload-btn').addEventListener('click', async () => {
      try {
        await loadSite();
        renderView();
        notify('已重新讀取資料。');
      } catch (error) {
        notify(error.message || '重新讀取失敗', 'error');
      }
    });
  }

  async function init() {
    try {
      await ensurePassword();
      await loadSite();
      renderView();
      wireEvents();
      notify('已載入內容。');
    } catch (error) {
      notify(error.message || '初始化失敗', 'error');
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
