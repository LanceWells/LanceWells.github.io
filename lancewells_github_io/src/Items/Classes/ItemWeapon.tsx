import React from 'react';
import { IItemJson } from '../Interfaces/IItem';
import { Item } from './Item';
import { TSourceType } from "../Types/TSourceType";
import { TItemType } from "../Types/TItemType";
import { TAttack } from "../Types/TAttack";
import { TWeaponProperties } from "../Types/TWeaponProperties";

export interface IItemWeaponJson extends IItemJson {
    shortRange: number;
    longRange: number;
    properties: TWeaponProperties[];

    /**
     * @description The mapping here is 1 attack to a series of dice rolls that represent that attack.
     * The idea is that multiple damage types necessitate different rolls or modifiers. Each attack is
     * indexed by a unique name.
     */
    attacks: { [index: string]: TAttack[] };
}

export class ItemWeapon extends Item implements IItemWeaponJson {
    public readonly key: string = "";
    public title: string = "";
    public description: string = "";
    public details: string = "";
    public iconSource: string = "";
    public source: TSourceType = "Homebrew";
    public itemCost: number = 0;
    public requiresAttunement: boolean = false;
    public readonly type: TItemType = "Weapon";
    
    public shortRange: number = 20;
    public longRange: number = 60;
    public properties: TWeaponProperties[] = [];
    
    /**
     * @description The mapping here is 1 attack to a series of dice rolls that represent that attack.
     * The idea is that multiple damage types necessitate different rolls or modifiers. Each attack is
     * indexed by a unique name.
     */
    public attacks: { [index: string]: TAttack[] } = {};

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

    private GetAttackDetails(): JSX.Element {
        var attackDetails: JSX.Element[] = Object.entries(this.attacks).map(element => {
            let name: string = element[0];
            let damageRolls: TAttack[] = element[1];
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
        var propertyDetails: JSX.Element[] = this.properties.map(property => {
            return (
                <div>
                    {property}
                </div>
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
    var isType: boolean = true;

    isType = isType && (item as ItemWeapon).type === "Weapon";
    isType = isType && (item as ItemWeapon).attacks !== undefined;

    return isType;
}
