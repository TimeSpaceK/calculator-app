import { evaluate } from 'mathjs';
import { errorManager } from '../optimize/error';

export class ScientificCalculator {
squareRoot(num: string): { success: boolean; result?: string; error?: string } {
  const checkResult = this.checkNum(num); // 先接收完整结果，避免解构报错
  if (checkResult.error) {
    return { success: false, error: checkResult.error };
  }
  const numVal = checkResult.num;
  if (numVal < 0) {
    return { success: false, error: "负数不能开平方根" };
  }
  const res = evaluate(`sqrt(${numVal})`);
  return { success: true, result: res.toFixed(4) };
}

square(num: string): { success: boolean; result?: string; error?: string } {
  const checkResult = this.checkNum(num); // 统一接收方式，杜绝解构问题
  if (checkResult.error) {
    return { success: false, error: checkResult.error };
  }
  const numVal = checkResult.num;
  const res = evaluate(`${numVal}^2`);
  return { success: true, result: res.toString() };
}



ln(num: string): { success: boolean; result?: string; error?: string } {
  // 1. 校验输入是否为有效数字
  const checkResult = this.checkNum(num);
  if (checkResult.error) {
    return { success: false, error: checkResult.error };
  }
  const numVal = checkResult.num;
  
  // 2. 校验对数真数合法性
  if (numVal <= 0) {
    return { success: false, error: "真数必须大于0" };
  }
  
  // 3. 用原生 Math.log() 计算自然对数（无需 mathjs，永不报错）
  const res = Math.log(numVal);
  return { success: true, result: res.toFixed(4) };
}

// 确保checkNum方法存在（完整）
private checkNum(num: string): { num: number; error?: string } {
  const n = parseFloat(num);
  if (isNaN(n)) return { num: 0, error: "请输入有效数字" };
  return { num: n };
}

factorial(num: string): { success: boolean; result?: string; error?: string } {
  const checkResult = this.checkNum(num);
  if (checkResult.error) {
    return { success: false, error: checkResult.error };
  }
  const numVal = checkResult.num;
  if (numVal < 0 || !Number.isInteger(numVal)) {
    return { success: false, error: "仅支持非负整数" };
  }
  const res = evaluate(`factorial(${numVal})`);
  return { success: true, result: res.toString() };
}
}
export const scientificCalculator = new ScientificCalculator();