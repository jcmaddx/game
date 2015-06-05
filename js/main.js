'use strict';
var map = $('.map'),
    character = $('.character'),
    windowHeight = $(window).height(),
    windowWidth = $(window).width(),
    maxX = (windowWidth - 20) - character.width(),
    maxY = (windowHeight - 20) - character.height(),
    keysPressed = {},
    distanceToMove = 5,
    fired = false,
    actor;

function getCharLocation(oldLoc, keyCode1, keyCode2) {
    var temp;
    var newLoc = parseInt(oldLoc, 10)
                  - (keysPressed[keyCode1] ? distanceToMove : 0)
                  + (keysPressed[keyCode2] ? distanceToMove : 0);

    if (newLoc < 20) {
      moveMap((keysPressed[keyCode1] ? keyCode1 : keyCode2));
      temp = 20;
    } else {
      temp = newLoc;
    }

    if (keyCode1 === 38) {
      if (temp > maxY) {
        moveMap((keysPressed[keyCode1] ? keyCode1 : keyCode2));
        return maxY;
      } else {
        return temp;
      }
    } else {
      if (temp > maxX) {
        moveMap((keysPressed[keyCode1] ? keyCode1 : keyCode2));
        return maxX;
      } else {
        return temp;
      }
    }
}

function getCurrentActor() {
  $('.stage').each(function() {
    var $this = $(this);
    if($this.css('display') === 'block') {
          console.log($this);
      return $this.attr('class');
    }
  });
};

function getActorLocation(oldLoc, keyCode1, keyCode2) {
    var newLoc = parseInt(oldLoc, 10)
                  - (keysPressed[keyCode1] ? distanceToMove : 0)
                  + (keysPressed[keyCode2] ? distanceToMove : 0);

    return (newLoc < 20) ? 20 : (newLoc > maxX) ? maxX : newLoc;
}

function moveMap(keyCode) {
  var mapCoords = {
    'top' : Math.abs(map.offset().top),
    'left': Math.abs(map.offset().left)
  };
  var variance = (keyCode === 38 || keyCode === 40) ? (map.height() - mapCoords.top) - windowHeight : (map.width() - mapCoords.left) - windowWidth;
  var attr = (keyCode === 38 || keyCode === 40) ? 'top' : 'left';

  var calc = function(attr) {
    if (variance >= 0) {
      switch (keyCode) {
        case 37:
        case 38:
          return (mapCoords[attr] !== 0 && mapCoords[attr] >= 5) ? map.offset()[attr] + 5 : map.offset()[attr];
          break;
        case 39:
        case 40:
          return (variance >= 5) ? map.offset()[attr] - 5 : map.offset()[attr];
          break;
      }
    }
  };
  map.css(attr, calc(attr));
}

function mapInteract () {
  var places = $('.place');
  var charOffset = character.offset();
  var offsetX = (charOffset.left + character.width()) - 10;
  var offsetY = (charOffset.top + character.height()) - 10;

  places.each(function () {
    var offset = $(this).offset();
    if (offsetX >= offset.left && charOffset.left <= offset.left + 90 && offsetY >= offset.top && (charOffset.top + (character.height() / 2)) <= offset.top + 90) {
      transition($(this).attr('id'));
    }
  });
}

function transition (stage) {
  if (stage) {
    actor = $('.'+stage).children('.actor');
    $('.stage').hide();
    $('.'+stage).show();
    $('.theater').show();
    $('.world').removeClass('outside').addClass('inside');
  } else {
    $('.stage').hide();
    $('.theater').hide();
    $('.world').removeClass('inside').addClass('outside');
  }
};

$(window).resize(function () {
  windowHeight = $(window).height();
  windowWidth = $(window).width();
  maxX = (windowWidth - 20) - character.width();
  maxY = (windowHeight - 20) - character.height();
  ((map.width() + map.offset().left) < windowWidth) ? map.css('left', (windowWidth - (map.width() - Math.abs(map.offset().left))) + map.offset().left) : false ;
  ((map.height() + map.offset().top) < windowHeight) ? map.css('top', (windowHeight - (map.height() - Math.abs(map.offset().top))) + map.offset().top) : false ;
});

$(window).keydown(function (e) {
  keysPressed[e.which] = true;
  if( e.which === 32 && !fired){
    fired = true;
    mapInteract();
  }
  (e.which === 27) ? transition() : false;
});

$(window).keyup(function (e) {
  keysPressed[e.which] = false;
  fired = false;
});

setInterval(function () {
  if($('.world').hasClass('outside')) {
    character.css({
      left: function (index, oldLoc) {
        return getCharLocation(oldLoc, 37, 39);
      },
      top: function (index, oldLoc) {
        return getCharLocation(oldLoc, 38, 40);
      }
    });
  } else {
    actor.css({
      left: function (index, oldLoc) {
        return getActorLocation(oldLoc, 37, 39);
      }
    });
  }

}, 20);