import * as THREE from "./js/three.module.js"
import {Resources} from "./resources.js";

export class Obstacle {
    constructor(scene, id, mesh, startingPosition, destructible = false) {
        this.id = id;
        this.position = startingPosition;

        this.loadMesh(scene, mesh);
        this.collider = new THREE.Box3();

        this.isEnabled = true;
        this.isDestructible = destructible;
    }

    loadMesh(scene, mesh) {
        this.mesh = new THREE.Mesh();
        Resources.loader.load('./res/obstacles/' + mesh + '/' + mesh + '.glb', (gltf) => {
            this.mesh = gltf.scene;
            this.mesh.traverse((c) => {
                if (c.isMesh) {
                    c.material = Resources.getMaterial(mesh);
                    c.castShadow = true;
                    c.receiveShadow = true;
                }
            });
            scene.add(this.mesh);
        });
    }

    update(dT) {
        this.position.x += 0.5 * dT;
        this.mesh.position.copy(this.position);

        this.collider.setFromObject(this.mesh);
    }

    hit() {
        this.isEnabled = false;
    }

    remove(scene) {
        scene.remove(this.mesh);
    }
}

export class Bamboo extends Obstacle {
    constructor(scene, id, startingPosition) {
        super(scene, id, 'bamboo', startingPosition, true);
        this.loadUpperMesh(scene);
        this.isHit = false;
    }

    loadUpperMesh(scene) {
        this.upperMesh = new THREE.Mesh();
        Resources.loader.load('./res/obstacles/bamboo/bamboo_u.glb', (gltf) => {
            this.upperMesh = gltf.scene;
            this.upperMesh.traverse((c) => {
                if (c.isMesh) {
                    c.material = Resources.getMaterial('bamboo');
                    c.castShadow = true;
                    c.receiveShadow = true;
                }
            });
            scene.add(this.upperMesh);
        });
    }

    update(dT) {
        this.position.x += 0.5 * dT;
        this.mesh.position.x = this.position.x;
        this.upperMesh.position.x = this.position.x;
        if (this.isHit) {
            this.upperMesh.position.y += 2 * dT;
            this.upperMesh.rotation.z += -0.5 * dT;

            this.mesh.position.y -= dT;
            this.mesh.rotation.z += 0.5 * dT;
        }
        const center = new THREE.Vector3();
        center.copy(this.position);
        center.y += 1.5;

        this.collider.setFromCenterAndSize(center, new THREE.Vector3(0.4, 10.0, 3.0));
    }

    hit() {
        super.hit();
        this.isHit = true;
    }

    remove(scene) {
        super.remove(scene);
        scene.remove(this.upperMesh);
    }
}

export class Bat extends Obstacle {
    constructor(scene, id, startingPosition) {
        super(scene, id, 'bat', startingPosition, false);
    }

    loadMesh(scene, mesh) {
        this.mesh = new THREE.SkinnedMesh();
        Resources.loader.load('./res/obstacles/bat/bat.glb', (gltf) => {
            this.mesh = gltf.scene;
            this.mesh.traverse((c) => {
                if (c.isMesh) {
                    c.material = Resources.getMaterial('bat');
                    c.castShadow = true;
                    c.receiveShadow = true;
                }
            });
            this.mesh.position.y += 3.3;
            this.mesh.rotation.y = Math.PI;
            if (gltf.animations[0]) {
                this.mixer = new THREE.AnimationMixer(gltf.scene);
                const idle = this.mixer.clipAction(gltf.animations[0]);
                idle.play();
            }
            scene.add(this.mesh);
        });
    }

    update(dT) {
        this.position.x += 0.5 * dT;
        this.mesh.position.x = this.position.x;

        this.collider.setFromObject(this.mesh);

        if (this.mixer)
            this.mixer.update(dT * 0.2);
    }

    hit() {
        this.isEnabled = false;
    }

    remove(scene) {
        scene.remove(this.mesh);
    }
}