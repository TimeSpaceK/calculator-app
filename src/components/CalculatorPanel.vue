<template>
  <div class="calculator-panel">
    <!-- 显示区域：输入的表达式 + 运算结果 -->
    <div class="display">
      <div class="expression">
        {{ currentExpression.length > 20 ? currentExpression.slice(0, 20) + '...' : currentExpression }}
      </div>
      <div class="result" :style="{ color: currentResult.includes('错误') ? 'red' : '#fff' }">
       {{ currentResult ? (currentResult.length > 15 ? currentResult.slice(0, 15) + '...' : currentResult) : "0" }}
      </div>
    </div>

    <!-- 科学运算按钮区 -->
    <div class="scientific-buttons">
      <button class="btn sci-btn" @click="handleScientificCalc('sqrt')">√</button>
      <button class="btn sci-btn" @click="handleScientificCalc('square')">x²</button>
      <button class="btn sci-btn" @click="handleScientificCalc('ln')">ln</button>
      <button class="btn sci-btn" @click="handleScientificCalc('factorial')">!</button>
    </div>

    <!-- 按钮区域：4行，包含数字、运算符、功能键 -->
    <div class="buttons">
      <!-- 第一行：清除、正负、取余、除 -->
      <button class="btn operator" @click="handleClear">AC</button>
      <button class="btn operator" @click="handleToggleSign">±</button>
      <button class="btn operator" @click="appendChar('%')">%</button>
      <button class="btn operator" @click="appendChar('÷')">÷</button>

      <!-- 第二行：数字7-9、乘 -->
      <button class="btn number" @click="appendChar('7')">7</button>
      <button class="btn number" @click="appendChar('8')">8</button>
      <button class="btn number" @click="appendChar('9')">9</button>
      <button class="btn operator" @click="appendChar('×')">×</button>

      <!-- 第三行：数字4-6、减 -->
      <button class="btn number" @click="appendChar('4')">4</button>
      <button class="btn number" @click="appendChar('5')">5</button>
      <button class="btn number" @click="appendChar('6')">6</button>
      <button class="btn operator" @click="appendChar('-')">-</button>

      <!-- 第四行：数字1-3、加 + 等号（占2行） -->
      <button class="btn number" @click="appendChar('1')">1</button>
      <button class="btn number" @click="appendChar('2')">2</button>
      <button class="btn number" @click="appendChar('3')">3</button>
      <button class="btn operator" @click="appendChar('+')">+</button>

      <!-- 第五行：0、小数点 + 等号 -->
      <button class="btn number zero" @click="appendChar('0')">0</button>
      <button class="btn number" @click="appendChar('.')">.</button>
      <button class="btn operator equal span-col" @click="handleCalculate">=</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { basicCalculator } from '../core/calculator/basic';
import { scientificCalculator } from '../core/calculator/scientific';

// 响应式数据：当前输入的表达式、运算结果、角度/弧度标记
const currentExpression = ref('');
const currentResult = ref('');
const isDegree = ref(false);

/**
 * 追加字符（数字/运算符）到表达式
 * @param char 要追加的字符
 */
const appendChar = (char: string) => {
  // 避免连续输入运算符
  const lastChar = currentExpression.value.slice(-1);
  const operators = ['+', '-', '×', '÷', '%'];
  
  if (operators.includes(char) && operators.includes(lastChar)) {
    currentExpression.value = currentExpression.value.slice(0, -1) + char;
    return;
  }
  
  currentExpression.value += char;
};

/**
 * 处理运算（点击等号）
 */
const handleCalculate = () => {
  if (!currentExpression.value) return;
  
  const result = basicCalculator.calculate(currentExpression.value);
  if (result.success) {
    currentResult.value = result.result!;
    // 记录运算历史
    basicCalculator.recordHistory(currentExpression.value, result.result!);
  } else {
    currentResult.value = result.error!;
    // 2秒后清空错误提示
    setTimeout(() => {
      currentResult.value = '';
    }, 2000);
  }
};

/**
 * 清空表达式和结果（点击AC）
 */
const handleClear = () => {
  currentExpression.value = '';
  currentResult.value = '';
};

/**
 * 切换数字正负（点击±）
 */
const handleToggleSign = () => {
  currentExpression.value = basicCalculator.toggleSign(currentExpression.value);
};

/**
 * 处理科学运算（平方根、平方、sin/cos/tan等）
 * @param type 运算类型：sqrt/square/sin/cos/tan/ln/factorial
 */
const handleScientificCalc = (type: string) => {
  if (!currentExpression.value) return;

  let result;
  switch (type) {
    case 'sqrt':
      result = scientificCalculator.squareRoot(currentExpression.value);
      break;
    case 'square':
      result = scientificCalculator.square(currentExpression.value);
      break;
    case 'ln':
      result = scientificCalculator.ln(currentExpression.value);
      break;
    case 'factorial':
      result = scientificCalculator.factorial(currentExpression.value);
      break;
    default:
      result = { success: false, error: "错误：不支持的运算类型" };
  }

  if (result.success) {
    currentResult.value = result.result!;
    currentExpression.value = result.result!;
  } else {
    currentResult.value = result.error!;
    setTimeout(() => {
      currentResult.value = '';
    }, 2000);
  }
};

/**
 * 切换角度/弧度（三角函数用）
 */
 // 删掉末尾的d，从toggleDegreeRad→toggleDegreeRad
const toggleDegreeRad = () => { 
  isDegree.value = !isDegree.value;
  // 可选：加打印，确认切换生效
  console.log('角度模式：', isDegree.value);
};
</script>

<style scoped>
/* 计算器整体容器 */
.calculator-panel {
  width: 320px;
  /* 核心：将高度改为自动，由内容决定 */
  height: fit-content; 
  margin: 50px auto;
  background: #1e1e1e;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  box-sizing: border-box;
  /* 可选：确保不会因内容撑开而变长 */
  overflow: hidden;
}

/* 显示区域 */
.display {
  background: #2d2d2d;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: right;
  max-width: 100%;
  overflow: hidden;
}

.expression {
  color: #a0a0a0;
  font-size: 18px;
  line-height: 1.5;
  min-height: 24px;
  max-width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  text-align: right;
  scrollbar-width: thin;
}

.result {
  color: #fff;
  font-size: 32px;
  font-weight: bold;
  line-height: 1.5;
  min-height: 40px;
  max-width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  text-align: right;
  scrollbar-width: thin;
}

/* 科学运算按钮区 */
/* 科学运算按钮区（修改后） */
.scientific-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 从8列改为4列，适配4个按钮 */
  gap: 8px;
  margin-bottom: 10px;
}

/* 科学运算按钮样式 */
.sci-btn {
  background: #5a5a5a;
  color: #fff;
  font-size: 16px;
  padding: 8px 0;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sci-btn:hover {
  background: #6d6d6d;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4列均分，3号按钮占1列 */
  grid-template-rows: repeat(5, 70px);  /* 行高固定，保证按钮高度一致 */
  gap: 8px;
  justify-content: center;
}

/* 通用按钮样式 */
.btn {
  border: none;
  border-radius: 8px;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  opacity: 0.9;
  transform: scale(0.98);
}

/* 数字按钮 */
.number {
  background: #3d3d3d;
  color: #fff;
}

.operator {
  background: #ff9500;
  color: #fff;
  font-weight: bold;
}

/* 2. 等号按钮：占2列，右对齐于加号 */
.equal {
  background: #ff9500;
  color: #fff;
  font-weight: bold;
  /* 核心：跨越2列，对齐到第3-4列 */
  grid-column: span 2;
  /* 确保与加号（+）右边界对齐，无需额外设置，网格自动对齐 */
}

/* 等号按钮占2行 */
.span-row {
  grid-row: span 2;
  height: 100%;
}

/* 0号按钮占1列 */
.zero {
  grid-column: span 1;
  width: 100%;
}
</style>