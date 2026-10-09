//============================================================================
// EliMZ_Book.js
//============================================================================

/*:
@target MZ
@orderAfter DotMoveSystem
@orderAfter DotMoveSystem_FunctionEx

@plugindesc ♦6.3.0♦ Essential plugin for all Eli plugins.
@author Hakuen Studio
@url https://docs.google.com/document/d/1ckAG8ESh6U47Eje2QZ6oajv-cRcsdUJUmRS7PvOseBc/edit?usp=sharing

@help
↑↑↑ HOW TO USE / HELP FILE ABOVE ↑↑↑

★★★★★ → Rate the plugin! Please, is very important to me ^^
https://hakuenstudio.itch.io/eli-book-rpg-maker-mv-mz/rate?source=game

♦ TERMS OF USE
https://www.hakuenstudio.com/terms-of-use-5-0-0

♦ DOWNLOAD
https://hakuenstudio.itch.io/eli-book-rpg-maker-mv-mz

♦ SUPPORT
https://hakuenstudio.itch.io/eli-book-rpg-maker-mv-mz/community

♦ FEATURES

● Core Plugin for Eli Plugins
● Check if you have outdated versions of other Eli plugins
● Shows newly released Eli plugins during playtest
● Improves the error log so you can understand better what is happening
● Provides some engine changes:
- Can remove scroll bars for games with small screen size
- Can disable Effekseer
- Fixes an RPG Maker bug that when reloading the game the sprite images are gone
● Several quality of life for playtest settings:
- Make the game keep playing when window is out of focus
- Changes game window position to open where you want instead of always centered
- Automatically open dev tools
- Quick restart game with F5
- Start the game with FPS on

@param checkVersion
@text Check Plugin Versions
@type boolean
@desc Set to true to check for new versions of the Eli Plugins.
@default true

@param showNewReleases
@text Show New Plugin Releases
@type boolean
@desc Show newly released Eli plugins for seven days after their release date.
@default true

@param updateErrorPrinter
@text Updated Error Display
@type boolean
@desc Enable improved error log display.
@default true

@param iterateEventList
@text Always Iterate Event List
@type boolean
@desc Set to true to always iterate event list. Otherwise, event need the note: <IterateList>. See help file.
@default true

@param engine
@text Engine Settings
@type struct<engineSt>
@desc Main settings about the engine.
@default {"styleOverflow":"false","disableEffekseer":"false","--- BUG FIXES ---":"","fixBitmapStartLoad":"true","--- PERFORMANCE ---":"","colorCache":"true","windowLayerOptimization":"Disabled"}

@param playtest
@text Playtest Settings
@type struct<developerSt>
@desc Play test settings.
@default {"gameFocus":"false","enableGameWindowPosition":"false","alignX":"left","offsetX":"10","alignY":"top","offsetY":"10","openDevTools":"false","quickRestart":"true","startFps":"false"}

*/

/* ----------------------------- ENGINE SETTINGS ---------------------------- */
{
/*~struct~engineSt:

@param styleOverflow
@text Window Scroll Bars
@type boolean
@desc Remove the scroll bars of the game window that can appear when screen size is small.
@default true

@param disableEffekseer
@text Disable Effekseer
@type boolean
@desc Set it to true, wil completely wipe out any effekseer reference from your code.
@default false

@param --- BUG FIXES ---

@param fixBitmapStartLoad
@text Fix Bitmap Start Load
@type boolean
@desc MZ 1.5.0 or higher - If true, it will fix the issue of not showing sprites on screen after hit F5.
@default true

@param --- PERFORMANCE ---

@param colorCache
@text Color Cache
@type boolean
@desc Set to true to enable a color cache system that speeds up the process of getting a windowskin color.
@default true

@param windowLayerOptimization
@text Window Layer Optimization
@type select
@option Disabled
@option Level 1
@option Level 2
@option Level 3
@desc Select the WindowLayer performance optimization level.
@default Disabled

*/

}

/* -------------------------------- PLAY TEST ------------------------------- */
{
/*~struct~developerSt:

@param gameFocus
@text Game Focus
@type boolean
@desc If true, the game will keep playing even when out of focus.
@default false

@param enableGameWindowPosition
@text Game Window Position
@type boolean
@desc Change the game window position when open Dev Tools. Set false to not use it.
@default false

@param alignX
@text Align X
@type select
@option left
@option center
@option right
@desc Select left to only use offset value.
@default left
@parent enableGameWindowPosition

@param offsetX
@text Position X
@type text
@desc The Offset X position.
@default 10
@parent alignX
@parent enableGameWindowPosition

@param alignY
@text Align Y
@type select
@option top
@option center
@option bottom
@desc Select top to only use offset value.
@default top
@parent enableGameWindowPosition

@param offsetY
@text Position Y
@type text
@desc The offset Y position.
@default 10
@parent enableGameWindowPosition

@param openDevTools
@text Auto Open Dev Tools
@type boolean
@desc If true, it will open the Dev Tools automatically.
@default false

@param quickRestart
@text Quick F5
@type boolean
@desc If true, when press F5 the game will reload faster.
@default false

@param startFps
@text Start FPS
@type boolean
@desc If true, the game will start with FPS counter opened.
@default false

*/
}

"use strict"

var Eli = Eli || {}
var Imported = Imported || {}
Imported.Eli_Book = true

/* --------------------------- SPRITE ANIMATION MV -------------------------- */
class Sprite_InnerAnimationMV extends Sprite_AnimationMV{

	updateFlash(){
		if(this._flashDuration > 0){

			if(this._targets.filter){
				super.updateFlash()
			}else{
				this.updateFlashForSingleTarget()
			}
		}
	}

	onEnd(){
		if(this.hasAnyFlashDuration()){
			this.visible = false
		}else if(this._targets.filter){
			super.onEnd()
		}else{
			this.onEndSingleTarget()
		}
	}

	isPlaying(){
		return super.isPlaying() || this.hasAnyFlashDuration()
	}

	updatePosition(){
		/* This was suppose to go on the updateMain function. But there is no way to set
        it there, without overwriting it. So I put this here, that happens right before
        the this._duration property is lowered.
        */
		this._duration = Math.max(0, this._duration)
		super.updatePosition()
	}

	updateFlashForSingleTarget(){
		const d = this._flashDuration--
		this._flashColor[3] *= (d - 1) / d
		this._targets.setBlendColor(this._flashColor)
	}

	hasAnyFlashDuration(){
		return this._flashDuration > 0 || this._screenFlashDuration > 0
	}

	onEndSingleTarget(){
		this._flashDuration = 0
		this._screenFlashDuration = 0
		this._hidingDuration = 0
		this._targets.setBlendColor([0, 0, 0, 0])
		this._targets.show() 
	}
}

/* ========================================================================== */
/*                                    ANIME                                   */
/* ========================================================================== */
Eli.Easings = {

	linear(t){ return t },
/* ------------------------------- DEFAULT MZ ------------------------------- */
	slowStart(t){ return this.easeInQuad(t) },
	slowEnd(t){ return this.easeOutQuad(t) },
	slowStartEnd(t){ return this.easeInOutQuad(t) },
/* ---------------------------------- QUAD ---------------------------------- */
	easeInQuad(t){ return t**2 },
	easeOutQuad(t){ return t * (2 - t) },
	easeInOutQuad(t){ if((t *= 2) < 1){ return 0.5 * this.easeInQuad(t) } return -0.5 * (--t * (t - 2) - 1) },
	easeOutInQuad(t){ if(t < 0.5){ return this.easeOutQuad(t * 2) / 2 } return this.easeInQuad((t - 0.5) * 2) / 2 + 0.5 },
/* ---------------------------------- CUBIC --------------------------------- */
	easeInCubic(t){ return t**3 },
	easeOutCubic(t){ return --t * t * t + 1 },
	easeInOutCubic(t){ if((t *= 2) < 1){ return 0.5 * this.easeInCubic(t) } return 0.5 * ((t -= 2) * t * t + 2) },
	easeOutInCubic(t){ if(t < 0.5){ return this.easeOutCubic(t * 2) / 2 } return this.easeInCubic((t - 0.5) * 2) / 2 + 0.5 },
/* ---------------------------------- QUART --------------------------------- */
	easeInQuart(t){ return t**4 },
	easeOutQuart(t){ return 1 - --t * t**3 },
	easeInOutQuart(t){ if((t *= 2) < 1){ return 0.5 * this.easeInQuart(t) } return -0.5 * ( (t -= 2) * t**3 - 2) },
	easeOutInQuart(t){ if(t < 0.5){ return this.easeOutQuart(t * 2) / 2 } return this.easeInQuart((t - 0.5) * 2) / 2 + 0.5 },
/* ---------------------------------- QUINT --------------------------------- */
	easeInQuint(t){ return t**5 },
	easeOutQuint(t){ return --t * t**4 + 1 },
	easeInOutQuint(t){ if((t *= 2) < 1){ return 0.5 * this.easeInQuint(t) } return 0.5 * ( (t -= 2) * t**4 + 2) },
	easeOutInQuint(t){ if(t < 0.5){ return this.easeOutQuint(t * 2) / 2 } return this.easeInQuint((t - 0.5) * 2) / 2 + 0.5 },
/* ---------------------------------- SINE ---------------------------------- */
	easeInSine(t){ const pi = Math.PI; return Math.cos(t * pi / 2 - pi) + 1.0 },
	easeOutSine(t){ return Math.sin((t * Math.PI) / 2) },
	easeInOutSine(t){ return 0.5 * (1 - Math.cos(Math.PI * t)) },
	easeOutInSine(t){ if(t < 0.5){ return this.easeOutSine(t * 2) / 2 } return this.easeInSine((t - 0.5) * 2) / 2 + 0.5 },
/* ---------------------------------- EXPO ---------------------------------- */
	easeInExpo(t){ return t === 0 ? 0 : Math.pow(1024, t - 1) },
	easeOutExpo(t){ return t === 1 ? 1 : 1 - Math.pow(2, -10 * t) },
	easeInOutExpo(t){ if (t === 0){ return 0 } if (t === 1){ return 1 } if ((t *= 2) < 1) { return 0.5 * Math.pow(1024, t - 1) } return 0.5 * (-Math.pow(2, -10 * (t - 1)) + 2) },
	easeOutInExpo(t){ if(t < 0.5){ return this.easeOutExpo(t * 2) / 2 } return this.easeInExpo((t - 0.5) * 2) / 2 + 0.5 },
/* ---------------------------------- CIRC ---------------------------------- */
	easeInCirc(t){ return 1 - Math.sqrt(1 - t * t) },
	easeOutCirc(t){ return Math.sqrt(1 - --t * t) },
	easeInOutCirc(t){ if ((t *= 2) < 1){ return -0.5 * (Math.sqrt(1 - t * t) - 1) } return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1) },
	easeOutInCirc(t){ if(t < 0.5){ return this.easeOutCirc(t * 2) / 2 } return this.easeInCirc((t - 0.5) * 2) / 2 + 0.5 },
/* ---------------------------------- BACK ---------------------------------- */
	easeInBack(t){ const s = 1.70158; return t * t * ((s + 1) * t - s) },
	easeOutBack(t){ const s = 1.70158; return --t * t * ((s + 1) * t + s) + 1 },
	easeInOutBack(t){ const s = 1.70158 * 1.525; if((t *= 2) < 1){ return 0.5 * (t * t * ((s + 1) * t - s)) }else{ return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2) } },
	easeOutInBack(t){ if(t < 0.5){ return this.easeOutBack(t * 2) / 2 } return this.easeInBack((t - 0.5) * 2) / 2 + 0.5 },
/* --------------------------------- BOUNCE --------------------------------- */
	easeInBounce(t){ return 1 - this.easeOutBounce(1 - t) },
	easeOutBounce(t){ if (t < 1 / 2.75) { return 7.5625 * t * t } else if (t < 2 / 2.75) { return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75 } else if (t < 2.5 / 2.75) { return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375 } else { return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375 } },
	easeInOutBounce(t){ if(t < 0.5){ return this.easeInBounce(t * 2) * 0.5 } return this.easeOutBounce(t * 2 - 1) * 0.5 + 0.5 },
	easeOutInBounce(t){ if(t < 0.5){ return this.easeOutBounce(t * 2) / 2 } return this.easeInBounce((t - 0.5) * 2) / 2 + 0.5 },
/* --------------------------------- ELASTIC -------------------------------- */
	easeInElastic(t){ if (t === 0){ return 0 } if (t === 1){ return 1 } return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI) },
	easeOutElastic(t){ if (t === 0){ return 0 } if (t === 1){ return 1 } return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1 },
	easeInOutElastic(t){ if (t === 0){ return 0 } if (t === 1){ return 1 } t *= 2; if (t < 1){ return -0.5 * Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI) } return 0.5 * Math.pow(2, -10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI) + 1 },
	easeOutInElastic(t){ if(t < 0.5){ return this.easeOutElastic(t * 2) / 2 } return this.easeInElastic((t - 0.5) * 2) / 2 + 0.5 },
/* --------------------------------- EXECUTE -------------------------------- */
	execute(type, t){ 
		return this[type](t) 
	},
}

Eli.AnimeBase = class AnimeBase {

	constructor(target, propName, duration, easing, direction, loop){
		this.initBasic(target, propName, duration, easing)
		this.initDirection(direction)
		this.initLoop(loop)
		this.initOtherMembers()
	}

	initBasic(target, propName, duration, easing){
		this.target = target
		this.propName = propName
		this.duration = duration || 1
		this.easing = easing || "linear"
	}

	initDirection(direction){
		this.directionType = direction || "normal"
		this.currentDirection = this.directionType === "reverse" ? "reverse" : "normal"
	}

	initLoop(loop){
		const value = loop || 0
		this.currentLoop = 0

		if(value === -1){
			this.loopTotal = -1
		}else if(this.directionType === "alternate" && value === 0){
			this.loopTotal = 1
		}else{
			this.loopTotal = value
		}
	}

	initOtherMembers(){
		this.elapsed = 0
		this.totalTimeElapsed = 0
		this.totalValueChanged = 0
		this.running = false
		this.finished = false
		this.progress = 0
	}

	reverse(){
		this.currentDirection = this.currentDirection === "normal" ? "reverse" : "normal"
		this.start(this.currentDirection)
	}

	restart(direction){
		this.start(direction)
	}

	start(direction){
		this.resetProperties()
		this.refreshDirection(direction)
		this.refreshStartValue()
	}

	resetProperties(){
		this.currentLoop = 0
		this.elapsed = 0
		this.running = true
		this.finished = false
		this.progress = 0
	}

	refreshDirection(direction){
		const value = direction ? String(direction).toLowerCase() : ""

		if(this.isValidDirection(value)){
			this.currentDirection = value
		}
	}

	isValidDirection(direction){
		return direction === "normal" || direction === "reverse"
	}

	update(){
		if(this.canUpdateAnimation()){
			this.updateAnimation()
		}
	}

	canUpdateAnimation(){
		return this.running && !this.finished
	}

	updateAnimation(){
		this.totalTimeElapsed++
		this.updateAnimationFrame()
	}

	updateAnimationFrame(){
		this.elapsed++

		this.updateProperty()
		this.refreshProgress()

		if(this.canFinish()){
			this.onAnimationEnd()
		}else{
			this.onAnimationNotFinished()
		}
	}

	updateProperty(){}

	canFinish(){
		return this.elapsed >= this.duration
	}

	onAnimationEnd(){
		this.elapsed = 0
		this.currentLoop++

		if(this.needLoop()){
			this.startLoop()
		}else{
			this.finishPropertyValue()
			this.finishAnimation()
		}
	}

	needLoop(){
		return this.loopTotal === -1 || this.currentLoop <= this.loopTotal
	}

	startLoop(){
		this.refreshAnimationDirection()
		this.refreshStartValue()
	}

	refreshAnimationDirection(){
		if(this.directionType === "alternate"){
			this.currentDirection = this.currentDirection === "normal" ? "reverse" : "normal"
		}
	}

	refreshStartValue(){}

	finishPropertyValue(){}

	finishAnimation(){
		this.running = false
		this.finished = true
		this.progress = 1
	}

	onAnimationNotFinished(){}

	stop(){
		this.finishAnimation()
	}

	pause(){
		this.running = false
	}

	resume(){
		if(!this.finished){
			this.running = true
		}
	}

	isPaused(){
		return !this.running && !this.finished
	}

	isRunning(){
		return this.running
	}

	isFinished(){
		return this.finished
	}

	getCurrentTime(){
		let time = this.elapsed / this.duration

		if(time < 0){
			time = 0
		}else if(time > 1){
			time = 1
		}

		return time
	}

	refreshProgress(){
		this.progress = this.getProgress()
	}

	getProgress(){
		if(this.loopTotal === -1){
			return this.getCurrentTime()
		}else{
			const totalFrames = (this.loopTotal + 1) * this.duration
			const doneFrames = (this.currentLoop * this.duration) + this.elapsed

			let p = doneFrames / totalFrames

			if(p < 0){
				p = 0
			}else if(p > 1){
				p = 1
			}

			return p
		}
	}

	getProgressText(){
		const percent = Math.floor(this.getProgress() * 100)
		return percent + "%"
	}

	getTotalValueChanged(){
		return this.totalValueChanged
	}

	getTotalTimeElapsed(){
		return this.totalTimeElapsed
	}

	getTarget(){
		return this.target
	}

	getPropName(){
		return this.propName
	}

	getCurrentPropValue(){
		return this.target[this.propName]
	}

	setPropValue(value){
		this.target[this.propName] = value
	}

	forceFinish(direction){
		if(direction){
			if(direction === "alternate"){
				this.currentDirection = this.currentDirection === "normal" ? "reverse" : "normal"
			}else{
				this.currentDirection = direction
			} 
		}
		this.loopTotal = 0
		this.currentLoop = 1
		this.elapsed = this.duration

		this.finishPropertyValue()
		this.finishAnimation()
	}

	hasEnd(){
		return true
	}
}

Eli.AnimeLevel0 = class AnimeLevel0 extends Eli.AnimeBase {

	constructor(data){
		const {target, propName, incrementValue, direction} = data
		super(target, propName, 1, "linear", direction, -1)
		this.incrementValue = incrementValue || 0
	}

	updateProperty(){
		const current = this.getCurrentPropValue()
		const value = current + this.incrementValue

		this.totalValueChanged += Math.abs(this.incrementValue)
		this.setPropValue(value)
	}

	canFinish(){
		return false
	}

	hasEnd(){
		return false
	}

	refreshStartValue(){}

	finishPropertyValue(){}
}

Eli.AnimeLevel1 = class AnimeLevel1 extends Eli.AnimeBase {

	constructor(data){
		const {target, propName, targetValue, duration, easing, direction, loop} = data
		super(target, propName, duration, easing, direction, loop)
		this.initValues(targetValue)
	}

	initValues(targetValue){
		if(Array.isArray(targetValue)){
			this.startValue = targetValue[0]
			this.targetValue = targetValue[1]
		}else{
			this.startValue = this.getCurrentPropValue()
			this.targetValue = targetValue
		}
	}

	updateProperty(){
		const current = this.getCurrentPropValue()
		const time = this.getCurrentTime()
		const eased = Eli.Easings.execute(this.easing, time)
		const range = this.getPropertyRange()
		const value = this.calculateValue(range.start, range.end, eased)

		this.totalValueChanged += Math.abs(value - current)
		this.setPropValue(value)
	}

	getPropertyRange(){
		if(this.currentDirection === "reverse"){
			return { start: this.targetValue, end: this.startValue }
		}else{
			return { start: this.startValue, end: this.targetValue }
		}
	}

	calculateValue(a, b, t){
		return a + (b - a) * t
	}

	refreshStartValue(){
		const value = this.currentDirection === "reverse" ? this.targetValue : this.startValue
		this.setPropValue(value)
	}

	finishPropertyValue(){
		const value = this.currentDirection === "reverse" ? this.startValue : this.targetValue
		this.setPropValue(value)
	}

	getStartValue(){
		return this.startValue
	}

	getTargetValue(){
		return this.targetValue
	}

}

Eli.AnimeLevel2 = class AnimeLevel2 extends Eli.AnimeLevel1 {

	constructor(data){
		const {startDelay, animationDelay, finishDelay, loopDelay} = data
		super(data)
		this.initDelays(startDelay, animationDelay, finishDelay, loopDelay)
	}

	initDelays(startDelay, animationDelay, finishDelay, loopDelay){
		this.startDelay = startDelay || 0
		this.animationDelay = animationDelay || 0
		this.finishDelay = finishDelay || 0
		this.loopDelay = loopDelay || 0
		this.startDelayLeft = 0
		this.animationDelayLeft = 0
		this.finishDelayLeft = 0
		this.loopDelayLeft = 0
	}

	resetProperties(){
		super.resetProperties()
		this.resetDelays()
	}

	resetDelays(){
		this.startDelayLeft = this.startDelay
		this.animationDelayLeft = 0
		this.finishDelayLeft = 0
		this.loopDelayLeft = 0
	}

	getUpdatePhase(){
		if(this.startDelayLeft > 0){
			return "startDelay"
		}else if(this.finishDelayLeft > 0){
			return "finishDelay"
		}else if(this.loopDelayLeft > 0){
			return "loopDelay"
		}else if(this.animationDelayLeft > 0){
			return "animationDelay"
		}else{
			return "updateAnimation"
		}
	}

	updateAnimation(){
		this.totalTimeElapsed++

		const phase = this.getUpdatePhase()

		if(phase === "startDelay"){
			this.updateStartDelay()
		}else if(phase === "finishDelay"){
			this.updateFinishDelay()
		}else if(phase === "loopDelay"){
			this.updateLoopDelay()
		}else if(phase === "animationDelay"){
			this.updateAnimationDelay()
		}else{
			this.updateAnimationFrame()
		}
	}

	updateStartDelay(){
		this.startDelayLeft--
	}

	updateFinishDelay(){
		this.finishDelayLeft--

		if(this.finishDelayLeft <= 0){
			this.finishAnimation()
		}
	}

	updateLoopDelay(){
		this.loopDelayLeft--

		if(this.loopDelayLeft <= 0){
			this.startLoop()
		}
	}

	updateAnimationDelay(){
		this.animationDelayLeft--
	}

	onAnimationEnd(){
		this.elapsed = 0
		this.currentLoop++
		this.finishPropertyValue()

		if(this.needLoop()){
			this.startLoopDelay()
		}else{
			this.startFinishDelay()
		}
	}

	startLoopDelay(){
		this.loopDelayLeft = this.loopDelay

		if(this.loopDelayLeft === 0){
			this.startLoop()
		}
	}

	startFinishDelay(){
		this.finishDelayLeft = this.finishDelay

		if(this.finishDelayLeft === 0){
			this.finishAnimation()
		}
	}

	onAnimationNotFinished(){
		this.startAnimationDelay()
	}

	startAnimationDelay(){
		this.animationDelayLeft = this.animationDelay
	}
}

Eli.AnimeLevel3 = class AnimeLevel3 extends Eli.AnimeLevel2 {

	constructor(data){
		super(data)
		this.setCallbacks(data.callbacks)
	}

	setCallbacks(callbacks){
		this.callbacks = callbacks || {}
	}

	setCallback(name, fn){
		this.callbacks[name] = fn
	}

	callCallback(name){
		const callback = this.callbacks[name]

		if(typeof callback === "function"){
			callback.call(this, this)
		}
	}

	start(direction){
		super.start(direction)

		this.callCallback("onStart")

		if(this.startDelay > 0 && this.startDelayLeft > 0){
			this.callCallback("onStartDelayBegin")
		}
	}

	updateStartDelay(){
		super.updateStartDelay()

		if(this.startDelay > 0 && this.startDelayLeft === 0){
			this.callCallback("onStartDelayEnd")
		}
	}

	startAnimationDelay(){
		super.startAnimationDelay()

		if(this.animationDelay > 0 && this.animationDelayLeft > 0){
			this.callCallback("onAnimationDelayBegin")
		}
	}

	updateAnimationDelay(){
		super.updateAnimationDelay()

		if(this.animationDelay > 0 && this.animationDelayLeft === 0){
			this.callCallback("onAnimationDelayEnd")
		}
	}

	startFinishDelay(){
		this.finishDelayLeft = this.finishDelay

		if(this.finishDelay > 0){
			this.callCallback("onFinishDelayBegin")
		}else{
			this.finishAnimation()
		}
	}

	updateFinishDelay(){
		this.finishDelayLeft--

		if(this.finishDelayLeft <= 0){
			if(this.finishDelay > 0){
				this.callCallback("onFinishDelayEnd")
			}
			this.finishAnimation()
		}
	}

	startLoopDelay(){
		this.loopDelayLeft = this.loopDelay

		if(this.loopDelay > 0){
			this.callCallback("onLoopDelayBegin")
		}else{
			this.startLoop()
		}
	}

	updateLoopDelay(){
		this.loopDelayLeft--

		if(this.loopDelayLeft <= 0){
			if(this.loopDelay > 0){
				this.callCallback("onLoopDelayEnd")
			}
			this.startLoop()
		}
	}

	updateAnimationFrame(){
		this.elapsed++

		this.updateProperty()
		this.refreshProgress()

		this.callCallback("onUpdateAnimation")

		if(this.canFinish()){
			this.onAnimationEnd()
		}else{
			this.startAnimationDelay()
		}
	}

	onAnimationEnd(){
		this.elapsed = 0
		this.currentLoop++

		this.finishPropertyValue()
		this.callCallback("onAnimationEnd")

		if(this.needLoop()){
			this.startLoopDelay()
		}else{
			this.startFinishDelay()
		}
	}

	startLoop(){
		this.refreshAnimationDirection()
		this.callCallback("onLoop")
		this.refreshStartValue()
	}

	finishAnimation(){
		const wasFinished = this.finished

		super.finishAnimation()

		if(!wasFinished){
			this.callCallback("onFinish")
		}
	}

	forceFinish(){
		this.loopTotal = 0
		this.currentLoop = 1
		this.elapsed = this.duration

		this.finishPropertyValue()
		this.finishAnimation()
	}

}

Eli.AnimeCollection = class AnimeCollection {

	constructor(animes, data){
		this.setAnimations(animes)
		this.initDelay(data)
		this.initDirection(data)
		this.setCallbacks(data.callbacks)
		this.initLoop(data)
		this.initOthers()
	}

	setAnimations(animations){
		this.animes = animations || []
	}

	initDelay(data){
		this.startDelay = Number(data.startDelay) || 0
		this.animationDelay = Number(data.animationDelay) || 0
		this.finishDelay = Number(data.finishDelay) || 0
		this.loopDelay = Number(data.loopDelay) || 0
		this.startDelayLeft = 0
		this.animationDelayLeft = 0
		this.finishDelayLeft = 0
		this.loopDelayLeft = 0
	}

	initDirection(data){
		this.directionType = data.direction || "normal"
		this.currentDirection = this.directionType === "reverse" ? "reverse" : "normal"
	}

	setCallbacks(callbacks){
		this.callbacks = callbacks || {}
	}

	initLoop(data){
		const value = data.loop || 0
		this.currentLoop = 0

		if(value === -1){
			this.loopTotal = -1
		}else if(this.directionType === "alternate" && value === 0){
			this.loopTotal = 1
		}else{
			this.loopTotal = value
		}
	}

	initOthers(){
		this.running = false
		this.finished = false
		this.progress = 0
		this.totalTimeElapsed = 0
	}

	callCallback(name){
		const callback = this.callbacks[name]

		if(typeof callback === "function"){
			callback.call(this, this)
		}
	}

	setCallback(name, fn){
		this.callbacks[name] = fn
	}

	start(direction = "normal"){
		this.resetProperties()
		this.currentDirection = direction
		this.startDelayLeft = this.startDelay

		for(const anime of this.animes){
			anime.start(this.currentDirection)
		}

		this.callCallback("onStart")

		if(this.startDelay > 0){
			this.callCallback("onStartDelayBegin")
		}
	}

	reverse(){
		const direction = this.currentDirection === "normal" ? "reverse" : "normal"
		this.start(direction)
	}

	stop(){
		this.finish()
	}

	pause(){
		this.running = false
	}

	resume(){
		if(!this.finished){
			this.running = true
		}
	}

	isPaused(){
		return !this.running && !this.finished
	}

	isRunning(){
		return this.running
	}

	isFinished(){
		return this.finished
	}

	resetProperties(){
		this.startDelayLeft = 0
		this.animationDelayLeft = 0
		this.finishDelayLeft = 0
		this.loopDelayLeft = 0
		this.progress = 0
		this.running = true
		this.finished = false
		this.currentLoop = 0
	}

	update(){
		if(this.canUpdate()){
			this.updateManager()
		}
	}

	canUpdate(){
		return this.running && !this.finished
	}

	updateManager(){
		this.totalTimeElapsed++

		const phase = this.getUpdatePhase()

		if(phase === "startDelay"){
			this.updateStartDelay()
		}else if(phase === "finishDelay"){
			this.updateFinishDelay()
		}else if(phase === "loopDelay"){
			this.updateLoopDelay()
		}else if(phase === "animationDelay"){
			this.updateAnimationDelay()
		}else{
			this.updateAnimation()
		}
	}

	getUpdatePhase(){
		if(this.startDelayLeft > 0){
			return "startDelay"
		}else if(this.finishDelayLeft > 0){
			return "finishDelay"
		}else if(this.loopDelayLeft > 0){
			return "loopDelay"
		}else if(this.animationDelayLeft > 0){
			return "animationDelay"
		}else{
			return "updateAnimation"
		}
	}

	updateStartDelay(){
		this.startDelayLeft--

		if(this.startDelayLeft <= 0){
			if(this.startDelay > 0){
				this.callCallback("onStartDelayEnd")
			}
		}
	}

	updateFinishDelay(){
		this.finishDelayLeft--

		if(this.finishDelayLeft <= 0){
			if(this.finishDelay > 0){
				this.callCallback("onFinishDelayEnd")
			}
			this.finish()
		}
	}

	updateAnimationDelay(){
		this.animationDelayLeft--

		if(this.animationDelayLeft <= 0){
			if(this.animationDelay > 0){
				this.callCallback("onAnimationDelayEnd")
			}
		}
	}

	updateAnimation(){
		this.updateAnimes()
		this.refreshProgress()
		this.callCallback("onUpdateAnimation")

		if(this.canFinish()){
			this.callCallback("onAnimationEnd")
			this.onAnimationEnd()
		}else{
			this.startAnimationDelay()
		}
	}

	onAnimationEnd(){
		this.currentLoop++

		if(this.needLoop()){
			this.startLoopDelay()
		}else{
			this.startFinishDelay()
		}
	}

	startLoopDelay(){
		this.loopDelayLeft = this.loopDelay

		if(this.loopDelay > 0){
			this.callCallback("onLoopDelayBegin")
		}else{
			this.startLoop()
		}
	}

	updateLoopDelay(){
		this.loopDelayLeft--

		if(this.loopDelayLeft <= 0){
			if(this.loopDelay > 0){
				this.callCallback("onLoopDelayEnd")
			}
			this.startLoop()
		}
	}

	updateAnimes(){
		for(const anime of this.animes){
			anime.update()
		}
	}

	needLoop(){
		return this.loopTotal === -1 || this.currentLoop <= this.loopTotal
	}

	startLoop(){
		this.refreshAnimationDirection()
		this.callCallback("onLoop")

		for(const anime of this.animes){
			anime.start(this.currentDirection)
		}
	}

	refreshAnimationDirection(){
		if(this.directionType === "alternate"){
			this.currentDirection = this.currentDirection === "normal" ? "reverse" : "normal"
		}
	}

	startAnimationDelay(){
		if(this.animationDelay > 0){
			this.animationDelayLeft = this.animationDelay
			this.callCallback("onAnimationDelayBegin")
		}
	}

	startFinishDelay(){
		if(this.finishDelay > 0){
			this.finishDelayLeft = this.finishDelay
			this.callCallback("onFinishDelayBegin")
		}else{
			this.finish()
		}
	}

	canFinish(){
		return this.areAllFinished()
	}

	finish(){
		this.running = false
		this.finished = true
		this.progress = 1
		this.callCallback("onFinish")
	}

	refreshProgress(){
		if(this.hasAnimes()){
			let sum = 0

			for(const anime of this.animes){
				sum += anime.getProgress()
			}

			this.progress = sum / this.animes.length

		}else{
			this.progress = 1
		}
	}

	addAnimation(anime){
		if(!this.getAnimation(anime.getTarget(), anime.getPropName())){
			this.animes.push(anime)
		}
	}

	removeAnimation(anime){
		const index = this.animes.indexOf(anime)

		if(index >= 0){
			this.animes.splice(index, 1)
		}
	}

	clear(){
		this.animes.length = 0
	}

	hasAnimes(){
		return this.animes.length > 0
	}

	getAnimation(target, prop){
		return this.animes.find(anime => anime.getTarget() === target && anime.getPropName() === prop)
	}

	getAnimations(target, prop){
		return this.animes.filter(anime => anime.getTarget() === target && anime.getPropName() === prop)
	}

	areAllRunning(){
		return this.hasAnimes() && this.animes.every(anime => anime.isRunning())
	}

	isAnyRunning(){
		return this.animes.some(anime => anime.isRunning())
	}

	areAllFinished(){
		if(this.hasAnimes()){

			for(const anime of this.animes){

				if(anime.hasEnd() && !anime.isFinished()){
					return false
				} 
			}

			return true
		}else{
			return true
		}
	}

	isAnyFinished(){
		return this.animes.some(anime => anime.isFinished())
	}

	forceFinish(){
		for(const anime of this.animes){
			anime.forceFinish()
		}

		this.loopTotal = 0
		this.currentLoop = 1
		this.startDelayLeft = 0
		this.animationDelayLeft = 0
		this.loopDelayLeft = 0
		this.finishDelayLeft = 0

		this.finish()
	}
}

Eli.AnimeUtils = {

	createLevel0Defaults(){
		return {
			target: null,
			propName: "",
			incrementValue: 1,
			direction: "normal",
		}
	},

	createLevel1Defaults(){
		return {
			target: null,
			propName: "",
			targetValue: 0,
			duration: 1,
			easing: "linear",
			direction: "normal",
			loop: 0,
		}
	},

	createLevel2Defaults(){
		const obj = this.createLevel1Defaults()
		obj.startDelay = 0
		obj.loopDelay = 0
		obj.finishDelay = 0
		obj.animationDelay = 0

		return obj
	},

	createLevel3Defaults(){
		const obj = this.createLevel2Defaults()
		obj.callbacks = {
			onStart: null,
			onStartDelayBegin: null,
			onStartDelayEnd: null,
			onUpdateAnimation: null,
			onAnimationDelayBegin: null,
			onAnimationDelayEnd: null,
			onAnimationEnd: null,
			onLoopDelayBegin: null,
			onLoopDelayEnd: null,
			onLoop: null,
			onFinishDelayBegin: null,
			onFinishDelayEnd: null,
			onFinish: null,
		}
		return obj
	},

	createCollectionDefaults(){
		return {
			startDelay: 0,
			animationDelay: 0,
			loopDelay: 0,
			finishDelay: 0,
			direction: "normal",
			loop: 0,
			callbacks:{
				onStart: null,
				onStartDelayBegin: null,
				onStartDelayEnd: null,
				onUpdateAnimation: null,
				onAnimationDelayBegin: null,
				onAnimationDelayEnd: null,
				onAnimationEnd: null,
				onLoopDelayBegin: null,
				onLoopDelayEnd: null,
				onLoop: null,
				onFinishDelayBegin: null,
				onFinishDelayEnd: null,
				onFinish: null,
			}
		}
	},

	createAnimeCollection(animeDataList, level, collectionData){
		const animes = this.createAnimes(animeDataList, level)
		const collection = new Eli.AnimeCollection(animes, collectionData)

		return collection
	},

	createAnimes(animeDataList, level = 1){
		const AnimeClass = {
			0: Eli.AnimeLevel0,
			1: Eli.AnimeLevel1,
			2: Eli.AnimeLevel2,
			3: Eli.AnimeLevel3,
		}[level]

		const animes = []

		for(const data of animeDataList){
			animes.push(new AnimeClass(data))
		}

		return animes
	},

}

Eli.AnimeTest = {

	aliasMapUpdateCalled: false,

	aliasMapUpdate(){
		if(this.aliasMapUpdateCalled) return

		this.aliasMapUpdateCalled = true

		const Scene_Map_update = Scene_Map.prototype.update
		Scene_Map.prototype.update = function(){
			Scene_Map_update.call(this)
			if(window.animetest){
				window.animetest.update()
				if(window.animetest.isFinished()){

				}else{
					console.log("==== FRAME =====")
				}

			}
		}
	},

	createAnimeLevel3Test(){
		this.aliasMapUpdate()
		const data = Eli.AnimeUtils.createLevel3Defaults()
		const target = {cola: 0}
		data.propName = "cola"
		data.startDelay = 0
		data.animationDelay = 0
		data.loopDelay = 0
		data.finishDelay = 0

		data.target = target
		data.targetValue = 30
		data.duration = 10
		data.loop = 1
		data.callbacks = {
			onUpdateAnimation: (anime) => {
				console.log("onUpdateAnimation")
				console.log(anime.getCurrentPropValue())
				console.log(anime.currentDirection)
			},

		}

		window.animetest = new Eli.AnimeLevel3(data)
		window.animetest.start()
	},

	createAnimeCollectionTest(){
		this.aliasMapUpdate()
		const target = {cola: 0}
		const animeData = Eli.AnimeUtils.createLevel3Defaults()
		animeData.propName = "cola"
		animeData.startDelay = 0
		animeData.animationDelay = 0
		animeData.loopDelay = 0
		animeData.finishDelay = 0

		animeData.target = target
		animeData.targetValue = 30
		animeData.duration = 10
		animeData.loop = 0

		const collectionData = Eli.AnimeUtils.createCollectionDefaults()
		collectionData.startDelay = 0
		collectionData.animationDelay = 0
		collectionData.loopDelay = 0
		collectionData.finishDelay = 0
		collectionData.loop = 1
		collectionData.callbacks = {
			onUpdateAnimation: (anime) => {
				console.log(anime.animes[0].getCurrentPropValue())
				console.log(anime.animes[0].currentDirection)
			},
		}
		const animes = [new Eli.AnimeLevel3(animeData)] 
		window.animetest = new Eli.AnimeCollection(animes, collectionData)
		window.animetest.start()
	},

}

/* ========================================================================== */
/*                                   PLUGIN                                   */
/* ========================================================================== */

Eli.String = {

	removeSpaces(str){
		return str.replaceAll(" ", "")
	},

}

Eli.Array = {

	shuffle(array){
		const shuffleArray = []

		while(array.length > 0){
			const randomIndex = Math.floor(Math.random() * array.length)
			const randomElement = array.splice(randomIndex, 1)

			shuffleArray.push(randomElement[0])
		}

		return shuffleArray
	},

	createProgressiveNumbers(min, max){
		return Array.from({length: max+1 - min}, (_, i) => i + min)
	},

	insertByIndex(array, index, element){
		array.splice(index, 0, element)
	},

	removeByIndex(array, index, deleteCount){
		array.splice(index, deleteCount)
	},

	remove(array, element){
		const index = array.indexOf(element)

		if(index > -1){
			array.splice(index, 1)
		}
	},

	isEqual(array1, array2){
		return array1.toString().toLowerCase() === array2.toString().toLowerCase()
	},

    /**
     * @deprecated Must be replaced with insertByIndex.
     */
	insertElement(array, index, element){
		array.splice(index, 0, element)
	},

    /**
     * 
     * @deprecated Must be replaced with removeByIndex. Currently used by: Char Manager, PlatformEvent, Quit Menu.
     */
	removeElement(array, index, deleteCount){
		array.splice(index, deleteCount)
	},

}

Eli.Number = {

	isBetween(number, min, max){
		return number > min && number < max
	},

	isBetweenOrEqual(number, min, max){
		return number >= min && number <= max
	},
}

Eli.Date = {

	milliSecondsToFrames(ms){
		return Math.floor( ms / 1000 * 60)
	},

	secondsToFrames(seconds){
		return Math.floor(seconds * 60)
	},

	minutesToFrames(minutes){
		return Math.floor(minutes * Math.pow(60, 2) )
	},

	hoursToFrames(hours){
		return Math.floor( hours * Math.pow(60, 3) )
	},

	framesToMilliSeconds(frames){
		return Math.floor( frames * 1000 / 60)
	},

	framesToSeconds(frames){
		return Math.floor(frames / 60)
	},

	framesToMinutes(frames){
		return Math.floor( frames / Math.pow(60, 2))
	},

	framesToHours(frames){
		return Math.floor( frames / Math.pow(60, 3) )
	},

    /**
     * 
     * @param {number} frames 
     * @returns {number}
     * @deprecated Must be replaced with framesToMilliSeconds. Self Switches and Switches. will be removed when all plugins have changed to "miLLiseconds"...
     */
	framesToMiliSeconds(frames){
		return Math.floor( frames * 1000 / 60)
	},
}

Eli.Utils = {

	regVariable1: /\x1b\x1b/g,
	regVariable2: /\x1bV\[(\d+)\]/gi,
	spriteCharacters: {},

	getFolderAndFileName(string){
		const lastIndex = string.lastIndexOf("/") + 1
		const filename = string.substr(lastIndex)
		const folder = string.substring(0, lastIndex)

		return [folder, filename]
	},

    /**
     * 
     * @deprecated Must me used only on Find Id By Name
     */
	getIdByName(searchName, data){
		return searchName
	},

	calculatePosition(position, width, height, baseWidth, baseHeight){
		const x = this.calculateXPosition(position, width, baseWidth)
		const y = this.calculateYPosition(position, height, baseHeight)

		return {x, y}
	},

	calculateXPosition(position, width, baseWidth){
		const {alignX, offsetX} = position
		return {
			left: offsetX,
			center: (baseWidth-width) / 2 + offsetX,
			right: (baseWidth-width) + offsetX
		}[alignX]
	},

	calculateYPosition(position, height, baseHeight){
		const {alignY, offsetY} = position
		return {
			top: offsetY,
			center: (baseHeight-height) / 2 + offsetY,
			bottom: (baseHeight-height) + offsetY
		}[alignY]
	},

	centerPos(itemWidth, itemHeight, baseWidth, baseHeight){
		return {
			x:  this.centerXPos(itemWidth, baseWidth),
			y:  this.centerYPos(itemHeight, baseHeight),
		}
	},

	centerXPos(itemWidth, baseWidth = Graphics.width){
		return Math.abs(itemWidth - baseWidth) / 2
	},

	centerYPos(itemHeight, baseHeight = Graphics.height){
		return Math.abs(itemHeight - baseHeight) / 2
	},

	isMVAnimation(animation) {
		return !!animation.frames
	},

	convertEscapeVariablesOnly(text){
		text = text.replace(/\\/g, "\x1b")
		text = text.replace(this.regVariable1, "\\")
		text = text.replace(this.regVariable2, function() {
			return $gameVariables.value(Number(arguments[1]))
		}.bind(this))

		return text
	},

	processEscapeVarOrFormula(arg){
		if(typeof arg !== "string") return arg

		const rawArg = arguments[0]
		arg = this.convertEscapeVariablesOnly(rawArg)
		if(rawArg === arg){
			return this.needEval(arg)
		}else{
			return arg
		}
	},

	needEval(param) {
		if(isNaN(param)){

			try{
				return eval(param)
			}catch(err){
				return param
			}

		}else{
			return param
		}
	},

	getDataMap(mapId) {
		const xhr = new XMLHttpRequest()
		const fileName = "Map%1.json".format(mapId.padZero(3))
		const url = "data/" + fileName

		xhr.open("GET", url, false)
		xhr.send()

		return JSON.parse(xhr.responseText)
	},

	getTextWidth(rawText, winClass = Window_Base){
		const tempWin = new winClass(new Rectangle(0, 0, 500, 500))

		return tempWin.getTextWidth(rawText)
	},

	getSpriteCharacter(id){
		const character = this.getMapCharacter(id)
		return character.getMapSprite()
	},

	getMapCharacter(id){
		let character = null

		if(isNaN(id)){
			const stringId = id.toLowerCase().replaceAll(" ", "")

			if(stringId === "camera"){
				character = Eli.CameraManager.getGameCamera()
			}else if(["boat", "ship", "airship"].includes(stringId)){
				character = $gameMap.vehicles().find(item => item._type === stringId)
			}else{
				character = $gameMap.vehicles().find(item => item?.getSpriteId() === stringId)
			}

			if(!character){
				const eventName = id.trim().toLowerCase()
				character = $gameMap.events().find(item => item.event().name.trim().toLowerCase() === eventName) || null
			}

		}else{
			const numberId = Number(id)

			if(numberId === 0){
				character = Eli.PluginManager.currentInterpreter.character(0)

			}else if(numberId > 0){
				character = $gameMap.event(numberId)

			} else if(numberId === -1){
				character = $gamePlayer

			}else if(numberId < -1){
				const followers = $gamePlayer.followers()
				const index = Math.abs(numberId + 2)

				character = followers.follower(index)
			}
		}

		return character
	},

    /**
     * 
     * @deprecated Must be removed. Used by [Check Point].
     */
	scene(){
		return SceneManager._scene
	},

    /**
     * 
     * @deprecated Must be removed. Used on [Face Window] and [Text Window]
     */
	getFaceSize(){
		return {
			width: ImageManager.faceWidth,
			height: ImageManager.faceHeight
		}
	},

    /**
     * 
     * @returns {number>}
     * @deprecated Must be replaced with calculatePosition. [Background Manager] e [Pause Game]
     */
	calculateScreenPosition(align, offset, size, coordinate = "x", isOnWindowLayer = false){
		let screenSize = {
			x: Graphics.width,
			y: Graphics.height,
		}[coordinate]

		if(isOnWindowLayer){
			screenSize = {
				x: Graphics.boxWidth,
				y: Graphics.boxHeight,
			}[coordinate]
		}
		const mainSize = screenSize - size

		switch(align){
			case "center":  
				return (mainSize / 2) + offset
			case "right":
			case "bottom":  
				return (mainSize + offset)
			case "left":
			case "top":
				return 0 + offset
		}

		return offset
	},

}

Eli.Input = {

	keyboardCodes: {
		backspace:8, tab:9, enter:13, shift:16, ctrl:17, alt:18, pausebreak:19, capslock:20, 
		esc:27, space:32, pageup:33, pagedown:34, end:35, home:36, 
		leftarrow:37, uparrow:38, rightarrow:39, downarrow:40, insert:45, delete:46, 
		0:48, 1:49, 2:50, 3:51, 4:52, 5:53, 6:54, 7:55, 8:56, 9:57, 
		a:65, b:66, c:67, d:68, e:69, f:70, g:71, h:72, i:73, j:74, k:75, l:76, m:77, n:78, 
		o:79, p:80, q:81, r:82, s:83, t:84, u:85, v:86, w:87, x:88, y:89, z:90, 
		leftwindowkey:91, rightwindowkey:92, selectkey:93, 
		numpad0:96, numpad1:97, numpad2:98, numpad3:99, numpad4:100, numpad5:101, 
		numpad6:102, numpad7:103, numpad8:104, numpad9:105, 
		multiply:106, add:107, subtract:109, decimalpoint:110, divide:111, 
		f1:112, f2:113, f3:114, f4:115, f5:116, f6:117, f7:118, f8:119, f9:120, f10:121, f11:122, f12:123,
		numlock:144, scrolllock:145, semicolon:186, equalsign:187, comma:188, dash:189, period:190,
		forwardslash:191, graveaccent:192, openbracket:219, backslash:220, closebracket:221, singlequote:222
	},

	gamepadCodes: {
		a: 0, b: 1, x: 2, y: 3, lb: 4, rb: 5, lt: 6, rt: 7, select: 8,
		start: 9, l3: 10, r3: 11, up: 12, down: 13, left: 14, right: 15
	},

	mouseCodes: {
		left: 0,
		middle: 1,
		right: 2,
		back: 3,
		forward: 5,
	},

	defaultKeyboardCodes: [
		9, 13, 16, 17, 18, 27, 32, 33, 34, 37, 38, 39, 
		40, 45, 81, 87, 88, 90, 96, 98, 100, 102, 104, 120
	],

	defaultGamepadCodes: [0, 1, 2, 3, 4, 5, 12, 13, 14, 15],

	getKeyboardCode(keyName){
		return this.keyboardCodes[keyName.toLowerCase()]
	},

	getGamepadCode(keyName){
		return this.gamepadCodes[keyName.toLowerCase()]
	},

	getMouseCode(keyName){
		return this.mouseCodes[keyName.toLowerCase()]
	},

	isDefaultKeyboard(keyCode){
		return this.defaultKeyboardCodes.includes(keyCode)
	},

	isDefaultGamepad(keyCode){
		return this.defaultGamepadCodes.includes(keyCode)
	},

	mapKeyboardButton(keyName, overwrite, button){
		const keyCode = this.getKeyboardCode(keyName)

		if(overwrite || !this.isDefaultKeyboard(keyCode)){
			Input.keyMapper[keyCode] = button

		}else{
			button = Input.keyMapper[keyCode]
		}
	},

	mapGamepadButton(keyName, overwrite, button){
		const keyCode = this.getGamepadCode(keyName)

		if(overwrite || !this.isDefaultGamepad(keyCode)){
			Input.gamepadMapper[keyCode] = button

		}else{
			button = Input.gamepadMapper[keyCode]
		}
	}
}

Eli.PluginManager = {

	currentEventId: 0,
	currentCommonEventId: 0,
	currentInterpreter: null,
	passivePluginCommands: [],
	passivePluginCommandPrefix: "cmdPassive_",
	currentPassiveEvent: null,

	getCurrentInterpreter(){
		return this.currentInterpreter
	},

	getCurrentEventId(){
		return this.currentEventId
	},

	getCurrentCommonEventId(){
		return this.currentCommonEventId
	},

	isArgEmpty(arg){
		return arg.trim() === ""
	},

	isParamEmpty(parameter){
		return parameter.trim() === ""
	},

	getCurrentPassiveEvent(){
		return this.currentPassiveEvent || $gameMap.event(this.currentEventId) || null
	},

	setPassiveEvent(event){
		this.currentPassiveEvent = event
	},

	isPassivePluginCommand(command){
		return command?.code === 357 && command.parameters[1].startsWith(this.passivePluginCommandPrefix)
	},

	clearPassivePluginCommands(){
		this.passivePluginCommands.length = 0
	},

	collectPassivePluginCommand(command){
		if(this.isPassivePluginCommand(command)){
			this.passivePluginCommands.push(command)
		}
	},

	hasPassivePluginCommands(){
		return this.passivePluginCommands.length > 0
	},

	checkPassivePluginCommands(eventId){
		if(this.hasPassivePluginCommands()){
			this.runPassivePluginCommands(eventId)
		}
	},

	runPassivePluginCommands(eventId){
		const interpreter = new Eli.Game_PassivePluginCommandInterpreter()
		const list = this.passivePluginCommands

		list.push({code: 0, indent: 0, parameters: []})
		interpreter.setup(list, eventId)
		interpreter.update()
		this.clearPassivePluginCommands()
	},

	registerCommands(plugin, commands, name){
		const pluginName = name || this.getPluginName()

		for(const command of commands){
			const callback = command
			PluginManager.registerCommand(pluginName, command, plugin[callback].bind(plugin))
		}
	},

	createIdList(idString, removeSpaces = true){
		const ids = this.parseVariables(idString).split(",")
		const list = []

		for(const id of ids){
			const trimmedId = id.trim()

			if(trimmedId.length > 2 && trimmedId.startsWith("*") && trimmedId.endsWith("*")){
				const eventName = trimmedId.slice(1, -1).trim().toLowerCase()
				const events = $gameMap.events().filter(event => event.event().name.trim().toLowerCase() === eventName)

				for(const event of events){
					list.push(event.eventId())
				}

			}else if(id.includes("--")){
				const [min, max] = id.split("--").map(item => Number(item))
				const rangeOfIds = Eli.Array.createProgressiveNumbers(min, max)

				list.push(...rangeOfIds)

			}else if(isNaN(id)){
				list.push(removeSpaces ? Eli.String.removeSpaces(id) : trimmedId)

			}else{
				list.push(Number(id))
			}
		}

		return list
	},

	parseVariables(str){
		return Eli.Utils.convertEscapeVariablesOnly(str)
	},

	parseFullColor(color){
		if(isNaN(color)){

			if(ColorManager[color]){
				return ColorManager[color]()
			}else{
				return Eli.ColorManager.getHexOrName(color)
			}

		}else{
			return ColorManager.textColor(color)
		}
	},

	parseBackgroundType(type){
		return {
			"Window":                   0,
			"Dim":                      1,
			"Transparent":              2,
			"Strong":                   3,
			"Light Gradient Vertical":  4,
			"Faded Horizontal":         5,
			"Message Window":           "Message Window"
		}[type]
	},

	parseOpenness(widthAlign, heightAlign, easing, duration, inheritEasing){
		return {
			widthAlign: widthAlign,
			heightAlign: heightAlign,
			easing: easing === "inherit" ? inheritEasing : easing,
			duration: Number(duration)
		}
	},

	parseFixedPosition(alignX, alignY, offsetX, offsetY){
		return {
			alignX: alignX,
			alignY: alignY,
			offsetX: new Function(offsetX),
			offsetY: new Function(offsetY),
		}
	},

	parseOperationAndValue(argValue){
		const raw = this.parseVariables(argValue).trim()
		const signal = raw[0]
		let operation = "Set"
		let value = 0

		if(isNaN(signal)){
			operation = {
				"=": "Set",
				"+": "Add",
				"-": "Sub",
				"x": "Mul",
				"/": "Div",
				"%": "Mod",
			}[signal]
			value = Number(raw.replace(signal, ""))
		}else{
			value = Number(raw)
		}

		if(!operation){
			throw new Error(`EliMZ_EncounterStepControl: Invalid operation signal "${signal}" in value "${argValue}". Use +, -, = or no signal.`)
		}

		return [operation, Math.abs(value)]
	},

	operateValue(currentValue, newValue, operationType = "Set"){
		switch(operationType){
			case "Set": return newValue
			case "Add": return currentValue + newValue
			case "Sub": return currentValue - newValue
			case "Mul": return currentValue * newValue
			case "Div": return currentValue / newValue
			case "Mod": return currentValue % newValue
		}
	},

    /**
     * 
     * @deprecated Must be replaced with createId list [Horror Filter, Switches]
     */
	createRangeOfNumbers(str){
		const ids = Eli.String.removeSpaces(this.parseVariables(str)).split(",")
		const rangeIds = []

		for(let i = 0; i < ids.length; i++){
			const id = ids[i]

			if(id.includes("--")){
				const [min, max] = id.split("--").map(item => Number(item))
				const rangeOfIds = Eli.Array.createProgressiveNumbers(min, max)
				rangeIds.push(...rangeOfIds)

			}else if(isNaN(id)){
				rangeIds.push(id)

			}else{
				rangeIds.push(Number(id))
			}
		}

		return rangeIds
	},

    /**
     * Need to remove that and put plugin name mannualy.
     * @deprecated
     */
	getPluginName(){
		const srcScript = document.currentScript.src
		const start = srcScript.lastIndexOf("/") + 1
		const end = srcScript.lastIndexOf(".js")
		const pluginName = srcScript.substring(start, end)

		return pluginName
	},
}

Eli.ColorManager = {

	names: [
		"ALICEBLUE", "ANTIQUEWHITE", "AQUA", "AQUAMARINE", "AZURE", "BEIGE", "BISQUE", "BLACK", "BLANCHEDALMOND", "BLUE", "BLUEVIOLET", "BROWN", 
		"BURLYWOOD", "CADETBLUE", "CHARTREUSE", "CHOCOLATE", "CORAL", "CORNFLOWERBLUE", "CORNSILK", "CRIMSON", "CYAN", "DARKBLUE", "DARKCYAN", 
		"DARKGOLDENROD", "DARKGRAY", "DARKGREY", "DARKGREEN", "DARKKHAKI", "DARKMAGENTA", "DARKOLIVEGREEN", "DARKORANGE", "DARKORCHID", "DARKRED", 
		"DARKSALMON", "DARKSEAGREEN", "DARKSLATEBLUE", "DARKSLATEGRAY", "DARKSLATEGREY", "DARKTURQUOISE", "DARKVIOLET", "DEEPPINK", "DEEPSKYBLUE", 
		"DIMGRAY", "DIMGREY", "DODGERBLUE", "FIREBRICK", "FLORALWHITE", "FORESTGREEN", "FUCHSIA", "GAINSBORO", "GHOSTWHITE", "GOLD", "GOLDENROD", 
		"GRAY", "GREY", "GREEN", "GREENYELLOW", "HONEYDEW", "HOTPINK", "INDIANRED", "INDIGO", "IVORY", "KHAKI", "LAVENDER", "LAVENDERBLUSH", 
		"LAWNGREEN", "LEMONCHIFFON", "LIGHTBLUE", "LIGHTCORAL", "LIGHTCYAN", "LIGHTGOLDENRODYELLOW", "LIGHTGRAY", "LIGHTGREY", "LIGHTGREEN", 
		"LIGHTPINK", "LIGHTSALMON", "LIGHTSEAGREEN", "LIGHTSKYBLUE", "LIGHTSLATEGRAY", "LIGHTSLATEGREY", "LIGHTSTEELBLUE", "LIGHTYELLOW", 
		"LIME", "LIMEGREEN", "LINEN", "MAGENTA", "MAROON", "MEDIUMAQUAMARINE", "MEDIUMBLUE", "MEDIUMORCHID", "MEDIUMPURPLE", "MEDIUMSEAGREEN", 
		"MEDIUMSLATEBLUE", "MEDIUMSPRINGGREEN", "MEDIUMTURQUOISE", "MEDIUMVIOLETRED", "MIDNIGHTBLUE", "MINTCREAM", "MISTYROSE", "MOCCASIN", 
		"NAVAJOWHITE", "NAVY", "OLDLACE", "OLIVE", "OLIVEDRAB", "ORANGE", "ORANGERED", "ORCHID", "PALEGOLDENROD", "PALEGREEN", "PALETURQUOISE", 
		"PALEVIOLETRED", "PAPAYAWHIP", "PEACHPUFF", "PERU", "PINK", "PLUM", "POWDERBLUE", "PURPLE", "REBECCAPURPLE", "RED", "ROSYBROWN", "ROYALBLUE", 
		"SADDLEBROWN", "SALMON", "SANDYBROWN", "SEAGREEN", "SEASHELL", "SIENNA", "SILVER", "SKYBLUE", "SLATEBLUE", "SLATEGRAY", "SLATEGREY", "SNOW", 
		"SPRINGGREEN", "STEELBLUE", "TAN", "TEAL", "THISTLE", "TOMATO", "TURQUOISE", "VIOLET", "WHEAT", "WHITE", "WHITESMOKE", "YELLOW", "YELLOWGREEN",
	],

	windowColorIndexes: {
		normalColor: 0,
		systemColor: 16,
		crisisColor: 17,
		deathColor: 18,
		gaugeBackColor: 19,
		hpGaugeColor1: 20,
		hpGaugeColor2: 21,
		mpGaugeColor1: 22,
		mpGaugeColor2: 23,
		mpCostColor: 23,
		powerUpColor: 24,
		powerDownColor: 25,
		ctGaugeColor1: 26,
		ctGaugeColor2: 27,
		tpGaugeColor1: 28,
		tpGaugeColor2: 29,
		tpCostColor: 29,
	},

	cache: {
		nameToRgb: Object.create(null),
		hexToRgb: Object.create(null),
		rgbToHex: Object.create(null),
		formatRgbToArray: Object.create(null),
		getRgb: Object.create(null),
		windowskinColor: new WeakMap(),
	},

	clearCache(){
		this.cache.nameToRgb = Object.create(null)
		this.cache.hexToRgb = Object.create(null)
		this.cache.rgbToHex = Object.create(null)
		this.cache.formatRgbToArray = Object.create(null)
		this.cache.getRgb = Object.create(null)
		this.cache.windowskinColor = new WeakMap()
	},

	parseWindowColor(color){
		if(!isNaN(color)){
			return this.createWindowskinColor(Number(color))
		}else{
			const index = this.windowColorIndexes[color]

			if(index !== undefined){
				return this.createWindowskinColor(index)
			}else if(color === "pendingColor"){
				return {type: "windowskin", x: 120, y: 120, key: "120:120"}
			}else{
				return {type: "fixed", value: this.getHexOrName(color)}
			}
		}
	},

	createWindowskinColor(index){
		const x = 96 + (index % 8) * 12 + 6
		const y = 144 + Math.floor(index / 8) * 12 + 6

		return {type: "windowskin", x: x, y: y, key: `${x}:${y}`}
	},

	isWindowskinColor(color){
		return color.type === "windowskin"
	},

	getWindowColor(windowskin, color){
		if(color.type === "fixed"){
			return color.value
		}else if(windowskin.isReady()){
			return this.getCachedWindowskinColor(windowskin, color)
		}else{
			return null
		}
	},

	getCachedWindowskinColor(windowskin, color){
		this.prepareWindowskinForPixelRead(windowskin)

		const baseTexture = windowskin.baseTexture
		const dirtyId = baseTexture.dirtyId
		let data = this.cache.windowskinColor.get(windowskin)

		if(!data || data.baseTexture !== baseTexture || data.dirtyId !== dirtyId){
			data = {baseTexture: baseTexture, dirtyId: dirtyId, values: new Map()}
			this.cache.windowskinColor.set(windowskin, data)
		}

		if(!data.values.has(color.key)){
			data.values.set(color.key, windowskin.getPixel(color.x, color.y))
		}

		return data.values.get(color.key)
	},

	prepareWindowskinForPixelRead(windowskin){
		windowskin.context
	},

	getHexOrName(color){
		if(this.isRgb(color)){
			color = this.rgbToHex(color)
		}

		return color
	},

	isRgb(color){
		return color && color instanceof Array || color.includes(",")
	},

	rgbToHex(color, alphaGray = 255){
		const raw = typeof color === "string" ? color.trim() : color
		const key = `${raw instanceof Array ? raw.join(",") : raw}|${alphaGray}`

		const cached = this.cache.rgbToHex[key]

		if(cached){
			return cached
		}else{
			let parts = raw

			if(typeof parts === "string"){
				parts = parts.split(",")
			}

			let [r, g, b, a] = parts.map(item => Number(item))
			a = a ?? alphaGray

			r = r.toString(16)
			g = g.toString(16)
			b = b.toString(16)
			a = a.toString(16)

			if (r.length === 1) r = "0" + r
			if (g.length === 1) g = "0" + g
			if (b.length === 1) b = "0" + b
			if (a.length === 1) a = "0" + a

			const hex = "#" + r + g + b + a
			this.cache.rgbToHex[key] = hex

			return hex
		}
	},

	getRgb(color, alphaGray = 255){
		const key = this.getRgbCacheKey(color, alphaGray)
		const cached = this.cache.getRgb[key]

		if(cached){
			return cached

		}else{

			let result = null

			if(this.isHtmlColor(color)){
				result = this.nameToRgb(color, alphaGray)

			}else if(this.isHexColor(color)){
				result = this.hexToRgb(color, alphaGray)

			} else if(this.isRgb(color)){
				result = this.formatRgbToArray(color, alphaGray)

			}else {
				result = [0, 0, 0, alphaGray]
			}

			this.cache.getRgb[key] = result

			return result
		}
	},

	getRgbCacheKey(color, alphaOrGray){
		const raw = typeof color === "string" ? color.trim() : color

		if(raw instanceof Array){
			return `a|${raw.join(",")}|${alphaOrGray}`

		}else{
			const str = String(raw).trim().toLowerCase()

			if(this.isHexColor(str)) {
				return `h|${str}|${alphaOrGray}`

			}else if(this.isRgb(str)) {
				return `r|${str.replaceAll(" ", "")}|${alphaOrGray}`

			}else{
				return `n|${str}|${alphaOrGray}`
			}
		}
	},

	isHtmlColor(color){
		return color && color[0] !== "#" && isNaN(color[0])
	},

	nameToRgb(name, alphaOrGray = 255) {
		const keyName = String(name).trim().toLowerCase()
		const key = `${keyName}|${alphaOrGray}`

		const cached = this.cache.nameToRgb[key]

		if(cached){
			return cached

		}else{

			const fakeDiv = document.createElement("div")
			fakeDiv.style.color = keyName
			document.body.appendChild(fakeDiv)

			const cs = window.getComputedStyle(fakeDiv)
			const rgbString = cs.getPropertyValue("color")

			document.body.removeChild(fakeDiv)
			const start = rgbString.indexOf("(") + 1
			const end = rgbString.indexOf(")")
			const rawString = rgbString.substring(start, end)
			const rgbArray = rawString.split(",").map(item => Number(item))

			rgbArray.push(alphaOrGray)
			this.cache.nameToRgb[key] = rgbArray

			return rgbArray
		}
	},

	isHexColor(color){
		return color && color[0] === "#"
	},

	hexToRgb(hex, alphaOrGray = 255) {
		if(hex.length === 7){
			hex += alphaOrGray === 255 ? "ff" : "00"
		}

		const rawHex = String(hex).trim().toLowerCase()
		const key = `${rawHex}|${alphaOrGray}`
		const cached = this.cache.hexToRgb[key]

		if(cached){
			return cached
		}else{

			const r = this.getHexValue(rawHex, 1, 3)
			const g = this.getHexValue(rawHex, 3, 5)
			const b = this.getHexValue(rawHex, 5, 7)
			const a = this.getHexValue(rawHex, 7, 9)
			const color = [r, g, b, a]

			this.cache.hexToRgb[key] = color

			return color
		}
	},

	getHexValue(hex, start, end){
		return parseInt(hex.slice(start, end), 16)
	},

	getRgbForBlend(color){
		return this.getRgb(color, 255)
	},

	getRgbForTone(color){
		return this.getRgb(color, 0)
	},

	formatRgbToArray(color, alphaGray = 255){
		const raw = typeof color === "string" ? color.trim() : color
		const key = `${raw instanceof Array ? raw.join(",") : raw}|${alphaGray}`
		const cached = this.cache.formatRgbToArray[key]

		if(cached){
			return cached

		}else{
			let rawColor = raw

			if(typeof rawColor === "string"){
				rawColor = rawColor.split(",")
			}

			if(rawColor.length === 3) rawColor.push(alphaGray)

			const rgbArray = rawColor.map(item => Number(item))

			this.cache.formatRgbToArray[key] = rgbArray

			return rgbArray
		}

	},

}

Eli.VersionManager = {

	versionFileUrl: "https://raw.githubusercontent.com/EliaquimNascimento/hakuenstudio/refs/heads/main/EliMZ_PluginVersions.json",
	dismissedReleaseStorageKey: "EliMZ_Book.dismissedPluginReleases",
	themeStorageKey: "EliMZ_Book.versionManagerTheme",
	registry: {},
		ui: {
		mainId: "versionManager_",
		slideDurationMs: 260,
		slideEasing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
		style: {
			fontFamily: "monospace",
			fontSizeTiny: "11px",
			fontSizeSmall: "12px",
			fontSizeMedium: "13px",
			fontSizeLarge: "14px",
			paddingPanel: "12px",
			paddingCard: "10px",
			paddingButton: "7px 10px",
			paddingButtonLarge: "8px 18px",
			paddingThemeButton: "4px 10px",
			buttonMinHeight: "32px",
			gapTiny: "6px",
			gapSmall: "8px",
			gapMedium: "12px",
			themeButtonMinWidth: "54px",
			themeButtonMinHeight: "28px",
			themeCloseSafetyPadding: "16px",
			transitionFast: "140ms ease",
			disabledOpacity: "0.55",
		},
		themes: {
			light: {
				colorOverlayBackdrop: "rgba(0,0,0,0.35)",
				colorUpdateWindowBackdrop: "rgba(0,0,0,0.35)",
				colorPanelBackground: "#f4f7fa",
				colorUpdatePanelBackground: "#f4f7fa",
				colorHeaderBackground: "#dfe9f1",
				colorHeaderHighlight: "rgba(255,255,255,0.72)",
				colorHeaderEdge: "#8fa6b8",
				colorSectionHeaderBackground: "#e2edf5",
				colorSubtleBorder: "rgba(40,74,102,0.14)",
				colorCardBackground: "#f7fafc",
				colorBodyBackground: "#ffffff",
				colorPanelBorder: "#98adbf",
				colorCardBorder: "#bdccd9",
				colorBodyBorder: "#bdccd9",
				colorSeparator: "#98adbf",
				colorText: "#000000",
				colorTextMuted: "#465866",
				colorTitle: "#000000",
				colorDanger: "#BE1522",
				colorSuccess: "#166534",
				colorButtonBackground: "#f8fafc",
				colorButtonHoverBackground: "#5e9bcc",
				colorButtonHoverText: "#ffffff",
				colorButtonActiveBackground: "#cfe4f5",
				colorCloseButtonHoverBackground: "#BE1522",
				colorCloseButtonHoverText: "#FFFFFF",
				colorTapHighlight: "transparent",
				colorThemeButtonSelectedBackground: "#0375e5",
				colorThemeButtonSelectedText: "#FFFFFF",
				colorScrollbarTrack: "#eef3f7",
				colorScrollbarThumb: "#b3c2cf",
				colorScrollbarThumbHover: "#91a7b9",
				colorScrollbarBorder: "#bdccd9",
				shadowHeader: "0 3px 5px rgba(43,68,88,0.24)",
				shadowPanel: "0 18px 46px rgba(0,0,0,0.25)",
			},
			dark: {
				colorOverlayBackdrop: "rgba(0,0,0,0.54)",
				colorUpdateWindowBackdrop: "rgba(0,0,0,0.62)",
				colorPanelBackground: "#11161d",
				colorUpdatePanelBackground: "#151920",
				colorHeaderBackground: "#151920",
				colorHeaderHighlight: "rgba(255,255,255,0.075)",
				colorHeaderEdge: "#566273",
				colorSectionHeaderBackground: "#29313b",
				colorSubtleBorder: "rgba(255,255,255,0.09)",
				colorCardBackground: "#20252d",
				colorBodyBackground: "#0d0e10",
				colorPanelBorder: "#46505e",
				colorCardBorder: "#3b4653",
				colorBodyBorder: "#3a4552",
				colorSeparator: "#566273",
				colorText: "#e5e7eb",
				colorTextMuted: "#cbd5e1",
				colorTitle: "#e5e7eb",
				colorDanger: "#BE1522",
				colorSuccess: "#bbf7d0",
				colorButtonBackground: "#343c48",
				colorButtonHoverBackground: "#2C6593",
				colorButtonHoverText: "#e5e7eb",
				colorButtonActiveBackground: "#111827",
				colorCloseButtonHoverBackground: "#BE1522",
				colorCloseButtonHoverText: "#e5e7eb",
				colorTapHighlight: "transparent",
				colorThemeButtonSelectedBackground: "#3b82f6",
				colorThemeButtonSelectedText: "#e5e7eb",
				colorScrollbarTrack: "#11161d",
				colorScrollbarThumb: "#46515f",
				colorScrollbarThumbHover: "#667487",
				colorScrollbarBorder: "#3a4552",
				shadowHeader: "0 4px 10px rgba(0,0,0,0.55)",
				shadowPanel: "0 18px 46px rgba(0,0,0,0.52)",
			},
		},
		themeVariables: {
			colorOverlayBackdrop: "--eli-version-manager-overlay-backdrop",
			colorUpdateWindowBackdrop: "--eli-version-manager-update-window-backdrop",
			colorPanelBackground: "--eli-version-manager-panel-background",
			colorUpdatePanelBackground: "--eli-version-manager-update-panel-background",
			colorHeaderBackground: "--eli-version-manager-header-background",
			colorHeaderHighlight: "--eli-version-manager-header-highlight",
			colorHeaderEdge: "--eli-version-manager-header-edge",
			colorSectionHeaderBackground: "--eli-version-manager-section-header-background",
			colorSubtleBorder: "--eli-version-manager-subtle-border",
			colorCardBackground: "--eli-version-manager-card-background",
			colorBodyBackground: "--eli-version-manager-body-background",
			colorPanelBorder: "--eli-version-manager-panel-border",
			colorCardBorder: "--eli-version-manager-card-border",
			colorBodyBorder: "--eli-version-manager-body-border",
			colorSeparator: "--eli-version-manager-separator",
			colorText: "--eli-version-manager-text",
			colorTextMuted: "--eli-version-manager-text-muted",
			colorTitle: "--eli-version-manager-title",
			colorDanger: "--eli-version-manager-danger",
			colorSuccess: "--eli-version-manager-success",
			colorButtonBackground: "--eli-version-manager-button-background",
			colorButtonHoverBackground: "--eli-version-manager-button-hover-background",
			colorButtonHoverText: "--eli-version-manager-button-hover-text",
			colorButtonActiveBackground: "--eli-version-manager-button-active-background",
			colorCloseButtonHoverBackground: "--eli-version-manager-close-button-hover-background",
			colorCloseButtonHoverText: "--eli-version-manager-close-button-hover-text",
			colorTapHighlight: "--eli-version-manager-tap-highlight",
			colorThemeButtonSelectedBackground: "--eli-version-manager-theme-button-selected-background",
			colorThemeButtonSelectedText: "--eli-version-manager-theme-button-selected-text",
			colorScrollbarTrack: "--eli-version-manager-scrollbar-track",
			colorScrollbarThumb: "--eli-version-manager-scrollbar-thumb",
			colorScrollbarThumbHover: "--eli-version-manager-scrollbar-thumb-hover",
			colorScrollbarBorder: "--eli-version-manager-scrollbar-border",
			shadowHeader: "--eli-version-manager-header-shadow",
			shadowPanel: "--eli-version-manager-panel-shadow",
		},
		themeCss: {
			colorOverlayBackdrop: "var(--eli-version-manager-overlay-backdrop)",
			colorUpdateWindowBackdrop: "var(--eli-version-manager-update-window-backdrop)",
			colorPanelBackground: "var(--eli-version-manager-panel-background)",
			colorUpdatePanelBackground: "var(--eli-version-manager-update-panel-background)",
			colorHeaderBackground: "var(--eli-version-manager-header-background)",
			colorHeaderHighlight: "var(--eli-version-manager-header-highlight)",
			colorHeaderEdge: "var(--eli-version-manager-header-edge)",
			colorSectionHeaderBackground: "var(--eli-version-manager-section-header-background)",
			colorSubtleBorder: "var(--eli-version-manager-subtle-border)",
			colorCardBackground: "var(--eli-version-manager-card-background)",
			colorBodyBackground: "var(--eli-version-manager-body-background)",
			colorPanelBorder: "var(--eli-version-manager-panel-border)",
			colorCardBorder: "var(--eli-version-manager-card-border)",
			colorBodyBorder: "var(--eli-version-manager-body-border)",
			colorSeparator: "var(--eli-version-manager-separator)",
			colorText: "var(--eli-version-manager-text)",
			colorTextMuted: "var(--eli-version-manager-text-muted)",
			colorTitle: "var(--eli-version-manager-title)",
			colorDanger: "var(--eli-version-manager-danger)",
			colorSuccess: "var(--eli-version-manager-success)",
			colorButtonBackground: "var(--eli-version-manager-button-background)",
			colorButtonHoverBackground: "var(--eli-version-manager-button-hover-background)",
			colorButtonHoverText: "var(--eli-version-manager-button-hover-text)",
			colorButtonActiveBackground: "var(--eli-version-manager-button-active-background)",
			colorCloseButtonHoverBackground: "var(--eli-version-manager-close-button-hover-background)",
			colorCloseButtonHoverText: "var(--eli-version-manager-close-button-hover-text)",
			colorTapHighlight: "var(--eli-version-manager-tap-highlight)",
			colorThemeButtonSelectedBackground: "var(--eli-version-manager-theme-button-selected-background)",
			colorThemeButtonSelectedText: "var(--eli-version-manager-theme-button-selected-text)",
			colorScrollbarTrack: "var(--eli-version-manager-scrollbar-track)",
			colorScrollbarThumb: "var(--eli-version-manager-scrollbar-thumb)",
			colorScrollbarThumbHover: "var(--eli-version-manager-scrollbar-thumb-hover)",
			colorScrollbarBorder: "var(--eli-version-manager-scrollbar-border)",
			shadowHeader: "var(--eli-version-manager-header-shadow)",
			shadowPanel: "var(--eli-version-manager-panel-shadow)",
		},
	},
	state: {
		check: {
			blockBoot: false,
			started: false,
			pending: false,
		},
		overlay: {
			animationFrame: 0,
			closeTimer: 0,
			keydownHandler: null,
		},
		updateWindow: {
			button: null,
			animationFrame: 0,
		},
		theme: {
			selected: "system",
			active: "dark",
			initialized: false,
			mediaQuery: null,
			changeHandler: null,
		},
	},
	outdatedList: [],
	newReleaseList: [],

	isBlockingBoot(){
		return this.state.check.pending || this.state.check.blockBoot
	},

	setBlockBoot(value){
		this.state.check.blockBoot = value
	},

	startCheckingPluginVersions(){
		this.setupTheme()

		if(!this.isCheckStarted()){
			this.onCheckPluginVersions()
		}
	},

	setupTheme(){
		if(!this.state.theme.initialized){
			this.loadTheme()
			this.addThemeStyleSheet()
			this.bindSystemThemeChange()
			this.state.theme.initialized = true
		}
	},

	isThemeMode(theme){
		return theme === "system" || theme === "light" || theme === "dark"
	},

	loadTheme(){
		let theme = "system"

		try{
			const storedTheme = localStorage.getItem(this.themeStorageKey)

			if(this.isThemeMode(storedTheme)){
				theme = storedTheme
			}
		}catch(error){
			theme = "system"
		}

		this.setTheme(theme, false)
	},

	setTheme(theme, store = true){
		this.state.theme.selected = this.isThemeMode(theme) ? theme : "system"
		this.updateActiveTheme()
		this.applyActiveTheme()
		this.updateThemeButtons()

		if(store){
			this.storeTheme()
		}
	},

	storeTheme(){
		try{
			localStorage.setItem(this.themeStorageKey, this.state.theme.selected)
		}catch(error){
			console.error("Eli Version Manager: theme preference could not be saved", error)
		}
	},

	updateActiveTheme(){
		if(this.state.theme.selected === "system"){
			this.state.theme.active = this.getSystemTheme()
		}else{
			this.state.theme.active = this.state.theme.selected
		}
	},

	getSystemTheme(){
		if(!this.state.theme.mediaQuery && typeof window.matchMedia === "function"){
			this.state.theme.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
		}

		return this.state.theme.mediaQuery && this.state.theme.mediaQuery.matches ? "dark" : "light"
	},

	bindSystemThemeChange(){
		if(!this.state.theme.changeHandler && typeof window.matchMedia === "function"){
			if(!this.state.theme.mediaQuery){
				this.state.theme.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
			}

			this.state.theme.changeHandler = this.onSystemThemeChange.bind(this)
			this.state.theme.mediaQuery.addEventListener("change", this.state.theme.changeHandler)
		}
	},

	onSystemThemeChange(){
		if(this.state.theme.selected === "system"){
			this.updateActiveTheme()
			this.applyActiveTheme()
		}
	},

	applyActiveTheme(){
		const root = document.documentElement
		const palette = this.getActiveThemePalette()
		const variables = this.ui.themeVariables

		for(const key of Object.keys(variables)){
			root.style.setProperty(variables[key], palette[key])
		}
	},

	addThemeStyleSheet(){
		const styleId = this.ui.mainId + "ThemeStyle"
		let styleElement = document.getElementById(styleId)

		if(!styleElement){
			styleElement = document.createElement("style")
			styleElement.id = styleId
			document.head.appendChild(styleElement)
		}

		styleElement.textContent = this.createThemeStyleText()
	},

	createThemeStyleText(){
		const style = this.getStyle()
		const newReleaseListId = "#" + this.ui.mainId + "NewReleaseList"
		const outdatedListId = "#" + this.ui.mainId + "OutdatedPluginList"
		const updateBodyId = "#" + this.ui.mainId + "UpdateBody"
		const selectors = `${newReleaseListId}, ${outdatedListId}, ${updateBodyId}`

		return `
.eliVersionManagerThemeButtons{
	display: inline-flex;
	align-items: stretch;
	padding-right: ${style.themeCloseSafetyPadding};
}
.eliVersionManagerThemeButton{
	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: ${style.themeButtonMinWidth};
	min-height: ${style.themeButtonMinHeight};
	padding: ${style.paddingThemeButton};
	border: 1px solid var(--eli-version-manager-panel-border);
	background: var(--eli-version-manager-button-background);
	color: var(--eli-version-manager-text);
	font-family: inherit;
	font-size: ${style.fontSizeSmall};
	font-weight: normal;
	line-height: 1;
	white-space: nowrap;
	cursor: pointer;
	outline: none;
	box-shadow: none;
	appearance: none;
	-webkit-appearance: none;
	-webkit-tap-highlight-color: var(--eli-version-manager-tap-highlight);
	transition: background ${style.transitionFast}, color ${style.transitionFast}, border-color ${style.transitionFast};
}
.eliVersionManagerThemeButton + .eliVersionManagerThemeButton{
	margin-left: -1px;
}
.eliVersionManagerThemeButton:hover{
	z-index: 1;
	background: var(--eli-version-manager-button-hover-background);
	color: var(--eli-version-manager-button-hover-text);
}
.eliVersionManagerThemeButton:active{
	background: var(--eli-version-manager-button-active-background);
	color: var(--eli-version-manager-button-hover-text);
}
.eliVersionManagerThemeButton.isSelected,
.eliVersionManagerThemeButton.isSelected:hover,
.eliVersionManagerThemeButton.isSelected:active{
	z-index: 2;
	border-color: var(--eli-version-manager-theme-button-selected-background);
	background: var(--eli-version-manager-theme-button-selected-background);
	color: var(--eli-version-manager-theme-button-selected-text);
	font-weight: bold;
}
.eliVersionManagerReliefButton{
	box-sizing: border-box;
	line-height: 1.2;
	text-align: center;
	margin-bottom: 3px;
	transform: translateY(0);
	box-shadow: inset 0 1px 0 var(--eli-version-manager-header-highlight), 0 3px 5px var(--eli-version-manager-button-active-background), 0 4px 5px var(--eli-version-manager-overlay-backdrop);
	transition: background ${style.transitionFast}, color ${style.transitionFast}, border-color ${style.transitionFast}, transform 80ms ease, box-shadow 80ms ease;
}
.eliVersionManagerReliefButton:hover:not(:disabled){
	box-shadow: 0 3px 0 var(--eli-version-manager-button-active-background), 0 4px 5px var(--eli-version-manager-overlay-backdrop);
}
.eliVersionManagerReliefButton:active:not(:disabled){
	transform: translateY(3px);
	box-shadow: 0 0 0 var(--eli-version-manager-button-active-background), 0 1px 2px var(--eli-version-manager-overlay-backdrop);
}
.eliVersionManagerMainOverlay button:focus,
.eliVersionManagerMainOverlay button:focus-visible{
	outline: none;
}
.eliVersionManagerCloseButton:hover{
	background: var(--eli-version-manager-close-button-hover-background) !important;
	color: var(--eli-version-manager-close-button-hover-text) !important;
}
${selectors}{
	scrollbar-color: var(--eli-version-manager-scrollbar-thumb) var(--eli-version-manager-scrollbar-track);
}
${newReleaseListId}::-webkit-scrollbar,
${outdatedListId}::-webkit-scrollbar,
${updateBodyId}::-webkit-scrollbar{
	width: 10px;
	height: 10px;
}
${newReleaseListId}::-webkit-scrollbar-track,
${outdatedListId}::-webkit-scrollbar-track,
${updateBodyId}::-webkit-scrollbar-track{
	background: var(--eli-version-manager-scrollbar-track);
}
${newReleaseListId}::-webkit-scrollbar-thumb,
${outdatedListId}::-webkit-scrollbar-thumb,
${updateBodyId}::-webkit-scrollbar-thumb{
	background: var(--eli-version-manager-scrollbar-thumb);
	border: 1px solid var(--eli-version-manager-scrollbar-border);
}
${newReleaseListId}::-webkit-scrollbar-thumb:hover,
${outdatedListId}::-webkit-scrollbar-thumb:hover,
${updateBodyId}::-webkit-scrollbar-thumb:hover{
	background: var(--eli-version-manager-scrollbar-thumb-hover);
}
${newReleaseListId}::-webkit-scrollbar-corner,
${outdatedListId}::-webkit-scrollbar-corner,
${updateBodyId}::-webkit-scrollbar-corner{
	background: var(--eli-version-manager-scrollbar-track);
}
${newReleaseListId}::-webkit-scrollbar-button,
${outdatedListId}::-webkit-scrollbar-button,
${updateBodyId}::-webkit-scrollbar-button{
	display: none;
	width: 0;
	height: 0;
}
`
	},

	getActiveThemePalette(){
		return this.ui.themes[this.state.theme.active]
	},

	isCheckStarted(){
		return this.state.check.started
	},

	setCheckStarted(value){
		this.state.check.started = value
	},

	getStyle(){
		return this.ui.style
	},

	getTheme(){
		return this.ui.themeCss
	},

	isMainOverlayOpen(){
		return !!document.getElementById(this.ui.mainId)
	},

	isUpdateWindowOpen(){
		return !!document.getElementById(this.getUpdateWindowId())
	},

	isEscapeKey(event){
		return event.key === "Escape" || event.keyCode === 27
	},

	onDocumentKeyDown(event){
		if(this.isEscapeKey(event)){

			if(this.isUpdateWindowOpen()){
				event.preventDefault()
				event.stopPropagation()
				this.closeUpdateWindow()
			}else if(this.isMainOverlayOpen()){
				event.preventDefault()
				event.stopPropagation()
				this.closeOverlay()
			}
		}
	},

	addDocumentEvents(){
		if(!this.state.overlay.keydownHandler){
			this.state.overlay.keydownHandler = this.onDocumentKeyDown.bind(this)
		}

		document.addEventListener("keydown", this.state.overlay.keydownHandler, true)
	},

	removeDocumentEvents(){
		if(this.state.overlay.keydownHandler){
			document.removeEventListener("keydown", this.state.overlay.keydownHandler, true)
		}
	},

	setButtonBaseStyle(element, enabled, options = {}){
		const theme = this.getTheme()
		const style = this.getStyle()
		const large = !!options.large
		const bold = !!options.bold
		const relief = options.relief ?? true
		const marginLeft = options.marginLeft ?? "0"

		element.style.cursor = enabled ? "pointer" : "default"
		element.style.background = theme.colorButtonBackground
		element.style.color = theme.colorText
		element.style.border = `1px solid ${theme.colorPanelBorder}`
		element.style.padding = large ? style.paddingButtonLarge : style.paddingButton
		element.style.minHeight = style.buttonMinHeight
		element.style.fontFamily = "inherit"
		element.style.fontSize = style.fontSizeSmall
		element.style.marginLeft = marginLeft
		element.style.fontWeight = bold ? "bold" : "normal"
		element.style.opacity = enabled ? "1" : style.disabledOpacity

		element.classList.toggle("eliVersionManagerReliefButton", relief)
		element.style.boxShadow = relief ? "" : "none"
		element.style.outline = "none"
		element.style.appearance = "none"
		element.style.webkitAppearance = "none"
		element.style.webkitTapHighlightColor = theme.colorTapHighlight

		this.bindSoftHover(element, enabled, options)
	},

	bindSoftHover(element, enabled, options = {}){
		const theme = this.getTheme()
		const style = this.getStyle()
		const hoverBackground = options.hoverBackground ?? theme.colorButtonHoverBackground
		const hoverText = options.hoverText ?? theme.colorButtonHoverText
		const activeBackground = options.activeBackground ?? theme.colorButtonActiveBackground
		const primaryOnly = !!options.primaryOnly
		const relief = options.relief ?? true
		const transition = `background ${style.transitionFast}, color ${style.transitionFast}, border-color ${style.transitionFast}`

		element.style.transition = relief ? `${transition}, transform 80ms ease, box-shadow 80ms ease` : transition

		if(enabled){
			element.addEventListener("mouseenter", () => {
				element.style.background = hoverBackground
				element.style.color = hoverText
			})

			element.addEventListener("mouseleave", () => {
				element.style.background = theme.colorButtonBackground
				element.style.color = theme.colorText
			})

			element.addEventListener("mousedown", (event) => {
				if(!primaryOnly || event.button === 0){
					element.style.background = activeBackground
					element.style.color = hoverText
				}
			})

			element.addEventListener("mouseup", (event) => {
				if(!primaryOnly || event.button === 0){
					element.style.background = hoverBackground
					element.style.color = hoverText
				}
			})
		}
	},

	onCheckPluginVersions(){
		this.setCheckStarted(true)
		this.setRequestPending(true)
		this.setBlockBoot(false)
		this.requestVersionFile()
	},

	setRequestPending(value){
		this.state.check.pending = value
	},

	onVersionFileUnavailable(){
		this.setRequestPending(false)
		this.clearNotificationLists()
		this.removeMainOverlay()
		this.setBlockBoot(false)
		console.log("Eli Version Manager: version json file not available")
	},

	requestVersionFile(){
		try{
			const xhr = new XMLHttpRequest()
			xhr.open("GET", this.versionFileUrl, true)
			xhr.addEventListener("load", this.onVersionFileLoad.bind(this, xhr))
			xhr.addEventListener("error", this.onVersionFileRequestError.bind(this))
			xhr.send()
		}catch(error){
			console.error("Eli Version Manager: version json request failed", error)
			this.onVersionFileUnavailable()
		}
	},

	onVersionFileLoad(xhr){
		this.setRequestPending(false)

		try{
			if(xhr.status >= 200 && xhr.status < 300){
				const versionList = JSON.parse(xhr.responseText || "{}")
				this.checkAndWarn(versionList)
			}else{
				this.onVersionFileUnavailable()
			}
		}catch(error){
			console.error("Eli Version Manager: version json request failed", error)
			this.onVersionFileUnavailable()
		}
	},

	onVersionFileRequestError(event){
		console.error("Eli Version Manager: version json request failed", event)
		this.onVersionFileUnavailable()
	},

	checkAndWarn(versionList){
		try{
			const outdatedList = Eli.Book.getParam().checkVersion ? this.getOutdatedPlugins(versionList) : []
			const newReleaseList = Eli.Book.getParam().showNewReleases ? this.getNewPluginReleases(versionList) : []

			this.setOutdatedList(outdatedList)
			this.setNewReleaseList(newReleaseList)

			if(this.hasNotifications(outdatedList, newReleaseList)){
				this.showOverlay(outdatedList, newReleaseList)
				this.setBlockBoot(this.isMainOverlayOpen())
			}else{
				this.removeMainOverlay()
				this.setBlockBoot(false)
			}
		}catch(error){
			this.clearNotificationLists()
			this.removeMainOverlay()
			this.setBlockBoot(false)
			console.error("Eli Version Manager: notification check failed", error)
		}
	},

	clearNotificationLists(){
		this.setOutdatedList([])
		this.setNewReleaseList([])
	},

	setOutdatedList(list){
		this.outdatedList = list
	},

	getOutdatedList(){
		return this.outdatedList
	},

	setNewReleaseList(list){
		this.newReleaseList = list
	},

	getNewReleaseList(){
		return this.newReleaseList
	},

	hasNotifications(outdatedList = this.getOutdatedList(), newReleaseList = this.getNewReleaseList()){
		return outdatedList.length > 0 || newReleaseList.length > 0
	},

	getNotificationCount(outdatedList = this.getOutdatedList(), newReleaseList = this.getNewReleaseList()){
		return outdatedList.length + newReleaseList.length
	},

	getNewPluginReleases(versionList, currentTime = Date.now()){
		const releases = []
		const dismissedReleases = this.readDismissedReleases()

		for(const pluginName in versionList){
			const data = this.getPluginDataFromVersionList(versionList, pluginName)

			if(!this.isNewPluginRelease(pluginName, data, currentTime, dismissedReleases)) continue

			releases.push({
				name: pluginName,
				version: data.version.join("."),
				url: data.url,
				log: data.log,
				releaseDate: data.releaseDate,
			})
		}

		return releases
	},

	isNewPluginRelease(pluginName, data, currentTime, dismissedReleases){
		return pluginName.startsWith("EliMZ_") &&
			data &&
			this.isInitialReleaseVersion(data.version) &&
			this.isReleaseDateActive(data.releaseDate, currentTime) &&
			!this.isPluginAdded(pluginName) &&
			!this.isReleaseDismissed(pluginName, dismissedReleases)
	},

	readDismissedReleases(){
		try{
			const rawData = localStorage.getItem(this.dismissedReleaseStorageKey)

			if(!rawData) return {}

			const data = JSON.parse(rawData)

			if(data && typeof data === "object" && !Array.isArray(data)){
				return data
			}else{
				return {}
			}
		}catch(error){
			return {}
		}
	},

	writeDismissedReleases(data){
		try{
			localStorage.setItem(this.dismissedReleaseStorageKey, JSON.stringify(data))
			return true
		}catch(error){
			console.error("Eli Version Manager: release dismiss data could not be saved", error)
			return false
		}
	},

	isReleaseDismissed(pluginName, dismissedReleases = this.readDismissedReleases()){
		return dismissedReleases[pluginName] === true
	},

	dismissRelease(pluginName){
		const dismissedReleases = this.readDismissedReleases()
		dismissedReleases[pluginName] = true
		this.writeDismissedReleases(dismissedReleases)
	},

	isInitialReleaseVersion(version){
		return version && this.compareVersions(version, [1, 0, 0]) === 0
	},

	parseReleaseDate(releaseDate){
		const match = String(releaseDate || "").match(/^(\d{1,2})_(\d{1,2})_(\d{4})$/)

		if(match){
			const day = Number(match[1])
			const month = Number(match[2])
			const year = Number(match[3])
			const date = new Date(year, month - 1, day)
			const valid = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day

			if(valid){
				return date
			}else{
				return null
			}
		}else{
			return null
		}
	},

	isReleaseDateActive(releaseDate, currentTime = Date.now()){
		const date = this.parseReleaseDate(releaseDate)

		if(date){
			const releaseTime = date.getTime()
			const activePeriod = 7 * 24 * 60 * 60 * 1000

			return currentTime >= releaseTime && currentTime < releaseTime + activePeriod
		}else{
			return false
		}
	},

	isPluginAdded(pluginName){
		return $plugins.some(plugin => this.getPluginEntryName(plugin) === pluginName)
	},

	getPluginEntryName(plugin){
		return Utils.extractFileName(plugin.name)
	},

	getOutdatedPlugins(versionList){
		const outdated = []

		for(const plugin of $plugins){
			const pluginName = this.getPluginEntryName(plugin)

			if(!plugin.status || !pluginName.startsWith("EliMZ_")) continue

			const data = this.getPluginDataFromVersionList(versionList, pluginName)

			if(!data) continue

			const latestVersion = data.version
			const currentVersion = this.getCurrentVersion(pluginName)

			if(!currentVersion) continue
			const versionDif = this.compareVersions(currentVersion, latestVersion)

			if(versionDif < 0){
				outdated.push({
					name: pluginName,
					current: currentVersion.join("."),
					latest: latestVersion.join("."),
					url: data.url,
					log: data.log,
				})
			}
		}

		return outdated
	},

	getPluginDataFromVersionList(versionList, pluginName){
		const info = versionList[pluginName]

		if(!info) return null

		const version = this.parseVersionToArray(info.version)

		if(!version) return null

		return {
			version: version,
			url: typeof info.url === "string" ? info.url : "",
			log: typeof info.log === "string" ? info.log : "",
			releaseDate: typeof info.releaseDate === "string" ? info.releaseDate : ""
		}
	},

	parseVersionToArray(versionString){
		const parts = String(versionString).split(".")

		if(parts.length !== 3) return null

		const version = parts.map(item => Number(item))
		const valid = version.every(item => Number.isInteger(item) && item >= 0)

		return valid ? version : null
	},

	getCurrentVersion(pluginName){
		const reg = this.registry[pluginName]

		if(reg){
			return reg

		}else{
			const text = this.getVersionFromDescription(pluginName)
			return this.parseVersionToArray(text)
		}
	},

	getVersionFromDescription(pluginName){
		const plugin = $plugins.find(item => this.getPluginEntryName(item) === pluginName)

		if(plugin){
			const desc = plugin.description
			const start = desc.indexOf("♦") + 1
			const end = desc.lastIndexOf("♦")

			if(start <= 0 || end <= 0 || end <= start){
				return "0.0.0"
			}else{
				return desc.substring(start, end).trim()
			}

		}else{
			return "0.0.0"
		}
	},

	compareVersions(currentVersion, latestVersion){
		for(let i = 0; i < 3; i++){
			const diff = currentVersion[i] - latestVersion[i]

			if(diff !== 0) {
				return diff
			}
		}

		return 0
	},

	showOverlay(outdatedList, newReleaseList){
		this.removeMainOverlay()

		const mainOverlay = this.createMainOverlay()
		const panel = this.createOverlayPanel()
		const content = this.createOverlayContent(outdatedList, newReleaseList)
		const count = this.getNotificationCount(outdatedList, newReleaseList)

		panel.appendChild(this.createOverlayHeader(count))
		panel.appendChild(content)
		panel.appendChild(this.createOverlayFooter())

		mainOverlay.appendChild(panel)
		document.body.appendChild(mainOverlay)

		this.addDocumentEvents()
		this.playMainOverlayOpenAnimation(panel)
	},

	playMainOverlayOpenAnimation(panel){
		this.cancelMainOverlayAnimation()

		this.state.overlay.animationFrame = requestAnimationFrame(() => {
			this.state.overlay.animationFrame = 0

			if(panel.isConnected){
				panel.style.transform = "none"
				panel.style.opacity = "1"
			}
		})
	},

	cancelMainOverlayAnimation(){
		if(this.state.overlay.animationFrame){
			cancelAnimationFrame(this.state.overlay.animationFrame)
			this.state.overlay.animationFrame = 0
		}
	},

	cancelMainOverlayCloseTimer(){
		if(this.state.overlay.closeTimer){
			clearTimeout(this.state.overlay.closeTimer)
			this.state.overlay.closeTimer = 0
		}
	},

	removeMainOverlay(){
		const old = document.getElementById(this.ui.mainId)

		this.cancelMainOverlayAnimation()
		this.cancelMainOverlayCloseTimer()
		this.removeDocumentEvents()
		this.closeUpdateWindowNow()

		if(old){
			old.remove()
		}
	},

	createMainOverlay(){
		const overlay = document.createElement("div")
		overlay.id = this.ui.mainId
		overlay.className = "eliVersionManagerMainOverlay"
		this.setMainOverlayStyle(overlay)

		return overlay
	},

	setMainOverlayStyle(element){
		const theme = this.getTheme()

		element.style.position = "fixed"
		element.style.left = "0"
		element.style.top = "0"
		element.style.width = "100%"
		element.style.height = "100%"
		element.style.zIndex = "999999"
		element.style.pointerEvents = "auto"
		element.style.background = theme.colorPanelBackground
	},

	createOverlayPanel(){
		const panel = document.createElement("div")
		panel.id = this.ui.mainId + "OverlayPanel"
		panel.className = "eliVersionManagerOverlayPanel"
		this.setPanelStyle(panel)

		panel.addEventListener("wheel", (e) => e.stopPropagation(), {capture: true, passive: true})

		return panel
	},

	setPanelStyle(element){
		const theme = this.getTheme()
		const style = this.getStyle()

		element.style.pointerEvents = "auto"
		element.style.position = "absolute"
		element.style.left = "0"
		element.style.top = "0"
		element.style.width = "100%"
		element.style.height = "100%"
		element.style.maxWidth = "none"
		element.style.maxHeight = "none"
		element.style.boxSizing = "border-box"
		element.style.display = "flex"
		element.style.flexDirection = "column"
		element.style.overflow = "hidden"

		element.style.background = theme.colorPanelBackground
		element.style.border = "none"
		element.style.boxShadow = "none"
		element.style.padding = style.paddingPanel
		element.style.fontFamily = style.fontFamily
		element.style.color = theme.colorText

		element.style.transform = "none"
		element.style.opacity = "0"
		element.style.transition = `opacity ${this.ui.slideDurationMs}ms ${this.ui.slideEasing}`
		element.style.willChange = "opacity"
	},

	createOverlayContent(outdatedList, newReleaseList){
		const content = document.createElement("div")
		content.id = this.ui.mainId + "OverlayContent"
		content.className = "eliVersionManagerOverlayContent"
		this.setOverlayContentStyle(content)

		content.appendChild(this.createNewReleaseSection(newReleaseList))
		content.appendChild(this.createOutdatedPluginSection(outdatedList))

		return content
	},

	setOverlayContentStyle(element){
		const style = this.getStyle()

		element.style.display = "grid"
		element.style.gridTemplateColumns = "repeat(auto-fit, minmax(320px, 1fr))"
		element.style.gridAutoRows = "minmax(0, 1fr)"
		element.style.gap = style.gapMedium
		element.style.flex = "1"
		element.style.minHeight = "0"
		element.style.overflow = "hidden"
		element.style.marginTop = "12px"
	},

	createOverlayHeader(count){
		const mainHeader = this.createMainHeader()
		const headerTitle = this.createTitleHeader(count)
		const headerControls = this.createOverlayHeaderControls()
		const themeButtons = this.createThemeButtons()
		const closeButton = this.createCloseButton()
		closeButton.id = this.ui.mainId + "OverlayCloseButton"

		const onClose = (event) => {
			if(event.button !== 0) return

			event.preventDefault()
			event.stopPropagation()
			this.closeOverlay()
		}

		closeButton.addEventListener("click", onClose, true)

		headerControls.appendChild(themeButtons)
		headerControls.appendChild(closeButton)
		mainHeader.appendChild(headerTitle)
		mainHeader.appendChild(headerControls)
		this.updateThemeButtons(mainHeader)

		return mainHeader
	},

	createOverlayHeaderControls(){
		const controls = document.createElement("div")
		controls.id = this.ui.mainId + "OverlayHeaderControls"
		controls.className = "eliVersionManagerOverlayHeaderControls"
		controls.style.display = "flex"
		controls.style.alignItems = "center"
		controls.style.flex = "0 0 auto"

		return controls
	},

	createThemeButtons(){
		const buttons = document.createElement("div")
		buttons.id = this.ui.mainId + "ThemeButtons"
		buttons.className = "eliVersionManagerThemeButtons"
		buttons.setAttribute("role", "group")
		buttons.setAttribute("aria-label", "Theme")
		buttons.appendChild(this.createThemeButton("system", "System"))
		buttons.appendChild(this.createThemeButton("light", "Light"))
		buttons.appendChild(this.createThemeButton("dark", "Dark"))

		return buttons
	},

	createThemeButton(theme, text){
		const button = document.createElement("button")
		const idName = theme.charAt(0).toUpperCase() + theme.slice(1)

		button.id = this.ui.mainId + "Theme" + idName + "Button"
		button.className = "eliVersionManagerThemeButton"
		button.type = "button"
		button.textContent = text
		button.dataset.theme = theme
		button.setAttribute("aria-pressed", "false")
		button.addEventListener("mouseenter", () => {
			this.setThemeButtonVisual(button, "hover")
		})
		button.addEventListener("mouseleave", () => {
			this.setThemeButtonVisual(button)
		})
		button.addEventListener("mousedown", () => {
			this.setThemeButtonVisual(button, "active")
		})
		button.addEventListener("mouseup", () => {
			this.setThemeButtonVisual(button, "hover")
		})
		button.addEventListener("click", () => {
			this.setTheme(theme)
		})

		return button
	},

	setThemeButtonVisual(button, interaction = "default"){
		const theme = this.getTheme()
		const selected = button.dataset.theme === this.state.theme.selected

		if(selected){
			button.style.zIndex = "2"
			button.style.background = theme.colorThemeButtonSelectedBackground
			button.style.color = theme.colorThemeButtonSelectedText
			button.style.borderColor = theme.colorThemeButtonSelectedBackground
			button.style.fontWeight = "bold"
		}else{
			button.style.zIndex = interaction === "default" ? "0" : "1"
			button.style.borderColor = theme.colorPanelBorder
			button.style.fontWeight = "normal"

			if(interaction === "hover"){
				button.style.background = theme.colorButtonHoverBackground
				button.style.color = theme.colorButtonHoverText
			}else if(interaction === "active"){
				button.style.background = theme.colorButtonActiveBackground
				button.style.color = theme.colorButtonHoverText
			}else{
				button.style.background = theme.colorButtonBackground
				button.style.color = theme.colorText
			}
		}
	},

	updateThemeButtons(root = document){
		const buttons = root.querySelectorAll(".eliVersionManagerThemeButton")

		for(const button of buttons){
			const selected = button.dataset.theme === this.state.theme.selected

			button.classList.toggle("isSelected", selected)
			button.setAttribute("aria-pressed", selected ? "true" : "false")
			this.setThemeButtonVisual(button)
		}
	},

	createMainHeader(){
		const header = document.createElement("div")
		header.id = this.ui.mainId + "OverlayHeader"
		header.className = "eliVersionManagerOverlayHeader"
		this.setMainHeaderStyle(header)

		return header
	},

	setMainHeaderStyle(element){
		const theme = this.getTheme()
		const style = this.getStyle()

		element.style.display = "flex"
		element.style.alignItems = "center"
		element.style.justifyContent = "space-between"
		element.style.gap = "12px"
		element.style.flex = "0 0 auto"
		element.style.margin = `-${style.paddingPanel} -${style.paddingPanel} 0`
		element.style.padding = "10px 12px"
		element.style.background = theme.colorHeaderBackground
		element.style.borderBottom = `1px solid ${theme.colorHeaderEdge}`
		element.style.boxShadow = `inset 0 1px 0 ${theme.colorHeaderHighlight}, ${theme.shadowHeader}`
		element.style.zIndex = "2"
	},

	createTitleHeader(count){
		const title = document.createElement("div")
		title.id = this.ui.mainId + "OverlayTitle"
		title.className = "eliVersionManagerOverlayTitle"
		title.textContent = `Eli Version Manager: ${count} notification(s)`
		this.setTitleHeaderStyle(title)

		return title
	},

	setTitleHeaderStyle(element){
		const theme = this.getTheme()
		const style = this.getStyle()

		element.style.flex = "1"
		element.style.minWidth = "0"
		element.style.fontWeight = "bold"
		element.style.fontSize = style.fontSizeLarge
		element.style.color = theme.colorTitle
	},

	createCloseButton(){
		const closeButton = document.createElement("button")
		closeButton.className = "eliVersionManagerCloseButton"
		closeButton.textContent = "X"
		this.setCloseButtonStyle(closeButton)

		return closeButton
	},

	setCloseButtonStyle(element){
		const theme = this.getTheme()
		const style = this.getStyle()

		this.setButtonBaseStyle(element, true, {
			large: false,
			bold: true,
			relief: false,
			marginLeft: "0",
			hoverBackground: theme.colorCloseButtonHoverBackground,
			hoverText: theme.colorCloseButtonHoverText,
			activeBackground: theme.colorCloseButtonHoverBackground,
			primaryOnly: true
		})

		element.style.alignSelf = "stretch"
		element.style.minWidth = "38px"
		element.style.minHeight = "0"
		element.style.padding = "0"
		element.style.border = "0"
		element.style.fontSize = style.fontSizeLarge
		element.style.lineHeight = "1"
	},

	closeOverlay(){
		const mainOverlay = document.getElementById(this.ui.mainId)

		if(mainOverlay){
			if(mainOverlay.dataset.closing !== "true"){
				const panel = mainOverlay.firstElementChild

				if(panel){
					mainOverlay.dataset.closing = "true"
					mainOverlay.style.pointerEvents = "none"

					this.closeUpdateWindowNow()
					this.cancelMainOverlayAnimation()

					panel.style.transform = "none"
					panel.style.opacity = "0"

					let closed = false
					const finishClose = () => {
						if(!closed){
							closed = true
							panel.removeEventListener("transitionend", onEnd)
							this.cancelMainOverlayCloseTimer()
							this.removeMainOverlay()
							this.setBlockBoot(false)
						}
					}
					const onEnd = (event) => {
						if(event.target === panel){
							finishClose()
						}
					}

					panel.addEventListener("transitionend", onEnd)
					this.state.overlay.closeTimer = setTimeout(finishClose, this.ui.slideDurationMs + 80)
				}else{
					this.removeMainOverlay()
					this.setBlockBoot(false)
				}
			}
		}else{
			this.removeMainOverlay()
			this.setBlockBoot(false)
		}
	},

	createNewReleaseSection(releases){
		const section = this.createOverlaySection("New Plugin Releases", releases.length, "NewReleaseSection")
		const list = this.createNewReleaseList(releases)

		if(releases.length === 0){
			list.appendChild(this.createOverlayEmptyMessage("No new releases.", "NewReleaseEmptyMessage"))
		}

		section.appendChild(list)

		return section
	},

	createOutdatedPluginSection(outdated){
		const section = this.createOverlaySection("Plugin Updates", outdated.length, "OutdatedPluginSection")
		const list = this.createOverlayList(outdated)

		if(outdated.length === 0){
			list.appendChild(this.createOverlayEmptyMessage("No plugin updates.", "OutdatedPluginEmptyMessage"))
		}

		section.appendChild(list)

		return section
	},

	createOverlaySection(titleText, count, idSuffix){
		const section = document.createElement("section")
		section.id = this.ui.mainId + idSuffix
		section.className = "eliVersionManagerSection"
		this.setOverlaySectionStyle(section)
		section.appendChild(this.createOverlaySectionTitle(titleText, count, idSuffix + "Title"))

		return section
	},

	setOverlaySectionStyle(element){
		const theme = this.getTheme()

		element.style.display = "flex"
		element.style.flexDirection = "column"
		element.style.minWidth = "0"
		element.style.minHeight = "0"
		element.style.overflow = "hidden"
		element.style.boxSizing = "border-box"
		element.style.border = `1px solid ${theme.colorBodyBorder}`
		element.style.background = theme.colorBodyBackground
	},

	createOverlaySectionTitle(titleText, count, idSuffix){
		const title = document.createElement("div")
		title.id = this.ui.mainId + idSuffix
		title.className = "eliVersionManagerSectionTitle"
		title.textContent = `${titleText} (${count})`
		this.setOverlaySectionTitleStyle(title)

		return title
	},

	setOverlaySectionTitleStyle(element){
		const theme = this.getTheme()
		const style = this.getStyle()

		element.style.flex = "0 0 auto"
		element.style.padding = "9px 11px"
		element.style.borderBottom = `1px solid ${theme.colorSubtleBorder}`
		element.style.background = theme.colorSectionHeaderBackground
		element.style.fontWeight = "bold"
		element.style.fontSize = style.fontSizeMedium
		element.style.color = theme.colorTitle
	},

	createNewReleaseList(releases){
		const list = document.createElement("div")
		list.id = this.ui.mainId + "NewReleaseList"
		list.className = "eliVersionManagerNewReleaseList"
		this.setOverlayListStyle(list)

		for(const item of releases){
			list.appendChild(this.createNewReleaseItem(item))
		}

		return list
	},

	createNewReleaseItem(item){
		const wrap = this.createItemWrap()
		const info = this.createNewReleaseItemInfo(item)

		wrap.id = this.ui.mainId + "NewReleaseItem_" + item.name
		info.appendChild(this.createNewReleaseItemFooter(item))
		wrap.appendChild(this.createNewReleaseItemHeader(item))
		wrap.appendChild(info)

		return wrap
	},

	createNewReleaseItemHeader(item){
		const header = document.createElement("div")
		const name = this.createItemName(item)

		header.id = this.ui.mainId + "NewReleaseItemHeader_" + item.name
		header.className = "eliVersionManagerNewReleaseItemHeader"
		name.id = this.ui.mainId + "NewReleaseItemName_" + item.name
		this.setNewReleaseItemHeaderStyle(header)
		header.appendChild(name)

		return header
	},

	setNewReleaseItemHeaderStyle(element){
		element.style.minWidth = "0"
		element.style.marginBottom = "8px"
		element.style.overflowWrap = "anywhere"
	},

	createNewReleaseItemInfo(item){
		const line = this.createItemLine()
		const releaseLabel = this.createNewReleaseDateLabel()
		const releaseValue = this.createNewReleaseDateValue(item)
		const versionLabel = this.createNewReleaseVersionLabel()
		const versionValue = this.createNewReleaseVersionValue(item)

		line.id = this.ui.mainId + "NewReleaseItemInfo_" + item.name
		line.appendChild(releaseLabel)
		line.appendChild(releaseValue)
		line.appendChild(this.createItemSeparator())
		line.appendChild(versionLabel)
		line.appendChild(versionValue)

		return line
	},


	createNewReleaseItemFooter(item){
		const footer = document.createElement("div")
		const detailsButton = this.createNewReleaseDetailsButton(item)
		const dismissButton = this.createNewReleaseDismissButton(item)

		footer.id = this.ui.mainId + "NewReleaseItemFooter_" + item.name
		footer.className = "eliVersionManagerNewReleaseItemFooter"
		detailsButton.id = this.ui.mainId + "NewReleaseDetailsButton_" + item.name
		dismissButton.id = this.ui.mainId + "NewReleaseDismissButton_" + item.name
		this.setNewReleaseItemFooterStyle(footer)

		detailsButton.addEventListener("click", () => {
			this.onNewReleaseDetailsButton(item, detailsButton)
		})
		dismissButton.addEventListener("click", this.onNewReleaseDismissButton.bind(this, item))

		footer.appendChild(detailsButton)
		footer.appendChild(dismissButton)

		return footer
	},

	setNewReleaseItemFooterStyle(element){
		const style = this.getStyle()

		element.style.display = "flex"
		element.style.alignItems = "center"
		element.style.flexWrap = "wrap"
		element.style.gap = style.gapSmall
		element.style.marginLeft = "auto"
	},

	createNewReleaseDateLabel(){
		const label = document.createElement("span")
		label.className = "eliVersionManagerNewReleaseDateLabel"
		label.textContent = "Released: "

		return label
	},

	createNewReleaseDateValue(item){
		const value = document.createElement("span")
		value.className = "eliVersionManagerNewReleaseDateValue"
		value.textContent = this.formatReleaseDate(item.releaseDate)
		this.setNewReleaseDateValueStyle(value)

		return value
	},

	setNewReleaseDateValueStyle(element){
		const theme = this.getTheme()

		element.style.fontWeight = "bold"
		element.style.color = theme.colorDanger
	},

	formatReleaseDate(releaseDate){
		const date = this.parseReleaseDate(releaseDate)

		if(date){
			const day = String(date.getDate()).padStart(2, "0")
			const month = String(date.getMonth() + 1).padStart(2, "0")
			const year = date.getFullYear()

			return `${day}/${month}/${year}`
		}else{
			return ""
		}
	},

	createNewReleaseVersionLabel(){
		const label = document.createElement("span")
		label.className = "eliVersionManagerNewReleaseVersionLabel"
		label.textContent = "Version: "

		return label
	},

	createNewReleaseVersionValue(item){
		const value = document.createElement("span")
		value.className = "eliVersionManagerNewReleaseVersionValue"
		value.textContent = item.version
		this.setLatestValueStyle(value)

		return value
	},

	createNewReleaseDetailsButton(item){
		const button = document.createElement("button")
		const enabled = this.hasLog(item) || !!item.url

		button.className = "eliVersionManagerNewReleaseDetailsButton"
		button.textContent = "Details"
		button.disabled = !enabled
		this.setButtonBaseStyle(button, enabled)

		return button
	},

	createNewReleaseDismissButton(){
		const button = document.createElement("button")

		button.className = "eliVersionManagerNewReleaseDismissButton"
		button.textContent = "Dismiss"
		this.setButtonBaseStyle(button, true)

		return button
	},

	onNewReleaseDetailsButton(item, button){
		const details = {
			...item,
			detailType: "release",
		}

		this.openUpdateWindow(details, button)
	},

	onNewReleaseDismissButton(item){
		this.dismissRelease(item.name)
		this.removeNewRelease(item.name)
		this.removeNewReleaseItemElement(item.name)

		if(this.hasNotifications()){
			this.refreshNotificationCounts()
			this.refreshNewReleaseEmptyMessage()
		}else{
			this.closeOverlay()
		}
	},

	removeNewRelease(pluginName){
		const list = this.getNewReleaseList()
		const index = list.findIndex(item => item.name === pluginName)

		if(index >= 0){
			list.splice(index, 1)
		}
	},

	removeNewReleaseItemElement(pluginName){
		const item = document.getElementById(this.ui.mainId + "NewReleaseItem_" + pluginName)

		if(item){
			item.remove()
		}
	},

	refreshNotificationCounts(){
		const overlayTitle = document.getElementById(this.ui.mainId + "OverlayTitle")
		const releaseTitle = document.getElementById(this.ui.mainId + "NewReleaseSectionTitle")

		if(overlayTitle){
			overlayTitle.textContent = `Eli Version Manager: ${this.getNotificationCount()} notification(s)`
		}

		if(releaseTitle){
			releaseTitle.textContent = `New Plugin Releases (${this.getNewReleaseList().length})`
		}
	},

	refreshNewReleaseEmptyMessage(){
		const list = document.getElementById(this.ui.mainId + "NewReleaseList")
		const oldMessage = document.getElementById(this.ui.mainId + "NewReleaseEmptyMessage")

		if(this.getNewReleaseList().length === 0){
			if(list && !oldMessage){
				list.appendChild(this.createOverlayEmptyMessage("No new releases.", "NewReleaseEmptyMessage"))
			}
		}else if(oldMessage){
			oldMessage.remove()
		}
	},

	createOverlayList(outdated){
		const list = document.createElement("div")
		list.id = this.ui.mainId + "OutdatedPluginList"
		list.className = "eliVersionManagerOutdatedPluginList"
		this.setOverlayListStyle(list)

		for(const item of outdated){
			list.appendChild(this.createOverlayItem(item))
		}

		return list
	},

	setOverlayListStyle(element){
		const style = this.getStyle()

		element.style.display = "flex"
		element.style.flexDirection = "column"
		element.style.gap = style.gapMedium
		element.style.flex = "1"
		element.style.minHeight = "0"
		element.style.overflowY = "auto"
		element.style.scrollbarGutter = "stable"
		element.style.padding = style.paddingCard
	},

	createOverlayEmptyMessage(text, idSuffix = ""){
		const message = document.createElement("div")

		if(idSuffix){
			message.id = this.ui.mainId + idSuffix
		}

		message.className = "eliVersionManagerEmptyMessage"
		message.textContent = text
		this.setOverlayEmptyMessageStyle(message)

		return message
	},

	setOverlayEmptyMessageStyle(element){
		const theme = this.getTheme()
		const style = this.getStyle()

		element.style.margin = "auto"
		element.style.padding = style.paddingCard
		element.style.fontSize = style.fontSizeSmall
		element.style.color = theme.colorTextMuted
		element.style.textAlign = "center"
	},

	createOverlayItem(item){
		const wrap = this.createItemWrap()
		const header = this.createUpdateItemHeader(item)
		const versionLine = this.createUpdateItemVersionLine(item)
		const button = this.createItemUpdateButton(item)

		wrap.id = this.ui.mainId + "PluginItem_" + item.name
		header.id = this.ui.mainId + "PluginItemHeader_" + item.name
		versionLine.id = this.ui.mainId + "PluginItemVersionLine_" + item.name
		button.id = this.ui.mainId + "PluginUpdateButton_" + item.name

		button.addEventListener("click", () => {
			this.onItemUpdateButton(item, button)
		})

		versionLine.appendChild(button)
		wrap.appendChild(header)
		wrap.appendChild(versionLine)

		return wrap
	},

	createUpdateItemHeader(item){
		const header = document.createElement("div")
		const name = this.createItemName(item)

		header.className = "eliVersionManagerUpdateItemHeader"
		name.id = this.ui.mainId + "PluginItemName_" + item.name
		this.setUpdateItemHeaderStyle(header)
		header.appendChild(name)

		return header
	},

	setUpdateItemHeaderStyle(element){
		element.style.minWidth = "0"
		element.style.marginBottom = "8px"
		element.style.overflowWrap = "anywhere"
	},

	createUpdateItemVersionLine(item){
		const line = document.createElement("div")
		const current = this.createUpdateItemVersionGroup("Current", item.current, "Current", item.name)
		const arrow = this.createUpdateItemVersionArrow(item)
		const latest = this.createUpdateItemVersionGroup("Latest", item.latest, "Latest", item.name)

		line.className = "eliVersionManagerUpdateItemVersionLine"
		this.setUpdateItemVersionLineStyle(line)
		line.appendChild(current)
		line.appendChild(arrow)
		line.appendChild(latest)

		return line
	},

	setUpdateItemVersionLineStyle(element){
		const style = this.getStyle()

		element.style.display = "flex"
		element.style.alignItems = "center"
		element.style.flexWrap = "wrap"
		element.style.gap = style.gapSmall
		element.style.fontSize = style.fontSizeSmall
	},

	createUpdateItemVersionGroup(labelText, version, type, pluginName){
		const group = document.createElement("span")
		const label = document.createElement("span")
		const value = document.createElement("span")

		group.id = this.ui.mainId + `Plugin${type}VersionGroup_` + pluginName
		group.className = "eliVersionManagerUpdateVersionGroup"
		label.id = this.ui.mainId + `Plugin${type}VersionLabel_` + pluginName
		label.className = "eliVersionManagerUpdateVersionLabel"
		label.textContent = labelText + ": "
		value.id = this.ui.mainId + `Plugin${type}VersionValue_` + pluginName
		value.className = "eliVersionManagerUpdateVersionValue"
		value.textContent = version

		if(type.endsWith("Current")){
			this.setCurrentValueStyle(value)
		}else{
			this.setLatestValueStyle(value)
		}

		group.appendChild(label)
		group.appendChild(value)

		return group
	},

	createUpdateItemVersionArrow(item){
		const arrow = document.createElement("span")
		arrow.id = this.ui.mainId + "PluginVersionArrow_" + item.name
		arrow.className = "eliVersionManagerUpdateVersionArrow"
		arrow.textContent = "→"
		this.setUpdateItemVersionArrowStyle(arrow)

		return arrow
	},

	setUpdateItemVersionArrowStyle(element){
		const theme = this.getTheme()

		element.style.color = theme.colorSeparator
		element.style.flex = "0 0 auto"
	},

	createItemWrap(){
		const wrap = document.createElement("div")
		wrap.className = "eliVersionManagerPluginItem"
		this.setItemWrapStyle(wrap)

		return wrap
	},

	setItemWrapStyle(element){
		const theme = this.getTheme()
		const style = this.getStyle()

		element.style.border = `1px solid ${theme.colorCardBorder}`
		element.style.padding = style.paddingCard
		element.style.background = theme.colorCardBackground
	},

	createItemLine(){
		const line = document.createElement("div")
		line.className = "eliVersionManagerPluginItemLine"
		this.setItemLineStyle(line)

		return line
	},

	setItemLineStyle(element){
		const style = this.getStyle()

		element.style.display = "flex"
		element.style.alignItems = "center"
		element.style.flexWrap = "wrap"
		element.style.gap = style.gapTiny
		element.style.fontSize = style.fontSizeSmall
		element.style.marginBottom = "0"
	},

	createItemName(item){
		const name = document.createElement("span")
		name.className = "eliVersionManagerPluginName"
		name.textContent = item.name
		this.setItemNameStyle(name)

		return name
	},

	setItemNameStyle(element){
		const theme = this.getTheme()
		const style = this.getStyle()

		element.style.fontWeight = "bold"
		element.style.fontSize = style.fontSizeMedium
		element.style.color = theme.colorText
	},

	createItemSeparator(){
		const separator = document.createElement("span")
		separator.className = "eliVersionManagerSeparator"
		separator.textContent = "|"
		this.setItemSeparatorStyle(separator)

		return separator
	},

	setItemSeparatorStyle(element){
		const theme = this.getTheme()

		element.style.color = theme.colorSeparator
		element.style.flex = "0 0 auto"
	},

	createItemVersionCurrentLabel(){
		const currentLabel = document.createElement("span")
		currentLabel.className = "eliVersionManagerCurrentVersionLabel"
		currentLabel.textContent = "Current: "

		return currentLabel
	},

	createItemVersionCurrentValue(item){
		const currentValue = document.createElement("span")
		currentValue.className = "eliVersionManagerCurrentVersionValue"
		currentValue.textContent = item.current
		this.setCurrentValueStyle(currentValue)

		return currentValue
	},

	setCurrentValueStyle(element){
		const theme = this.getTheme()

		element.style.fontWeight = "bold"
		element.style.color = theme.colorDanger
	},

	createItemVersionLatestLabel(){
		const latestLabel = document.createElement("span")
		latestLabel.className = "eliVersionManagerLatestVersionLabel"
		latestLabel.textContent = "Latest: "

		return latestLabel
	},

	createItemVersionLatestValue(item){
		const latestValue = document.createElement("span")
		latestValue.className = "eliVersionManagerLatestVersionValue"
		latestValue.textContent = item.latest
		this.setLatestValueStyle(latestValue)

		return latestValue
	},

	setLatestValueStyle(element){
		const theme = this.getTheme()

		element.style.fontWeight = "bold"
		element.style.color = theme.colorSuccess
	},

	createItemUpdateButton(item){
		const button = document.createElement("button")
		const enabled = this.hasLog(item) || !!item.url

		button.className = "eliVersionManagerPluginUpdateButton"
		button.textContent = "Update"
		button.disabled = !enabled
		this.setUpdateButtonStyle(button, enabled)

		return button
	},

	setUpdateButtonStyle(element, enabled){
		this.setButtonBaseStyle(element, enabled, {
			large: false,
			bold: false,
			marginLeft: "auto"
		})
	},

	onItemUpdateButton(item, button){
		if(this.hasLog(item)){
			this.openUpdateWindow(item, button)
		}else{
			this.openItemUrl(item)
		}
	},

	hasLog(item){
		return !!item.log
	},

	setLogContent(element, html){
		element.innerHTML = html || ""

		const links = element.querySelectorAll("a")

		for(const link of links){
			link.replaceWith(...link.childNodes)
		}
	},

	openItemUrl(item){
		if(Utils.isNwjs() && item?.url){
			nw.Shell.openExternal(item.url)
		}
	},

	getUpdateWindowId(){
		return this.ui.mainId + "UpdateWindow"
	},

	openUpdateWindow(item, button){
		const mainOverlay = document.getElementById(this.ui.mainId)

		if(mainOverlay){
			this.closeUpdateWindowNow()

			const updateWindow = this.createUpdateWindow(item)
			mainOverlay.appendChild(updateWindow)
			this.playUpdatePanelOpenAnimation(updateWindow, button)
		}
	},

	closeUpdateWindow(){
		const oldUpdateWindow = document.getElementById(this.getUpdateWindowId())

		if(oldUpdateWindow && oldUpdateWindow.dataset.closing !== "true"){
			const panel = this.getUpdateWindowPanel(oldUpdateWindow)

			if(panel){
				this.playUpdatePanelCloseAnimation(oldUpdateWindow, panel)
			}else{
				this.closeUpdateWindowNow()
			}
		}
	},

	closeUpdateWindowNow(){
		const oldUpdateWindow = document.getElementById(this.getUpdateWindowId())

		this.cancelUpdatePanelAnimation()
		this.state.updateWindow.button = null

		if(oldUpdateWindow){
			oldUpdateWindow.remove()
		}
	},

	getUpdateWindowPanel(updateWindow){
		return updateWindow.querySelector("#" + this.ui.mainId + "UpdatePanel")
	},

	getUpdateWindowClip(updateWindow){
		return updateWindow.querySelector("#" + this.ui.mainId + "UpdateClip")
	},

	cancelUpdatePanelAnimation(){
		if(this.state.updateWindow.animationFrame){
			cancelAnimationFrame(this.state.updateWindow.animationFrame)
			this.state.updateWindow.animationFrame = 0
		}
	},

	playUpdatePanelOpenAnimation(updateWindow, button){
		const panel = this.getUpdateWindowPanel(updateWindow)

		if(panel){
			this.state.updateWindow.button = button

			const finalRect = this.getUpdatePanelElementRect(panel, updateWindow)
			const clip = this.createUpdateClip()
			const sourceCenter = this.getUpdatePanelSourceCenter(button, updateWindow, finalRect)
			const startRect = this.createUpdatePanelSmallRect(button, sourceCenter, finalRect)

			panel.parentElement.replaceChild(clip, panel)
			clip.appendChild(panel)

			this.setUpdatePanelFinalBox(panel, finalRect)
			this.setUpdatePanelMotionStyle(clip, panel, startRect, finalRect, 0)
			this.animateUpdatePanel(clip, panel, startRect, finalRect, finalRect, 0, 1, () => {
				this.finishUpdatePanelOpenAnimation(clip, panel)
			})
		}
	},

	playUpdatePanelCloseAnimation(updateWindow, panel){
		this.cancelUpdatePanelAnimation()
		updateWindow.dataset.closing = "true"

		const clip = this.getUpdateWindowClip(updateWindow) || panel.parentElement
		const finalRect = {
			left: 0,
			top: 0,
			width: panel.offsetWidth,
			height: panel.offsetHeight,
		}
		const startRect = this.getUpdatePanelElementRect(clip, updateWindow)
		const sourceCenter = this.getUpdatePanelSourceCenter(this.state.updateWindow.button, updateWindow, startRect)
		const endRect = this.createUpdatePanelSmallRect(this.state.updateWindow.button, sourceCenter, startRect)

		this.setUpdatePanelFinalBox(panel, finalRect)
		this.setUpdatePanelMotionStyle(clip, panel, startRect, finalRect, 1)
		this.animateUpdatePanel(clip, panel, startRect, endRect, finalRect, 1, 0, () => {
			updateWindow.remove()
			this.state.updateWindow.button = null
		})
	},

	getUpdatePanelElementRect(element, updateWindow){
		const windowRect = updateWindow.getBoundingClientRect()
		const panelRect = element.getBoundingClientRect()

		return {
			left: panelRect.left - windowRect.left,
			top: panelRect.top - windowRect.top,
			width: panelRect.width,
			height: panelRect.height,
		}
	},

	getUpdatePanelSourceCenter(button, updateWindow, fallbackRect){
		if(button && button.isConnected){
			const windowRect = updateWindow.getBoundingClientRect()
			const buttonRect = button.getBoundingClientRect()

			return {
				x: buttonRect.left - windowRect.left + buttonRect.width / 2,
				y: buttonRect.top - windowRect.top + buttonRect.height / 2,
			}
		}else{
			return {
				x: fallbackRect.left + fallbackRect.width / 2,
				y: fallbackRect.top + fallbackRect.height / 2,
			}
		}
	},

	createUpdatePanelSmallRect(button, center, panelRect){
		const ratio = this.getUpdatePanelSmallRatio(button, panelRect)
		const width = panelRect.width * ratio
		const height = panelRect.height * ratio

		return {
			left: center.x - width / 2,
			top: center.y - height / 2,
			width: width,
			height: height,
		}
	},

	getUpdatePanelSmallRatio(button, panelRect){
		let ratio = 0.06

		if(button && button.isConnected){
			const buttonRect = button.getBoundingClientRect()
			ratio = Math.min(buttonRect.width / panelRect.width, buttonRect.height / panelRect.height)
		}

		if(ratio < 0.04){
			ratio = 0.04
		}else if(ratio > 0.18){
			ratio = 0.18
		}

		return ratio
	},

	setUpdatePanelFinalBox(panel, finalRect){
		panel.style.position = "absolute"
		panel.style.width = finalRect.width + "px"
		panel.style.height = finalRect.height + "px"
		panel.style.maxWidth = "none"
		panel.style.maxHeight = "none"
		panel.style.boxSizing = "border-box"
		panel.style.pointerEvents = "none"
	},

	setUpdatePanelMotionStyle(clip, panel, rect, finalRect, opacity){
		clip.style.position = "absolute"
		clip.style.left = rect.left + "px"
		clip.style.top = rect.top + "px"
		clip.style.width = rect.width + "px"
		clip.style.height = rect.height + "px"
		clip.style.overflow = "hidden"
		clip.style.opacity = String(opacity)
		clip.style.pointerEvents = "none"
		clip.style.willChange = "left, top, width, height, opacity"

		panel.style.left = (rect.width - finalRect.width) / 2 + "px"
		panel.style.top = (rect.height - finalRect.height) / 2 + "px"
	},

	animateUpdatePanel(clip, panel, fromRect, toRect, finalRect, fromOpacity, toOpacity, onFinish){
		this.cancelUpdatePanelAnimation()

		const duration = this.ui.slideDurationMs
		const startTime = performance.now()
		const updateFrame = (time) => {
			let timeRate = (time - startTime) / duration

			if(timeRate < 0){
				timeRate = 0
			}else if(timeRate > 1){
				timeRate = 1
			}

			const progress = this.easeUpdatePanelMotion(timeRate)
			const rect = this.createUpdatePanelMotionRect(fromRect, toRect, progress)
			const opacity = fromOpacity + (toOpacity - fromOpacity) * progress

			this.setUpdatePanelMotionStyle(clip, panel, rect, finalRect, opacity)

			if(timeRate < 1){
				this.state.updateWindow.animationFrame = requestAnimationFrame(updateFrame)
			}else{
				this.state.updateWindow.animationFrame = 0
				onFinish()
			}
		}

		this.state.updateWindow.animationFrame = requestAnimationFrame(updateFrame)
	},

	easeUpdatePanelMotion(timeRate){
		return 1 - Math.pow(1 - timeRate, 3)
	},

	createUpdatePanelMotionRect(fromRect, toRect, progress){
		return {
			left: fromRect.left + (toRect.left - fromRect.left) * progress,
			top: fromRect.top + (toRect.top - fromRect.top) * progress,
			width: fromRect.width + (toRect.width - fromRect.width) * progress,
			height: fromRect.height + (toRect.height - fromRect.height) * progress,
		}
	},

	finishUpdatePanelOpenAnimation(clip, panel){
		clip.style.opacity = "1"
		clip.style.pointerEvents = "auto"
		clip.style.willChange = ""
		panel.style.pointerEvents = "auto"
	},

	createUpdateWindow(item){
		const updateContainer = this.createUpdateContainer()
		const panel = this.createUpdatePanel()

		panel.appendChild(this.createUpdateHeader(item))
		panel.appendChild(this.createUpdateBody(item))
		panel.appendChild(this.createUpdateFooter(item))

		updateContainer.appendChild(panel)

		return updateContainer
	},

	createUpdateClip(){
		const element = document.createElement("div")
		element.id = this.ui.mainId + "UpdateClip"
		element.className = "eliVersionManagerUpdateClip"

		return element
	},

	createUpdateContainer(){
		const element = document.createElement("div")
		element.id = this.getUpdateWindowId()
		element.className = "eliVersionManagerUpdateWindow"
		this.setUpdateContainerStyle(element)

		return element
	},

	setUpdateContainerStyle(element){
		const theme = this.getTheme()
		const style = this.getStyle()

		element.style.position = "absolute"
		element.style.left = "0"
		element.style.top = "0"
		element.style.width = "100%"
		element.style.height = "100%"
		element.style.padding = style.paddingPanel
		element.style.boxSizing = "border-box"
		element.style.display = "flex"
		element.style.alignItems = "center"
		element.style.justifyContent = "center"
		element.style.background = theme.colorUpdateWindowBackdrop
		element.style.pointerEvents = "auto"
		element.style.zIndex = "1"

		element.addEventListener("wheel", (event) => {
			event.stopPropagation()
		}, {capture: true, passive: true})
	},

	createUpdatePanel(){
		const element = document.createElement("div")
		element.id = this.ui.mainId + "UpdatePanel"
		element.className = "eliVersionManagerUpdatePanel"
		this.setUpdatePanelStyle(element)

		return element
	},

	setUpdatePanelStyle(element){
		const theme = this.getTheme()
		const style = this.getStyle()

		element.style.width = "760px"
		element.style.height = "calc(100% - 48px)"
		element.style.maxWidth = "100%"
		element.style.maxHeight = "720px"
		element.style.boxSizing = "border-box"
		element.style.display = "flex"
		element.style.flexDirection = "column"
		element.style.overflow = "hidden"

		element.style.background = theme.colorUpdatePanelBackground
		element.style.border = `4px solid ${theme.colorPanelBorder}`
		element.style.boxShadow = theme.shadowPanel
		element.style.padding = style.paddingPanel
		element.style.fontFamily = style.fontFamily
		element.style.color = theme.colorText
	},

	createUpdateHeader(item){
		const mainHeader = this.createUpdateMainHeader()
		const textContainer = this.createUpdateHeaderTextContainer()
		const logLabel = this.createUpdateLogLabel(item)
		const pluginInfo = this.createUpdateHeaderPluginInfo(item)
		const closeButton = this.createCloseButton()
		closeButton.id = this.ui.mainId + "UpdateCloseButton"

		const onClose = (event) => {
			if(event.button !== 0) return

			event.preventDefault()
			event.stopPropagation()
			this.closeUpdateWindow()
		}

		closeButton.addEventListener("click", onClose, true)

		textContainer.appendChild(logLabel)
		textContainer.appendChild(pluginInfo)

		mainHeader.appendChild(textContainer)
		mainHeader.appendChild(closeButton)

		return mainHeader
	},

	isReleaseDetails(item){
		return item.detailType === "release"
	},

	createUpdateHeaderPluginInfo(item){
		const info = document.createElement("div")
		const pluginName = this.createUpdatePluginName(item)

		info.id = this.ui.mainId + "UpdatePluginInfo"
		info.className = "eliVersionManagerUpdatePluginInfo"
		this.setUpdateHeaderPluginInfoStyle(info)
		info.appendChild(pluginName)

		if(this.isReleaseDetails(item)){
			info.appendChild(this.createUpdateItemVersionGroup("Version", item.version, "DetailLatest", item.name))
			info.appendChild(this.createItemSeparator())
			info.appendChild(this.createNewReleaseDateLabel())
			info.appendChild(this.createNewReleaseDateValue(item))
		}else{
			info.appendChild(this.createUpdateItemVersionGroup("Current", item.current, "DetailCurrent", item.name))
			info.appendChild(this.createUpdateDetailVersionArrow())
			info.appendChild(this.createUpdateItemVersionGroup("Latest", item.latest, "DetailLatest", item.name))
		}

		return info
	},

	setUpdateHeaderPluginInfoStyle(element){
		const style = this.getStyle()

		element.style.display = "flex"
		element.style.alignItems = "center"
		element.style.flexWrap = "wrap"
		element.style.gap = style.gapSmall
		element.style.minWidth = "0"
	},

	createUpdateDetailVersionArrow(){
		const arrow = document.createElement("span")
		arrow.id = this.ui.mainId + "UpdateVersionArrow"
		arrow.className = "eliVersionManagerUpdateVersionArrow"
		arrow.textContent = "→"
		this.setUpdateItemVersionArrowStyle(arrow)

		return arrow
	},

	createUpdateMainHeader(){
		const header = document.createElement("div")
		header.id = this.ui.mainId + "UpdateHeader"
		header.className = "eliVersionManagerUpdateHeader"
		this.setUpdateMainHeaderStyle(header)

		return header
	},

	setUpdateMainHeaderStyle(element){
		element.style.display = "flex"
		element.style.alignItems = "center"
		element.style.justifyContent = "space-between"
		element.style.gap = "12px"
		element.style.marginBottom = "12px"
	},

	createUpdateHeaderTextContainer(){
		const info = document.createElement("div")
		info.id = this.ui.mainId + "UpdateHeaderInfo"
		info.className = "eliVersionManagerUpdateHeaderInfo"
		this.setUpdateTextContainerStyle(info)

		return info
	},

	setUpdateTextContainerStyle(element){
		const style = this.getStyle()

		element.style.display = "flex"
		element.style.flexDirection = "column"
		element.style.alignItems = "flex-start"
		element.style.gap = style.gapSmall
		element.style.minWidth = "0"
	},

	createUpdatePluginName(item){
		const element = document.createElement("span")
		element.id = this.ui.mainId + "UpdatePluginName"
		element.className = "eliVersionManagerUpdatePluginName"
		element.textContent = item.name
		this.setUpdatePluginNameStyle(element)

		return element
	},

	setUpdatePluginNameStyle(element){
		const theme = this.getTheme()
		const style = this.getStyle()

		element.style.fontWeight = "bold"
		element.style.fontSize = style.fontSizeLarge
		element.style.color = theme.colorText
		element.style.overflowWrap = "anywhere"
	},

	createUpdatePluginVersion(item){
		const element = document.createElement("span")
		element.id = this.ui.mainId + "UpdatePluginVersion"
		element.className = "eliVersionManagerUpdatePluginVersion"
		element.textContent = `Latest: ${item.latest}`
		this.setUpdateVersionStyle(element)

		return element
	},

	setUpdateVersionStyle(element){
		const theme = this.getTheme()
		const style = this.getStyle()

		element.style.fontWeight = "bold"
		element.style.fontSize = style.fontSizeLarge
		element.style.color = theme.colorSuccess
	},

	createUpdateLogLabel(item){
		const element = document.createElement("span")
		element.id = this.ui.mainId + "UpdateLogLabel"
		element.className = "eliVersionManagerUpdateLogLabel"
		element.textContent = this.isReleaseDetails(item) ? "Release Details" : "Update Log"
		this.setUpdateLogLabelStyle(element)

		return element
	},

	setUpdateLogLabelStyle(element){
		const theme = this.getTheme()
		const style = this.getStyle()

		element.style.fontWeight = "bold"
		element.style.fontSize = style.fontSizeLarge
		element.style.color = theme.colorTitle
	},

	createUpdateBody(item){
		const infoBody = this.createUpdateInfoBody()
		const logText = this.createUpdateLogTextContainer(item)

		infoBody.appendChild(logText)

		return infoBody
	},

	createUpdateInfoBody(){
		const element = document.createElement("div")
		element.id = this.ui.mainId + "UpdateBody"
		element.className = "eliVersionManagerUpdateBody"
		this.setUpdateInfoBodyStyle(element)

		return element
	},

	setUpdateInfoBodyStyle(element){
		const theme = this.getTheme()
		const style = this.getStyle()

		element.style.flex = "1"
		element.style.minHeight = "0"
		element.style.overflowY = "auto"
		element.style.scrollbarGutter = "stable"
		element.style.padding = style.paddingCard
		element.style.border = `1px solid ${theme.colorBodyBorder}`
		element.style.background = theme.colorBodyBackground
	},

	createUpdateLogTextContainer(item){
		const element = document.createElement("div")
		element.id = this.ui.mainId + "UpdateLogText"
		element.className = "eliVersionManagerUpdateLogText"
		this.setLogContent(element, item.log)
		this.setUpdateLogTextContainerStyle(element)

		return element
	},

	setUpdateLogTextContainerStyle(element){
		const theme = this.getTheme()
		const style = this.getStyle()

		element.style.whiteSpace = "normal"
		element.style.fontFamily = "Consolas, \"Courier New\", monospace"
		element.style.fontSize = style.fontSizeMedium
		element.style.lineHeight = "1.6"
		element.style.color = theme.colorText
	},

	createUpdateFooter(item){
		const footer = this.createUpdateFooterContainer()
		const button = this.createUpdateDownloadButton(item)

		button.addEventListener("click", () => {
			this.openItemUrl(item)
		})

		footer.appendChild(button)

		return footer
	},

	createUpdateFooterContainer(){
		const element = document.createElement("div")
		element.id = this.ui.mainId + "UpdateFooter"
		element.className = "eliVersionManagerUpdateFooter"
		this.setUpdateFooterContainerStyle(element)

		return element
	},

	setUpdateFooterContainerStyle(element){
		element.style.display = "flex"
		element.style.justifyContent = "center"
		element.style.marginTop = "12px"
	},

	createUpdateDownloadButton(item){
		const button = document.createElement("button")
		button.id = this.ui.mainId + "UpdateDownloadButton"
		button.className = "eliVersionManagerUpdateDownloadButton"
		button.textContent = "Download"
		button.disabled = !item.url
		this.setUpdateDownloadButtonStyle(button, item.url)

		return button
	},

	setUpdateDownloadButtonStyle(element, enabled){
		this.setButtonBaseStyle(element, enabled, {
			large: true,
			bold: true,
			marginLeft: "0"
		})
	},

	createOverlayFooter(){
		const footer = document.createElement("div")
		footer.id = this.ui.mainId + "OverlayFooter"
		footer.className = "eliVersionManagerOverlayFooter"
		this.setOverlayFooterStyle(footer)
		const updateWarn = "If you are sure it is updated, refresh the plugin entry on the Plugin Manager window(Right-click on entry → refresh)."
		const canDisable = "You can disable plugin updates and new releases on the EliMZ_Book plugin parameters."
		footer.textContent = updateWarn + "\n" + canDisable

		return footer
	},

	setOverlayFooterStyle(element){
		const theme = this.getTheme()
		const style = this.getStyle()

		element.style.marginTop = "10px"
		element.style.fontSize = style.fontSizeTiny
		element.style.opacity = "0.9"
		element.style.whiteSpace = "pre-line"
		element.style.color = theme.colorText
	},

	register(pluginName, versionString){
		const version = this.parseVersionToArray(versionString)

		if(version){
			this.registry[pluginName] = version
		}
	},
}

Eli.ErrorPrinter = {

	interpreter: null,
	errorEvent: null,
	windowErrorEvent: null,
	commandNames: {
		101: "Show Text", 102: "Show Choices", 103: "Input Number", 104: "Select Item", 105: "Show Scrolling Text", 108: "Comment", 109: "Skip", 111: "Conditional Branch",
		112: "Loop", 113: "Break Loop", 115: "Exit Event Processing", 117: "Common Event", 118: "Label", 119: "Jump to Label", 121: "Control Switches",
		122: "Control Variables", 123: "Control Self Switch", 124: "Control Timer", 125: "Change Gold", 126: "Change Items",
		127: "Change Weapons", 128: "Change Armors", 129: "Change Party Member", 132: "Change Battle BGM", 133: "Change Victory ME", 134: "Change Save Access", 135: "Change Menu Access",
		136: "Change Encounter", 137: "Change Formation Access", 138: "Change Window Color", 139: "Change Defeat ME", 140: "Change Vehicle BGM",
		201: "Transfer Player", 202: "Set Vehicle Location", 203: "Set Event Location", 204: "Scroll Map", 205: "Set Movement Route", 206: "Get on/off Vehicle", 211: "Change Transparency", 212: "Show Animation",
		213: "Show Balloon Icon", 214: "Erase Event", 216: "Change Player Followers", 217: "Gather Followers", 221: "Fadeout Screen", 222: "Fadein Screen",
		223: "Tint Screen", 224: "Flash Screen", 225: "Shake Screen", 230: "Wait", 231: "Show Picture", 232: "Move Picture", 233: "Rotate Picture", 234: "Tint Picture", 235: "Erase Picture",
		236: "Set Weather Effect", 241: "Play BGM", 242: "Fadeout BGM", 243: "Save BGM", 244: "Resume BGM", 245: "Play BGS", 246: "Fadeout BGS",
		249: "Play ME", 250: "Play SE", 251: "Stop SE", 261: "Play Movie", 281: "Change Map Name Display", 282: "Change Tileset", 283: "Change Battle Background",
		284: "Change Parallax", 285: "Get Location Info", 301: "Battle Processing", 302: "Shop Processing", 303: "Name Input Processing", 311: "Change HP", 312: "Change MP",
		313: "Change State", 314: "Recover All", 315: "Change EXP", 316: "Change Level", 317: "Change Parameter", 318: "Change Skill", 319: "Change Equipment",
		320: "Change Name", 321: "Change Class", 322: "Change Actor Images", 323: "Change Vehicle Image", 324: "Change Nickname", 325: "Change Profile", 326: "Change TP",
		331: "Change Enemy HP", 332: "Change Enemy MP", 333: "Change Enemy State", 334: "Enemy Recover All", 335: "Enemy Appear", 336: "Enemy Transform",
		337: "Show Battle Animation", 339: "Force Action", 340: "Abort Battle", 342: "Change Enemy TP", 351: "Open Menu Screen", 352: "Open Save Screen", 353: "Game Over", 354: "Return to Title Screen",
		355: "Script", 356: "Plugin Command MV (deprecated)", 357: "Plugin Command", 402: "When [**]", 403: "When Cancel", 411: "Else", 413: "Repeat Above", 601: "If Win", 602: "If Escape", 603: "If Lose"
	},

	getCommandName(code){
		return this.commandNames[code] || "Unknown Command"
	},

	addCustomStyle(){
		const currentStyle = document.getElementById("eliErrorPrinterStyle")

		if(!currentStyle){
			const style = document.createElement("style")
			style.id = "eliErrorPrinterStyle"
			style.textContent = `html,
body{
	background: #1E1E2C !important;
}
#errorPrinter{
	display: none;
	visibility: hidden;
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	box-sizing: border-box;
	width: auto !important;
	height: auto !important;
	max-width: none !important;
	max-height: none !important;
	margin: 0;
	padding: 24px 4vw;
	transform: none;
	overflow: auto;
	text-align: center;
	text-shadow: 1px 1px 3px #000000;
	font-size: 20px;
	color: #FFFFFF;
	background: #161621;
	z-index: 999999;
}
#errorPrinter.eliErrorPrinterRoot.isActive{
	display: block;
}`
			document.head.appendChild(style)
		}

		document.documentElement.style.background = "#1E1E2C"
		document.body.style.background = "#1E1E2C"
		this.customPrinterErrorStyle = true
	},

	applyBorderStyle(element){
		element.style.border = "1px solid #1B8AA1"
	},

	setRootPrinterAttributes(element){
		element.className = "eliErrorPrinterRoot"
		element.setAttribute("name", "eliErrorPrinterRoot")
		this.hideRootPrinter(element)
	},

	showRootPrinter(element){
		if(element){
			element.style.display = "block"
			element.style.visibility = "visible"
			element.classList.add("isActive")
			element.setAttribute("aria-hidden", "false")
		}
	},

	hideRootPrinter(element){
		if(element){
			element.style.display = "none"
			element.style.visibility = "hidden"
			element.classList.remove("isActive")
			element.setAttribute("aria-hidden", "true")
		}
	},

	makeErrorHtml(name, message, error) {
		const wrap = document.createElement("div")
		wrap.id = "eliErrorPrinterContent"
		wrap.className = "eliErrorPrinterContent"
		wrap.setAttribute("name", "eliErrorPrinterContent")
		const title = this.createTitle(name, message, error)
		const msg = this.createMessage(name, message, error)
		const help = this.createHelp(name, message, error)
		const ctx = this.createEventContext(name, message, error)
		const ctxTitle = this.createContextTitle(name, message, error)
		const ctxBody = this.createContextBody(name, message, error)
		const stackTitle = this.createStackTitle(name, message, error)
		const stack = this.createStack(name, message, error)

		wrap.appendChild(help)

		ctx.appendChild(ctxTitle)
		ctx.appendChild(ctxBody)

		wrap.appendChild(title)
		wrap.appendChild(msg)

		wrap.appendChild(ctx)
		wrap.appendChild(stackTitle)
		wrap.appendChild(stack)

		return wrap.outerHTML
	},

	createTitle(name, message, error){
		const title = document.createElement("div")
		title.id = "eliErrorPrinterErrorName"
		title.className = "eliErrorPrinterErrorName"
		title.setAttribute("name", "eliErrorPrinterErrorName")
		title.textContent = this.createTitleText(name || "")
		this.setTitleStyle(title)

		return title
	},

	createTitleText(text){
		return String(text || "")
			.replace(/([a-z])([A-Z])/g, "$1 $2")
			.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
			.replace(/[_.-]+/g, " ")
			.replace(/\s+/g, " ")
			.trim()
			.split(" ")
			.map(word => word ? word.charAt(0).toUpperCase() + word.slice(1) : "")
			.join(" ")
	},

	setTitleStyle(element){
		element.style.fontWeight = "bold"
		element.style.fontSize = "20px"
		element.style.marginBottom = "8px"
		element.style.marginTop = "8px"
		element.style.color = "#FFED00"
	},

	createMessage(name, message, error){
		const msg = document.createElement("div")
		msg.id = "eliErrorPrinterErrorMessage"
		msg.className = "eliErrorPrinterErrorMessage"
		msg.setAttribute("name", "eliErrorPrinterErrorMessage")
		msg.textContent = message || ""
		this.setMessageStyle(msg)

		return msg
	},

	setMessageStyle(element){
		element.style.marginBottom = "10px"
	},

	createHelp(name, message, error){
		const help = document.createElement("div")
		help.id = "eliErrorPrinterHelp"
		help.className = "eliErrorPrinterHelp"
		help.setAttribute("name", "eliErrorPrinterHelp")
		let text = "If you don't know how to fix this, take a screenshot and send it to the developer."

		if(message.includes("JSON")){
			text += "\n" + "(Probably an error on a plugin command or plugin parameter)"
		}else if(name === "Failed to load"){
			text += "\n" + "(Check if the filename exists on the folder and if the capitalisation is the same. Avoid using spaces or special characters, unless RPG Maker tell you to do so)"
		}

		text += "\n"
		text += "(You can disable this updated error log on EliMZ_Book plugin parameters)"
		help.textContent = text
		this.setHelpStyle(help)

		return help
	},

	setHelpStyle(element){
		element.style.padding = "8px"
		this.applyBorderStyle(element)
		element.style.background = "rgba(255,255,255,0.06)"
		element.style.whiteSpace = "pre-line"
	},

	createEventContext(name, message, error){
		const ctx = document.createElement("div")
		ctx.id = "eliErrorPrinterEventContext"
		ctx.className = "eliErrorPrinterEventContext"
		ctx.setAttribute("name", "eliErrorPrinterEventContext")
		this.setCtxStyle(ctx)

		return ctx
	},

	setCtxStyle(element){
		element.style.marginTop = "10px"
		element.style.padding = "8px"
		this.applyBorderStyle(element)
		element.style.background = "rgba(0,0,0,0.25)"
	},

	createContextTitle(name, message, error){
		const ctxTitle = document.createElement("div")
		ctxTitle.id = "eliErrorPrinterEventContextTitle"
		ctxTitle.className = "eliErrorPrinterEventContextTitle"
		ctxTitle.setAttribute("name", "eliErrorPrinterEventContextTitle")
		ctxTitle.textContent = this.createTitleText("Current Or Last Event Running")
		this.setCtxTitleStyle(ctxTitle)

		return ctxTitle
	},

	setCtxTitleStyle(element){
		element.style.fontWeight = "bold"
		element.style.marginBottom = "6px"
		element.style.color = "#FFED00"
	},

	createContextBody(name, message, error){
		const ctxBody = document.createElement("pre")
		ctxBody.id = "eliErrorPrinterEventContextBody"
		ctxBody.className = "eliErrorPrinterEventContextBody"
		ctxBody.setAttribute("name", "eliErrorPrinterEventContextBody")
		this.setCtxBodyStyle(ctxBody)
		this.setCtxBodyTextContent(ctxBody)
		return ctxBody
	},

	setCtxBodyStyle(element){
		element.style.margin = "0"
		element.style.whiteSpace = "pre-wrap"
		element.style.wordBreak = "break-word"
	},

	setCtxBodyTextContent(ctxBody){
		const interpreter = this.interpreter

		if(interpreter){
			const commandName = this.getCommandName(interpreter.code)
			let text = ""
			let firstLine = ""

			if(interpreter._commonEventId > 0){
				firstLine += `Map ID: ${interpreter.mapId} | Common Event ID: ${interpreter._commonEventId}` + "\n"
			}else{
				const event = $gameMap.event(interpreter.eventId)
				firstLine += `Map ID: ${interpreter.mapId} | Event ID: ${interpreter.eventId}`

				if(event){
					firstLine += ` | Page: ${event._pageIndex + 1}`
				}

				firstLine += "\n"
			}

			text += firstLine

			if(interpreter.code === 357){
				const [pluginName, functionName, pluginCmdName, list] = interpreter.parameters
				text += `Command: ${commandName} | Index: ${interpreter.index}` + "\n"
				text += `${pluginName} - ${pluginCmdName}`

			}else{
				text += `Command: ${commandName} | Index:${interpreter.index}`
			}

			text += "\n"

			if(interpreter.scriptLine){
				text += `Script: ${interpreter.scriptLine}` + "\n"
			}
			ctxBody.textContent = text
		}else{
			ctxBody.textContent = "No interpreter context available."
		}
	},

	createStackTitle(name, message, error){
		const stackTitle = document.createElement("div")
		stackTitle.id = "eliErrorPrinterStackTraceTitle"
		stackTitle.className = "eliErrorPrinterStackTraceTitle"
		stackTitle.setAttribute("name", "eliErrorPrinterStackTraceTitle")
		stackTitle.textContent = this.createTitleText("Stack Trace")
		this.setStackTitleStyle(stackTitle)

		return stackTitle
	},

	setStackTitleStyle(element){
		element.style.fontWeight = "bold"
		element.style.margin = "12px 0 6px 0"
		element.style.color = "#FFED00"
	},

	createStack(name, message, error){
		const stack = document.createElement("div")
		stack.id = "eliErrorPrinterStackTraceBody"
		stack.className = "eliErrorPrinterStackTraceBody"
		stack.setAttribute("name", "eliErrorPrinterStackTraceBody")
		const stackText = this.getConsoleStackText(name, message, error)
		const fileData = this.getErrorFileData(error) || this.getErrorFileData(this.windowErrorEvent)
		this.setStackStyle(stack)
		this.drawStackText(stack, stackText, fileData)

		return stack
	},

	drawStackText(stack, text, errorFileData){
		const lines = String(text || "").split("\n")
		const lineDataList = lines.map(line => this.getStackLineData(line))
		const hasFileData = lineDataList.some(lineData => lineData.filename)

		if(!hasFileData && errorFileData){
			lineDataList[0].filename = errorFileData.filename
			lineDataList[0].lineNumber = errorFileData.lineNumber
			lineDataList[0].columnNumber = errorFileData.columnNumber
		}

		for(const lineData of lineDataList){
			const textColumn = document.createElement("div")
			const fileColumn = document.createElement("div")
			textColumn.className = "eliErrorPrinterStackTraceText"
			fileColumn.className = "eliErrorPrinterStackTraceFile"
			this.setStackTextStyle(textColumn)
			this.setStackFileStyle(fileColumn)
			this.drawStackLine(textColumn, lineData.text)
			this.drawStackFile(fileColumn, lineData)
			stack.appendChild(textColumn)
			stack.appendChild(fileColumn)
		}
	},

	getStackLineData(line){
		const parenthesisRegex = /\(([^()\/]+?\.(?:js|html)):(\d+)(?::(\d+))?\)$/i
		const plainRegex = /([^\s()\/]+?\.(?:js|html)):(\d+)(?::(\d+))?$/i
		const match = parenthesisRegex.exec(line) || plainRegex.exec(line)

		if(match){
			return {
				text: line.slice(0, match.index).trimEnd(),
				filename: match[1],
				lineNumber: match[2],
				columnNumber: match[3] || ""
			}
		}else{
			return {
				text: line,
				filename: "",
				lineNumber: "",
				columnNumber: ""
			}
		}
	},

	drawStackLine(stack, line){
		stack.textContent = line
	},

	drawStackFile(stack, data){
		if(data.filename){
			stack.appendChild(document.createTextNode(data.filename))

			if(data.lineNumber){
				stack.appendChild(document.createTextNode(":"))
				stack.appendChild(this.createStackLineNumber(data.lineNumber))
			}

			if(data.columnNumber){
				stack.appendChild(document.createTextNode(`:${data.columnNumber}`))
			}
		}
	},

	createStackLineNumber(text){
		const lineNumber = document.createElement("span")
		lineNumber.className = "eliErrorPrinterStackTraceLineNumber"
		lineNumber.setAttribute("name", "eliErrorPrinterStackTraceLineNumber")
		lineNumber.style.color = "#BE1522"
		lineNumber.textContent = text

		return lineNumber
	},

	getErrorFileData(error){
		if(error && error.filename){
			return {
				filename: String(error.filename).split(/[\\/]/).pop(),
				lineNumber: error.lineno ? String(error.lineno) : "",
				columnNumber: error.colno ? String(error.colno) : ""
			}
		}else{
			return null
		}
	},

	getConsoleStackText(name, message, error){
		if(error && error.stack){
			const lines = String(error.stack).split("\n")
			const text = []

			text.push(this.getConsoleStackTitle(name, message, lines[0]))

			for(let i = 1; i < lines.length; i++){
				text.push(this.getConsoleStackLine(lines[i]))
			}

			return text.join("\n")
		}else{
			return this.getConsoleStackTitle(name, message, "")
		}
	},

	getConsoleStackTitle(name, message, firstLine){
		const line = firstLine || `${name}: ${message}`
		const formattedName = this.createTitleText(name || "")
		const formattedLine = line.replace(name || "", formattedName)

		if(formattedLine.startsWith("Uncaught ")){
			return formattedLine
		}else{
			return "Uncaught " + formattedLine
		}
	},

	getConsoleStackLine(line){
		return line
			.replace(/\((?:[\w-]+:\/\/[^)]*\/)?([^\/()]+(?:\.js|\.html)):(\d+):(\d+)\)/g, "($1:$2:$3)")
			.replace(/(?:[\w-]+:\/\/[^\s)]*\/)?([^\/\s)]+(?:\.js|\.html)):(\d+):(\d+)/g, "$1:$2:$3")
			.replace(/\bchrome-([^\/\s)]+(?:\.js|\.html):\d+(?::\d+)?)\b/g, "$1")
	},

	setStackStyle(element){
		element.style.display = "grid"
		element.style.gridTemplateColumns = "minmax(0, 1fr) minmax(180px, 35%)"
		element.style.columnGap = "20px"
		element.style.rowGap = "4px"
		element.style.textAlign = "initial"
		element.style.margin = "0"
		element.style.padding = "8px"
		this.applyBorderStyle(element)
		element.style.background = "rgba(0,0,0,0.25)"
		element.style.fontSize = "16px"
	},

	setStackTextStyle(element){
		element.style.minWidth = "0"
		element.style.whiteSpace = "pre-wrap"
		element.style.wordBreak = "break-word"
	},

	setStackFileStyle(element){
		element.style.minWidth = "0"
		element.style.whiteSpace = "pre-wrap"
		element.style.wordBreak = "break-word"
		element.style.textAlign = "right"
	},

	setInterpreter(interpreter, command){
		const info = {
			mapId: interpreter._mapId,
			eventId: interpreter._eventId,
			index: interpreter._index,
			code: command?.code ?? 0,
			indent: command?.indent ?? 0,
			parameters: command?.parameters ?? null
		}

		if(command?.code === 355 || command?.code === 655){
			const p0 = command.parameters ? command.parameters[0] : ""
			info.scriptLine = p0
		}

		this.interpreter = info
	},

	clearInterpreter(){
		this.interpreter = null
	}
}

Eli.Game_PassiveInterpreter = class Game_PassiveInterpreter extends Game_Interpreter{

		setup(list, eventId) {
			this.clear()
			this._mapId = $gameMap.mapId()
			this._eventId = eventId || 0
			this._list = list
		}

		updateWait() {return false}
		command101(){return false}
		command102(){ return false }
		command103(){ return false }
		command104(){ return false }
		command105(){ return false }
		command124(){ return false }
		command136(){ return true }
		command201(){ return true }
		command202(){ return true }
		command203(){ return true }
		command204(){ return true }
		command205(){ return true }
		command206() { return true }
		command211(){ return true }
		command212() { return true }
		command213() { return true }
		command214() { return true }
		command216(){ return true }
		command217(){ return true }
		command221() { return true }
		command222() { return true }
		command223() { return true }
		command224() { return true }
		command225() { return true }
		command230() { return true }
		command231(){ return true }
		command232(){ return true }
		command233(){ return true }
		command234(){ return true }
		command235(){ return true }
		command236(){ return true }
		command241(){ return true }
		command242(){ return true }
		command243(){ return true }
		command244(){ return true }
		command245(){ return true }
		command246(){ return true }
		command249(){ return true }
		command250(){ return true }
		command251(){ return true }
		command261(){ return true }
		command281(){ return true }
		command282(){ return true }
		command284(){ return true }
		command301(params) { return true }
		command302(params) { return true }
		command303(params) { return true }
		command322(params) { return true }
		command323(params) { return true }
		command337(params) { return true }
		command339(params) { return true }
		command340() { return true }
		command351() { return true }
		command352() { return true }
		command353() { return true }
		command354() { return true }
}

Eli.Game_PassivePluginCommandInterpreter = class Game_PassivePluginCommandInterpreter extends Eli.Game_PassiveInterpreter{

	executeCommand(){
		const command = this.currentCommand()
		let canContinue = true

		if(command){
			this._indent = command.indent
			const methodName = "command" + command.code

			if(typeof this[methodName] === "function"){
				canContinue = this[methodName](command.parameters)
			}

			if(canContinue){
				this._index++
			}
		}else{
			this.terminate()
		}

		return canContinue
	}

	command357(params){
		this.setPluginCommandInterpreter()
		PluginManager.callCommand(this, Utils.extractFileName(params[0]), params[1], params[3])

		return true
	}
}

/* -------------------------------- ELI BOOK -------------------------------- */
Eli.Book = {

	Parameters: class Parameters{
		constructor(parameters){
			this.checkVersion = parameters.checkVersion === "true"
			this.showNewReleases = parameters.showNewReleases === "true"
			this.updateErrorPrinter = parameters.updateErrorPrinter === "true"
			this.iterateEventList = parameters.iterateEventList === "true"
			this.engine = this.parseEngine(JSON.parse(parameters.engine))
			this.playtest = this.parsePlaytest(JSON.parse(parameters.playtest))
		}

		parseEngine(param){
			return {
				disableEffekseer: param.disableEffekseer === "true",
				styleOverflow: param.styleOverflow === "true",
				fixBitmapStartLoad: param.fixBitmapStartLoad === "true",
				colorCache: param.colorCache === "true",
				windowLayerOptimization: param.windowLayerOptimization || "Disabled"
			}
		}

		parsePlaytest(param){
			return {
				openDevTools: param.openDevTools === "true",
				gameFocus: param.gameFocus === "true",
				enableGameWindowPosition: param.enableGameWindowPosition === "true",
				gameWindowPosition:{
					alignX: param.alignX,
					alignY: param.alignY,
					offsetX: Number(param.offsetX),
					offsetY: Number(param.offsetY),
				},
				quickRestart: param.quickRestart === "true",
				startFps: param.startFps === "true",
			}
		}
	},

	initialize(){
		Eli.VersionManager.register("EliMZ_Book", "6.3.0")
		this.initParameters()
		this.setDocumentStyle()
		window.addEventListener("load", this.onWindowLoad.bind(this))
	},

	initParameters(){
		const parameters = PluginManager.parameters("EliMZ_Book")
		this.parameters = new this.Parameters(parameters)
	},

	setDocumentStyle(){
		if(this.getEngineParam().styleOverflow){
			document.body.style.overflow = "hidden"
		}
	},

	getParam(){
		return this.parameters
	},

	isVersionManagerEnabled(){
		const param = this.getParam()
		return param.checkVersion || param.showNewReleases
	},

	getEngineParam(){
		return this.getParam().engine
	},

	getPlaytestParam(){
		return this.getParam().playtest
	},

	onWindowLoad(){
		if(Utils.isNwjs() && Utils.isOptionValid("test")){

			if(this.getPlaytestParam().openDevTools){
				this.openDevTools()
			}

			if(this.getPlaytestParam().enableGameWindowPosition){
				this.changeGameWindowPosition()
			}
		}
	},

	openDevTools(){
		const ms = 1500
		nw.Window.get().showDevTools()
		setTimeout(() => {
			nw.Window.get().focus()
		}, ms)
	},

	changeGameWindowPosition(){
		const screen = window.screen
		const nwWin = nw.Window.get()
		const screenWidth = screen.availWidth ?? screen.width
		const screenHeight = screen.availHeight ?? screen.height
		const gameWidth = nwWin.width
		const gameHeight = nwWin.height
		const paramPosition = this.getPlaytestParam().gameWindowPosition
		const args = [paramPosition, gameWidth, gameHeight, screenWidth, screenHeight]
		const {x, y} =  Eli.Utils.calculatePosition(...args)

		nwWin.moveTo(Math.round(x), Math.round(y))   
	},

}

Eli.Book.initialize()

/* ------------------------ WINDOW LAYER OPTIMIZATION ----------------------- */
Eli.WindowLayerOptimization = {

	native: {
		windowDrawShape: Window.prototype.drawShape,
		containerRender: PIXI.Container.prototype.render,
	},

	level: "",
	renderMethod: null,

	initialize(){
		this.level = Eli.Book.getEngineParam().windowLayerOptimization
		this.renderMethod = {
			"Level 1": this.renderLevel1,
			"Level 2": this.renderLevel2,
			"Level 3": this.renderLevel3,
		}[this.level] || null
	},

	isEnabled(){
		return !!this.renderMethod
	},

	usesShapeCache(){
		return this.level === "Level 2" || this.level === "Level 3"
	},

	usesBounds(){
		return this.level === "Level 3"
	},

	isWindow(win){
		return win._isWindow && win.visible && win.openness > 0
	},

	createLayerData(layer){
		layer.eliOptimization = {
			graphics: new PIXI.Graphics(),
			children: []
		}

		if(this.usesBounds()){
			layer.eliOptimization.bounds = new PIXI.Rectangle()
		}
	},

	destroyLayerData(layer){
		if(this.usesShapeCache()){
			for(const child of layer.children){
				if(child._isWindow){
					this.destroyShape(child)
				}
			}
		}

		layer.eliOptimization.graphics.destroy()
		layer.eliOptimization.children.length = 0
		layer.eliOptimization = null
	},

	drawShapeLevel1(layer, win){
		const graphics = layer.eliOptimization.graphics

		graphics.clear()
		win.drawShape(graphics)

		return graphics
	},

	destroyShape(win){
		const shape = win.eliWindowLayerShape

		if(shape){
			shape.graphics.destroy()
			win.eliWindowLayerShape = null
		}
	},

	getShape(win){
		if(!win.eliWindowLayerShape){
			win.eliWindowLayerShape = {
				graphics: new PIXI.Graphics()
			}
		}

		return win.eliWindowLayerShape
	},

	refreshShape(win, shape){
		const x = win.x
		const y = win.y
		const width = win.width
		const height = win.height
		const openness = win.openness

		if(shape.x !== x || shape.y !== y || shape.width !== width || shape.height !== height || shape.openness !== openness){
			shape.x = x
			shape.y = y
			shape.width = width
			shape.height = height
			shape.openness = openness
			shape.graphics.clear()
			this.native.windowDrawShape.call(win, shape.graphics)
		}
	},

	drawShapeLevel2(layer, win){
		if(win.drawShape === this.native.windowDrawShape){
			const shape = this.getShape(win)

			this.refreshShape(win, shape)
			shape.graphics.transform = layer.transform

			return shape.graphics
		}else{
			this.destroyShape(win)
			return this.drawShapeLevel1(layer, win)
		}
	},

	hasFilterPadding(displayObject){
		const filters = displayObject.filters

		if(filters){
			for(let i = 0; i < filters.length; i++){
				const filter = filters[i]

				if(filter.enabled && filter.padding > 0){
					return true
				}
			}
		}

		const children = displayObject.children

		if(children){
			for(let i = 0; i < children.length; i++){
				if(this.hasFilterPadding(children[i])){
					return true
				}
			}
		}

		return false
	},

	isVisualInsideShape(layer, win){
		const worldTransform = layer.worldTransform

		if(worldTransform.a !== 1 || worldTransform.b !== 0 || worldTransform.c !== 0 || worldTransform.d !== 1){
			return false
		}

		if(this.hasFilterPadding(win)){
			return false
		}

		const bounds = win.getBounds(true, layer.eliOptimization.bounds)
		const height = win.height * win.openness / 255
		const left = worldTransform.tx + win.x
		const top = worldTransform.ty + win.y + (win.height - height) / 2
		const right = left + win.width
		const bottom = top + height

		return bounds.x >= left &&
			bounds.y >= top &&
			bounds.x + bounds.width <= right &&
			bounds.y + bounds.height <= bottom
	},

	canUseRectangle(layer, win){
		return win.drawShape === this.native.windowDrawShape &&
			win.render === this.native.containerRender &&
			win.rotation === 0 &&
			win.skew.x === 0 &&
			win.skew.y === 0 &&
			win.scale.x === 1 &&
			win.scale.y === 1 &&
			win.pivot.x === 0 &&
			win.pivot.y === 0 &&
			!win._mask &&
			!(win.filters && win.filters.length > 0) &&
			!win.cacheAsBitmap &&
			this.isVisualInsideShape(layer, win)
	},

	hasIntersection(winA, winB){
		const heightA = winA.height * winA.openness / 255
		const heightB = winB.height * winB.openness / 255
		const leftA = winA.x
		const topA = winA.y + (winA.height - heightA) / 2
		const rightA = leftA + winA.width
		const bottomA = topA + heightA
		const leftB = winB.x
		const topB = winB.y + (winB.height - heightB) / 2
		const rightB = leftB + winB.width
		const bottomB = topB + heightB

		return leftA < rightB && rightA > leftB && topA < bottomB && bottomA > topB
	},

	canSkipStencil(layer, children, childCount){
		let windowCount = 0

		for(let i = childCount - 1; i >= 0; i--){
			if(this.isWindow(children[i])){
				windowCount++
			}
		}

		if(windowCount <= 1){
			return true
		}

		for(let i = childCount - 1; i >= 0; i--){
			const win = children[i]

			if(this.isWindow(win) && !this.canUseRectangle(layer, win)){
				return false
			}
		}

		for(let i = childCount - 1; i >= 0; i--){
			const winA = children[i]

			if(this.isWindow(winA)){
				for(let j = i - 1; j >= 0; j--){
					const winB = children[j]

					if(this.isWindow(winB) && this.hasIntersection(winA, winB)){
						return false
					}
				}
			}
		}

		return true
	},

	renderNonWindows(layer, renderer){
		for(const child of layer.children){
			if(!child._isWindow && child.visible){
				child.render(renderer)
			}
		}

		renderer.batch.flush()
	},

	renderDirect(layer, renderer, children, childCount){
		renderer.batch.flush()

		for(let i = childCount - 1; i >= 0; i--){
			const win = children[i]

			if(this.isWindow(win)){
				win.render(renderer)
				renderer.batch.flush()
			}
		}

		children.length = 0
		renderer.batch.flush()
		this.renderNonWindows(layer, renderer)
	},

	renderStencil(layer, renderer, children, childCount, drawShape){
		const graphics = layer.eliOptimization.graphics
		const gl = renderer.gl

		renderer.framebuffer.forceStencil()
		graphics.transform = layer.transform
		renderer.batch.flush()
		gl.enable(gl.STENCIL_TEST)

		for(let i = childCount - 1; i >= 0; i--){
			const win = children[i]

			if(this.isWindow(win)){
				gl.stencilFunc(gl.EQUAL, 0, ~0)
				gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP)
				win.render(renderer)
				renderer.batch.flush()
				const shapeGraphics = drawShape.call(this, layer, win)
				gl.stencilFunc(gl.ALWAYS, 1, ~0)
				gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE)
				gl.blendFunc(gl.ZERO, gl.ONE)
				shapeGraphics.render(renderer)
				renderer.batch.flush()
				gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
			}
		}

		children.length = 0

		gl.disable(gl.STENCIL_TEST)
		gl.clear(gl.STENCIL_BUFFER_BIT)
		gl.clearStencil(0)
		renderer.batch.flush()
		this.renderNonWindows(layer, renderer)
	},

	renderLevel1(layer, renderer, children, childCount){
		this.renderStencil(layer, renderer, children, childCount, this.drawShapeLevel1)
	},

	renderLevel2(layer, renderer, children, childCount){
		this.renderStencil(layer, renderer, children, childCount, this.drawShapeLevel2)
	},

	renderLevel3(layer, renderer, children, childCount){
		if(this.canSkipStencil(layer, children, childCount)){
			this.renderDirect(layer, renderer, children, childCount)
		}else{
			this.renderLevel2(layer, renderer, children, childCount)
		}
	},

	render(layer, renderer){
		if(layer.visible){
			const children = layer.eliOptimization.children
			const currentChildren = layer.children
			const childCount = currentChildren.length

			children.length = childCount

			for(let i = 0; i < childCount; i++){
				children[i] = currentChildren[i]
			}

			this.renderMethod(layer, renderer, children, childCount)
		}
	},

}

Eli.WindowLayerOptimization.initialize()

/* ========================================================================== */
/*                                  SAVE DATA                                 */
/* ========================================================================== */
function Eli_SavedContents() {
	this.initialize.apply(this, arguments)
}

Eli_SavedContents.prototype.initialize = function(){
	this.contents = {}
}

/**
 * 
 * @param {string} pluginName 
 * @deprecated Must be removed. [Mapreveal]
 */
Eli_SavedContents.prototype.createNewContent = function(pluginName){
	this.contents[pluginName] = {}
}

var $eliData = null

{

const Alias = {}

/* ---------------------------- DISABLE EFFEKSEER --------------------------- */
if(Eli.Book.getEngineParam().disableEffekseer){

	Graphics._createEffekseerContext = function(){
		this._effekseer = null
	}

	SceneManager.updateEffekseer = function(){}

	EffectManager.isReady = function() {
		return true
	}

	EffectManager.clear = function() {
		this._cache = {}
	}

}

/* ------------------ WINDOW LAYER OPTIMIZATION HOOKS ------------------ */
if(Eli.WindowLayerOptimization.isEnabled()){

	Alias.WindowLayer_initialize = WindowLayer.prototype.initialize
	WindowLayer.prototype.initialize = function(){
		Alias.WindowLayer_initialize.call(this)
		Eli.WindowLayerOptimization.createLayerData(this)
	}

	WindowLayer.prototype.render = function(renderer){
		Eli.WindowLayerOptimization.render(this, renderer)
	}

	if(Eli.WindowLayerOptimization.usesShapeCache()){
		Alias.Window_destroy = Window.prototype.destroy
		Window.prototype.destroy = function(){
			Eli.WindowLayerOptimization.destroyShape(this)
			Alias.Window_destroy.call(this)
		}
	}

	Alias.WindowLayer_destroy = WindowLayer.prototype.destroy
	WindowLayer.prototype.destroy = function(options){
		Eli.WindowLayerOptimization.destroyLayerData(this)
		Alias.WindowLayer_destroy.call(this, options)
	}
}

/* -------------------------- UPDATE ERROR PRINTER -------------------------- */
if(Eli.Book.getParam().updateErrorPrinter){

window.addEventListener("error", event => {
	Eli.ErrorPrinter.windowErrorEvent = event

	if(event.error){
		Eli.ErrorPrinter.errorEvent = event.error
	}
})

Alias.Main_makeErrorHtml = Main.prototype.makeErrorHtml
Main.prototype.makeErrorHtml = function(name, message) {
	const error = Eli.ErrorPrinter.errorEvent || this.error

	if(name && message){
		return Eli.ErrorPrinter.makeErrorHtml(name, message, error)
	}else{
		return Alias.Main_makeErrorHtml.call(this, name, message)
	}
}

Main.prototype.printError = function(name, message) {
	this.eraseLoadingSpinner()
	Eli.ErrorPrinter.addCustomStyle()

	if(!document.getElementById("errorPrinter")){
		const errorPrinter = document.createElement("div")
		errorPrinter.id = "errorPrinter"
		Eli.ErrorPrinter.setRootPrinterAttributes(errorPrinter)
		errorPrinter.innerHTML = this.makeErrorHtml(name, message)
		Eli.ErrorPrinter.showRootPrinter(errorPrinter)
		document.body.appendChild(errorPrinter)
	}else{
		const errorPrinter = document.getElementById("errorPrinter")
		Eli.ErrorPrinter.setRootPrinterAttributes(errorPrinter)
		errorPrinter.innerHTML = this.makeErrorHtml(name, message)
		Eli.ErrorPrinter.showRootPrinter(errorPrinter)
	}
}

	Alias.Graphics_printError = Graphics.printError
	Graphics.printError = function(name, message, error) {
		if(!error){
			error = Eli.ErrorPrinter.errorEvent
		}

		Eli.ErrorPrinter.addCustomStyle()
		Alias.Graphics_printError.call(this, name, message, error)
		Eli.ErrorPrinter.showRootPrinter(this._errorPrinter)
	}

	Alias.Graphics__updateErrorPrinter = Graphics._updateErrorPrinter
	Graphics._updateErrorPrinter = function() {
		const oldWidthStyle = this._errorPrinter.style.width
		const oldHeightStyle = this._errorPrinter.style.height
		Alias.Graphics__updateErrorPrinter.call(this)
		this._errorPrinter.style.width = oldWidthStyle
		this._errorPrinter.style.height = oldHeightStyle
	}

	Graphics._createErrorPrinter = function() {
		this._errorPrinter = document.createElement("div")
		this._errorPrinter.id = "errorPrinter"
		Eli.ErrorPrinter.setRootPrinterAttributes(this._errorPrinter)
		this._errorPrinter.innerHTML = this._makeErrorHtml()
		document.body.appendChild(this._errorPrinter)
	}

	Alias.Graphics_eraseError = Graphics.eraseError
	Graphics.eraseError = function() {
		Alias.Graphics_eraseError.call(this)
		Eli.ErrorPrinter.hideRootPrinter(this._errorPrinter)
	}

	Alias.Graphics__makeErrorHtml = Graphics._makeErrorHtml
	Graphics._makeErrorHtml = function(name, message, error) {
		if(name && message){
			return Eli.ErrorPrinter.makeErrorHtml(name, message, error)
		}else{
			return Alias.Graphics__makeErrorHtml.call(this, name, message, error)
		}
	}

	Alias.SceneManager_catchException = SceneManager.catchException
	SceneManager.catchException = function(e) {
		Eli.ErrorPrinter.errorEvent = e
		Eli.ErrorPrinter.windowErrorEvent = null
		Alias.SceneManager_catchException.call(this, e)
	}

	Alias.Game_Interpreter_executeCommand = Game_Interpreter.prototype.executeCommand
	Game_Interpreter.prototype.executeCommand = function() {
		const command = this.currentCommand()
		Eli.ErrorPrinter.setInterpreter(this, command)
		return Alias.Game_Interpreter_executeCommand.call(this)
	}
}

/* ------------------------------ CHECK VERSION ----------------------------- */
if(Eli.Book.isVersionManagerEnabled() && Utils.isNwjs() && Utils.isOptionValid("test")){

	Alias.Scene_Boot_isReady = Scene_Boot.prototype.isReady
	Scene_Boot.prototype.isReady = function() {
		const ready = Alias.Scene_Boot_isReady.call(this)

		if(ready){
			Eli.VersionManager.startCheckingPluginVersions()

			if(Eli.VersionManager.isBlockingBoot()){
				return false
			}
		}

		return ready
	}
}

/* ========================================================================== */
/*                                    CORE                                    */
/* ========================================================================== */

/* -------------------------------- GRAPHICS -------------------------------- */
Alias.Graphics_setupPixi = Graphics._setupPixi
Graphics._setupPixi = function() {
	Alias.Graphics_setupPixi.call(this)
	this.onPixiSetup()
}

Graphics.onPixiSetup = function() {
	if(Utils.isOptionValid("test") && Eli.Book.getPlaytestParam().startFps){
		Graphics._switchFPSCounter()
	}
}

/* --------------------------------- BITMAP --------------------------------- */
if(Utils.isOptionValid("test") && Eli.Book.getEngineParam().fixBitmapStartLoad){

	Bitmap.prototype._startLoading = function() {
		this._image = new Image()
		this._image.onload = this._onLoad.bind(this)
		this._image.onerror = this._onError.bind(this)
		this._destroyCanvas()
		this._loadingState = "loading"
		if(Utils.hasEncryptedImages()){
			this._startDecrypting()
		}else{
			this._image.src = this._url
			// if(this._image.width > 0){
			// 	this._image.onload = null
			// 	this._onLoad()
			// }
		}
	}
}

/* --------------------------------- WINDOW --------------------------------- */
Alias.Window_initialize = Window.prototype.initialize
Window.prototype.initialize = function() {
	Alias.Window_initialize.call(this)
	Eli.Utils.windowMargin = this._margin
}

/* --------------------------------- SPRITE --------------------------------- */
Alias.Sprite_initialize = Sprite.prototype.initialize
Sprite.prototype.initialize = function(bitmap){
	this.initInnerAnimations()
	Alias.Sprite_initialize.call(this, bitmap)
}

/* ------------------------------- MAIN SPRITE ------------------------------ */
Sprite.prototype.scaledWidth = function(){
	return this.scale.x * this.width
}

Sprite.prototype.scaledHeight = function(){
	return this.scale.y * this.height
}

/**
 * @deprecated Must be removed. [Map Select]
 */
Sprite.prototype.stretchScaleTo = function(keepRatio, baseWidth = Graphics.width, baseHeight = Graphics.height){
	const bitmapWidth = this.width
	const bitmapHeight = this.height

	if(keepRatio){
		const widthRatio = baseWidth / bitmapWidth
		const heightRatio = baseHeight / bitmapHeight
		const finalScale = Math.min(widthRatio, heightRatio)

		this.scale.set(finalScale, finalScale)

	}else{
		const upScale = baseWidth > bitmapWidth || baseHeight > bitmapHeight
		const widthRatio = Math.max(bitmapWidth, baseWidth) / Math.min(bitmapWidth, baseWidth)
		const heightRatio = Math.max(bitmapHeight, baseHeight) / Math.min(bitmapHeight, baseHeight)
		const scaleX = Math.abs(1 - widthRatio)
		const scaleY = Math.abs(1 - heightRatio)

		if(upScale){
			this.scale.set(1 + scaleX, 1 + scaleY)
		}else{
			this.scale.set(1 - scaleX, 1 - scaleY)
		}
	}
}

/**
 * 
 * @deprecated Must be removed and use Eli.Utils instead. [Map Select]
 */
Sprite.prototype.centerPositionX = function(relativeWidth){
	const x = Eli.Utils.centerXPos(this.scaledWidth(), relativeWidth)
	this.x = x
}

/**
 * 
 * @deprecated Must be removed and use Eli.Utils instead. [Map Select]
 */
Sprite.prototype.centerPositionY = function(relativeHeight){
	const y = Eli.Utils.centerYPos(this.scaledHeight(), relativeHeight)
	this.y = y
}

/**
 * 
 * @deprecated Must be removed and use Eli.Utils instead. [Map Select]
 */
Sprite.prototype.centerPositionTo = function(relativeWidth, relativeHeight){
	const x = Eli.Utils.centerXPos(this.scaledWidth(), relativeWidth)
	const y = Eli.Utils.centerYPos(this.scaledHeight(), relativeHeight)
	this.move(x, y)
}

/* ----------------------------- INNER ANIMATION ---------------------------- */
Sprite.prototype.initInnerAnimations = function(){
	this._innerAnimationsMZ = []
	this._innerAnimationsMV = []
	this._effectTarget = this
}

Sprite.prototype.updateInnerMVAnimationSprites = function() {
	if (this.isInnerAnimationPlaying()) {
		const sprites = this._innerAnimationsMV.clone()
		this._innerAnimationsMV = []

		for (const sprite of sprites){

			if (sprite.isPlaying()) {
				this._innerAnimationsMV.push(sprite)

			}else{
				if(sprite.parent){
					sprite.parent.removeChild(sprite)
				}
				sprite.destroy()
			}
		}
	}
}

Sprite.prototype.updateInnerMZAnimationSprites = function(){
	const clone = this._innerAnimationsMZ.clone()
	for(const sprite of clone){

		if(!sprite.isPlaying()){
			this.removeInnerAnimation(sprite)
		}
	}
}

Sprite.prototype.isInnerAnimationPlaying = function(){
	return this._innerAnimationsMV.length > 0 || this._innerAnimationsMZ.length > 0
}

Sprite.prototype.startInnerAnimation = function(animationId, mirror, delay){
	const animationData = $dataAnimations[animationId]

	if(animationData){
		const animation = JSON.parse(JSON.stringify(animationData))

		if(Eli.Utils.isMVAnimation(animation)){
			this.startInnerAnimationMV(animation, mirror, delay)
		}else{
			this.startInnerAnimationMZ(animation, mirror, delay)
		}
	}
}

Sprite.prototype.startInnerAnimationMV = function(animation, mirror, delay){
	const sprite = new Sprite_InnerAnimationMV()

	sprite.setup(this._effectTarget, animation, mirror, delay)
	this.parent.addChild(sprite)
	this._innerAnimationsMV.push(sprite)
}

Sprite.prototype.startInnerAnimationMZ = function(animation, mirror, delay){
	const sprite = new Sprite_Animation()
	const targetSprites = [this]
	const baseDelay = this.innerAnimationBaseDelay()
	const previous = delay > baseDelay ? this.lastInnerAnimationSprite() : null

	sprite._targets = [this]
	animation.offsetX += this.width/2
	animation.offsetY += this.height
	sprite.setup(targetSprites, animation, mirror, delay, previous)
	this.parent.addChild(sprite)
	this._innerAnimationsMZ.push(sprite)
}

Sprite.prototype.lastInnerAnimationSprite = function() {
	return this._innerAnimationsMZ[this._innerAnimationsMZ.length - 1]
}

Sprite.prototype.isInnerAnimationForEach = function(animation) {
	const mv = Eli.Utils.isMVAnimation(animation)
	return mv ? animation.position !== 3 : animation.displayType === 0
}

Sprite.prototype.innerAnimationBaseDelay = function() {
	return 8
}

Sprite.prototype.innerAnimationNextDelay = function() {
	return 12
}

Sprite.prototype.innerAnimationShouldMirror = function(target) {
	return target && target.isActor && target.isActor()
}

Sprite.prototype.removeInnerAnimation = function(sprite) {
	this._innerAnimationsMZ.remove(sprite)

	if(sprite.parent){
		sprite.parent.removeChild(sprite)
	}

	for (const target of sprite._targets) {
		if (target.endAnimation) {
			target.endAnimation()
		}
	}
	sprite.destroy()
}

Sprite.prototype.removeAllInnerAnimations = function() {
	const clonedAnimations = this._innerAnimationsMZ.clone()

	for (const sprite of clonedAnimations) {
		this.removeInnerAnimation(sprite)
	}
}

/* ========================================================================== */
/*                                   MANAGER                                  */
/* ========================================================================== */

/* ------------------------------ DATA MANAGER ------------------------------ */
Alias.DataManager_createGameObjects = DataManager.createGameObjects
DataManager.createGameObjects = function() {
	$eliData = new Eli_SavedContents()
	Alias.DataManager_createGameObjects.call(this)
}

Alias.DataManager_makeSaveContents = DataManager.makeSaveContents
DataManager.makeSaveContents = function() {
	const alias = Alias.DataManager_makeSaveContents.call(this)
	alias.eli = $eliData

	return alias
}

Alias.DataManager_extractSaveContents = DataManager.extractSaveContents
DataManager.extractSaveContents = function(contents) {
	Alias.DataManager_extractSaveContents.call(this, contents)
	$eliData = contents.eli
	$gameMap.restoreMainInterpreters()
}

/* ----------------------------- CONFIG MANAGER ----------------------------- */
ConfigManager.readNumber = function(config, name, defaultValue){
	if(name in config){
		return Number(config[name])
	}else{
		return defaultValue
	}
}

/* ----------------------------- COLOR MANAGER ------------------------------ */
if(Eli.Book.getEngineParam().colorCache){

	ColorManager.windowColorCache = {
		text: new Map(),
		pending: null,
		windowskin: null,
		baseTexture: null,
		dirtyId: -1
	}

	ColorManager.prepareWindowskinForPixelRead = function() {
		this._windowskin.context
	}

	ColorManager.clearWindowColorCache = function(windowskin = null) {
		const cache = this.windowColorCache

		cache.text.clear()
		cache.pending = null
		cache.windowskin = windowskin
		cache.baseTexture = null
		cache.dirtyId = -1
	}

	ColorManager.updateWindowColorCache = function() {
		const windowskin = this._windowskin
		const cache = this.windowColorCache

		if(windowskin.isReady()){
			this.prepareWindowskinForPixelRead()

			const baseTexture = windowskin.baseTexture
			const dirtyId = baseTexture.dirtyId
			const changed = (
				cache.windowskin !== windowskin ||
				cache.baseTexture !== baseTexture ||
				cache.dirtyId !== dirtyId
			)

			if(changed){
				cache.text.clear()
				cache.pending = null
				cache.windowskin = windowskin
				cache.baseTexture = baseTexture
				cache.dirtyId = dirtyId
			}
		}else if(cache.windowskin !== windowskin || cache.baseTexture !== null){
			this.clearWindowColorCache(windowskin)
		}
	}

	Alias.ColorManager_textColor = ColorManager.textColor
	ColorManager.textColor = function(n) {
		const windowskin = this._windowskin
		const cache = this.windowColorCache
		const cacheKey = Number(n)

		this.updateWindowColorCache()

		if(windowskin.isReady()){
			if(!cache.text.has(cacheKey)){
				cache.text.set(cacheKey, Alias.ColorManager_textColor.call(this, n))
			}

			return cache.text.get(cacheKey)
		}else{
			return Alias.ColorManager_textColor.call(this, n)
		}
	}

	Alias.ColorManager_pendingColor = ColorManager.pendingColor
	ColorManager.pendingColor = function() {
		const windowskin = this._windowskin
		const cache = this.windowColorCache

		this.updateWindowColorCache()

		if(windowskin.isReady()){
			if(cache.pending === null){
				cache.pending = Alias.ColorManager_pendingColor.call(this)
			}

			return cache.pending
		}else{
			return Alias.ColorManager_pendingColor.call(this)
		}
	}

}

/* ------------------------------ SCENE MANAGER ----------------------------- */
if(Eli.Book.getPlaytestParam().gameFocus && Utils.isOptionValid("test")){

	SceneManager.isGameActive = function() {
		return true
	}
}

if(Utils.isOptionValid("test")){

	Alias.SceneManager_reloadGame = SceneManager.reloadGame
	SceneManager.reloadGame = function() {
		if(Eli.Book.getPlaytestParam().quickRestart && Utils.isNwjs()){
			location.reload()
		}else{
			Alias.SceneManager_reloadGame.call(this)
		}
	}
}

/* ----------------------------- BATTLE MANAGER ----------------------------- */
BattleManager.battleTrigger = ""

Alias.BattleManager_setup = BattleManager.setup
BattleManager.setup = function(troopId, canEscape, canLose) {
	this.beforeSetup(troopId, canEscape, canLose)
	Alias.BattleManager_setup.call(this, troopId, canEscape, canLose)
	this.afterSetup(troopId, canEscape, canLose)
}

BattleManager.beforeSetup = function(troopId, canEscape, canLose){}
BattleManager.afterSetup = function(troopId, canEscape, canLose){}

BattleManager.setBattleTrigger = function(origin){
	this.battleTrigger = origin
}

BattleManager.getBattleTrigger = function(){
	return this.battleTrigger
}

BattleManager.clearBattleTrigger = function(){
	this.setBattleTrigger("")
}

BattleManager.setMapRandomBattleTrigger = function(){
	this.setBattleTrigger("MapRandom")
}

BattleManager.setEventRandomBattleTrigger = function(){
	this.setBattleTrigger("EventRandom")
}

BattleManager.setCommandEventBattleTrigger = function(){
	this.setBattleTrigger("CommandEvent")
}

BattleManager.isBattleTriggeredByMapRandom = function(){
	return this.getBattleTrigger() === "MapRandom"
}

BattleManager.isBattleTriggeredByEventRandom = function(){
	return this.getBattleTrigger() === "EventRandom"
}

BattleManager.isBattleTriggeredByCommandEvent = function(){
	return this.getBattleTrigger() === "CommandEvent"
}

BattleManager.isRandomBattle = function(){
	return this.isBattleTriggeredByMapRandom() || this.isBattleTriggeredByEventRandom()
}

/* ========================================================================== */
/*                                   OBJECTS                                  */
/* ========================================================================== */

/* -------------------------------- GAME MAP -------------------------------- */
Game_Map.prototype.restoreMainInterpreters = function() {
	this._interpreter.restoreMainInterpreter()

	for(const event of this.events()){
		if(event._interpreter){
			event._interpreter.restoreMainInterpreter()
		}
	}

	for(const commonEvent of this._commonEvents){
		if(commonEvent._interpreter){
			commonEvent._interpreter.restoreMainInterpreter()
		}
	}
}

/* --------------------------- GAME CHARACTER BASE -------------------------- */
Game_CharacterBase.prototype.hasMapSprite = function(){
	return !!this.getMapSprite()
}

Game_CharacterBase.prototype.getSpriteId = function() {}

Game_CharacterBase.prototype.getMapSprite = function() {}

Game_CharacterBase.prototype.getCurrentBattler = function() {}

Game_CharacterBase.prototype.getGlobalKey = function() {
	return "undefined"
}

/* ------------------------------- GAME PLAYER ------------------------------ */
Game_Player.prototype.getSpriteId = function() {
	return -1
}

Game_Player.prototype.getMapSprite = function() {
	return Eli.Utils.spriteCharacters[this.getSpriteId()]
}

Game_Player.prototype.getCurrentBattler = function() {
	return $gameParty.leader()
}

Game_Player.prototype.getGlobalKey = function(forActor) {
	if(forActor){
		return `Actor_${$gameParty.leader()?.actorId()}`
	}else{
		return `Player`
	}
}

Alias.Game_Player_makeEncounterTroopId = Game_Player.prototype.makeEncounterTroopId
Game_Player.prototype.makeEncounterTroopId = function() {
	if(!BattleManager.isBattleTriggeredByEventRandom()){
		BattleManager.setMapRandomBattleTrigger()
	}

	const troopId = Alias.Game_Player_makeEncounterTroopId.call(this)

	if(!$dataTroops[troopId]){
		BattleManager.clearBattleTrigger()
	}

	return troopId
}

/* ----------------------------- GAME FOLLOWERS ----------------------------- */
Alias.Game_Follower_initialize = Game_Follower.prototype.initialize
Game_Follower.prototype.initialize = function(memberIndex) {
	this._memberIndex = memberIndex
	Alias.Game_Follower_initialize.call(this, memberIndex)
}

Game_Follower.prototype.getSpriteId = function() {
	return -(this._memberIndex+1)
}

Game_Follower.prototype.getMapSprite = function() {
	return Eli.Utils.spriteCharacters[this.getSpriteId()]
}

Game_Follower.prototype.getCurrentBattler = function() {
	return this.actor()
}

Game_Follower.prototype.getGlobalKey = function(forActor) {
	if(forActor){
		return `Actor_${this.actor()?.actorId()}`
	}else{
		return `Follower_${this._memberIndex}`
	}
}

/* ------------------------------- GAME EVENT ------------------------------- */
Alias.Game_Event_initialize = Game_Event.prototype.initialize
Game_Event.prototype.initialize = function(mapId, eventId) {
	this._mapId = mapId
	this._eventId = eventId
	Alias.Game_Event_initialize.call(this, mapId, eventId)
}

Alias.Game_Event_initMembers = Game_Event.prototype.initMembers
Game_Event.prototype.initMembers = function(){
	Alias.Game_Event_initMembers.call(this)
	this.initMetaMembers()
}

Game_Event.prototype.initMetaMembers = function(){
	this.metaEli = {}
	this.needBuildMetaData = true
}

Alias.Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings
Game_Event.prototype.setupPageSettings = function(){
	this.beforeSetupPage()
	Alias.Game_Event_setupPageSettings.call(this)
	this.afterSetupPage()
	this.checkListIteration()
}

Game_Event.prototype.beforeSetupPage = function(){
	if(this.needBuildMetaData && this.event().note.length > 0){
		this.extractEliMetaData()
		this.needBuildMetaData = false
	}
}

Game_Event.prototype.extractEliMetaData = function(){
	const regExp = /<([^<>:]+)(:?)([^>]*)>/g

	for(;;){
		const match = regExp.exec(this.event().note)

		if(match){
			if(match[2] === ":"){
				const key = match[1]
				const value = match[3]
				const dummy = (arg) => arg
				const parseMethod = this[`parseMeta_${key}`]
				const func = (parseMethod || dummy).bind(this)

				this.metaEli[match[1]] = func(value)

			}else{
				this.metaEli[match[1]] = true
			}

		}else{
			break
		}
	}
}

Game_Event.prototype.afterSetupPage = function(){}

Game_Event.prototype.checkListIteration = function(){
	Eli.PluginManager.clearPassivePluginCommands()

	if(this.canIterateList()){
		Eli.PluginManager.setPassiveEvent(this)
		this.startIterateList()
	}

	this.afterListIteration()
}

Game_Event.prototype.hasIterateListNote = function(){
	return this.event().note.toLowerCase().includes("<iteratelist>")
}

Game_Event.prototype.canIterateList = function(){
	return Eli.Book.getParam().iterateEventList || this.hasIterateListNote()
}

Game_Event.prototype.startIterateList = function(){
	Eli.PluginManager.clearPassivePluginCommands()
	const list = this.list() || []

	for(let i = 0; i < list.length; i++){
		i = this.onListIteration(i, list)
	}
}

Game_Event.prototype.onListIteration = function(index, list = this.list() || []){
	Eli.PluginManager.collectPassivePluginCommand(list[index])

	return index
}

Game_Event.prototype.afterListIteration = function(){
	Eli.PluginManager.checkPassivePluginCommands(this.eventId())
	Eli.PluginManager.setPassiveEvent(null)
}

Game_Event.prototype.getSpriteId = function() {
	return this.eventId()
}

Game_Event.prototype.getMapSprite = function() {
	return Eli.Utils.spriteCharacters[this.getSpriteId()]
}

Game_Event.prototype.getGlobalKey = function(forActor) {
	return `Map_${this._mapId}_Event_${this.eventId()}`
}

Game_Event.prototype.isActionTrigger = function() {
	return this._trigger === 0
}

Game_Event.prototype.isPlayerTouchTrigger = function() {
	return this._trigger === 1
}

Game_Event.prototype.isEventTouchTrigger = function() {
	return this._trigger === 2
}

Game_Event.prototype.isAutorunTrigger = function() {
	return this._trigger === 3
}

Game_Event.prototype.isParallelTrigger = function() {
	return this._trigger === 4
}

Game_Event.prototype.getTriggerType = function(trigger) {
	return ["ActionButton", "PlayerTouch", "EventTouch", "Autorun", "Parallel"][trigger] || "Invalid"
}

/* ------------------------------ GAME VEHICLE ------------------------------ */
Alias.Game_Vehicle_initialize = Game_Vehicle.prototype.initialize
Game_Vehicle.prototype.initialize = function(type) {
	this._type = type
	Alias.Game_Vehicle_initialize.call(this, type)
}

Game_Vehicle.prototype.getSpriteId = function() {
	return this._type.toLowerCase()
}

Game_Vehicle.prototype.getMapSprite = function() {
	return Eli.Utils.spriteCharacters[this.getSpriteId()]
}

Game_Vehicle.prototype.getGlobalKey = function() {
	return `Vehicle_${this._type}`
}

/* ------------------------------ GAME MESSAGE ------------------------------ */
Alias.Game_Message_initialize = Game_Message.prototype.initialize
Game_Message.prototype.initialize = function() {
	Alias.Game_Message_initialize.call(this)
	this.initMembers()
}

Game_Message.prototype.initMembers = function(){
	this.interpreter = null
	this.eventId = 0
	this.commonEventId = 0
	this.sessionId = 0
}

Game_Message.prototype.setInterpreter = function(interpreter){
	this.interpreter = interpreter
}

Alias.Game_Message_clear = Game_Message.prototype.clear
Game_Message.prototype.clear = function() {
	Alias.Game_Message_clear.call(this)
	this.clearEventIds()
}

Game_Message.prototype.clearEventIds = function(){
	this.setEventIds(0, 0)
}

Game_Message.prototype.setEventIds = function(eventId, commonEventId){
	this.eventId = eventId
	this.commonEventId = commonEventId
}

Game_Message.prototype.advanceSessionId = function(){
	this.sessionId++
}

Game_Message.prototype.getEventId = function(){
	return this.eventId
}

Game_Message.prototype.getCommonEventId = function(){
	return this.commonEventId
}

Game_Message.prototype.getInterpreter = function(){
	return this.interpreter
}

Game_Message.prototype.getSessionId = function(){
	return this.sessionId
}

/* ------------------------------ GAME BATTLER ------------------------------ */
Game_Battler.prototype.getDatabase = function(){
	return null 
}

/* ------------------------------- GAME ACTOR ------------------------------- */
Game_Actor.prototype.getDatabase = function(){
	return this.actor()
}

/* ------------------------------- GAME ENEMY ------------------------------- */
Game_Enemy.prototype.getDatabase = function(){
	return this.enemy()
}

/* ---------------------------- GAME INTERPRETER ---------------------------- */
Alias.Game_Interpreter_clear = Game_Interpreter.prototype.clear
Game_Interpreter.prototype.clear = function() {
	Alias.Game_Interpreter_clear.call(this)
	this.clearCommonEventId()
	this.clearMainInterpreter()
}

Game_Interpreter.prototype.clearCommonEventId = function() {
	this._commonEventId = 0
}

Game_Interpreter.prototype.clearMainInterpreter = function() {
	this.setMainInterpreter(null)
}

Alias.Game_Interpreter_setup = Game_Interpreter.prototype.setup
Game_Interpreter.prototype.setup = function(list, eventId) {
	Alias.Game_Interpreter_setup.call(this, list, eventId)
	this.setupCommonEventId(list, eventId)
}

Game_Interpreter.prototype.setupCommonEventId = function(list, eventId) {
	if(!eventId || this._depth > 0){
		this.setCommonEventId(list)
	}
}

Game_Interpreter.prototype.setCommonEventId = function(list){
	for(let i = 1; i < $dataCommonEvents.length; i++){
		this.onDataCommonEventLoop(list, i)
		if(this._commonEventId > 0){
			break
		}
	}
}

Game_Interpreter.prototype.onDataCommonEventLoop = function(list, i){
	const commonEvent = $dataCommonEvents[i]

	if(commonEvent && commonEvent.list === list){
		this._commonEventId = i
	}
}

Alias.Game_Interpreter_setupChild = Game_Interpreter.prototype.setupChild
Game_Interpreter.prototype.setupChild = function(list, eventId) {
	Alias.Game_Interpreter_setupChild.call(this, list, eventId)
	this._childInterpreter.setMainInterpreter(this.getMainInterpreter() || this)
}

Game_Interpreter.prototype.setMainInterpreter = function(parent) {
	Object.defineProperty(this, "mainInterpreter", {
		value: parent,
		writable: true,
		configurable: true,
		enumerable: false
	})
}

Game_Interpreter.prototype.getMainInterpreter = function() {
	return this.mainInterpreter
}

Game_Interpreter.prototype.restoreMainInterpreter = function(mainInterpreter) {
	this.setMainInterpreter(mainInterpreter || null)

	if(this._childInterpreter){
		this._childInterpreter.restoreMainInterpreter(mainInterpreter || this)
	}
}

Alias.Game_Interpreter_command101 = Game_Interpreter.prototype.command101
Game_Interpreter.prototype.command101 = function(params) {
	if(!$gameMessage.isBusy()) {
		this.command101OnMessageNotBusy(params)
	}

	return Alias.Game_Interpreter_command101.call(this, params)
}

Game_Interpreter.prototype.command101OnMessageNotBusy = function(params) {
	this.assignMesssageInterpreterAndIds()
}

Alias.Game_Interpreter_setupChoices = Game_Interpreter.prototype.setupChoices
Game_Interpreter.prototype.setupChoices = function(params){
	this.assignMesssageInterpreterAndIds()
	Alias.Game_Interpreter_setupChoices.call(this, params)
}

Alias.Game_Interpreter_setupNumInput = Game_Interpreter.prototype.setupNumInput
Game_Interpreter.prototype.setupNumInput = function(params) {
	this.assignMesssageInterpreterAndIds()
	Alias.Game_Interpreter_setupNumInput.call(this, params)
}

Alias.Game_Interpreter_setupItemChoice = Game_Interpreter.prototype.setupItemChoice
Game_Interpreter.prototype.setupItemChoice = function(params) {
	this.assignMesssageInterpreterAndIds()
	Alias.Game_Interpreter_setupItemChoice.call(this, params)
}

Game_Interpreter.prototype.assignMesssageInterpreterAndIds = function() {
	$gameMessage.setInterpreter(this)
	$gameMessage.setEventIds(this._eventId, this._commonEventId)
}

Alias.Game_Interpreter_command301 = Game_Interpreter.prototype.command301
Game_Interpreter.prototype.command301 = function(params) {
	if(!$gameParty.inBattle()){
		this.command301_NotInBattle(params)
	}

	return Alias.Game_Interpreter_command301.call(this, params)
}

Game_Interpreter.prototype.command301_NotInBattle = function(params) {
	BattleManager.setCommandEventBattleTrigger()
}

Alias.Game_Interpreter_command357 = Game_Interpreter.prototype.command357
Game_Interpreter.prototype.command357 = function(params){
	let result = true

	if(params[1].startsWith(Eli.PluginManager.passivePluginCommandPrefix)){
		result = true
	}else{
		this.setPluginCommandInterpreter()
		result = Alias.Game_Interpreter_command357.call(this, params)
	}

	return result
}

Game_Interpreter.prototype.setPluginCommandInterpreter = function(){
	Eli.PluginManager.currentInterpreter = this
	Eli.PluginManager.currentEventId = this._eventId
	Eli.PluginManager.currentCommonEventId = this._commonEventId
}

Alias.Game_Interpreter_terminate = Game_Interpreter.prototype.terminate
Game_Interpreter.prototype.terminate = function() {
	Alias.Game_Interpreter_terminate.call(this)
	this.onInterpreterEnd()
}

Game_Interpreter.prototype.onInterpreterEnd = function(){
	if(this._eventId > 0){
		this.onEventEnd()
	}

	if(this._commonEventId > 0){
		this.onCommonEventEnd()
	}
}

Game_Interpreter.prototype.onEventEnd = function(){}

Game_Interpreter.prototype.onCommonEventEnd = function(){}

Game_Interpreter.prototype.isMessageInterpreter = function(){
	return this === $gameMessage.getInterpreter()
}

Game_Interpreter.prototype.getCurrentCommandCode = function(){
	if(this._list){
		return this._list[this._index] || 0
	}else{
		return 0
	}
}

Game_Interpreter.prototype.getNextEventCommand = function(){
	if(this._list){
		return this._list[this._index + 1]
	}else{
		return null
	}
}

Game_Interpreter.prototype.getNextEventCommandCode = function(){
	if(this._list){
		return this._list[this._index + 1]?.code || 0
	}else{
		return 0
	}
}

Game_Interpreter.prototype.isOnShowText = function(){
	if(this._list){
		return [101, 401].includes(this.getCurrentCommandCode())
	}else{
		return false
	}
}

Game_Interpreter.prototype.isNextMessageWindowCommand = function(){
	if(this._list){
		const code = this.getNextEventCommandCode()

		return [101, 102, 103, 104, 401].includes(code)
	}else{
		return false
	}
}

/* ========================================================================== */
/*                                    SCENE                                   */
/* ========================================================================== */

/* ------------------------------- SCENE BOOT ------------------------------- */

Alias.Scene_Boot_onDatabaseLoaded = Scene_Boot.prototype.onDatabaseLoaded
Scene_Boot.prototype.onDatabaseLoaded = function() {
	Alias.Scene_Boot_onDatabaseLoaded.call(this)
	this.processDatabaseNotesAndMetas()
}

Scene_Boot.prototype.processDatabaseNotesAndMetas = function(){
	for(let i = 1; i < $dataActors.length; i++){
		this.processDataActors($dataActors[i], i)
	}
	for(let i = 1; i < $dataClasses.length; i++){
		this.processDataClasses($dataClasses[i], i)
	}
	for(let i = 1; i < $dataSkills.length; i++){
		this.processDataSkills($dataSkills[i], i)
	}
	for(let i = 1; i < $dataItems.length; i++){
		this.processDataItems($dataItems[i], i)
	}
	for(let i = 1; i < $dataWeapons.length; i++){
		this.processDataWeapons($dataWeapons[i], i)
	}
	for(let i = 1; i < $dataArmors.length; i++){
		this.processDataArmors($dataArmors[i], i)
	}
	for(let i = 1; i < $dataEnemies.length; i++){
		this.processDataEnemies($dataEnemies[i], i)
	}
	for(let i = 1; i < $dataTroops.length; i++){
		this.processDataTroops($dataTroops[i], i)
	}
	for(let i = 1; i < $dataStates.length; i++){
		this.processDataStates($dataStates[i], i)
	}
	for(let i = 1; i < $dataTilesets.length; i++){
		this.processDataTilesets($dataTilesets[i], i)
	}
}

Scene_Boot.prototype.processDataActors = function(data, index){}

Scene_Boot.prototype.processDataClasses = function(data, index){}

Scene_Boot.prototype.processDataSkills = function(data, index){}

Scene_Boot.prototype.processDataItems = function(data, index){}

Scene_Boot.prototype.processDataWeapons = function(data, index){}

Scene_Boot.prototype.processDataArmors = function(data, index){}

Scene_Boot.prototype.processDataEnemies = function(data, index){}

Scene_Boot.prototype.processDataTroops = function(data, index){}

Scene_Boot.prototype.processDataStates = function(data, index){}

Scene_Boot.prototype.processDataTilesets = function(data, index){}

/* -------------------------------- SCENE MAP ------------------------------- */
Alias.Scene_Map_start = Scene_Map.prototype.start
Scene_Map.prototype.start = function() {
	if(this._transfer){
		this.beforeStartAndTransferIsOn()
	}
	Alias.Scene_Map_start.call(this)
}

Scene_Map.prototype.beforeStartAndTransferIsOn = function() {}

/* ========================================================================== */
/*                                   SPRITES                                  */
/* ========================================================================== */

/* ------------------------------ SPRITESET MAP ----------------------------- */
Alias.Spriteset_Map_createCharacters = Spriteset_Map.prototype.createCharacters
Spriteset_Map.prototype.createCharacters = function() {
	this.beforeCreateCharacters()
	Alias.Spriteset_Map_createCharacters.call(this)
}

Spriteset_Map.prototype.beforeCreateCharacters = function() {
	Eli.Utils.spriteCharacters = {}
}

/* ---------------------------- SPRITE CHARACTER ---------------------------- */
Alias.Sprite_Character_initialize = Sprite_Character.prototype.initialize
Sprite_Character.prototype.initialize = function(character) {
	Alias.Sprite_Character_initialize.call(this, character)
	this.checkToAddMapSprite(character)
}

Sprite_Character.prototype.checkToAddMapSprite = function(character) {
	if(this.isValidCharacterToSetMapSprite(character)){
		this.setMapSprite(character)
	}
}

Sprite_Character.prototype.validCharactersForMapSprite = function(){
	return ["Game_Player", "Game_Event", "Game_Vehicle", "Game_Follower"]
}

Sprite_Character.prototype.isValidCharacterToSetMapSprite = function(character) {
	return character && this.validCharactersForMapSprite().includes(character.constructor.name)
}

Sprite_Character.prototype.setMapSprite = function(character){
	const spriteId = character.getSpriteId()
	Eli.Utils.spriteCharacters[spriteId] = this
}

Alias.Sprite_Character_setTileBitmap = Sprite_Character.prototype.setTileBitmap
Sprite_Character.prototype.setTileBitmap = function() {
	Alias.Sprite_Character_setTileBitmap.call(this)
	this.addLoadListenerOnTileBitmap()
}

Sprite_Character.prototype.addLoadListenerOnTileBitmap = function(){
	this.bitmap.addLoadListener(() => {
		this.onTileBitmapLoad()
	})
}

Sprite_Character.prototype.onTileBitmapLoad = function(){}

Alias.Sprite_Character_setCharacterBitmap = Sprite_Character.prototype.setCharacterBitmap
Sprite_Character.prototype.setCharacterBitmap = function() {
	Alias.Sprite_Character_setCharacterBitmap.call(this)
	this.addLoadListenerOnCharacterBitmap()
}

Sprite_Character.prototype.addLoadListenerOnCharacterBitmap = function(){
	this.bitmap.addLoadListener(() => {
		this.onCharacterBitmapLoad()
	})
}

Sprite_Character.prototype.onCharacterBitmapLoad = function(){}

/* ------------------------------ SPRITE ENEMY ------------------------------ */
Alias.Sprite_Enemy_loadBitmap = Sprite_Enemy.prototype.loadBitmap
Sprite_Enemy.prototype.loadBitmap = function(name, hue){
	Alias.Sprite_Enemy_loadBitmap.call(this, name, hue)
	this.checkBitmap(name, hue)
}

Sprite_Enemy.prototype.checkBitmap = function(name, hue){
	if(this.bitmap){
		this.bitmap.addLoadListener(() => {
			this.onBitmapLoad(name, hue)
		})
	}
}

Sprite_Enemy.prototype.onBitmapLoad = function(name, hue){}

/* ----------------------------- SPRITE PICTURE ----------------------------- */
Alias.Sprite_Picture_loadBitmap = Sprite_Picture.prototype.loadBitmap
Sprite_Picture.prototype.loadBitmap = function(){
	Alias.Sprite_Picture_loadBitmap.call(this)
	this.addBitmapLoadListener()
}

Sprite_Picture.prototype.addBitmapLoadListener = function(){
	this.bitmap.addLoadListener(() => {
		this.onBitmapLoad()
	})
}

Sprite.prototype.addBitmapLoadListener = function(){
	this.bitmap.addLoadListener(() => {
		this.onBitmapLoad()
	})
}

Sprite_Picture.prototype.onBitmapLoad = function(){}

/* ---------------------------- SPRITE BATTLEBACK --------------------------- */
Alias.Sprite_Battleback_initialize = Sprite_Battleback.prototype.initialize
Sprite_Battleback.prototype.initialize = function(type) {
	Alias.Sprite_Battleback_initialize.call(this, type)
	this.checkForBitmap(type)
}

Sprite_Battleback.prototype.checkForBitmap = function(type){
	if(this.bitmap){ 
		this.bitmap.addLoadListener(() => {
			this.onBitmapLoad(type)
		})
	}
}

Sprite_Battleback.prototype.onBitmapLoad = function(type){}

/* ========================================================================== */
/*                                   WINDOW                                   */
/* ========================================================================== */

/* ------------------------------- WINDOW BASE ------------------------------ */
Alias.Window_Base_setBackgroundType = Window_Base.prototype.setBackgroundType
Window_Base.prototype.setBackgroundType = function(type){
	if(type >= 3){
		this.showExtraBackgroundDimmer(type)
	}else{
		Alias.Window_Base_setBackgroundType.call(this, type)
	}
}

Window_Base.prototype.showExtraBackgroundDimmer = function(type) {
	this.opacity = 0

	if (!this._dimmerSprite) {
		this.createDimmerSprite()
	}

	const bitmap = this._dimmerSprite.bitmap

	if (bitmap.width !== this.width || bitmap.height !== this.height) {
		this.refreshExtraBackgroundDimmer(type)
	}

	this._dimmerSprite.visible = true
	this.updateBackgroundDimmer()
}

Window_Base.prototype.refreshExtraBackgroundDimmer = function(type) {
	const options = {
		3: "createStrongBackground",
		4: "createLightGradientVerticalBackground",
		5: "createFadedHorizontalBackground",
	}
	const func = options[type]

	if(this[func]){
		this[func]()
	}else{
		this.hideBackgroundDimmer()
	}
}

Window_Base.prototype.createStrongBackground = function(){
	const bitmap = this._dimmerSprite.bitmap
	const width = this.width > 0 ? this.width + 8 : 0
	const height = this.height
	const margin = this.padding
	const color1 = ColorManager.dimColor1()

	bitmap.resize(width, height)
	bitmap.fillRect(0, margin, width, height - margin * 2, color1)
	this._dimmerSprite.setFrame(0, 0, width, height)
}

Window_Base.prototype.createLightGradientVerticalBackground = function(){
	const bitmap = this._dimmerSprite.bitmap
	const margin = this.padding
	const width = this.width > 0 ? this.width + 8 : 0
	const height = this.height
	const color1 = "rgba(0, 0, 0, 0.7)"
	const color2 = ColorManager.dimColor2()
	const gradHeight = (height - margin * 2)/2

	bitmap.resize(width, height)
	bitmap.gradientFillRect(0, margin, width, gradHeight, color1, color2, true)
	bitmap.gradientFillRect(0, margin + gradHeight, width, gradHeight, color2, color1, true)
	this._dimmerSprite.setFrame(0, 0, width, height)
}

Window_Base.prototype.createFadedHorizontalBackground = function(){
	const bitmap = this._dimmerSprite.bitmap
	const width = this.width > 0 ? this.width + 8 : 0
	const height = this.height
	const margin = this.padding
	const color1 = ColorManager.dimColor1()
	const color2 = ColorManager.dimColor2()

	bitmap.resize(width, height)
	bitmap.gradientFillRect(0, margin, width + width/2, height - margin * 2, color1, color2, false)
	this._dimmerSprite.setFrame(0, 0, width, height)
}

Window_Base.prototype.getItemPadding = function(){
	return this.itemPadding()
}

Window_Base.prototype.getTextLineRect = function(index){
	return this.itemLineRect(index)
}

Window_Base.prototype.updateHorizontalOpenness = function(widthAlign){
	const container = this._container
	const openness = this._openness

	switch(widthAlign){
		case "Left to Right":
			container.scale.x = openness / 255
			container.x = (1 - openness / 255)
			break
		case "Centered":
			container.scale.x = openness / 255
			container.x = (this.width / 2) * (1 - openness / 255)
			break
		case "Right to Left":
			container.scale.x = openness / 255
			container.x = this.width * (1 - openness / 255)
			break
		default:
			container.scale.x = 1
			container.x = 0
	}
}

Window_Base.prototype.updateVerticalOpenness = function(heightAlign){
	const container = this._container
	const openness = this._openness

	switch(heightAlign){
		case "Top to Bottom":
			container.scale.y = openness / 255
			container.y = (1 - openness / 255)
			break
		case "Centered":
			container.scale.y = openness / 255
			container.y = (this.height / 2) * (1 - openness / 255)
			break
		case "Bottom to Top":
			container.scale.y = openness / 255
			container.y = this.height * (1 - openness / 255)
			break
		default:
			container.scale.y = 1
			container.y = 0
	}
}

Window_Base.prototype.getTextSize = function(rawText){
	return this.textSizeEx(rawText.substring(0))
}

Window_Base.prototype.getTextWidth = function(rawText){
	return this.textSizeEx(rawText.substring(0)).width
}

Window_Base.prototype.getTextHeight = function(rawText){
	return this.textSizeEx(rawText.substring(0)).height
}

/* ----------------------------- WINDOW MESSAGE ----------------------------- */
Alias.Window_Message_initMembers = Window_Message.prototype.initMembers
Window_Message.prototype.initMembers = function(){
	Alias.Window_Message_initMembers.call(this)
	this.initEliBookMembers()
}

Window_Message.prototype.initEliBookMembers = function(){
	this.lastSessionId = -1
	this.eliLastMessageCheckWait = 0
}

Alias.Window_Message_startMessage = Window_Message.prototype.startMessage
Window_Message.prototype.startMessage = function(){
	Alias.Window_Message_startMessage.call(this)
	if(this.isFirstMessage()){
		this.onFirstMessage()
	}else{
		this.onNotFirstMessage()
	}
}

Window_Message.prototype.isFirstMessage = function(){
	return this.lastSessionId !== $gameMessage.getSessionId()
}

Window_Message.prototype.onFirstMessage = function(){
	this.lastSessionId = $gameMessage.getSessionId()
}

Window_Message.prototype.onNotFirstMessage = function(){

}

Alias.Window_Message_update = Window_Message.prototype.update
Window_Message.prototype.update = function(){
	Alias.Window_Message_update.call(this)
	this.updateEliLastMessageCheck()
}

Window_Message.prototype.updateEliLastMessageCheck = function(){
	if(this.eliLastMessageCheckWait > 0){
		this.eliLastMessageCheckWait--

		if(this.eliLastMessageCheckWait === 0){
			this.processEliLastMessageCheck()
		}
	}
}

Window_Message.prototype.processEliLastMessageCheck = function(){
	if(this.isLastMessage()){
		this.onLastMessage()
	}else{
		this.onNotLastMessage()
	}
}

Alias.Window_Message_terminateMessage = Window_Message.prototype.terminateMessage
Window_Message.prototype.terminateMessage = function(){
	Alias.Window_Message_terminateMessage.call(this)
	this.requestEliLastMessageCheck()
}

Window_Message.prototype.requestEliLastMessageCheck = function(){
	this.eliLastMessageCheckWait = 2
}

Window_Message.prototype.isLastMessage = function(){
	if($gameMessage.isBusy()){
		return false
	}else{
		return true
	}
}

Window_Message.prototype.onLastMessage = function(){
	$gameMessage.advanceSessionId()
}

Window_Message.prototype.onNotLastMessage = function(){

}

/* ------------------------------ CHOICE WINDOW ----------------------------- */
Alias.Window_ChoiceList_close = Window_ChoiceList.prototype.close
Window_ChoiceList.prototype.close = function() {
	Alias.Window_ChoiceList_close.call(this)
	this.clearMessageEventIds()
}

Window_ChoiceList.prototype.clearMessageEventIds = function() {
	$gameMessage.clearEventIds()
}

/* ------------------------------- SCROLL TEXT ------------------------------ */
Alias.Window_ScrollText_close = Window_ScrollText.prototype.close
Window_ScrollText.prototype.close = function() {
	Alias.Window_ScrollText_close.call(this)
	this.clearMessageEventIds()
}

Window_ScrollText.prototype.clearMessageEventIds = function() {
	$gameMessage.clearEventIds()
}

}

/**
 * @deprecated
 */
Eli.AnimeGroup = class {

	constructor(animations, data){
		this.paused = true
		this.direction = "normal"
		this.progress = 0
		this.childProgress = []
		this.finished = false
		this.onStart = new Function()
		this.onUpdate = new Function()
		this.onComplete = new Function()
		this.childrens = []
		this.initialize(animations, data)
	}

	initialize(animations, data){
		this.paused = data.paused ?? true
		this.direction = data.direction ?? "normal"
		this.onStart = data.onStart || new Function()
		this.onUpdate = data.onUpdate || new Function()
		this.onComplete = data.onComplete || new Function()
		this.childrens = animations
		this.setGroupToAnimations()
	}

	setGroupToAnimations(){
		for(let i = 0; i < this.childrens.length; i++){
			const child = this.childrens[i]
			child.group = this
			child.groupIndex = i
		}
	}

	updateProgress(){
		this.progress = this.childProgress.reduce((previous, next) => previous + next, 0) / this.childrens.length
	}

	setAnimations(animations){
		this.childrens = animations
		this.setGroupToAnimations()
	}

	play(direction){
		this.direction = direction || this.direction

		this.onStart(this)

		for(const animation of this.childrens){
			animation.play(direction)
		}

		this.paused = false
		this.finished = false
	}

	restart(direction){
		this.direction = direction || this.direction

		this.onStart(this)

		for(const animation of this.childrens){
			animation.restart(direction)
		}

		this.finished = false
		this.paused = false
	}

	pause(){
		this.paused = true
	}

	resume(){
		this.paused = false
	}

	isPaused(){
		return this.paused
	}

	isRunning(){
		return this.childrens.some(anim => anim.isRunning())
	}

	update(){
		if(this.isPaused()) return

		for(const animation of this.childrens){
			animation.update()
		}

		if(this.childrens.every(item => item.isFinished()) && !this.finished){
			this.finished = true
			this.onComplete(this)

		}else if(!this.finished){
			this.onUpdate(this)
			this.updateProgress()
		}
	}

	isFinished(){
		return this.finished
	}

}

/**
 * @deprecated
 */
Eli.Anime = class {

	constructor(animeData){
		this.data = {
			target: null,
			direction: {current: 0, type: ""},
			loop: {current: 0, target: 0},
			value: {start: 0, current: 0, target: 0},
			propName: "",
			autoPlay: true,
			startDelay: {current: 0, target: 0},
			endDelay: {current: 0, target: 0},
			duration: {current: 0, target: 0},
			onStart: () => {},
			onUpdate: () => {},
			onComplete: () => {},
			progress: 0,
			easing: "",
		}
		this.group = null
		this.groupIndex = -1
		this.paused = false
		this.running = true
		this.initialize(animeData)
	}

	initialize(animeData){
		this.data = animeData
		this.prepareToStart()
	}

	prepareToStart(){
		const dirType = this.data.direction.type

		if(dirType === "alternate"){
			this.setAlternateDirection()

			if(this.data.loop.target === 0){
				this.data.loop.target = 1
			}
		}

		this.refreshCurrentValue()
		if(this.data.autoPlay){
			this.setPropValue(this.getStartValue())
		}

		this.data.duration.current = -1
	}

	setAlternateDirection(){
		const dir = this.data.direction.current === "normal" ? "reverse" : "normal"
		this.data.direction.current = dir
	}

	refreshCurrentValue(){
		this.data.value.current = this.getStartValue()
	}

	getStartValue(){
		const value = {
			"normal": this.data.value.start,
			"reverse": this.data.value.target,
		}[this.data.direction.current]

		return value
	}

	getTargetValue(){
		const value = {
			"normal": this.data.value.target,
			"reverse": this.data.value.start,
		}[this.data.direction.current]

		return value
	}

	setPropValue(value){
		this.data.target[this.data.propName] = value
	}

	update(){
		if(this.isPaused() || !this.data.autoPlay) return

		if(this.canDelayStart()){
			this.updateStartDelay()

		}else if(this.canStart()){
			this.onAnimeStart()

		}else if(this.canRun()){
			this.updateValue()

		}else if(this.canEnd()){
			this.onAnimeComplete()

		}else if(this.canDelayEnd()){
			this.updateEndDelay()

		}else if(this.needLoop()){
			this.updateLoop()

		}else{
			this.running = false
		}
	}

	canDelayStart(){
		return this.data.startDelay.current < this.data.startDelay.target
	}

	updateStartDelay(){
		this.data.startDelay.current++
		this.running = true
	}

	canStart(){
		return this.data.duration.current === -1
	}

	onAnimeStart(){
		this.data.onStart(this)
		this.data.duration.current = 0
	}

	canRun(){
		return this.data.duration.current < this.data.duration.target
	}

	updateValue(){
		if(this.isPropOnTarget()){
			this.data.duration.current = this.data.duration.target
			this.updateProgress(1)

		}else{
			this.data.duration.current++

			const elapsedTime = this.calculateTime()
			const value = this.processValue(this.getStartValue(), elapsedTime, this.getTargetValue())
			this.setPropValue(value)
			this.updateProgress(elapsedTime)
		}

		if(this.group){
			this.group.finished = false
		}

		this.onAnimeUpdate()
	}

	isPropOnTarget(){
		return this.getPropValue() === this.getTargetValue()
	}

	getPropValue(){
		return this.data.target[this.data.propName]
	}

	updateProgress(elapsedTime){
		this.data.progress = Math.floor(elapsedTime * 100)

		if(this.group){
			this.group.childProgress[this.groupIndex] = this.data.progress
		}
	}

	calculateTime(){
		const elapsedTime = this.data.duration.current / this.data.duration.target
		return Eli.Easings.execute(this.data.easing, elapsedTime)
	}

	processValue(startValue, elapsedTime, endValue){
		return startValue + elapsedTime * (endValue - startValue)
	}

	onAnimeUpdate(){
		this.data.onUpdate(this)
	}

	canEnd(){
		return this.data.duration.current === this.data.duration.target
	}

	onAnimeComplete(){
		this.data.onComplete(this)
		this.data.duration.current++
	}

	canDelayEnd(){
		return this.data.endDelay.current < this.data.endDelay.target
	}

	resetTargetEndDelay(){
		this.data.endDelay.target = 0
	}

	updateEndDelay(){
		this.data.endDelay.current++
	}

	needLoop(){
		return this.data.loop.current < this.data.loop.target
	}

	updateLoop(){
		this.data.loop.current++
		this.restart()
	}

	play(direction){
		this.restart(direction)

		this.resume()
		this.data.autoPlay = true
	}

	restart(direction){
		this.resetData()

		if(direction){
			this.data.direction.current = direction

		}else if(this.data.direction.type === "alternate"){
			this.setAlternateDirection()
		}

		this.refreshCurrentValue()

		this.setPropValue(this.getStartValue())
		this.updateProgress(0)
	}

	resetData(){
		this.data.startDelay.current = 0
		this.data.endDelay.current = 0
		this.data.duration.current = -1
	}

	pause(){
		this.paused = true
	}

	resume(){
		this.paused = false
	}

	isFinished(){
		return this.running === false
	}

	isRunning(){
		return this.running && !this.isPaused()
	}

	isPaused(){
		return this.paused
	}
}

/**
 * @deprecated
 */
Eli.AnimeManager = {

	createDefaultData(){
		return {
			duration: 1,
			startDelay: 1,
			endDelay: 1,
			easing: "linear",
			direction: "normal",
			loop: 0,
			autoPlay: true,
			needSave: false,
		}
	},

	createAnimations(target, props, defaultData){
		const animations = []

		for(const name in props){
			const animeData = this.createAnimationData(target, name, props[name], defaultData)
			animations.push(new Eli.Anime(animeData))
		}

		return animations
	},

	createAnimationData(target, propName, propData, defData){
		const callBacks = this.initCallbacks(propData)
		const animeData = {
			target: target,
			propName: propName,
			value: this.initValue(propData, target[propName]),
			duration: this.initDuration(propData, defData),
			startDelay: this.initStartDelay(propData, defData),
			endDelay: this.initEndDelay(propData, defData),
			loop: this.initLoop(propData, defData),
			direction: this.initDirection(propData, defData),
			easing: propData.easing === undefined ? (defData.easing || "linear") : propData.easing,
			autoPlay: propData.autoPlay === undefined ? defData.autoPlay : propData.autoPlay,
			progress: 0,
			onStart: callBacks.onStart,
			onUpdate: callBacks.onUpdate,
			onComplete: callBacks.onComplete,
		}

		return animeData
	},

	initValue(propData, propValue){
		const value = {start: 0, target: 0}

		if(propData.value.constructor.name === "Array"){
			value.start = propData.value[0]
			value.target = propData.value[1]

		}else{
			value.start = propValue
			value.target = propData.value
		}

		return {
			start: value.start, 
			current: value.start, 
			target: value.target
		}
	},

	initDuration(propData, defData){
		return {
			current: -1, 
			target: (propData.duration === undefined ? defData.duration : propData.duration) || 1
		}
	},

	initStartDelay(propData, defData){
		return {
			current: 0, 
			target: (propData.startDelay === undefined ? defData.startDelay : propData.startDelay) || 1
		}
	},

	initEndDelay(propData, defData){
		return {
			current: 0, 
			target: (propData.endDelay === undefined ? defData.endDelay : propData.endDelay) || 1
		}
	},

	initLoop(propData, defData){
		const loop = propData.loop === undefined ? (defData.loop || 0) : propData.loop
		return {
			current: 0, 
			target: loop === true ? Infinity : loop
		}
	},

	initDirection(propData, defData){
		const dirType = propData.direction === undefined ? (defData.direction || "normal") : propData.direction
		return {
			type: dirType,
			current: dirType === "alternate" ? "normal" : dirType
		}
	},

	initCallbacks(propData){
		return {
			onStart: propData.onStart || new Function(),
			onUpdate: propData.onUpdate || new Function(),
			onComplete: propData.onComplete || new Function(),
		}
	},

}

/**
 * @deprecated
 */
Eli.AnimeTiny = class {

	constructor(targetObj, propName, targetValue, duration, easing, direction = "normal", loop = 0){
		this.initialize(targetObj, propName, targetValue, duration, easing, direction, loop)
	}

	initialize(targetObj, propName, targetValue, duration, easing, direction, loop){
		this.targetObj = targetObj
		this.propName = propName
		this.easing = easing
		this.targetDuration = duration
		this.targetDirection = direction
		this.targetValue = targetValue
		this.initialValue = this.targetObj[propName]
		this.loop = loop
		this.direction = "normal"
		this.duration = 0
		this.running = true
	}

	getStartValue(){
		return {
			"normal": this.initialValue,
			"reverse": this.targetValue,
		}[this.direction]
	}

	getTargetValue(){
		return {
			"normal": this.targetValue,
			"reverse": this.initialValue,
		}[this.direction]
	}

	setPropValue(value){
		this.targetObj[this.propName] = value
	}

	update(){
		if(this.duration < this.targetDuration){
			this.updateValue()
		}else if(this.loop !== 0){
			this.reverse()
		}else{
			this.running = false
		}
	}

	isRunning(){
		return this.running
	}

	refreshDirection(){
		if(this.targetDirection === "alternate"){
			this.direction = this.direction === "normal" ? "reverse" : "normal"
		}
	}

	reverse(){
		this.refreshDirection()
		this.duration = 0
		this.loop--
		this.running = true
	}

	updateValue(){
		this.duration++
		const elapsedTime = this.calculateTime()
		const value = this.processValue(this.getStartValue(), elapsedTime, this.getTargetValue())
		this.setPropValue(value)
		this.running = true
	}

	calculateTime(){
		const elapsedTime = this.duration / this.targetDuration
		return Eli.Easings.execute(this.easing, elapsedTime)
	}

	processValue(startValue, elapsedTime, endValue){
		return startValue + elapsedTime * (endValue - startValue)
	}

}

/**
 * @deprecated
 */
Eli.KeyCodes = {

	keyboard: {
		backspace:8, tab:9, enter:13, shift:16, ctrl:17, alt:18, pausebreak:19, capslock:20, 
		esc:27, space:32, pageup:33, pagedown:34, end:35, home:36, 
		leftarrow:37, uparrow:38, rightarrow:39, downarrow:40, insert:45, delete:46, 
		0:48, 1:49, 2:50, 3:51, 4:52, 5:53, 6:54, 7:55, 8:56, 9:57, 
		a:65, b:66, c:67, d:68, e:69, f:70, g:71, h:72, i:73, j:74, k:75, l:76, m:77, n:78, 
		o:79, p:80, q:81, r:82, s:83, t:84, u:85, v:86, w:87, x:88, y:89, z:90, 
		leftwindowkey:91, rightwindowkey:92, selectkey:93, 
		numpad0:96, numpad1:97, numpad2:98, numpad3:99, numpad4:100, numpad5:101, 
		numpad6:102, numpad7:103, numpad8:104, numpad9:105, 
		multiply:106, add:107, subtract:109, decimalpoint:110, divide:111, 
		f1:112, f2:113, f3:114, f4:115, f5:116, f6:117, f7:118, f8:119, f9:120, f10:121, f11:122, f12:123,
		numlock:144, scrolllock:145, semicolon:186, equalsign:187, comma:188, dash:189, period:190,
		forwardslash:191, graveaccent:192, openbracket:219, backslash:220, closebracket:221, singlequote:222
	},

	gamepad: {
		a: 0, b: 1, x: 2, y: 3, lb: 4, rb: 5, lt: 6, rt: 7, select: 8,
		start: 9, l3: 10, r3: 11, up: 12, down: 13, left: 14, right: 15
	},

	mouse: {
		left: 0,
		middle: 1,
		right: 2,
		back: 3,
		forward: 5,
	},

	defaultKeyboard: [
		9, 13, 16, 17, 18, 27, 32, 33, 34, 37, 38, 39, 
		40, 45, 81, 87, 88, 90, 96, 98, 100, 102, 104, 120
	],

	defaultGamepad: [0, 1, 2, 3, 4, 5, 12, 13, 14, 15],

	isDefaultKeyboard(keyCode){
		return this.defaultKeyboard.includes(keyCode)
	},

	isDefaultGamepad(keyCode){
		return this.defaultGamepad.includes(keyCode)
	},
}
