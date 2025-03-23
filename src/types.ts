// Typy režimov prehrávania
export type PlayMode = 'continuous' | 'daily' | 'specificDays';

// Štruktúra pre plánovanie prehrávania
export interface Schedule {
  mode: PlayMode;
  startTime?: string; // formát HH:MM
  endTime?: string;   // formát HH:MM
  days?: number[];    // 0 = Nedeľa, 1 = Pondelok, ..., 6 = Sobota
}

// Štruktúra projektu
export interface Project {
  id: number;
  name: string;
  schedule: Schedule;
}

/**
 * Funkcia na zistenie, či sa má projekt prehrávať v aktuálnom čase
 * @param project Projekt na kontrolu
 * @param currentDate Aktuálny dátum a čas (predvolene aktuálny čas)
 * @returns Boolean či sa má projekt prehrávať
 */
export function shouldPlayProject(project: Project, currentDate: Date = new Date()): boolean {
  const { schedule } = project;
  
  // Režim bez plánovania - vždy sa prehráva
  if (schedule.mode === 'continuous') {
    return true;
  }
  
  // Kontrola času
  if (schedule.startTime && schedule.endTime) {
    const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes();
    const [startHours, startMinutes] = schedule.startTime.split(':').map(Number);
    const [endHours, endMinutes] = schedule.endTime.split(':').map(Number);
    
    const startTimeMinutes = startHours * 60 + startMinutes;
    const endTimeMinutes = endHours * 60 + endMinutes;
    
    // Ak aktuálny čas nie je v rozmedzí začiatku a konca, projekt sa neprehráva
    if (currentTime < startTimeMinutes || currentTime > endTimeMinutes) {
      return false;
    }
  }
  
  // Kontrola dní v týždni pre režim specificDays
  if (schedule.mode === 'specificDays' && schedule.days) {
    const currentDay = currentDate.getDay(); // 0 = Nedeľa, 1 = Pondelok, ...
    return schedule.days.includes(currentDay);
  }
  
  // Pre daily režim stačí len kontrola času, ktorú sme už urobili vyššie
  return schedule.mode === 'daily';
}

/**
 * Funkcia na získanie času začiatku a konca prehrávania projektu
 * @param project Projekt
 * @returns Objekt obsahujúci začiatočný a koncový čas, alebo null ak projekt nemá časové obmedzenie
 */
export function getProjectPlaytime(project: Project): { startTime: string; endTime: string } | null {
  const { schedule } = project;
  
  if (schedule.mode === 'continuous') {
    return null; // Projekt nemá časové obmedzenie
  }
  
  if (schedule.startTime && schedule.endTime) {
    return {
      startTime: schedule.startTime,
      endTime: schedule.endTime
    };
  }
  
  return null;
}

/**
 * Funkcia na zistenie, ktorý projekt sa má prehrávať v aktuálnom čase
 * @param projects Zoznam všetkých projektov
 * @param currentDate Aktuálny dátum a čas (predvolene aktuálny čas)
 * @returns Projekt, ktorý sa má prehrávať alebo undefined ak sa nemá prehrávať žiadny
 */
export function getCurrentProject(projects: Project[], currentDate: Date = new Date()): Project | undefined {
  return projects.find(project => shouldPlayProject(project, currentDate));
}