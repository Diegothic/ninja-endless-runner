import * as THREE from "./js/three.module.js"

export class UI {

    constructor() {
        this.scene = new THREE.Scene();

        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 1, 10);
        this.camera.position.z = 10;

        this.loader = new THREE.TextureLoader();
        this.sprites = new Map();
        this.loadSprites();

        this.score = '0';
        this.inGame = false;

        this.scoreNumbers = [];

        this.setupScene();
    }

    loadSprites() {
        this.loadSprite('bg_black', true);
        this.loadSprite('start_logo');
        this.loadSprite('game_over');
        this.loadSprite('keys');
        this.loadSprite('0');
        this.loadSprite('1');
        this.loadSprite('2');
        this.loadSprite('3');
        this.loadSprite('4');
        this.loadSprite('5');
        this.loadSprite('6');
        this.loadSprite('7');
        this.loadSprite('8');
        this.loadSprite('9');
        this.loadSprite('score');
    }

    loadSprite(name, alpha = false) {
        const tex = this.loader.load('./res/ui/' + name + '.png');
        let alphaTex = null;
        if (alpha) {
            this.loader.load('./res/ui/' + name + '_alpha.png');
        }
        const mat = new THREE.SpriteMaterial({
            map: tex,
            alphaMap: alphaTex
        });
        const sprite = new THREE.Sprite(mat);
        this.sprites.set(name, sprite);
    }

    onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.left = -width / 2;
        this.camera.right = width / 2;
        this.camera.top = height / 2;
        this.camera.bottom = -height / 2;
        this.camera.updateProjectionMatrix();

        this.updateSprites();
    }

    updateSprites() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const bg_black = this.sprites.get('bg_black');
        bg_black.center.set(0.5, 0.5);
        bg_black.scale.set(width, height, 1);
        bg_black.position.set(0, 0, 1);

        const start_logo = this.sprites.get('start_logo');
        start_logo.center.set(0.5, 0.5);
        start_logo.scale.set(1920, 1080, 1);
        start_logo.position.set(0, 0, 2);

        const game_over = this.sprites.get('game_over');
        game_over.center.set(0.5, 0.5);
        game_over.scale.set(1920, 1080, 1);
        game_over.position.set(0, 0, 2);

        const keys = this.sprites.get('keys');
        keys.center.set(0.0, 0.0);
        keys.scale.set(1920, 1080, 1);
        keys.position.set(-width / 2, -height / 2, 3);

        const score = this.sprites.get('score');
        score.center.set(0.5, 0.5);
        score.scale.set(1920, 1080, 1);
        score.position.set(0, height / 2 - 150, 3);
    }

    setupScene() {
        this.updateSprites();
        this.enableInGameHud()
    }

    enableLogos(reset = false) {
        this.inGame = false;
        this.scene.add(this.sprites.get('bg_black'));
        if (!reset) {
            this.scene.add(this.sprites.get('start_logo'));
        } else {
            this.scene.add(this.sprites.get('game_over'));
            this.clearScore();
            this.displayScore([0, 0]);
        }
        this.disableInGameHud();
    }

    disableLogos(reset = false) {
        this.inGame = true;
        this.scene.remove(this.sprites.get('bg_black'));
        if (!reset) {
            this.scene.remove(this.sprites.get('start_logo'));
        } else {
            this.scene.remove(this.sprites.get('game_over'));
            this.clearScore();
        }
        this.enableInGameHud();
    }

    enableInGameHud() {
        this.scene.add(this.sprites.get('keys'));
        this.scene.add(this.sprites.get('score'));
    }

    disableInGameHud() {
        this.scene.remove(this.sprites.get('keys'));
        this.scene.remove(this.sprites.get('score'));
    }

    update() {
        if (this.inGame) {
            this.clearScore();
            this.displayScore([0, window.innerHeight / 2 - 250]);
        }
    }

    displayScore(position) {
        const numbers = this.score.length;
        const offset = numbers / 2.0;
        const numberWidth = 100;

        for (let i = 0; i < numbers; i++) {
            let number = this.sprites.get(this.score[i]).clone();
            number.center.set(0.5, 0.5);
            number.scale.set(numberWidth, numberWidth, 1);
            number.position.set(0 - numberWidth * offset + numberWidth / 2 + numberWidth * i + 1 + position[0], position[1], 4);
            this.scoreNumbers.push(number);
            this.scene.add(number);
        }
    }

    clearScore() {
        for (let scoreNumber of this.scoreNumbers) {
            this.scene.remove(scoreNumber);
        }
    }

    setScore(score) {
        this.score = Math.floor(score).toString();
    }

}