class DynamitePanel extends FormApplication {
  constructor(object, options) {
    super(object, options);
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "dynamite-panel",
      title: "Dynamite Moves Control",
      template: "modules/com-hud/templates/dynamite-panel.hbs",
      width: 600,
      height: "auto",
      closeOnSubmit: true
    });
  }

  getData() {
    // Fetch all actors of type "character" (i.e., player characters)
    const players = game.actors.filter(actor => actor.type === "character");
    console.log("All Character Actors: ", players); // Debug log to verify the actors list

    // Fetch all moves that have the `hasDynamite` flag
    const moves = Object.entries(CityOfMistRolls.moveConfig).filter(([key, move]) => move.hasDynamite);
    console.log("Moves with Dynamite: ", moves);

    return {
      players: players.map(player => ({
        id: player.id,
        name: player.name,
        owner: this.getPlayerOwnerName(player) // Fetch the owner name using the updated method
      })),
      moves: moves.map(([key, move]) => ({
        id: key,
        name: game.i18n.localize(move.name)
      }))
    };
  }

  // Helper function to get the player's owner name
  getPlayerOwnerName(player) {
    // Filter out users who are GMs, and check for player ownership
    const nonGMOwners = game.users.filter(user => !user.isGM && player.testUserPermission(user, "OWNER"));
    
    const ownerUser = nonGMOwners.length > 0 ? nonGMOwners[0] : null; // If there are non-GM owners, pick the first one
    return ownerUser ? `(${ownerUser.name})` : "(no owner)"; // Return owner's name or "no owner"
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Handle toggling of dynamite status for actors via checkboxes
    html.find(".dynamite-toggle").on("change", async (event) => {
      const actorId = event.currentTarget.dataset.playerId;  // Get the actor's ID
      const moveId = event.currentTarget.dataset.moveId;     // Get the move's ID

      const actor = game.actors.get(actorId);               // Fetch the actor (character) by ID
      let dynamiteMoves = actor.getFlag("com-hud", "dynamiteMoves") || [];
      dynamiteMoves = dynamiteMoves.map(id => String(id));  // Ensure IDs are strings

      if (event.currentTarget.checked) {
        // Add the move to the dynamite moves if checked
        if (!dynamiteMoves.includes(moveId)) {
          dynamiteMoves.push(moveId);
          await actor.setFlag("com-hud", "dynamiteMoves", dynamiteMoves);
        }
      } else {
        // Remove the move from dynamite moves if unchecked
        dynamiteMoves = dynamiteMoves.filter(id => id !== moveId);
        if (dynamiteMoves.length > 0) {
          await actor.setFlag("com-hud", "dynamiteMoves", dynamiteMoves);
        } else {
          await actor.unsetFlag("com-hud", "dynamiteMoves");
        }
      }

      // Re-render the application to update the UI
      this.render();
    });
  }

  async _updateObject(event, formData) {
    // Not required, as toggling is handled dynamically
  }
}

// Function to launch the panel
globalThis.launchDynamitePanel = function() {
  if (!game.user.isGM) {
    ui.notifications.warn("Only the GM can manage Dynamite moves.");
    return;
  }
  new DynamitePanel().render(true);
};

// Automatically re-render the panel when a new character (actor) is created
Hooks.on('createActor', () => {
  // If the DynamitePanel is currently rendered, re-render it to include the new actor
  const panel = Object.values(ui.windows).find(app => app instanceof DynamitePanel);
  if (panel) {
    panel.render();  // Re-render to update the list of actors
  }
});

// Initialization hook
Hooks.once('init', () => {
  console.log('Dynamite Panel Initialized');
});

// Register getFlag helper
Handlebars.registerHelper('getFlag', function(actorId, scope, key) {
  const actor = game.actors.get(actorId);
  if (!actor) return null;
  return actor.getFlag(scope, key);
});

// Register includes helper
Handlebars.registerHelper('includes', function(array, value) {
  if (!Array.isArray(array)) return false;
  return array.includes(value);
});
