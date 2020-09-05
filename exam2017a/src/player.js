export default class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, maxVidas, type, KC_LEFT, KC_JUMP, KC_RIGHT) {
        super(scene, x, y, type);

        this.initialX = x;
        this.initialY = y;
        this.vidas = maxVidas;

        scene.add.existing(this);
        scene.physics.world.enableBody(this, 0);

        this.rightKey = scene.input.keyboard.addKey(KC_RIGHT);
        this.leftKey = scene.input.keyboard.addKey(KC_LEFT);
        this.jumpKey = scene.input.keyboard.addKey(KC_JUMP);

        this.setScale(2);
        this.body.collideWorldBounds = true;
    }

    preUpdate(time, delta) {

        super.preUpdate(time, delta);

        // Handle Input
        if (Phaser.Input.Keyboard.JustDown(this.rightKey)) {
            this.body.setVelocityX(200);
            if (this.anims.getCurrentKey() != 'walk_right') {
                this.play('walk_right');
            }
        }
        else if (Phaser.Input.Keyboard.JustDown(this.leftKey)) {
            this.body.setVelocityX(-200);
            if (this.anims.getCurrentKey() != 'walk_left') {
                this.play('walk_left');
            }
        }
        else if (Phaser.Input.Keyboard.JustUp(this.rightKey) ||
            Phaser.Input.Keyboard.JustUp(this.leftKey)) {
            this.body.setVelocityX(0);
            if (this.anims.getCurrentKey() != 'idle') {
                this.play('idle');
            }
        }
        if (Phaser.Input.Keyboard.JustDown(this.jumpKey)) {
            this.body.setVelocityY(-300);
        }
    }

    getVidas() {
        return this.vidas;
    }

    loseVida() {
        this.vidas--;
    }
}