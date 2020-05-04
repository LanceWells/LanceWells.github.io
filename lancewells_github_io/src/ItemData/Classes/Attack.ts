import { DamageType } from "../Enums/DamageType";

export class Attack
{
    public diceCount: number = 0;
    public diceSize: number = 0;
    public modifier: number = 0;
    public damageType: DamageType = DamageType.Bludgeoning;
};
