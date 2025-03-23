<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ProjectForm from '../components/ProjectForm.vue'
import ProjectList from '../components/ProjectList.vue'
import type { Project } from '../types'
import { shouldPlayProject, getProjectPlaytime } from '../types'

const projects = ref<Project[]>([])
const currentTime = ref(new Date())

// Aktualizácia času každú sekundu namiesto minúty
const updateCurrentTime = () => {
  currentTime.value = new Date()
}

// Použitie requestAnimationFrame pre plynulejšiu aktualizáciu času
const startTimeUpdater = () => {
  updateCurrentTime()
  requestAnimationFrame(startTimeUpdater)
}

// Výpočet všetkých aktívnych projektov
const activeProjects = computed(() => {
  return projects.value.filter(project => shouldPlayProject(project, currentTime.value))
})

// Pridanie nového projektu
const addProject = (project: Project) => {
  projects.value.push(project)
  saveProjects()
}

// Odstránenie projektu
const removeProject = (id: number) => {
  projects.value = projects.value.filter(p => p.id !== id)
  saveProjects()
}

// Uloženie projektov do localStorage
const saveProjects = () => {
  localStorage.setItem('prezentacie-planer-projects', JSON.stringify(projects.value))
}

// Načítanie projektov z localStorage
const loadProjects = () => {
  const savedProjects = localStorage.getItem('prezentacie-planer-projects')
  if (savedProjects) {
    projects.value = JSON.parse(savedProjects)
  }
}

// Načítanie projektov pri spustení aplikácie a štart časovača
onMounted(() => {
  loadProjects()
  startTimeUpdater()
})

// Formátovanie času pre zobrazenie
const formatTime = (date: Date) => {
  return date.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
</script>

<template>
  <div class="container">
    <header>
      <h1>Plánovač prezentácií</h1>
      <div class="current-time">
        Aktuálny čas: {{ formatTime(currentTime) }}
      </div>
    </header>
    <main>
      <section class="active-projects" v-if="activeProjects.length > 0">
        <h2>Aktuálne prehrávané projekty</h2>
        <div class="projects-grid">
          <div class="project-card" v-for="project in activeProjects" :key="project.id">
            <h3>{{ project.name }}</h3>
            <p v-if="project.schedule.mode !== 'continuous'">
              Čas prehrávania:
              {{ project.schedule.startTime }} - {{ project.schedule.endTime }}
            </p>
            <p v-if="project.schedule.mode === 'specificDays' && project.schedule.days">
              Dni: 
              {{ project.schedule.days.map(d => ['Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So'][d]).join(', ') }}
            </p>
          </div>
        </div>
      </section>
      <section class="no-active-projects" v-else>
        <h2>Žiadne aktívne projekty</h2>
        <p>Momentálne sa neprehráva žiadny projekt.</p>
      </section>
      <section class="projects-section">
        <h2>Pridať nový projekt</h2>
        <ProjectForm @add-project="addProject" />
      </section>
      <section class="projects-section">
        <h2>Zoznam projektov</h2>
        <ProjectList
          :projects="projects"
          :currentTime="currentTime"
          @remove-project="removeProject"
        />
      </section>
    </main>
  </div>
</template>

<style>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

h1, h2, h3 {
  color: #333;
}

.active-projects {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 30px;
}

.no-active-projects {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 30px;
  text-align: center;
  color: #666;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.project-card {
  background-color: white;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.projects-section {
  margin-bottom: 30px;
}

.current-time {
  font-size: 1.2em;
  font-weight: bold;
}
</style>