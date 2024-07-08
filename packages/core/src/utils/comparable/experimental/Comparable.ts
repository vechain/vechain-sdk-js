export interface Comparable<T> {
    compareTo: (that: T) => number;
    isEqual: (that: T) => boolean;
}
