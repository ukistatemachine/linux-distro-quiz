const traits = ["control", "stability", "curiosity", "community", "whimsy"];
const distros = { 
    Arch: { control: 10, stability: 3, curiosity: 10 , community: 7, whimsy: 2 }, 
    Debian: { control: 6, stability: 10, curiosity: 4 , community: 8, whimsy: 0 }, 
    Fedora: { control: 7, stability: 7, curiosity: 8 , community: 8, whimsy: 0 }, 
    Ubuntu: { control: 4, stability: 8, curiosity: 6 , community: 9, whimsy: 0 },
    HanahMontana: {control: 4, stability: 8, curiosity: 6 , community: 9, whimsy: 5} };

const questions = [
    { question: "What keeps you awake at night?", answers: [
        { text: "An embarassing incident from 7th grade.", score: { control: 3 } }, 
        { text: "The 5 year plan for your career.", score: { stability: 3, whimsy: -1 } }, 
        { text: "I LOVE HANNAH MONTANA.", score: { whimsy: 3 } }
        ] },
    { question: "What are you plans for the weekend?", answers: [
        { text: "Hacking your neighbor's wifi.", score: { curiosity: 3, whimsy: 3 } },
        { text: "Relaxing at home and watching TV.", score: { stability: 3 } },
        { text: "Playing boardgames with friends.", score: { community: 3 } }, 
        { text: "Catch up on work.", score: { stability: 3, whimsy: -1 } }
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
    answersGiven.forEach((a, i) => { if (a === null) return; for (const [k, v] of Object.entries(questions[i].answers[a].score)) { userTraits[k] = (userTraits[k] || 0) + v; } }); }

function dist(u, p) { 
    let s = 0; 
    traits.forEach(t => { let d = (u[t] || 0) - (p[t] || 0); s += d * d; }); 
    return Math.sqrt(s); }

function best() { 
    return Object.entries(distros).map(([n, p]) => ({ n, d: dist(userTraits, p) })).sort((a, b) => a.d - b.d)[0].n; }

function finish() { 
    apply(); const w = best(); 
    const desc = { 
        Arch: "You like control, flexibility, and learning by doing.", 
        Debian: "You value reliability and consistency.", 
        Fedora: "You enjoy modern software and experimentation.", 
        Ubuntu: "You like approachable, polished defaults.",
        HanahMontana: "You are a whimsical fairy" }; 
        quizEl.classList.add("hidden"); 
        resultEl.classList.remove("hidden"); 
        resultEl.innerHTML = `<h2>You are ${w}!</h2><p>${desc[w]}</p><button id="restartBtn">Restart</button>`; 
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