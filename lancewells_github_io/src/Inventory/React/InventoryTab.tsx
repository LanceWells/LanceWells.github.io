import React from 'react';
import { IItem } from '../../ItemData/Interfaces/IItem';
import { ItemType } from '../../ItemData/Enums/ItemType';
import { ItemClick } from '../../ItemData/Types/CardButtonCallbackTypes/ItemClick';
import { AttackClick } from '../../ItemData/Types/CardButtonCallbackTypes/AttackClick';
import { ItemCard } from '../../ItemData/React/ItemCard';
import { CardInteractions } from '../../ItemData/Enums/CardInteractions';
import { AttuneClick } from '../../ItemData/Types/CardButtonCallbackTypes/AttuneClick';
import { UnattuneClick } from '../../ItemData/Types/CardButtonCallbackTypes/UnattuneClick';

interface IInventoryTabProps {
    items: IItem[];
    itemType: ItemType;
    itemClick: ItemClick;
    attackClick: AttackClick;
    attuneClick: AttuneClick;
    unattuneClick: UnattuneClick;
    availableAttunementSlots: number;
}

interface IInventoryTabState {
}

export class InventoryTab extends React.Component<IInventoryTabProps, IInventoryTabState> {
    public constructor(props: IInventoryTabProps) {
        super(props);
        this.state = {
        }
    }

    public render() {
        let itemCards: JSX.Element[] = this.props.items.map(i => {
            return (
                <ItemCard
                    itemDetails={i}
                    onItemClick={this.props.itemClick}
                    onAttackButton={this.props.attackClick}
                    onPurchaseButton={undefined}
                    onStageButton={undefined}
                    onUnstageButton={undefined}
                    onAttuneButton={this.props.attuneClick}
                    onUnattuneButton={this.props.unattuneClick}
                    onBagButton={undefined}
                    cardInteractions={[
                        CardInteractions.Use,
                        CardInteractions.Remove,
                        CardInteractions.Attune
                    ]}
                    showCardCost={false}
                    availablePlayerCopper={undefined}
                    availableAttunementSlots={this.props.availableAttunementSlots}
                />
            )
        });

        return (
            <div className="inventory-tab">
                {itemCards}
            </div>
        )
    }
}
