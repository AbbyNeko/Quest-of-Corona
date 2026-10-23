const { createClient } = require("@supabase/supabase-js");

const root = document.querySelector("#app");
const config = window.SUPABASE_CONFIG;
let supabase;

const heroes = {
  1: { name: "Covid Knight", health: 45, attack: 3, image: "/images/knight2.gif" },
  2: { name: "Covid Ninja", health: 30, attack: 4, image: "/images/ninja.png" },
  3: { name: "Covid Mage", health: 40, attack: 3, image: "/images/mage2.gif" },
  4: { name: "Covid Warlock", health: 30, attack: 4, image: "/images/warlock200.gif" }
};

const stages = {
  forest: {
    name: "The Forest",
    enemy: "Murder Hornet",
    enemyHealth: 16,
    enemyAttack: 3,
    image: "/images/leveloneBkg.gif",
    background: "/images/plot1Bkg.png",
    story: [
      (username) => `It was with hardened hearts that your family bid you farewell. “Take care, ${username}. Be safe.”`,
      "The smoky haze of the morning sun illuminates the forest floor before you. With a deep breath, you see a clear path. Your hometown has been ravaged by an invisible enemy, a power which emanates from the belly of a crowned dragon. You had said your goodbyes and left for battle, but each step away from your home filled your chest with growing dread and anxiety.",
      "As you walk, the snapping of foliage awakens the inhabitants of this uncharted territory. You feel a low rumbling beneath your feet as you start to run away from its perpetrator.",
      "The loud buzzing is followed by the heavy thump of a large body bumping into you, knocking you off your feet. As you raise your gaze from the forest floor, you see-"
    ]
  },
  cave: {
    name: "Cave Covid",
    enemy: "Ground Zero Bat",
    enemyHealth: 20,
    enemyAttack: 6,
    image: "/images/leveltwoBkg.gif",
    background: "/images/plot2Bkg.png",
    story: [
      "You raise your fist, victorious as the giant hornet lies lifeless before you. Testing fate, you come closer to it, kicking it onto its back with your foot.",
      "You find a dissipating glow coming from its torso, your suspicions that it was connected to the crowned dragon proven correct. With a heavy heart, you realize that the power coming from its cursed gem was stronger than you originally thought. Your hometown had been spared so far because of its distance from the beast, but who’s to say it won’t come closer?",
      "With growing resilience, you stand tall before your former enemy and turn your back to it, walking towards the mouth of Cave Covid. With the sky darkening to dusk, you hear a fluttering of wings coming from the roof of the cave.",
      "Before you can raise your eyes to the source, a large creature lands before you. With horror, you see-"
    ]
  },
  "deeper cave": {
    name: "The Deepest Cave",
    enemy: "Covid Dragon",
    enemyHealth: 35,
    enemyAttack: 8,
    image: "/images/levelthreeBkg.gif",
    background: "/images/plot3Bkg.png",
    story: [
      "Your body is weary from exhaustion, but you feel a spring in your step as the monster bat collapses and falls to the precipice of the cave. Its limp body crashes into the walls of the cave and lands with a loud thud - you know with certainty it will never stand again.",
      "With resolution, you turn and head to the deepest part of the cave. The walls are dark, and you place your hand against its rugged face to feel your way deeper and deeper down its path. The trickling of water is the only sound echoing the cave other than your labored breathing.",
      "From the distance, you see a dim light growing brighter with each step you take. You know what it is. It’s too late to turn back now. The cave is getting warmer and warmer as the light turns an iridescent shade of yellow and blue.",
      "Around the corner, the huge shape of the crowned dragon - Corona, greets you with its magnificent form. You lock eyes and get into an attack position."
    ]
  }
};

const nextStage = {
  forest: "cave",
  cave: "deeper cave"
};

const state = {
  user: null,
  profile: null,
  save: null,
  loading: true,
  busy: false,
  notice: "",
  noticeIsError: false,
  plotStage: null,
  plotStep: 0
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return entities[character];
  });
}

function currentRoute() {
  const route = window.location.hash.replace(/^#\/?/, "").split("/")[0];
  return route || (state.user ? "welcome" : "home");
}

function navigate(route) {
  window.location.hash = `/${route}`;
}

function shell(content) {
  const header = state.user
    ? `<header class="app-header">
        <h1>Quest of Corona</h1>
        <button class="rpgui-button app-button" type="button" data-action="sign-out">Sign Out</button>
      </header>`
    : "";
  const notice = state.notice
    ? `<div class="notice${state.noticeIsError ? " error" : ""}" role="${state.noticeIsError ? "alert" : "status"}">${escapeHtml(state.notice)}</div>`
    : "";
  return `<main class="rpgui-container framed app-shell">
    ${header}
    ${notice}
    ${content}
    <footer class="app-footer">
      <small>Quest of Corona · A retro-inspired adventure</small>
    </footer>
  </main>`;
}

function renderHome() {
  return shell(`<section class="screen">
    <h1>Quest of Corona</h1>
    <p class="empty-state">A hero’s journey begins with a single step. Create an account to save your adventure, or sign in to continue.</p>
    <div class="auth-grid">
      <form class="rpgui-container framed-golden auth-card" id="signup-form">
        <h2>Create Account</h2>
        <label class="field"><span>Character name</span><input name="username" autocomplete="nickname" minlength="3" maxlength="24" required /></label>
        <label class="field"><span>Email</span><input name="email" type="email" autocomplete="email" required /></label>
        <label class="field"><span>Password</span><input name="password" type="password" autocomplete="new-password" minlength="8" required /></label>
        <button class="rpgui-button app-button" type="submit" ${state.busy ? "disabled" : ""}>Sign Up</button>
      </form>
      <form class="rpgui-container framed-golden auth-card" id="login-form">
        <h2>Load Adventure</h2>
        <label class="field"><span>Email</span><input name="email" type="email" autocomplete="email" required /></label>
        <label class="field"><span>Password</span><input name="password" type="password" autocomplete="current-password" required /></label>
        <button class="rpgui-button app-button" type="submit" ${state.busy ? "disabled" : ""}>Log In</button>
      </form>
    </div>
    <p class="empty-state"><small>New accounts may need to confirm their email before signing in.</small></p>
  </section>`);
}

function renderWelcome() {
  const save = state.save;
  const canResume = save && !save.completed;
  const options = Object.entries(heroes).map(([id, hero]) => `
    <div class="hero-card">
      <img src="${hero.image}" alt="" />
      <label><input type="radio" name="character-class" value="${id}" ${id === "1" ? "checked" : ""} />
        ${escapeHtml(hero.name)}<br />HP ${hero.health} · ATK ${hero.attack}
      </label>
    </div>`).join("");

  let saveSummary = "";
  if (save) {
    saveSummary = `<div class="panel rpgui-container framed-golden">
      <h2>${escapeHtml(state.profile.username)} the ${escapeHtml(save.character_name)}</h2>
      <p>${save.completed ? "Your last adventure is complete." : `Adventure in progress: ${escapeHtml(stages[save.stage].name)}.`}</p>
      <p>Attack: ${save.attack} · Health: ${save.current_health}/${save.max_health}</p>
      ${canResume ? `<button class="rpgui-button app-button" type="button" data-action="resume">Resume Adventure</button>` : ""}
      ${!save.completed && save.current_health <= 0 ? `<button class="rpgui-button app-button" type="button" data-action="retry">Try This Battle Again</button>` : ""}
      <p><small>Choose a new hero below to replace this save.</small></p>
    </div>`;
  }

  return shell(`<section class="screen">
    <h2>Welcome, ${escapeHtml(state.profile.username)}!</h2>
    <p>Choose your hero and set out to defeat the evil force threatening your hometown. In battle, attack your enemy, block one attack, and use one heal per stage.</p>
    ${saveSummary}
    <h2>Choose Your Hero</h2>
    <div class="hero-grid">${options}</div>
    <div class="button-row">
      <button class="rpgui-button app-button" type="button" data-action="start" ${state.busy ? "disabled" : ""}>Start New Adventure</button>
    </div>
  </section>`);
}

function renderPlot() {
  const save = state.save;
  const stage = stages[save.stage];
  if (state.plotStage !== save.stage) {
    state.plotStage = save.stage;
    state.plotStep = 0;
  }
  const line = stage.story[state.plotStep];
  const story = typeof line === "function" ? line(state.profile.username) : line;
  const buttonText = state.plotStep === stage.story.length - 1 ? "Enter Battle" : "Next";

  return shell(`<section class="screen">
    <h2>${escapeHtml(stage.name)}</h2>
    <img class="story-image" src="${stage.background}" alt="The path through ${escapeHtml(stage.name)}" />
    <p class="story-text">${escapeHtml(story)}</p>
    <div class="button-row">
      <button class="rpgui-button app-button" type="button" data-action="welcome">Save &amp; Exit</button>
      <button class="rpgui-button app-button" type="button" data-action="next-story">${buttonText}</button>
    </div>
  </section>`);
}

function percent(current, max) {
  return Math.max(0, Math.min(100, (current / max) * 100));
}

function renderBattle() {
  const save = state.save;
  if (save.current_health <= 0) {
    navigate("end");
    return "";
  }
  if (save.stage_complete) {
    return shell(`<section class="screen empty-state">
      <h2>Victory!</h2>
      <p>${escapeHtml(stages[save.stage].enemy)} has been defeated.</p>
      <button class="rpgui-button app-button" type="button" data-action="next-stage">Continue</button>
    </section>`);
  }
  const stage = stages[save.stage];
  const enemyHealth = stage.enemyHealth;
  const busy = state.busy;

  return shell(`<section class="screen">
    <h2>${escapeHtml(stage.name)} · ${escapeHtml(stage.enemy)}</h2>
    <div class="battle-layout">
      <div class="panel rpgui-container framed-golden battle-stats">
        <h3>Your HP</h3>
        <div class="healthbar" role="progressbar" aria-label="Your health" aria-valuemin="0" aria-valuemax="${save.max_health}" aria-valuenow="${save.current_health}">
          <span style="width:${percent(save.current_health, save.max_health)}%"></span>
        </div>
        <p>${save.current_health} / ${save.max_health}</p>
        <p>Attack: ${save.attack}</p>
        <p>Heal: ${save.used_heal ? "used" : "ready"}</p>
        <p>Block: ${save.used_block ? "used" : "ready"}</p>
      </div>
      <div class="battle-scene">
        <img class="enemy-image" src="${stage.image}" alt="${escapeHtml(stage.enemy)}" />
        <h3>${escapeHtml(stage.enemy)}</h3>
        <div class="healthbar enemy" role="progressbar" aria-label="${escapeHtml(stage.enemy)} health" aria-valuemin="0" aria-valuemax="${enemyHealth}" aria-valuenow="${save.enemy_health}">
          <span style="width:${percent(save.enemy_health, enemyHealth)}%"></span>
        </div>
        <p>${save.enemy_health} / ${enemyHealth}</p>
      </div>
    </div>
    <p class="empty-state">${state.notice ? escapeHtml(state.notice) : "Your turn. Choose an action."}</p>
    <div class="action-buttons">
      <button class="rpgui-button app-button" type="button" data-action="attack" ${busy ? "disabled" : ""}>Attack</button>
      <button class="rpgui-button app-button" type="button" data-action="block" ${busy ? "disabled" : ""}>Block</button>
      <button class="rpgui-button app-button" type="button" data-action="heal" ${busy ? "disabled" : ""}>Heal</button>
      <button class="rpgui-button app-button" type="button" data-action="welcome">Save &amp; Exit</button>
    </div>
  </section>`);
}

function renderEnd() {
  return shell(`<section class="screen empty-state">
    <h2>The End</h2>
    <img class="screen-image" src="/images/grave.png" alt="A grave" />
    <p>Your hero has fallen. Regroup and try the battle again.</p>
    <div class="button-row">
      <button class="rpgui-button app-button" type="button" data-action="retry" ${state.busy ? "disabled" : ""}>Try Again</button>
      <button class="rpgui-button app-button" type="button" data-action="welcome">Load Adventure</button>
    </div>
  </section>`);
}

function renderWin() {
  return shell(`<section class="screen empty-state">
    <h2>Congratulations!</h2>
    <img class="screen-image" src="/images/crown.png" alt="A crown" />
    <p>There’s a crowd of people waiting at the entrance of your hometown as they see your form walking from the distance. Hushed whispers turn to thunderous roars and applause as recognition falls on their faces. Covered in your bloodied clothing, you carry back the head of Corona.</p>
    <button class="rpgui-button app-button" type="button" data-action="welcome">Return Home</button>
  </section>`);
}

function render() {
  if (!root) {
    throw new Error("The app root element is missing.");
  }
  if (state.loading) {
    root.innerHTML = `<main class="rpgui-container framed app-shell"><p class="loading">Loading your adventure...</p></main>`;
    return;
  }
  if (!state.user) {
    if (currentRoute() !== "home") {
      navigate("home");
      return;
    }
    root.innerHTML = renderHome();
    return;
  }
  if (!state.profile) {
    root.innerHTML = shell(`<p class="loading">Loading your account...</p>`);
    return;
  }

  const route = currentRoute();
  if (route === "home" || !["welcome", "plot", "battle", "end", "win"].includes(route)) {
    navigate("welcome");
    return;
  }
  if (state.save?.completed && route !== "welcome" && route !== "win") {
    navigate("win");
    return;
  }
  if (!state.save && route !== "welcome") {
    navigate("welcome");
    return;
  }

  const page = {
    welcome: renderWelcome,
    plot: renderPlot,
    battle: renderBattle,
    end: renderEnd,
    win: renderWin
  }[route];
  root.innerHTML = page();
}

async function loadAccount(user) {
  try {
    const [profileResult, saveResult] = await Promise.all([
      supabase.from("profiles").select("username").eq("id", user.id).single(),
      supabase.from("game_saves").select("*").eq("user_id", user.id).maybeSingle()
    ]);

    if (state.user?.id !== user.id) {
      return;
    }
    if (profileResult.error) {
      throw new Error(`Could not load your profile: ${profileResult.error.message}`);
    }
    if (saveResult.error) {
      throw new Error(`Could not load your saved game: ${saveResult.error.message}`);
    }
    state.profile = profileResult.data;
    state.save = saveResult.data;
    state.notice = "";
    state.noticeIsError = false;
  } catch (error) {
    if (state.user?.id !== user.id) {
      return;
    }
    state.notice = error instanceof Error ? error.message : `Could not load your account: ${String(error)}`;
    state.noticeIsError = true;
  } finally {
    if (state.user?.id === user.id) {
      state.loading = false;
      render();
    }
  }
}

async function handleSignup(form) {
  const values = new FormData(form);
  const username = String(values.get("username") || "").trim();
  const email = String(values.get("email") || "").trim();
  const password = String(values.get("password") || "");

  if (username.length < 3 || username.length > 24) {
    state.notice = "Choose a character name between 3 and 24 characters.";
    state.noticeIsError = true;
    render();
    return;
  }

  state.busy = true;
  state.notice = "";
  render();
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } }
    });
    if (error) {
      throw error;
    }
    if (data.session) {
      state.notice = "Account created. Your adventure is ready.";
      state.noticeIsError = false;
      navigate("welcome");
    } else {
      state.notice = "Account created. Check your email to confirm your account, then log in.";
      state.noticeIsError = false;
    }
  } catch (error) {
    state.notice = error instanceof Error ? error.message : String(error);
    state.noticeIsError = true;
  } finally {
    state.busy = false;
    render();
  }
}

async function handleLogin(form) {
  const values = new FormData(form);
  const email = String(values.get("email") || "").trim();
  const password = String(values.get("password") || "");

  state.busy = true;
  state.notice = "";
  render();
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
    state.notice = "";
    navigate("welcome");
  } catch (error) {
    state.notice = error instanceof Error ? error.message : String(error);
    state.noticeIsError = true;
  } finally {
    state.busy = false;
    render();
  }
}

async function writeSave(values, successMessage) {
  if (!state.user) {
    state.notice = "Your session has expired. Log in again to save your progress.";
    state.noticeIsError = true;
    render();
    return false;
  }
  state.busy = true;
  state.notice = "Saving your adventure...";
  state.noticeIsError = false;
  render();

  try {
    const result = state.save
      ? await supabase.from("game_saves").update(values).eq("user_id", state.user.id).select("*").single()
      : await supabase.from("game_saves").insert({ ...values, user_id: state.user.id }).select("*").single();
    if (result.error) {
      throw new Error(result.error.message);
    }

    state.save = result.data;
    state.notice = successMessage;
    state.noticeIsError = false;
    return true;
  } catch (error) {
    state.notice = `Could not save your progress: ${error instanceof Error ? error.message : String(error)}`;
    state.noticeIsError = true;
    return false;
  } finally {
    state.busy = false;
    render();
  }
}

async function startAdventure() {
  const selected = root.querySelector('input[name="character-class"]:checked');
  if (!selected || !heroes[selected.value]) {
    state.notice = "Choose a hero class before starting.";
    state.noticeIsError = true;
    render();
    return;
  }
  const hero = heroes[selected.value];
  const saved = await writeSave({
    class_id: Number(selected.value),
    character_name: hero.name,
    attack: hero.attack,
    max_health: hero.health,
    current_health: hero.health,
    stage: "forest",
    enemy_health: stages.forest.enemyHealth,
    used_heal: false,
    used_block: false,
    stage_complete: false,
    completed: false
  }, "Adventure saved.");

  if (saved) {
    state.plotStage = null;
    state.plotStep = 0;
    navigate("plot");
  }
}

async function performBattleAction(action) {
  const save = state.save;
  const stage = stages[save.stage];
  const update = {
    current_health: save.current_health,
    enemy_health: save.enemy_health,
    used_heal: save.used_heal,
    used_block: save.used_block,
    stage_complete: save.stage_complete
  };
  let message = "";

  if (action === "attack") {
    update.enemy_health = Math.max(0, save.enemy_health - save.attack);
    if (update.enemy_health === 0) {
      update.stage_complete = true;
      message = `${stage.enemy} has been defeated!`;
    } else {
      update.current_health = Math.max(0, save.current_health - stage.enemyAttack);
      message = `You attack. ${stage.enemy} hits back for ${stage.enemyAttack} damage.`;
    }
  } else if (action === "heal") {
    if (save.used_heal) {
      update.current_health = Math.max(0, save.current_health - stage.enemyAttack);
      message = `Your heal has been used. ${stage.enemy} hits for ${stage.enemyAttack} damage.`;
    } else {
      update.used_heal = true;
      update.current_health = save.max_health;
      update.current_health = Math.max(0, update.current_health - stage.enemyAttack);
      message = `You heal, then ${stage.enemy} hits for ${stage.enemyAttack} damage.`;
    }
  } else if (action === "block") {
    if (save.used_block) {
      update.current_health = Math.max(0, save.current_health - stage.enemyAttack);
      message = `Your block has been used. ${stage.enemy} hits for ${stage.enemyAttack} damage.`;
    } else {
      update.used_block = true;
      message = `You block ${stage.enemy}'s attack.`;
    }
  }

  const saved = await writeSave(update, message);
  if (saved && state.save.current_health <= 0) {
    navigate("end");
  }
}

async function continueAdventure() {
  const save = state.save;
  if (save.stage === "deeper cave") {
    const saved = await writeSave({ stage_complete: true, completed: true }, "Adventure complete!");
    if (saved) {
      navigate("win");
    }
    return;
  }

  const stage = nextStage[save.stage];
  const maxHealth = save.max_health + 1;
  const saved = await writeSave({
    attack: save.attack + 1,
    max_health: maxHealth,
    current_health: maxHealth,
    stage,
    enemy_health: stages[stage].enemyHealth,
    used_heal: false,
    used_block: false,
    stage_complete: false,
    completed: false
  }, "A new path lies ahead.");

  if (saved) {
    state.plotStage = null;
    state.plotStep = 0;
    navigate("plot");
  }
}

async function retryBattle() {
  if (!state.save) {
    navigate("welcome");
    return;
  }
  const saved = await writeSave({
    current_health: state.save.max_health,
    enemy_health: stages[state.save.stage].enemyHealth,
    used_heal: false,
    used_block: false,
    stage_complete: false,
    completed: false
  }, "Your hero is ready to try again.");
  if (saved) {
    navigate("battle");
  }
}

if (!root) {
  throw new Error("The app root element is missing.");
}

if (!config?.url || !config?.anonKey) {
  root.innerHTML = `<main class="rpgui-container framed app-shell"><p class="notice error">Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY in the Netlify environment, then redeploy.</p></main>`;
} else {
  supabase = createClient(config.url, config.anonKey);

  supabase.auth.onAuthStateChange((event, session) => {
    const user = session?.user || null;
    const changedUser = user?.id !== state.user?.id;
    if (event !== "INITIAL_SESSION" && !changedUser && event !== "SIGNED_OUT") {
      return;
    }
    state.user = user;
    state.profile = null;
    state.save = null;
    state.loading = Boolean(user);
    state.notice = "";
    state.noticeIsError = false;

    if (!user) {
      if (currentRoute() !== "home") {
        navigate("home");
      }
      state.loading = false;
      render();
      return;
    }

    render();
    window.setTimeout(() => loadAccount(user), 0);
  });

  root.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) {
      return;
    }
    event.preventDefault();
    if (form.id === "signup-form") {
      void handleSignup(form);
    } else if (form.id === "login-form") {
      void handleLogin(form);
    }
  });

  root.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button || button.disabled) {
      return;
    }

    switch (button.dataset.action) {
      case "sign-out":
        void supabase.auth.signOut().then(({ error }) => {
          if (error) {
            throw new Error(error.message);
          }
        }).catch((error) => {
          state.notice = `Could not sign out: ${error instanceof Error ? error.message : String(error)}`;
          state.noticeIsError = true;
          render();
        });
        break;
      case "start":
        void startAdventure();
        break;
      case "resume":
        navigate(state.save?.current_health <= 0 ? "end" : state.save?.stage_complete ? "battle" : "plot");
        break;
      case "welcome":
        navigate("welcome");
        break;
      case "next-story":
        if (state.plotStep < stages[state.save.stage].story.length - 1) {
          state.plotStep += 1;
          render();
        } else {
          navigate("battle");
        }
        break;
      case "attack":
      case "block":
      case "heal":
        void performBattleAction(button.dataset.action);
        break;
      case "next-stage":
        void continueAdventure();
        break;
      case "retry":
        void retryBattle();
        break;
      default:
        break;
    }
  });

  window.addEventListener("hashchange", render);
}
