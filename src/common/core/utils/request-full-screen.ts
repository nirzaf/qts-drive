export function requestFullScreen(el: HTMLElement) {
    if (el.requestFullscreen) {
        el.requestFullscreen();
    } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
    } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
    } else if (el.webkitRequestFullScreen) {
        el.webkitRequestFullScreen();
    }
}
