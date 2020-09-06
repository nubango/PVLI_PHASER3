export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'main' });
  }
  preload() {
    this.load.image('sky', './assets/sky.png');
    this.load.image('platform', './assets/platform.png');
    this.load.image('coin', './assets/coin.png');
    this.load.spritesheet('player', './assets/dude.png', { frameWidth: 32, frameHeight: 48 })

    this.load.audio('jump', './assets/jump.mp3');
    this.load.audio('coin', './assets/coin.mp3');
  }

  create() {
    // FONDO DE JUEGO
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.background = this.add.image(0, 0, 'sky');
    this.background.setOrigin(0);
    this.background.setDisplaySize(this.width, this.height);

    // SONIDOS
    this.coinSound = this.sound.add('coin');
    this.jumpSound = this.sound.add('jump');

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

    // PERSONAJE
    this.player = this.physics.add.sprite(this.width / 2, this.height - 150, 'player');
    this.player.body.collideWorldBounds = true;
    this.player.setScale(1.5);

    this.points = 0;
    this.pointText = this.add.text(10, 10, 'PUNTOS: ', { fontSize: '80px', fill: '#FFFFFF' });

    // CONTROLES
    this.cursors = this.input.keyboard.createCursorKeys();

    // PLATAFORMAS
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(0, this.height - 20, 'platform').setOrigin(0).setDisplaySize(this.width, 20).refreshBody();
    var platform = this.platforms.create(0, 400, 'platform').setOrigin(0).setDisplaySize(400, 20);
    platform.body.checkCollision.down = false;
    platform.refreshBody();
    platform = this.platforms.create(400, 600, 'platform').setOrigin(0).setDisplaySize(600, 20);
    platform.body.checkCollision.down = false;
    platform.refreshBody();
    platform = this.platforms.create(this.width - 400, 400, 'platform').setOrigin(0).setDisplaySize(400, 20);
    platform.body.checkCollision.down = false;
    platform.refreshBody();

    // MONEDAS
    this.coins = this.physics.add.staticGroup();
    this.coins.create(150, 300, 'coin').setOrigin(0).setDisplaySize(50, 50).refreshBody();
    this.coins.create(this.width - 200, 300, 'coin').setOrigin(0).setDisplaySize(50, 50).refreshBody();
    this.coins.create(650, 450, 'coin').setOrigin(0).setDisplaySize(50, 50).refreshBody();

    // COLISIONES
    this.physics.add.overlap(this.player, this.coins, this.coinPicked, null, this);
    this.physics.add.collider(this.player, this.platforms);
  }

  update(time, delta) {
    this.handleInput(delta);

    this.pointText.setText('PUNTOS: ' + this.points);
  }

  handleInput(delta) {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
      this.player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
      this.player.anims.play('right', true);
    }
    else {
      this.player.setVelocityX(0);
      this.player.anims.play('idle');
    }
    if (this.cursors.space.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-600);
      this.jumpSound.play();
    }
  }

  coinPicked(player, coin) {
    this.coins.remove(coin, true, true);
    this.points++;
    this.coinSound.play();
  }
}