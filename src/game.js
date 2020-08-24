export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'game' });
  }

  create() {
    // Centro x, y : Size w, h
    let width = this.sys.game.config.width;
    let height = this.sys.game.config.height;
    let center_width = this.sys.game.config.width / 2;
    let center_height = this.sys.game.config.height / 2;

    this.damageTimer = 0;
    this.invulnerable = false;
    this.MAX_TIME = 1000;

    // Fondo de juego
    this.background = this.add.image(0, 0, "dungeon");
    this.background.setOrigin(0);
    this.background.setDisplaySize(width, height);

    // Paredes
    this.walls = this.physics.add.staticGroup();
    this.walls.create(0, 0, "leftwall").setOrigin(0).setDisplaySize(180, height).refreshBody();
    this.walls.create(1225, 0, "rightwall").setOrigin(0).setDisplaySize(180, height).refreshBody();
    this.walls.create(2, 650, "downwall").setOrigin(0).setDisplaySize(width, 180).refreshBody();
    this.walls.create(9, 0, "upwall_left").setOrigin(0).setDisplaySize(513, 147).refreshBody();
    this.walls.create(865, 0, "upwall_right").setOrigin(0).setDisplaySize(536, 147).refreshBody();

    // Puertas
    this.door = this.physics.add.sprite(515, 0, "door");
    this.door.setOrigin(0);
    this.door.setDisplaySize(350, 100);

    this.closeddoor = this.physics.add.sprite(515, 0, "closed_upwall");
    this.closeddoor.setOrigin(0);
    this.closeddoor.setDisplaySize(350, 140);
    this.closeddoor.setImmovable(true);

    // HUD con numero de vidas
    this.lives = 3;
    this.livesText = this.add.text(10, 10, 'Vidas:', { fontSize: '80px', fill: '#FFFF00' });

    // Sonidos
    this.arrowsound = this.sound.add('throwarrow');
    this.objectsound = this.sound.add('pickobject');

    // Input
    this.cursor = this.input.keyboard.createCursorKeys();
    this.cheat1 = this.input.keyboard.addKey('P');
    this.cheat2 = this.input.keyboard.addKey('O');

    // Animaciones
    this.setAnimations();

    //------------------------------------------------------------------------------------------

    // Personaje
    this.zelda = this.physics.add.sprite(center_width, center_height, 'zelda');
    this.zelda.body.setSize(18, 10);
    this.zelda.body.setOffset(3, 20);
    this.zelda.setScale(3);
    this.zelda.body.allowGravity = false;
    this.zelda.body.collideWorldBounds = true;
    this.hasBow = false;
    this.hasKey = false;

    this.rect = new Phaser.Geom.Rectangle(180, 150, 1040, 500);

    // Enemigos
    this.enemies = this.physics.add.group();
    this.rndPoint = this.rect.getRandomPoint();
    this.enemies.create(this.rndPoint.x, this.rndPoint.y, "enemy").setDisplaySize(100, 100).setImmovable(true).anims.play('idle');
    this.rndPoint = this.rect.getRandomPoint();
    this.enemies.create(this.rndPoint.x, this.rndPoint.y, "enemy").setDisplaySize(100, 100).setImmovable(true).anims.play('idle');
    this.rndPoint = this.rect.getRandomPoint();
    this.enemies.create(this.rndPoint.x, this.rndPoint.y, "enemy").setDisplaySize(100, 100).setImmovable(true).anims.play('idle');
    this.rndPoint = this.rect.getRandomPoint();
    this.enemies.create(this.rndPoint.x, this.rndPoint.y, "enemy").setDisplaySize(100, 100).setImmovable(true).anims.play('idle');
    this.numEnemies = 4;
    //this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x0000ff }, fillStyle: { color: 0xff0000 } });

    // Arco
    this.rndPoint = this.rect.getRandomPoint();
    this.bow = this.physics.add.sprite(this.rndPoint.x, this.rndPoint.y, 'bow');
    this.bow.setOrigin(0);
    this.bow.setScale(0.08);
    this.bow.setImmovable(true);

    // Flechas
    this.arrows = this.physics.add.group();

    // Colisiones
    this.physics.add.collider(this.zelda, this.walls);
    this.physics.add.overlap(this.zelda, this.enemies, this.loseLive, null, this);
    this.physics.add.collider(this.arrows, this.walls, this.hitWall, null, this);
    this.physics.add.collider(this.arrows, this.enemies, this.hitEnemy, null, this);
    this.physics.add.overlap(this.zelda, this.bow, this.bowPicked, null, this);
    this.physics.add.collider(this.zelda, this.closeddoor, this.checkdoor, null, this);
    this.physics.add.overlap(this.zelda, this.door, this.exitlevel, null, this);
  }

  update(time, delta) {
    // Handle Input
    this.handleInput(delta);

    // HUD
    this.livesText.setText('Vidas: ' + this.lives);

    // Logica
    if (this.lives <= 0) this.scene.start('lose');

    // Invulnerable
    if (this.invulnerable) {
      this.damageTimer += delta;
      if (this.damageTimer > this.MAX_TIME) {
        this.invulnerable = false;
        this.zelda.alpha = 1;
        this.damageTimer = 0;
      }
    }

    //this.graphics.fillCircle(this.rndPoint.x, this.rndPoint.y, 4);
    //this.graphics.strokeRectShape(this.rect);
  }

  handleInput(delta) {
    if (Phaser.Input.Keyboard.JustDown(this.cursor.space) && this.hasWeapon()) {
      this.shoot(delta);
    }
    else if (this.cursor.right.isDown) {
      if (this.zelda.anims.getCurrentKey() != 'walk_right') this.zelda.anims.play('walk_right');
      this.zelda.body.setVelocity(25 * delta, 0);
    }
    else if (this.cursor.left.isDown) {
      if (this.zelda.anims.getCurrentKey() != 'walk_left') this.zelda.anims.play('walk_left');
      this.zelda.body.setVelocity(-25 * delta, 0);
    }
    else if (this.cursor.down.isDown) {
      if (this.zelda.anims.getCurrentKey() != 'walk_down') this.zelda.anims.play('walk_down');
      this.zelda.body.setVelocity(0, 25 * delta);
    }
    else if (this.cursor.up.isDown) {
      if (this.zelda.anims.getCurrentKey() != 'walk_up') this.zelda.anims.play('walk_up');
      this.zelda.body.setVelocity(0, -25 * delta);
    }
    else if (Phaser.Input.Keyboard.JustUp(this.cursor.left)) {
      this.zelda.anims.play('idle_left');
      this.zelda.body.setVelocity(0, 0);
    }
    else if (Phaser.Input.Keyboard.JustUp(this.cursor.right)) {
      this.zelda.anims.play('idle_right');
      this.zelda.body.setVelocity(0, 0);
    }
    else if (Phaser.Input.Keyboard.JustUp(this.cursor.up)) {
      this.zelda.anims.play('idle_up');
      this.zelda.body.setVelocity(0, 0);
    }
    else if (Phaser.Input.Keyboard.JustUp(this.cursor.down)) {
      this.zelda.anims.play('idle_down');
      this.zelda.body.setVelocity(0, 0);
    }
    else if (Phaser.Input.Keyboard.JustDown(this.cheat1)) {
      this.loseLive(null, null);
    }
    else if (Phaser.Input.Keyboard.JustDown(this.cheat2)) {
      this.getKey();
    }
  }

  // comprobacion de que tienes arma
  hasWeapon() {
    return this.hasBow;
  }

  // se llama cuando colisionas con un enemigo
  loseLive(player, enemy) {
    if (!this.invulnerable) {
      this.lives--;
      this.invulnerable = true;
      this.zelda.alpha = 0.5;
    }
  }

  // se llama cuando colisiona jugador con arco
  bowPicked(player, bow) {
    bow.disableBody(true, true);
    this.hasBow = true;
    this.objectsound.play();
  }

  // se llama cuando colisionas con la puerta cerrada
  checkdoor(player, door) {
    if (this.hasKey)
      door.disableBody(true, true);
  }

  // se llama cuando atraviesas la puerta
  exitlevel(player, door) {
    this.scene.start('win');
  }

  // se llama cuando colisiona jugador con llave
  keyPicked(player, key) {
    key.disableBody(true, true);
    this.objectsound.play();
    this.hasKey = true;
  }

  // se llama cuando tienes el arco y pulsas barra espaciadora
  shoot(delta) {
    if (this.zelda.body.facing === Phaser.Physics.Arcade.FACING_RIGHT) {
      var arrow = this.arrows.create(this.zelda.x, this.zelda.y, "arrow_horiz");
      arrow.body.setVelocityX(30 * delta);
    }
    else if (this.zelda.body.facing === Phaser.Physics.Arcade.FACING_LEFT) {
      var arrow = this.arrows.create(this.zelda.x, this.zelda.y, "arrow_horiz");
      arrow.flipX = true;
      arrow.body.setVelocityX(-30 * delta);
    }
    else if (this.zelda.body.facing === Phaser.Physics.Arcade.FACING_UP) {
      var arrow = this.arrows.create(this.zelda.x, this.zelda.y, "arrow_vert");
      arrow.body.setVelocityY(-30 * delta);
    }
    else if (this.zelda.body.facing === Phaser.Physics.Arcade.FACING_DOWN) {
      var arrow = this.arrows.create(this.zelda.x, this.zelda.y, "arrow_vert");
      arrow.flipY = true;
      arrow.body.setVelocityY(30 * delta);
    }
    this.arrowsound.play();
  }

  hitWall(arrow, obstacle) {
    arrow.disableBody(true, true);
  }

  hitEnemy(arrow, enemy) {
    arrow.disableBody(true, true);
    enemy.disableBody(true, true);
    this.numEnemies--;
    if (this.numEnemies == 0) this.getKey();
  }

  // crea la llave
  getKey() {
    this.rndPoint = this.rect.getRandomPoint();
    this.key = this.physics.add.sprite(this.rndPoint.x, this.rndPoint.y, 'key');
    this.key.setOrigin(0);
    this.key.setScale(0.08);
    this.key.setImmovable(true);

    this.physics.add.overlap(this.zelda, this.key, this.keyPicked, null, this);
  }

  setAnimations() {
    this.anims.create({
      key: 'walk_up',
      frames: this.anims.generateFrameNumbers('zelda', {
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
          48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]
      }),
      frameRate: 16,
      repeat: -1
    });

    this.anims.create({
      key: 'walk_right',
      frames: this.anims.generateFrameNumbers('zelda', {
        frames: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
          60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71]
      }),
      frameRate: 16,
      repeat: -1
    });

    this.anims.create({
      key: 'walk_down',
      frames: this.anims.generateFrameNumbers('zelda', {
        frames: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
          72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83]
      }),
      frameRate: 16,
      repeat: -1
    });

    this.anims.create({
      key: 'walk_left',
      frames: this.anims.generateFrameNumbers('zelda', {
        frames: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
          84, 85, 86, 87, 88, 89, 90, 92, 93, 94, 95, 96]
      }),
      frameRate: 32,
      repeat: -1
    });

    this.anims.create({
      key: 'idle_down',
      frames: this.anims.generateFrameNumbers('zelda', {
        frames: [77]
      }),
      frameRate: 32,
      repeat: -1
    });

    this.anims.create({
      key: 'idle_right',
      frames: this.anims.generateFrameNumbers('zelda', {
        frames: [65]
      }),
      frameRate: 32,
      repeat: -1
    });

    this.anims.create({
      key: 'idle_left',
      frames: this.anims.generateFrameNumbers('zelda', {
        frames: [89]
      }),
      frameRate: 32,
      repeat: -1
    });

    this.anims.create({
      key: 'idle_up',
      frames: this.anims.generateFrameNumbers('zelda', {
        frames: [53]
      }),
      frameRate: 32,
      repeat: -1
    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('enemy'),
      frameRate: 2,
      repeat: -1
    });
  }
}