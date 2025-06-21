export abstract class EntityMutable<T> {
  private _value: T

  constructor(value: T) {
    this._value = value
  }

  abstract validate(): void | Promise<void>

  get value(): T {
    return this._value
  }
}
