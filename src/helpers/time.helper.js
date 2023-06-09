class TimeHelper {
    getTimeAgo(timeInMillis) {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - timeInMillis;

        // Определение интервалов времени в миллисекундах
        const minute = 60 * 1000;
        const hour = 60 * minute;
        const day = 24 * hour;
        const week = 7 * day;
        const month = 30 * day;
        const year = 365 * day;

        // Определение количества прошедшего времени
        if (timeDiff < minute) {
            return 'только что';
        } else if (timeDiff < hour) {
            const minutes = Math.floor(timeDiff / minute);
            return `${minutes} ${this.getRussianWordForm(minutes, 'минуту', 'минуты', 'минут')} назад`;
        } else if (timeDiff < day) {
            const hours = Math.floor(timeDiff / hour);
            return `${hours} ${this.getRussianWordForm(hours, 'час', 'часа', 'часов')} назад`;
        } else if (timeDiff < week) {
            const days = Math.floor(timeDiff / day);
            return `${days} ${this.getRussianWordForm(days, 'день', 'дня', 'дней')} назад`;
        } else if (timeDiff < month) {
            const weeks = Math.floor(timeDiff / week);
            return `${weeks} ${this.getRussianWordForm(weeks, 'неделю', 'недели', 'недель')} назад`;
        } else if (timeDiff < year) {
            const months = Math.floor(timeDiff / month);
            return `${months} ${this.getRussianWordForm(months, 'месяц', 'месяца', 'месяцев')} назад`;
        } else {
            const years = Math.floor(timeDiff / year);
            return `${years} ${this.getRussianWordForm(years, 'год', 'года', 'лет')} назад`;
        }
    }

// Вспомогательная функция для определения правильной формы слова
    getRussianWordForm(number, form1, form2, form5) {
        const absNumber = Math.abs(number);
        const lastDigit = absNumber % 10;
        const lastTwoDigits = absNumber % 100;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
            return form5;
        } else if (lastDigit === 1) {
            return form1;
        } else if (lastDigit >= 2 && lastDigit <= 4) {
            return form2;
        } else {
            return form5;
        }
    }
}

export default new TimeHelper();