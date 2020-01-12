import React from 'react';
import { IItem } from '../../Interfaces/IItem';
import { IItemIsItemWeapon } from '../../Classes/ItemWeapon';
import { TAttack } from '../../Types/TAttack';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { CardIcon } from './CardIcon';
import { IItemIsItemPotion } from '../../Classes/ItemPotion';

interface IItemCardProps {
    itemDetails: IItem;
    onItemClick: Function; // TODO: Figure out a function signature for this.
}

interface IItemCardState {
    titleFontSize: number
}

export class ItemCard extends React.Component<IItemCardProps, IItemCardState> {
    readonly cardWidth: number = 194;
    readonly cardHeight: number = 256;
    
    // DO NOT CHANGE. The card's icon size is 128. This gives us a scaling raito for everything else.
    readonly cardRatio: number = this.cardHeight / 128;
    
    // Item area measurements.
    readonly itemAreaDefaultOffset: number = 17;
    readonly itemAreaDefaultSize: number = 64;
    
    // Title measurements.
    readonly titleDefaultTopOffset: number = 12;
    readonly titleDefaultFontSize: number = 12;
    readonly titleWidth: number = this.cardWidth * 0.65;
    readonly titleDefaultLeftOffset: number = 2;
    
    // Item description measurements.
    readonly descAreaDefaultOffset: number = 88;
    readonly descAreaDefaultSize: number = 44;

    // Attack Icon measurements.
    readonly attackIconDefaultSize: number = 16;

    // Icon measurements.
    readonly iconDefaultSize: number = 16;
    readonly iconDefaultLeftOffset: number = 87;
    readonly iconDefaultTopOffset: number = 23;

    // Coin measurements.
    readonly coinDefaultSize: number = 16;
    readonly coinDefaultLeftOffset: number = 7;
    readonly coinDefaultTopOffset: number = 23;

    constructor(props: IItemCardProps) {
        super(props);
        this.state = {
            titleFontSize: this.titleDefaultFontSize
        };
    }

    /**
     * Gets the icon source for an attack icon.
     * @param diceType 
     */
    private GetAttackDiceIconSource(diceType: number): string {
        var source: string;
        switch (diceType) {
            case 4:
                source = './images/Item_Shop/ItemCards/Icons/Damage4.png';
                break;
            case 6:
                source = './images/Item_Shop/ItemCards/Icons/Damage6.png';
                break;
            case 8:
                source = './images/Item_Shop/ItemCards/Icons/Damage8.png';
                break;
            case 12:
                source = './images/Item_Shop/ItemCards/Icons/Damage12.png';
                break;
            case 20:
                source = './images/Item_Shop/ItemCards/Icons/Damage20.png';
                break;
            default:
                source = './images/Item_Shop/ItemCards/Icons/Damage4.png';
                break;
        }

        return source;
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
        var itemDetails: IItem = this.props.itemDetails;

        // This uses a type guard to enforce that itemDetails must be a specific type.
        // https://medium.com/ovrsea/checking-the-type-of-an-object-in-typescript-the-type-guards-24d98d9119b0
        if (IItemIsItemWeapon(itemDetails)) {
            return Object.entries(itemDetails.attacks).flatMap(element => {
                let name: string = element[0];
                let attacks: TAttack[] = element[1];
                let attackIndicators: JSX.Element[] = attacks.map(attack => {
                    return (
                        <img
                            src={this.GetAttackDiceIconSource(attack.diceSize)}
                            style = {{
                                margin: "0 2px 0 2px",
                                width: `${this.attackIconDefaultSize * this.cardRatio}px`,
                                height: `${this.attackIconDefaultSize * this.cardRatio}px`
                            }}
                            className={`icon-color-${attack.damageType.toLowerCase()}`}
                        />
                    );
                });

                return (
                    <Button className="attack-button" variant="dark">
                        <div>
                            {attackIndicators}
                        </div>
                        {name}
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
        var itemDetails: IItem = this.props.itemDetails;
        var icons: JSX.Element[] = [];

        if (itemDetails.requiresAttunement) {
            icons.push(CardIcon({
                iconSource: './images/Item_Shop/ItemCards/Icons/Attunement.png',
                tooltipText: 'This item requires attunement.',
                width: (this.iconDefaultSize * this.cardRatio),
                height: (this.iconDefaultSize * this.cardRatio),
            }));
        }

        if (IItemIsItemPotion(itemDetails) && itemDetails.withdrawalEffect) {
            icons.push(CardIcon({
                iconSource: './images/Item_Shop/ItemCards/Icons/Withdrawal.png',
                tooltipText: 'Using this potion will grant a withdrawal effect.',
                width: (this.iconDefaultSize * this.cardRatio),
                height: (this.iconDefaultSize * this.cardRatio),
            }));
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

        Promise.all(loadedImagesPromises).then(() => this.DrawCard(iconImage, borderImage));
    }

    /**
     * Performs the actual card drawing. Gets the canvas element and draws each component.
     * @param iconImage The icon image that has been loaded and will be drawn.
     * @param borderImage The card background image that has been loaded and will be drawn.
     */
    private DrawCard(iconImage: HTMLImageElement, borderImage: HTMLImageElement) {
        var itemOffset: number = this.itemAreaDefaultOffset * this.cardRatio;
        var itemAreaSize: number = this.itemAreaDefaultSize * this.cardRatio;
        var canvas = this.refs.cardCanvas as HTMLCanvasElement;
        var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        ctx.drawImage(borderImage, 0, 0, this.cardWidth, this.cardHeight);
        ctx.drawImage(iconImage, itemOffset, itemOffset, itemAreaSize, itemAreaSize);
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
                ref="card">
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
                <canvas className="card-canvas" ref="cardCanvas" width={this.cardWidth} height={this.cardHeight} />
            </div>
        )
    }
}
