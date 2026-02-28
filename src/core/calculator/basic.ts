// src/core/calculator/basic.ts
import { evaluate } from 'mathjs';
import { cacheManager } from '../optimize/cache';
import { errorManager } from '../optimize/error';

/**
 * 基础运算管理器：处理加减乘除、取余、正负切换等基础运算
 */
export class BasicCalculator {
  // 运算历史记录的缓存键
  private readonly HISTORY_KEY = "calc_history";

  /**
   * 执行基础运算
   * @param expression 运算表达式（比如"1+2*3" "10/2"）
   * @returns {success: boolean, result?: string, error?: string} 运算结果
   */
  calculate(expression: string): { success: boolean; result?: string; error?: string } {
    // 1. 先校验输入是否合法
    const validateResult = errorManager.validateInput(expression);
    if (!validateResult.isValid) {
      const errorMsg = errorManager.handleError(validateResult.errorType!);
      return { success: false, error: errorMsg };
    }

    try {
      // 2. 先查缓存：如果之前算过这个表达式，直接返回缓存结果
      const cachedResult = cacheManager.getMemoryCache(expression);
      if (cachedResult) {
        return { success: true, result: cachedResult.toString() };
      }

      // 3. 替换中文运算符为mathjs能识别的英文运算符（比如×→*）
      const normalizedExpr = expression.replace(/×/g, '*').replace(/÷/g, '/');
      
      // 4. 执行运算（mathjs的evaluate能解析复杂表达式，比如1+2*3）
      const result = evaluate(normalizedExpr);

      // 5. 缓存运算结果（5分钟过期）
      cacheManager.setMemoryCache(expression, result);

      // 6. 记录运算历史（持久化存储，关闭页面也不会丢）
      this.recordHistory(expression, result.toString());

      return { success: true, result: result.toString() };
    } catch (error) {
      // 7. 捕获运算错误（比如除以0）
      const errorMsg = errorManager.handleError(error);
      return { success: false, error: errorMsg };
    }
  }

  /**
   * 记录运算历史
   * @param expression 运算表达式
   * @param result 运算结果
   */
  private recordHistory(expression: string, result: string): void {
    // 获取已有历史
    const history = cacheManager.getPersistentCache(this.HISTORY_KEY) || [];
    // 新增一条记录（只存最近20条）
    const newHistory = [{ expression, result, time: new Date().toLocaleString() }, ...history].slice(0, 20);
    // 保存到本地存储
    cacheManager.setPersistentCache(this.HISTORY_KEY, newHistory);
  }

  /**
   * 获取运算历史记录
   * @returns 历史记录数组
   */
  getHistory(): Array<{ expression: string; result: string; time: string }> {
    return cacheManager.getPersistentCache(this.HISTORY_KEY) || [];
  }

  /**
   * 清空运算历史
   */
  clearHistory(): void {
    cacheManager.clearCache(this.HISTORY_KEY);
  }

  /**
   * 切换数字正负（比如"123"→"-123"，"-456"→"456"）
   * @param input 当前输入的数字/表达式
   * @returns 切换后的结果
   */
  toggleSign(input: string): string {
    if (!input) return input;
    return input.startsWith('-') ? input.slice(1) : `-${input}`;
  }
}

// 单例导出
export const basicCalculator = new BasicCalculator();