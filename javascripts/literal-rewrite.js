/* rewrite */

var instagramLoader = instagramLoader || {};

instagramLoader = {
  config : {
    "clientID": "13a4533b79a2473abfb72f52211058ae",
    "apiBase": "https://api.instagram.com",
    // set default search term
    "searchTerm" : "ColumbiaCollegeChicago"
  },
  init : function(config) {
    if (config && typeof(config) == 'object') {
           $.extend(instagramLoader.config, config);
       }
     instagramLoader.bindEventHandlers();
     instagramLoader.search(instagramLoader.config.searchTerm);
     instagramLoader.initialized = true;
  },
  generateResource : function(tag) {
    var config = instagramLoader.config;
    var url = config.apiBase + "/v1/tags/" + tag + "/media/recent?callback=?&client_id=" + config.clientID;
    
    return function(max_id){
      var next_page;
      if(typeof max_id === 'string' && max_id.trim() !== '') {
        next_page = url + "&max_id=" + max_id;
      }
      return next_page || url;
    };
  },
    // paginate : function(max_id) {
    //   $.getJSON(instagramLoader.generateUrl(tag), instagramLoader.toScreen);
    // },
  search : function(tag) {
    resource = instagramLoader.generateResource(tag);
    $('.paginate a').hide();
    $('#photos-wrap *').remove();
    instagramLoader.fetchPhotos();
  },
  fetchPhotos : function(max_id) {
    $.getJSON(resource(max_id), instagramLoader.toScreen);
  },
  toScreen : function(photos) {
    var photos_html = '';
    // var photoTemplate = Handlebars.compile($("#entry-template").html());
    photoTemplate = Handlebars.templates['photo-list.tmpl'];
    $(".loading").fadeOut();
    $("#photos-wrap").append(photoTemplate(photos)).fadeIn(700);


    $('.paginate a').attr('data-max-tag-id', photos.pagination.next_max_id)
                      .fadeIn();
  },
  bindEventHandlers : function() {
    $('.more').on('click', function(){
      var tagID = $(this).attr('data-max-tag-id');
      instagramLoader.fetchPhotos(tagID);
      return false;
    });
    // Bind an event handler to the `click` event on the form's button
    /* don't need this unless we use the user input search field
    $('form#search button').click(function(){
      // Extract the value of the search input text field.
      var tag = $('input.search-tag').val();

      // Invoke `search`, passing `tag`.
      search(tag);

      // Stop event propagation.
      return false;
    });*/
  }
};
$(function(){
  // customizing initial search phrase is possible here, or in config.
  instagramLoader.init(/*{"searchTerm" : "livewhatyoulove"}*/);
});