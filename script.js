const traits = ["control", "stability", "curiosity", "community", "whimsy"];

const distros = {
  Ubuntu: {
    profile: {control: 4, stability: 9, curiosity: 4, community: 10, whimsy: 3},
    figure: "assets/ubuntu.png",
    description:
      "You value reliability, friendliness, and getting things done. You appreciate communities that make technology welcoming."},

  Debian: {
    profile: {control: 5, stability: 10, curiosity: 5, community: 8, whimsy: 2},
    figure: "assets/debian.png",
    description:
      "You're patient, dependable, and trust solutions that have stood the test of time."},

  Fedora: {
    profile: {control: 7, stability: 6, curiosity: 8, community: 6, whimsy: 3},
    figure: "assets/fedora.png",
    description:
      "You enjoy experimenting with new ideas while still appreciating a well-defined structure and routine."},

  Arch: {
    profile: {control: 10, stability: 2, curiosity: 9, community: 4, whimsy: 5},
    figure: "assets/arch.png",
    description:
      "You are curious and independent, you love tackling challenging problems and learning by doing."},

  Gentoo: {
    profile: {control: 9, stability: 4, curiosity: 10, community: 2, whimsy: 5},
    figure: "assets/gentoo.png",
    description:
      "You pursue mastery for its own sake. You may seem a bit of a snob to those around you, but your knowledge and dediction is always admired and appreciated."},

  openSUSE: {
    profile: {control: 6, stability: 7, curiosity: 6, community: 7, whimsy: 4},
    figure: "assets/opensuse.png",
    description:
      "You appreciate things that are thoughtfully designed. You enjoy learning new skills, but you don't see complexity as a badge of honor. "},

  "Hannah Montana": {
    profile:{control: 4, stability: 4, curiosity: 5, community: 7, whimsy: 10},
    figure: "assets/hannah-montana.png",
    description:
      "You are a whimsical fairy."}};


const questions = [
    { question: "Your laptop suddenly won't boot. What's your first reaction?", answers: [
        { text: "Interesting...I will get to the bottom of this", score: { curiosity: 2, control: 2 } }, 
        { text: "Register a ticket with IT", score: { stability: 3, whimsy: -1 } }, 
        { text: "Ask for help from your hacker friend", score: { stability: 2, community: 1 } },
        { text: "Guess I'm reading a book today", score: { whimsy: 2 } }
        ] },
    { question: "What keeps you awake at night?", answers: [
        { text: "An embarassing incident from 7th grade.", score: { stability: 1, control: 1 } }, 
        { text: "The 5 year plan for your career.", score: { stability: 3, whimsy: -1 } }, 
        { text: " \"Are my friends mad at me?\"  ", score: { control: 1, community: 1 } },
        { text: " \"I LOVE HANNAH MONTANA.\" ", score: { whimsy: 3 } }
        ] },
    { question: "What are you plans for the weekend?", answers: [
        { text: "Hacking your neighbor's wifi.", score: { curiosity: 3, whimsy: 3 } },
        { text: "Relaxing at home and watching TV.", score: { stability: 3 } },
        { text: "Playing boardgames with friends.", score: { community: 3 } }, 
        { text: "Catching up on work.", score: { stability: 3, whimsy: -1 } }
        ] }];

let currentQuestion = 0; 
const answersGiven = Array(questions.length).fill(null); 
const userTraits = Object.fromEntries(traits.map(t => [t, 0]));
const quizEl = document.getElementById("quiz"), resultEl = document.getElementById("result"), nextBtn = document.getElementById("nextBtn"), prevBtn = document.getElementById("prevBtn");

function renderQuestion() { 
    const q = questions[currentQuestion], sel = answersGiven[currentQuestion]; 
    quizEl.classList.remove("hidden"); 
    resultEl.classList.add("hidden"); 
    quizEl.innerHTML = `<div class="question">${currentQuestion + 1}. ${q.question}</div>${q.answers.map((a, i) => `<div class="choice ${sel === i ? "selected" : ""}" data-index="${i}">${a.text}</div>`).join("")}`; 
    document.querySelectorAll(".choice").forEach(
        c => c.onclick = () => { document.querySelectorAll(".choice").forEach(x => x.classList.remove("selected")); 
        c.classList.add("selected"); 
        answersGiven[currentQuestion] = Number(c.dataset.index); }); 
    
    prevBtn.disabled = currentQuestion === 0;
    nextBtn.textContent = currentQuestion === questions.length - 1 ? "See Result" : "Next"; }

function apply() { 
    answersGiven.forEach((a, i) => { 
        if (a === null) return; 
        for (const [k, v] of Object.entries(questions[i].answers[a].score)) { 
            userTraits[k] = (userTraits[k] || 0) + v; } }); }

function dist(u, p) { 
    let s = 0; 
    traits.forEach(t => { let d = (u[t] || 0) - (p[t] || 0); s += d * d; }); 
    return Math.sqrt(s); }

function best() {
  return Object.entries(distros)
    .map(([name, profile]) => ({
      name,
      distance: dist(userTraits, profile)
    }))
    .sort((a, b) => a.distance - b.distance)[0].name;}

function finish() { 
    apply(); 
    const w = best(); 

    // const desc = { 
    //     Arch: "You like control, flexibility, and learning by doing.", 
    //     Debian: "You value reliability and consistency.", 
    //     Fedora: "You enjoy modern software and experimentation.", 
    //     Ubuntu: "You like approachable, polished defaults.",
    //     HanahMontana: "You are a whimsical fairy" }; 

        quizEl.classList.add("hidden"); 
        resultEl.classList.remove("hidden"); 

        resultEl.innerHTML = `
            <h2>You are ${w} Linux!</h2>
            <p>${w.description}</p>
            <img
                class="result-figure"
                src="${w.figure}"
                alt="${w} logo">
            <button id="restartBtn">Restart</button>`;

        document.getElementById("restartBtn").onclick = () => { 
            currentQuestion = 0; 
            answersGiven.fill(null); 
            traits.forEach(t => userTraits[t] = 0); 
            renderQuestion(); }; }

nextBtn.onclick = () => { 
    if (answersGiven[currentQuestion] === null) { 
        alert("Pick an answer first."); 
        return; } 
    if (currentQuestion === questions.length - 1) finish(); 
    else { 
        currentQuestion++; 
        renderQuestion(); } };
prevBtn.onclick = () => { 
    if (currentQuestion > 0) { 
        currentQuestion--; 
        renderQuestion(); } };

renderQuestion();