
chrome.webNavigation.onCompleted.addListener(
    (tab) => {
        console.log('kk extension');
        console.log(getDomain(tab.url));
    }
  );

function getDomain(url) {
    return url.replace('http://','').replace('https://','').split(/[/?#]/)[0];
}
