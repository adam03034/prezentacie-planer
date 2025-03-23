/**
 * Funkcia na manuálne zaokrúhlenie čísla s možnosťou určiť počet desatinných miest
 * 
 * @param numberToRound - Číslo, ktoré chceme zaokrúhliť
 * @param roundToDigits - Počet desatinných miest (záporné hodnoty) alebo rád (kladné hodnoty)
 * @returns Zaokrúhlené číslo
 */
export function RoundNumber(numberToRound: number, roundToDigits: number): number {
    // Určíme faktor na základe roundToDigits
    let factor = 1;
    for (let i = 0; i < Math.abs(roundToDigits); i++) {
      factor *= 10;
    }
    
    // Ak roundToDigits je záporné, delíme (zaokrúhľujeme na desatinné miesta)
    // Ak je kladné, násobíme (zaokrúhľujeme na jednotky, desiatky, stovky...)
    if (roundToDigits < 0) {
      factor = 1 / factor;
    }
    
    // Manuálne zaokrúhlenie
    const scaled = numberToRound / factor;
    const sign = scaled >= 0 ? 1 : -1;
    const absScaled = scaled * sign; // absolútna hodnota
    
    // Manuálne zaokrúhlenie na celé číslo
    let rounded = 0;
    const decimal = absScaled - (absScaled | 0); // získame desatinnú časť
    
    if (decimal >= 0.5) {
      rounded = (absScaled | 0) + 1; // zaokrúhlenie nahor
    } else {
      rounded = absScaled | 0; // zaokrúhlenie nadol (odrezanie desatinnej časti)
    }
    
    // Vrátime zaokrúhlené číslo s pôvodným znamienkom a vynásobené faktorom
    return (rounded * sign) * factor;
  }