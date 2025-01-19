import { _decorator, Component, Node, SpriteFrame, Enum } from 'cc';
const { ccclass, property } = _decorator;

// Register the CardType enum for use in the editor
enum CardType {
    Spade,
    Diamond,
    Heart,
    Club
}

@ccclass('Card')
export class Card extends Component {
    @property
    private _cardName: string = '';

    // Use the proper `type` field to associate with the enum
    @property({ type: Enum(CardType) })
    private _type: CardType = CardType.Club;

    @property
    private _value: number = 0;

    @property
    private _image: string = '';

    get name(): string {
        return this._cardName;
    }

    set name(value: string) {
        this._cardName = value;
    }

    get type(): CardType {
        return this._type;
    }

    set type(value: CardType) {
        this._type = value;
    }

    get value(): number {
        return this._value;
    }

    set value(value: number) {
        this._value = value;
    }

    get image(): string {
        return this._image;
    }

    set image(value: string) {
        this._image = value;
    }
}