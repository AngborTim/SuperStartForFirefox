var db;
var newItem = [
      { siteTitle: "", url:"", uri:""}
    ];
var siteList = document.getElementById('site_list');
var title = document.getElementById('title');
var url = document.getElementById('url');
var add_btn = document.getElementById('add_btn');
var col_count = 6;
var row_count = 4;

var last_child = document.getElementById('site_list'); 
var ss_cells = new Array(col_count);
for (i = 0; i < col_count; i++) {
  ss_cells[i] = new Array(row_count);
  for (j = 0; j < row_count; j++) {
 //   ss_cells[i][j] = '[' + i + ', ' + j + ']';
  }
}
var ss_row = [];
var ss_sites = [];


window.onload = function() {

  console.log('App initialised.');
  window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

  window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
  window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

  var DBOpenRequest = window.indexedDB.open("superStart", 4);

  DBOpenRequest.onerror = function(event) {
    console.log('Error loading database.');
  };

  DBOpenRequest.onsuccess = function(event) {
    console.log('Database initialised.');

    db = DBOpenRequest.result;
    displayData();
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

for (var i = 0; i < row_count; i++) {
 ss_row[i] = document.createElement('div');
 ss_row[i].id = i;
 ss_row[i].className = 'ss_row';
 last_child.appendChild(ss_row[i]);
 for (var ii = 0; ii < col_count; ii++) {
	ss_cells[i][ii] = document.createElement('div');
	ss_cells[i][ii].id = i+'_'+ii;
	ss_cells[i][ii].className = 'ss_cell';
    ss_cells[i][ii].innerHTML = i+' '+ii;
    ss_cells[i][ii].addEventListener('dragover', dragOverHandler);
    ss_cells[i][ii].addEventListener('dragleave', dragLeaveHandler);
    ss_cells[i][ii].addEventListener('drop', dropHandler);	
	last_child.appendChild(ss_cells[i][ii]);
	console.log('new ss_cell '+ss_cells[i][ii].id);
 }
}

  function displayData() {
    //siteList.innerHTML = "";
    var i = 0;
    var objectStore = db.transaction('superStart').objectStore('superStart');
    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
         if(cursor) {
			
			ss_sites[i] = document.createElement('div');
			ss_sites[i].id = 'SITE'+i;
			ss_sites[i].className = 'site';
			ss_sites[i].draggable = 'true';
			ss_cells[0][1].appendChild(ss_sites[i]);
			ss_sites[i].setAttribute("style", "background: url("+cursor.value.pic+");");
			
			
			var a = document.createElement('a');
			a.className = 'site_link';
			a.setAttribute('draggable', false);
			a.setAttribute('href',cursor.value.url);
			a.setAttribute('target', '_blank');
			
			var title = document.createElement('div');
			title.className = 'site_title';
			title.innerHTML = cursor.value.siteTitle;
			
			var img = document.createElement('img');
			img.className = 'site-title-image';
			img.setAttribute('crs', cursor.value.pic);
			title.appendChild(img);
			
			var text = document.createElement('p');
			text.className = 'site-title-text';
			var name = document.createElement('span');
			name.className = 'site-title-name';
			text.appendChild(name);
			title.appendChild(text);
			a.appendChild(title);
		    ss_sites[i].appendChild(a);
						
			var deleteButton = document.createElement('button');
			ss_sites[i].appendChild(deleteButton);
			deleteButton.title = 'Delete';
			deleteButton.innerHTML = 'X';
			deleteButton.setAttribute('data-task', cursor.value.siteTitle);
			deleteButton.onclick = function(event) {
              deleteItem(event);
             }
            ss_sites[i].addEventListener('dragstart', dragStartHandler);
			ss_sites[i].addEventListener('dragend', dragStartHandler);
			 
			 
			 
/*			ss_sites[i] = document.createElement('div');
			ss_sites[i].id = 'SITE'+i;
			ss_sites[i].className = 'ss_site';
			ss_sites[i].draggable = 'true';
			ss_sites[i].innerHTML = "<a href='"+cursor.value.url+"' target='_blank'>"+'<img class = "site_tmb" src="'+cursor.value.pic+'" height="100" width="200">'+'</a>';
			
			last_child.appendChild(ss_sites[i]);
			ss_sites[i].addEventListener('dragstart', dragStartHandler);
			ss_sites[i].addEventListener('dragend', dragStartHandler);
			
			var linkSite = document.createElement('p');
			linkSite.innerHTML = "<a href='"+cursor.value.url+"' target='_blank'>"+cursor.value.siteTitle+'</a>';
			ss_sites[i].appendChild(linkSite);
			
			var deleteButton = document.createElement('button');
			ss_sites[i].appendChild(deleteButton);
			deleteButton.title = 'Delete';
			deleteButton.innerHTML = 'X';
			deleteButton.setAttribute('data-task', cursor.value.siteTitle);
			deleteButton.onclick = function(event) {
              deleteItem(event);
             }
*/          
			i++;
/*			var listItem = document.createElement('div');
			listItem.id = "siteBlock";
			listItem.innerHTML = '<img src="'+cursor.value.pic+'" height="100" width="200">';
			siteList.appendChild(listItem);
          
			var linkSite = document.createElement('p');
			linkSite.innerHTML = "<a href='"+cursor.value.url+"' target='_blank'>"+cursor.value.siteTitle+'</a>';
			listItem.appendChild(linkSite);
          
			var deleteButton = document.createElement('button');
			listItem.appendChild(deleteButton);
			deleteButton.innerHTML = 'X';
			deleteButton.setAttribute('data-task', cursor.value.siteTitle);
			deleteButton.onclick = function(event) {
            deleteItem(event);
          }*/
           cursor.continue();
        } else {
          console.log('Entries all displayed.');
        }
      }
    }

 function deleteItem(event) {
    var dataTask = event.target.getAttribute('data-task');
    var transaction = db.transaction(["superStart"], "readwrite");
    var request = transaction.objectStore("superStart").delete(dataTask);

    transaction.oncomplete = function() {
      event.target.parentNode.parentNode.removeChild(event.target.parentNode);
      console.log('Task \"' + dataTask + '\" deleted.');
    };
  };
  // прием события из background js
/*browser.runtime.onMessage.addListener(notify);

function notify(message) {
var listItem = document.createElement('div');
          listItem.id = "URI";
          listItem.innerHTML = "<img src='"+message.uri+"'>";
          siteList.appendChild(listItem); 
}*/



function dragStartHandler (event) {
	 
event.dataTransfer.clearData();
event.dataTransfer.setData('text/plain', event.target.id);	 
	 
console.log('dragStartHandler '+event.target.id);
 }
 
  function dragEndHandler (event) {
 console.log('dragEndHandler');
  }
  
  
  function dragOverHandler (event) {
   event.preventDefault();
   console.log('dragOverHandler');
  }
  
  function dragLeaveHandler (event) {
	event.preventDefault();
    console.log('dragLeaveHandler');
  }

  function dropHandler (event) {
   event.preventDefault();
   var _ss_site = event.dataTransfer.getData('text/plain');
   var element = document.getElementById(_ss_site);
   event.target.appendChild(element);
   console.log('Drop done! '+event.target.id);
 }

}


const log = false;

const showCustomPage = ({ customNewTabUrl, customNewTabTitle }) => {
	log && console.debug( '[showCustomPage] init', { customNewTabUrl, customNewTabTitle } );

	if ( customNewTabTitle ) {
		document.title = customNewTabTitle;
	}
	if ( !customNewTabUrl || customNewTabUrl.length === 0 ) {
		log && console.debug( '[showCustomPage] no tab url set' );
		return;
	}
	document.documentElement.classList.add( 'cntp-has-loaded' );
	const iframe = document.getElementById( 'cntp-iframe' );
	iframe.src = customNewTabUrl;

};

const init = _ => {
	browser.storage.sync.get([ 'customNewTabUrl', 'customNewTabTitle' ])
		.then( showCustomPage );
};

init();
