UITankSprite = function(game, gameController, emptyBarrelSounds, fireBulletSounds, fireLaserSound, fireShotgunSound, fireMissileSound, fireMineSound, chargeGatlingGunSound, holdGatlingGunSound, dischargeGatlingGunSound, pickupLaserSound, pickupDoubleBarrelSound, pickupShotgunSound, pickupMissileSound, pickupMineSound, pickupGatlingGunSound, pickupShieldSound, loadWeaponSound, dustEmitter, launchEmitter) {
    Phaser.Sprite.call(this, game, 0, 0, 'tankSprites', 'base');
    this.gameController = gameController;
    this.emptyBarrelSounds = emptyBarrelSounds;
    this.fireBulletSounds = fireBulletSounds;
    this.fireLaserSound = fireLaserSound;
    this.fireShotgunSound = fireShotgunSound;
    this.fireMissileSound = fireMissileSound;
    this.fireMineSound = fireMineSound;
    this.chargeGatlingGunSound = chargeGatlingGunSound;
    this.holdGatlingGunSound = holdGatlingGunSound;
    this.dischargeGatlingGunSound = dischargeGatlingGunSound;
    this.pickupLaserSound = pickupLaserSound;
    this.pickupDoubleBarrelSound = pickupDoubleBarrelSound;
    this.pickupShotgunSound = pickupShotgunSound;
    this.pickupMissileSound = pickupMissileSound;
    this.pickupMineSound = pickupMineSound;
    this.pickupGatlingGunSound = pickupGatlingGunSound;
    this.pickupShieldSound = pickupShieldSound;
    this.loadWeaponSound = loadWeaponSound;
    this.dustEmitter = dustEmitter;
    this.launchEmitter = launchEmitter;
    this.game.physics.p2.enable(this);
    this.body.allowSleep = false;
    this.body.kinematic = true;
    this.body.setRectangle(Constants.TANK.WIDTH.px, Constants.TANK.HEIGHT.px);
    this.body.addRectangle(Constants.BULLET_TURRET.WIDTH.px, Constants.BULLET_TURRET.HEIGHT.px, Constants.BULLET_TURRET.OFFSET_X.px, Constants.BULLET_TURRET.OFFSET_Y.px);
    this.body.setCollisionGroup(UIUtils.tankCollisionGroup);
    this.body.collides([UIUtils.fragmentCollisionGroup, UIUtils.rayCollisionGroup]);
    this.scale.setTo(UIConstants.GAME_ASSET_SCALE, UIConstants.GAME_ASSET_SCALE);
    this.leftTread = this.addChild(new Phaser.Image(game,UIConstants.TANK_LEFT_TREAD_X,0,'tankSprites','tread'));
    this.leftTread.anchor.setTo(0.5, 0.5);
    this.leftTreadShade = this.addChild(new Phaser.Image(game,UIConstants.TANK_LEFT_TREAD_X,0,'tankSprites','treadShade0'));
    this.leftTreadShade.anchor.setTo(0.5, 0.5);
    this.rightTread = this.addChild(new Phaser.Image(game,UIConstants.TANK_RIGHT_TREAD_X,0,'tankSprites','tread'));
    this.rightTread.anchor.setTo(0.5, 0.5);
    this.rightTreadShade = this.addChild(new Phaser.Image(game,UIConstants.TANK_RIGHT_TREAD_X,0,'tankSprites','treadShade0'));
    this.rightTreadShade.anchor.setTo(0.5, 0.5);
    this.turret = this.addChild(new Phaser.Image(game,0,UIConstants.TANK_TURRET_Y,'tankSprites','turret0'));
    this.turret.anchor.setTo(0.5, 0.5);
    this.leftTreadPosition = 0.0;
    this.rightTreadPosition = 0.0;
    this.kill();
}
;
UITankSprite.prototype = Object.create(Phaser.Sprite.prototype);
UITankSprite.prototype.constructor = UITankSprite;
UITankSprite.prototype._getAtlas = function (texSuffix) {
    const key = texSuffix ? `tankSprites${texSuffix}` : 'tankSprites';
    if (!this.game.cache.checkImageKey(key)) {
        return 'tankSprites';
    }
    return key;
};
UITankSprite.prototype.update = function() {
    if (!this.exists) {
        return;
    }
    var tank = this.gameController.getTank(this.playerId);
    if (tank) {
        this.smoothedX = (this.body.x * this.smoothing + UIUtils.mpx(tank.getX())) / (this.smoothing + 1);
        this.smoothedY = (this.body.y * this.smoothing + UIUtils.mpx(tank.getY())) / (this.smoothing + 1);
        this.smoothedRotation = (this.body.rotation * this.smoothing + tank.getRotation()) / (this.smoothing + 1);
        var deltaTime = this.game.time.physicsElapsedMS;
        if (tank.getSpeed() > 0.0) {
            var ratio = tank.getSpeed() / Constants.TANK.FORWARD_SPEED.m;
            if (tank.getRotationSpeed() < 0.0) {
                this.leftTreadPosition += deltaTime * ratio * UIConstants.TANK_TREAD_INNER_FORWARD_SPEED;
                this.rightTreadPosition += deltaTime * ratio * UIConstants.TANK_TREAD_FORWARD_SPEED;
            } else if (tank.getRotationSpeed() > 0.0) {
                this.leftTreadPosition += deltaTime * ratio * UIConstants.TANK_TREAD_FORWARD_SPEED;
                this.rightTreadPosition += deltaTime * ratio * UIConstants.TANK_TREAD_INNER_FORWARD_SPEED;
            } else {
                this.leftTreadPosition += deltaTime * ratio * UIConstants.TANK_TREAD_FORWARD_SPEED;
                this.rightTreadPosition += deltaTime * ratio * UIConstants.TANK_TREAD_FORWARD_SPEED;
            }
        } else if (tank.getSpeed() < 0.0) {
            var ratio = -tank.getSpeed() / Constants.TANK.BACK_SPEED.m;
            if (tank.getRotationSpeed() < 0.0) {
                this.leftTreadPosition -= deltaTime * ratio * UIConstants.TANK_TREAD_INNER_BACK_SPEED;
                this.rightTreadPosition -= deltaTime * ratio * UIConstants.TANK_TREAD_BACK_SPEED;
            } else if (tank.getRotationSpeed() > 0.0) {
                this.leftTreadPosition -= deltaTime * ratio * UIConstants.TANK_TREAD_BACK_SPEED;
                this.rightTreadPosition -= deltaTime * ratio * UIConstants.TANK_TREAD_INNER_BACK_SPEED;
            } else {
                this.leftTreadPosition -= deltaTime * ratio * UIConstants.TANK_TREAD_BACK_SPEED;
                this.rightTreadPosition -= deltaTime * ratio * UIConstants.TANK_TREAD_BACK_SPEED;
            }
        } else {
            if (tank.getRotationSpeed() < 0.0) {
                this.leftTreadPosition -= deltaTime * UIConstants.TANK_TREAD_TURN_SPEED;
                this.rightTreadPosition += deltaTime * UIConstants.TANK_TREAD_TURN_SPEED;
            } else if (tank.getRotationSpeed() > 0.0) {
                this.leftTreadPosition += deltaTime * UIConstants.TANK_TREAD_TURN_SPEED;
                this.rightTreadPosition -= deltaTime * UIConstants.TANK_TREAD_TURN_SPEED;
            }
        }
        this.leftTreadPosition = (this.leftTreadPosition + 12) % 12;
        this.rightTreadPosition = (this.rightTreadPosition + 12) % 12;
        const shadeFrames = this._getAtlas(this.treadShadeTex);
        const leftFrame = 'treadShade' + Math.floor(this.leftTreadPosition);
        const rightFrame = 'treadShade' + Math.floor(this.rightTreadPosition);
        const frameData = this.game.cache.getFrameData(shadeFrames);
        const leftTreadShadeFrame =
            frameData && frameData.getFrameByName(leftFrame)
                ? shadeFrames
                : 'tankSprites';
        const rightTreadShadeFrame =
            frameData && frameData.getFrameByName(rightFrame)
                ? shadeFrames
                : 'tankSprites';
        this.leftTreadShade.loadTexture(leftTreadShadeFrame, leftFrame);
        this.rightTreadShade.loadTexture(rightTreadShadeFrame, rightFrame);
        var activeWeapon = this.gameController.getActiveWeapon(this.playerId);
        if (activeWeapon) {
            switch (activeWeapon.getType()) {
            case Constants.WEAPON_TYPES.GATLING_GUN:
                {
                    this._updateTurret(activeWeapon);
                    this._updateWeaponSound(activeWeapon);
                    break;
                }
            }
        }
    }
    this.body.x = this.smoothedX;
    this.body.y = this.smoothedY;
    this.body.rotation = this.smoothedRotation;
}
;
UITankSprite.prototype.spawn = function (
  x,
  y,
  rotation,
  playerId,
  animate,
  smoothing
) {
  this.reset(x, y);
  this.body.rotation = rotation;
  this.scale.setTo(
    UIConstants.GAME_ASSET_SCALE,
    UIConstants.GAME_ASSET_SCALE
  );
  this.smoothedX = x;
  this.smoothedY = y;
  this.smoothedRotation = rotation;
  this.smoothing = smoothing;
  this.playerId = playerId;
  this.turret.animations.play("idleBullet");
  if (animate) {
    this.scale.setTo(0.01, 0.01);
    this.spawnTween = this.game.add
      .tween(this.scale)
      .to(
        { x: UIConstants.GAME_ASSET_SCALE, y: UIConstants.GAME_ASSET_SCALE },
        UIConstants.CRATE_SPAWN_TIME,
        UIUtils.easingCubicBezier(0.01, 1.5, 1.5, 1),
        true
      );
    this.spawnTween.onComplete.add(function () {
      this.game.sound.play("tankLand", 0.6);
      this.dustEmitter.spawn(this.x, this.y);
    }, this);
  }
  var self = this;
  Backend.getInstance().getPlayerDetails(
    function (result) {
      if (typeof result === "object") {
        const base = result.getBaseColour();
        const tread = result.getTreadColour();
        const turret = result.getTurretColour();
        const baseTex =
          base.type === "image" &&
          Array.isArray(Constants.supportedPaints) &&
          Constants.supportedPaints.includes(base.imageValue)
            ? "-" + base.imageValue
            : "";
        const treadTex =
          tread.type === "image" &&
          Array.isArray(Constants.supportedPaints) &&
          Constants.supportedPaints.includes(tread.imageValue)
            ? "-" + tread.imageValue
            : "";
        self.treadShadeTex =
          tread.type === "image" &&
          Array.isArray(Constants.supportedPaints) &&
          Constants.supportedPaints.includes(tread.imageValue)
            ? "-" + tread.imageValue
            : "";
        const turretTex =
          turret.type === "image" &&
          Array.isArray(Constants.supportedPaints) &&
          Constants.supportedPaints.includes(turret.imageValue)
            ? "-" + turret.imageValue
            : "";
        const baseAtlas = self._getAtlas(baseTex);
        const treadAtlas = self._getAtlas(treadTex);
        const turretAtlas = self._getAtlas(turretTex);
        const shadeAtlas = self._getAtlas(self.treadShadeTex);
        self.loadTexture(baseAtlas, "base");
        self.leftTread.loadTexture(treadAtlas, "tread");
        self.rightTread.loadTexture(treadAtlas, "tread");
        self.leftTreadShade.loadTexture(shadeAtlas, "treadShade0");
        self.rightTreadShade.loadTexture(shadeAtlas, "treadShade0");
        self.turret.loadTexture(turretAtlas, "turret0");
        self.tint = baseTex ? 0xffffff : base.numericValue;
        self.leftTread.tint = treadTex ? 0xffffff : tread.numericValue;
        self.rightTread.tint = treadTex ? 0xffffff : tread.numericValue;
        self.turret.tint = turretTex ? 0xffffff : turret.numericValue;
        self.turret.animations._anims = {};
        self.turret.animations.add(
          "idleBullet",
          ["turret0"],
          24,
          false
        );
        self.turret.animations
          .add(
            "fireBullet",
            ["turret1", "turret2"],
            24,
            false
          )
          .onComplete.add(function () {
            self.turret.animations.play("idleBullet");
          });
        self.turret.animations.add(
          "idleLaser",
          ["turret3"],
          24,
          false
        );
        self.turret.animations.add(
          "idleDoubleBarrel",
          ["turret4"],
          24,
          false
        );
        self.turret.animations
          .add(
            "fireDoubleBarrelLeft",
            ["turret5", "turret6"],
            24,
            false
          )
          .onComplete.add(function () {
            self.turret.animations.play("idleDoubleBarrel");
          });
        self.turret.animations
          .add(
            "fireDoubleBarrelRight",
            ["turret7", "turret8"],
            24,
            false
          )
          .onComplete.add(function () {
            self.turret.animations.play("idleDoubleBarrel");
          });
        self.turret.animations.add(
          "idleShotgun",
          ["turret9"],
          24,
          false
        );
        self.turret.animations
          .add(
            "fireShotgun",
            [
              "turret9",
              "turret9",
              "turret9",
              "turret9",
              "turret9",
              "turret9",
              "turret10",
              "turret11",
              "turret11",
              "turret11",
              "turret11",
              "turret11",
              "turret11",
              "turret10",
              "turret9",
              "turret9",
              "turret9",
              "turret9"
            ],
            24,
            false
          )
          .onComplete.add(function () {
            self.turret.animations.play("idleShotgun");
          });
        self.turret.animations.add(
          "idleHomingMissile",
          ["turret12"],
          24,
          false
        );
        self.turret.animations.add(
          "fireHomingMissile",
          ["turret13"],
          24,
          false
        );
        self.turret.animations.add(
          "idleMine",
          ["turret14"],
          24,
          false
        );
        self.turret.animations.add(
          "idleGatlingGun",
          ["turret15"],
          24,
          false
        );
        self.turret.animations
          .add(
            "fireGatlingGun",
            ["turret15", "turret16"],
            24,
            false
          )
          .onComplete.add(function () {
            var activeWeapon = self.gameController.getActiveWeapon(self.playerId);
            if (activeWeapon) {
              var frameRate =
                UIConstants.GATLING_GUN_MIN_ANIMATION_SPEED +
                Math.floor(
                  UIConstants.GATLING_GUN_ANIMATION_SPEED_RANGE *
                    activeWeapon.getField("weaponCharge")
                );

              self.turret.animations.play("fireGatlingGun", frameRate);
            }
          });
        self.turret.animations.play("idleBullet");
      } else {
        self.tint = UIConstants.TANK_UNAVAILABLE_COLOUR.numericValue;
        self.turret.tint = UIConstants.TANK_UNAVAILABLE_COLOUR.numericValue;
        self.leftTread.tint = UIConstants.TANK_UNAVAILABLE_COLOUR.numericValue;
        self.rightTread.tint = UIConstants.TANK_UNAVAILABLE_COLOUR.numericValue;
      }
    },
    function () {},
    function () {},
    this.playerId,
    Caches.getPlayerDetailsCache()
  );
}
;
UITankSprite.prototype.addWeapon = function(weapon, animate) {
    var activeWeapon = this.gameController.getActiveWeapon(this.playerId);
    var defaultWeapon = this.gameController.getDefaultWeapon(this.playerId);
    var queuedWeapons = this.gameController.getQueuedWeapons(this.playerId);
    if (activeWeapon) {
        if (animate) {
            if ((defaultWeapon && weapon.getId() !== defaultWeapon.getId()) || queuedWeapons.length > 0) {
                switch (weapon.getType()) {
                case Constants.WEAPON_TYPES.LASER:
                    {
                        this.pickupLaserSound.play();
                        break;
                    }
                case Constants.WEAPON_TYPES.DOUBLE_BARREL:
                    {
                        this.pickupDoubleBarrelSound.play();
                        break;
                    }
                case Constants.WEAPON_TYPES.SHOTGUN:
                    {
                        this.pickupShotgunSound.play();
                        break;
                    }
                case Constants.WEAPON_TYPES.HOMING_MISSILE:
                    {
                        this.pickupMissileSound.play();
                        break;
                    }
                case Constants.WEAPON_TYPES.MINE:
                    {
                        this.pickupMineSound.play();
                        break;
                    }
                case Constants.WEAPON_TYPES.GATLING_GUN:
                    {
                        this.pickupGatlingGunSound.play();
                        break;
                    }
                }
            }
        }
        if (weapon.getId() === activeWeapon.getId()) {
            this._updateTurret(activeWeapon);
        }
    }
}
;
UITankSprite.prototype.removeWeapon = function() {
    var activeWeapon = this.gameController.getActiveWeapon(this.playerId);
    if (activeWeapon) {
        var defaultWeapon = this.gameController.getDefaultWeapon(this.playerId);
        if (activeWeapon !== defaultWeapon) {
            this.loadWeaponSound.play();
        }
        this._updateTurret(activeWeapon);
    }
}
;
UITankSprite.prototype.addUpgrade = function(upgrade, animate) {
    if (animate) {
        switch (upgrade.getType()) {
        case Constants.UPGRADE_TYPES.SHIELD:
            {
                this.pickupShieldSound.play();
                break;
            }
        }
    }
}
;
UITankSprite.prototype.fire = function() {
    var activeWeapon = this.gameController.getActiveWeapon(this.playerId);
    if (activeWeapon) {
        switch (activeWeapon.getType()) {
        case Constants.WEAPON_TYPES.BULLET:
            {
                this.fireBulletSounds[Math.floor(Math.random() * UIConstants.FIRE_BULLET_AUDIO_COUNT)].play();
                this.turret.animations.play('fireBullet');
                break;
            }
        case Constants.WEAPON_TYPES.LASER:
            {
                this.fireLaserSound.play();
                break;
            }
        case Constants.WEAPON_TYPES.DOUBLE_BARREL:
            {
                this.fireBulletSounds[Math.floor(Math.random() * UIConstants.FIRE_BULLET_AUDIO_COUNT)].play();
                if (activeWeapon.getField("leftBarrel")) {
                    this.turret.animations.play('fireDoubleBarrelLeft');
                } else {
                    this.turret.animations.play('fireDoubleBarrelRight');
                }
                break;
            }
        case Constants.WEAPON_TYPES.SHOTGUN:
            {
                this.fireShotgunSound.play();
                this.turret.animations.play('fireShotgun');
                break;
            }
        case Constants.WEAPON_TYPES.HOMING_MISSILE:
            {
                this.fireMissileSound.play();
                this.launchEmitter.spawn(this.x, this.y, this.rotation);
                this.turret.animations.play('fireHomingMissile');
                break;
            }
        case Constants.WEAPON_TYPES.MINE:
            {
                this.fireMineSound.play();
                break;
            }
        case Constants.WEAPON_TYPES.GATLING_GUN:
            {
                this.fireBulletSounds[Math.floor(Math.random() * UIConstants.FIRE_BULLET_AUDIO_COUNT)].play();
                break;
            }
        }
    }
}
;
UITankSprite.prototype.emptyBarrel = function() {
    this.emptyBarrelSounds[Math.floor(Math.random() * UIConstants.EMPTY_BARREL_AUDIO_COUNT)].play();
}
UITankSprite.prototype.remove = function() {
    if (this.spawnTween) {
        this.spawnTween.stop();
    }
    this.holdGatlingGunSound.stop();
    this.dischargeGatlingGunSound.stop();
    this.kill();
}
UITankSprite.prototype.retire = function() {
    if (this.spawnTween) {
        this.spawnTween.stop();
    }
    this.holdGatlingGunSound.stop();
    this.dischargeGatlingGunSound.stop();
    this.kill();
}
;
UITankSprite.prototype._updateTurret = function(weapon) {
    switch (weapon.getType()) {
    case Constants.WEAPON_TYPES.BULLET:
        {
            this.turret.animations.play('idleBullet');
            break;
        }
    case Constants.WEAPON_TYPES.LASER:
        {
            this.turret.animations.play('idleLaser');
            break;
        }
    case Constants.WEAPON_TYPES.DOUBLE_BARREL:
        {
            this.turret.animations.play('idleDoubleBarrel');
            break;
        }
    case Constants.WEAPON_TYPES.SHOTGUN:
        {
            this.turret.animations.play('idleShotgun');
            break;
        }
    case Constants.WEAPON_TYPES.HOMING_MISSILE:
        {
            if (!weapon.getField('launched')) {
                this.turret.animations.play('idleHomingMissile');
            } else {
                this.turret.animations.play('fireHomingMissile');
            }
            break;
        }
    case Constants.WEAPON_TYPES.MINE:
        {
            this.turret.animations.play('idleMine');
            break;
        }
    case Constants.WEAPON_TYPES.GATLING_GUN:
        {
            var weaponCharge = weapon.getField('weaponCharge');
            if (weaponCharge > 0.0) {
                var frameRate = UIConstants.GATLING_GUN_MIN_ANIMATION_SPEED + Math.floor(UIConstants.GATLING_GUN_ANIMATION_SPEED_RANGE * weaponCharge);
                this.turret.animations.play('fireGatlingGun', frameRate);
            } else {
                this.turret.animations.play('idleGatlingGun');
            }
            break;
        }
    }
}
;
UITankSprite.prototype._updateWeaponSound = function(weapon) {
    switch (weapon.getType()) {
    case Constants.WEAPON_TYPES.GATLING_GUN:
        {
            var weaponCharge = weapon.getField('weaponCharge');
            if (weapon.getField('triggerPulled')) {
                if (weaponCharge < 1.0) {
                    var startPosition = weaponCharge * 0.6;
                    this.chargeGatlingGunSound.play('', startPosition, 0.6, false, false);
                    this.holdGatlingGunSound.stop();
                    this.dischargeGatlingGunSound.stop();
                } else {
                    this.chargeGatlingGunSound.stop();
                    this.holdGatlingGunSound.play('', 0, 0.6, true, false);
                    this.dischargeGatlingGunSound.stop();
                }
            } else {
                if (weaponCharge > 0.0) {
                    var startPosition = (1.0 - weaponCharge) * 2.0 + 0.1;
                    this.chargeGatlingGunSound.stop();
                    this.holdGatlingGunSound.stop()
                    this.dischargeGatlingGunSound.play('', startPosition, 0.6, false, false);
                }
            }
            break;
        }
    }
}
