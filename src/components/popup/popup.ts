//let styles = require('./popup.css');  need to use styles.default.popup to access
import styles from './popup.css'

interface IPopupOption {
    width?: string;
    height?: string;
    title?: string;
    pos?: string;
    mask?: boolean;
    content?: () => void;
}

interface IComponent {
    templateContainer : HTMLElement;
    init: () => void;
    handle: () => void;
    template: () => void;
}

function popup(option : IPopupOption) {
    return new Popup(option);
}

class Popup implements IComponent {
    templateContainer : HTMLElement;

    constructor(private option : IPopupOption) {
        this.option = Object.assign(
            {
                width: '100%',
                height: '100%',
                title: '',
                pos: 'center',
                mask: true,
                content: () => {
                    console.log("testing");    
                }
            },
            this.option
        );
        this.init();
    }

    init() {
        this.template();
    }

    handle() {}

    template() {
        this.templateContainer = document.createElement('div');
        //this.templateContainer.innerHTML = `<h1 class="${styles.default.popup}">hello</h1>`;
        this.templateContainer.innerHTML = `<h1 class="${styles.popup}">hello</h1>`;
        document.body.appendChild(this.templateContainer);
    }
}

export default popup;