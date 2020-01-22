import React from 'react';
import { IItem, IItemJson } from '../Interfaces/IItem';
import { TItemModifications } from '../Types/TCardModifications';

export abstract class Item implements IItem {
    RenderItemDescription(): JSX.Element {
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

    GetEqualityString(): string {
        return (JSON.stringify(this as IItemJson));
    }
    
    key: string = "";
    title: string = "";
    description: string = "";
    details: string = "";
    iconSource: string = "";
    source: import("../Types/TSourceType").TSourceType = "Homebrew";
    itemCost: number = 0;
    requiresAttunement: boolean = false;
    modifications: TItemModifications[] = [];
    type: import("../Types/TItemType").TItemType = "Wondrous";

    protected readonly paragraphMargins: string = "0 15px 0 15px";
    protected readonly titleMargins: string = "15px 0 0 0";
}
