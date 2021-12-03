import * as THREE from "./js/three.module.js"
import {Resources} from "./resources.js";

export class Player {
    constructor(scene) {
        this.velocity = 0;
        this.position = new THREE.Vector3(0, 0, 0);
        this.isJumping = false;
        this.canJump = true;

        this.loadMesh(scene);
        this.collider = new THREE.Box3();

        this.canAttack = true;
        this.isAttacking = false;
        this.cooldown = 0;

        this.wasGrounded = false;
    }

    loadMesh(scene) {
        this.mesh = new THREE.SkinnedMesh();
        Resources.loader.load('./res/ninja/ninja.glb', (gltf) => {
            this.mesh = gltf.scene;
            this.mesh.traverse((c) => {
                if (c.isMesh) {
                    c.material = Resources.getMaterial('player');
                    c.castShadow = true;
                    c.receiveShadow = true;
                }
            });
            if (gltf.animations) {
                this.mixer = new THREE.AnimationMixer(this.mesh);
                this.clips = [];
                this.clips = gltf.animations;
            }
            scene.add(this.mesh);
        });
    }

    playAnimation(name) {
        const clip = THREE.AnimationClip.findByName(this.clips, name);
        const action = this.mixer.clipAction(clip);
        action.play();
    }

    stopAnimations() {
        if(!this.clips){
            return;
        }
        this.clips.forEach((clip) => {
            this.mixer.clipAction(clip).stop();
        });
    }

    start() {
    }

    update(dT) {
        this.updateAnimations();

        if (this.cooldown > 0) {
            this.cooldown -= dT;
        } else if (this.isAttacking) {
            this.canAttack = true;
            this.isAttacking = false;
            this.stopAnimations();
            this.playAnimation('run');
        }

        if (!this.isAttacking && this.canJump && this.isJumping && this.isGrounded()) {
            this.velocity = 0.9;
            this.canJump = false;
        }

        const gravity = 0.1;
        if (!this.isGrounded()) {
            this.velocity -= gravity * dT;

            if (this.velocity < 0.0) {
                this.velocity += gravity * -1.0 * dT;
            } else if (this.velocity > 0.0 && !this.isJumping) {
                this.velocity += gravity * -5.0 * dT;
            }
        }

        const newPosition = this.position.y + this.velocity * dT;
        this.position.y = Math.min(Math.max(newPosition, 0.0), 4.0);
        this.mesh.position.copy(this.position);

        let colliderPos = new THREE.Vector3();
        colliderPos.copy(this.position);
        colliderPos.y += 1.0;
        this.collider.setFromCenterAndSize(colliderPos, new THREE.Vector3(0.5, 1.8, 0.5));

        if (this.mixer)
            this.mixer.update(dT * 0.1);
    }

    updateAnimations() {
        if (!this.isAttacking) {
            if (!this.wasGrounded && this.isGrounded()) {
                this.stopAnimations();
                this.playAnimation('run');
            }
            if (this.wasGrounded && !this.isGrounded()) {
                this.stopAnimations();
                this.playAnimation('jump');
            }
        }
        this.wasGrounded = this.isGrounded();
    }

    isGrounded() {
        return this.position.y <= 0;
    }

    setJump(pressed) {
        this.isJumping = pressed;
        if (pressed === false) {
            this.canJump = true;
        }
    }

    attack() {
        this.canAttack = false;
        this.isAttacking = true;
        this.cooldown = 7.0;

        this.stopAnimations();
        this.playAnimation('attack');
    }

    getCenter() {
        return new THREE.Vector3(this.position.x - 1.0, this.position.y + 0.5, this.position.z);
    }
}
