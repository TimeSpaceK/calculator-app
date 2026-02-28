// src/core/optimize/error.ts
/**
 * 异常处理器：统一处理计算器的输入/运算错误，给出友好提示
 */
export class ErrorManager {
  // 错误类型枚举（方便统一管理错误类型）
  private errorTypes = {
    DIVIDE_BY_ZERO: "DIVIDE_BY_ZERO", // 除以0
    INVALID_INPUT: "INVALID_INPUT",   // 非法输入（比如多个小数点、空运算）
    SYNTAX_ERROR: "SYNTAX_ERROR",     // 语法错误（比如公式不完整）
    UNKNOWN_ERROR: "UNKNOWN_ERROR"    // 未知错误
  };

  /**
   * 捕获并处理运算错误
   * @param error 错误对象/错误类型
   * @returns 友好的错误提示文本
   */
  handleError(error: any): string {
    // 处理除以0错误
    if (error.message?.includes("Division by zero") || error === this.errorTypes.DIVIDE_BY_ZERO) {
      return "错误：不能除以0";
    }

    // 处理非法输入错误
    if (error === this.errorTypes.INVALID_INPUT) {
      return "错误：输入包含非法字符或格式错误";
    }

    // 处理语法错误（比如公式不完整 "1+"）
    if (error === this.errorTypes.SYNTAX_ERROR || error.message?.includes("SyntaxError")) {
      return "错误：运算公式语法错误，请检查输入";
    }

    // 未知错误（兜底）
    console.error("计算器未知错误：", error);
    return "错误：运算失败，请重新输入";
  }

  /**
   * 校验输入是否合法（提前拦截错误）
   * @param input 计算器输入的字符串（比如"123+456"）
   * @returns {isValid: boolean, errorType?: string} 校验结果+错误类型
   */
  validateInput(input: string): { isValid: boolean; errorType?: string } {
    // 空输入
    if (!input.trim()) {
      return { isValid: false, errorType: this.errorTypes.INVALID_INPUT };
    }

    // 连续运算符（比如"1++2" "1--3"）
    const operatorRegex = /[\+\-\×\*\/]{2,}/;
    if (operatorRegex.test(input)) {
      return { isValid: false, errorType: this.errorTypes.INVALID_INPUT };
    }

    // 多个小数点（比如"12.34.56"）
    const dotRegex = /(\d+\.){2,}/;
    if (dotRegex.test(input)) {
      return { isValid: false, errorType: this.errorTypes.INVALID_INPUT };
    }

    // 以运算符结尾（比如"123+" "456/"）
    const endWithOperator = /[\+\-\×\*\/]$/.test(input);
    if (endWithOperator) {
      return { isValid: false, errorType: this.errorTypes.SYNTAX_ERROR };
    }

    // 输入合法
    return { isValid: true };
  }
}

// 单例导出（整个项目只需要一个异常处理器）
export const errorManager = new ErrorManager();