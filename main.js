const container = document.querySelector('.swipe-container');
const swipeElement = document.querySelector('.swipe-element');

function handleSwipe() {
    // don't interrupt the jiggle!!!
    if (swipeElement.classList.contains("jiggle")) {
        return;
    }
    // define the minimum distance to trigger the action
    const minDistance = 80;
    // get the distance the user swiped
    const swipeDistance = container.scrollLeft - container.clientWidth;
    if (swipeDistance < minDistance * -1) {
        // remove the element when the user moves the element far enough
        removeElement(container, swipeElement);
    } else if (swipeDistance > minDistance) {
        // fade in if only swiped left
        fadeIn(swipeElement);
    } else {
        // expand or collapse the element
        swipeElement.classList.toggle("expanded");
    }
}

function scrollOpacity() {
    // get the distance the user swiped and make it positive
    const swipeDistance = Math.abs(container.scrollLeft - container.clientWidth);
    // calculate opacity on distance swiped
    let opacity = 1 - (swipeDistance / container.clientWidth);
    // assign opacity
    if (opacity >= 0) {
        swipeElement.classList.remove("visible");
        document.documentElement.style.setProperty('--opacityAnimated', opacity);
    }
}

function fadeIn(element) {
    element.classList.add("visible");
    element.addEventListener("animationend",
        () => {
            document.documentElement.style.setProperty('--opacityAnimated', 1)

        }
    );
}

function removeElement(container, element) {
    // class used to trigger animation
    element.classList.add("completed");
    element.addEventListener("animationend",
        () => {
            container.remove()
        }
    );
}

function jiggleOnLongPress(element, callback) {
    let timer;
    // setup on the start of the touch
    element.addEventListener('touchstart', () => {
        timer = setTimeout(() => {
            timer = null;
            // if it lasts a 1 second make it jiggle
            callback();
        }, 1000);
    });

    function cancel() {
        clearTimeout(timer);
    }

    element.addEventListener('touchend', cancel);
    element.addEventListener('touchmove', cancel);
}

jiggleOnLongPress(swipeElement, () => {
    // jiggling commences
    swipeElement.classList.toggle("jiggle");
    swipeElement.classList.remove("expanded");
    container.classList.toggle("disable-scroll");
});
