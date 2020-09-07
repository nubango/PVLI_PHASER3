export default class End extends Phaser.Scene {
    constructor() {
        super({ key: 'end' });
    }

    create() {
        // Fondo de pantalla
        this.cameras.main.setBackgroundColor('#00DEFF');

        // Texto informativo
        this.add.text(80, 480, 'FIN DEL JUEGO', { fontSize: '160px', fill: "#000000" });
    }
}