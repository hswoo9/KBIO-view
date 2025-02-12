export function openModal(className) {
    const element = document.querySelector("." + className);
    console.log(element);
    if(element){
        const htmlElement = document.querySelector("html");
        const bodyElement = document.querySelector("body");
        if(htmlElement){
            htmlElement.style.overflow = "hidden";
        }
        if(bodyElement){
            bodyElement.style.overflow = "hidden";
        }
        element.classList.add("open");
    }
}

export function closeModal(className) {
    const element = document.querySelector("." + className);
    console.log(element);
    if(element){
        const htmlElement = document.querySelector("html");
        const bodyElement = document.querySelector("body");
        if(htmlElement){
            htmlElement.style.overflow = "visible";
        }
        if(bodyElement){
            bodyElement.style.overflow = "visible";
        }
        element.classList.remove("open");
    }
}