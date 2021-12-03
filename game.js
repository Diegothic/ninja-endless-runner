import * as THREE from "./js/three.module.js"
import {UI} from "./ui.js";
import {World} from "./world.js";

export class Game {
    constructor() {
        this.world = new World();

        const width = window.innerWidth;
        const height = window.innerHeight;

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);
        this.renderer.outputEncoding = THREE.GammaEncoding;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.autoClear = false;
        document.body.appendChild(this.renderer.domElement);

        this.ui = new UI();

        window.addEventListener('resize', this.handleResize.bind(this));

        this.anyKeyPressed = false;
        this.jumpKeyPressed = false;
        this.attackKeyPressed = false;
        this.attackKeyWasPressed = false;
        document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this.onKeyUp(e), false);

        this.clock = new THREE.Clock(false);
        this.startGame = false;
        this.isGameOver = false;
        this.gameSpeed = 10.0;
        this.score = 0;
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case 90:
                this.jumpKeyPressed = true;
                break;
            case 88:
                this.attackKeyPressed = true;
                break;
        }

        if (!this.startGame && !this.anyKeyPressed) {
            this.reset();
        }
        this.anyKeyPressed = true;
    }

    onKeyUp(event) {
        switch (event.keyCode) {
            case 90:
                this.jumpKeyPressed = false;
                break;
            case 88:
                this.attackKeyPressed = false;
                break;
        }

        this.anyKeyPressed = false;
    }

    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.renderer.setSize(width, height);
        this.world.onResize();
        this.ui.onResize();
    }

    run() {
        this.world.setupScene();
        this.start();
        this.update();
    }

    reset() {
        this.startGame = true;
        if (!this.isGameOver) {
            this.ui.disableLogos();
        } else {
            this.ui.disableLogos(true);
            this.resetGame();
        }
    }

    resetGame() {
        this.score = 0;
        this.gameSpeed = 10.0;
        this.world.reset();
        this.isGameOver = false;
        this.clock = new THREE.Clock(false);
        this.clock.start();
    }

    start() {
        this.clock.start();
        this.ui.enableLogos();
        this.world.player.start();
    }

    update() {
        requestAnimationFrame(this.update.bind(this));
        this.handleInput();

        const dT = this.clock.getDelta() * this.gameSpeed;

        if (document.hasFocus()) {
            if (this.startGame && !this.isGameOver) {
                this.updateGame(dT);
            } else {
                this.updateGame(0.0);
            }
            this.ui.update();
        }

        this.renderer.clear();
        this.renderer.render(this.world.scene, this.world.camera);
        this.renderer.clearDepth();
        this.renderer.render(this.ui.scene, this.ui.camera);
    }

    handleInput() {
        this.world.player.setJump(this.jumpKeyPressed);
    }

    updateGame(dT) {
        this.world.player.update(dT);

        const attackedThisFrame = this.attackKeyPressed && !this.attackKeyWasPressed;
        this.attackKeyWasPressed = this.attackKeyPressed;

        let attackCollider = new THREE.Box3();
        let playerAttacked = false;

        if (this.world.player.isGrounded() && this.world.player.canAttack && attackedThisFrame) {
            const attackColliderSize = new THREE.Vector3(1.5, 1.0, 1.0);
            attackCollider.setFromCenterAndSize(this.world.player.getCenter(), attackColliderSize);
            this.world.player.attack();
            playerAttacked = true;
        }

        this.updateObstacles(dT, playerAttacked, attackCollider);
        this.world.scrollBackground(dT);
        this.updateScoreAndGameSpeed(dT);
    }

    updateObstacles(dT, playerAttacked, attackCollider) {
        for (let obstacle of this.world.obstacles.values()) {
            obstacle.update(dT);

            if (obstacle.isDestructible && playerAttacked && attackCollider.intersectsBox(obstacle.collider)) {
                obstacle.hit();
            }
            if (obstacle.isEnabled && this.world.player.collider.intersectsBox(obstacle.collider)) {
                this.gameOver();
            }
            if (obstacle.position.x >= 10) {
                obstacle.remove(this.world.scene);
                this.world.addObstacle(obstacle.id);
            }
        }
    }

    updateScoreAndGameSpeed(dT) {
        this.score += dT / this.gameSpeed * 5.0;
        if (this.gameSpeed < 40.0) {
            this.gameSpeed = 10.0 + this.score / 40;
        }
        this.ui.setScore(this.score);
    }

    gameOver() {
        this.ui.enableLogos(true);
        this.isGameOver = true;
        this.startGame = false;
    }
}