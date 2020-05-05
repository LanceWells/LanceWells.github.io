import React from 'react';
import { IItem } from '../../ItemData/Interfaces/IItem';
import { Tab } from 'react-bootstrap';
import { ItemType } from '../../ItemData/Enums/ItemType';
import { ItemClick } from '../../ItemData/Types/ItemClick';
import { AttackClick } from '../../ItemData/Types/CardButtonCallbackTypes/AttackClick';
import { ItemCard } from '../../ItemData/React/ItemCard';
import { CardInteractions } from '../../ItemData/Enums/CardInteractions';

interface IInventoryTabProps {
    items: IItem[];
    itemType: ItemType;
    itemClick: ItemClick;
    attackClick: AttackClick;
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
                    onRemoveButton={undefined}
                    onAddButton={undefined}
                    cardInteractions={[
                        CardInteractions.Use
                    ]}
                />
            )
        });
        // { itemCards }

        return (
            <div className="inventory-tab">
                {itemCards}
            </div>
        )
    }
}
// <Tab eventKey={this.props.itemType.toString()} title={this.props.itemType.toString()}>
//     Test!
// </Tab>
// <Tab eventKey={this.props.itemType.toString()} title={this.props.itemType.toString()}>
//     Test!
//             </Tab>