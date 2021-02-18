const testWebP = (callback) => {
   const webp = new Image();
   webp.onload = webp.onerror = () => {
      callback(webp.height == 2);
   }
   webp.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {
   if (support == true) { document.querySelector('body').classList.add('webp'); } else { document.querySelector('body').classList.add('no-webp'); }
});

const dropdowns = document.getElementsByClassName("dropdown");
for (let i = 0; i < dropdowns.length; i++) {
   const dropdown = dropdowns[i];
   const items = dropdown.querySelector('.dropdown__wrapper');
   const selectedItem = dropdown.querySelector('.dropdown__selected');
   const originSelect = dropdown.querySelector('select');
   //hide select list
   for (let i = 0; i < items.children.length; i++) {
      const item = items.children[i];
      //replace selected item and selected option
      item.addEventListener('click', function (e) {
         const selectedItems = items.querySelectorAll('.same-as-selected');
         for (let i = 0; i < selectedItems.length; i++) {
            selectedItems[i].classList.remove('same-as-selected')
         }
         selectedItem.firstElementChild.replaceWith(this.cloneNode(true));
         this.classList.add('same-as-selected');
         originSelect.selectedIndex = i;
         selectedItem.click();
      })
   }
   selectedItem.addEventListener('click', function (e) {
      e.stopPropagation();
      dropdown.classList.toggle("active");
      closeAllSelect(dropdown);
   });
}

function closeAllSelect(element) {
   /*a function that will close all select boxes in the document,
   except the current select box:*/
   const selects = document.getElementsByClassName("dropdown");
   for (let i = 0; i < selects.length; i++) {
      if (element) {
         if (selects[i] === element) {
            continue;
         }
      }
      selects[i].classList.remove("active");
   }
}

document.addEventListener("click", closeAllSelect);

const searchEl = document.querySelector('.header__search');
const searchBar = searchEl.querySelector('input');
const searchBtn = searchEl.querySelector('button');
searchBtn.addEventListener('click', () => {
   if (searchEl.classList.contains('active')) {
      searchBar.addEventListener('transitionend', () => {
         requestAnimationFrame(() => {
            searchEl.classList.remove('active');
         })
      }, { once: true })
      requestAnimationFrame(() => {
         searchBar.classList.remove('active');
      })
   }
   else {
      searchEl.addEventListener('transitionend', () => {
         requestAnimationFrame(() => {
            searchBar.classList.add('active');
         })
      }, { once: true })
      requestAnimationFrame(() => {
         searchEl.classList.add('active');
      })
   }
});

const bannerSliderEl = document.querySelector('.banner-slider');
const bannerSlider = new Swiper('.banner-slider__container', {
   wrapperClass: 'banner-slider__wrapper',
   slideClass: 'banner-slider__slide',
   pagination: {
      el: '.banner-slider__pagination',
      type: 'bullets',
      clickable: true
   },
   autoplay: {
      delay: 5000,
   },
   speed: 2000,
   spaceBetween: 20,
   slidesPerView: 1,
});

bannerSliderEl.addEventListener('mouseover', function () {
   bannerSlider.autoplay.stop();
});

bannerSliderEl.addEventListener('mouseout', function () {
   bannerSlider.autoplay.start();
});

const rotateGears = (() => {
   const gearsL = document.querySelectorAll('.gear-bg__gr-1 .bg-gear');
   const gearsR = document.querySelectorAll('.gear-bg__gr-2 .bg-gear');
   let deg = 0;
   let scrolltop = 0;
   return () => {
      if (scrolltop < window.scrollY) {
         deg += 4;
      }
      else {
         deg -= 4;
      }
      scrolltop = window.scrollY;
      for (let i = 0; i < gearsL.length; i++) {
         gearsL[i].style.transform = `rotate(${deg}deg)`;
      }
      for (let i = 0; i < gearsR.length; i++) {
         gearsR[i].style.transform = `rotate(${-deg}deg)`;
      }
   }
})();
document.addEventListener('scroll', rotateGears);

const burgerMenu = document.querySelector('.header__burger');
const navMenu = document.querySelector('.header__nav');
const langMenu = document.querySelector('.header__lang');
let activeSearch = false

burgerMenu.addEventListener('click', (e) => {
   if (activeSearch) {
   };
   activeSearch != activeSearch;
   burgerMenu.classList.toggle('active');
   navMenu.classList.toggle('active');
   langMenu.classList.toggle('active');
   document.body.classList.toggle('lock');
});