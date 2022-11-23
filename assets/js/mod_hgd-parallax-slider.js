/******************************************************************************
 * filenam mod_hgd-parallax-slider.js
 *
 * Javascript-Funktionalität für den HGD Parallax Slider
 *
 * @author  Holger Genth -Dienstleistungen- (https://holger-genth.de/joomla)
 * @copyright Copyright (c) 2014 - 2017. All rights reserved.
 * @license GNU General Public License version 2 or later: http://www.gnu.org/copyleft/gpl.html
 */
(function($){

  $.fn.hgdParallaxSlider = function(options) {

    var settings = $.extend({
      stages: [],
      stage: {
        fov: 147.0
      },
      maxSizeRatio: 1.1,
      autoHeight : false

    }, options);

    var parallaxContainer = $(this);
    var stageDivs = parallaxContainer.find('.stage');

    var ww = $(window).innerWidth();
    var wh = $(window).innerHeight();

    var cw = parallaxContainer.innerWidth();
    var ch = parallaxContainer.innerHeight();

    var mouseX = 200;
    var mouseY = 200;

    var oldMouseX = 200;
    var oldMouseY = 200;

    var selfAnimationTimer = undefined;

    function moveSlide(slide) {
      var el = $(stageDivs[slide]);
      var top = (mouseY - wh) * (el.height() - ch ) / wh;
      var left = (mouseX - ww) * (el.width() - cw ) / ww;

      el.animate({
        left: (left > 0) ? 0 : left,
        top:  (top > 0) ? 0 : top
      },
      {
        'duration': ((oldMouseX == 200 && oldMouseY == 200) ? 1200 : 550),
        'easing':   'easeOutSine',
        'queue':    false
      })
    }

    function dimensions(){

      cw = parallaxContainer.innerWidth();
      if (settings.autoHeight) {
        parallaxContainer.css('height',cw / settings.stages[0].aspect);
      }
      ch = parallaxContainer.innerHeight();

      ww = $(window).innerWidth();
      wh = $(window).innerHeight();

      var sizeFactor = 1.0;
      var distance0 = cw / ( 2 * Math.sin( settings.stage.fov * Math.PI / 360) );
      var minWidth = 0;
      var minHeight = 0;

      // die darzustellende Größe laut Bildwinkel und Bilddistanz
      for (var i = 0; i < settings.stages.length; i++) {
        settings.stages[i]['css']['width'] = 2 * Math.sin(settings.stage.fov * Math.PI / 360) * (100-settings.stages[i].distance + distance0);
        settings.stages[i]['css']['height'] = settings.stages[i]['css']['width'] / settings.stages[i]['aspect'];

        if (minWidth == 0 || minWidth > settings.stages[i]['css']['width'] ) {
          minWidth = settings.stages[i]['css']['width'];
        }
        if (minHeight == 0 || minHeight > settings.stages[i]['css']['height'] ) {
          minHeight = settings.stages[i]['css']['height'];
        }
      }// for

      // die Layer-Größen auf die Leinwandgröße anpassen
      if ( (cw * settings.maxSizeRatio / minWidth) > (ch * settings.maxSizeRatio / minHeight)) {
        sizeFactor = cw * settings.maxSizeRatio / minWidth;
      } else {
        sizeFactor = ch * settings.maxSizeRatio / minHeight;
      }

      for (var i = 0; i < settings.stages.length; i++) {

        $(stageDivs[i]).css({
          'width': settings.stages[i]['css']['width'] * sizeFactor,
          'height': settings.stages[i]['css']['height'] * sizeFactor
        });
        moveSlide(i);

      } // for
    } // dimensions()

    $(document).on('mousemove',function(ev){

      mouseX = ev.pageX;
      mouseY = ev.pageY;

      if ( Math.abs(ev.pageX - oldMouseX) > 100 || Math.abs(ev.pageY - oldMouseY) > 100 || ev.automation != undefined) {

        oldMouseX = ev.pageX;
        oldMouseY = ev.pageY;

        if (ev.pageY < wh + ch) {
          for (var i = 0; i < stageDivs.length; i++) {

            moveSlide(i);

          }
        } // for
      } // if

    }); // on mousemove

    $(window).load(function(){

      dimensions();

    }) //load
    .resize(function(){

      dimensions();

    }) //resize
    /*
    setInterval(function(){

      if (mouseX == oldMouseX && mouseY == oldMouseY) {
        var ev = $.Event("mousemove");
        ev.pageX = oldMouseX + Math.round(Math.random() * 200 - 100);
        ev.pageY = oldMouseY + Math.round(Math.random() * 200 - 100);
        ev.automation = true;

        if (ev.pageX < 0)
          ev.pageX = 0
        else if(ev.pageX > ww)
          ev.pageX = ww

        if (ev.pageY < 0)
          ev.pageY = 0
        else if(ev.pageY > wh)
          ev.pageY = wh

        $(document).triggerHandler(ev);
      }
    }, 1000);
    */
    // jQuery chaining
    return this;
  }

})(jQuery);
