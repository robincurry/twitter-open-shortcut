document.addEventListener('keyup', function(e) {
    var tag = e.target.tagName.toLowerCase();
    // keycode for 'o' is 79
    // Ignore when composing tweets...
    if (tag == 'input' || tag == 'textarea' || e.keyCode != 79)
        return true;
    var hovered = $('.selected-stream-item');
    if (hovered.length != 0) {
      // find links
      var links = hovered.find('.twitter-timeline-link');
      var processed = [];

      if (links.length != 0) {
        // open each link in a background tab.
        links.each(function(i){
          if ($.inArray(this.href, processed) == -1){
            simulateClick(links[i], true);
            animateSharedLink(this);
            processed.push(this.href);
          }
          return true;
        });
      }
      else {
        // otherwise, open permalink if no other links found.
        var permalink = hovered.find('.js-permalink')[0];
        if ($.inArray(permalink.href, processed) == -1){
          simulateClick(permalink, true);
          animatePermalink(permalink);
          processed.push(permalink.href);
        }
      }
    }
}, true);

function simulateClick(el, target) {
  var evt = document.createEvent("MouseEvents");

  //on Mac, pass target as e.metaKey
  if (navigator.platform.indexOf("Mac") != -1)
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, target, 0, null);
  else //otherwise, pass target as e.ctrlKey
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, target, false, false, false, 0, null);
  return el.dispatchEvent(evt);
}

function animateSharedLink(item){
  var txt = $(item).find('.js-display-url');
  txt = txt.length > 0 ? txt[0] : item
  animateTextNode(txt);
}

function animatePermalink(item){
  var txt = $(item).find('.js-short-timestamp')[0];
  animateTextNode(txt);
}

function animateTextNode(txt){
  var p = $(txt).parent();
  p.css("position", "relative");
  $(txt).clone()
    .appendTo(p)
    .css("position", "absolute")
    .css("left", "0")
    .animate({
      fontSize: "24px",
      left: "+=50"
      },
      {
        step: function(current, fx){
          if (fx.prop == "left" && current >= 25) {
            $(fx.elem).css("color", "#222");
          }
        }
      })
    .prepend("\u21A9&nbsp;")
    .fadeOut('slow', function(){
      $(this).remove();
    });
}
