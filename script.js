(() => {
    "use strict";

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const RESUME_FILE = "Lauhith_Natarajan_Resume.pdf";

    const confettiState = {
        pieces: [],
        rafId: null
    };

    const skillDetails = [
        {
            label: "SQL",
            score: 95,
            description: "Strong query design for clean KPI extraction, slicing, and trend diagnostics.",
            mission: "Personal Finances Command Center",
            tags: ["Joins", "Window Functions", "Data Validation"]
        },
        {
            label: "Python",
            score: 90,
            description: "Data wrangling and lightweight automation that accelerates analyst workflows.",
            mission: "Restaurant Performance Intelligence",
            tags: ["Pandas", "Exploration", "Automation"]
        },
        {
            label: "Tableau",
            score: 92,
            description: "Dashboard-first storytelling with executive-friendly visual hierarchy.",
            mission: "Restaurant Performance Intelligence",
            tags: ["Dashboards", "Filters", "Narrative Flow"]
        },
        {
            label: "Power BI",
            score: 88,
            description: "Business reporting design with practical metrics and stakeholder context.",
            mission: "Finance Dashboard Web App",
            tags: ["Data Model", "Measures", "Visual Design"]
        },
        {
            label: "Excel",
            score: 96,
            description: "Reliable analysis base for quick modeling and operational tracking.",
            mission: "Personal Finances Command Center",
            tags: ["Pivot Logic", "Scenario Analysis", "Auditability"]
        },
        {
            label: "Storytelling",
            score: 91,
            description: "Turning raw findings into narratives that leaders can act on quickly.",
            mission: "Business Analytics Blog Platform",
            tags: ["Narrative", "Communication", "Business Framing"]
        }
    ];

    const audioState = {
        enabled: false,
        context: null
    };

    document.addEventListener("DOMContentLoaded", () => {
        setCurrentYear();
        initLoader();
        initThemeToggle();
        initSoundToggle();
        initNavigation();
        initSmoothScroll();
        initSectionReveal();
        initHeroTyping();
        initHeroParticles();
        initKonamiCode();
        initTerminalSequence();
        initSkillsRadar();
        initMissionImages();
        initMissionCards();
        initMissionFilters();
        initGitHubMetrics();
        initTimeline();
        initResumeMeta();
        initResumeLaunch();
        initResumeBrowserOpen();
        initCustomCursor();
    });

    function setCurrentYear() {
        const yearNode = document.getElementById("year");
        if (yearNode) {
            yearNode.textContent = String(new Date().getFullYear());
        }
    }

    function initLoader() {
        const loader = document.getElementById("loader");
        if (!loader) {
            return;
        }

        let firstVisit = true;
        try {
            firstVisit = localStorage.getItem("data-universe-visited") !== "1";
            localStorage.setItem("data-universe-visited", "1");
        } catch (error) {
            firstVisit = true;
        }

        const delay = prefersReducedMotion ? 40 : firstVisit ? 1500 : 420;
        window.setTimeout(() => {
            loader.classList.add("is-hidden");
        }, delay);
    }

    function initThemeToggle() {
        const toggleButton = document.getElementById("theme-toggle");
        const themeMeta = document.querySelector("meta[name='theme-color']");
        if (!toggleButton) {
            return;
        }

        try {
            const storedTheme = localStorage.getItem("data-universe-theme");
            if (storedTheme === "light") {
                document.body.classList.add("light-theme");
            }
        } catch (error) {
            // ignore storage failures
        }

        const updateThemeButton = () => {
            const isLight = document.body.classList.contains("light-theme");
            toggleButton.setAttribute("aria-pressed", String(isLight));
            toggleButton.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
            if (themeMeta) {
                themeMeta.setAttribute("content", isLight ? "#edf5ff" : "#0a0a0f");
            }
        };

        toggleButton.addEventListener("click", () => {
            document.body.classList.toggle("light-theme");
            updateThemeButton();
            try {
                localStorage.setItem("data-universe-theme", document.body.classList.contains("light-theme") ? "light" : "dark");
            } catch (error) {
                // ignore storage failures
            }
        });

        updateThemeButton();
    }

    function initSoundToggle() {
        const soundButton = document.getElementById("sound-toggle");
        if (!soundButton) {
            return;
        }

        const soundIcon = soundButton.querySelector("i");

        soundButton.addEventListener("click", () => {
            audioState.enabled = !audioState.enabled;
            soundButton.setAttribute("aria-pressed", String(audioState.enabled));

            if (soundIcon) {
                soundIcon.className = audioState.enabled ? "fa-solid fa-volume-high" : "fa-solid fa-volume-xmark";
            }

            if (audioState.enabled) {
                ensureAudioContext();
                playTone(620, 0.04, 0.02);
            }
        });

        const interactiveTargets = document.querySelectorAll(".interactive");
        interactiveTargets.forEach((node) => {
            node.addEventListener("mouseenter", () => {
                playTone(750, 0.015, 0.008);
            });
            node.addEventListener("click", () => {
                playTone(340, 0.04, 0.015);
            });
        });
    }

    function ensureAudioContext() {
        if (!audioState.context) {
            audioState.context = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioState.context.state === "suspended") {
            audioState.context.resume();
        }
    }

    function playTone(frequency, duration, gainValue) {
        if (!audioState.enabled || prefersReducedMotion) {
            return;
        }

        try {
            ensureAudioContext();
            const oscillator = audioState.context.createOscillator();
            const gain = audioState.context.createGain();
            const now = audioState.context.currentTime;

            oscillator.type = "sine";
            oscillator.frequency.setValueAtTime(frequency, now);

            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

            oscillator.connect(gain);
            gain.connect(audioState.context.destination);

            oscillator.start(now);
            oscillator.stop(now + duration + 0.01);
        } catch (error) {
            // ignore audio failures
        }
    }

    function initNavigation() {
        const header = document.getElementById("site-header");
        const menuToggle = document.getElementById("menu-toggle");
        const navOverlay = document.getElementById("nav-overlay");
        const navLinks = Array.from(document.querySelectorAll(".nav-links a, .nav-overlay a"));
        const sections = Array.from(document.querySelectorAll("main section[id]"));

        const setMenuState = (isOpen) => {
            if (!menuToggle || !navOverlay) {
                return;
            }

            document.body.classList.toggle("menu-open", isOpen);
            menuToggle.setAttribute("aria-expanded", String(isOpen));

            if (isOpen) {
                navOverlay.hidden = false;
            } else {
                window.setTimeout(() => {
                    if (!document.body.classList.contains("menu-open")) {
                        navOverlay.hidden = true;
                    }
                }, 320);
            }
        };

        if (menuToggle) {
            menuToggle.addEventListener("click", () => {
                const open = !document.body.classList.contains("menu-open");
                setMenuState(open);
            });
        }

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                setMenuState(false);
            }
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                setMenuState(false);
            });
        });

        const setActiveLink = (id) => {
            navLinks.forEach((link) => {
                const matches = link.getAttribute("href") === `#${id}`;
                link.classList.toggle("active", matches);
            });
        };

        if (sections.length > 0) {
            const navObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveLink(entry.target.id);
                        }
                    });
                },
                {
                    threshold: 0.55
                }
            );

            sections.forEach((section) => {
                navObserver.observe(section);
            });
        }

        const onScroll = () => {
            if (!header) {
                return;
            }
            header.classList.toggle("is-scrolled", window.scrollY > 24);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    }

    function initSmoothScroll() {
        const controls = Array.from(document.querySelectorAll("a[href^='#'], button[data-target]"));

        controls.forEach((control) => {
            control.addEventListener("click", (event) => {
                const selector = control.dataset.target || control.getAttribute("href");
                if (!selector || !selector.startsWith("#")) {
                    return;
                }

                const target = document.querySelector(selector);
                if (!target) {
                    return;
                }

                event.preventDefault();
                target.scrollIntoView({
                    behavior: prefersReducedMotion ? "auto" : "smooth",
                    block: "start"
                });
            });
        });
    }

    function initSectionReveal() {
        const revealTargets = document.querySelectorAll(".section-reveal");
        if (revealTargets.length === 0) {
            return;
        }

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.18
            }
        );

        revealTargets.forEach((target) => {
            revealObserver.observe(target);
        });
    }

    function initHeroTyping() {
        const typedName = document.getElementById("typed-name");
        const heroTitle = document.getElementById("hero-title");
        const heroTagline = document.getElementById("hero-tagline");

        if (!typedName || !heroTitle || !heroTagline) {
            return;
        }

        const fullName = "Lauhith Natarajan";

        if (prefersReducedMotion) {
            typedName.textContent = fullName;
            heroTitle.classList.add("neon");
            heroTagline.classList.add("reveal");
            return;
        }

        let index = 0;
        const typeInterval = window.setInterval(() => {
            typedName.textContent = fullName.slice(0, index + 1);
            index += 1;

            if (index >= fullName.length) {
                window.clearInterval(typeInterval);
                window.setTimeout(() => {
                    heroTitle.classList.add("neon");
                    heroTagline.classList.add("reveal");
                }, 220);
            }
        }, 92);
    }

    function initHeroParticles() {
        const heroSection = document.getElementById("hero");
        const canvas = document.getElementById("hero-particles");
        if (!heroSection || !canvas || prefersReducedMotion) {
            return;
        }

        const context = canvas.getContext("2d");
        if (!context) {
            return;
        }

        let particles = [];
        let width = 0;
        let height = 0;
        const pointer = {
            x: 0,
            y: 0,
            active: false
        };

        const createParticles = () => {
            const count = Math.min(105, Math.max(48, Math.floor(width / 14)));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 1.8 + 1.1
            }));
        };

        const resizeCanvas = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = heroSection.clientWidth;
            height = heroSection.clientHeight;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            context.setTransform(dpr, 0, 0, dpr, 0, 0);
            createParticles();
        };

        const drawFrame = () => {
            context.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i += 1) {
                const p = particles[i];

                if (pointer.active) {
                    const dx = p.x - pointer.x;
                    const dy = p.y - pointer.y;
                    const distance = Math.hypot(dx, dy);
                    if (distance < 120 && distance > 0) {
                        const force = (120 - distance) / 120;
                        p.vx += (dx / distance) * force * 0.03;
                        p.vy += (dy / distance) * force * 0.03;
                    }
                }

                p.x += p.vx;
                p.y += p.vy;

                p.vx *= 0.99;
                p.vy *= 0.99;

                if (p.x <= 0 || p.x >= width) {
                    p.vx *= -1;
                }
                if (p.y <= 0 || p.y >= height) {
                    p.vy *= -1;
                }

                context.beginPath();
                context.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                context.fillStyle = "rgba(0, 212, 255, 0.8)";
                context.fill();

                for (let j = i + 1; j < particles.length; j += 1) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 108) {
                        const alpha = 1 - dist / 108;
                        context.beginPath();
                        context.moveTo(p.x, p.y);
                        context.lineTo(p2.x, p2.y);
                        context.strokeStyle = `rgba(124, 58, 237, ${alpha * 0.35})`;
                        context.lineWidth = 1;
                        context.stroke();
                    }
                }
            }

            window.requestAnimationFrame(drawFrame);
        };

        heroSection.addEventListener("pointermove", (event) => {
            const rect = heroSection.getBoundingClientRect();
            pointer.x = event.clientX - rect.left;
            pointer.y = event.clientY - rect.top;
            pointer.active = true;
        });

        heroSection.addEventListener("pointerleave", () => {
            pointer.active = false;
        });

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
        drawFrame();
    }

    function initKonamiCode() {
        const sequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
        let index = 0;

        window.addEventListener("keydown", (event) => {
            const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
            if (key === sequence[index]) {
                index += 1;
            } else {
                index = key === sequence[0] ? 1 : 0;
            }

            if (index === sequence.length) {
                index = 0;
                showToast("You found the easter egg! You're clearly detail-oriented \u{1F609}");
                launchConfetti(window.innerWidth * 0.5, window.innerHeight * 0.25, 220);
            }
        });
    }

    function showToast(message) {
        const toast = document.getElementById("easter-egg-toast");
        if (!toast) {
            return;
        }

        toast.textContent = message;
        toast.classList.add("show");

        window.clearTimeout(showToast._timer);
        showToast._timer = window.setTimeout(() => {
            toast.classList.remove("show");
        }, 3600);
    }

    function launchConfetti(originX, originY, count) {
        const canvas = document.getElementById("confetti-canvas");
        if (!canvas || prefersReducedMotion) {
            return;
        }

        const context = canvas.getContext("2d");
        if (!context) {
            return;
        }

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();

        for (let i = 0; i < count; i += 1) {
            confettiState.pieces.push({
                x: originX,
                y: originY,
                vx: (Math.random() - 0.5) * 9,
                vy: Math.random() * -8 - 2,
                gravity: 0.16 + Math.random() * 0.03,
                size: 3 + Math.random() * 4,
                life: 0,
                ttl: 80 + Math.random() * 55,
                spin: (Math.random() - 0.5) * 0.3,
                angle: Math.random() * Math.PI * 2,
                color: ["#00d4ff", "#7c3aed", "#50f3a1", "#ffffff"][Math.floor(Math.random() * 4)]
            });
        }

        const render = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);

            confettiState.pieces = confettiState.pieces.filter((piece) => {
                piece.life += 1;
                piece.vy += piece.gravity;
                piece.x += piece.vx;
                piece.y += piece.vy;
                piece.angle += piece.spin;

                const alive = piece.life < piece.ttl && piece.y < canvas.height + 30;
                if (!alive) {
                    return false;
                }

                context.save();
                context.translate(piece.x, piece.y);
                context.rotate(piece.angle);
                context.fillStyle = piece.color;
                context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.7);
                context.restore();

                return true;
            });

            if (confettiState.pieces.length > 0) {
                confettiState.rafId = window.requestAnimationFrame(render);
            } else {
                confettiState.rafId = null;
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        };

        if (!confettiState.rafId) {
            render();
        }

        window.addEventListener("resize", resizeCanvas, { once: true });
    }

    function initTerminalSequence() {
        const aboutSection = document.getElementById("about");
        const terminalOutput = document.getElementById("terminal-output");
        const statusLine = document.getElementById("terminal-status-line");
        const progressItems = Array.from(document.querySelectorAll(".terminal-progress"));

        if (!aboutSection || !terminalOutput || !statusLine || progressItems.length === 0) {
            return;
        }

        const terminalLines = [
            "> lauhith --skills",
            "Loading skills... \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 100%",
            "[SQL] [Python] [Tableau] [Power BI] [Excel] [Data Storytelling]",
            "",
            "> lauhith --status",
            "\u{1F4CD} Toronto, ON | \u{1F3AF} Seeking BA/DA roles | \u2615 Powered by coffee"
        ];

        const animateBars = (instant = false) => {
            progressItems.forEach((item, index) => {
                const fill = item.querySelector(".progress-fill");
                const level = Number(item.dataset.level) || 0;

                const run = () => {
                    if (fill) {
                        fill.style.width = `${level}%`;
                    }
                };

                if (instant) {
                    run();
                } else {
                    window.setTimeout(run, 110 + index * 120);
                }
            });
        };

        const startTerminal = () => {
            if (prefersReducedMotion) {
                terminalOutput.textContent = terminalLines.join("\n");
                statusLine.textContent = "System online. Awaiting next command...";
                animateBars(true);
                return;
            }

            let lineIndex = 0;
            let charIndex = 0;

            const typeNext = () => {
                if (lineIndex >= terminalLines.length) {
                    statusLine.textContent = "System online. Awaiting next command...";
                    animateBars(false);
                    return;
                }

                const line = terminalLines[lineIndex];
                if (charIndex < line.length) {
                    terminalOutput.textContent += line.charAt(charIndex);
                    charIndex += 1;
                    window.setTimeout(typeNext, line.startsWith("Loading") ? 16 : 21);
                } else {
                    terminalOutput.textContent += "\n";
                    lineIndex += 1;
                    charIndex = 0;
                    window.setTimeout(typeNext, 110);
                }
            };

            typeNext();
        };

        let started = false;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !started) {
                        started = true;
                        startTerminal();
                    }
                });
            },
            {
                threshold: 0.45
            }
        );

        observer.observe(aboutSection);
    }

    function initSkillsRadar() {
        const chartCanvas = document.getElementById("skills-radar");
        const titleNode = document.getElementById("inspector-title");
        const textNode = document.getElementById("inspector-text");
        const missionNode = document.getElementById("inspector-project");
        const tagsNode = document.getElementById("inspector-tags");

        if (!chartCanvas || typeof Chart === "undefined") {
            return;
        }

        const chartContext = chartCanvas.getContext("2d");
        const pointRadius = isCoarsePointer ? 9 : 7;
        const pointHoverRadius = isCoarsePointer ? 13 : 11;
        const pointHitRadius = isCoarsePointer ? 24 : 18;
        const radar = new Chart(chartContext, {
            type: "radar",
            data: {
                labels: skillDetails.map((item) => item.label),
                datasets: [
                    {
                        label: "Skill Depth",
                        data: skillDetails.map((item) => item.score),
                        fill: true,
                        borderWidth: 2,
                        borderColor: "rgba(0, 212, 255, 0.9)",
                        backgroundColor: "rgba(0, 212, 255, 0.18)",
                        pointBackgroundColor: "#7c3aed",
                        pointBorderColor: "#dff7ff",
                        pointRadius,
                        pointHoverRadius,
                        pointHitRadius,
                        pointBorderWidth: 2,
                        pointHoverBorderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: "nearest",
                    intersect: true
                },
                animation: prefersReducedMotion
                    ? false
                    : {
                          duration: 700,
                          easing: "easeOutCubic"
                      },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        displayColors: false,
                        callbacks: {
                            label: (context) => `${context.formattedValue}%`
                        }
                    }
                },
                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        ticks: {
                            stepSize: 20,
                            backdropColor: "transparent",
                            color: "rgba(160, 160, 160, 0.6)"
                        },
                        angleLines: {
                            color: "rgba(160, 160, 160, 0.25)"
                        },
                        grid: {
                            color: "rgba(160, 160, 160, 0.2)"
                        },
                        pointLabels: {
                            color: "rgba(255, 255, 255, 0.85)",
                            font: {
                                size: 12,
                                family: "IBM Plex Mono"
                            }
                        }
                    }
                }
            }
        });

        const paintInspector = (index) => {
            const skill = skillDetails[index];
            if (!skill || !titleNode || !textNode || !missionNode || !tagsNode) {
                return;
            }

            titleNode.textContent = `${skill.label} | ${skill.score}%`;
            textNode.textContent = skill.description;
            missionNode.innerHTML = `<strong>Mission:</strong> ${skill.mission}`;

            tagsNode.innerHTML = "";
            skill.tags.forEach((tag) => {
                const item = document.createElement("li");
                item.textContent = tag;
                tagsNode.appendChild(item);
            });
        };

        paintInspector(0);

        const inspectFromEvent = (event, intersect = true) => {
            const nearest = radar.getElementsAtEventForMode(event, "nearest", { intersect }, true);
            if (nearest.length > 0) {
                paintInspector(nearest[0].index);
            }
        };

        chartCanvas.style.touchAction = "manipulation";

        chartCanvas.addEventListener("pointermove", (event) => {
            inspectFromEvent(event, true);
        });

        chartCanvas.addEventListener("pointerdown", (event) => {
            inspectFromEvent(event, false);
        });
    }

    function initMissionCards() {
        const cards = document.querySelectorAll(".mission-card");

        document.querySelectorAll(".expand-btn").forEach((button) => {
            button.addEventListener("click", () => {
                const card = button.closest(".mission-card");
                if (!card) {
                    return;
                }

                const expanded = button.getAttribute("aria-expanded") === "true";
                button.setAttribute("aria-expanded", String(!expanded));
                button.textContent = expanded ? "View Mission Details" : "Collapse Mission Details";
                card.classList.toggle("expanded", !expanded);
            });
        });

        if (prefersReducedMotion || isCoarsePointer) {
            return;
        }

        cards.forEach((card) => {
            const shell = card.querySelector(".tilt-shell");
            const inner = card.querySelector(".tilt-inner");
            if (!shell || !inner) {
                return;
            }

            shell.addEventListener("mousemove", (event) => {
                const rect = shell.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - 0.5;
                const y = (event.clientY - rect.top) / rect.height - 0.5;
                const rotateX = (-y * 8).toFixed(2);
                const rotateY = (x * 10).toFixed(2);
                inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            shell.addEventListener("mouseleave", () => {
                inner.style.transform = "rotateX(0deg) rotateY(0deg)";
            });
        });
    }

    function initMissionFilters() {
        const buttons = Array.from(document.querySelectorAll(".filter-btn"));
        const cards = Array.from(document.querySelectorAll(".mission-card"));
        if (buttons.length === 0 || cards.length === 0) {
            return;
        }

        const runFlip = (filter) => {
            const firstRects = new Map();
            cards.forEach((card) => {
                if (!card.classList.contains("is-hidden")) {
                    firstRects.set(card, card.getBoundingClientRect());
                }
            });

            const toHide = [];
            const toShow = [];

            cards.forEach((card) => {
                const categories = (card.dataset.category || "").split(/\s+/);
                const shouldShow = filter === "all" || categories.includes(filter);

                if (shouldShow && card.classList.contains("is-hidden")) {
                    toShow.push(card);
                }

                if (!shouldShow && !card.classList.contains("is-hidden")) {
                    toHide.push(card);
                }
            });

            const hideAnimations = toHide.map(
                (card) =>
                    new Promise((resolve) => {
                        const animation = card.animate(
                            [
                                { opacity: 1, transform: "scale(1)" },
                                { opacity: 0, transform: "scale(0.92)" }
                            ],
                            {
                                duration: 220,
                                easing: "ease"
                            }
                        );

                        animation.onfinish = () => {
                            card.classList.add("is-hidden");
                            resolve();
                        };
                    })
            );

            Promise.all(hideAnimations).then(() => {
                toShow.forEach((card) => {
                    card.classList.remove("is-hidden");
                });

                window.requestAnimationFrame(() => {
                    const visibleCards = cards.filter((card) => !card.classList.contains("is-hidden"));
                    const lastRects = new Map(visibleCards.map((card) => [card, card.getBoundingClientRect()]));

                    visibleCards.forEach((card) => {
                        const first = firstRects.get(card);
                        const last = lastRects.get(card);

                        if (first && last) {
                            const deltaX = first.left - last.left;
                            const deltaY = first.top - last.top;

                            if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
                                card.animate(
                                    [
                                        { transform: `translate(${deltaX}px, ${deltaY}px)` },
                                        { transform: "translate(0, 0)" }
                                    ],
                                    {
                                        duration: 420,
                                        easing: "cubic-bezier(0.22, 1, 0.36, 1)"
                                    }
                                );
                            }
                        } else if (toShow.includes(card)) {
                            card.animate(
                                [
                                    { opacity: 0, transform: "scale(0.94) translateY(14px)" },
                                    { opacity: 1, transform: "scale(1) translateY(0)" }
                                ],
                                {
                                    duration: 350,
                                    easing: "cubic-bezier(0.22, 1, 0.36, 1)"
                                }
                            );
                        }
                    });
                });
            });
        };

        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                if (button.classList.contains("active")) {
                    return;
                }

                buttons.forEach((target) => {
                    target.classList.remove("active");
                    target.setAttribute("aria-selected", "false");
                });

                button.classList.add("active");
                button.setAttribute("aria-selected", "true");

                runFlip(button.dataset.filter || "all");
            });
        });
    }

    async function initGitHubMetrics() {
        const metricNodes = Array.from(document.querySelectorAll(".github-metrics[data-repo]"));
        if (metricNodes.length === 0) {
            return;
        }

        const uniqueRepos = [...new Set(metricNodes.map((node) => node.dataset.repo).filter(Boolean))];
        const responseCache = new Map();
        const numberFormat = new Intl.NumberFormat();

        await Promise.all(
            uniqueRepos.map(async (repo) => {
                try {
                    const response = await fetch(`https://api.github.com/repos/${repo}`, {
                        headers: {
                            Accept: "application/vnd.github+json"
                        }
                    });

                    if (!response.ok) {
                        throw new Error("GitHub request failed");
                    }

                    const payload = await response.json();
                    responseCache.set(repo, payload);
                } catch (error) {
                    responseCache.set(repo, null);
                }
            })
        );

        metricNodes.forEach((node) => {
            const repo = node.dataset.repo;
            const payload = responseCache.get(repo);
            const starsNode = node.querySelector(".stars");
            const forksNode = node.querySelector(".forks");

            if (payload) {
                if (starsNode) {
                    starsNode.textContent = `Stars: ${numberFormat.format(payload.stargazers_count || 0)}`;
                }
                if (forksNode) {
                    forksNode.textContent = `Forks: ${numberFormat.format(payload.forks_count || 0)}`;
                }
            } else {
                if (starsNode) {
                    starsNode.textContent = "Stars: n/a";
                }
                if (forksNode) {
                    forksNode.textContent = "Forks: n/a";
                }
            }
        });
    }

    function initTimeline() {
        const timelineSection = document.getElementById("timeline");
        const progressPath = document.getElementById("timeline-progress");

        if (timelineSection && progressPath) {
            const pathLength = progressPath.getTotalLength();
            progressPath.style.strokeDasharray = String(pathLength);
            progressPath.style.strokeDashoffset = String(pathLength);

            const updatePath = () => {
                const rect = timelineSection.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const progress = clamp((viewportHeight - rect.top) / (rect.height + viewportHeight * 0.3), 0, 1);
                progressPath.style.strokeDashoffset = String(pathLength * (1 - progress));
            };

            window.addEventListener("scroll", updatePath, { passive: true });
            window.addEventListener("resize", updatePath);
            updatePath();
        }

        const timelineItems = document.querySelectorAll(".timeline-item");
        const timelineObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    entry.target.classList.toggle("in-view", entry.isIntersecting);
                });
            },
            {
                threshold: 0.4
            }
        );

        timelineItems.forEach((item) => {
            timelineObserver.observe(item);
        });

        const toggles = document.querySelectorAll(".timeline-toggle");
        toggles.forEach((toggle) => {
            toggle.addEventListener("click", () => {
                const expanded = toggle.getAttribute("aria-expanded") === "true";
                const detailId = toggle.getAttribute("aria-controls");
                const detail = detailId ? document.getElementById(detailId) : null;

                toggle.setAttribute("aria-expanded", String(!expanded));
                if (detail) {
                    detail.hidden = expanded;
                }
            });
        });
    }

    async function initResumeMeta() {
        const sizeNode = document.getElementById("resume-size");
        const updatedNode = document.getElementById("resume-updated");

        try {
            const response = await fetch(RESUME_FILE, { method: "HEAD" });
            if (!response.ok) {
                return;
            }

            const contentLength = response.headers.get("content-length");
            if (contentLength && sizeNode) {
                const sizeKb = Number(contentLength) / 1024;
                sizeNode.textContent = `${sizeKb.toFixed(1)} KB`;
            }

            const modifiedHeader = response.headers.get("last-modified");
            if (modifiedHeader && updatedNode) {
                const modifiedDate = new Date(modifiedHeader);
                if (!Number.isNaN(modifiedDate.getTime())) {
                    updatedNode.textContent = modifiedDate.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long"
                    });
                }
            }
        } catch (error) {
            // fallback to existing static metadata
        }
    }

    function initResumeLaunch() {
        const downloadButton = document.getElementById("download-resume");
        if (!downloadButton) {
            return;
        }

        downloadButton.addEventListener("click", () => {
            downloadButton.classList.remove("launching");
            void downloadButton.offsetWidth;
            downloadButton.classList.add("launching");
            launchConfetti(window.innerWidth * 0.48, window.innerHeight * 0.56, 95);

            window.setTimeout(() => {
                downloadButton.classList.remove("launching");
            }, 900);
        });
    }

    function initMissionImages() {
        const thumbnails = Array.from(document.querySelectorAll(".mission-thumb img"));
        if (thumbnails.length === 0) {
            return;
        }

        thumbnails.forEach((image) => {
            const markLoaded = () => {
                image.classList.add("loaded");
            };

            image.addEventListener("load", markLoaded);

            image.addEventListener("error", () => {
                if (image.dataset.fallbackApplied === "1") {
                    return;
                }
                image.dataset.fallbackApplied = "1";
                image.src = "images/mission-placeholder.svg?v=20260206";
            });

            if (image.complete && image.naturalWidth > 0) {
                markLoaded();
            }
        });
    }

    function initResumeBrowserOpen() {
        const viewResumeButton = document.getElementById("view-resume");
        if (!viewResumeButton) {
            return;
        }

        viewResumeButton.setAttribute("href", `${RESUME_FILE}#page=1`);

        viewResumeButton.addEventListener("click", (event) => {
            event.preventDefault();
            const opened = window.open(`${RESUME_FILE}#page=1`, "_blank", "noopener");
            if (!opened) {
                window.location.href = `${RESUME_FILE}#page=1`;
            }
        });
    }

    function initCustomCursor() {
        if (prefersReducedMotion || isCoarsePointer) {
            return;
        }

        const cursor = document.getElementById("custom-cursor");
        if (!cursor) {
            return;
        }

        document.body.classList.add("has-custom-cursor");

        let targetX = window.innerWidth / 2;
        let targetY = window.innerHeight / 2;
        let currentX = targetX;
        let currentY = targetY;

        document.addEventListener("pointermove", (event) => {
            targetX = event.clientX;
            targetY = event.clientY;
        });

        const interactives = document.querySelectorAll("a, button, input, textarea, .interactive");
        interactives.forEach((node) => {
            node.addEventListener("pointerenter", () => {
                cursor.classList.add("active");
            });
            node.addEventListener("pointerleave", () => {
                cursor.classList.remove("active");
            });
        });

        const animateCursor = () => {
            currentX += (targetX - currentX) * 0.24;
            currentY += (targetY - currentY) * 0.24;
            cursor.style.transform = `translate(${currentX}px, ${currentY}px)`;
            window.requestAnimationFrame(animateCursor);
        };

        animateCursor();
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }
})();



