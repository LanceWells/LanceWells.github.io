import React from 'react';
import { IItemJson } from '../Interfaces/IItemJson';
import { SourceType } from "../Enums/SourceType";
import { ItemType } from "../Enums/ItemType";
import { WeaponProperties } from "../Enums/WeaponProperties";
import { Item } from './Item';
import { Attack } from './Attack';
import { CarpetBorder } from '../../Shops/Enums/CarpetBorder';
import { CardIconMap } from './CardIconMap';

export interface IItemWeaponJson extends IItemJson {
    shortRange: number;
    longRange: number;
    properties: WeaponProperties[];

    /**
     * @description The mapping here is 1 attack to a series of dice rolls that represent that attack.
     * The idea is that multiple damage types necessitate different rolls or modifiers. Each attack is
     * indexed by a unique name.
     */
    attacks: { [index: string]: Attack[] };
}

export class ItemWeapon extends Item implements IItemWeaponJson {
    public readonly key: string = "";
    public title: string = "";
    public description: string = "";
    public details: string = "";
    public iconSource: string = "";
    public source: SourceType = SourceType.Homebrew;
    public itemCopperCost: number = 0;
    public requiresAttunement: boolean = false;
    public readonly type: ItemType = ItemType.Weapon;
    
    public shortRange: number = 20;
    public longRange: number = 60;
    public properties: WeaponProperties[] = [];
    
    /**
     * @description The mapping here is 1 attack to a series of dice rolls that represent that attack.
     * The idea is that multiple damage types necessitate different rolls or modifiers. Each attack is
     * indexed by a unique name.
     */
    public attacks: { [index: string]: Attack[] } = {};

    public constructor() {
        super();
    }

    // http://choly.ca/post/typescript-json/
    static fromJson(json: IItemWeaponJson): ItemWeapon {
        let item = new ItemWeapon();
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
                    <p style ={{
                        padding: `${this.paragraphMargins}`
                    }}>
                        {this.description} {this.details}
                    </p>
                </div>
                <div
                    style={{
                        paddingTop: `${this.titleMargins}`
                    }}>
                    <h5 className="item-description-title">Attacks</h5>
                    <p style={{
                        padding: this.paragraphMargins
                    }}>
                        {this.GetAttackDetails()}
                    </p>
                </div>
                <div
                    style={{
                        paddingTop: `${this.titleMargins}`
                    }}>
                    <h5 className="item-description-title">Properties</h5>
                    <p style={{
                        padding: this.paragraphMargins
                    }}>
                        {this.GetProperties()}
                    </p>
                </div>
            </div>
        );
    }

    public GetCarpetType(): CarpetBorder { return CarpetBorder.Blue }
    public GetItemTextStyle(): React.CSSProperties { return { color: 'rgb(199, 207, 221)' } };
    public GetCardbackSource(): string { return "./images/Item_Shop/ItemCards/CardForge.png"; };

    private GetAttackDetails(): JSX.Element {
        let attackDetails: JSX.Element[] = Object.entries(this.attacks).map(element => {
            let name: string = element[0];
            let damageRolls: Attack[] = element[1];
            let rolls: JSX.Element[] = [];
            
            damageRolls.forEach(roll => {
                if (rolls.length > 0) {
                    rolls.push(
                        <span> and </span>
                    );
                }
                rolls.push (
                    <span className={`text-color-${roll.damageType.toLowerCase()}`}>
                        <span>{`${roll.diceCount}d${roll.diceSize}${roll.modifier > 0 ? `+${roll.modifier}` : ''}`}</span>
                        <span> {roll.damageType} damage</span>
                    </span>
                );
            });

            return (
                <p>
                    <span style={{ fontWeight: "bolder" }}>{name}: </span>{rolls}
                </p>
            );
        })

        return (
            <div>
                {attackDetails}
            </div>
        );
    }

    private GetProperties(): JSX.Element {
        let propertyDetails: JSX.Element[] = this.properties.map(property => {
            return (
                <p>
                    <h6>{property}</h6>
                    {CardIconMap.CardIconWeaponsMap.get(property)?.fullDetails ?? ""}
                </p>
            );
        });

        return (
            <div>
                {propertyDetails}
            </div>
        );
    }
}

export function IItemIsItemWeapon(item: IItemJson): item is ItemWeapon {
    let isType: boolean = true;

    isType = isType && (item as ItemWeapon).type === ItemType.Weapon;
    isType = isType && (item as ItemWeapon).attacks !== undefined;

    return isType;
}
