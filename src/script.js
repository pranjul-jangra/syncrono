class ChronoHub {
    constructor() {
        this.currentModule = 'clock';
        this.timeFormat = '12';
        this.theme = 'dark';
        this.stopwatchInterval = null;
        this.timerInterval = null;
        this.stopwatchTime = 0;
        this.timerTime = 0;
        this.isStopwatchRunning = false;
        this.isTimerRunning = false;
        this.lapTimes = [];
        this.alarms = [];
        this.worldClockCities = [
            { name: 'New York', timezone: 'America/New_York' },
            { name: 'London', timezone: 'Europe/London' },
            { name: 'Tokyo', timezone: 'Asia/Tokyo' },
            { name: 'Sydney', timezone: 'Australia/Sydney' },
            { name: 'Dubai', timezone: 'Asia/Dubai' },
            { name: 'Los Angeles', timezone: 'America/Los_Angeles' }
        ];

        this.init();
    }

    init() {
        this.applySavedTheme();
        this.setupEventListeners();
        this.startClock();
        this.setupWorldClock();
        this.loadAlarms();
        this.checkAlarms();
    }

    setupEventListeners() {
        // Event delegation
        document.addEventListener('click', (e) => {
            // Navigation items
            if (e.target.classList.contains('nav-item') || e.target.closest('.nav-item')) {
                const navItem = e.target.classList.contains('nav-item') ? e.target : e.target.closest('.nav-item');
                const module = navItem.getAttribute('data-module');
                if (module) {
                    this.switchModule(module);
                }
                return;
            }

            // Theme switcher
            if (e.target.id === 'themeBtn' || e.target.closest('#themeBtn')) {
                this.toggleTheme();
                return;
            }

            // Time format options
            if (e.target.classList.contains('format-option')) {
                const format = e.target.getAttribute('data-format');
                if (format) {
                    this.setTimeFormat(format);
                }
                return;
            }

            // Only handle module-specific buttons if we're in the correct module
            if (this.currentModule === 'stopwatch') {
                this.handleStopwatchEvents(e);
            } else if (this.currentModule === 'timer') {
                this.handleTimerEvents(e);
            } else if (this.currentModule === 'alarm') {
                this.handleAlarmEvents(e);
            }
        });

        // Prevent event bubbling on input elements
        document.addEventListener('input', (e) => {
            e.stopPropagation();
        });

        // Prevent event bubbling on form elements
        document.addEventListener('change', (e) => {
            e.stopPropagation();
        });
    }

    handleStopwatchEvents(e) {
        if (this.currentModule !== 'stopwatch') return;

        const stopwatchModule = document.getElementById('stopwatch');
        if (!stopwatchModule || !stopwatchModule.classList.contains('active')) return;

        if (e.target.id === 'startStopwatch') {
            e.preventDefault();
            e.stopPropagation();
            this.startStopwatch();
        } else if (e.target.id === 'pauseStopwatch') {
            e.preventDefault();
            e.stopPropagation();
            this.pauseStopwatch();
        } else if (e.target.id === 'resetStopwatch') {
            e.preventDefault();
            e.stopPropagation();
            this.resetStopwatch();
        } else if (e.target.id === 'lapStopwatch') {
            e.preventDefault();
            e.stopPropagation();
            this.addLap();
        }
    }

    handleTimerEvents(e) {
        if (this.currentModule !== 'timer') return;

        const timerModule = document.getElementById('timer');
        if (!timerModule || !timerModule.classList.contains('active')) return;

        if (e.target.id === 'startTimer') {
            e.preventDefault();
            e.stopPropagation();
            this.startTimer();
        } else if (e.target.id === 'pauseTimer') {
            e.preventDefault();
            e.stopPropagation();
            this.pauseTimer();
        } else if (e.target.id === 'resetTimer') {
            e.preventDefault();
            e.stopPropagation();
            this.resetTimer();
        }
    }

    handleAlarmEvents(e) {
        if (this.currentModule !== 'alarm') return;

        const alarmModule = document.getElementById('alarm');
        if (!alarmModule || !alarmModule.classList.contains('active')) return;

        if (e.target.id === 'addAlarm') {
            e.preventDefault();
            e.stopPropagation();
            this.addAlarm();
        }
    }

    switchModule(module) {
        this.pauseAllActivities();

        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        const activeNavItem = document.querySelector(`[data-module="${module}"]`);
        if (activeNavItem) activeNavItem.classList.add('active');

        document.querySelectorAll('.module').forEach(mod => {
            mod.classList.remove('active');
            mod.style.display = 'none';
        });

        const activeModule = document.getElementById(module);
        if (activeModule) {
            // Force reflow and restart animation
            activeModule.classList.remove('active');
            activeModule.style.display = 'block';

            // force a browser reflow (a layout calculation)
            void activeModule.offsetWidth;

            // Re-apply active class (which triggers animation)
            activeModule.classList.add('active');
        }

        this.currentModule = module;

        if (module === 'timer') {
            this.initializeTimerModule();
        } else if (module === 'stopwatch') {
            this.initializeStopwatchModule();
        } else if (module === 'alarm') {
            this.initializeAlarmModule();
        }
    }

    pauseAllActivities() {
        if (this.isStopwatchRunning) this.pauseStopwatch();
        if (this.isTimerRunning) this.pauseTimer();
    }

    initializeTimerModule() {
        // Reset timer display and buttons
        this.updateTimerDisplay();
        this.updateTimerProgress();
        this.resetTimerButtons();
    }

    initializeStopwatchModule() {
        // Update stopwatch display and buttons
        this.updateStopwatchDisplay();
        this.updateLapDisplay();
        this.resetStopwatchButtons();
    }

    initializeAlarmModule() {
        this.renderAlarms();
    }

    resetTimerButtons() {
        const startBtn = document.getElementById('startTimer');
        const pauseBtn = document.getElementById('pauseTimer');
        const resetBtn = document.getElementById('resetTimer');

        if (startBtn) {
            startBtn.style.display = this.isTimerRunning ? 'none' : 'inline-block';
            startBtn.textContent = this.timerTime > 0 && !this.isTimerRunning ? 'Resume' : 'Start';
        }
        if (pauseBtn) {
            pauseBtn.style.display = this.isTimerRunning ? 'inline-block' : 'none';
        }
        if (resetBtn) {
            resetBtn.style.display = this.timerTime > 0 ? 'inline-block' : 'none';
        }
    }

    resetStopwatchButtons() {
        const startBtn = document.getElementById('startStopwatch');
        const pauseBtn = document.getElementById('pauseStopwatch');
        const resetBtn = document.getElementById('resetStopwatch');
        const lapBtn = document.getElementById('lapStopwatch');

        if (startBtn) {
            startBtn.style.display = this.isStopwatchRunning ? 'none' : 'inline-block';
            startBtn.textContent = this.stopwatchTime > 0 && !this.isStopwatchRunning ? 'Resume' : 'Start';
        }
        if (pauseBtn) {
            pauseBtn.style.display = this.isStopwatchRunning ? 'inline-block' : 'none';
        }
        if (resetBtn) {
            resetBtn.style.display = this.stopwatchTime > 0 ? 'inline-block' : 'none';
        }
        if (lapBtn) {
            lapBtn.style.display = this.isStopwatchRunning ? 'inline-block' : 'none';
        }
    }

    toggleTheme() {
        const root = document.documentElement;
        const themeBtn = document.getElementById('themeBtn');

        if (this.theme === 'dark') {
            this.theme = 'light';
            if (themeBtn) themeBtn.textContent = '☀️ Light';
            // Light theme colors
            root.style.setProperty('--primary-bg', '#ffffff');
            root.style.setProperty('--secondary-bg', '#8888882a');
            root.style.setProperty('--accent-bg', '#e5e5e5');
            root.style.setProperty('--primary-text', 'black');
            root.style.setProperty('--secondary-text', 'black');
            root.style.setProperty('--border-color', '#cccccc');
            root.style.setProperty('--glass-border', '#31313133');
            root.style.setProperty('--glass-bg', '#fdecec1a');
        } else {
            this.theme = 'dark';
            if (themeBtn) themeBtn.textContent = '🌙 Dark';
            // Dark theme colors
            root.style.setProperty('--primary-bg', '#0a0a0a');
            root.style.setProperty('--secondary-bg', '#1a1a1a');
            root.style.setProperty('--accent-bg', '#2a2a2a');
            root.style.setProperty('--primary-text', '#ffffff');
            root.style.setProperty('--secondary-text', '#a0a0a0');
            root.style.setProperty('--border-color', '#333333');
            root.style.setProperty('--glass-border', '#ffffff33');
            root.style.setProperty('--glass-bg', '#ffffff1a');
        }

        localStorage.setItem('Syncrono-theme', this.theme);
    }

    applySavedTheme() {
        const savedTheme = localStorage.getItem('Syncrono-theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
            this.theme = savedTheme;
            this.toggleTheme();
            this.toggleTheme();
        }
    }

    setTimeFormat(format) {
        this.timeFormat = format;

        document.querySelectorAll('.format-option').forEach(option => {
            option.classList.remove('active');
        });
        const activeOption = document.querySelector(`[data-format="${format}"]`);
        if (activeOption) {
            activeOption.classList.add('active');
        }
    }

    startClock() {
        setInterval(() => {
            this.updateClock();
        }, 1000);
        this.updateClock(); // Initial call
    }

    updateClock() {
        const now = new Date();
        const clockDisplay = document.getElementById('clockDisplay');
        const dateDisplay = document.getElementById('dateDisplay');

        if (!clockDisplay || !dateDisplay) return;

        // Format time
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        let ampm = '';

        if (this.timeFormat === '12') {
            ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
        }

        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        clockDisplay.textContent = this.timeFormat === '12' ? `${timeString} ${ampm}` : timeString;

        // Format date
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        dateDisplay.textContent = now.toLocaleDateString('en-US', options);

        // Update world clock
        this.updateWorldClock();
    }

    // Stopwatch functionality
    startStopwatch() {
        if (this.currentModule !== 'stopwatch') return;

        if (!this.isStopwatchRunning) {
            this.isStopwatchRunning = true;
            this.stopwatchInterval = setInterval(() => {
                this.stopwatchTime += 10;
                this.updateStopwatchDisplay();
            }, 10);

            this.resetStopwatchButtons();
        }
    }

    pauseStopwatch() {
        if (this.isStopwatchRunning) {
            this.isStopwatchRunning = false;
            clearInterval(this.stopwatchInterval);
            this.resetStopwatchButtons();
        }
    }

    resetStopwatch() {
        this.isStopwatchRunning = false;
        clearInterval(this.stopwatchInterval);
        this.stopwatchTime = 0;
        this.lapTimes = [];
        this.updateStopwatchDisplay();
        this.updateLapDisplay();
        this.resetStopwatchButtons();
    }

    addLap() {
        if (this.isStopwatchRunning && this.currentModule === 'stopwatch') {
            this.lapTimes.push(this.stopwatchTime);
            this.updateLapDisplay();
        }
    }

    updateStopwatchDisplay() {
        const display = document.getElementById('stopwatchDisplay');
        if (display) {
            display.textContent = this.formatTime(this.stopwatchTime);
        }
    }

    updateLapDisplay() {
        const lapContainer = document.getElementById('lapTimes');
        if (!lapContainer) return;

        lapContainer.innerHTML = '';

        if (this.lapTimes.length > 0) {
            const lapList = document.createElement('div');
            lapList.innerHTML = '<h3 style="margin-bottom: 10px;">Lap Times</h3>';

            this.lapTimes.forEach((time, index) => {
                const lapItem = document.createElement('div');
                lapItem.style.cssText = 'padding: 8px; background: var(--secondary-bg); margin: 5px 0; border-radius: 8px; display: flex; justify-content: space-between;';
                lapItem.innerHTML = `
                    <span>Lap ${index + 1}</span>
                    <span>${this.formatTime(time)}</span>
                `;
                lapList.appendChild(lapItem);
            });

            lapContainer.appendChild(lapList);
        }
    }

    // Timer functionality
    startTimer() {
        if (this.currentModule !== 'timer') return;

        const hoursInput = document.getElementById('timerHours');
        const minutesInput = document.getElementById('timerMinutes');
        const secondsInput = document.getElementById('timerSeconds');

        if (!hoursInput || !minutesInput || !secondsInput) return;

        const hours = parseInt(hoursInput.value) || 0;
        const minutes = parseInt(minutesInput.value) || 0;
        const seconds = parseInt(secondsInput.value) || 0;

        if (hours === 0 && minutes === 0 && seconds === 0 && this.timerTime === 0) {
            alert('Please set a time for the timer');
            return;
        }

        if (!this.isTimerRunning) {
            if (this.timerTime === 0) {
                this.timerTime = (hours * 3600 + minutes * 60 + seconds) * 1000;
            }

            this.isTimerRunning = true;
            this.timerInterval = setInterval(() => {
                this.timerTime -= 1000;
                this.updateTimerDisplay();
                this.updateTimerProgress();

                if (this.timerTime <= 0) {
                    this.timerComplete();
                }
            }, 1000);

            this.resetTimerButtons();
        }
    }

    pauseTimer() {
        if (this.isTimerRunning) {
            this.isTimerRunning = false;
            clearInterval(this.timerInterval);
            this.resetTimerButtons();
        }
    }

    resetTimer() {
        this.isTimerRunning = false;
        clearInterval(this.timerInterval);
        this.timerTime = 0;
        this.updateTimerDisplay();
        this.updateTimerProgress();
        this.resetTimerButtons();

        // Reset input fields
        const hoursInput = document.getElementById('timerHours');
        const minutesInput = document.getElementById('timerMinutes');
        const secondsInput = document.getElementById('timerSeconds');

        if (hoursInput) hoursInput.value = 0;
        if (minutesInput) minutesInput.value = 0;
        if (secondsInput) secondsInput.value = 0;
    }

    timerComplete() {
        this.isTimerRunning = false;
        clearInterval(this.timerInterval);
        this.timerTime = 0;
        this.updateTimerDisplay();
        this.updateTimerProgress();

        // Show completion notification
        this.playAlarmSound();
        this.showNotification('Timer Complete!', 'Your timer has finished!');

        // Reset buttons
        this.resetTimerButtons();
    }

    updateTimerDisplay() {
        const display = document.getElementById('timerDisplay');
        if (!display) return;

        const totalSeconds = Math.ceil(this.timerTime / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        display.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateTimerProgress() {
        const circle = document.getElementById('timerProgress');
        if (!circle) return;

        const hoursInput = document.getElementById('timerHours');
        const minutesInput = document.getElementById('timerMinutes');
        const secondsInput = document.getElementById('timerSeconds');

        if (!hoursInput || !minutesInput || !secondsInput) return;

        const totalTime = (parseInt(hoursInput.value) || 0) * 3600 +
            (parseInt(minutesInput.value) || 0) * 60 +
            (parseInt(secondsInput.value) || 0);

        if (totalTime > 0) {
            const progress = (this.timerTime / 1000) / totalTime;
            const circumference = 2 * Math.PI * 50; // radius is 50
            const offset = circumference - (progress * circumference);
            circle.style.strokeDashoffset = offset;
        }
    }

    // World Clock functionality
    setupWorldClock() {
        const grid = document.getElementById('worldClockGrid');
        if (!grid) return;

        this.worldClockCities.forEach(city => {
            const cityElement = document.createElement('div');
            cityElement.className = 'world-clock-item';
            cityElement.innerHTML = `
                <div class="world-clock-city">${city.name}</div>
                <div class="world-clock-time" id="time-${city.name.replace(/\s+/g, '')}">--:--:--</div>
            `;
            grid.appendChild(cityElement);
        });
    }

    updateWorldClock() {
        this.worldClockCities.forEach(city => {
            const now = new Date();
            const cityTime = new Date(now.toLocaleString("en-US", { timeZone: city.timezone }));

            let hours = cityTime.getHours();
            let minutes = cityTime.getMinutes();
            let seconds = cityTime.getSeconds();
            let ampm = '';

            if (this.timeFormat === '12') {
                ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12;
            }

            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            const displayTime = this.timeFormat === '12' ? `${timeString} ${ampm}` : timeString;

            const element = document.getElementById(`time-${city.name.replace(/\s+/g, '')}`);
            if (element) {
                element.textContent = displayTime;
            }
        });
    }

    // Alarm functionality
    addAlarm() {
        if (this.currentModule !== 'alarm') return;

        const hoursInput = document.getElementById('alarmHours');
        const minutesInput = document.getElementById('alarmMinutes');

        if (!hoursInput || !minutesInput) return;

        const hours = parseInt(hoursInput.value) || 0;
        const minutes = parseInt(minutesInput.value) || 0;

        if (hours === 0 && minutes === 0) {
            alert('Please set a time for the alarm');
            return;
        }

        const alarm = {
            id: Date.now(),
            hours: hours,
            minutes: minutes,
            enabled: true,
            time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
        };

        this.alarms.push(alarm);
        this.saveAlarms();
        this.renderAlarms();

        // Reset input fields
        hoursInput.value = 0;
        minutesInput.value = 0;
    }

    renderAlarms() {
        const alarmList = document.getElementById('alarmList');
        if (!alarmList) return;

        alarmList.innerHTML = '';

        if (this.alarms.length === 0) {
            alarmList.innerHTML = '<p style="text-align: center; color: var(--secondary-text); margin-top: 20px;">No alarms set</p>';
            return;
        }

        this.alarms.forEach(alarm => {
            const alarmElement = document.createElement('div');
            alarmElement.className = 'alarm-item';
            alarmElement.innerHTML = `
                <div class="alarm-time">${alarm.time}</div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <div class="alarm-toggle ${alarm.enabled ? 'active' : ''}" data-alarm-id="${alarm.id}"></div>
                    <button class="btn btn-danger alarm-delete" style="padding: 5px 10px; font-size: 0.8rem;" data-alarm-id="${alarm.id}">Delete</button>
                </div>
            `;
            alarmList.appendChild(alarmElement);
        });

        // Add event listeners for alarm controls
        this.setupAlarmControls();
    }

    setupAlarmControls() {
        // Use event delegation for alarm controls
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('alarm-toggle')) {
                const alarmId = parseInt(e.target.getAttribute('data-alarm-id'));
                if (alarmId) {
                    this.toggleAlarm(alarmId);
                }
            } else if (e.target.classList.contains('alarm-delete')) {
                const alarmId = parseInt(e.target.getAttribute('data-alarm-id'));
                if (alarmId) {
                    this.deleteAlarm(alarmId);
                }
            }
        });
    }

    toggleAlarm(id) {
        const alarm = this.alarms.find(a => a.id === id);
        if (alarm) {
            alarm.enabled = !alarm.enabled;
            this.saveAlarms();
            this.renderAlarms();
        }
    }

    deleteAlarm(id) {
        this.alarms = this.alarms.filter(a => a.id !== id);
        this.saveAlarms();
        this.renderAlarms();
    }

    checkAlarms() {
        setInterval(() => {
            const now = new Date();
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

            this.alarms.forEach(alarm => {
                if (alarm.enabled && alarm.time === currentTime && now.getSeconds() === 0) {
                    this.triggerAlarm(alarm);
                }
            });
        }, 1000);
    }

    triggerAlarm(alarm) {
        this.showNotification('Alarm!', `It's ${alarm.time}!`);
        this.playAlarmSound();

        // Disable the alarm after it triggers
        alarm.enabled = false;
        this.saveAlarms();
        this.renderAlarms();
    }

    saveAlarms() {
        localStorage.setItem('Syncrono', JSON.stringify(this.alarms));
    }

    loadAlarms() {
        const saved = localStorage.getItem('Syncrono');
        if (saved) this.alarms = JSON.parse(saved);
        else this.alarms = [];

        this.renderAlarms();
    }

    // Utility functions
    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const ms = Math.floor((milliseconds % 1000) / 10);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    }

    showNotification(title, message) {
        // Check if browser supports notifications
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                new Notification(title, { body: message, icon: 'clock.png' });
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        new Notification(title, { body: message, icon: 'clock.png' });
                    }
                });
            }
        }

        // Fallback to browser alert
        alert(`${title}\n${message}`);
    }

    playAlarmSound() {
        // Create a simple beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'square';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 3);
        } catch (error) {
            console.log('Audio not supported');
        }
    }
}

// Initialize the application
let chronoHub;

document.addEventListener('DOMContentLoaded', () => {
    chronoHub = new ChronoHub();

    // Request notification permission on load
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});