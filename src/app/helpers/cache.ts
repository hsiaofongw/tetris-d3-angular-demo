/** 缓存 */
const cacheStorage: Record<string, any> = {};

/** 缓存装饰器 */
type Serializable = { toString(): string };
export const CachedQuery = <T extends Serializable>(
  target: any,
  propertyKey: any,
  descriptor: TypedPropertyDescriptor<(...args: T[]) => any>
) => {
  const fn = descriptor.value;
  descriptor.value = (...args) => {
    const cacheKey = args.map(arg => arg.toString()).join(',');
    if (cacheKey in cacheStorage) {
      return cacheStorage[cacheKey];
    }

    if (!!fn) {
      const result = fn.call(this, ...args);
      cacheStorage[cacheKey] = result;
      return result;
    }

    return undefined;
  }
};

