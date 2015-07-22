$(document).ready(function(){
  var CRUD = function (){
    this.refresher;
  };

  CRUD.prototype.initialize = function(){
    this.refresher = setInterval(this.indexPosts, 2000);
  };

  CRUD.prototype.createOnePost = function(title, text, user) {
    $.ajax({
      context: this,
      type: 'POST',
      data: {
        title: title,
        text: text,
        user: user
      },
      dataType: 'JSON',
      url: 'http://ga-wdi-api.meteor.com/api/posts',
      success: function(response){
        console.log("A new post is created!");
        this.indexPosts();
      }
    });
  };

  var callbackFunction = function(response){
    $('#all-posts > tbody').text('');

    response.reverse().forEach(function (post) {
      var html = '';
      html += "<tr class='post-item'>"
      html +=   "<td>";
      html +=     post._id;
      html +=   "</td>";
      html +=   "<td>";
      html +=     post.title;
      html +=   "</td>";
      html +=   "<td>";
      html +=     post.text;
      html +=   "</td>";
      html +=   "<td>";
      html +=     post.user;
      html +=   "</td>";
      html +=   "<td><a class='btn btn-default update' data-id='"
      html +=     post._id
      html +=   "'>Update</a></td>";
      html +=   "<td><a class='btn btn-danger delete' data-id='"
      html +=     post._id
      html +=   "'>Cancel</a></td>";
      html += "</tr>"
      
      $('#all-posts > tbody').append(html);
    });
  };

  CRUD.prototype.indexPosts = function(){

    var indexRequest = {
      type: 'GET',
      url: 'http://ga-wdi-api.meteor.com/api/posts',
      success: callbackFunction
    }

    $.ajax(indexRequest);

    console.log("indexing")
  };

  CRUD.prototype.searchPosts = function(user){
    var searchRequest = {
      type: 'GET',
      url: 'http://ga-wdi-api.meteor.com/api/posts/search/' + user,
      success: callbackFunction
    }

    $.ajax(searchRequest);
    clearInterval(this.refresher);
  };

  CRUD.prototype.getOnePost = function(postId) {
    var callbackFunction = function(response){
      $('#update-form').show();
      $('#update-form > input[name="postId"]').val(response._id);
      $('#update-form > input[name="title"]').val(response.title);
      $('#update-form > input[name="text"]').val(response.text);
    }

    $.ajax({
      type: 'GET',
      dataType: 'JSON',
      url: 'http://ga-wdi-api.meteor.com/api/posts/' + postId,
      success: callbackFunction
    });
  };

  CRUD.prototype.updateOnePost = function(postId, title, text) {
    $.ajax({
      context: this,
      type: 'PUT',
      data: {
        text: text,
        title: title
      },
      dataType: 'JSON',
      url: 'http://ga-wdi-api.meteor.com/api/posts/' + postId,
      success: function(response){
        console.log(postId, "is updated!");
        this.indexPosts();
      }
    });
  };

  CRUD.prototype.deleteOnePost = function(postId) {
    $.ajax({
      context: this,
      type: 'DELETE',
      url: 'http://ga-wdi-api.meteor.com/api/posts/' + postId,
      success: function(response){
        console.log(postId, "is deleted!");
        this.indexPosts();
      }
    });
  };

  var crud = new CRUD();

  crud.initialize();

  $(document).on('click', '.update', function() {
    var postId = $(this).data('id');
    crud.getOnePost(postId);
  });

  $(document).on('click', '.delete', function() {
    var postId = $(this).data('id');
    crud.deleteOnePost(postId);
  });

  $('#create-form').submit(function(){
    event.preventDefault();

    var title = $('#create-form > input[name="title"]').val();
    var text = $('#create-form > input[name="text"]').val();
    var user = $('#create-form > input[name="user"]').val();
    $('#create-form > input[type="text"]').val('');

    crud.createOnePost(title, text, user);
  });

  $('#search-form').submit(function(){
    event.preventDefault();

    var user = $('#search-form > input[name="user"]').val();
    crud.searchPosts(user);
  });

  $('#update-form').submit(function(){
    event.preventDefault();

    var postId = $('#update-form > input[name="postId"]').val();
    var title = $('#update-form > input[name="title"]').val();
    var text = $('#update-form > input[name="text"]').val();

    crud.updateOnePost(postId, title, text);
    $('#update-form').hide();
  });
});