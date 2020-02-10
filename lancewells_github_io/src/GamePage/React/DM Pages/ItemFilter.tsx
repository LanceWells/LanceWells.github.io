import './ItemFilter.css';

import React, { ChangeEvent } from 'react';
import { ItemSource } from '../../../Items/Classes/ItemSource';
import { ItemCard } from '../../../Items/React/Common/ItemCard';

interface IItemFilterProps {
    // CardClickCallback
}

interface IItemFilterState {
    // FilterKeywords
    searchKeywords: string[];
}

export class ItemFilter extends React.Component<IItemFilterProps, IItemFilterState> {
    // private searchInput: string = "";

    public constructor(props: IItemFilterProps) {
        super(props);
        this.state = {
            searchKeywords: []
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
        var items = ItemSource.SearchItems(this.state.searchKeywords);
        return items.map(i => {
            return (
                <ItemCard
                    itemDetails={i}
                    onItemClick={undefined}
                    onAttackButton={undefined}
                    onPurchaseButton={undefined}
                    onRemoveButton={undefined}
                    cardInteractions={[]}
                />
            );
        })
    }

    private HandleSearchInput(event: ChangeEvent<HTMLInputElement>) {
        var input = event?.target.value;
        if (input !== null) {
            var keywords = input.split(' ');

            this.setState({
                searchKeywords: keywords
            });
        }
    }
}
