export default class Boot extends Phaser.Scene {
    constructor() {
        super({ key: 'boot' });
    }
    preload() {
        // Carga de imagenes
        this.load.image("dungeon", "./assets/closed_dungeon.png");
        this.load.image("win", "./assets/win.png");
        this.load.image("lose", "./assets/lose.png");
        this.load.image("key", "./assets/key.png");
        this.load.image("bow", "./assets/bow.png");
        this.load.image("door", "./assets/door.png");
        this.load.image("rightwall", "./assets/rightwall.png");
        this.load.image("leftwall", "./assets/leftwall.png");
        this.load.image("downwall", "./assets/downwall.png");
        this.load.image("arrow_vert", "./assets/arrow_vert.png");
        this.load.image("arrow_horiz", "./assets/arrow_horiz.png");
        this.load.image("upwall_left", "./assets/upwall_left.png");
        this.load.image("upwall_right", "./assets/upwall_right.png");
        this.load.image("closed_upwall", "./assets/closed_upwall.png");

        this.load.spritesheet('zelda', 'assets/zelda.png', { frameWidth: 24, frameHeight: 32 });
        this.load.spritesheet('enemy', 'assets/enemy.png', { frameWidth: 35, frameHeight: 40 });

        this.load.audio('throwarrow', "./assets/throwarrow.mp3");
        this.load.audio('pickobject', "./assets/pickobject.mp3");
    }
    create() {
        this.scene.start('game');
    }
}