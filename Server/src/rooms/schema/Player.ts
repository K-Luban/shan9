// Player.ts
import { Schema, type } from "@colyseus/schema";

export class Player extends Schema {
  private _uid: string = "";
  private _playerName: string = "";
  private _wallet: number = 0;
  private _profile: string = "";

  constructor(uid: string, name: string, wallet: number, profile: string) {
    super();
    this._uid = uid;
    this._playerName = name;
    this._wallet = wallet;
    this._profile = profile;
  }

  get uid() {
    return this._uid;
  }

  set uid(value: string) {
    this._uid = value;
  }

  get playerName() {
    return this._playerName;
  }

  set playerName(value: string) {
    this._playerName = value;
  }

  get wallet() {
    return this._wallet;
  }

  set wallet(value: number) {
    this._wallet = value;
  }

  get profile() {
    return this._profile;
  }

  set profile(value: string) {
    this._profile = value;
  }
}