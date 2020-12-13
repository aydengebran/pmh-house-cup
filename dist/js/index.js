"use strict";
var activeSection = "";
var heroImageIsVisible = true;
var main = function () {
    setDocumentListeners();
};
var setDocumentListeners = function () {
    $(window).on("scroll", didScroll);
};
var didScroll = function () {
    updateActiveSection();
    updateHeroImage();
    updateMaterialPositions();
};
var updateActiveSection = function () {
    var scrollY = $(window).scrollTop();
    var section = "";
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
var updateHeroImage = function () {
    var scrollY = $(window).scrollTop();
    var $heroSection = $("#hero");
    var sectionY = $heroSection.offset().top - 64;
    var imageHeight = $heroSection.height() - 31;
    var percentage = (scrollY - sectionY) / imageHeight;
    if (percentage < 0)
        percentage = 0;
    else if (percentage > 1)
        percentage = 1;
    $("#hero-image").css({ height: 100 - percentage * 100 + "%" });
    $("#design-image").css({ height: percentage * 100 + "%" });
    var $designImg = $("#design img");
    var shouldHideHero = scrollY > $designImg.offset().top - 31 - 64;
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
var updateMaterialPositions = function () {
    var scrollY = $(window).scrollTop();
    var $materialsSection = $("#materials");
    var sectionY = $materialsSection.offset().top;
    var sectionHeight = $materialsSection.height();
    var percentage = (scrollY - sectionY) / sectionHeight;
    if (percentage < 0)
        percentage = 0;
    else if (percentage > 1)
        percentage = 1;
    $("#rhodium").css({ marginTop: percentage * 75 });
    $("#rosewood").css({ marginTop: percentage * -75 });
};

const browserSupportsAr = () => {
  const a = document.createElement('a');
  return a.relList.supports('ar');
};

main();
