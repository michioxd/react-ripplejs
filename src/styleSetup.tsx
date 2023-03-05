import mainCss from "./mainCss";

function hasCSS(): boolean {
    if (document.getElementById('react-ripplejs-style') === null) {
        var test = document.createElement('div');
        test.className = 'rippleJS';
        document.body.appendChild(test);
        var s = window.getComputedStyle(test);
        var result = (s.position === 'absolute');
        document.body.removeChild(test);
        return result;
    } else {
        return true;
    }
}

export default function styleSetup() {
    if (!hasCSS()) {
        var style = document.createElement('style');
        style.textContent = mainCss;
        style.id = "react-ripplejs-style";
        document.head.insertBefore(style, document.head.firstChild);
    }
};