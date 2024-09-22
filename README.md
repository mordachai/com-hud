# City of Mist: Character HUD

**City of Mist: Character HUD** is a simple always-open, never-in-the-way HUD that allows players to select tags and statuses to be used in rolls. No questions, no menus. Just select and roll using the moves in the hotbar. Fast and streamlined like any _action packed game_ should be!

![image](https://github.com/user-attachments/assets/7667f879-60de-4082-90b8-a84808ee8af6)

## Features

- **Always-visible HUD**: Provides quick access to theme tags and statuses. You only have to select a PC token
- **Auto-Localization**: Automatically translates theme and move names based on the game language
- **Hotbar Integration**: Auto-loads macros for core moves and cinematic moves: core moves on page 1 and cinematic moves in page 2 of the macro hotbar
- **Quick Roll Support**: Allows rolling with selected tags and themes without navigating away from the HUD
- **Draggable**: Drag it around, see your game while you're playing it!

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

1. Select your character token.
2. Choose tags (Power/Weakness) from the HUD.
3. Choose statuses. Click over than to toggle if they are positive, negative or neutral:
    - Blue (+): will add to the tags calculated in the roll
    - Yellow (-): will subtract from the tags calculated in the roll
    - Grey (0): will do nothing to the roll. If a tag has no use in the next roll let it like this
4. Click the corresponding move macro in the macro hotbar.

The results, along with move effects, will be automatically displayed in the chat.

## Known Issues

- If you close the HUD you will need to select another char and then select yours to update
- The inputs are not bidirectional. Use the normal character sheet to register anything, the only purpose of the HUD is to make rolls easier and fast.

## Compatibility

This module is designed for use with Foundry VTT version 12.0 or higher and the City of Mist system.

## License

This project is licensed under the MIT License. See the file for more details.
