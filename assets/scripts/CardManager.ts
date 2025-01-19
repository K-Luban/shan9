import { _decorator, Component, JsonAsset, Node, resources, Button, SpriteFrame, Sprite } from 'cc';
import { Card } from './Model/Card';
const { ccclass, property } = _decorator;

@ccclass('CardManager')
export class CardManager extends Component {
    private cards: Card[] = [];
    private currentCardIndex: number = 0;

    @property(Button)
    btn: Button | null = null;

    @property(Sprite)
    cardSprite: Sprite | null = null;

    start() {
        // Load the JSON file from resources
        resources.load('cards/PlayingCards', JsonAsset, (err, jsonAsset) => {
            if (err) {
                console.error("Error loading card data:", err);
                return;
            }
            this.cards = jsonAsset.json as Card[];
            console.log("Loaded and Shuffled Cards:", this.cards);
        });
    }

    private shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    public showNextCard() {
        this.shuffleCards();
        if (this.cards.length === 0) {
            console.log("No cards to display.");
            return;
        }
        const card = this.cards[this.currentCardIndex];
        console.log("Displaying Card:", card);
        this.setCardImage(card.image);
        this.currentCardIndex = (this.currentCardIndex + 1) % this.cards.length;
    }

    setCardImage(imageName: string) {
        console.log("Loading card image:", imageName);
        resources.load(`images/cards/${imageName}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.error("Error loading card image:", err);
                return;
            }
            if (this.cardSprite) {
                this.cardSprite.spriteFrame = spriteFrame;
            }
        });
    }

    onLoad() {
        if (this.btn) {
            this.btn.node.on('click', this.showNextCard, this);
        }
    }
}


