const allMusic = [
    {
        name: "1. Kazoom",
        artist: "Quincas Moreira",
        img: "music-1",
        audio: "music-1"
    },
    {
        name: "2. Calimba",
        artist: "E's Jammy Jams",
        img: "music-2",
        audio: "music-2"
    },
    {
        name: "3. This Old Man (instrumental)",
        artist: "The Green Orbs",
        img: "music-3",
        audio: "music-3"
    },
    {
        name: "4. This Old Man (vocal)",
        artist: "The Green Orbs",
        img: "music-4",
        audio: "music-4"
    },
    {
        name: "5. The Farmer In The Dell",
        artist: "The Green Orbs",
        img: "music-5",
        audio: "music-5"
    },
    {
        name: "6. The Farmer In The Dell (Instrumental)",
        artist: "The Green Orbs",
        img: "music-6",
        audio: "music-6"
    },
    {
        name: "7. Snack Time",
        artist: "The Green Orbs",
        img: "music-7",
        audio: "music-7"
    },
    {
        name: "8. Sand Castles",
        artist: "The Green Orbs",
        img: "music-8",
        audio: "music-8"
    },
    {
        name: "9. Rock-a-bye Baby",
        artist: "The Green Orbs",
        img: "music-9",
        audio: "music-9"
    },
    {
        name: "10. A Walk Into Space",
        artist: "Topher Mohr and Alex Elena",
        img: "music-10",
        audio: "music-10"
    },
]

const musicWrap = document.querySelector(".music__wrap");
const musicView = musicWrap.querySelector(".music__view .img img");
const musicName = musicWrap.querySelector(".music__view .title h3");
const musicArtist = musicWrap.querySelector(".music__view .title p");
const musicAudio = musicWrap.querySelector("#main-audio");
const musicPlay = musicWrap.querySelector("#control-play");
const musicPrevBtn = musicWrap.querySelector("#control-prev");
const musicNextBtn = musicWrap.querySelector("#control-next");
const musicProgress = musicWrap.querySelector(".progress");
const musicProgressBar = musicWrap.querySelector(".progress .bar");
const musicProgressCurrent = musicWrap.querySelector(".progress .timer .current");
const musicProgressDuration = musicWrap.querySelector(".progress .timer .duration");
const musicRepeat = musicWrap.querySelector("#control-repeat");
const musicListBtn = musicWrap.querySelector("#control-list");
const musicList = musicWrap.querySelector(".music__list");
const musicListUl = musicList.querySelector(".music__list ul");

let musicIndex = 1;

// 음악 재생
function loadMusic(num){
    musicName.innerText = allMusic[num-1].name;
    musicArtist.innerText = allMusic[num-1].artist;
    musicView.src = `../assets/img/${allMusic[num-1].img}.png`;
    musicView.alt = allMusic[num-1].name;
    musicAudio.src = `../assets/audio/${allMusic[num-1].audio}.mp3`;
}
musicAudio.play();

// 재생 버튼
function playMusic() {
    musicWrap.classList.add("paused");
    musicPlay.setAttribute("title", "정지");
    musicPlay.setAttribute("class", "stop");
    musicAudio.play();
}

// 정지 버튼
function pauseMusic() {
    musicWrap.classList.remove("paused");
    musicPlay.setAttribute("title", "재생");
    musicPlay.setAttribute("class", "play");
    musicAudio.pause();
}

// 이전 곡 듣기 버튼
function prevMusic() {
    // musicIndex --
    musicIndex == 1 ? musicIndex = allMusic.length : musicIndex--;
    loadMusic(musicIndex);
    playMusic();
}

// 다음 곡 듣기 버튼
function nextMusic() {
    // musicIndex ++
    musicIndex == allMusic.length ? musicIndex = 1 : musicIndex++;
    loadMusic(musicIndex);
    playMusic();
}

// 뮤직 리스트 버튼
musicListBtn.addEventListener("click", () => {
    musicList.classList.add("show");
});

// 뮤직 리스트 구현하기
for(let i=0; i<allMusic.length; i++){
    let li = `
        <li>
            <strong>${allMusic[i].name}</strong>
            <em>${allMusic[i].artist}</em>
            <span>재생시간</span>
        </li>
    `;

    musicListUl.innerHTML += li;
}

// 플레이 버튼 클릭
musicPlay.addEventListener("click", () => {
    const isMusicPaused = musicWrap.classList.contains("paused");   // 음악이 재생중
    isMusicPaused ? pauseMusic() : playMusic();
});

// 이전곡 버튼 클릭
musicPrevBtn.addEventListener("click", () => {
    prevMusic();
});

// 다음곡 버튼 클릭
musicNextBtn.addEventListener("click", () => {
    nextMusic();
});

// 뮤직 진행바
musicAudio.addEventListener("timeupdate", e => {
    // console.log(e);

    const currentTime = e.target.currentTime;   // 현재 재생되는 시간
    const duration = e.target.duration;         // 오디오의 총 길이
    let progressWidth = (currentTime/duration) * 100;   // 전체길이에서 현재 진행되는 시간을 백분위로 나눔
    
    musicProgressBar.style.width = `${progressWidth}%`;

    // 전체 시간
    musicAudio.addEventListener("loadeddata", () => {
        let audioDuration = musicAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);    // 전체시간을 분단위로 쪼갬
        let totalSec = Math.floor(audioDuration % 60);    // 남은 초를 저장
        if(totalSec < 10) totalSec = `0${totalSec}`;      // 초가 한자리수일때 일의 자리수 앞에 0을 붙임
        musicProgressDuration.innerText = `${totalMin}:${totalSec}`;    // 완성된 시간 문자열                                 
    });

    // 진행 시간
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10) currentSec = `0${currentSec}`;
    musicProgressCurrent.innerText = `${currentMin}:${currentSec}`;
});

// 진행 버튼 클릭
musicProgress.addEventListener("click", (e) => {
    let progressWidth = musicProgress.clientWidth;  // 진행바 전체 길이
    let clickedOffsetX = e.offsetX;                 // 진행바 기준으로 측정되는 X좌표값
    let songDuration = musicAudio.duration;         // 오디오 전체 길이

    musicAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;   // 백분위로 나눈 숫자에 다시 전체 길이를 곱해서 현재 재생값으로 바꿈
});

// 반복 버튼 클릭
musicRepeat.addEventListener("click", () => {
    let getAttr = musicRepeat.getAttribute("class");

    switch(getAttr){
        case "repeat" : 
            musicRepeat.setAttribute("class", "repeat_one");
            musicRepeat.setAttribute("title", "한곡 반복");
        break;
        case "repeat_one" :
            musicRepeat.setAttribute("class", "shuffle");
            musicRepeat.setAttribute("title", "랜덤 재생");
        break;
        case "shuffle" : 
            musicRepeat.setAttribute("class", "repeat");
            musicRepeat.setAttribute("title", "전체 반복");
        break;
    }
});

// 오디오가 끝나면
musicAudio.addEventListener("ended", () => {
    let getAttr = musicRepeat.getAttribute("class");
    
    switch(getAttr) {
        case "repeat" :
            nextMusic();
        break;
        case "repeat_one" : 
            playMusic();
        break;
        case "shuffle" :
            let randomIndex = Math.floor(Math.random() * allMusic.length + 1);      // 랜덤 인덱스 생성

            do {
                randomIndex = Math.floor(Math.random() * allMusic.length + 1);
            } while ( musicIndex == randomIndex )
                musicIndex = randomIndex;   // 현재 인덱스를 랜덤 인덱스로 변경
                loadMusic(musicIndex);      // 랜덤 인덱스가 반영된 현재 인덱스 값으로 음악을 다시 로드
                playMusic();                // 로드한 음악을 재생
            break;
    }
});

// 버튼 바꿔주기
const btnPlay = document.querySelector("#control-play");
const btnStop = document.querySelector("#control-stop");

btnStop.style.display = "none";

btnPlay.addEventListener("click", () => {
    playMusic();
    btnStop.style.display = "block";
    btnPlay.style.display = "none";
});

btnStop.addEventListener("click", () => {
    pauseMusic();
    btnStop.style.display = "none";
    btnPlay.style.display = "block";
});

// 로드
window.addEventListener("load", () => {
    loadMusic(musicIndex);
});