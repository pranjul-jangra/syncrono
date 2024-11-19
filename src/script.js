//                                         STOP WATCH: MANIPULATE YOUR TIME

// DOM getters
let stopWatchDisplay = document.querySelector('#stopWatchDisplay');
let start = document.querySelector('#start');
let stop = document.querySelector('#stop');
let reset = document.querySelector('#reset');

//initial values
let target;
let hours = 0, minutes = 0, seconds = 0;
let manipulateTime = null;

// function for disabling buttons conditionaly when not neccessary
function disableButton(target) {
    let buttons = [start, stop, reset];
    for (let btn of buttons) {
        btn.disabled = false;
        btn.classList.remove('bg-slate-400', 'opacity-70', 'border-gray-900');
    }
    target.disabled = true;
    target.classList.add('bg-slate-400', 'opacity-70', 'border-gray-900');
};

// stopWatch timing and manipulating buttons
start.addEventListener('click', (e) => {
    target = start;
    manipulateTime = setInterval(() => {
        seconds++;
        let second = `0${seconds}`;
        let minute = `0${minutes}`;
        let hour = `0${hours}`;

        stopWatchDisplay.textContent = `${hours.toString().length === 2 ? hours : hour}:
        ${minutes.toString().length === 2 ? minutes : minute}:
        ${seconds.toString().length === 2 ? seconds : second}`;

        if (seconds === 59) {
            seconds = -1;
            minutes++;
            if (minutes === 59) {
                hours++;
                minutes = -1;
            };
        };
    }, 1000);
    stop.classList.remove('hidden');
    reset.classList.remove('hidden');
    disableButton(target);
});

stop.addEventListener('click', (e) => {
    target = stop;
    clearInterval(manipulateTime);
    disableButton(target);
});

reset.addEventListener('click', (e) => {
    target = reset;
    clearInterval(manipulateTime);
    seconds = 0, minutes = 0, hours = 0;
    stopWatchDisplay.textContent = '00: 00: 00';
    stop.classList.add('hidden');
    reset.classList.add('hidden');
    disableButton(target);
});

//                                  navigating between clock and stopWatch
//DOM getters
let stopWatchFont = document.querySelector('#stopWatchFont');
let clockFont = document.querySelector('#clockFont');
let showClock = document.querySelector('#clock');
let showStopWatch = document.querySelector('#stopWatch');
let stopWatchP1 = document.querySelector('#stopWatchP1');
let stopWatchP2 = document.querySelector('#stopWatchP2');
let clockP1 = document.querySelector('#clockP1');
let clockP2 = document.querySelector('#clockP2');

//initial value
let navigatedItem = 'clock';
activeItem();

//navigation
clockFont.addEventListener('click', () => {
    navigatedItem = 'clock';
    activeItem();
});
stopWatchFont.addEventListener('click', () => {
    navigatedItem = 'stopWatch';
    activeItem();
});

// function activeItem() {
//     if (navigatedItem === 'clock') {
//         showClock.classList.remove('hidden');
//         showStopWatch.classList.add('hidden');
//         clockFont.classList.replace('scale-100', 'scale-125');
//         clockP1.classList.replace('text-gray-600', 'text-red-500');
//         clockP2.classList.replace('text-gray-400', 'text-white');
//         clockP2.classList.replace('before:-translate-y-0', 'before:-translate-y-3');

//         stopWatchFont.classList.replace('scale-125', 'scale-100');
//         stopWatchP1.classList.replace('text-red-500', 'text-gray-600');
//         stopWatchP2.classList.replace('text-white', 'text-gray-400');
//         stopWatchP2.classList.replace('before:-translate-y-3', 'before:-translate-y-0');
//     } else {
//         showStopWatch.classList.remove('hidden');
//         showClock.classList.add('hidden');
//         stopWatchFont.classList.replace('scale-100', 'scale-125');
//         stopWatchP1.classList.replace('text-gray-600', 'text-red-500');
//         stopWatchP2.classList.replace('text-gray-400', 'text-white');
//         stopWatchP2.classList.replace('before:-translate-y-0', 'before:-translate-y-3');

//         clockFont.classList.replace('scale-125', 'scale-100');
//         clockP1.classList.replace('text-red-500', 'text-gray-600');
//         clockP2.classList.replace('text-white', 'text-gray-400');
//         clockP2.classList.replace('before:-translate-y-3', 'before:-translate-y-0');
//     };
// };


function activeItem() {
    if (navigatedItem === 'clock') {
        // showClock.classList.remove('hidden');
        // showStopWatch.classList.add('hidden');
        showClock.classList.replace('opacity-0', 'opacity-100');
        showClock.classList.replace('z-0', 'z-10');
        showClock.classList.replace('blur-md', 'blur-0');
        showStopWatch.classList.replace('z-10', 'z-0');
        showStopWatch.classList.replace('opacity-100', 'opacity-0');
        showStopWatch.classList.replace('blur-0', 'blur-md');

        clockFont.classList.replace('scale-100', 'scale-125');
        clockP1.classList.replace('text-gray-600', 'text-red-500');
        clockP2.classList.replace('text-gray-400', 'text-white');
        clockP2.classList.replace('before:-translate-y-0', 'before:-translate-y-3');

        stopWatchFont.classList.replace('scale-125', 'scale-100');
        stopWatchP1.classList.replace('text-red-500', 'text-gray-600');
        stopWatchP2.classList.replace('text-white', 'text-gray-400');
        stopWatchP2.classList.replace('before:-translate-y-3', 'before:-translate-y-0');
    } else {
        // showStopWatch.classList.remove('hidden');
        // showClock.classList.add('hidden');
        showStopWatch.classList.replace('opacity-0', 'opacity-100');
        showStopWatch.classList.replace('z-0', 'z-10');
        showStopWatch.classList.replace('blur-md', 'blur-0');
        showClock.classList.replace('z-10', 'z-0');
        showClock.classList.replace('opacity-100', 'opacity-0');
        showClock.classList.replace('blur-0', 'blur-md');

        stopWatchFont.classList.replace('scale-100', 'scale-125');
        stopWatchP1.classList.replace('text-gray-600', 'text-red-500');
        stopWatchP2.classList.replace('text-gray-400', 'text-white');
        stopWatchP2.classList.replace('before:-translate-y-0', 'before:-translate-y-3');

        clockFont.classList.replace('scale-125', 'scale-100');
        clockP1.classList.replace('text-red-500', 'text-gray-600');
        clockP2.classList.replace('text-white', 'text-gray-400');
        clockP2.classList.replace('before:-translate-y-3', 'before:-translate-y-0');
    };
};

//                                          CLOCK: WATCH YOUR TIME


//DOM getters
let clockDisplay = document.querySelector('#clockDisplay');
let yearDisplay = document.querySelector('#year');
let monthDisplay = document.querySelector('#month');
let dateDisplay = document.querySelector('#date');
let dayDisplay = document.querySelector('#day');
let changeFormat = document.querySelector('#changeFormat');
let twelveFormat = document.querySelector('#twelveFormat');
let twentyFourFormat = document.querySelector('#twentyFourFormat');
let meridiems = document.querySelector('#meridiems');

// initial values
let timeFormat = '12hours';
let meridiem;
let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//toggling format hours
changeFormat.addEventListener('click', () => {
    if (changeFormat.classList.contains('before:translate-x-0')) {
        timeFormat = '24hours';
        changeFormat.classList.replace('before:translate-x-0', 'before:translate-x-7');
        twelveFormat.classList.replace('text-green-500', 'text-slate-400');
        twentyFourFormat.classList.replace('text-slate-400', 'text-green-500');
    } else {
        timeFormat = '12hours';
        changeFormat.classList.replace('before:translate-x-7', 'before:translate-x-0');
        twentyFourFormat.classList.replace('text-green-500', 'text-slate-400');
        twelveFormat.classList.replace('text-slate-400', 'text-green-500');
    };
});

//main function for clock time
function startTime() {
    setInterval(() => {
        //time
        let dateObject = new Date();
        let minutes = dateObject.getMinutes();
        let seconds = dateObject.getSeconds();
        let hours = dateObject.getHours();
        let min = `0${minutes}`;
        let sec = `0${seconds}`;
        let hr = `0${hours}`;

        if (timeFormat === '12hours') {
            if (hours === 0) {
                hours = 12;
            } else if (hours > 12) {
                hours -= 12;
                hr = `0${hours}`;
            };
            clockDisplay.textContent = `${hours.toString().length === 2 ? hours : hr}:
        ${minutes.toString().length === 2 ? minutes : min}:
        ${seconds.toString().length === 2 ? seconds : sec}`;
        } else {
            clockDisplay.textContent = `${hours.toString().length === 2 ? hours : hr}:
        ${minutes.toString().length === 2 ? minutes : min}:
        ${seconds.toString().length === 2 ? seconds : sec}`;
        };

        //meridiems
        if (dateObject.getHours() < 12) {
            meridiem = 'AM';
        } else {
            meridiem = 'PM';
        };
        meridiems.textContent = `${meridiem}`;

        //year/month/date/day
        let year = dateObject.getFullYear();
        let month = months[dateObject.getMonth()];
        let date = dateObject.getDate();
        let day = days[dateObject.getDay()];

        yearDisplay.textContent = `${year}`;
        monthDisplay.textContent = `${month}`;
        dateDisplay.textContent = `${date}`;
        dayDisplay.textContent = `${day}`;

    }, 1000);
};
startTime();



//                                     Loader
let loader = document.querySelector('#loader');

document.addEventListener('DOMContentLoaded', () => {
    loader.classList.add('hidden');
});