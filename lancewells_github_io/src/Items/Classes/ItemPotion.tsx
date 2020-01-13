import React from 'react';
import { IItemJson } from '../Interfaces/IItem';
import { Item } from './Item';
import { TSourceType } from "../Types/TSourceType";
import { TItemType } from "../Types/TItemType";

export interface IItemPotionJson extends IItemJson {
    hasWithdrawalEffect: boolean;
}

export class ItemPotion extends Item implements IItemPotionJson {
    public readonly key: string = "";
    public title: string = "";
    public description: string = "";
    public details: string = "";
    public iconSource: string = "";
    public source: TSourceType = "Homebrew";
    public itemCost: number = 0;
    public requiresAttunement: boolean = false;
    public readonly type: TItemType = "Potion";

    public hasWithdrawalEffect: boolean = false;
    
    static fromJson(json: IItemPotionJson): ItemPotion {
        let item = new ItemPotion();
        return Object.assign(item, json, {
        });
    }

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
                        {this.description} {this.details} {this.GetWithdrawalEffectClause()}
                    </p>
                </div>
            </div>
        );
    }

    GetWithdrawalEffectClause(): JSX.Element {
        var clause: JSX.Element;
        if (this.hasWithdrawalEffect) {
            clause = (
                <span>
                    <span>Using this potion will result in a </span>
                    <span className="text-color-withdrawal">withdrawal effect</span>
                    <span>.</span>
                </span>
            )
        }
        else {
            clause = (
                <span></span>
            )
        }

        return clause;
    }
}

export function IItemIsItemPotion(item: IItemJson): item is ItemPotion {
    var isType: boolean = true;

    isType = isType && (item as ItemPotion).type === "Potion";

    return isType;
}
