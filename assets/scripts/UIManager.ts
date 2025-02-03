import { _decorator, Component, Node, find, Button, Label, VideoPlayer, resources, Prefab, instantiate, Animation, tween, Vec3, Size, UITransform, sp, Sprite, EditBox, VideoClip } from 'cc';
import { UI_LOBBY, UI_MAIN } from './Common/GLOBALS';
import { GameManager } from './GameManager';
import { Player } from './Model/Player';

const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {

    gameManager: GameManager = new GameManager();

    //Node
    private mainPanel: Node | null = null;
    private lobbyPanel: Node | null = null;
    private loading: Node | null = null;
    private bg: Node | null = null;
    private girlChar: Node | null = null;
    private profilePanel: Node | null = null;
    private namePanel: Node | null = null;
    private walletPanel: Node | null = null;
    private renamePanel: Node | null = null;

    //Label
    private lblStatus: Label | null = null;
    private lblName: Label | null = null;
    private lblWallet: Label | null = null;

    //Button
    private btnStart: Button | null = null;
    private btnClose_Rename: Button | null = null;
    private btnSetting: Button | null = null;
    private btnRename: Button | null = null;

    //Video
    private introVdo: VideoPlayer | null = null;

    //Sprite
    private sprProfile: Sprite | null = null;
    private sprNameFrame: Sprite | null = null;
    private sprWalletFrame: Sprite | null = null;
    private sprSettingFrame: Sprite | null = null;
    private sprSetting: Sprite | null = null;

    //EditBox
    private edbRename: EditBox | null = null;

    private initBGWidth: number = 2160.378;
    private initBGHeight: number = 1215.212625;


    init() {
        //Main
        this.mainPanel = find(UI_MAIN.SELF);
        this.btnStart = find(UI_MAIN.BTN_START).getComponent(Button);
        this.girlChar = find(UI_MAIN.GIRL_CHAR);

        //Lobby
        this.lobbyPanel = find(UI_LOBBY.SELF);
        this.bg = find(UI_LOBBY.BG);
        this.lblStatus = find(UI_LOBBY.LBL_STATUS).getComponent(Label);
        this.introVdo = find(UI_LOBBY.INTRO_VDO).getComponent(VideoPlayer);

        //Profile
        this.profilePanel = find(UI_MAIN.PROFILE.PROFILE_PANEL);
        this.sprProfile = find(UI_MAIN.PROFILE.SPR_PROFILE).getComponent(Sprite);
        this.namePanel = find(UI_MAIN.PROFILE.NAME.NAME_PANEL);
        this.sprNameFrame = find(UI_MAIN.PROFILE.NAME.SPR_NAME_FRAME).getComponent(Sprite);
        this.lblName = find(UI_MAIN.PROFILE.NAME.LBL_NAME).getComponent(Label);
        this.lblWallet = find(UI_MAIN.PROFILE.WALLET.LBL_WALLET).getComponent(Label);
        this.renamePanel = find(UI_MAIN.PROFILE.RENAME.RENAME_PANEL);
        this.edbRename = find(UI_MAIN.PROFILE.RENAME.EDB_RENAME).getComponent(EditBox);
        this.btnRename = find(UI_MAIN.PROFILE.RENAME.BTN_RENAME).getComponent(Button);
        this.btnClose_Rename = find(UI_MAIN.PROFILE.RENAME.BTN_CLOSE).getComponent(Button);

        //Setting
        this.btnSetting = find(UI_MAIN.SETTING.BTN_SETTING).getComponent(Button);
        this.sprSettingFrame = find(UI_MAIN.SETTING.SPR_SETTING_FRAME).getComponent(Sprite);
        this.sprSetting = find(UI_MAIN.SETTING.SPR_SETTING).getComponent(Sprite);

        //Button Callbacks
        this.btnStart.node.on(Node.EventType.MOUSE_UP, this.onStartBtnClick, this);
        this.namePanel.on(Node.EventType.MOUSE_DOWN, this.onNamePanelClick, this);
        this.btnRename.node.on(Button.EventType.CLICK, this.onRenameBtnClick, this);
        this.btnClose_Rename.node.on(Button.EventType.CLICK, this.onCloseRenameBtnClick, this);

        // Video Event Listener
        this.introVdo.node.on(VideoPlayer.EventType.COMPLETED, this.onVideoCompleted, this);
    }

    onLoad() {
        this.init();
        this.gameManager = this.node.getComponent(GameManager);
    }
    
    start() {
        this.hideAllPanels();
        this.mainPanel.active = true;
        this.girlChar.getComponent(sp.Skeleton).timeScale = 0.5;

        let label_name_size = this.lblName.node.getComponent(UITransform).contentSize.width;
        this.sprNameFrame.node.getComponent(UITransform).setContentSize(label_name_size + 70, 64);
    }

    protected update(dt: number): void {

    }

    hideAllPanels() {
        this.mainPanel.active = false;
        this.lobbyPanel.active = false;
        this.renamePanel.active = false;
    }

    public bindPlayerData(player: Player) {
        if (!this.lblName || !this.lblWallet) {
            console.error("lblName or lblWallet is not initialized!");
            return;
        }
    
        this.lblName.string = player.playerName || "Unknown";
        this.sprNameFrame.node.getComponent(UITransform).setContentSize(this.lblName.node.getComponent(UITransform).contentSize.width + 70, 64);
        this.lblWallet.string = player.wallet?.toString() || "0";
    }    

    onStartBtnClick() {
        this.gameManager.roomEnter();
        // resources.load('videos/Shan_9_room', VideoClip, (err, clip) => {
        //     console.log("Error loading video clip: ", err || "No error information available");
        //     if (!err) {
        //         this.introVdo.clip = clip;
        //     }
        // });
    }

    enterLobby(sessionId: string, roomId: string) {
        this.hideAllPanels();
        this.lobbyPanel.active = true;
        this.lblStatus.string = "Session ID: " + sessionId + "\nRoom ID: " + roomId; //For Temp
        
        resources.load('prefabs/Loading', Prefab, (err, prefab) => {
            if (!err) {
                this.loading = instantiate(prefab);
                this.lobbyPanel.addChild(this.loading);
                this.loading.setPosition(960, 540);
                this.loading.active = false;
            }
        });
    }

    lobbyJoined() {
        this.introVdo.node.active = true;
        this.introVdo.play();
    }

    private onVideoCompleted() {
        this.introVdo.node.active = false;
        const uiTransform = this.bg.getComponent(UITransform);
        tween(uiTransform)
            .to(1, { contentSize: new Size(1920, 1080) }, { easing: 'quadIn' })
            .call(() => {
                this.showLoading(this.gameManager.getCurrentClientCount(), this.gameManager.getMaxClients());
            })
            .start();
    }

    showLoading(count: number, maxClients: number) {
        if (count < maxClients) {
            setTimeout(() => {
                this.loading.active = true;
            }, 300);
        }
    }

    onNamePanelClick() {
        console.log("Name panel clicked!");
        this.renamePanel.active = true;
    }

    onRenameBtnClick() {
        this.gameManager.setPlayerName(this.edbRename.string);
        this.renamePanel.active = false;
    }

    onCloseRenameBtnClick() {
        this.renamePanel.active = false;
    }

    setPlayerName(name: string) {
        this.lblName.string = name;
    }
}
