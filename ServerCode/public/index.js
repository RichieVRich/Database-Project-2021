var allPosts = [];

function insertNewPost(name, main, time, amount, type) {

    var postTemplateElements = {
    name: name,
    main: main,
    time: time,
    amount: amount,
    type: type
  };
  var newHTMLpost = Handlebars.templates.post(postTemplateElements);
  var postSection = document.getElementById('posts');
  postSection.insertAdjacentHTML('beforeend', newHTMLpost);
  closemodal1();
};

function handleModalAcceptClick() {

  var name = document.getElementById('post-name-input').value.trim();
  console.log(name);
  var main = document.getElementById('post-main-input').value.trim();
  console.log(main);
  var time = document.getElementById('post-time-input').value.trim();
  console.log(time);
  var amount = document.getElementById('post-amount-input').value.trim();
  console.log(amount);
  var type = document.querySelector('#post-type-fieldset input:checked').value;

  if (!name || !main || !time || !amount || !type) {
    alert("You left a field blank");
  } else {

    allPosts.push({
      name: name,
      main: main,
      time: time,
      amount: amount,
      type: type
    });

    clearFiltersAndReinsertPosts();

    closemodal1();

  }

}

function clearFiltersAndReinsertPosts() {

  document.getElementById('filter-text').value = "";
  document.getElementById('filter-time').value = "";

  var filterTypeCheckedInputs = document.querySelectorAll("#filter-type input");
  for (var i = 0; i < filterTypeCheckedInputs.length; i++) {
    filterTypeCheckedInputs[i].checked = false;
  }

  doFilterUpdate();

}

function doFilterUpdate() {

  //Take values from filter box
  var filters = {
    text: document.getElementById('filter-text').value,
    time: document.getElementById('filter-time').value,
    type: []
  }

  var filterTypeCheckedInputs = document.querySelectorAll("#filter-type input:checked");
  for (var i = 0; i < filterTypeCheckedInputs.length; i++) {
    filters.type.push(filterTypeCheckedInputs[i].value);
  }

  //Remove all the post
  var postContainer = document.getElementById('posts');
  while(postContainer.lastChild) {
    postContainer.removeChild(postContainer.lastChild);
  }

  //Loop each post and insert back
  allPosts.forEach(function (post) {
    if (postPassesFilters(post, filters)) {
      insertNewPost(post.name, post.main, post.time, post.amount, post.type);
    }
  });
}

//Reveal Post Modal
var postButton = document.querySelector("#post-button");
postButton.addEventListener("click",function(){
  document.getElementById("post-modal1").classList.remove("hidden1");
  document.getElementById("modal-backdrop1").classList.remove("hidden1");
  var option = document.getElementsByName("post-type");
  for (var i = 0; i < option.length; i++){
    if(option[i].checked == true)
      option[i].checked = false;

      closemodal1();
  }
});

//Reset Value
function closemodal1() {
  document.getElementById("post-name-input").value = "";
  document.getElementById("post-main-input").value = "";
  document.getElementById("post-time-input").value = "";
  document.getElementById("post-amount-input").value = "";
  document.getElementById("post-modal1").classList.add("hidden1");
  document.getElementById("modal-backdrop1").classList.add("hidden1");
}

//Filterpass check
function postPassesFilters(post, filters) {

  if (filters.text) {
    var postDescription = post.description;
    var filterText = filters.text.toLowerCase();
    if (postDescription.indexOf(filterText) === -1) {
      return false;
    }
  }

  if (filters.time) {
    var filterTime = Number(filters.time);
    if (Number(post.time) < filterTime) {
      return false;
    }
  }

  if (filters.type && filters.type.length > 0) {
    if (filters.type.indexOf(post.type) === -1) {
      return false;
    }
  }

  return true;

}

function hidePostSomethingModal() {

  var showSomethingModal = document.getElementById('post-modal1');
  var modalBackdrop = document.getElementById('modal-backdrop1');

  showSomethingModal.classList.add('hidden');
  modalBackdrop.classList.add('hidden');

  clearPostSomethingModalInputs();

}

function clearPostSomethingModalInputs() {

  var postTextInputElements = [
    document.getElementById('post-name-input'),
    document.getElementById('post-main-input'),
    document.getElementById('post-time-input'),
    document.getElementById('post-amount-input')
  ];

  /*
   * Clear any text entered in the text inputs.
   */
  postTextInputElements.forEach(function (inputElem) {
    inputElem.value = '';
  });

  /*
   * Grab the originally checked radio button and make sure it's checked.
   */
  var checkedPostConditionButton = document.querySelector('#post-type-fieldset input[checked]');
  checkedPostConditionButton.checked = true;

}

function parsePostElem(postElem) {

  var post = {
    name: postElem.getAttribute('data-Name'),
    main: postElem.getAttribute('data-main'),
    time: postElem.getAttribute('data-time'),
    amount: postElem.getAttribute('data-amount'),
    type: postElem.getAttribute('data-type')
  };

  return post;

}

var deleteButton = document.querySelector("#delete-button");
postButton.addEventListener("click",function(){
  document.getElementById("post-modal2").classList.remove("hidden2");
  document.getElementById("modal-backdrop2").classList.remove("hidden2");
  var option = document.getElementsByName("delete-type");
  for (var i = 0; i < option.length; i++){
    if(option[i].checked == true)
      option[i].checked = false;

      closemodal1();
  }
});



//*****************************************************************************************
function insertNewFilterPost(name, main, time, amount, type) {

  var postTemplateElements = {
    name: name,
    main: main,
    time: time,
    amount: amount,
    type: type
  };
var newHTMLpost = Handlebars.templates.post(postTemplateElements);
var postSection = document.getElementById('posts');
postSection.insertAdjacentHTML('beforeend', newHTMLpost);
closemodal();
};

function clearFiltersPosts() {

  document.getElementById('filter-text').value = "";
  document.getElementById('filter-time').value = "";

  var filterTypeCheckedInputs = document.querySelectorAll("#filter-type input");
  for (var i = 0; i < filterTypeCheckedInputs.length; i++) {
    filterTypeCheckedInputs[i].checked = false;
  }

  doFilterUpdateInsert();

}

function filterPostPass(filterPost, filters) {

  if (filters.name) {
    var postText = filterPost.name.toLowerCase();
    var filterText = filters.name.toLowerCase();
    if (postText.indexOf(filterText) === -1) {
      return false;
    }
  }

  if (filters.time) {
    var postTime = filterPost.time.toLowerCase();
    var filterTime = filters.time.toLowerCase();
    if (postTime.indexOf(filterTime) === -1) {
      return false;
    }
  }

  if (filters.type && filters.type.length > 0) {
    if (filters.type.indexOf(filterPost.type) === -1) {
      return false;
    }
  }

  return true;

}

function doFilterUpdateInsert() {

    //Take values from filter box
    var filters = {
        name: document.getElementById('filter-text').value.trim(),
        time: document.getElementById('filter-time').value.trim(),
        type: []
    }

    var filterTypeCheckedInputs = document.querySelectorAll("#filter-type-fieldset input:checked");
    for (var i = 0; i < filterTypeCheckedInputs.length; i++) {
        filters.type.push(filterTypeCheckedInputs[i].value);
    }

    //Remove all the post
    var postContainer = document.getElementById('posts');
    while(postContainer.lastChild) {
        postContainer.removeChild(postContainer.lastChild);
    }

    //Loop each post and insert back
    allPosts.forEach(function (filterPost) {
        if (filterPostPass(filterPost, filters)) {
          insertNewFilterPost(filterPost.name, filterPost.main, filterPost.time, filterPost.amount, filterPost.type);
        }
    });
}

function closemodal() {
    document.getElementById("filter-text").value = "";
    document.getElementById("filter-time").value = "";
    document.getElementById("filter-modal").classList.add("hidden");
    document.getElementById("modal-backdrop").classList.add("hidden");
    clearFiltersPosts();
}



//Clear Hidden
var postButton = document.querySelector("#filter-button");
postButton.addEventListener("click",function(){
document.getElementById("filter-modal").classList.remove("hidden");
document.getElementById("modal-backdrop").classList.remove("hidden");
var option = document.getElementsByName("filter-type");
for (var i = 0; i < option.length; i++){
  if(option[i].checked == true)
    option[i].checked = false;
}
});

//Reset Value
function closemodal() {
document.getElementById("filter-text").value = "";
document.getElementById("filter-time").value = "";
document.getElementById("filter-modal").classList.add("hidden");
document.getElementById("modal-backdrop").classList.add("hidden");
}

//Close Modal
var cancelButton = document.querySelector("#modal-cancel");
cancelButton.addEventListener("click", closemodal);

window.addEventListener('DOMContentLoaded', function () {

  var postElems = document.getElementsByClassName('post');
  for (var i = 0; i < postElems.length; i++) {
    allPosts.push(parsePostElem(postElems[i]));
  }

  var postSomething = document.getElementById('post-button');
  if (postSomething) {
    postSomething.addEventListener('click', postSomething);
  }

  var modalAcceptButton = document.getElementById('modal-accept1');
  if (modalAcceptButton) {
    modalAcceptButton.addEventListener('click', handleModalAcceptClick);
  }

  var modalHideButtons = document.getElementsByClassName('modal-hide-button');
  for (var i = 0; i < modalHideButtons.length; i++) {
    modalHideButtons[i].addEventListener('click', hidePostSomethingModal);
  }

  var acceptButton = document.querySelector("#modal-accept");
  if (acceptButton) {
    acceptButton.addEventListener('click', doFilterUpdateInsert);
  }
});
