//=============================================================================
// VisuStella MZ - Map Camera Zoom
// VisuMZ_4_MapCameraZoom.js
//=============================================================================

var Imported = Imported || {};
Imported.VisuMZ_4_MapCameraZoom = true;

var VisuMZ = VisuMZ || {};
VisuMZ.MapCameraZoom = VisuMZ.MapCameraZoom || {};
VisuMZ.MapCameraZoom.version = 1.07;

//=============================================================================
 /*:
 * @target MZ
 * @plugindesc [RPG Maker MZ] [Tier 4] [Version 1.07] [MapCameraZoom]
 * @author VisuStella
 * @url http://www.yanfly.moe/wiki/Map_Camera_Zoom_VisuStella_MZ
 * @orderAfter VisuMZ_0_CoreEngine
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin enables the ability to zoom the in-game camera inward and make
 * the visible game area larger and more focused. The camera can also focus on
 * events or specific tiles other than just the player, making it helpful for
 * cutscenes. Easing accessibility also makes the zoom and camera shifts more
 * soft and less rough feeling.
 *
 * Features include all (but not limited to) the following:
 * 
 * * Zoom ability allows the camera to zoom inward and enlarge the focal point.
 * * Auto-zoom notetag allows for the camera to automatically shift when
 *   entering specific maps.
 * * Camera focus function allows the game camera to instantly move over to the
 *   target event or target tile.
 * * Easing accessibility allow for smoothing zooming and camera focus changes
 *   alongside dedicated wait time control.
 * * Wait for Zoom and Wait for Camera Focus plugin commands are available for
 *   more on the go flexibility in eventing.
 *
 * ============================================================================
 * Requirements
 * ============================================================================
 *
 * This plugin is made for RPG Maker MZ. This will not work in other iterations
 * of RPG Maker.
 *
 * ------ Tier 4 ------
 *
 * This plugin is a Tier 4 plugin. Place it under other plugins of lower tier
 * value on your Plugin Manager list (ie: 0, 1, 2, 3, 4, 5). This is to ensure
 * that your plugins will have the best compatibility with the rest of the
 * VisuStella MZ library.
 *
 * ============================================================================
 * Caution
 * ============================================================================
 * 
 * When using this plugin, there are things to be cautious about.
 * 
 * ---
 * 
 * Screen Tearing
 * 
 * When using non-whole odd numbers like 1.3, 1.5, and 1.7, the likelihood of
 * there being a "screen tearing" effect for the tilemap or for sprites is
 * greatly increased. This can be avoided by having sprites with a pixel-worth
 * of buffering space or by just simply avoiding to use non-whole odd numbers
 * altogether.
 * 
 * ---
 *
 * ============================================================================
 * Major Changes
 * ============================================================================
 *
 * This plugin adds some new hard-coded features to RPG Maker MZ's functions.
 * The following is a list of them.
 *
 * ---
 *
 * Cannot Go Under 100%
 * 
 * You can zoom in (aka go above 100% zoom), but you cannot zoom out (aka go
 * under 100% zoom). The reasoning behind this is because of the limitation
 * between PixiJS and WebGL. Going under 100% zoom will break the tilemap and
 * cause large chunks of it to go missing.
 * 
 * This is true even without this plugin installed as you can try to use the
 * innate RPG Maker MZ zoom functions and try to set the zoom scale under 100%.
 * The tileset will immediately start to fall apart.
 *
 * ---
 * 
 * Sprites No Longer Smoothed
 * 
 * When using this plugin, certain resources like on-map character sprites and
 * some tile sprites will have bitmap smoothing removed. The reason for this is
 * due to PixiJS's texture bleeding problem when the sprites are zoomed in. If
 * left alone, this causes an ugly filmy border around the edges of the
 * sprite's dimensions that are otherwise an eye-sore to look at.
 * 
 * ---
 *
 * ============================================================================
 * VisuStella MZ Compatibility
 * ============================================================================
 *
 * While this plugin is compatible with the majority of the VisuStella MZ
 * plugin library, it is not compatible with specific plugins or specific
 * features. This section will highlight the main plugins/features that will
 * not be compatible with this plugin or put focus on how the make certain
 * features compatible.
 *
 * ---
 * 
 * VisuMZ_0_CoreEngine
 * 
 * Having the VisuMZ Core Engine installed will enable you to use easing when
 * it comes to zooming and camera panning.
 * 
 * ---
 * 
 * Picture Zooming
 * 
 * If you are NOT using the VisuMZ Core Engine, pictures will be bound to the
 * zoom scale. This is NOT a bug. If you are using pictures in a completely
 * vanilla RPG Maker MZ project without any plugins installed and enter a
 * battle, the battle zoom will also make the pictures zoom in as well.
 * 
 * ---
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * The following are notetags that have been added through this plugin. These
 * notetags will not work with your game if this plugin is OFF or not present.
 *
 * ---
 * 
 * === Map-Related Notetags ===
 * 
 * ---
 *
 * <Zoom: x%>
 * <AutoZoom: x%>
 * <Auto Zoom: x%>
 *
 * - Used for: Map Notetags
 * - Causes the game camera to automatically zoom to x% when entering a map
 *   with this notetag.
 *   - This does NOT reverse itself when exiting the map. The zoom settings
 *     will carry over to other maps unless those maps have their own auto-zoom
 *     notetag present.
 * - The notetag variants do the same thing. Which you choose to use is
 *   entirely up to personal preference.
 * - Replace 'x' with a percentage value above 100% to represent the zoom scale
 *   you wish to change to when entering this map.
 *   - 'x' cannot be under 100%! Read the "Cannot Go Under 100%" section for
 *     more information as to why.
 *
 * ---
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 *
 * The following are Plugin Commands that come with this plugin. They can be
 * accessed through the Plugin Command event command.
 *
 * ---
 * 
 * === Camera Plugin Commands ===
 * 
 * ---
 *
 * Camera: Focus Player
 * - Puts the camera focus on the player character.
 *
 *   Duration:
 *   - How many frames should it take to finish focus?
 *   - 60 frames = 1 second.
 *
 *   Easing Type:
 *   - Select which easing type you wish to apply.
 *   - Requires VisuMZ_0_CoreEngine!
 *
 * ---
 *
 * Camera: Focus Target Event
 * - Puts the camera focus on target event.
 *
 *   Event ID:
 *   - Insert the ID of the event to focus on.
 *   - Use 0 for this event.
 *   - You may use JavaScript code.
 *
 *   Duration:
 *   - How many frames should it take to finish focus?
 *   - 60 frames = 1 second.
 *
 *   Easing Type:
 *   - Select which easing type you wish to apply.
 *   - Requires VisuMZ_0_CoreEngine!
 *
 * ---
 *
 * Camera: Focus Target Tile
 * - Puts the camera focus on target map tile.
 *
 *   Map Tile X:
 *   - What is the X coordinate of the target map tile?
 *   - You may use JavaScript code.
 *
 *   Map Tile Y:
 *   - What is the Y coordinate of the target map tile?
 *   - You may use JavaScript code.
 *
 *   Duration:
 *   - How many frames should it take to finish focus?
 *   - 60 frames = 1 second.
 *
 *   Easing Type:
 *   - Select which easing type you wish to apply.
 *   - Requires VisuMZ_0_CoreEngine!
 *
 * ---
 *
 * Camera: Wait for Focus
 * - Waits for camera focus to finish changing before continuing.
 *
 * ---
 * 
 * === Zoom Plugin Commands ===
 * 
 * ---
 *
 * Zoom: Change Zoom
 * - Change the current zoom amount.
 *
 *   Target Zoom Scale:
 *   - What is the target zoom scale?
 *   - 1.0 = 100%; 1.5 = 150%; 2.0 = 200%;
 *   - Cannot go under 1.0!
 *
 *   Duration:
 *   - How many frames should it take to finish zooming?
 *   - 60 frames = 1 second.
 *
 *   Easing Type:
 *   - Select which easing type you wish to apply.
 *   - Requires VisuMZ_0_CoreEngine!
 *
 * ---
 *
 * Zoom: Wait for Zoom
 * - Waits for zoom to finish changing before continuing.
 *
 * ---
 *
 * ============================================================================
 * Plugin Parameters: General Settings
 * ============================================================================
 *
 * These are the general settings used for the Map Camera Zoom plugin.
 *
 * ---
 *
 * Settings
 * 
 *   Default Zoom:
 *   - What is the default zoom value?
 *   - 1.0 = 100%; 1.5 = 150%; 2.0 = 200%;
 *   - Cannot go under 1.0!
 * 
 *   Adapt Battle Encounter Ani:
 *   - Adapt the battle encounter zoom effect?
 *   - Occurs when entering battle from the map.
 * 
 *   Force Pixelated Map:
 *   - Force the map's tilesets to be rendered in pixelated form regardless of
 *     what other plugins may do.
 *   - This is primarily for pixel art games that would look better with more
 *     pixelated tiles when zoomed in.
 *
 * ---
 * 
 * Compatibility
 * 
 *   Map Lock Adjust:
 *   - Adjusts the Map Lock effect to the map's display position when exiting
 *     menus.
 *   - For VisuMZ_4_VisualParallaxes.
 *   - Best left false unless you know what you're doing.
 * 
 * ---
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *
 * 1. These plugins may be used in free or commercial games provided that they
 * have been acquired through legitimate means at VisuStella.com and/or any
 * other official approved VisuStella sources. Exceptions and special
 * circumstances that may prohibit usage will be listed on VisuStella.com.
 * 
 * 2. All of the listed coders found in the Credits section of this plugin must
 * be given credit in your games or credited as a collective under the name:
 * "VisuStella".
 * 
 * 3. You may edit the source code to suit your needs, so long as you do not
 * claim the source code belongs to you. VisuStella also does not take
 * responsibility for the plugin if any changes have been made to the plugin's
 * code, nor does VisuStella take responsibility for user-provided custom code
 * used for custom control effects including advanced JavaScript notetags
 * and/or plugin parameters that allow custom JavaScript code.
 * 
 * 4. You may NOT redistribute these plugins nor take code from this plugin to
 * use as your own. These plugins and their code are only to be downloaded from
 * VisuStella.com and other official/approved VisuStella sources. A list of
 * official/approved sources can also be found on VisuStella.com.
 *
 * 5. VisuStella is not responsible for problems found in your game due to
 * unintended usage, incompatibility problems with plugins outside of the
 * VisuStella MZ library, plugin versions that aren't up to date, nor
 * responsible for the proper working of compatibility patches made by any
 * third parties. VisuStella is not responsible for errors caused by any
 * user-provided custom code used for custom control effects including advanced
 * JavaScript notetags and/or plugin parameters that allow JavaScript code.
 *
 * 6. If a compatibility patch needs to be made through a third party that is
 * unaffiliated with VisuStella that involves using code from the VisuStella MZ
 * library, contact must be made with a member from VisuStella and have it
 * approved. The patch would be placed on VisuStella.com as a free download
 * to the public. Such patches cannot be sold for monetary gain, including
 * commissions, crowdfunding, and/or donations.
 * 
 * 7. If this VisuStella MZ plugin is a paid product, all project team members
 * must purchase their own individual copies of the paid product if they are to
 * use it. Usage includes working on related game mechanics, managing related
 * code, and/or using related Plugin Commands and features. Redistribution of
 * the plugin and/or its code to other members of the team is NOT allowed
 * unless they own the plugin itself as that conflicts with Article 4.
 * 
 * 8. Any extensions and/or addendums made to this plugin's Terms of Use can be
 * found on VisuStella.com and must be followed.
 *
 * ============================================================================
 * Credits
 * ============================================================================
 * 
 * If you are using this plugin, credit the following people in your game:
 * 
 * Team VisuStella
 * * Arisu
 * * Irina
 * * Olivia
 * * Yanfly
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * 
 * Version 1.07: December 19, 2024
 * * Compatibility Update!
 * ** Added better compatibility with outside plugins when doing battle
 *    transitions. Camera will automatically focus the player if the 
 *    "Adapt Battle Encounter Ani" is enabled.
 * ** Added better compatibility with VisuMZ's Event Title Scene plugin.
 * 
 * Version 1.06: October 17, 2024
 * * Compatibility Update!
 * ** Added better compatibility with Visual Parallaxes when using plugin
 *    commands to focus scroll.
 * 
 * Version 1.05: July 18, 2024
 * * Compatibility Update!
 * ** Plugin now works better with Movement Core's smooth scroll.
 * 
 * Version 1.04: April 18, 2024
 * * Documentation Update!
 * ** Help file updated for new features.
 * * New Features!
 * ** New Plugin Parameter added by Arisu:
 * *** Plugin Parameters > Compatibility > Map Lock Adjust
 * **** Adjusts the Map Lock effect to the map's display position when exiting
 *      menus.
 * **** For VisuMZ_4_VisualParallaxes.
 * **** Best left false unless you know what you're doing.
 * 
 * Version 1.03: March 14, 2024
 * * Documentation Update!
 * ** Help file updated for new features.
 * ** Added a new section called "Caution":
 * *** When using non-whole odd numbers like 1.3, 1.5, and 1.7, the likelihood
 *     of there being a "screen tearing" effect for the tilemap or for sprites
 *     is greatly increased. This can be avoided by having sprites with a
 *     pixel-worth of buffering space or by just simply avoiding to use
 *     non-whole odd numbers altogether.
 * * New Features!
 * ** New Plugin Parameter added by Irina:
 * *** Plugin Parameters > Force Pixelated Map
 * **** Force the map's tilesets to be rendered in pixelated form regardless of
 *      what other plugins may do.
 * **** This is primarily for pixel art games that would look better with more
 *      pixelated tiles when zoomed in.
 * 
 * Version 1.02: July 13, 2023
 * * Optimization Update!
 * ** Plugin should run more optimized.
 * 
 * Version 1.01: March 16, 2023
 * * Compatibility Update
 * ** Better camera zoom with VisuStella MZ Movement Effect's Smooth Scrolling
 *    when this plugin's 'Adapt Battle Encounter Ani' setting is turned off.
 * 
 * Version 1.00 Official Release Date: November 2, 2022
 * * Finished Plugin!
 *
 * ============================================================================
 * End of Helpfile
 * ============================================================================
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Begin
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command CameraFocusPlayer
 * @text Camera: Focus Player
 * @desc Puts the camera focus on the player character.
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How many frames should it take to finish focus?
 * 60 frames = 1 second.
 * @default 60
 *
 * @arg EasingType:str
 * @text Easing Type
 * @type combo
 * @option Linear
 * @option InSine
 * @option OutSine
 * @option InOutSine
 * @option InQuad
 * @option OutQuad
 * @option InOutQuad
 * @option InCubic
 * @option OutCubic
 * @option InOutCubic
 * @option InQuart
 * @option OutQuart
 * @option InOutQuart
 * @option InQuint
 * @option OutQuint
 * @option InOutQuint
 * @option InExpo
 * @option OutExpo
 * @option InOutExpo
 * @option InCirc
 * @option OutCirc
 * @option InOutCirc
 * @option InBack
 * @option OutBack
 * @option InOutBack
 * @option InElastic
 * @option OutElastic
 * @option InOutElastic
 * @option InBounce
 * @option OutBounce
 * @option InOutBounce
 * @desc Select which easing type you wish to apply.
 * Requires VisuMZ_0_CoreEngine!
 * @default InOutSine
 *
 * @ --------------------------------------------------------------------------
 *
 * @command CameraFocusTargetEvent
 * @text Camera: Focus Target Event
 * @desc Puts the camera focus on target event.
 *
 * @arg EventID:eval
 * @text Event ID
 * @desc Insert the ID of the event to focus on.
 * Use 0 for this event. You may use JavaScript code.
 * @default 0
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How many frames should it take to finish focus?
 * 60 frames = 1 second.
 * @default 60
 *
 * @arg EasingType:str
 * @text Easing Type
 * @type combo
 * @option Linear
 * @option InSine
 * @option OutSine
 * @option InOutSine
 * @option InQuad
 * @option OutQuad
 * @option InOutQuad
 * @option InCubic
 * @option OutCubic
 * @option InOutCubic
 * @option InQuart
 * @option OutQuart
 * @option InOutQuart
 * @option InQuint
 * @option OutQuint
 * @option InOutQuint
 * @option InExpo
 * @option OutExpo
 * @option InOutExpo
 * @option InCirc
 * @option OutCirc
 * @option InOutCirc
 * @option InBack
 * @option OutBack
 * @option InOutBack
 * @option InElastic
 * @option OutElastic
 * @option InOutElastic
 * @option InBounce
 * @option OutBounce
 * @option InOutBounce
 * @desc Select which easing type you wish to apply.
 * Requires VisuMZ_0_CoreEngine!
 * @default InOutSine
 *
 * @ --------------------------------------------------------------------------
 *
 * @command CameraFocusTargetTile
 * @text Camera: Focus Target Tile
 * @desc Puts the camera focus on target map tile.
 *
 * @arg MapX:eval
 * @text Map Tile X
 * @desc What is the X coordinate of the target map tile?
 * You may use JavaScript code.
 * @default 0
 *
 * @arg MapY:eval
 * @text Map Tile Y
 * @desc What is the Y coordinate of the target map tile?
 * You may use JavaScript code.
 * @default 0
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How many frames should it take to finish focus?
 * 60 frames = 1 second.
 * @default 60
 *
 * @arg EasingType:str
 * @text Easing Type
 * @type combo
 * @option Linear
 * @option InSine
 * @option OutSine
 * @option InOutSine
 * @option InQuad
 * @option OutQuad
 * @option InOutQuad
 * @option InCubic
 * @option OutCubic
 * @option InOutCubic
 * @option InQuart
 * @option OutQuart
 * @option InOutQuart
 * @option InQuint
 * @option OutQuint
 * @option InOutQuint
 * @option InExpo
 * @option OutExpo
 * @option InOutExpo
 * @option InCirc
 * @option OutCirc
 * @option InOutCirc
 * @option InBack
 * @option OutBack
 * @option InOutBack
 * @option InElastic
 * @option OutElastic
 * @option InOutElastic
 * @option InBounce
 * @option OutBounce
 * @option InOutBounce
 * @desc Select which easing type you wish to apply.
 * Requires VisuMZ_0_CoreEngine!
 * @default InOutSine
 *
 * @ --------------------------------------------------------------------------
 *
 * @command CameraFocusWait
 * @text Camera: Wait for Focus
 * @desc Waits for camera focus to finish changing before continuing.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_Zoom
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ZoomChange
 * @text Zoom: Change Zoom
 * @desc Change the current zoom amount.
 *
 * @arg TargetScale:num
 * @text Target Zoom Scale
 * @desc What is the target zoom scale?
 * 1.0 = 100%; 1.5 = 150%; 2.0 = 200%; Cannot go under 1.0!
 * @default 1.0
 *
 * @arg Duration:num
 * @text Duration
 * @type number
 * @min 1
 * @desc How many frames should it take to finish zooming?
 * 60 frames = 1 second.
 * @default 60
 *
 * @arg EasingType:str
 * @text Easing Type
 * @type combo
 * @option Linear
 * @option InSine
 * @option OutSine
 * @option InOutSine
 * @option InQuad
 * @option OutQuad
 * @option InOutQuad
 * @option InCubic
 * @option OutCubic
 * @option InOutCubic
 * @option InQuart
 * @option OutQuart
 * @option InOutQuart
 * @option InQuint
 * @option OutQuint
 * @option InOutQuint
 * @option InExpo
 * @option OutExpo
 * @option InOutExpo
 * @option InCirc
 * @option OutCirc
 * @option InOutCirc
 * @option InBack
 * @option OutBack
 * @option InOutBack
 * @option InElastic
 * @option OutElastic
 * @option InOutElastic
 * @option InBounce
 * @option OutBounce
 * @option InOutBounce
 * @desc Select which easing type you wish to apply.
 * Requires VisuMZ_0_CoreEngine!
 * @default InOutSine
 *
 * @ --------------------------------------------------------------------------
 *
 * @command ZoomWait
 * @text Zoom: Wait for Zoom
 * @desc Waits for zoom to finish changing before continuing.
 *
 * @ --------------------------------------------------------------------------
 *
 * @command Separator_End
 * @text -
 * @desc -
 *
 * @ --------------------------------------------------------------------------
 *
 * @ ==========================================================================
 * @ Plugin Parameters
 * @ ==========================================================================
 *
 * @param BreakHead
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param MapCameraZoom
 * @default Plugin Parameters
 *
 * @param ATTENTION
 * @default READ THE HELP FILE
 *
 * @param BreakSettings
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param DefaultZoom:num
 * @text Default Zoom
 * @desc What is the default zoom value?
 * 1.0 = 100%; 1.5 = 150%; 2.0 = 200%; Cannot go under 1.0!
 * @default 1.0
 *
 * @param AdaptBattleEncZoom:eval
 * @text Adapt Battle Encounter Ani
 * @parent Animation
 * @type boolean
 * @on Adapt
 * @off Unchanged
 * @desc Adapt the battle encounter zoom effect?
 * Occurs when entering battle from the map.
 * @default true
 *
 * @param ForcePixelatedMap:eval
 * @text Force Pixelated Map
 * @parent Animation
 * @type boolean
 * @on Force
 * @off Don't Force
 * @desc Force the map's tilesets to be rendered in pixelated form
 * regardless of what other plugins may do.
 * @default false
 * 
 * @param Compatibility
 * @text Compatability Parameters
 *
 * @param VisualParallaxAdjust:eval
 * @text Map Lock Adjust
 * @parent Compatibility
 * @type boolean
 * @on Adjust
 * @off Don't Adjust
 * @desc Adjusts the Map Lock effect to the map's display position
 * when exiting menus. For VisuMZ_4_VisualParallaxes.
 * @default false
 *
 * @param BreakEnd1
 * @text --------------------------
 * @default ----------------------------------
 *
 * @param End Of
 * @default Plugin Parameters
 *
 * @param BreakEnd2
 * @text --------------------------
 * @default ----------------------------------
 *
 */
//=============================================================================

const _0x3adba7=_0x5c34;function _0x489a(){const _0x3767a3=['ZoomChange','_spriteset','Zoom\x20cannot\x20go\x20under\x20100%.','isNextScene','_mapZoomSettings','3854972BYCpWm','Game_Interpreter_PluginCommand','4urOaWn','isFurnitureSystemMode','_waitMode','_mapZoomEnterBattle','_mapEnterBattleZoom','Game_Screen_zoomScale','exit','_displayX','mapCameraSettings','ImageManager_loadCharacter','updateMapCameraFocus','updateParallax','startMapZoom','mapCameraFocusTarget','updateMapScrollLinkedCenteredParallax','updateScroll','718050KHjMnm','setMapCameraFocusToPlayer','Game_Screen_initialize','centerX','setup','RPGMAKER_VERSION','DefaultZoom','%1\x20is\x20incorrectly\x20placed\x20on\x20the\x20plugin\x20list.\x0aIt\x20is\x20a\x20Tier\x20%2\x20plugin\x20placed\x20over\x20other\x20Tier\x20%3\x20plugins.\x0aPlease\x20reorder\x20the\x20plugin\x20list\x20from\x20smallest\x20to\x20largest\x20tier\x20numbers.','updateEncounterEffect','updateMapZoom','Game_Map_parallaxOx','initialize','setupMapZoomSettings','MAX_GL_TEXTURES','setupMapCameraZoomNotetags','update','tileFocus','1467186iAGRwx','%1\x27s\x20version\x20does\x20not\x20match\x20plugin\x27s.\x20Please\x20update\x20it\x20in\x20the\x20Plugin\x20Manager.','isChangingMapCameraFocusTargets','_parallaxX','command357','7uoAIjx','AdaptBattleEncZoom','mapZoomSettings','isLoopVertical','format','zoomScale','match','setCurrentCameraFocusTile','_parallaxSy','updateMapZoomPosition','ConvertParams','clamp','Game_Map_setup','updateMapCameraFocusSmooth','Game_Map_updateParallax','IconSet','scrolledX','tileHeight','return\x200','loadTileset','smooth','height','onUpdateMapCameraFocusEnd','Renderer','ARRAYNUM','constructor','Game_Screen_setZoom','setZoom','1.1.0','setBattleEncounterZoom','ApplyEasing','targetScale','_animation','isSmoothCameraEnabled','toUpperCase','2739018kSSTIg','VisuMZ_2_MovementEffects','onUpdateMapZoomEnd','allowExtendMapZoom','center','mapZoom','_mapCameraSettings','easingType','isInAirship','Game_Screen_updateZoom','_scene','canSmoothScroll','shouldCenterMapCameraZoom','max','EVAL','name','meetsVisualParallaxMapScrollLinkRequirements','isSceneMap','parse','trim','map','VisualParallaxAdjust','Settings','_parallaxZero','tileCoordinates','_mapCameraParallaxUpdates','duration','ForcePixelatedMap','registerCommand','MapCameraZoom','setupMapCameraZoom','playerFocus','Scene_Map_updateEncounterEffect','parameters','RegExp','screenTileY','isMapCameraFocusTarget','prototype','mod','Game_Map_screenTileX','isPreviousScene','Game_Player_updateScroll','call','resize','ImageManager_loadSystem','CameraFocusTargetEvent','setupMapCameraSettings','6939856caytcS','eventFocus','start','18OvhGim','MIN_ZOOM','eventId','ARRAYEVAL','parallaxOx','%1\x20is\x20missing\x20a\x20required\x20plugin.\x0aPlease\x20install\x20%2\x20into\x20the\x20Plugin\x20Manager.','ZoomWait','Game_Map_parallaxOy','position','Game_Event_update','setMapCameraFocusToEvent','EasingType','4814220rAOxaB','updateZoom','FUNC','AutoZoom','currentCamera','BaseRenderTexture','Game_Player_clearTransferInfo','JSON','mapZoomEnterBattleSettings','applyEasing','roundX','STRUCT','updateMapCameraCenteredParallax','floor','wholeDuration','centerY','_parallaxY','MAP_ZOOM_ENTER_BATTLE_ADAPT','setWaitMode','setMapCameraFocusToTile','CameraFocusPlayer','status','ImageManager_loadTileset','_lastPluginCommandInterpreter','displayY','DEFAULT_MAP_ZOOM_SCALE','width','centerMapCameraZoom','_parallaxLoopX','Linear','Sprite_AnimationMV_updatePosition','_realX','scale','clearTransferInfo','_realY','_internalTextures','updatePosition','CameraFocusWait','updateWaitMode','Scene_Map_start','STR','eventTargetID','Game_Map_screenTileY','_displayY','Duration','loadCharacter','push','EventID','description','_visualParallaxSettings','setLastPluginCommandInterpreter','setDisplayPosMapCameraZoom','loadSystem','getLastPluginCommandInterpreter','_parallaxSx','Game_Interpreter_updateWaitMode','21657730FEnQvO','xScrollLinkedOffset','mapCameraFocus','getVisualParallaxes','includes','VisuMZ_2_FurnitureSystem','VisuMZ_4_VisualParallaxes','isLoopHorizontal','isInstanceOfSceneMap','ARRAYJSON','parent','tileWidth','NEAREST','Game_System_isSmoothCameraEnabled'];_0x489a=function(){return _0x3767a3;};return _0x489a();}(function(_0x40a868,_0x33d1d9){const _0x1df6d9=_0x5c34,_0x48b934=_0x40a868();while(!![]){try{const _0x1abf94=parseInt(_0x1df6d9(0x243))/0x1+-parseInt(_0x1df6d9(0x233))/0x2*(-parseInt(_0x1df6d9(0x254))/0x3)+parseInt(_0x1df6d9(0x231))/0x4+parseInt(_0x1df6d9(0x1e6))/0x5+-parseInt(_0x1df6d9(0x27c))/0x6*(-parseInt(_0x1df6d9(0x259))/0x7)+parseInt(_0x1df6d9(0x1d7))/0x8+-parseInt(_0x1df6d9(0x1da))/0x9*(parseInt(_0x1df6d9(0x21e))/0xa);if(_0x1abf94===_0x33d1d9)break;else _0x48b934['push'](_0x48b934['shift']());}catch(_0x433f43){_0x48b934['push'](_0x48b934['shift']());}}}(_0x489a,0x96320));var label='MapCameraZoom',tier=tier||0x0,dependencies=[],pluginData=$plugins['filter'](function(_0x9f21c5){const _0x518a39=_0x5c34;return _0x9f21c5[_0x518a39(0x1fb)]&&_0x9f21c5[_0x518a39(0x216)][_0x518a39(0x222)]('['+label+']');})[0x0];function _0x5c34(_0x174aea,_0x5763ed){const _0x489a8f=_0x489a();return _0x5c34=function(_0x5c34fb,_0x3aa399){_0x5c34fb=_0x5c34fb-0x1c5;let _0x5868a1=_0x489a8f[_0x5c34fb];return _0x5868a1;},_0x5c34(_0x174aea,_0x5763ed);}VisuMZ[label][_0x3adba7(0x292)]=VisuMZ[label][_0x3adba7(0x292)]||{},VisuMZ['ConvertParams']=function(_0x35bc1c,_0x38f28a){const _0x1dbc5e=_0x3adba7;for(const _0x5a1293 in _0x38f28a){if(_0x5a1293['match'](/(.*):(.*)/i)){const _0x58612b=String(RegExp['$1']),_0x317a39=String(RegExp['$2'])[_0x1dbc5e(0x27b)]()[_0x1dbc5e(0x28f)]();let _0x5af4a9,_0x558f87,_0x361aed;switch(_0x317a39){case'NUM':_0x5af4a9=_0x38f28a[_0x5a1293]!==''?Number(_0x38f28a[_0x5a1293]):0x0;break;case _0x1dbc5e(0x271):_0x558f87=_0x38f28a[_0x5a1293]!==''?JSON[_0x1dbc5e(0x28e)](_0x38f28a[_0x5a1293]):[],_0x5af4a9=_0x558f87[_0x1dbc5e(0x290)](_0x5a7d1e=>Number(_0x5a7d1e));break;case _0x1dbc5e(0x28a):_0x5af4a9=_0x38f28a[_0x5a1293]!==''?eval(_0x38f28a[_0x5a1293]):null;break;case _0x1dbc5e(0x1dd):_0x558f87=_0x38f28a[_0x5a1293]!==''?JSON[_0x1dbc5e(0x28e)](_0x38f28a[_0x5a1293]):[],_0x5af4a9=_0x558f87[_0x1dbc5e(0x290)](_0x53964a=>eval(_0x53964a));break;case _0x1dbc5e(0x1ed):_0x5af4a9=_0x38f28a[_0x5a1293]!==''?JSON[_0x1dbc5e(0x28e)](_0x38f28a[_0x5a1293]):'';break;case _0x1dbc5e(0x227):_0x558f87=_0x38f28a[_0x5a1293]!==''?JSON[_0x1dbc5e(0x28e)](_0x38f28a[_0x5a1293]):[],_0x5af4a9=_0x558f87['map'](_0x290487=>JSON[_0x1dbc5e(0x28e)](_0x290487));break;case _0x1dbc5e(0x1e8):_0x5af4a9=_0x38f28a[_0x5a1293]!==''?new Function(JSON[_0x1dbc5e(0x28e)](_0x38f28a[_0x5a1293])):new Function(_0x1dbc5e(0x26b));break;case'ARRAYFUNC':_0x558f87=_0x38f28a[_0x5a1293]!==''?JSON[_0x1dbc5e(0x28e)](_0x38f28a[_0x5a1293]):[],_0x5af4a9=_0x558f87[_0x1dbc5e(0x290)](_0x4e4e7f=>new Function(JSON[_0x1dbc5e(0x28e)](_0x4e4e7f)));break;case _0x1dbc5e(0x20e):_0x5af4a9=_0x38f28a[_0x5a1293]!==''?String(_0x38f28a[_0x5a1293]):'';break;case'ARRAYSTR':_0x558f87=_0x38f28a[_0x5a1293]!==''?JSON[_0x1dbc5e(0x28e)](_0x38f28a[_0x5a1293]):[],_0x5af4a9=_0x558f87[_0x1dbc5e(0x290)](_0x2b9e11=>String(_0x2b9e11));break;case _0x1dbc5e(0x1f1):_0x361aed=_0x38f28a[_0x5a1293]!==''?JSON[_0x1dbc5e(0x28e)](_0x38f28a[_0x5a1293]):{},_0x5af4a9=VisuMZ['ConvertParams']({},_0x361aed);break;case'ARRAYSTRUCT':_0x558f87=_0x38f28a[_0x5a1293]!==''?JSON[_0x1dbc5e(0x28e)](_0x38f28a[_0x5a1293]):[],_0x5af4a9=_0x558f87['map'](_0x5a5605=>VisuMZ['ConvertParams']({},JSON['parse'](_0x5a5605)));break;default:continue;}_0x35bc1c[_0x58612b]=_0x5af4a9;}}return _0x35bc1c;},(_0xafe5be=>{const _0x3bd5f3=_0x3adba7,_0x1797ce=_0xafe5be[_0x3bd5f3(0x28b)];for(const _0x28484e of dependencies){if(!Imported[_0x28484e]){alert(_0x3bd5f3(0x1df)['format'](_0x1797ce,_0x28484e)),SceneManager[_0x3bd5f3(0x239)]();break;}}const _0x2667ef=_0xafe5be[_0x3bd5f3(0x216)];if(_0x2667ef[_0x3bd5f3(0x25f)](/\[Version[ ](.*?)\]/i)){const _0x8a90b6=Number(RegExp['$1']);_0x8a90b6!==VisuMZ[label]['version']&&(alert(_0x3bd5f3(0x255)[_0x3bd5f3(0x25d)](_0x1797ce,_0x8a90b6)),SceneManager[_0x3bd5f3(0x239)]());}if(_0x2667ef[_0x3bd5f3(0x25f)](/\[Tier[ ](\d+)\]/i)){const _0x3eb382=Number(RegExp['$1']);_0x3eb382<tier?(alert(_0x3bd5f3(0x24a)['format'](_0x1797ce,_0x3eb382,tier)),SceneManager[_0x3bd5f3(0x239)]()):tier=Math['max'](_0x3eb382,tier);}VisuMZ[_0x3bd5f3(0x263)](VisuMZ[label]['Settings'],_0xafe5be[_0x3bd5f3(0x1c9)]);})(pluginData),((()=>{const _0x399c1e=_0x3adba7;Utils[_0x399c1e(0x248)]<_0x399c1e(0x275)&&(alert('Map\x20Camera\x20Zoom\x20requires\x20RPG\x20Maker\x20MZ\x20version\x201.1.0\x20or\x20above.'),SceneManager['exit']());})()),PluginManager[_0x3adba7(0x298)](pluginData['name'],_0x3adba7(0x1fa),_0x4db1be=>{const _0x24d2f1=_0x3adba7;if(!SceneManager[_0x24d2f1(0x226)]())return;if($gamePlayer['isMapCameraFocusTarget']())return;VisuMZ[_0x24d2f1(0x263)](_0x4db1be,_0x4db1be);const _0x4da047=_0x4db1be['Duration']||0x1,_0x310119=_0x4db1be[_0x24d2f1(0x1e5)]||_0x24d2f1(0x203);$gameScreen[_0x24d2f1(0x244)](_0x4da047,_0x310119);}),PluginManager[_0x3adba7(0x298)](pluginData[_0x3adba7(0x28b)],_0x3adba7(0x1d5),_0x10ca9a=>{const _0x51bb9f=_0x3adba7;if(!SceneManager[_0x51bb9f(0x226)]())return;VisuMZ[_0x51bb9f(0x263)](_0x10ca9a,_0x10ca9a);const _0x1cd9e2=$gameTemp[_0x51bb9f(0x21b)](),_0x71f1e5=_0x10ca9a[_0x51bb9f(0x215)]||_0x1cd9e2[_0x51bb9f(0x1dc)](),_0x2c5c4=$gameMap['event'](_0x71f1e5),_0x45ce69=_0x10ca9a[_0x51bb9f(0x212)]||0x1,_0x4464f8=_0x10ca9a['EasingType']||_0x51bb9f(0x203);if(!_0x2c5c4)return;$gameScreen[_0x51bb9f(0x1e4)](_0x71f1e5,_0x45ce69,_0x4464f8);}),PluginManager['registerCommand'](pluginData['name'],'CameraFocusTargetTile',_0x582cb8=>{const _0x1695a2=_0x3adba7;if(!SceneManager['isInstanceOfSceneMap']())return;VisuMZ[_0x1695a2(0x263)](_0x582cb8,_0x582cb8);const _0xcf0af=_0x582cb8['MapX'][_0x1695a2(0x264)](0x0,$gameMap[_0x1695a2(0x200)]()-0x1),_0x4c0306=_0x582cb8['MapY'][_0x1695a2(0x264)](0x0,$gameMap[_0x1695a2(0x26e)]()-0x1),_0x477aa9=_0x582cb8[_0x1695a2(0x212)]||0x1,_0x448b79=_0x582cb8[_0x1695a2(0x1e5)]||_0x1695a2(0x203);$gameScreen[_0x1695a2(0x1f9)](_0xcf0af,_0x4c0306,_0x477aa9,_0x448b79);}),PluginManager[_0x3adba7(0x298)](pluginData[_0x3adba7(0x28b)],_0x3adba7(0x20b),_0x4bf598=>{const _0x1cbfb9=_0x3adba7;if(!SceneManager[_0x1cbfb9(0x226)]())return;const _0x181666=$gameTemp[_0x1cbfb9(0x21b)]();_0x181666[_0x1cbfb9(0x1f8)](_0x1cbfb9(0x220));}),PluginManager[_0x3adba7(0x298)](pluginData[_0x3adba7(0x28b)],_0x3adba7(0x22c),_0x46e504=>{const _0x3b812d=_0x3adba7;if(!SceneManager['isInstanceOfSceneMap']())return;VisuMZ['ConvertParams'](_0x46e504,_0x46e504);let _0x27c235=_0x46e504['TargetScale'];_0x27c235<Game_Screen[_0x3b812d(0x1db)]&&$gameTemp['isPlaytest']()&&(alert(_0x3b812d(0x22e)),_0x27c235=Game_Screen['MIN_ZOOM']);const _0x108e15=_0x46e504[_0x3b812d(0x212)]||0x1,_0x5e69c4=_0x46e504['EasingType']||_0x3b812d(0x203);$gameScreen[_0x3b812d(0x23f)](_0x27c235,_0x108e15,_0x5e69c4);}),PluginManager[_0x3adba7(0x298)](pluginData['name'],_0x3adba7(0x1e0),_0x349ab4=>{const _0x55be66=_0x3adba7;if(!SceneManager[_0x55be66(0x226)]())return;const _0x434227=$gameTemp['getLastPluginCommandInterpreter']();_0x434227['setWaitMode'](_0x55be66(0x281));}),VisuMZ[_0x3adba7(0x1c5)][_0x3adba7(0x1ca)]={'AutoZoom':/<(?:ZOOM|AUTO ZOOM|AUTOZOOM):[ ](\d+)([%％])>/i},VisuMZ[_0x3adba7(0x1c5)][_0x3adba7(0x23c)]=ImageManager[_0x3adba7(0x213)],ImageManager[_0x3adba7(0x213)]=function(_0xa8b056){const _0x4c8792=_0x3adba7,_0x59665d=VisuMZ['MapCameraZoom'][_0x4c8792(0x23c)]['call'](this,_0xa8b056);return _0x59665d[_0x4c8792(0x26d)]=![],_0x59665d;},VisuMZ[_0x3adba7(0x1c5)][_0x3adba7(0x1d4)]=ImageManager['loadSystem'],ImageManager[_0x3adba7(0x21a)]=function(_0x321a0f){const _0xf414e3=_0x3adba7,_0x8596af=VisuMZ[_0xf414e3(0x1c5)]['ImageManager_loadSystem']['call'](this,_0x321a0f);if(_0x321a0f===_0xf414e3(0x268))_0x8596af[_0xf414e3(0x26d)]=![];return _0x8596af;},VisuMZ[_0x3adba7(0x1c5)][_0x3adba7(0x1fc)]=ImageManager[_0x3adba7(0x26c)],ImageManager[_0x3adba7(0x26c)]=function(_0x6df8fb){const _0x1b8f22=_0x3adba7,_0x491a55=VisuMZ[_0x1b8f22(0x1c5)][_0x1b8f22(0x1fc)][_0x1b8f22(0x1d2)](this,_0x6df8fb);return _0x491a55[_0x1b8f22(0x26d)]=![],_0x491a55;},SceneManager[_0x3adba7(0x28d)]=function(){const _0x8583d7=_0x3adba7;return this[_0x8583d7(0x286)]&&this[_0x8583d7(0x286)][_0x8583d7(0x272)]===Scene_Map;},SceneManager[_0x3adba7(0x226)]=function(){const _0x4d690b=_0x3adba7;return this[_0x4d690b(0x286)]&&this[_0x4d690b(0x286)]instanceof Scene_Map;},Game_Temp['prototype']['setLastPluginCommandInterpreter']=function(_0x97c78a){const _0x5a19a2=_0x3adba7;this[_0x5a19a2(0x1fd)]=_0x97c78a;},Game_Temp[_0x3adba7(0x1cd)][_0x3adba7(0x21b)]=function(){return this['_lastPluginCommandInterpreter'];},VisuMZ[_0x3adba7(0x1c5)][_0x3adba7(0x232)]=Game_Interpreter['prototype'][_0x3adba7(0x258)],Game_Interpreter['prototype'][_0x3adba7(0x258)]=function(_0x416e74){const _0x4e487d=_0x3adba7;return $gameTemp[_0x4e487d(0x218)](this),VisuMZ[_0x4e487d(0x1c5)][_0x4e487d(0x232)][_0x4e487d(0x1d2)](this,_0x416e74);},Game_Screen['MIN_ZOOM']=0x1,Game_Screen['DEFAULT_MAP_ZOOM_SCALE']=Math['max'](Game_Screen[_0x3adba7(0x1db)],VisuMZ[_0x3adba7(0x1c5)]['Settings'][_0x3adba7(0x249)]||0x1),VisuMZ[_0x3adba7(0x1c5)][_0x3adba7(0x245)]=Game_Screen['prototype'][_0x3adba7(0x24e)],Game_Screen[_0x3adba7(0x1cd)][_0x3adba7(0x24e)]=function(){const _0x487690=_0x3adba7;VisuMZ[_0x487690(0x1c5)][_0x487690(0x245)][_0x487690(0x1d2)](this),this[_0x487690(0x1c6)]();},Game_Screen[_0x3adba7(0x1cd)][_0x3adba7(0x1c6)]=function(){const _0x7f4654=_0x3adba7;this[_0x7f4654(0x24f)](),this[_0x7f4654(0x1d6)]();},Game_Screen[_0x3adba7(0x1cd)]['centerMapCameraZoom']=function(_0x5537a1){const _0x11ab7f=_0x3adba7,_0x1d1bf9=this[_0x11ab7f(0x240)]();$gameMap[_0x11ab7f(0x201)](_0x1d1bf9[_0x11ab7f(0x205)],_0x1d1bf9[_0x11ab7f(0x208)],_0x5537a1);},VisuMZ[_0x3adba7(0x1c5)][_0x3adba7(0x285)]=Game_Screen[_0x3adba7(0x1cd)][_0x3adba7(0x1e7)],Game_Screen['prototype'][_0x3adba7(0x1e7)]=function(){const _0x681c3a=_0x3adba7;VisuMZ['MapCameraZoom']['Game_Screen_updateZoom'][_0x681c3a(0x1d2)](this),this[_0x681c3a(0x24c)](),this[_0x681c3a(0x23d)]();},Game_Screen[_0x3adba7(0x1cd)]['setupMapZoomSettings']=function(){const _0x5ebe19=_0x3adba7;this[_0x5ebe19(0x230)]={'scale':Game_Screen[_0x5ebe19(0x1ff)],'targetScale':Game_Screen[_0x5ebe19(0x1ff)],'duration':0x0,'wholeDuration':0x0,'easingType':_0x5ebe19(0x203)},this[_0x5ebe19(0x237)]={'scale':0x1,'targetScale':0x1,'duration':0x0,'wholeDuration':0x0,'easingType':_0x5ebe19(0x203)};},Game_Screen[_0x3adba7(0x1cd)]['mapZoomSettings']=function(){const _0xde874e=_0x3adba7;if(this[_0xde874e(0x230)]===undefined)this[_0xde874e(0x24f)]();return this[_0xde874e(0x230)];},Game_Screen[_0x3adba7(0x1cd)][_0x3adba7(0x1ee)]=function(){const _0x112b89=_0x3adba7;if(this[_0x112b89(0x237)]===undefined)this[_0x112b89(0x24f)]();return this[_0x112b89(0x237)];},Game_Screen[_0x3adba7(0x1cd)][_0x3adba7(0x23f)]=function(_0x461603,_0x19effc,_0x22e537){const _0x2e5008=_0x3adba7,_0x598e53=this['mapZoomSettings']();if(_0x598e53[_0x2e5008(0x278)]===_0x461603)return;_0x598e53[_0x2e5008(0x278)]=_0x461603,_0x598e53[_0x2e5008(0x296)]=_0x19effc||0x1,_0x598e53['wholeDuration']=_0x19effc||0x1,_0x598e53[_0x2e5008(0x283)]=_0x22e537;},VisuMZ['MapCameraZoom'][_0x3adba7(0x238)]=Game_Screen[_0x3adba7(0x1cd)][_0x3adba7(0x25e)],Game_Screen[_0x3adba7(0x1cd)][_0x3adba7(0x25e)]=function(){const _0x335210=_0x3adba7;let _0x166a14=VisuMZ[_0x335210(0x1c5)][_0x335210(0x238)][_0x335210(0x1d2)](this);if(!this[_0x335210(0x27f)]())return _0x166a14;return SceneManager[_0x335210(0x226)]()&&(_0x166a14*=Math['max'](this[_0x335210(0x25b)]()[_0x335210(0x206)],Game_Screen['MIN_ZOOM']),_0x166a14*=Math['max'](this[_0x335210(0x1ee)]()[_0x335210(0x206)],Game_Screen[_0x335210(0x1db)])),_0x166a14;},Game_Screen[_0x3adba7(0x1cd)][_0x3adba7(0x27f)]=function(){const _0x52341b=_0x3adba7;if(!SceneManager[_0x52341b(0x226)]())return![];if($gameTemp['_doodadEditorMode'])return![];if(Imported[_0x52341b(0x223)]&&$gameMap[_0x52341b(0x234)]())return![];return!![];},Game_Screen[_0x3adba7(0x1cd)][_0x3adba7(0x24c)]=function(){const _0xe471df=_0x3adba7,_0x5b01b0=this[_0xe471df(0x25b)]();if(_0x5b01b0['duration']<=0x0)return;const _0x49463d=_0x5b01b0[_0xe471df(0x296)],_0x5a4469=_0x5b01b0[_0xe471df(0x1f4)],_0x17f48c=_0x5b01b0[_0xe471df(0x283)]||_0xe471df(0x203),_0xdb960b=_0x5b01b0['scale'],_0x24e729=_0x5b01b0[_0xe471df(0x278)];_0x5b01b0[_0xe471df(0x206)]=VisuMZ[_0xe471df(0x1c5)][_0xe471df(0x1ef)](_0xdb960b,_0x24e729,_0x49463d,_0x5a4469,_0x17f48c),this[_0xe471df(0x201)](!![]),_0x5b01b0[_0xe471df(0x296)]--,_0x5b01b0['duration']<=0x0&&this[_0xe471df(0x27e)]();},Game_Screen[_0x3adba7(0x1cd)][_0x3adba7(0x27e)]=function(){const _0x580aa4=_0x3adba7,_0xab5bea=this[_0x580aa4(0x25b)]();_0xab5bea['scale']=_0xab5bea[_0x580aa4(0x278)];},VisuMZ[_0x3adba7(0x1c5)][_0x3adba7(0x1ef)]=function(_0x142c62,_0x1a3a8f,_0x2bc118,_0x28bc0c,_0x1b073f){const _0x301809=_0x3adba7,_0x1255fd=VisuMZ[_0x301809(0x277)]((_0x28bc0c-_0x2bc118)/_0x28bc0c,_0x1b073f||'Linear'),_0xc85ea8=VisuMZ[_0x301809(0x277)]((_0x28bc0c-_0x2bc118+0x1)/_0x28bc0c,_0x1b073f||_0x301809(0x203)),_0x4903e8=(_0x142c62-_0x1a3a8f*_0x1255fd)/(0x1-_0x1255fd);return _0x4903e8+(_0x1a3a8f-_0x4903e8)*_0xc85ea8;};!VisuMZ[_0x3adba7(0x277)]&&(VisuMZ[_0x3adba7(0x277)]=function(_0xa79c05,_0x3e2144){return _0xa79c05;});;Game_Screen['prototype'][_0x3adba7(0x1d6)]=function(){const _0x1a3ca4=_0x3adba7;this[_0x1a3ca4(0x282)]={'playerFocus':!![],'eventFocus':![],'eventTargetID':0x0,'tileFocus':![],'tileCoordinates':{'_realX':0x0,'_realY':0x0},'duration':0x0,'wholeDuration':0x0,'easingType':_0x1a3ca4(0x203),'currentCamera':{'_realX':0x0,'_realY':0x0}};},Game_Screen[_0x3adba7(0x1cd)][_0x3adba7(0x23b)]=function(){const _0x2a33b2=_0x3adba7;if(this[_0x2a33b2(0x282)]===undefined)this['setupMapCameraSettings']();return this[_0x2a33b2(0x282)];},Game_Screen[_0x3adba7(0x1cd)][_0x3adba7(0x240)]=function(_0x15f47f){const _0x2d6de0=_0x3adba7,_0x5797f6=this[_0x2d6de0(0x23b)]();if(!_0x15f47f&&_0x5797f6[_0x2d6de0(0x296)]>0x0)return _0x5797f6[_0x2d6de0(0x1ea)];else{if(_0x5797f6['playerFocus'])return $gamePlayer;else{if(_0x5797f6[_0x2d6de0(0x1d8)])return $gameMap['event'](_0x5797f6[_0x2d6de0(0x20f)])||$gamePlayer;else{if(_0x5797f6[_0x2d6de0(0x253)])return _0x5797f6[_0x2d6de0(0x294)];}}}return $gamePlayer;},Game_Screen[_0x3adba7(0x1cd)][_0x3adba7(0x256)]=function(){const _0x150a05=_0x3adba7;return this[_0x150a05(0x240)]()===this[_0x150a05(0x23b)]()['currentCamera'];},Game_Screen[_0x3adba7(0x1cd)][_0x3adba7(0x260)]=function(_0x383c9b,_0x1bbd09){const _0x1acb51=_0x3adba7,_0x6d43d5=this[_0x1acb51(0x23b)](),_0xd80d21=this['mapCameraFocusTarget']();_0x6d43d5['currentCamera'][_0x1acb51(0x205)]=_0xd80d21[_0x1acb51(0x205)],_0x6d43d5[_0x1acb51(0x1ea)][_0x1acb51(0x208)]=_0xd80d21[_0x1acb51(0x208)],_0x6d43d5[_0x1acb51(0x296)]=_0x383c9b||0x1,_0x6d43d5['wholeDuration']=_0x383c9b||0x1,_0x6d43d5[_0x1acb51(0x283)]=_0x1bbd09||_0x1acb51(0x203);},Game_Screen[_0x3adba7(0x1cd)]['setMapCameraFocusToPlayer']=function(_0x283b6b,_0x33a5f2){const _0x457efb=_0x3adba7,_0x5e6bb7=this[_0x457efb(0x23b)]();if($gamePlayer[_0x457efb(0x1cc)]())return;this[_0x457efb(0x260)](_0x283b6b,_0x33a5f2),_0x5e6bb7[_0x457efb(0x1c7)]=!![],_0x5e6bb7[_0x457efb(0x1d8)]=![],_0x5e6bb7[_0x457efb(0x253)]=![];const _0x38dac9=_0x5e6bb7['tileCoordinates'];_0x38dac9['_realX']=-0x1,_0x38dac9[_0x457efb(0x208)]=-0x1;},Game_Screen['prototype'][_0x3adba7(0x1e4)]=function(_0x2991e9,_0x1d1150,_0x49cda7){const _0x4e5d83=_0x3adba7,_0x33098e=$gameMap['event'](_0x2991e9);if(!_0x33098e)return;const _0x58240b=this[_0x4e5d83(0x23b)]();if(_0x33098e[_0x4e5d83(0x1cc)]())return;this[_0x4e5d83(0x260)](_0x1d1150,_0x49cda7),_0x58240b[_0x4e5d83(0x1c7)]=![],_0x58240b[_0x4e5d83(0x1d8)]=!![],_0x58240b[_0x4e5d83(0x253)]=![],_0x58240b['eventTargetID']=_0x2991e9;const _0x40f5fd=_0x58240b['tileCoordinates'];_0x40f5fd[_0x4e5d83(0x205)]=-0x1,_0x40f5fd[_0x4e5d83(0x208)]=-0x1;},Game_Screen[_0x3adba7(0x1cd)][_0x3adba7(0x1f9)]=function(_0x2e22e8,_0x51e23b,_0x1f5f6f,_0xf81477){const _0x5bcaa2=_0x3adba7,_0x1fe6cb=this[_0x5bcaa2(0x23b)](),_0x96a1e6=_0x1fe6cb['tileCoordinates'];if(_0x96a1e6[_0x5bcaa2(0x205)]===_0x2e22e8&&_0x96a1e6['_realY']===_0x51e23b)return;this[_0x5bcaa2(0x260)](_0x1f5f6f,_0xf81477),_0x1fe6cb[_0x5bcaa2(0x1c7)]=![],_0x1fe6cb[_0x5bcaa2(0x1d8)]=![],_0x1fe6cb[_0x5bcaa2(0x253)]=!![],_0x1fe6cb[_0x5bcaa2(0x294)][_0x5bcaa2(0x205)]=_0x2e22e8,_0x1fe6cb[_0x5bcaa2(0x294)][_0x5bcaa2(0x208)]=_0x51e23b;},Game_Screen[_0x3adba7(0x1cd)]['updateMapCameraFocus']=function(){const _0x5c187f=_0x3adba7,_0x382c4c=this[_0x5c187f(0x23b)]();if(_0x382c4c[_0x5c187f(0x296)]<=0x0)return;const _0x225568=_0x382c4c[_0x5c187f(0x296)],_0x128805=_0x382c4c[_0x5c187f(0x1f4)],_0x194d6d=_0x382c4c[_0x5c187f(0x283)]||_0x5c187f(0x203),_0x36a50d=_0x382c4c[_0x5c187f(0x1ea)],_0x205bf8=this[_0x5c187f(0x240)](!![]),_0x2c6121=$gameMap[_0x5c187f(0x23a)],_0xbacd2a=$gameMap['_displayY'];_0x36a50d[_0x5c187f(0x205)]=VisuMZ[_0x5c187f(0x1c5)]['applyEasing'](_0x36a50d[_0x5c187f(0x205)],_0x205bf8[_0x5c187f(0x205)],_0x225568,_0x128805,_0x194d6d),_0x36a50d['_realY']=VisuMZ[_0x5c187f(0x1c5)]['applyEasing'](_0x36a50d[_0x5c187f(0x208)],_0x205bf8[_0x5c187f(0x208)],_0x225568,_0x128805,_0x194d6d),this[_0x5c187f(0x201)](!![]);if(this[_0x5c187f(0x266)]()){const _0x2b24d5=$gameMap['_displayX'],_0x145843=$gameMap['_displayY'];$gameMap[_0x5c187f(0x23a)]=VisuMZ[_0x5c187f(0x1c5)]['applyEasing'](_0x2c6121,_0x2b24d5,_0x225568,_0x128805,_0x194d6d),$gameMap[_0x5c187f(0x211)]=VisuMZ['MapCameraZoom']['applyEasing'](_0xbacd2a,_0x145843,_0x225568,_0x128805,_0x194d6d);}_0x382c4c['duration']--,_0x382c4c[_0x5c187f(0x296)]<=0x0&&this[_0x5c187f(0x26f)]();},Game_Screen[_0x3adba7(0x1cd)][_0x3adba7(0x266)]=function(){const _0x2b9aff=_0x3adba7;return![];if(!Imported[_0x2b9aff(0x27d)])return![];if(!$gamePlayer[_0x2b9aff(0x287)]())return![];const _0x76d7cf=this['mapCameraSettings'](),_0x137268=_0x76d7cf[_0x2b9aff(0x296)],_0xb8b81f=_0x76d7cf[_0x2b9aff(0x1f4)];return _0x137268>_0xb8b81f;},Game_Screen[_0x3adba7(0x1cd)][_0x3adba7(0x26f)]=function(){const _0x8b8416=_0x3adba7,_0x355365=this[_0x8b8416(0x23b)](),_0x25adf4=_0x355365['currentCamera'],_0x5d14e3=this['mapCameraFocusTarget'](!![]);_0x25adf4[_0x8b8416(0x205)]=_0x5d14e3['_realX'],_0x25adf4['_realY']=_0x5d14e3[_0x8b8416(0x208)];},Game_Picture[_0x3adba7(0x1cd)][_0x3adba7(0x21f)]=function(){const _0x269f84=_0x3adba7,_0x2bcbce=$gameMap['displayX']()*$gameMap[_0x269f84(0x229)]();return(this['_x']-_0x2bcbce)*$gameScreen[_0x269f84(0x25e)]();},Game_Picture[_0x3adba7(0x1cd)]['yScrollLinkedOffset']=function(){const _0xf85d5d=_0x3adba7,_0x50d3f1=$gameMap[_0xf85d5d(0x1fe)]()*$gameMap[_0xf85d5d(0x26a)]();return(this['_y']-_0x50d3f1)*$gameScreen['zoomScale']();},VisuMZ[_0x3adba7(0x1c5)]['Game_Map_setup']=Game_Map[_0x3adba7(0x1cd)][_0x3adba7(0x247)],Game_Map[_0x3adba7(0x1cd)][_0x3adba7(0x247)]=function(_0x1ae407){const _0x23478b=_0x3adba7;VisuMZ[_0x23478b(0x1c5)][_0x23478b(0x265)][_0x23478b(0x1d2)](this,_0x1ae407),this[_0x23478b(0x251)](),this[_0x23478b(0x295)]=0x0;},Game_Map[_0x3adba7(0x1cd)][_0x3adba7(0x251)]=function(){const _0x23c0a3=_0x3adba7,_0x4464b5=VisuMZ['MapCameraZoom'][_0x23c0a3(0x1ca)],_0x274a99=$dataMap?$dataMap['note']||'':'';if(_0x274a99[_0x23c0a3(0x25f)](_0x4464b5[_0x23c0a3(0x1e9)])){let _0x52dfbc=Number(RegExp['$1'])*0.01;_0x52dfbc<0x1&&$gameTemp['isPlaytest']()&&alert(_0x23c0a3(0x22e)),_0x52dfbc=Math[_0x23c0a3(0x289)](Game_Screen[_0x23c0a3(0x1db)],_0x52dfbc),$gameScreen[_0x23c0a3(0x25b)]()[_0x23c0a3(0x206)]=_0x52dfbc,$gameScreen[_0x23c0a3(0x25b)]()['targetScale']=_0x52dfbc,$gameScreen[_0x23c0a3(0x25b)]()[_0x23c0a3(0x296)]=0x0;}$gameScreen[_0x23c0a3(0x201)]();},Game_Map[_0x3adba7(0x1cd)][_0x3adba7(0x201)]=function(_0x463db2,_0x18663d,_0x45b6f0){const _0x4c44df=_0x3adba7;_0x463db2-=$gamePlayer[_0x4c44df(0x246)](),_0x18663d-=$gamePlayer['centerY'](),_0x45b6f0&&this[_0x4c44df(0x219)](_0x463db2,_0x18663d),this[_0x4c44df(0x1f2)](_0x463db2,_0x18663d),this[_0x4c44df(0x241)](_0x463db2,_0x18663d);},Game_Map[_0x3adba7(0x1cd)][_0x3adba7(0x219)]=function(_0x45da21,_0x411d39){const _0x474c02=_0x3adba7;if(this[_0x474c02(0x225)]())this[_0x474c02(0x23a)]=_0x45da21[_0x474c02(0x1ce)](this['width']()),this[_0x474c02(0x257)]=_0x45da21;else{const _0xd52904=this[_0x474c02(0x200)]()-this['screenTileX']();this[_0x474c02(0x23a)]=_0xd52904<0x0?_0xd52904/0x2:_0x45da21[_0x474c02(0x264)](0x0,_0xd52904),this['_parallaxX']=this[_0x474c02(0x23a)];}if(this[_0x474c02(0x25c)]())this[_0x474c02(0x211)]=_0x411d39[_0x474c02(0x1ce)](this[_0x474c02(0x26e)]()),this['_parallaxY']=_0x411d39;else{const _0x351ed6=this[_0x474c02(0x26e)]()-this['screenTileY']();this['_displayY']=_0x351ed6<0x0?_0x351ed6/0x2:_0x411d39[_0x474c02(0x264)](0x0,_0x351ed6),this['_parallaxY']=this[_0x474c02(0x211)];}},Game_Map[_0x3adba7(0x1cd)][_0x3adba7(0x1f2)]=function(_0x8d1f85,_0x6ba7a){const _0x3428c8=_0x3adba7,_0xc5b958=this['_mapCameraParallaxUpdates']||0x0;if(_0xc5b958<=0x0)return;this[_0x3428c8(0x202)]&&(this[_0x3428c8(0x257)]+=this[_0x3428c8(0x21c)]/this[_0x3428c8(0x229)]()/0x2*_0xc5b958),this['_parallaxLoopY']&&(this[_0x3428c8(0x1f6)]+=this[_0x3428c8(0x261)]/this[_0x3428c8(0x26a)]()/0x2*_0xc5b958);},Game_Map[_0x3adba7(0x1cd)][_0x3adba7(0x241)]=function(_0x31c4f5,_0x159c40){const _0x2cbaa8=_0x3adba7;if(this[_0x2cbaa8(0x28c)]()){this[_0x2cbaa8(0x217)]=this[_0x2cbaa8(0x217)]||[];for(const _0x312de0 of this[_0x2cbaa8(0x221)]()){if(!_0x312de0)continue;_0x312de0[_0x2cbaa8(0x293)]&&(_0x312de0[_0x2cbaa8(0x257)]=this[_0x2cbaa8(0x23a)],_0x312de0['_parallaxY']=this[_0x2cbaa8(0x211)]);}}},Game_Map[_0x3adba7(0x1cd)][_0x3adba7(0x28c)]=function(_0x284bcd,_0xdf1866){const _0x1b8f48=_0x3adba7;if(!Imported[_0x1b8f48(0x224)])return![];if(VisuMZ['MapCameraZoom'][_0x1b8f48(0x292)][_0x1b8f48(0x291)])return!![];if($gameScreen['mapCameraSettings']()[_0x1b8f48(0x296)]>0x0)return!![];return![];},VisuMZ[_0x3adba7(0x1c5)][_0x3adba7(0x267)]=Game_Map[_0x3adba7(0x1cd)][_0x3adba7(0x23e)],Game_Map['prototype']['updateParallax']=function(){const _0x2d24f5=_0x3adba7;VisuMZ[_0x2d24f5(0x1c5)][_0x2d24f5(0x267)][_0x2d24f5(0x1d2)](this),this[_0x2d24f5(0x295)]=this[_0x2d24f5(0x295)]||0x0,this[_0x2d24f5(0x295)]++;},VisuMZ[_0x3adba7(0x1c5)][_0x3adba7(0x24d)]=Game_Map[_0x3adba7(0x1cd)][_0x3adba7(0x1de)],Game_Map['prototype'][_0x3adba7(0x1de)]=function(){const _0x1cd7aa=_0x3adba7;let _0x53ac9f=VisuMZ[_0x1cd7aa(0x1c5)][_0x1cd7aa(0x24d)][_0x1cd7aa(0x1d2)](this);if(this[_0x1cd7aa(0x293)])_0x53ac9f=Math[_0x1cd7aa(0x1f3)](_0x53ac9f);return _0x53ac9f;},VisuMZ[_0x3adba7(0x1c5)][_0x3adba7(0x1e1)]=Game_Map[_0x3adba7(0x1cd)]['parallaxOy'],Game_Map[_0x3adba7(0x1cd)]['parallaxOy']=function(){const _0x44bcf1=_0x3adba7;let _0x56a3fa=VisuMZ[_0x44bcf1(0x1c5)][_0x44bcf1(0x1e1)][_0x44bcf1(0x1d2)](this);if(this['_parallaxZero'])_0x56a3fa=Math['floor'](_0x56a3fa);return _0x56a3fa;},Game_Map[_0x3adba7(0x1cd)]['canvasToMapX']=function(_0x1034c1){const _0x226473=_0x3adba7,_0x5e8c43=this['tileWidth']()*$gameScreen[_0x226473(0x25e)](),_0x18eb02=this[_0x226473(0x23a)]*_0x5e8c43,_0x47b98d=Math[_0x226473(0x1f3)]((_0x18eb02+_0x1034c1)/_0x5e8c43);return this[_0x226473(0x1f0)](_0x47b98d);},Game_Map[_0x3adba7(0x1cd)]['canvasToMapY']=function(_0x384cf6){const _0x5aee0=_0x3adba7,_0x219cb4=this[_0x5aee0(0x26a)]()*$gameScreen['zoomScale'](),_0x273097=this[_0x5aee0(0x211)]*_0x219cb4,_0x4cf0fa=Math[_0x5aee0(0x1f3)]((_0x273097+_0x384cf6)/_0x219cb4);return this['roundY'](_0x4cf0fa);},VisuMZ[_0x3adba7(0x1c5)][_0x3adba7(0x1cf)]=Game_Map[_0x3adba7(0x1cd)]['screenTileX'],Game_Map[_0x3adba7(0x1cd)]['screenTileX']=function(){const _0x158b1a=_0x3adba7,_0x2e30b0=VisuMZ[_0x158b1a(0x1c5)][_0x158b1a(0x1cf)][_0x158b1a(0x1d2)](this);return _0x2e30b0/$gameScreen[_0x158b1a(0x25e)]();},VisuMZ['MapCameraZoom'][_0x3adba7(0x210)]=Game_Map[_0x3adba7(0x1cd)][_0x3adba7(0x1cb)],Game_Map[_0x3adba7(0x1cd)]['screenTileY']=function(){const _0x1d0811=_0x3adba7,_0x11358d=VisuMZ[_0x1d0811(0x1c5)][_0x1d0811(0x210)][_0x1d0811(0x1d2)](this);return _0x11358d/$gameScreen[_0x1d0811(0x25e)]();},Game_CharacterBase[_0x3adba7(0x1cd)][_0x3adba7(0x1cc)]=function(){const _0x14b0d6=_0x3adba7;return $gameScreen[_0x14b0d6(0x240)]()===this;},VisuMZ[_0x3adba7(0x1c5)][_0x3adba7(0x1ec)]=Game_Player[_0x3adba7(0x1cd)][_0x3adba7(0x207)],Game_Player[_0x3adba7(0x1cd)][_0x3adba7(0x207)]=function(){const _0x33cdf4=_0x3adba7;VisuMZ[_0x33cdf4(0x1c5)]['Game_Player_clearTransferInfo'][_0x33cdf4(0x1d2)](this),$gameScreen['setMapCameraFocusToPlayer'](0x1,'Linear'),$gameScreen[_0x33cdf4(0x201)]();},VisuMZ[_0x3adba7(0x1c5)][_0x3adba7(0x1d1)]=Game_Player['prototype'][_0x3adba7(0x242)],Game_Player[_0x3adba7(0x1cd)][_0x3adba7(0x242)]=function(_0x544d20,_0x12cca2){const _0x98ca4e=_0x3adba7;if(!this[_0x98ca4e(0x1cc)]())return;VisuMZ[_0x98ca4e(0x1c5)][_0x98ca4e(0x1d1)][_0x98ca4e(0x1d2)](this,_0x544d20,_0x12cca2);},Game_Event[_0x3adba7(0x1cd)][_0x3adba7(0x246)]=function(){const _0x4c78df=_0x3adba7;return Game_Player['prototype'][_0x4c78df(0x246)][_0x4c78df(0x1d2)](this);},Game_Event['prototype'][_0x3adba7(0x1f5)]=function(){const _0x1efb9b=_0x3adba7;return Game_Player[_0x1efb9b(0x1cd)][_0x1efb9b(0x1f5)][_0x1efb9b(0x1d2)](this);},VisuMZ[_0x3adba7(0x1c5)][_0x3adba7(0x1e3)]=Game_Event[_0x3adba7(0x1cd)][_0x3adba7(0x252)],Game_Event[_0x3adba7(0x1cd)][_0x3adba7(0x252)]=function(){const _0x2683bb=_0x3adba7,_0x5d9690=this[_0x2683bb(0x269)](),_0x97abf6=this['scrolledY']();VisuMZ['MapCameraZoom'][_0x2683bb(0x1e3)]['call'](this);if(!this['isMapCameraFocusTarget']())return;this['updateScroll'](_0x5d9690,_0x97abf6);},Game_Event[_0x3adba7(0x1cd)][_0x3adba7(0x242)]=function(_0x4b8fbc,_0x1ff2e5){const _0xcc8456=_0x3adba7;return Game_Player[_0xcc8456(0x1cd)][_0xcc8456(0x242)]['call'](this,_0x4b8fbc,_0x1ff2e5);},Game_Event[_0x3adba7(0x1cd)][_0x3adba7(0x287)]=function(){const _0x3c184a=_0x3adba7;try{return Game_Player['prototype'][_0x3c184a(0x287)][_0x3c184a(0x1d2)](this);}catch(_0x3477e0){return![];}},Game_Event[_0x3adba7(0x1cd)]['updateScrollSmoothCamera']=function(_0x2e78ea,_0x4208b3){const _0x4862b3=_0x3adba7;try{Game_Player[_0x4862b3(0x1cd)]['updateScrollSmoothCamera']['call'](this,_0x2e78ea,_0x4208b3);}catch(_0x444854){VisuMZ['MovementEffects'][_0x4862b3(0x1d1)][_0x4862b3(0x1d2)](this,_0x2e78ea,_0x4208b3);}},Game_Event['prototype'][_0x3adba7(0x284)]=function(){return![];},VisuMZ['MapCameraZoom']['Game_Interpreter_updateWaitMode']=Game_Interpreter['prototype']['updateWaitMode'],Game_Interpreter[_0x3adba7(0x1cd)][_0x3adba7(0x20c)]=function(){const _0x42f743=_0x3adba7;if(this['_waitMode']===_0x42f743(0x220)){if($gameScreen[_0x42f743(0x23b)]()[_0x42f743(0x296)]>0x0)return!![];this[_0x42f743(0x235)]='';}else{if(this['_waitMode']===_0x42f743(0x281)){if($gameScreen[_0x42f743(0x25b)]()[_0x42f743(0x296)]>0x0)return!![];this[_0x42f743(0x235)]='';}}return VisuMZ[_0x42f743(0x1c5)][_0x42f743(0x21d)][_0x42f743(0x1d2)](this);},Scene_Map[_0x3adba7(0x1f7)]=VisuMZ[_0x3adba7(0x1c5)][_0x3adba7(0x292)][_0x3adba7(0x25a)],VisuMZ[_0x3adba7(0x1c5)][_0x3adba7(0x20d)]=Scene_Map[_0x3adba7(0x1cd)]['start'],Scene_Map[_0x3adba7(0x1cd)][_0x3adba7(0x1d9)]=function(){const _0x4dc566=_0x3adba7;VisuMZ[_0x4dc566(0x1c5)]['Scene_Map_start']['call'](this);if(Scene_Map[_0x4dc566(0x1f7)]){$gameScreen[_0x4dc566(0x1ee)]()[_0x4dc566(0x206)]=0x1;const _0x4f55db=this[_0x4dc566(0x288)]();$gameScreen[_0x4dc566(0x201)](_0x4f55db);}},Scene_Map[_0x3adba7(0x1cd)][_0x3adba7(0x288)]=function(){const _0x37ca48=_0x3adba7;if(SceneManager[_0x37ca48(0x1d0)](Scene_Menu))return![];if(SceneManager[_0x37ca48(0x1d0)](Scene_Boot))return![];return!![];},VisuMZ[_0x3adba7(0x1c5)][_0x3adba7(0x1c8)]=Scene_Map['prototype'][_0x3adba7(0x24b)],Scene_Map[_0x3adba7(0x1cd)][_0x3adba7(0x24b)]=function(){const _0x4af6a4=_0x3adba7;$gameTemp[_0x4af6a4(0x236)]=Scene_Map[_0x4af6a4(0x1f7)],VisuMZ['MapCameraZoom'][_0x4af6a4(0x1c8)][_0x4af6a4(0x1d2)](this),$gameTemp[_0x4af6a4(0x236)]=undefined;},VisuMZ[_0x3adba7(0x1c5)][_0x3adba7(0x273)]=Game_Screen[_0x3adba7(0x1cd)][_0x3adba7(0x274)],Game_Screen[_0x3adba7(0x1cd)][_0x3adba7(0x274)]=function(_0x50fb8c,_0x1a0bb1,_0x4eae84){const _0x4ac8b5=_0x3adba7;$gameTemp[_0x4ac8b5(0x236)]?this['setBattleEncounterZoom'](_0x4eae84):VisuMZ[_0x4ac8b5(0x1c5)][_0x4ac8b5(0x273)]['call'](this,_0x50fb8c,_0x1a0bb1,_0x4eae84);},Game_Screen[_0x3adba7(0x1cd)][_0x3adba7(0x276)]=function(_0x2d9ebb){const _0x252d78=_0x3adba7;this['mapZoomEnterBattleSettings']()[_0x252d78(0x206)]=_0x2d9ebb,this[_0x252d78(0x201)]();const _0x3050f1=this[_0x252d78(0x240)]();$gamePlayer[_0x252d78(0x280)](_0x3050f1['x'],_0x3050f1['y']);},VisuMZ[_0x3adba7(0x1c5)]['Game_System_isSmoothCameraEnabled']=Game_System[_0x3adba7(0x1cd)][_0x3adba7(0x27a)],Game_System[_0x3adba7(0x1cd)][_0x3adba7(0x27a)]=function(){const _0x407ce2=_0x3adba7;if(!Scene_Map[_0x407ce2(0x1f7)]&&SceneManager[_0x407ce2(0x22f)](Scene_Battle))return![];return VisuMZ['MapCameraZoom'][_0x407ce2(0x22b)][_0x407ce2(0x1d2)](this);},VisuMZ['MapCameraZoom'][_0x3adba7(0x204)]=Sprite_AnimationMV[_0x3adba7(0x1cd)][_0x3adba7(0x20a)],Sprite_AnimationMV['prototype'][_0x3adba7(0x20a)]=function(){const _0xdb369=_0x3adba7;SceneManager[_0xdb369(0x226)]()&&this[_0xdb369(0x279)][_0xdb369(0x1e2)]===0x3?this[_0xdb369(0x262)]():VisuMZ['MapCameraZoom'][_0xdb369(0x204)][_0xdb369(0x1d2)](this);},Sprite_AnimationMV[_0x3adba7(0x1cd)][_0x3adba7(0x262)]=function(){const _0x2c151d=_0x3adba7,_0x2d6beb=SceneManager['_scene'][_0x2c151d(0x22d)],_0xe397b7=$gameScreen[_0x2c151d(0x25e)](),_0x28192e=0.5/_0xe397b7,_0xe8c4ac=-_0x2d6beb['x']/_0xe397b7,_0x5c6bb5=-_0x2d6beb['y']/_0xe397b7;this['x']=this['parent'][_0x2c151d(0x200)]*_0x28192e+_0xe8c4ac,this['y']=this[_0x2c151d(0x228)][_0x2c151d(0x26e)]*_0x28192e+_0x5c6bb5;};(VisuMZ['MapCameraZoom'][_0x3adba7(0x292)][_0x3adba7(0x297)]??!![])&&(Tilemap[_0x3adba7(0x270)]['prototype']['_createInternalTextures']=function(){const _0x4401b0=_0x3adba7;this['_destroyInternalTextures']();for(let _0x4efcc2=0x0;_0x4efcc2<Tilemap['Layer'][_0x4401b0(0x250)];_0x4efcc2++){const _0x2ee6a1=new PIXI[(_0x4401b0(0x1eb))]();_0x2ee6a1[_0x4401b0(0x1d3)](0x800,0x800),_0x2ee6a1['scaleMode']=PIXI['SCALE_MODES'][_0x4401b0(0x22a)],this[_0x4401b0(0x209)][_0x4401b0(0x214)](_0x2ee6a1);}});;