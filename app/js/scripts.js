
/*
===========================================================

[PAGE JS ]

    Version      :  1.0

    Author       :  Cadeniuc Ion

    My WebSite    :  www.cadeniuc.com

    Author Phone   :  068580073

    Author Email : icadeniuc16@gmail.com

===========================================================
*/

$(document).ready(function() {

  $(window).scroll(function(){
    if($(this).scrollTop()>5){
      $('.topline').addClass('sticky');
    }
    else if ($(this).scrollTop()<5){
      $('.topline').removeClass('sticky');
    }
  });

    $('.nav-toggle').on('click', function(e) {
        e.preventDefault();
        $(this).toggleClass('active');
        $('.nav').toggleClass('open');
    });

    $('.parallax_go').jarallax({
        speed: .4
    });

  //anchor
  $('.nav').on('click','a', function(event){
    event.preventDefault();
    var id = $(this).attr('href'),
    top = $(id).offset().top;
    $('.nav').removeClass('open');
    $('.nav-toggle').removeClass('active');
    $('body,html').animate({scrollTop: top -30}, 600);
  });

      // Chrome Smooth Scroll
    try {
    	$.browserSelector();
    	if($("html").hasClass("chrome")) {
    		$.smoothScroll();
    	}
    } catch(err) {};


    new WOW().init();

    function height_full() {
        $('header').css("height", $(window).height());
    }
    height_full();
    $(window).resize(function () {
        height_full();
    });

    $('.team-carousel').owlCarousel({
        items: 5,
        loop: true,
        center: true,
        margin: 30,
        dots: false,
        nav: true,
        navText: [$('.prev'),$('.next')],
        startPosition: 1,
        responsive: {
            0:{
                items:1,
            },
            640:{
                items:3,
                margin: 10,
            },
            800: {
                items:3,
                margin: 30,
            },
            1200:{
                items:5,
            },
        }
    });

    $('.case-carousel').owlCarousel({
        items: 1,
        loop: true,
        margin: 30,
        dots: true,
        nav: true,
        navText: [$('.prev_2'),$('.next_2')],
        //startPosition: 1,
    });

  $('#popup_form').popup({
    transition: 'all 0.3s',
    onclose: function() {
      $(this).find('label.error').remove();
      $('.mainForm').trigger('reset');
    }
  });

  $("#thanks").popup({
    transition: 'all 0.3s',
  });

  $('input[name=phone]').mask('+0 (000) 000-00-00');
  jQuery.validator.addMethod("phoneno", function(phone_number, element) {
       return this.optional(element) || phone_number.match(/\+[0-9]{1}\s\([0-9]{3}\)\s[0-9]{3}-[0-9]{2}-[0-9]{2}/);
    }, "Введите Ваш телефон");

  $(".mainForm").validate({
    rules: {
      phone: {
        required: true,
        phoneno: true
      },
      name: 'required',
      email: "required",
    },
    messages: {
      name: "Введите Ваше имя",
      phone: "Введите Ваш телефон",
      email: "Введите Вашу почту"
    },
    submitHandler: function(form) {
      var t = {
        name: jQuery(".mainForm").find("input[name=name]").val(),
        email: jQuery(".mainForm").find("input[name=email]").val(),
        phone: jQuery(".mainForm").find("input[name=phone]").val(),
        site: jQuery(".mainForm").find("input[name=site]").val(),
        comment: jQuery(".mainForm").find("textarea[name=comment]").val(),
        subject: jQuery(".mainForm").find("input[name=subject]").val()
      };
      //var t = $(".mainForm").serialize();
      ajaxSend('.mainForm', t);
    }
  });

  function ajaxSend(formName, data) {
    jQuery.ajax({
      type: "POST",
      url: "sendmail.php",
      data: data,
      success: function() {
        $("#popup_form").popup("hide");
        $("#thanks").popup("show");
        setTimeout(function() {
          $(formName).trigger('reset');
        }, 2000);
      }
    });
  };

});