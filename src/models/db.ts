export interface Result<T> {
   ref: Ref;
   ts: number;
   data: T;
}

export interface Ref {
   collection: string;
   id: string;
}

export interface ResultSet<T> {
   data: Result<T>[];
}