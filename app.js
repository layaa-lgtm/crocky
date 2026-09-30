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
    { id: "walking", name: "Cardio", desc: "Steady walking, jogging, cycling, or other activities that raise your heart rate." },
    { id: "yoga", name: "Upper Body Strength", desc: "Exercises that strengthen the arms, shoulders, chest, and upper back." },
    { id: "bodyweight", name: "Lower Body Strength", desc: "Exercises that strengthen the legs, hips, and glutes, such as squats and lunges." },
    { id: "cycling", name: "Core", desc: "Exercises that strengthen the abdomen, lower back, and muscles that stabilize your torso." },
    { id: "dancing", name: "Flexibility", desc: "Gentle stretching and mobility work to improve comfortable range of motion." },
    { id: "mobility", name: "Balance", desc: "Controlled standing exercises that improve stability, coordination, and body awareness." },
    // OOGYBOOGY: The final two legacy activity choices are retained here only as commented history; the user-facing list now contains six activities. // OOGAWOOGA
    // { id: "swimming", name: "Swimming", desc: "Easy floating or smooth laps with zero joint impact." }, // OOGAWOOGA
    // { id: "nature", name: "Nature Strolls", desc: "Walking on natural trails or green parks." } // OOGAWOOGA
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
    // OOGYBOOGY: Persist the week number so journal entries can be grouped across the full app lifetime.
    weekNumber: 1,
    // Actual completed exercise interval, captured independently each day.
    goalTime: { startTime: "", endTime: "", day: 0 },
    // OOGYBOOGY: Goal times belong to one day and are refreshed for every new day. 
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
    readinessDemoWeeks: {},
    readinessMeasurements: {},
    exerciseSessions: [],
    journalEntries: [] // Strictly empty by default
  };

  let state = loadState();

// OOGYBOOGY: Store the action that should run after the user logs goal time; time entry is requested only after a positive completion choice.
let pendingGoalTimeAction = null;

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const restored = Object.assign({}, defaultState, JSON.parse(saved));
        // OOGYBOOGY: Migrate older saved journal entries into the new week/day structure without deleting existing data.
        restored.weekNumber = Number(restored.weekNumber || 1);
        restored.goalTime = Object.assign({}, defaultState.goalTime, restored.goalTime || {});
        restored.goalTime.day = Number(restored.goalTime.day || 0);
        restored.journalEntries = (restored.journalEntries || []).map((entry) => ({
          ...entry,
          week: Number(entry.week || entry.weekNumber || 1),
          day: Number(entry.day || String(entry.date || "Day 1/7").match(/Day\s+(\d+)/)?.[1] || 1),
          date: entry.date || `Week ${Number(entry.week || entry.weekNumber || 1)} Day ${Number(entry.day || 1)}/7`
        }));
        return restored;
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

  // OOGYBOOGY: Optional context is additive; existing callers remain valid.
  async function generateGoalsList(count, activities, context = {}) {
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
      regeneration_offset: Math.floor(Math.random() * 1000),
      ...context
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
    displayWeekNumber: document.getElementById('displayWeekNumber'),
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
    goalTimeDisplay: document.getElementById('goalTimeDisplay'),
    btnCheckGoal: document.getElementById('btnCheckGoal'),
    // OOGYBOOGY: Unlimited regeneration control for the current unresolved goal.
    btnRegenerateGoal: document.getElementById('btnRegenerateGoal'),
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

    revQ4ActivityBlock: document.getElementById('revQ4ActivityBlock'),
    revQ4ActivityChoices: document.getElementById('revQ4ActivityChoices'),
    btnBackRev4Activity: document.getElementById('btnBackRev4Activity'),
    btnNextRev4Activity: document.getElementById('btnNextRev4Activity'),
    reviewActivityChangeNote: document.getElementById('reviewActivityChangeNote'),
    revQ5Block: document.getElementById('revQ5Block'),
    revGoalDaysDisplay: document.getElementById('revGoalDaysDisplay'),
    revRestDaysDisplay: document.getElementById('revRestDaysDisplay'),
    revDaysGrid: document.getElementById('revDaysGrid'),
    btnBackRev5: document.getElementById('btnBackRev5'),
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
    // OOGYBOOGY: Dedicated menu journal-history view keeps the existing reflection-entry modal intact.
    modalJournalHistory: document.getElementById('modalJournalHistory'),
    btnCloseJournalHistory: document.getElementById('btnCloseJournalHistory'),
    btnBackFromJournalHistory: document.getElementById('btnBackFromJournalHistory'),
    journalHistoryContainer: document.getElementById('journalHistoryContainer'),

    // OOGYBOOGY: Goal status / feedback modal supports Completed and Tried without renaming the existing goal button.
    modalGoalStatus: document.getElementById('modalGoalStatus'),
    btnCloseGoalStatus: document.getElementById('btnCloseGoalStatus'),
    btnGoalCompleted: document.getElementById('btnGoalCompleted'),
    btnGoalTried: document.getElementById('btnGoalTried'),
    triedFeedbackBox: document.getElementById('triedFeedbackBox'),
    triedFeedbackText: document.getElementById('triedFeedbackText'),
    btnSaveTriedFeedback: document.getElementById('btnSaveTriedFeedback'),

    // OOGYBOOGY: Missed-day feedback is recorded in the same persistent journal.
    missedDayFeedbackText: document.getElementById('missedDayFeedbackText'),
    btnSaveMissedFeedback: document.getElementById('btnSaveMissedFeedback'),

    // OOGYBOOGY: Goal-time modal stores two 12-hour inputs.
    modalGoalTime: document.getElementById('modalGoalTime'),
    btnOpenGoalTime: document.getElementById('btnOpenGoalTime'),
    goalTimeShortcutRow: document.getElementById('goalTimeShortcutRow'),
    btnCloseGoalTime: document.getElementById('btnCloseGoalTime'),
    btnSaveGoalTime: document.getElementById('btnSaveGoalTime'),
    goalStartHour: document.getElementById('goalStartHour'),
    goalStartMinute: document.getElementById('goalStartMinute'),
    goalStartAmPm: document.getElementById('goalStartAmPm'),
    goalEndHour: document.getElementById('goalEndHour'),
    goalEndMinute: document.getElementById('goalEndMinute'),
    goalEndAmPm: document.getElementById('goalEndAmPm'),

    // OOGYBOOGY: Bonus-day generation reuses the existing AI goal endpoint.
    btnGenerateBonusGoal: document.getElementById('btnGenerateBonusGoal'),

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
    // OOGYBOOGY: Journal History is intentionally placed immediately below Weekly Check-in in the menu.
    drawerLinkJournalHistory: document.getElementById('drawerLinkJournalHistory'),

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
    // OOGYBOOGY: Separate analysis blocks requested under Progress.
    progWeeklyAnalysisText: document.getElementById('progWeeklyAnalysisText'),
    progGoalSpecificAnalysisList: document.getElementById('progGoalSpecificAnalysisList'),

    modalActivitiesView: document.getElementById('modalActivitiesView'),
    btnCloseActivitiesView: document.getElementById('btnCloseActivitiesView'),
    btnBackFromActivities: document.getElementById('btnBackFromActivities'),
    activityCatalogList: document.getElementById('activityCatalogList'),

    toastNotice: document.getElementById('toastNotice')
  };

  let tempOnboarding = {
    activities: [],
    // OOGYBOOGY: Introductory "Why" question removed; preserve backend-compatible state field as empty.
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
    activity: "",
    activityChanged: false,
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
    // OOGYBOOGY: The introductory "Why" question is removed from the active flow.
    const steps = [
      el.stepActivities,
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
      // OOGYBOOGY: The introduction activity questionnaire is single-choice; retain the existing array payload for backend compatibility.
      el.bubbleActivities.querySelectorAll('.choice-bubble').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const val = btn.getAttribute('data-value');
      tempOnboarding.activities = [val];
      el.btnNextActivities.disabled = false;
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

  // OOGYBOOGY: Render weekly goals with an explicit keep/regenerate selection.
  function renderApprovalGoals(container, goals) {
    if (!container) return;
    container.innerHTML = '';
    goals.forEach((g, idx) => {
      const card = document.createElement('label');
      card.className = 'approval-goal-card selectable';
      card.innerHTML = `
        <input type="checkbox" class="approval-goal-checkbox" data-goal-index="${idx}" checked>
        <div class="approval-goal-copy">
          <div class="approval-goal-title">Goal ${idx + 1}: ${g.title}</div>
          <div class="approval-goal-desc">${g.desc} (${g.duration})</div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // OOGYBOOGY: Return only goals the user explicitly kept.
  function getSelectedApprovalGoals(container, goals) {
    if (!container) return [...goals];
    const selected = Array.from(container.querySelectorAll('.approval-goal-checkbox:checked'))
      .map(input => goals[Number(input.getAttribute('data-goal-index'))])
      .filter(Boolean);
    return selected;
  }

  // OOGYBOOGY: Regenerate only the goals the user did not approve, preserving selected goal objects.
  async function regenerateUnselectedGoals(container, goals, requiredCount, activities) {
    const selected = getSelectedApprovalGoals(container, goals);
    const missing = Math.max(0, requiredCount - selected.length);
    if (missing === 0) {
      showToast("All selected goals are being kept.");
      return goals;
    }

    const replacements = await generateGoalsList(missing, activities);
    return selected.concat(replacements).map((goal, idx) => ({
      ...goal,
      id: idx + 1,
      goalId: goal.goalId || `goal_${idx + 1}`,
      status: goal.status || "pending",
      completed: false
    }));
  }

  // Onboarding Step Handlers
  // OOGYBOOGY: Skip the removed introductory "Why" question while retaining its old handlers as comments. // OOGAWOOGA
  if (el.btnNextActivities) el.btnNextActivities.addEventListener('click', () => setOnboardingStep(2));
  if (el.btnBackStruggle) el.btnBackStruggle.addEventListener('click', () => setOnboardingStep(1));
  if (el.btnNextStruggle) el.btnNextStruggle.addEventListener('click', () => setOnboardingStep(3));
  if (el.btnBackTracker) el.btnBackTracker.addEventListener('click', () => setOnboardingStep(2));
  if (el.btnNextTracker) el.btnNextTracker.addEventListener('click', () => setOnboardingStep(4));
  if (el.btnBackCompanion) el.btnBackCompanion.addEventListener('click', () => setOnboardingStep(3));
  // if (el.btnBackWhy) el.btnBackWhy.addEventListener('click', () => setOnboardingStep(1)); // OOGAWOOGA
  // if (el.btnNextWhy) el.btnNextWhy.addEventListener('click', () => setOnboardingStep(3)); // OOGAWOOGA

  if (el.btnNextCompanion) {
    el.btnNextCompanion.addEventListener('click', () => {
      state.userName = el.inputUserName.value.trim();
      state.crocoName = el.inputCrocoName.value.trim();
      setOnboardingStep(5);
    });
  }

  if (el.btnBackDaysSelection) el.btnBackDaysSelection.addEventListener('click', () => setOnboardingStep(4));

  if (el.btnGenerateInitialGoals) {
    el.btnGenerateInitialGoals.addEventListener('click', async () => {
      el.btnGenerateInitialGoals.disabled = true;
      try {
        tempOnboarding.generatedGoals = await generateGoalsList(tempOnboarding.goalDays, tempOnboarding.activities);
        renderApprovalGoals(el.approvalGoalsContainer, tempOnboarding.generatedGoals);
        setOnboardingStep(6);
      } catch (error) {
        console.error("Wellness AI goal generation failed:", error);
        showToast("Could not reach Wellness AI. Start the AI service and try again.");
      } finally {
        el.btnGenerateInitialGoals.disabled = false;
      }
    });
  }

  if (el.btnBackGoalApproval) {
    el.btnBackGoalApproval.addEventListener('click', () => setOnboardingStep(5));
  }

  if (el.btnRetryGoals) {
    el.btnRetryGoals.addEventListener('click', async () => {
      el.btnRetryGoals.disabled = true;
      try {
        // OOGYBOOGY: Regenerate only the unchecked initial goals instead of discarding approved ones.
        tempOnboarding.generatedGoals = await regenerateUnselectedGoals(
          el.approvalGoalsContainer,
          tempOnboarding.generatedGoals,
          tempOnboarding.goalDays,
          tempOnboarding.activities
        );
        renderApprovalGoals(el.approvalGoalsContainer, tempOnboarding.generatedGoals);
        showToast("Regenerated only the goals you did not keep.");
      } catch (error) {
        console.error("Wellness AI goal regeneration failed:", error);
        showToast("Could not reach Wellness AI. Start the AI service and try again.");
      } finally {
        el.btnRetryGoals.disabled = false;
      }
    });
  }

  if (el.btnApproveAndStart) {
    el.btnApproveAndStart.addEventListener('click', async () => {
      // OOGYBOOGY: If the user skipped regeneration, automatically replace unchecked goals before approval.
      const selectedBeforeApproval = getSelectedApprovalGoals(el.approvalGoalsContainer, tempOnboarding.generatedGoals);
      if (selectedBeforeApproval.length < tempOnboarding.goalDays) {
        try {
          el.btnApproveAndStart.disabled = true;
          tempOnboarding.generatedGoals = await regenerateUnselectedGoals(
            el.approvalGoalsContainer,
            tempOnboarding.generatedGoals,
            tempOnboarding.goalDays,
            tempOnboarding.activities
          );
        } catch (error) {
          console.error("Initial goal replacement failed:", error);
          showToast("Could not regenerate the goals you did not select.");
          el.btnApproveAndStart.disabled = false;
          return;
        } finally {
          el.btnApproveAndStart.disabled = false;
        }
      }
      state.selectedActivities = [...tempOnboarding.activities];
      // OOGYBOOGY: Removed onboarding Why question; preserve existing backend field without collecting it.
      state.selectedWhy = "";
      state.selectedStruggle = tempOnboarding.struggle;
      state.selectedTracker = tempOnboarding.tracker;
      state.weeklyGoalDays = tempOnboarding.goalDays;
      state.weeklyRestDays = tempOnboarding.restDays;
      // OOGYBOOGY: Approve only checked goals; unchecked goals are regenerated before the week starts.
      const selectedInitialGoals = getSelectedApprovalGoals(el.approvalGoalsContainer, tempOnboarding.generatedGoals);
      state.weeklyGoals = selectedInitialGoals.length === tempOnboarding.goalDays
        ? selectedInitialGoals
        : [...tempOnboarding.generatedGoals];
      state.weeklyGoals = state.weeklyGoals.map((goal, idx) => ({ ...goal, id: idx + 1, status: "pending", completed: false }));
      state.goalsApproved = true;
      state.onboardingDone = true;
      state.currentDay = 1;
      // OOGYBOOGY: The first approved routine is Week 1; later weeks increment this value without resetting streakCount.
      state.weekNumber = Number(state.weekNumber || 1);
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


  // OOGYBOOGY: Goal-time helper returns only today's timing, preventing yesterday's time from carrying forward.
  function getTodayGoalTime() {
    const gt = state.goalTime || {};
    return Number(gt.day) === Number(state.currentDay) && gt.startTime && gt.endTime
      ? `${gt.startTime} – ${gt.endTime}`
      : "";
  }

  function hasTodayGoalTime() {
    return Boolean(getTodayGoalTime());
  }

  function renderMainView() {
    renderReadiness();
    const totalGoals = state.weeklyGoals.length;
    // OOGYBOOGY: completed=true means the goal day has been resolved; status distinguishes Completed vs Tried.
    const completedGoalsCount = state.weeklyGoals.filter(g => g.completed).length;
    const remainingGoals = Math.max(0, state.weeklyGoalDays - completedGoalsCount);
    const remainingRestDays = Math.max(0, state.weeklyRestDays - state.restDaysUsedThisWeek);

    // Rule: If all goal days are completed, default user into rest mode for remaining days
    // OOGYBOOGY: A resolved goal day (Completed or Tried) is no longer left in the weekly queue.
    const allGoalsCompleted = completedGoalsCount >= state.weeklyGoalDays && state.weeklyGoalDays > 0;
    // Rule: If all rest days are used up, default user into goal mode
    const allRestDaysUsed = remainingRestDays <= 0 && state.weeklyRestDays > 0;

    // OOGYBOOGY: Keep Bonus Day active once the user has intentionally entered it.
    if (allGoalsCompleted && state.todayMode !== "bonus") {
      state.todayMode = "rest";
    } else if (allRestDaysUsed && state.todayMode !== "bonus") {
      state.todayMode = "goal";
    }

    // Top Bar Status
    if (el.displayStreak) el.displayStreak.textContent = state.streakCount;
    if (el.displayWeekNumber) el.displayWeekNumber.textContent = `Week ${state.weekNumber}`;

    // Day Progress Tracker: Day X/7 | Goals left: Y | Rest days left: Z
    if (el.currentDayLabel) el.currentDayLabel.textContent = `Day ${state.currentDay}/7`;
    if (el.goalsLeftCount) el.goalsLeftCount.textContent = remainingGoals;
    if (el.restDaysLeftCount) el.restDaysLeftCount.textContent = remainingRestDays;

    // Day Status Switch accessibility rules
    if (el.toggleGoalDay && el.toggleRestDay) {
      // OOGYBOOGY: Bonus Day keeps the goal-side tab visually active while using its distinct class/color.
      el.toggleGoalDay.classList.toggle('active', state.todayMode === 'goal' || state.todayMode === 'bonus');
      el.toggleRestDay.classList.toggle('active', state.todayMode === 'rest');

      if (allGoalsCompleted) {
        // OOGYBOOGY: After all required goal days are resolved, the goal tab becomes BONUS DAY while rest remains available.
        el.toggleGoalDay.disabled = remainingRestDays <= 0;
        el.toggleGoalDay.textContent = "BONUS DAY";
        el.toggleGoalDay.classList.add('bonus-day-toggle');
        el.toggleGoalDay.title = remainingRestDays > 0 ? "Use a bonus day before spending a rest day." : "No rest days remain for a bonus day.";
        el.toggleRestDay.disabled = false;
      } else if (allRestDaysUsed || state.isMissedDayPenaltyActive) {
        // Locked in goal mode! (no access to rest mode)
        el.toggleRestDay.disabled = true;
        el.toggleRestDay.title = "Rest day is not accessible.";
        el.toggleGoalDay.disabled = false;
      } else {
        // OOGYBOOGY: Restore the normal Goal Day label before the required goals are all resolved.
        el.toggleGoalDay.disabled = false;
        el.toggleRestDay.disabled = false;
        el.toggleGoalDay.textContent = "Goal Day";
        el.toggleGoalDay.classList.remove('bonus-day-toggle');
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

    // OOGYBOOGY: Show the bonus-generation control only after all required goal days are resolved.
    if (el.btnGenerateBonusGoal) {
      const hasUnfinishedBonus = state.weeklyGoals.some(g => g.bonus && !g.completed);
      el.btnGenerateBonusGoal.style.display = (allGoalsCompleted && state.todayMode === 'bonus' && !hasUnfinishedBonus) ? 'inline-flex' : 'none';
    }

    renderCrocodile();

    // OOGYBOOGY: Login Goal Time is available only on goal/bonus days, never on rest days.
    if (el.goalTimeShortcutRow) {
      el.goalTimeShortcutRow.style.display = (state.todayMode === 'rest') ? 'none' : 'flex';
    }

    // OOGYBOOGY: Gate Weekly Check-in access at the menu level as well as in launchWeeklyReviewModal().
    if (el.drawerLinkWeekReview) {
      el.drawerLinkWeekReview.disabled = state.currentDay !== 7;
      el.drawerLinkWeekReview.title = state.currentDay === 7 ? "Open Weekly Check-in" : "Available on Day 7 only";
    }

    if (el.drawerUserName) el.drawerUserName.textContent = state.userName || "User";
    if (el.drawerCrocoName) el.drawerCrocoName.textContent = `Companion: ${state.crocoName || "Crocodile"}`;
  }

  function renderDailyGoalCard() {
    renderReadiness();
    if (!state.weeklyGoals || state.weeklyGoals.length === 0) return;

    // OOGYBOOGY: Bonus Day uses a generated bonus goal in the same card location.
    if (state.todayMode === 'bonus') {
      const bonusGoal = state.weeklyGoals.find(g => g.bonus && !g.completed);
      if (el.goalIndexText) el.goalIndexText.textContent = "BONUS DAY";
      if (el.goalCardTitle) el.goalCardTitle.textContent = bonusGoal ? bonusGoal.title : "Bonus Day";
      if (el.goalCardDesc) el.goalCardDesc.textContent = bonusGoal ? bonusGoal.desc : "Generate something optional for today.";
      if (el.goalDurationTag) el.goalDurationTag.textContent = bonusGoal ? bonusGoal.duration : "Flexible";
      if (el.goalTimeDisplay) el.goalTimeDisplay.textContent = getTodayGoalTime() ? `Goal time: ${getTodayGoalTime()}` : "Goal time not logged";
      if (el.btnCheckGoal) {
        el.btnCheckGoal.classList.toggle('completed', Boolean(bonusGoal?.completed));
        el.goalCheckText.textContent = bonusGoal?.completed ? "Completed ✓" : "Finish Bonus Day";
      }
      return;
    }

    const currentGoal = state.weeklyGoals[state.activeGoalIndex] || state.weeklyGoals[0];
    const totalGoals = state.weeklyGoals.length;

    if (el.goalIndexText) el.goalIndexText.textContent = `Goal ${state.activeGoalIndex + 1} of ${totalGoals}`;
    if (el.goalCardTitle) el.goalCardTitle.textContent = currentGoal.title;
    if (el.goalCardDesc) el.goalCardDesc.textContent = currentGoal.desc;
    if (el.goalDurationTag) el.goalDurationTag.textContent = currentGoal.duration;
    // OOGYBOOGY: Show today's logged goal time directly on the goal card.
    const todayGoalTime = getTodayGoalTime();
    if (el.goalTimeDisplay) el.goalTimeDisplay.textContent = todayGoalTime ? `Goal time: ${todayGoalTime}` : "Goal time not logged";

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

    // Streak ended / missed day
    if (state.isMissedDayPenaltyActive) {
      mode = 'dull';

    // Rest day
    } else if (state.todayMode === 'rest') {
      mode = 'rest';

    // Goal / working day
    } else {
      mode = 'happy';
    }

    // Use the appropriate GIF
    if (el.crocoImage) {
      if (mode === 'dull') {
        el.crocoImage.src = 'assets/Tired_Crocky.gif';
      } else if (mode === 'rest') {
        el.crocoImage.src = 'assets/Rest_Crocky.gif';
      } else {
        el.crocoImage.src = 'assets/Happy_Crocky.gif';
      }
    }

    if (el.speechCrocoName) {
      el.speechCrocoName.textContent = state.crocoName || "Crocodile";
    }

    const pool = DIALOGUES[mode] || DIALOGUES.happy;

    if (!el.speechQuoteText.textContent || state.isMissedDayPenaltyActive) {
      el.speechQuoteText.textContent =
        `"${pool[Math.floor(Math.random() * pool.length)]}"`;
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
      // OOGYBOOGY: The existing Goal Day control becomes the Bonus Day after all required goals are resolved.
      if (remainingRestDays <= 0) {
        showToast("No rest day is available to use for a bonus day.");
        return;
      }
      state.todayMode = 'bonus';
      saveState();
      renderMainView();
      if (!state.weeklyGoals.some(g => g.bonus && !g.completed)) showToast("Generate a bonus goal for today.");
      return;
    }

    if (newMode === 'rest' && (remainingRestDays <= 0 || state.isMissedDayPenaltyActive)) {
      showToast("You’ve used up all your rest days. Chase your goals now.");
      return;
    }

    state.todayMode = newMode;
    // OOGYBOOGY: Closing the goal-time dialog when entering Rest Day prevents time entry on rest days.
    if (newMode === 'rest' && el.modalGoalTime) el.modalGoalTime.style.display = 'none';
    saveState();
    renderMainView();
    cycleCrocodileDialogue();
  }

  // OOGYBOOGY: Goal completion status now has two positive outcomes: Completed and Tried.
  function getActiveGoalForStatus() {
    if (state.todayMode === 'bonus') return state.weeklyGoals.find(g => g.bonus && !g.completed);
    return state.weeklyGoals[state.activeGoalIndex];
  }

  function openGoalStatusModal() {
    const goal = getActiveGoalForStatus();
    if (!goal) {
      showToast("Generate or select a goal first.");
      return;
    }
    if (el.triedFeedbackBox) el.triedFeedbackBox.style.display = 'none';
    if (el.triedFeedbackText) el.triedFeedbackText.value = '';
    if (el.modalGoalStatus) el.modalGoalStatus.style.display = 'flex';
  }

  function closeGoalStatusModal() {
    if (el.modalGoalStatus) el.modalGoalStatus.style.display = 'none';
  }

  function applyGoalStatus(status, feedbackText = '') {
    const goal = getActiveGoalForStatus();
    if (!goal) return false;
    // OOGYBOOGY: Login Goal Time is requested only after the user explicitly chooses Completed, never before the Completed/Tried choice.
    if (status === 'completed' && (state.todayMode === 'goal' || state.todayMode === 'bonus') && !hasTodayGoalTime()) {
      closeGoalStatusModal();
      pendingGoalTimeAction = () => applyGoalStatus('completed', feedbackText);
      showToast("Please enter your Start time and End time to confirm completion.");
      if (el.btnOpenGoalTime) el.btnOpenGoalTime.click();
      return;
    }
    if (!goal) return false;

    const wasResolved = Boolean(goal.completed);
    goal.status = status;
    goal.completed = true;
    goal.triedFeedback = status === 'tried' ? feedbackText : '';
    captureExerciseSession(goal, status);
    // OOGYBOOGY: Save this day's status and its login time immediately so Progress retains the timing even after day rollover.
    recordDayHistory(state.currentDay, state.todayMode === 'bonus' ? 'bonus' : 'goal');

    if (!wasResolved) {
      // OOGYBOOGY: Bonus days add to the streak but do not inflate the required weekly goal count.
      if (!goal.bonus) state.goalDaysCompletedThisWeek += 1;
      state.streakCount += 1;
    }
    state.todayGoalCompleted = true;
    if (state.isMissedDayPenaltyActive) state.isMissedDayPenaltyActive = false;

    // OOGYBOOGY: Tried feedback is stored in Journal History as a distinct "Tried day" entry.
    if (status === 'tried' && feedbackText) {
      addJournalEntry(`Tried day`, feedbackText, 'Tried day');
    }

    if (state.todayMode === 'bonus') {
      // OOGYBOOGY: Completing or trying a bonus day consumes one remaining rest day.
      state.restDaysUsedThisWeek += 1;
      state.todayMode = 'rest';
      showToast(status === 'completed' ? "Bonus day completed! Your effort counts." : "Bonus day tried! Your effort still counts.");
    } else {
      showToast(status === 'completed' ? "Completed! You showed up for yourself today." : "Tried! Your effort counts, and your streak is safe.");
    }

    closeGoalStatusModal();
    saveState();
    renderMainView();
    return true;
  }

  // OOGYBOOGY: A tiny feedback step appears only for Tried.
  if (el.btnGoalCompleted) el.btnGoalCompleted.addEventListener('click', () => applyGoalStatus('completed'));
  if (el.btnGoalTried) el.btnGoalTried.addEventListener('click', () => {
    if (el.triedFeedbackBox) el.triedFeedbackBox.style.display = 'block';
  });
  if (el.btnSaveTriedFeedback) el.btnSaveTriedFeedback.addEventListener('click', () => {
    const feedback = (el.triedFeedbackText?.value || '').trim();
    applyGoalStatus('tried', feedback || 'No reason provided.');
  });
  if (el.btnCloseGoalStatus) el.btnCloseGoalStatus.addEventListener('click', closeGoalStatusModal);

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
    // OOGYBOOGY: Moving forward starts with the existing completion question. Login Goal Time is never shown just because Next Day was pressed.
    const lastMode = state.todayMode;
    const wasCompleted = state.todayGoalCompleted || Boolean(getActiveGoalForStatus()?.completed);

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
          // OOGYBOOGY: A Yes answer means the user says they finished; only now do we request login time if it has not already been entered.
          const finishAfterTime = () => {
            pendingGoalTimeAction = null;
            const resolved = applyGoalStatus('completed');
            // OOGYBOOGY: Completion from the morning check-in advances only after the completion status is recorded.
            if (resolved) advanceDay();
          };
          if (!hasTodayGoalTime()) {
            pendingGoalTimeAction = finishAfterTime;
            if (el.btnOpenGoalTime) el.btnOpenGoalTime.click();
          } else {
            finishAfterTime();
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
          // OOGYBOOGY: Do not silently reset the streak; require the requested missed-day feedback first.
          btnReset.addEventListener('click', () => {
            showMissedDayFeedback();
          });
          choicesBox.appendChild(btnReset);
        }
      }
    }
  }

  // OOGYBOOGY: Streak-reset days require a short explanation before advancing.
  function showMissedDayFeedback() {
    const container = el.checkinQuestionsContainer;
    container.innerHTML = `
      <div class="checkin-card warn-highlight">
        <h4 class="checkin-q-title">Today became a missed day.</h4>
        <p class="checkin-q-sub">Your streak will reset, but your honest explanation can help you understand your limits.</p>
      </div>
      <div class="journal-input-box">
        <label for="missedDayFeedbackText" class="field-label">Why did you miss the day?</label>
        <textarea id="missedDayFeedbackText" class="text-area" rows="3" placeholder="Time management, something came up, difficulty, energy, or anything else..."></textarea>
      </div>
      <div class="checkin-actions-stack">
        <button type="button" class="btn-checkin-act warn" id="btnSaveMissedFeedback">Save & continue</button>
      </div>
    `;
    el.missedDayFeedbackText = document.getElementById('missedDayFeedbackText');
    el.btnSaveMissedFeedback = document.getElementById('btnSaveMissedFeedback');
    el.btnSaveMissedFeedback.addEventListener('click', () => {
      const feedback = (el.missedDayFeedbackText.value || '').trim();
      if (!feedback) {
        showToast("Please add a short explanation.");
        return;
      }
      // OOGYBOOGY: Persist missed-day feedback as a journal entry titled "Missed day".
      addJournalEntry('Missed day', feedback, 'Missed day');
      state.streakCount = 0;
      state.isMissedDayPenaltyActive = true;
      state.todayMode = 'goal';
      recordDayHistory(state.currentDay, 'missed');
      saveState();
      advanceDay();
    });
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
    // OOGYBOOGY: Keep explicit day statuses so analysis can distinguish Completed/Tried/Bonus/Missed.
    state.dailyHistory.push({
      day: dayNum,
      week: Number(state.weekNumber || 1),
      type: type,
      goalStatus: (type === 'goal' || type === 'bonus') ? (getActiveGoalForStatus()?.status || 'pending') : null,
      goalTime: type === 'goal' || type === 'bonus' ? getTodayGoalTime() : ""
    });
  }

  function advanceDay() {
    el.modalMorningCheckin.style.display = 'none';
    state.todayGoalCompleted = false;

    // OOGYBOOGY: Continue selecting the next unresolved required goal while preserving the existing activeGoalIndex field.
    const nextUncompletedIdx = state.weeklyGoals.findIndex(g => !g.completed && !g.bonus);
    if (nextUncompletedIdx !== -1) {
      state.activeGoalIndex = nextUncompletedIdx;
    }

    // OOGYBOOGY: Refresh goal-time entry for the new day.
    state.goalTime = { startTime: "", endTime: "", day: 0 };

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
    // OOGYBOOGY: Weekly Check-in is only accessible during Day 7.
    if (state.currentDay !== 7) {
      showToast("Weekly Check-in opens only on Day 7 of the week.");
      return;
    }
    tempReview = {
      q1: "",
      q2: "",
      q3: "",
      activity: (state.selectedActivities || [])[0] || "",
      activityChanged: false,
      goalDays: state.weeklyGoalDays || 3,
      restDays: state.weeklyRestDays || 4,
      generatedGoals: []
    };

    // OOGYBOOGY: Preselect the current activity in the new weekly-review activity question.
    if (el.revQ4ActivityChoices) {
      el.revQ4ActivityChoices.querySelectorAll('.choice-bubble').forEach(btn => {
        btn.classList.toggle('selected', btn.getAttribute('data-activity') === tempReview.activity);
      });
      if (el.btnNextRev4Activity) el.btnNextRev4Activity.disabled = !tempReview.activity;
    }
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
    // OOGYBOOGY: Weekly review now includes an activity choice before next-week goal generation.
    const blocks = [
      el.revReportBlock,
      el.revQ1Block,
      el.revQ2Block,
      el.revQ3Block,
      el.revQ4ActivityBlock,
      el.revQ5Block,
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

  // OOGYBOOGY: Activity choice during weekly review; changing it marks the next week's difficulty for a moderate reset.
  if (el.revQ4ActivityChoices) {
    el.revQ4ActivityChoices.addEventListener('click', (e) => {
      const btn = e.target.closest('.choice-bubble');
      if (!btn) return;
      el.revQ4ActivityChoices.querySelectorAll('.choice-bubble').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      tempReview.activity = btn.getAttribute('data-activity');
      tempReview.activityChanged = tempReview.activity !== ((state.selectedActivities || [])[0] || '');
      if (el.reviewActivityChangeNote) {
        el.reviewActivityChangeNote.textContent = tempReview.activityChanged
          ? 'Activity changed. Next week starts at Moderate difficulty.'
          : 'Same activity selected. Your existing difficulty preferences can continue.';
      }
      el.btnNextRev4Activity.disabled = false;
    });
  }
  if (el.btnBackRev4Activity) el.btnBackRev4Activity.addEventListener('click', () => setReviewStep(3));
  if (el.btnNextRev4Activity) el.btnNextRev4Activity.addEventListener('click', () => setReviewStep(5));
  if (el.btnBackRev5) el.btnBackRev5.addEventListener('click', () => setReviewStep(4));

  // Step 5: MANDATORY GOAL VIEW, REVIEW & APPROVAL
  if (el.btnGenerateNextWeekGoals) {
    el.btnGenerateNextWeekGoals.addEventListener('click', async () => {
      el.btnGenerateNextWeekGoals.disabled = true;
      try {
        // OOGYBOOGY: Pass Completed/Tried/missed history forward so the existing AI backend can account for limitations.
        const nextActivity = tempReview.activity || (state.selectedActivities || [])[0];
        const nextGoalContext = {
          previous_week_data: {
            planned_work_days: state.weeklyGoalDays,
            completed_work_days: state.weeklyGoals.filter(g => g.status === 'completed').length,
            tried_work_days: state.weeklyGoals.filter(g => g.status === 'tried').length,
            missed_days: (state.dailyHistory || []).filter(h => h.type === 'missed').length,
            feedback: (state.journalEntries || []).filter(e => e.week === state.weekNumber)
              .map(e => e.text).join('\n')
          },
          // OOGYBOOGY: A switched activity explicitly starts the new week at moderate difficulty.
          ...(tempReview.activityChanged ? { difficulty: "moderate" } : {})
        };
        tempReview.generatedGoals = await generateGoalsList(tempReview.goalDays, [nextActivity], nextGoalContext);
        renderApprovalGoals(el.revApprovalGoalsList, tempReview.generatedGoals);
        setReviewStep(6);
      } catch (error) {
        console.error("Wellness AI next-week goal generation failed:", error);
        showToast("Could not reach Wellness AI. Start the AI service and try again.");
      } finally {
        el.btnGenerateNextWeekGoals.disabled = false;
      }
    });
  }

  if (el.btnBackRevApproval) el.btnBackRevApproval.addEventListener('click', () => setReviewStep(5));

  if (el.btnRetryRevGoals) {
    el.btnRetryRevGoals.addEventListener('click', async () => {
      el.btnRetryRevGoals.disabled = true;
      try {
        // OOGYBOOGY: Regenerate only unchecked next-week goals instead of discarding approved choices.
        tempReview.generatedGoals = await regenerateUnselectedGoals(
          el.revApprovalGoalsList,
          tempReview.generatedGoals,
          tempReview.goalDays,
          [tempReview.activity || (state.selectedActivities || [])[0]]
        );
        renderApprovalGoals(el.revApprovalGoalsList, tempReview.generatedGoals);
        showToast("Regenerated only the goals you did not keep.");
      } catch (error) {
        console.error("Wellness AI next-week goal regeneration failed:", error);
        showToast("Could not reach Wellness AI. Start the AI service and try again.");
      } finally {
        el.btnRetryRevGoals.disabled = false;
      }
    });
  }

  if (el.btnApproveNextWeek) {
    el.btnApproveNextWeek.addEventListener('click', async () => {
      // OOGYBOOGY: Ensure every unchecked next-week goal is replaced before the new week begins.
      const selectedBeforeApproval = getSelectedApprovalGoals(el.revApprovalGoalsList, tempReview.generatedGoals);
      if (selectedBeforeApproval.length < tempReview.goalDays) {
        try {
          el.btnApproveNextWeek.disabled = true;
          tempReview.generatedGoals = await regenerateUnselectedGoals(
            el.revApprovalGoalsList,
            tempReview.generatedGoals,
            tempReview.goalDays,
            state.selectedActivities
          );
        } catch (error) {
          console.error("Next-week goal replacement failed:", error);
          showToast("Could not regenerate the goals you did not select.");
          el.btnApproveNextWeek.disabled = false;
          return;
        } finally {
          el.btnApproveNextWeek.disabled = false;
        }
      }
      state.weeklyGoalDays = tempReview.goalDays;
      state.weeklyRestDays = tempReview.restDays;
      // OOGYBOOGY: Persist the selected weekly-review activity using the existing backend-compatible array field.
      state.selectedActivities = [tempReview.activity || (state.selectedActivities || [])[0]];
      state.selectedWhy = "";
      // OOGYBOOGY: Carry only approved goals into the next week and keep the existing streakCount intact.
      const selectedNextWeekGoals = getSelectedApprovalGoals(el.revApprovalGoalsList, tempReview.generatedGoals);
      state.weeklyGoals = selectedNextWeekGoals.length === tempReview.goalDays
        ? selectedNextWeekGoals
        : [...tempReview.generatedGoals];
      state.weeklyGoals = state.weeklyGoals.map((goal, idx) => ({ ...goal, id: idx + 1, status: "pending", completed: false }));
      state.weekNumber = Number(state.weekNumber || 1) + 1;
      state.currentDay = 1;
      state.goalDaysCompletedThisWeek = 0;
      state.restDaysUsedThisWeek = 0;
      state.todayMode = "goal";
      state.todayGoalCompleted = false;
      state.activeGoalIndex = 0;
      state.isMissedDayPenaltyActive = false;
      state.dailyHistory = []; // Fresh week
      // OOGYBOOGY: New week starts with a fresh daily goal-time entry.
      state.goalTime = { startTime: "", endTime: "", day: 0 };

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
      const isCompleted = Boolean(goal.completed);
      item.className = `swap-goal-item ${isCur ? 'current' : ''} ${isCompleted ? 'completed' : ''}`;
      // OOGYBOOGY: Completed goals cannot be selected as swap targets. 
      item.innerHTML = `
        <div class="swap-goal-title">${goal.title} ${isCur ? '(Active Today)' : ''} ${goal.completed ? '(Completed)' : ''}</div>
        <div class="swap-goal-meta">${goal.desc} • ${goal.duration}</div>
      `;

      item.addEventListener('click', () => {
        // OOGYBOOGY: Never allow swapping to a completed goal.
        if (isCompleted) {
          showToast("Completed goals cannot be swapped back in.");
          return;
        }
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

  // OOGYBOOGY: Central journal writer used by reflections, Tried days, and Missed days.
  function addJournalEntry(title, text, dayType = 'Reflection') {
    const day = Number(state.currentDay || 1);
    const week = Number(state.weekNumber || 1);
    state.journalEntries = state.journalEntries || [];
    state.journalEntries.unshift({
      id: Date.now() + Math.random(),
      week,
      day,
      date: `Week ${week} Day ${day}/7`,
      title,
      text,
      dayType
    });
    saveState();
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
        <div class="journal-entry-date">${entry.date} • ${entry.title || entry.dayType || 'Reflection'}</div>
        <div class="journal-entry-text">“${entry.text}”</div>
      `;
      el.journalEntriesContainer.appendChild(card);
    });
  }

  // OOGYBOOGY: Menu Journal History groups persistent entries by Week, then exposes only days with entries.
  function openJournalHistoryView() {
    if (!el.journalHistoryContainer) return;
    const grouped = {};
    (state.journalEntries || []).forEach(entry => {
      const week = Number(entry.week || entry.weekNumber || 1);
      if (!grouped[week]) grouped[week] = [];
      grouped[week].push(entry);
    });

    el.journalHistoryContainer.innerHTML = '';
    const weeks = Object.keys(grouped).map(Number).sort((a, b) => b - a);
    if (!weeks.length) {
      el.journalHistoryContainer.innerHTML = '<p class="journal-empty-state">No journal entries yet.</p>';
    } else {
      weeks.forEach(week => {
        const section = document.createElement('details');
        section.className = 'journal-week-section';
        section.open = week === weeks[0];
        const entries = grouped[week].sort((a, b) => Number(b.day || 0) - Number(a.day || 0));
        section.innerHTML = `<summary>Week ${week} <span>${entries.length} entr${entries.length === 1 ? 'y' : 'ies'}</span></summary>`;
        const body = document.createElement('div');
        body.className = 'journal-week-entries';
        entries.forEach(entry => {
          const card = document.createElement('div');
          card.className = 'journal-entry-card';
          card.innerHTML = `
            <div class="journal-entry-date">Week ${week} Day ${entry.day || 1}/7 • ${entry.title || entry.dayType || 'Reflection'}</div>
            <div class="journal-entry-text">“${entry.text}”</div>
          `;
          body.appendChild(card);
        });
        section.appendChild(body);
        el.journalHistoryContainer.appendChild(section);
      });
    }
    el.modalJournalHistory.style.display = 'flex';
  }

  if (el.btnSaveReflection) {
    el.btnSaveReflection.addEventListener('click', () => {
      const text = (el.journalText.value || '').trim();
      if (!text) {
        showToast("Please write a reflection before saving.");
        return;
      }

      // OOGYBOOGY: User reflections now use the required Week X Day Y/7 format and persist across weeks.
      addJournalEntry('Reflection', text, state.todayMode === 'rest' ? 'Rest Day' : state.todayMode === 'bonus' ? 'Bonus Day' : 'Goal Day');
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

  // Progress modal: streak, balance, requested analyses, AND Day-by-Day report!
  function openProgressView() {
    if (el.progStreakVal) el.progStreakVal.textContent = state.streakCount;
    if (el.progGoalsDoneVal) el.progGoalsDoneVal.textContent = state.goalDaysCompletedThisWeek;
    if (el.progGoalsTotalVal) el.progGoalsTotalVal.textContent = state.weeklyGoalDays;

    const restRemaining = Math.max(0, state.weeklyRestDays - state.restDaysUsedThisWeek);
    if (el.progRestLeftVal) el.progRestLeftVal.textContent = restRemaining;

    // Render Day-by-Day Log: "Day 1 was goal day. Day 2 was rest day."
    renderDayByDayHistoryLog();
    // OOGYBOOGY: Populate Weekly analysis and Goal specific analysis blocks.
    renderProgressAnalysis();

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
            const statusText = item.goalStatus === 'tried' ? 'Tried' : item.goalStatus === 'completed' ? 'Completed' : 'Pending';
            statusBadge = `<span class="history-status-badge goal">${statusText}</span>`;
            textDesc = `Day ${d} was goal day (${statusText.toLowerCase()})`;
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
        const curModeName = state.todayMode === 'rest' ? 'Rest Day' : state.todayMode === 'bonus' ? 'Bonus Day' : 'Goal Day';
        statusBadge = `<span class="history-status-badge current">Today</span>`;
        const currentTimeText = (state.todayMode !== 'rest' && getTodayGoalTime()) ? ` • Goal time: ${getTodayGoalTime()}` : '';
        textDesc = `Day ${d} is currently ${curModeName}${currentTimeText}`;
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

  let readinessRequest = 0;
  let readinessKey = '';
  let readinessScenario = 'auto';
  function readinessDayKey() { return `${state.weekNumber || 1}:${state.currentDay}`; }
  async function renderReadiness(force = false) {
    const card = document.getElementById('readinessCard');
    const target = document.getElementById('readinessResult');
    const controls = document.getElementById('readinessDemoControls');
    const status = document.getElementById('readinessDemoStatus');
    const goal = getActiveGoalForStatus();
    const eligible = state.todayMode === 'goal' && goal && !goal.completed;
    controls.hidden = !eligible;
    if (!eligible) { card.hidden=true; readinessRequest++; readinessKey=''; return; }
    state.readinessDemoWeeks ||= {};
    const demo = window.CrockyReadinessDemo;
    const plan = demo.schedule(state.readinessDemoWeeks,state.weekNumber || 1,state.weeklyGoalDays);
    const scheduled = demo.visit(plan,Number(state.currentDay));
    saveState();
    const preview = readinessScenario !== 'auto';
    const scenario = preview ? readinessScenario : scheduled ? 'poor_sleep' : 'well_recovered';
    const key = JSON.stringify([readinessDayKey(),goal,readinessScenario]);
    if (!force && key===readinessKey) return;
    readinessKey=key;
    const request=++readinessRequest;
    card.hidden=true; target.replaceChildren();
    status.textContent='';
    if (!force && plan.decisions[state.currentDay]) return;
    if (!preview && (!scheduled || !demo.canShow(plan,Number(state.currentDay)))) return;
    if (preview) status.textContent='Loading sample scenario…';
    try {
      const response=await fetch(`${AI_SERVICE_URL}/api/readiness`,{method:'POST',signal:AbortSignal.timeout(15000),headers:{'Content-Type':'application/json'},
        body:JSON.stringify({goal,demoScenario:scenario,taskKey:key})});
      if (!response.ok) {
        const failure=await response.json().catch(()=>({}));
        throw new Error(`Readiness API returned ${response.status}: ${failure.error || 'check the Python terminal'}`);
      }
      const result=await response.json();
      if (result.status==='success' && typeof result.needsAlternative!=='boolean') {
        throw new Error('The running service does not have the readiness route. Replace ai_service.py and restart run_local.py.');
      }
      if (request!==readinessRequest || key!==readinessKey) return;
      if (result.status!=='success') { if (preview) status.textContent=result.message; return; }
      if (!result.needsAlternative || !result.alternatives.length) {
        if (preview) status.textContent='Demo: the planned task stays unchanged with this sample data.';
        return;
      }
      if (!preview && !demo.canShow(plan,Number(state.currentDay))) return;
      card.hidden=false;
      const text=(value,tag='p')=>{const item=document.createElement(tag);item.textContent=value;target.appendChild(item);};
      text('Demo: Take it a little easier today','strong');
      text('The sample sleep and recent activity data suggest a gentler session may suit you better.');
      text('This is a prototype demonstration, not live tracking data.');
      if (result.method!=='ml') text('The readiness model is unavailable; this demo uses the fallback estimate.');
      const dismiss=decision=>{
        plan.decisions[state.currentDay]=decision;saveState();card.hidden=true;readinessRequest++;
        status.textContent=preview ? 'Demo choice saved for today.' : '';
      };
      result.alternatives.forEach(alternative=>{
        const ex=alternative.exercise;
        const detail=ex.duration_minutes ? `${ex.duration_minutes} mins` : ex.duration_seconds ? `${ex.duration_seconds} seconds` : `${ex.sets || 1} sets${ex.reps ? ` × ${ex.reps} reps` : ''}`;
        const button=document.createElement('button');button.type='button';button.className='btn-secondary full-w';
        button.textContent=`Choose ${alternative.title} • ${detail}`;
        button.addEventListener('click',()=>{
          const active=getActiveGoalForStatus();
          if (!active || active.completed || key!==readinessKey) return;
          active.readinessOriginal ||= {title:active.title,desc:active.desc,duration:active.duration,difficulty:active.difficulty,exercise:active.exercise};
          Object.assign(active,{title:alternative.title,desc:`A gentler option for today • ${detail}`,duration:ex.duration_minutes ? `${ex.duration_minutes} mins` : detail,
            exercise:ex,difficulty:alternative.difficulty,focus:alternative.focus,readinessAdjustment:{method:result.method,day:readinessDayKey(),demo:true}});
          state.goalTime={startTime:'',endTime:'',day:0};
          dismiss('accepted');renderMainView();showToast('Easier task selected for today. Log its actual time after completing it.');
        });target.appendChild(button);
      });
      const keep=document.createElement('button');keep.type='button';keep.className='small-menu-btn';keep.textContent='Keep planned task';
      keep.addEventListener('click',()=>dismiss('kept'));target.appendChild(keep);
      if (!preview) { demo.markShown(plan,Number(state.currentDay));saveState(); }
      status.textContent=preview ? 'Manual preview; automatic suggestions remain limited to two per week.' : '';
    } catch (error) {
      if (request===readinessRequest) {
        controls.open=true;
        status.textContent=error.name==='TimeoutError' ? 'Readiness request timed out. Check that the updated Python service is running on port 8001.' :
          `Demo unavailable: ${error.message}. Check that the updated Python service is running on port 8001.`;
      }
    }
  }
  document.getElementById('readinessScenario').addEventListener('change',event=>{
    readinessScenario=event.target.value;renderReadiness(true);
  });

  let reportRequest = 0;
  function actualClock(value) {
    const m = String(value || '').match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (!m) return null;
    const h = Number(m[1]) % 12 + (m[3].toUpperCase() === 'PM' ? 12 : 0);
    return `${String(h).padStart(2, '0')}:${m[2]}`;
  }
  function captureExerciseSession(goal, status) {
    const week = Number(state.weekNumber || 1), day = Number(state.currentDay);
    const session = {week, day, goalId: goal.goalId || goal.id, plannedExercise: goal.title,
      focus: goal.focus, plannedDuration: Number(goal.exercise?.duration_minutes) || parseFloat(goal.duration) || 30,
      status, actualStart: hasTodayGoalTime() ? actualClock(state.goalTime.startTime) : null,
      actualEnd: hasTodayGoalTime() ? actualClock(state.goalTime.endTime) : null};
    state.exerciseSessions = (state.exerciseSessions || []).filter(x => x.week !== week || x.day !== day);
    state.exerciseSessions.push(session);
  }
  function drawAnalysis(target, result) {
    target.replaceChildren();
    const add = (tag, text, cls) => {
      const item = document.createElement(tag); item.textContent = text;
      if (cls) item.className = cls;
      target.appendChild(item);
    };
    add('strong', result.headline);
    add('p', result.summary, 'ai-text');
    (result.supportingMetrics || []).forEach(x => add('p', x, 'metric-note'));
    if (result.dataUsed?.length) add('p', `Data used: ${result.dataUsed.join(' • ')}`, 'metric-note');
    if (result.caveat) add('p', result.caveat, 'metric-note');
    if (result.nextWeekFocus) add('p', result.nextWeekFocus);
  }
  async function renderProgressAnalysis() {
    const request = ++reportRequest;
    const weekly = document.getElementById('progWeeklyAnalysisText');
    const goal = document.getElementById('progGoalSpecificAnalysisList');
    weekly.textContent = 'Analyzing weekly wellbeing…'; goal.textContent = 'Analyzing completed exercise intervals…';
    const week = Number(state.weekNumber || 1);
    const sessions = (state.exerciseSessions || []).filter(x => x.week === week);
    // Saved rest/missed days supersede historical fixture sessions too.
    (state.dailyHistory || []).forEach(h => {
      if (!sessions.some(x => x.day === h.day)) sessions.push({day: h.day, status: h.type === 'rest' ? 'rest' : h.goalStatus || 'missed'});
    });
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    try {
      const response = await fetch(`${AI_SERVICE_URL}/api/weekly-report`, {method:'POST',
        headers:{'Content-Type':'application/json'}, body:JSON.stringify({date,currentDay:state.currentDay,sessions})});
      if (!response.ok) throw new Error('Report service unavailable');
      const result = await response.json();
      if (request !== reportRequest) return;
      drawAnalysis(weekly, result.weekly); drawAnalysis(goal, result.goal);
      const note = document.createElement('p'); note.className = 'metric-note'; note.textContent = result.source;
      weekly.appendChild(note);
      const latest = result.sessionEvidence.at(-1);
      if (latest) {
        const evidence = document.createElement('p'); evidence.className = 'metric-note';
        evidence.textContent = `Latest matched interval: ${latest.date} ${latest.start}–${latest.end} • ${latest.samples} minute readings • ${latest.averageHR} bpm average • ${latest.steps} steps.${latest.date === date ? " Today's next-morning result is still pending." : ''}`;
        goal.appendChild(evidence);
      }
    } catch (error) {
      if (request !== reportRequest) return;
      weekly.textContent = 'Weekly analysis is unavailable. Start the local AI service and reopen this report.';
      goal.textContent = 'Goal-specific analysis is unavailable until the local AI service is running.';
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

  // OOGYBOOGY: Regenerate the active goal without resolving the day; users may regenerate repeatedly until they choose Completed or Tried.
  async function regenerateActiveGoal() {
    if (state.todayMode === 'rest') {
      showToast("Generate a goal from Bonus Day when you want an optional activity.");
      return;
    }
    const activeGoal = getActiveGoalForStatus();
    if (!activeGoal || activeGoal.completed) {
      showToast("That goal is already resolved for today.");
      return;
    }
    try {
      if (el.btnRegenerateGoal) el.btnRegenerateGoal.disabled = true;
      const generated = await generateGoalsList(1, state.selectedActivities);
      const fresh = generated?.[0];
      if (!fresh) throw new Error('No replacement goal returned');
      Object.assign(activeGoal, fresh, {
        id: activeGoal.id,
        goalId: activeGoal.goalId || fresh.goalId || `goal_${activeGoal.id}`,
        bonus: Boolean(activeGoal.bonus),
        status: 'pending',
        completed: false,
        triedFeedback: ''
      });
      saveState();
      renderMainView();
      showToast("Fresh goal generated. You can regenerate again until you choose a status.");
    } catch (error) {
      console.error("Goal regeneration failed:", error);
      showToast("Could not generate a new goal. Start the AI service and try again.");
    } finally {
      if (el.btnRegenerateGoal) el.btnRegenerateGoal.disabled = false;
    }
  }

  // OOGYBOOGY: Generate one optional bonus goal after all required goal days are resolved.
  async function generateBonusGoal() {
    const completedGoalsCount = state.weeklyGoals.filter(g => g.completed && !g.bonus).length;
    if (completedGoalsCount < state.weeklyGoalDays) {
      showToast("Finish all required goal days before using a bonus day.");
      return;
    }
    const remainingRestDays = Math.max(0, state.weeklyRestDays - state.restDaysUsedThisWeek);
    if (remainingRestDays <= 0) {
      showToast("No rest day is available to use for a bonus day.");
      return;
    }
    try {
      el.btnGenerateBonusGoal.disabled = true;
      const bonusGoals = await generateGoalsList(1, state.selectedActivities);
      const bonus = { ...bonusGoals[0], id: `bonus_${Date.now()}`, goalId: `bonus_goal_${Date.now()}`, bonus: true, status: 'pending', completed: false };
      state.weeklyGoals = state.weeklyGoals.filter(g => !g.bonus || !g.completed);
      state.weeklyGoals.push(bonus);
      state.todayMode = 'bonus';
      saveState();
      renderMainView();
      showToast("Bonus goal generated. Give it a try if you want to.");
    } catch (error) {
      console.error("Bonus goal generation failed:", error);
      showToast("Could not generate a bonus goal. Start the AI service and try again.");
    } finally {
      if (el.btnGenerateBonusGoal) el.btnGenerateBonusGoal.disabled = false;
    }
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
        openGoalStatusModal(); // OOGYBOOGY: Replace one-click completion with Completed/Tried choices.
      });
    }

    // OOGYBOOGY: Regeneration is unlimited until the user resolves the current day with Completed or Tried.
    if (el.btnRegenerateGoal) el.btnRegenerateGoal.addEventListener('click', (e) => { e.stopPropagation(); regenerateActiveGoal(); });

    // OOGYBOOGY: Bonus Day has no weekly-goal swap list; its card stays in the same location.
    if (el.goalCard) el.goalCard.addEventListener('click', () => {
      if (state.todayMode === 'bonus') return;
      openSwapGoalModal();
    });
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
    // OOGYBOOGY: Journal History is a menu destination below Weekly Check-in.
    if (el.drawerLinkJournalHistory) el.drawerLinkJournalHistory.addEventListener('click', () => { closeDrawer(); openJournalHistoryView(); });
    if (el.btnCloseJournalHistory) el.btnCloseJournalHistory.addEventListener('click', () => el.modalJournalHistory.style.display = 'none');
    if (el.btnBackFromJournalHistory) el.btnBackFromJournalHistory.addEventListener('click', () => el.modalJournalHistory.style.display = 'none');

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

    // OOGYBOOGY: Weekly Check-in is accessible from the menu only on Day 7.
    if (el.drawerLinkWeekReview) {
      el.drawerLinkWeekReview.addEventListener('click', () => {
        if (state.currentDay !== 7) {
          showToast("Weekly Check-in opens only on Day 7 of the week.");
          return;
        }
        closeDrawer();
        launchWeeklyReviewModal();
      });
    }

    // OOGYBOOGY: Fixed, scrollable 12-hour selectors make goal times easy to enter and backend-friendly.
    if (el.btnOpenGoalTime) el.btnOpenGoalTime.addEventListener('click', () => {
      if (state.todayMode === 'rest') {
        showToast("Goal time is only available on goal days.");
        return;
      }
      const parts = (value) => {
        const match = String(value || '').match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
        return match ? { h: match[1], m: match[2], ap: match[3].toUpperCase() } : { h: '8', m: '00', ap: 'AM' };
      };
      const start = parts(state.goalTime?.startTime);
      const end = parts(state.goalTime?.endTime);
      if (el.goalStartHour) el.goalStartHour.value = start.h;
      if (el.goalStartMinute) el.goalStartMinute.value = start.m;
      if (el.goalStartAmPm) el.goalStartAmPm.value = start.ap;
      if (el.goalEndHour) el.goalEndHour.value = end.h;
      if (el.goalEndMinute) el.goalEndMinute.value = end.m;
      if (el.goalEndAmPm) el.goalEndAmPm.value = end.ap;
      el.modalGoalTime.style.display = 'flex';
    });
    if (el.btnCloseGoalTime) el.btnCloseGoalTime.addEventListener('click', () => el.modalGoalTime.style.display = 'none');
    if (el.btnSaveGoalTime) el.btnSaveGoalTime.addEventListener('click', () => {
      const start = `${el.goalStartHour.value}:${el.goalStartMinute.value} ${el.goalStartAmPm.value}`;
      const end = `${el.goalEndHour.value}:${el.goalEndMinute.value} ${el.goalEndAmPm.value}`;
      if (actualClock(end) <= actualClock(start)) {
        showToast('Actual end time must be later than start time on the same day.');
        return;
      }
      state.goalTime = { startTime: start, endTime: end, day: Number(state.currentDay) };
      const loggedGoal = getActiveGoalForStatus();
      if (loggedGoal?.status === 'completed' || loggedGoal?.status === 'tried') captureExerciseSession(loggedGoal, loggedGoal.status);
      // OOGYBOOGY: Persist the day's login window in the weekly day-by-day log as soon as it is saved.
      if (state.todayMode === 'goal' || state.todayMode === 'bonus') recordDayHistory(state.currentDay, state.todayMode === 'bonus' ? 'bonus' : 'goal');
      saveState();
      el.modalGoalTime.style.display = 'none';
      renderMainView();
      showToast(`Goal time saved: ${start} – ${end}`);
      // OOGYBOOGY: Continue the action that requested time only after the user has saved both times.
      if (typeof pendingGoalTimeAction === 'function') {
        const action = pendingGoalTimeAction;
        pendingGoalTimeAction = null;
        action();
      }
    });

    if (el.btnGenerateBonusGoal) el.btnGenerateBonusGoal.addEventListener('click', generateBonusGoal);
  }

  initApp();

})();
