var db;
var newItem = [
      { siteTitle: "", url:"", pic:""}
    ];

  window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
  window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

  var DBOpenRequest = window.indexedDB.open("superStart", 4);

  DBOpenRequest.onerror = function(event) {
    console.log('Error loading database.');
  };

  DBOpenRequest.onsuccess = function(event) {
    db = DBOpenRequest.result;
  };

  DBOpenRequest.onupgradeneeded = function(event) {
    var db = event.target.result;

    db.onerror = function(event) {
      console.log('Error loading database.');
    };

    var objectStore = db.createObjectStore("superStart", { keyPath: "siteTitle" });
    objectStore.createIndex("url", "url", { unique: false });
    objectStore.createIndex("pic", "pic", { unique: false });
    console.log('Object store created.');
  };

  function addData(tab,imageUri) {
      var newItem = [
        { siteTitle: tab.title, url: tab.url, pic: imageUri }
      ];

      var transaction = db.transaction(["superStart"], "readwrite");
      transaction.oncomplete = function() {
        console.log('Transaction completed: database modification finished.');
      };

      transaction.onerror = function() {
        console.log('Transaction not opened due to error: ' + transaction.error);
      };

      var objectStore = transaction.objectStore("superStart");
      var objectStoreRequest = objectStore.add(newItem[0]);
        objectStoreRequest.onsuccess = function(event) {

          console.log('Request successful.');
        };
    };


//===========================
// передача сообщения в скрипт основной страницы
//============

//browser.runtime.onMessage.addListener(notify);

//function notify(message) {
//  browser.notifications.create({
//    "type": "basic",
//    "iconUrl": browser.extension.getURL("link.png"),
//    "title": "BCGRAOUND",
//    "message": "Title: "+ message.title+ ' ' +'URL: '+message.url
//  });//
//}

//================================================
//================================================

function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}
browser.menus.create({
  id: "add-page",
  title: browser.i18n.getMessage("contextMenuAdd"),
  type: "normal",
  contexts: ["all"]
}, onCreated);

browser.menus.create({
  id: "add-page_tools",
  title: browser.i18n.getMessage("contextMenuAdd"),
  type: "normal",
  contexts: ["tools_menu"]
}, onCreated);

browser.menus.create({
  id: "add-page_tab",
  title: browser.i18n.getMessage("contextMenuAdd"),
  type: "normal",
  contexts: ["tab"]
}, onCreated);

browser.menus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case "add-page":
      addPage(info, tab);
      break;
    case "add-page_tools":
      addPage(info, tab);
      break;
    case "add-page_tab":
      addPage(info, tab);
      break;
  }
});

function onCreated(tab) {
  console.log(`Created new tab: ${tab.id}`)
}
function onError(error) {
  console.log(`Error: ${error}`);
}

 
function addPage(info, tab) {
 
  function onCaptured(imageUri) {
  browser.runtime.sendMessage({"title": tab.title, "url": tab.url, "uri": imageUri});
  addData(tab,imageUri);
} 
  var capturing = browser.tabs.captureVisibleTab();
  capturing.then(onCaptured); 
  

 var creating = browser.tabs.create({
  });
  creating.then(onCreated, onError);  

 // addData(tab);
}
