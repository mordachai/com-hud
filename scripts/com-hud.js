let currentHudInstances = {}; // Keep track of all open HUD instances

// Define themebook names for Mythos and Logos themes
const mythosThemes = ["Adaptation", "Advanced Art", "Bastion", "Conjuration", "Divination", "Enclave", "Esoterica", "Expression", "Familiar", "Mobility", "Relic", "Shrouding"].map(theme => theme.toLowerCase().replace(/\s+/g, ''));
const logosThemes = ["Defining Event", "Defining Relationship", "Destiny", "Mission", "Personality", "Possessions", "Routine", "Struggle", "Subversion", "Training", "Tradition", "Turf", "Unit"].map(theme => theme.toLowerCase().replace(/\s+/g, ''));

// Define themebook localization keys for Mythos and Logos themes
const mythosThemesKeys = [
  "CityOfMist.themebook.adaption.name",
  "CityOfMist.themebook.advancedart.name",
  "CityOfMist.themebook.bastion.name",
  "CityOfMist.themebook.conjuration.name",
  "CityOfMist.themebook.divination.name",
  "CityOfMist.themebook.enclave.name",
  "CityOfMist.themebook.esoterica.name",
  "CityOfMist.themebook.expression.name",
  "CityOfMist.themebook.familiar.name",
  "CityOfMist.themebook.mobility.name",
  "CityOfMist.themebook.relic.name",
  "CityOfMist.themebook.shrouding.name"
];

const logosThemesKeys = [
  "CityOfMist.themebook.definingevent.name",
  "CityOfMist.themebook.definingrelationship.name",
  "CityOfMist.themebook.destiny.name",
  "CityOfMist.themebook.mission.name",
  "CityOfMist.themebook.personality.name",
  "CityOfMist.themebook.possessions.name",
  "CityOfMist.themebook.routine.name",
  "CityOfMist.themebook.struggle.name",
  "CityOfMist.themebook.subversion.name",
  "CityOfMist.themebook.training.name",
  "CityOfMist.themebook.tradition.name",
  "CityOfMist.themebook.turf.name",
  "CityOfMist.themebook.unit.name"
];

// Function to localize the theme names
function getLocalizedThemes(themeKeys) {
  return themeKeys.map(key => game.i18n.localize(key));
}

Hooks.once('init', () => {
  console.log('City of Mist: Char HUD | Initializing module');

  // Register debug mode setting
  game.settings.register("com-hud", "debug", {
    name: "Debug Mode",
    hint: "Enable debug mode for logging.",
    scope: "world", // or "client" depending on your needs
    config: true,
    type: Boolean,
    default: false
  });
});

// Define these variables in a higher scope (global or outside any hooks)
let localizedMythosThemes = [];
let localizedLogosThemes = [];

// Helper functions to manage HUD and Statuses state using user flags
async function getHUDState(actorId) {
  const user = game.user;
  const hudStates = (await user.getFlag("com-hud", "hudStates")) || {};
  let state = hudStates[actorId];

  // Debugging log
  console.log(`Getting HUD state for Actor ID: ${actorId}`, state);

  // Handle migration from string to object if necessary
  if (typeof state === 'string') {
    console.warn(`Migrating HUD state for Actor ID: ${actorId} from string to object.`);
    state = { state: state, pinned: false };
    hudStates[actorId] = state;
    await user.setFlag("com-hud", "hudStates", hudStates);
  }

  // Ensure state is an object
  if (typeof state !== 'object' || state === null) {
    console.warn(`Invalid HUD state for Actor ID: ${actorId}. Resetting to default.`);
    state = { state: "expanded", pinned: false };
    hudStates[actorId] = state;
    await user.setFlag("com-hud", "hudStates", hudStates);
  }

  return state;
}

async function setHUDState(actorId, hudState) {
  const user = game.user;
  const hudStates = (await user.getFlag("com-hud", "hudStates")) || {};
  hudStates[actorId] = hudState;

  // Debugging log
  console.log(`Setting HUD state for Actor ID: ${actorId}`, hudState);

  await user.setFlag("com-hud", "hudStates", hudStates);
}

async function getStatusState(actorId) {
  const user = game.user;
  const statusStates = (await user.getFlag("com-hud", "statusStates")) || {};
  return statusStates[actorId] || "expanded";
}

async function setStatusState(actorId, state) {
  const user = game.user;
  const statusStates = (await user.getFlag("com-hud", "statusStates")) || {};
  statusStates[actorId] = state;
  await user.setFlag("com-hud", "statusStates", statusStates);
}

// Helper functions to manage HUD position using user flags
async function getHUDPosition(actorId) {
  const user = game.user;
  const positions = (await user.getFlag("com-hud", "positions")) || {};
  return positions[actorId] || { top: '20px', left: '20px' }; // Default position
}

async function setHUDPosition(actorId, position) {
  const user = game.user;
  const positions = (await user.getFlag("com-hud", "positions")) || {};
  positions[actorId] = position;
  await user.setFlag("com-hud", "positions", positions);
}

Hooks.once('ready', async () => {
  // Localize the themes after the game is fully initialized
  localizedMythosThemes = getLocalizedThemes(mythosThemesKeys);
  localizedLogosThemes = getLocalizedThemes(logosThemesKeys);

  if (game.settings.get("com-hud", "debug")) {
    console.log("Localized Mythos Themes:", localizedMythosThemes);
    console.log("Localized Logos Themes:", localizedLogosThemes);
  }

  // Initial render for the controlled token (if any)
  await updateHUDForSelectedToken();
});

// Handle actor updates
Hooks.on('updateActor', async (updatedActor, updateData) => {
  if (currentHudInstances[updatedActor.id]) {
    await updateExistingHUD(updatedActor);
  }
});

// Handle token control changes
Hooks.on('controlToken', async (token, controlled) => {
  if (controlled) {
    await updateHUDForSelectedToken();
  }
});

// Function to update HUD for the selected token
async function updateHUDForSelectedToken() {
  const controlled = canvas.tokens.controlled[0];
  if (!controlled) return;

  const actor = controlled.actor;
  if (!actor) return;

  const hudState = await getHUDState(actor.id);

  if (!hudState.pinned) {
    // Close all unpinned HUDs
    for (let actorId in currentHudInstances) {
      const hudInstance = currentHudInstances[actorId];
      const state = await getHUDState(actorId);
      if (!state.pinned) {
        hudInstance.remove();
        delete currentHudInstances[actorId];
      }
    }
  }

  if (currentHudInstances[actor.id]) {
    await updateExistingHUD(actor);
  } else {
    await renderHUD(actor);
  }
}

// Function to update the existing HUD while preserving state
async function updateExistingHUD(actor) {
  const hudContainer = currentHudInstances[actor.id];
  if (!hudContainer) return;

  const contentWrapper = hudContainer.querySelector('.com-hud-content-wrapper');
  if (!contentWrapper) return;

  contentWrapper.innerHTML = ''; // Clear existing content

  // Re-add Themes (filter out 'Loadout')
  actor.items
    .filter(i => i.type === "theme" && i.name.toLowerCase() !== "__loadout__")
    .forEach(theme => {
      const isMythos = mythosThemes.includes(theme.system.themebook_name.toLowerCase().replace(/\s+/g, ''));
      const isLogos = logosThemes.includes(theme.system.themebook_name.toLowerCase().replace(/\s+/g, ''));
      const themeElement = createThemeElement(actor, theme, isMythos, isLogos);
      contentWrapper.appendChild(themeElement);
    });

  // Re-add Status Section
  const statusSection = document.createElement('div');
  statusSection.className = 'com-hud-status-section';
  statusSection.innerHTML = `
    <div class="com-hud-status-header">Statuses <i class="fas fa-chevron-down com-hud-status-toggle"></i></div>
    <div class="com-hud-status-list"></div>
  `;

  const statusList = statusSection.querySelector('.com-hud-status-list');
  const statusToggle = statusSection.querySelector('.com-hud-status-toggle');

  // Add status items (filter by type: "status")
  actor.items.filter(i => i.type === "status").forEach(status => {
    const statusElement = createStatusElement(actor, status);
    statusList.appendChild(statusElement);
  });

  contentWrapper.appendChild(statusSection);

  // Fetch and apply the saved HUD state
  const hudState = await getHUDState(actor.id);
  const toggleIcon = hudContainer.querySelector('.com-hud-toggle');
  const pinIcon = hudContainer.querySelector('.com-hud-pin');

  if (hudState.state === "collapsed") {
    hudContainer.classList.add('com-hud-minimized');
    toggleIcon.classList.remove('fa-chevron-up');
    toggleIcon.classList.add('fa-chevron-down');
  } else {
    hudContainer.classList.remove('com-hud-minimized');
    toggleIcon.classList.remove('fa-chevron-down');
    toggleIcon.classList.add('fa-chevron-up');
  }

  if (hudState.pinned) {
    hudContainer.classList.add('com-hud-pinned');
    pinIcon.classList.add('active');
  } else {
    hudContainer.classList.remove('com-hud-pinned');
    pinIcon.classList.remove('active');
  }

  // Fetch and apply the saved Statuses state
  const savedStatusState = await getStatusState(actor.id);
  if (savedStatusState === "collapsed") {
    statusList.classList.add('hidden');
    statusToggle.classList.remove('fa-chevron-down');
    statusToggle.classList.add('fa-chevron-up');
  } else {
    statusList.classList.remove('hidden');
    statusToggle.classList.remove('fa-chevron-up');
    statusToggle.classList.add('fa-chevron-down');
  }

  // Update the character name
  const characterNameElement = hudContainer.querySelector('.com-hud-character-name');
  if (characterNameElement) {
    characterNameElement.textContent = actor.name;
  }

  // Re-attach event listeners for toggles to preserve state
  toggleIcon.onclick = async (e) => {
    e.stopPropagation();
    const isMinimized = hudContainer.classList.toggle('com-hud-minimized');
    toggleIcon.classList.toggle('fa-chevron-up');
    toggleIcon.classList.toggle('fa-chevron-down');
    hudState.state = isMinimized ? "collapsed" : "expanded";
    await setHUDState(actor.id, hudState);
    adjustContainerHeight(hudContainer);
  };

  statusToggle.onclick = async (e) => {
    e.stopPropagation();
    const isHidden = statusList.classList.toggle('hidden');
    statusToggle.classList.toggle('fa-chevron-down');
    statusToggle.classList.toggle('fa-chevron-up');
    await setStatusState(actor.id, isHidden ? "collapsed" : "expanded");
  };

  // Re-attach event listener to pinIcon
  pinIcon.onclick = async (e) => {
    e.stopPropagation();
    hudState.pinned = !hudState.pinned;
    if (hudState.pinned) {
      hudContainer.classList.add('com-hud-pinned');
      pinIcon.classList.add('active');
      console.log(`HUD for Actor ID: ${actor.id} pinned.`);
    } else {
      hudContainer.classList.remove('com-hud-pinned');
      pinIcon.classList.remove('active');
      console.log(`HUD for Actor ID: ${actor.id} unpinned.`);
    }
    await setHUDState(actor.id, hudState);
  };

  // Adjust the container height
  adjustContainerHeight(hudContainer);
}


// Function to render HUD (now async to handle state retrieval)
async function renderHUD(actor) {
  if (currentHudInstances[actor.id]) {
    currentHudInstances[actor.id].remove();
  }

  const hudContainer = document.createElement('div');
  hudContainer.className = 'com-hud-container';
  hudContainer.dataset.actorId = actor.id; // Store actor ID

  const titleBar = document.createElement('div');
  titleBar.className = 'com-hud-title-bar';
  titleBar.innerHTML = `
    <i class="fas fa-thumbtack com-hud-pin"></i>
    <span class="com-hud-character-name">${actor.name}</span>
    <i class="fas fa-chevron-up com-hud-toggle"></i>
    <i class="fas fa-times com-hud-close"></i>
  `;
  
  hudContainer.appendChild(titleBar);

  const toggleIcon = titleBar.querySelector('.com-hud-toggle');
  const closeIcon = titleBar.querySelector('.com-hud-close');
  const pinIcon = titleBar.querySelector('.com-hud-pin');

  // Fetch and apply the saved HUD state
  const hudState = await getHUDState(actor.id);
  if (hudState.state === "collapsed") {
    hudContainer.classList.add('com-hud-minimized');
    toggleIcon.classList.remove('fa-chevron-up');
    toggleIcon.classList.add('fa-chevron-down');
  } else {
    hudContainer.classList.remove('com-hud-minimized');
    toggleIcon.classList.remove('fa-chevron-down');
    toggleIcon.classList.add('fa-chevron-up');
  }

  if (hudState.pinned) {
    hudContainer.classList.add('com-hud-pinned');
    pinIcon.classList.add('active');
  }

  // Toggle section logic with state preservation
  toggleIcon.addEventListener('click', async (e) => {
    e.stopPropagation();
    const isMinimized = hudContainer.classList.toggle('com-hud-minimized');
    toggleIcon.classList.toggle('fa-chevron-up');
    toggleIcon.classList.toggle('fa-chevron-down');
    hudState.state = isMinimized ? "collapsed" : "expanded";
    await setHUDState(actor.id, hudState);
    adjustContainerHeight(hudContainer);
  });

  // Close HUD logic
  closeIcon.addEventListener('click', async (e) => {
    e.stopPropagation();
    hudContainer.remove();
    delete currentHudInstances[actor.id];
    hudState.pinned = false; // Unpin when closed
    await setHUDState(actor.id, hudState);
    console.log(`HUD for Actor ID: ${actor.id} closed and unpinned.`);
  });

  // Pin HUD logic
  pinIcon.addEventListener('click', async (e) => {
    e.stopPropagation();
    hudState.pinned = !hudState.pinned;
    if (hudState.pinned) {
      hudContainer.classList.add('com-hud-pinned');
      pinIcon.classList.add('active');
      console.log(`HUD for Actor ID: ${actor.id} pinned.`);
    } else {
      hudContainer.classList.remove('com-hud-pinned');
      pinIcon.classList.remove('active');
      console.log(`HUD for Actor ID: ${actor.id} unpinned.`);
    }
    await setHUDState(actor.id, hudState);
  });

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'com-hud-content-wrapper';

  // Add Themes (filter out 'Loadout')
  actor.items
    .filter(i => i.type === "theme" && 
                 i.name.toLowerCase() !== "__loadout__" && 
                 (mythosThemes.includes(i.system.themebook_name.toLowerCase().replace(/\s+/g, '')) ||
                  logosThemes.includes(i.system.themebook_name.toLowerCase().replace(/\s+/g, ''))))
    .forEach(theme => {
      const isMythos = mythosThemes.includes(theme.system.themebook_name.toLowerCase().replace(/\s+/g, ''));
      const isLogos = logosThemes.includes(theme.system.themebook_name.toLowerCase().replace(/\s+/g, ''));
      const themeElement = createThemeElement(actor, theme, isMythos, isLogos);
      contentWrapper.appendChild(themeElement);
    });

  // Add Status Section
  const statusSection = document.createElement('div');
  statusSection.className = 'com-hud-status-section';
  statusSection.innerHTML = `
    <div class="com-hud-status-header">Statuses <i class="fas fa-chevron-down com-hud-status-toggle"></i></div>
    <div class="com-hud-status-list"></div>
  `;

  const statusList = statusSection.querySelector('.com-hud-status-list');
  const statusToggle = statusSection.querySelector('.com-hud-status-toggle');
  
  // Add status items (filter by type: "status")
  actor.items.filter(i => i.type === "status").forEach(status => {
    const statusElement = createStatusElement(actor, status);
    statusList.appendChild(statusElement);
  });

  contentWrapper.appendChild(statusSection);
  hudContainer.appendChild(contentWrapper);
  document.body.appendChild(hudContainer);
  currentHudInstances[actor.id] = hudContainer;

  // Make HUD draggable with user-specific position
  await makeDraggable(hudContainer, titleBar, actor.id);

  // Fetch and apply the saved Statuses state
  const statusState = await getStatusState(actor.id);
  if (statusState === "collapsed") {
    statusList.classList.add('hidden');
    statusToggle.classList.remove('fa-chevron-down');
    statusToggle.classList.add('fa-chevron-up');
  } else {
    statusList.classList.remove('hidden');
    statusToggle.classList.remove('fa-chevron-up');
    statusToggle.classList.add('fa-chevron-down');
  }

  // Add event listener to statusToggle to preserve its state
  statusToggle.addEventListener('click', async (e) => {
    e.stopPropagation();
    const isHidden = statusList.classList.toggle('hidden');
    statusToggle.classList.toggle('fa-chevron-down');
    statusToggle.classList.toggle('fa-chevron-up');
    await setStatusState(actor.id, isHidden ? "collapsed" : "expanded");
  });

  adjustContainerHeight(hudContainer);
  console.log(`HUD for Actor ID: ${actor.id} rendered.`);
}

// Debug function
function debugLog(...args) {
  if (game.settings.get("com-hud", "debug")) {
    console.log('City of Mist: Char HUD |', ...args);
  }
}

// Function to make the HUD draggable with user-specific position
async function makeDraggable(element, dragHandle, actorId) {
  let posX = 0, posY = 0, initialX = 0, initialY = 0;
  let isDragging = false;

  // Load saved position from user flags
  const savedPosition = await getHUDPosition(actorId);
  element.style.position = 'absolute'; // Ensure position is absolute for draggable
  element.style.top = savedPosition.top;
  element.style.left = savedPosition.left;

  dragHandle.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();

    initialX = e.clientX;
    initialY = e.clientY;

    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    isDragging = true;

    posX = initialX - e.clientX;
    posY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;

    element.style.top = (element.offsetTop - posY) + "px";
    element.style.left = (element.offsetLeft - posX) + "px";
  }

  async function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;

    if (isDragging) {
      // Save the new position in user flags
      await setHUDPosition(actorId, {
        top: element.style.top,
        left: element.style.left
      });
      console.log(`HUD position for Actor ID: ${actorId} saved.`, { top: element.style.top, left: element.style.left });
      isDragging = false;
    }
  }
}

function adjustContainerHeight(container) {
  const contentWrapper = container.querySelector('.com-hud-content-wrapper');
  const titleBarHeight = container.querySelector('.com-hud-title-bar').offsetHeight;
  const viewportHeight = window.innerHeight;
  const containerRect = container.getBoundingClientRect();
  const bottomPadding = 20; // Space to leave at the bottom of the viewport

  // Reset any previous inline styles
  contentWrapper.style.maxHeight = '';
  contentWrapper.style.overflowY = '';

  // Get the natural height of the content
  const contentHeight = contentWrapper.scrollHeight;

  // Calculate the maximum available height
  const maxAvailableHeight = viewportHeight - containerRect.top - titleBarHeight - bottomPadding;

  if (contentHeight > maxAvailableHeight) {
    // Content is taller than available space, set max-height and enable scrolling
    contentWrapper.style.maxHeight = `${maxAvailableHeight}px`;
    contentWrapper.style.overflowY = 'auto';
  } else {
    // Content fits within available space, use its natural height
    contentWrapper.style.maxHeight = '';
    contentWrapper.style.overflowY = 'visible';
  }
}

// Create theme elements with prefixed CSS classes
function createThemeElement(actor, theme, isMythos, isLogos) {
  const container = document.createElement('div');
  container.className = 'com-hud-theme'; // base class for themes

  let icon = '';
  let themeClass = ''; // New variable to store the CSS class based on the theme type

  if (isMythos) {
    icon = '<i class="fas fa-bolt"></i> '; // Mythos icon
    themeClass = 'com-hud-theme-name-mythos'; // Apply Mythos-specific CSS class
  } else if (isLogos) {
    icon = '<i class="fas fa-mask"></i> '; // Logos icon
    themeClass = 'com-hud-theme-name-logos'; // Apply Logos-specific CSS class
  }

  const title = document.createElement('h3');
  title.className = `com-hud-theme-name ${themeClass}`; // Apply the correct theme class

  // Normalize the themebook name for localization
  const normalizedThemebookName = theme.system.themebook_name.toLowerCase().replace(/\s+/g, '');

  // Localize the themebook name using the normalized key
  let localizedThemebookName = game.i18n.localize(`CityOfMist.themebook.${normalizedThemebookName}.name`);

  // Fallback to the original name if localization fails
  if (localizedThemebookName === `CityOfMist.themebook.${normalizedThemebookName}.name`) {
    localizedThemebookName = theme.system.themebook_name; // Fallback to the original name
  }

  title.innerHTML = icon + localizedThemebookName;
  container.appendChild(title);

  // Add Power Tags
  const powerTags = actor.items.filter(t => t.system.theme_id === theme.id && t.system.subtype === 'power');
  if (powerTags.length) {
    const powerTagList = document.createElement('ul');
    powerTagList.className = 'com-hud-power-tag-list';
    powerTags.forEach(tag => {
      const listItem = createTagElement(actor, tag, 'com-hud-power-tag');
      powerTagList.appendChild(listItem);
    });
    container.appendChild(powerTagList);
  }

  // Add Weakness Tags
  const weaknessTags = actor.items.filter(t => t.system.theme_id === theme.id && t.system.subtype === 'weakness');
  if (weaknessTags.length) {
    const weaknessTagList = document.createElement('ul');
    weaknessTagList.className = 'com-hud-weakness-tag-list';
    weaknessTags.forEach(tag => {
      const listItem = createTagElement(actor, tag, 'com-hud-weakness-tag');
      weaknessTagList.appendChild(listItem);
    });
    container.appendChild(weaknessTagList);
  }

  return container;
}

function createTagElement(actor, tag, tagType) {
  const listItem = document.createElement('li');
  listItem.className = 'com-hud-tag-item'; 

  const label = document.createElement('label');
  label.className = `com-hud-tag-label ${tagType}`; 
  label.textContent = tag.name;

  // Add the weakness indicator for weakness tags (down arrow icon)
  if (tagType === 'com-hud-weakness-tag') {
    const weaknessIcon = document.createElement('i');
    weaknessIcon.className = 'fas fa-angle-double-down';  // FontAwesome double down arrow
    label.prepend(weaknessIcon); // Add the arrow before the text
  }

  // Check if the tag is burned and apply burned styles
  if (tag.system.burned) {
    label.classList.add('com-hud-burned-tag');  // Apply burned visual style (strikethrough or opacity)
    label.classList.add('disabled');  // Disable interaction for burned tags
  }

  // Check if the tag is already selected
  const selectedTags = actor.getFlag("com-hud", "selectedTags") || [];
  if (selectedTags.some(selectedTag => selectedTag.name === tag.name)) {
    label.classList.add('selected');  // Visually mark as selected
  }

  // Add click event to toggle selected state if the tag is not burned
  label.addEventListener('click', async () => {
    if (tag.system.burned) return;  // Prevent selection if the tag is burned

    label.classList.toggle('selected');  // Toggle selected state visually

    let updatedTags = selectedTags;

    // Add or remove the tag based on its selection state
    if (label.classList.contains('selected')) {
      updatedTags.push({ name: tag.name, type: tagType.includes('weakness') ? 'weakness' : 'power' });
    } else {
      updatedTags = updatedTags.filter(t => t.name !== tag.name);
    }

    // Store the updated selected tags on the actor
    await actor.setFlag("com-hud", "selectedTags", updatedTags);
    console.log(`Selected tags for Actor ID: ${actor.id} updated:`, updatedTags);
  });

  // Burn/unburn toggle for power tags (optional)
  if (tagType === 'com-hud-power-tag') {
    const burnIcon = document.createElement('i');
    burnIcon.className = tag.system.burned ? 'fa-solid fa-fire com-hud-burned-icon' : 'fa-thin fa-fire com-hud-unburned-icon';

    burnIcon.addEventListener('click', async (event) => {
      event.stopPropagation();  // Prevent selecting the tag when toggling the burn state

      const isBurned = !tag.system.burned;  // Toggle the burned state
      burnIcon.className = isBurned ? 'fa-solid fa-fire com-hud-burned-icon' : 'fa-thin fa-fire com-hud-unburned-icon';
      label.classList.toggle('com-hud-burned-tag', isBurned);  // Visually mark/unmark as burned

      // Update the tag's burned state on the actor
      await actor.updateEmbeddedDocuments("Item", [{ _id: tag.id, "system.burned": isBurned }]);
      console.log(`Tag "${tag.name}" for Actor ID: ${actor.id} burned state updated to: ${isBurned}`);
    });

    listItem.appendChild(burnIcon);  // Add the burn/unburn icon next to the label
  }

  listItem.appendChild(label);
  return listItem;
}

function createStatusElement(actor, status) {
  const statusItem = document.createElement('div');
  statusItem.className = 'com-hud-status-item';

  // Add the status name with clickable effect to change states
  statusItem.innerHTML = `
    <span class="com-hud-status-name ch-status status-neutral">${status.name}-${status.system.tier}</span>
  `;

  // Get the status effects flag from the actor
  const currentStatuses = actor.getFlag("com-hud", "statusEffects") || {};
  const currentState = currentStatuses[status.name] || 'neutral';  // Default to neutral if not set

  const statusNameElement = statusItem.querySelector('.com-hud-status-name');
  
  // Apply the correct initial class based on the current state
  statusNameElement.classList.remove('status-neutral', 'status-positive', 'status-negative');
  statusNameElement.classList.add(`status-${currentState}`);

  // Add click event to change state
  statusNameElement.addEventListener('click', async () => {
    let newState;
    if (statusNameElement.classList.contains('status-neutral')) {
      newState = 'positive';
    } else if (statusNameElement.classList.contains('status-positive')) {
      newState = 'negative';
    } else {
      newState = 'neutral';
    }

    // Update class for the new state
    statusNameElement.classList.remove('status-neutral', 'status-positive', 'status-negative');
    statusNameElement.classList.add(`status-${newState}`);

    // Update the actor's flag for the selected status
    currentStatuses[status.name] = newState;
    await actor.setFlag("com-hud", "statusEffects", currentStatuses);  // Save updated statuses
    console.log(`Status "${status.name}" for Actor ID: ${actor.id} updated to: ${newState}`);
  });

  return statusItem;
}
