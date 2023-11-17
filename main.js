const swipeContainer = document.querySelector('.swipe-container');
const swipeElement = document.querySelector('.swipe-element');

setupEventListeners(swipeContainer, swipeElement);
onLongPress(swipeElement, () => jiggleElement(swipeContainer, swipeElement));

function setupEventListeners(container, element) {

    element.addEventListener("mouseup", () => handleSwipe(container, element));
    element.addEventListener("mousemove", () => handleElementOpacityOnSwipe(container, element));

}

function handleSwipe(container, element) {

    // don't interrupt the jiggle!!!
    if (element.classList.contains("jiggle")) {
        return;
    }

    // define the minimum distance to trigger the action
    const minDistance = 10;

    // get the distance the user swiped
    const swipeDistance = container.scrollLeft - container.clientWidth;

    if (swipeDistance < minDistance * -1) {

        // remove the element when the user moves the element far enough
        removeElement(container, element);
    } else if (swipeDistance > minDistance) {

        // fade in if only swiped left
        fadeIn(element);
    } else {

        // expand or collapse the element
        element.classList.toggle("expanded");
    }
}

function handleElementOpacityOnSwipe(container, element) {

    const containerWidth = container.clientWidth;

    // get the distance the user swiped and make it positive
    const swipeDistance = Math.abs(container.scrollLeft - containerWidth);

    // calculate opacity on distance swiped
    let opacity = 1 - (swipeDistance / containerWidth);

    // assign opacity
    if (opacity >= 0) {
        element.classList.remove("visible");
        document.documentElement.style.setProperty('--opacityAnimated', opacity);
    }
}

function fadeIn(element) {

    // visible is "animation: fadeIn 0.6s;"
    element.classList.add("visible");
    element.addEventListener("animationend",
        () => {
            // set to 1 as it reverts to its original opactiy before the animation happened
            document.documentElement.style.setProperty('--opacityAnimated', 1);

        }
    );
}

function removeElement(container, element) {

    // class used to trigger animation
    element.classList.add("completed");
    element.addEventListener("animationend",
        () => {
            container.remove();
        }
    );
}

function onLongPress(element, callback) {
    let timer;

    // setup on the start of the touch
    element.addEventListener('mousedown', () => {
        timer = setTimeout(() => {
            timer = null;

            // if it lasts a 1 second make it jiggle
            callback();
        }, 1000);
    });

    function cancel() {
        clearTimeout(timer);
    }

    element.addEventListener('mouseup', cancel);
    element.addEventListener('mousemove', cancel);
}

function jiggleElement(container, element) {

    // jiggling commences
    container.classList.toggle("disable-scroll");
    element.classList.remove("expanded");
    element.classList.toggle("jiggle");
}