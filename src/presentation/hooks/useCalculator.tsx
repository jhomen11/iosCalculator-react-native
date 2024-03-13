import React, {useEffect, useRef, useState} from 'react';

enum Operator {
  add = '+',
  substract = '-',
  multiply = 'x',
  divide = '÷',
}

export const useCalculator = () => {
  const [formula, setFormula] = useState('');

  const [number, setNumber] = useState('0');
  const [prevNumber, setPrevNumber] = useState('0');

  const lasOperation = useRef<Operator>();

  useEffect(() => {
    if (lasOperation.current) {
      const fisrtFormulaPart = formula.split(' ').at(0);
      setFormula(`${fisrtFormulaPart} ${lasOperation.current} ${number}`);
    } else {
      setFormula(number);
    }
  }, [number]);

  useEffect(() => {
    const subResult = calculateSubResult();
    setPrevNumber(`${subResult}`);
  }, [formula]);

  const clean = () => {
    setNumber('0');
    setPrevNumber('0');
    lasOperation.current = undefined;
    setFormula('');
  };

  const deleteOperation = () => {
    let currentSign = '';
    let temporalNumber = number;

    if (number.includes('-')) {
      currentSign = '-';
      temporalNumber = number.substring(1);
    }

    if (temporalNumber.length > 1) {
      return setNumber(currentSign + temporalNumber.slice(0, -1));
    }
    setNumber('0');
  };

  const toggleSing = () => {
    if (number.includes('-')) {
      return setNumber(number.replace('-', ''));
    }
    setNumber('-' + number);
  };

  const buildNumber = (numberString: string) => {
    if (number.includes('.') && numberString === '.') return;

    if (number.startsWith('0') || number.startsWith('-0')) {
      if (numberString === '.') {
        return setNumber(number + numberString);
      }
      if (numberString === '0' && number.includes('.')) {
        return setNumber(number + numberString);
      }

      if (numberString !== '0' && !number.includes('.')) {
        return setNumber(numberString);
      }
      if (numberString === '0' && !number.includes('.')) {
        return setNumber(number);
      }
      return setNumber(number + numberString);
    }

    setNumber(number + numberString);
  };

  const setLastNumber = () => {
    calculateResult();
    if (number.endsWith('.')) {
      setPrevNumber(number.slice(0, -1));
    } else {
      setPrevNumber(number);
    }
    setNumber('0');
  };

  const addOperation = () => {
    setLastNumber();
    lasOperation.current = Operator.add;
  };

  const substractOperation = () => {
    setLastNumber();
    lasOperation.current = Operator.substract;
  };

  const multiplyOperation = () => {
    setLastNumber();
    lasOperation.current = Operator.multiply;
  };
  const divideOperation = () => {
    setLastNumber();
    lasOperation.current = Operator.divide;
  };

  const calculateResult = () => {
    const result = calculateSubResult()
    setFormula(`${result}`)
    lasOperation.current = undefined;
    setPrevNumber('0');
  };

  const calculateSubResult = ():number => {

    const[ firstValue, operation, secondValue ] = formula.split(' ');

    const num1 = Number(firstValue);
    const num2 = Number(secondValue);

    if(isNaN(num2)) return num1;

    switch (operation) {
      case Operator.add:
        return num1 + num2;
        break;
      case Operator.substract:
        return num1 - num2;
        break;
      case Operator.multiply:
        return num1 * num2;
        break;
      case Operator.divide:
        return num1 / num2;
        break;
      default:
        throw new Error('Operation not found');
    }
  };

  return {
    //* Properties
    number,
    prevNumber,
    formula,

    //* Methods
    buildNumber,
    clean,
    deleteOperation,
    toggleSing,
    addOperation,
    substractOperation,
    multiplyOperation,
    divideOperation,
    calculateResult,
  };
};
