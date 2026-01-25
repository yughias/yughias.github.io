class Summoner {
    constructor(words) {
        this.words = words;
        this.buffer = "";
        document.addEventListener("keydown", (e) => this.handleKey(e));
    }
    
    handleKey(e) {
        if (e.key.length === 1) {
            this.buffer += e.key.toLowerCase();
        } else if (e.key === "Backspace") {
            this.buffer = this.buffer.slice(0, -1);
        } else if (e.key === " ") {
            this.buffer = "";
        }
        this.check();
    }

    check() {
        for (let word in this.words) {
            if (this.buffer.endsWith(word.toLowerCase())) {
                let pet = this.words[word];
                for(let i = 0; i < pet.n; i++){
                    setTimeout(() => {
                        let scale = pet.scale.length == 2 ? pet.scale[0] + Math.random() * (pet.scale[1] - pet.scale[0]) : pet.scale || 1;
                        let el = document.createElement("div");
                        el.className = "pet";
                        el.style.setProperty("--scale", scale);
                        el.style.setProperty("--w", pet.w + "px");
                        el.style.setProperty("--h", pet.h + "px");
                        el.style.setProperty("--frames", pet.frames);
                        el.style.setProperty("--speed", pet.speed + "s");
                        el.style.setProperty("--move-time", pet.moveTime + "s");
                        el.style.setProperty("--x", -(pet.w * pet.frames) + "px");
                        el.style.setProperty("--move-type", pet.dir);
                        el.style.backgroundImage = `url(img/pets/${pet.url})`;
                        let pos = 5 + Math.random() * 90;
                        el.style.top = pet.dir == "move-left-right" ? pos + "vh" : "0vh";
                        el.style.left = pet.dir == "move-left-right" ? "0vw" : pos + "vw";
                        if(pet.isBottom) el.style.top = "calc(100vh - " + pet.h*scale + "px)";
                        document.body.appendChild(el);
                        el.addEventListener("animationend", () => el.remove());
                    }, i*100 + (i > 0)*Math.random()*100);
                }
                this.buffer = "";
            }
        }
    }
}

new Summoner({
    kirby: {
        n: 64,
        url: "kirby.png",
        dir: "move-left-right",
        w: 32,
        h: 32,
        frames: 8,
        speed: 0.8,
        moveTime: 5,
        scale: [1, 2]
    },

    tails: {
        n: 1,
        url: "tails.png",
        dir: "move-left-right",
        w: 128,
        h: 85,
        frames: 4,
        scale: 1.5,
        speed: 0.4,
        moveTime: 3,
    },

    sonic: {
        n: 1,
        url: "sonic.png",
        dir: "move-left-right",
        w: 34,
        h: 36,
        frames: 4,
        speed: 0.3,
        moveTime: 2,
        scale: 2,
        isBottom: true
    },

    hamtaro: {
        n: 1,
        url: "hamtaro.png",
        dir: "move-left-right",
        w: 32,
        h: 32,
        frames: 4,
        speed: 1.5,
        moveTime: 10,
        scale: [2, 3],
        isBottom: true
    }
});