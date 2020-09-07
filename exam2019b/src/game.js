export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'main' });
  }
  preload() {
    this.load.image('sky', './assets/sky.png');
    this.load.image('platform', './assets/platform.png');
    this.load.image('base', './assets/base.png');
    this.load.image('star', './assets/star.png');
    this.load.spritesheet('player', './assets/dude_1.png', { frameWidth: 32, frameHeight: 48 });

    this.load.audio('starCollected', "./assets/star.mp3");
    this.load.audio('win', "./assets/win.mp3");
  }

  create() {
    // FONDO DE JUEGO
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.background = this.add.image(0, 0, 'sky');
    this.background.setOrigin(0);
    this.background.setDisplaySize(this.width, this.height);

    // ANIMACIONES
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [0, 1, 2, 3]
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [4]
      })
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [5, 6, 7, 8]
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [9]
      }),
      frameRate: 10,
      repeat: -1
    });

    // PERSONAJE
    this.player = this.physics.add.sprite(this.width / 2, this.height - 150, 'player');
    this.player.body.collideWorldBounds = true;
    this.player.setScale(1.5);

    this.points = 0;
    this.pointText = this.add.text(10, 10, 'PUNTOS: ', { fontSize: '80px', fill: '#FFFFFF' });

    // CONTROLES
    this.cursors = this.input.keyboard.createCursorKeys();

    // SONIDOS
    this.starSound = this.sound.add('starCollected');
    this.winSound = this.sound.add('win');

    // PLATAFORMAS
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(0, this.height - 20, 'platform').setOrigin(0).setDisplaySize(this.width, 20).refreshBody();
    var platform = this.platforms.create(0, 200, 'platform').setOrigin(0).setDisplaySize(400, 20);
    platform.body.checkCollision.down = false;
    platform.refreshBody();
    platform = this.platforms.create(0, 600, 'platform').setOrigin(0).setDisplaySize(400, 20);
    platform.body.checkCollision.down = false;
    platform.refreshBody();
    platform = this.platforms.create(this.width - 400, 200, 'platform').setOrigin(0).setDisplaySize(400, 20);
    platform.body.checkCollision.down = false;
    platform.refreshBody();
    platform = this.platforms.create(this.width - 400, 600, 'platform').setOrigin(0).setDisplaySize(400, 20);
    platform.body.checkCollision.down = false;
    platform.refreshBody();
    platform = this.platforms.create(this.width - 900, 400, 'platform').setOrigin(0).setDisplaySize(400, 20);
    platform.body.checkCollision.down = false;
    platform.refreshBody();

    // BASES
    this.bases = this.physics.add.staticGroup();
    this.bases.create(150, 180, 'base').setOrigin(0).setDisplaySize(100, 10).refreshBody();
    this.bases.create(150, 580, 'base').setOrigin(0).setDisplaySize(100, 10).refreshBody();
    this.bases.create(this.width - 250, 180, 'base').setOrigin(0).setDisplaySize(100, 10).refreshBody();
    this.bases.create(this.width - 250, 580, 'base').setOrigin(0).setDisplaySize(100, 10).refreshBody();
    this.bases.create(650, 380, 'base').setOrigin(0).setDisplaySize(100, 10).refreshBody();

    // ESTRELLAS
    this.stars = this.physics.add.staticGroup();
    this.starBase = this.bases.getChildren()[Phaser.Math.Between(0, this.bases.getLength() - 1)];
    this.stars.create(this.starBase.x + 25, this.starBase.y - 50, 'star').setOrigin(0).setDisplaySize(50, 50).refreshBody();

    // COLISIONES
    this.physics.add.overlap(this.player, this.stars, this.starCollected, null, this);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.bases);
  }

  update(time, delta) {
    this.handleInput(delta);

    this.pointText.setText('PUNTOS: ' + this.points);
  }

  handleInput(delta) {
    if (this.cursors.space.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-600);
      this.player.anims.play('jump');
    }
    else if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
      if (this.player.body.touching.down)
        this.player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
      if (this.player.body.touching.down)
        this.player.anims.play('right', true);
    }
    else if (Phaser.Input.Keyboard.JustUp(this.cursors.left) || Phaser.Input.Keyboard.JustUp(this.cursors.right) || Phaser.Input.Keyboard.JustUp(this.cursors.up)) {
      this.player.anims.play('idle');
      this.player.setVelocityX(0);
    }
  }

  starCollected(player, coin) {
    this.stars.remove(coin, true, true);
    this.points++;

    this.newBase = this.bases.getChildren()[Phaser.Math.Between(0, this.bases.getLength() - 1)];
    this.stars.create(this.newBase.x + 25, this.newBase.y - 50, 'star').setOrigin(0).setDisplaySize(50, 50).refreshBody();

    if (this.points == 10) {
      this.winSound.play();
      this.scene.start('end');
    }
    else {
      this.starSound.play();
    }
  }
}