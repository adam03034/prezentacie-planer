// tu som si dal rezimy podla poziadaviek
export type PlayMode = 'continuous' | 'daily' | 'specificDays';

// rozvrh
export interface Schedule {
  mode: PlayMode;
  startTime?: string; 
  endTime?: string;   
  days?: number[];    //0 - nedela, 1 - pondelek atd
}

// struktura projektu
export interface Project {
  id: number;
  name: string;
  schedule: Schedule;
}

export function shouldPlayProject(project: Project, currentDate: Date = new Date()): boolean {
  const { schedule } = project;
  

  if (schedule.mode === 'continuous') {
    return true;
  }
  

  if (schedule.startTime && schedule.endTime) {
    const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes();
    const [startHours, startMinutes] = schedule.startTime.split(':').map(Number);
    const [endHours, endMinutes] = schedule.endTime.split(':').map(Number);
    
    const startTimeMinutes = startHours * 60 + startMinutes;
    const endTimeMinutes = endHours * 60 + endMinutes;
    
  
    if (currentTime < startTimeMinutes || currentTime > endTimeMinutes) {
      return false;
    }
  }
  

  if (schedule.mode === 'specificDays' && schedule.days) {
    const currentDay = currentDate.getDay(); 
    return schedule.days.includes(currentDay);
  }
  
  
  return schedule.mode === 'daily';
}


export function getProjectPlaytime(project: Project): { startTime: string; endTime: string } | null {
  const { schedule } = project;
  
  if (schedule.mode === 'continuous') {
    return null; 
  }
  
  if (schedule.startTime && schedule.endTime) {
    return {
      startTime: schedule.startTime,
      endTime: schedule.endTime
    };
  }
  
  return null;
}

export function getCurrentProject(projects: Project[], currentDate: Date = new Date()): Project | undefined {
  return projects.find(project => shouldPlayProject(project, currentDate));
}
