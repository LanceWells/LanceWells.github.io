import React from 'react';
import { IItem } from '../Interfaces/IItem';
import { IItemJson } from '../Interfaces/IItemJson';
import { SourceType } from '../Enums/SourceType';
import { ItemModifications } from '../Enums/ItemModifications';
import { ItemType } from '../Enums/ItemType';
import { CarpetBorder } from '../../Shops/Enums/CarpetBorder';

export abstract class Item implements IItem {
    public RenderItemDescription(): JSX.Element {
        return (
            <div>
                <div
                    style={{
                    }}>
                    <h5 className="item-description-title">Details</h5>
                    <p style={{
                        padding: `${this.paragraphMargins}`
                    }}>
                        {this.description} {this.details}
                    </p>
                </div>
            </div>
        );
    }

    public GetEqualityString(): string {
        return (JSON.stringify(this as IItemJson));
    }

    public abstract GetCarpetType(): CarpetBorder;
    
    key: string = "";
    title: string = "";
    description: string = "";
    details: string = "";
    iconSource: string = "";
    source: SourceType = SourceType.Homebrew;
    itemCopperCost: number = 0;
    requiresAttunement: boolean = false;
    modifications: ItemModifications[] = [];
    type: ItemType = ItemType.Wondrous;

    protected readonly paragraphMargins: string = "0 15px 0 15px";
    protected readonly titleMargins: string = "15px 0 0 0";
}
