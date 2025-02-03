import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import Colyseus from 'db://colyseus-sdk/colyseus.js';
import { EventManager, EventManagerInstance } from './EventManager';
import { GameManager } from './GameManager';
import { Player } from './Model/Player';

@ccclass('NetworkManager')
export class NetworkManager extends Component {
    @property hostname = "localhost";
    @property port = 2567;
    @property useSSL = false;

    client!: Colyseus.Client;
    room!: Colyseus.Room;

    start () {
        // Instantiate Colyseus Client
        // connects into (ws|wss)://hostname[:port]
        this.client = new Colyseus.Client(`${this.useSSL ? "wss" : "ws"}://${this.hostname}${([443, 80].includes(this.port) || this.useSSL) ? "" : `:${this.port}`}`);

    }

    async connect() {
        try {
            this.room = await this.client.joinOrCreate("my_room");

            console.log("joined successfully!");
            console.log("user's sessionId:", this.room.sessionId);

            const player = this.node.getComponent(GameManager).sendPlayerData();

            // Log the player data to verify its structure
            console.log("Sending player data:", {
                sessionId: this.room.sessionId,
                ...player.toJSON() // Ensure this is a plain object
            });

            // Send player data to the server
            this.room.send("playerData", {
                sessionId: this.room.sessionId,
                ...player.toJSON() // Use the getter to get a plain object
            });

            this.room.onStateChange((state) => {
                console.log("onStateChange: ", state.toJSON());
            });

            this.room.onLeave((code) => {
                console.log("onLeave:", code);
            });

            // Listen for stage changes
            this.room.onMessage("stage", (stage) => {
                console.log("Game stage changed:", stage);
                // Emit an event with the stage data to the EventManager
                EventManagerInstance.emit("stage-changed", stage);
            });

            // Listen for player count updates
            this.room.onMessage("playerCount", (count) => {
                console.log("Current player count:", count);
                // Emit an event with the player count to the EventManager
                EventManagerInstance.emit("player-count", count);
            });

            EventManagerInstance.emit("room-connected", this.room.sessionId.toString(), this.room.roomId.toString());

        } catch (error) {
            console.error("Error connecting to room:", error);
        }
    }
}