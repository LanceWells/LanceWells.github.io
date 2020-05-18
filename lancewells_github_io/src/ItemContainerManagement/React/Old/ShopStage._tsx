import './ShopStage.css';

import React from 'react';
import { IItem } from '../../../Items/Interfaces/IItem';
import { ItemCard } from '../../../Items/React/Common/ItemCard';
import { TRemoveClick } from '../../../Items/Types/CardButtonCallbackTypes/TRemoveClick';

interface IShopStageProps {
    _stagedItems: IItem[];
    _handleRemoveCallback: TRemoveClick;
}

interface IShopStageState {
}

export class ShopStage extends React.Component<IShopStageProps, IShopStageState> {
    public constructor(props: IShopStageProps) {
        super(props);
        this.state = {
        };
    }

    public render() {
        return (
            <div className="shop-stage">
                <h2 className='mgr-title'>Staged Items</h2>
                {this.GetCards()}
            </div>
        )
    }

    private GetCards(): JSX.Element[] {
        return (this.props._stagedItems.map(item => {
            return (
                <ItemCard
                    itemDetails={item}
                    onItemClick={undefined}
                    onAttackButton={undefined}
                    onPurchaseButton={undefined}
                    onRemoveButton={this.props._handleRemoveCallback.bind(this)}
                    onAddButton={undefined}
                    cardInteractions={["Remove"]}
                />
            )
        }))
    }
}
