# 🏛️ Wait, How Fast Is That?
*An Interactive Digital Museum of Speed, Latency, Data Volume & Physical Scale*

[![Vercel Ready](https://img.shields.io/badge/Vercel-Ready-black?style=flat&logo=vercel)](https://vercel.com)
[![Next.js 16](https://img.shields.io/badge/Next.js-16%20App%20Router-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

> **"Anyone can build a website with fun facts. Almost nobody builds an interactive museum that calibrates to your monitor's real-world physical inches so objects move across your desk at their literal real-world speed, lets you feel real network ping delays across space, and visualizes 1 Gigabit as 3.6 tons of rice per second."**

Designed for curious 7th-grade science students, high school physics teachers, computer scientists, and tech writers looking for verifiable, interactive proofs.

---

## 🎟️ Step 0: The "Ticket Booth" Screen Calibrator

Monitors only understand abstract CSS pixels. To display objects moving at their **true real-world physical velocity** in millimeters per second, visitors hold any standard card (school ID, library card, credit card, or gift card) against their screen:
* Globally standardized by **ISO/IEC 7810 ID-1** at **85.60 mm &times; 53.98 mm** (3.37 inches wide).
* Calculates exact display PPI:
  $$\text{PPI} = \frac{\text{Box Width in CSS Pixels}}{3.3700787\text{ inches}}$$
  $$\text{PPMM} = \frac{\text{Box Width in CSS Pixels}}{85.60\text{ mm}}$$
* Fallback presets available for 13" MacBook, 11.6" School Chromebook, 24" Desktop, 27" QHD, and 6.1" Smartphones.
* Includes an on-screen **Real-World Verification Ruler** in both inches and centimeters.

---

## 🖼️ The 5 Interactive Exhibition Halls

### 🏎️ Hall 1: The 1:1 True-Scale Speed Track
* **Live `requestAnimationFrame` Delta-Time Canvas Physics**: Objects move across your screen at verified speeds:
  * **Continental Drift:** $0.79\text{ nm/s}$ ($2.5\text{ cm/year}$) — North America and Europe drift apart at the same speed fingernails grow.
  * **Human Fingernail Growth:** $1.32\text{ nm/s}$ ($3.47\text{ mm/month}$) — takes 62 hours to cross 1 display pixel.
  * **Scalp Hair Growth:** $4.75\text{ nm/s}$ per strand ($100,000$ follicles combined generate $0.5\text{ mm/sec}$!).
  * **Garden Snail (*Cornu aspersum*):** $1.3\text{ mm/s}$ — crosses a 13-inch laptop in 3.8 minutes.
  * **CoreXY 3D Printer (Bambu/Voron):** $500\text{ mm/s}$ at $20\text{ m/s}^2$ ($2\text{ G's}$) acceleration.
  * **Aortic Systolic Blood Surge:** $1.0\text{ m/s}$ (peaks at $1.7\text{ m/s}$).
  * **Unmyelinated Pain Nerve (C-Fiber):** $1.0\text{ m/s}$ vs. myelinated touch ($120\text{ m/s}$), explaining why stubbed toe ache is delayed!
  * **Speed of Sound (Mach 1):** $343\text{ m/s}$ in $20^\circ\text{C}$ air.
  * **Grace Hopper's "Light in 1 Nanosecond":** $299,792,458\text{ m/s}$ — travels exactly $11.8\text{ inches}$ ($29.98\text{ cm}$), the exact width of your laptop screen.
* **Microscope Zoom ($1\times$ to $10,000,000\times$)** and **Bullet-Time Slow-Mo ($10^{-9}\text{s}$)** sliders.
* **Dual-Lane Racer**: Race any two speeds head-to-head.

### 🕹️ Hall 2: The Latency & Ping Arcade ("Feel the Lag")
* **Subsea Ocean Cable Typist:** Letters are queued and delayed by realistic round-trip times ($210\text{ ms}$ London-to-Tokyo undersea fiber) before echoing to a remote terminal.
* **Nerve Reflex Bench:** Measures raw reaction time and breaks down the milliseconds spent in retinal transduction ($30\text{ms}$), visual cortex ($45\text{ms}$), motor decision ($80\text{ms}$), and arm nerves ($40\text{ms}$).
* **Lunar Rover Teleoperation:** Steer an Apollo/Artemis lunar rover on a crater canvas with real $1.28\text{s}$ uplink delay ($2.56\text{s}$ round trip).
* **Starlink vs. Geostationary Pong:** Play paddle tennis at $32\text{ms}$ (LEO $550\text{km}$) vs. $600\text{ms}$ (GEO $35,786\text{km}$) latency.
* **Voyager 1 Deep Space Ping:** Live speed-of-light radio packet tracker spanning $>24.5\text{ billion km}$ ($45.4\text{ hours}$ round trip at $23\text{ Watts}$).

### 🌊 Hall 3: The Data Flood ("Bits vs. Bytes Visualizer")
* **The 8-bits-to-1-Byte Pipe Valve:** 8 bit droplets fall down a glass pipe to fill a 1-Byte bucket, demonstrating why $1\text{ Gbps}$ internet is $125\text{ MB/s}$ (not $1,000\text{ MB/s}$).
* **"What If 1 Byte Was..." Physical Scaling Engine:**
  * **Rice Mass:** $1\text{ Byte} = 1\text{ grain}$ ($0.029\text{g}$); $1\text{ GB} = 29\text{ metric tons}$ (a 40-foot shipping container); $1\text{ Gbps} = 3.6\text{ metric tons/sec}$ poured into your laptop!
  * **Paper Height:** $1\text{ Byte} = 1\text{ letter}$; $1\text{ GB} = 50\text{ meters}$ tall (Statue of Liberty); $1\text{ TB} = 50\text{ km}$ (stratosphere).
  * **Distance:** $1\text{ Byte} = 1\text{ mm}$; $1\text{ GB} = 1,000\text{ km}$; $1\text{ TB} = 1,000,000\text{ km}$ (to the Moon and back twice).
  * **Time:** $1\text{ Byte} = 1\text{ second}$; $1\text{ GB} = 31.7\text{ years}$; $1\text{ TB} = 31,688\text{ years}$ (back to the Ice Age).
  * **Water Volume:** $1\text{ Byte} = 1\text{ drop}$; $1\text{ GB} = 50,000\text{ Liters}$ (swimming pool); $1\text{ TB} = 50\text{ million Liters}$ (a freshwater lake).

### ⏳ Hall 4: Inside Your CPU ("The Time Dilation Chamber")
* **Scale: $1\text{ Nanosecond} = 1\text{ Human Second}$ ($1,000,000,000\times$ slowdown):**
  * $1\text{ CPU Clock Cycle}$ ($0.33\text{ ns}$) $\rightarrow 0.33\text{s}$ (finger snap).
  * $\text{L1 Cache Hit}$ ($0.5\text{ ns}$) $\rightarrow 0.5\text{s}$ (sticky note on desk).
  * $\text{Branch Misprediction}$ ($5\text{ ns}$) $\rightarrow 5\text{s}$ (crumple paper and toss).
  * $\text{Main RAM Access}$ ($100\text{ ns}$) $\rightarrow 1\text{m } 40\text{s}$ (walk to kitchen, microwave tea).
  * $\text{NVMe SSD Read}$ ($150\text{ }\mu\text{s}$) $\rightarrow 1.74\text{ Days}$ (pack bags, take a weekend ski trip!).
  * $\text{Spinning HDD Seek}$ ($10\text{ ms}$) $\rightarrow 115\text{ Days}$ (entire school semester).
  * $\text{Transatlantic Web API}$ ($150\text{ ms}$) $\rightarrow 4.75\text{ Years}$ (finishes middle school AND high school!).

### ⚡ Hall 5: The Frame Rate & Persistence Vault
* **Live Refresh Rate Detector:** Auto-detects your display's native refresh rate ($60\text{ Hz}, 120\text{ Hz}, 144\text{ Hz}, 240\text{ Hz}$) using high-precision `requestAnimationFrame` delta timing.
* **4-Lane Synchronized Motion Comparator:** Tracks identical motion at $15\text{ FPS}, 30\text{ FPS}, 60\text{ FPS}$, and Native display rate with toggleable **Retinal Ghost Trails**.
* **Neuroscience Deep Dive:** Explains why Hollywood 24 FPS works (180° camera shutter motion blur) while 24 FPS video games feel choppy (zero shutter blur + motor cortex efference copy breakdown).

---

## 🛠️ Project Structure

```text
wait-how-fast/
├── src/
│   ├── app/
│   │   ├── page.tsx               # Museum Lobby & Ticket Booth
│   │   ├── layout.tsx             # Root Layout with Calibration & Sound Providers
│   │   ├── all/page.tsx           # Continuous Walkthrough of all 5 Halls
│   │   ├── about/page.tsx         # Science Methodology & Full Bibliography
│   │   └── hall/[slug]/page.tsx   # Dynamic SSG Routes for Individual Halls
│   ├── components/
│   │   ├── calibrator/
│   │   │   ├── CardCalibrator.tsx # ISO-7810 ID-1 Interactive Screen Calibrator
│   │   │   └── ScreenRuler.tsx    # Real-World Physical Ruler (inches & cm)
│   │   ├── exhibits/
│   │   │   ├── TrueScaleTrack.tsx # Hall 1: 1:1 Speed Track + Zoom + Slow-Mo
│   │   │   ├── LatencyArcade.tsx  # Hall 2: Typing, Reflex, Rover, Pong, Voyager
│   │   │   ├── DataFlood.tsx      # Hall 3: Bits-to-Bytes Pipe & Matter Scaler
│   │   │   ├── CpuTimeDilation.tsx# Hall 4: 1ns = 1s Animated Office Simulation
│   │   │   └── FrameRateVault.tsx # Hall 5: Live Hz Detector & 4-Lane Motion
│   │   ├── museum/
│   │   │   ├── PlaqueCard.tsx     # Plaque with "Verify the Math" drawer
│   │   │   ├── ShareFactModal.tsx # Canvas PNG Card Exporter & Social Snippet
│   │   │   └── HallExhibitLoader.tsx # Suspense-wrapped exhibit router
│   │   └── layout/
│   │       ├── Navbar.tsx         # PPI Badge, Sound Toggle, Navigation
│   │       └── Footer.tsx         # Verified Standards & Citations Directory
│   ├── context/
│   │   ├── CalibrationContext.tsx # useSyncExternalStore PPI Provider
│   │   └── SoundContext.tsx       # Synthesized Audio Provider
│   ├── data/
│   │   ├── speeds.ts              # Verified velocities & citations
│   │   ├── latencies.ts           # Round-trip benchmarks & distances
│   │   ├── dataScales.ts          # Bits-to-bytes conversions & physical mass
│   │   ├── cpuDilation.ts         # 1ns = 1s operations & office narratives
│   │   └── framerateData.ts       # FPS benchmarks & shutter angle science
│   └── lib/
│       ├── ppiMath.ts             # ISO dimensions, PPI/PPMM & transit time math
│       └── soundEngine.ts         # Pure Web Audio API Synthesizer (0 assets)
└── tests/
    ├── ppiMath.test.ts            # Screen calibration & velocity tests
    ├── dataScales.test.ts         # Bits vs Bytes throughput tests
    ├── cpuDilation.test.ts        # Hierarchy & time dilation tests
    └── speedsAndLatencies.test.ts # Citation completeness & physics verification
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** >= 20.0.0
* **npm** >= 9.0.0

### Installation
```bash
# Clone and enter directory
cd wait-how-fast

# Install dependencies
npm install

# Run automated tests
npm test

# Run ESLint validation
npm run lint

# Start local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Deploying to Vercel

This application is built with 100% static client-side components and pure Web Audio API synthesis. It requires **zero external databases, zero API keys, and zero external file storage**:

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com/new).
3. Framework Preset: **Next.js** (auto-detected).
4. Click **Deploy**.

It will build and deploy cleanly in less than 40 seconds.

---

## 🔬 Peer-Reviewed References & Citations

1. **Continental Drift:** USGS Global Plate Motion Models & NOAA Satellite Geodesy.
2. **Fingernail Growth:** Yaemsiri, S. et al., *Journal of the European Academy of Dermatology and Venereology* (2010).
3. **Pain Nerves:** Purves, D. et al., *Neuroscience* (6th Edition, Chapter 10: Pain Mechanisms).
4. **Grace Hopper's Nanosecond:** Smithsonian National Museum of American History (Grace Murray Hopper Collection).
5. **Fiber Optic Light Propagation:** ITU-T Recommendation G.652 (Characteristics of single-mode optical fiber).
6. **Lunar & Deep Space Telemetry:** NASA Jet Propulsion Laboratory (JPL) Deep Space Network & Apollo Telemetry Archives.
7. **Computer Architecture Latencies:** Peter Norvig & Jeff Dean (*Latency Numbers Every Computer Scientist Should Know*).
8. **Display Refresh & Motion Perception:** Mark Rejhon (Blur Busters) & Hecht, S., *Journal of General Physiology*.

---

## 📄 License
MIT License. Feel free to use in classrooms, blog posts, and educational workshops!
