import '../css/ItemCard.css';

import React from 'react';
import { Button } from 'react-bootstrap';
import { CardIcon } from './CardIcon';
import { AttackButton } from './CardButtons/AttackButton';
import { StageButton } from './CardButtons/StageButton';
import { UnstageButton } from './CardButtons/UnstageButton';
import { PurchaseButton } from './CardButtons/PurchaseButton';
import { AttuneButton } from './CardButtons/AttuneButton';
import { IItem } from '../Interfaces/IItem';
import { ItemClick } from '../Types/CardButtonCallbackTypes/ItemClick';
import { AttackClick } from '../Types/CardButtonCallbackTypes/AttackClick';
import { PurchaseClick } from '../Types/CardButtonCallbackTypes/PurchaseClick';
import { AttuneClick } from '../Types/CardButtonCallbackTypes/AttuneClick';
import { StageClick } from '../Types/CardButtonCallbackTypes/StageClick';
import { UnstageClick } from '../Types/CardButtonCallbackTypes/UnstageClick';
import { CardInteractions } from '../Enums/CardInteractions';
import { IItemJson } from '../Interfaces/IItemJson';
import { IItemIsItemWeapon } from '../Classes/ItemWeapon';
import { IItemIsItemPotion } from '../Classes/ItemPotion';
import { CardIconMap } from '../Classes/CardIconMap';
import { IconTooltip } from '../Types/IconTooltip';
import { MoneyDisplay } from '../../CharacterInfo/React/MoneyDisplay';

interface IItemCardProps {
    itemDetails: IItem;
    onItemClick: ItemClick | undefined;
    onAttackButton: AttackClick | undefined;
    onPurchaseButton: PurchaseClick | undefined;
    onStageButton: StageClick | undefined;
    onUnstageButton: UnstageClick |undefined;
    onAttuneButton: AttuneClick | undefined;
    onUnattuneButton: AttuneClick | undefined;
    cardInteractions: CardInteractions[];
    showCardCost: boolean;
    availablePlayerCopper: number | undefined;
    availableAttunementSlots: number | undefined;
}

interface IItemCardState {
    titleFontSize: number
}

export class ItemCard extends React.Component<IItemCardProps, IItemCardState> {
    readonly cardWidth: number = 194;
    readonly cardHeight: number = 256;
    readonly cardDefaultMargin: number = 6;
    
    // DO NOT CHANGE. The card's icon size is 128. This gives us a scaling raito for everything else.
    readonly cardRatio: number = this.cardHeight / 128;
    
    // Item area measurements.
    readonly itemAreaDefaultOffset: number = 17;
    readonly itemAreaDefaultSize: number = 64;
    
    // Title measurements.
    readonly titleDefaultTopOffset: number = 6;
    readonly titleDefaultFontSize: number = 12;
    readonly titleWidth: number = this.cardWidth * 0.65;
    readonly titleDefaultLeftOffset: number = 1;
    
    // Item description measurements.
    readonly descAreaDefaultOffset: number = 82;
    readonly descAreaDefaultSize: number = 44;

    // Attack Icon measurements.
    readonly attackIconDefaultSize: number = 16;

    // Icon measurements.
    readonly iconDefaultSize: number = 16;
    readonly iconDefaultLeftOffset: number = 81;
    readonly iconDefaultTopOffset: number = 17;

    // MagicBonus measurements.
    readonly magBonusDefualtTopOffset: number = 18;
    readonly magBonusDefualtLeftOffset: number = 18;

    // Coin measurements.
    readonly coinDefaultSize: number = 16;
    readonly coinDefaultLeftOffset: number = 1;
    readonly coinDefaultTopOffset: number = 17;

    constructor(props: IItemCardProps) {
        super(props);
        this.state = {
            titleFontSize: this.titleDefaultFontSize
        };
    }

    /**
     * Gets any additional content that should appear on the card. Includes attack buttons, etc.
     */
    private GetCardButtons(): JSX.Element[] {
        let buttons: JSX.Element[] = [];
        let itemDetails: IItemJson = this.props.itemDetails;

        if (this.props.cardInteractions.some(interaction => interaction === "Use")) {
            // This uses a type guard to enforce that itemDetails must be a specific type.
            // https://medium.com/ovrsea/checking-the-type-of-an-object-in-typescript-the-type-guards-24d98d9119b0
            if (IItemIsItemWeapon(itemDetails) && this.props.onAttackButton !== undefined) {
                let attackButtons: JSX.Element[] = Object.entries(itemDetails.attacks).flatMap((attack) => {
                    let name = attack[0];
                    let attacks = attack[1];

                    return (
                        <AttackButton
                            key={"Attack " + name}
                            cardIconSize={this.iconDefaultSize * this.cardRatio}
                            attackName={name}
                            attacks={attacks}
                            callbackFunction={this.props.onAttackButton as AttackClick}
                        />
                    );
                })

                buttons = buttons.concat(attackButtons);
            }
        }

        if (this.props.cardInteractions.some(interaction => interaction === CardInteractions.Purchase)
         && this.props.onPurchaseButton !== undefined) {
            let purchaseButton: JSX.Element = (
                <PurchaseButton
                    key="Purchase"
                    item={this.props.itemDetails}
                    cardIconSize={this.iconDefaultSize * this.cardRatio}
                    callbackFunction={this.props.onPurchaseButton}
                    availablePlayerCopper={this.props.availablePlayerCopper}
                />
            );

            buttons = buttons.concat(purchaseButton);
        }

        if (this.props.cardInteractions.some(interaction => interaction === CardInteractions.Stage)
         && this.props.onStageButton !== undefined) {
             let addButton: JSX.Element = (
                 <StageButton
                    key="Stage"
                    item={this.props.itemDetails}
                    cardIconSize={this.iconDefaultSize * this.cardRatio}
                    callbackFunction={this.props.onStageButton}
                 />
             );

            buttons = buttons.concat(addButton);
        }

        if (this.props.cardInteractions.some(interaction => interaction === CardInteractions.Unstage)
            && this.props.onUnstageButton !== undefined) {
            let unstageButton: JSX.Element = (
                <UnstageButton
                    key="Unstage"
                    item={this.props.itemDetails}
                    cardIconSize={this.iconDefaultSize * this.cardRatio}
                    callbackFunction={this.props.onUnstageButton}
                />
            );

            buttons = buttons.concat(unstageButton);
        }

        if (this.props.cardInteractions.some(interaction => interaction === CardInteractions.Attune)
            && this.props.onAttuneButton
            && this.props.onUnattuneButton
            && this.props.availableAttunementSlots !== undefined
            && this.props.itemDetails.requiresAttunement) {
                let attuneButton: JSX.Element = (
                    <AttuneButton
                        key="Attune"
                        item={this.props.itemDetails}
                        cardIconSize={this.iconDefaultSize * this.cardRatio}
                        availableAttunementSlots={this.props.availableAttunementSlots}
                        attuneCallback={this.props.onAttuneButton}
                        unattuneCallback={this.props.onUnattuneButton}
                    />
                );

                buttons = buttons.concat(attuneButton);
            }


        return buttons;
    }

    private GetCardIcons(): JSX.Element[] {
        let itemDetails: IItemJson = this.props.itemDetails;
        let icons: JSX.Element[] = [];
        let iconDimensions: number = this.iconDefaultSize * this.cardRatio;

        if (itemDetails.requiresAttunement) {
            icons.push(CardIcon({
                iconSource: './images/Item_Shop/ItemCards/Icons/Attunement.png',
                tooltipTitle: "Attunement",
                tooltipText: 'This item requires attunement.',
                width: (iconDimensions),
                height: (iconDimensions),
            }));
        }

        if (IItemIsItemPotion(itemDetails) && itemDetails.hasWithdrawalEffect) {
            icons.push(CardIcon({
                iconSource: './images/Item_Shop/ItemCards/Icons/Withdrawal.png',
                tooltipTitle: "Withdrawal",
                tooltipText: 'Using this potion will result in a withdrawal effect.',
                width: (iconDimensions),
                height: (iconDimensions),
            }));
        }
        
        else if (IItemIsItemWeapon(itemDetails)) {
            itemDetails.properties.forEach(property => {
                if (CardIconMap.CardIconWeaponsMap.has(property)) {
                    let iconTooltip: IconTooltip = CardIconMap.CardIconWeaponsMap.get(property) as IconTooltip;

                    icons.push(
                        CardIcon({
                            iconSource: iconTooltip.iconSource,
                            tooltipTitle: property,
                            tooltipText: iconTooltip.tooltipText,
                            width: (iconDimensions),
                            height: (iconDimensions),
                        })
                    );
                }
            });
        }

        return icons;
    }

    /**
     * Handles when the component has mounted. This will cause the card to draw.
     */
    componentDidMount() {
        this.LoadCard();
    }

    /**
     * Loads all of the parts needed to render the card itself.
     */
    private LoadCard(): void {
        let imagesToLoad: HTMLImageElement[] = [];
        let iconImage = new Image();
        iconImage.src = this.props.itemDetails.iconSource;
        imagesToLoad.push(iconImage);

        let loadedImagesPromises: Promise<void>[] = imagesToLoad.map(image => {
            return new Promise<void>(resolve => {
                image.onload = () => {
                    resolve();
                }
            });
        });

        Promise.all(loadedImagesPromises)
            .then(resolved => {
                this.SetTitleTextSize();
            })
            .catch(reason => {
                console.error("Failed to load card images" + reason);
            });
    }

    /**
     * Draws the title text for this card.
     */
    private SetTitleTextSize() {
        let titleText: string = this.props.itemDetails.title;
        let testDiv: HTMLDivElement = document.createElement("div") as HTMLDivElement;
        testDiv.innerText = titleText;
        
        let cardDiv = this.refs.card as HTMLDivElement;
        testDiv.style.visibility = 'hidden';
        cardDiv.insertAdjacentElement('afterbegin', testDiv);
        let textWidth: number = testDiv.offsetWidth;
        cardDiv.removeChild(testDiv);

        /*
         * Once we have the width of the text, now we need to determine if the text element needs to be
         * resized or not.
         *
         * We can determine the following:
         * 1:   If the text size is <= the max size of the title element, then do not resize.
         * 2:   If the text size is > the max size of the title element, adjust the text size by some
         *      percentage.
         * 
         * We can determine the percentage by asserting the following steps:
         * 1:   Get a percentage that the text width exceeds the max width.
         * 2:   Multiple that percentage by our standard font size.
         */

        let fontSize: number = this.titleDefaultFontSize;
        let fontRatio: number = this.titleWidth / textWidth;
        let newFontSize: number = Math.min(fontSize, fontRatio * fontSize);

        this.setState({
            titleFontSize: newFontSize
        });
    }

    private GetCardCost(): JSX.Element {
        let element: JSX.Element = (<div></div>);
        
        if (this.props.showCardCost) {
            element = (
                <MoneyDisplay
                    copperCount={this.props.itemDetails.itemCopperCost}
                    hideEmptyCurrencies={true}
                />
            )
        }

        return element;
    }

    /**
     * Renders an instance of this object.
     */
    render() {
        let cardBonus: string = "";
        let itemMagicBonus: number = this.props.itemDetails.adjustments.magicBonus;
        if (itemMagicBonus > 0) {
            cardBonus = `+${itemMagicBonus}`;
        }

        return (
            <div className="card-display">
                <div
                    className="item-card"
                    ref="card"
                    style={{
                        margin: `${this.cardDefaultMargin * this.cardRatio}px`
                    }}>
                    <Button
                        variant="link"
                        className="card-details-button"
                        onClick={() =>{
                            if (this.props.onItemClick !== undefined) {
                                this.props.onItemClick(this.props.itemDetails)
                            }
                        }}
                        style={{
                            width: `${this.cardWidth}px`,
                            height: `${this.cardHeight}px`
                        }}
                    />
                    <span
                        ref="title"
                        className="card-title"
                        style={{
                            fontSize: `${this.state.titleFontSize}px`,
                            height: `${this.titleDefaultFontSize}px`,
                            top: `${this.titleDefaultTopOffset * this.cardRatio}px`,
                        }}>
                        {this.props.itemDetails.title}
                    </span>
                    <div
                        className="card-magic-bonus"
                        style={{
                            top: `${this.magBonusDefualtTopOffset * this.cardRatio}px`,
                            left: `${this.magBonusDefualtLeftOffset * this.cardRatio}px`,
                        }}>
                        {cardBonus}
                    </div>
                    <div
                        className="card-icons"
                        style={{
                            top: `${this.iconDefaultTopOffset * this.cardRatio}px`,
                            left: `${this.iconDefaultLeftOffset * this.cardRatio}px`,
                            maxWidth: `${this.iconDefaultSize * this.cardRatio}px`,
                            height: `${this.iconDefaultSize * this.cardRatio * 4}px`
                        }}>
                        {this.GetCardIcons()}
                    </div>
                    <div
                        className="card-info"
                        style={{
                            top: `${this.descAreaDefaultOffset * this.cardRatio}px`,
                            maxHeight: `${this.descAreaDefaultSize * this.cardRatio}px`,
                            minHeight: `${this.descAreaDefaultSize * this.cardRatio}px`,
                        }}>
                        <div style={{ width: "100%" }}>
                            {this.props.itemDetails.description}
                        </div>
                    </div>
                    <img
                        alt="card item"
                        className="card-item-image"
                        src={this.props.itemDetails.iconSource}
                        height={this.itemAreaDefaultSize * this.cardRatio}
                        width={this.itemAreaDefaultSize * this.cardRatio}
                        style={{
                            top: `${this.itemAreaDefaultOffset * this.cardRatio}px`,
                            left: `${this.itemAreaDefaultOffset * this.cardRatio}px`,
                            height: `${this.itemAreaDefaultSize * this.cardRatio}px`,
                            width: `${this.itemAreaDefaultSize * this.cardRatio}px`,
                        }}
                    />
                    <img
                        alt="card back"
                        className="card-canvas"
                        src={this.props.itemDetails.GetCardbackSource()}
                        width={this.cardWidth}
                        height={this.cardHeight}
                    />
                </div>
                <div className="card-cost-display">
                    {this.GetCardCost()}
                </div>
                <div className="card-actions">
                    {this.GetCardButtons()}
                </div>
            </div>
        )
    }
}
