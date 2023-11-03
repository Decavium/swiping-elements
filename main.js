function handleSwipe() {
    const container = document.querySelector('.swipe-container');
    const swipeElement = document.querySelector('.swipe-element');

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
        swipeElement.classList.toggle("collapsed");
        fadeIn(swipeElement);
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

function scrollOpacity() {
    const container = document.querySelector('.swipe-container');
    const swipeElement = document.querySelector('.swipe-element');

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

function removeElement(container, element) {
    // class used to trigger animation
    element.classList.add("completed");
    element.addEventListener("animationend",
        () => {
            container.remove()
        }
    );
}
