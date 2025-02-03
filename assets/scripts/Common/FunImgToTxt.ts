import { _decorator, Component, Sprite, RenderTexture, ImageAsset, Camera, director, SpriteFrame, Texture2D } from "cc";

const { ccclass, property } = _decorator;

@ccclass("FunImgToTxt")
export class FunImgToTxt extends Component {
    /**
     * Convert a SpriteFrame to a Base64 string.
    **/
    convertSpriteFrameToBase64(spriteFrame: SpriteFrame): string {
        // Check if the spriteFrame has a texture
        if (!spriteFrame.texture) {
            console.error("SpriteFrame does not have a texture.");
            return "";
        }

        const texture = spriteFrame.texture as Texture2D;

        // Get the ImageAsset from the texture
        const imageAsset = texture.image as ImageAsset;

        if (imageAsset && imageAsset.data) {
            const data = imageAsset.data as HTMLCanvasElement | HTMLImageElement;

            // If the data is an HTMLImageElement or HTMLCanvasElement
            if (data instanceof HTMLImageElement) {
                // Create a canvas and draw the image onto it
                const canvas = document.createElement("canvas");
                canvas.width = data.width;
                canvas.height = data.height;

                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(data, 0, 0);
                    return canvas.toDataURL("image/png"); // Convert to Base64
                }
            } else if (data instanceof HTMLCanvasElement) {
                // If it's already a canvas, just get the Base64 string
                return data.toDataURL("image/png");
            }
        }

        console.error("Failed to extract image data from the SpriteFrame.");
        return "";
    }

    /**
     * Convert a Base64 string to a SpriteFrame.
     */
    convertBase64ToSpriteFrame(base64String: string): Promise<SpriteFrame> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = base64String;

            img.onload = () => {
                // Create an ImageAsset from the loaded image
                const imageAsset = new ImageAsset(img);

                // Create a Texture2D and set its image
                const texture = new Texture2D();
                texture.image = imageAsset;

                // Create a SpriteFrame from the texture
                const spriteFrame = new SpriteFrame();
                spriteFrame.texture = texture;

                resolve(spriteFrame);
            };

            img.onerror = (err) => {
                console.error("Error loading Base64 image:", err);
                reject(err);
            };
        });
    }
}
