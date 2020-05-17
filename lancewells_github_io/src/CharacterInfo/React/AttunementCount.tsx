import React from 'react';
import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';
import { IItemKey } from '../../ItemData/Interfaces/IItemKey';
import { DnDConstants } from '../../Utilities/Classes/DndConstants';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { ItemSource } from '../../ItemData/Classes/ItemSource';
import { IItem } from '../../ItemData/Interfaces/IItem';

interface IAttunementCountProps {
    charData: PlayerCharacterData | undefined;
}

export function AttunementCount(props: IAttunementCountProps) {
    let items: IItemKey[] = props.charData?.Items ?? [];

    let attunedItemKeys: IItemKey[] = DnDConstants.GetAttunedItems(items);
    let attunedItems: IItem[] = attunedItemKeys.map(i => ItemSource.GetItem(i)).filter(i => i !== undefined) as IItem[];
    let itemTitles: string[] = attunedItems.map(i => i.title);
    let itemTitlesDisplay: string = itemTitles.join(", ");

    return (
        <OverlayTrigger
            placement='bottom'
            delay={{ show: 0, hide: 400 }}
            overlay={
                <Tooltip id="Attuned Items List">
                    <span style={{fontWeight: "bold"}}>
                        Remaining Attunement Slots
                    </span>
                    <br />
                    <br />
                    <span style={{ fontWeight: "bold" }}>
                        Attuned Items:
                    </span>
                    <br />
                    {itemTitlesDisplay}
                </Tooltip>
            }>
            <div className="character-info-attunement">

                <img
                    alt="attunement icon"
                    className="char-display-attunement-icon"
                    src='./images/Item_Shop/ItemCards/Icons/Button_Attune.png'
                />
                {DnDConstants.GetRemainingAttunementSlots(items)}
            </div>
        </OverlayTrigger>
    )
}
