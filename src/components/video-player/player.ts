import IComponent from '../common/component';
let styles = require('./player.css');

interface IPlayerOption {
    url: string;
    domAttachedPoint: string | HTMLElement;
    width?: string;
    height?: string;
    autoplay?: boolean;
}

function player(option: IPlayerOption) {
    return new Player(option);
}

class Player implements IComponent {
    templateContainer: HTMLElement;

    constructor(private option: IPlayerOption) {
        this.option = Object.assign(
            {
                width: '100%',
                height: '100%',
                autoplay: false
            },
            this.option
        );
        this.init();
    }

    init() {
        this.createDomTemplate();
        this.registerHandlers();
    }

    createDomTemplate() {

    }

    registerHandlers() {

    }
}