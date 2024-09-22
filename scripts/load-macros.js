// load-macros.js

async function loadMacrosToHotbar(macrosToLoad) {
    const currentUser = game.user;

    // Load the macro compendium
    const compendium = game.packs.get("com-hud.com-hud-macros");
    if (!compendium) {
        ui.notifications.error("Compendium not found.");
        console.error("Compendium 'com-hud.com-hud-macros' not found.");
        return;
    }

    // Get all macros from the compendium
    const macros = await compendium.getDocuments();
    if (macros.length === 0) {
        console.error("No macros found in the compendium.");
        return;
    }

    // Get the move configuration from roll-move.js (CityOfMistRolls.moveConfig)
    const moveConfig = CityOfMistRolls.moveConfig;

    console.log("Loaded macros from compendium:", macros.map(macro => macro.name));

    // Loop through the macrosToLoad array and assign them to slots
    for (let {name, slot} of macrosToLoad) {
        console.log(`Looking for macro "${name}" to assign to slot ${slot}`);

        // Find the macro in the compendium
        let macro = macros.find(m => m.name === name);
        if (!macro) {
            console.warn(`Macro "${name}" not found in compendium.`);
            continue;
        }

        console.log(`Macro "${name}" found in compendium:`, macro);

        // Get the localized name from CityOfMistRolls.moveConfig
        const moveData = moveConfig[name];
        if (!moveData || !moveData.name) {
            console.warn(`Move data not found or missing name for "${name}".`);
            continue;
        }

        // Localize the macro name
        const localizedName = game.i18n.localize(moveData.name);
        console.log(`Localized macro name for "${name}":`, localizedName);

        // Check if a macro with this localized name already exists in the world
        let existingMacro = game.macros.find(m => m.name === localizedName);
        if (existingMacro) {
            console.log(`Macro "${localizedName}" already exists. Using existing macro.`);
            macro = existingMacro;
        } else {
            // Import the macro from the compendium to the world with the localized name
            macro = await Macro.create({
                name: localizedName, // Use the localized name here
                type: macro.type,
                command: macro.command,
                img: macro.img
            });
            console.log(`Imported new macro "${localizedName}" to the world:`, macro);
        }

        // Assign the macro to the current user's hotbar
        await currentUser.assignHotbarMacro(macro, slot);
        console.log(`Assigned "${localizedName}" to slot ${slot} for user "${currentUser.name}"`);
    }

    // Force refresh the hotbar
    ui.hotbar.render();
}

// Define macros and their corresponding slots
const macrosToLoad = [
    { name: "Change the Game", slot: 1 },
    { name: "Convince", slot: 2 },
    { name: "Face Danger", slot: 3 }, 
    { name: "Go Toe To Toe", slot: 4 }, 
    { name: "Hit with All You Got", slot: 5 }, 
    { name: "Investigate", slot: 6 }, 
    { name: "Look Beyond the Mist", slot: 7 }, 
    { name: "Sneak Around", slot: 8 },
    { name: "Take the Risk", slot: 9 }, 
    { name: "Stop. Holding. Back. (Significant)", slot: 11 }, 
    { name: "Stop. Holding. Back. (No Return)", slot: 12 },
    { name: "Stop. Holding. Back. (Ultimate)", slot: 13 },
    { name: "Monologue", slot: 15 },
    { name: "Flashback", slot: 16 },
    { name: "Downtime", slot: 17 },
    { name: "Session End", slot: 18 }
];

// Auto-execute when the Foundry instance is ready
Hooks.on('ready', () => {
    console.log("Foundry is ready, loading macros to hotbars.");
    loadMacrosToHotbar(macrosToLoad);
});
