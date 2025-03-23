<template>
  <div class="round-number">
    <h1>Demonštrácia funkcie RoundNumber</h1>
    
    <div class="input-section">
      <div class="form-group">
        <label for="number-input">Zadajte číslo:</label>
        <input 
          id="number-input" 
          v-model="inputNumber" 
          type="number" 
          step="0.001"
          @input="updateResults"
        />
      </div>
      
      <div class="form-group">
        <label for="digits-input">Počet desatinných miest / rádov:</label>
        <input 
          id="digits-input" 
          v-model="roundDigits" 
          type="number" 
          min="-10" 
          max="10" 
          step="1"
          @input="updateResults"
        />
        <span class="hint">(Záporné hodnoty = desatinné miesta, kladné = rády)</span>
      </div>
    </div>
    
    <div class="results-section">
      <h2>Výsledok zaokrúhlenia:</h2>
      <div class="result">{{ roundedResult }}</div>
      
      <div class="explanation">
        <p>
          <strong>Vysvetlenie:</strong> Číslo {{ inputNumber }} zaokrúhlené 
          <span v-if="roundDigits < 0">na {{ Math.abs(roundDigits) }} desatinných miest</span>
          <span v-else-if="roundDigits === 0">na jednotky</span>
          <span v-else>
            na {{ roundDigits === 1 ? 'desiatky' : 
              roundDigits === 2 ? 'stovky' : 
              roundDigits === 3 ? 'tisícky' : 
              Math.pow(10, roundDigits) + ' (rád ' + roundDigits + ')' }}
          </span>
        </p>
      </div>
    </div>
    
    <div class="examples-section">
      <h2>Prednastavené príklady:</h2>
      <table>
        <thead>
          <tr>
            <th>Číslo</th>
            <th>Zaokrúhlenie</th>
            <th>Výsledok</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(example, index) in examples" :key="index">
            <td>{{ example.number }}</td>
            <td>
              {{ example.digits < 0 
                ? Math.abs(example.digits) + ' desatinných miest' 
                : example.digits === 0 
                  ? 'jednotky' 
                  : example.digits === 1 
                    ? 'desiatky' 
                    : example.digits === 2 
                      ? 'stovky' 
                      : example.digits === 3 
                        ? 'tisícky' 
                        : Math.pow(10, example.digits) }}
            </td>
            <td>{{ RoundNumber(example.number, example.digits) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { RoundNumber } from '@/utils/numberUtils';

export default defineComponent({
  name: 'RoundNumberView',
  setup() {
    const inputNumber = ref<number>(1234.567);
    const roundDigits = ref<number>(0);
    const roundedResult = ref<number>(0);
    
    const examples = [
      { number: 1234.567, digits: 0 },   // 1235 (jednotky)
      { number: 1234.567, digits: 1 },   // 1230 (desiatky)
      { number: 1234.567, digits: -1 },  // 1234.6 (1 desatinné miesto)
      { number: 1234.567, digits: -2 },  // 1234.57 (2 desatinné miesta)
      { number: 1234.567, digits: 2 },   // 1200 (stovky)
      { number: 1234.567, digits: 3 },   // 1000 (tisícky)
      { number: -1234.567, digits: 1 },  // -1230 (záporné číslo, desiatky)
      { number: -1234.567, digits: -1 }, // -1234.6 (záporné číslo, 1 desatinné miesto)
    ];
    
    const updateResults = () => {
      roundedResult.value = RoundNumber(inputNumber.value, roundDigits.value);
    };
    
    onMounted(() => {
      updateResults();
    });
    
    return {
      inputNumber,
      roundDigits,
      roundedResult,
      examples,
      updateResults,
      RoundNumber
    };
  }
});
</script>

<style scoped>
.round-number {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #2c3e50;
  margin-bottom: 30px;
}

.input-section {
  background-color: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.hint {
  display: block;
  font-size: 0.8em;
  color: #606266;
  margin-top: 5px;
}

.results-section {
  background-color: #ecf5ff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.result {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin: 15px 0;
}

.examples-section {
  margin-top: 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #dcdfe6;
  padding: 10px;
  text-align: center;
}

th {
  background-color: #f5f7fa;
}

tr:nth-child(even) {
  background-color: #fafafa;
}
</style>