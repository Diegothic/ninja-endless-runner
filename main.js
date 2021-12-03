import {Game} from "./game.js";
import {Resources} from "./resources.js";

Resources.loadResources();
const game = new Game();
game.run();
