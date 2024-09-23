// roll-move.js

const mythosThemes = ["Adaptation", "Advanced Art", "Bastion", "Conjuration", "Divination", "Enclave", "Esoterica", "Expression", "Familiar", "Mobility", "Relic", "Shrouding"];
const logosThemes = ["Defining Event", "Defining Relationship", "Destiny", "Mission", "Personality", "Possessions", "Routine", "Struggle", "Subversion", "Training", "Tradition", "Turf", "Unit"];

console.log("mythosThemes:", mythosThemes);
console.log("logosThemes:", logosThemes);


// We'll add this to the global scope instead of exporting
globalThis.CityOfMistRolls = globalThis.CityOfMistRolls || {};

CityOfMistRolls.moveConfig = {

    // Core Moves
    "Change the Game": {
        name: "CityOfMist.moves.CTG.name",
        fail: "CityOfMist.moves.genericFail",
        partial: "CityOfMist.moves.CTG.partial",
        success: "CityOfMist.moves.CTG.success",
        dynamite: "CityOfMist.moves.CTG.dynamite",
        partialEffects: [
            "CityOfMist.moves.CTG.0",
            "CityOfMist.moves.CTG.1",
            "CityOfMist.moves.CTG.2"
        ],
        successEffects: [
            "CityOfMist.moves.CTG.0",
            "CityOfMist.moves.CTG.1",
            "CityOfMist.moves.CTG.2",
            "CityOfMist.moves.CTG.3",
            "CityOfMist.moves.CTG.4",
            "CityOfMist.moves.CTG.5",
            "CityOfMist.moves.CTG.6"
            ],
        dynamiteEffects: [
            "CityOfMist.moves.CTG.0",
            "CityOfMist.moves.CTG.1",
            "CityOfMist.moves.CTG.2",
            "CityOfMist.moves.CTG.3",
            "CityOfMist.moves.CTG.4",
            "CityOfMist.moves.CTG.5",
            "CityOfMist.moves.CTG.6",
            "CityOfMist.moves.CTG.7",
            "CityOfMist.moves.CTG.8",
            "CityOfMist.moves.CTG.9"
        ],
            useJuice: true,
            hasDynamite: true
    },

    "Convince": {
        name: "CityOfMist.moves.convince.name",
        fail: "CityOfMist.moves.genericFail",
        partial: "CityOfMist.moves.convince.partial",
        success: "CityOfMist.moves.convince.success",
        dynamite: "CityOfMist.moves.convince.dynamite",
        hasDynamite: true
    },

    "Face Danger": {
        name: "CityOfMist.moves.FD.name",
        fail: "CityOfMist.moves.FD.fail",
        partial: "CityOfMist.moves.FD.partial",
        success: "CityOfMist.moves.FD.success",
        dynamite: "CityOfMist.moves.FD.dynamite",
        dynamiteEffects: [
            "CityOfMist.moves.FD.0",
            "CityOfMist.moves.FD.1"
        ],
        usePWR: true,
        hasDynamite: true
    },

    "Go Toe To Toe": {
        name: "CityOfMist.moves.GTTT.name",
        fail: "CityOfMist.moves.genericFail",
        partial: "CityOfMist.moves.GTTT.partial",
        success: "CityOfMist.moves.GTTT.success",
        dynamite: "CityOfMist.moves.GTTT.dynamite",
        partialEffects: [
            "CityOfMist.moves.GTTT.0",
            "CityOfMist.moves.GTTT.1",
            "CityOfMist.moves.GTTT.2"
        ],
        successEffects: [
            "CityOfMist.moves.GTTT.0",
            "CityOfMist.moves.GTTT.1",
            "CityOfMist.moves.GTTT.2"
        ],
        dynamiteEffects: [
            "CityOfMist.moves.GTTT.0",
            "CityOfMist.moves.GTTT.1",
            "CityOfMist.moves.GTTT.2"
        ],
        usePWR: true,
        hasDynamite: true
    },

    "Hit with All You Got": {
        name: "CityOfMist.moves.HWAYG.name",
        fail: "CityOfMist.moves.genericFail",
        partial: "CityOfMist.moves.HWAYG.partial",
        success: "CityOfMist.moves.HWAYG.success",
        dynamite: "CityOfMist.moves.HWAYG.dynamite",
        partialEffects: [
            "CityOfMist.moves.HWAYG.0",
            "CityOfMist.moves.HWAYG.1",
            "CityOfMist.moves.HWAYG.2",
            "CityOfMist.moves.HWAYG.3",
            "CityOfMist.moves.HWAYG.4"
        ],
        successEffects: [
            "CityOfMist.moves.HWAYG.0",
            "CityOfMist.moves.HWAYG.1",
            "CityOfMist.moves.HWAYG.2",
            "CityOfMist.moves.HWAYG.3",
            "CityOfMist.moves.HWAYG.4"
        ],
        dynamiteEffects: [
            "CityOfMist.moves.HWAYG.5",
            "CityOfMist.moves.HWAYG.6",
            "CityOfMist.moves.HWAYG.7",
            "CityOfMist.moves.HWAYG.8",
            "CityOfMist.moves.HWAYG.9"
        ],
        usePWR: true,
        hasDynamite: true
    },

    "Investigate": {
        name: "CityOfMist.moves.investigate.name",
        fail: "CityOfMist.moves.genericFail",
        partial: "CityOfMist.moves.investigate.partial",
        success: "CityOfMist.moves.investigate.success",
        dynamite: "CityOfMist.moves.investigate.dynamite",
        partialEffects: [
            "CityOfMist.moves.investigate.0",
            "CityOfMist.moves.investigate.1",
            "CityOfMist.moves.investigate.2"
        ],
        successEffects: [
            "CityOfMist.moves.investigate.0",
            "CityOfMist.moves.investigate.1",
            "CityOfMist.moves.investigate.2"
        ],
        dynamiteEffects: [
            "CityOfMist.moves.investigate.0",
            "CityOfMist.moves.investigate.1",
            "CityOfMist.moves.investigate.2"
        ],
        usePWR: true,
        hasDynamite: true
    },

    "Look Beyond the Mist": {
        name: "CityOfMist.moves.lookBeyond.name",
        fail: "CityOfMist.moves.genericFail",
        partial: "CityOfMist.moves.investigate.partial",
        success: "CityOfMist.moves.investigate.success",
        dynamite: "CityOfMist.moves.investigate.dynamite",
        partialEffects: [
            "CityOfMist.moves.investigate.0",
            "CityOfMist.moves.investigate.1",
            "CityOfMist.moves.investigate.2"
        ],
        successEffects: [
            "CityOfMist.moves.investigate.0",
            "CityOfMist.moves.investigate.1",
            "CityOfMist.moves.investigate.2"
        ],
        dynamiteEffects: [
            "CityOfMist.moves.investigate.0",
            "CityOfMist.moves.investigate.1",
            "CityOfMist.moves.investigate.2"
        ],
        usePWR: true,
        hasDynamite: true
    },

    "Sneak Around": {
        name: "CityOfMist.moves.sneak.name",
        fail: "CityOfMist.moves.genericFail",
        partial: "CityOfMist.moves.sneak.partial",
        success: "CityOfMist.moves.sneak.success",
        dynamite: "CityOfMist.moves.sneak.dynamite",
        partialEffects: [
            "CityOfMist.moves.sneak.0",
            "CityOfMist.moves.sneak.1",
            "CityOfMist.moves.sneak.2"
        ],
        successEffects: [
            "CityOfMist.moves.sneak.0",
            "CityOfMist.moves.sneak.1",
            "CityOfMist.moves.sneak.2"
        ],
        dynamiteEffects: [
            "CityOfMist.moves.sneak.0",
            "CityOfMist.moves.sneak.1",
            "CityOfMist.moves.sneak.2"
        ],
        usePWR: true,
        hasDynamite: true
    },

    "Take the Risk": {
        name: "CityOfMist.moves.TTR.name",
        fail: "CityOfMist.moves.genericFail",
        partial: "CityOfMist.moves.TTR.partial",
        success: "CityOfMist.moves.TTR.success",
        dynamite: "CityOfMist.moves.TTR.dynamite",
        usePWR: true,
        hasDynamite: true
    },

    "Stop. Holding. Back. (Significant)": {
        name: "CityOfMist.moves.SHB.significant.name",
        fail: "CityOfMist.moves.SHB.significant.fail",
        partial: "CityOfMist.moves.SHB.significant.partial",
        success: "CityOfMist.moves.SHB.significant.success",
    },

    "Stop. Holding. Back. (No Return)": {
        name: "CityOfMist.moves.SHB.noReturn.name",
        fail: "CityOfMist.moves.SHB.noReturn.fail",
        partial: "CityOfMist.moves.SHB.noReturn.partial",
        success: "CityOfMist.moves.SHB.noReturn.success",
    },

    "Stop. Holding. Back. (Ultimate)": {
        name: "CityOfMist.moves.SHB.ultimate.name",
        fail: "CityOfMist.moves.SHB.ultimate.fail",
        partial: "CityOfMist.moves.SHB.ultimate.partial",
        success: "CityOfMist.moves.SHB.ultimate.success",
    },

    "Monologue": {
        name: "CityOfMist.moves.monologue.name",
        fail: "CityOfMist.moves.monologue.always",
        partial: "CityOfMist.moves.monologue.always",
        success: "CityOfMist.moves.monologue.always",
        moveType: "cinematic",
    },

    "Flashback": {
        name: "CityOfMist.moves.flashback.name",
        fail: "CityOfMist.moves.flashback.always",
        partial: "CityOfMist.moves.flashback.always",
        success: "CityOfMist.moves.flashback.always",
        failEffects: [
            "CityOfMist.moves.flashback.0",
            "CityOfMist.moves.flashback.1"
        ],
        partialEffects: [
            "CityOfMist.moves.flashback.0",
            "CityOfMist.moves.flashback.1"
        ],
        successEffects: [
            "CityOfMist.moves.flashback.0",
            "CityOfMist.moves.flashback.1"
        ],
        moveType: "cinematic",
    },

    "Downtime": {
        name: "CityOfMist.moves.downtime.name",
        fail: "CityOfMist.moves.downtime.always",
        partial: "CityOfMist.moves.downtime.always",
        success: "CityOfMist.moves.downtime.always",
        failEffects: [
            "CityOfMist.moves.downtime.0",
            "CityOfMist.moves.downtime.1",
            "CityOfMist.moves.downtime.2",
            "CityOfMist.moves.downtime.3",
            "CityOfMist.moves.downtime.4"
        ],
        partialEffects: [
            "CityOfMist.moves.downtime.0",
            "CityOfMist.moves.downtime.1",
            "CityOfMist.moves.downtime.2",
            "CityOfMist.moves.downtime.3",
            "CityOfMist.moves.downtime.4"
        ],
        successEffects: [
            "CityOfMist.moves.downtime.0",
            "CityOfMist.moves.downtime.1",
            "CityOfMist.moves.downtime.2",
            "CityOfMist.moves.downtime.3",
            "CityOfMist.moves.downtime.4"
        ],
        moveType: "cinematic",
    },

    "Session End": {
        name: "CityOfMist.moves.sessionEnd.name",
        fail: "CityOfMist.moves.sessionEnd.always",
        partial: "CityOfMist.moves.sessionEnd.always",
        success: "CityOfMist.moves.sessionEnd.always",
        failEffects: [
            "CityOfMist.moves.sessionEnd.0",
            "CityOfMist.moves.sessionEnd.1",
            "CityOfMist.moves.sessionEnd.2"
        ],
        partialEffects: [
            "CityOfMist.moves.sessionEnd.0",
            "CityOfMist.moves.sessionEnd.1",
            "CityOfMist.moves.sessionEnd.2"
        ],
        successEffects: [
            "CityOfMist.moves.sessionEnd.0",
            "CityOfMist.moves.sessionEnd.1",
            "CityOfMist.moves.sessionEnd.2"
        ],
        moveType: "cinematic",
    },

};

// Main rollMove function
CityOfMistRolls.rollMove = async function(moveName, isDynamite = false) {
    const actor = canvas.tokens.controlled[0]?.actor;

    if (!actor) {
        ui.notifications.warn("You must have a token selected to roll a move.");
        return;
    }

    // Check if the move is set as dynamite for this actor (character)
    const dynamiteMoves = actor.getFlag("com-hud", "dynamiteMoves") || [];
    if (dynamiteMoves.includes(moveName)) {
        isDynamite = true;
    }

    console.log(`Rolling ${moveName} for ${actor.name}. Dynamite: ${isDynamite}`);

    // Exclude the __LOADOUT__ theme when calculating themes
    const themes = actor.items.filter(i => i.type === "theme" && i.name.toLowerCase() !== "__loadout__");
    const moveData = this.moveConfig[moveName];
    
    if (!moveData) {
        ui.notifications.error(`Move "${moveName}" not found in configuration.`);
        return;
    }

    // Handle cinematic moves with no dice rolling
    if (moveData.moveType === "cinematic") {
        const outcome = game.i18n.localize(moveData.fail);
        const moveEffects = moveData.failEffects || moveData.partialEffects || moveData.successEffects || [];
        const localizedEffects = moveEffects.map(effect => game.i18n.localize(effect));

        const messageContent = await renderTemplate("modules/com-hud/templates/roll-chat-card.hbs", {
            actorName: actor.name,
            moveName: game.i18n.localize(moveData.name),
            diceRolls: [],  // No dice rolls for cinematic moves
            powerTags: [],
            weaknessTags: [],
            powerAmount: [],
            rollTotal: [],
            moveOutcome: outcome,
            moveEffects: localizedEffects
        });

        ChatMessage.create({ content: messageContent });
        return;
    }

    // "Look Beyond the Mist" Move (Mythos-based)
    if (moveName === "Look Beyond the Mist") {
        const mythosCount = themes.filter(theme => {
            const normalizedThemeName = theme.system.themebook_name.toLowerCase().replace(/\s+/g, '');
            const isMythos = mythosThemes.some(mythosTheme => 
                normalizedThemeName.includes(mythosTheme.toLowerCase().replace(/\s+/g, ''))
            );
            // Exclude the __LOADOUT__ theme
            return isMythos && theme.name.toLowerCase() !== "__loadout__";
        }).length;

        if (mythosCount === 0) {
            ui.notifications.warn("You have no Mythos themes, so you cannot use 'Look Beyond the Mist'.");
            return;
        }

        let roll = new Roll("2d6");
        await roll.evaluate({async: true});
        if (game.dice3d) {
            await game.dice3d.showForRoll(roll);
        }

        const diceResult = roll.dice[0].results.map(i => i.result);
        const rollTotal = roll.total + mythosCount;
        const outcome = rollTotal <= 6 ? game.i18n.localize(moveData.fail) :
                        rollTotal <= 9 ? game.i18n.localize(moveData.partial) :
                        game.i18n.localize(moveData.success);

        const powerAmount = mythosCount;  // Ensure PWR is updated correctly with Mythos count
        const localizedEffects = (rollTotal <= 9 ? moveData.partialEffects : moveData.successEffects).map(effect => game.i18n.localize(effect));

        // Replace PWR text in the outcome string
        const finalOutcome = CityOfMistRolls.substituteText(outcome, powerAmount, powerAmount);

        const messageContent = await renderTemplate("modules/com-hud/templates/roll-chat-card.hbs", {
            actorName: actor.name,
            moveName: game.i18n.localize(moveData.name),
            diceRolls: diceResult,
            powerAmount: `<span class="ch-modifier">+<i class="fa-light fa-bolt"></i> ${powerAmount}: </span>`, // Ensure correct PWR display
            rollTotal: rollTotal,
            moveOutcome: finalOutcome,
            moveEffects: localizedEffects // Apply the correct effects
        });

        ChatMessage.create({ content: messageContent });
        await actor.setFlag("com-hud", "selectedTags", []);  // Clear selected tags
        return;
    }

    

    // "Stop Holding Back" Move (Logos-based)
    if (["Stop. Holding. Back. (Significant)", "Stop. Holding. Back. (No Return)", "Stop. Holding. Back. (Ultimate)"].includes(moveName)) {
        const logosCount = themes.filter(theme => {
            const normalizedThemeName = theme.system.themebook_name.toLowerCase().replace(/\s+/g, '');
            const isLogos = logosThemes.some(logosTheme => 
                normalizedThemeName.includes(logosTheme.toLowerCase().replace(/\s+/g, ''))
            );
            // Exclude the __LOADOUT__ theme
            return isLogos && theme.name.toLowerCase() !== "__loadout__";
        }).length;
    
        if (logosCount === 0) {
            ui.notifications.warn("You have no Logos themes, so you cannot use 'Stop. Holding. Back.'");
            return;
        }
    
        let roll = new Roll("2d6");
        await roll.evaluate({async: true});
        if (game.dice3d) {
            await game.dice3d.showForRoll(roll);
        }
    
        const diceResult = roll.dice[0].results.map(i => i.result);
        const rollTotal = roll.total + logosCount;
        const outcome = rollTotal <= 6 ? game.i18n.localize(moveData.fail) :
                        rollTotal <= 9 ? game.i18n.localize(moveData.partial) :
                        game.i18n.localize(moveData.success);
    
        const messageContent = await renderTemplate("modules/com-hud/templates/roll-chat-card.hbs", {
            actorName: actor.name,
            moveName: game.i18n.localize(moveData.name),
            diceRolls: diceResult,
            powerAmount: `<span class="ch-modifier">+ <i class="fa-light fa-mask"></i> ${logosCount}: </span>`,
            rollTotal: rollTotal,
            moveOutcome: outcome,
            moveEffects: []
        });
    
        ChatMessage.create({ content: messageContent });
        await actor.setFlag("com-hud", "selectedTags", []);
        return;
    }
    
    


    const selectedTags = actor.getFlag("com-hud", "selectedTags") || [];
const powerTags = selectedTags.filter(tag => tag.type === 'power').map(tag => tag.name);
const weaknessTags = selectedTags.filter(tag => tag.type === 'weakness').map(tag => tag.name);

// Base powerAmount calculation (power tags minus weakness tags)
const basePowerAmount = Math.max(0, powerTags.length - weaknessTags.length);

// Include status effects in rolls
const selectedStatuses = actor.getFlag("com-hud", "statusEffects") || {};
let statusModifier = 0;

Object.keys(selectedStatuses).forEach(statusName => {
  const statusItem = actor.items.find(i => i.name === statusName);
  if (statusItem && statusItem.system.tier !== undefined) {
    const tier = statusItem.system.tier;
    if (selectedStatuses[statusName] === 'positive') statusModifier += tier;
    if (selectedStatuses[statusName] === 'negative') statusModifier -= tier;
  }
});

    // Combine the base powerAmount with statusModifier
    const totalPowerAmount = basePowerAmount + statusModifier;

    let roll = new Roll("2d6");
    await roll.evaluate({async: true});
    if (game.dice3d) {
    await game.dice3d.showForRoll(roll);
    }

    const diceResult = roll.dice[0].results.map(i => i.result);
    const rollTotal = roll.total + totalPowerAmount;

    let outcome = "";
    let moveEffects = [];
    let juiceAmount = basePowerAmount;

    if (rollTotal <= 6) {
    outcome = game.i18n.localize(moveData.fail);
    moveEffects = moveData.failEffects || [];
    } else if (rollTotal >= 7 && rollTotal <= 9) {
    outcome = game.i18n.localize(moveData.partial);
    moveEffects = moveData.partialEffects || [];
    } else if (rollTotal >= 10) {
    outcome = game.i18n.localize(moveData.success);
    moveEffects = moveData.successEffects || [];
    juiceAmount = Math.max(2, basePowerAmount);
    }

    if (isDynamite && rollTotal >= 12) {
    outcome = game.i18n.localize(moveData.dynamite);
    moveEffects = moveData.dynamiteEffects || [];
    juiceAmount = Math.max(3, basePowerAmount);
    }

    outcome = CityOfMistRolls.substituteText(outcome, basePowerAmount, juiceAmount);

    // Display the totalPowerAmount which includes the status effects
    const displayPowerAmount = `<span class="ch-modifier">+<i class="fa-regular fa-bolt"></i>${totalPowerAmount}: </span>`;

    const displayRollTotal = isDynamite && rollTotal >= 12 ? `${rollTotal}\u{1F9E8}` : rollTotal;

    const messageContent = await renderTemplate("modules/com-hud/templates/roll-chat-card.hbs", {
    actorName: actor.name,
    moveName: game.i18n.localize(moveData.name),
    diceRolls: diceResult,
    powerTags: powerTags,
    weaknessTags: weaknessTags,
    powerAmount: displayPowerAmount,  // Updated to show power and status
    rollTotal: displayRollTotal,
    moveOutcome: outcome,
    moveEffects: moveEffects.map(effect => game.i18n.localize(effect))
    });

    ChatMessage.create({ content: messageContent });
    await actor.setFlag("com-hud", "selectedTags", []);

    };


// Combined substitution function
CityOfMistRolls.substituteText = function(txt, powerAmount, juiceAmount) {
    console.log("substituteText input:", txt, powerAmount, juiceAmount);
    const result = txt.replace(/PWRM3/g, String(Math.max(3, juiceAmount)))
                      .replace(/PWRM2/g, String(Math.max(2, juiceAmount)))
                      .replace(/PWR\+2/g, String(powerAmount + 2))
                      .replace(/PWR/g, String(powerAmount)); // Ensure this line handles plain 'PWR'
    console.log("substituteText output:", result);
    return result;
};

// After substitution for the outcome text
// outcome = CityOfMistRolls.substituteText(outcome, powerAmount, juiceAmount);