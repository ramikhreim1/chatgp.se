// hero-video (play-pause)
const heroVid = document.querySelector(".nk-hero video");
const heroVidBtn = document.querySelector(".nk-hero .play_icon");

heroVidBtn.addEventListener('click', () => {
    if (heroVid.paused == true) {
        heroVid.play();
        heroVidBtn.classList.add('hide');
    }
});

heroVid.addEventListener('click', () => {
    if (!heroVid.paused == true) {
        heroVid.pause();
        heroVidBtn.classList.remove('hide');
    }
});



// Swiper-slider
const swiper = new Swiper(".testi_swiper", {
    loop: true,
    loopedSildes: 3,
    slidesPerView: 1,
    grabCursor: true,
    effect: "fade",
    autoplay: {
        delay: 2000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    }
});


// Back-to-top
const backTop = document.querySelector('#back_top');

window.addEventListener('scroll', () => {
    let currTop = window.scrollY;

    if (currTop >= 800) {
        backTop.classList.add('pop');
    }
    else {
        backTop.classList.remove('pop');
    }
});

backTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    return false;
});
