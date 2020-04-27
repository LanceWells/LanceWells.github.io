/**
 * @reference https://www.tutorialsteacher.com/typescript/typescript-interface
 */
export interface IListListener<T> {
    (newContents: Array<T>): void
}
