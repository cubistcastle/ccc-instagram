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
  search : function(tag) {
    resource = instagramLoader.generateResource(tag);
    instagramLoader.fetchPhotos();
  },
  fetchPhotos : function(max_id) {
    $.getJSON(resource(max_id), instagramLoader.toScreen);
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
  toScreen : function(photos) {
    var photos_html = '';
    // var photoTemplate = Handlebars.compile($("#entry-template").html());
    var photoTemplate = Handlebars.templates['photo-list.tmpl'];
    $(".loading").fadeOut();
    $("#photos-wrap").append(photoTemplate(photos));

    $('.paginate a').attr('data-max-tag-id', photos.pagination.next_max_id)
                      .fadeIn();
  },
  bindEventHandlers : function() {
    $('.more').on('click', function(){
      var tagID = $(this).attr('data-max-tag-id');
      instagramLoader.fetchPhotos(tagID);
      return false;
    });
  }
};

$(function(){
  instagramLoader.init({"searchTerm" : "livewhatyoulove"});
});