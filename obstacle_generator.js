import {Bamboo, Bat, Obstacle} from "./obstacle.js";

export class ObstacleGenerator {
    constructor() {
    }

    generateRandomObstacle(id, scene, position) {
        const rand = Math.random();
        if (rand > 0.9) {
            return this.spikes(id, scene, position, 0.5);
        }
        if (rand > 0.8) {
            return this.bamboo(id, scene, position);
        }
        if (rand > 0.7) {
            return this.spikes(id, scene, position, 1.0);
        }
        if (rand > 0.6) {
            return this.bamboo(id, scene, position);
        }
        if (rand > 0.5) {
            return this.spikes(id, scene, position, 1.5);
        }
        if (rand > 0.4) {
            return this.spikes(id, scene, position, 2.0);
        }
        if (rand > 0.3) {
            return this.bamboo(id, scene, position);
        }
        if (rand > 0.2) {
            return this.bat(id, scene, position);
        }
        if (rand > 0.1) {
            return this.spikes(id, scene, position, 2.5);
        }
        return this.bat(id, scene, position);
    }

    spikes(id, scene, position, height) {
        const obstacle = new Obstacle(scene, id, 'spikes', position);
        obstacle.position.y = height;
        return obstacle;
    }

    bamboo(id, scene, position) {
        return new Bamboo(scene, id, position);
    }

    bat(id, scene, position) {
        return new Bat(scene, id, position);
    }
}