import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player {
    private _uid: string;
    private _playerName: string;
    private _wallet: number;
    private _profile: string;

    constructor(uid: string = '', playerName: string = 'ABC', wallet: number = 1000, profile: string = '') {
        this._uid = uid;
        this._playerName = playerName;
        this._wallet = wallet;
        this._profile = profile;
    }

    get uid(): string {
        return this._uid;
    }

    set uid(value: string) {
        this._uid = value;
    }

    get playerName(): string {
        return this._playerName;
    }

    set playerName(value: string) {
        this._playerName = value;
    }

    get wallet(): number {
        return this._wallet;
    }

    set wallet(value: number) {
        this._wallet = value;
    }

    get profile(): string {
        return this._profile;
    }

    set profile(value: string) {
        this._profile = value;
    }

    toJSON() {
        return {
            uid: this._uid,
            playerName: this._playerName,
            wallet: this._wallet,
            profile: this._profile
        };
    }
}
