function loadData() {

 
    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
 
    // clear out old data before new request

    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;
 
    $greeting.text('So, you want to live at ' + address + '?');

    var streetViewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class="bgimg" src="'+streetViewUrl+'">');

    // NYTimes AJAX request
    $.getJSON("https://api.nytimes.com/svc/search/v2/articlesearch.json",
              {'api-key':'4b83002048e84940819ec4761ce6ec80',
               'q':'white house'},
              function (data){
                  $nytHeaderElem.text('New York Times Articls About'+ cityStr);

                  var items = [];
                  $.each(data.response.docs , function( key, val ) {
                    $nytElem.append('<li class="article">'+
                    '<a href="'+val.web_url+'">'+val.headline.main+'</a>'+
                    '<p>'+val.snippet+'</p></li>');

                  });

    }).error(function() {
         $nytHeaderElem.text('New York Times Articles Could not Be Loaded');
    });



    // Wikipedia AjAX request
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
        }, 8000);


    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        //jsonp: "callbacl",
        success: function ( response ) {
            var articleList = response[1];

            $.each(articleList, function(key, val) {
              var url = 'http://en.wikipedia.org/wiki/'+val;
              $wikiElem.append('<li><a href="' + url + '">' + val + '</a></li>');
            });

            clearTimeout(wikiRequestTimeout)

        }
    });




    return false;
};

$('#form-container').submit(loadData);