export class Countdown {
    constructor(durationMinutes, redirectUrl) {
        this.duration = durationMinutes * 60;
        this.redirectUrl = redirectUrl;
        this.timerInterval = null;
    }
    start() {
        const countdownElement = document.getElementById('countdown');

        let remainingTime = this.duration;
        this.updateDisplay(countdownElement, remainingTime);

        this.timerInterval = setInterval(() => {
            remainingTime--;
            this.updateDisplay(countdownElement, remainingTime);

            if (remainingTime <= 0) {
                clearInterval(this.timerInterval);
                this.redirect();
            }
        }, 1000);
    }

    updateDisplay(element, remainingTime) {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        element.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    redirect() {
        window.location.href = this.redirectUrl;
    }
}
