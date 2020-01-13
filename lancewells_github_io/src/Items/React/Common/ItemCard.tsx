import React from 'react';
import { IItemJson } from '../../Interfaces/IItem';
import { IItemIsItemWeapon } from '../../Classes/ItemWeapon';
import { TAttack } from '../../Types/TAttack';
import { Button } from 'react-bootstrap';
import { CardIcon } from './CardIcon';
import { IItemIsItemPotion } from '../../Classes/ItemPotion';

export type TAttackClick = (attackName: string, attackRolls: TAttack[]) => void;

interface IItemCardProps {
    itemDetails: IItemJson;
    onItemClick: Function; // TODO: Figure out a function signature for this.
    onAttackClick: TAttackClick;
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

    private GetCardBackSource() {
        var source: string;
        switch (this.props.itemDetails.type) {
            case "Weapon":
                source = "./images/Item_Shop/ItemCards/CardForge.png";
                break;
            case "Potion":
                source = "./images/Item_Shop/ItemCards/CardAlchemist.png";
                break;
            default:
                source = "./images/Item_Shop/ItemCards/CardDungeon.png";
                break;
        }

        return source;
    }

    /**
     * Gets any additional content that should appear on the card. Includes attack buttons, etc.
     */
    private GetAdditionalCardContent() {
        var itemDetails: IItemJson = this.props.itemDetails;

        // This uses a type guard to enforce that itemDetails must be a specific type.
        // https://medium.com/ovrsea/checking-the-type-of-an-object-in-typescript-the-type-guards-24d98d9119b0
        if (IItemIsItemWeapon(itemDetails)) {
            return Object.entries(itemDetails.attacks).flatMap(element => {
                let name: string = element[0];
                let damageRolls: TAttack[] = element[1];
                let attackIndicators: JSX.Element[] = damageRolls.map(roll => {
                    return (
                        <div
                            className={`card-attack-row badge badge-color-${roll.damageType.toLowerCase()}`}
                            style={{
                            width: "100%"
                        }}>
                            {`${roll.diceCount}d${roll.diceSize}${roll.modifier > 0 ? `+${roll.modifier}` : ''}`}
                        </div>
                    );
                });

                return (
                    <Button
                        className="card-attack-button"
                        variant="dark"
                        onClick={() => {this.props.onAttackClick(name, damageRolls)}}>
                        <div className="card-attack-indicators">
                            {attackIndicators}
                        </div>
                        <div className="card-attack-name">
                            {name}
                        </div>
                    </Button>
                )
            });
        }
        else {
            return (
                <div style={{
                    width:"100%"
                }}>
                    {this.props.itemDetails.description}
                </div>
            );
        }
    }

    private GetCardIcons(): JSX.Element[] {
        var itemDetails: IItemJson = this.props.itemDetails;
        var icons: JSX.Element[] = [];
        var iconDimensions: number = this.iconDefaultSize * this.cardRatio;

        if (itemDetails.requiresAttunement) {
            icons.push(CardIcon({
                iconSource: './images/Item_Shop/ItemCards/Icons/Attunement.png',
                tooltipText: 'This item requires attunement.',
                width: (iconDimensions),
                height: (iconDimensions),
            }));
        }

        if (IItemIsItemPotion(itemDetails) && itemDetails.hasWithdrawalEffect) {
            icons.push(CardIcon({
                iconSource: './images/Item_Shop/ItemCards/Icons/Withdrawal.png',
                tooltipText: 'Using this potion will result in a withdrawal effect.',
                width: (iconDimensions),
                height: (iconDimensions),
            }));
        }
        else if (IItemIsItemWeapon(itemDetails)) {
            itemDetails.properties.forEach(property => {
                switch (property) {
                    case "Ammunition":
                        icons.push(CardIcon({
                            iconSource: './images/Item_Shop/ItemCards/Icons/Ammunition.png',
                            tooltipText: 'This item uses ammunition for ranged attacks.',
                            width: (iconDimensions),
                            height: (iconDimensions),
                        }));
                        break;
                    case "Finesse":
                        icons.push(CardIcon({
                            iconSource: './images/Item_Shop/ItemCards/Icons/Finesse.png',
                            tooltipText: 'This item requires finesse. Attacks and damage with this item may use STR or DEX.',
                            width: (iconDimensions),
                            height: (iconDimensions),
                        }));
                        break;
                    case "Heavy":
                        icons.push(CardIcon({
                            iconSource: './images/Item_Shop/ItemCards/Icons/Heavy.png',
                            tooltipText: 'This item is abnormally heavy. Small creatures will have a difficult time using this item.',
                            width: (iconDimensions),
                            height: (iconDimensions),
                        }));
                        break;
                    case "Improvised":
                        icons.push(CardIcon({
                            iconSource: './images/Item_Shop/ItemCards/Icons/Improvised.png',
                            tooltipText: 'This is an improvised weapon.',
                            width: (iconDimensions),
                            height: (iconDimensions),
                        }));
                        break;
                    case "Light":
                        icons.push(CardIcon({
                            iconSource: './images/Item_Shop/ItemCards/Icons/Light.png',
                            tooltipText: 'This item is unusually light and may be used with another weapon.',
                            width: (iconDimensions),
                            height: (iconDimensions),
                        }));
                        break;
                    case "Loading":
                        icons.push(CardIcon({
                            iconSource: './images/Item_Shop/ItemCards/Icons/Loading.png',
                            tooltipText: 'This item requires manually loading and is limited to one attack per action.',
                            width: (iconDimensions),
                            height: (iconDimensions),
                        }));
                        break;
                    case "Reach":
                        icons.push(CardIcon({
                            iconSource: './images/Item_Shop/ItemCards/Icons/Reach.png',
                            tooltipText: 'This item has extended reach.',
                            width: (iconDimensions),
                            height: (iconDimensions),
                        }));
                        break;
                    case "Silver":
                        icons.push(CardIcon({
                            iconSource: './images/Item_Shop/ItemCards/Icons/Silver.png',
                            tooltipText: 'This item has been plated in silver.',
                            width: (iconDimensions),
                            height: (iconDimensions),
                        }));
                        break;
                    case "Special":
                        icons.push(CardIcon({
                            iconSource: './images/Item_Shop/ItemCards/Icons/Special.png',
                            tooltipText: 'This item has some special usage.',
                            width: (iconDimensions),
                            height: (iconDimensions),
                        }));
                        break;
                    case "Thrown":
                        icons.push(CardIcon({
                            iconSource: './images/Item_Shop/ItemCards/Icons/Thrown.png',
                            tooltipText: 'This item may be thrown without reducing its damage.',
                            width: (iconDimensions),
                            height: (iconDimensions),
                        }));
                        break;
                    case "TwoHanded":
                        icons.push(CardIcon({
                            iconSource: './images/Item_Shop/ItemCards/Icons/TwoHanded.png',
                            tooltipText: 'This item is unwieldy and requires two hands to utilize.',
                            width: (iconDimensions),
                            height: (iconDimensions),
                        }));
                        break;
                    case "Versatile":
                        icons.push(CardIcon({
                            iconSource: './images/Item_Shop/ItemCards/Icons/Versatile.png',
                            tooltipText: 'This item is versatile and may be used with one or two hands.',
                            width: (iconDimensions),
                            height: (iconDimensions),
                        }));
                        break;
                    default:
                        break;
                }
            });
        }

        return icons;
    }

    /**
     * Handles when the component has mounted. This will cause the card to draw.
     */
    componentDidMount() {
        var canvas = this.refs.cardCanvas as HTMLCanvasElement;
        var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.imageSmoothingEnabled = false;

        this.LoadCard();
        this.DrawTitleText();
    }

    /**
     * Loads all of the parts needed to render the card itself.
     */
    private LoadCard() {
        var imagesToLoad: HTMLImageElement[] = [];

        var borderImage = new Image();
        borderImage.src = this.GetCardBackSource();
        imagesToLoad.push(borderImage);

        var iconImage = new Image();
        iconImage.src = this.props.itemDetails.iconSource;
        imagesToLoad.push(iconImage);

        var loadedImagesPromises: Promise<void>[] = imagesToLoad.map(image => {
            return new Promise<void>(resolve => {
                image.onload = () => {
                    console.log(`Loaded ${image.src}`)
                    resolve();
                }
            });
        });

        Promise.all(loadedImagesPromises).then(() => this.DrawCard(borderImage));
    }

    /**
     * Performs the actual card drawing. Gets the canvas element and draws each component.
     * @param borderImage The card background image that has been loaded and will be drawn.
     */
    private DrawCard(borderImage: HTMLImageElement) {
        var canvas = this.refs.cardCanvas as HTMLCanvasElement;
        var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        ctx.drawImage(borderImage, 0, 0, this.cardWidth, this.cardHeight);
    }

    /**
     * Draws the title text for this card.
     */
    private DrawTitleText() {
        var titleText: string = this.props.itemDetails.title;
        var testDiv: HTMLDivElement = document.createElement("div") as HTMLDivElement;
        testDiv.innerText = titleText;
        
        var cardDiv = this.refs.card as HTMLDivElement;
        testDiv.style.visibility = 'hidden';
        cardDiv.insertAdjacentElement('afterbegin', testDiv);
        var textWidth: number = testDiv.offsetWidth;
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

        var fontSize: number = this.titleDefaultFontSize;
        var fontRatio: number = this.titleWidth / textWidth;
        var newFontSize: number = Math.min(fontSize, fontRatio * fontSize);

        this.setState({
            titleFontSize: newFontSize
        });
    }

    /**
     * Renders an instance of this object.
     */
    render() {
        return (
            <div
                className="item-card"
                ref="card"
                style={{
                    margin: `${this.cardDefaultMargin * this.cardRatio}px`
                }}>
                <Button
                    variant="link"
                    className="card-details-button"
                    onClick={() => this.props.onItemClick(this.props.itemDetails)}
                    style={{
                        width: `${this.cardWidth}px`,
                        height: `${this.cardHeight - (this.descAreaDefaultSize * this.cardRatio)}px`
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
                    className="card-cost"
                    style={{
                        top: `${this.coinDefaultTopOffset * this.cardRatio}px`,
                        left: `${this.coinDefaultLeftOffset * this.cardRatio}px`,
                    }}>
                    <img
                        style={{
                            width: `${this.coinDefaultSize * this.cardRatio}px`,
                            height: `${this.coinDefaultSize * this.cardRatio}px`,
                        }}
                        src="./images/Item_Shop/itemCoinStill.png"
                    />
                </div>
                <span
                    className="card-cost-text"
                    style={{
                        top: `${this.coinDefaultTopOffset * this.cardRatio + (this.coinDefaultSize * this.cardRatio * 0.25)}px`,
                        left: `${this.coinDefaultLeftOffset * this.cardRatio}px`,
                        width: `${this.coinDefaultSize * this.cardRatio}px`,
                        height: `${this.coinDefaultSize * this.cardRatio}px`,
                    }}
                >
                    {this.props.itemDetails.itemCost}
                </span>
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
                    {this.GetAdditionalCardContent()}
                </div>
                <img
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
                <canvas
                    className="card-canvas"
                    ref="cardCanvas"
                    width={this.cardWidth}
                    height={this.cardHeight}
                    />
            </div>
        )
    }
}
