export class MoneyConverter {
    private _platinum: number = 0;
    private _gold: number = 0;
    private _silver: number = 0;
    private _copper: number = 0;

    public get Platinum() {
        return this._platinum;
    }

    public get Gold() {
        return this._gold;
    }

    public get Silver() {
        return this._silver;
    }

    public get Copper() {
        return this._copper;
    }

    public constructor(playerCopper: number) {
        this._platinum  = Math.floor(playerCopper / 1000);
        this._gold      = Math.floor((playerCopper % 1000) / 100);
        this._silver    = Math.floor((playerCopper % 100) / 10);
        this._copper    = playerCopper % 10;
    }
}
