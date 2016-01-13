var $ = require('jquery');
var link = require('link');
var Date_pretty = require('mod_Date_pretty');


var news_qty = '';
var news_qty_last = '';
var timeframe = '';




$( document ).ready(function() {

    // include CSS
    $('head').prepend('<link rel="stylesheet" type="text/css" href="dist/bandsintown.css">');

    var template =
            '<div class="bandsintown">' +
            '   <div class="heading_container column_wrapper">' +
            '       <h5 class="heading date column">Date</h5>' +
            '       <h5 class="heading city column">City</h5>' +
            '       <h5 class="heading venue column">Venue</h5>' +
            '       <h5 class="heading description column">Description</h5>' +
            '       <h5 class="heading tickets column">Tickets</h5>' +
            '   </div>' +
            '</div>'
        ;

    $(bit_setup_past.destination).append(template);




    // Timeframe setup
    if(bit_setup_past.timeframe == 'past') {

        // get yesterday's date
        Date.prototype.yyyymmdd = function() {
            var yyyy = this.getFullYear().toString();
            var mm = (this.getMonth()+1).toString();
            var dd  = (this.getDate()-1).toString();
            return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
        };

        d = new Date();
        var yesterdays_date = d.yyyymmdd();
        timeframe = '2015-01-01,' + yesterdays_date;

    } else {
        timeframe = 'upcoming';
    }







    $.ajax({
        url: 'http://api.bandsintown.com/artists/' + bit_setup_past.artist_name + '/events.json?api_version=2.0&app_id=wmc&date=' + timeframe,
        jsonp: "callback",
        dataType: "jsonp",

        success: function (bit) {

            if(timeframe == 'upcoming') {
                bandsintown_loop(bit);
            } else {
                bandsintown_loop(bit.reverse());
            }
        }
    });
});



// Build Loop
function bandsintown_loop(bit) {
    var i = 0;
    var html = '';

    $(bit).each(function () {

        //Date

        var date_split = bit[i].datetime.split('T');
        var Date_ugly = date_split[0].split(' ');
        var Date_string = JSON.stringify(Date_ugly[0]);

        var Date_noquotes_prep = Date_string.split('"');
        var Date_noquotes = Date_noquotes_prep[1];
        var pretty_date = Date_pretty(Date_noquotes);


        //Tickets
        var ticket_html = '';
        if(bit[i].ticket_status != 'unavailable') {
            ticket_html =  '<div class="ticket_link link c1" data-link_blank="' + bit[i].ticket_url + '"></div>';
        }



        // Row link on mobile
        var link_class = '';
        if($(window).width() < 768) {
            if(bit[i].ticket_url != null){
                link_class = ' link';
            }
        }

        //Description
        var description = '&nbsp;';
        if(bit[i].description != '') {
            if(bit[i].description != null) {
                description = bit[i].description;
            }
        }

        //Display
        var display_class = '';
        if(i > bit_setup_past.display) {
            display_class = ' hide';
        }


        html +=
            '<div class="event column_wrapper' + display_class + link_class + '" data-link_blank="' + bit[i].ticket_url + '">' +
            '   <div class="date column p">' + pretty_date + '</div>' +
            '   <div class="city column p">' + bit[i].formatted_location + '</div>' +
            '   <div class="venue column p">' +  bit[i].venue.name + '</div>' +
            '   <div class="description column p">' +  description + '</div>' +
            '   <div class="tickets column p">' + ticket_html + '</div>' +
            '</div>'
        ;
        ++i;
    });

    $(bit_setup_past.destination).find('.bandsintown').append(html);
    more_button();
}


// Show More Button
function more_button() {
    var hide_count = $('.bandsintown .hide').length;
    if(hide_count > 0){
        $(bit_setup_past.destination).find('.bandsintown').append('<div class="more button">view more</div>');
    }
}



// More button click
$(document).on('click', '.bandsintown .more', function() {

    if(bit_setup.view_more != null) {
        window.open(bit_setup_past.view_more, '_self');
    } else {
        $(bit_setup_past.destination).find('.bandsintown .event').removeClass('hide');
        $(bit_setup_past.destination).find('.bandsintown .more').remove();
    }


});