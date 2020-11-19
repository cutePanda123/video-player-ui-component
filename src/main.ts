import './main.css';

let videos = document.querySelectorAll('#video-list li');

videos.forEach((video) => {
    video.addEventListener('click', function() {
        let url : string = this.dataset.url;
        let title : string = this.dataset.title;
        console.log(url, title);
    });
});

