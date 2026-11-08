(() => {
  const PROJECTS_KEY = 'sprout-studio-projects-v1';
  const DRAFT_KEY = 'sprout-studio-draft-v1';
  const spritesPool = ['🐱', '🐸', '🐦', '🚀', '🦊', '🐼', '🦋', '🏀'];
  const blockInfo = {
    event: { category: 'events', label: 'when ⚑ clicked', action: 'eventFlag', fields: [] },
    move: { category: 'motion', label: 'move', action: 'move', fields: [{ key: 'steps', value: 10, label: 'steps' }] },
    turn: { category: 'motion', label: 'turn ↻', action: 'turn', fields: [{ key: 'degrees', value: 15, label: 'degrees' }] },
    goto: { category: 'motion', label: 'go to x:', action: 'goto', fields: [{ key: 'x', value: 0, label: 'y:' }, { key: 'y', value: 0, label: '' }] },
    say: { category: 'looks', label: 'say', action: 'say', fields: [{ key: 'text', value: 'Hello!', label: 'for' }, { key: 'seconds', value: 2, label: 'secs' }] },
    size: { category: 'looks', label: 'change size by', action: 'changeSize', fields: [{ key: 'amount', value: 10, label: '%' }] },
    wait: { category: 'control', label: 'wait', action: 'wait', fields: [{ key: 'seconds', value: 1, label: 'secs' }] }
  };
  for (const definition of (window.SPROUT_BLOCKS || [])) {
    blockInfo[definition.type] = { ...definition, fields: definition.fields || [] };
  }
  const categoryNames = { motion: 'Motion', looks: 'Looks', sound: 'Sound', events: 'Events', control: 'Control', sensing: 'Sensing', operators: 'Operators', variables: 'Variables', pen: 'Pen' };
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const uid = () => globalThis.crypto?.randomUUID?.() || `p-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const newSprite = (emoji = '🐱', name = 'Cat') => ({ id: uid(), emoji, name, x: 0, y: 0, direction: 90, size: 100, visible: true, ghost: 0, brightness: 0, hue: 0, layer: 1, blocks: [{ type: 'event' }, { type: 'move', steps: 20 }] });
  const blankProject = () => ({ id: null, name: 'My project', backdrop: 'sky', customBackdrop: '', sprites: [newSprite()], variables: {}, visibleVariables: {}, pen: { down: false, color: '#26334b', size: 4 }, penStrokes: [], penStamps: [] });
  const templates = {
    flying: { name: 'Flying Friends', backdrop: 'sky', emoji: '🐦', spriteName: 'Bird', blocks: [{ type: 'event' }, { type: 'move', steps: 75 }, { type: 'turn', degrees: 30 }, { type: 'move', steps: 35 }] },
    space: { name: 'Star Hopper', backdrop: 'space', emoji: '🚀', spriteName: 'Rocket', blocks: [{ type: 'event' }, { type: 'move', steps: 85 }, { type: 'turn', degrees: 45 }, { type: 'move', steps: 55 }] },
    sunset: { name: 'Sunset Stories', backdrop: 'sunset', emoji: '🐱', spriteName: 'Cat', blocks: [{ type: 'event' }, { type: 'say', text: 'Hello, sunset!', seconds: 2 }, { type: 'move', steps: 35 }] },
    catch: { name: 'Catch It!', backdrop: 'ocean', emoji: '🏀', spriteName: 'Ball', blocks: [{ type: 'event' }, { type: 'move', steps: 55 }, { type: 'turn', degrees: 90 }, { type: 'move', steps: 55 }] },
    dance: { name: 'Dance Party', backdrop: 'sunset', emoji: '🕺', spriteName: 'Dancer', blocks: [{ type: 'event' }, { type: 'turn', degrees: 35 }, { type: 'size', amount: 15 }, { type: 'wait', seconds: 0.4 }, { type: 'turn', degrees: -70 }, { type: 'size', amount: -15 }] },
    maze: { name: 'Frog in a Maze', backdrop: 'ocean', emoji: '🐸', spriteName: 'Frog', blocks: [{ type: 'event' }, { type: 'move', steps: 45 }, { type: 'turn', degrees: -90 }, { type: 'move', steps: 45 }] }
  };
  const fromTemplate = key => {
    const template = templates[key];
    const sprite = newSprite(template.emoji, template.spriteName);
    sprite.blocks = template.blocks.map(block => ({ ...block }));
    return { id: null, name: template.name, backdrop: template.backdrop, sprites: [sprite] };
  };
  const readProjects = () => {
    try { const value = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]'); return Array.isArray(value) ? value.filter(project => project && Array.isArray(project.sprites)) : []; }
    catch { return []; }
  };
  const normalize = value => {
    const base = blankProject();
    if (!value || !Array.isArray(value.sprites) || !value.sprites.length) return base;
    return {
      id: value.id || null,
      name: String(value.name || 'My project').slice(0, 50),
      backdrop: ['sky', 'space', 'sunset', 'ocean', 'custom'].includes(value.backdrop) ? value.backdrop : 'sky',
      customBackdrop: /^#[0-9a-f]{3,8}$/i.test(String(value.customBackdrop || '')) ? String(value.customBackdrop) : '#b8e7ff',
      variables: value.variables && typeof value.variables === 'object' ? { ...value.variables } : {},
      visibleVariables: value.visibleVariables && typeof value.visibleVariables === 'object' ? { ...value.visibleVariables } : {},
      pen: value.pen && typeof value.pen === 'object' ? { down: Boolean(value.pen.down), color: String(value.pen.color || '#26334b'), size: Number(value.pen.size) || 4 } : { down: false, color: '#26334b', size: 4 },
      penStrokes: Array.isArray(value.penStrokes) ? value.penStrokes.filter(stroke => stroke && Number.isFinite(stroke.x1) && Number.isFinite(stroke.y1) && Number.isFinite(stroke.x2) && Number.isFinite(stroke.y2)).slice(-3000) : [],
      penStamps: Array.isArray(value.penStamps) ? value.penStamps.filter(stamp => stamp && Number.isFinite(stamp.x) && Number.isFinite(stamp.y)).slice(-200) : [],
      sprites: value.sprites.map((sprite, index) => ({
        id: sprite.id || uid(), emoji: String(sprite.emoji || spritesPool[index % spritesPool.length]),
        name: String(sprite.name || `Sprite ${index + 1}`).slice(0, 30),
        x: Number(sprite.x) || 0, y: Number(sprite.y) || 0,
        direction: Number.isFinite(Number(sprite.direction)) ? Number(sprite.direction) : 90, size: Number(sprite.size) || 100,
        visible: sprite.visible !== false, ghost: Number(sprite.ghost) || 0, brightness: Number(sprite.brightness) || 0, hue: Number(sprite.hue) || 0, layer: Number(sprite.layer) || index + 1, costumeIndex: Number(sprite.costumeIndex) || 0, clone: Boolean(sprite.clone),
        blocks: Array.isArray(sprite.blocks) ? sprite.blocks.filter(block => block && blockInfo[block.type]).map(block => ({ ...block })) : [{ type: 'event' }]
      }))
    };
  };
  const params = new URLSearchParams(location.search);
  const savedId = params.get('saved');
  let initial = null;
  if (savedId) initial = readProjects().find(item => item.id === savedId) || null;
  if (!initial && params.get('project') && templates[params.get('project')]) initial = fromTemplate(params.get('project'));
  if (!initial && !params.get('project')) {
    try { initial = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); } catch { initial = null; }
  }
  let project = normalize(initial);
  let selectedId = project.sprites[0].id;
  let activeCategory = 'motion';
  let runToken = 0;
  let running = false;
  let activeDelay = null;
  let resolveDelay = null;
  let toastTimer = null;
  let timerStarted = performance.now();
  let lastAnswer = '';
  const timerHatsFired = new Set();
  let mousePoint = { x: 0, y: 0, down: false, key: '' };
  let audioContext = null;
  let activeOscillators = [];

  const titleInput = document.getElementById('project-title');
  const palette = document.getElementById('palette');
  const workspace = document.getElementById('workspace');
  const stage = document.getElementById('stage');
  const penCanvas = document.getElementById('pen-layer');
  const penContext = penCanvas.getContext('2d');
  const spritesStage = document.getElementById('stage-sprites');
  const spriteList = document.getElementById('sprite-list');
  const savedSelect = document.getElementById('saved-select');
  const toastBox = document.getElementById('toast');
  const selectedSprite = () => project.sprites.find(sprite => sprite.id === selectedId) || project.sprites[0];

  function toast(message) {
    toastBox.textContent = message;
    toastBox.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastBox.classList.remove('show'), 1900);
  }
  function saveDraft() {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(project)); } catch { toast('Browser storage is full. Export this project to keep it.'); }
  }
  function updateProjectList() {
    const keep = savedSelect.value;
    savedSelect.innerHTML = '<option value="">Open saved…</option>';
    readProjects().sort((a, b) => String(a.name).localeCompare(String(b.name))).forEach(item => {
      const option = document.createElement('option'); option.value = item.id; option.textContent = item.name || 'Untitled project'; savedSelect.append(option);
    });
    if (keep && [...savedSelect.options].some(option => option.value === keep)) savedSelect.value = keep;
  }
  function syncTitleAndBackdrop() {
    titleInput.value = project.name;
    document.getElementById('backdrop-select').value = project.backdrop;
    stage.className = `stage-canvas backdrop-${project.backdrop}`;
    stage.style.background = project.backdrop === 'custom' ? project.customBackdrop : '';
    redrawPen();
    renderVariableMonitors();
  }
  function renderPalette() {
    document.getElementById('toolbox-title').textContent = categoryNames[activeCategory];
    document.querySelectorAll('.category').forEach(button => button.classList.toggle('active', button.dataset.cat === activeCategory));
    const types = Object.keys(blockInfo).filter(type => blockInfo[type].category === activeCategory);
    palette.innerHTML = '';
    types.forEach(type => {
      const info = blockInfo[type];
      const button = document.createElement('div');
      button.className = `palette-block ${info.category}`;
      button.draggable = true;
      button.dataset.type = type;
      button.textContent = `${type === 'event' ? '⚑ ' : ''}${info.label}${info.fields.length ? ` ${info.fields[0].value} ${info.fields[0].label}` : ''}`;
      button.addEventListener('click', () => addBlock(type));
      button.addEventListener('dragstart', event => { event.dataTransfer.setData('text/plain', type); event.dataTransfer.effectAllowed = 'copy'; });
      palette.append(button);
    });
  }
  function fieldMarkup(field, block) {
    const value = block[field.key] ?? field.value;
    const isText = field.kind === 'text' || field.key === 'text';
    const input = `<input aria-label="${escapeHtml(field.key)}" data-field="${escapeHtml(field.key)}" type="${isText ? 'text' : 'number'}" ${isText ? 'maxlength="50"' : 'step="any"'} value="${escapeHtml(value)}">`;
    return `${input}${field.label ? `<span>${escapeHtml(field.label)}</span>` : ''}`;
  }
  function renderWorkspace() {
    const sprite = selectedSprite();
    document.getElementById('selected-label').textContent = sprite.name;
    workspace.innerHTML = '';
    if (!sprite.blocks.length) {
      const empty = document.createElement('div'); empty.className = 'workspace-empty'; empty.textContent = 'Add a block from the palette to start your script.'; workspace.append(empty);
    }
    sprite.blocks.forEach((block, index) => {
      const info = blockInfo[block.type]; if (!info) return;
      const element = document.createElement('div');
      element.className = `script-block ${info.category} ${info.action?.startsWith('event') ? 'event' : ''}`;
      element.innerHTML = `<span>${escapeHtml(info.label)}</span>${info.fields.map(field => fieldMarkup(field, block)).join('')}<button class="remove-block" title="Remove block" aria-label="Remove block">×</button>`;
      element.querySelector('.remove-block').addEventListener('click', () => { sprite.blocks.splice(index, 1); changed(); });
      element.querySelectorAll('input').forEach(input => input.addEventListener('input', () => {
        const field = input.dataset.field;
        block[field] = input.type === 'number' ? Number(input.value) : input.value;
        saveDraft();
      }));
      workspace.append(element);
    });
  }
  function renderSprites() {
    spriteList.innerHTML = '';
    project.sprites.forEach(sprite => {
      const button = document.createElement('button');
      button.className = `sprite-thumb ${sprite.id === selectedId ? 'selected' : ''}`;
      button.innerHTML = `<span>${escapeHtml(sprite.emoji)}</span><b>${escapeHtml(sprite.name)}</b>`;
      button.addEventListener('click', () => { selectedId = sprite.id; renderAll(); });
      spriteList.append(button);
    });
    renderStageSprites();
  }
  function renderStageSprites() {
    spritesStage.innerHTML = '';
    [...project.sprites].sort((a, b) => a.layer - b.layer).forEach(sprite => {
      const node = document.createElement('div');
      node.className = 'stage-sprite';
      node.style.left = `calc(50% + ${sprite.x}px)`;
      node.style.top = `calc(50% + ${sprite.y}px)`;
      const rotation = sprite.rotationStyle === 'dont rotate' ? 0 : sprite.rotationStyle === 'left-right' ? (sprite.direction > 180 ? 180 : 0) : sprite.direction - 90;
      node.style.transform = `translate(-50%,-50%) rotate(${rotation}deg) scale(${sprite.size / 100})`;
      node.style.opacity = String(Math.max(0, 1 - sprite.ghost / 100));
      node.style.filter = `drop-shadow(0 4px 2px #0002) brightness(${Math.max(20, 100 + sprite.brightness)}%) hue-rotate(${sprite.hue}deg)`;
      node.style.zIndex = String(sprite.layer);
      node.style.display = sprite.visible ? '' : 'none';
      node.title = `${sprite.name} · click to select`;
      node.innerHTML = `${escapeHtml(sprite.emoji)}<span class="speech"></span>`;
      node.addEventListener('click', event => { event.stopPropagation(); selectedId = sprite.id; renderAll(); if (sprite.blocks.some(block => block.type === 'eventClick')) runScript('click'); });
      spritesStage.append(node);
    });
  }
  function renderVariableMonitors() {
    const monitor = document.getElementById('variable-monitors');
    if (!monitor) return;
    monitor.innerHTML = '';
    Object.entries(project.variables || {}).forEach(([name, value]) => {
      if (project.visibleVariables?.[name] === false) return;
      const line = document.createElement('div'); line.className = 'variable-monitor';
      line.textContent = `${name}: ${value}`; monitor.append(line);
    });
  }
  function redrawPen() {
    if (!penContext) return;
    penContext.clearRect(0, 0, penCanvas.width, penCanvas.height);
    for (const stroke of project.penStrokes || []) {
      penContext.beginPath(); penContext.moveTo(stroke.x1 + 240, stroke.y1 + 180); penContext.lineTo(stroke.x2 + 240, stroke.y2 + 180);
      penContext.strokeStyle = stroke.color; penContext.lineWidth = stroke.size; penContext.lineCap = 'round'; penContext.stroke();
    }
    for (const stamp of project.penStamps || []) {
      penContext.font = `${stamp.size}px sans-serif`; penContext.textAlign = 'center'; penContext.fillText(stamp.emoji, stamp.x + 240, stamp.y + 195);
    }
  }
  function drawSegment(sprite, x1, y1, x2, y2) {
    if (!project.pen.down) return;
    const stroke = { x1, y1, x2, y2, color: project.pen.color, size: project.pen.size };
    project.penStrokes.push(stroke);
    if (project.penStrokes.length > 3000) project.penStrokes.shift();
    redrawPen();
  }
  function renderAll() { syncTitleAndBackdrop(); renderWorkspace(); renderSprites(); }
  function changed() { renderAll(); saveDraft(); }
  function addBlock(type) {
    const info = blockInfo[type]; if (!info) return;
    const block = { type };
    info.fields.forEach(field => { block[field.key] = field.value; });
    selectedSprite().blocks.push(block);
    renderWorkspace(); saveDraft();
  }

  document.querySelectorAll('.category').forEach(button => button.addEventListener('click', () => { activeCategory = button.dataset.cat; renderPalette(); }));
  workspace.addEventListener('dragover', event => { event.preventDefault(); workspace.classList.add('drag-over'); });
  workspace.addEventListener('dragleave', event => { if (!workspace.contains(event.relatedTarget)) workspace.classList.remove('drag-over'); });
  workspace.addEventListener('drop', event => { event.preventDefault(); workspace.classList.remove('drag-over'); addBlock(event.dataTransfer.getData('text/plain')); });
  titleInput.addEventListener('input', () => { project.name = titleInput.value.slice(0, 50); saveDraft(); });
  document.getElementById('backdrop-select').addEventListener('change', event => { project.backdrop = event.target.value; changed(); runScript('backdrop', event.target.value); });

  document.getElementById('add-sprite').addEventListener('click', () => {
    const emoji = spritesPool[project.sprites.length % spritesPool.length];
    const names = { '🐱': 'Cat', '🐸': 'Frog', '🐦': 'Bird', '🚀': 'Rocket', '🦊': 'Fox', '🐼': 'Panda', '🦋': 'Butterfly', '🏀': 'Ball' };
    const sprite = newSprite(emoji, names[emoji]);
    sprite.blocks = [{ type: 'event' }];
    project.sprites.push(sprite); selectedId = sprite.id; changed();
  });
  document.getElementById('delete-sprite').addEventListener('click', () => {
    if (project.sprites.length < 2) { toast('A project needs at least one sprite.'); return; }
    project.sprites = project.sprites.filter(sprite => sprite.id !== selectedId); selectedId = project.sprites[0].id; changed();
  });

  function delay(ms, token) {
    return new Promise(resolve => {
      resolveDelay = resolve;
      activeDelay = setTimeout(() => { activeDelay = null; resolveDelay = null; resolve(token === runToken); }, ms);
    });
  }
  function showSpeech(sprite, message, thought = false) {
    const node = [...spritesStage.children].find(child => child.title.startsWith(sprite.name));
    const bubble = node?.querySelector('.speech');
    if (bubble) { bubble.textContent = message; bubble.classList.toggle('thought', thought); bubble.classList.add('show'); }
  }
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const backdropNames = ['sky', 'space', 'sunset', 'ocean'];
  let audioVolume = .35;
  let pitchShift = 0;
  let soundMuted = false;
  function setVariable(name, value) {
    const key = String(name || 'value').trim() || 'value';
    project.variables[key] = value;
    if (project.visibleVariables[key] === undefined) project.visibleVariables[key] = true;
    renderVariableMonitors();
    saveDraft();
  }
  function moveSprite(sprite, steps) {
    const oldX = sprite.x, oldY = sprite.y;
    const angle = Number(sprite.direction ?? 90) * Math.PI / 180;
    sprite.x = clamp(sprite.x + Math.sin(angle) * steps, -210, 210);
    sprite.y = clamp(sprite.y - Math.cos(angle) * steps, -145, 145);
    drawSegment(sprite, oldX, oldY, sprite.x, sprite.y);
    renderStageSprites();
  }
  function moveTo(sprite, x, y) {
    const oldX = sprite.x, oldY = sprite.y;
    sprite.x = clamp(Number(x) || 0, -210, 210); sprite.y = clamp(Number(y) || 0, -145, 145);
    drawSegment(sprite, oldX, oldY, sprite.x, sprite.y); renderStageSprites();
  }
  function setBackdrop(name) {
    const backdrop = String(name || '').toLowerCase();
    if (backdropNames.includes(backdrop)) { project.backdrop = backdrop; }
    else if (/^#[0-9a-f]{3,8}$/i.test(backdrop)) { project.backdrop = 'custom'; project.customBackdrop = backdrop; }
    renderAll(); saveDraft();
  }
  function sayAndWait(sprite, message, seconds, thought, token) {
    showSpeech(sprite, message, thought);
    return delay(clamp(Number(seconds) || 0, .1, 10) * 1000, token).then(continued => {
      const node = [...spritesStage.children].find(child => child.title.startsWith(sprite.name));
      node?.querySelector('.speech')?.classList.remove('show', 'thought');
      return continued;
    });
  }
  function playTone(frequency, seconds, token) {
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') audioContext.resume();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'sine'; oscillator.frequency.value = clamp(frequency * (2 ** (pitchShift / 12)), 40, 1800);
      gain.gain.value = soundMuted ? 0 : audioVolume;
      oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.start(); activeOscillators.push(oscillator);
      return delay(clamp(seconds, .05, 10) * 1000, token).then(continued => {
        try { oscillator.stop(); } catch {} activeOscillators = activeOscillators.filter(item => item !== oscillator); return continued;
      });
    } catch { return delay(clamp(seconds, .05, 10) * 1000, token); }
  }
  async function executeBlock(block, sprite, token) {
    const info = blockInfo[block.type];
    const action = info?.action || block.type;
    const num = key => Number(block[key]) || 0;
    const text = key => String(block[key] ?? '');
    const random = (min, max) => Math.random() * (max - min) + min;
    const hitEdge = Math.abs(sprite.x) >= 205 || Math.abs(sprite.y) >= 140;
    if (action.startsWith('event')) return true;
    switch (action) {
      case 'move': moveSprite(sprite, num('steps')); break;
      case 'turn': sprite.direction += num('degrees'); renderStageSprites(); break;
      case 'goto': moveTo(sprite, num('x'), num('y')); break;
      case 'setX': moveTo(sprite, num('x'), sprite.y); break;
      case 'setY': moveTo(sprite, sprite.x, num('y')); break;
      case 'changeX': moveTo(sprite, sprite.x + num('amount'), sprite.y); break;
      case 'changeY': moveTo(sprite, sprite.x, sprite.y + num('amount')); break;
      case 'goToMouse': moveTo(sprite, mousePoint.x, mousePoint.y); break;
      case 'goToRandom': moveTo(sprite, random(-200, 200), random(-135, 135)); break;
      case 'pointDirection': sprite.direction = num('degrees'); renderStageSprites(); break;
      case 'pointMouse': sprite.direction = Math.atan2(mousePoint.x - sprite.x, -(mousePoint.y - sprite.y)) * 180 / Math.PI; renderStageSprites(); break;
      case 'glide': {
        const startX = sprite.x, startY = sprite.y, endX = clamp(num('x'), -210, 210), endY = clamp(num('y'), -145, 145);
        const steps = Math.max(1, Math.round(clamp(num('seconds'), .05, 5) * 20));
        for (let index = 1; index <= steps; index++) {
          if (token !== runToken) return false;
          const priorX = sprite.x, priorY = sprite.y;
          sprite.x = startX + (endX - startX) * index / steps; sprite.y = startY + (endY - startY) * index / steps;
          drawSegment(sprite, priorX, priorY, sprite.x, sprite.y); renderStageSprites();
          if (!await delay(clamp(num('seconds'), .05, 5) * 1000 / steps, token)) return false;
        }
        break;
      }
      case 'bounceEdge': case 'edgeMove':
        if (hitEdge) { sprite.direction = 180 - sprite.direction; if (action === 'edgeMove') moveSprite(sprite, num('steps')); renderStageSprites(); }
        break;
      case 'rotationStyle': {
        const style = text('style').toLowerCase();
        sprite.rotationStyle = style.includes('left') ? 'left-right' : style.includes('dont') || style.includes("don't") ? 'dont rotate' : 'all around';
        renderStageSprites(); break;
      }
      case 'resetPosition': moveTo(sprite, 0, 0); break;
      case 'say': return sayAndWait(sprite, text('text'), block.seconds, false, token);
      case 'think': return sayAndWait(sprite, text('text'), 2, true, token);
      case 'thinkFor': return sayAndWait(sprite, text('text'), block.seconds, true, token);
      case 'changeSize': sprite.size = clamp(sprite.size + num('amount'), 20, 300); renderStageSprites(); break;
      case 'setSize': sprite.size = clamp(num('size'), 20, 300); renderStageSprites(); break;
      case 'showSprite': sprite.visible = true; renderStageSprites(); break;
      case 'hideSprite': sprite.visible = false; renderStageSprites(); break;
      case 'toggleVisibility': sprite.visible = !sprite.visible; renderStageSprites(); break;
      case 'nextCostume': sprite.costumeIndex = (sprite.costumeIndex + 1) % spritesPool.length; sprite.emoji = spritesPool[sprite.costumeIndex]; renderStageSprites(); break;
      case 'setCostume': sprite.emoji = text('costume') || '🐱'; renderStageSprites(); break;
      case 'nextBackdrop': setBackdrop(backdropNames[(backdropNames.indexOf(project.backdrop) + 1 + backdropNames.length) % backdropNames.length]); break;
      case 'setBackdrop': setBackdrop(text('backdrop')); break;
      case 'setGhost': sprite.ghost = clamp(num('amount'), 0, 100); renderStageSprites(); break;
      case 'changeGhost': sprite.ghost = clamp(sprite.ghost + num('amount'), 0, 100); renderStageSprites(); break;
      case 'clearEffects': sprite.ghost = 0; sprite.brightness = 0; sprite.hue = 0; renderStageSprites(); break;
      case 'frontLayer': sprite.layer = Math.max(...project.sprites.map(item => item.layer), 0) + 1; renderStageSprites(); break;
      case 'backLayer': sprite.layer = Math.min(...project.sprites.map(item => item.layer), 1) - 1; renderStageSprites(); break;
      case 'setBrightness': sprite.brightness = clamp(num('amount'), -80, 100); renderStageSprites(); break;
      case 'changeBrightness': sprite.brightness = clamp(sprite.brightness + num('amount'), -80, 100); renderStageSprites(); break;
      case 'setColor': sprite.hue = (Math.abs(text('color').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)) * 37) % 360; renderStageSprites(); break;
      case 'wait': return delay(clamp(num('seconds'), 0, 10) * 1000, token);
      case 'playBeep': return playTone(660, num('seconds') || .25, token);
      case 'playNote': return playTone(440 * 2 ** ((num('note') - 69) / 12), num('seconds') || .3, token);
      case 'playTone': return playTone(num('frequency') || 440, num('seconds') || .4, token);
      case 'stopSound': activeOscillators.forEach(oscillator => { try { oscillator.stop(); } catch {} }); activeOscillators = []; break;
      case 'setVolume': audioVolume = clamp(num('amount') / 100, 0, 1); break;
      case 'changeVolume': audioVolume = clamp(audioVolume + num('amount') / 100, 0, 1); break;
      case 'setPitch': pitchShift = num('amount'); break;
      case 'changePitch': pitchShift += num('amount'); break;
      case 'muteSound': soundMuted = true; break;
      case 'unmuteSound': soundMuted = false; break;
      case 'broadcast': case 'broadcastWait': {
        const message = text('message'); setVariable('lastMessage', message);
        const receivers = project.sprites.filter(other => other.id !== sprite.id && eventMatches(other, 'broadcast', message));
        const runReceiver = async receiver => { for (const receiverBlock of receiver.blocks) { if (token !== runToken) break; if (!blockInfo[receiverBlock.type]?.action?.startsWith('event')) if (!await executeBlock(receiverBlock, receiver, token)) break; } };
        if (action === 'broadcastWait') { for (const receiver of receivers) await runReceiver(receiver); }
        else receivers.forEach(receiver => { void runReceiver(receiver); });
        break;
      }
      case 'repeatMove':
        for (let i = 0; i < clamp(Math.floor(num('times')), 0, 50); i++) { if (token !== runToken) return false; moveSprite(sprite, num('steps')); if (!await delay(80, token)) return false; }
        break;
      case 'stopScript': stopScript(); return false;
      case 'stopAll': stopScript(); return false;
      case 'createClone':
        if (project.sprites.length < 12) { const clone = { ...sprite, id: uid(), name: `${sprite.name} clone`, x: clamp(sprite.x + 24, -210, 210), y: clamp(sprite.y + 18, -145, 145), clone: true, blocks: sprite.blocks.map(item => ({ ...item })) }; project.sprites.push(clone); renderAll(); }
        break;
      case 'deleteClone':
        if (sprite.clone && project.sprites.length > 1) { project.sprites = project.sprites.filter(item => item.id !== sprite.id); selectedId = project.sprites[0].id; renderAll(); }
        break;
      case 'resetTimer': timerStarted = performance.now(); timerHatsFired.clear(); break;
      case 'waitTimer': {
        const until = Math.max(0, num('seconds')) * 1000;
        while (performance.now() - timerStarted < until) { if (!await delay(100, token)) return false; }
        break;
      }
      case 'randomWait': return delay(random(0, clamp(num('seconds'), 0, 10)) * 1000, token);
      case 'resetSprite': sprite.x = 0; sprite.y = 0; sprite.size = 100; sprite.direction = 90; sprite.visible = true; renderStageSprites(); break;
      case 'randomDirection': sprite.direction = random(0, 360); renderStageSprites(); break;
      case 'storeMouseX': setVariable(text('variable'), Math.round(mousePoint.x)); break;
      case 'storeMouseY': setVariable(text('variable'), Math.round(mousePoint.y)); break;
      case 'storeDistance': setVariable(text('variable'), Math.round(Math.hypot(mousePoint.x - sprite.x, mousePoint.y - sprite.y))); break;
      case 'storeX': setVariable(text('variable'), Math.round(sprite.x)); break;
      case 'storeY': setVariable(text('variable'), Math.round(sprite.y)); break;
      case 'mouseDownToVar': setVariable(text('variable'), mousePoint.down); break;
      case 'keyPressedToVar': setVariable(text('variable'), mousePoint.key || ''); break;
      case 'timerToVar': setVariable(text('variable'), Math.round((performance.now() - timerStarted) / 1000 * 10) / 10); break;
      case 'edgeToVar': setVariable(text('variable'), hitEdge); break;
      case 'askQuestion': lastAnswer = window.prompt(text('question') || 'Your answer?') || ''; break;
      case 'answerToVar': setVariable(text('variable'), lastAnswer); break;
      case 'distanceToVar': { const other = project.sprites.find(item => item.name.toLowerCase() === text('sprite').toLowerCase()); setVariable(text('variable'), other ? Math.round(Math.hypot(other.x - sprite.x, other.y - sprite.y)) : 0); break; }
      case 'operator': {
        const a = Number(block.a) || 0, b = Number(block.b) || 0;
        const op = ({ opAdd: a + b, opSubtract: a - b, opMultiply: a * b, opDivide: b ? a / b : 0, opModulo: b ? a % b : 0 })[block.type];
        setVariable(text('variable'), Number.isFinite(op) ? op : 0); break;
      }
      case 'opRandom': setVariable(text('variable'), Math.floor(random(num('minimum'), num('maximum') + 1))); break;
      case 'opRound': setVariable(text('variable'), Math.round(num('value'))); break;
      case 'opAbs': setVariable(text('variable'), Math.abs(num('value'))); break;
      case 'opSqrt': setVariable(text('variable'), Math.sqrt(Math.max(0, num('value')))); break;
      case 'opSin': setVariable(text('variable'), Math.round(Math.sin(num('degrees') * Math.PI / 180) * 1000) / 1000); break;
      case 'opCos': setVariable(text('variable'), Math.round(Math.cos(num('degrees') * Math.PI / 180) * 1000) / 1000); break;
      case 'opJoin': setVariable(text('variable'), `${text('a')}${text('b')}`); break;
      case 'opLength': setVariable(text('variable'), text('value').length); break;
      case 'opContains': setVariable(text('variable'), text('text').toLowerCase().includes(text('search').toLowerCase())); break;
      case 'setVariable': setVariable(text('variable'), block.value ?? 0); break;
      case 'changeVariable': setVariable(text('variable'), (Number(project.variables[text('variable')]) || 0) + num('amount')); break;
      case 'showVariable': project.visibleVariables[text('variable')] = true; renderVariableMonitors(); break;
      case 'hideVariable': project.visibleVariables[text('variable')] = false; renderVariableMonitors(); break;
      case 'penDown': project.pen.down = true; break;
      case 'penUp': project.pen.down = false; break;
      case 'penClear': project.penStrokes = []; project.penStamps = []; redrawPen(); break;
      case 'penSize': project.pen.size = clamp(num('size'), 1, 30); break;
      case 'changePenSize': project.pen.size = clamp(project.pen.size + num('amount'), 1, 30); break;
      case 'penColor': project.pen.color = /^#[0-9a-f]{3,8}$/i.test(text('color')) ? text('color') : '#26334b'; break;
      case 'changePenColor': project.pen.color = `hsl(${(Date.now() / 1000 * num('amount')) % 360}, 85%, 48%)`; break;
      case 'stamp': project.penStamps.push({ x: sprite.x, y: sprite.y, emoji: sprite.emoji, size: clamp(sprite.size * .42, 12, 100) }); redrawPen(); break;
      case 'fillBackdrop': project.customBackdrop = /^#[0-9a-f]{3,8}$/i.test(text('color')) ? text('color') : '#b8e7ff'; project.backdrop = 'custom'; renderAll(); break;
      case 'eraseDrawing': project.penStrokes = []; project.penStamps = []; project.pen.down = false; redrawPen(); break;
    }
    return true;
  }
  function eventMatches(sprite, trigger, value) {
    return sprite.blocks.some(block => {
      const action = blockInfo[block.type]?.action;
      if (trigger === 'flag') return action === 'eventFlag';
      if (trigger === 'key') return action === 'eventKey' && String(block.key).toLowerCase() === String(value).toLowerCase();
      if (trigger === 'click') return action === 'eventClick';
      if (trigger === 'backdrop') return action === 'eventBackdrop' && String(block.backdrop).toLowerCase() === String(value).toLowerCase();
      if (trigger === 'broadcast') return action === 'eventBroadcast' && String(block.message) === String(value);
      if (trigger === 'timer') return action === 'eventTimer' && (performance.now() - timerStarted) / 1000 >= Number(block.seconds || 0);
      return false;
    });
  }
  async function runScript(trigger = 'flag', triggerValue = '', targetSprite = null) {
    if (running) return;
    const sprite = targetSprite || selectedSprite();
    if (!eventMatches(sprite, trigger, triggerValue)) { if (trigger === 'flag') toast('Add a matching event block first.'); return; }
    running = true; const token = ++runToken;
    document.getElementById('run-state').textContent = 'Running…';
    const blocks = sprite.blocks.map(block => ({ ...block }));
    for (const block of blocks) {
      if (token !== runToken) break;
      const action = blockInfo[block.type]?.action;
      if (!action || action.startsWith('event')) continue;
      if (!await executeBlock(block, sprite, token)) break;
      if (token === runToken && !await delay(100, token)) break;
    }
    if (token === runToken) {
      running = false;
      document.getElementById('run-state').textContent = 'Done';
      saveDraft();
    }
  }
  function stopScript() {
    runToken += 1; running = false;
    if (activeDelay) { clearTimeout(activeDelay); activeDelay = null; resolveDelay?.(false); resolveDelay = null; }
    document.querySelectorAll('.speech').forEach(node => node.classList.remove('show', 'thought'));
    activeOscillators.forEach(oscillator => { try { oscillator.stop(); } catch {} }); activeOscillators = [];
    document.getElementById('run-state').textContent = 'Stopped';
  }
  document.getElementById('run-button').addEventListener('click', runScript);
  document.getElementById('stop-button').addEventListener('click', stopScript);

  document.getElementById('save-button').addEventListener('click', () => {
    project.name = titleInput.value.trim() || 'Untitled project';
    if (!project.id) project.id = uid();
    const projects = readProjects().filter(item => item.id !== project.id);
    projects.push(JSON.parse(JSON.stringify(project)));
    try { localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects)); saveDraft(); updateProjectList(); savedSelect.value = project.id; toast('Project saved in this browser.'); }
    catch { toast('Could not save. Try exporting the project instead.'); }
  });
  savedSelect.addEventListener('change', () => {
    const found = readProjects().find(item => item.id === savedSelect.value);
    if (found) { project = normalize(found); selectedId = project.sprites[0].id; saveDraft(); renderAll(); toast('Project opened.'); }
  });
  document.getElementById('new-button').addEventListener('click', () => {
    stopScript(); project = blankProject(); selectedId = project.sprites[0].id; savedSelect.value = ''; changed(); toast('New project ready.');
  });
  document.getElementById('export-button').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a');
    link.href = url; link.download = `${(project.name || 'sprout-project').replace(/[^a-z0-9-_]+/gi, '-').toLowerCase()}.json`; link.click(); URL.revokeObjectURL(url); toast('Project exported as JSON.');
  });
  document.getElementById('import-button').addEventListener('click', () => document.getElementById('import-file').click());
  document.getElementById('import-file').addEventListener('change', async event => {
    const file = event.target.files?.[0]; if (!file) return;
    try { project = normalize(JSON.parse(await file.text())); project.id = null; selectedId = project.sprites[0].id; changed(); toast('Project imported. Save it to keep it here.'); }
    catch { toast('That file is not a valid Sprout project.'); }
    event.target.value = '';
  });
  document.addEventListener('keydown', event => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;
    const keyName = event.code === 'Space' ? 'space' : event.key.startsWith('Arrow') ? event.key.slice(5).toLowerCase() : event.key.toLowerCase();
    mousePoint.key = keyName;
    const hasKeyHat = eventMatches(selectedSprite(), 'key', keyName);
    if (hasKeyHat) runScript('key', keyName);
    if (event.code === 'Space') { event.preventDefault(); if (!hasKeyHat) { if (running) stopScript(); else runScript('flag'); } }
    if (event.key === 'ArrowRight') { selectedSprite().x = Math.min(210, selectedSprite().x + 10); renderStageSprites(); saveDraft(); }
    if (event.key === 'ArrowLeft') { selectedSprite().x = Math.max(-210, selectedSprite().x - 10); renderStageSprites(); saveDraft(); }
    if (event.key === 'ArrowUp') { selectedSprite().y = Math.max(-145, selectedSprite().y - 10); renderStageSprites(); saveDraft(); }
    if (event.key === 'ArrowDown') { selectedSprite().y = Math.min(145, selectedSprite().y + 10); renderStageSprites(); saveDraft(); }
  });

  stage.addEventListener('mousemove', event => {
    const rect = stage.getBoundingClientRect();
    mousePoint.x = clamp((event.clientX - rect.left) / rect.width * 480 - 240, -240, 240);
    mousePoint.y = clamp((event.clientY - rect.top) / rect.height * 360 - 180, -180, 180);
  });
  stage.addEventListener('mousedown', () => { mousePoint.down = true; });
  window.addEventListener('mouseup', () => { mousePoint.down = false; });
  setInterval(() => {
    if (running) return;
    project.sprites.forEach(sprite => sprite.blocks.forEach((block, index) => {
      if (block.type !== 'eventTimer') return;
      const key = `${sprite.id}:${index}`;
      if (!timerHatsFired.has(key) && eventMatches(sprite, 'timer')) { timerHatsFired.add(key); void runScript('timer', '', sprite); }
    }));
  }, 250);

  renderPalette(); renderAll(); updateProjectList();
  if (savedId && project.id) savedSelect.value = project.id;
})();

