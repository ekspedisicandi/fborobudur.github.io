
  $(function(){
      //Keep track of last scroll
      var lastScroll = 0;
      var opacity = 1
      $(window).scroll(function(event){
          //Sets the current scroll position
          var st = $(this).scrollTop();
          //Determines up-or-down scrolling
          if( lastScroll <= Math.round($( window ).height() / 2) ) {
             if (st > lastScroll){
                $('.jumbotron').css({'top': ($(window).scrollTop()*1.2)+'px', 'opacity' : 1});
              } 
              else {
                $('.jumbotron').css({'top': ($(window).scrollTop()*1.2)+'px', 'opacity' : 1});
              }
          }
          //Updates scroll position
          lastScroll = st;
      });
    });


$(document).ready(function () {
    updateContainer();
    setInterval('cycleImages()', 7000);
    $(window).resize(function() {
        updateContainer();
    });
    jQuery('.scroller').addClass("appHidden").viewportChecker({
        classToAdd: 'appVisible animated fadeInUp',
        offset: 100
       });

    jQuery('.scroll-left').addClass("appHidden").viewportChecker({
        classToAdd: 'appVisible animated fadeInLeft',
        offset: 100
       });


    jQuery('.scroll-right').addClass("appHidden").viewportChecker({
        classToAdd: 'appVisible animated fadeInRight',
        offset: 100
       });
    
});

function updateContainer() {
   $('.main_bar').css({'height':$( window ).height(), 'width':$( window ).width()});
}

function cycleImages(){
      var $active = $('.overlays .active');
      var $next = ($active.next().length > 0) ? $active.next() : $('.overlays img:first');
      $next.css('z-index',2);//move the next image up the pile
      $active.fadeOut(1500,function(){//fade out the top image
    $active.css('z-index',1).show().removeClass('active');//reset the z-index and unhide the image
          $next.css('z-index',3).addClass('active');//make the next image the top one
      });

}


$('#sendSuggestion').on('submit', function() {
  /* Stop form from submitting normally */
    event.preventDefault();
    $url = $(this).attr('action');
    /* Clear result div*/

    /* Get some values from elements on the page: */
    var values = $(this).serialize();

    /* Send the data using post and put the results in a div */
    $.ajax({
        url: $url,
        type: "post",
        data: values,
        success: function(data){
            console.log(data);
            if( data.validation_failed == 1 ) {
              $('.alert.suggestion').show();
              $('.alert.suggestion').html(data.errors.suggestion);
            } else if( data.validation_failed == 2 ) {
              $('.alert').hide();
              $('.thankYouMessage').show();
              $('#sendSuggestion').hide();
            }
        },
        error:function(){
            
        }
    });
});


$('#sendMessage').on('submit', function() {
  /* Stop form from submitting normally */
    event.preventDefault();
    $url = $(this).attr('action');
    /* Clear result div*/


    /* Get some values from elements on the page: */
    var values = $(this).serialize();

    /* Send the data using post and put the results in a div */
    $.ajax({
        url: $url,
        type: "post",
        data: values,
        success: function(data){
            console.log(data);
            if( data.validation_failed == 1 ) {
              $('.alert-contact').show();
              $('.alert-contact').html(data.errors.email + '<br/>' + data.errors.name + '<br/>' + data.errors.text);
            } else if( data.validation_failed == 2 ) {
              $('.alert-contact').hide();
              $('.thankYouMessageContact').show();
              $('#sendMessage').hide();
            }
        },
        error:function(){
            
        }
    });
});




  $(window).bind('scroll', function() {
       if ($(window).scrollTop() > 80) {
          if(!$('.menu').hasClass('fixed')) {
              $('.menu').addClass('fixed');
              $('.menu .navbar-brand img').animate({height : '40px'}, 300);
            }
           
           // $('.menu_container').removeClass('container-fluid');
           // $('.menu_container').addClass('container');
           //$('.menu.fixed a.navbar-brand img').attr('src', 'assets/img/logo_sm.png');
       }
       else {
           if($('.menu').hasClass('fixed')) {
              $('.menu').removeClass('fixed');
              $('.menu .navbar-brand img').animate({height : '60px'}, 300);
            }
           //$('.menu a.navbar-brand img').attr('src', 'assets/img/logo_mid.png');
           // $('.menu_container').removeClass('container');
           // $('.menu_container').addClass('container-fluid');
       }
  });
