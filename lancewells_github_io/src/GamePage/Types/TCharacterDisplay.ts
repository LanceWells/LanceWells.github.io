import { TCharacterEmotion } from './TCharacterEmotion';

/**
 * Used to represent the physical display of a given character. There should be one of these for each
 * player profile in the current game room.
 */
export type TCharacterDisplay = {
    Uid: string;
    Name: string;
    Emotion: TCharacterEmotion;
    Image: string[];
}
