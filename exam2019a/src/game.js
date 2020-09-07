export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'main' });
  }
  preload() {
    this.load.image("background", "./assets/sky.png");
    this.load.image("wallHoriz", "./assets/wall_h.png");
    this.load.image("wallVer", "./assets/wall_v.png");

    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 770, frameHeight: 770 });
    this.load.spritesheet('ball', 'assets/ball.png', { frameWidth: 84, frameHeight: 84 });
    this.load.spritesheet('explosion', 'assets/explosion.png', { frameWidth: 64, frameHeight: 64 });
  }

  create() {
    let width = this.sys.game.config.width;
    let height = this.sys.game.config.height;

    this.background = this.add.image(0, 0, "background");
    this.background.setOrigin(0);
    this.background.setDisplaySize(width, height);

    // PAREDES
    this.walls = this.physics.add.staticGroup();
    this.walls.create(300, 25, "wallHoriz");
    this.walls.create(width - 25, 300, "wallVer");
    this.walls.create(25, 300, "wallVer");
    this.walls.create(300, height - 25, "wallHoriz");

    // ANIMACIONES
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [0]
      }),
      frameRate: 16,
      repeat: -1
    });
    this.anims.create({
      key: 'move',
      frames: this.anims.generateFrameNumbers('player', {
        frames: [1]
      }),
      frameRate: 16,
      repeat: -1
    });
    this.anims.create({
      key: 'idle_ball',
      frames: this.anims.generateFrameNumbers('ball', {
        frames: [0]
      }),
    });
    this.anims.create({
      key: 'divide_ball',
      frames: this.anims.generateFrameNumbers('ball', {
        frames: [0, 1]
      }),
      frameRate: 10,
      repeat: 4
    });
    this.anims.create({
      key: 'death_ball',
      frames: this.anims.generateFrameNumbers('explosion'),
      frameRate: 100,
    });

    this.anims.get('divide_ball').on('complete', this.animComplete);
    this.anims.get('death_ball').on('complete', this.animComplete);

    // JUGADOR
    this.player = this.physics.add.sprite(100, 500, 'player');
    this.player.setScale(0.1);

    this.end = false;

    // INPUT USUARIO
    this.cursors = this.input.keyboard.createCursorKeys();

    // PELOTA
    this.balls = this.physics.add.group();
    var ball = this.balls.create(100, 100, "ball");
    ball.body.setCircle(42);
    ball.body.bounce.setTo(1, 1);
    ball.setVelocity(Phaser.Math.Between(50, 100), Phaser.Math.Between(50, 100));
    ball.setCollideWorldBounds(true);
    ball.anims.play('idle_ball');

    // HUD
    this.timeLeft = 5;
    this.collisionsLeft = 7;
    this.infoText = this.add.text(70, 70, 'Quedan: ' + this.collisionsLeft + ' colisiones y ' + this.timeLeft + ' segundos', { fontFamily: 'Montserrat', fontSize: '20px', fill: '#000000' });

    // CONTADOR
    this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });

    //COLISIONES
    this.physics.add.collider(this.player, this.walls);
    this.physics.add.collider(this.balls, this.walls);
    this.physics.add.collider(this.player, this.balls, this.ballsCollision, null, this);
  }

  update(time, delta) {
    // HUD
    this.infoText.setText('Quedan: ' + this.collisionsLeft + ' colisiones y ' + this.timeLeft + ' segundos', { fontFamily: 'Montserrat', fontSize: '20px', fill: '#000000' });

    // HANDLE INPUT
    if (!this.end) {
      this.handleInput(delta);
    }
    else if (this.cursors.space.isDown) {
      this.scene.restart();
    }
  }

  onEvent() {
    this.timeLeft--;

    if (this.timeLeft == 0) {
      this.timedEvent.remove(false);
      this.add.text(250, 250, 'YOU LOSE', { fontFamily: 'Montserrat', fontSize: '20px', fill: '#000000' });
      this.end = true;
      this.player.body.setEnable(false);

      Phaser.Actions.Call(this.balls.getChildren(), function (ball) { ball.body.setEnable(false); })
    }
  }

  ballsCollision(player, ball) {
    // divide las bolas solo si esta en idle la animacion
    if (ball.anims.getCurrentKey() == 'idle_ball') {
      this.collisionsLeft--;

      if (ball.scale > 0.25) {
        var newBall = this.balls.create(ball.x, ball.y, "ball");
        newBall.body.setCircle(42);
        newBall.setScale(ball.scale / 2);
        newBall.body.bounce.setTo(1, 1);
        newBall.setVelocity(Phaser.Math.Between(50, 100), Phaser.Math.Between(50, 100));
        newBall.setCollideWorldBounds(true);
        newBall.anims.play('divide_ball');

        newBall = this.balls.create(ball.x, ball.y, "ball");
        newBall.body.setCircle(42);
        newBall.setScale(ball.scale / 2);
        newBall.body.bounce.setTo(1, 1);
        newBall.setVelocity(Phaser.Math.Between(50, 100), Phaser.Math.Between(50, 100));
        newBall.setCollideWorldBounds(true);
        newBall.anims.play('divide_ball');

        ball.destroy();
      }

      if (ball.scale == 0.25) {
        ball.body.setEnable(false);
        ball.scale = 0.5;
        ball.anims.play('death_ball');
      }

      if (this.collisionsLeft == 0) {
        this.add.text(250, 250, 'YOU WIN', { fontFamily: 'Montserrat', fontSize: '20px', fill: '#000000' });
        this.timedEvent.remove(false);
        this.end = true;
        this.player.body.setEnable(false);
      }
    }
  }

  animComplete(anim, frame, sprite) {
    // cuando termina la animacion de dividirse se vuelve a idle
    if (anim.key == 'divide_ball')
      sprite.anims.play('idle_ball');
    // cuando termina la animacion de muerte se destruye la bola
    else if (anim.key == 'death_ball')
      sprite.destroy();
  }

  handleInput(delta) {
    if (this.cursors.left.isDown) {
      this.player.setVelocity(0, 0);
      this.player.setVelocityX(-60 * delta);
      this.player.anims.play('move');
    }
    else if (this.cursors.right.isDown) {
      this.player.setVelocity(0, 0);
      this.player.setVelocityX(60 * delta);
      this.player.anims.play('move');
    }
    else if (this.cursors.up.isDown) {
      this.player.setVelocity(0, 0);
      this.player.setVelocityY(-60 * delta);
      this.player.anims.play('move');
    }
    else if (this.cursors.down.isDown) {
      this.player.setVelocity(0, 0);
      this.player.setVelocityY(60 * delta);
      this.player.anims.play('move');
    }
    if (Phaser.Input.Keyboard.JustUp(this.cursors.up) || Phaser.Input.Keyboard.JustUp(this.cursors.down) ||
      Phaser.Input.Keyboard.JustUp(this.cursors.left) || Phaser.Input.Keyboard.JustUp(this.cursors.right)) {
      this.player.anims.play('idle');
      this.player.setVelocityX(0);
      this.player.setVelocityY(0);
    }
  }
}
