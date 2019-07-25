function debounce(callback, time) {
    let args;
    let timerInstance;
    let context;

    return function () {
        args = arguments;
        context = this;

        if (timerInstance) {
            return;
        }

        timerInstance = setTimeout(() => {
            timerInstance = null;
            callback.apply(context, args);
        }, time);
    }
}

exports.debounce = debounce;