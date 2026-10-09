//============================================================================
// EliMZ_MessageActions.js
//============================================================================

/*:
@target MZ
@base EliMZ_Book
@orderAfter EliMZ_EscapeCodes
@orderAfter EliMVZ_EscapeCodes
@orderAfter CGMZ_Core
@orderAfter CGMZ_Encyclopedia
@orderAfter VisuMZ_0_CoreEngine
@orderAfter VisuMZ_1_MessageCore

@plugindesc ♦2.1.6♦ Adds action escape codes to be used on any window!
@author Hakuen Studio
@url https://docs.google.com/document/d/1UxMk8qhA1rHiq8NA9Cu2Z7QKePhELlFVSKy7YOsIAm4/edit?usp=sharing

@help
↑↑↑ HOW TO USE / HELP FILE ABOVE ↑↑↑

★★★★★ → Rate the plugin! Please, is very important to me ^^
https://hakuenstudio.itch.io/eli-message-actions-for-rpg-maker/rate?source=game

♦ TERMS OF USE
https://www.hakuenstudio.com/terms-of-use-5-0-0

♦ DOWNLOAD
https://hakuenstudio.itch.io/eli-message-actions-for-rpg-maker

♦ SUPPORT
https://hakuenstudio.itch.io/eli-message-actions-for-rpg-maker/community

♦ FEATURES

● Add new escape codes that can:
• Draw images from any img folder!
• Change switches, self switches, and variables.
• Play common event
• Show animations, balloon
• Scroll, fade(in and out), tint, shake, and flash the map!
• Change wether
• Play BGM, BGS, ME, SE
• Change font to bold or italic
• Change font outline color and width
• Align Left | Center | Right
• Change face image/index of the message window
• Change font face (Eli FontManager or Eli BitmapFontPro)
● Works almost on every window, including scroll text!

@param underlineHeight
@text Underline height
@type number
@desc The height of the underline.
@default 1

@param strikeThroughHeight
@text Strike Through height
@type number
@desc The height of the strikethrough line.
@default 1

@param alignMode
@text Persistent Alignment
@type boolean
@desc If true, persistent windows keep alignment until changed. If false, they reset to their default alignment when they start.
@default true

@param label1
@text General Codes

@param txt
@text Text
@type struct<txtSt>
@desc Action Codes related to the text itself.
Only A-Z. Not case sensitive.
@default {"align":"ALIGN","underline":"UL","strike":"TS","textBackground":"BGC","bold":"BOLD","italic":"ITALIC","color":"COLOR","outColor":"OUTCOLOR","outWidth":"OUTWIDTH"}
@parent label1

@param sound
@text Sound
@type struct<soundSt>
@desc Action Codes related to the sound.
Only A-Z. Not case sensitive.
@default {"pbgm":"PBGM","fobgm":"FBGM","pbgs":"PBGS","fobgs":"FBGS","pme":"PME","pse":"PSE"}
@parent label1

@param event
@text Eventing
@type struct<eventSt>
@desc Action Codes related to event commands.
Only A-Z. Not case sensitive.
@default {"changeSwitch":"CSW","changeSelfSwitch":"CSSW","changeVariable":"CVAR","commonEvent":"PCE","balloon":"SBI","animation":"SAN","scrollMap":"SCROLL","fade":"FADE","tint":"TINT","flash":"FLASH","shake":"SHAKE","weather":"WEATHER"}
@parent label1

@param advanced
@text Advanced
@type struct<advancedSt>
@desc Advanced Action Codes.
@default {"formula":"SCRIPT","image":"DRAWIMG"}
@parent label1

@param label2
@text Message Codes

@param msgFace
@text Face
@type struct<msgFaceSt>
@desc Action codes to modify the face on the message.
Only A-Z. Not case sensitive.
@default {"actorFace":"ACTORFACE","memberFace":"PARTYFACE","faceFile":"FACENAME","faceIndex":"FACEINDEX","faceAll":"CHANGEFACE"}
@parent label2

@param msgDefault
@text Others
@type struct<msgDefaultSt>
@desc Action codes related to message.
Only A-Z. Not case sensitive.
@default {"wait":"WAIT"}
@parent label2

@param label3
@text From Other Plugins

@param extensionPlugins
@text Extension Plugins
@type struct<extensionPluginsST>
@desc Action codes related to other plugins.
Only A-Z. Not case sensitive.
@default {"changeMessageSE":"CSE","changeFont":"FNT"}
@parent label3

*/

/* ------------------------------- TEXT CODES ------------------------------- */
{

/*~struct~txtSt:

@param align
@text Horizontal Align
@type text
@desc \Align[Option] 
Option can be Left, Center, or Right
@default ALIGN

@param underline
@text Underline
@type text
@desc \UL[boolean]
True for enable. False for disable.
@default UL

@param strike
@text Strikethrough
@type text
@desc \TS[boolean]
True for enable. False for disable.
@default TS

@param textBackground
@text Text Background
@type text
@desc \BGC[boolean, color]
Boolean = true or false | color = Hex, Html, or window colors(0, 1, 2, etc..).
@default BGC

@param bold
@text Bold Font
@type text
@desc \Bold[boolean]
True for enable. False for disable.
@default BOLD

@param italic
@text Italic Font
@type text
@desc \Italic[boolean]
True for enable. False for disable.
@default ITALIC

@param color
@text Text Color
@type text
@desc \Color[color]
Can use Hex, Html, or window colors(0, 1, 2, etc..).
@default COLOR

@param outColor
@text Text Outline Color
@type text
@desc \OutColor[color]
Hex, Html, or window colors(0, 1, 2, etc..).
@default OUTCOLOR

@param outWidth
@text Text Outline Width
@type text
@desc \OutWidth[number]
@default OUTWIDTH

*/

}

/* --------------------------- SOUND ESCAPE CODES --------------------------- */
{
/*~struct~soundSt:

@param pbgm
@text Play BGM
@type text
@desc \PBgm[file, volume, pitch, pan]
File is case sensitive.
@default PBGM

@param fobgm
@text Fade Out Bgm
@type text
@desc \FBgm[duration]
Duration is in seconds.
@default FBGM

@param pbgs
@text Play BGS
@type text
@desc \PBgs[file, volume, pitch, pan]
File is case sensitive.
@default PBGS

@param fobgs
@text Fade Out BGS
@type text
@desc \FBgs[duration]
Duration is in seconds.
@default FBGS

@param pme
@text Play ME
@type text
@desc \PMe[file, volume, pitch, pan]
@default PME

@param pse
@text Play SE
@type text
@desc \PSe[file, volume, pitch, pan]
@default PSE

*/
}

/* --------------------------- EVENT ESCAPE CODES --------------------------- */
{

/*~struct~eventSt:

@param changeSwitch
@text Change Switch
@type text
@desc \CSw[Id, value]
Replace value with: true, false, or toggle
@default CSW

@param changeSelfSwitch
@text Change Self Switch
@type text
@desc \CSSW[MapId, EventId, SwitchId, value]
Replace value with: true, false, or toggle
@default CSSW

@param changeVariable
@text Change Variable
@type text
@desc \CVar[Id, operator, value]
Replace operator with: -, =, +, %, *, or /
@default CVAR

@param commonEvent
@text Play Common Event
@type text
@desc \Pce[ID]
@default PCE

@param balloon
@text Show Balloon
@type text
@desc \SBI[CharId, BalloonId]
See help file for the Char ID.
@default SBI

@param animation
@text Show Animation
@type text
@desc \SAN[CharId, AnimationId]
See help file for the Char ID.
@default SAN

@param scrollMap
@text Scroll Map
@type text
@desc \Scroll[Direction, Distance, Speed]
@default SCROLL

@param fade
@text Fade In/Out
@type text
@desc \Fade[type, duration]
Replace type with: In or Out. Duration is on frames.
@default FADE

@param tint
@text Tint Screen
@type text
@desc \Tint[r, g, b, gray, duration]
Replace R, G, B, GRAY with values from -255 to 255.
@default TINT

@param flash
@text Flash Screen
@type text
@desc \Flash[r, g, b, intensity, duration]
Replace R, G, B, INTENSITY with values from -255 to 255.
@default FLASH

@param shake
@text Shake Screen
@type text
@desc \Shake[power, speed, duration]
@default SHAKE

@param weather
@text Change Weather
@type text
@desc \Weather[type, power, duration]
Replace type with: none, rain, storm, or snow
@default WEATHER

*/

}

/* -------------------------------- ADVANCED -------------------------------- */
{
/*~struct~advancedSt:

@param formula
@text Evaluate Code
@type text
@desc \Script[Formula]
Any valid javascript formula.
@default SCRIPT

@param image
@text Draw Image
@type text
@desc \DrawImg[folder, fileName, keepRatio, center]
Replace keepRatio with true or false. Folder and filename are case sensitive.
@default DRAWIMG

*/
}

/* --------------------------- MESSAGE FACE CODES --------------------------- */
{

/*~struct~msgFaceSt:

@param actorFace
@text Set Actor Face
@type text
@desc \ActorFace[ActorId]
Will set that actor face to the message.
@default ACTORFACE

@param memberFace
@text Set Party Member Face
@type text
@desc \PartyFace[MemberIndex]
Will set that member face to the message.
@default PARTYFACE

@param faceFile
@text Set Face File
@type text
@desc \FaceName[file]
Will set that face file to the message.
@default FACENAME

@param faceIndex
@text Set Face Index
@type text
@desc \FaceIndex[Number]
Will set that face index to the message.
@default FACEINDEX

@param faceAll
@text Set Face File & Index
@type text
@desc \ChangeFace[File, Index]
Will set that face and index to the message.
@default CHANGEFACE

*/

}

/* -------------------------- MESSAGE DEFAULT CODES ------------------------- */
{

/*~struct~msgDefaultSt:

@param wait
@text Wait Frames
@type text
@desc \Wait[Frames]
Will make the message wait that amount of frames.
@default WAIT

*/

}

/* ------------------------------ OTHER PLUGINS ----------------------------- */
{

/*~struct~extensionPluginsST:

@param changeMessageSE
@text Message Sounds
@type text
@desc \CSE[Id/Index]
Only A-Z. Not case sensitive. (Eli Message Sounds)
@default CSE

@param changeFont
@text Change Font
@type text
@desc \FNT[FontFace]
Only A-Z. Not case sensitive. (Eli Font Manager or Bitmap Font)
@default FNT

*/

}

"use strict"

var Eli = Eli || {}
var Imported = Imported || {}
Imported.Eli_MessageActions = true

if(!Imported.Eli_Book && !window.eliErrorTriggered) {
    window.eliErrorTriggered = true
    if(confirm(`All EliMZ plugins need the core plugin EliMZ_Book. Click OK to download it and install somewhere above all other EliMZ plugins.`)) {
        window.location.href = "https://hakuenstudio.itch.io/eli-book-rpg-maker-mv-mz"
    }
    SceneManager.exit()
}

Eli.MessageActions = {

    inlineImgReg: new RegExp(),
    iconCodes: [],
    rawIconCodes: [],
    commonEvents: [],
    actionCodes: {},

    Parameters: class Parameters{
        constructor(parameters){
            this.underlineHeight = Number(parameters.underlineHeight)
            this.strikeThroughHeight = Number(parameters.strikeThroughHeight)
            this.alignMode = parameters.alignMode === "true"
            this.txt = JSON.parse(parameters.txt)
            this.sound = JSON.parse(parameters.sound)
            this.event = JSON.parse(parameters.event)
            this.advanced = JSON.parse(parameters.advanced)
            this.msgDefault = JSON.parse(parameters.msgDefault)
            this.msgFace = JSON.parse(parameters.msgFace)
            this.extensionPlugins = JSON.parse(parameters.extensionPlugins)
        }
    },

	initialize(){
		Eli.VersionManager.register("EliMZ_MessageActions", "2.1.6")
		this.initParameters()
		this.initActionCodes()
		this.makeIconCodeList()
		this.inlineImgReg = new RegExp(`\\\\${this.parameters.advanced.image}\\[([^\\]]*)\\]`, "gi")
	},

    initParameters(){
        const parameters = PluginManager.parameters("EliMZ_MessageActions")
        this.parameters = new this.Parameters(parameters)
    },

    initActionCodes(){
        const {txt, sound, event, advanced, extensionPlugins, msgDefault, msgFace} = this.parameters
        const codeList = {
            ...txt, ...sound, ...event, ...advanced, ...extensionPlugins, ...msgDefault, ...msgFace
        }
        
        for(const key in codeList){
            const funcName = `actionCode_${key.toUpperCase()}`
            const funcKey = codeList[key].toLowerCase()
            this.actionCodes[funcKey] = funcName
        }

    },

    makeIconCodeList(){
        const escapeChar = "i"
        const iconCodes = [new RegExp(`\\x1b${escapeChar}\\[([^\\[]*)\\]`, "gi")]
        const extraCodes = [/\\i/gi]

        if(Imported.Eli_EscapeCodes){
            const extraIconCodes = Eli.EscapeCodes.list.filter(item => item.functionName.toLowerCase().includes("icon"))

            for(const code of extraIconCodes){
                iconCodes.push(code.reg)
            }

            extraCodes.push(
                new RegExp(`\\${Eli.EscapeCodes.parameters.items.nameIcon}`, "gi"),
                new RegExp(`\\${Eli.EscapeCodes.parameters.weapons.nameIcon}`, "gi"),
                new RegExp(`\\${Eli.EscapeCodes.parameters.armors.nameIcon}`, "gi"),
                new RegExp(`\\${Eli.EscapeCodes.parameters.skills.nameIcon}`, "gi"),
                new RegExp(`\\${Eli.EscapeCodes.parameters.states.nameIcon}`, "gi"),
            )

        }

        this.iconCodes = iconCodes
        this.rawIconCodes = extraCodes
    },

	getBitmapFromDrawCode(folder, filename){
		const path = `img/${folder}/`
		const bitmap = ImageManager.loadBitmap(path, filename)

		return bitmap
	},

	parseInlineImageData(parameters){
		const args = parameters.split(",")
		const firstArg = args[0] || ""
		const secondArg = args[1] || ""
		const hasSize = firstArg !== "" && secondArg !== "" && !isNaN(firstArg) && !isNaN(secondArg)

		if(hasSize){
			const keepRatio = args[4] === undefined ? true : args[4].toLowerCase() === "true"
			const center = args[5] === undefined ? false : args[5].toLowerCase() === "true"

			return {
				hasSize: true,
				width: Number(args[0]),
				height: Number(args[1]),
				folder: args[2],
				filename: args[3],
				keepRatio: keepRatio,
				center: center,
			}
		}else{
			const keepRatio = args[2] === undefined ? true : args[2].toLowerCase() === "true"
			const center = args[3] === undefined ? false : args[3].toLowerCase() === "true"

			return {
				hasSize: false,
				width: 0,
				height: 0,
				folder: args[0],
				filename: args[1],
				keepRatio: keepRatio,
				center: center,
			}
		}
	},

	getInlineImageDrawData(data, bitmap, maxHeight){
		const sourceWidth = data.hasSize ? data.width : bitmap.width
		const sourceHeight = data.hasSize ? data.height : bitmap.height
		let width = sourceWidth
		let height = sourceHeight

		if(data.keepRatio && height > maxHeight && maxHeight > 0){
			const scale = maxHeight / height
			width *= scale
			height *= scale
		}

		return {
			sourceWidth: sourceWidth,
			sourceHeight: sourceHeight,
			width: width,
			height: height,
		}
	},

	createAudioData(parameters){
		const [name, volume, pitch, pan] = parameters.split(",")

		return {
			name: name,
			volume: volume === undefined || volume === "" ? 100 : Number(volume),
			pitch: pitch === undefined || pitch === "" ? 100 : Number(pitch),
			pan: pan === undefined || pan === "" ? 0 : Number(pan),
		}
	},

    calculateVariableValue(operationType, currentValue, newValue){
        switch(operationType){
            case "=": return newValue
            case "+": return currentValue + newValue
            case "-": return currentValue - newValue
            case "*": return currentValue * newValue
            case "/": return currentValue / newValue
            case "%": return currentValue % newValue
        }

        return 0
    },

	getActionCharacter(charId){
		if(Number(charId) === 0 && $gameMessage.isBusy()){
			const interpreter = $gameMessage.getInterpreter()
			return interpreter ? interpreter.character(0) : null
		}else{
			return Eli.Utils.getMapCharacter(charId)
		}
	},

	getSavedData(){
		return $eliData.MessageActions
	},

	makeEmptySavedData(){
		return {
			textAlignments: {},
		}
	},

	getTextAlignment(windowName, defaultAlign){
		if(this.getParam().alignMode){
			return this.getSavedData().textAlignments[windowName] || defaultAlign
		}else{
			return defaultAlign
		}
	},

	setTextAlignment(windowName, align){
		if(this.getParam().alignMode){
			this.getSavedData().textAlignments[windowName] = align
		}
	},

    getParam(){
        return this.parameters
    },

    obtainEscapeParam(textState){
        const text = textState.text.slice(textState.index)
        
        if(text.startsWith("[")){
            return this.getEscapeParamResult(text, textState)
        }else{
            return ""
        }
    },

    getEscapeParamResult(text, textState){
        const end = text.indexOf("]")
        textState.index += end+1
        const result = Eli.String.removeSpaces(text.substring(1, end))

        return result
    },

    removeEval(text){
        const rawText = Eli.EscapeCodes.getRawEvalText(text)
        text = text.replace(rawText, "")

        return text
    },

    removeEvalTernary(text){
        const rawText = Eli.EscapeCodes.getIfRawText(text)
        text = text.replace(rawText, "")

        return text
    },
}

{

const Plugin = Eli.MessageActions
const Alias = {}

Plugin.initialize()

/* -------------------------------- SAVE DATA ------------------------------- */
Alias.Eli_SavedContents_initialize = Eli_SavedContents.prototype.initialize
Eli_SavedContents.prototype.initialize = function(){
	Alias.Eli_SavedContents_initialize.call(this)
	this.MessageActions = Plugin.makeEmptySavedData()
}

Alias.DataManager_extractSaveContents = DataManager.extractSaveContents
DataManager.extractSaveContents = function(contents){
	Alias.DataManager_extractSaveContents.call(this, contents)

	if(!$eliData.MessageActions){
		$eliData.MessageActions = Plugin.makeEmptySavedData()
	}
}

class Sprite_InlineImageContainer extends Sprite{}

/* --------------------------------- BITMAP --------------------------------- */
Alias.Bitmap_initialize = Bitmap.prototype.initialize
Bitmap.prototype.initialize = function(width, height){
    Alias.Bitmap_initialize.call(this, width, height)
    this.initMsgActionMembers()
}

Alias.Bitmap_clear = Bitmap.prototype.clear
Bitmap.prototype.clear = function(){
    Alias.Bitmap_clear.call(this)
    this.clearInlineImage()
}

Bitmap.prototype.clearInlineImage = function(){
    if(this.imgAreas){
        this.imgAreas = []
        this.hasInlineImage = false
    }	
}

Alias.Bitmap_drawTextOutline = Bitmap.prototype._drawTextOutline
Bitmap.prototype._drawTextOutline = function(text, tx, ty, maxWidth){
    if(this.background.canDraw){
        this.drawTextBackgroundColor(text, tx, ty)
    }

    Alias.Bitmap_drawTextOutline.call(this, text, tx, ty, maxWidth)
}

Alias.Bitmap_drawTextBody = Bitmap.prototype._drawTextBody
Bitmap.prototype._drawTextBody = function(text, tx, ty, maxWidth){
    Alias.Bitmap_drawTextBody.call(this, text, tx, ty, maxWidth)

    if(this.underline){
        this.drawTextUnderline(text, tx, ty)
    }

    if(this.strikeThrough){
        this.drawTextStrikeThrough(text, tx, ty)
    }
}

Alias.Bitmap_drawText = Bitmap.prototype.drawText
Bitmap.prototype.drawText = function(text, x, y, maxWidth, lineHeight, align){
    this.lineHeight = lineHeight

    if(this.hasInlineImage){
        this.drawTextWithInlineImage(text, x, y, maxWidth, lineHeight, align, Alias.Bitmap_drawText)
    }else{
        Alias.Bitmap_drawText.call(this, text, x, y, maxWidth, lineHeight, align)
    }
}

Bitmap.prototype.initMsgActionMembers = function(){
    this.hasInlineImage = false
    this.underline = false
    this.background = {color: 0, canDraw: false}
    this.strikeThrough = false
    this.imgAreas = []
    this.lineHeight = 0
}

Bitmap.prototype.getTextActionX = function(text, tx){
	const width = this.measureTextWidth(text)

	if(this.context.textAlign === "center"){
		return tx - width / 2
	}else if(this.context.textAlign === "right"){
		return tx - width
	}else{
		return tx
	}
}

Bitmap.prototype.drawTextBackgroundColor = function(text, tx, ty){
	const context = this.context
	const textHeight = this.lineHeight / 2 + this.fontSize / 4
	const width = this.measureTextWidth(text)
	const x = this.getTextActionX(text, tx)

	context.fillStyle = this.background.color
	context.fillRect(x, ty - textHeight, width, this.fontSize)
}

Bitmap.prototype.drawTextStrikeThrough = function(text, tx, ty){
	const width = this.measureTextWidth(text)
	const strikeHeight = Plugin.getParam().strikeThroughHeight
	const dif = this.fontSize / 4 + strikeHeight
	const x = this.getTextActionX(text, tx)

	this.context.fillStyle = this.textColor
	this.context.fillRect(x, ty - dif, width, strikeHeight)
}

Bitmap.prototype.drawTextUnderline = function(text, tx, ty){
	const width = this.measureTextWidth(text)
	const underlineHeight = Plugin.getParam().underlineHeight
	const x = this.getTextActionX(text, tx)

	this.context.fillStyle = this.textColor
	this.context.fillRect(x, ty + underlineHeight, width, underlineHeight)
}

Bitmap.prototype.drawTextWithInlineImage = function(text, x, y, maxWidth, lineHeight, align, callBack){
    let oldX = x
    let oldWidth = 0

    for(const char of text){
        oldWidth = this.measureTextWidth(char)

        for(const rect of this.imgAreas){
            if(rect.contains(oldX+oldWidth, y)){
                oldX += rect.width + oldWidth
            }
        }

        callBack.call(this, char, oldX, y, maxWidth, lineHeight, align)
        oldX = oldX + oldWidth
    }
}

Bitmap.prototype.adjustCharacterToNotDrawAboveImage = function(textState){
    for(const rect of this.imgAreas){
        const x = textState.x
        const y = textState.y
        textState.x += rect.contains(x, y) ? rect.width : 0
    }

    return textState
}

/* ---------------------------- GAME COMMON EVENT --------------------------- */
Alias.Game_CommonEvent_isActive = Game_CommonEvent.prototype.isActive
Game_CommonEvent.prototype.isActive = function() {
    let isCalledByMessage = false

    if(this.isActivatedByEscapeCode()){
        this.removeFromMessage(this.event().id)
        isCalledByMessage = true
    }

    return Alias.Game_CommonEvent_isActive.call(this) || isCalledByMessage
}

Game_CommonEvent.prototype.removeFromMessage = function(id) {
    const index = Plugin.commonEvents.indexOf(id)
    Plugin.commonEvents.splice(index, 1)
}

Game_CommonEvent.prototype.isActivatedByEscapeCode = function() {
    return Plugin.commonEvents.includes(this.event().id)
}

/* ---------------------------- GAME INTERPRETER ---------------------------- */
Alias.Game_Interpreter_loadImages = Game_Interpreter.prototype.loadImages
Game_Interpreter.prototype.loadImages = function() {
    Alias.Game_Interpreter_loadImages.call(this)
    this.loadInlineImagesOfShowAndScrollText()
}

Game_Interpreter.prototype.loadInlineImagesOfShowAndScrollText = function(){
	const list = this._list.filter(item => item.code === 401 || item.code === 405)

	for(const command of list){
		const text = command.parameters[0]
		Plugin.inlineImgReg.lastIndex = 0
		let match = Plugin.inlineImgReg.exec(text)

		while(match){
			const parameters = Eli.String.removeSpaces(match[1])
			const imageData = Plugin.parseInlineImageData(parameters)
			Plugin.getBitmapFromDrawCode(imageData.folder, imageData.filename)
			match = Plugin.inlineImgReg.exec(text)
		}
	}
}

Alias.Game_Interpreter_command105 = Game_Interpreter.prototype.command105
Game_Interpreter.prototype.command105 = function(params) {
	if(!$gameMessage.isBusy()){
		this.assignMesssageInterpreterAndIds()
	}

	return Alias.Game_Interpreter_command105.call(this, params)
}

/* ------------------------------- WINDOW BASE ------------------------------ */
Alias.Window_Base_initialize = Window_Base.prototype.initialize
Window_Base.prototype.initialize = function(rect){
	Alias.Window_Base_initialize.call(this, rect)
	this.setDefaultTextAlignment()
}

Alias.Window_Base_createTextState = Window_Base.prototype.createTextState
Window_Base.prototype.createTextState = function(text, x, y, width) {
	const textState = Alias.Window_Base_createTextState.call(this, text, x, y, width)
	this.currentTextState = textState

	return textState
}

Alias.Window_Base_processAllText = Window_Base.prototype.processAllText
Window_Base.prototype.processAllText = function(textState) {
	const defaultAlign = this.getMessageActionDefaultAlign()
	this.fixAlign(textState)
	Alias.Window_Base_processAllText.call(this, textState)

	if(!defaultAlign){
		this.currentAlign = null
	}
}

// Show Ballon
Window_Base.prototype.actionCode_BALLOON = function(textState){
	const [charId, balloonId] = Plugin.obtainEscapeParam(textState).split(",")
	const character = Plugin.getActionCharacter(charId)

	if(character){
		$gameTemp.requestBalloon(character, Number(balloonId))
	}
}

// Show Animation
Window_Base.prototype.actionCode_ANIMATION = function(textState){
	const [charId, animationId] = Plugin.obtainEscapeParam(textState).split(",")
	const character = Plugin.getActionCharacter(charId)

	if(character){
		$gameTemp.requestAnimation([character], Number(animationId))
	}
}

// OutlineColor
Window_Base.prototype.actionCode_OUTCOLOR = function(textState){
    const color = Plugin.obtainEscapeParam(textState)

    if(isNaN(color)){
        this.changeOutlineColor(Eli.ColorManager.getHexOrName(color))
    }else{
        this.changeOutlineColor(ColorManager.textColor(Number(color)))
    }
}

Window_Base.prototype.processCurrentAlignment = function(textState, storedAlign){
	const useStoredAlign = !!storedAlign
	const align = storedAlign || Plugin.obtainEscapeParam(textState).toLowerCase()

	return {useStoredAlign, align}
}

Window_Base.prototype.actionCode_ALIGN = function(textState, storedAlign){
	const {useStoredAlign, align} = this.processCurrentAlignment(textState, storedAlign)
	const [baseX, baseWidth] = this.getAlignArea(textState)
	let drawX = baseX
	let textWidth = 0

	if(align === "center"){
		textWidth = this.getTextWidthForAlign(textState)
		drawX = baseX + (baseWidth - textWidth) / 2
	}else if(align === "right"){
		textWidth = this.getTextWidthForAlign(textState)
		drawX = baseX + baseWidth - textWidth
	}else if(textState.rtl){
		textWidth = this.getTextWidthForAlign(textState)
	}

	textState.x = textState.rtl ? drawX + textWidth : drawX
	this.currentAlign = align

	if(!useStoredAlign && Plugin.getParam().alignMode && this.canSaveMessageActionAlignment()){
		Plugin.setTextAlignment(this.constructor.name, align)
	}
}

Window_Base.prototype.getAlignArea = function(textState){
	const itemPadding = this.itemPadding()
	let baseX = textState.startX
	let baseWidth = textState.width

	if(baseWidth > 0){
		if(textState.rtl){
			baseX -= baseWidth
		}
	}else if(textState.rtl){
		baseX = itemPadding
		baseWidth = textState.startX - baseX
	}else{
		baseWidth = this.contentsWidth() - baseX - itemPadding
	}

	return [baseX, baseWidth]
}

Window_Base.prototype.getTextWidthForAlign = function(textState){
	const rawLineText = textState.text.substring(textState.index).split("\n")[0]
	const settings = this.createTextMeasureSettings()
	const measureState = Alias.Window_Base_createTextState.call(this, rawLineText, 0, 0, textState.width)

	measureState.drawing = false
	this.processAllText(measureState)
	this.applyTextMeasureSettings(settings)

	return Math.ceil(measureState.outputWidth)
}

Window_Base.prototype.createTextMeasureSettings = function(){
	const contents = this.contents

	return {
		fontFace: contents.fontFace,
		fontSize: contents.fontSize,
		fontBold: contents.fontBold,
		fontItalic: contents.fontItalic,
		textColor: contents.textColor,
		outlineColor: contents.outlineColor,
		outlineWidth: contents.outlineWidth,
		bitmapFontIndex: contents.bitmapFontIndex,
		bitmapFontSize: contents.bitmapFontSize,
	}
}

Window_Base.prototype.applyTextMeasureSettings = function(settings){
	const contents = this.contents

	contents.fontFace = settings.fontFace
	contents.fontSize = settings.fontSize
	contents.fontBold = settings.fontBold
	contents.fontItalic = settings.fontItalic
	contents.textColor = settings.textColor
	contents.outlineColor = settings.outlineColor
	contents.outlineWidth = settings.outlineWidth
	contents.bitmapFontIndex = settings.bitmapFontIndex
	contents.bitmapFontSize = settings.bitmapFontSize
}

// Paint Background
Window_Base.prototype.actionCode_TEXTBACKGROUND = function(textState){
    const [flag, color] = Plugin.obtainEscapeParam(textState).split(",")

    if(isNaN(color)){
        this.contents.background.color = color || this.contents.background.color
    }else{
        this.contents.background.color = ColorManager.textColor(Number(color))
    }
    
    this.contents.background.canDraw = JSON.parse(flag.toLowerCase()) || false
}

Window_Base.prototype.changeDefaultFont = function(textState){
    const fontFace = Plugin.obtainEscapeParam(textState)

    if(Eli.FontManager.pro){
        Eli.FontManager.changeContainerFont(this.constructor.name, fontFace)
        this.setCustomFont()

    }else{
        this.contents.fontFace = fontFace
    }
}

// Play Common Event
Window_Base.prototype.actionCode_COMMONEVENT = function(textState){
    const commonEventId = Number(Plugin.obtainEscapeParam(textState))
    const index = $gameMap._commonEvents.findIndex(item => item._commonEventId === commonEventId)

    if(index === -1){
        $gameMap._commonEvents.push(new Game_CommonEvent(commonEventId))
    }

    if(!Plugin.commonEvents.includes(commonEventId)){
        Plugin.commonEvents.push(commonEventId)
    }
}

Window_Base.prototype.getMessageActionDefaultAlign = function() {
	return null
}

Window_Base.prototype.canSaveMessageActionAlignment = function() {
	return false
}

Window_Base.prototype.setDefaultTextAlignment = function() {
	const defaultAlign = this.getMessageActionDefaultAlign()

	if(!defaultAlign){
		this.currentAlign = null
	}else if(Plugin.getParam().alignMode && this.canSaveMessageActionAlignment()){
		this.currentAlign = Plugin.getTextAlignment(this.constructor.name, defaultAlign)
	}else{
		this.currentAlign = defaultAlign
	}
}

Alias.Window_Base_processNewLine = Window_Base.prototype.processNewLine
Window_Base.prototype.processNewLine = function(textState) {
    Alias.Window_Base_processNewLine.call(this, textState)
    this.fixAlign(textState)
}

Alias.Window_Base_processEscapeCharacter = Window_Base.prototype.processEscapeCharacter
Window_Base.prototype.processEscapeCharacter = function(code, textState) {
	this.processActionEscapeCharacters(code, textState)
	Alias.Window_Base_processEscapeCharacter.call(this, code, textState)
}

Window_Base.prototype.processActionEscapeCharacters = function(code, textState) {
	const key = code.toLowerCase()
	const funcName = Plugin.actionCodes[key]

	if(this[funcName]){
		if(textState.drawing){
			this[funcName](textState)
		}else{
			this.processMeasureActionEscapeCharacter(funcName, textState)
		}
	}
}

Window_Base.prototype.processMeasureActionEscapeCharacter = function(funcName, textState){
	if(funcName === "actionCode_BOLD" || funcName === "actionCode_ITALIC"){
		this[funcName](textState)
	}else if(funcName === "actionCode_CHANGEFONT"){
		this.applyFontForMeasure(textState)
	}else if(funcName === "actionCode_IMAGE"){
		this.processInlineImageForMeasure(textState)
	}else{
		Plugin.obtainEscapeParam(textState)
	}
}

Window_Base.prototype.applyFontForMeasure = function(textState){
	const fontFace = Plugin.obtainEscapeParam(textState)

	if(Imported.Eli_BitmapFont && Eli.BitmapFont.pro){
		const fontIndex = Eli.BitmapFont.findParameterFontIndex(fontFace)

		if(fontIndex > -1){
			this.contents.bitmapFontIndex = fontIndex
			this.contents.bitmapFontSize = 1
			this.contents.fontSize = this.contents.fontBitmap().height
		}
	}else if(Imported.Eli_FontManager){
		this.contents.fontFace = fontFace
	}
}

Window_Base.prototype.processInlineImageForMeasure = function(textState){
	const parameters = Plugin.obtainEscapeParam(textState)
	const imageData = Plugin.parseInlineImageData(parameters)
	const bitmap = Plugin.getBitmapFromDrawCode(imageData.folder, imageData.filename)
	const drawData = Plugin.getInlineImageDrawData(imageData, bitmap, this.getInlineImageMaxHeight())

	textState.x += textState.rtl ? -drawData.width : drawData.width
}

Window_Base.prototype.getInlineImageMaxHeight = function(){
	const contentsHeight = this.contentsHeight()
	return contentsHeight > 0 ? contentsHeight : this.innerHeight
}

Alias.Window_Base_flushTextState = Window_Base.prototype.flushTextState
Window_Base.prototype.flushTextState = function(textState) {
	if(textState.drawing){
		textState = this.contents.adjustCharacterToNotDrawAboveImage(textState)
	}
	Alias.Window_Base_flushTextState.call(this, textState)
}

Window_Base.prototype.actionCode_COLOR = function(textState){
    const color = Plugin.obtainEscapeParam(textState)

    if(isNaN(color)){
        this.changeTextColor(Eli.ColorManager.getHexOrName(color))
    }else{
        this.processColorChange(Number(color))
    }
}

// Change Switch
Window_Base.prototype.actionCode_CHANGESWITCH = function(textState){
    const [id, value] = Eli.String.removeSpaces(Plugin.obtainEscapeParam(textState)).toLowerCase().split(",")

    if(value === "toggle"){
        var newValue = !$gameSwitches.value(Number(id))
    }else{
        var newValue = value === "true"
    }

    $gameSwitches.setValue(id, newValue)
}

// Change Self Switch
Window_Base.prototype.actionCode_CHANGESELFSWITCH = function(textState){
    let [mapId, eventId, swId, value] = Eli.String.removeSpaces(Plugin.obtainEscapeParam(textState)).toLowerCase().split(",")
    mapId = mapId == 0 ? $gameMap.mapId() : Number(mapId)
    eventId = eventId == 0 ? $gameMap._interpreter._eventId : Number(eventId)
    swId = swId.toUpperCase()
    const key = [mapId, eventId, swId]

    if(value === "toggle"){
        var newValue = !$gameSelfSwitches.value(key)
    }else{
        var newValue = value === "true"
    }

    $gameSelfSwitches.setValue(key, newValue)
}

// Change variable
Window_Base.prototype.actionCode_CHANGEVARIABLE = function(textState){
    let [varId, operator, value] = Plugin.obtainEscapeParam(textState).split(",")
    varId = Number(varId)
    
    if(isNaN(value)){
        value = eval(value) || 0
    }else{
        value = Number(value) || 0
    }

    const currentValue = $gameVariables.value(varId)
    const newValue = Plugin.calculateVariableValue(operator, currentValue, value)
    $gameVariables.setValue(varId, newValue)
}

//Scroll map
Window_Base.prototype.actionCode_SCROLLMAP = function(textState){
    const [direction, distance, speed] = Plugin.obtainEscapeParam(textState).split(",").map(item => Number(item))
    $gameMap.startScroll(direction, distance, speed)
}

// Fade out/In
Window_Base.prototype.actionCode_FADE = function(textState){
	const [type, duration] = Plugin.obtainEscapeParam(textState).split(",")
	const isFadeIn = type.toLowerCase().includes("in")
	const fadeDuration = duration === undefined || duration === "" ? 24 : Number(duration)

	if(isFadeIn){
		$gameScreen.startFadeIn(fadeDuration)
	}else{
		$gameScreen.startFadeOut(fadeDuration)
	}
}

// Tint Screen
Window_Base.prototype.actionCode_TINT = function(textState){
    const parameters = Plugin.obtainEscapeParam(textState)
    const [r, g, b, gray, duration] = parameters.split(",").map(item => Number(item))

    $gameScreen.startTint([r, g, b, gray], duration)
}

// FLASH
Window_Base.prototype.actionCode_FLASH = function(textState){
    const parameters = Plugin.obtainEscapeParam(textState)
    const [r, g, b, intensity, duration] = parameters.split(",").map(item => Number(item))

    $gameScreen.startFlash([r, g, b, intensity], duration)
}

// Shake
Window_Base.prototype.actionCode_SHAKE = function(textState){
    const parameters = Plugin.obtainEscapeParam(textState)
    const [power, speed, duration] = parameters.split(",").map(item => Number(item))

    $gameScreen.startShake(power, speed, duration)
}

// Set Weather Effect "none", "rain", "storm", "snow"
Window_Base.prototype.actionCode_WEATHER = function(textState){
    const parameters = Plugin.obtainEscapeParam(textState)
    const [type, power, duration] = parameters.split(",")

    $gameScreen.changeWeather(type.toLowerCase(), Number(power), Number(duration))
}

// Play BGM
Window_Base.prototype.actionCode_PBGM = function(textState){
	const parameters = Plugin.obtainEscapeParam(textState)
	AudioManager.playBgm(Plugin.createAudioData(parameters))
}

// Fadeout BGM
Window_Base.prototype.actionCode_FOBGM = function(textState){
    const duration = Plugin.obtainEscapeParam(textState)
    AudioManager.fadeOutBgm(Number(duration))
}

// Play BGS
Window_Base.prototype.actionCode_PBGS = function(textState){
	const parameters = Plugin.obtainEscapeParam(textState)
	AudioManager.playBgs(Plugin.createAudioData(parameters))
}

// Fadeout BGS
Window_Base.prototype.actionCode_FOBGS = function(textState){
    const duration = Plugin.obtainEscapeParam(textState)
    AudioManager.fadeOutBgs(Number(duration))
}

// Play ME
Window_Base.prototype.actionCode_PME = function(textState){
	const parameters = Plugin.obtainEscapeParam(textState)
	AudioManager.playMe(Plugin.createAudioData(parameters))
}

// Play SE
Window_Base.prototype.actionCode_PSE = function(textState){
	const parameters = Plugin.obtainEscapeParam(textState)
	AudioManager.playSe(Plugin.createAudioData(parameters))
}

// Eval
Window_Base.prototype.actionCode_FORMULA = function(textState){
    const formula = Plugin.obtainEscapeParam(textState)
    eval(formula)
}

// Bold font
Window_Base.prototype.actionCode_BOLD = function(textState){
    this.contents.fontBold = JSON.parse(Plugin.obtainEscapeParam(textState).toLowerCase())
}

// Italic font
Window_Base.prototype.actionCode_ITALIC = function(textState){
    this.contents.fontItalic = JSON.parse(Plugin.obtainEscapeParam(textState).toLowerCase())
}

// Outline width
Window_Base.prototype.actionCode_OUTWIDTH = function(textState){
    const width = Number(Plugin.obtainEscapeParam(textState))
    this.contents.outlineWidth = width
}

// Image on text
Window_Base.prototype.actionCode_IMAGE = function(textState){
	const parameters = Plugin.obtainEscapeParam(textState)
	const imageData = Plugin.parseInlineImageData(parameters)
	const bitmap = Plugin.getBitmapFromDrawCode(imageData.folder, imageData.filename)
	const maxHeight = this.getInlineImageMaxHeight()
	const startX = textState.x
	const startY = textState.y
	const rtl = textState.rtl
	let drawData = Plugin.getInlineImageDrawData(imageData, bitmap, maxHeight)
	let hasArea = drawData.width > 0 && drawData.height > 0

	this.contents.hasInlineImage = true

	if(hasArea){
		const x = rtl ? startX - drawData.width : startX
		let y = startY

		if(imageData.center && drawData.height < maxHeight){
			y = Math.abs(maxHeight / 2 - drawData.height / 2)
		}

		this.contents.imgAreas.push(new Rectangle(x, y, drawData.width, drawData.height))
		textState.x += rtl ? -drawData.width : drawData.width
	}

	bitmap.addLoadListener(() => {
		drawData = Plugin.getInlineImageDrawData(imageData, bitmap, maxHeight)
		const x = rtl ? startX - drawData.width : startX
		let y = startY

		if(imageData.center && drawData.height < maxHeight){
			y = Math.abs(maxHeight / 2 - drawData.height / 2)
		}

		if(!hasArea && drawData.width > 0 && drawData.height > 0){
			this.contents.imgAreas.push(new Rectangle(x, y, drawData.width, drawData.height))
			hasArea = true
		}

		this.contents.blt( bitmap, 0, 0, drawData.sourceWidth, drawData.sourceHeight, x, y, drawData.width, drawData.height )
	})
}

// Underline
Window_Base.prototype.actionCode_UNDERLINE = function(textState){
    this.contents.underline = JSON.parse(Plugin.obtainEscapeParam(textState).toLowerCase())
}

// Strikethrough
Window_Base.prototype.actionCode_STRIKE = function(textState){
    this.contents.strikeThrough = JSON.parse(Plugin.obtainEscapeParam(textState).toLowerCase())
}

// Change Font
Window_Base.prototype.actionCode_CHANGEFONT = function(textState){
    if(Imported.Eli_BitmapFont && Eli.BitmapFont.pro){
        this.changeBitmapFont(textState)

    }else if(Imported.Eli_FontManager){
        this.changeDefaultFont(textState)
    }
}

Window_Base.prototype.changeBitmapFont = function(textState){
    const bitmapFont = Plugin.obtainEscapeParam(textState)
    const fontIndex = Eli.BitmapFont.findParameterFontIndex(bitmapFont)

    Eli.BitmapFont.changeSavedContainerFont(this.constructor.name, fontIndex)
    this.resetFontSettings()
}

Window_Base.prototype.fixAlign = function(textState) {
	if(textState.drawing && this.currentAlign){
		this.actionCode_ALIGN(textState, this.currentAlign)
	}
}

// Only for message window.
Window_Base.prototype.actionCode_ACTORFACE = function(textState){}
Window_Base.prototype.actionCode_MEMBERFACE = function(textState){}
Window_Base.prototype.actionCode_FACEFILE = function(textState){}
Window_Base.prototype.actionCode_FACEINDEX = function(textState){}
Window_Base.prototype.actionCode_FACEALL = function(textState){}
Window_Base.prototype.actionCode_WAIT = function(textState){}
Window_Base.prototype.actionCode_CHANGEMESSAGESE = function(textState){}

/* ------------------------------- WINDOW MSG ------------------------------- */

Window_Message.prototype.getMessageActionDefaultAlign = function() {
	return "left"
}

Window_Message.prototype.canSaveMessageActionAlignment = function() {
	return true
}

Window_Message.prototype.getFaceRect = function() {
	const rtl = $gameMessage.isRTL()
	const width = ImageManager.faceWidth
	const height = this.innerHeight
	const x = rtl ? this.innerWidth - width - 4 : 4

	return [x, 0, width, height]
}

Alias.Window_Message_startMessage = Window_Message.prototype.startMessage
Window_Message.prototype.startMessage = function() {
	if(!Plugin.getParam().alignMode){
		this.setDefaultTextAlignment()
	}

	Alias.Window_Message_startMessage.call(this)
}

Alias.Window_Message_newPage = Window_Message.prototype.newPage
Window_Message.prototype.newPage = function(textState) {
	Alias.Window_Message_newPage.call(this, textState)
	this.fixAlign(textState)
}

Alias.Window_Message_terminateMessage = Window_Message.prototype.terminateMessage
Window_Message.prototype.terminateMessage = function() {
    Alias.Window_Message_terminateMessage.call(this)
    this.contents.hasInlineImage = false
    this.contents.imgAreas = []
}

Window_Message.prototype.actionCode_ACTORFACE = function(textState){
	const actorId = Number(Plugin.obtainEscapeParam(textState))
	const actor = $dataActors[actorId]

	if(actor){
		this.changeMessageFace(textState, actor.faceName, actor.faceIndex)
	}
}

Window_Message.prototype.actionCode_MEMBERFACE = function(textState){
	const memberIndex = Number(Plugin.obtainEscapeParam(textState))
	const member = $gameParty.members()[memberIndex]

	if(member){
		this.changeMessageFace(textState, member.faceName(), member.faceIndex())
	}
}

Window_Message.prototype.actionCode_FACEFILE = function(textState){
	const faceName = Plugin.obtainEscapeParam(textState)
	this.changeMessageFace(textState, faceName, $gameMessage.faceIndex())
}

Window_Message.prototype.actionCode_FACEINDEX = function(textState){
	const faceIndex = Number(Plugin.obtainEscapeParam(textState))
	this.changeMessageFace(textState, $gameMessage.faceName(), faceIndex)
}

Window_Message.prototype.actionCode_FACEALL = function(textState){
	const [faceName, faceIndex] = Plugin.obtainEscapeParam(textState).split(",")
	this.changeMessageFace(textState, faceName, Number(faceIndex))
}

Window_Message.prototype.changeMessageFace = function(textState, faceName, faceIndex){
	const hadFace = $gameMessage.faceName() !== ""
	const hasFace = faceName !== ""

	$gameMessage.setFaceImage(faceName, faceIndex)

	if(hadFace !== hasFace){
		this.updateTextStateAfterFaceChange(textState, hasFace)
	}

	this.refreshFace(hadFace, hasFace)
}

Window_Message.prototype.updateTextStateAfterFaceChange = function(textState, hasFace){
	textState.startX = this.newLineX(textState)

	if(hasFace){
		if(textState.rtl){
			textState.x = Math.min(textState.x, textState.startX)
		}else{
			textState.x = Math.max(textState.x, textState.startX)
		}
	}
}

// Wait Message
Window_Message.prototype.actionCode_WAIT = function(textState){
    const waitCount = Number(Plugin.obtainEscapeParam(textState))
    this.startWait(waitCount)
}

// Change Talk SE
Window_Message.prototype.actionCode_CHANGEMESSAGESE = function(textState){
    const seId = Plugin.obtainEscapeParam(textState)
    Eli.MessageSounds.cmd_changeSe({id:seId})
}

Window_Message.prototype.refreshFace = function(hadFace, hasFace) {
	if(Imported.Eli_AnimatedFaces){
		Eli.AnimatedFaces.getFaceSprite().refreshAnimatedSettings()

		if(Imported.Eli_FaceWindow){
			Eli.FaceWindow.getFaceSprite().refreshAnimatedSettings()
		}
	}

	this.loadMessageFace()

	if(Imported.Eli_FaceWindow && Eli.FaceWindow.isFaceWindowEnabled()){
		const faceWindow = Eli.FaceWindow.getFaceWindow()

		if(hadFace !== hasFace){
			faceWindow.start(this)
		}else{
			faceWindow.refreshMessageSettings()
		}
	}else if(!Imported.Eli_AnimatedFaces){
		this._faceBitmap.addLoadListener(() => {
			this.contents.clearRect(...this.getFaceRect())
			this.drawMessageFace()
		})
	}
}

/* --------------------------- WINDOW SCROLL TEXT --------------------------- */

Window_ScrollText.prototype.getMessageActionDefaultAlign = function() {
	return "left"
}

Window_ScrollText.prototype.canSaveMessageActionAlignment = function() {
	return true
}

Alias.Window_ScrollText_initialize = Window_ScrollText.prototype.initialize
Window_ScrollText.prototype.initialize = function(rect) {
	Alias.Window_ScrollText_initialize.call(this, rect)
	this.createInlineSpriteForImages()
}

Alias.Window_ScrollText_startMessage = Window_ScrollText.prototype.startMessage
Window_ScrollText.prototype.startMessage = function() {
	if(!Plugin.getParam().alignMode){
		this.setDefaultTextAlignment()
	}

	Alias.Window_ScrollText_startMessage.call(this)
}

Alias.Window_ScrollText_updateMessage = Window_ScrollText.prototype.updateMessage
Window_ScrollText.prototype.updateMessage = function() {
    Alias.Window_ScrollText_updateMessage.call(this)
    if(this.inlineImageSprite){
        this.updateInlineImageSprite()
    }
}

Alias.Window_ScrollText_terminateMessage = Window_ScrollText.prototype.terminateMessage
Window_ScrollText.prototype.terminateMessage = function() {
    Alias.Window_ScrollText_terminateMessage.call(this)
	this.contents.hasInlineImage = false
	this.contents.imgAreas = []
	this.createInlineSpriteForImages()
}

Window_ScrollText.prototype.createInlineSpriteForImages = function(){
    if(this.inlineImageSprite){
        this.inlineImageSprite.destroy()
    }
    this.inlineImageSprite = new Sprite_InlineImageContainer()
    this.addChild(this.inlineImageSprite)
    this.imageIds = []
}

Window_ScrollText.prototype.updateInlineImageSprite = function(){
    const y = this.origin.y + this.height
    this.inlineImageSprite.y = this.height - y
    this.inlineImageSprite.children.forEach(child => {
        child.visible = child.y < Graphics.height
    })
}

Window_ScrollText.prototype.actionCode_IMAGE = function(textState){
	const parameters = Plugin.obtainEscapeParam(textState)
	const imageData = Plugin.parseInlineImageData(parameters)
	const bitmap = Plugin.getBitmapFromDrawCode(imageData.folder, imageData.filename)
	const imageId = textState.index
	const maxHeight = this.getInlineImageMaxHeight()
	const startX = textState.x
	const startY = textState.y
	const rtl = textState.rtl
	const drawData = Plugin.getInlineImageDrawData(imageData, bitmap, maxHeight)

	this.contents.hasInlineImage = true

	if(drawData.width > 0 && drawData.height > 0){
		const baseX = rtl ? startX - drawData.width : startX
		const x = imageData.center ? (this.innerWidth - drawData.width) / 2 : baseX
		this.contents.imgAreas.push(new Rectangle(x, startY, drawData.width, drawData.height))
		textState.x += rtl ? -drawData.width : drawData.width
	}

	bitmap.addLoadListener(() => {
		const loadedData = Plugin.getInlineImageDrawData(imageData, bitmap, maxHeight)
		const baseX = rtl ? startX - loadedData.width : startX
		const x = imageData.center ? (this.innerWidth - loadedData.width) / 2 : baseX

		if(this.inlineImageSprite && !this.imageIds.includes(imageId)){
			const sprite = new Sprite(bitmap)
			sprite.visible = false
			sprite.x = x + 16
			sprite.y = startY
			sprite.setFrame(0, 0, loadedData.sourceWidth, loadedData.sourceHeight)

			if(loadedData.sourceWidth > 0 && loadedData.sourceHeight > 0){
				sprite.scale.x = loadedData.width / loadedData.sourceWidth
				sprite.scale.y = loadedData.height / loadedData.sourceHeight
			}

			this.imageIds.push(imageId)
			this.inlineImageSprite.addChild(sprite)
		}
	})
}

/* ------------------------------ WINDOW CHOICE ----------------------------- */
Window_ChoiceList.prototype.getMessageActionDefaultAlign = function() {
	return "left"
}

Window_ChoiceList.prototype.canSaveMessageActionAlignment = function() {
	return true
}

Alias.Window_ChoiceList_initialize = Window_ChoiceList.prototype.initialize
Window_ChoiceList.prototype.initialize = function() {
    this.initMessageActionsMembers()
    Alias.Window_ChoiceList_initialize.call(this)
}

Alias.Window_ChoiceList_maxChoiceWidth = Window_ChoiceList.prototype.maxChoiceWidth
Window_ChoiceList.prototype.maxChoiceWidth = function() {
	if(this.cachedMaxChoiceWidth === 0){
		this.cachedMaxChoiceWidth = Alias.Window_ChoiceList_maxChoiceWidth.call(this)
	}

	return this.cachedMaxChoiceWidth
}

Alias.Window_ChoiceList_start = Window_ChoiceList.prototype.start
Window_ChoiceList.prototype.start = function() {
    this.initMessageActionsMembers()
    Alias.Window_ChoiceList_start.call(this)
}

Window_ChoiceList.prototype.initMessageActionsMembers = function() {
	this.cachedMaxChoiceWidth = 0
	this.setDefaultTextAlignment()
}

if(Imported.CGMZ_Encyclopedia){

    Alias.CGMZ_Window_EncyclopediaDisplay_actionCode_IMAGE = CGMZ_Window_EncyclopediaDisplay.prototype.actionCode_IMAGE
    CGMZ_Window_EncyclopediaDisplay.prototype.actionCode_IMAGE = function(textState){
        if(textState.drawing){
            Alias.CGMZ_Window_EncyclopediaDisplay_actionCode_IMAGE.call(this, textState)
        }
    }
}

if(Imported.VisuMZ_1_MessageCore){

	Window_Base.prototype.processCurrentAlignment = function(textState, storedAlign){
		const useStoredAlign = !!storedAlign
		const align = storedAlign || Plugin.obtainEscapeParam(textState).toLowerCase()

		if(!useStoredAlign){
			this.setTextAlignment("default")
		}

		return {useStoredAlign, align}
	}

	Window_Base.prototype.fixAlign = function(textState) {
		if(textState.drawing && this.currentAlign && !this.isVisuTextAlignmentActive()){
			this.actionCode_ALIGN(textState, this.currentAlign)
		}
	}

	Window_Base.prototype.isVisuTextAlignmentActive = function() {
		return this.getTextAlignment() !== "default"
	}
}

}
