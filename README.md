# City of Mist: Character HUD

**City of Mist: Character HUD** is a simple always-open, never-in-the-way HUD that allows players to select tags and statuses to be used on move rolls. No questions, no menus. Just select and roll using the moves in the hotbar. Fast and streamlined like any _action-packed game_ should be!

![image](https://github.com/user-attachments/assets/7667f879-60de-4082-90b8-a84808ee8af6)

## Features

- **Always-visible HUD**: Provides quick access to theme tags and statuses. You only have to select a PC token
- **Auto-Localization**: Automatically translates theme and moves names based on the game language
- **Hotbar Integration**: Auto-loads macros for core moves and cinematic moves: core moves on page 1 and cinematic moves on page 2 of the Macro Hotbar
- **Quick Roll Support**: Allows rolling with selected tags and themes without navigating away from the HUD
- **Draggable**: Drag it around, see your game while playing it!
- **Dynamite Moves Control Panel**: an easy way for the MC to determine which move is Dynamite for a character (see image below)

## Installation

In Foundry VTT, go to the Add-on Modules tab and click Install Module. Then:

1. Search in the top bar for "city of mist character hud" and click on the Install button of the module
2. Enable the module in your Game Settings under Manage Modules

OR

1. Paste the following manifest URL into the bottom Manifest URL field:

    https://github.com/mordachai/com-hud/raw/main/module.json

2. Enable the module in your Game Settings under Manage Modules

## Usage

Once installed and activated, the HUD will automatically appear when a character token is selected.

### Rolling a Move: Tags and Statuses

![image](https://github.com/user-attachments/assets/b7a3140e-e2d7-4fc7-90be-367f229b9d52)

1. Select your character token.
2. Choose tags (Power/Weakness) from the HUD.
    - You can manually burn tags after they are used on a roll. Burned tags cannot be selected, click on the fire icon again to "unburn" the tag.
3. Choose statuses. Click over them to toggle if they are positive, negative, or neutral:
    - Blue (+): will add to the tags calculated in the roll
    - Yellow (-): will subtract from the tags calculated in the roll
    - Grey (0): will do nothing to the roll. If a tag has no use in the next roll let it be like this
4. Click the corresponding move macro in the macro hotbar.

_**Note:** Check how on the roll card in the chat window the total modifier (⚡) displays the correct value with the status and tags summed up after the roll._

![image](https://github.com/user-attachments/assets/df4d8706-5794-45bd-ac39-d0c8a7258e47)

The results and move effects will be automatically displayed in the chat.

### Dynamite Move Control Panel

To assign the _Dynamite!_ trait to any Core Move, run the **Dynamite Move Control Panel** macro from the **HUD Macros compendium**. 

When a roll of 12+ is made with a _Dynamite_ move, the roll results will be upgraded and a 🧨 symbol will appear on the roll card in the chat.

![image](https://github.com/user-attachments/assets/a03fe024-825f-47de-93ef-3f18c28faef6)

## Known Issues

- If you close the HUD you will need deselect than select your token again to bring the HUD back
- The inputs are not bidirectional. Use the normal character sheet to register anything, the only purpose of the HUD is to make rolls easier and fast. Be especially aware of your burned tags.

## Compatibility

This module is designed for Foundry VTT version 12.0 or higher and the City of Mist system.

## License

This project is licensed under the MIT License. See the file for more details.
