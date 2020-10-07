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
};
main();
