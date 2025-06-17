export abstract class EntityMutable<T> {
  private _value: T

  constructor(value: T) {
    this._value = value
  }

  validate(): void | Promise<void> {
    throw new Error("Method 'validate' must be implemented.")
  }

  get value(): T {
    return this._value
  }
}
