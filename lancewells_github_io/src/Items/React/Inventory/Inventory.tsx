import './Inventory.css';
import React from 'react';
import { IItem } from '../../Interfaces/IItem';
import { ItemCard, TItemClick } from '../Common/ItemCard';
import { TRemoveClick } from '../../Types/CardButtonCallbackTypes/TRemoveClick';
import { AttackRollModal } from '../Common/AttackRollModal';
import { TAttackClick } from '../../Types/CardButtonCallbackTypes/TAttackClick';
import { TAttack } from '../../Types/TAttack';
import { ItemWondrous } from '../../Classes/ItemWondrous';
import { ItemDetailsModal } from '../Common/ItemDetailsModal';
import { IPlayerProfile } from '../../../GamePage/Interfaces/IPlayerProfile';
import { TItemType } from '../../Types/TItemType';
import { ItemArmor } from '../../Classes/ItemArmor';
import { ItemPotion } from '../../Classes/ItemPotion';
import { ItemWeapon } from '../../Classes/ItemWeapon';

interface IInventoryProps {
    userProfile: IPlayerProfile;
    removeCallback: TRemoveClick;
}

interface IInventoryState {
    armorItems: Array<IItem>;
    potionItems: Array<IItem>;
    weaponItems: Array<IItem>;
    wondrousItems: Array<IItem>;

    showAttackRoll: boolean;
    attackName: string;
    attackRolls: TAttack[];

    showItemDialog: boolean;
    itemDetails: IItem;
}

export class Inventory extends React.Component<IInventoryProps, IInventoryState> {
    private getArmor(items: IItem[], itemClick: TItemClick, removeCallback: TRemoveClick) {
        return items.map((item) => {
            return (
                <ItemCard
                    itemDetails={item}
                    onItemClick={itemClick}
                    onAttackButton={undefined}
                    onPurchaseButton={undefined}
                    onRemoveButton={removeCallback}
                    cardInteractions={["Use", "Remove"]}
                />
            );
        });
    }

    private getPotions(items: IItem[], itemClick: TItemClick, removeCallback: TRemoveClick) {
        return items.map((item) => {
            return (
                <ItemCard
                    itemDetails={item}
                    onItemClick={itemClick}
                    onAttackButton={undefined}
                    onPurchaseButton={undefined}
                    onRemoveButton={removeCallback}
                    cardInteractions={["Use", "Remove"]}
                />
            );
        });
    }

    private getWeapons(items: IItem[], itemClick: TItemClick, removeCallback: TRemoveClick, attackCallback: TAttackClick) {
        return items.map((item) => {
            return (
                <ItemCard
                    itemDetails={item}
                    onItemClick={itemClick}
                    onAttackButton={attackCallback}
                    onPurchaseButton={undefined}
                    onRemoveButton={removeCallback}
                    cardInteractions={["Use", "Remove"]}
                />
            );
        });
    }

    private getWondrous(items: IItem[], itemClick: TItemClick, removeCallback: TRemoveClick) {
        return items.map((item) => {
            return (
                <ItemCard
                    itemDetails={item}
                    onItemClick={itemClick}
                    onAttackButton={undefined}
                    onPurchaseButton={undefined}
                    onRemoveButton={removeCallback}
                    cardInteractions={["Use", "Remove"]}
                />
            );
        });
    }

    // private handleStorageChange() {
    //     this.updateFromInventory();
    // }

    // private updateFromInventory() {
    //     this.setState({
    //         armorItems: this.GetItemsOfType("Armor"),
    //         potionItems: this.GetItemsOfType("Potion"),
    //         weaponItems: this.GetItemsOfType("Weapon"),
    //         wondrousItems: this.GetItemsOfType("Wondrous"),
    //     });
    // }

    private GetItemsOfType(type: TItemType) {
        return this
            .props
            .userProfile
            .CharData
            .inventory
            .filter(i => i.type == type);
    }

    public constructor(props: IInventoryProps) {
        super(props);
        this.state = {
            armorItems: [],
            potionItems: [],
            weaponItems: [],
            wondrousItems: [],
            showAttackRoll: false,
            attackName: "",
            attackRolls: [],
            showItemDialog: false,
            itemDetails: new ItemWondrous(),
        }

        // const handleChange = this.handleStorageChange;
        // CharacterState.GetInstance().onInventoryChanged(handleChange.bind(this))
    }

    // componentDidMount() {
    //     // this.updateFromInventory();

    //     // var profile: IPlayerProfile = {
    //     //     ProfileType: "Player",
    //     //     ProfileImage: "img.src",
    //     //     ProfileName: "FirstProfile",
    //     //     GameID: null,
    //     //     CharData: new CharacterData()
    //     // };

    //     // UserDataAuth.GetInstance().CreateNewProfile(profile);
    //     // UserDataAuth.GetInstance().FetchProfileData("FirstProfile");
    // }

    componentDidMount() {
        console.log("MOUNT");
    }

    public render() {
        // const removeButton = (item: IItem) => {
        //     CharacterState.GetInstance().RemoveItemFromCurrentCharacter(item);
        // }
        // this.updateFromInventory();

        var armor = this.GetItemsOfType("Armor");
        var weapons = this.GetItemsOfType("Weapon");
        var potions = this.GetItemsOfType("Potion");
        var wondrous = this.GetItemsOfType("Wondrous");

        const handleItemClick: TItemClick = (item: IItem) => {
            this.setState({
                itemDetails: item,
                showItemDialog: true
            });
        };

        const hideDetailsModal = () => {
            this.setState({
                showItemDialog: false,
            });
        };

        const showAttackModal: TAttackClick = (attackName: string, attackRolls: TAttack[]) => {
            this.setState({
                showAttackRoll: true,
                attackName: attackName,
                attackRolls: attackRolls
            });
        };

        const hideAttackModal = () => {
            this.setState({
                showAttackRoll: false
            })
        };

        // {CharacterState.GetInstance().CurrentCharacter}

        return (
            <div className="inventory-container">
                <AttackRollModal
                    show={this.state.showAttackRoll}
                    onHide={hideAttackModal}
                    attackName={this.state.attackName}
                    attacks={this.state.attackRolls} />
                <ItemDetailsModal
                    show={this.state.showItemDialog}
                    hideModal={hideDetailsModal}
                    itemDetails={this.state.itemDetails} />
                <div className="inventory-title-container">
                    <h2 className="inventory-title-underlined">
                        {this.props.userProfile.ProfileName}
                    </h2>
                </div>
                <div className="inventory-card-container">
                    <div className="inventory-card-container-title">
                        Armor
                    </div>
                    <div className="inventory-cards">
                        {this.getArmor(armor, handleItemClick, this.props.removeCallback)}
                    </div>
                </div>
                <div className="inventory-card-container">
                    <div className="inventory-card-container-title">
                        Potions
                    </div>
                    <div className="inventory-cards">
                        {this.getPotions(potions, handleItemClick, this.props.removeCallback)}
                    </div>
                </div>
                <div className="inventory-card-container">
                    <div className="inventory-card-container-title">
                        Weapons
                    </div>
                    <div className="inventory-cards">
                        {this.getWeapons(weapons, handleItemClick, this.props.removeCallback, showAttackModal)}
                    </div>
                </div>
                <div className="inventory-card-container">
                    <div className="inventory-card-container-title">
                        Wondrous Items
                    </div>
                    <div className="inventory-cards">
                        {this.getWondrous(wondrous, handleItemClick, this.props.removeCallback)}
                    </div>
                </div>
            </div>
        );
    }
}
