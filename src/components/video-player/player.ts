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
        this.templateContainer = document.createElement('div');
        this.templateContainer.style.width = this.option.width;
        this.templateContainer.style.height = this.option.height;
        this.templateContainer.className = styles.default.player;
        this.templateContainer.innerHTML = `
            <video class="${styles.default['player-content']}" src="${this.option.url}"></video>
            <div class="${styles.default['player-control']}">
                <div class="${styles.default['player-progress']}">
                    <div class="${styles.default['progress-watched']}"></div>
                    <div class="${styles.default['progress-buffered']}"></div>
                    <div class="${styles.default['progress-bar']}"></div>
                </div>
                <div class="${styles.default['play-button']}">
                    <i class="iconfont icon-Play"></i>
                </div>
                <div class="${styles.default['progress-time']}">
                    <span>00:00</span> / <span>00:00</span>
                </div>
                <div class="${styles.default['volume']}">
                    <i class="iconfont icon-sound"></i>
                    <div class="${styles.default['volume-control']}">
                        <div class="${styles.default['volume-now']}"></div>
                        <div class="${styles.default['volume-bar']}"></div>
                </div>
                <div class="${styles.default['fullscreen']}">
                    <i class="iconfont icon-Fullscreenmaximizeexpand"></i>
                </div>
            </div>
        `;
        if (typeof this.option.domAttachedPoint === 'object') {
            this.option.domAttachedPoint.appendChild(this.templateContainer);
        } else {
            document.querySelector(this.option.domAttachedPoint).appendChild(this.templateContainer);
        }
    }

    registerHandlers() {
        let videoContent: HTMLVideoElement = this.templateContainer.querySelector(`.${styles.default['player-content']}`);
        let videoControl: HTMLElement = this.templateContainer.querySelector(`.${styles.default['player-control']}`);
        let videoPlayButton = this.templateContainer.querySelector(`.${styles.default['play-button']} i`);
        let videoProgressTimeSpans = this.templateContainer.querySelectorAll(`.${styles.default['progress-time']} span`);
        let videoFullscreenButton = this.templateContainer.querySelector(`.${styles.default['fullscreen']} i`);
        let videoProgressBarDivs: NodeListOf<HTMLElement> = this.templateContainer.querySelectorAll(`.${styles.default['player-progress']} div`);
        let videoVolumeBarDivs: NodeListOf<HTMLElement> = this.templateContainer.querySelectorAll(`.${styles.default['volume-control']} div`);
        let videoProgressTimer = null;
        videoContent.volume = 0.5;

        if (this.option.autoplay) {
            videoProgressTimer = setInterval(updateVideoProgress, 1000);
            videoContent.play();
            videoContent.volume = 0;
            videoVolumeBarDivs[0].style.width = '0';
            videoVolumeBarDivs[1].style.width = '0';
        }

        this.templateContainer.addEventListener('mouseenter', function(event: MouseEvent) {
            videoControl.style.bottom = '0';
        });

        this.templateContainer.addEventListener('mouseleave', function(event: MouseEvent) {
            videoControl.style.bottom = '-50px';
        });

        videoContent.addEventListener('canplay', (event) => {
            event.preventDefault();
            videoProgressTimeSpans[1].innerHTML = formatVideoDuration(videoContent.duration);
        });

        videoContent.addEventListener('play', (event) => {
            event.preventDefault();
            videoPlayButton.className = "iconfont icon-pause";
            videoProgressTimer = setInterval(updateVideoProgress, 1000);
        });

        videoContent.addEventListener('pause', (event) => {
            event.preventDefault();
            videoPlayButton.className = "iconfont icon-Play";
            clearInterval(videoProgressTimer);
        });
        
        videoPlayButton.addEventListener('click', (event) => {
            event.preventDefault();
            if (videoContent.paused) {
                videoContent.play();
            } else {
                videoContent.pause();
            }
        });

        videoFullscreenButton.addEventListener('click', (event) => {
            event.preventDefault();
            videoContent.requestFullscreen();
        });

        videoProgressBarDivs[2].addEventListener('mousedown', function (downEvent: MouseEvent) {
            let downX = downEvent.pageX;
            let downOffset = this.offsetLeft;
            document.onmousemove = (moveEvent : MouseEvent) => {
                let ratio = (moveEvent.pageX - downX + downOffset + 8) / this.parentElement.offsetWidth;
                ratio = Math.max(ratio, 0);
                ratio = Math.min(ratio, 1);
                videoProgressBarDivs[0].style.width = (ratio * 100) + '%';
                videoProgressBarDivs[1].style.width = (ratio * 100) + '%';
                this.style.left = (ratio * 100) + '%';
                videoContent.currentTime = ratio * videoContent.duration;
            };
            document.onmouseup = () => {
                document.onmousemove = document.onmouseup = null;
            };
            downEvent.preventDefault();
        });

        videoVolumeBarDivs[1].addEventListener('mousedown', function (downEvent: MouseEvent) {
            let downX = downEvent.pageX;
            let downOffset = this.offsetLeft;
            document.onmousemove = (moveEvent : MouseEvent) => {
                let ratio = (moveEvent.pageX - downX + downOffset + 8) / this.parentElement.offsetWidth;
                ratio = Math.max(ratio, 0);
                ratio = Math.min(ratio, 1);
                videoVolumeBarDivs[0].style.width = (ratio * 100) + '%';
                this.style.left = (ratio * 100) + '%';
                videoContent.volume = ratio;
            };
            document.onmouseup = () => {
                document.onmousemove = document.onmouseup = null;
            };
            downEvent.preventDefault();
        });

        function formatVideoDuration(duration: number): string {
            let min: number = Math.floor(Math.round(duration) / 60);
            let second: number = Math.round(duration) % 60;
            return formatTimeNumber(min) + ':' + formatTimeNumber(second);
        }

        function formatTimeNumber(time: number): string {
            return time < 10 ? '0' + time : '' + time;
        }

        function updateVideoProgress() {
            videoProgressTimeSpans[0].innerHTML = formatVideoDuration(videoContent.currentTime);

            let watchedRatio: number = videoContent.currentTime / videoContent.duration;
            let bufferedRatio: number = videoContent.buffered.end(0) / videoContent.duration;
            videoProgressBarDivs[0].style.width = (watchedRatio * 100) + '%';
            videoProgressBarDivs[1].style.width = (bufferedRatio * 100) + '%';
            videoProgressBarDivs[2].style.left = (watchedRatio * 100) + '%';
        }
    }
}

export default player;