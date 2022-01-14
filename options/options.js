document.addEventListener('change', getEventType, false);


function getEventType(e) {
  const log = document.getElementById('log');
  log.innerText = e.target.id + '\n' + log.innerText;
     

 //browser.notifications.create('', {
 //   title: `Runtime Examples version`,
 //   type: `basic`,
 //   message: e.target.id
 // });

}

var fullURL = browser.runtime.getURL("options/options.html");
console.log(fullURL);
// Returns something like:
// moz-extension://2c127fa4-62c7-7e4f-90e5-472b45eecfdc/options/options.html
