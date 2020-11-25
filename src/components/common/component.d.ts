interface IComponent {
    templateContainer: HTMLElement;
    init: () => void;
    registerHandlers: () => void;
    createDomTemplate: () => void;
}

export default IComponent;