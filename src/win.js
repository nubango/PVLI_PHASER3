export default class Win extends Phaser.Scene {
    constructor() {
        super({ key: 'win' });
    }

    create() {
        // Fondo de pantalla
        this.background = this.add.image(200, 0, "win");
        this.background.setOrigin(0);
        this.background.setScale(4);

        // Texto informativo
        this.add.text(380, 580, 'GAME OVER', { fontSize: '120px' });
    }
}