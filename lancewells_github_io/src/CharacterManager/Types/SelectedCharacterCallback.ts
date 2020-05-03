import { PlayerCharacterData } from '../../FirebaseAuth/Types/PlayerCharacterData';

/**
 * A definition for callbacks concerning character selections.
 */
export type SelectedCharacterCallback = (charData: PlayerCharacterData) => void;
