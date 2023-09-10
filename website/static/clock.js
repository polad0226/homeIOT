const globalClock = document.querySelector('.global-clock');
const clockUrl = 'http://localhost:8000/clock';
const eventSource = new EventSource(clockUrl);

eventSource.onmessage = event => {
    const currentTime = event.data;
    const globalClockText = globalClock.children[0];
    globalClockText.textContent = JSON.parse(currentTime);

    console.log(event);
}