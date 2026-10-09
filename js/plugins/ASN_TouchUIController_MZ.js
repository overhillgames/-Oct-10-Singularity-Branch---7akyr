//=============================================================================
// ASN_TouchUIController_MZ.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [v1.0.0] Total control over MZ's Touch UI menu button — hide, move, resize, restyle, or replace it entirely!
 * @author ALT+SHIFT+NERD MEdia
 * @url https://altshiftnerd.com
 *
 * @param --- Visibility ---
 *
 * @param showButton
 * @parent --- Visibility ---
 * @text Show Menu Button
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 * @desc Show the touch UI menu button on the map?
 *
 * @param buttonOpacity
 * @parent --- Visibility ---
 * @text Button Opacity
 * @type number
 * @min 0
 * @max 255
 * @default 255
 * @desc Opacity of the menu button (0 = invisible, 255 = fully visible)
 *
 * @param idleOpacity
 * @parent --- Visibility ---
 * @text Idle Opacity
 * @type number
 * @min 0
 * @max 255
 * @default 100
 * @desc Opacity when player hasn't touched/moved mouse recently (0 = disabled, uses Button Opacity always)
 *
 * @param idleDelay
 * @parent --- Visibility ---
 * @text Idle Delay (frames)
 * @type number
 * @min 30
 * @max 600
 * @default 180
 * @desc Frames of inactivity before fading to Idle Opacity (60 = 1 second)
 *
 * @param fadeSpeed
 * @parent --- Visibility ---
 * @text Fade Speed
 * @type number
 * @min 1
 * @max 30
 * @default 5
 * @desc How fast the button fades between active/idle opacity (per frame)
 *
 * @param --- Position ---
 *
 * @param positionPreset
 * @parent --- Position ---
 * @text Position Preset
 * @type select
 * @option Default (Top Right)
 * @value default
 * @option Top Left
 * @value topLeft
 * @option Top Center
 * @value topCenter
 * @option Bottom Left
 * @value bottomLeft
 * @option Bottom Center
 * @value bottomCenter
 * @option Bottom Right
 * @value bottomRight
 * @option Custom
 * @value custom
 * @default default
 * @desc Where to place the menu button. Choose Custom to set exact X/Y.
 *
 * @param customX
 * @parent --- Position ---
 * @text Custom X
 * @type number
 * @min 0
 * @max 9999
 * @default 0
 * @desc X position when Position Preset is Custom.
 *
 * @param customY
 * @parent --- Position ---
 * @text Custom Y
 * @type number
 * @min 0
 * @max 9999
 * @default 0
 * @desc Y position when Position Preset is Custom.
 *
 * @param offsetX
 * @parent --- Position ---
 * @text Offset X
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc Fine-tune horizontal offset from preset position (positive = right)
 *
 * @param offsetY
 * @parent --- Position ---
 * @text Offset Y
 * @type number
 * @min -9999
 * @max 9999
 * @default 0
 * @desc Fine-tune vertical offset from preset position (positive = down)
 *
 * @param --- Size ---
 *
 * @param scaleX
 * @parent --- Size ---
 * @text Scale X (%)
 * @type number
 * @min 10
 * @max 500
 * @default 100
 * @desc Horizontal scale percentage (100 = normal size)
 *
 * @param scaleY
 * @parent --- Size ---
 * @text Scale Y (%)
 * @type number
 * @min 10
 * @max 500
 * @default 100
 * @desc Vertical scale percentage (100 = normal size)
 *
 * @param --- Custom Image ---
 *
 * @param useCustomImage
 * @parent --- Custom Image ---
 * @text Use Custom Image
 * @type boolean
 * @on Yes
 * @off No
 * @default false
 * @desc Replace the default button graphic with a custom image?
 *
 * @param customImage
 * @parent --- Custom Image ---
 * @text Custom Image
 * @type file
 * @dir img/system/
 * @default 
 * @desc Custom button image from img/system/. Should be a vertical sprite sheet: top half = unpressed, bottom half = pressed.
 *
 * @param --- Behavior ---
 *
 * @param hideDuringEvents
 * @parent --- Behavior ---
 * @text Hide During Events
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 * @desc Hide the menu button when an event is running?
 *
 * @param hideDuringMessages
 * @parent --- Behavior ---
 * @text Hide During Messages
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 * @desc Hide the menu button when a message window is open?
 *
 * @param visibilitySwitch
 * @parent --- Behavior ---
 * @text Visibility Switch
 * @type switch
 * @default 0
 * @desc Game Switch ID that controls visibility. ON = visible. 0 = always visible (ignoring switch).
 *
 * @param --- Advanced ---
 *
 * @param clickAction
 * @parent --- Advanced ---
 * @text Click Action
 * @type select
 * @option Open Menu (default)
 * @value menu
 * @option Open Save Screen
 * @value save
 * @option Open Options
 * @value options
 * @option Call Common Event
 * @value commonEvent
 * @option Disabled (visual only)
 * @value disabled
 * @default menu
 * @desc What happens when the button is pressed?
 *
 * @param commonEventId
 * @parent --- Advanced ---
 * @text Common Event ID
 * @type common_event
 * @default 1
 * @desc Common Event to run when Click Action is "Call Common Event".
 *
 * @param tooltipText
 * @parent --- Advanced ---
 * @text Tooltip Text
 * @type text
 * @default 
 * @desc Text shown below/near button on hover. Leave empty for no tooltip.
 *
 * @param tooltipFontSize
 * @parent --- Advanced ---
 * @text Tooltip Font Size
 * @type number
 * @min 8
 * @max 36
 * @default 14
 * @desc Font size for tooltip text.
 *
 * @command show
 * @text Show Button
 * @desc Makes the touch UI menu button visible.
 *
 * @command hide
 * @text Hide Button
 * @desc Hides the touch UI menu button.
 *
 * @command toggle
 * @text Toggle Button
 * @desc Toggles the touch UI menu button visibility.
 *
 * @command setOpacity
 * @text Set Opacity
 * @desc Changes the button's active opacity.
 *
 * @arg opacity
 * @text Opacity
 * @type number
 * @min 0
 * @max 255
 * @default 255
 * @desc New opacity value.
 *
 * @command moveTo
 * @text Move Button
 * @desc Moves the button to a new position.
 *
 * @arg x
 * @text X Position
 * @type number
 * @min 0
 * @max 9999
 * @default 0
 *
 * @arg y
 * @text Y Position
 * @type number
 * @min 0
 * @max 9999
 * @default 0
 *
 * @command resetPosition
 * @text Reset Position
 * @desc Returns button to its configured position.
 *
 * @help
 * ============================================================================
 * ASN TOUCH UI CONTROLLER
 * ============================================================================
 *
 * Take full control of RPG Maker MZ's touch UI menu button!
 *
 * Tired of that button sitting in the top-right corner, overlapping your
 * HUD? Wish you could make it smaller, move it, fade it out, or replace
 * it with your own graphic? Now you can.
 *
 * ============================================================================
 * FEATURES
 * ============================================================================
 *
 * VISIBILITY:
 *   - Show or hide the button entirely
 *   - Set exact opacity (0-255)
 *   - Idle fade: button dims when player isn't interacting
 *   - Control visibility via game switch
 *   - Auto-hide during events and messages
 *
 * POSITIONING:
 *   - 6 preset positions (all corners, top/bottom center)
 *   - Custom X/Y for pixel-perfect placement
 *   - Fine-tune offset on any preset
 *   - Runtime repositioning via plugin commands
 *
 * SIZING:
 *   - Independent X and Y scale (10%-500%)
 *   - Make it tiny, make it huge, stretch it however you want
 *
 * CUSTOM IMAGE:
 *   - Replace the default MZ button with your own graphic
 *   - Uses standard sprite sheet format (top = normal, bottom = pressed)
 *   - Place your image in img/system/
 *
 * CLICK ACTION:
 *   - Default: Open Menu
 *   - Open Save Screen directly
 *   - Open Options directly
 *   - Call any Common Event
 *   - Disabled (visual indicator only)
 *
 * TOOLTIP:
 *   - Optional text shown near the button on hover
 *   - Configurable font size
 *
 * ============================================================================
 * CUSTOM IMAGE FORMAT
 * ============================================================================
 *
 * If using a custom image, create a vertical sprite sheet:
 *   - Top half: Normal/unpressed state
 *   - Bottom half: Pressed/active state
 *
 * Both halves should be the same dimensions.
 * Place the file in your project's img/system/ folder.
 *
 * ============================================================================
 * PLUGIN COMMANDS
 * ============================================================================
 *
 * Show Button      — Makes the button visible
 * Hide Button      — Hides the button
 * Toggle Button    — Toggles visibility
 * Set Opacity      — Changes active opacity (0-255)
 * Move Button      — Moves to new X/Y position
 * Reset Position   — Returns to configured position
 *
 * ============================================================================
 * COMPATIBILITY
 * ============================================================================
 *
 * Works with all plugins. Place anywhere in plugin list.
 * Compatible with custom menu systems and HUD plugins.
 *
 * ============================================================================
 * TERMS OF USE
 * ============================================================================
 *
 * Free for commercial and non-commercial use.
 * Credit: ALT+SHIFT+NERD MEdia
 *
 */

(() => {
  'use strict';

  // ═══════════════════════════════════════
  // PARAMETERS
  // ═══════════════════════════════════════

  const pluginName = 'ASN_TouchUIController_MZ';
  let parameters = PluginManager.parameters(pluginName);
  if (!parameters['showButton'] && !parameters['positionPreset']) {
    parameters = PluginManager.parameters('ASN_TouchUIController');
  }

  const Param = {
    showButton:        parameters['showButton'] !== 'false',
    buttonOpacity:     Number(parameters['buttonOpacity']) || 255,
    idleOpacity:       Number(parameters['idleOpacity']),
    idleDelay:         Number(parameters['idleDelay']) || 180,
    fadeSpeed:         Number(parameters['fadeSpeed']) || 5,
    positionPreset:    String(parameters['positionPreset'] || 'default'),
    customX:           Number(parameters['customX']) || 0,
    customY:           Number(parameters['customY']) || 0,
    offsetX:           Number(parameters['offsetX']) || 0,
    offsetY:           Number(parameters['offsetY']) || 0,
    scaleX:            (Number(parameters['scaleX']) || 100) / 100,
    scaleY:            (Number(parameters['scaleY']) || 100) / 100,
    useCustomImage:    parameters['useCustomImage'] === 'true',
    customImage:       String(parameters['customImage'] || ''),
    hideDuringEvents:  parameters['hideDuringEvents'] !== 'false',
    hideDuringMessages: parameters['hideDuringMessages'] !== 'false',
    visibilitySwitch:  Number(parameters['visibilitySwitch']) || 0,
    clickAction:       String(parameters['clickAction'] || 'menu'),
    commonEventId:     Number(parameters['commonEventId']) || 1,
    tooltipText:       String(parameters['tooltipText'] || ''),
    tooltipFontSize:   Number(parameters['tooltipFontSize']) || 14
  };

  if (isNaN(Param.idleOpacity)) Param.idleOpacity = 100;

  // Runtime state
  let _buttonVisible = Param.showButton;
  let _runtimeOpacity = Param.buttonOpacity;
  let _runtimeX = null;  // null = use configured position
  let _runtimeY = null;

  // ═══════════════════════════════════════
  // PLUGIN COMMANDS
  // ═══════════════════════════════════════

  PluginManager.registerCommand(pluginName, 'show', () => {
    _buttonVisible = true;
  });

  PluginManager.registerCommand(pluginName, 'hide', () => {
    _buttonVisible = false;
  });

  PluginManager.registerCommand(pluginName, 'toggle', () => {
    _buttonVisible = !_buttonVisible;
  });

  PluginManager.registerCommand(pluginName, 'setOpacity', args => {
    _runtimeOpacity = Number(args.opacity) || 255;
  });

  PluginManager.registerCommand(pluginName, 'moveTo', args => {
    _runtimeX = Number(args.x) || 0;
    _runtimeY = Number(args.y) || 0;
    // Reset so update loop re-applies position
    const scene = SceneManager._scene;
    if (scene && scene._asnButtonPositioned !== undefined) {
      scene._asnButtonPositioned = false;
    }
  });

  PluginManager.registerCommand(pluginName, 'resetPosition', () => {
    _runtimeX = null;
    _runtimeY = null;
    const scene = SceneManager._scene;
    if (scene && scene._asnButtonPositioned !== undefined) {
      scene._asnButtonPositioned = false;
    }
  });

  // ═══════════════════════════════════════
  // POSITION CALCULATION
  // ═══════════════════════════════════════

  function calculateButtonPosition(buttonWidth, buttonHeight) {
    if (_runtimeX !== null && _runtimeY !== null) {
      return { x: _runtimeX, y: _runtimeY };
    }

    let x = 0;
    let y = 0;
    const gw = Graphics.boxWidth;
    const gh = Graphics.boxHeight;
    const bw = buttonWidth * Param.scaleX;
    const bh = buttonHeight * Param.scaleY;
    const pad = 4;

    switch (Param.positionPreset) {
      case 'default':
        // MZ default: top-right
        x = gw - bw - pad;
        y = pad;
        break;
      case 'topLeft':
        x = pad;
        y = pad;
        break;
      case 'topCenter':
        x = (gw - bw) / 2;
        y = pad;
        break;
      case 'bottomLeft':
        x = pad;
        y = gh - bh - pad;
        break;
      case 'bottomCenter':
        x = (gw - bw) / 2;
        y = gh - bh - pad;
        break;
      case 'bottomRight':
        x = gw - bw - pad;
        y = gh - bh - pad;
        break;
      case 'custom':
        x = Param.customX;
        y = Param.customY;
        break;
    }

    x += Param.offsetX;
    y += Param.offsetY;

    return { x: x, y: y };
  }

  // ═══════════════════════════════════════
  // OVERRIDE Scene_Map.createButtons
  // ═══════════════════════════════════════

  const _Scene_Map_createButtons = Scene_Map.prototype.createButtons;
  Scene_Map.prototype.createButtons = function() {
    _Scene_Map_createButtons.call(this);

    // Find the menu button MZ created
    // MZ stores it as this._menuButton
    if (this._menuButton) {
      this._asnMenuButton = this._menuButton;
      this._asnIdleTimer = 0;
      this._asnCurrentOpacity = _runtimeOpacity;
      this._asnTargetOpacity = _runtimeOpacity;
      this._asnLastMouseX = 0;
      this._asnLastMouseY = 0;

      // Apply scale
      this._asnMenuButton.scale.x = Param.scaleX;
      this._asnMenuButton.scale.y = Param.scaleY;

      // Apply custom image
      if (Param.useCustomImage && Param.customImage) {
        this._asnLoadCustomImage();
      }

      // Create tooltip
      if (Param.tooltipText) {
        this._asnCreateTooltip();
      }

      // Initial position
      this._asnRepositionButton();
    }
  };

  Scene_Map.prototype._asnLoadCustomImage = function() {
    const btn = this._asnMenuButton;
    if (!btn) return;

    const bitmap = ImageManager.loadSystem(Param.customImage);
    bitmap.addLoadListener(() => {
      btn.bitmap = bitmap;
      // Recalculate the button's cold/hot frames for the new image
      const w = bitmap.width;
      const h = bitmap.height / 2;
      btn.setColdFrame(0, 0, w, h);
      btn.setHotFrame(0, h, w, h);
      // Reposition after image loads (dimensions may differ)
      this._asnRepositionButton();
    });
  };

  Scene_Map.prototype._asnCreateTooltip = function() {
    this._asnTooltip = new Sprite();
    const width = Param.tooltipText.length * (Param.tooltipFontSize * 0.6) + 20;
    const height = Param.tooltipFontSize + 12;
    this._asnTooltip.bitmap = new Bitmap(width, height);
    this._asnTooltip.bitmap.fontSize = Param.tooltipFontSize;
    this._asnTooltip.bitmap.textColor = '#FFFFFF';
    this._asnTooltip.bitmap.outlineColor = '#000000';
    this._asnTooltip.bitmap.outlineWidth = 3;
    this._asnTooltip.bitmap.drawText(
      Param.tooltipText, 0, 0, width, height, 'center'
    );
    this._asnTooltip.visible = false;
    this._asnTooltip.anchor.x = 0.5;
    this.addChild(this._asnTooltip);
  };

  Scene_Map.prototype._asnRepositionButton = function() {
    const btn = this._asnMenuButton;
    if (!btn || !btn.bitmap || !btn.bitmap.isReady()) return;

    // Use the button's cold frame (visible area), not full sprite sheet
    let bw, bh;
    if (btn._coldFrame) {
      bw = btn._coldFrame.width;
      bh = btn._coldFrame.height;
    } else {
      // Fallback: assume single-button image
      bw = btn.bitmap.width;
      bh = btn.bitmap.height / 2;
    }

    const pos = calculateButtonPosition(bw, bh);
    btn.x = pos.x;
    btn.y = pos.y;
    this._asnButtonPositioned = true;
  };

  // ═══════════════════════════════════════
  // OVERRIDE Scene_Map.updateButtons (visibility + opacity + tooltip)
  // ═══════════════════════════════════════

  const _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function() {
    _Scene_Map_update.call(this);

    if (this._asnMenuButton) {
      // Deferred repositioning — retry until bitmap is ready
      if (!this._asnButtonPositioned) {
        this._asnRepositionButton();
      }
      this._asnUpdateButtonVisibility();
      this._asnUpdateButtonOpacity();
      this._asnUpdateTooltip();
      this._asnUpdateButtonAction();
    }
  };

  Scene_Map.prototype._asnUpdateButtonVisibility = function() {
    const btn = this._asnMenuButton;
    let shouldShow = _buttonVisible;

    // Switch control
    if (Param.visibilitySwitch > 0 && !$gameSwitches.value(Param.visibilitySwitch)) {
      shouldShow = false;
    }

    // Event running
    if (Param.hideDuringEvents && $gameMap.isEventRunning()) {
      shouldShow = false;
    }

    // Message window open
    if (Param.hideDuringMessages && $gameMessage.isBusy()) {
      shouldShow = false;
    }

    btn.visible = shouldShow;
  };

  Scene_Map.prototype._asnUpdateButtonOpacity = function() {
    const btn = this._asnMenuButton;
    if (!btn.visible) return;

    // Idle fade system
    if (Param.idleOpacity > 0 && Param.idleOpacity < _runtimeOpacity) {
      const mx = TouchInput.x;
      const my = TouchInput.y;

      // Detect any input activity
      if (mx !== this._asnLastMouseX || my !== this._asnLastMouseY ||
          TouchInput.isPressed() || Input.isAnyPressed()) {
        this._asnIdleTimer = 0;
        this._asnLastMouseX = mx;
        this._asnLastMouseY = my;
        this._asnTargetOpacity = _runtimeOpacity;
      } else {
        this._asnIdleTimer++;
        if (this._asnIdleTimer >= Param.idleDelay) {
          this._asnTargetOpacity = Param.idleOpacity;
        }
      }

      // Smooth fade
      if (this._asnCurrentOpacity < this._asnTargetOpacity) {
        this._asnCurrentOpacity = Math.min(
          this._asnCurrentOpacity + Param.fadeSpeed,
          this._asnTargetOpacity
        );
      } else if (this._asnCurrentOpacity > this._asnTargetOpacity) {
        this._asnCurrentOpacity = Math.max(
          this._asnCurrentOpacity - Param.fadeSpeed,
          this._asnTargetOpacity
        );
      }

      btn.opacity = this._asnCurrentOpacity;
    } else {
      btn.opacity = _runtimeOpacity;
    }
  };

  Scene_Map.prototype._asnUpdateTooltip = function() {
    if (!this._asnTooltip || !this._asnMenuButton) return;

    const btn = this._asnMenuButton;
    if (!btn.visible) {
      this._asnTooltip.visible = false;
      return;
    }

    // Check if mouse is hovering over button area
    const mx = TouchInput.x;
    const my = TouchInput.y;
    const bx = btn.x;
    const by = btn.y;
    let bw, bh;
    if (btn._coldFrame) {
      bw = btn._coldFrame.width * Param.scaleX;
      bh = btn._coldFrame.height * Param.scaleY;
    } else {
      bw = (btn.bitmap ? btn.bitmap.width : 48) * Param.scaleX;
      bh = (btn.bitmap ? btn.bitmap.height / 2 : 48) * Param.scaleY;
    }

    const hovering = mx >= bx && mx <= bx + bw && my >= by && my <= by + bh;

    this._asnTooltip.visible = hovering;
    if (hovering) {
      this._asnTooltip.x = bx + bw / 2;
      this._asnTooltip.y = by + bh + 4;
      this._asnTooltip.opacity = btn.opacity;
    }
  };

  // ═══════════════════════════════════════
  // CUSTOM CLICK ACTION
  // ═══════════════════════════════════════

  Scene_Map.prototype._asnUpdateButtonAction = function() {
    if (Param.clickAction === 'menu') return; // Default behavior, no override needed

    const btn = this._asnMenuButton;
    if (!btn || !btn.visible) return;

    // Check if button was just pressed (MZ fires isPressed on the button)
    if (!this._asnButtonWasPressed && btn.isPressed()) {
      this._asnButtonWasPressed = true;
    } else if (this._asnButtonWasPressed && !btn.isPressed()) {
      this._asnButtonWasPressed = false;
      // Button was released — fire our custom action
      this._asnFireCustomAction();
    }
  };

  Scene_Map.prototype._asnFireCustomAction = function() {
    switch (Param.clickAction) {
      case 'save':
        SceneManager.push(Scene_Save);
        break;
      case 'options':
        SceneManager.push(Scene_Options);
        break;
      case 'commonEvent':
        if (Param.commonEventId > 0) {
          $gameTemp.reserveCommonEvent(Param.commonEventId);
        }
        break;
      case 'disabled':
        // Do nothing
        break;
    }
  };

  // For non-menu click actions, prevent the default menu call
  if (Param.clickAction !== 'menu') {
    const _Scene_Map_isMenuCalled = Scene_Map.prototype.isMenuCalled;
    Scene_Map.prototype.isMenuCalled = function() {
      // If our custom action button was touched, don't open menu
      if (this._asnMenuButton && this._asnMenuButton.isPressed()) {
        return false;
      }
      return _Scene_Map_isMenuCalled.call(this);
    };
  }

  // ═══════════════════════════════════════
  // Input.isAnyPressed — utility for idle detection
  // ═══════════════════════════════════════

  if (!Input.isAnyPressed) {
    Input.isAnyPressed = function() {
      return Object.keys(this._currentState).some(key => this._currentState[key]);
    };
  }

  // ═══════════════════════════════════════
  // SAVE / LOAD RUNTIME STATE
  // ═══════════════════════════════════════

  const _Game_System_onBeforeSave = Game_System.prototype.onBeforeSave;
  Game_System.prototype.onBeforeSave = function() {
    _Game_System_onBeforeSave.call(this);
    this._asnTouchUIVisible = _buttonVisible;
    this._asnTouchUIOpacity = _runtimeOpacity;
    this._asnTouchUIX = _runtimeX;
    this._asnTouchUIY = _runtimeY;
  };

  const _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
  Game_System.prototype.onAfterLoad = function() {
    _Game_System_onAfterLoad.call(this);
    if (this._asnTouchUIVisible !== undefined) {
      _buttonVisible = this._asnTouchUIVisible;
    }
    if (this._asnTouchUIOpacity !== undefined) {
      _runtimeOpacity = this._asnTouchUIOpacity;
    }
    if (this._asnTouchUIX !== undefined) {
      _runtimeX = this._asnTouchUIX;
    }
    if (this._asnTouchUIY !== undefined) {
      _runtimeY = this._asnTouchUIY;
    }
  };

  // ═══════════════════════════════════════
  // GLOBAL ACCESS
  // ═══════════════════════════════════════

  window.ASN_TouchUI = {
    Param: Param,
    isVisible: () => _buttonVisible,
    show: () => { _buttonVisible = true; },
    hide: () => { _buttonVisible = false; },
    toggle: () => { _buttonVisible = !_buttonVisible; },
    setOpacity: (val) => { _runtimeOpacity = val; },
    moveTo: (x, y) => {
      _runtimeX = x; _runtimeY = y;
      const scene = SceneManager._scene;
      if (scene && scene._asnButtonPositioned !== undefined) scene._asnButtonPositioned = false;
    },
    resetPosition: () => {
      _runtimeX = null; _runtimeY = null;
      const scene = SceneManager._scene;
      if (scene && scene._asnButtonPositioned !== undefined) scene._asnButtonPositioned = false;
    },
    version: '1.0.0',
    author: 'ALT+SHIFT+NERD MEdia'
  };

})();
