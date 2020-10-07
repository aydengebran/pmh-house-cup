// The Marist House Cup
// src > ts > scripts.ts
// Copyright © 2020 Ayden Gebran. All rights reserved.
// Created by Ayden Gebran on 6 October 2020
// Updated October 2020 (Version 1.0)

// MODULES

// CONSTANTS

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
};

const updateActiveSection = () => {
	const scrollY = $(window).scrollTop();
	let activeSection = ``;
	if (scrollY > $(`#gallery`).offset().top)
		activeSection = `gallery`;
	else if (scrollY > $(`#houses`).offset().top)
		activeSection = `houses`;
	else if (scrollY > $(`#materials`).offset().top)
		activeSection = `materials`;
	else if (scrollY > $(`#design`).offset().top)
		activeSection = `design`;
	$(`header nav li`).removeClass(`active`);
	if (activeSection != ``)
		$(`header nav li#${activeSection}-link`).addClass(`active`);
}

// INITIAL SCRIPTS

main();