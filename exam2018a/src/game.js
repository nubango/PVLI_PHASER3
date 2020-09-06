export default class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'main' });
  }
  preload() {
    this.load.image("sky", "./assets/sky.png");
    this.load.image("box", "./assets/box.png");

    this.load.audio('addbox', "./assets/addbox.wav");
    this.load.audio('selectbox', "./assets/selectbox.wav");
    this.load.audio('impulsebox', "./assets/impulsebox.wav");
    this.load.audio('deletebox', "./assets/deletebox.wav");
  }

  create() {
    // Fondo
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.background = this.add.image(0, 0, "sky");
    this.background.setOrigin(0);
    this.background.setDisplaySize(this.width, this.height, this.sys.game.config.height);

    // Mundo
    this.matter.world.setBounds();

    // Teclas
    this.newobject = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.changeobj = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.deleteobj = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.upforce = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
    this.leftforce = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
    this.downforce = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    this.rightforce = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);

    // Sonidos
    this.addsound = this.sound.add('addbox');
    this.selectsound = this.sound.add('selectbox');
    this.impulsesound = this.sound.add('impulsebox');
    this.deletesound = this.sound.add('deletebox');

    // Grupo de cajas
    this.boxes = this.add.group();
    this.currentBox = 0;
  }

  update(time, delta) {
    this.handleInput(delta);
  }

  handleInput(delta) {
    if (Phaser.Input.Keyboard.JustDown(this.newobject)) {
      this.addBox();
    }
    else if (Phaser.Input.Keyboard.JustDown(this.changeobj)) {
      this.selectBox();
    }
    else if (Phaser.Input.Keyboard.JustDown(this.deleteobj)) {
      this.deleteBox();
    }
    else if (Phaser.Input.Keyboard.JustDown(this.upforce)) {
      this.impulseBox(0, -1);
    }
    else if (Phaser.Input.Keyboard.JustDown(this.leftforce)) {
      this.impulseBox(-1, 0);
    }
    else if (Phaser.Input.Keyboard.JustDown(this.downforce)) {
      this.impulseBox(0, 1);
    }
    else if (Phaser.Input.Keyboard.JustDown(this.rightforce)) {
      this.impulseBox(1, 0);
    }
  }

  addBox() {
    var box = this.matter.add.sprite(Phaser.Math.Between(0, this.width), Phaser.Math.Between(0, this.height), 'box');
    box.setVelocity(Phaser.Math.Between(-20, 20), Phaser.Math.Between(-20, 20));
    box.setBounce(1);
    box.setScale(0.2);
    this.boxes.add(box);
    console.log('Added box (' + this.boxes.getLength() + ')')
    if (this.boxes.getLength() == 1) this.selectBox();

    this.addsound.play();
  }

  selectBox() {
    if (this.boxes.getLength() == 0) return;

    this.boxes.getChildren()[this.currentBox].clearTint();
    this.currentBox++;

    if (this.currentBox >= this.boxes.getLength())
      this.currentBox = 0;

    this.boxes.getChildren()[this.currentBox].setTint(0xff2d00);
    console.log('Current box is ' + this.currentBox);

    this.selectsound.play();
  }

  deleteBox() {
    if (this.boxes.getLength() == 0) return;

    this.boxes.remove(this.boxes.getChildren()[this.currentBox], true, true);

    if (this.boxes.getLength() > 0) {
      if (this.currentBox >= this.boxes.getLength())
        this.currentBox = 0;
      this.boxes.getChildren()[this.currentBox].setTint(0xff2d00);
    }

    this.deletesound.play();
  }

  impulseBox(forceX, forceY) {
    if (this.boxes.getLength() == 0) return;

    this.boxes.getChildren()[this.currentBox].applyForce({ x: forceX, y: forceY });

    this.impulsesound.play();
  }
}