import { _decorator, Component, EventTarget } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('EventManager')
export class EventManager extends Component{
    private static instance: EventManager;
    private eventTarget: EventTarget;

    private constructor() {
        super();    
        this.eventTarget = new EventTarget();
    }

    static getInstance(): EventManager {
        if (!this.instance) {
            this.instance = new EventManager();
        }
        return this.instance;
    }

    emit(eventName: string, ...args: any[]): void {
        console.log(`Event emitted: ${eventName}`, ...args);
        this.eventTarget.emit(eventName, ...args);
    }

    on(eventName: string, callback: (...args: any[]) => void, target?: any): void {
        console.log(`Listener registered for: ${eventName}`);
        this.eventTarget.on(eventName, callback, target);
    }

    off(eventName: string, callback: (...args: any[]) => void, target?: any): void {
        console.log(`Listener unregistered for: ${eventName}`);
        this.eventTarget.off(eventName, callback, target);
    }

    clear(): void {
        console.log('All listeners cleared.');
        this.eventTarget.targetOff(this);
    }
}

export const EventManagerInstance = EventManager.getInstance();