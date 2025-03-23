
export function RoundNumber(numberToRound: number, roundToDigits: number): number {
 
    let factor = 1;
    for (let i = 0; i < Math.abs(roundToDigits); i++) {
      factor *= 10;
    }
    
  
    if (roundToDigits < 0) {
      factor = 1 / factor;
    }
    
   
    const scaled = numberToRound / factor;
    const sign = scaled >= 0 ? 1 : -1;
    const absScaled = scaled * sign; 
    
 
    let rounded = 0;
    const decimal = absScaled - (absScaled | 0); 
    
    if (decimal >= 0.5) {
      rounded = (absScaled | 0) + 1; 
    } else {
      rounded = absScaled | 0; 
    }
    

    return (rounded * sign) * factor;
  }
