const sr = ScrollReveal ({
	distance: '35px',
	duration: 2400,
	reset: true
});

sr.reveal('.main-img',{delay:210, origin: 'left'});
sr.reveal('.main-text h1',{delay:310, origin: 'top'});
sr.reveal('.main-text h4',{delay:410, origin: 'right'});
sr.reveal('.social',{delay:210, origin: 'bottom'});

sr.reveal('.row',{delay:510, origin: 'left'});
sr.reveal('.button',{delay:610, origin: 'top'});
sr.reveal('.center',{delay:710, origin: 'right'});

sr.reveal('.portfolio',{delay:810, origin: 'top'});

function copyDiscordTag() {
    const discordTag = "loadingfunds";
    navigator.clipboard.writeText(discordTag).then(() => {
        alert('Discord tag copied to clipboard!');
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('share_scripts.js loaded');
    // Additional JavaScript code here
});
