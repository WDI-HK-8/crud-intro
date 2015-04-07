$(document).ready(function(){

  // we are trying create a post everytime i refresh the page

  // POST request. This is not a function
  var postRequest = {
    type: 'POST',
    data: {
      title: "Harry",
      text: "Fer",
      user: "Harry Chen"
    },
    dataType: 'JSON',
    url: 'http://ga-wdi-api.meteor.com/api/posts',
    success: function(response){
      console.log(response);
      listAllPost();
    }
  }

  // when clicked
  $('#new-post').click(function(){
    // make the request
    $.ajax(postRequest);
  });

  var listRequest = {
    type: 'GET',
    dataType: 'JSON',
    url: 'http://ga-wdi-api.meteor.com/api/posts',
    success: function(response){
      console.log(response);
      $('#all-posts > tbody').text(''); // wipe out the old list

      // for loop adds the new list
      // <tr>
      //   <td>
      //     Harry
      //   </td>
      // </tr>
      response.forEach(function (post) {
        $('#all-posts > tbody').append("<tr class='post-item'>" + "<td>" + post._id + "</td>" + "<td>" + post.title + "</td>" + "<td>" + post.text + "</td>" + "<td>" + post.user + "</td>" + "</tr>");
      });
    }
  }

  function listAllPost() {
    $.ajax(listRequest);
  }

  // listAllPost();
  setInterval(listAllPost, 2000);

  function getOnePost(postId) {
    $.ajax({
      type: 'GET',
      dataType: 'JSON',
      url: 'http://ga-wdi-api.meteor.com/api/posts/' + postId,
      success: function(response){
        console.log(response);

        $('#update-form').show();
        $('#update-form > input[name="postId"]').val(response._id);
        $('#update-form > input[name="title"]').val(response.title);
        $('#update-form > input[name="text"]').val(response.text);
      }
    });
  }

  $(document).on('click', '.post-item', function() {
    var postId = $(this).children().first().text();
    getOnePost(postId);
  });

  function  updateOnePost(postId, title, text) {
    $.ajax({
      type: 'PUT',
      data: {
        text: text,
        title: title
      },
      dataType: 'JSON',
      url: 'http://ga-wdi-api.meteor.com/api/posts/' + postId,
      success: function(response){
        console.log(response);
      }
    });
  }

  $('#update-form').submit(function(){
    event.preventDefault();

    var postId = $('#update-form > input[name="postId"]').val();
    var title = $('#update-form > input[name="title"]').val();
    var text = $('#update-form > input[name="text"]').val();
    updateOnePost(postId, title, text);

    $('#update-form').hide();
  });
});