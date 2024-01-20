'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
///////////////////////////////////////
// Modal window

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Button Smooth Scroll
btnScrollTo.addEventListener('click', e => {
  section1.scrollIntoView({ behavior: 'smooth' });
});
///////////////////////////////////////////
//Page Naviagtion

document.querySelector('.nav__links').addEventListener('click', e => {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');

  //Guard Clause if cliked doesn't exist
  if (!clicked) return;

  //Remove active classes
  tabs.forEach(el => el.classList.remove('operations__tab--active'));
  tabsContent.forEach(el => el.classList.remove('operations__content--active'));

  //Activate tab
  clicked.classList.add('operations__tab--active');

  //Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////
//Menu fade animation

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

/////////////////////////////////////////////
//Sticky navigation using Intersection Oberver API

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const navHeight = nav.getBoundingClientRect().height;
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
const header = document.querySelector('.header');
headerObserver.observe(header);

///////////////////////////////////////////
//Reveal sections
const sections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
sections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

//////////////////////////////////////////
//Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const imgLoader = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(imgLoader, {
  root: null,
  threshold: 0.1,
  rootMargin: '200px',
});

imgTargets.forEach(imgTarget => imgObserver.observe(imgTarget));

/////////////////////////////////////
//Slider

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const dotsContainer = document.querySelector('.dots');
  let curSlide = 0;
  const maxSlides = slides.length;

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class= "dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activeDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
      if (dot.dataset.slide === `${slide}`)
        dot.classList.add('dots__dot--active');
    });
    // document.querySelector(`.dots__dot[dataset-slide]="${i}" `).classList.add('dots__dot--active'); This will also work!
  };

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
      //currSlide = 1: -100% ,0%,100%,200%
    });
  };

  //Next slide
  const nextSlide = function () {
    if (curSlide === maxSlides - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activeDot(curSlide);
  };

  //Prev Slide
  const prevSlide = function (slide) {
    if (curSlide === 0) {
      curSlide = maxSlides - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activeDot(curSlide);
  };

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      curSlide = +e.target.dataset.slide;
      goToSlide(curSlide);
      activeDot(curSlide);
    }
  });
  const init = function () {
    goToSlide(curSlide);
    createDots();
    activeDot(curSlide);
  };
  init();
};
slider();
