// The Marist House Cup
// dist > js > index.ts
// Created on 6 October 2020
// Updated 22 January 2020 (Version 1.0)

// MODULES

// CONSTANTS

// VARIABLES

let activeSection = "";
let heroImageIsVisible = true;

// FUNCTIONS

const main = function () {
  setDocumentListeners();
};

const setDocumentListeners = function () {
  $(window).on("scroll", didScroll);
  $("#design-link").on("click", () => makeSectionActive("design"));
  $("#materials-link").on("click", () => makeSectionActive("materials"));
  $("#houses-link").on("click", () => makeSectionActive("houses"));
  $("#gallery-link").on("click", () => makeSectionActive("gallery"));
};

const didScroll = () => {
  updateActiveSection();
  updateHeroImage();
  updateMaterialPositions();
};

const makeSectionActive = (section) => {
  console.log(section);
  $(`html`).animate({
    scrollTop: $(`#${section}`).offset().top - 60
  }, 1000);
};

const updateActiveSection = () => {
  let scrollY = $(window).scrollTop() + 64;
  let section = "";
  if (scrollY > $("#gallery").offset().top)
    section = "gallery";
  else if (scrollY > $("#houses").offset().top)
    section = "houses";
  else if (scrollY > $("#materials").offset().top)
    section = "materials";
  else if (scrollY > $("#design").offset().top)
    section = "design";
  if (section != activeSection) {
    $("header nav li").removeClass("active");
    if (section != "")
      $("header nav li#" + section + "-link").addClass("active");
  }
};

const updateHeroImage = () => {
  let scrollY = $(window).scrollTop();
  let $heroSection = $("#hero");
  let sectionY = $heroSection.offset().top - 64;
  let imageHeight = $heroSection.height() - 31;
  let percentage = (scrollY - sectionY) / imageHeight;
  if (percentage < 0)
    percentage = 0;
  else if (percentage > 1)
    percentage = 1;
  $("#hero-image").css({ height: 100 - percentage * 100 + "%" });
  $("#design-image").css({ height: percentage * 100 + "%" });
  let $designImg = $("#design img");
  let shouldHideHero = scrollY > $designImg.offset().top - 31 - 64;
  if (shouldHideHero && heroImageIsVisible) {
    $designImg.css({ visibility: "visible" });
    $("#images-container").css({ visibility: "hidden" });
    heroImageIsVisible = false;
  }
  else if (!shouldHideHero && !heroImageIsVisible) {
    $("#images-container").css({ visibility: "visible" });
    $designImg.css({ visibility: "hidden" });
    heroImageIsVisible = true;
  }
};

const updateMaterialPositions = () => {
  let scrollY = $(window).scrollTop();
  let $materialsSection = $("#materials");
  let sectionY = $materialsSection.offset().top;
  let sectionHeight = $materialsSection.height();
  let percentage = (scrollY - sectionY) / sectionHeight * 2;
  if (percentage < 0)
    percentage = 0;
  else if (percentage > 1)
    percentage = 1;
  $("#rhodium").css({ marginTop: percentage * 90 });
  $("#rosewood").css({ marginTop: percentage * -90 });
};

const browserSupportsAr = () => {
  const a = document.createElement('a');
  return a.relList.supports('ar');
};

// INITIAL SCRIPTS

main();
