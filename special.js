/* ===========================
   MUSIC CONFIG
=========================== */

const START_TIME = 15;
const START_VOLUME = 5;
const TARGET_VOLUME = 10;

const FADEOUT_TIME = 77;  // seconds
const FADEIN_TIME = 96;   // seconds

let player;
let musicStarted = false;
let fadeOutDone = false;
let fadeInDone = false;

/* ===========================
   YOUTUBE API LOAD
=========================== */

let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);

function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        events: {
            onStateChange: function(event) {
                // 🔁 LOOP from 15s
                if (event.data === YT.PlayerState.ENDED) {
                    resetMusicFlags();
                    player.seekTo(START_TIME, true);
                    player.playVideo();
                }
            }
        }
    });
}

function resetMusicFlags() {
    fadeOutDone = false;
    fadeInDone = false;
}

function playMusic() {
    if (player && !musicStarted) {
        musicStarted = true;

        player.seekTo(START_TIME, true);
        player.setVolume(START_VOLUME);
        player.playVideo();

        fadeInVolume(START_VOLUME, TARGET_VOLUME, 3000);
        monitorTimeline();
    }
}

/* ===========================
   VOLUME CONTROLS
=========================== */

function fadeInVolume(start, end, duration) {
    let current = start;
    const step = 100;
    const steps = duration / step;
    const increment = (end - start) / steps;

    const fade = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(fade);
        }
        player.setVolume(Math.floor(current));
    }, step);
}

function fadeOutVolume(start, duration) {
    let current = start;
    const step = 100;
    const steps = duration / step;
    const decrement = start / steps;

    const fade = setInterval(() => {
        current -= decrement;
        if (current <= 0) {
            current = 0;
            clearInterval(fade);
            player.setVolume(0);
        } else {
            player.setVolume(Math.floor(current));
        }
    }, step);
}

/* ===========================
   TIMELINE MONITOR
=========================== */

function monitorTimeline() {
    setInterval(() => {
        if (!player || !player.getCurrentTime) return;

        const t = player.getCurrentTime();

        // 🎵 Fade out at 77s
        if (t >= FADEOUT_TIME && !fadeOutDone) {
            fadeOutDone = true;
            const vol = player.getVolume();
            fadeOutVolume(vol, 3000);
        }

        // 🎵 Fade in at 96s
        if (t >= FADEIN_TIME && !fadeInDone) {
            fadeInDone = true;
            fadeInVolume(0, TARGET_VOLUME, 3000);
        }

    }, 500);
}

/* ===========================
   CANVAS PARTICLES
=========================== */

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(isExplosion = false) { 
        this.isExplosion = isExplosion;
        this.reset(isExplosion, true); 
    }

    reset(isExplosion, initial = false) {
        this.isExplosion = isExplosion;
        this.x = isExplosion ? window.innerWidth / 2 : Math.random() * window.innerWidth;
        
        if (isExplosion) {
            this.y = window.innerHeight / 2;
        } else if (initial) {
            this.y = Math.random() * window.innerHeight;
        } else {
            this.y = window.innerHeight + 20;
        }
        
        this.size = Math.random() * 12 + 6;
        this.speedX = isExplosion ? (Math.random() - 0.5) * 15 : (Math.random() - 0.5) * 1.5;
        this.speedY = isExplosion ? (Math.random() - 0.5) * 15 : -Math.random() * 1.0 - 0.5;
        this.opacity = isExplosion ? 1 : Math.random() * 0.5 + 0.1;
        this.color = `hsla(${Math.random() * 20 + 340}, 80%, 80%, ${this.opacity})`;
    }

    update() {
        this.x += this.speedX; 
        this.y += this.speedY;
        
        if (this.isExplosion) this.opacity -= 0.015;
        if (this.y < -30 && !this.isExplosion) this.reset(false, false);
    }

    draw() {
        ctx.globalAlpha = this.opacity; 
        ctx.fillStyle = this.color; 
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.bezierCurveTo(this.x - this.size/2, this.y - this.size/2, this.x - this.size, this.y + this.size/3, this.x, this.y + this.size);
        ctx.bezierCurveTo(this.x + this.size, this.y + this.size/3, this.x + this.size/2, this.y - this.size/2, this.x, this.y);
        ctx.fill();
    }
}

for (let i = 0; i < 40; i++) particles.push(new Particle(false));

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
        p.update(); p.draw();
        if (p.isExplosion && p.opacity <= 0) particles.splice(i, 1);
    });
    requestAnimationFrame(animate);
}
animate();

/* ===========================
   LETTER LOGIC (UNCHANGED)
=========================== */
const pages = [
    `Dear Raja,\n Today is quite special, isn't it?`,
    `Our story goes 8 years back now...,\nIndeed a long time, eh?`,
    `I don't know how god put that kind of strength in me(8th std.) to ask you out that day,`,
    `But tbh, I'm glad that he did, because I can't imagine my life without you now.`,
    `Let's walk through the memories, the laughter, the tears, and the love we've shared over these years.`,
    `After 8th, we became closest of friends, sharing everything,\n laughing together on Somanka and pradeep Sir😂....`,
    `And then,I proposed you again in 9th Std, \nif you remember, and if u don't, \nI had a slip of tongue saying that on PTM😝,`,
    `I said \"I lob you\", and then you corrected saying,\n \"Thoda dhang se hi bol deta🤣\"`,
    `Although, I was quite happy, kyuki uska reply \n \"I love you toooo...but there are some conditions\" aaya tha😅`,
    `But I forgot the date, do u remember it? It was probably in sept or oct,perhaps`,
    `Anyways, the conditions were, \"We\'re tooo young for this and blah....blah...blah...`,
    `I guess we had quite innocence in our love,\n ofcourse due to being kids, but it was pure and real.`,
    `Then, nothing much happened, we continued being best of friends,\n vo moti dhwani ki aur vishakha ki bitching karte the😂,`,
    `French tuition mein bahot bakchodi bhi kari, and bahottt kuchhh...`,
    `Then straight after 10th std, on a random day, you called me in the evening, and said \"YESSS!\"`,
    `That was like the happiest moment of my life, I was on cloud nine, and I still am, knowing that you said yes to me`,
    `Yrrrrrr Vnnnn!....Mai vo date bhi bhul gya😅,\ntujhe yaad hai? Around April or May, plss yaad ho toh bataiyo😅`,
    `Aur fir iss part ke baad thoda guilt aajata hai, kyuki maine bahhhooooottttttt badi galti kardi thi😭`,
    `I am reallllyyyyyyy Soooooorrrrrrrrrryyyyyyyyyy for that Raja, I know I hurt you deeply`,
    `Till date, I regret that vnnnn! I wish I could undo that, but it happened, and now there's no going back!`,
    `But..But...But...\n since you're such a pretty soul, you forgave me, and we started it all over again, I'm so grateful for that.`,
    `You're the most adorable, kind-hearted, and loving person I have ever met.`,
    `Always the helpful one, always the one who cares, always the one who loves.`,
    `Ha bhale hi phone dhang se use nhi karti🙄, baat saamne se initiate karne ka kasht nhi uthati😜, but jaisi bhi hai, perfect hai!`,
    `It's tough to find someone like you in this world, raja. Grateful to have you in my life😊.`,
    `I know I'm not the best at expressing my feelings, but I hope this letter can convey even a fraction of how much you mean to me.`,
    `But, today's a day to celebrate love, and I wanted to celebrate our journey.`,
    `It's a special day for us, and I wanted to do something special, so I made this letter for you,`,
    `I hope you like it, and I hope it brings a smile to your face, just like you always do to mine.`,
    `I love you, Raja. Happy Valentine's! ❤️ \n~ Your "Someone Special"`,
    `OOOPPPPPPS!\n Suspennnnseeeeeee to reveal nhi kiya😶‍🌫️!`,
    `I'm coming to Ahmedabad on your Birthday Raja ,and I can't wait to see you! 🥳🎉`,
    `So, this is the end of the letter, but not the end of our story. We have many more chapters to write together, many more memories to create, and many more moments to cherish.`,
    `[[LIVE_COUNTDOWN]]`,
];

function start() {
    document.getElementById('home').style.opacity = 0;
    setTimeout(() => {
        document.getElementById('home').style.display = 'none';
        document.getElementById('stage').style.display = 'flex';
    }, 1000);
}

let current = 0;
let charIndex = 0;
let typingTimeout;
let autoTransitionTimeout;
let countdownInterval;

function typeText() {
    const active = document.querySelector('.letter.active');
    if (!active) return;

    if (pages[current] === "[[LIVE_COUNTDOWN]]") {
        active.innerHTML = `<div class="timer-header">GoodBye Raja! \n Love u Lots!😘💕</div><div id="timer-display" class="live-countdown"></div>`;
        startLiveTimer();
        autoTransitionTimeout = setTimeout(nextPage, 8000); 
        return;
    }
    
    if (charIndex < pages[current].length) {
        let char = pages[current][charIndex];
        active.innerHTML += (char === '\n') ? '<br>' : char;
        charIndex++;
        typingTimeout = setTimeout(typeText, 40);
    } else {
        if (current < pages.length - 1)
            autoTransitionTimeout = setTimeout(nextPage, 4000);
    }
}

function nextPage() {
    if (current < pages.length - 1) {
        current++; 
        charIndex = 0; 
        renderStack(); 
        typeText();
    }
}

function renderStack() {
    const stack = document.getElementById('stack');
    stack.innerHTML = ''; 
    const page = document.createElement('div');
    page.className = 'letter active';
    stack.appendChild(page);
}

/* ===========================
   HEART CLICK
=========================== */

document.getElementById('mainHeart').addEventListener('click', () => {
    document.getElementById('envelope').classList.add('open');

    playMusic();

    for (let i = 0; i < 70; i++) particles.push(new Particle(true));

    setTimeout(() => { renderStack(); typeText(); }, 1100);
});

window.addEventListener('resize', () => { 
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight; 
});
