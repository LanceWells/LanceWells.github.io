import React, { useState } from 'react';
import { AddCopperClick } from '../Types/AddCopperClick';
import { MoneyDisplay } from '../../CharacterInfo/React/MoneyDisplay';

export interface IAddCopperSlider {
    availableCopper: number;
    handleAddCopper: AddCopperClick;
}

export function AddCopperSlider(props: IAddCopperSlider) {
    const [copperToTake, setCopperToTake] = useState(0);

    function HandleSetCopperToTake(rangeElement: React.ChangeEvent<HTMLInputElement>) {
        if (rangeElement && rangeElement.target && rangeElement.target.valueAsNumber) {
            setCopperToTake(rangeElement.target.valueAsNumber);
        }
    }

    function HandleClickTakeCopper() {
        props.handleAddCopper(copperToTake);
        setCopperToTake(0);
    }

    return (
        <div className="add-copper-slider">
            <button onClick={HandleClickTakeCopper}>
                Take:
                <MoneyDisplay
                copperCount={copperToTake}
                hideEmptyCurrencies={false}
                />
            </button>
            <input
                type="range"
                name="copper to take"
                min={0} max={props.availableCopper}
                onChange={HandleSetCopperToTake}/>
        </div>
    );
}
