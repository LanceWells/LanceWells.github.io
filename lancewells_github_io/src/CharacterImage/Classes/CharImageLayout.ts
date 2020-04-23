import { PartType } from '../Enums/PartType';

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

        // These get drawn layer-by-layer. The first image we add is the first image drawn.
        // Re-organizing these will change the order in which this information is returned.
        this.EnlistImageIfExists(images, PartType.BackAccessory);
        this.EnlistImageIfExists(images, PartType.Body);
        this.EnlistImageIfExists(images, PartType.Bottoms);
        this.EnlistImageIfExists(images, PartType.Shoes);
        this.EnlistImageIfExists(images, PartType.LowerArmor);
        this.EnlistImageIfExists(images, PartType.Tops);
        this.EnlistImageIfExists(images, PartType.UpperArmor);
        this.EnlistImageIfExists(images, PartType.MidAccessory);
        this.EnlistImageIfExists(images, PartType.ArmArmor);
        this.EnlistImageIfExists(images, PartType.HandWear);
        this.EnlistImageIfExists(images, PartType.Hair);
        this.EnlistImageIfExists(images, PartType.FacialWear);
        this.EnlistImageIfExists(images, PartType.HeadWear);
        this.EnlistImageIfExists(images, PartType.Pets);
        this.EnlistImageIfExists(images, PartType.Weapons);
        this.EnlistImageIfExists(images, PartType.Eyes);

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
