const DATA_URL = './data/current_backlog_2026-07-03.json';
const ENCRYPTED_DATA_URL = './data/current_backlog_2026-07-03-v3.enc.json';
const STORAGE_KEY = 'alexander-ops-cloud-skeleton-v0-12-daily-control-2026-07-03-v3';

const statusOptions = [
  'new',
  'draft_ready',
  'ready_to_insert',
  'sent',
  'needs_context',
  'needs_decision',
  'needs_rebrief',
  'needs_launch_plan',
  'needs_artifact',
  'needs_source_pack_from_vika',
  'needs_comparison_pack',
  'accepted_needs_source_pack',
  'needs_demo_scope',
  'needs_examples',
  'needs_feedback_template',
  'needs_topic',
  'waiting_alexander',
  'waiting_owner',
  'waiting_metrics',
  'waiting_brief',
  'waiting_katya_files',
  'waiting_artem_answer',
  'vika_review_in_work',
  'needs_action_log',
  'needs_api_decision',
  'needs_client_materials',
  'needs_comments_pack',
  'needs_conversion_ideas',
  'needs_handoff_table',
  'needs_human_ai_policy',
  'needs_kpi_draft',
  'needs_loyalty_map',
  'needs_product_update',
  'needs_prototype_review',
  'needs_reactivation_launch',
  'needs_sales_answer',
  'needs_security_scheme',
  'needs_status_check',
  'needs_tracker_test',
  'needs_triage',
  'waiting_external',
  'needs_client_brief',
  'paused_needs_terms',
  'confirmed_need',
  'needs_template',
  'parked_waiting_masha',
  'needs_owner_rule',
  'needs_masha_alignment',
  'needs_slot_and_name',
  'needs_scope_review',
  'in_progress',
  'in_work',
  'done',
  'parked'
];

const statusLabels = {
  new: 'Новая',
  draft_ready: 'Черновик готов',
  ready_to_insert: 'Можно вставлять',
  sent: 'Отправлено',
  needs_context: 'Нужен контекст',
  needs_decision: 'Нужно решение',
  needs_rebrief: 'Нужно нормальное ТЗ',
  needs_launch_plan: 'Нужен план запуска',
  needs_artifact: 'Нужен артефакт',
  needs_source_pack_from_vika: 'Нужен source pack от Вики',
  needs_comparison_pack: 'Нужен пакет для сравнения',
  accepted_needs_source_pack: 'Принято, нужен source pack',
  needs_demo_scope: 'Нужно демо и рамка пилота',
  needs_examples: 'Нужны примеры',
  needs_feedback_template: 'Нужен шаблон ОС',
  needs_topic: 'Нужна тема',
  waiting_alexander: 'Ждет Сашу',
  waiting_owner: 'Ждет владельца',
  waiting_metrics: 'Ждет метрики',
  waiting_brief: 'Ждет бриф',
  waiting_katya_files: 'Ждет файлы Кати',
  waiting_artem_answer: 'Ждет ответ Артема',
  vika_review_in_work: 'У Вики на review',
  needs_action_log: 'Нужен action log',
  needs_api_decision: 'Нужен ответ по API',
  needs_client_materials: 'Нужны материалы клиента',
  needs_comments_pack: 'Нужен пакет комментариев',
  needs_conversion_ideas: 'Нужны гипотезы конверсии',
  needs_handoff_table: 'Нужна передача дел',
  needs_human_ai_policy: 'Нужны правила ИИ/людей',
  needs_kpi_draft: 'Нужен черновик KPI',
  needs_loyalty_map: 'Нужна карта связки',
  needs_product_update: 'Нужен sales update',
  needs_prototype_review: 'Нужен review прототипа',
  needs_reactivation_launch: 'Нужен план реактивации',
  needs_sales_answer: 'Нужен ответ продаж',
  needs_security_scheme: 'Нужна схема защиты',
  needs_status_check: 'Нужен статус',
  needs_tracker_test: 'Нужен тест Трекера',
  needs_triage: 'Нужен разбор',
  waiting_external: 'Ждет внешнего ответа',
  needs_client_brief: 'Нужен клиентский бриф',
  paused_needs_terms: 'Пауза, нужны условия',
  confirmed_need: 'Потребность подтверждена',
  needs_template: 'Нужен шаблон',
  parked_waiting_masha: 'Парк, ждет Машу',
  needs_owner_rule: 'Нужно правило владельца',
  needs_masha_alignment: 'Нужно согласование с Машей',
  needs_slot_and_name: 'Нужны слот и название',
  needs_scope_review: 'Нужен scope review',
  in_progress: 'В работе',
  in_work: 'В работе',
  done: 'Готово',
  parked: 'Парк / позже'
};

const laneOrder = [
  'to_send',
  'today_alexander',
  'return_to_requester',
  'waiting_owner',
  'in_work_without_alexander',
  'meeting_to_actions',
  'parked',
  'done'
];

const laneStatusDefaults = {
  to_send: 'draft_ready',
  today_alexander: 'waiting_alexander',
  return_to_requester: 'needs_context',
  waiting_owner: 'waiting_owner',
  in_work_without_alexander: 'in_work',
  meeting_to_actions: 'needs_action_log',
  parked: 'parked',
  done: 'done'
};

let seedData = null;
let draggedCardId = null;
let state = {
  role: 'alexander',
  search: '',
  owner: 'all',
  lane: 'all',
  priority: 'all',
  showDone: false,
  selectedCardId: null,
  cards: []
};

const els = {};

document.addEventListener('DOMContentLoaded', async () => {
  cacheEls();
  bindEvents();
  try {
    seedData = await loadData();
    state.cards = restoreCards(seedData.cards);
    hydrateFilters();
    render();
  } catch (error) {
    renderLoadError(error);
  }
});

function cacheEls() {
  els.metricRow = document.querySelector('#metricRow');
  els.focusList = document.querySelector('#focusList');
  els.ownerMap = document.querySelector('#ownerMap');
  els.lanes = document.querySelector('#lanes');
  els.sourceList = document.querySelector('#sourceList');
  els.searchInput = document.querySelector('#searchInput');
  els.ownerFilter = document.querySelector('#ownerFilter');
  els.laneFilter = document.querySelector('#laneFilter');
  els.priorityFilter = document.querySelector('#priorityFilter');
  els.doneToggle = document.querySelector('#doneToggle');
  els.boardStatus = document.querySelector('#boardStatus');
  els.operatorPanel = document.querySelector('#operatorPanel');
  els.cardTemplate = document.querySelector('#cardTemplate');
  els.exportButton = document.querySelector('#exportButton');
  els.resetButton = document.querySelector('#resetButton');
}

function bindEvents() {
  document.querySelectorAll('.role-button').forEach((button) => {
    button.addEventListener('click', () => {
      state.role = button.dataset.role;
      document.querySelectorAll('.role-button').forEach((item) => {
        item.classList.toggle('is-active', item === button);
      });
      render();
    });
  });

  els.searchInput.addEventListener('input', (event) => {
    state.search = event.target.value.trim().toLowerCase();
    render();
  });

  els.ownerFilter.addEventListener('change', (event) => {
    state.owner = event.target.value;
    render();
  });

  els.laneFilter.addEventListener('change', (event) => {
    state.lane = event.target.value;
    render();
  });

  els.priorityFilter.addEventListener('change', (event) => {
    state.priority = event.target.value;
    render();
  });

  els.doneToggle.addEventListener('change', (event) => {
    state.showDone = event.target.checked;
    render();
  });

  els.exportButton.addEventListener('click', exportState);
  els.resetButton.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    state.cards = cloneData(seedData.cards);
    hydrateFilters();
    render();
  });
}

async function loadData() {
  const encrypted = await fetchEncryptedData();
  if (encrypted) {
    return requestUnlock(encrypted);
  }

  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error(`Cannot load ${DATA_URL}`);
  }
  return response.json();
}

async function fetchEncryptedData() {
  try {
    const response = await fetch(ENCRYPTED_DATA_URL, { cache: 'no-store' });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

function requestUnlock(envelope) {
  document.body.classList.add('is-locked');

  return new Promise((resolve, reject) => {
    const overlay = ensureUnlockScreen(envelope);
    const form = overlay.querySelector('[data-unlock-form]');
    const input = overlay.querySelector('[data-unlock-input]');
    const status = overlay.querySelector('[data-unlock-status]');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const passphrase = input.value.trim();
      if (!passphrase) return;

      status.textContent = 'Проверяю ключ...';
      form.querySelector('button').disabled = true;

      try {
        const data = await decryptDataEnvelope(envelope, passphrase);
        overlay.hidden = true;
        document.body.classList.remove('is-locked');
        resolve(data);
      } catch {
        status.textContent = 'Ключ не подошел. Проверь пароль и попробуй еще раз.';
        form.querySelector('button').disabled = false;
        input.select();
      }
    }, { once: false });

    input.focus();

    window.addEventListener('unhandledrejection', (event) => {
      reject(event.reason);
    }, { once: true });
  });
}

function ensureUnlockScreen(envelope) {
  let overlay = document.querySelector('#unlockScreen');
  if (overlay) {
    overlay.hidden = false;
    return overlay;
  }

  overlay = document.createElement('section');
  overlay.id = 'unlockScreen';
  overlay.className = 'unlock-screen';
  overlay.innerHTML = `
    <div class="unlock-card">
      <img src="./assets/logo-farmznanie-blue.svg" alt="ФармЗнание">
      <p class="unlock-kicker">Alexander Ops · protected mode</p>
      <h1>Рабочий пульт закрыт</h1>
      <p>Введите ключ доступа. Данные пульта хранятся в зашифрованном виде и открываются только в этом браузере.</p>
      <form data-unlock-form>
        <label>
          <span>Ключ доступа</span>
          <input data-unlock-input type="password" autocomplete="current-password" placeholder="Ввести ключ">
        </label>
        <button type="submit">Открыть пульт</button>
      </form>
      <p class="unlock-status" data-unlock-status>${escapeHtml(envelope.hint || 'Ключ хранится отдельно от сайта.')}</p>
    </div>
  `;
  document.body.append(overlay);
  return overlay;
}

async function decryptDataEnvelope(envelope, passphrase) {
  if (!window.crypto?.subtle) {
    throw new Error('WebCrypto is unavailable in this browser.');
  }

  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: base64ToBytes(envelope.salt),
      iterations: envelope.kdf?.iterations || 250000,
      hash: envelope.kdf?.hash || 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  const plainBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToBytes(envelope.iv) },
    key,
    base64ToBytes(envelope.ciphertext)
  );

  return JSON.parse(new TextDecoder().decode(plainBuffer));
}

function base64ToBytes(value) {
  const binary = window.atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function renderLoadError(error) {
  document.body.classList.add('is-locked');
  const overlay = document.createElement('section');
  overlay.className = 'unlock-screen';
  overlay.innerHTML = `
    <div class="unlock-card">
      <img src="./assets/logo-farmznanie-blue.svg" alt="ФармЗнание">
      <p class="unlock-kicker">Alexander Ops</p>
      <h1>Пульт не загрузился</h1>
      <p>Не удалось получить данные. Обнови страницу или проверь деплой.</p>
      <p class="unlock-status">${escapeHtml(error.message || error)}</p>
    </div>
  `;
  document.body.append(overlay);
}

function restoreCards(seedCards) {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return cloneData(seedCards);
  }

  try {
    const parsed = JSON.parse(saved);
    const savedById = new Map(parsed.cards.map((card) => [card.id, card]));
    return seedCards.map((card) => ({ ...card, ...(savedById.get(card.id) || {}) }));
  } catch {
    return cloneData(seedCards);
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    updated_at: new Date().toISOString(),
    cards: state.cards
  }, null, 2));
}

function hydrateFilters() {
  fillSelect(els.ownerFilter, [
    ['all', 'Все владельцы'],
    ...unique(state.cards.map((card) => card.owner)).map((owner) => [owner, owner])
  ]);

  fillSelect(els.laneFilter, [
    ['all', 'Все очереди'],
    ...seedData.lanes.map((lane) => [lane.id, lane.label])
  ]);

  fillSelect(els.priorityFilter, [
    ['all', 'Все приоритеты'],
    ['P0', 'P0'],
    ['P1', 'P1'],
    ['P2', 'P2'],
    ['P3', 'P3']
  ]);
}

function fillSelect(select, rows) {
  select.innerHTML = '';
  rows.forEach(([value, label]) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    select.append(option);
  });
}

function render() {
  const visibleCards = getVisibleCards();
  renderMetrics(visibleCards);
  renderFocus(visibleCards);
  renderOwnerMap(visibleCards);
  renderOperator(visibleCards);
  renderLanes(visibleCards);
  renderSources();
}

function getVisibleCards() {
  return state.cards.filter((card) => {
    if (state.role === 'manager' && card.visibility === 'private') return false;
    if (!state.showDone && state.lane !== 'done' && isDoneCard(card)) return false;
    if (state.owner !== 'all' && card.owner !== state.owner) return false;
    if (state.lane !== 'all' && card.lane !== state.lane) return false;
    if (state.priority !== 'all' && card.priority !== state.priority) return false;
    if (!state.search) return true;
    const haystack = [
      card.id,
      card.title,
      card.owner,
      card.requester,
      card.area,
      card.workstream,
      card.next_action,
      card.evidence
    ].join(' ').toLowerCase();
    return haystack.includes(state.search);
  });
}

function renderMetrics(cards) {
  const roleCards = getRoleCards();
  const metrics = [
    ['Активных', cards.filter((card) => !isDoneCard(card)).length],
    ['P0', cards.filter((card) => card.priority === 'P0').length],
    ['К отправке', cards.filter((card) => card.lane === 'to_send').length],
    ['На Саше', cards.filter((card) => card.lane === 'today_alexander').length],
    ['Вернуть', cards.filter((card) => card.lane === 'return_to_requester').length],
    ['Готово', roleCards.filter(isDoneCard).length]
  ];

  els.metricRow.innerHTML = metrics.map(([label, value]) => `
    <div class="metric">
      <strong>${value}</strong>
      <span>${escapeHtml(label)}</span>
    </div>
  `).join('');
}

function renderFocus(cards) {
  const focus = cards
    .filter((card) => !isDoneCard(card))
    .filter((card) => card.priority === 'P0' || card.lane === 'today_alexander')
    .slice(0, 8);

  els.focusList.innerHTML = focus.map((card) => `
    <div class="focus-item">
      <strong>${escapeHtml(card.title)}</strong>
      <span>${escapeHtml(card.next_action)}</span>
    </div>
  `).join('');
}

function renderOwnerMap(cards) {
  const counts = new Map();
  cards.forEach((card) => {
    counts.set(card.owner, (counts.get(card.owner) || 0) + 1);
  });

  const rows = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);

  els.ownerMap.innerHTML = rows.map(([owner, count]) => `
    <div class="owner-item">
      <div>
        <strong>${escapeHtml(owner)}</strong>
        <span>${ownerHint(owner, cards)}</span>
      </div>
      <div class="owner-count">${count}</div>
    </div>
  `).join('');
}

function ownerHint(owner, cards) {
  const owned = cards.filter((card) => card.owner === owner);
  const p0 = owned.filter((card) => card.priority === 'P0').length;
  const waiting = owned.filter((card) => card.lane === 'waiting_owner').length;
  if (p0) return `${p0} P0 · ${waiting} ждут владельца`;
  return `${waiting} ждут владельца`;
}

function renderOperator(cards) {
  if (!els.operatorPanel) return;

  const selected = cards.find((card) => card.id === state.selectedCardId) || cards[0];
  state.selectedCardId = selected?.id || null;

  if (!selected) {
    els.operatorPanel.innerHTML = `
      <div class="operator-empty">
        <strong>Нет карточек в текущем фильтре</strong>
        <span>Сними фильтр или включи готовые.</span>
      </div>
    `;
    return;
  }

  const quickActions = getQuickActions(selected);
  els.operatorPanel.innerHTML = `
    <div class="operator-head">
      <div>
        <p class="operator-kicker">Карточка в работе · ${escapeHtml(selected.id)}</p>
        <h2>${escapeHtml(selected.title)}</h2>
      </div>
      <div class="operator-badges">
        <span class="priority-pill" data-priority="${escapeHtml(selected.priority)}">${escapeHtml(selected.priority)}</span>
        <span class="lane-chip">${escapeHtml(laneLabel(selected.lane))}</span>
        <span class="status-chip">${escapeHtml(statusLabel(selected.status || 'new'))}</span>
      </div>
    </div>
    <p class="operator-next">${escapeHtml(selected.next_action)}</p>
    <div class="operator-meta">
      <div><span>Владелец</span><strong>${escapeHtml(selected.owner)}</strong></div>
      <div><span>Роль Саши</span><strong>${escapeHtml(selected.alexander_role || 'не указана')}</strong></div>
    </div>
    <div class="operator-controls">
      <label>
        <span>Очередь</span>
        <select class="operator-lane-select" aria-label="Очередь выбранной карточки">
          ${getLaneOrder().map((laneId) => `<option value="${escapeHtml(laneId)}"${laneId === selected.lane ? ' selected' : ''}>${escapeHtml(laneLabel(laneId))}</option>`).join('')}
        </select>
      </label>
      <label>
        <span>Статус</span>
        <select class="operator-status-select" aria-label="Статус выбранной карточки">
          ${getStatusOptions().map((status) => `<option value="${escapeHtml(status)}"${status === selected.status ? ' selected' : ''}>${escapeHtml(statusLabel(status))}</option>`).join('')}
        </select>
      </label>
    </div>
    <div class="operator-actions">
      ${quickActions.map((action, index) => `<button class="operator-action operator-action--${escapeHtml(action.tone || 'neutral')}" data-action-index="${index}" type="button">${escapeHtml(action.label)}</button>`).join('')}
      ${selected.reply_draft ? '<button class="operator-action operator-action--copy" data-copy-draft type="button">Скопировать ответ</button>' : ''}
      <button class="operator-action" data-show-detail type="button">Источник</button>
    </div>
    <p class="operator-evidence" hidden>${escapeHtml(selected.evidence || selected.source || '')}</p>
  `;

  els.operatorPanel.querySelector('.operator-lane-select')?.addEventListener('change', (event) => {
    moveCardToLane(selected.id, event.target.value);
  });

  els.operatorPanel.querySelector('.operator-status-select')?.addEventListener('change', (event) => {
    updateCard(selected.id, { status: event.target.value }, { announce: true });
  });

  els.operatorPanel.querySelectorAll('[data-action-index]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = quickActions[Number(button.dataset.actionIndex)];
      if (action?.lane) moveCardToLane(selected.id, action.lane);
      if (action?.status) updateCard(selected.id, { status: action.status }, { announce: true });
    });
  });

  els.operatorPanel.querySelector('[data-copy-draft]')?.addEventListener('click', async (event) => {
    await copyText(selected.reply_draft);
    event.currentTarget.textContent = 'Скопировано';
    window.setTimeout(() => {
      event.currentTarget.textContent = 'Скопировать ответ';
    }, 1400);
  });

  els.operatorPanel.querySelector('[data-show-detail]')?.addEventListener('click', () => {
    const evidence = els.operatorPanel.querySelector('.operator-evidence');
    evidence.hidden = !evidence.hidden;
  });
}

function renderLanes(cards) {
  const laneMeta = new Map(seedData.lanes.map((lane) => [lane.id, lane]));
  els.lanes.innerHTML = '';

  getLaneOrder().forEach((laneId) => {
    const laneCards = cards.filter((card) => card.lane === laneId);
    const shouldShowEmptyLane = state.lane === 'all' && laneId !== 'done';
    if (!laneCards.length && state.lane !== laneId && !shouldShowEmptyLane) return;

    const lane = document.createElement('section');
    lane.className = `lane lane--${laneId}`;
    lane.dataset.laneId = laneId;
    lane.innerHTML = `
      <div class="lane-title">
        <div>
          <h2>${escapeHtml(laneMeta.get(laneId)?.label || laneId)}</h2>
          <p>${escapeHtml(laneMeta.get(laneId)?.intent || '')}</p>
        </div>
        <span>${laneCards.length}</span>
      </div>
      <div class="lane-stack"></div>
    `;

    const stack = lane.querySelector('.lane-stack');
    stack.dataset.laneId = laneId;
    stack.addEventListener('dragenter', handleLaneDragEnter);
    stack.addEventListener('dragover', handleLaneDragOver);
    stack.addEventListener('dragleave', handleLaneDragLeave);
    stack.addEventListener('drop', handleLaneDrop);

    laneCards
      .sort(sortCards)
      .forEach((card) => stack.append(renderCard(card)));

    if (!laneCards.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-lane';
      empty.textContent = 'Пусто';
      stack.append(empty);
    }

    els.lanes.append(lane);
  });
}

function renderCard(card) {
  const node = els.cardTemplate.content.firstElementChild.cloneNode(true);
  node.dataset.cardId = card.id;
  node.dataset.lane = card.lane;
  node.dataset.priority = card.priority;
  node.draggable = true;
  node.tabIndex = 0;
  node.setAttribute('aria-selected', String(card.id === state.selectedCardId));
  node.querySelector('.task-id').textContent = card.id;
  node.querySelector('.priority-pill').textContent = card.priority;
  node.querySelector('.priority-pill').dataset.priority = card.priority;
  node.querySelector('.lane-chip').textContent = laneLabel(card.lane);
  node.querySelector('.status-chip').textContent = statusLabel(card.status || 'new');
  node.querySelector('h3').textContent = card.title;
  node.querySelector('.next-action').textContent = card.next_action;
  node.querySelector('.owner').textContent = card.owner;
  node.querySelector('.alex-role').textContent = card.alexander_role;
  node.querySelector('.evidence').textContent = card.evidence || card.source || '';
  node.classList.toggle('is-done', isDoneCard(card));
  node.classList.toggle('is-selected', card.id === state.selectedCardId);
  node.addEventListener('click', (event) => {
    if (isInteractiveTarget(event.target)) return;
    selectCard(card.id);
  });
  node.addEventListener('keydown', (event) => {
    if (isInteractiveTarget(event.target)) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    selectCard(card.id);
  });
  node.addEventListener('dragstart', handleCardDragStart);
  node.addEventListener('dragend', handleCardDragEnd);

  const statusSelect = node.querySelector('.status-select');
  getStatusOptions().forEach((status) => {
    const option = document.createElement('option');
    option.value = status;
    option.textContent = statusLabel(status);
    statusSelect.append(option);
  });
  statusSelect.value = card.status || 'new';
  statusSelect.addEventListener('change', (event) => {
    state.selectedCardId = card.id;
    updateCard(card.id, { status: event.target.value }, { announce: true });
  });

  node.querySelector('.small-button').addEventListener('click', (event) => {
    event.stopPropagation();
    selectCard(card.id);
  });

  const quickActions = node.querySelector('.quick-actions');
  getQuickActions(card).forEach((action) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `quick-button quick-button--${action.tone || 'neutral'}`;
    button.textContent = action.label;
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      state.selectedCardId = card.id;
      if (action.lane) moveCardToLane(card.id, action.lane);
      if (action.status) updateCard(card.id, { status: action.status }, { announce: true });
    });
    quickActions.append(button);
  });

  const draftPanel = node.querySelector('.draft-panel');
  if (card.reply_draft) {
    draftPanel.hidden = false;
    draftPanel.querySelector('.draft-text').textContent = card.reply_draft;
    draftPanel.querySelector('.copy-button').addEventListener('click', async (event) => {
      event.stopPropagation();
      state.selectedCardId = card.id;
      await copyText(card.reply_draft);
      event.currentTarget.textContent = 'Скопировано';
      window.setTimeout(() => {
        event.currentTarget.textContent = 'Скопировать ответ';
      }, 1400);
    });
  }

  return node;
}

function selectCard(id) {
  state.selectedCardId = id;
  render();
  window.requestAnimationFrame(() => {
    els.operatorPanel?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

function renderSources() {
  const sources = seedData.coverage.included_sources;
  els.sourceList.innerHTML = sources.map((source) => `
    <div class="source-item">
      <strong>${escapeHtml(source.split(':')[0])}</strong>
      <span>${escapeHtml(source)}</span>
    </div>
  `).join('');
}

function getQuickActions(card) {
  const actions = [];

  if (card.lane !== 'today_alexander' && !isDoneCard(card)) {
    actions.push({ label: 'Сегодня', lane: 'today_alexander', tone: 'primary' });
  }

  if (card.lane !== 'return_to_requester' && !isDoneCard(card)) {
    actions.push({ label: 'Вернуть', lane: 'return_to_requester' });
  }

  if (card.lane !== 'waiting_owner' && !isDoneCard(card)) {
    actions.push({ label: 'Ждет', lane: 'waiting_owner' });
  }

  if (card.lane === 'to_send') {
    actions.push({ label: 'Отправлено', status: 'sent', tone: 'done' });
  } else if (!isDoneCard(card)) {
    actions.push({ label: 'Готово', status: 'done', tone: 'done' });
  }

  if (isDoneCard(card)) {
    actions.push({ label: 'Вернуть в работу', lane: card.previous_lane || 'today_alexander', tone: 'primary' });
  }

  return actions.slice(0, 4);
}

function handleCardDragStart(event) {
  draggedCardId = event.currentTarget.dataset.cardId;
  event.currentTarget.classList.add('is-dragging');
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', draggedCardId);
}

function handleCardDragEnd(event) {
  event.currentTarget.classList.remove('is-dragging');
  document.querySelectorAll('.lane-stack.is-drop-target').forEach((lane) => {
    lane.classList.remove('is-drop-target');
  });
  draggedCardId = null;
}

function handleLaneDragEnter(event) {
  if (!draggedCardId) return;
  event.preventDefault();
  event.currentTarget.classList.add('is-drop-target');
}

function handleLaneDragOver(event) {
  if (!draggedCardId) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  event.currentTarget.classList.add('is-drop-target');
}

function handleLaneDragLeave(event) {
  if (event.currentTarget.contains(event.relatedTarget)) return;
  event.currentTarget.classList.remove('is-drop-target');
}

function handleLaneDrop(event) {
  event.preventDefault();
  const targetLane = event.currentTarget.dataset.laneId;
  const cardId = event.dataTransfer.getData('text/plain') || draggedCardId;
  event.currentTarget.classList.remove('is-drop-target');
  if (!cardId || !targetLane) return;
  moveCardToLane(cardId, targetLane);
}

function moveCardToLane(id, laneId) {
  const card = state.cards.find((item) => item.id === id);
  if (!card || card.lane === laneId) return;

  const patch = { lane: laneId };
  if (laneId === 'done') {
    patch.status = card.lane === 'to_send' ? 'sent' : 'done';
  } else if (isDoneCard(card)) {
    patch.status = laneStatusDefaults[laneId] || card.previous_status || 'new';
  } else if (laneStatusDefaults[laneId]) {
    patch.status = laneStatusDefaults[laneId];
  }

  updateCard(id, patch, { announce: true });
}

function updateCard(id, patch, options = {}) {
  let changedCard = null;
  state.cards = state.cards.map((card) => {
    if (card.id !== id) return card;
    const next = { ...card, ...patch };

    if (patch.status && isDoneStatus(patch.status)) {
      next.previous_lane = card.lane === 'done' ? card.previous_lane : card.lane;
      next.previous_status = card.status;
      next.lane = 'done';
      next.completed_at = next.completed_at || new Date().toISOString();
    } else if (patch.status && card.lane === 'done' && !isDoneStatus(patch.status)) {
      next.lane = card.previous_lane || 'today_alexander';
      delete next.completed_at;
    } else if (patch.status === 'parked') {
      next.lane = 'parked';
    }

    if (patch.lane === 'done') {
      next.previous_lane = card.lane === 'done' ? card.previous_lane : card.lane;
      next.previous_status = card.status;
      next.status = card.lane === 'to_send' ? 'sent' : 'done';
      next.completed_at = next.completed_at || new Date().toISOString();
    } else if (patch.lane && card.lane === 'done' && patch.lane !== 'done') {
      delete next.completed_at;
    }

    changedCard = next;
    return next;
  });
  persist();
  render();
  if (options.announce && changedCard) {
    announceChange(changedCard);
  }
}

function exportState() {
  const blob = new Blob([JSON.stringify({
    version: seedData.version,
    exported_at: new Date().toISOString(),
    cards: state.cards
  }, null, 2)], { type: 'application/json' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'alexander_ops_backlog_export.json';
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function sortCards(a, b) {
  const priorityScore = { P0: 0, P1: 1, P2: 2, P3: 3 };
  return (priorityScore[a.priority] ?? 9) - (priorityScore[b.priority] ?? 9)
    || a.title.localeCompare(b.title, 'ru');
}

function getStatusOptions() {
  const seen = new Set();
  return [
    ...statusOptions,
    ...state.cards.map((card) => card.status)
  ].filter((status) => {
    if (!status || seen.has(status)) return false;
    seen.add(status);
    return true;
  });
}

function getLaneOrder() {
  const dataLaneIds = seedData.lanes.map((lane) => lane.id);
  return [
    ...laneOrder,
    ...dataLaneIds.filter((id) => !laneOrder.includes(id))
  ].filter((id, index, arr) => arr.indexOf(id) === index);
}

function getRoleCards() {
  return state.cards.filter((card) => !(state.role === 'manager' && card.visibility === 'private'));
}

function isDoneStatus(status) {
  return status === 'done' || status === 'sent';
}

function isDoneCard(card) {
  return card.lane === 'done' || isDoneStatus(card.status);
}

function laneLabel(laneId) {
  return seedData?.lanes?.find((lane) => lane.id === laneId)?.label || laneId || 'Без очереди';
}

function statusLabel(status) {
  return statusLabels[status] || String(status || 'new').replaceAll('_', ' ');
}

function announceChange(card) {
  if (!els.boardStatus) return;
  const message = `${card.id}: ${laneLabel(card.lane)} · ${statusLabel(card.status)}`;
  els.boardStatus.textContent = message;
  els.boardStatus.classList.remove('is-flash');
  void els.boardStatus.offsetWidth;
  els.boardStatus.classList.add('is-flash');
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const area = document.createElement('textarea');
  area.value = text;
  area.style.position = 'fixed';
  area.style.left = '-9999px';
  document.body.append(area);
  area.select();
  document.execCommand('copy');
  area.remove();
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ru'));
}

function isInteractiveTarget(target) {
  return Boolean(target.closest('button, select, input, textarea, a'));
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
