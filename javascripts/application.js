var Instagram = {};
Instagram.Config = {
    clientID: "13a4533b79a2473abfb72f52211058ae",
    apiBase: "https://api.instagram.com"
};

(function(){
    function init(){
        bindEventHandlers();
    }

    Instagram.App = {
      search: search,
      // showPhoto: showPhoto,
      init: init
  };
    
    function generateResource(tag){
        var config = Instagram.Config, url;
    
        if(typeof tag === 'undefined'){
          throw new Error("Resource requires a tag. Try searching for cats!");
        } else {
          // Make sure tag is a string, trim any trailing/leading whitespace and take only the first
          // word, if there are multiple.
          tag = String(tag).trim().split(" ")[0];
        }
    
        url = config.apiBase + "/v1/tags/" + tag + "/media/recent?callback=?&client_id=" + config.clientID;
    
        return function(max_id){
          var next_page;
          if(typeof max_id === 'string' && max_id.trim() !== '') {
            next_page = url + "&max_id=" + max_id;
          }
          return next_page || url;
        };
    }
  
    function paginate(max_id){
        $.getJSON(generateUrl(tag), toScreen);
    }

    function search(tag){
        resource = generateResource(tag);
        $('.paginate a').hide();
        $('#photos-wrap *').remove();
        fetchPhotos();
    }

    function fetchPhotos(max_id){
         $.getJSON(resource(max_id), toScreen);
    }

    function toScreen(photos) {
        /*
        make an empty photos container that will hold compiled html
        add newly compiled stuff to the container
        append the container to the page
        */
        var photos_html = '';
        // var photoTemplate = Handlebars.compile($("#entry-template").html());
        photoTemplate = Handlebars.templates['photo-list.tmpl'];
        $(".loading").fadeOut();
        $("#photos-wrap").append(photoTemplate(photos)).fadeIn(700);


        $('.paginate a').attr('data-max-tag-id', photos.pagination.next_max_id)
                          .fadeIn();

    }

    function bindEventHandlers(){
        $('body').on('click', '.paginate a.button', function(){
          var tagID = $(this).attr('data-max-tag-id');
          fetchPhotos(tagID);
          return false;
        });
        // Bind an event handler to the `click` event on the form's button
        $('form#search button').click(function(){
          // Extract the value of the search input text field.
          var tag = $('input.search-tag').val();

          // Invoke `search`, passing `tag`.
          search(tag);

          // Stop event propagation.
          return false;
        });
      }


})();

$(function(){
  Instagram.App.init();
  Instagram.App.search('livewhatyoulove');
});
