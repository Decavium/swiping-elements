const swipeContainer = document.querySelector('.swipe-container');
const swipeElement = document.querySelector('.swipe-element');

document.querySelectorAll(".swipe-container").forEach(() => { handlePointer(swipeContainer, swipeElement) });

// initialises listeners and moves element on grab
function handlePointer(container, element) {

    let isDrag = false;

    const dragTrue = () => {
        isDrag = true;
    };

    const dragFalse = () => {
        isDrag = false;
    };

    const drag = (event) => {
        if (isDrag) {

            // don't interrupt the jiggle!!!
            if (element.classList.contains("jiggle")) {
                return;
            }

            container.scrollLeft -= event.movementX;
        }
    };

    const resetElement = () => {
        element.style.cursor = "grab";

        // center the element
        container.scrollTo({
            left: container.clientWidth,
            behavior: 'smooth'
        });
        fadeInElement(element);
    }

    const grabElement = () => {
        element.style.cursor = "grabbing";
        element.style.scrollSnapAlign = "none";
    }

    // set up listeners
    container.addEventListener("pointerup", () => { dragFalse(); resetElement(); });
    container.addEventListener("pointermove", drag);
    container.addEventListener("pointerdown", () => { dragTrue(); grabElement(); });

    element.addEventListener("pointerup", () => handleSwipe(container, element));
    element.addEventListener("pointermove", () => { isDrag && handleElementOpacityOnSwipe(container, element) });
    element.addEventListener("pointerleave", () => { dragFalse(); resetElement(); });
    onLongPressOfElement(element, () => jiggleElement(container, element));
};

// determines if the element needs to be removed or expanded
function handleSwipe(container, element) {

    // don't interrupt the jiggle!!!
    if (element.classList.contains("jiggle")) {
        return;
    }

    // define the minimum distance to trigger the action
    const minDistance = convertRemToPixels(5);

    // get the distance the user swiped
    const swipeDistance = container.scrollLeft - container.clientWidth;

    if (swipeDistance < minDistance * -1) {

        // remove the element when the user moves the element far enough
        removeElement(container, element);
    } else if (swipeDistance < minDistance) {

        // make sure element doesn't expand after jiggling ends
        if (element.classList.contains("jiggleFinished")) {
            element.classList.remove("jiggleFinished");
            return;
        }

        // expand or collapse the element
        element.classList.toggle("expanded");
    }
}

// use to determine min distance the element to be swiped to be completed
function convertRemToPixels(rem) {    
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

// changes the element opacity when it is being grabbed
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

// once the element is not grabbed it returns to normal opacity
function fadeInElement(element) {

    // visible is "animation: fadeIn 0.6s;"
    element.classList.add("visible");
    element.addEventListener("animationend",
        () => {
            // set to 1 as it reverts to its original opactiy before the animation happened
            document.documentElement.style.setProperty('--opacityAnimated', 1);

        }
    );
}

// when the element is swiped right it is removed
function removeElement(container, element) {

    // class used to trigger animation
    element.classList.add("completed");
    element.addEventListener("animationend",
        () => {
            container.remove();
        }
    );
}

// after a second on holding this function toggles the jiggle
function onLongPressOfElement(element, callback) {
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

// sets the animation up and removes element interactivity
function jiggleElement(container, element) {

    // jiggling commences
    container.classList.toggle("disable-scroll");
    element.classList.remove("expanded");
    element.classList.toggle("jiggle");

    // awkward, but it works to prevent it from expanding
    element.classList.add("jiggleFinished");
}

