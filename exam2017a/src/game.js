import Player from './player.js'

export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'main' });
  }
  preload() {
    this.load.image("sky", "./assets/sky.png");
    this.load.spritesheet('dude', './assets/dude.png', { frameWidth: 32, frameHeight: 48 });
  }

  create() {
    // Fondo
    this.background = this.add.image(0, 0, "sky");
    this.background.setOrigin(0);
    this.background.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

    // Animacion
    this.anims.create({
      key: 'walk_left',
      frames: this.anims.generateFrameNumbers('dude', {
        frames: [0, 1, 2, 3]
      }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('dude', {
        frames: [4]
      })
    });

    this.anims.create({
      key: 'walk_right',
      frames: this.anims.generateFrameNumbers('dude', {
        frames: [5, 6, 7, 8]
      }),
      frameRate: 10,
      repeat: -1
    });

    // Creacion de dos jugadores
    this.player1 = new Player(this, 300, 650, 10, 'dude', Phaser.Input.Keyboard.KeyCodes.A, Phaser.Input.Keyboard.KeyCodes.W, Phaser.Input.Keyboard.KeyCodes.D);
    this.player2 = new Player(this, 650, 300, 5, 'dude',Phaser.Input.Keyboard.KeyCodes.J, Phaser.Input.Keyboard.KeyCodes.I, Phaser.Input.Keyboard.KeyCodes.L);

    // HUD con numero de vidas
    this.livesText1 = this.add.text(10, 10, 'Vidas:', { fontSize: '50px', fill: '#FFFF00' });
    this.livesText2 = this.add.text(900, 10, 'Vidas:', { fontSize: '50px', fill: '#FFFF00' });

    // Colisiones
    this.physics.add.collider(this.player1, this.player2, this.playerscollision, null, this);
    this.player1.body.setBounce(0.2);
    this.player2.body.setBounce(0.2);
  }

  update(time, delta) {
    // Actualiza el HUD
    this.livesText1.setText('Vidas: ' + this.player1.getVidas());
    this.livesText2.setText('Vidas: ' + this.player2.getVidas());
  }

  // Al chocar pierden cada uno una vida
  playerscollision(player1, player2) {
    player1.loseVida();
    player2.loseVida();
  }
}