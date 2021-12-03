import * as THREE from "./js/three.module.js"
import {GLTFLoader} from "./js/GLTFLoader.js";

export class Resources {
    static loader = new GLTFLoader();

    static materials = new Map();
    static animations = new Map();

    static getMaterial(name) {
        return this.materials.get(name);
    }

    static getAnimation(name) {
        return this.animations.get(name);
    }

    static init() {
        this.loadResources();
    }

    static loadResources() {
        this.loadMaterials();
    }

    static loadMaterials() {
        const playerMaterial = new THREE.MeshStandardMaterial({
            map: this.loadTexture('./res/ninja/ninja_c.png'),
            bumpMap: this.loadTexture('./res/ninja/ninja_h.png'),
            normalMap: this.loadTexture('./res/ninja/ninja_n.png'),
            normalScale: new THREE.Vector2(1, 1),
            roughnessMap: this.loadTexture('./res/ninja/ninja_r.png'),
            metalness: 0.0,
        });
        this.materials.set('player', playerMaterial);

        const wallMaterial = new THREE.MeshStandardMaterial({
            map: this.loadTexture('./res/wall/wall_c.png'),
            bumpMap: this.loadTexture('./res/wall/wall_h.png'),
            bumpScale: 0.2,
            roughnessMap: this.loadTexture('./res/wall/wall_r.jpg'),
            metalness: 0.0,
        });
        this.materials.set('wall', wallMaterial);

        const skyBoxMat = new THREE.MeshStandardMaterial({
            map: this.loadTexture('./res/sky.png'),
            metalness: 0.0,
            roughness: 1.0,
        });
        this.materials.set('skyBox', skyBoxMat);

        const groundMaterial = new THREE.MeshStandardMaterial({
            map: this.loadTexture('./res/ground/ground_c.jpg'),
            bumpMap: this.loadTexture('./res/ground/ground_h.png'),
            bumpScale: 1.0,
            roughnessMap: this.loadTexture('./res/ground/ground_r.jpg'),
            metalness: 0.0,
        });
        this.materials.set('ground', groundMaterial);

        const treeMaterial = new THREE.MeshStandardMaterial({
            map: this.loadTexture('./res/tree/tree_c.png'),
            bumpMap: this.loadTexture('./res/tree/tree_h.png'),
            bumpScale: 10.0,
            roughness: 1.0,
            metalness: 0.0,
        });
        this.materials.set('tree', treeMaterial);

        const spikesMaterial = new THREE.MeshStandardMaterial({
            map: this.loadTexture('./res/obstacles/spikes/spikes_c.png'),
            bumpMap: this.loadTexture('./res/obstacles/spikes/spikes_h.png'),
            bumpScale: 1.0,
            roughnessMap: this.loadTexture('./res/obstacles/spikes/spikes_r.png'),
            metalness: 0.0,
        });
        this.materials.set('spikes', spikesMaterial);

        const bambooMaterial = new THREE.MeshStandardMaterial({
            map: this.loadTexture('./res/obstacles/bamboo/bamboo_c.png'),
            roughnessMap: this.loadTexture('./res/obstacles/bamboo/bamboo_r.png'),
            metalness: 0.0,
        });
        this.materials.set('bamboo', bambooMaterial);

        const batMaterial = new THREE.MeshStandardMaterial({
            map: this.loadTexture('./res/obstacles/bat/bat_c.png'),
            bumpMap: this.loadTexture('./res/obstacles/bat/bat_h.png'),
            bumpScale: 1.0,
            roughnessMap: this.loadTexture('./res/obstacles/bat/bat_r.png'),
            metalness: 0.0,
        });
        this.materials.set('bat', batMaterial);
    }

    static loadTexture(path) {
        const textureLoader = new THREE.TextureLoader();
        let texture = textureLoader.load(path);
        this.convertTexture(texture);
        return texture;
    }

    static convertTexture(texture) {
        texture.encoding = THREE.sRGBEncoding;
        texture.flipY = false;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
    }
}