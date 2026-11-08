/* === NAVIGATION START === */
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector("#navigation");

function closeMenu() {
  navigation.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open menu");
}

menuButton.addEventListener("click", () => {
  const open = navigation.classList.toggle("open");

  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute(
    "aria-label",
    open ? "Close menu" : "Open menu"
  );
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    navigation.classList.contains("open")
  ) {
    closeMenu();
    menuButton.focus();
  }
});

document.querySelector("#year").textContent =
  String(new Date().getFullYear());
/* === NAVIGATION END === */

/* === AUDIENCE START === */
const audiences = {
  seeker: {
    label: "FOR JOB SEEKERS",
    title: "You bring the potential.",
    description:
      "Tell us about your experience, availability, and the kind of work you want. Call to discuss current opportunities and arrange a conversation.",
    steps: [
      "Explore the toolkit below.",
      "Think about your skills and availability.",
      "Call 458-205-0742 to get connected."
    ]
  },

  employer: {
    label: "FOR EMPLOYERS",
    title: "Good work starts with good people.",
    description:
      "Tell us about the role, the skills you need, and your timeline. Call Trusted Hire to discuss your hiring needs and the next steps.",
    steps: [
      "Use the hiring planner below.",
      "Prepare your role, schedule, and pay range.",
      "Call 458-205-0742 to discuss your needs."
    ]
  }
};

function setAudience(mode) {
  const audience = audiences[mode];

  if (!audience) return;

  document.querySelector("#audience-label").textContent =
    audience.label;

  document.querySelector("#audience-title").textContent =
    audience.title;

  document.querySelector("#audience-description").textContent =
    audience.description;

  const steps = audience.steps.map((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    return item;
  });

  document.querySelector("#audience-steps").replaceChildren(...steps);

  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.mode === mode)
    );
  });
}

document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    setAudience(button.dataset.mode);
  });
});

document.querySelectorAll("[data-audience]").forEach((link) => {
  link.addEventListener("click", () => {
    setAudience(link.dataset.audience);
  });
});
/* === AUDIENCE END === */

/* === TOOL CONTENT START === */
const questions = [
  {
    question:
      "Tell me about yourself and the kind of work you’re looking for.",
    tip:
      "Start with your recent experience or strengths. Explain what you enjoy doing and connect that to the work you want."
  },
  {
    question:
      "Tell me about a time you solved a problem.",
    tip:
      "Use Situation, Task, Action, Result. Keep the scene short and focus on what you did and learned."
  },
  {
    question:
      "How do you handle a busy day or competing priorities?",
    tip:
      "Share a real example. Explain how you organized tasks, communicated, and decided what needed attention first."
  },
  {
    question:
      "What is a strength you would bring to this team?",
    tip:
      "Choose a strength relevant to the role, then give a specific example that shows it in action."
  },
  {
    question:
      "Tell me about a time you learned something new.",
    tip:
      "Describe how you asked questions, practiced, used feedback, or found a resource. Explain your progress."
  },
  {
    question:
      "What would you like to ask us about the role?",
    tip:
      "Ask about the everyday tasks, training, team, schedule, or what success looks like in the first few weeks."
  }
];

const checklists = {
  resume: {
    title: "Résumé checklist",
    intro:
      "A useful final review before you share your résumé. Check each item as you go.",
    items: [
      "My name and contact details are current.",
      "My experience is listed clearly, with dates.",
      "I included skills relevant to the work I want.",
      "I described what I did using specific examples.",
      "I included useful volunteer work or projects, where relevant.",
      "I checked spelling, formatting, and readability.",
      "I left out sensitive details such as my Social Security number.",
      "I saved a copy in a format the employer requested."
    ]
  },

  hiring: {
    title: "Hiring planner",
    intro:
      "Get the essentials clear before your next hiring conversation. This is a preparation checklist, not a submitted hiring request.",
    items: [
      "Define the role and its everyday responsibilities.",
      "Separate essential skills from skills that can be taught.",
      "Confirm the work location, schedule, and start date.",
      "Prepare the expected pay range and role details.",
      "Choose consistent, job-related interview questions.",
      "Decide who will interview and how next steps will be shared.",
      "Plan training, equipment, and first-day support.",
      "Call Trusted Hire to discuss the role and your timeline."
    ]
  }
};

const toolDialog = document.querySelector("#tool-dialog");
const toolContent = document.querySelector("#tool-content");

let activeToolButton = null;
let questionIndex = 0;
let showTip = false;

const practiceAnswers = Array(questions.length).fill("");

function loadChecks(tool) {
  try {
    const stored = JSON.parse(
      localStorage.getItem("trusted-hire-" + tool)
    );

    if (!Array.isArray(stored)) {
      return checklists[tool].items.map(() => false);
    }

    return checklists[tool].items.map(
      (_, index) => stored[index] === true
    );
  } catch {
    return checklists[tool].items.map(() => false);
  }
}

function focusPracticeQuestion() {
  const questionHeading =
    toolContent.querySelector(".practice-question");

  questionHeading.setAttribute("tabindex", "-1");
  questionHeading.focus();
}

function renderInterview() {
  document.querySelector("#tool-title").textContent =
    "Interview practice";

  toolContent.innerHTML = `
    <p class="tool-intro">
      Practice at your own pace. These prompts offer guidance,
      not an automated assessment.
    </p>

    <p class="question-label"></p>
    <h3 class="practice-question"></h3>

    <label class="answer-label" for="practice-answer">
      Your practice notes (optional)
    </label>

    <textarea
      id="practice-answer"
      placeholder="Start with a real example…"
    ></textarea>

    <div class="tool-actions">
      <button
        class="button secondary"
        id="previous-question"
        type="button"
      >
        Previous
      </button>

      <button
        class="button primary"
        id="next-question"
        type="button"
      >
        Next question →
      </button>

      <button
        class="button secondary"
        id="toggle-tip"
        aria-expanded="false"
        aria-controls="practice-tip"
        type="button"
      >
        Show a tip
      </button>
    </div>

    <div id="practice-tip" class="tip-box" hidden></div>
  `;

  toolContent.querySelector(".question-label").textContent =
    `QUESTION ${questionIndex + 1} OF ${questions.length}`;

  toolContent.querySelector(".practice-question").textContent =
    questions[questionIndex].question;

  const answer = toolContent.querySelector("textarea");

  answer.value = practiceAnswers[questionIndex];

  answer.addEventListener("input", () => {
    practiceAnswers[questionIndex] = answer.value;
  });

  const tip = document.querySelector("#practice-tip");
  const tipButton = document.querySelector("#toggle-tip");

  tip.textContent = questions[questionIndex].tip;

  function updateTip() {
    tip.hidden = !showTip;

    tipButton.textContent =
      showTip ? "Hide tip" : "Show a tip";

    tipButton.setAttribute(
      "aria-expanded",
      String(showTip)
    );
  }

  updateTip();

  tipButton.addEventListener("click", () => {
    showTip = !showTip;
    updateTip();
  });

  const previous = document.querySelector("#previous-question");
  const next = document.querySelector("#next-question");

  previous.disabled = questionIndex === 0;
  previous.style.opacity = previous.disabled ? ".45" : "1";

  next.textContent =
    questionIndex === questions.length - 1
      ? "Start again →"
      : "Next question →";

  previous.addEventListener("click", () => {
    questionIndex = Math.max(0, questionIndex - 1);
    showTip = false;
    renderInterview();
    focusPracticeQuestion();
  });

  next.addEventListener("click", () => {
    questionIndex = (questionIndex + 1) % questions.length;
    showTip = false;
    renderInterview();
    focusPracticeQuestion();
  });
}

function renderChecklist(tool) {
  const checklist = checklists[tool];
  const checked = loadChecks(tool);

  document.querySelector("#tool-title").textContent =
    checklist.title;

  toolContent.innerHTML = `
    <p class="tool-intro"></p>

    <p class="progress-label" role="status"></p>

    <progress aria-label="Checklist completion"></progress>

    <div class="checklist"></div>

    <p class="saved-note"></p>

    <div class="tool-actions">
      <button
        class="button secondary"
        id="reset-checklist"
        type="button"
      >
        Reset checklist
      </button>

      <button
        class="button primary"
        id="print-checklist"
        type="button"
      >
        Print checklist
      </button>
    </div>
  `;

  toolContent.querySelector(".tool-intro").textContent =
    checklist.intro;

  const progress = toolContent.querySelector("progress");
  progress.max = checklist.items.length;

  function updateProgress(save) {
    const count = checked.filter(Boolean).length;

    progress.value = count;

    const completionMessage =
      count === checked.length
        ? " — ready for your next step!"
        : "";

    toolContent.querySelector(".progress-label").textContent =
      `${count} of ${checked.length} complete${completionMessage}`;

    if (!save) return;

    try {
      localStorage.setItem(
        "trusted-hire-" + tool,
        JSON.stringify(checked)
      );

      toolContent.querySelector(".saved-note").textContent =
        "Progress saved in this browser.";
    } catch {
      toolContent.querySelector(".saved-note").textContent =
        "Browser storage is unavailable. Progress will not be saved.";
    }
  }

  checklist.items.forEach((text, index) => {
    const label = document.createElement("label");
    label.className = "check-item";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = checked[index];

    const span = document.createElement("span");
    span.textContent = text;

    label.append(input, span);

    input.addEventListener("change", () => {
      checked[index] = input.checked;
      updateProgress(true);
    });

    toolContent.querySelector(".checklist").append(label);
  });

  updateProgress(false);

  document.querySelector("#reset-checklist")
    .addEventListener("click", () => {
      checked.fill(false);

      toolContent.querySelectorAll("input").forEach((input) => {
        input.checked = false;
      });

      updateProgress(true);
    });

  document.querySelector("#print-checklist")
    .addEventListener("click", () => {
      window.print();
    });
}

document.querySelectorAll("[data-tool]").forEach((button) => {
  button.addEventListener("click", () => {
    activeToolButton = button;

    if (button.dataset.tool === "interview") {
      renderInterview();
    } else {
      renderChecklist(button.dataset.tool);
    }

    toolDialog.showModal();
  });
});

document.querySelector("#close-tool")
  .addEventListener("click", () => {
    toolDialog.close();
  });

toolDialog.addEventListener("click", (event) => {
  const bounds = toolDialog.getBoundingClientRect();

  const clickedOutside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;

  if (event.target === toolDialog && clickedOutside) {
    toolDialog.close();
  }
});

toolDialog.addEventListener("close", () => {
  activeToolButton?.focus();
});
/* === TOOL CONTENT END === */