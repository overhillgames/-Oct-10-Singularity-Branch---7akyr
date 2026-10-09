/*:
 * @url https://gbrogames.itch.io/
 * @target MZ
 * @author coffeenahc (GBRO Games)
 * @plugindesc (v.1.2) A battle layout plugin inspired by Persona x Metaphor Fantazio.
 * 
 * @help
 * ======================================================================================
 * 
 * VERSION HISTORY: 
 * - 1.0: Initial release
 * - 1.1: Compatbility patch with GBCCoffee_FrontViewActorAnimation / 
 *        GBRO_FrontViewActorAnimation
 * - 1.2: Fixed maximum call stack error when using ATB
 * 
 * ======================================================================================
 * 
 * TERMS OF USAGE (As of 10/10/2023):
 * 
 * If you got this plugin FOR FREE on itch.io:
 * - Attribution / credit to 'GBRO Games' or 'coffeenahc' is required.
 * - Commercial or Non-commercial use
 * 
 * If you have PAID/DONATED AT LEAST 5$ for this plugin on itch.io:
 * - No attribution or credit is required. 
 * - Commercial or Non-commercial use
 * 
 * You may edit the plugin's code however you want, but do not claim ownership of it, and 
 * remember to still give credits as stated above.
 * 
 * Any acts with the intention of rebranding the plugin, such as changing the plugin 
 * filename and the comments at the top of the file that include the plugin description 
 * and author information, are forbidden. 
 * 
 * I am open for commissions should you wish to upgrade the plugin or change parts of it 
 * according to your preference. Contact me at the above link, visit my fiverr page 
 * (https://www.fiverr.com/coffee_chan), or dm on discord (Username: coffeenahc).
 * 
 * ======================================================================================
 * 
 * All UI assets go to the 'img/system' folder.
 * 
 * Default parameters are meant for a 1920x1080 screen. Adjust accordingly.
 * 
 * To offset enemy hud for specific enemies, add the below meta tags to the notes section
 * of those enemies in the database:
 * 
 * <pHudOffsetX:number> //Replace number accordingly
 * <pHudOffsetY:number> //Replace number accordingly
 * 
 * NOTE: All graphical assets included in the project demo are meant to be used as
 * placeholders only. Replace them before distributing your game. Do not package along
 * with your game!
 * 
 * @param logWindow
 * @text Log Window
 * 
 * @param lwRect
 * @type text
 * @text Rect
 * @default 0,25,1920,96
 * @desc In the form of x,y,w,h (separate by comma)
 * @parent logWindow
 * 
 * @param lwFontSize
 * @type Number
 * @text Font Size
 * @default 20
 * @parent logWindow
 * 
 * @param lwBg
 * @text BG
 * @type file
 * @dir img/system/
 * @parent logWindow
 * 
 * @param lwBgPos
 * @type text
 * @text BG Pos
 * @default 0,-25
 * @desc In the form of x,y (separate by comma)
 * @parent logWindow
 * 
 * @param statusWindow
 * @text Status Window
 * 
 * @param swRect
 * @type text
 * @text Rect
 * @default 1257,643,855,300
 * @desc In the form of x,y,w,h (separate by comma)
 * @parent statusWindow
 * 
 * @param swHpPos
 * @type text
 * @text HP Gauge Pos
 * @default 260,9
 * @desc In the form of x,y (separate by comma)
 * @parent statusWindow
 * 
 * @param swMpPos
 * @type text
 * @text MP Gauge Pos
 * @default 275,32
 * @desc In the form of x,y (separate by comma)
 * @parent statusWindow
 * 
 * @param swStatusIconPos
 * @type text
 * @text Status Icon Pos
 * @default 192,40
 * @desc In the form of x,y (separate by comma)
 * @parent statusWindow
 * 
 * @param swFacePos
 * @type text
 * @text Face Pos
 * @default 145,0
 * @desc In the form of x,y (separate by comma)
 * @parent statusWindow
 * 
 * @param swNamePos
 * @type text
 * @text Name Pos
 * @default 190,0,144
 * @desc In the form of x,y,maxWidth (separate by comma)
 * @parent statusWindow
 * 
 * @param swItemBg
 * @text Item BG
 * @type file
 * @dir img/system/
 * @parent statusWindow
 * 
 * @param swItemBgPos
 * @type text
 * @text Item BG Pos
 * @default 0,0
 * @desc In the form of x,y (separate by comma)
 * @parent statusWindow
 * 
 * @param swCursorImg
 * @text Cursor Img
 * @type file
 * @dir img/system/
 * @parent statusWindow
 * 
 * @param swCursorPos
 * @type text
 * @text Cursor Img Pos
 * @default 0,0
 * @desc In the form of x,y (separate by comma)
 * @parent statusWindow
 * 
 * @param actorCmndHud
 * @text Actor Cmnd Hud
 * 
 * @param achSway
 * @type boolean
 * @default true
 * @text Enable Sway?
 * @parent actorCmndHud
 * 
 * @param achSwayOffset
 * @type Number
 * @default 10
 * @text Sway Offset
 * @desc Max offset from home position
 * @parent achSway
 * 
 * @param achSwayMinDur
 * @type Number
 * @default 60
 * @text Min Dur
 * @desc How quickly before changing direction (min)
 * @parent achSway
 * 
 * @param achSwayMaxDur
 * @type Number
 * @default 180
 * @text Max Dur
 * @desc How quickly before changing direction (max)
 * @parent achSway
 * 
 * @param achCursorImg
 * @text Cursor Img
 * @type file
 * @dir img/system/
 * @parent actorCmndHud
 * 
 * @param achBg
 * @text BG
 * @type file
 * @dir img/system/
 * @parent actorCmndHud
 * 
 * @param achBgPos
 * @type text
 * @text BG Pos
 * @default 573,589
 * @desc In the form of x,y (separate by comma)
 * @parent actorCmndHud
 * 
 * @param achFg
 * @text FG
 * @type file
 * @dir img/system/
 * @parent actorCmndHud
 * 
 * @param achFgPos
 * @type text
 * @text FG Pos
 * @default 573,589
 * @desc In the form of x,y (separate by comma)
 * @parent actorCmndHud
 * 
 * @param achCmnd1
 * @text Cmnd 1 (Attack)
 * @parent actorCmndHud
 * 
 * @param achCmnd1KeyCode
 * @text Key Code
 * @desc Keyboard key code for this command
 * @parent achCmnd1
 * 
 * @param achCmnd1Img
 * @text Cmnd 1 Img
 * @type file
 * @dir img/system/
 * @parent achCmnd1
 * 
 * @param achCmnd1Pos
 * @type text
 * @text Cmnd 1 Pos
 * @default 449,435,349,385
 * @desc In the form of homeX,homeY,startX,startY (separate by comma). Will animate from startX/Y to homeX/Y.
 * @parent achCmnd1
 * 
 * @param achCmnd1CursorPos
 * @type text
 * @text Cursor Pos
 * @default 400,430,28
 * @desc In the form of x,y,angle (separate by comma).
 * @parent achCmnd1
 * 
 * @param achCmnd2
 * @text Cmnd 2 (Skill)
 * @parent actorCmndHud
 * 
 * @param achCmnd2KeyCode
 * @text Key Code
 * @desc Keyboard key code for this command
 * @parent achCmnd2
 * 
 * @param achCmnd2Img
 * @text Cmnd 2 Img
 * @type file
 * @dir img/system/
 * @parent achCmnd2
 * 
 * @param achCmnd2Pos
 * @type text
 * @text Cmnd 2 Pos
 * @default 410,563,349,563
 * @desc In the form of homeX,homeY,startX,startY (separate by comma). Will animate from startX/Y to homeX/Y.
 * @parent achCmnd2
 * 
 * @param achCmnd2CursorPos
 * @type text
 * @text Cursor Pos
 * @default 370,590,0
 * @desc In the form of x,y,angle (separate by comma).
 * @parent achCmnd2
 * 
 * @param achCmnd3
 * @text Cmnd 3 (Guard)
 * @parent actorCmndHud
 * 
 * @param achCmnd3KeyCode
 * @text Key Code
 * @desc Keyboard key code for this command
 * @parent achCmnd3
 * 
 * @param achCmnd3Img
 * @text Cmnd 3 Img
 * @type file
 * @dir img/system/
 * @parent achCmnd3
 * 
 * @param achCmnd3Pos
 * @type text
 * @text Cmnd  Pos
 * @default 388,700,328,730
 * @desc In the form of homeX,homeY,startX,startY (separate by comma). Will animate from startX/Y to homeX/Y.
 * @parent achCmnd3
 * 
 * @param achCmnd3CursorPos
 * @type text
 * @text Cursor Pos
 * @default 360,715,-10
 * @desc In the form of x,y,angle (separate by comma).
 * @parent achCmnd3
 * 
 * @param achCmnd4
 * @text Cmnd 4 (Item)
 * @parent actorCmndHud
 * 
 * @param achCmnd4KeyCode
 * @text Key Code
 * @desc Keyboard key code for this command
 * @parent achCmnd4
 * 
 * @param achCmnd4Img
 * @text Cmnd 4 Img
 * @type file
 * @dir img/system/
 * @parent achCmnd4
 * 
 * @param achCmnd4Pos
 * @type text
 * @text Cmnd Pos
 * @default 521,755,471,795
 * @desc In the form of homeX,homeY,startX,startY (separate by comma). Will animate from startX/Y to homeX/Y.
 * @parent achCmnd4
 * 
 * @param achCmnd4CursorPos
 * @type text
 * @text Cursor Pos
 * @default 450,807,-30
 * @desc In the form of x,y,angle (separate by comma).
 * @parent achCmnd4
 * 
 * @param skillWindow
 * @text Skill Window
 * 
 * @param skRect
 * @type text
 * @text Rect
 * @default 730,310,452,452
 * @desc In the form of x,y,w,h (separate by comma)
 * @parent skillWindow
 * 
 * @param skBg
 * @text BG
 * @type file
 * @dir img/system/
 * @parent skillWindow
 * 
 * @param skBgPos
 * @type text
 * @text BG Pos
 * @default 0,-68
 * @desc In the form of x,y (separate by comma)
 * @parent skillWindow
 * 
 * @param skMaxCols
 * @text Max Cols
 * @type Number
 * @default 1
 * @parent skillWindow
 * 
 * @param itemWindow
 * @text Item Window
 * 
 * @param ilRect
 * @type text
 * @text Rect
 * @default 730,310,452,452
 * @desc In the form of x,y,w,h (separate by comma)
 * @parent itemWindow
 * 
 * @param ilBg
 * @text BG
 * @type file
 * @dir img/system/
 * @parent itemWindow
 * 
 * @param ilBgPos
 * @type text
 * @text BG Pos
 * @default 0,-68
 * @desc In the form of x,y (separate by comma)
 * @parent itemWindow
 * 
 * @param ilMaxCols
 * @text Max Cols
 * @type Number
 * @default 1
 * @parent itemWindow
 * 
 * @param helpWindow
 * @text Help Window
 * 
 * @param hwRect
 * @type text
 * @text Rect
 * @default 742,790,427,180
 * @desc In the form of x,y,w,h (separate by comma)
 * @parent helpWindow
 * 
 * @param hwBg
 * @text BG
 * @type file
 * @dir img/system/
 * @parent helpWindow
 * 
 * @param hwBgPos
 * @type text
 * @text BG Pos
 * @default -10,-15
 * @desc In the form of x,y (separate by comma)
 * @parent helpWindow
 * 
 * @param miscCmndHud
 * @text Misc Cmnd Hud
 * 
 * @param escapeKeyCode
 * @text Escape Key Code
 * @default 69
 * @desc Keyboard key code for the escape command
 * @parent miscCmndHud
 * 
 * @param circ1Img
 * @text Circ1 Img
 * @type file
 * @dir img/system/
 * @parent miscCmndHud
 * 
 * @param circ1Pos
 * @type text
 * @text Circ1 Pos
 * @default 118,908,-0.3
 * @desc In the form of x,y,rotation (separate by comma)
 * @parent miscCmndHud
 * 
 * @param circ2Img
 * @text Circ2 Img
 * @type file
 * @dir img/system/
 * @parent miscCmndHud
 * 
 * @param circ2Pos
 * @type text
 * @text Circ2 Pos
 * @default 118,908,0.4
 * @desc In the form of x,y,rotation (separate by comma)
 * @parent miscCmndHud
 * 
 * @param escapeImg
 * @text Escape Img
 * @type file
 * @dir img/system/
 * @parent miscCmndHud
 * 
 * @param escapePos
 * @type text
 * @text Escape Pos
 * @default 167,901
 * @desc In the form of x,y (separate by comma)
 * @parent miscCmndHud
 * 
 * @param controlsImg
 * @text Controls Img
 * @type file
 * @dir img/system/
 * @parent miscCmndHud
 * 
 * @param controlsPos
 * @type text
 * @text Controls Pos
 * @default 300,1030
 * @desc In the form of x,y (separate by comma)
 * @parent miscCmndHud
 *
 * @param enemyHud
 * @text Enemy Hud
 * 
 * @param eHudOffset
 * @type text
 * @text Hud Offset
 * @default 50,-350
 * @desc In the form of x,y (separate by comma)
 * @parent enemyHud
 * 
 * @param eHudBack
 * @text HP Back
 * @type file
 * @dir img/system/
 * @parent enemyHud
 * 
 * @param eHudBackPos
 * @type text
 * @text Back Pos
 * @default 0,0
 * @desc In the form of x,y (separate by comma)
 * @parent enemyHud
 * 
 * @param eHudFill
 * @text HP Fill
 * @type file
 * @dir img/system/
 * @parent enemyHud
 * 
 * @param eHudFillPos
 * @type text
 * @text Fill Pos
 * @default 14,72
 * @desc In the form of x,y (separate by comma)
 * @parent enemyHud
 * 
 * @param eHudTxtPos
 * @type text
 * @text Name Pos
 * @default 100,163
 * @desc In the form of x,y (separate by comma)
 * @parent enemyHud
 */

var GBRO = GBRO || {};
GBRO.PersonazioBattleLayout = {
    lwRect: PluginManager.parameters("GBRO_PersonazioBattleLayout")["lwRect"].split(",").map(i => Number(i)),
    lwFontSize: Number(PluginManager.parameters("GBRO_PersonazioBattleLayout")["lwFontSize"]),
    lwBg: PluginManager.parameters("GBRO_PersonazioBattleLayout")["lwBg"],
    lwBgPos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["lwBgPos"].split(",").map(i => Number(i)),

    swRect: PluginManager.parameters("GBRO_PersonazioBattleLayout")["swRect"].split(",").map(i => Number(i)),
    swHpPos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["swHpPos"].split(",").map(i => Number(i)),
    swMpPos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["swMpPos"].split(",").map(i => Number(i)),
    swStatusIconPos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["swStatusIconPos"].split(",").map(i => Number(i)),
    swFacePos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["swFacePos"].split(",").map(i => Number(i)),
    swNamePos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["swNamePos"].split(",").map(i => Number(i)),
    swItemBg: PluginManager.parameters("GBRO_PersonazioBattleLayout")["swItemBg"],
    swItemBgPos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["swItemBgPos"].split(",").map(i => Number(i)),
    swCursorImg: PluginManager.parameters("GBRO_PersonazioBattleLayout")["swCursorImg"],
    swCursorPos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["swCursorPos"].split(",").map(i => Number(i)),    

    achSway: PluginManager.parameters("GBRO_PersonazioBattleLayout")["achSway"] === "true", 
    achSwayOffset: Number(PluginManager.parameters("GBRO_PersonazioBattleLayout")["achSwayOffset"]),
    achSwayMinDur: Number(PluginManager.parameters("GBRO_PersonazioBattleLayout")["achSwayMinDur"]),
    achSwayMaxDur: Number(PluginManager.parameters("GBRO_PersonazioBattleLayout")["achSwayMaxDur"]),

    achBg: PluginManager.parameters("GBRO_PersonazioBattleLayout")["achBg"],
    achBgPos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["achBgPos"].split(",").map(i => Number(i)),

    achFg: PluginManager.parameters("GBRO_PersonazioBattleLayout")["achFg"],
    achFgPos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["achFgPos"].split(",").map(i => Number(i)),
    achCursorImg: PluginManager.parameters("GBRO_PersonazioBattleLayout")["achCursorImg"],

    achCmnd1KeyCode: Number(PluginManager.parameters("GBRO_PersonazioBattleLayout")["achCmnd1KeyCode"]),
    achCmnd1Img: PluginManager.parameters("GBRO_PersonazioBattleLayout")["achCmnd1Img"],
    achCmnd1Pos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["achCmnd1Pos"].split(",").map(i => Number(i)),
    achCmnd1CursorPos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["achCmnd1CursorPos"].split(",").map(i => Number(i)),

    achCmnd2KeyCode: Number(PluginManager.parameters("GBRO_PersonazioBattleLayout")["achCmnd2KeyCode"]),
    achCmnd2Img: PluginManager.parameters("GBRO_PersonazioBattleLayout")["achCmnd2Img"],
    achCmnd2Pos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["achCmnd2Pos"].split(",").map(i => Number(i)),
    achCmnd2CursorPos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["achCmnd2CursorPos"].split(",").map(i => Number(i)),  

    achCmnd3KeyCode: Number(PluginManager.parameters("GBRO_PersonazioBattleLayout")["achCmnd3KeyCode"]),
    achCmnd3Img: PluginManager.parameters("GBRO_PersonazioBattleLayout")["achCmnd3Img"],
    achCmnd3Pos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["achCmnd3Pos"].split(",").map(i => Number(i)),
    achCmnd3CursorPos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["achCmnd3CursorPos"].split(",").map(i => Number(i)),  

    achCmnd4KeyCode: Number(PluginManager.parameters("GBRO_PersonazioBattleLayout")["achCmnd4KeyCode"]),
    achCmnd4Img: PluginManager.parameters("GBRO_PersonazioBattleLayout")["achCmnd4Img"],
    achCmnd4Pos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["achCmnd4Pos"].split(",").map(i => Number(i)),
    achCmnd4CursorPos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["achCmnd4CursorPos"].split(",").map(i => Number(i)),    

    skRect: PluginManager.parameters("GBRO_PersonazioBattleLayout")["skRect"].split(",").map(i => Number(i)),
    skMaxCols: Number(PluginManager.parameters("GBRO_PersonazioBattleLayout")["skMaxCols"]),
    skBg: PluginManager.parameters("GBRO_PersonazioBattleLayout")["skBg"],
    skBgPos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["skBgPos"].split(",").map(i => Number(i)),

    ilRect: PluginManager.parameters("GBRO_PersonazioBattleLayout")["ilRect"].split(",").map(i => Number(i)),
    ilMaxCols: Number(PluginManager.parameters("GBRO_PersonazioBattleLayout")["ilMaxCols"]),
    ilBg: PluginManager.parameters("GBRO_PersonazioBattleLayout")["ilBg"],
    ilBgPos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["ilBgPos"].split(",").map(i => Number(i)),

    hwRect: PluginManager.parameters("GBRO_PersonazioBattleLayout")["hwRect"].split(",").map(i => Number(i)),
    hwBg: PluginManager.parameters("GBRO_PersonazioBattleLayout")["hwBg"],
    hwBgPos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["hwBgPos"].split(",").map(i => Number(i)),    

    escapeKeyCode: Number(PluginManager.parameters("GBRO_PersonazioBattleLayout")["escapeKeyCode"]),
    circ1Img: PluginManager.parameters("GBRO_PersonazioBattleLayout")["circ1Img"],
    circ1Pos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["circ1Pos"].split(",").map(i => Number(i)),   
    circ2Img: PluginManager.parameters("GBRO_PersonazioBattleLayout")["circ2Img"],
    circ2Pos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["circ2Pos"].split(",").map(i => Number(i)), 
    escapeImg: PluginManager.parameters("GBRO_PersonazioBattleLayout")["escapeImg"],
    escapePos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["escapePos"].split(",").map(i => Number(i)), 
    controlsImg: PluginManager.parameters("GBRO_PersonazioBattleLayout")["controlsImg"],
    controlsPos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["controlsPos"].split(",").map(i => Number(i)),    
    
    eHudOffset: PluginManager.parameters("GBRO_PersonazioBattleLayout")["eHudOffset"].split(",").map(i => Number(i)),     
    eHudBack: PluginManager.parameters("GBRO_PersonazioBattleLayout")["eHudBack"],
    eHudBackPos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["eHudBackPos"].split(",").map(i => Number(i)),
    eHudFill: PluginManager.parameters("GBRO_PersonazioBattleLayout")["eHudFill"],
    eHudFillPos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["eHudFillPos"].split(",").map(i => Number(i)),
    eHudTxtPos: PluginManager.parameters("GBRO_PersonazioBattleLayout")["eHudTxtPos"].split(",").map(i => Number(i)),    
};

Input.keyMapper[GBRO.PersonazioBattleLayout.achCmnd1KeyCode] = "cmnd1";
Input.keyMapper[GBRO.PersonazioBattleLayout.achCmnd2KeyCode] = "cmnd2";
Input.keyMapper[GBRO.PersonazioBattleLayout.achCmnd3KeyCode] = "cmnd3";
Input.keyMapper[GBRO.PersonazioBattleLayout.achCmnd4KeyCode] = "cmnd4";
Input.keyMapper[GBRO.PersonazioBattleLayout.escapeKeyCode] = "run";

let gbro_personaziobattlelayout_scenebattle_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function() {
    gbro_personaziobattlelayout_scenebattle_update.call(this);
    this.updatePersonazioInput();
};

Scene_Battle.prototype.updatePersonazioInput = function() {
    if (!BattleManager.actor() || !BattleManager.isInputting() || !this._actorCommandWindow.active) return;

    if (Input.isTriggered("left")) {
        this.onTargetChange(-1);
    } else if (Input.isTriggered("right")) {
        this.onTargetChange(1);
    } else if (Input.isTriggered("run")) {
        if (BattleManager.canEscape()) this.commandEscape();
    } else if (Input.isTriggered("cmnd1")) {
        if (BattleManager.actor().canAttack()) {
            this._actorCommandWindow.deactivate();
            this.commandAttack();
            SoundManager.playOk();
        } else {
            SoundManager.playBuzzer();
        }
    } else if (Input.isTriggered("cmnd2")) {
        this._actorCommandWindow.deactivate();
        this.commandSkill();
        SoundManager.playOk();
    } else if (Input.isTriggered("cmnd3")) {
        if (BattleManager.actor().canGuard()) {
            this._actorCommandWindow.deactivate();
            this.commandGuard();
            SoundManager.playOk();
        } else {
            SoundManager.playBuzzer();
        }
    } else if (Input.isTriggered("cmnd4")) {
        this._actorCommandWindow.deactivate();
        this.commandItem();
        SoundManager.playOk();
    }
};

let gbro_personaziobattlelayout_scenebattle_createdisplayobjects = Scene_Battle.prototype.createDisplayObjects;
Scene_Battle.prototype.createDisplayObjects = function() {
    gbro_personaziobattlelayout_scenebattle_createdisplayobjects.call(this);
    this.createPersonazioLayout();
    $gameTemp.selectedEnemyIndex = 0;
};

Scene_Battle.prototype.createPersonazioLayout = function() {
    this._pActorCmnd = new Sprite_PersonazioActorCommand();
    this._pActorCmnd.setActorCommandWindow(this._actorCommandWindow);
    this._actorCommandWindow.addUi(this._pActorCmnd);
    this.addChild(this._pActorCmnd);

    this._pBorder = new Sprite_Personazio(ImageManager.loadSystem("border"));
    this._pBorder.position.set(Graphics.width/2, Graphics.height/2);
    this.addChild(this._pBorder);

    this._pOtherCmnd = new Sprite_PersonazioOtherCommand();
    this._pOtherCmnd.setActorCommandWindow(this._actorCommandWindow);
    this._actorCommandWindow.addUi(this._pOtherCmnd);
    this.addChild(this._pOtherCmnd);

    [this._messageWindow, this._choiceListWindow, this._nameBoxWindow].forEach(window => {
        this._windowLayer.removeChild(window); 
        this.addChild(window);
    })
};

Scene_Battle.prototype.updateStatusWindowPosition = function() {};

Scene_Battle.prototype.actorCommandWindowRect = function() {
    const ww = 192;
    const wh = this.windowAreaHeight();
    const wx = 9999;
    const wy = Graphics.boxHeight * 0.5;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.statusWindowRect = function() {
    const ww = GBRO.PersonazioBattleLayout.swRect[2];
    const wh = GBRO.PersonazioBattleLayout.swRect[3];
    const wx = GBRO.PersonazioBattleLayout.swRect[0];
    const wy = GBRO.PersonazioBattleLayout.swRect[1];
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.actorWindowRect = function() {
    return this.statusWindowRect();
};

Scene_Battle.prototype.enemyWindowRect = function() {
    const wx = 9999;
    const ww = this._statusWindow.width;
    const wh = this.windowAreaHeight();
    const wy = Graphics.boxHeight - wh;
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.helpWindowRect = function() {
    const ww = GBRO.PersonazioBattleLayout.hwRect[2];
    const wh = GBRO.PersonazioBattleLayout.hwRect[3];    
    const wx = GBRO.PersonazioBattleLayout.hwRect[0];
    const wy = GBRO.PersonazioBattleLayout.hwRect[1];
    return new Rectangle(wx, wy, ww, wh);
};

let gbro_personaziobattlelayout_scenebattle_startactorselection = Scene_Battle.prototype.startActorSelection;
Scene_Battle.prototype.startActorSelection = function() {
    switch (this._actorCommandWindow.currentSymbol()) {
        case "skill":
            this._skillWindow.hide();
            break;
        case "item":
            this._itemWindow.hide();
            break;
    }
    gbro_personaziobattlelayout_scenebattle_startactorselection.call(this);
};

Scene_Battle.prototype.startEnemySelection = function() {
    switch (this._actorCommandWindow.currentSymbol()) {
        case "skill":
            this._skillWindow.hide();
            break;
        case "item":
            this._itemWindow.hide();
            break;
    }

    this._enemyWindow.refresh();
    this._enemyWindow.show();
    this._enemyWindow.select($gameTemp.selectedEnemyIndex);
    this._enemyWindow.activate();
    this._statusWindow.hide();
};

let gbro_personaziobattlelayout_scenebattle_startactorcommandselection = Scene_Battle.prototype.startActorCommandSelection;
Scene_Battle.prototype.startActorCommandSelection = function() {
    gbro_personaziobattlelayout_scenebattle_startactorcommandselection.call(this);    
    const index = $gameTemp.selectedEnemyIndex;
    if ($gameTroop.members()[index] == null || $gameTroop.members()[index].isDead()) {
        $gameTemp.selectedEnemyIndex = 0;
    }
    $gameTroop.select($gameTroop.members()[$gameTemp.selectedEnemyIndex]);
};

Scene_Battle.prototype.changeInputWindow = function() {
    this.hideSubInputWindows();
    if (BattleManager.isInputting()) {
        if (BattleManager.actor()) {
            this.startActorCommandSelection();
            this._actorCommandWindow.show();
        } else {
            this._actorCommandWindow.setup(null);
            BattleManager.selectNextCommand();
        }
    } else {
        this.endCommandSelection();
    }
};

Scene_Battle.prototype.createHelpWindow = function() {
    const rect = this.helpWindowRect();
    this._helpWindow = new Window_PersonazioHelp(rect);
    this._helpWindow.hide();
    this.addChild(this._helpWindow);
};

let gbro_personaziobattlelayout_scenebattle_createactorcommandwindow = Scene_Battle.prototype.createActorCommandWindow;
Scene_Battle.prototype.createActorCommandWindow = function() {
    gbro_personaziobattlelayout_scenebattle_createactorcommandwindow.call(this);
    this._windowLayer.removeChild(this._actorCommandWindow);
    this.addChild(this._actorCommandWindow);
};

Scene_Battle.prototype.onTargetChange = function(indexOffset) {
    const curIndex = $gameTemp.selectedEnemyIndex;
    const members = $gameTroop.aliveMembers();
    let enemy = null;
    
    if (indexOffset == -1) {
        if (curIndex > 0) {
            $gameTemp.selectedEnemyIndex--;
        } else {
            $gameTemp.selectedEnemyIndex = members.length-1;
        }
    } else {
        if (curIndex < members.length - 1) {
            $gameTemp.selectedEnemyIndex++;
        } else {
            $gameTemp.selectedEnemyIndex = 0;
        }
    }
    enemy = members[$gameTemp.selectedEnemyIndex];
    $gameTroop.select(enemy ? $gameTroop.members()[$gameTroop.members().indexOf(enemy)] : $gameTroop.members()[0]);
    SoundManager.playCursor();
};

let gbro_personaziobattlelayout_scenebattle_createstatuswindow = Scene_Battle.prototype.createStatusWindow;
Scene_Battle.prototype.createStatusWindow = function() {
    gbro_personaziobattlelayout_scenebattle_createstatuswindow.call(this);
    this._windowLayer.removeChild(this._statusWindow);
    this.addChild(this._statusWindow);
};

let gbro_personaziobattlelayout_scenebattle_createactorwindow = Scene_Battle.prototype.createActorWindow;
Scene_Battle.prototype.createActorWindow = function() {
    gbro_personaziobattlelayout_scenebattle_createactorwindow.call(this);
    this._windowLayer.removeChild(this._actorWindow);
    this.addChild(this._actorWindow);
};

let gbro_personaziobattlelayout_scenebattle_createlogwindow = Scene_Battle.prototype.createLogWindow;
Scene_Battle.prototype.createLogWindow = function() {
    gbro_personaziobattlelayout_scenebattle_createlogwindow.call(this);
    this._windowLayer.removeChild(this._logWindow);
    this.addChild(this._logWindow);
};


function Window_PersonazioHelp() {
    this.initialize(...arguments);
}

Window_PersonazioHelp.prototype = Object.create(Window_Help.prototype);
Window_PersonazioHelp.prototype.constructor = Window_Help;

Window_PersonazioHelp.prototype.refresh = function() {
    const rect = this.baseTextRect();
    this.contents.clear();

    let lines = [];
    let texts = this._text.split(" ");
    let lastText = "";
    for (let i = 0; i < texts.length; i++) {
        if (this.textWidth(lastText + texts[i] + " ") < this.innerWidth) {
            lastText += texts[i] + " ";
        } else {
            lines.push(lastText);
            lastText = texts[i] + " ";
        }

        if (i == texts.length - 1) {
            lines.push(lastText);
        }
    }

    for (let i = 0; i < lines.length; i++) {
        this.drawText(lines[i], 10, rect.y + (i * 25), this.innerWidth - (10), "left");
    }
};

Window_PersonazioHelp.prototype._createBackSprite = function() {
    this._backSprite = new Sprite(ImageManager.loadSystem(GBRO.PersonazioBattleLayout.hwBg));
    this._backSprite.position.set(GBRO.PersonazioBattleLayout.hwBgPos[0], GBRO.PersonazioBattleLayout.hwBgPos[1]);
    this._container.addChild(this._backSprite);
};
Window_PersonazioHelp.prototype._refreshBack = function() {};
Window_PersonazioHelp.prototype._refreshFrame = function() {};

Window_ActorCommand.prototype.show = function() {
    this.visible = true;
    this._uiElements.forEach(element => element.show());
};

Window_ActorCommand.prototype.hide = function() {
    this.visible = false;
    this._uiElements.forEach(element => element.hide());
};

Window_ActorCommand.prototype.addUi = function(ui) {
    if (!this._uiElements) this._uiElements = [];
    this._uiElements.push(ui);
};

Window_ActorCommand.prototype.makeCommandList = function() {
    if (this._actor) {
        this.addAttackCommand();
        this.addSkillCommands();
        this.addGuardCommand();
        this.addItemCommand();
    }
};

Window_ActorCommand.prototype.addSkillCommands = function() {
    this.addCommand("Skill", "skill", true, 0);
};

Window_ActorCommand.prototype.maxCols = function() {
    return 1;
};

Scene_Battle.prototype.logWindowRect = function() {
    const wx = GBRO.PersonazioBattleLayout.lwRect[0];
    const wy = GBRO.PersonazioBattleLayout.lwRect[1];
    const ww = GBRO.PersonazioBattleLayout.lwRect[2];
    const wh = GBRO.PersonazioBattleLayout.lwRect[3];
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.skillWindowRect = function() {
    const ww = GBRO.PersonazioBattleLayout.skRect[2];
    const wh = GBRO.PersonazioBattleLayout.skRect[3];
    const wx = GBRO.PersonazioBattleLayout.skRect[0];
    const wy = GBRO.PersonazioBattleLayout.skRect[1];
    return new Rectangle(wx, wy, ww, wh);
};

Scene_Battle.prototype.itemWindowRect = function() {
    const ww = GBRO.PersonazioBattleLayout.ilRect[2];
    const wh = GBRO.PersonazioBattleLayout.ilRect[3];
    const wx = GBRO.PersonazioBattleLayout.ilRect[0];
    const wy = GBRO.PersonazioBattleLayout.ilRect[1];
    return new Rectangle(wx, wy, ww, wh);
};

Window_BattleSkill.prototype.includes = function(item) {
    return item != null;
};

Window_BattleSkill.prototype.maxCols = function() {return GBRO.PersonazioBattleLayout.skMaxCols;}
Window_BattleSkill.prototype._createBackSprite = function() {
    this._backSprite = new Sprite(ImageManager.loadSystem(GBRO.PersonazioBattleLayout.skBg));
    this._backSprite.position.set(GBRO.PersonazioBattleLayout.skBgPos[0],GBRO.PersonazioBattleLayout.skBgPos[1]);
    this._container.addChild(this._backSprite);
};
Window_BattleSkill.prototype._refreshBack = function() {};
Window_BattleSkill.prototype._refreshFrame = function() {};

Window_BattleItem.prototype.maxCols = function() {return GBRO.PersonazioBattleLayout.ilMaxCols;}
Window_BattleItem.prototype._createBackSprite = function() {
    this._backSprite = new Sprite(ImageManager.loadSystem(GBRO.PersonazioBattleLayout.ilBg));
    this._backSprite.position.set(GBRO.PersonazioBattleLayout.skBgPos[0],GBRO.PersonazioBattleLayout.ilBgPos[1]);
    this._container.addChild(this._backSprite);
};
Window_BattleItem.prototype._refreshBack = function() {};
Window_BattleItem.prototype._refreshFrame = function() {};

Window_BattleEnemy.prototype.show = function() {
    this.refresh();
    $gameTemp.clearTouchState();
    Window_Selectable.prototype.show.call(this);
};

let gbro_personaziobattlelayout_windowbattleenemy_select = Window_BattleEnemy.prototype.select;
Window_BattleEnemy.prototype.select = function(index) {
    gbro_personaziobattlelayout_windowbattleenemy_select.call(this, index);
    if (index >= 0) $gameTemp.selectedEnemyIndex = index;
};

Window_BattleEnemy.prototype.hide = function() {
    Window_Selectable.prototype.hide.call(this);
};

Window_BattleStatus.prototype.drawItem = function(index) {
    const actor = this.actor(index);
    const rect = this.itemRect(index);

    this.placeGauge(actor, "hp", rect.x + GBRO.PersonazioBattleLayout.swHpPos[0], rect.y + GBRO.PersonazioBattleLayout.swHpPos[1]);    
    this.placeGauge(actor, "mp", rect.x + GBRO.PersonazioBattleLayout.swMpPos[0], rect.y + GBRO.PersonazioBattleLayout.swMpPos[1]);    
    this.placeStateIcon(actor, rect.x + GBRO.PersonazioBattleLayout.swStatusIconPos[0], rect.y + GBRO.PersonazioBattleLayout.swStatusIconPos[1]);

    this.drawFace(actor.faceName(), actor.faceIndex(), rect.x + GBRO.PersonazioBattleLayout.swFacePos[0], rect.y + GBRO.PersonazioBattleLayout.swFacePos[1], rect.width, rect.height-4);
    this.drawText(actor.name(), rect.x + GBRO.PersonazioBattleLayout.swNamePos[0], rect.y + GBRO.PersonazioBattleLayout.swNamePos[1], GBRO.PersonazioBattleLayout.swNamePos[2], "center");


    if ((typeof GBCCoffee !== "undefined" && typeof GBCCoffee.FVAA !== "undefined") ||
        (typeof GBRO !== "undefined" && typeof GBRO.FVAA !== "undefined")) {
        this.drawItemImage(index);
    }

};

Window_BattleStatus.prototype.placeGauge = function(actor, type, x, y) {
    const key = "actor%1-gauge-%2".format(actor.actorId(), type);
    const sprite = this.createInnerSprite(key, Sprite_PersonazioGauge);
    sprite.setup(actor, type);
    sprite.move(x, y);
    sprite.show();

    const key1 = "actor%1-txt-%2".format(actor.actorId(), type);
    const txt = this.createInnerSprite(key1, PIXI.Text);
    const offsetX = type === "hp" ? 128 : 40;
    const offsetY = type === "hp" ? 6 : 19;
    txt.hide = () => {txt.visible = false};
    txt.show = () => {txt.visible = true};
    txt.update = () => {txt.text = type === "hp" ? actor.hp : actor.mp};
    txt.style.fontSize = 20;
    txt.style.fill = "white";
    txt.style.align = "center";
    txt.style.fontFamily = $gameSystem.numberFontFace().split(",");
    txt.style.fontWeight = "bold";    
    txt.rotation = -7 * (Math.PI/180);
    txt.text = type === "hp" ? actor.hp : actor.mp;
    txt.position.set(x + offsetX, y + offsetY);
    txt.show();
};

Window_BattleStatus.prototype.maxCols = function() {
    return 1;
};

Window_BattleStatus.prototype.maxRows = function() {
    return 3;
};

Window_BattleStatus.prototype.itemHeight = function() {
    return 92;
};

Window_BattleStatus.prototype.drawItemBackground = function(index) {
    if (!this._itemBgSprite) this._itemBgSprite = {};

    if (!this._itemBgSprite[index]) {
        this._itemBgSprite[index] = new Sprite(ImageManager.loadSystem(GBRO.PersonazioBattleLayout.swItemBg));
        this._contentsBackSprite.addChild(this._itemBgSprite[index]);
    }

    const rect = this.itemRect(index);
    const sprite = this._itemBgSprite[index];
    sprite.position.set(rect.x + GBRO.PersonazioBattleLayout.swItemBgPos[0], rect.y + GBRO.PersonazioBattleLayout.swItemBgPos[1]);
};

Window_BattleStatus.prototype._createAllParts = function() {
    this._createContainer();
    this._createBackSprite();
    this._createFrameSprite();
    this._createClientArea();
    this._createContentsBackSprite();
    this._createCursorSprite();
    this._createContentsSprite();
    this._createArrowSprites();
    this._createPauseSignSprites();
};

Window_BattleStatus.prototype._createCursorSprite = function() {
    this._cursorSprite = new Sprite(ImageManager.loadSystem(GBRO.PersonazioBattleLayout.swCursorImg));
    this._cursorSprite.position.set(GBRO.PersonazioBattleLayout.swCursorPos[0], GBRO.PersonazioBattleLayout.swCursorPos[1]);
    this._clientArea.addChild(this._cursorSprite);
};

Window_BattleStatus.prototype._refreshCursor = function() {};
Window_BattleStatus.prototype._refreshBack = function() {};

let gbro_personaziobattlelayout_battlelog_initialize = Window_BattleLog.prototype.initialize;
Window_BattleLog.prototype.initialize = function(rect) {
    gbro_personaziobattlelayout_battlelog_initialize.call(this, rect);
    this.opacity = 255;
    this.frameVisible = false;
};

Window_BattleLog.prototype.drawBackground = function() {};
Window_BattleLog.prototype.drawLineText = function(index) {
    const rect = this.lineRect(index);
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
    this.drawTextEx(this._lines[index], rect.x, rect.y+3, rect.width);
};

Window_BattleLog.prototype.maxLines = function() {
    return 2;
};

Window_BattleLog.prototype.updateBackOpacity = function() {
    this.backOpacity = 255;
};

Window_BattleLog.prototype.resetFontSettings = function() {
    this.contents.fontFace = $gameSystem.mainFontFace();
    this.contents.fontSize = GBRO.PersonazioBattleLayout.lwFontSize;
    this.resetTextColor();
};

Window_BattleLog.prototype._createBackSprite = function() {
    this._backSprite = new Sprite(ImageManager.loadSystem(GBRO.PersonazioBattleLayout.lwBg));
    this._backSprite.position.set(GBRO.PersonazioBattleLayout.lwBgPos[0],GBRO.PersonazioBattleLayout.lwBgPos[1]);
    this._container.addChild(this._backSprite);
};
Window_BattleLog.prototype._refreshCursor = function() {};
Window_BattleLog.prototype._refreshBack = function() {};

let gbro_personaziobattlelayout_spritesetbattle_createenemies = Spriteset_Battle.prototype.createEnemies;
Spriteset_Battle.prototype.createEnemies = function() {
    gbro_personaziobattlelayout_spritesetbattle_createenemies.call(this);
    this._enemyHudSprites = [];
    this._enemySprites.forEach(enemySprite => {
        const hudSprite = new Sprite_PersonazioEnemyHud();
        hudSprite.setup(enemySprite._battler);
        this._enemyHudSprites.push(hudSprite);
        this._battleField.addChild(hudSprite);
    })
};

Sprite_Enemy.prototype.updateSelectionEffect = function() {};

function Sprite_PersonazioEnemyHud() {
    this.initialize(...arguments);
}

Sprite_PersonazioEnemyHud.prototype = Object.create(Sprite.prototype);
Sprite_PersonazioEnemyHud.prototype.constructor = Sprite_PersonazioEnemyHud;

Sprite_PersonazioEnemyHud.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._battler = null;
    this.createChildSprites();
};

Sprite_PersonazioEnemyHud.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._battler) {
        const bmp = this._hpFill.bitmap;
        const fullHeight = bmp.height;
        const hpRate = this._battler.hp / this._battler.mhp;
        const visibleHeight = fullHeight * hpRate;
        const yOffset = fullHeight - visibleHeight;

        this._hpFill.setFrame(0, yOffset, bmp.width, visibleHeight);
        this._hpFill.y = GBRO.PersonazioBattleLayout.eHudFillPos[1] + yOffset;

        this._nameTxt.text = this._battler.name();

        const dataEnemy = $dataEnemies[this._battler.enemyId()];
        const offsetX = dataEnemy.meta.pHudOffsetX ? Number(dataEnemy.meta.pHudOffsetX) : 0;
        const offsetY = dataEnemy.meta.pHudOffsetY ? Number(dataEnemy.meta.pHudOffsetY) : 0;
        this.x = this._battler.screenX() + GBRO.PersonazioBattleLayout.eHudOffset[0] + offsetX;
        this.y = this._battler.screenY() + GBRO.PersonazioBattleLayout.eHudOffset[1] + offsetY;
        this.visible = this._battler.isSpriteVisible() && this._battler.isAlive() && 
        this._battler.isSelected() && BattleManager.isInputting();
    }
};

Sprite_PersonazioEnemyHud.prototype.createChildSprites = function() {
    this._hpBack = new Sprite(ImageManager.loadSystem(GBRO.PersonazioBattleLayout.eHudBack));
    this._hpBack.position.set(GBRO.PersonazioBattleLayout.eHudBackPos[0], GBRO.PersonazioBattleLayout.eHudBackPos[1])
    this.addChild(this._hpBack);

    this._hpFill = new Sprite(ImageManager.loadSystem(GBRO.PersonazioBattleLayout.eHudFill));
    this._hpFill.position.set(GBRO.PersonazioBattleLayout.eHudFillPos[0], GBRO.PersonazioBattleLayout.eHudFillPos[1]);
    this.addChild(this._hpFill);

    this._nameTxt = new PIXI.Text("", {
        fill: "white",
        stroke: "black",
        strokeThickness: 2,
        fontFamily: $gameSystem.mainFontFace().split(","),
        align: "center"
    })
    this._nameTxt.position.set(GBRO.PersonazioBattleLayout.eHudTxtPos[0], GBRO.PersonazioBattleLayout.eHudTxtPos[1]);
    this.addChild(this._nameTxt);
};

Sprite_PersonazioEnemyHud.prototype.setup = function(battler) {
    this._battler = battler;
};

function Sprite_PersonazioGauge() {
    this.initialize(...arguments);
}

Sprite_PersonazioGauge.prototype = Object.create(Sprite_Gauge.prototype);
Sprite_PersonazioGauge.prototype.constructor = Sprite_PersonazioGauge;

Sprite_PersonazioGauge.prototype.bitmapWidth = function() {
    return 210;
};

Sprite_PersonazioGauge.prototype.bitmapHeight = function() {
    return 60;
};

Sprite_PersonazioGauge.prototype.redraw = function() {
    this.bitmap.clear();
    const currentValue = this.currentValue();
    if (!isNaN(currentValue)) {
        const backBitmap = ImageManager.loadSystem(this._statusType + "Back");
        const fillBitmap = ImageManager.loadSystem(this._statusType + "Fill");
        const lblBitmap = ImageManager.loadSystem(this._statusType + "Txt");

        const gaugeX = this._statusType === "hp" ? 0 : 33;
        const lblX = this._statusType === "hp" ? 175 : 0;
        const lblY = this._statusType === "hp" ? 2 : 26; 
        this.bitmap.blt(backBitmap, 0, 0, backBitmap.width, backBitmap.height, gaugeX, 0);
        this.bitmap.blt(fillBitmap, 0, 0, fillBitmap.width * this.gaugeRate(), fillBitmap.height, gaugeX, 0);
        this.bitmap.blt(lblBitmap, 0, 0, backBitmap.width, backBitmap.height, lblX, lblY);
    }
};

function Sprite_Personazio() {
    this.initialize(...arguments);
}

Sprite_Personazio.prototype = Object.create(Sprite.prototype);
Sprite_Personazio.prototype.constructor = Sprite;

Sprite_Personazio.prototype.initialize = function(bitmap) {
    Sprite.prototype.initialize.call(this, bitmap);
    this.anchor.set(0.5);
    this.x = 0;
    this.y = 0;
    this._startPosition = null;
    this._targetPosition = null;
    this._moveDuration = 0;
    this._moveElapsed = 0;
    this._moveEaseType = "easeOut";

    this.scale.x = 1;
    this.scale.y = 1;
    this._startScale = null;
    this._targetScale = null;
    this._scaleDuration = 0;
    this._scaleElapsed = 0;
    this._scaleEaseType = "easeOut";    

    this.angle = 0;
    this._startAngle = null;
    this._targetAngle = null;
    this._angleDuration = 0;
    this._angleElapsed = 0;
    this._angleEaseType = "easeOut";

    this.alpha = 1;
    this._startAlpha = null;
    this._targetAlpha = null;
    this._alphaDuration = 0;
    this._alphaElapsed = 0;
    this._alphaEaseType = "easeOut";
};

Sprite_Personazio.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateTargetPosition();
    this.updateTargetAlpha();
    this.updateTargetScale();
    this.updateTargetAngle();
};

Sprite_Personazio.prototype.updateTargetAngle = function() {
    if (this._targetAngle === null || this._angleDuration <= 0) return;

    this._angleElapsed = (this._angleElapsed || 0) + 1;
    const t = Math.min(this._angleElapsed / this._angleDuration, 1);
    const easedT = GBRO.Utils !== undefined ? GBRO.Utils.applyEasing(t, this._angleEaseType) : t;

    const newAngle = this._startAngle + (this._targetAngle - this._startAngle) * easedT;
    this.angle = newAngle;

    if (t >= 1) {
        this._targetAngle = null;
        this._angleDuration = 0;
        this.angle = this._targetAngle;
    }
};

Sprite_Personazio.prototype.setTargetAngle = function(angle, duration, easeType) {
    if (this.angle == angle) return;
    if (duration !== null && duration <= 0) {
        this.angle = angle;
        return;
    }
    this._startAngle = this.angle;
    this._targetAngle = angle;
    this._angleDuration = duration || 30;
    this._angleElapsed = 0;
    this._angleEaseType = easeType;
};

Sprite_Personazio.prototype.updateTargetPosition = function() {
    if (!this._targetPosition || this._moveDuration <= 0) return;
    this._moveElapsed = (this._moveElapsed || 0) + 1;
    const t = Math.min(this._moveElapsed / this._moveDuration, 1);
    const easedT = GBRO.Utils !== undefined ? GBRO.Utils.applyEasing(t, this._moveEaseType) : t;

    const startX = this._startPosition.x;
    const startY = this._startPosition.y;
    const targetX = this._targetPosition.x;
    const targetY = this._targetPosition.y;

    this.x = startX + (targetX - startX) * easedT;
    this.y = startY + (targetY - startY) * easedT;

    if (t >= 1) {
        this._targetPosition = null;
        this._moveDuration = 0;
    }
};

Sprite_Personazio.prototype.setTargetPosition = function(x, y, duration, easeType) {
    if (this.x == x && this.y == y) return;
    if (duration !== null && duration <= 0) {
        this.x = x;
        this.y = y;
        return;
    }
    this._startPosition = { x: this.x, y: this.y };
    this._targetPosition = { x, y };
    this._moveDuration = duration || 30;
    this._moveElapsed = 0;
    this._moveEaseType = easeType;
};

Sprite_Personazio.prototype.updateTargetAlpha = function() {
    if (this._targetAlpha == null || this._alphaDuration <= 0) return;

    this._alphaElapsed = (this._alphaElapsed || 0) + 1;
    const t = Math.min(this._alphaElapsed / this._alphaDuration, 1);
    const easedT = GBRO.Utils !== undefined ? GBRO.Utils.applyEasing(t, this._alphaEaseType) : t;

    const newAlpha = this._startAlpha + (this._targetAlpha - this._startAlpha) * easedT;
    this.alpha = newAlpha;

    if (t >= 1) {
        this._targetAlpha = null;
        this._alphaDuration = 0;
    }
};

Sprite_Personazio.prototype.setTargetAlpha = function(alpha, duration, easeType) {
    if (this.alpha == alpha) return;
    if (duration !== null && duration <= 0) {
        this.alpha = alpha;
        return;
    }
    this._startAlpha = this.alpha;
    this._targetAlpha = alpha;
    this._alphaDuration = duration || 30;
    this._alphaElapsed = 0;
    this._alphaEaseType = easeType;
};

Sprite_Personazio.prototype.updateTargetScale = function() {
    if (!this._targetScale || this._scaleDuration <= 0) return;

    this._scaleElapsed = (this._scaleElapsed || 0) + 1;
    const t = Math.min(this._scaleElapsed / this._scaleDuration, 1);
    const easedT = GBRO.Utils !== undefined ? GBRO.Utils.applyEasing(t, this._scaleEaseType) : t;

    const startX = this._startScale.x;
    const startY = this._startScale.y;
    const targetX = this._targetScale.x;
    const targetY = this._targetScale.y;

    this.scale.x = startX + (targetX - startX) * easedT;
    this.scale.y = startY + (targetY - startY) * easedT;

    if (t >= 1) {
        this._targetScale = null;
        this._scaleDuration = 0;
    }
};

Sprite_Personazio.prototype.setTargetScale = function(x, y, duration, easeType) {
    if (this.scale.x == x && this.scale.y == y) return;
    if (duration !== null && duration <= 0) {
        this.scale.x = x;
        this.scale.y = y;
        return;
    }
    this._startScale = { x: this.scale.x, y: this.scale.y };
    this._targetScale = { x, y };
    this._scaleDuration = duration || 30;
    this._scaleElapsed = 0;
    this._scaleEaseType = easeType;
};


function Sprite_PersonazioOtherCommand() {
    this.initialize(...arguments);
}

Sprite_PersonazioOtherCommand.prototype = Object.create(Sprite_Personazio.prototype);
Sprite_PersonazioOtherCommand.prototype.constructor = Sprite_PersonazioOtherCommand;

Sprite_PersonazioOtherCommand.prototype.initialize = function() {
    Sprite_Personazio.prototype.initialize.call(this);
    this._actorCommandWindow = null;
    this.createChildSprites();
};

Sprite_PersonazioOtherCommand.prototype.createChildSprites = function() {
    if (BattleManager.canEscape()) {
        this._circle2 = new Sprite_Personazio(ImageManager.loadSystem(GBRO.PersonazioBattleLayout.circ2Img));
        this._circle2.position.set(GBRO.PersonazioBattleLayout.circ2Pos[0], GBRO.PersonazioBattleLayout.circ2Pos[1]);
        this.addChild(this._circle2);

        this._circle1 = new Sprite_Personazio(ImageManager.loadSystem(GBRO.PersonazioBattleLayout.circ1Img));
        this._circle1.position.set(GBRO.PersonazioBattleLayout.circ1Pos[0], GBRO.PersonazioBattleLayout.circ1Pos[1]);
        this.addChild(this._circle1);

        this._escapeTxt = new Sprite_Personazio(ImageManager.loadSystem(GBRO.PersonazioBattleLayout.escapeImg));
        this._escapeTxt.position.set(GBRO.PersonazioBattleLayout.escapePos[0], GBRO.PersonazioBattleLayout.escapePos[1]);
        this.addChild(this._escapeTxt);
    }

    this._pControls = new Sprite_Personazio(ImageManager.loadSystem(GBRO.PersonazioBattleLayout.controlsImg));
    this._pControls.position.set(GBRO.PersonazioBattleLayout.controlsPos[0], GBRO.PersonazioBattleLayout.controlsPos[1]);
    this.addChild(this._pControls);
};

Sprite_PersonazioOtherCommand.prototype.update = function() {
    Sprite_Personazio.prototype.update.call(this);
    if (!this._actorCommandWindow) {
        this.visible = false;
        return;
    }

    if (this._circle2) this._circle2.angle += GBRO.PersonazioBattleLayout.circ2Pos[2];
    if (this._circle1) this._circle1.angle += GBRO.PersonazioBattleLayout.circ1Pos[2];

    this.visible = this._actorCommandWindow.actor() != null && this._actorCommandWindow.visible;
    this.alpha = this._actorCommandWindow.openness / 255;
};

Sprite_PersonazioOtherCommand.prototype.show = function() {
    this.visible = true;

    this.children.forEach(s => {
        s.alpha = 0;
        s.setTargetAlpha(1,10);
    })
};

Sprite_PersonazioOtherCommand.prototype.hide = function() {
    this.visible = false;

    this.children.forEach(s => {
        s.setTargetAlpha(0,10);
    })  
};

Sprite_PersonazioOtherCommand.prototype.setActorCommandWindow = function(actorCommand) {
    this._actorCommandWindow = actorCommand;
}

function Sprite_PersonazioActorCommand() {
    this.initialize(...arguments);
}

Sprite_PersonazioActorCommand.prototype = Object.create(Sprite.prototype);
Sprite_PersonazioActorCommand.prototype.constructor = Sprite_PersonazioActorCommand;

Sprite_PersonazioActorCommand.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._swayEnabled = GBRO.PersonazioBattleLayout.achSway;
    this._swayX = 0;
    this._swayY = 0;
    this._targetSway = null;
    this._swayElapsed = 0;
    this._swayDuration = 0;
    this._swayMaxOffset = GBRO.PersonazioBattleLayout.achSwayOffset;
    this._swayMinDuration = GBRO.PersonazioBattleLayout.achSwayMinDur;
    this._swayMaxDuration = GBRO.PersonazioBattleLayout.achSwayMaxDur;
    this._swayEaseType = "easeInOut";
    this._actorCommandWindow = null;
    this.createChildSprites();
};

Sprite_PersonazioActorCommand.prototype.createChildSprites = function() {
    this._pActorCommandBg = new Sprite_Personazio(ImageManager.loadSystem(GBRO.PersonazioBattleLayout.achBg));
    this._pActorCommandBg.position.set(GBRO.PersonazioBattleLayout.achBgPos[0], GBRO.PersonazioBattleLayout.achBgPos[1]);
    this.addChild(this._pActorCommandBg);

    this._pActorCommandCursor = new Sprite_Personazio(ImageManager.loadSystem(GBRO.PersonazioBattleLayout.achCursorImg));
    this.addChild(this._pActorCommandCursor);

    this._pActorCmndTxt1 = new Sprite_Personazio(ImageManager.loadSystem(GBRO.PersonazioBattleLayout.achCmnd1Img));
    this._pActorCmndTxt1.position.set(GBRO.PersonazioBattleLayout.achCmnd1Pos[0], GBRO.PersonazioBattleLayout.achCmnd1Pos[1]);
    this.addChild(this._pActorCmndTxt1);

    this._pActorCmndTxt2 = new Sprite_Personazio(ImageManager.loadSystem(GBRO.PersonazioBattleLayout.achCmnd2Img));
    this._pActorCmndTxt2.position.set(GBRO.PersonazioBattleLayout.achCmnd2Pos[0], GBRO.PersonazioBattleLayout.achCmnd2Pos[1]);
    this.addChild(this._pActorCmndTxt2);

    this._pActorCmndTxt3 = new Sprite_Personazio(ImageManager.loadSystem(GBRO.PersonazioBattleLayout.achCmnd3Img));
    this._pActorCmndTxt3.position.set(GBRO.PersonazioBattleLayout.achCmnd3Pos[0], GBRO.PersonazioBattleLayout.achCmnd3Pos[1]);
    this.addChild(this._pActorCmndTxt3);

    this._pActorCmndTxt4 = new Sprite_Personazio(ImageManager.loadSystem(GBRO.PersonazioBattleLayout.achCmnd4Img));
    this._pActorCmndTxt4.position.set(GBRO.PersonazioBattleLayout.achCmnd4Pos[0], GBRO.PersonazioBattleLayout.achCmnd4Pos[1]);
    this.addChild(this._pActorCmndTxt4);

    this._pActorCommandFg = new Sprite_Personazio(ImageManager.loadSystem(GBRO.PersonazioBattleLayout.achFg));
    this._pActorCommandFg.position.set(GBRO.PersonazioBattleLayout.achFgPos[0], GBRO.PersonazioBattleLayout.achFgPos[1]);
    this.addChild(this._pActorCommandFg);    
}

Sprite_PersonazioActorCommand.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateSway();

    if (!this._actorCommandWindow) {
        this.visible = false;
        return;
    }

    this.visible = this._actorCommandWindow.actor() != null && this._actorCommandWindow.visible;
    this.alpha = this._actorCommandWindow.openness / 255;

    switch (this._actorCommandWindow._index) {
        case 0:
            this._pActorCommandCursor.position.set(GBRO.PersonazioBattleLayout.achCmnd1CursorPos[0],GBRO.PersonazioBattleLayout.achCmnd1CursorPos[1]);
            this._pActorCommandCursor.rotation = GBRO.PersonazioBattleLayout.achCmnd1CursorPos[2] * (Math.PI/180);
            break;
        case 1:
            this._pActorCommandCursor.position.set(GBRO.PersonazioBattleLayout.achCmnd2CursorPos[0],GBRO.PersonazioBattleLayout.achCmnd2CursorPos[1]);
            this._pActorCommandCursor.rotation = GBRO.PersonazioBattleLayout.achCmnd2CursorPos[2];            
            break;
        case 2:
            this._pActorCommandCursor.position.set(GBRO.PersonazioBattleLayout.achCmnd3CursorPos[0],GBRO.PersonazioBattleLayout.achCmnd3CursorPos[1]);
            this._pActorCommandCursor.rotation = GBRO.PersonazioBattleLayout.achCmnd3CursorPos[2] * (Math.PI/180);
            break;
        case 3:
            this._pActorCommandCursor.position.set(GBRO.PersonazioBattleLayout.achCmnd4CursorPos[0], GBRO.PersonazioBattleLayout.achCmnd4CursorPos[1]);
            this._pActorCommandCursor.rotation = GBRO.PersonazioBattleLayout.achCmnd4CursorPos[2] * (Math.PI/180);
            break;
    }
};

Sprite_PersonazioActorCommand.prototype.updateSway = function() {
    if (!this._swayEnabled) return;

    this._swayElapsed = (this._swayElapsed || 0) + 1;
    this._swayDuration = this._swayDuration || 1;

    if (!this._targetSway) {
        const range = this._swayMaxOffset;
        this._targetSway = {
            x: (Math.random() * 2 - 1) * range,
            y: (Math.random() * 2 - 1) * range
        };

        this._startSway = {
            x: this._swayX || 0,
            y: this._swayY || 0
        };

        this._swayDuration = Math.floor(
            this._swayMinDuration + Math.random() * (this._swayMaxDuration - this._swayMinDuration)
        );
        this._swayElapsed = 0;
    } else {
        const t = Math.min(this._swayElapsed / this._swayDuration, 1);
        const easedT = GBRO.Utils !== undefined ? GBRO.Utils.applyEasing(t, this._swayEaseType) : t;

        const sx = this._startSway.x;
        const sy = this._startSway.y;
        const tx = this._targetSway.x;
        const ty = this._targetSway.y;

        this._swayX = sx + (tx - sx) * easedT;
        this._swayY = sy + (ty - sy) * easedT;

        if (t >= 1) {
            this._targetSway = null;
        }
    }

    this.x = this._swayX;
    this.y = this._swayY;
}

Sprite_PersonazioActorCommand.prototype.show = function() {
    this.visible = true;

    this._pActorCommandBg.alpha = 0;
    this._pActorCommandBg.setTargetAlpha(1, 10);

    this._pActorCmndTxt1.alpha = 0;
    this._pActorCmndTxt1.position.set(GBRO.PersonazioBattleLayout.achCmnd1Pos[2],GBRO.PersonazioBattleLayout.achCmnd1Pos[3]);
    this._pActorCmndTxt1.setTargetAlpha(1, 10);
    this._pActorCmndTxt1.setTargetPosition(GBRO.PersonazioBattleLayout.achCmnd1Pos[0], GBRO.PersonazioBattleLayout.achCmnd1Pos[1], 15, "easeOut");

    this._pActorCmndTxt2.alpha = 0;
    this._pActorCmndTxt2.position.set(GBRO.PersonazioBattleLayout.achCmnd2Pos[2],GBRO.PersonazioBattleLayout.achCmnd2Pos[3]);
    this._pActorCmndTxt2.setTargetAlpha(1, 10);
    this._pActorCmndTxt2.setTargetPosition(GBRO.PersonazioBattleLayout.achCmnd2Pos[0], GBRO.PersonazioBattleLayout.achCmnd2Pos[1], 15, "easeOut");

    this._pActorCmndTxt3.alpha = 0;
    this._pActorCmndTxt3.position.set(GBRO.PersonazioBattleLayout.achCmnd3Pos[2],GBRO.PersonazioBattleLayout.achCmnd3Pos[3]);
    this._pActorCmndTxt3.setTargetAlpha(1, 10);
    this._pActorCmndTxt3.setTargetPosition(GBRO.PersonazioBattleLayout.achCmnd3Pos[0], GBRO.PersonazioBattleLayout.achCmnd3Pos[1], 15, "easeOut");

    this._pActorCmndTxt4.alpha = 0;
    this._pActorCmndTxt4.position.set(GBRO.PersonazioBattleLayout.achCmnd4Pos[2],GBRO.PersonazioBattleLayout.achCmnd4Pos[3]);
    this._pActorCmndTxt4.setTargetAlpha(1, 10);
    this._pActorCmndTxt4.setTargetPosition(GBRO.PersonazioBattleLayout.achCmnd4Pos[0], GBRO.PersonazioBattleLayout.achCmnd4Pos[1], 15, "easeOut"); 
    
    this._pActorCommandFg.alpha = 0;
    this._pActorCommandFg.setTargetAlpha(1, 10);
};

Sprite_PersonazioActorCommand.prototype.hide = function() {
    this.visible = false;

    this._pActorCommandBg.setTargetAlpha(0, 5);
    this._pActorCommandFg.setTargetAlpha(0, 5);
    this._pActorCmndTxt1.setTargetAlpha(0, 5);
    this._pActorCmndTxt2.setTargetAlpha(0, 5);
    this._pActorCmndTxt3.setTargetAlpha(0, 5);    
    this._pActorCmndTxt4.setTargetAlpha(0, 5);    
};

Sprite_PersonazioActorCommand.prototype.setActorCommandWindow = function(actorCommand) {
    this._actorCommandWindow = actorCommand;
};