// Safe math calculator - NO eval()
function calculateMath(expression) {
  // Remove spaces
  expression = expression.replace(/\s/g, '');
  
  // Replace common math functions
  expression = expression.replace(/sqrt\(([^)]+)\)/g, (match, num) => {
    const value = calculateMath(num);
    return Math.sqrt(value);
  });
  
  // Handle parentheses recursively
  while (expression.includes('(')) {
    expression = expression.replace(/\(([^()]+)\)/g, (match, inner) => {
      return calculateMath(inner);
    });
  }
  
  // Handle exponents (^)
  while (expression.includes('^')) {
    expression = expression.replace(/([0-9.]+)\^([0-9.]+)/g, (match, base, exp) => {
      return Math.pow(parseFloat(base), parseFloat(exp));
    });
  }
  
  // Handle multiplication and division
  while (/[*/]/.test(expression)) {
    expression = expression.replace(/([0-9.]+)([*/])([0-9.]+)/g, (match, a, op, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      if (op === '*') return numA * numB;
      if (op === '/') {
        if (numB === 0) throw new Error('Division by zero');
        return numA / numB;
      }
    });
  }
  
  // Handle modulo
  while (/%/.test(expression)) {
    expression = expression.replace(/([0-9.]+)%([0-9.]+)/g, (match, a, b) => {
      return parseFloat(a) % parseFloat(b);
    });
  }
  
  // Handle addition and subtraction
  while (/[+-]/.test(expression.slice(1))) { // Skip first character to handle negative numbers
    expression = expression.replace(/([0-9.]+)([-+])([0-9.]+)/g, (match, a, op, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      if (op === '+') return numA + numB;
      if (op === '-') return numA - numB;
    });
  }
  
  return parseFloat(expression);
}

module.exports = {
  name: 'calc',
  aliases: ['calculate', 'math'],
  category: 'Tools',
  description: 'Safe math calculator (supports +, -, *, /, ^, %, sqrt, parentheses)',
  usage: '!calc <expression>',
  examples: ['!calc 2+2', '!calc 5*5', '!calc sqrt(16)', '!calc 2^8', '!calc (5+3)*2'],
  cooldown: 2,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage }) => {
    if (!args || args.length === 0) {
      return '❌ Please provide a math expression!\n\nExample: !calc 2+2*5';
    }
    
    const expression = args.join('');
    
    // Validate input - only allow numbers, operators, and parentheses
    if (!/^[0-9+\-*/%^().\ssqrt]+$/.test(expression)) {
      return '❌ Invalid characters in expression!\n\nAllowed: numbers, +, -, *, /, ^, %, sqrt(), ()';
    }
    
    try {
      const result = calculateMath(expression);
      
      if (!isFinite(result)) {
        return '❌ Result is not a finite number!';
      }
      
      return `🔢 *Calculator*\n\n*Expression:* ${expression}\n*Result:* ${result}`;
    } catch (error) {
      return `❌ Calculation error: ${error.message}`;
    }
  }
};
