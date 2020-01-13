import React from 'react';
import { IItem } from '../Interfaces/IItem';

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
    
    key: string = "";
    title: string = "";
    description: string = "";
    details: string = "";
    iconSource: string = "";
    source: import("../Types/TSourceType").TSourceType = "Homebrew";
    itemCost: number = 0;
    requiresAttunement: boolean = false;
    type: import("../Types/TItemType").TItemType = "Wondrous";

    protected readonly paragraphMargins: string = "0 15px 0 15px";
    protected readonly titleMargins: string = "15px 0 0 0";
}
