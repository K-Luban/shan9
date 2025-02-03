import { _decorator, Component } from 'cc';
import { NetworkManager } from './NetworkManager';
import { EventManagerInstance } from './EventManager';
import { UIManager } from './UIManager';
import { Player } from './Model/Player';

const { ccclass, property } = _decorator;

enum GameStage {
    ROOM_JOINED = "Room joined",
    STARTING = "Starting",
    IN_GAME = "In-game",
    GAME_END = "Game end"
  }

@ccclass('GameManager')
export class GameManager extends Component {
    private networkManager: NetworkManager | null = null;
    private uiManager: UIManager | null = null;


    private maxClients: number = 5;
    private currentClientCount: number = 0;

    private player: Player = new Player();

    onLoad() {
        // Get components and check if they exist
        this.networkManager = this.node.getComponent(NetworkManager);
        this.uiManager = this.node.getComponent(UIManager);

        // Register event listeners
        EventManagerInstance.on('room-connected', this.onRoomConnected, this);
        EventManagerInstance.on('stage-changed', this.onStageChanged, this);
        EventManagerInstance.on('player-count', this.onPlayerCount, this);
    }

    start() {
        this.uiManager.bindPlayerData(this.player);
    }

    onDestroy() {
        EventManagerInstance.off('room-connected', this.onRoomConnected, this);
        EventManagerInstance.off('stage-changed', this.onStageChanged, this);
        EventManagerInstance.off('player-count', this.onPlayerCount, this);
    }

    private onRoomConnected(sessionId: string, roomId: string) {
        console.log('GameManager: Room connected', sessionId, roomId);
        setTimeout(() => {
            this.uiManager.enterLobby(sessionId.toString(), roomId.toString());
        }, 1000);
    }

    private onStageChanged(stage: GameStage) {
        switch (stage) {
            case GameStage.ROOM_JOINED:
                console.log('GameManager: Room joined');
                this.lobbyJoined();
                break;
            case GameStage.STARTING:
                console.log('GameManager: Starting');
                break;
            case GameStage.IN_GAME:
                console.log('GameManager: In-game');
                break;
            case GameStage.GAME_END:
                console.log('GameManager: Game end');
                break;
        }
    }

    private onPlayerCount(count: number) {
        console.log('GameManager: Player count', count);
        this.currentClientCount = count;
    }

    roomEnter() {
        this.networkManager.connect();
    }

    lobbyJoined() {
        this.uiManager.lobbyJoined();
    }

    setPlayerName(name: string) {
        this.player.playerName = name;
        this.uiManager.setPlayerName(name);
    }

    sendPlayerData() {
        return this.player;
    }

    public getCurrentClientCount(): number {
        return this.currentClientCount;
    }

    public getMaxClients(): number {
       return this.maxClients;
    }
}