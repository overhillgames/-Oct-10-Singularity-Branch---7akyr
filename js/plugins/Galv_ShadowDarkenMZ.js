//-----------------------------------------------------------------------------
//  Galv's Shadow Darken MZ
//-----------------------------------------------------------------------------
//  For: RPGMAKER MZ
//  Galv_ShadowDarken.js
//-----------------------------------------------------------------------------
//  2025-10-04 - Version 1.1 - fixed a bug when transferring in/out of shadow
//  2022-08-20 - Version 1.0 - release
//-----------------------------------------------------------------------------
// Terms can be found at:
// galvs-scripts.com
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.Galv_ShadowDarkenMZ = true;

var Galv = Galv || {};                  // Galv's main object
Galv.SDARK = Galv.SDARK || {};          // Galv's stuff
Galv.SDARK.pluginName = "Galv_ShadowDarkenMZ";

//-----------------------------------------------------------------------------
/*:
 * @plugindesc (v.1.1) Map characters darken when in shadow regions
 * @url http://galvs-scripts.com
 * @target MZ
 * @author Galv
 *
 * @param Dark Amount
 * @desc How dark to make characters when entering shadow area (0-255)
 * @default 130
 *
 * @param Shadow Regions
 * @desc List of regions IDs that will be in shadow
 * @default 237,238
 *
 * @help
 *   Galv's Shadow Darken
 * ----------------------------------------------------------------------------
 * This plugin makes map events/player darker/lighter if they are standing in
 * a designated shadow region. Shadow regions are designated in the plugin
 * settings or using map notes.
 * 
 * Map Notes
 * ---------
 *
 *     SHADOW_REGIONS x,x,x,x
 *
 * Using the above text in the Map Notes (changing the x's for other region
 * ID's) will make the shadow darken functionality work for those ID's on just
 * that map. The region ID's set in the plugin settings will also work, still.
 */



//-----------------------------------------------------------------------------
//  CODE STUFFS
//-----------------------------------------------------------------------------

Galv.SDARK.dark = Number(PluginManager.parameters('Galv_ShadowDarkenMZ')["Dark Amount"]);

var txt = PluginManager.parameters('Galv_ShadowDarkenMZ')["Shadow Regions"].split(',');
Galv.SDARK.regions = [];
for (let i = 0; i < txt.length; i++) {
	Galv.SDARK.regions.push(Number(txt[i]));
}


//-----------------------------------------------------------------------------
//  GAME CHARACTERBASE
//-----------------------------------------------------------------------------

Galv.SDARK.Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
	Galv.SDARK.Game_CharacterBase_initMembers.call(this);
	this._isInShadow = false;
};

Galv.SDARK.Game_CharacterBase_locate = Game_CharacterBase.prototype.locate;
Game_CharacterBase.prototype.locate = function(x, y) {
	Galv.SDARK.Game_CharacterBase_locate.call(this,x,y);
	this.checkShadow();
};

Game_CharacterBase.prototype.enterShadow = function() {
	this._isInShadow = true;
};

Game_CharacterBase.prototype.leaveShadow = function() {
	this._isInShadow = false;
};

Galv.SDARK.Game_CharacterBase_moveStraight = Game_CharacterBase.prototype.moveStraight;
Game_CharacterBase.prototype.moveStraight = function(d) {
    Galv.SDARK.Game_CharacterBase_moveStraight.call(this,d);
	if (this.isMovementSucceeded()) this.checkShadow();
};

Galv.SDARK.Game_CharacterBase_moveDiagonally = Game_CharacterBase.prototype.moveDiagonally;
Game_CharacterBase.prototype.moveDiagonally = function(horz,vert) {
    Galv.SDARK.Game_CharacterBase_moveDiagonally.call(this,horz,vert);
	if (this.isMovementSucceeded()) this.checkShadow();
};

Galv.SDARK.Game_CharacterBase_straighten = Game_CharacterBase.prototype.straighten;
Game_CharacterBase.prototype.straighten = function() {
	Galv.SDARK.Game_CharacterBase_straighten.call(this);
	this.checkShadow();
};

Game_CharacterBase.prototype.checkShadow = function() {
	this._isInShadow = $gameMap._shadowRegions.contains(this.regionId());
};


//-----------------------------------------------------------------------------
//  SPRITE CHARACTER
//-----------------------------------------------------------------------------

Galv.SDARK.Sprite_Character_setCharacter = Sprite_Character.prototype.setCharacter;
Sprite_Character.prototype.setCharacter = function(character) {
    Galv.SDARK.Sprite_Character_setCharacter.call(this,character);
	this.setShadowBlend();
};

Sprite_Character.prototype.setShadowBlend = function() {
    let blend = this.getBlendColor();
    blend[3] = this._character._isInShadow ? Galv.SDARK.dark : 0;
    this.setBlendColor(blend);
};


Sprite_Character.prototype.updateShadowBlend = function(speed) {
	let blend = this.getBlendColor();
	blend[3] += speed; // speed shadow happens
	
	if (blend[3] <= 0) {
		blend[3] = 0;
	} else if (blend[3] > Galv.SDARK.dark) {
		blend[3] = Galv.SDARK.dark;
	}
	this.setBlendColor(blend);
};

Galv.SDARK.Sprite_Character_update = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function() {
	Galv.SDARK.Sprite_Character_update.call(this);
	this.updateShadowDarken();
};

Sprite_Character.prototype.updateShadowDarken = function() {
	if (this._character._isInShadow) {
		if (this._blendColor[3] != Galv.SDARK.dark) {
			this.updateShadowBlend(15 - (10 - this._character._moveSpeed));
		}
	} else {
		if (this._blendColor[3] != 0) {
			this.updateShadowBlend(-(15 - (10 - this._character._moveSpeed)));
		}
	}
};


//-----------------------------------------------------------------------------
// GAME MAP
//-----------------------------------------------------------------------------

Galv.SDARK.Game_Map_initialize = Game_Map.prototype.initialize ;
Game_Map.prototype.initialize = function() {
    Galv.SDARK.Game_Map_initialize.call(this);
	this._shadowRegions = [].concat(Galv.SDARK.regions);
};


Galv.SDARK.Game_Map_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {
	Galv.SDARK.Game_Map_setup.call(this,mapId);
	// Get Map Shadow Regions
	this.createShadowDarkenRegions(mapId);
};

Game_Map.prototype.createShadowDarkenRegions = function(mapId) {
	this._shadowRegions = [].concat(Galv.SDARK.regions);
	// CREATE MAP NOTE CONFIG HERE
	let txtArray = $dataMap.note.match(/[^\r\n]+/g);
	if (!txtArray) return;

	for (i = 0; i < txtArray.length; i++) {
		if (txtArray[i].indexOf("SHADOW_REGIONS ") >= 0) {
			let regions = (txtArray[i].replace('SHADOW_REGIONS ','')).split(",");
			for (var n = 0; n < regions.length; n++) {
				this._shadowRegions.push(Number(regions[n]));
			};
		};
	};
};