/* ==========================================================================
   TopRank Application Logic - Bullet Journal Learning Tracker
   ========================================================================== */

// --- Constants & Config ---
const DECAY_RATE = 0.5; // points decayed per day
const LOCAL_STORAGE_KEY = 'toprank_state_v1';

// --- Default Seed Data ---
const DEFAULT_STATE = {
  kids: [
    { id: "kid-rahel", name: "Rahel", age: 12, std: "Std 7", avatar: "🎒" },
    { id: "kid-elsa", name: "Elsa", age: 9, std: "Std 4", avatar: "🎨" },
    { id: "kid-eliah", name: "Eliah", age: 7, std: "Std 2", avatar: "🚀" }
  ],
  currentKidId: "kid-rahel",
  subjects: [
    { name: "Maths", emoji: "📐", color: "#54a0ff" },
    { name: "Hindi", emoji: "📙", color: "#ff9f43" },
    { name: "Geography", emoji: "🌍", color: "#1dd1a1" },
    { name: "Science", emoji: "🔬", color: "#5f27cd" },
    { name: "History", emoji: "🏛️", color: "#ff6b6b" },
    { name: "English", emoji: "📝", color: "#ff9ff3" }
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
    { id: "log-1", kidId: "kid-rahel", timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), type: "lesson", message: "📚 Lesson 'Linear Equations' added to Maths with 3 sub-sections." },
    { id: "log-2", kidId: "kid-rahel", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), type: "rating", message: "🎯 Updated 'Short Q&A Problems' in 'Linear Equations' (Maths) to 8/10." },
    { id: "log-3", kidId: "kid-rahel", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), type: "quiz", message: "📅 Scheduled new quiz for 'Linear Equations Unit Test' in Maths on " + new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString() },
    
    { id: "log-4", kidId: "kid-elsa", timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), type: "lesson", message: "📚 Lesson 'Map of India' added to Geography with 2 sub-sections." },
    
    { id: "log-5", kidId: "kid-eliah", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), type: "lesson", message: "📚 Lesson 'Addition & Regrouping' added to Maths with 2 sub-sections." }
  ],
  dateOffset: 0 // Days added dynamically for simulation
};

// --- App State ---
let state = {};

// --- Load State ---
function loadState() {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (data) {
    try {
      state = JSON.parse(data);
      // Ensure dateOffset exists
      if (typeof state.dateOffset === 'undefined') state.dateOffset = 0;
    } catch (e) {
      console.error("Error parsing localStorage state, resetting...", e);
      state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  } else {
    // Fresh seed
    state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    saveState();
  }
}

// --- Save State ---
function saveState() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}

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
// Base rating decays linear-style by 0.5 per day since lastUpdatedDate
function getDecayedRating(baseRating, lastUpdatedDate) {
  if (baseRating === 0) return 0; // Starts at 0, no decay since it hasn't been learned/rated
  
  const days = getDaysElapsed(lastUpdatedDate);
  const decayed = baseRating - (days * DECAY_RATE);
  return Math.max(0, parseFloat(decayed.toFixed(2)));
}

// Calculate aggregate rating of all sub-sections in a lesson
function getLessonRating(lesson) {
  if (!lesson.subSections || lesson.subSections.length === 0) return 0;
  const sum = lesson.subSections.reduce((acc, sub) => {
    return acc + getDecayedRating(sub.baseRating, sub.lastUpdatedDate);
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
const elKidSelector = document.getElementById('kid-selector-container');
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
const btnTimeTravel1 = document.getElementById('btn-time-travel-1');
const btnTimeTravel5 = document.getElementById('btn-time-travel-5');
const btnTimeTravelReset = document.getElementById('btn-time-travel-reset');
const elOffsetDisplay = document.getElementById('offset-display');

// Active filter state for the Journal Tab
let currentJournalFilter = "All";
let editingSubjectName = null;

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
}

document.querySelectorAll('.btn-close-modal').forEach(btn => {
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

// --- Helper: Get Subject Config (emoji, color) ---
function getSubjectConfig(subjectName) {
  const subj = state.subjects.find(s => s.name.toLowerCase() === subjectName.toLowerCase());
  return subj || { emoji: "📚", color: "#7f8c8d" };
}

// Helper: Get Badge Class based on score
function getScoreBadgeClass(score) {
  if (score < 4) return "weak";
  if (score < 7) return "medium";
  return "strong";
}

// Helper: Get Score Tag text
function getScoreStatusLabel(score) {
  if (score < 4) return "Critical Review 🔴";
  if (score < 7) return "Review Soon 🟡";
  return "Mastered! 🟢";
}

// --- RENDER FUNCTIONS ---

// 1. Render Kid Selector Tab Bar
function renderKidSelector() {
  elKidSelector.innerHTML = '';
  state.kids.forEach(kid => {
    const isActive = kid.id === state.currentKidId;
    const tab = document.createElement('div');
    tab.className = `kid-tab ${isActive ? 'active' : ''}`;
    tab.innerHTML = `
      <span class="kid-avatar">${kid.avatar}</span>
      <span class="kid-tab-name">${kid.name}</span>
      <span class="kid-tab-std">${kid.std} (Age ${kid.age})</span>
    `;
    tab.addEventListener('click', () => {
      state.currentKidId = kid.id;
      currentJournalFilter = "All"; // reset filter
      saveState();
      renderAll();
    });
    elKidSelector.appendChild(tab);
  });
}

// 2. Render Kid stats header
function renderKidStats() {
  const kid = state.kids.find(k => k.id === state.currentKidId);
  if (!kid) return;

  const kidLessons = state.lessons.filter(l => l.kidId === kid.id);
  const activeQuizzes = state.quizzes.filter(q => q.kidId === kid.id);
  
  // Calculate average overall rating across all kid's subjects
  let totalScore = 0;
  let subjectCount = 0;
  const uniqueSubjects = [...new Set(kidLessons.map(l => l.subjectName))];
  
  uniqueSubjects.forEach(subjName => {
    totalScore += getSubjectRating(kid.id, subjName);
    subjectCount++;
  });
  
  const overallRating = subjectCount > 0 ? (totalScore / subjectCount).toFixed(1) : "0.0";
  
  // Find weakest subject
  let weakestSubj = "None";
  let minScore = 11;
  uniqueSubjects.forEach(subjName => {
    const score = getSubjectRating(kid.id, subjName);
    if (score < minScore) {
      minScore = score;
      weakestSubj = subjName;
    }
  });

  const weakestSubjConfig = getSubjectConfig(weakestSubj);
  const weakestDisplayText = weakestSubj !== "None" ? `${weakestSubjConfig.emoji} ${weakestSubj} (${minScore.toFixed(1)}/10)` : "None yet";

  elKidSummary.innerHTML = `
    <div class="kid-summary-meta">
      <h2>${kid.avatar} ${kid.name}'s Learning Board</h2>
      <p>Tracking school items for ${kid.std} • Overall Preparation Index: <strong>${overallRating}/10</strong></p>
    </div>
    <div class="stat-box">
      <span class="stat-val">${kidLessons.length}</span>
      <span class="stat-label">Active Lessons</span>
    </div>
    <div class="stat-box weakest">
      <span class="stat-val" style="font-size: 1.1rem; line-height: 1.8rem; height: 1.8rem; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 150px;">
        ${weakestDisplayText}
      </span>
      <span class="stat-label">Weakest Subject</span>
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

  // We gather ALL master subjects so parents see overview.
  // Calculate aggregate score for each subject, then sort.
  const subjectScores = state.subjects.map(subj => {
    const score = getSubjectRating(kid.id, subj.name);
    const kidLessons = state.lessons.filter(l => l.kidId === kid.id && l.subjectName === subj.name);
    const kidQuizzes = state.quizzes.filter(q => q.kidId === kid.id && q.subjectName === subj.name);
    
    return {
      name: subj.name,
      emoji: subj.emoji,
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
    const badgeClass = getScoreBadgeClass(subj.score);
    const statusText = subj.lessonCount > 0 ? getScoreStatusLabel(subj.score) : "No Lessons Added 📝";
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
        <span class="accordion-subject-emoji">${subj.emoji}</span>
        <span class="accordion-subject-name">${subj.name}</span>
      </div>
      <div class="prep-score-indicator">
        <div class="prep-progress-bar-outer">
          <div class="prep-progress-bar-inner" style="width: ${barWidth}%; background-color: ${subj.color};"></div>
        </div>
        <span class="prep-score-number">${subj.lessonCount > 0 ? subj.score.toFixed(1) + '/10' : '0.0/10'}</span>
      </div>
      <span class="status-badge ${badgeClass}">${statusText}</span>
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
            <span class="mini-topic">📖 ${less.topicName}</span>
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
        if (days < 0) daysText = "Overdue! ⚠️";
        else if (days === 0) daysText = "Today! 🔥";
        else daysText = `${days} days to go`;

        quizzesListHtml += `
          <div class="mini-item">
            <span class="mini-topic">📅 ${q.topicName}</span>
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
  allPill.textContent = "📖 Show All";
  allPill.addEventListener('click', () => {
    currentJournalFilter = "All";
    renderJournal();
  });
  elJournalSubjectFilter.appendChild(allPill);

  activeSubjects.forEach(subjName => {
    const config = getSubjectConfig(subjName);
    const pill = document.createElement('div');
    pill.className = `filter-pill ${currentJournalFilter === subjName ? 'active' : ''}`;
    pill.textContent = `${config.emoji} ${subjName}`;
    pill.addEventListener('click', () => {
      currentJournalFilter = subjName;
      renderJournal();
    });
    elJournalSubjectFilter.appendChild(pill);
  });

  // Filter lessons
  let filteredLessons = kidLessons;
  if (currentJournalFilter !== "All") {
    filteredLessons = kidLessons.filter(l => l.subjectName === currentJournalFilter);
  }

  // SORT lessons: Least prepared (lowest rating) first
  filteredLessons.sort((a, b) => getLessonRating(a) - getLessonRating(b));

  if (filteredLessons.length === 0) {
    elLessonsContainer.innerHTML = `
      <div class="card" style="text-align: center; padding: 40px 20px;">
        <span style="font-size: 3rem;">📓</span>
        <h3 style="margin-top: 10px;">No journal entries yet</h3>
        <p class="text-muted" style="font-size: 0.9rem; margin-bottom: 20px;">Add what was learned in school today to start tracking!</p>
        <button class="btn btn-primary btn-round" id="btn-empty-add-lesson">＋ Add Daily Lesson</button>
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

  // Draw Lesson Cards
  filteredLessons.forEach(lesson => {
    const subjConfig = getSubjectConfig(lesson.subjectName);
    const lessonRating = getLessonRating(lesson);
    const badgeClass = getScoreBadgeClass(lessonRating);

    const card = document.createElement('div');
    card.className = 'card lesson-card';
    card.style.borderLeftColor = subjConfig.color;

    // Build sub-sections list html
    let subSectionsHtml = '';
    lesson.subSections.forEach(sub => {
      const decayedRating = getDecayedRating(sub.baseRating, sub.lastUpdatedDate);
      const elapsedDays = getDaysElapsed(sub.lastUpdatedDate);
      const subBadgeClass = getScoreBadgeClass(decayedRating);
      
      let decayInfoHtml = '';
      if (sub.baseRating === 0) {
        decayInfoHtml = `<span class="decay-warning">Not rated yet 🛑</span>`;
      } else if (elapsedDays > 0) {
        const diff = (sub.baseRating - decayedRating).toFixed(1);
        decayInfoHtml = `<span class="decay-warning">Decayed from ${sub.baseRating} (-${diff} pts over ${elapsedDays}d) ⏳</span>`;
      } else {
        decayInfoHtml = `<span class="decay-warning" style="color: var(--color-strong);">Practiced today! 🚀</span>`;
      }

      subSectionsHtml += `
        <div class="subsection-item-row">
          <div class="subsection-label">
            <span>🔹 ${sub.name}</span>
            ${decayInfoHtml}
          </div>
          <div class="subsection-rating-box">
            <span class="rating-gauge-mini ${subBadgeClass}"></span>
            <span class="subsection-score-text">${decayedRating.toFixed(1)}/10</span>
          </div>
        </div>
      `;
    });

    const displayDate = new Date(lesson.createdDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

    card.innerHTML = `
      <div class="lesson-card-header">
        <div>
          <h4>📖 ${lesson.topicName}</h4>
          <div class="lesson-meta-row" style="margin-top: 4px;">
            <span class="subject-badge-pill" style="background-color: ${subjConfig.color};">${subjConfig.emoji} ${lesson.subjectName}</span>
            <span class="lesson-date-badge">Joined: ${displayDate}</span>
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
        <button class="btn btn-secondary btn-sm btn-round-sm btn-update-ratings" data-id="${lesson.id}">✏️ Update Ratings</button>
        <button class="btn btn-secondary btn-sm btn-round-sm btn-exam-complete" style="background-color: #d1f7ec; color: #0fb9b1; border-color: #a5f3df;" data-id="${lesson.id}">✅ Exam Complete</button>
        <button class="btn btn-danger btn-sm btn-round-sm btn-delete-lesson" data-id="${lesson.id}">🗑️ Delete Lesson</button>
      </div>
    `;

    // Hook edit button
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
  elQuizzesContainer.innerHTML = '';
  
  const kid = state.kids.find(k => k.id === state.currentKidId);
  if (!kid) return;

  const kidQuizzes = state.quizzes.filter(q => q.kidId === kid.id);

  // Sort quizzes: Soonest first (ascending days remaining)
  kidQuizzes.sort((a,b) => calculateDaysToGo(a.date) - calculateDaysToGo(b.date));

  if (kidQuizzes.length === 0) {
    elQuizzesContainer.innerHTML = `
      <div class="card" style="text-align: center; padding: 40px 20px; grid-column: 1 / -1;">
        <span style="font-size: 3rem;">📅</span>
        <h3 style="margin-top: 10px;">No upcoming quizzes</h3>
        <p class="text-muted" style="font-size: 0.9rem;">Add tests or quizzes to display countdown timers!</p>
      </div>
    `;
    return;
  }

  kidQuizzes.forEach(quiz => {
    const subjConfig = getSubjectConfig(quiz.subjectName);
    const daysToGo = calculateDaysToGo(quiz.date);
    
    let daysBadgeClass = 'later';
    let daysLabel = '';
    
    if (daysToGo < 0) {
      daysBadgeClass = 'urgent';
      daysLabel = `⚠️ Overdue (${Math.abs(daysToGo)}d ago)`;
    } else if (daysToGo === 0) {
      daysBadgeClass = 'urgent';
      daysLabel = '🔥 Today!';
    } else if (daysToGo === 1) {
      daysBadgeClass = 'urgent';
      daysLabel = '⏰ Tomorrow!';
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
          <span class="subject-badge-pill quiz-subject-tag" style="background-color: ${subjConfig.color};">${subjConfig.emoji} ${quiz.subjectName}</span>
        </div>
        <h4 class="quiz-topic">${quiz.topicName}</h4>
        <div class="quiz-date-row">
          <span>📅 Date: <strong>${formattedDate}</strong></span>
        </div>
      </div>
      
      <div class="quiz-footer">
        <span class="days-left-badge ${daysBadgeClass}">${daysLabel}</span>
        <button class="btn btn-secondary btn-sm btn-delete-quiz" data-id="${quiz.id}" title="Remove quiz">Delete 🗑️</button>
      </div>
    `;

    card.querySelector('.btn-delete-quiz').addEventListener('click', () => {
      deleteQuiz(quiz.id);
    });

    elQuizzesContainer.appendChild(card);
  });
}

// 6. Render Master Subjects editor
function renderMasterSubjects() {
  elMasterSubjectsList.innerHTML = '';
  
  state.subjects.forEach(subj => {
    const row = document.createElement('div');
    row.className = 'subject-item-row';
    row.innerHTML = `
      <div class="subj-details">
        <span style="font-size: 1.4rem;">${subj.emoji}</span>
        <span>${subj.name}</span>
        <span style="display:inline-block; width: 14px; height: 14px; border-radius: 50%; background-color: ${subj.color};"></span>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="btn btn-secondary btn-sm btn-round-sm btn-edit-subject" data-name="${subj.name}">Edit ✏️</button>
        <button class="btn btn-danger btn-sm btn-round-sm btn-delete-subject" data-name="${subj.name}">Delete 🗑️</button>
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

// Start editing a subject's emoji & color
function startEditSubject(subjName) {
  const subj = state.subjects.find(s => s.name === subjName);
  if (!subj) return;
  
  editingSubjectName = subjName;
  
  document.getElementById('subject-form-title').textContent = `Edit Subject: ${subj.name}`;
  document.getElementById('new-subject-name').value = subj.name;
  document.getElementById('new-subject-name').disabled = true; // Name cannot be edited to avoid corruption
  document.getElementById('new-subject-emoji').value = subj.emoji;
  
  // Select color radio swatch
  const colorRadio = formAddSubject.querySelector(`input[name="subj-color"][value="${subj.color}"]`);
  if (colorRadio) {
    colorRadio.checked = true;
  }
  
  document.getElementById('btn-submit-subject').textContent = 'Save Changes 💾';
  document.getElementById('btn-cancel-subject-edit').style.display = 'inline-block';
}

// Cancel subject editing
function cancelEditSubject() {
  editingSubjectName = null;
  document.getElementById('subject-form-title').textContent = 'Add New Master Subject';
  document.getElementById('new-subject-name').value = '';
  document.getElementById('new-subject-name').disabled = false;
  document.getElementById('new-subject-emoji').value = '';
  
  const defaultRadio = formAddSubject.querySelector('input[name="subj-color"]');
  if (defaultRadio) defaultRadio.checked = true;
  
  document.getElementById('btn-submit-subject').textContent = 'Add Subject 🎨';
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
  state.subjects.forEach(subj => {
    optionsHtml += `<option value="${subj.name}">${subj.emoji} ${subj.name}</option>`;
  });
  
  lessonSubjSelect.innerHTML = optionsHtml;
  quizSubjSelect.innerHTML = optionsHtml;
}

// Complete Lesson (Exam Complete)
function completeLesson(lessonId) {
  const lesson = state.lessons.find(l => l.id === lessonId);
  if (!lesson) return;

  state.lessons = state.lessons.filter(l => l.id !== lessonId);
  logActivity(state.currentKidId, "delete", `🗑️ Lesson '${lesson.topicName}' removed from ${lesson.subjectName} (Exam complete! 🎉)`);
  saveState();
  renderAll();
}

// Delete Lesson (Wrong Entry)
function deleteLesson(lessonId) {
  const lesson = state.lessons.find(l => l.id === lessonId);
  if (!lesson) return;

  state.lessons = state.lessons.filter(l => l.id !== lessonId);
  logActivity(state.currentKidId, "delete", `🗑️ Deleted lesson '${lesson.topicName}' from ${lesson.subjectName} (correction/cleanup).`);
  saveState();
  renderAll();
}

// Delete Quiz
function deleteQuiz(quizId) {
  const quiz = state.quizzes.find(q => q.id === quizId);
  if (!quiz) return;

  state.quizzes = state.quizzes.filter(q => q.id !== quizId);
  logActivity(state.currentKidId, "quiz", `✅ Quiz '${quiz.topicName}' in ${quiz.subjectName} completed/removed.`);
  saveState();
  renderAll();
}

// Add Master Subject
function addSubject(name, emoji, color) {
  // Check if exists
  if (state.subjects.some(s => s.name.toLowerCase() === name.toLowerCase())) {
    alert("Subject already exists!");
    return;
  }

  state.subjects.push({ name, emoji, color });
  logActivity(state.currentKidId, "subject", `🎨 Master list updated: Subject '${name}' ${emoji} added.`);
  saveState();
  renderMasterSubjects();
  populateSubjectDropdowns();
}

// Delete Master Subject
function deleteSubject(name) {
  state.subjects = state.subjects.filter(s => s.name !== name);
  logActivity(state.currentKidId, "subject", `🎨 Master list updated: Subject '${name}' deleted.`);
  saveState();
  renderMasterSubjects();
  populateSubjectDropdowns();
}

// Open and populate the Update Ratings Modal
function openUpdateRatingsModal(lessonId) {
  const lesson = state.lessons.find(l => l.id === lessonId);
  if (!lesson) return;

  const subjConfig = getSubjectConfig(lesson.subjectName);
  
  document.getElementById('rating-modal-lesson-id').value = lesson.id;
  
  const elSubjectBadge = document.getElementById('rating-modal-subject');
  elSubjectBadge.textContent = `${subjConfig.emoji} ${lesson.subjectName}`;
  elSubjectBadge.style.backgroundColor = subjConfig.color;
  
  document.getElementById('rating-modal-lesson-title').textContent = lesson.topicName;

  const slidersList = document.getElementById('rating-sliders-list');
  slidersList.innerHTML = '';

  lesson.subSections.forEach((sub, index) => {
    const decayedVal = getDecayedRating(sub.baseRating, sub.lastUpdatedDate);
    const days = getDaysElapsed(sub.lastUpdatedDate);
    const badgeClass = getScoreBadgeClass(decayedVal);
    
    const sliderRow = document.createElement('div');
    sliderRow.className = 'rating-slider-row';
    
    let decaySubtitle = '';
    if (sub.baseRating === 0) {
      decaySubtitle = `New Subsection (Unrated)`;
    } else {
      decaySubtitle = `Base: ${sub.baseRating}/10 • Last rated: ${days} days ago`;
    }

    sliderRow.innerHTML = `
      <div class="rating-slider-meta">
        <span class="rating-slider-name">🔹 ${sub.name}</span>
        <span class="rating-slider-decay-info">${decaySubtitle}</span>
      </div>
      <div class="slider-input-group">
        <input type="range" class="rating-slider-input" data-index="${index}" min="0" max="10" step="1" value="${Math.round(decayedVal)}">
        <span class="slider-bubble-val ${badgeClass}">${Math.round(decayedVal)}</span>
      </div>
    `;

    // Dynamic slider value rendering on slide
    const slider = sliderRow.querySelector('.rating-slider-input');
    const bubble = sliderRow.querySelector('.slider-bubble-val');
    
    slider.addEventListener('input', () => {
      const val = parseInt(slider.value);
      bubble.textContent = val;
      
      // Update color class dynamically
      bubble.className = 'slider-bubble-val';
      bubble.classList.add(getScoreBadgeClass(val));
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
    <input type="text" class="subsection-name-input" placeholder="e.g. Map Marking" required>
    <button type="button" class="btn-remove-row">&times;</button>
  `;
  
  // hook delete row button
  row.querySelector('.btn-remove-row').addEventListener('click', () => {
    row.remove();
  });

  subsectionContainer.appendChild(row);
});

// Form Submission: Add Daily Lesson
formAddLesson.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const subjName = document.getElementById('lesson-subject').value;
  const topic = document.getElementById('lesson-topic').value;
  
  // Read dynamic subsections
  const subinputs = subsectionContainer.querySelectorAll('.subsection-name-input');
  const subSections = [];
  subinputs.forEach(input => {
    if (input.value.trim() !== '') {
      subSections.push({
        name: input.value.trim(),
        baseRating: 0, // Starts at zero rating
        lastUpdatedDate: new Date().toISOString()
      });
    }
  });

  if (subSections.length === 0) {
    alert("Please add at least one sub-section!");
    return;
  }

  const newLesson = {
    id: 'less-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
    kidId: state.currentKidId,
    subjectName: subjName,
    topicName: topic,
    createdDate: new Date().toISOString(),
    subSections: subSections
  };

  state.lessons.push(newLesson);
  logActivity(state.currentKidId, "lesson", `📚 Lesson '${topic}' added to ${subjName} with ${subSections.length} sub-sections (Initial ratings: 0/10).`);
  
  saveState();
  closeModal(modalAddLesson);
  
  // reset form
  formAddLesson.reset();
  subsectionContainer.innerHTML = `
    <div class="subsection-input-row">
      <input type="text" class="subsection-name-input" placeholder="e.g. Meanings" required value="Meanings">
      <button type="button" class="btn-remove-row" style="display:none;">&times;</button>
    </div>
    <div class="subsection-input-row">
      <input type="text" class="subsection-name-input" placeholder="e.g. Question & Answers" required value="Question & Answers">
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
  logActivity(state.currentKidId, "quiz", `📅 Scheduled new quiz for '${topic}' in ${subjName} on ${new Date(quizDate + 'T00:00:00').toLocaleDateString()} (${daysToGo} days to go).`);
  
  saveState();
  closeModal(modalAddQuiz);
  formAddQuiz.reset();
  renderAll();
});

// Form Submission: Update Ratings (Sliders)
formUpdateRatings.addEventListener('submit', (e) => {
  e.preventDefault();

  const lessonId = document.getElementById('rating-modal-lesson-id').value;
  const lesson = state.lessons.find(l => l.id === lessonId);
  if (!lesson) return;

  const sliderInputs = formUpdateRatings.querySelectorAll('.rating-slider-input');
  
  sliderInputs.forEach(slider => {
    const idx = parseInt(slider.getAttribute('data-index'));
    const newVal = parseInt(slider.value);
    const sub = lesson.subSections[idx];
    
    const oldDecayed = getDecayedRating(sub.baseRating, sub.lastUpdatedDate);

    // Update if changed, or if user commits it (which resets decay timer to today)
    // We update baseRating to newVal and lastUpdatedDate to today (current physical time)
    sub.baseRating = newVal;
    sub.lastUpdatedDate = new Date().toISOString();

    logActivity(
      state.currentKidId, 
      "rating", 
      `🎯 Updated '${sub.name}' in '${lesson.topicName}' (${lesson.subjectName}) to ${newVal}/10 (was ${oldDecayed.toFixed(1)}/10).`
    );
  });

  saveState();
  closeModal(modalUpdateRatings);
  renderAll();
});

// Form Submission: Add/Edit Master Subject
formAddSubject.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('new-subject-name').value.trim();
  const emoji = document.getElementById('new-subject-emoji').value.trim();
  const colorRadio = formAddSubject.querySelector('input[name="subj-color"]:checked');
  const color = colorRadio ? colorRadio.value : '#ff6b6b';

  if (editingSubjectName) {
    // Edit mode
    const subj = state.subjects.find(s => s.name === editingSubjectName);
    if (subj) {
      subj.emoji = emoji;
      subj.color = color;
      
      logActivity(state.currentKidId, "subject", `🎨 Subject '${editingSubjectName}' updated (Emoji: ${emoji}, Color: ${color}).`);
      
      saveState();
      cancelEditSubject();
      renderAll();
    }
  } else {
    // Add mode
    addSubject(name, emoji, color);
    formAddSubject.reset();
    if (colorRadio) colorRadio.checked = true;
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

// --- TIME TRAVEL SIMULATOR ---
function updateSimulatorDisplay() {
  if (state.dateOffset && state.dateOffset > 0) {
    elOffsetDisplay.textContent = `+${state.dateOffset} Day${state.dateOffset > 1 ? 's' : ''}`;
    elOffsetDisplay.style.display = 'inline-block';
  } else {
    elOffsetDisplay.style.display = 'none';
  }
}

btnTimeTravel1.addEventListener('click', () => {
  state.dateOffset += 1;
  saveState();
  updateSimulatorDisplay();
  renderAll();
});

btnTimeTravel5.addEventListener('click', () => {
  state.dateOffset += 5;
  saveState();
  updateSimulatorDisplay();
  renderAll();
});

btnTimeTravelReset.addEventListener('click', () => {
  state.dateOffset = 0;
  saveState();
  updateSimulatorDisplay();
  renderAll();
});

// --- RENDER ALL METHOD ---
function renderAll() {
  renderKidSelector();
  renderKidStats();
  renderSubjectOverviewAccordion();
  renderJournal();
  renderQuizzes();
  renderMasterSubjects();
  renderActivityLog();
  updateSimulatorDisplay();
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
loadState();
renderAll();
populateSubjectDropdowns();

// --- TEST / VALIDATION HARNESS (Self-Testing Code) ---
window.TopRankTest = {
  runTests: function() {
    console.log("=== RUNNING TOPRANK APP TESTS ===");
    
    // Test 1: Decay calculation
    // Decay: 0.5 per day. Base rating 10. Elapsed: 4 days. Expected: 10 - 2 = 8
    const test1_date = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString();
    const test1_rating = getDecayedRating(10, test1_date);
    const test1_passed = test1_rating === 8.0;
    console.log(`Test 1: Linear Decay - ${test1_passed ? 'PASSED ✅' : 'FAILED ❌'} (Expected 8.0, got ${test1_rating})`);

    // Test 2: Rating should not go below 0
    const test2_date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const test2_rating = getDecayedRating(10, test2_date);
    const test2_passed = test2_rating === 0.0;
    console.log(`Test 2: Rating Clamp Min 0 - ${test2_passed ? 'PASSED ✅' : 'FAILED ❌'} (Expected 0.0, got ${test2_rating})`);

    // Test 3: Unrated starts at 0 and doesn't change
    const test3_rating = getDecayedRating(0, test1_date);
    const test3_passed = test3_rating === 0;
    console.log(`Test 3: Unrated default zero - ${test3_passed ? 'PASSED ✅' : 'FAILED ❌'} (Expected 0, got ${test3_rating})`);
    
    // Test 4: Subject preparation level aggregation
    const dummyKid = "test-kid";
    // Setup dummy lessons
    const oldLessons = state.lessons;
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
    
    // Restore lessons state
    state.lessons = oldLessons;
    console.log("=== TESTS COMPLETE ===");
    return test1_passed && test2_passed && test3_passed && test4_passed;
  }
};
