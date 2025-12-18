let time = 0;
var timer = document.querySelector("div.time");

async function T() {
    setInterval(()=> {
        time +=1;
        timer.textContent = '시간 '+String(Math.floor(time/60)).padStart(2, "0")+':'+String(time%60).padStart(2, "0");
    }, 1000);
}

T();