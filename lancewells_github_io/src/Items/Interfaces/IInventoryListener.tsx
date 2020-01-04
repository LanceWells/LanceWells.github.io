export interface ListListener<T> {
    (newContents: Array<T>): void
}
