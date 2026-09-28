/**
 * Lillypad - Adaptive Wellness Application
 * Clean, minimal implementation following all specifications
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. SVG CROCODILE CHARACTER GENERATOR (Blank background, clean center character)
  // =========================================================================

  function getCrocodileSVG(mode) {
    let eyeLeft = '';
    let eyeRight = '';
    let mouth = '';
    let extra = '';

    if (mode === 'rest') {
      // Sleeping curved eyes and gentle resting smile
      eyeLeft = `<path d="M 68 85 Q 78 95 88 85" stroke="#253827" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
      eyeRight = `<path d="M 112 85 Q 122 95 132 85" stroke="#253827" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
      mouth = `<path d="M 85 124 Q 100 130 115 124" stroke="#253827" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      extra = `
        <text x="140" y="55" font-family="sans-serif" font-size="14" font-weight="700" fill="#746497" opacity="0.85">Z</text>
        <text x="152" y="42" font-family="sans-serif" font-size="11" font-weight="700" fill="#746497" opacity="0.7">z</text>
      `;
    } else if (mode === 'dull') {
      // Neutral/dull droopy eyelids and straight mouth
      eyeLeft = `
        <circle cx="78" cy="85" r="7.5" fill="#253827"/>
        <path d="M 68 80 Q 78 84 88 80" stroke="#527d56" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      `;
      eyeRight = `
        <circle cx="122" cy="85" r="7.5" fill="#253827"/>
        <path d="M 112 80 Q 122 84 132 80" stroke="#527d56" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      `;
      mouth = `<path d="M 82 125 L 118 125" stroke="#253827" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    } else {
      // Happy / default: big round friendly eyes with shine and cute smile
      eyeLeft = `
        <circle cx="78" cy="85" r="8" fill="#253827"/>
        <circle cx="76" cy="82" r="2.5" fill="#ffffff"/>
      `;
      eyeRight = `
        <circle cx="122" cy="85" r="8" fill="#253827"/>
        <circle cx="120" cy="82" r="2.5" fill="#ffffff"/>
      `;
      mouth = `
        <path d="M 78 120 Q 100 136 122 120" stroke="#253827" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M 94 127 L 97 131 L 100 127 Z" fill="#ffffff"/>
      `;
    }

    return `
      <svg viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <path d="M 45 150 Q 20 160 15 145 Q 15 130 50 135 Z" fill="#527d56"/>
        <path d="M 28 140 L 32 135 L 36 142 Z" fill="#38583c"/>
        <path d="M 38 138 L 42 133 L 46 140 Z" fill="#38583c"/>

        <ellipse cx="100" cy="142" rx="46" ry="38" fill="#5b875f"/>
        <ellipse cx="100" cy="144" rx="34" ry="28" fill="#d9ebd7"/>

        <line x1="80" y1="136" x2="120" y2="136" stroke="#c0d9be" stroke-width="2" stroke-linecap="round"/>
        <line x1="76" y1="145" x2="124" y2="145" stroke="#c0d9be" stroke-width="2" stroke-linecap="round"/>
        <line x1="82" y1="154" x2="118" y2="154" stroke="#c0d9be" stroke-width="2" stroke-linecap="round"/>

        <path d="M 60 95 C 55 60, 145 60, 140 95 C 145 125, 55 125, 60 95 Z" fill="#629267"/>

        <ellipse cx="88" cy="108" rx="3.5" ry="2.5" fill="#253827"/>
        <ellipse cx="112" cy="108" rx="3.5" ry="2.5" fill="#253827"/>

        ${eyeLeft}
        ${eyeRight}

        <ellipse cx="64" cy="98" rx="6" ry="4" fill="#e89886" opacity="0.65"/>
        <ellipse cx="136" cy="98" rx="6" ry="4" fill="#e89886" opacity="0.65"/>

        ${mouth}

        <ellipse cx="70" cy="146" rx="9" ry="7" fill="#527d56"/>
        <ellipse cx="130" cy="146" rx="9" ry="7" fill="#527d56"/>

        <ellipse cx="65" cy="175" rx="14" ry="8" fill="#476e4b"/>
        <ellipse cx="135" cy="175" rx="14" ry="8" fill="#476e4b"/>

        ${extra}
      </svg>
    `;
  }

  // =========================================================================
  // 2. DIALOGUE CATALOGS (3 grounded, kind, uplifting variations)
  // =========================================================================

  const DIALOGUES = {
    happy: [
      "You're chasing your goals! I'm so inspired!",
      "Every small effort adds up. Take it at your own steady pace.",
      "Showing up for yourself today is something to feel good about."
    ],
    rest: [
      "I'm choosing to rest today and that's okay.",
      "Resting is part of the work, not something to feel guilty over.",
      "Recharging my energy today so I can be ready for tomorrow."
    ],
    dull: [
      "I wish I didn't miss that day. But I want to try again tomorrow.",
      "It is okay to start a new streak. An honest small streak is better than a dishonest long one.",
      "Yesterday slipped away, but today is right in front of us. Let's complete a goal."
    ]
  };

  const ACTIVITY_OPTIONS = [
    { id: "walking", name: "Gentle Walking", desc: "Low impact outdoor or indoor strolling at a conversational pace." },
    { id: "yoga", name: "Stretching & Yoga", desc: "Gentle floor stretches to relieve tension and relax joints." },
    { id: "bodyweight", name: "Light Bodyweight Moves", desc: "Simple movements like chair stands, wall pushes, and calf raises." },
    { id: "cycling", name: "Cycling", desc: "Leisure flat-road cycling or stationary pedaling." },
    { id: "dancing", name: "Dance Movement", desc: "Unhurried movement to favorite music in the living room or kitchen." },
    { id: "mobility", name: "Mobility & Posture", desc: "Circular releases for shoulders, spine, hips, and neck." },
    { id: "swimming", name: "Swimming", desc: "Easy floating or smooth laps with zero joint impact." },
    { id: "nature", name: "Nature Strolls", desc: "Walking on natural trails or green parks." }
  ];

  const GOAL_POOLS = {
    walking: [
      { title: "15-Minute Unhurried Stroll", desc: "Walk at a relaxed pace without rushing. Take in your surroundings.", duration: "15 mins" },
      { title: "Midday Fresh Air Walk", desc: "A brief walk outdoors to break up your day and stretch your legs.", duration: "12 mins" },
      { title: "Evening Twilight Walk", desc: "A peaceful walk after sunset to unwind from daily tasks.", duration: "20 mins" },
      { title: "Morning Light Stroll", desc: "Step outside for a short morning walk to welcome daylight.", duration: "10 mins" }
    ],
    yoga: [
      { title: "Gentle Reclined Floor Stretch", desc: "Restorative leg and back stretches on a comfortable rug.", duration: "15 mins" },
      { title: "Spine & Shoulder Ease", desc: "Slow shoulder rolls and cat-cow breathing on all fours.", duration: "12 mins" },
      { title: "Bedtime Wind-Down Stretches", desc: "Relaxing postures to prepare your body for restful sleep.", duration: "10 mins" }
    ],
    bodyweight: [
      { title: "Light Living Room Circuit", desc: "10 chair squats and 8 wall pushes taken at an easy tempo.", duration: "12 mins" },
      { title: "Gentle Posture Balance", desc: "Single-leg balance holds by a chair and slow heel raises.", duration: "10 mins" },
      { title: "Easy Standing Movement", desc: "Gentle torso twists, arm reaches, and slow knee lifts.", duration: "15 mins" }
    ],
    general: [
      { title: "Mindful Joint Mobility Flow", desc: "Unhurried circular motions for ankles, wrists, and neck.", duration: "12 mins" },
      { title: "Gentle Hydration & Walk", desc: "Drink a glass of water followed by an easy 15-minute walk.", duration: "15 mins" },
      { title: "Slow Full-Body Stretch", desc: "Hold 4 gentle stretches for 30 seconds each without straining.", duration: "10 mins" }
    ]
  };

  // =========================================================================
  // 3. APPLICATION STATE & PERSISTENCE
  // =========================================================================

  const STORAGE_KEY = "lillypad_wellness_app_v4";

  const defaultState = {
    onboardingDone: false,
    userName: "",
    crocoName: "",
    selectedActivities: [],
    selectedWhy: "",
    selectedStruggle: "",
    selectedTracker: "",
    weeklyGoalDays: 0,
    weeklyRestDays: 0,
    currentDay: 1, // Days 1 to 7
    streakCount: 0,
    todayMode: "goal", // "goal" or "rest"
    todayGoalCompleted: false,
    activeGoalIndex: 0,
    weeklyGoals: [],
    goalsApproved: false,
    restDaysUsedThisWeek: 0,
    goalDaysCompletedThisWeek: 0,
    isMissedDayPenaltyActive: false, // kept until user completes a goal
    dailyHistory: [], // Day 1 to 7 tracking: { day: 1, type: "goal"|"rest"|"missed", completed: bool }
    journalEntries: [] // Strictly empty by default
  };

  let state = loadState();

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return Object.assign({}, defaultState, JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Storage error", e);
    }
    return Object.assign({}, defaultState);
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Save error", e);
    }
  }

  const AI_SERVICE_URL = window.WELLBEING_AI_URL || "http://127.0.0.1:8001";

  async function generateGoalsList(count, activities) {
  const response = await fetch(`${AI_SERVICE_URL}/api/goals`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      workout_days: count,
      activities: activities || [],
      outdoor_exercise_accepted: true,
      regenerate: true,
      regeneration_offset: Math.floor(Math.random() * 1000)
    })
  });

  if (!response.ok) {
    let message = `AI service error (${response.status})`;

    try {
      const error = await response.json();
      if (error.error) message = error.error;
    } catch (_) {}

    throw new Error(message);
  }

  const result = await response.json();

  if (!result.goals || result.goals.length !== count) {
    throw new Error(
      "Wellness AI did not return the requested number of goals."
    );
  }

  return result.goals;
}
  // =========================================================================
  // 4. UI ELEMENT REFERENCES
  // =========================================================================

  const el = {
    // Screens
    onboardingScreen: document.getElementById('onboardingScreen'),
    mainScreen: document.getElementById('mainScreen'),
    onboardingProgressFill: document.getElementById('onboardingProgressFill'),

    // Onboarding Steps
    stepActivities: document.getElementById('stepActivities'),
    stepWhy: document.getElementById('stepWhy'),
    stepStruggle: document.getElementById('stepStruggle'),
    stepTracker: document.getElementById('stepTracker'),
    stepCompanionIntro: document.getElementById('stepCompanionIntro'),
    stepDaysSelection: document.getElementById('stepDaysSelection'),
    stepGoalApproval: document.getElementById('stepGoalApproval'),

    bubbleActivities: document.getElementById('bubbleActivities'),
    btnNextActivities: document.getElementById('btnNextActivities'),
    bubbleWhy: document.getElementById('bubbleWhy'),
    btnBackWhy: document.getElementById('btnBackWhy'),
    btnNextWhy: document.getElementById('btnNextWhy'),
    bubbleStruggle: document.getElementById('bubbleStruggle'),
    btnBackStruggle: document.getElementById('btnBackStruggle'),
    btnNextStruggle: document.getElementById('btnNextStruggle'),
    trackerOptionsList: document.getElementById('trackerOptionsList'),
    btnBackTracker: document.getElementById('btnBackTracker'),
    btnNextTracker: document.getElementById('btnNextTracker'),

    introCrocoAvatar: document.getElementById('introCrocoAvatar'),
    inputUserName: document.getElementById('inputUserName'),
    inputCrocoName: document.getElementById('inputCrocoName'),
    btnBackCompanion: document.getElementById('btnBackCompanion'),
    btnNextCompanion: document.getElementById('btnNextCompanion'),

    selectedGoalDaysDisplay: document.getElementById('selectedGoalDaysDisplay'),
    selectedRestDaysDisplay: document.getElementById('selectedRestDaysDisplay'),
    onboardingDaysGrid: document.getElementById('onboardingDaysGrid'),
    btnBackDaysSelection: document.getElementById('btnBackDaysSelection'),
    btnGenerateInitialGoals: document.getElementById('btnGenerateInitialGoals'),

    approvalGoalsContainer: document.getElementById('approvalGoalsContainer'),
    btnRetryGoals: document.getElementById('btnRetryGoals'),
    btnBackGoalApproval: document.getElementById('btnBackGoalApproval'),
    btnApproveAndStart: document.getElementById('btnApproveAndStart'),

    // Main Top Controls
    btnOpenMenu: document.getElementById('btnOpenMenu'),
    dayStatusSwitch: document.getElementById('dayStatusSwitch'),
    toggleGoalDay: document.getElementById('toggleGoalDay'),
    toggleRestDay: document.getElementById('toggleRestDay'),
    displayStreak: document.getElementById('displayStreak'),
    currentDayLabel: document.getElementById('currentDayLabel'),
    goalsLeftCount: document.getElementById('goalsLeftCount'),
    restDaysLeftCount: document.getElementById('restDaysLeftCount'),

    // Daily Goal Card
    goalCard: document.getElementById('goalCard'),
    restCard: document.getElementById('restCard'),
    restBadgeTitle: document.getElementById('restBadgeTitle'),
    restCardMainTitle: document.getElementById('restCardMainTitle'),
    restCardMainDesc: document.getElementById('restCardMainDesc'),
    goalIndexText: document.getElementById('goalIndexText'),
    goalCardTitle: document.getElementById('goalCardTitle'),
    goalCardDesc: document.getElementById('goalCardDesc'),
    goalDurationTag: document.getElementById('goalDurationTag'),
    btnCheckGoal: document.getElementById('btnCheckGoal'),
    goalCheckText: document.getElementById('goalCheckText'),

    // Crocodile Center Stage
    crocoCharacterBox: document.getElementById('crocoCharacterBox'),
    crocoSvgWrapper: document.getElementById('crocoSvgWrapper'),
    crocoSpeechBubble: document.getElementById('crocoSpeechBubble'),
    crocoImage: document.getElementById('crocoImage'),
    speechCrocoName: document.getElementById('speechCrocoName'),
    speechQuoteText: document.getElementById('speechQuoteText'),

    // Bottom Bar
    btnOpenJournal: document.getElementById('btnOpenJournal'),
    btnNextDay: document.getElementById('btnNextDay'),

    // Modals
    modalSwapGoal: document.getElementById('modalSwapGoal'),
    btnCloseSwapModal: document.getElementById('btnCloseSwapModal'),
    btnBackFromSwap: document.getElementById('btnBackFromSwap'),
    swapGoalsList: document.getElementById('swapGoalsList'),

    modalMorningCheckin: document.getElementById('modalMorningCheckin'),
    btnCloseCheckin: document.getElementById('btnCloseCheckin'),
    btnBackFromCheckin: document.getElementById('btnBackFromCheckin'),
    checkinDialogSpeaker: document.getElementById('checkinDialogSpeaker'),
    checkinQuestionsContainer: document.getElementById('checkinQuestionsContainer'),

    modalWeekReview: document.getElementById('modalWeekReview'),
    btnCloseWeekReview: document.getElementById('btnCloseWeekReview'),
    btnBackFromReviewStart: document.getElementById('btnBackFromReviewStart'),
    revReportBlock: document.getElementById('revReportBlock'),
    reviewWeeklyReportSummary: document.getElementById('reviewWeeklyReportSummary'),
    btnStartFeedback: document.getElementById('btnStartFeedback'),

    revQ1Block: document.getElementById('revQ1Block'),
    revQ1Choices: document.getElementById('revQ1Choices'),
    btnBackRev1: document.getElementById('btnBackRev1'),
    btnNextRev1: document.getElementById('btnNextRev1'),

    revQ2Block: document.getElementById('revQ2Block'),
    revQ2Choices: document.getElementById('revQ2Choices'),
    btnBackRev2: document.getElementById('btnBackRev2'),
    btnNextRev2: document.getElementById('btnNextRev2'),

    revQ3Block: document.getElementById('revQ3Block'),
    revQ3Choices: document.getElementById('revQ3Choices'),
    btnBackRev3: document.getElementById('btnBackRev3'),
    btnNextRev3: document.getElementById('btnNextRev3'),

    revQ4Block: document.getElementById('revQ4Block'),
    revGoalDaysDisplay: document.getElementById('revGoalDaysDisplay'),
    revRestDaysDisplay: document.getElementById('revRestDaysDisplay'),
    revDaysGrid: document.getElementById('revDaysGrid'),
    btnBackRev4: document.getElementById('btnBackRev4'),
    btnGenerateNextWeekGoals: document.getElementById('btnGenerateNextWeekGoals'),

    revApprovalBlock: document.getElementById('revApprovalBlock'),
    revApprovalGoalsList: document.getElementById('revApprovalGoalsList'),
    btnRetryRevGoals: document.getElementById('btnRetryRevGoals'),
    btnBackRevApproval: document.getElementById('btnBackRevApproval'),
    btnApproveNextWeek: document.getElementById('btnApproveNextWeek'),

    modalJournal: document.getElementById('modalJournal'),
    btnCloseJournalModal: document.getElementById('btnCloseJournalModal'),
    btnBackFromJournal: document.getElementById('btnBackFromJournal'),
    journalText: document.getElementById('journalText'),
    btnSaveReflection: document.getElementById('btnSaveReflection'),
    journalEntriesContainer: document.getElementById('journalEntriesContainer'),

    // Drawer Menu
    drawerOverlay: document.getElementById('drawerOverlay'),
    sideDrawer: document.getElementById('sideDrawer'),
    btnCloseDrawer: document.getElementById('btnCloseDrawer'),
    drawerUserName: document.getElementById('drawerUserName'),
    drawerCrocoName: document.getElementById('drawerCrocoName'),
    drawerLinkGoals: document.getElementById('drawerLinkGoals'),
    drawerLinkProgress: document.getElementById('drawerLinkProgress'),
    drawerLinkActivities: document.getElementById('drawerLinkActivities'),
    drawerLinkWeekReview: document.getElementById('drawerLinkWeekReview'),

    modalGoalsView: document.getElementById('modalGoalsView'),
    btnCloseGoalsView: document.getElementById('btnCloseGoalsView'),
    btnBackFromGoalsView: document.getElementById('btnBackFromGoalsView'),
    weeklyGoalsSummaryList: document.getElementById('weeklyGoalsSummaryList'),

    modalProgressView: document.getElementById('modalProgressView'),
    btnCloseProgressView: document.getElementById('btnCloseProgressView'),
    btnBackFromProgress: document.getElementById('btnBackFromProgress'),
    progStreakVal: document.getElementById('progStreakVal'),
    progGoalsDoneVal: document.getElementById('progGoalsDoneVal'),
    progGoalsTotalVal: document.getElementById('progGoalsTotalVal'),
    progRestLeftVal: document.getElementById('progRestLeftVal'),
    progDailyHistoryList: document.getElementById('progDailyHistoryList'),

    modalActivitiesView: document.getElementById('modalActivitiesView'),
    btnCloseActivitiesView: document.getElementById('btnCloseActivitiesView'),
    btnBackFromActivities: document.getElementById('btnBackFromActivities'),
    activityCatalogList: document.getElementById('activityCatalogList'),

    toastNotice: document.getElementById('toastNotice')
  };

  let tempOnboarding = {
    activities: [],
    why: "",
    struggle: "",
    tracker: "",
    goalDays: 0,
    restDays: 0,
    generatedGoals: []
  };

  let tempReview = {
    q1: "",
    q2: "",
    q3: "",
    goalDays: 0,
    restDays: 0,
    generatedGoals: []
  };

  // =========================================================================
  // 5. INITIALIZATION
  // =========================================================================

  function initApp() {
    renderActivityCatalog();

    if (!state.onboardingDone || !state.goalsApproved) {
      showOnboarding();
    } else {
      showMainScreen();
    }

    setupEventListeners();
  }

  // =========================================================================
  // 6. ONBOARDING CONTROLLER
  // =========================================================================

  function showOnboarding() {
    el.onboardingScreen.style.display = 'flex';
    el.mainScreen.style.display = 'none';
    setOnboardingStep(1);
  }

  function setOnboardingStep(step) {
    const steps = [
      el.stepActivities,
      el.stepWhy,
      el.stepStruggle,
      el.stepTracker,
      el.stepCompanionIntro,
      el.stepDaysSelection,
      el.stepGoalApproval
    ];

    steps.forEach((s, idx) => {
      if (s) s.classList.toggle('active', idx === step - 1);
    });

    const percent = Math.round((step / steps.length) * 100);
    if (el.onboardingProgressFill) {
      el.onboardingProgressFill.style.width = `${percent}%`;
    }

    if (step === 5) {
      if (el.introCrocoAvatar) {
        el.introCrocoAvatar.innerHTML = getCrocodileSVG('happy');
      }
    }
  }

  // Step 1: Activities
  if (el.bubbleActivities) {
    el.bubbleActivities.addEventListener('click', (e) => {
      const btn = e.target.closest('.choice-bubble');
      if (!btn) return;
      btn.classList.toggle('selected');
      const val = btn.getAttribute('data-value');

      if (btn.classList.contains('selected')) {
        if (!tempOnboarding.activities.includes(val)) tempOnboarding.activities.push(val);
      } else {
        tempOnboarding.activities = tempOnboarding.activities.filter(a => a !== val);
      }

      el.btnNextActivities.disabled = tempOnboarding.activities.length === 0;
    });
  }

  // Step 2: Why
  if (el.bubbleWhy) {
    el.bubbleWhy.addEventListener('click', (e) => {
      const btn = e.target.closest('.choice-bubble');
      if (!btn) return;
      el.bubbleWhy.querySelectorAll('.choice-bubble').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      tempOnboarding.why = btn.getAttribute('data-value');
      el.btnNextWhy.disabled = false;
    });
  }

  // Step 3: Struggle
  if (el.bubbleStruggle) {
    el.bubbleStruggle.addEventListener('click', (e) => {
      const btn = e.target.closest('.choice-bubble');
      if (!btn) return;
      el.bubbleStruggle.querySelectorAll('.choice-bubble').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      tempOnboarding.struggle = btn.getAttribute('data-value');
      el.btnNextStruggle.disabled = false;
    });
  }

  // Step 4: Tracker
  if (el.trackerOptionsList) {
    el.trackerOptionsList.addEventListener('click', (e) => {
      const btn = e.target.closest('.tracker-item');
      if (!btn) return;
      el.trackerOptionsList.querySelectorAll('.tracker-item').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      tempOnboarding.tracker = btn.getAttribute('data-value');
      el.btnNextTracker.disabled = false;
    });
  }

  // Step 5: Name validation
  function checkCompanionStepValid() {
    const uName = (el.inputUserName.value || '').trim();
    const cName = (el.inputCrocoName.value || '').trim();
    el.btnNextCompanion.disabled = !(uName.length > 0 && cName.length > 0);
  }
  if (el.inputUserName) el.inputUserName.addEventListener('input', checkCompanionStepValid);
  if (el.inputCrocoName) el.inputCrocoName.addEventListener('input', checkCompanionStepValid);

  // Step 6: Days Selection
  if (el.onboardingDaysGrid) {
    el.onboardingDaysGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-day-choice');
      if (!btn) return;
      el.onboardingDaysGrid.querySelectorAll('.btn-day-choice').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      const gDays = parseInt(btn.getAttribute('data-days'), 10);
      const rDays = 7 - gDays;

      tempOnboarding.goalDays = gDays;
      tempOnboarding.restDays = rDays;

      el.selectedGoalDaysDisplay.textContent = gDays;
      el.selectedRestDaysDisplay.textContent = rDays;

      el.btnGenerateInitialGoals.disabled = false;
    });
  }

  function renderApprovalGoals(container, goals) {
    if (!container) return;
    container.innerHTML = '';
    goals.forEach((g, idx) => {
      const card = document.createElement('div');
      card.className = 'approval-goal-card';
      card.innerHTML = `
        <div class="approval-goal-title">Goal ${idx + 1}: ${g.title}</div>
        <div class="approval-goal-desc">${g.desc} (${g.duration})</div>
      `;
      container.appendChild(card);
    });
  }

  // Onboarding Step Handlers
  if (el.btnNextActivities) el.btnNextActivities.addEventListener('click', () => setOnboardingStep(2));
  if (el.btnBackWhy) el.btnBackWhy.addEventListener('click', () => setOnboardingStep(1));
  if (el.btnNextWhy) el.btnNextWhy.addEventListener('click', () => setOnboardingStep(3));
  if (el.btnBackStruggle) el.btnBackStruggle.addEventListener('click', () => setOnboardingStep(2));
  if (el.btnNextStruggle) el.btnNextStruggle.addEventListener('click', () => setOnboardingStep(4));
  if (el.btnBackTracker) el.btnBackTracker.addEventListener('click', () => setOnboardingStep(3));
  if (el.btnNextTracker) el.btnNextTracker.addEventListener('click', () => setOnboardingStep(5));
  if (el.btnBackCompanion) el.btnBackCompanion.addEventListener('click', () => setOnboardingStep(4));

  if (el.btnNextCompanion) {
    el.btnNextCompanion.addEventListener('click', () => {
      state.userName = el.inputUserName.value.trim();
      state.crocoName = el.inputCrocoName.value.trim();
      setOnboardingStep(6);
    });
  }

  if (el.btnBackDaysSelection) el.btnBackDaysSelection.addEventListener('click', () => setOnboardingStep(5));

  if (el.btnGenerateInitialGoals) {
    el.btnGenerateInitialGoals.addEventListener('click', async () => {
      el.btnGenerateInitialGoals.disabled = true;
      try {
        tempOnboarding.generatedGoals = await generateGoalsList(tempOnboarding.goalDays, tempOnboarding.activities);
        renderApprovalGoals(el.approvalGoalsContainer, tempOnboarding.generatedGoals);
        setOnboardingStep(7);
      } catch (error) {
        console.error("Wellness AI goal generation failed:", error);
        showToast("Could not reach Wellness AI. Start the AI service and try again.");
      } finally {
        el.btnGenerateInitialGoals.disabled = false;
      }
    });
  }

  if (el.btnBackGoalApproval) {
    el.btnBackGoalApproval.addEventListener('click', () => setOnboardingStep(6));
  }

  if (el.btnRetryGoals) {
    el.btnRetryGoals.addEventListener('click', async () => {
      el.btnRetryGoals.disabled = true;
      try {
        tempOnboarding.generatedGoals = await generateGoalsList(tempOnboarding.goalDays, tempOnboarding.activities);
        renderApprovalGoals(el.approvalGoalsContainer, tempOnboarding.generatedGoals);
        showToast("Generated new goals with Wellness AI.");
      } catch (error) {
        console.error("Wellness AI goal regeneration failed:", error);
        showToast("Could not reach Wellness AI. Start the AI service and try again.");
      } finally {
        el.btnRetryGoals.disabled = false;
      }
    });
  }

  if (el.btnApproveAndStart) {
    el.btnApproveAndStart.addEventListener('click', () => {
      state.selectedActivities = [...tempOnboarding.activities];
      state.selectedWhy = tempOnboarding.why;
      state.selectedStruggle = tempOnboarding.struggle;
      state.selectedTracker = tempOnboarding.tracker;
      state.weeklyGoalDays = tempOnboarding.goalDays;
      state.weeklyRestDays = tempOnboarding.restDays;
      state.weeklyGoals = [...tempOnboarding.generatedGoals];
      state.goalsApproved = true;
      state.onboardingDone = true;
      state.currentDay = 1;
      state.goalDaysCompletedThisWeek = 0;
      state.restDaysUsedThisWeek = 0;
      state.todayMode = "goal";
      state.todayGoalCompleted = false;
      state.activeGoalIndex = 0;
      state.dailyHistory = [];

      saveState();
      showMainScreen();
      showToast("Goals approved for the week!");
    });
  }

  // =========================================================================
  // 7. MAIN SCREEN CONTROLLER
  // =========================================================================

  function showMainScreen() {
    el.onboardingScreen.style.display = 'none';
    el.mainScreen.style.display = 'flex';

    renderMainView();
  }

  function renderMainView() {
    const totalGoals = state.weeklyGoals.length;
    const completedGoalsCount = state.weeklyGoals.filter(g => g.completed).length;
    const remainingGoals = totalGoals - completedGoalsCount;
    const remainingRestDays = Math.max(0, state.weeklyRestDays - state.restDaysUsedThisWeek);

    // Rule: If all goal days are completed, default user into rest mode for remaining days
    const allGoalsCompleted = completedGoalsCount >= state.weeklyGoalDays && state.weeklyGoalDays > 0;
    // Rule: If all rest days are used up, default user into goal mode
    const allRestDaysUsed = remainingRestDays <= 0 && state.weeklyRestDays > 0;

    if (allGoalsCompleted) {
      state.todayMode = "rest";
    } else if (allRestDaysUsed) {
      state.todayMode = "goal";
    }

    // Top Bar Status
    if (el.displayStreak) el.displayStreak.textContent = state.streakCount;

    // Day Progress Tracker: Day X/7 | Goals left: Y | Rest days left: Z
    if (el.currentDayLabel) el.currentDayLabel.textContent = `Day ${state.currentDay}/7`;
    if (el.goalsLeftCount) el.goalsLeftCount.textContent = remainingGoals;
    if (el.restDaysLeftCount) el.restDaysLeftCount.textContent = remainingRestDays;

    // Day Status Switch accessibility rules
    if (el.toggleGoalDay && el.toggleRestDay) {
      el.toggleGoalDay.classList.toggle('active', state.todayMode === 'goal');
      el.toggleRestDay.classList.toggle('active', state.todayMode === 'rest');

      if (allGoalsCompleted) {
        // Locked in rest mode until week is over! (no access to goal mode)
        el.toggleGoalDay.disabled = true;
        el.toggleGoalDay.title = "You have accomplished all your goals! You can rest now.";
        el.toggleRestDay.disabled = false;
      } else if (allRestDaysUsed || state.isMissedDayPenaltyActive) {
        // Locked in goal mode! (no access to rest mode)
        el.toggleRestDay.disabled = true;
        el.toggleRestDay.title = "Rest day is not accessible.";
        el.toggleGoalDay.disabled = false;
      } else {
        el.toggleGoalDay.disabled = false;
        el.toggleRestDay.disabled = false;
        el.toggleGoalDay.title = "";
        el.toggleRestDay.title = "";
      }
    }

    // Daily Goal Card vs Rest Card
    if (state.todayMode === 'rest') {
      el.goalCard.style.display = 'none';
      el.restCard.style.display = 'block';

      if (allGoalsCompleted) {
        el.restBadgeTitle.textContent = "All Goals Accomplished";
        el.restCardMainTitle.textContent = "You’ve accomplished all your goals! You can rest now.";
        el.restCardMainDesc.textContent = "Great job finishing your routine early. Enjoy your rest for the remainder of the week.";
      } else {
        el.restBadgeTitle.textContent = "Rest Day Active";
        el.restCardMainTitle.textContent = "Today is a rest day";
        el.restCardMainDesc.textContent = "Take your time to recharge. Your streak is completely safe.";
      }
    } else {
      el.goalCard.style.display = 'block';
      el.restCard.style.display = 'none';
      renderDailyGoalCard();
    }

    renderCrocodile();

    if (el.drawerUserName) el.drawerUserName.textContent = state.userName || "User";
    if (el.drawerCrocoName) el.drawerCrocoName.textContent = `Companion: ${state.crocoName || "Crocodile"}`;
  }

  function renderDailyGoalCard() {
    if (!state.weeklyGoals || state.weeklyGoals.length === 0) return;

    const currentGoal = state.weeklyGoals[state.activeGoalIndex] || state.weeklyGoals[0];
    const totalGoals = state.weeklyGoals.length;

    if (el.goalIndexText) el.goalIndexText.textContent = `Goal ${state.activeGoalIndex + 1} of ${totalGoals}`;
    if (el.goalCardTitle) el.goalCardTitle.textContent = currentGoal.title;
    if (el.goalCardDesc) el.goalCardDesc.textContent = currentGoal.desc;
    if (el.goalDurationTag) el.goalDurationTag.textContent = currentGoal.duration;

    if (el.btnCheckGoal) {
      if (currentGoal.completed) {
        el.btnCheckGoal.classList.add('completed');
        el.goalCheckText.textContent = "Completed ✓";
      } else {
        el.btnCheckGoal.classList.remove('completed');
        el.goalCheckText.textContent = "Mark as completed";
      }
    }
  }

  function renderCrocodile() {
    let mode = 'happy';

    // Neutral expression ONLY until user selects a goal as completed
    if (state.isMissedDayPenaltyActive) {
      mode = 'dull';
    } else if (state.todayMode === 'rest') {
      mode = 'rest';
    } else {
      mode = 'happy';
    }

    if (el.crocoSvgWrapper) {
      el.crocoSvgWrapper.innerHTML = getCrocodileSVG(mode);
    }

    if (el.speechCrocoName) el.speechCrocoName.textContent = state.crocoName || "Crocodile";

    const pool = DIALOGUES[mode] || DIALOGUES.happy;
    if (!el.speechQuoteText.textContent || state.isMissedDayPenaltyActive) {
      el.speechQuoteText.textContent = `"${pool[Math.floor(Math.random() * pool.length)]}"`;
    }
  }

  function cycleCrocodileDialogue() {
    let mode = 'happy';
    if (state.isMissedDayPenaltyActive) mode = 'dull';
    else if (state.todayMode === 'rest') mode = 'rest';

    const pool = DIALOGUES[mode] || DIALOGUES.happy;
    el.speechQuoteText.textContent = `"${pool[Math.floor(Math.random() * pool.length)]}"`;
  }

  function setDayMode(newMode) {
    const totalGoals = state.weeklyGoals.length;
    const completedGoalsCount = state.weeklyGoals.filter(g => g.completed).length;
    const allGoalsCompleted = completedGoalsCount >= state.weeklyGoalDays && state.weeklyGoalDays > 0;
    const remainingRestDays = Math.max(0, state.weeklyRestDays - state.restDaysUsedThisWeek);

    if (newMode === 'goal' && allGoalsCompleted) {
      showToast("You’ve accomplished all your goals! You can rest now.");
      return;
    }

    if (newMode === 'rest' && (remainingRestDays <= 0 || state.isMissedDayPenaltyActive)) {
      showToast("You’ve used up all your rest days. Chase your goals now.");
      return;
    }

    state.todayMode = newMode;
    saveState();
    renderMainView();
    cycleCrocodileDialogue();
  }

  // Toggle Goal Completed for today
  function toggleGoalCompletion() {
    if (!state.weeklyGoals || state.weeklyGoals.length === 0) return;
    const goal = state.weeklyGoals[state.activeGoalIndex];
    if (!goal) return;

    goal.completed = !goal.completed;
    state.todayGoalCompleted = goal.completed;

    if (goal.completed) {
      state.goalDaysCompletedThisWeek += 1;
      state.streakCount += 1;

      // CRITICAL RULE: When user selects goal as completed, clear missed day penalty!
      // Crocodile is back to normal!
      if (state.isMissedDayPenaltyActive) {
        state.isMissedDayPenaltyActive = false;
      }

      showToast("Goal marked as completed! Streak increased.");
      el.speechQuoteText.textContent = `"You're chasing your goals! I'm so inspired!"`;

      // Check if all goals are now completed
      const completedGoalsCount = state.weeklyGoals.filter(g => g.completed).length;
      if (completedGoalsCount >= state.weeklyGoalDays) {
        state.todayMode = "rest";
        showToast("You’ve accomplished all your goals! You can rest now.");
      }
    } else {
      state.goalDaysCompletedThisWeek = Math.max(0, state.goalDaysCompletedThisWeek - 1);
      state.streakCount = Math.max(0, state.streakCount - 1);
      showToast("Goal marked as pending.");
      cycleCrocodileDialogue();
    }

    saveState();
    renderMainView();
  }

  // =========================================================================
  // 8. NEXT DAY & MORNING CHECK-IN FLOW
  // =========================================================================

  function handleNextDayClick() {
    const lastMode = state.todayMode;
    const wasCompleted = state.todayGoalCompleted;

    launchMorningCheckin(lastMode, wasCompleted);
  }

    async function launchMorningCheckin(yesterdayMode, yesterdayGoalCompleted) {
    el.checkinDialogSpeaker.textContent = `${state.crocoName || "Crocodile"} checks in:`;
    el.modalMorningCheckin.style.display = 'flex';

    const container = el.checkinQuestionsContainer;
    container.innerHTML = '';

    const completedGoalsCount = state.weeklyGoals.filter(g => g.completed).length;
    const allGoalsCompletedAlready = completedGoalsCount >= state.weeklyGoalDays && state.weeklyGoalDays > 0;
    const remainingRestDays = Math.max(0, state.weeklyRestDays - state.restDaysUsedThisWeek);

    // RULE 1: If user finishes all their goals already
    if (allGoalsCompletedAlready) {
      container.innerHTML = `
        <div class="checkin-card info-highlight">
          <h4 class="checkin-q-title">Rest Mode Active</h4>
          <p class="checkin-q-sub">You’ve accomplished all your goals! You can rest now.</p>
        </div>
        <div class="checkin-actions-stack">
          <button type="button" class="btn-checkin-act success" id="btnCheckinAllGoalsRestContinue">
            Continue to Next Day →
          </button>
        </div>
      `;
      document.getElementById('btnCheckinAllGoalsRestContinue').addEventListener('click', () => {
        recordDayHistory(state.currentDay, "rest");
        state.todayMode = "rest";
        advanceDay();
      });
      return;
    }

    // RULE 2: If yesterday was left at REST DAY
    if (yesterdayMode === 'rest') {
      // If user had used up all their rest days already
      if (remainingRestDays <= 0) {
        container.innerHTML = `
          <div class="checkin-card warn-highlight">
            <h4 class="checkin-q-title">Rest Days Complete</h4>
            <p class="checkin-q-sub">You’ve used up all your rest days. Chase your goals now.</p>
          </div>
          <div class="checkin-actions-stack">
            <button type="button" class="btn-checkin-act" id="btnCheckinAllRestUsedContinue">
              Continue to Goal Mode →
            </button>
          </div>
        `;
        document.getElementById('btnCheckinAllRestUsedContinue').addEventListener('click', () => {
          recordDayHistory(state.currentDay, "rest");
          state.todayMode = "goal";
          advanceDay();
        });
        return;
      }

      // Normal Rest Day Check-in: "Did you rest well?"
      container.innerHTML = `
        <div class="checkin-card">
          <h4 class="checkin-q-title">Yesterday was a rest day.</h4>
          <p class="checkin-q-sub">Did you rest well?</p>
        </div>
        <div class="checkin-actions-stack">
          <button type="button" class="btn-checkin-act success" id="btnCheckinRestYes">
            Yes
          </button>
          <button type="button" class="btn-checkin-act" id="btnCheckinRestNoGoal">
            No, I accomplished a goal!
          </button>
        </div>
      `;

      document.getElementById('btnCheckinRestYes').addEventListener('click', () => {
        state.restDaysUsedThisWeek += 1;
        state.streakCount += 1;
        recordDayHistory(state.currentDay, "rest");

        // If this was the last rest day: prompt to switch to goal mode!
        const restLeftAfter = state.weeklyRestDays - state.restDaysUsedThisWeek;
        if (restLeftAfter <= 0) {
          showRestDaysExhaustedNotice();
        } else {
          advanceDay();
        }
      });

      document.getElementById('btnCheckinRestNoGoal').addEventListener('click', () => {
        showAccomplishedGoalSelector();
      });

    } else {
      // RULE 3: Yesterday was left at GOAL DAY: "Did you accomplish it?"
      if (yesterdayGoalCompleted) {
        container.innerHTML = `
          <div class="checkin-card info-highlight">
            <h4 class="checkin-q-title">Goal Accomplished!</h4>
            <p class="checkin-q-sub">You completed your goal yesterday. Great effort.</p>
          </div>
          <div class="checkin-actions-stack">
            <button type="button" class="btn-checkin-act success" id="btnCheckinGoalDoneContinue">
              Continue to Next Day →
            </button>
          </div>
        `;
        document.getElementById('btnCheckinGoalDoneContinue').addEventListener('click', () => {
          recordDayHistory(state.currentDay, "goal");
          advanceDay();
        });
      } else {
        // Goal was NOT completed
        container.innerHTML = `
          <div class="checkin-card">
            <h4 class="checkin-q-title">Yesterday was a goal day.</h4>
            <p class="checkin-q-sub">Did you accomplish it?</p>
          </div>
          <div class="checkin-actions-stack" id="checkinGoalChoices"></div>
        `;

        const choicesBox = document.getElementById('checkinGoalChoices');

        const btnYes = document.createElement('button');
        btnYes.className = 'btn-checkin-act success';
        btnYes.textContent = 'Yes';
        btnYes.addEventListener('click', () => {
          const curGoal = state.weeklyGoals[state.activeGoalIndex];
          if (curGoal) curGoal.completed = true;
          state.goalDaysCompletedThisWeek += 1;
          state.streakCount += 1;
          if (state.isMissedDayPenaltyActive) state.isMissedDayPenaltyActive = false;

          recordDayHistory(state.currentDay, "goal");

          // If this was the final goal: prompt switch to rest mode!
          const newCompletedCount = state.weeklyGoals.filter(g => g.completed).length;
          if (newCompletedCount >= state.weeklyGoalDays) {
            showAllGoalsAccomplishedNotice();
          } else {
            advanceDay();
          }
        });
        choicesBox.appendChild(btnYes);

        if (remainingRestDays > 0) {
          // Can use rest day as compensation (Streak reset NOT allowed when rest days available!)
          const btnRestDay = document.createElement('button');
          btnRestDay.className = 'btn-checkin-act';
          btnRestDay.textContent = `No, use rest day (${remainingRestDays} left)`;
          btnRestDay.addEventListener('click', () => {
            state.restDaysUsedThisWeek += 1;
            recordDayHistory(state.currentDay, "rest");

            // Check if rest days are now exhausted
            const restLeftAfter = state.weeklyRestDays - state.restDaysUsedThisWeek;
            if (restLeftAfter <= 0) {
              showRestDaysExhaustedNotice();
            } else {
              advanceDay();
            }
          });
          choicesBox.appendChild(btnRestDay);
        } else {
          // 0 rest days left: must reset streak!
          const btnReset = document.createElement('button');
          btnReset.className = 'btn-checkin-act warn';
          btnReset.textContent = 'No, reset streak';
          btnReset.addEventListener('click', () => {
            state.streakCount = 0;
            state.isMissedDayPenaltyActive = true;
            state.todayMode = 'goal'; // rest day not available
            recordDayHistory(state.currentDay, "missed");
            advanceDay();
          });
          choicesBox.appendChild(btnReset);
        }
      }
    }
  }

  // Intermediary prompt: "You've accomplished all your goals! You can rest now."
  function showAllGoalsAccomplishedNotice() {
    const container = el.checkinQuestionsContainer;
    container.innerHTML = `
      <div class="checkin-card info-highlight">
        <h4 class="checkin-q-title">Goal Accomplished!</h4>
        <p class="checkin-q-sub">You’ve accomplished all your goals! You can rest now.</p>
      </div>
      <div class="checkin-actions-stack">
        <button type="button" class="btn-checkin-act success" id="btnAckAllGoalsRest">
          Continue to Rest Mode →
        </button>
      </div>
    `;
    document.getElementById('btnAckAllGoalsRest').addEventListener('click', () => {
      state.todayMode = "rest";
      advanceDay();
    });
  }

  // Intermediary prompt: "You've used up all your rest days. Chase your goals now."
  function showRestDaysExhaustedNotice() {
    const container = el.checkinQuestionsContainer;
    container.innerHTML = `
      <div class="checkin-card warn-highlight">
        <h4 class="checkin-q-title">Rest Day Logged</h4>
        <p class="checkin-q-sub">You’ve used up all your rest days. Chase your goals now.</p>
      </div>
      <div class="checkin-actions-stack">
        <button type="button" class="btn-checkin-act" id="btnAckAllRestGoal">
          Continue in Goal Mode →
        </button>
      </div>
    `;
    document.getElementById('btnAckAllRestGoal').addEventListener('click', () => {
      state.todayMode = "goal";
      advanceDay();
    });
  }

  // Sub-selector for surprise goal on rest day
  function showAccomplishedGoalSelector() {
    const container = el.checkinQuestionsContainer;
    const uncompleted = state.weeklyGoals.filter(g => !g.completed);

    if (uncompleted.length === 0) {
      showAllGoalsAccomplishedNotice();
      return;
    }

    let itemsHtml = uncompleted.map(g => `
      <button type="button" class="btn-checkin-act" data-goal-id="${g.id}">
        ✓ ${g.title}
      </button>
    `).join('');

    container.innerHTML = `
      <div class="checkin-card">
        <h4 class="checkin-q-title">Which goal did you accomplish?</h4>
      </div>
      <div class="checkin-actions-stack">
        ${itemsHtml}
      </div>
    `;

    container.querySelectorAll('.btn-checkin-act').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-goal-id'), 10);
        const target = state.weeklyGoals.find(g => g.id === id);
        if (target) target.completed = true;
        state.goalDaysCompletedThisWeek += 1;
        state.streakCount += 1;
        if (state.isMissedDayPenaltyActive) state.isMissedDayPenaltyActive = false;

        recordDayHistory(state.currentDay, "goal");

        const newCompletedCount = state.weeklyGoals.filter(g => g.completed).length;
        if (newCompletedCount >= state.weeklyGoalDays) {
          showAllGoalsAccomplishedNotice();
        } else {
          advanceDay();
        }
      });
    });
  }

  function recordDayHistory(dayNum, type) {
    if (!state.dailyHistory) state.dailyHistory = [];
    state.dailyHistory = state.dailyHistory.filter(h => h.day !== dayNum);
    state.dailyHistory.push({
      day: dayNum,
      type: type // "goal", "rest", "missed"
    });
  }

  function advanceDay() {
    el.modalMorningCheckin.style.display = 'none';
    state.todayGoalCompleted = false;

    const nextUncompletedIdx = state.weeklyGoals.findIndex(g => !g.completed);
    if (nextUncompletedIdx !== -1) {
      state.activeGoalIndex = nextUncompletedIdx;
    }

    if (state.currentDay >= 7) {
      // 7 days are over! Automatically launch weekly review
      saveState();
      renderMainView();
      launchWeeklyReviewModal();
    } else {
      state.currentDay += 1;
      saveState();
      renderMainView();
      showToast(`Welcome to Day ${state.currentDay}/7`);
    }
  }

  // =========================================================================
  // 9. AUTOMATIC & ON-DEMAND END-OF-WEEK REVIEW & WEEKLY REPORT
  // =========================================================================

  function launchWeeklyReviewModal() {
    tempReview = {
      q1: "",
      q2: "",
      q3: "",
      goalDays: state.weeklyGoalDays || 3,
      restDays: state.weeklyRestDays || 4,
      generatedGoals: []
    };

    // Render Weekly Report Summary
    renderWeeklyReportSummary();

    el.modalWeekReview.style.display = 'flex';
    setReviewStep(0); // Step 0 is the Weekly Report Summary!
  }

  function renderWeeklyReportSummary() {
    if (!el.reviewWeeklyReportSummary) return;

    let goalDaysCount = 0;
    let restDaysCount = 0;
    let missedDaysCount = 0;

    const history = state.dailyHistory || [];
    for (let d = 1; d <= 7; d++) {
      const item = history.find(h => h.day === d);
      if (item) {
        if (item.type === 'goal') goalDaysCount++;
        else if (item.type === 'rest') restDaysCount++;
        else if (item.type === 'missed') missedDaysCount++;
      }
    }

    el.reviewWeeklyReportSummary.innerHTML = `
      <div style="font-size:0.9rem; font-weight:700; color:var(--text-main); margin-bottom:8px;">
        7-Day Summary:
      </div>
      <div class="stat-line">
        <span>🌿 Goal Days Finished:</span>
        <strong>${goalDaysCount}</strong>
      </div>
      <div class="stat-line">
        <span>☕ Rest Days Taken:</span>
        <strong>${restDaysCount}</strong>
      </div>
      <div class="stat-line">
        <span>🌧️ Missed Days:</span>
        <strong style="color:var(--accent-peach);">${missedDaysCount}</strong>
      </div>
    `;
  }

  function setReviewStep(step) {
    const blocks = [
      el.revReportBlock,
      el.revQ1Block,
      el.revQ2Block,
      el.revQ3Block,
      el.revQ4Block,
      el.revApprovalBlock
    ];

    blocks.forEach((b, idx) => {
      if (b) b.style.display = (idx === step) ? 'flex' : 'none';
    });
  }

  if (el.btnStartFeedback) el.btnStartFeedback.addEventListener('click', () => setReviewStep(1));
  if (el.btnBackFromReviewStart) el.btnBackFromReviewStart.addEventListener('click', () => {
    el.modalWeekReview.style.display = 'none';
  });

  // Review Q1
  if (el.revQ1Choices) {
    el.revQ1Choices.addEventListener('click', (e) => {
      const btn = e.target.closest('.choice-bubble');
      if (!btn) return;
      el.revQ1Choices.querySelectorAll('.choice-bubble').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      tempReview.q1 = btn.getAttribute('data-ans');
      el.btnNextRev1.disabled = false;
    });
  }

  // Review Q2
  if (el.revQ2Choices) {
    el.revQ2Choices.addEventListener('click', (e) => {
      const btn = e.target.closest('.choice-bubble');
      if (!btn) return;
      el.revQ2Choices.querySelectorAll('.choice-bubble').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      tempReview.q2 = btn.getAttribute('data-ans');
      el.btnNextRev2.disabled = false;
    });
  }

  // Review Q3
  if (el.revQ3Choices) {
    el.revQ3Choices.addEventListener('click', (e) => {
      const btn = e.target.closest('.choice-bubble');
      if (!btn) return;
      el.revQ3Choices.querySelectorAll('.choice-bubble').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      tempReview.q3 = btn.getAttribute('data-ans');
      el.btnNextRev3.disabled = false;
    });
  }

  // Review Q4: Days Selection
  if (el.revDaysGrid) {
    el.revDaysGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-day-choice');
      if (!btn) return;
      el.revDaysGrid.querySelectorAll('.btn-day-choice').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      const gDays = parseInt(btn.getAttribute('data-days'), 10);
      const rDays = 7 - gDays;
      tempReview.goalDays = gDays;
      tempReview.restDays = rDays;

      el.revGoalDaysDisplay.textContent = gDays;
      el.revRestDaysDisplay.textContent = rDays;
      el.btnGenerateNextWeekGoals.disabled = false;
    });
  }

  // Navigation in Review
  if (el.btnBackRev1) el.btnBackRev1.addEventListener('click', () => setReviewStep(0));
  if (el.btnNextRev1) el.btnNextRev1.addEventListener('click', () => setReviewStep(2));
  if (el.btnBackRev2) el.btnBackRev2.addEventListener('click', () => setReviewStep(1));
  if (el.btnNextRev2) el.btnNextRev2.addEventListener('click', () => setReviewStep(3));
  if (el.btnBackRev3) el.btnBackRev3.addEventListener('click', () => setReviewStep(2));
  if (el.btnNextRev3) el.btnNextRev3.addEventListener('click', () => setReviewStep(4));
  if (el.btnBackRev4) el.btnBackRev4.addEventListener('click', () => setReviewStep(3));

  // Step 5: MANDATORY GOAL VIEW, REVIEW & APPROVAL
  if (el.btnGenerateNextWeekGoals) {
    el.btnGenerateNextWeekGoals.addEventListener('click', async () => {
      el.btnGenerateNextWeekGoals.disabled = true;
      try {
        tempReview.generatedGoals = await generateGoalsList(tempReview.goalDays, state.selectedActivities);
        renderApprovalGoals(el.revApprovalGoalsList, tempReview.generatedGoals);
        setReviewStep(5);
      } catch (error) {
        console.error("Wellness AI next-week goal generation failed:", error);
        showToast("Could not reach Wellness AI. Start the AI service and try again.");
      } finally {
        el.btnGenerateNextWeekGoals.disabled = false;
      }
    });
  }

  if (el.btnBackRevApproval) el.btnBackRevApproval.addEventListener('click', () => setReviewStep(4));

  if (el.btnRetryRevGoals) {
    el.btnRetryRevGoals.addEventListener('click', async () => {
      el.btnRetryRevGoals.disabled = true;
      try {
        tempReview.generatedGoals = await generateGoalsList(tempReview.goalDays, state.selectedActivities);
        renderApprovalGoals(el.revApprovalGoalsList, tempReview.generatedGoals);
        showToast("Generated new goals with Wellness AI.");
      } catch (error) {
        console.error("Wellness AI next-week goal regeneration failed:", error);
        showToast("Could not reach Wellness AI. Start the AI service and try again.");
      } finally {
        el.btnRetryRevGoals.disabled = false;
      }
    });
  }

  if (el.btnApproveNextWeek) {
    el.btnApproveNextWeek.addEventListener('click', () => {
      state.weeklyGoalDays = tempReview.goalDays;
      state.weeklyRestDays = tempReview.restDays;
      state.weeklyGoals = [...tempReview.generatedGoals];
      state.currentDay = 1;
      state.goalDaysCompletedThisWeek = 0;
      state.restDaysUsedThisWeek = 0;
      state.todayMode = "goal";
      state.todayGoalCompleted = false;
      state.activeGoalIndex = 0;
      state.isMissedDayPenaltyActive = false;
      state.dailyHistory = []; // Fresh week

      saveState();
      el.modalWeekReview.style.display = 'none';
      renderMainView();
      showToast("New week started with approved goals!");
    });
  }

  // =========================================================================
  // 10. SWAP DAILY GOAL MODAL
  // =========================================================================

  function openSwapGoalModal() {
    renderSwapGoalsList();
    el.modalSwapGoal.style.display = 'flex';
  }

  function renderSwapGoalsList() {
    if (!el.swapGoalsList) return;
    el.swapGoalsList.innerHTML = '';

    state.weeklyGoals.forEach((goal, idx) => {
      const item = document.createElement('div');
      const isCur = idx === state.activeGoalIndex;
      item.className = `swap-goal-item ${isCur ? 'current' : ''} ${goal.completed ? 'completed' : ''}`;
      item.innerHTML = `
        <div class="swap-goal-title">${goal.title} ${isCur ? '(Active Today)' : ''} ${goal.completed ? '(Completed)' : ''}</div>
        <div class="swap-goal-meta">${goal.desc} • ${goal.duration}</div>
      `;

      item.addEventListener('click', () => {
        state.activeGoalIndex = idx;
        saveState();
        renderDailyGoalCard();
        el.modalSwapGoal.style.display = 'none';
        showToast(`Swapped to: ${goal.title}`);
      });

      el.swapGoalsList.appendChild(item);
    });
  }

  // =========================================================================
  // 11. REFLECTION JOURNAL (Strictly empty by default)
  // =========================================================================

  function openJournalModal() {
    renderJournalEntries();
    el.modalJournal.style.display = 'flex';
  }

  function renderJournalEntries() {
    if (!el.journalEntriesContainer) return;
    el.journalEntriesContainer.innerHTML = '';

    if (!state.journalEntries || state.journalEntries.length === 0) {
      el.journalEntriesContainer.innerHTML = `
        <p style="font-size:0.8rem; color:var(--text-muted); text-align:center; padding:12px;">
          No reflections yet. Write your reflection for today above.
        </p>
      `;
      return;
    }

    state.journalEntries.forEach(entry => {
      const card = document.createElement('div');
      card.className = 'journal-entry-card';
      card.innerHTML = `
        <div class="journal-entry-date">${entry.date} (${entry.dayType})</div>
        <div class="journal-entry-text">“${entry.text}”</div>
      `;
      el.journalEntriesContainer.appendChild(card);
    });
  }

  if (el.btnSaveReflection) {
    el.btnSaveReflection.addEventListener('click', () => {
      const text = (el.journalText.value || '').trim();
      if (!text) {
        showToast("Please write a reflection before saving.");
        return;
      }

      const dayType = state.todayMode === 'rest' ? 'Rest Day' : 'Goal Day';
      const newEntry = {
        id: Date.now(),
        date: `Day ${state.currentDay}/7`,
        text: text,
        dayType: dayType
      };

      state.journalEntries.unshift(newEntry);
      saveState();
      el.journalText.value = '';
      renderJournalEntries();
      showToast("Reflection saved safely.");
    });
  }

  // =========================================================================
  // 12. MENU DRAWER & PROGRESS VIEW WITH DAY-BY-DAY REPORT
  // =========================================================================

  function openDrawer() {
    el.sideDrawer.classList.add('active');
    el.drawerOverlay.classList.add('active');
  }

  function closeDrawer() {
    el.sideDrawer.classList.remove('active');
    el.drawerOverlay.classList.remove('active');
  }

  function openWeeklyGoalsView() {
    if (!el.weeklyGoalsSummaryList) return;
    el.weeklyGoalsSummaryList.innerHTML = '';

    state.weeklyGoals.forEach((g, idx) => {
      const item = document.createElement('div');
      item.className = 'swap-goal-item';
      item.innerHTML = `
        <div class="swap-goal-title">Goal ${idx + 1}: ${g.title} ${g.completed ? '✓' : ''}</div>
        <div class="swap-goal-meta">${g.desc} • ${g.duration}</div>
      `;
      el.weeklyGoalsSummaryList.appendChild(item);
    });

    el.modalGoalsView.style.display = 'flex';
  }

  // Progress modal: streak, balance, AI analysis, AND Day-by-Day report!
  function openProgressView() {
    if (el.progStreakVal) el.progStreakVal.textContent = state.streakCount;
    if (el.progGoalsDoneVal) el.progGoalsDoneVal.textContent = state.goalDaysCompletedThisWeek;
    if (el.progGoalsTotalVal) el.progGoalsTotalVal.textContent = state.weeklyGoalDays;

    const restRemaining = Math.max(0, state.weeklyRestDays - state.restDaysUsedThisWeek);
    if (el.progRestLeftVal) el.progRestLeftVal.textContent = restRemaining;

    // Render Day-by-Day Log: "Day 1 was goal day. Day 2 was rest day."
    renderDayByDayHistoryLog();

    el.modalProgressView.style.display = 'flex';
  }

  function renderDayByDayHistoryLog() {
    if (!el.progDailyHistoryList) return;
    el.progDailyHistoryList.innerHTML = '';

    const history = state.dailyHistory || [];

    for (let d = 1; d <= 7; d++) {
      const row = document.createElement('div');
      row.className = 'daily-history-item';

      let statusBadge = '';
      let textDesc = '';

      if (d < state.currentDay) {
        const item = history.find(h => h.day === d);
        if (item) {
          if (item.type === 'goal') {
            statusBadge = `<span class="history-status-badge goal">Goal Day</span>`;
            textDesc = `Day ${d} was goal day (completed)`;
          } else if (item.type === 'rest') {
            statusBadge = `<span class="history-status-badge rest">Rest Day</span>`;
            textDesc = `Day ${d} was rest day`;
          } else {
            statusBadge = `<span class="history-status-badge missed">Missed Day</span>`;
            textDesc = `Day ${d} was missed day`;
          }
        } else {
          statusBadge = `<span class="history-status-badge rest">Rest Day</span>`;
          textDesc = `Day ${d} was rest day`;
        }
      } else if (d === state.currentDay) {
        const curModeName = state.todayMode === 'rest' ? 'Rest Day' : 'Goal Day';
        statusBadge = `<span class="history-status-badge current">Today</span>`;
        textDesc = `Day ${d} is currently ${curModeName}`;
      } else {
        statusBadge = `<span class="history-status-badge current">Upcoming</span>`;
        textDesc = `Day ${d} upcoming`;
      }

      row.innerHTML = `
        <span class="history-day-lbl">${textDesc}</span>
        ${statusBadge}
      `;

      el.progDailyHistoryList.appendChild(row);
    }
  }

  function renderActivityCatalog() {
    if (!el.activityCatalogList) return;
    el.activityCatalogList.innerHTML = '';

    ACTIVITY_OPTIONS.forEach(act => {
      const card = document.createElement('div');
      card.className = 'catalog-item-card';
      card.innerHTML = `
        <div class="catalog-item-title">${act.name}</div>
        <div class="catalog-item-desc">${act.desc}</div>
      `;
      el.activityCatalogList.appendChild(card);
    });
  }

  function openActivitiesView() {
    el.modalActivitiesView.style.display = 'flex';
  }

  function showToast(msg) {
    if (!el.toastNotice) return;
    el.toastNotice.textContent = msg;
    el.toastNotice.style.display = 'block';

    setTimeout(() => {
      el.toastNotice.style.display = 'none';
    }, 2800);
  }

  // =========================================================================
  // 13. EVENT LISTENERS
  // =========================================================================

  function setupEventListeners() {
    if (el.toggleGoalDay) el.toggleGoalDay.addEventListener('click', () => setDayMode('goal'));
    if (el.toggleRestDay) el.toggleRestDay.addEventListener('click', () => setDayMode('rest'));

    if (el.btnCheckGoal) {
      el.btnCheckGoal.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleGoalCompletion();
      });
    }

    if (el.goalCard) el.goalCard.addEventListener('click', openSwapGoalModal);
    if (el.btnCloseSwapModal) el.btnCloseSwapModal.addEventListener('click', () => el.modalSwapGoal.style.display = 'none');
    if (el.btnBackFromSwap) el.btnBackFromSwap.addEventListener('click', () => el.modalSwapGoal.style.display = 'none');

    if (el.crocoCharacterBox) el.crocoCharacterBox.addEventListener('click', cycleCrocodileDialogue);
    if (el.crocoSpeechBubble) el.crocoSpeechBubble.addEventListener('click', cycleCrocodileDialogue);

    if (el.btnNextDay) el.btnNextDay.addEventListener('click', handleNextDayClick);

    // Morning Check-in "Go back" buttons
    if (el.btnCloseCheckin) el.btnCloseCheckin.addEventListener('click', () => el.modalMorningCheckin.style.display = 'none');
    if (el.btnBackFromCheckin) el.btnBackFromCheckin.addEventListener('click', () => el.modalMorningCheckin.style.display = 'none');

    // Journal Modal "Go back"
    if (el.btnOpenJournal) el.btnOpenJournal.addEventListener('click', openJournalModal);
    if (el.btnCloseJournalModal) el.btnCloseJournalModal.addEventListener('click', () => el.modalJournal.style.display = 'none');
    if (el.btnBackFromJournal) el.btnBackFromJournal.addEventListener('click', () => el.modalJournal.style.display = 'none');

    // Weekly Review "Go back"
    if (el.btnCloseWeekReview) el.btnCloseWeekReview.addEventListener('click', () => el.modalWeekReview.style.display = 'none');

    // Drawer Menu
    if (el.btnOpenMenu) el.btnOpenMenu.addEventListener('click', openDrawer);
    if (el.btnCloseDrawer) el.btnCloseDrawer.addEventListener('click', closeDrawer);
    if (el.drawerOverlay) el.drawerOverlay.addEventListener('click', closeDrawer);

    if (el.drawerLinkGoals) {
      el.drawerLinkGoals.addEventListener('click', () => {
        closeDrawer();
        openWeeklyGoalsView();
      });
    }
    if (el.btnCloseGoalsView) el.btnCloseGoalsView.addEventListener('click', () => el.modalGoalsView.style.display = 'none');
    if (el.btnBackFromGoalsView) el.btnBackFromGoalsView.addEventListener('click', () => el.modalGoalsView.style.display = 'none');

    if (el.drawerLinkProgress) {
      el.drawerLinkProgress.addEventListener('click', () => {
        closeDrawer();
        openProgressView();
      });
    }
    if (el.btnCloseProgressView) el.btnCloseProgressView.addEventListener('click', () => el.modalProgressView.style.display = 'none');
    if (el.btnBackFromProgress) el.btnBackFromProgress.addEventListener('click', () => el.modalProgressView.style.display = 'none');

    if (el.drawerLinkActivities) {
      el.drawerLinkActivities.addEventListener('click', () => {
        closeDrawer();
        openActivitiesView();
      });
    }
    if (el.btnCloseActivitiesView) el.btnCloseActivitiesView.addEventListener('click', () => el.modalActivitiesView.style.display = 'none');
    if (el.btnBackFromActivities) el.btnBackFromActivities.addEventListener('click', () => el.modalActivitiesView.style.display = 'none');

    // Access Weekly Check-in from Menu anytime
    if (el.drawerLinkWeekReview) {
      el.drawerLinkWeekReview.addEventListener('click', () => {
        closeDrawer();
        launchWeeklyReviewModal();
      });
    }
  }

  initApp();

})();
