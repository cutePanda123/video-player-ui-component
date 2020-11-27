import './main.css';
import popup from './components/popup/popup';
import player from './components/video-player/player';

let videos = document.querySelectorAll('#video-list li');

videos.forEach((video) => {
    video.addEventListener('click', function() {
        let url : string = this.dataset.url;
        let title : string = this.dataset.title;
        console.log(url, title);

        popup({
            width: '880px',
            height: '556px',
            title: title,
            mask: true,
            contentCallback: (content: HTMLElement) => {
                console.log(content);
                player({
                    url: url,
                    domAttachedPoint: content,
                    autoplay: true
                });
            }
        });
    });
});

