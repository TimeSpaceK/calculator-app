// src/core/optimize/cache.ts
/**
 * 缓存管理器：实现内存缓存+本地存储，提升计算器响应速度、保存历史记录
 */
export class CacheManager {
  // 内存缓存（临时存储运算结果，5分钟自动过期）
  private memoryCache = new Map<string, { value: any; expire: number }>();
  // 本地存储前缀（避免和其他网站的存储数据冲突）
  private readonly STORAGE_PREFIX = "calc_";

  /**
   * 设置内存缓存（临时存运算结果，比如"1+1=2"）
   * @param key 缓存键（比如运算公式"1+1"）
   * @param value 缓存值（比如运算结果2）
   * @param expire 过期时间（毫秒），默认5分钟（300000ms）
   */
  setMemoryCache(key: string, value: any, expire = 300000): void {
    this.memoryCache.set(key, {
      value,
      expire: Date.now() + expire,
    });
  }

  /**
   * 获取内存缓存（自动清理过期数据）
   * @param key 缓存键
   * @returns 缓存值 | null（过期/不存在则返回null）
   */
  getMemoryCache(key: string): any {
    const cache = this.memoryCache.get(key);
    if (!cache) return null;

    // 过期自动清理
    if (Date.now() > cache.expire) {
      this.memoryCache.delete(key);
      return null;
    }
    return cache.value;
  }

  /**
   * 设置本地持久化缓存（比如计算器历史记录、自定义配置）
   * @param key 缓存键
   * @param value 缓存值
   */
  setPersistentCache(key: string, value: any): void {
    try {
      localStorage.setItem(`${this.STORAGE_PREFIX}${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn("本地存储失败（可能是存储容量不足）：", e);
    }
  }

  /**
   * 获取本地持久化缓存
   * @param key 缓存键
   * @returns 缓存值 | null
   */
  getPersistentCache(key: string): any {
    const data = localStorage.getItem(`${this.STORAGE_PREFIX}${key}`);
    return data ? JSON.parse(data) : null;
  }

  /**
   * 清理缓存
   * @param key 可选，指定清理某一个缓存；不传则清理所有
   */
  clearCache(key?: string): void {
    if (key) {
      this.memoryCache.delete(key);
      localStorage.removeItem(`${this.STORAGE_PREFIX}${key}`);
    } else {
      this.memoryCache.clear();
      localStorage.clear();
    }
  }
}

// 单例导出（整个项目只需要一个缓存管理器，避免重复创建浪费内存）
export const cacheManager = new CacheManager();