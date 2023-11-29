const rootContainer = document.querySelector('.container');
const swipeContainer = document.querySelector('.swipe-container');
const swipeElement = document.querySelector('.swipe-element');
const deleteButton = document.querySelector('.delete-button');

document.querySelectorAll(".swipe-container").forEach(() => { handlePointer(rootContainer, swipeContainer, swipeElement, deleteButton) });

// The mutation observer
var ob = new MutationObserver(() => {
    resetTask(root, container, element);
 });
 ob.observe(rootContainer, {
   attributes: true,
   attributeFilter: ["class"]
 });

disableDragging('.prevent-select');

// initialises listeners and moves element on grab
function handlePointer(root, container, element, deleteButton) {

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

    const isTaskCompleted = () => {
        return !root.classList.contains("hidden");
    }

    const resetElement = () => {
        element.style.cursor = "grab";

        // centre the element
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
    container.addEventListener("pointerup", () => { dragFalse(); isTaskCompleted() && resetElement(); });
    container.addEventListener("pointermove", drag);
    container.addEventListener("pointerdown", () => { dragTrue(); grabElement(); });

    element.addEventListener("pointerup", () => handleSwipe(root, container, element));
    element.addEventListener("pointermove", () => isDrag && handleElementOpacityOnSwipe(container, element));
    element.addEventListener("pointerleave", () => { dragFalse(); isTaskCompleted() && resetElement(); });
    onLongPressOfElement(element, () => jiggleElement(container, element));

    deleteButton.addEventListener("pointerdown", () => element.classList.contains("jiggle") && removeTask(root));
};

// determines if the element needs to be removed or expanded
function handleSwipe(root, container, element) {

    // don't interrupt the jiggle!!!
    if (element.classList.contains("jiggle")) {
        return;
    }

    // define the minimum distance to trigger the action
    const minDistance = convertRemToPixels(4);

    // get the distance the user swiped
    const swipeDistance = container.scrollLeft - container.clientWidth;

    if (swipeDistance < minDistance * -1) {

        // remove the element when the user moves the element far enough
        removeTask(root, container);
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

// fade in and out an element
function toggleElementFade(element) {

    let animation = 'fadeOutButton 0.6s';
    let opacity = 0;

    element.classList.toggle("visible") && (animation = 'fadeInButton 0.6s', opacity = 1);
    element.style.setProperty('animation', animation);
    element.addEventListener("animationend",
        () => {
            // set to 1 as it reverts to its original opactiy before the animation happened
            element.style.opacity = opacity;

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

    const cancel = () => {
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

    // fade in/out the delete button
    toggleElementFade(deleteButton);

    // awkward, but it works to prevent the container from expanding;
    // eventListener will activate though pointerUp after user stops 
    // holding the the element to toggle the jiggle
    // and this expands the element, which is not intended
    element.classList.add("jiggleFinished");
}

// removes the task from sight!
function removeTask(root, container = 0) {

    // "container" is an optional parameter
    // it is passed when used in handleSwipe() 
    // to animate the container scrolling off screen
    container && container.scrollTo({
        left: 0,
        behavior: 'smooth'
    });

    root.classList.add("hidden");
    root.style.setProperty('animation', 'fadeOutButton 0.6s');
    root.addEventListener("animationend",
        () => {
            // set to 0 as it reverts to its original opactiy before the animation happened
            root.style.opacity = 0;

        }
    );

}

// TODO
function resetTask(root, container, element) {

    // set up timer to wait 2 seconds
    setTimeout(reset, 2000);

    // reset element
    const reset = () => {

        // centre element
        container.scrollTo({
            left: container.clientWidth,
        });

        // remove jiggle
        jiggleElement(container, element);

        // fade element back in
        root.classList.remove("hidden");
        root.style.setProperty('animation', 'fadeInButton 0.6s');
        root.addEventListener("animationend",
            () => {
                // set to 1 as it reverts to its original opactiy before the animation happened
                root.style.opacity = 1;
    
            }
        );
    }
}

// should help prevent icons from being dragged
function disableDragging(className) {
	var draggables = document.querySelector(className);
	for(var i = 0 ; i < draggables.length ; i++) {
		draggables[i].classList.add('no-drag');
		draggables[i].setAttribute('no-drag', 'on');
		draggables[i].setAttribute('draggable', 'false');
		draggables[i].addEventListener('dragstart', function( event ) {
			event.preventDefault();
		}, false);	
	}
}


