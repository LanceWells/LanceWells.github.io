import { PartType } from '../Enums/PartType';
import { CharacterImageMap } from './CharacterImageMap';

export class CharImageLayout {
    private ImageSelection: Map<PartType, string> = new Map();

    public CharImageLayout() {
        this.ImageSelection = new Map();
    }

    public SetPartImage(partType: PartType, image: string): void {
        this.ImageSelection.set(partType, image);
    }

    public ResetImage(): void {
        this.ImageSelection = new Map();
    }

    public GetImages(): string[] {
        let images: string[] = [];
        
        CharacterImageMap.PartOrder.forEach(part => {
            this.EnlistImageIfExists(images, part);
        });

        return images;
    }

    private EnlistImageIfExists(images: string[], partType: PartType) {
        if (this.ImageSelection.has(partType)) {
            let image: string
            image = this.ImageSelection.get(partType) as string;
            images.push(image);
        }
    }
}
