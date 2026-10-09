/*:
 * @url https://coffeenahc.itch.io/
 * @target MZ
 * @author coffeenahc
 * @plugindesc (v.1.0) (MZ) Adds a parallax effect to the battlefield as the mouse moves.
 * 
 * @help
 * ======================================================================================
 * 
 * VERSION HISTORY: 
 * - 1.0: Initial release
 * 
 * ======================================================================================
 * 
 * TERMS OF USAGE (As of 10/10/2023):
 * If you got this plugin FOR FREE on itch.io:
 * - Attribution to 'coffeenahc' is required along with a link to my itch io page.
 *   Example: coffeenahc (https://coffeenahc.itch.io/)
 * - Commercial or Non-commercial use
 * 
 * If you have PAID/DONATED AT LEAST 5$ for this plugin on itch.io:
 * - No attribution or credit is required. 
 * - Commercial or Non-commercial use
 * 
 * I am open for commissions should you wish to upgrade the plugin or change parts of it 
 * according to your preference. Contact me at the above link, visit my fiverr page 
 * (https://www.fiverr.com/coffee_chan), or dm on discord (Username: coffeenahc).
 * 
 * ======================================================================================
 * 
 * HOW TO USE:
 * Parameters centerX and centerY defines the "0,0 point". Basically, when the 
 * cursor is at this point, everything is in their default positions. As the 
 * mouse moves way from this point, so do the battleback and battler sprites. 
 * 
 * Parameters battlebackMoveFactor and battlerMoveFactor defines how extreme
 * the battleback and battlers move depending on the mouse's position.
 * 
 * To disable and reset positions, you can call the following script calls:
 * GBCCoffee.MouseMoveParallax.isDisabled = true;
 * 
 * To reenable the parallax effect, simply set it to false instead of true;
 * 
 * @param centerX
 * @text Center X
 * @type Number
 * @desc The parallax will move accordingly as the cursor deviates from this x pos.
 * @default 408
 * 
 * @param centerY
 * @text Center Y
 * @type Number
 * @desc The parallax will move accordingly as the cursor deviates from this y pos.
 * @default 312
 * 
 * @param battlebackMoveFactor
 * @type Number
 * @text Battleback Move Factor
 * @default 0.08
 * 
 * @param battlerMoveFactor
 * @type Number
 * @text Battler Move Factor
 * @default 0.1
 * 
 * @param isInverted
 * @type boolean
 * @text Is Inverted
 * @default false
 * 
 */

var GBCCoffee = GBCCoffee || {};
GBCCoffee.MouseMoveParallax = {
    centerX: Number(PluginManager.parameters("GBCCoffee_MouseMoveParallax")["centerX"]),
    centerY: Number(PluginManager.parameters("GBCCoffee_MouseMoveParallax")["centerY"]),
    battlebackMoveFactor: Number(PluginManager.parameters("GBCCoffee_MouseMoveParallax")["battlebackMoveFactor"]),
    battlerMoveFactor: Number(PluginManager.parameters("GBCCoffee_MouseMoveParallax")["battlerMoveFactor"]),
    isInverted: eval(PluginManager.parameters("GBCCoffee_MouseMoveParallax")["isInverted"]),
    isDisabled: false
};

let gbccoffee_mousemoveparallax_gametemp_initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function() {
    gbccoffee_mousemoveparallax_gametemp_initialize.call(this);
    this._cursorFocusX = 0;
    this._cursorFocusY = 0;
};

let gbccoffee_mousemoveparallax_spritesetbattle_update = Spriteset_Battle.prototype.update;
Spriteset_Battle.prototype.update = function() {
    gbccoffee_mousemoveparallax_spritesetbattle_update.call(this);
    this.updateMouseParallax();
};

Spriteset_Battle.prototype.updateMouseParallax = function() {
    let centerX = GBCCoffee.MouseMoveParallax.centerX;
    let centerY = GBCCoffee.MouseMoveParallax.centerY;
    let focusX = TouchInput.x - centerX;
    let focusY = TouchInput.y - centerY;
    $gameTemp._cursorFocusX = focusX;
    $gameTemp._cursorFocusY = focusY;
};

let gbccoffee_mousemoveparallax_spritebattleback_adjustposition = Sprite_Battleback.prototype.adjustPosition;
Sprite_Battleback.prototype.adjustPosition = function() {
    gbccoffee_mousemoveparallax_spritebattleback_adjustposition.call(this);
    this._homeX = this.x;
    this._homeY = this.y;
    this._positionAdjusted = true;
};

let gbccoffee_mousemoveparallax_spritebattleback_update = Sprite_Battleback.prototype.update;
Sprite_Battleback.prototype.update = function() {
    gbccoffee_mousemoveparallax_spritebattleback_update.call(this);
    this.applyMouseParallax();
};

Sprite_Battleback.prototype.applyMouseParallax = function() {
    if (!this._positionAdjusted) return;
    const moveFactor = GBCCoffee.MouseMoveParallax.isDisabled ? 0 : GBCCoffee.MouseMoveParallax.battlebackMoveFactor;
    const direction = GBCCoffee.MouseMoveParallax.isInverted ? 1 : -1;
    
    this.x = this._homeX + $gameTemp._cursorFocusX * moveFactor * direction;
    this.y = this._homeY + $gameTemp._cursorFocusY * moveFactor * direction;    
};

let gbccoffee_mousemoveparallax_spritebattler_initmembers = Sprite_Battler.prototype.initMembers;
Sprite_Battler.prototype.initMembers = function() {
    gbccoffee_mousemoveparallax_spritebattler_initmembers.call(this);
    this._shiftX = 0;
    this._shiftY = 0;
};

let gbccoffee_mousemoveparallax_spritebattler_updateposition = Sprite_Battler.prototype.updatePosition;
Sprite_Battler.prototype.updatePosition = function() {
    gbccoffee_mousemoveparallax_spritebattler_updateposition.call(this);
    const direction = GBCCoffee.MouseMoveParallax.isInverted ? 1 : -1;

    this._shiftX = GBCCoffee.MouseMoveParallax.isDisabled ? 0 : $gameTemp._cursorFocusX * GBCCoffee.MouseMoveParallax.battlerMoveFactor;
    this._shiftY = GBCCoffee.MouseMoveParallax.isDisabled ? 0 : $gameTemp._cursorFocusY * GBCCoffee.MouseMoveParallax.battlerMoveFactor;

    this.x += this._shiftX * direction;
    this.y += this._shiftY * direction;

};