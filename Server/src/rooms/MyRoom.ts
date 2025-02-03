  import { Room, Client } from "@colyseus/core";
  import { MyRoomState } from "./schema/MyRoomState";
  import { Player } from "./schema/Player";

  // Define game stages
  enum GameStage {
    ROOM_JOINED = "Room joined",
    STARTING = "Starting",
    IN_GAME = "In-game",
    GAME_END = "Game end"
  }

  export class MyRoom extends Room<MyRoomState> {
    maxClients = 5;
    currentStage: GameStage = GameStage.ROOM_JOINED; // Initialize with ROOM_JOINED
    playersData: { [sessionId: string]: any } = {}; // Store player data

    onCreate (options: any) {
      this.setState(new MyRoomState());

      // Emit the current stage to all clients
      this.broadcast("stage", this.currentStage);
    }

    onJoin (client: Client, options: any) {
      if (this.clients.length > this.maxClients) {
        client.leave(); // Force the client to leave if the room is full
        console.log(client.sessionId, "tried to join, but the room is full!");
        return;
      }
      
      console.log(client.sessionId, "joined with room id", this.roomId);
      this.broadcast("stage", this.currentStage); // Notify clients of the new stage
      
      // Emit the current player count to all clients
      this.broadcast("playerCount", this.clients.length);

      // Check if the room is full and update the stage to STARTING after 10 seconds
      if (this.clients.length === this.maxClients) {
        this.updateStage(GameStage.STARTING);
      }

      this.onMessage("playerData", (client, data) => {
        console.log(`Received Player Data from ${client.sessionId}:`, data);
    
        // If you want, you can convert it back to a Player object
        const player = new Player(data.uid, data.playerName, data.wallet, data.profile);
        console.log("Converted to Player instance:", player);
        this.state.players.set(client.sessionId, player);
      })
    }

    onLeave (client: Client, consented: boolean) {
      console.log(client.sessionId, "left!");
      delete this.playersData[client.sessionId]; // Remove player data on leave
    }

    onDispose() {
      console.log("room", this.roomId, "disposing...");
    }

    // Add a method to update the game stage
    updateStage(newStage: GameStage) {
      this.currentStage = newStage;
      this.broadcast("stage", this.currentStage);
    }
  }