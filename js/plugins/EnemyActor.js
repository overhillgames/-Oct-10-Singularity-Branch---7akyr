//=============================================================================
// RPG Maker MZ - Enemy Actor
//=============================================================================

/*
MIT License

Copyright (c) 2021 VSMA

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*:
 * @target MZ
 * @plugindesc enable enemies with sv_actor sprites.
 * @author VSMA
 * 
 * @help
 * 
 * First, make a new enemy as usual, his sprite is not important, it's will be replaced
 * by a sv_actor
 * 
 * Then in the parameters of the plug-in:
 * - open the parameter enemy actors
 * - add a new element and fill in the parameters
 * - enemy: the is of enemy you made
 * - sv_actor: the sv_actor that will replace the enemy's sprite
 * - weapon : the id of a weapon. It's will be use only for the 
 *
 * @param ENEMY_ACTORS
 * @text enemy actors
 * @type struct<Sound>[]
 *
*/

/*~struct~Sound:
 * @param enemy
 * @type enemy
 *
 * @param sv_actor
 * @type file
 * @dir img/sv_actors/
 * @require 1
 * 
 * @param weapon
 * @type weapon
*/



(()=>{
    const ENEMY_ACTORS = PluginManager.parameters("EnemyActor")["ENEMY_ACTORS"];
    let enemyActorId = [];

    function parseEnemyActors(){
        let eaString = ENEMY_ACTORS;
        eaString = eaString.slice(2, -2);
        eaString = eaString.split("\",\"");

        for(let object of eaString){
            object = object.split("\\").join("");
            let json = JSON.parse(object);
            json.enemy = Number(json.enemy);
            json.weapon = Number(json.weapon);
            enemyActorId[json.enemy] = json;
        }
    }

    parseEnemyActors();

    class Game_EnemyActor extends Game_Battler{

        constructor(){
            super();
            this.initialize(...arguments);
        }
    
        isEnemyActor(){
            return true;
        }
    
        initialize = function(enemyActor, x, y) {
            Game_Battler.prototype.initialize.call(this);
            this.setup(enemyActor, x, y);
        };
    
        initMembers(){
            Game_Battler.prototype.initMembers.call(this);
            this._enemyId = 0;
            this._weapon = 0;
            this._sv_actor = "";
            this._letter = "";
            this._plural = false;
            this._screenX = 0;
            this._screenY = 0;
            
        }
    
        setup(enemyActor, x, y){
            this._enemyId = enemyActor.enemy;
            this._weapon = enemyActor.weapon;
            this._sv_actor = enemyActor.sv_actor;
            this._screenX = x;
            this._screenY = y;
            this.recoverAll();
        }
    
        isLetterEmpty() {
            return this._letter === "";
        }
    
        originalName() {
            return this.enemy().name;
        }
    
        enemy() {
            return  $dataEnemies[this._enemyId];
        }
    
        setLetter(letter) {
            this._letter = letter;
        }
    
        screenX() {
            return this._screenX;
        }
        
        screenY() {
            return this._screenY;
        }
    
        name() {
            return this.originalName() + (this._plural ? this._letter : "");
        }
    
        isSpriteVisible() {
            return true;
        }
    
        battlerName() {
            return this.enemy().battlerName;
        }
    
        battlerHue() {
            return this.enemy().battlerHue;
        }
    
        index() {
            return $gameTroop.members().indexOf(this);
        }
        
        isBattleMember() {
            return this.index() >= 0;
        }
    
        gold() {
            return this.enemy().gold;
        }
    
        exp() {
            return this.enemy().exp;
        };
    
        makeDropItems() {
            const rate = this.dropItemRate();
            return this.enemy().dropItems.reduce((r, di) => {
                if (di.kind > 0 && Math.random() * di.denominator < rate) {
                    return r.concat(this.itemObject(di.kind, di.dataId));
                } else {
                    return r;
                }
            }, []);
        };
    
        dropItemRate() {
            return $gameParty.hasDropItemDouble() ? 2 : 1;
        };
        
        friendsUnit() {
            return $gameTroop;
        }
    
        opponentsUnit() {
            return $gameParty;
        }
    
        enemyId() {
            return this._enemyId;
        }
    
        traitObjects() {
            return Game_Battler.prototype.traitObjects.call(this).concat(this.enemy());
        }
    
        paramBase(paramId) {
            return this.enemy().params[paramId];
        }
    
        itemObject(kind, dataId) {
            if (kind === 1) {
                return $dataItems[dataId];
            } else if (kind === 2) {
                return $dataWeapons[dataId];
            } else if (kind === 3) {
                return $dataArmors[dataId];
            } else {
                return null;
            }
        }
    
        transform(enemyId) {
            const name = this.originalName();
            this._enemyId = enemyId;
            if (this.originalName() !== name) {
                this._letter = "";
                this._plural = false;
            }
            this.refresh();
            if (this.numActions() > 0) {
                this.makeActions();
            }
        }
    
        meetsCondition(action) {
            const param1 = action.conditionParam1;
            const param2 = action.conditionParam2;
            switch (action.conditionType) {
                case 1:
                    return this.meetsTurnCondition(param1, param2);
                case 2:
                    return this.meetsHpCondition(param1, param2);
                case 3:
                    return this.meetsMpCondition(param1, param2);
                case 4:
                    return this.meetsStateCondition(param1);
                case 5:
                    return this.meetsPartyLevelCondition(param1);
                case 6:
                    return this.meetsSwitchCondition(param1);
                default:
                    return true;
            }
        }
    
        meetsTurnCondition(param1, param2) {
            const n = this.turnCount();
            if (param2 === 0) {
                return n === param1;
            } else {
                return n > 0 && n >= param1 && n % param2 === param1 % param2;
            }
        };
        
        meetsHpCondition(param1, param2) {
            return this.hpRate() >= param1 && this.hpRate() <= param2;
        };
        
        meetsMpCondition(param1, param2) {
            return this.mpRate() >= param1 && this.mpRate() <= param2;
        };
        
        meetsStateCondition(param) {
            return this.isStateAffected(param);
        };
        
        meetsPartyLevelCondition(param) {
            return $gameParty.highestLevel() >= param;
        };
        
        meetsSwitchCondition(param) {
            return $gameSwitches.value(param);
        };
        
        isActionValid(action) {
            return (
                this.meetsCondition(action) && this.canUse($dataSkills[action.skillId])
            );
        };
        
        selectAction(actionList, ratingZero) {
            const sum = actionList.reduce((r, a) => r + a.rating - ratingZero, 0);
            if (sum > 0) {
                let value = Math.randomInt(sum);
                for (const action of actionList) {
                    value -= action.rating - ratingZero;
                    if (value < 0) {
                        return action;
                    }
                }
            } else {
                return null;
            }
        };
        
        selectAllActions(actionList) {
            const ratingMax = Math.max(...actionList.map(a => a.rating));
            const ratingZero = ratingMax - 3;
            actionList = actionList.filter(a => a.rating > ratingZero);
            for (let i = 0; i < this.numActions(); i++) {
                this.action(i).setEnemyAction(
                    this.selectAction(actionList, ratingZero)
                );
            }
        };
        
        makeActions() {
            Game_Battler.prototype.makeActions.call(this);
            if (this.numActions() > 0) {
                const actionList = this.enemy().actions.filter(a =>
                    this.isActionValid(a)
                );
                if (actionList.length > 0) {
                    this.selectAllActions(actionList);
                }
            }
            this.setActionState("waiting");
        };
    
    
        /***************************************** */
    
        performActionStart(action) {
            Game_Battler.prototype.performActionStart.call(this, action);
            //this.requestEffect("whiten");
        };
        
        performAction(action) {
            Game_Battler.prototype.performAction.call(this, action);
            if (action.isAttack()) {
                this.performAttack();
            } else if (action.isGuard()) {
                this.requestMotion("guard");
            } else if (action.isMagicSkill()) {
                this.requestMotion("spell");
            } else if (action.isSkill()) {
                this.requestMotion("skill");
            } else if (action.isItem()) {
                this.requestMotion("item");
            }
        }
    
        performAttack(){
            
            const weapons = this.weapons();
            const wtypeId = weapons[0] ? weapons[0].wtypeId : 0;
            const attackMotion = $dataSystem.attackMotions[wtypeId];
            if (attackMotion) {
                if (attackMotion.type === 0) {
                    this.requestMotion("thrust");
                } else if (attackMotion.type === 1) {
                    this.requestMotion("swing");
                } else if (attackMotion.type === 2) {
                    this.requestMotion("missile");
                }
                this.startWeaponAnimation(attackMotion.weaponImageId);
            }
        }
    
        weapons(){
            return [$dataWeapons[this._weapon]];
        }
        
        performActionEnd() {
            Game_Battler.prototype.performActionEnd.call(this);
        }
    
        performDamage() {
            Game_Battler.prototype.performDamage.call(this);
            SoundManager.playEnemyDamage();
            this.requestMotion("damage");
        }
    
        performCollapse() {
            Game_Battler.prototype.performCollapse.call(this);
            switch (this.collapseType()) {
                case 0:
                    this.requestEffect("collapse");
                    SoundManager.playEnemyCollapse();
                    break;
                case 1:
                    this.requestEffect("bossCollapse");
                    SoundManager.playBossCollapse1();
                    break;
                case 2:
                    this.requestEffect("instantCollapse");
                    break;
            }
        }
    
        setPlural(plural) {
            this._plural = plural;
        }

        /*makeActionTimes() {
            return 2;
        }*/
        
        
    }
    
    class Sprite_EnemyActor extends Sprite_Battler{
    
        static MOTIONS = {
            walk: { index: 0, loop: true },
            wait: { index: 1, loop: true },
            chant: { index: 2, loop: true },
            guard: { index: 3, loop: true },
            damage: { index: 4, loop: false },
            evade: { index: 5, loop: false },
            thrust: { index: 6, loop: false },
            swing: { index: 7, loop: false },
            missile: { index: 8, loop: false },
            skill: { index: 9, loop: false },
            spell: { index: 10, loop: false },
            item: { index: 11, loop: false },
            escape: { index: 12, loop: true },
            victory: { index: 13, loop: true },
            dying: { index: 14, loop: true },
            abnormal: { index: 15, loop: true },
            sleep: { index: 16, loop: true },
            dead: { index: 17, loop: true }
        };
    
    
        constructor(battler){
            super(battler);
    
        }
    
        initMembers(){
            Sprite_Battler.prototype.initMembers.call(this);
            this._battlerName = "";
            this._motion = null;
            this._motionCount = 0;
            this._pattern = 0;
            this._battlerHue = 0;
            this.createShadowSprite();
            this.createWeaponSprite();
            this.createMainSprite();
            this.createStateSprite();
            this.createStateIconSprite();
        }

        
        createStateIconSprite(){
            this._stateIconSprite = new Sprite_StateIcon();
            this.addChild(this._stateIconSprite);
        };
    
        mainSprite() {
            return this._mainSprite;
        }
    
        createShadowSprite() {
            this._shadowSprite = new Sprite();
            this._shadowSprite.bitmap = ImageManager.loadSystem("Shadow2");
            this._shadowSprite.anchor.x = 0.5;
            this._shadowSprite.anchor.y = 0.5;
            this._shadowSprite.y = -2;
            this.addChild(this._shadowSprite);
        }
    
        update(){
            Sprite_Battler.prototype.update.call(this);
            this.updateShadow();
            if (this._enemy) {
                this.updateMotion();
                this.updateVisibility();
                this.updateStateSprite();
            }
        }

        updateStateSprite() {
            this._stateIconSprite.y = -Math.round((this._mainSprite.bitmap.height/6 + 40) * 0.9);
            if (this._stateIconSprite.y < 20 - this.y) {
                this._stateIconSprite.y = 20 - this.y;
            }
        }

        updateVisibility() {
            this._appeared = this._enemy.isAlive();
            if (this._appeared) {
                this.opacity = 255;
            }
        };
    
        updateShadow() {
            this._shadowSprite.visible = !!this._enemy;
        }
    
        createWeaponSprite() {
            this._weaponSprite = new Sprite_Weapon();
            this.addChild(this._weaponSprite);
        }
    
        createMainSprite() {
            this._mainSprite = new Sprite();
            this._mainSprite.anchor.x = 0.5;
            this._mainSprite.anchor.y = 1;
            this.addChild(this._mainSprite);
        }
    
        createStateSprite() {
            this._stateSprite = new Sprite_StateOverlay();
            this.addChild(this._stateSprite);
        }
    
        updateBitmap() {
            Sprite_Battler.prototype.updateBitmap.call(this);
            const name = this._enemy._sv_actor;
            const hue = this._enemy.battlerHue();
            if (this._battlerName !== name) {
                this._battlerName = name;
                let bitmap = ImageManager.loadSvActor(name);
                this.scale.x = -1;
                this._mainSprite.bitmap = bitmap
                this._battlerHue = hue;
                this.setHue(hue);
                this.initVisibility();
            }
        }

        setHue(hue) {
            Sprite.prototype.setHue.call(this, hue);

            for (let i = 0; i < this.children.length; i++){
                if (i === 2) continue;
                const child = this.children[i];
                if (child.setHue){
                    child.setHue(-hue);
                }
            }
        }
    
        setBattler(battler) {
            Sprite_Battler.prototype.setBattler.call(this, battler);
            this._enemy = battler;
            this.setHome(battler.screenX(), battler.screenY());
            this._stateIconSprite.setup(battler);
        }
    
        updateMotion() {
            this.setupMotion();
            this.setupWeaponAnimation();
            if (this._enemy.isMotionRefreshRequested()) {
                this.refreshMotion();
                this._enemy.clearMotion();
            }
            this.updateMotionCount();
        }
    
        setupMotion() {
            if (this._enemy.isMotionRequested()) {
                this.startMotion(this._enemy.motionType());
                this._enemy.clearMotion();
            }
        }
    
        setupWeaponAnimation() {
            if (this._enemy.isWeaponAnimationRequested()) {
                this._weaponSprite.setup(this._enemy.weaponImageId());
                this._enemy.clearWeaponAnimation();
            }
        }
    
        updateMotionCount(){
            
            if (this._motion && ++this._motionCount >= this.motionSpeed()) {
                if (this._motion.loop) {
                    this._pattern = (this._pattern + 1) % 4;
                } else if (this._pattern < 2) {
                    this._pattern++;
                    
                } else {
                    this.refreshMotion();
                }
                this._motionCount = 0;
            }
        }
    
        refreshMotion() {
            const actor = this._enemy;
            if (actor) {
                const stateMotion = actor.stateMotionIndex();
                if (stateMotion === 3) {
                    this.startMotion("dead");
                } else if (stateMotion === 2) {
                    this.startMotion("sleep");
                } else if (actor.isChanting()) {
                    this.startMotion("chant");
                } else if (actor.isGuard() || actor.isGuardWaiting()) {
                    this.startMotion("guard");
                } else if (stateMotion === 1) {
                    this.startMotion("abnormal");
                } else if (this.isMoving()) {
                    this.startMotion("walk");
                } else if (actor.isDying()) {
                    this.startMotion("dying");
                }  else {
                    this.startMotion("wait");
                }
            }
        }
    
        startMotion(motionType) {
            const newMotion = Sprite_Actor.MOTIONS[motionType];
            if (this._motion !== newMotion) {
                this._motion = newMotion;
                this._motionCount = 0;
                this._pattern = 0;
            }
        }
    
        motionSpeed() {
            return 12;
        }
    
        updateFrame(){
            Sprite_Battler.prototype.updateFrame.call(this);
            const bitmap = this._mainSprite.bitmap;
            if (bitmap) {
                const motionIndex = this._motion ? this._motion.index : 0;
                const pattern = this._pattern < 3 ? this._pattern : 1;
                const cw = bitmap.width / 9;
                const ch = bitmap.height / 6;
                const cx = Math.floor(motionIndex / 6) * 3 + pattern;
                const cy = motionIndex % 6;
                this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch);
                this.setFrame(0, 0, cw, ch);
            }
        }
    
        updateTargetPosition() {
            if (this.shouldStepForward()) {
                this.stepForward();
            } else if (!this.inHomePosition()) {
                this.stepBack();
            }
        }
    
        shouldStepForward() {
            return this._enemy.isActing();
        }
    
        stepForward() {
            this.startMove(48, 0, 12);
        }
    
        stepBack = function() {
            this.startMove(0, 0, 12);
        }
    
        updateMain() {
            Sprite_Battler.prototype.updateMain.call(this);
            if (this._enemy.isSpriteVisible() && !this.isMoving()) {
                this.updateTargetPosition();
            }
        }
    
        setupWeaponAnimation = function() {
            
            if (this._enemy.isWeaponAnimationRequested()) {
                this._weaponSprite.setup(this._enemy.weaponImageId());
                this._enemy.clearWeaponAnimation();
            }
        }

        initVisibility() {
            this._appeared = this._enemy.isAlive();
            if (!this._appeared) {
                this.opacity = 0;
            }
        };
    }
    

    Game_BattlerBase.prototype.isEnemyActor = function(){
        return false;
    }

    Game_Troop.prototype.requestMotionRefresh = function(){
        for(const enemy in this.member){
            if(enemy.isEnemyActor()){
                enemy.requestMotionRefresh();
            }
        }
    }

    Game_Troop.prototype.setup = function(troopId) {
        this.clear();
        this._troopId = troopId;
        this._enemies = [];
        for (const member of this.troop().members) {
            if ($dataEnemies[member.enemyId]) {
                const enemyId = member.enemyId;
                const x = member.x;
                const y = member.y;

                if (!!enemyActorId[enemyId]){
                    
                    const enemy = new Game_EnemyActor(enemyActorId[enemyId], x, y);
                    
                    if (member.hidden) {
                        enemy.hide();
                    }
                    this._enemies.push(enemy);
                }

                else{
                    const enemy = new Game_Enemy(enemyId, x, y);
                    if (member.hidden) {
                        enemy.hide();
                    }
                    this._enemies.push(enemy);
                }

                
                
            }
        }
        this.makeUniqueNames();
    };

    Game_Troop.prototype.requestMotionRefresh = function() {
        for (const member of this.members()) {
            member.requestMotionRefresh();
        }
    }

    Spriteset_Battle.prototype.createEnemies = function() {
        const enemies = $gameTroop.members();
        const sprites = [];
        for (const enemy of enemies) {

            if(enemy.isEnemyActor()){
                sprites.push(new Sprite_EnemyActor(enemy));
            }
            else{
                sprites.push(new Sprite_Enemy(enemy));
            }

            
        }
        sprites.sort(this.compareEnemySprite.bind(this));
        for (const sprite of sprites) {
            this._battleField.addChild(sprite);
        }
        this._enemySprites = sprites;
    }

    const BattleManager_updateEventMain = BattleManager.updateEventMain;
    BattleManager.updateEventMain = function() {
        $gameTroop.requestMotionRefresh();
        return BattleManager_updateEventMain.call(this);
    };

    const BattleManager_startTurn = BattleManager.startTurn;
    BattleManager.startTurn = function() {
        $gameTroop.requestMotionRefresh();
        BattleManager_startTurn.call(this);
    };
    
    const BattleManager_updateTurn = BattleManager.updateTurn;
    BattleManager.updateTurn = function(timeActive) {
        $gameTroop.requestMotionRefresh();
        BattleManager_updateTurn.call(this, timeActive);
    };


})();
