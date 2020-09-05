export default class Lose extends Phaser.Scene {
    constructor() {
        super({ key: 'lose' });
    }

    create() {
        // Fondo de pantalla
        this.background = this.add.image(0, 0, "lose");
        this.background.setOrigin(0);
        this.background.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        // Texto informativo
        this.add.text(350, 480, 'YOU LOSE', { fontSize: '160px', fill: "#FF1900" });
    }
}