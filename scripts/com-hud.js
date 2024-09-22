let currentHudInstance = null;

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

Hooks.once('ready', async () => {
  // Localize the themes after the game is fully initialized
  localizedMythosThemes = getLocalizedThemes(mythosThemesKeys);
  localizedLogosThemes = getLocalizedThemes(logosThemesKeys);

  if (game.settings.get("com-hud", "debug")) {
    console.log("Localized Mythos Themes:", localizedMythosThemes);
    console.log("Localized Logos Themes:", localizedLogosThemes);
  }

  // Initial render for the controlled token (if any)
  updateHUDForSelectedToken();
});

    Hooks.on('updateActor', (updatedActor, updateData) => {
      const controlled = canvas.tokens.controlled[0];
      if (controlled && controlled.actor.id === updatedActor.id) {
        console.log(`Actor ${updatedActor.name} was updated. Updating HUD.`);
        console.log("Update Data:", updateData);

        // Check if only flags have been updated (skip update if only flags were changed)
        if (Object.keys(updateData).length === 1 && updateData.flags) {
          console.log("Only flags were updated. Skipping HUD update.");
          return;
        }

        updateExistingHUD(updatedActor);
      }
    });
  
    Hooks.on('controlToken', (token, controlled) => {
      if (controlled) {
        updateHUDForSelectedToken();
      } else {
        if (currentHudInstance) {
          currentHudInstance.remove();
          currentHudInstance = null;
        }
      }
    });
  
  // Listen for updates to any actor and re-render HUD when changes occur
  Hooks.on('updateActor', (updatedActor, updateData) => {
    const controlled = canvas.tokens.controlled[0];
    if (controlled && controlled.actor.id === updatedActor.id) {
      console.log(`Actor ${updatedActor.name} was updated. Re-rendering HUD.`);
      console.log("Update Data:", updateData); // Log the update data for debugging
      renderHUD(updatedActor);
    }
  });

  function updateHUDForSelectedToken() {
    const controlled = canvas.tokens.controlled[0];
    if (!controlled) {
      if (currentHudInstance) {
        currentHudInstance.remove();
        currentHudInstance = null;
      }
      return;
    }
  
    const actor = controlled.actor;
    if (!actor) return;
  
    if (currentHudInstance) {
      updateExistingHUD(actor);
    } else {
      renderHUD(actor);
    }
  }
  
  // Add this new function to update the existing HUD:
  function updateExistingHUD(actor) {
    if (!currentHudInstance) return;
  
    const contentWrapper = currentHudInstance.querySelector('.com-hud-content-wrapper');
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
    actor.items.filter(i => i.type === "status").forEach(status => {
      const statusElement = createStatusElement(actor, status);
      statusList.appendChild(statusElement);
    });
  
    contentWrapper.appendChild(statusSection);
  
    // Update the character name
    const characterNameElement = currentHudInstance.querySelector('.com-hud-character-name');
    if (characterNameElement) {
      characterNameElement.textContent = actor.name;
    }
  
    // Adjust the container height
    adjustContainerHeight(currentHudInstance);
  }
  


// Function to update the status section
function updateStatusSection(actor) {
  const statusList = document.querySelector('.com-hud-status-list');
  if (!statusList) return;

  // Clear the current list and repopulate it with updated statuses
  statusList.innerHTML = '';
  
  actor.items.filter(i => i.type === "status").forEach(status => {
    const statusElement = createStatusElement(actor, status);
    statusList.appendChild(statusElement);
  });
}

// Function to render HUD (keep only one declaration)
function renderHUD(actor) {

  if (currentHudInstance) {
    currentHudInstance.remove();
  }

  const hudContainer = document.createElement('div');
  hudContainer.className = 'com-hud-container';

  const titleBar = document.createElement('div');
  titleBar.className = 'com-hud-title-bar';
  titleBar.innerHTML = `
    <span class="com-hud-character-name">${actor.name}</span>
    <i class="fas fa-chevron-up com-hud-toggle"></i>
    <i class="fas fa-times com-hud-close"></i>
  `;
  
  // Toggle section logic
  const toggleIcon = titleBar.querySelector('.com-hud-toggle');
  toggleIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    hudContainer.classList.toggle('com-hud-minimized');
    toggleIcon.classList.toggle('fa-chevron-up');
    toggleIcon.classList.toggle('fa-chevron-down');
    adjustContainerHeight(hudContainer);
  });

  const closeIcon = titleBar.querySelector('.com-hud-close');
  closeIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    hudContainer.remove();
  });

  hudContainer.appendChild(titleBar);

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
  
  // Toggle visibility for the status list
  statusToggle.addEventListener('click', () => {
    statusList.classList.toggle('hidden');
    statusToggle.classList.toggle('fa-chevron-down');
    statusToggle.classList.toggle('fa-chevron-up');
  });

  // Add status items (filter by type: "status")
  actor.items.filter(i => i.type === "status").forEach(status => {
    const statusElement = createStatusElement(actor, status);
    statusList.appendChild(statusElement);
  });

  contentWrapper.appendChild(statusSection);
  hudContainer.appendChild(contentWrapper);
  document.body.appendChild(hudContainer);
  currentHudInstance = hudContainer;

  makeDraggable(hudContainer, titleBar);  // Make HUD draggable
  adjustContainerHeight(hudContainer);    // Adjust height based on viewport size
}

// Debug function
function debugLog(...args) {
  if (game.settings.get("com-hud", "debug")) {
    console.log('City of Mist: Char HUD |', ...args);
  }
}

// Function to make the HUD draggable
function makeDraggable(element, dragHandle) {
  let posX = 0, posY = 0, initialX = 0, initialY = 0;
  let isDragging = false;

  // Load saved position if available
  let savedPosition = JSON.parse(localStorage.getItem('com-hud-position')) || { top: '20px', left: '20px' };
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

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;

    if (isDragging) {
      // Save the position in local storage
      localStorage.setItem('com-hud-position', JSON.stringify({
        top: element.style.top,
        left: element.style.left
      }));
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
  statusNameElement.addEventListener('click', () => {
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
    actor.setFlag("com-hud", "statusEffects", currentStatuses);  // Save updated statuses
  });

  return statusItem;
}
