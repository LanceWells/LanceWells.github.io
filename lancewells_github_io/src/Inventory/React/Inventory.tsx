import React from 'react';
import { CharacterStateManager } from '../../FirebaseAuth/Classes/CharacterStateManager';
import { IItem } from '../../ItemData/Interfaces/IItem';
import { ItemSource } from '../../ItemData/Classes/ItemSource';
import { ItemCard } from '../../ItemData/React/ItemCard';

export interface IInventoryProps {
}

export interface IInventoryState {
    items: IItem[];
}

export class Inventory extends React.Component<IInventoryProps, IInventoryState> {
    public constructor(props: IInventoryProps) {
        super(props);
        this.state = {
            items: []
        };

        this.UpdateItems();
    }

    private async UpdateItems() {
        let newItems: IItem[] = [];

        CharacterStateManager.GetInstance().GetCurrentStaticCharacterData().then(char => {
            if (char !== undefined) {
                char.Items.forEach(item => {
                    let foundItem: IItem | undefined = ItemSource.GetItem(item.key, item.type);

                    if (foundItem !== undefined) {
                        newItems.push(foundItem);
                    }
                });

                this.setState({
                    items: newItems
                });
            }
        });
    }

    public render() {
        let itemCards: JSX.Element[] = this.state.items.map(i => {
            return (
                <ItemCard
                    itemDetails={i}
                    onItemClick={undefined}
                    onAttackButton={undefined}
                    onPurchaseButton={undefined}
                    onRemoveButton={undefined}
                    onAddButton={undefined}
                    cardInteractions={[]}
                />
            )
        })

        return (
            <div>
                {itemCards}
            </div>
        )
    }
}
