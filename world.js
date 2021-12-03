import * as THREE from "./js/three.module.js"
import {ObstacleGenerator} from "./obstacle_generator.js";
import {Player} from "./player.js";
import {Resources} from "./resources.js";

export class World {
    constructor() {
        this.scene = new THREE.Scene();

        const width = window.innerWidth;
        const height = window.innerHeight;

        const aspectRatio = width / height;
        this.camera = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 1000.0);

        this.generator = new ObstacleGenerator();
        this.obstacles = new Map();
        this.lights = new Map();
    }

    onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    reset() {
        this.resetPlayer();
        this.resetObstacles();
    }

    resetPlayer() {
        this.scene.remove(this.player.mesh);
        this.player = new Player(this.scene);
    }

    resetObstacles() {
        for (let obstacle of this.obstacles.values()) {
            obstacle.remove(this.scene);
        }
        for (let i = 0; i < 6; i++) {
            const position = new THREE.Vector3(-10 * (i + 1), 0, 0);
            const obstacle = this.generator.generateRandomObstacle(i, this.scene, position);
            this.obstacles.set(obstacle.id, obstacle);
        }
    }

    setupScene() {
        this.camera.position.set(1, 2, -6);
        this.camera.up.set(0, 1, 0);
        this.camera.rotateY(2.8)

        this.scene.background = new THREE.Color(0xd1dced);
        this.scene.fog = new THREE.Fog(this.scene.background, 20, 150);

        this.setupSkybox();
        this.setupWall();
        this.setupGround();
        this.setupTrees();
        this.setupLights();

        for (let light of this.lights.values()) {
            this.scene.add(light);
        }

        this.player = new Player(this.scene);

        for (let i = 0; i < 6; i++) {
            const position = new THREE.Vector3(-10 * (i + 1), 0, 0);
            const obstacle = this.generator.generateRandomObstacle(i, this.scene, position);
            this.obstacles.set(obstacle.id, obstacle);
        }
    }

    setupSkybox() {
        this.skybox = new THREE.Mesh();
        Resources.loader.load('./res/sky.glb', (gltf) => {
            this.skybox = gltf.scene;
            this.skybox.traverse((c) => {
                if (c.isMesh)
                    c.material = Resources.getMaterial('skyBox');

            });
            this.skybox.position.y += 35;
            this.scene.add(this.skybox);
        });
    }

    setupWall() {
        this.wall = new THREE.Mesh();
        Resources.loader.load('./res/wall/wall.glb', (gltf) => {
            this.wall = gltf.scene;
            this.wall.traverse((c) => {
                if (c.isMesh) {
                    c.material = Resources.getMaterial('wall');
                    c.castShadow = true;
                    c.receiveShadow = true;
                }
            });
            this.scene.add(this.wall);
        });
    }

    setupGround() {
        this.ground = new THREE.Mesh();
        Resources.loader.load('./res/ground/ground.glb', (gltf) => {
            this.ground = gltf.scene;
            this.ground.traverse((c) => {
                if (c.isMesh) {
                    c.material = Resources.getMaterial('ground');
                    c.receiveShadow = true;
                }
            });
            this.ground.receiveShadow = true;
            this.scene.add(this.ground);
        });
    }

    setupTrees() {
        const positions = [
            [0, -3.5, 20],
            [-6, -3.5, 30],
            [-9, -3.5, 35],
            [-1, -1, 50],
            [-20, -1, 55],
            [-40, -1, 100],
            [-50, -5, 100],
            [-80, -1, 72],
            [-120, -3, 65],
            [-140, 2, 70],
            [-200, -7, 50],
            [-400, -3.5, 20],
            [-406, -3.5, 30],
            [-409, -3.5, 35],
            [-401, -1, 50],
            [-420, -1, 55],
            [-440, -1, 100],
            [-450, -5, 100],
            [-480, -1, 72],
            [-520, -3, 65],
            [-540, 2, 70],
            [-600, -7, 50],
        ];
        this.trees = [];
        this.tree = new THREE.Mesh();
        Resources.loader.load('./res/tree/tree.glb', (gltf) => {
            this.tree = gltf.scene;
            this.tree.traverse((c) => {
                if (c.isMesh) {
                    c.material = Resources.getMaterial('tree');
                    c.castShadow = true;
                    c.receiveShadow = true;
                }
            });
            for (let i = 0; i < positions.length; i++) {
                this.trees[i] = new THREE.Mesh();
                this.trees[i] = this.tree.clone();
                this.trees[i].position.set(positions[i][0], positions[i][1], positions[i][2]);
                const angle = Math.random() * (Math.PI * 2);
                this.trees[i].rotateY(angle);
                this.scene.add(this.trees[i]);
            }
        });
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.1);
        this.lights.set('ambient', ambientLight);

        const sun = new THREE.DirectionalLight(0xffffff, 2.0);
        sun.position.set(-6, 6, -4);
        sun.castShadow = true;
        sun.shadow.camera.near = 1;
        sun.shadow.camera.far = 200;
        sun.shadow.camera.right = 100;
        sun.shadow.camera.left = -100;
        sun.shadow.camera.top = 100;
        sun.shadow.camera.bottom = -100;
        sun.shadow.mapSize.width = 4096;
        sun.shadow.mapSize.height = 4096;
        this.lights.set('main', sun);

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x677073, 0.2);
        hemiLight.position.set(0, 300, 0);
        this.lights.set('hemi', hemiLight);
    }

    addObstacle(id) {
        const lastPos = new THREE.Vector3(-50, 0, 0);
        const obstacle = this.generator.generateRandomObstacle(id, this.scene, lastPos);
        this.obstacles.set(obstacle.id, obstacle);
    }

    scrollBackground(dT) {
        this.wall.position.x += 0.5 * dT;
        if (this.wall.position.x >= 10.0) {
            this.wall.position.x -= 10.0;
        }
        this.ground.position.x += 0.5 * dT;
        if (this.ground.position.x >= 400.0) {
            this.ground.position.x -= 400.0;
        }
        for (let i = 0; i < this.trees.length; i++) {
            this.trees[i].position.x += 0.5 * dT;
            if (this.trees[i].position.x >= 400.0) {
                for (let i = 0; i < this.trees.length; i++) {
                    this.trees[i].position.x -= 400.;
                }
            }
        }

        this.skybox.rotateY(dT * 0.005);
    }
}