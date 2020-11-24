let styles = require('./popup.css'); // need to use styles.default to access
//import styles from './popup.css'

interface IPopupOption {
    width?: string;
    height?: string;
    title?: string;
    pos?: string;
    mask?: boolean;
    contentCallback?: (content: Element) => void;
}

interface IComponent {
    templateContainer: HTMLElement;
    init: () => void;
    handle: () => void;
    template: () => void;
}

function popup(option : IPopupOption) {
    return new Popup(option);
}

class Popup implements IComponent {
    templateContainer: HTMLElement;
    mask: HTMLElement;

    constructor(private option : IPopupOption) {
        this.option = Object.assign(
            {
                width: '100%',
                height: '100%',
                title: '',
                pos: 'center',
                mask: true,
                contentCallback: () => {}
            },
            this.option
        );
        this.init();
    }

    init() {
        this.template();
        this.option.mask && this.renderMask();
        this.handle();
        this.contentCallback();
    }

    handle() {
        let popupCloseButton = this.templateContainer.querySelector(`.${styles.default['popup-title']} i`);
        popupCloseButton.addEventListener('click', () => {
            document.body.removeChild(this.templateContainer);
            this.option.mask && document.body.removeChild(this.mask);
        });
    }

    template() {
        this.templateContainer = document.createElement('div');
        this.templateContainer.style.width = this.option.width;
        this.templateContainer.style.height = this.option.height;
        this.templateContainer.className = styles.default.popup;

        //this.templateContainer.innerHTML = `<h1 class="${styles.default.popup}">hello</h1>`;
        this.templateContainer.innerHTML = `
            <div class="${styles.default['popup-title']}">
                <h3>${this.option.title}</h3>
                <i class="iconfont icon-baseline-close-px"></i>
            </div>
            <div class=${styles.default['popup-content']}>

            </div>
        `;
        document.body.appendChild(this.templateContainer);
        if (this.option.pos === 'left') {
            this.templateContainer.style.left = '0';
            this.templateContainer.style.top = (window.innerHeight - this.templateContainer.offsetHeight) + 'px';
        } else if (this.option.pos === 'right') {
            this.templateContainer.style.right = '0';
            this.templateContainer.style.top = (window.innerHeight - this.templateContainer.offsetHeight) + 'px';
        } else {
            this.templateContainer.style.left = (window.innerWidth - this.templateContainer.offsetWidth) / 2 + 'px';
            this.templateContainer.style.top = (window.innerHeight - this.templateContainer.offsetHeight) / 2 + 'px';
        }
    }

    renderMask() {
        this.mask = document.createElement('div');
        this.mask.className = styles.default.mask;
        this.mask.style.height = document.body.offsetHeight + 'px';
        document.body.appendChild(this.mask);
    }

    contentCallback() {
        let popupContent = this.templateContainer.querySelector(`.${styles.default['popup-content']}`);
        this.option.contentCallback(popupContent);
    }
}

export default popup;