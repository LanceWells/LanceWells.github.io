import './ItemFilter.css';

import React, { ChangeEvent } from 'react';
import { ItemSource } from '../../../Items/Classes/ItemSource';
import { ItemCard } from '../../../Items/React/Common/ItemCard';
import { TAddClick } from '../../../Items/Types/CardButtonCallbackTypes/TAddClick';

interface IItemFilterProps {
    _addItemCallback: TAddClick;
}

interface IItemFilterState {
    _searchKeywords: string[];
}

export class ItemFilter extends React.Component<IItemFilterProps, IItemFilterState> {
    public constructor(props: IItemFilterProps) {
        super(props);
        this.state = {
            _searchKeywords: []
        }
    }

    public render() {
        return (
            <div className="item-filter-container">
                <div className="item-filter-search">
                    <input type="text" name="item filter" onChange={this.HandleSearchInput.bind(this)} />
                </div>
                <div className="item-filter-available">
                    {this.GetCards()}
                </div>
            </div>
        );
    }

    public GetCards(): JSX.Element[] {
        var items = ItemSource.SearchItems(this.state._searchKeywords);
        return items.map(i => {
            return (
                <ItemCard
                    itemDetails={i}
                    onItemClick={undefined}
                    onAttackButton={undefined}
                    onPurchaseButton={undefined}
                    onRemoveButton={undefined}
                    onAddButton={this.props._addItemCallback}
                    cardInteractions={["Add"]}
                />
            );
        });
    }

    private HandleSearchInput(event: ChangeEvent<HTMLInputElement>) {
        var input = event?.target.value;
        if (input !== null) {
            var keywords = input.split(' ');

            this.setState({
                _searchKeywords: keywords
            });
        }
    }
}
