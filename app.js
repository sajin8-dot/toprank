/* ==========================================================================
   TopRank Application Logic - Bullet Journal Learning Tracker
   ========================================================================== */

// --- Constants & Config ---
const DECAY_RATE = 0.5; // points decayed per day
// localStorage is intentionally NOT used for app state — all data lives in Supabase only.
// Clear any legacy cached state from older versions of the app.
['toprank_state_v1'].forEach(k => localStorage.removeItem(k));

// --- Default Seed Data ---
const DEFAULT_STATE = {
  kids: [
    { id: "kid-rahel", name: "Rahel", age: 12, std: "Std 7", avatar: "" },
    { id: "kid-elsa", name: "Elsa", age: 9, std: "Std 4", avatar: "" },
    { id: "kid-eliah", name: "Eliah", age: 7, std: "Std 2", avatar: "" }
  ],
  currentKidId: "kid-rahel",
  subjects: [
    // Rahel's subjects
    { kidId: "kid-rahel", name: "Maths", color: "#54a0ff", decayRate: 0.5 },
    { kidId: "kid-rahel", name: "Hindi", color: "#ff9f43", decayRate: 0.5 },
    { kidId: "kid-rahel", name: "Geography", color: "#1dd1a1", decayRate: 0.5 },
    { kidId: "kid-rahel", name: "Science", color: "#5f27cd", decayRate: 0.5 },
    { kidId: "kid-rahel", name: "History", color: "#ff6b6b", decayRate: 0.5 },
    { kidId: "kid-rahel", name: "English", color: "#ff9ff3", decayRate: 0.5 },
    // Elsa's subjects
    { kidId: "kid-elsa", name: "Maths", color: "#54a0ff", decayRate: 0.5 },
    { kidId: "kid-elsa", name: "Hindi", color: "#ff9f43", decayRate: 0.5 },
    { kidId: "kid-elsa", name: "Geography", color: "#1dd1a1", decayRate: 0.5 },
    { kidId: "kid-elsa", name: "Science", color: "#5f27cd", decayRate: 0.5 },
    { kidId: "kid-elsa", name: "History", color: "#ff6b6b", decayRate: 0.5 },
    { kidId: "kid-elsa", name: "English", color: "#ff9ff3", decayRate: 0.5 },
    // Eliah's subjects
    { kidId: "kid-eliah", name: "Maths", color: "#54a0ff", decayRate: 0.5 },
    { kidId: "kid-eliah", name: "Hindi", color: "#ff9f43", decayRate: 0.5 },
    { kidId: "kid-eliah", name: "Geography", color: "#1dd1a1", decayRate: 0.5 },
    { kidId: "kid-eliah", name: "Science", color: "#5f27cd", decayRate: 0.5 },
    { kidId: "kid-eliah", name: "History", color: "#ff6b6b", decayRate: 0.5 },
    { kidId: "kid-eliah", name: "English", color: "#ff9ff3", decayRate: 0.5 }
  ],
  lessons: [
    // Rahel's Lessons
    {
      id: "less-r1",
      kidId: "kid-rahel",
      subjectName: "Maths",
      topicName: "Linear Equations",
      createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      subSections: [
        { name: "Formulas & Rules", baseRating: 9, lastUpdatedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
        { name: "Short Q&A Problems", baseRating: 8, lastUpdatedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
        { name: "Graphing Equations", baseRating: 10, lastUpdatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
      ]
    },
    {
      id: "less-r2",
      kidId: "kid-rahel",
      subjectName: "Science",
      topicName: "Photosynthesis",
      createdDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
      subSections: [
        { name: "Light Reaction Phase", baseRating: 9, lastUpdatedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
        { name: "Dark Reaction Phase", baseRating: 8, lastUpdatedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() },
        { name: "Leaf Diagram Labeling", baseRating: 9, lastUpdatedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() }
      ]
    },
    {
      id: "less-r3",
      kidId: "kid-rahel",
      subjectName: "Geography",
      topicName: "Tectonic Plates",
      createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      subSections: [
        { name: "Definitions", baseRating: 5, lastUpdatedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { name: "Map Marking of Plates", baseRating: 0, lastUpdatedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() } // Starts at 0
      ]
    },
    
    // Elsa's Lessons
    {
      id: "less-el1",
      kidId: "kid-elsa",
      subjectName: "Geography",
      topicName: "Map of India",
      createdDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      subSections: [
        { name: "State Outlines", baseRating: 8, lastUpdatedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { name: "Capital City Labels", baseRating: 9, lastUpdatedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() }
      ]
    },
    {
      id: "less-el2",
      kidId: "kid-elsa",
      subjectName: "Hindi",
      topicName: "Vilom Shabd",
      createdDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      subSections: [
        { name: "Meanings", baseRating: 9, lastUpdatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
        { name: "Opposite Writing", baseRating: 8, lastUpdatedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() }
      ]
    },

    // Eliah's Lessons
    {
      id: "less-eli1",
      kidId: "kid-eliah",
      subjectName: "Maths",
      topicName: "Addition & Regrouping",
      createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      subSections: [
        { name: "2 Digit Addition", baseRating: 9, lastUpdatedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
        { name: "Carryover Columns", baseRating: 7, lastUpdatedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }
      ]
    }
  ],
  quizzes: [
    { id: "q-r1", kidId: "kid-rahel", subjectName: "Maths", topicName: "Linear Equations Unit Test", date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { id: "q-r2", kidId: "kid-rahel", subjectName: "Geography", topicName: "Plates & Faults Quiz", date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { id: "q-el1", kidId: "kid-elsa", subjectName: "Geography", topicName: "India Map Quiz", date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { id: "q-eli1", kidId: "kid-eliah", subjectName: "Maths", topicName: "Carryover Quiz", date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
  ],
  logs: [
    { id: "log-1", kidId: "kid-rahel", timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), type: "lesson", message: "Lesson 'Linear Equations' added to Maths with 3 sub-sections." },
    { id: "log-2", kidId: "kid-rahel", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), type: "rating", message: "Learned Short Q&A Problems under Linear Equations proficiency increased to 8/10" },
    { id: "log-3", kidId: "kid-rahel", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), type: "quiz", message: "Scheduled new quiz for 'Linear Equations Unit Test' in Maths on " + new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString() },
    
    { id: "log-4", kidId: "kid-elsa", timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), type: "lesson", message: "Lesson 'Map of India' added to Geography with 2 sub-sections." },
    
    { id: "log-5", kidId: "kid-eliah", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), type: "lesson", message: "Lesson 'Addition & Regrouping' added to Maths with 2 sub-sections." }
  ],
  dateOffset: 0,
  theme: "light",
  quizView: "list",
  prepHistory: {}
};

// --- App State ---
let state = {};

// --- Migrations & Validation ---
function runMigrations() {
  if (typeof state.dateOffset === 'undefined') state.dateOffset = 0;
  if (typeof state.prepHistory === 'undefined') state.prepHistory = {};
  
  let migrated = false;
  
  // Migrate kid-aaliyah to kid-eliah / Aaliyah to Eliah
  if (state.kids) {
    state.kids.forEach(k => {
      if (k.avatar !== "") {
        k.avatar = "";
        migrated = true;
      }
      if (k.id === "kid-aaliyah" || k.name === "Aaliyah") {
        k.id = "kid-eliah";
        k.name = "Eliah";
        migrated = true;
      }
    });
  }
  if (state.currentKidId === "kid-aaliyah") {
    state.currentKidId = "kid-eliah";
    migrated = true;
  }
  if (state.lessons) {
    state.lessons.forEach(l => {
      if (l.kidId === "kid-aaliyah") {
        l.kidId = "kid-eliah";
        migrated = true;
      }
    });
  }
  if (state.quizzes) {
    state.quizzes.forEach(q => {
      if (q.kidId === "kid-aaliyah") {
        q.kidId = "kid-eliah";
        migrated = true;
      }
    });
  }
  if (state.logs) {
    state.logs.forEach(log => {
      if (log.kidId === "kid-aaliyah") {
        log.kidId = "kid-eliah";
        migrated = true;
      }
    });
  }

  // Partition subjects by kidId if they don't have one
  if (state.subjects) {
    let hasGlobalSubjects = false;
    const partitionedSubjects = [];
    state.subjects.forEach(s => {
      if (s.emoji) {
        delete s.emoji;
        migrated = true;
      }
      if (typeof s.decayRate === 'undefined') {
        s.decayRate = 0.5;
        migrated = true;
      }
      
      if (!s.kidId) {
        hasGlobalSubjects = true;
        const kidsList = state.kids || DEFAULT_STATE.kids;
        kidsList.forEach(k => {
          const targetKidId = k.id === "kid-aaliyah" ? "kid-eliah" : k.id;
          if (!partitionedSubjects.some(ps => ps.kidId === targetKidId && ps.name.toLowerCase() === s.name.toLowerCase())) {
            partitionedSubjects.push({
              kidId: targetKidId,
              name: s.name,
              color: s.color,
              decayRate: s.decayRate
            });
          }
        });
      } else {
        if (s.kidId === "kid-aaliyah") {
          s.kidId = "kid-eliah";
          migrated = true;
        }
        partitionedSubjects.push(s);
      }
    });
    if (hasGlobalSubjects) {
      state.subjects = partitionedSubjects;
      migrated = true;
    }
  }

  if (typeof state.theme === 'undefined') {
    state.theme = 'light';
    migrated = true;
  }
  if (typeof state.quizView === 'undefined') {
    state.quizView = 'list';
    migrated = true;
  }
  
  return migrated;
}

// --- Load State ---
// State is loaded exclusively from Supabase via syncWithSupabase() on startup.
// This function just sets the in-memory default so the UI can render while the
// async fetch is in progress.
function loadState() {
  state = JSON.parse(JSON.stringify(DEFAULT_STATE));
  applyTheme();
}

// --- Supabase Config & Syncing ---
const SUPABASE_URL = "https://gtvizvzuslhebcpmplgq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0dml6dnp1c2xoZWJjcG1wbGdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjI1MDIsImV4cCI6MjA4OTkzODUwMn0.bh3O_6t-QS3gRfh6S_j97QXdoRasdTN1OZW3hDTJBkQ";
const PROFILE_KEY = "scholastic";

let supabaseClient = null;
if (window.supabase) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

function updateSyncStatus(status) {
  const pill = document.getElementById('sync-status');
  if (!pill) return;

  pill.classList.remove('syncing', 'synced', 'error', 'offline');
  const label = pill.querySelector('.sync-pill-label');

  if (status === 'syncing') {
    pill.classList.add('syncing');
    pill.title = "Syncing with cloud...";
    if (label) label.textContent = "syncing";
  } else if (status === 'synced') {
    pill.classList.add('synced');
    pill.title = "All changes synced to cloud";
    if (label) label.textContent = "synced";
  } else if (status === 'error') {
    pill.classList.add('error');
    pill.title = "Sync error! Using offline data";
    if (label) label.textContent = "sync error";
  } else if (status === 'offline') {
    pill.classList.add('offline');
    pill.title = "Offline. Changes will sync when online";
    if (label) label.textContent = "offline";
  }
}

async function forceSaveStateToSupabase() {
  if (!supabaseClient) return;
  if (!appReady) return; // never seed with DEFAULT_STATE
  updateSyncStatus('syncing');
  try {
    const { error } = await supabaseClient
      .from('toprank_state')
      .upsert({
        profile_key: PROFILE_KEY,
        state_json: state,
        updated_at: state.updatedAt || new Date().toISOString()
      });
    if (error) throw error;
    updateSyncStatus('synced');
  } catch (e) {
    console.error("Supabase force sync failed:", e);
    updateSyncStatus(navigator.onLine ? 'error' : 'offline');
    throw e;
  }
}

let syncTimeout = null;
// Guard: blocks saveState() until the initial Supabase load has completed.
// Prevents DEFAULT_STATE from being written to Supabase during startup.
let appReady = false;

// Record today's PREP index snapshot for every kid
function recordPrepSnapshots() {
  const today = new Date().toISOString().slice(0, 10);
  if (!state.prepHistory) state.prepHistory = {};
  state.kids.forEach(kid => {
    const kidSubjects = state.subjects.filter(s => s.kidId === kid.id);
    if (kidSubjects.length === 0) return;
    let total = 0;
    kidSubjects.forEach(subj => { total += getSubjectRating(kid.id, subj.name); });
    const pct = Math.round((total / (kidSubjects.length * 10)) * 100);
    if (!state.prepHistory[kid.id]) state.prepHistory[kid.id] = {};
    state.prepHistory[kid.id][today] = pct;
  });
}

// --- Save State ---
// Writes directly to Supabase only (no localStorage). Debounced by 1s.
function saveState() {
  if (!appReady) return; // never write DEFAULT_STATE before Supabase has loaded
  recordPrepSnapshots();
  state.updatedAt = new Date().toISOString();

  if (supabaseClient) {
    if (syncTimeout) clearTimeout(syncTimeout);
    updateSyncStatus('syncing');
    syncTimeout = setTimeout(async () => {
      try {
        const { error } = await supabaseClient
          .from('toprank_state')
          .upsert({
            profile_key: PROFILE_KEY,
            state_json: state,
            updated_at: state.updatedAt
          });
        if (error) throw error;
        updateSyncStatus('synced');
      } catch (e) {
        console.error("Supabase sync failed:", e);
        updateSyncStatus(navigator.onLine ? 'error' : 'offline');
      }
    }, 1000);
  }
}

async function syncWithSupabase() {
  if (!supabaseClient) {
    updateSyncStatus('offline');
    return;
  }

  updateSyncStatus('syncing');
  try {
    const { data: list, error } = await supabaseClient
      .from('toprank_state')
      .select('state_json, updated_at')
      .eq('profile_key', PROFILE_KEY);

    if (error) throw error;

    if (list && list.length > 0) {
      console.log("Loading state from Supabase...");
      state = list[0].state_json;
      runMigrations();
      appReady = true;
      renderAll();
      populateSubjectDropdowns();
      updateSyncStatus('synced');
    } else {
      // No row in Supabase yet — mark ready without seeding.
      // User must make an explicit change to trigger the first write.
      console.log("No server state found. Waiting for first user action to seed.");
      appReady = true;
      updateSyncStatus('synced');
    }
  } catch (e) {
    console.error("Failed to load state from Supabase:", e);
    // Do NOT set appReady on error — block writes until we successfully load
    updateSyncStatus(navigator.onLine ? 'error' : 'offline');
  }
}

// Hook offline/online window events to update status dot
window.addEventListener('online', () => {
  console.log("App online. Triggering sync...");
  syncWithSupabase();
});
window.addEventListener('offline', () => {
  updateSyncStatus('offline');
});

// Poll Supabase for updates every 30 minutes in case of changes from other devices
setInterval(() => {
  console.log("Scheduled 30-minute sync trigger...");
  syncWithSupabase();
}, 30 * 60 * 1000);

// Also sync immediately when the user switches back to the tab/app
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    console.log("App focused/visible. Triggering background sync...");
    syncWithSupabase();
  }
});

// --- Log Activity Utility ---
function logActivity(kidId, type, message) {
  const logEntry = {
    id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
    kidId: kidId,
    timestamp: new Date().toISOString(), // Actual physical time, offset applies visually
    type: type,
    message: message
  };
  state.logs.unshift(logEntry); // Add to beginning of array
  saveState();
}

// --- Date Offset Time Travel Helper ---
// Modifies the date reference globally by adding days
function getSimulatedDate() {
  const d = new Date();
  d.setDate(d.getDate() + (state.dateOffset || 0));
  return d;
}

// Calculates elapsed days between a past date string and the current simulated date
function getDaysElapsed(pastDateIsoString) {
  const past = new Date(pastDateIsoString);
  const now = getSimulatedDate();
  
  // strip time to only calculate calendar day diffs
  past.setHours(0,0,0,0);
  now.setHours(0,0,0,0);
  
  const diffTime = now - past;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

// --- Memory Decay & Score Formulas ---

// Calculate decayed rating for a subsection
// Base rating decays linear-style by subject's decay rate per day since lastUpdatedDate
function getDecayedRating(subjectName, baseRating, lastUpdatedDate, kidId) {
  if (baseRating === 0) return 0; // Starts at 0, no decay since it hasn't been learned/rated
  
  const subjConfig = getSubjectConfig(subjectName, kidId);
  const decayRate = typeof subjConfig.decayRate !== 'undefined' ? subjConfig.decayRate : DECAY_RATE;
  
  const days = getDaysElapsed(lastUpdatedDate);
  const decayed = baseRating - (days * decayRate);
  return Math.max(0, parseFloat(decayed.toFixed(2)));
}

// Calculate aggregate rating of all sub-sections in a lesson
function getLessonRating(lesson) {
  if (!lesson.subSections || lesson.subSections.length === 0) return 0;
  const sum = lesson.subSections.reduce((acc, sub) => {
    return acc + getDecayedRating(lesson.subjectName, sub.baseRating, sub.lastUpdatedDate, lesson.kidId);
  }, 0);
  return parseFloat((sum / lesson.subSections.length).toFixed(2));
}

// Calculate aggregate rating of all lessons in a subject for the current kid
function getSubjectRating(kidId, subjectName) {
  const kidLessons = state.lessons.filter(l => l.kidId === kidId && l.subjectName === subjectName);
  if (kidLessons.length === 0) return 0; // default to 0 if no lessons exist yet
  
  const sum = kidLessons.reduce((acc, lesson) => acc + getLessonRating(lesson), 0);
  return parseFloat((sum / kidLessons.length).toFixed(2));
}

// --- DOM References ---
const elKidProfileDropdown = document.getElementById('kid-profile-dropdown');
const elKidSummary = document.getElementById('kid-summary-card');
const elAccordionDashboard = document.getElementById('subject-accordion-dashboard');
const elLessonsContainer = document.getElementById('lessons-container');
const elQuizzesContainer = document.getElementById('quizzes-container');
const elMasterSubjectsList = document.getElementById('master-subjects-list');
const elLogTimeline = document.getElementById('log-timeline-container');
const elJournalSubjectFilter = document.getElementById('journal-subject-filter');
const elQuizCountBadge = document.getElementById('quiz-count-badge');

// Forms & Modals
const modalAddLesson = document.getElementById('modal-add-lesson');
const modalAddQuiz = document.getElementById('modal-add-quiz');
const modalUpdateRatings = document.getElementById('modal-update-ratings');

const formAddLesson = document.getElementById('add-lesson-form');
const formAddQuiz = document.getElementById('add-quiz-form');
const formUpdateRatings = document.getElementById('update-ratings-form');
const formAddSubject = document.getElementById('add-subject-form');

// Simulator buttons

// Active filter state for the Journal Tab
let currentJournalFilter = "All";
let editingSubjectName = null;
let editingLessonId = null;

// --- Navigation Tabs Handling ---
document.querySelectorAll('.nav-tab').forEach(tabBtn => {
  tabBtn.addEventListener('click', () => {
    document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    
    tabBtn.classList.add('active');
    const targetPaneId = tabBtn.getAttribute('data-tab');
    document.getElementById(targetPaneId).classList.add('active');

    // Special trigger re-renders on tab focus if needed
    if (targetPaneId === 'tab-log') {
      renderActivityLog();
    } else if (targetPaneId === 'tab-subjects') {
      renderMasterSubjects();
    }
  });
});

// --- Modal Utilities ---
function openModal(modalEl) {
  modalEl.classList.add('active');
}

function closeModal(modalEl) {
  modalEl.classList.remove('active');
  // If the lesson modal is closed without saving, reset it back to add-mode
  if (modalEl === modalAddLesson && editingLessonId) {
    editingLessonId = null;
    modalAddLesson.querySelector('h3').textContent = '＋ Add Lesson';
    modalAddLesson.querySelector('button[type="submit"]').textContent = 'Add Lesson';
  }
}

document.querySelectorAll('.btn-close-modal, .btn-cancel').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(btn.closest('.modal-backdrop'));
  });
});

// Close modal if clicking outside content card
document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closeModal(backdrop);
    }
  });
});

// --- Helper: Get Subject Config (color) ---
function getSubjectConfig(subjectName, kidId) {
  const targetKidId = kidId || state.currentKidId;
  const subj = state.subjects.find(s => s.kidId === targetKidId && s.name.toLowerCase() === subjectName.toLowerCase());
  return subj || { color: "#7f8c8d" };
}

// Helper: Get Badge Class based on score
function getScoreBadgeClass(score) {
  if (score < 4) return "weak";
  if (score < 7) return "medium";
  return "strong";
}

// Helper: Get Score Tag text
function getScoreStatusLabel(score) {
  if (score < 4) return "Critical Review";
  if (score < 7) return "Review Soon";
  return "Mastered";
}

// Helper: Get Score Status Icon
function getScoreStatusIcon(score, hasLessons) {
  if (!hasLessons) return "—";
  if (score < 4) return "⚠️";
  if (score < 7) return "⏳";
  return "✓";
}

// --- RENDER FUNCTIONS ---

// 1. Render Kid Selector — circular profile button + dropdown menu
function renderKidSelector() {
  const currentKid = state.kids.find(k => k.id === state.currentKidId);
  if (!currentKid) return;

  // Update the main circular avatar button
  const elInitial = document.getElementById('current-profile-initial');
  const elImg = document.getElementById('current-profile-img');
  const photo = state.kidPhotos && state.kidPhotos[currentKid.id];

  if (photo) {
    elInitial.style.display = 'none';
    elImg.src = photo;
    elImg.style.display = 'block';
  } else {
    elInitial.textContent = currentKid.name.charAt(0).toUpperCase();
    elInitial.style.display = 'block';
    elImg.style.display = 'none';
  }

  // Populate switch-profile options (other kids only)
  const elOptions = document.getElementById('switch-profile-options');
  if (!elOptions) return;
  elOptions.innerHTML = '';
  state.kids.forEach(kid => {
    const btn = document.createElement('button');
    btn.className = `menu-item menu-profile-option${kid.id === state.currentKidId ? ' active' : ''}`;
    const kidPhoto = state.kidPhotos && state.kidPhotos[kid.id];
    btn.innerHTML = `
      <span class="menu-profile-avatar">
        ${kidPhoto
          ? `<img src="${kidPhoto}" alt="${kid.name}">`
          : `<span>${kid.name.charAt(0)}</span>`}
      </span>
      <span class="menu-profile-name">${kid.name}<br><small>${kid.std}</small></span>
      ${kid.id === state.currentKidId ? '<span class="menu-check">✓</span>' : ''}
    `;
    btn.addEventListener('click', () => {
      state.currentKidId = kid.id;
      currentJournalFilter = 'All';
      saveState();
      renderAll();
      closeProfileMenu();
    });
    elOptions.appendChild(btn);
  });
}

// 2. Render Kid stats header
function renderKidStats() {
  const kid = state.kids.find(k => k.id === state.currentKidId);
  if (!kid) return;

  const kidLessons = state.lessons.filter(l => l.kidId === kid.id);
  const activeQuizzes = state.quizzes.filter(q => q.kidId === kid.id);
  
  // Calculate overall preparation index as a percentage across all kid's customized subjects
  const kidSubjects = state.subjects.filter(s => s.kidId === kid.id);
  let totalScore = 0;
  kidSubjects.forEach(subj => {
    totalScore += getSubjectRating(kid.id, subj.name);
  });
  
  const overallPercentage = kidSubjects.length > 0 ? Math.round((totalScore / (kidSubjects.length * 10)) * 100) : 0;
  
  // Find weakest subject (from subjects that have lessons)
  const uniqueSubjectsWithLessons = [...new Set(kidLessons.map(l => l.subjectName))];
  let weakestSubj = "None";
  let minScore = 11;
  uniqueSubjectsWithLessons.forEach(subjName => {
    const score = getSubjectRating(kid.id, subjName);
    if (score < minScore) {
      minScore = score;
      weakestSubj = subjName;
    }
  });

  const weakestDisplayText = weakestSubj !== 'None' ? weakestSubj : 'None yet';

  elKidSummary.innerHTML = `
    <div class="kid-summary-meta">
      <h2>${kid.name}'s Learning Board</h2>
      <p>Tracking school items for ${kid.std}</p>
    </div>
    <div class="stat-box">
      <span class="stat-label">Prep Index</span>
      <span class="stat-val">${overallPercentage}%</span>
    </div>
    <div class="stat-box">
      <span class="stat-label">Active Lessons</span>
      <span class="stat-val">${kidLessons.length}</span>
    </div>
    <div class="stat-box weakest">
      <span class="stat-label">Weakest Subject</span>
      <span class="stat-val stat-val-subject">${weakestDisplayText}</span>
    </div>
  `;
  
  // Update overall quiz count badge
  elQuizCountBadge.textContent = activeQuizzes.length;
}

// 3. Render Accordion Subject Overview Dashboard (Weakest Subject First)
// Displays an accordion dashboard at the very top of each board
function renderSubjectOverviewAccordion() {
  elAccordionDashboard.innerHTML = '';
  
  const kid = state.kids.find(k => k.id === state.currentKidId);
  if (!kid) return;

  // We gather kid's master subjects.
  const kidSubjects = state.subjects.filter(s => s.kidId === kid.id);
  // Calculate aggregate score for each subject, then sort.
  const subjectScores = kidSubjects.map(subj => {
    const score = getSubjectRating(kid.id, subj.name);
    const kidLessons = state.lessons.filter(l => l.kidId === kid.id && l.subjectName === subj.name);
    const kidQuizzes = state.quizzes.filter(q => q.kidId === kid.id && q.subjectName === subj.name);
    
    return {
      name: subj.name,
      color: subj.color,
      score: score,
      lessonCount: kidLessons.length,
      quizCount: kidQuizzes.length,
      lessons: kidLessons,
      quizzes: kidQuizzes
    };
  });

  // Sort: Least prepared subject (lowest score) first.
  // If scores are equal, subjects with lessons come before subjects with no lessons (0 score but no data).
  subjectScores.sort((a, b) => {
    if (a.lessonCount === 0 && b.lessonCount > 0) return 1; // Put empty subjects at bottom or top?
    if (b.lessonCount === 0 && a.lessonCount > 0) return -1;
    return a.score - b.score;
  });

  // Load accordion states from session/temp memory to persist expansions across updates
  if (!window.expandedAccordions) window.expandedAccordions = {};

  if (subjectScores.length === 0) {
    elAccordionDashboard.innerHTML = '<p class="card-hint">No subjects added. Add some in the "Edit Subjects" tab!</p>';
    return;
  }

  subjectScores.forEach(subj => {
    // If no lessons and no quizzes, we show a clean placeholder, but we still list it!
    const badgeClass = subj.lessonCount > 0 ? getScoreBadgeClass(subj.score) : "none";
    const statusText = subj.lessonCount > 0 ? getScoreStatusLabel(subj.score) : "No Lessons Added";
    const statusIcon = getScoreStatusIcon(subj.score, subj.lessonCount > 0);
    const barWidth = subj.lessonCount > 0 ? (subj.score * 10) : 0;
    
    const accordionItem = document.createElement('div');
    const isExpanded = window.expandedAccordions[subj.name] === true;
    accordionItem.className = `accordion-item ${isExpanded ? 'expanded' : ''}`;
    
    // Header
    const header = document.createElement('div');
    header.className = 'accordion-header';
    header.style.borderLeftColor = subj.color;
    header.innerHTML = `
      <div class="accordion-subject-info">
        <span class="accordion-subject-name">${subj.name}</span>
      </div>
      <div class="prep-score-indicator">
        <div class="prep-progress-bar-outer">
          <div class="prep-progress-bar-inner" style="width: ${barWidth}%; background-color: ${subj.color};"></div>
        </div>
        <span class="prep-score-number">${subj.lessonCount > 0 ? subj.score.toFixed(1) + '/10' : '0.0/10'}</span>
      </div>
      <span class="status-badge ${badgeClass}" title="${statusText}">${statusIcon}</span>
      <span class="accordion-chevron">▼</span>
    `;
    
    // Content Panel
    const content = document.createElement('div');
    content.className = 'accordion-content';
    if (isExpanded) {
      content.style.maxHeight = '500px';
    }
    
    // Build internal listing
    let lessonsListHtml = '';
    if (subj.lessons.length > 0) {
      // sort lessons by score ascending
      const sortedLessons = [...subj.lessons].sort((a,b) => getLessonRating(a) - getLessonRating(b));
      sortedLessons.forEach(less => {
        const rating = getLessonRating(less);
        const lClass = getScoreBadgeClass(rating);
        lessonsListHtml += `
          <div class="mini-item">
            <span class="mini-topic">${less.topicName}</span>
            <span class="mini-score-tag ${lClass}" style="background-color: ${subj.color}22; color: ${subj.color};">${rating}/10</span>
          </div>
        `;
      });
    } else {
      lessonsListHtml = `<p class="card-hint">No active daily lessons.</p>`;
    }

    let quizzesListHtml = '';
    if (subj.quizzes.length > 0) {
      subj.quizzes.forEach(q => {
        const days = calculateDaysToGo(q.date);
        let daysText = '';
        if (days < 0) daysText = `Overdue (${Math.abs(days)}d ago)`;
        else if (days === 0) daysText = "Today";
        else daysText = `${days}d left`;

        quizzesListHtml += `
          <div class="mini-item">
            <span class="mini-topic">${q.topicName}</span>
            <span class="mini-score-tag" style="background-color: #ffeef1; color: var(--brand-pink);">${daysText}</span>
          </div>
        `;
      });
    } else {
      quizzesListHtml = `<p class="card-hint">No upcoming quizzes scheduled.</p>`;
    }

    content.innerHTML = `
      <div class="accordion-inner-panel">
        <div class="accordion-breakdown">
          <div class="accordion-lessons-list">
            <h4>Lessons (${subj.lessonCount})</h4>
            <div class="accordion-mini-list">
              ${lessonsListHtml}
            </div>
          </div>
          <div class="accordion-quizzes-list">
            <h4>Quizzes (${subj.quizCount})</h4>
            <div class="accordion-mini-list">
              ${quizzesListHtml}
            </div>
          </div>
        </div>
      </div>
    `;

    // Hook click event
    header.addEventListener('click', () => {
      const expanded = accordionItem.classList.toggle('expanded');
      window.expandedAccordions[subj.name] = expanded;
      if (expanded) {
        content.style.maxHeight = '500px';
      } else {
        content.style.maxHeight = '0px';
      }
    });

    accordionItem.appendChild(header);
    accordionItem.appendChild(content);
    elAccordionDashboard.appendChild(accordionItem);
  });
}

// 4. Render Journal Page (Filterable, sorted by weakest lesson rating first)
function renderJournal() {
  elLessonsContainer.innerHTML = '';
  elJournalSubjectFilter.innerHTML = '';
  
  const kid = state.kids.find(k => k.id === state.currentKidId);
  if (!kid) return;

  const kidLessons = state.lessons.filter(l => l.kidId === kid.id);
  
  // Unique subjects for filter bar
  const activeSubjects = [...new Set(kidLessons.map(l => l.subjectName))];
  
  // Render Filter Pills
  // All Pill
  const allPill = document.createElement('div');
  allPill.className = `filter-pill ${currentJournalFilter === 'All' ? 'active' : ''}`;
  allPill.textContent = "Show All";
  allPill.addEventListener('click', () => {
    currentJournalFilter = "All";
    renderJournal();
  });
  elJournalSubjectFilter.appendChild(allPill);

  activeSubjects.forEach(subjName => {
    const pill = document.createElement('div');
    pill.className = `filter-pill ${currentJournalFilter === subjName ? 'active' : ''}`;
    pill.textContent = subjName;
    pill.addEventListener('click', () => {
      currentJournalFilter = subjName;
      renderJournal();
    });
    elJournalSubjectFilter.appendChild(pill);
  });

  // Filter lessons by subject
  let filteredLessons = kidLessons;
  if (currentJournalFilter !== "All") {
    filteredLessons = kidLessons.filter(l => l.subjectName === currentJournalFilter);
  }

  // Filter lessons by search query
  const elSearch = document.getElementById('journal-search');
  const searchQuery = elSearch ? elSearch.value.trim().toLowerCase() : '';
  if (searchQuery) {
    filteredLessons = filteredLessons.filter(l => {
      const matchTopic = l.topicName.toLowerCase().includes(searchQuery);
      const matchSub = l.subSections.some(sub => sub.name.toLowerCase().includes(searchQuery));
      return matchTopic || matchSub;
    });
  }

  // SORT lessons: Least prepared (lowest rating) first
  filteredLessons.sort((a, b) => getLessonRating(a) - getLessonRating(b));

  if (filteredLessons.length === 0) {
    elLessonsContainer.innerHTML = `
      <div class="card" style="text-align: center; padding: 40px 20px;">
        <h3 style="margin-top: 10px;">No journal entries yet</h3>
        <p class="text-muted" style="font-size: 0.9rem; margin-bottom: 20px;">Add what was learned in school today to start tracking!</p>
        <button class="btn btn-primary btn-round" id="btn-empty-add-lesson">＋ Add Lesson</button>
      </div>
    `;
    
    // Bind click to open add lesson modal
    const btnEmptyAdd = document.getElementById('btn-empty-add-lesson');
    if (btnEmptyAdd) {
      btnEmptyAdd.addEventListener('click', () => {
        populateSubjectDropdowns();
        openModal(modalAddLesson);
      });
    }
    return;
  }

  // Initialize lesson expansion tracker
  if (!window.expandedLessons) window.expandedLessons = {};

  // Draw Lesson Cards
  filteredLessons.forEach(lesson => {
    const subjConfig = getSubjectConfig(lesson.subjectName, lesson.kidId);
    const lessonRating = getLessonRating(lesson);
    const badgeClass = getScoreBadgeClass(lessonRating);
    const isLessonExpanded = window.expandedLessons[lesson.id] === true;

    const card = document.createElement('div');
    card.className = `card lesson-card ${isLessonExpanded ? 'expanded' : 'collapsed'}`;
    card.style.borderLeftColor = subjConfig.color;

    // Build sub-sections list html
    let subSectionsHtml = '';
    lesson.subSections.forEach(sub => {
      const decayedRating = getDecayedRating(lesson.subjectName, sub.baseRating, sub.lastUpdatedDate, lesson.kidId);
      const elapsedDays = getDaysElapsed(sub.lastUpdatedDate);
      const subBadgeClass = getScoreBadgeClass(decayedRating);
      
      let decayInfoHtml = '';
      if (sub.baseRating === 0) {
        decayInfoHtml = `<span class="decay-warning"> (unrated)</span>`;
      } else if (elapsedDays > 0) {
        const diff = (sub.baseRating - decayedRating).toFixed(1);
        decayInfoHtml = `<span class="decay-warning"> (decayed -${diff} over ${elapsedDays}d)</span>`;
      } else {
        decayInfoHtml = `<span class="decay-warning" style="color: var(--color-strong);"> (practiced today)</span>`;
      }

      subSectionsHtml += `
        <div class="subsection-item-row">
          <div class="subsection-label">
            <span>${sub.name}</span>
            ${decayInfoHtml}
          </div>
          <div class="subsection-rating-box">
            <input type="range" class="inline-proficiency-slider" min="0" max="10" step="1"
              value="${Math.round(decayedRating)}"
              data-lesson-id="${lesson.id}" data-sub-name="${sub.name}"
              title="Set proficiency">
            <span class="subsection-score-text inline-score-val ${subBadgeClass}">${Math.round(decayedRating)}</span>
          </div>
        </div>
      `;
    });

    const displayDate = new Date(lesson.createdDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

    card.innerHTML = `
      <div class="lesson-card-header" style="cursor: pointer; user-select: none;">
        <div>
          <h4 style="display: flex; align-items: center; gap: 8px;">
            <span class="lesson-chevron" style="font-size: 0.7rem; color: var(--text-muted); transition: transform 0.2s ease; display: inline-block; transform: ${isLessonExpanded ? 'rotate(90deg)' : 'rotate(0deg)'};">▶</span>
            ${lesson.topicName}
          </h4>
          <div class="lesson-meta-row" style="margin-top: 4px;">
            <span class="subject-badge-pill" style="background-color: ${subjConfig.color};">${lesson.subjectName}</span>
            <span class="lesson-date-badge">Added: ${displayDate}</span>
          </div>
        </div>
        <div class="lesson-overall-score">
          <div class="score-label">Avg Prep</div>
          <span class="score-val" style="color: ${subjConfig.color};">${lessonRating.toFixed(1)}</span><span class="text-muted" style="font-size: 0.8rem;">/10</span>
        </div>
      </div>
      
      <div class="lesson-card-subsections">
        ${subSectionsHtml}
      </div>

      <div class="lesson-card-actions">
        <button class="btn btn-secondary btn-sm btn-round-sm btn-icon-only btn-edit-lesson" data-id="${lesson.id}" title="Edit Lesson Title / Subject">✏️</button>
        <button class="btn btn-secondary btn-sm btn-round-sm btn-icon-only btn-update-ratings" data-id="${lesson.id}" title="Update Ratings">📝</button>
        <button class="btn btn-secondary btn-sm btn-round-sm btn-icon-only btn-exam-complete" style="background-color: #d1f7ec; color: #0fb9b1; border-color: #a5f3df;" data-id="${lesson.id}" title="Exam Complete">✅</button>
        <button class="btn btn-danger btn-sm btn-round-sm btn-icon-only btn-delete-lesson" data-id="${lesson.id}" title="Delete Lesson">🗑️</button>
      </div>
    `;

    // Hook card expansion toggle on header click
    card.querySelector('.lesson-card-header').addEventListener('click', () => {
      window.expandedLessons[lesson.id] = !window.expandedLessons[lesson.id];
      renderJournal();
    });

    // Hook edit lesson button (title/subject)
    card.querySelector('.btn-edit-lesson').addEventListener('click', () => {
      openEditLessonModal(lesson.id);
    });

    // Hook update ratings button
    card.querySelector('.btn-update-ratings').addEventListener('click', () => {
      openUpdateRatingsModal(lesson.id);
    });

    // Hook exam complete button
    card.querySelector('.btn-exam-complete').addEventListener('click', () => {
      if (confirm(`Exam completed! 🥳 Are you sure you want to remove '${lesson.topicName}' from the board? A kid won't have to revisit this lesson.`)) {
        completeLesson(lesson.id);
      }
    });

    // Hook delete button
    card.querySelector('.btn-delete-lesson').addEventListener('click', () => {
      if (confirm(`Are you sure you want to delete '${lesson.topicName}'? Use this if it was a wrong entry.`)) {
        deleteLesson(lesson.id);
      }
    });

    // Hook inline proficiency sliders
    card.querySelectorAll('.inline-proficiency-slider').forEach(slider => {
      const scoreEl = slider.nextElementSibling;
      slider.addEventListener('input', () => {
        const val = parseInt(slider.value);
        scoreEl.textContent = val;
        scoreEl.className = 'subsection-score-text inline-score-val ' + getScoreBadgeClass(val);
      });
      slider.addEventListener('change', () => {
        const lessonId = slider.getAttribute('data-lesson-id');
        const subName = slider.getAttribute('data-sub-name');
        const val = parseInt(slider.value);
        setSubsectionRating(lessonId, subName, val);
      });
    });

    elLessonsContainer.appendChild(card);
  });
}

// Helper: Calculate days until quiz
function calculateDaysToGo(quizDateStr) {
  const quizDate = new Date(quizDateStr);
  const now = getSimulatedDate();
  
  // strip time
  quizDate.setHours(0,0,0,0);
  now.setHours(0,0,0,0);
  
  const diffTime = quizDate - now;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// 5. Render Quizzes
function renderQuizzes() {
  const elListContainer = document.getElementById('quizzes-container');
  const elCalendarContainer = document.getElementById('quizzes-calendar-container');
  const btnToggle = document.getElementById('btn-quiz-view-toggle');
  
  if (state.quizView === 'calendar') {
    elListContainer.style.display = 'none';
    elCalendarContainer.style.display = 'block';
    if (btnToggle) btnToggle.textContent = 'List View';
    renderQuizCalendar(elCalendarContainer);
    return;
  }
  
  elListContainer.style.display = 'grid';
  elCalendarContainer.style.display = 'none';
  if (btnToggle) btnToggle.textContent = 'Calendar View';
  
  elQuizzesContainer.innerHTML = '';
  
  const kid = state.kids.find(k => k.id === state.currentKidId);
  if (!kid) return;

  const kidQuizzes = state.quizzes.filter(q => q.kidId === kid.id);

  // Sort quizzes: Soonest first (ascending days remaining)
  kidQuizzes.sort((a,b) => calculateDaysToGo(a.date) - calculateDaysToGo(b.date));

  if (kidQuizzes.length === 0) {
    elQuizzesContainer.innerHTML = `
      <div class="card" style="text-align: center; padding: 40px 20px; grid-column: 1 / -1;">
        <h3 style="margin-top: 10px;">No upcoming quizzes</h3>
        <p class="text-muted" style="font-size: 0.9rem;">Add tests or quizzes to display countdown timers!</p>
      </div>
    `;
    return;
  }

  kidQuizzes.forEach(quiz => {
    const subjConfig = getSubjectConfig(quiz.subjectName, quiz.kidId);
    const daysToGo = calculateDaysToGo(quiz.date);
    
    let daysBadgeClass = 'later';
    let daysLabel = '';
    
    if (daysToGo < 0) {
      daysBadgeClass = 'urgent';
      daysLabel = `Overdue (${Math.abs(daysToGo)}d ago)`;
    } else if (daysToGo === 0) {
      daysBadgeClass = 'urgent';
      daysLabel = 'Today';
    } else if (daysToGo === 1) {
      daysBadgeClass = 'urgent';
      daysLabel = 'Tomorrow';
    } else if (daysToGo <= 4) {
      daysBadgeClass = 'soon';
      daysLabel = `${daysToGo} days to go`;
    } else {
      daysBadgeClass = 'later';
      daysLabel = `${daysToGo} days to go`;
    }

    const card = document.createElement('div');
    card.className = 'card quiz-card';
    card.style.borderTopColor = subjConfig.color;

    const quizDateObj = new Date(quiz.date + 'T00:00:00'); // enforce local timezone representation
    const formattedDate = quizDateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

    card.innerHTML = `
      <div>
        <div class="quiz-header">
          <span class="subject-badge-pill quiz-subject-tag" style="background-color: ${subjConfig.color};">${quiz.subjectName}</span>
        </div>
        <h4 class="quiz-topic">${quiz.topicName}</h4>
        <div class="quiz-date-row">
          <span>Date: <strong>${formattedDate}</strong></span>
        </div>
      </div>
      
      <div class="quiz-footer">
        <span class="days-left-badge ${daysBadgeClass}">${daysLabel}</span>
        <button class="btn btn-secondary btn-sm btn-round-sm btn-icon-only btn-delete-quiz" data-id="${quiz.id}" title="Delete Quiz">🗑️</button>
      </div>
    `;

    card.querySelector('.btn-delete-quiz').addEventListener('click', () => {
      deleteQuiz(quiz.id);
    });

    elQuizzesContainer.appendChild(card);
  });
}

// Render Monthly Quiz Calendar
function renderQuizCalendar(container) {
  if (typeof window.calendarMonth === 'undefined') {
    const simDate = getSimulatedDate();
    window.calendarMonth = simDate.getMonth();
    window.calendarYear = simDate.getFullYear();
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  container.innerHTML = `
    <div class="calendar-container">
      <div class="calendar-header">
        <button class="btn btn-secondary btn-sm btn-icon-only" id="btn-cal-prev" style="width:28px; height:28px;">&lt;</button>
        <h4 style="margin: 0;">${monthNames[window.calendarMonth]} ${window.calendarYear}</h4>
        <button class="btn btn-secondary btn-sm btn-icon-only" id="btn-cal-next" style="width:28px; height:28px;">&gt;</button>
      </div>
      <div class="calendar-grid">
        <div class="calendar-day-header">Sun</div>
        <div class="calendar-day-header">Mon</div>
        <div class="calendar-day-header">Tue</div>
        <div class="calendar-day-header">Wed</div>
        <div class="calendar-day-header">Thu</div>
        <div class="calendar-day-header">Fri</div>
        <div class="calendar-day-header">Sat</div>
      </div>
    </div>
  `;

  document.getElementById('btn-cal-prev').addEventListener('click', () => {
    window.calendarMonth--;
    if (window.calendarMonth < 0) {
      window.calendarMonth = 11;
      window.calendarYear--;
    }
    renderQuizzes();
  });
  
  document.getElementById('btn-cal-next').addEventListener('click', () => {
    window.calendarMonth++;
    if (window.calendarMonth > 11) {
      window.calendarMonth = 0;
      window.calendarYear++;
    }
    renderQuizzes();
  });

  const grid = container.querySelector('.calendar-grid');
  const firstDay = new Date(window.calendarYear, window.calendarMonth, 1).getDay();
  const totalDays = new Date(window.calendarYear, window.calendarMonth + 1, 0).getDate();

  // Empty cells
  for (let i = 0; i < firstDay; i++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day empty';
    grid.appendChild(cell);
  }

  const kid = state.kids.find(k => k.id === state.currentKidId);
  const kidQuizzes = state.quizzes.filter(q => q.kidId === kid.id);
  const simToday = getSimulatedDate();

  // Days cells
  for (let day = 1; day <= totalDays; day++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day';

    if (day === simToday.getDate() && window.calendarMonth === simToday.getMonth() && window.calendarYear === simToday.getFullYear()) {
      cell.classList.add('today');
    }

    cell.innerHTML = `<span class="calendar-day-number">${day}</span>`;

    const cellDateStr = `${window.calendarYear}-${String(window.calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayQuizzes = kidQuizzes.filter(q => q.date === cellDateStr);

    if (dayQuizzes.length > 0) {
      const dotsContainer = document.createElement('div');
      dotsContainer.className = 'calendar-dots-container';

      dayQuizzes.forEach(quiz => {
        const subjConfig = getSubjectConfig(quiz.subjectName, quiz.kidId);
        const dot = document.createElement('span');
        dot.className = 'quiz-dot';
        dot.style.backgroundColor = subjConfig.color;
        dot.title = `${quiz.subjectName}: ${quiz.topicName}`;

        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm(`Scheduled Quiz details:\nSubject: ${quiz.subjectName}\nTopic: ${quiz.topicName}\nDate: ${quiz.date}\n\nDo you want to delete this quiz?`)) {
            deleteQuiz(quiz.id);
          }
        });
        dotsContainer.appendChild(dot);
      });
      cell.appendChild(dotsContainer);
    }

    grid.appendChild(cell);
  }
}

// 6. Render Master Subjects editor
function renderMasterSubjects() {
  elMasterSubjectsList.innerHTML = '';
  
  const kidSubjects = state.subjects.filter(s => s.kidId === state.currentKidId);
  kidSubjects.forEach(subj => {
    const row = document.createElement('div');
    row.className = 'subject-item-row';
    row.innerHTML = `
      <div class="subj-details">
        <span>${subj.name}</span>
        <span style="display:inline-block; width: 14px; height: 14px; border-radius: 50%; background-color: ${subj.color};"></span>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="btn btn-secondary btn-sm btn-round-sm btn-icon-only btn-edit-subject" data-name="${subj.name}" title="Edit Subject">✏️</button>
        <button class="btn btn-danger btn-sm btn-round-sm btn-icon-only btn-delete-subject" data-name="${subj.name}" title="Delete Subject">🗑️</button>
      </div>
    `;
    
    row.querySelector('.btn-edit-subject').addEventListener('click', () => {
      startEditSubject(subj.name);
    });
    
    row.querySelector('.btn-delete-subject').addEventListener('click', () => {
      if (confirm(`Are you sure you want to remove '${subj.name}' from the Master List? You will no longer be able to select it for new lessons.`)) {
        deleteSubject(subj.name);
      }
    });

    elMasterSubjectsList.appendChild(row);
  });
}

// Start editing a subject
function startEditSubject(subjName) {
  const subj = state.subjects.find(s => s.kidId === state.currentKidId && s.name === subjName);
  if (!subj) return;

  editingSubjectName = subjName;

  document.getElementById('subject-form-title').textContent = `Edit Subject: ${subj.name}`;
  document.getElementById('new-subject-name').value = subj.name;
  document.getElementById('new-subject-name').disabled = false; // Allow name editing

  // Select matching color swatch
  const colorRadio = formAddSubject.querySelector(`input[name="subj-color"][value="${subj.color}"]`);
  if (colorRadio) colorRadio.checked = true;

  document.getElementById('new-subject-decay').value = subj.decayRate || 0.5;
  document.getElementById('decay-rate-bubble').textContent = subj.decayRate || 0.5;

  document.getElementById('btn-submit-subject').textContent = 'Save Changes';
  document.getElementById('btn-cancel-subject-edit').style.display = 'inline-block';
}

// Cancel subject editing
function cancelEditSubject() {
  editingSubjectName = null;
  document.getElementById('subject-form-title').textContent = 'Add New Subject';
  document.getElementById('new-subject-name').value = '';
  document.getElementById('new-subject-name').disabled = false;
  
  const defaultRadio = formAddSubject.querySelector('input[name="subj-color"]');
  if (defaultRadio) defaultRadio.checked = true;
  
  document.getElementById('btn-submit-subject').textContent = 'Add Subject';
  document.getElementById('btn-cancel-subject-edit').style.display = 'none';
}

// 7. Render Activity Log
function renderActivityLog() {
  elLogTimeline.innerHTML = '';
  
  const kid = state.kids.find(k => k.id === state.currentKidId);
  if (!kid) return;

  const kidLogs = state.logs.filter(l => l.kidId === kid.id);

  if (kidLogs.length === 0) {
    elLogTimeline.innerHTML = '<p class="card-hint" style="padding: 10px;">Activity log is empty.</p>';
    return;
  }

  kidLogs.forEach(log => {
    const item = document.createElement('div');
    item.className = 'log-item';
    
    // Choose icon based on log type
    let icon = "📝";
    if (log.type === "lesson") icon = "📚";
    else if (log.type === "rating") icon = "🎯";
    else if (log.type === "quiz") icon = "📅";
    else if (log.type === "delete") icon = "🗑️";
    else if (log.type === "subject") icon = "🎨";

    const localTime = new Date(log.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    const localDate = new Date(log.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

    item.innerHTML = `
      <span class="log-item-icon">${icon}</span>
      <div class="log-time">${localDate} at ${localTime}</div>
      <div class="log-msg">${log.message}</div>
    `;
    elLogTimeline.appendChild(item);
  });
}

// --- APP WRITE ACTIONS (CRUD) ---

// Populate Dropdowns for Subject Picker in Modals
function populateSubjectDropdowns() {
  const lessonSubjSelect = document.getElementById('lesson-subject');
  const quizSubjSelect = document.getElementById('quiz-subject');
  
  let optionsHtml = '<option value="" disabled selected>Select Subject...</option>';
  const kidSubjects = state.subjects.filter(s => s.kidId === state.currentKidId);
  kidSubjects.forEach(subj => {
    optionsHtml += `<option value="${subj.name}">${subj.name}</option>`;
  });
  
  lessonSubjSelect.innerHTML = optionsHtml;
  quizSubjSelect.innerHTML = optionsHtml;
}

// Complete Lesson (Exam Complete)
function completeLesson(lessonId) {
  const lesson = state.lessons.find(l => l.id === lessonId);
  if (!lesson) return;

  state.lessons = state.lessons.filter(l => l.id !== lessonId);
  logActivity(state.currentKidId, "delete", `Lesson '${lesson.topicName}' removed from ${lesson.subjectName} (Exam complete)`);
  saveState();
  renderAll();
}

// Delete Lesson (Wrong Entry)
function deleteLesson(lessonId) {
  const lesson = state.lessons.find(l => l.id === lessonId);
  if (!lesson) return;

  state.lessons = state.lessons.filter(l => l.id !== lessonId);
  logActivity(state.currentKidId, "delete", `Deleted lesson '${lesson.topicName}' from ${lesson.subjectName} (correction/cleanup).`);
  saveState();
  renderAll();
}

// Delete Quiz
function deleteQuiz(quizId) {
  const quiz = state.quizzes.find(q => q.id === quizId);
  if (!quiz) return;

  state.quizzes = state.quizzes.filter(q => q.id !== quizId);
  logActivity(state.currentKidId, "quiz", `Quiz '${quiz.topicName}' in ${quiz.subjectName} completed/removed.`);
  saveState();
  renderAll();
}

// Set subsection rating directly (from inline slider)
function setSubsectionRating(lessonId, subName, newVal) {
  const lesson = state.lessons.find(l => l.id === lessonId);
  if (!lesson) return;
  const sub = lesson.subSections.find(s => s.name === subName);
  if (!sub) return;

  sub.baseRating = newVal;
  sub.lastUpdatedDate = new Date().toISOString();

  logActivity(
    state.currentKidId,
    "rating",
    `${sub.name} under ${lesson.topicName} set to ${newVal}/10`
  );

  saveState();
  renderAll();
}

// Add Master Subject
function addSubject(name, color, decayRate) {
  // Check if exists for the current kid
  if (state.subjects.some(s => s.kidId === state.currentKidId && s.name.toLowerCase() === name.toLowerCase())) {
    alert("Subject already exists!");
    return;
  }

  state.subjects.push({ kidId: state.currentKidId, name, color, decayRate: decayRate || 0.5 });
  logActivity(state.currentKidId, "subject", `Subject '${name}' added.`);
  saveState();
  renderMasterSubjects();
  populateSubjectDropdowns();
}

// Delete Master Subject
function deleteSubject(name) {
  state.subjects = state.subjects.filter(s => !(s.kidId === state.currentKidId && s.name === name));
  logActivity(state.currentKidId, "subject", `Subject '${name}' deleted.`);
  saveState();
  renderMasterSubjects();
  populateSubjectDropdowns();
}

// Open and populate the Update Ratings Modal
function openUpdateRatingsModal(lessonId) {
  const lesson = state.lessons.find(l => l.id === lessonId);
  if (!lesson) return;

  const subjConfig = getSubjectConfig(lesson.subjectName, lesson.kidId);
  
  document.getElementById('rating-modal-lesson-id').value = lesson.id;
  
  const elSubjectBadge = document.getElementById('rating-modal-subject');
  elSubjectBadge.textContent = lesson.subjectName;
  elSubjectBadge.style.backgroundColor = subjConfig.color;
  
  document.getElementById('rating-modal-lesson-title').textContent = lesson.topicName;

  const slidersList = document.getElementById('rating-sliders-list');
  slidersList.innerHTML = '';

  lesson.subSections.forEach((sub, index) => {
    const decayedVal = getDecayedRating(lesson.subjectName, sub.baseRating, sub.lastUpdatedDate, lesson.kidId);
    const days = getDaysElapsed(sub.lastUpdatedDate);
    const badgeClass = getScoreBadgeClass(decayedVal);
    
    const sliderRow = document.createElement('div');
    sliderRow.className = 'rating-slider-row';
    sliderRow.setAttribute('data-original-name', sub.name);
    
    let decaySubtitle = '';
    if (sub.baseRating === 0) {
      decaySubtitle = `New Subsection (Unrated)`;
    } else {
      decaySubtitle = `Base: ${sub.baseRating}/10 • Last rated: ${days} days ago`;
    }

    sliderRow.innerHTML = `
      <div class="rating-slider-meta" style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
        <input type="text" class="rating-slider-name-input" value="${sub.name}" placeholder="Subsection Name" required style="flex: 1; padding: 4px 8px; font-size: 0.85rem; font-weight: 600;">
        <button type="button" class="btn btn-danger btn-sm btn-icon-only btn-modal-delete-sub" title="Delete Subsection" style="width: 24px; height: 24px;">🗑️</button>
      </div>
      <div class="rating-slider-decay-info" style="font-size: 0.75rem; color: var(--text-muted); font-style: italic; margin-bottom: 6px;">${decaySubtitle}</div>
      <div class="slider-input-group">
        <input type="range" class="rating-slider-input" min="0" max="10" step="1" value="${Math.round(decayedVal)}">
        <span class="slider-bubble-val ${badgeClass}">${Math.round(decayedVal)}</span>
      </div>
    `;

    // Hook delete button click
    sliderRow.querySelector('.btn-modal-delete-sub').addEventListener('click', () => {
      sliderRow.remove();
    });

    // Dynamic slider value rendering on slide
    const slider = sliderRow.querySelector('.rating-slider-input');
    const bubble = sliderRow.querySelector('.slider-bubble-val');
    
    slider.addEventListener('input', () => {
      const val = parseInt(slider.value);
      bubble.textContent = val;
      bubble.className = 'slider-bubble-val ' + getScoreBadgeClass(val);
    });

    slidersList.appendChild(sliderRow);
  });

  openModal(modalUpdateRatings);
}

// --- EVENT BINDINGS FOR FORMS & MODALS ---

// Opening Modals
document.getElementById('btn-open-add-lesson').addEventListener('click', () => {
  populateSubjectDropdowns();
  openModal(modalAddLesson);
});

document.getElementById('btn-open-add-quiz').addEventListener('click', () => {
  populateSubjectDropdowns();
  openModal(modalAddQuiz);
});

// Dynamic inputs row management for Add Lesson Modal
const subsectionContainer = document.getElementById('lesson-subsections-list');
document.getElementById('btn-add-subsection-field').addEventListener('click', () => {
  const row = document.createElement('div');
  row.className = 'subsection-input-row';
  row.innerHTML = `
    <input type="text" class="subsection-name-input" placeholder="e.g. Map Marking">
    <button type="button" class="btn-remove-row">&times;</button>
  `;
  
  // hook delete row button
  row.querySelector('.btn-remove-row').addEventListener('click', () => {
    row.remove();
  });

  subsectionContainer.appendChild(row);
});

// Open the Add Lesson modal pre-populated for editing an existing lesson
function openEditLessonModal(lessonId) {
  const lesson = state.lessons.find(l => l.id === lessonId);
  if (!lesson) return;

  editingLessonId = lessonId;

  // Update modal heading and submit button
  modalAddLesson.querySelector('h3').textContent = '✏️ Edit Lesson';
  modalAddLesson.querySelector('button[type="submit"]').textContent = 'Save Changes';

  // Pre-fill subject
  populateSubjectDropdowns();
  const subjSelect = document.getElementById('lesson-subject');
  subjSelect.value = lesson.subjectName;

  // Pre-fill topic
  document.getElementById('lesson-topic').value = lesson.topicName;

  // Pre-fill subsections
  const subsectionContainer = document.getElementById('lesson-subsections-list');
  subsectionContainer.innerHTML = '';
  lesson.subSections.forEach((sub, idx) => {
    const row = document.createElement('div');
    row.className = 'subsection-input-row';
    row.innerHTML = `
      <input type="text" class="subsection-name-input" value="${sub.name}" placeholder="e.g. Meanings">
      <button type="button" class="btn-remove-row" style="${idx === 0 ? 'display:none;' : ''}">×</button>
    `;
    row.querySelector('.btn-remove-row').addEventListener('click', () => row.remove());
    subsectionContainer.appendChild(row);
  });

  openModal(modalAddLesson);
}


formAddLesson.addEventListener('submit', (e) => {
  e.preventDefault();

  const subjName = document.getElementById('lesson-subject').value;
  const topic = document.getElementById('lesson-topic').value.trim();

  // Read dynamic subsections
  const subinputs = subsectionContainer.querySelectorAll('.subsection-name-input');
  const subSections = [];
  subinputs.forEach(input => {
    if (input.value.trim() !== '') {
      subSections.push({
        name: input.value.trim(),
        baseRating: 0,
        lastUpdatedDate: new Date().toISOString()
      });
    }
  });

  if (subSections.length === 0) {
    subSections.push({ name: 'General', baseRating: 0, lastUpdatedDate: new Date().toISOString() });
  }

  if (editingLessonId) {
    // --- EDIT MODE: update existing lesson, preserve existing ratings ---
    const lesson = state.lessons.find(l => l.id === editingLessonId);
    if (lesson) {
      const oldTopic = lesson.topicName;
      // Build a map of old subsection ratings by name so we can preserve them
      const ratingMap = {};
      lesson.subSections.forEach(s => { ratingMap[s.name] = s; });

      lesson.subjectName = subjName;
      lesson.topicName = topic;
      lesson.subSections = subSections.map(s => ratingMap[s.name]
        ? { ...ratingMap[s.name], name: s.name }   // preserve existing ratings
        : s                                          // new subsection, start at 0
      );

      logActivity(state.currentKidId, 'lesson', `Lesson '${oldTopic}' edited to '${topic}' under ${subjName}.`);
      saveState();
    }
    editingLessonId = null;
  } else {
    // --- ADD MODE: create new lesson ---
    const newLesson = {
      id: 'less-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      kidId: state.currentKidId,
      subjectName: subjName,
      topicName: topic,
      createdDate: new Date().toISOString(),
      subSections: subSections
    };
    state.lessons.push(newLesson);
    logActivity(state.currentKidId, 'lesson', `Lesson '${topic}' added to ${subjName} with ${subSections.length} sub-sections (Initial ratings: 0/10).`);
    saveState();
  }

  closeModal(modalAddLesson);

  // Reset modal back to add-mode defaults
  formAddLesson.reset();
  modalAddLesson.querySelector('h3').textContent = '＋ Add Lesson';
  modalAddLesson.querySelector('button[type="submit"]').textContent = 'Add Lesson';
  subsectionContainer.innerHTML = `
    <div class="subsection-input-row">
      <input type="text" class="subsection-name-input" placeholder="e.g. Meanings">
      <button type="button" class="btn-remove-row" style="display:none;">&times;</button>
    </div>
  `;

  renderAll();
});


// Form Submission: Add Quiz
formAddQuiz.addEventListener('submit', (e) => {
  e.preventDefault();

  const subjName = document.getElementById('quiz-subject').value;
  const topic = document.getElementById('quiz-topic').value;
  const quizDate = document.getElementById('quiz-date').value;

  const newQuiz = {
    id: 'q-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
    kidId: state.currentKidId,
    subjectName: subjName,
    topicName: topic,
    date: quizDate
  };

  state.quizzes.push(newQuiz);
  
  const daysToGo = calculateDaysToGo(quizDate);
  logActivity(state.currentKidId, "quiz", `Scheduled new quiz for '${topic}' in ${subjName} on ${new Date(quizDate + 'T00:00:00').toLocaleDateString()} (${daysToGo} days to go).`);
  
  saveState();
  closeModal(modalAddQuiz);
  formAddQuiz.reset();
  renderAll();
});

// Form Submission: Update Ratings (Sliders & Subsection Structural Edits)
formUpdateRatings.addEventListener('submit', (e) => {
  e.preventDefault();

  const lessonId = document.getElementById('rating-modal-lesson-id').value;
  const lesson = state.lessons.find(l => l.id === lessonId);
  if (!lesson) return;

  const sliderRows = document.getElementById('rating-sliders-list').querySelectorAll('.rating-slider-row');
  const newSubSections = [];

  sliderRows.forEach(row => {
    const originalName = row.getAttribute('data-original-name');
    const inputName = row.querySelector('.rating-slider-name-input').value.trim();
    const inputVal = parseInt(row.querySelector('.rating-slider-input').value);

    if (inputName === '') return;

    // Check if it matched an old subsection
    const oldSub = lesson.subSections.find(s => s.name === originalName);

    if (oldSub) {
      const oldDecayed = getDecayedRating(lesson.subjectName, oldSub.baseRating, oldSub.lastUpdatedDate, lesson.kidId);
      // If rating value is different, or if name changed, update
      if (Math.round(oldDecayed) !== inputVal || oldSub.name !== inputName) {
        oldSub.baseRating = inputVal;
        oldSub.lastUpdatedDate = new Date().toISOString();
        logActivity(
          state.currentKidId, 
          "rating", 
          `Learned ${inputName} under ${lesson.topicName} proficiency increased to ${inputVal}/10`
        );
      }
      oldSub.name = inputName; // apply name change
      newSubSections.push(oldSub);
    } else {
      // New subsection added
      newSubSections.push({
        name: inputName,
        baseRating: inputVal,
        lastUpdatedDate: new Date().toISOString()
      });
      logActivity(
        state.currentKidId, 
        "rating", 
        `Learned ${inputName} under ${lesson.topicName} proficiency increased to ${inputVal}/10`
      );
    }
  });

  if (newSubSections.length === 0) {
    alert("Please keep at least one sub-section!");
    return;
  }

  lesson.subSections = newSubSections;
  saveState();
  closeModal(modalUpdateRatings);
  renderAll();
});

// Form Submission: Add/Edit Master Subject
formAddSubject.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInput = document.getElementById('new-subject-name');
  const name = nameInput.value.trim();
  const colorRadio = formAddSubject.querySelector('input[name="subj-color"]:checked');
  const color = colorRadio ? colorRadio.value : '#ff6b6b';
  const decayRate = parseFloat(document.getElementById('new-subject-decay').value);

  if (!name) {
    alert('Please enter a subject name.');
    nameInput.focus();
    return;
  }

  if (editingSubjectName) {
    // --- EDIT MODE ---
    const subj = state.subjects.find(s => s.kidId === state.currentKidId && s.name === editingSubjectName);
    if (subj) {
      const oldName = editingSubjectName;
      const newName = name;

      // Check name conflict (only if the name actually changed)
      if (newName !== oldName && state.subjects.some(s => s.kidId === state.currentKidId && s.name.toLowerCase() === newName.toLowerCase())) {
        alert('A subject with that name already exists.');
        return;
      }

      // Update subject record
      subj.name = newName;
      subj.color = color;
      subj.decayRate = decayRate;

      // Cascade rename to all lessons for this kid
      state.lessons.forEach(l => {
        if (l.kidId === state.currentKidId && l.subjectName === oldName) {
          l.subjectName = newName;
        }
      });

      logActivity(state.currentKidId, 'subject', `Subject '${oldName}' renamed to '${newName}' and updated.`);
      saveState();
      cancelEditSubject();
      renderAll();
      populateSubjectDropdowns();
    }
  } else {
    // --- ADD MODE ---
    addSubject(name, color, decayRate);
    formAddSubject.reset();
    // Re-check first swatch after reset
    const firstRadio = formAddSubject.querySelector('input[name="subj-color"]');
    if (firstRadio) firstRadio.checked = true;
    document.getElementById('decay-rate-bubble').textContent = '0.5';
    renderAll();
  }
});

// Hook cancel button for subject editing
document.getElementById('btn-cancel-subject-edit').addEventListener('click', () => {
  cancelEditSubject();
});

// Clear Logs
document.getElementById('btn-clear-logs').addEventListener('click', () => {
  if (confirm("Are you sure you want to clear the Activity Log for this kid?")) {
    state.logs = state.logs.filter(l => l.kidId !== state.currentKidId);
    saveState();
    renderActivityLog();
  }
});

// --- PROFILE MENU (circular avatar + dropdown) ---

function openProfileMenu() {
  document.getElementById('profile-dropdown-menu').classList.add('open');
}

function closeProfileMenu() {
  document.getElementById('profile-dropdown-menu').classList.remove('open');
}

// Toggle dropdown on avatar button click
const elAvatarBtn = document.getElementById('current-profile-avatar-btn');
if (elAvatarBtn) {
  elAvatarBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const menu = document.getElementById('profile-dropdown-menu');
    menu.classList.toggle('open');
  });
}

// Close menu on outside click
document.addEventListener('click', (e) => {
  const container = document.getElementById('profile-menu-container');
  if (container && !container.contains(e.target)) {
    closeProfileMenu();
  }
});

// Shared helper: reads a File object and saves it as the current kid's photo
function handlePhotoFile(file, inputEl) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    if (!state.kidPhotos) state.kidPhotos = {};
    state.kidPhotos[state.currentKidId] = ev.target.result;
    saveState();
    renderKidSelector();
  };
  reader.readAsDataURL(file);
  if (inputEl) inputEl.value = ''; // reset so same file/photo can be re-used
}

// "Choose from Library" — standard gallery/file picker
const elUpdatePhoto = document.getElementById('btn-menu-update-photo');
const elPhotoUploader = document.getElementById('profile-photo-uploader');
if (elUpdatePhoto && elPhotoUploader) {
  elUpdatePhoto.addEventListener('click', () => {
    closeProfileMenu();
    elPhotoUploader.click();
  });
  elPhotoUploader.addEventListener('change', (e) => {
    handlePhotoFile(e.target.files[0], elPhotoUploader);
  });
}

// "Take Photo" — opens the front-facing camera on mobile (capture="user")
const elTakePhoto = document.getElementById('btn-menu-take-photo');
const elCameraCapture = document.getElementById('profile-camera-capture');
if (elTakePhoto && elCameraCapture) {
  elTakePhoto.addEventListener('click', () => {
    closeProfileMenu();
    elCameraCapture.click();
  });
  elCameraCapture.addEventListener('change', (e) => {
    handlePhotoFile(e.target.files[0], elCameraCapture);
  });
}

// --- Password Lock Authentication ---
const AUTH_PASS = "farmhouse@2026";
const AUTH_STORAGE_KEY = "toprank_auth_success";

function checkAuthentication() {
  const isUnlocked = localStorage.getItem(AUTH_STORAGE_KEY) === "true";
  const elLockScreen = document.getElementById('lock-screen');
  
  if (isUnlocked) {
    if (elLockScreen) elLockScreen.classList.add('hidden');
  } else {
    if (elLockScreen) elLockScreen.classList.remove('hidden');
  }
}

// Bind lock form submission
const elLockForm = document.getElementById('lock-form');
if (elLockForm) {
  elLockForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const passwordInput = document.getElementById('lock-password');
    const errorMsg = document.getElementById('lock-error');
    
    if (passwordInput.value === AUTH_PASS) {
      localStorage.setItem(AUTH_STORAGE_KEY, "true");
      checkAuthentication();
      passwordInput.value = ''; // Clear password field
      if (errorMsg) errorMsg.style.display = 'none';
    } else {
      if (errorMsg) errorMsg.style.display = 'block';
      passwordInput.value = ''; // Reset input field
    }
  });
}

// Password show/hide toggle
const btnToggleLockPass = document.getElementById('btn-toggle-lock-password');
const lockPassInput = document.getElementById('lock-password');
if (btnToggleLockPass && lockPassInput) {
  btnToggleLockPass.addEventListener('click', () => {
    const type = lockPassInput.getAttribute('type') === 'password' ? 'text' : 'password';
    lockPassInput.setAttribute('type', type);
    btnToggleLockPass.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
  });
}

// Lock/Logout menu action
const btnMenuLock = document.getElementById('btn-menu-lock');
if (btnMenuLock) {
  btnMenuLock.addEventListener('click', () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    closeProfileMenu();
    checkAuthentication();
  });
}


// --- PREP INDEX CHART ---

// Reconstruct PREP index for a kid on a given date string (YYYY-MM-DD)
// by reversing/applying decay from each subsection's current baseRating.
function computeHistoricalPrep(kidId, dateStr) {
  const target = new Date(dateStr + 'T12:00:00');
  const kidSubjects = state.subjects.filter(s => s.kidId === kidId);
  if (kidSubjects.length === 0) return null;

  let totalScore = 0;
  let subjectCount = 0;

  kidSubjects.forEach(subj => {
    const lessons = state.lessons.filter(l =>
      l.kidId === kidId &&
      l.subjectName === subj.name &&
      new Date(l.createdDate) <= target
    );
    if (lessons.length === 0) return;

    let subjTotal = 0, subsCount = 0;
    const decayRate = subj.decayRate || DECAY_RATE;

    lessons.forEach(lesson => {
      lesson.subSections.forEach(sub => {
        const lastUpdated = new Date(sub.lastUpdatedDate);
        const diffDays = (target - lastUpdated) / (1000 * 60 * 60 * 24);
        let rating;
        if (diffDays >= 0) {
          // Target is after last update: decay has happened since then
          rating = Math.max(0, sub.baseRating - diffDays * decayRate);
        } else {
          // Target is before last update: reverse the decay to recover past rating
          rating = Math.min(10, sub.baseRating + Math.abs(diffDays) * decayRate);
        }
        subjTotal += rating;
        subsCount++;
      });
    });

    if (subsCount > 0) {
      totalScore += subjTotal / subsCount;
      subjectCount++;
    }
  });

  if (subjectCount === 0) return null;
  return Math.round((totalScore / (subjectCount * 10)) * 100);
}

function renderPrepChart() {
  const container = document.getElementById('prep-chart-container');
  if (!container) return;

  const kid = state.kids.find(k => k.id === state.currentKidId);
  if (!kid) return;

  // Collect unique dates from activity logs + stored prepHistory
  const dateSet = new Set();

  (state.logs || []).forEach(log => {
    if (log.kidId === kid.id) dateSet.add(log.timestamp.slice(0, 10));
  });
  const stored = (state.prepHistory && state.prepHistory[kid.id]) || {};
  Object.keys(stored).forEach(d => dateSet.add(d));
  // Always include today
  dateSet.add(new Date().toISOString().slice(0, 10));

  // Compute PREP for each date
  const entries = Array.from(dateSet)
    .sort()
    .map(date => [date, computeHistoricalPrep(kid.id, date)])
    .filter(([, v]) => v !== null);

  if (entries.length === 0) {
    container.innerHTML = `<p class="card-hint" style="padding:12px 0; text-align:center; color:var(--text-muted); font-size:0.85rem;">No data yet. Set proficiency scores to see the PREP index.</p>`;
    return;
  }

  const W = 600, H = 160, PL = 36, PR = 12, PT = 12, PB = 28;
  const iW = W - PL - PR, iH = H - PT - PB;

  // Fixed 0–100 scale so changes are always visually apparent
  const minV = 0, maxV = 100;

  const xScale = i => entries.length === 1
    ? PL + iW / 2
    : PL + (i / (entries.length - 1)) * iW;
  const yScale = v => PT + iH - ((v - minV) / (maxV - minV)) * iH;

  // Y gridlines
  let gridLines = '';
  [0, 25, 50, 75, 100].filter(v => v >= minV && v <= maxV).forEach(v => {
    const y = yScale(v);
    gridLines += `<line x1="${PL}" y1="${y}" x2="${W - PR}" y2="${y}" stroke="var(--border-light)" stroke-width="1" stroke-dasharray="3,3"/>`;
    gridLines += `<text x="${PL - 4}" y="${y + 4}" text-anchor="end" font-size="9" fill="var(--text-muted)">${v}</text>`;
  });

  const pathD = entries.length === 1
    ? `M${xScale(0)},${yScale(entries[0][1])}`
    : entries.map(([, v], i) => `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(v)}`).join(' ');
  const fillD = entries.length === 1
    ? ''
    : `${pathD} L${xScale(entries.length - 1)},${PT + iH} L${xScale(0)},${PT + iH} Z`;

  // Dots with tooltip
  let dots = '';
  entries.forEach(([date, v], i) => {
    const x = xScale(i), y = yScale(v);
    const label = new Date(date + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const isToday = date === new Date().toISOString().slice(0, 10);
    dots += `<circle cx="${x}" cy="${y}" r="${isToday ? 5 : 3.5}" fill="${isToday ? 'var(--brand-pink)' : subjectColor}" stroke="#fff" stroke-width="1.5"><title>${label}: ${v}%</title></circle>`;
  });

  // X axis labels
  let xLabels = '';
  const labelIndices = new Set([0, entries.length - 1]);
  if (entries.length > 4) {
    const step = Math.floor(entries.length / 3);
    for (let i = step; i < entries.length - 1; i += step) labelIndices.add(i);
  }
  labelIndices.forEach(i => {
    const [date] = entries[i];
    const label = new Date(date + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    xLabels += `<text x="${xScale(i)}" y="${H - 4}" text-anchor="middle" font-size="9" fill="var(--text-muted)">${label}</text>`;
  });
  // For single point, still show a value label
  const todayPrepLabel = entries.length === 1
    ? `<text x="${xScale(0)}" y="${yScale(entries[0][1]) - 10}" text-anchor="middle" font-size="11" font-weight="bold" fill="${subjectColor}">${entries[0][1]}%</text>`
    : '';

  const subjectColor = (() => {
    const subj = state.subjects.find(s => s.kidId === kid.id);
    return subj ? subj.color : 'var(--brand-pink)';
  })();

  container.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;overflow:visible;">
      <defs>
        <linearGradient id="prepFill_${kid.id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${subjectColor}" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="${subjectColor}" stop-opacity="0.02"/>
        </linearGradient>
      </defs>
      ${gridLines}
      ${fillD ? `<path d="${fillD}" fill="url(#prepFill_${kid.id})"/>` : ''}
      ${entries.length > 1 ? `<path d="${pathD}" fill="none" stroke="${subjectColor}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>` : ''}
      ${dots}
      ${xLabels}
      ${todayPrepLabel}
    </svg>`;
}

// --- STREAK CALENDAR ---
function renderStreakCalendar() {
  const section = document.getElementById('streak-calendar-section');
  if (!section) return;

  const kid = state.kids.find(k => k.id === state.currentKidId);
  if (!kid) return;

  const DAYS = 30;
  const today = getSimulatedDate();
  today.setHours(0, 0, 0, 0);

  // Build a set of date strings (YYYY-MM-DD) that have log activity for this kid
  const activeDates = new Set();
  (state.logs || []).forEach(log => {
    if (log.kidId !== kid.id) return;
    const d = new Date(log.timestamp);
    d.setHours(0, 0, 0, 0);
    activeDates.add(d.toISOString().slice(0, 10));
  });

  // Calculate current streak (consecutive days ending today or yesterday)
  let streak = 0;
  for (let i = 0; i < DAYS; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (activeDates.has(d.toISOString().slice(0, 10))) {
      streak++;
    } else {
      break;
    }
  }

  // Build day cells (oldest → newest, left → right)
  let dotsHTML = '';
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const isToday = i === 0;
    const hasActivity = activeDates.has(key);
    const dayLabel = d.getDate();
    const monthLabel = d.toLocaleDateString(undefined, { month: 'short' });
    const showLabel = d.getDate() === 1; // only show month name, never "Today"

    let dotClass = 'streak-day-dot';
    if (hasActivity) dotClass += ' has-activity';
    if (isToday) dotClass += ' is-today';

    dotsHTML += `
      <div class="streak-day" title="${key}">
        <div class="${dotClass}"></div>
        <span class="streak-day-label">${showLabel ? monthLabel : ''}</span>
      </div>`;
  }

  const badgeClass = streak === 0 ? 'streak-count-badge streak-zero' : 'streak-count-badge';
  const streakText = streak === 0
    ? 'START YOUR STREAK!'
    : streak === 1
      ? '🔥 <strong>1</strong> DAY STREAK!'
      : streak < 7
        ? `🔥 <strong>${streak}</strong> DAY STREAK!`
        : `🔥 <strong>${streak}</strong> DAY STREAK!! 🏆`;

  section.innerHTML = `
    <div class="streak-calendar-inner">
      <div class="streak-title">
        <span>${kid.name}</span>
        <span class="${badgeClass}">${streakText}</span>
      </div>
      <div class="streak-days-scroll">
        <div class="streak-days-row">${dotsHTML}</div>
      </div>
    </div>`;
}

// --- RENDER ALL METHOD ---
function renderAll() {
  renderKidSelector();
  renderKidStats();
  renderStreakCalendar();
  renderPrepChart();
  renderSubjectOverviewAccordion();
  renderJournal();
  renderQuizzes();
  renderMasterSubjects();
  renderActivityLog();
}

// --- PWA SERVICE WORKER REGISTRATION ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker registered successfully!', reg.scope))
      .catch(err => console.log('Service Worker registration failed!', err));
  });
}

// --- PWA INSTALL BANNER EVENT HANDLING ---
let deferredPrompt;
const pwaInstallToast = document.getElementById('pwa-install-toast');
const btnPwaInstall = document.getElementById('btn-pwa-install');
const btnPwaClose = document.getElementById('btn-pwa-close');

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent default installation prompt banner
  e.preventDefault();
  // Save event for later execution
  deferredPrompt = e;
  // Show visual install toast
  pwaInstallToast.classList.add('active');
});

btnPwaInstall.addEventListener('click', () => {
  if (!deferredPrompt) return;
  // Show prompt
  deferredPrompt.prompt();
  // Wait for user choice
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the PWA install prompt');
    } else {
      console.log('User dismissed the PWA install prompt');
    }
    deferredPrompt = null;
    pwaInstallToast.classList.remove('active');
  });
});

btnPwaClose.addEventListener('click', () => {
  pwaInstallToast.classList.remove('active');
});

// --- INITIALIZE APPLICATION ---
// Subject summary toggle listener
const elSummaryToggle = document.getElementById('subject-summary-toggle');
const elSummaryArrow = document.getElementById('subject-summary-arrow');

if (elSummaryToggle && elAccordionDashboard && elSummaryArrow) {
  elSummaryToggle.addEventListener('click', () => {
    const isCollapsed = elAccordionDashboard.classList.toggle('collapsed');
    elSummaryArrow.textContent = isCollapsed ? '▶' : '▼';
  });
}

const elPrepChartToggle = document.getElementById('prep-chart-toggle');
const elPrepChartBody = document.getElementById('prep-chart-body');
const elPrepChartArrow = document.getElementById('prep-chart-arrow');

if (elPrepChartToggle && elPrepChartBody) {
  elPrepChartToggle.addEventListener('click', () => {
    const isCollapsed = elPrepChartBody.classList.toggle('collapsed');
    if (elPrepChartArrow) elPrepChartArrow.textContent = isCollapsed ? '▶' : '▼';
  });
}

checkAuthentication();
loadState();
renderAll();
populateSubjectDropdowns();
syncWithSupabase();

// Theme Toggle Event Listener
const btnThemeToggle = document.getElementById('btn-theme-toggle');
if (btnThemeToggle) {
  btnThemeToggle.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    saveState();
    applyTheme();
  });
}

function applyTheme() {
  const btnToggle = document.getElementById('btn-theme-toggle');
  if (state.theme === 'dark') {
    document.body.classList.add('dark');
    if (btnToggle) btnToggle.textContent = '☀️';
  } else {
    document.body.classList.remove('dark');
    if (btnToggle) btnToggle.textContent = '🌙';
  }
}

// Journal Search Event Listener
const elJournalSearch = document.getElementById('journal-search');
if (elJournalSearch) {
  elJournalSearch.addEventListener('input', () => {
    renderJournal();
  });
}

// Quiz View Toggle Event Listener
const btnQuizViewToggle = document.getElementById('btn-quiz-view-toggle');
if (btnQuizViewToggle) {
  btnQuizViewToggle.addEventListener('click', () => {
    state.quizView = state.quizView === 'calendar' ? 'list' : 'calendar';
    saveState();
    renderQuizzes();
  });
}

// Subject Decay Bubble Updater
const elNewSubjectDecay = document.getElementById('new-subject-decay');
const elDecayRateBubble = document.getElementById('decay-rate-bubble');
if (elNewSubjectDecay && elDecayRateBubble) {
  elNewSubjectDecay.addEventListener('input', () => {
    elDecayRateBubble.textContent = elNewSubjectDecay.value;
  });
}

// Ratings Modal Add Subsection Event Listener
document.getElementById('btn-modal-add-subsection').addEventListener('click', () => {
  const slidersList = document.getElementById('rating-sliders-list');
  const sliderRow = document.createElement('div');
  sliderRow.className = 'rating-slider-row';
  sliderRow.setAttribute('data-original-name', ''); // New subsection
  
  sliderRow.innerHTML = `
    <div class="rating-slider-meta" style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
      <input type="text" class="rating-slider-name-input" value="" placeholder="New Learning Area..." required style="flex: 1; padding: 4px 8px; font-size: 0.85rem; font-weight: 600;">
      <button type="button" class="btn btn-danger btn-sm btn-icon-only btn-modal-delete-sub" title="Delete Subsection" style="width: 24px; height: 24px;">🗑️</button>
    </div>
    <div class="rating-slider-decay-info" style="font-size: 0.75rem; color: var(--text-muted); font-style: italic; margin-bottom: 6px;">New Subsection (Unrated)</div>
    <div class="slider-input-group">
      <input type="range" class="rating-slider-input" min="0" max="10" step="1" value="0">
      <span class="slider-bubble-val weak">0</span>
    </div>
  `;

  // Hook delete
  sliderRow.querySelector('.btn-modal-delete-sub').addEventListener('click', () => {
    sliderRow.remove();
  });

  // Hook input slider bubble
  const slider = sliderRow.querySelector('.rating-slider-input');
  const bubble = sliderRow.querySelector('.slider-bubble-val');
  slider.addEventListener('input', () => {
    const val = parseInt(slider.value);
    bubble.textContent = val;
    bubble.className = 'slider-bubble-val ' + getScoreBadgeClass(val);
  });

  slidersList.appendChild(sliderRow);
});

// --- TEST / VALIDATION HARNESS (Self-Testing Code) ---
window.TopRankTest = {
  runTests: function() {
    console.log("=== RUNNING TOPRANK APP TESTS ===");
    const dummyKid = "test-kid";
    
    // Setup dummy subjects & lessons for isolation
    const oldLessons = state.lessons;
    const oldSubjects = state.subjects;
    
    state.subjects = [
      { kidId: dummyKid, name: "Testing", color: "#54a0ff", decayRate: 0.5 }
    ];
    
    // Test 1: Decay calculation
    // Decay: 0.5 per day. Base rating 10. Elapsed: 4 days. Expected: 10 - 2 = 8
    const test1_date = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString();
    const test1_rating = getDecayedRating("Testing", 10, test1_date, dummyKid);
    const test1_passed = test1_rating === 8.0;
    console.log(`Test 1: Linear Decay - ${test1_passed ? 'PASSED ✅' : 'FAILED ❌'} (Expected 8.0, got ${test1_rating})`);

    // Test 2: Rating should not go below 0
    const test2_date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const test2_rating = getDecayedRating("Testing", 10, test2_date, dummyKid);
    const test2_passed = test2_rating === 0.0;
    console.log(`Test 2: Rating Clamp Min 0 - ${test2_passed ? 'PASSED ✅' : 'FAILED ❌'} (Expected 0.0, got ${test2_rating})`);

    // Test 3: Unrated starts at 0 and doesn't change
    const test3_rating = getDecayedRating("Testing", 0, test1_date, dummyKid);
    const test3_passed = test3_rating === 0;
    console.log(`Test 3: Unrated default zero - ${test3_passed ? 'PASSED ✅' : 'FAILED ❌'} (Expected 0, got ${test3_rating})`);
    
    // Test 4: Subject preparation level aggregation
    state.lessons = [
      {
        kidId: dummyKid,
        subjectName: "Testing",
        topicName: "T1",
        subSections: [
          { name: "S1", baseRating: 10, lastUpdatedDate: new Date().toISOString() }, // 10
          { name: "S2", baseRating: 8, lastUpdatedDate: new Date().toISOString() }  // 8
        ] // avg lesson rating: 9
      },
      {
        kidId: dummyKid,
        subjectName: "Testing",
        topicName: "T2",
        subSections: [
          { name: "S1", baseRating: 6, lastUpdatedDate: new Date().toISOString() } // 6
        ] // avg lesson rating: 6
      }
    ]; // Overall subject rating expected: (9 + 6)/2 = 7.5
    
    const subjectRating = getSubjectRating(dummyKid, "Testing");
    const test4_passed = subjectRating === 7.5;
    console.log(`Test 4: Score Aggregation - ${test4_passed ? 'PASSED ✅' : 'FAILED ❌'} (Expected 7.5, got ${subjectRating})`);
    
    // Restore state
    state.lessons = oldLessons;
    state.subjects = oldSubjects;
    console.log("=== TESTS COMPLETE ===");
    return test1_passed && test2_passed && test3_passed && test4_passed;
  }
};
