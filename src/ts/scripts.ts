// The Marist House Cup
// src > ts > scripts.ts
// Copyright © 2020 Ayden Gebran. All rights reserved.
// Created by Ayden Gebran on 6 October 2020
// Updated 8 October 2020 (Version 1.0)

// MODULES

// CONSTANTS

let activeSection = ``;
let heroImageIsVisible = true;

// VARIABLES

// FUNCTIONS

const main = () => {
	setGlobalListeners();
};

const setGlobalListeners = () => {
	$(window).on(`scroll`, didScroll);
};

const didScroll = () => {
	updateActiveSection();
	updateHeroImage();
	updateMaterialPositions();
};

const updateActiveSection = () => {
	const scrollY = $(window).scrollTop();
	let section = ``;
	if (scrollY > $(`#gallery`).offset().top)
		section = `gallery`;
	else if (scrollY > $(`#houses`).offset().top)
		section = `houses`;
	else if (scrollY > $(`#materials`).offset().top)
		section = `materials`;
	else if (scrollY > $(`#design`).offset().top)
		section = `design`;
	if (section != activeSection) {
		$(`header nav li`).removeClass(`active`);
		if (section != ``)
			$(`header nav li#${section}-link`).addClass(`active`);
	}
}

const updateHeroImage = () => {
	const scrollY = $(window).scrollTop();
	const $heroSection = $(`#hero`);
	const sectionY = $heroSection.offset().top - 64;
	const imageHeight = $heroSection.height() - 31;
	let percentage = (scrollY - sectionY) / imageHeight;
	if (percentage < 0)
		percentage = 0;
	else if (percentage > 1)
		percentage = 1;
	$(`#hero-image`).css({ height: `${100 - percentage * 100}%` });
	$(`#design-image`).css({ height: `${percentage * 100}%` });
	let $designImg = $(`#design img`);
	const shouldHideHero = scrollY > $designImg.offset().top - 31 - 64;
	if (shouldHideHero && heroImageIsVisible) {
		$designImg.css({ visibility: `visible` });
		$(`#images-container`).css({ visibility: `hidden` });
		heroImageIsVisible = false;
	} else if (!shouldHideHero && !heroImageIsVisible) {
		$(`#images-container`).css({ visibility: `visible` });
		$designImg.css({ visibility: `hidden` });
		heroImageIsVisible = true;
	}
}

const updateMaterialPositions = () => {
	const scrollY = $(window).scrollTop();
	const $materialsSection = $(`#materials`);
	const sectionY = $materialsSection.offset().top;
	const sectionHeight = $materialsSection.height();
	let percentage = (scrollY - sectionY) / sectionHeight;
	if (percentage < 0)
		percentage = 0;
	else if (percentage > 1)
		percentage = 1;
	$(`#rhodium`).css({ marginTop: percentage * 50 });
	$(`#rosewood`).css({ marginTop: percentage * -50 });
};

// INITIAL SCRIPTS

main();