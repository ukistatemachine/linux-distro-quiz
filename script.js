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
      "You are curious and independent, you love tackling challenging problems and learning by doing. You may seem a bit of a tech elitist to those around you, but your knowledge is always admired and appreciated."},

  Gentoo: {
    profile: {control: 9, stability: 4, curiosity: 10, community: 2, whimsy: 5},
    figure: "assets/gentoo.png",
    description:
      "(This is a hidden outcome that's intentionally difficult to obtain, congrats!)<br>You pursue mastery for its own sake. You may seem a bit of a snob to those around you, but your knowledge and dediction is always admired and appreciated."},

  openSUSE: {
    profile: {control: 6, stability: 7, curiosity: 6, community: 7, whimsy: 4},
    figure: "assets/opensuse.png",
    description:
      "You appreciate things that are thoughtfully designed. You enjoy learning new skills, but you don't see complexity as a badge of honor."},

  "Hannah Montana": {
    profile:{control: 4, stability: 4, curiosity: 5, community: 7, whimsy: 10},
    figure: "assets/hannah-montana.png",
    description:
      "You are a whimsical fairy."}};

const questions = [
    { question: "Your laptop suddenly won't boot. What's your first reaction?", answers: [
        { text: "Interesting...I will get to the bottom of this", score: { curiosity: 2, control: 2, community: -1 } }, 
        { text: "Register a ticket with IT", score: { stability: 3, whimsy: -1 } }, 
        { text: "Ask for help from your hacker friend", score: { stability: 2, community: 1 } },
        { text: "Guess I'm reading a book today", score: { whimsy: 2 } }] },
    { question: "Going into a new environment (e.g. work or school), how do you tend to act?", answers: [
        { text: "Keep your head down and figure out your plan for survival", score: { stability: 2, whimsy: -1 } }, 
        { text: "Showcase your professional or academic talents and establish dominance", score: { control: 3 } }, 
        { text: "Start networking and making new friends", score: { stability: 1, community: 2 } },
        { text: "Just chillax and focus on your own goals", score: { whimsy: 2 } }] },
    { question: "What's your relationship with IKEA furnitures?", answers: [
        { text: "I follow the instructions exactly and worry about messing up", score: { stability: 2, whimsy: -1 } }, 
        { text: "The instructions are merely suggestions", score: { control: 2, stability: -1, whimsy: 1 } }, 
        { text: "I enjoy the challenge", score: { curiosity: 2, control: 1 } },
        { text: "I'll ask someone else to build it", score: { control: -2, community: 2 } }] },
    { question: "What keeps you awake at night?", answers: [
        { text: "An embarassing incident from 7th grade", score: { stability: 1, control: 1 } }, 
        { text: "Thinking about the 5 years plan for your career", score: { stability: 3, whimsy: -1 } }, 
        { text: "Getting too excited about your interest or something you learnt that day", score: { curiosity: 2, whimsy: 1 } },
        { text: " \"I LOVE HANNAH MONTANA\" ", score: { whimsy: 3 } }] },
    { question: "<br>West of House<br>You are standing in an open field west of a white house, with a boarded front door.<br>There is a small mailbox here.", answers: [
        { text: "open mailbox", score: { curiosity: 1 } }, 
        { text: "help", score: { control: -1, stability: 1 } }, 
        { text: "go south<br>go east<br>open window<br>enter house", score: { curiosity: 1, whimsy: -1 } }] },
    { question: "What are you plans for the weekend?", answers: [
        { text: "Hacking your neighbor's wifi", score: { curiosity: 2, whimsy: 2, community: -2 } },
        { text: "Relaxing at home and watching TV", score: { stability: 3 } },
        { text: "Playing boardgames with friends", score: { community: 3 } }, 
        { text: "Catching up on work", score: { stability: 3, whimsy: -1 } }] }];

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

function canBeGentoo() {
  return (
    answersGiven[0] === 0 &&
    answersGiven[1] === 1 && 
    answersGiven[2] === 2 && 
    answersGiven[4] === 2 );}

function dist(u, p) { 
    let s = 0; 
    traits.forEach(t => { let d = (u[t] || 0) - (p[t] || 0); s += d * d; }); 
    return Math.sqrt(s); }

function best_by_dist() {
  return Object.entries(distros)
    .map(([name, distro]) => ({name, ...distro, distance: dist(userTraits, distro.profile)}))
    .sort((a, b) => a.distance - b.distance)[0];}

function cosineSimilarity(user, profile) {
    let dot = 0;
    let userNorm = 0;
    let profileNorm = 0;

    for (const trait of traits) {
        const u = user[trait] || 0;
        const p = profile[trait] || 0;

        dot += u * p;
        userNorm += u * u;
        profileNorm += p * p;}

    return dot / (Math.sqrt(userNorm) * Math.sqrt(profileNorm));}

function best() {
    const gentooAllowed = canBeGentoo();

    return Object.entries(distros)
    .map(([name, distro]) => {
      if (name === "Gentoo" && !gentooAllowed) { 
        return {name, ...distro, similarity: -Infinity};} // if gentooNotAllowed, set similarity to -inifity
      return {name, ...distro, similarity: cosineSimilarity(userTraits, distro.profile)}; })
    .sort((a, b) => b.similarity - a.similarity)[0];
    }

function finish() {
  apply();
  const w = best();

const desc = { 
    Arch: "Arch Linux is an independently developed, x86_64-optimised Linux distribution targeted at competent Linux users. It uses 'pacman', its home-grown package manager, to provide updates to the latest software applications with full dependency tracking. Operating on a rolling release system, Arch can be installed from a CD image or via an FTP server. The default install provides a solid base that enables users to create a custom installation. In addition, the Arch Build System (ABS) provides a way to easily build new packages, modify the configuration of stock packages, and share these packages with other users via the Arch Linux user repository.", 
    Debian: "The Debian Project is an association of individuals who have made common cause to create a free operating system. This operating system is called Debian. Debian systems currently use the Linux kernel. Linux is a completely free piece of software started by Linus Torvalds and supported by thousands of programmers worldwide. Of course, the thing that people want is application software: programs to help them get what they want to do done, from editing documents to running a business to playing games to writing more software. Debian comes with over 50,000 packages (precompiled software that is bundled up in a nice format for easy installation on your machine) - all of it free. It's a bit like a tower. At the base is the kernel. On top of that are all the basic tools. Next is all the software that you run on the computer. At the top of the tower is Debian -- carefully organizing and fitting everything so it all works together.", 
    Fedora: "Fedora Linux (formerly Fedora, formerly Fedora Core) is a Linux distribution developed by the community-supported Fedora Project and owned by Red Hat. Fedora Linux contains software distributed under a free and open-source license and aims to be on the leading edge of such technologies. Fedora has a reputation for focusing on innovation, integrating new technologies early on and working closely with upstream Linux communities. The default desktop in Fedora Linux is the GNOME desktop environment and the default interface is the GNOME Shell. Other desktop environments, including KDE, Xfce, LXDE, MATE and Cinnamon, are available. The Fedora project also distributes custom variations of Fedora called Fedora spins. These are built with specific sets of software packages, offering alternative desktop environments or targeting specific interests such as gaming, security, design, scientific computing and robotics.", 
    Ubuntu: "Ubuntu is a complete desktop Linux operating system, freely available with both community and professional support. The Ubuntu community is built on the ideas enshrined in the Ubuntu Manifesto: that software should be available free of charge, that software tools should be usable by people in their local language and despite any disabilities, and that people should have the freedom to customise and alter their software in whatever way they see fit. \"Ubuntu\" is an ancient African word, meaning \"humanity to others\". The Ubuntu distribution brings the spirit of Ubuntu to the software world.",
    Gentoo: "Gentoo Linux is a versatile and fast, completely free Linux distribution geared towards developers and network professionals. Unlike other distros, Gentoo Linux has an advanced package management system called Portage. Portage is a true ports system in the tradition of BSD ports, but is Python-based and sports a number of advanced features including dependencies, fine-grained package management, \"fake\" (OpenBSD-style) installs, safe unmerging, system profiles, virtual packages, config file management, and more.",
    openSUSE: "The openSUSE project is a community program sponsored by SUSE Linux and other companies. Promoting the use of Linux everywhere, this program provides free, easy access to openSUSE, a complete Linux distribution. The openSUSE project has three main goals: make openSUSE the easiest Linux for anyone to obtain and the most widely used Linux distribution; leverage open source collaboration to make openSUSE the world's most usable Linux distribution and desktop environment for new and experienced Linux users; dramatically simplify and open the development and packaging processes to make openSUSE the platform of choice for Linux developers and software vendors.",
    "Hannah Montana": "Hannah Montana Linux is an outdated Linux distro that was released in 2009. It was built on top of Kubuntu 9.04 and its UI was a modified KDE 4.2, sporting heavy usage of the colour purple. As the name implies, it was themed around the Disney Channel sitcom \"Hannah Montana\", which was still making new episodes at the time the distro was launched (it stopped making new episodes in 2011)." }; 

  quizEl.classList.add("hidden");
  nextBtn.classList.add("hidden");
  prevBtn.classList.add("hidden");
  resultEl.classList.remove("hidden");

  resultEl.innerHTML = `
    <h2>You are ${w.name} Linux!</h2>
    <p>${w.description}</p>
    <img
      class="result-figure"
      src="${w.figure}"
      alt="${w.name} figure">
    <p class="distro-description">
    ${desc[w.name]}<br><br>
    Descriptions are taken from <a href="https://distrowatch.com/" target="_blank" rel="noopener noreferrer">DistroWatch</a> and <a href="https://linux.fandom.com/wiki" target="_blank" rel="noopener noreferrer">Linux fandom wiki</a>, learn more about linux distributiosn by visiting these sites! </p>
    <button id="restartBtn">Restart</button>`;

  document.getElementById("restartBtn").onclick = () => {
    currentQuestion = 0;
    answersGiven.fill(null);
    traits.forEach(t => userTraits[t] = 0);

    nextBtn.classList.remove("hidden");
    prevBtn.classList.remove("hidden");

    renderQuestion();
  };}

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