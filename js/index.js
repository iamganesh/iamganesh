$(function() {
  var isMobile;
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    isMobile = true;

    // Mobile height fix
    $('.height-fix').each(function() {
      var h = $(this).height();
      $(this).height(h);
    });
  }

  // RESIZE RESETS
  $(window).resize(function() {
    posFilterBar($('.filter').first());
  });

  // Sticky Nav on Mobile
  if (isMobile) {
    $('nav').addClass('fixed');
  } else {
    $('nav').addClass('desk');
  }

  // NAV POSITION
  var navPos = $('nav').position().top;
  var lastPos = 0;
  var lockTimer;

  $(window).on('scroll', function() {
    var pos = $(window).scrollTop();
    var pos2 = pos + 50;
    var scrollBottom = pos + $(window).height();

    if (!isMobile) {
      if (pos >= navPos + $('nav').height() && lastPos < pos) {
        $('nav').addClass('fixed');
      }
      if (pos < navPos && lastPos > pos) {
        $('nav').removeClass('fixed');
      }
      lastPos = pos;
    }

    // Link Highlighting
    if (pos2 > $('#home').offset().top) {
      highlightLink('home');
    }
    if (pos2 > $('#about').offset().top) {
      highlightLink('about');
    }
    if (pos2 > $('#projects').offset().top) {
      highlightLink('projects');
    }
    // if (pos2 > $('#blog').offset().top) {
    //   highlightLink('blog');
    // }
    if (
      pos2 > $('#contact').offset().top ||
      pos + $(window).height() === $(document).height()
    ) {
      highlightLink('contact');
    }

    // Prevent Hover on Scroll
    clearTimeout(lockTimer);
    if (!$('body').hasClass('disable-hover')) {
      $('body').addClass('disable-hover');
    }

    lockTimer = setTimeout(function() {
      $('body').removeClass('disable-hover');
    }, 500);
  });

  function highlightLink(anchor) {
    $('nav .active').removeClass('active');
    $('nav')
      .find('[dest="' + anchor + '"]')
      .addClass('active');
  }

  // EVENT HANDLERS
  $('.page-link').click(function() {
    var anchor = $(this).attr('dest');
    $('.link-wrap').removeClass('visible');

    $('nav span').removeClass('active');
    $('nav')
      .find('[dest="' + anchor + '"]')
      .addClass('active');

    $('html, body').animate(
      {
        scrollTop: $('#' + anchor).offset().top
      },
      400
    );
  });

  $('.mdi-menu').click(function() {
    $('.link-wrap').toggleClass('visible');
  });

  $('.blog-wrap').hover(
    function() {
      $('.blog-wrap')
        .not(this)
        .addClass('fade');
      $(this).addClass('hover');
    },
    function() {
      $(this).removeClass('hover');
      $('.blog-wrap').removeClass('fade');
    }
  );

  posFilterBar($('.filter').first());

  $('.filter').click(function() {
    posFilterBar(this);
  });

  function posFilterBar(elem) {
    var origin = $(elem)
      .parent()
      .offset().left;
    var pos = $(elem).offset().left;
    $('.float-bar').css({
      left: pos - origin,
      width: $(elem).innerWidth()
    });
    $('.float-bar .row').css('left', (pos - origin) * -1);
  }

  // GALLERY
  $('#gallery').mixItUp({});

  function mixClear() {
    setTimeout(function() {
      $('#gallery').removeClass('waypoint');
    }, 2000);
  }

  // SCROLL ANIMATIONS
  function onScrollInit(items, elemTrigger) {
    var offset = $(window).height() / 1.6;
    items.each(function() {
      var elem = $(this),
        animationClass = elem.attr('data-animation'),
        animationDelay = elem.attr('data-delay');

      elem.css({
        '-webkit-animation-delay': animationDelay,
        '-moz-animation-delay': animationDelay,
        'animation-delay': animationDelay
      });

      var trigger = elemTrigger ? trigger : elem;

      trigger.waypoint(
        function() {
          elem.addClass('animated').addClass(animationClass);
          if (elem.get(0).id === 'gallery') mixClear(); //OPTIONAL
        },
        {
          triggerOnce: true,
          offset: offset
        }
      );
    });
  }

  setTimeout(function() {
    onScrollInit($('.waypoint'));
  }, 10);

  // CONTACT FORM
  $('#contact-form').submit(function(e) {
    e.preventDefault();

    // fetch("https://thunder-mailer.herokuapp.com/api/sendmail",{
    //   method : 'post',
    //   headers : {
    //       Accept: 'application/json',
    //       'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //       sendername : $("#us_name").val(),
    //       to : "kganeshkumar996@gmail.com",
    //       cc : "vacuumcorporation19@gmail.com",
    //       subject : "My Site : User Contact",
    //       html : `<p>Hi Ganesh Kumar,</p>
    //               <p><br/></p>
    //               <p>${$("#us_message").val()}</p>
    //               <p><span style="font-size: 11px; color: rgb(209, 72, 65);">This mail is system generated mail, don&apos;t reply to this mail.</span></p>
    //               <p><br/></p>
    //               <p>Regards,</p>
    //               <p>${$("#us_name").val()}</p>
    //               <p>${$("#us_mail").val()}</p>`
    //   })
    // }).then(response => response.json()).then((val) => {
    //   $('#success').addClass('expand');
    //   $('#contact-form')
    //     .find('input[type=text], input[type=email], textarea')
    //     .val('');
    // }).catch(err =>{
    //     console.log(err)
    // });

    $.ajax({
      url: 'https://thunder-mailer.herokuapp.com/api/sendmail', //'https://formspree.io/f/meqpneag',
      method: 'POST',
      contentType: 'application/json',
      headers: {'Access-Control-Allow-Origin': '*'},
      data: JSON.stringify({
        sendername : $("#us_name").val(),
        to : "kganeshkumar996@gmail.com",
        cc : "vacuumcorporation19@gmail.com",
        subject : "My Site : User Contact",
        html : `<p>Hi Ganesh Kumar,</p>
                <p><br/></p>
                <p>${$("#us_message").val()}</p>
                <p><span style="font-size: 11px; color: rgb(209, 72, 65);">This mail is system generated mail, don&apos;t reply to this mail.</span></p>
                <p><br/></p>
                <p>Regards,</p>
                <p>${$("#us_name").val()}</p>
                <p>${$("#us_mail").val()}</p>`
      })
    }).done(function(response) {
      $('#success').addClass('expand');
      $('#contact-form')
        .find('input[type=text], input[type=email], textarea')
        .val('');
    }).fail((error)=>{
      console.log(error);
      $('#success').addClass('expand');
      $('#contact-form')
        .find('input[type=text], input[type=email], textarea')
        .val('');
    });
  });

  $('#close').click(function() {
    $('#success').removeClass('expand');
  });
});
