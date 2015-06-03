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
    mapLeft, mapTop, varianceW, varianceH;

function getNewLocation(oldLoc, keyCode1, keyCode2) {
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

function interact () {
  var places = $('.place');
  var charOffset = character.offset();
  var offsetX = (charOffset.left + character.width()) - 10;
  var offsetY = (charOffset.top + character.height()) - 10;

  places.each(function () {
    var offset = $(this).offset();
    if (offsetX >= offset.left && charOffset.left <= offset.left + 90 && offsetY >= offset.top && (charOffset.top + (character.height() / 2)) <= offset.top + 90) {
      console.log('Going to '+$(this).attr('id'));
    }
  });
}

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
    interact();
  }
});

$(window).keyup(function (e) {
  keysPressed[e.which] = false;
  fired = false;
});

setInterval(function () {
    character.css({
        left: function (index, oldLoc) {
          return getNewLocation(oldLoc, 37, 39);
        },
        top: function (index, oldLoc) {
          return getNewLocation(oldLoc, 38, 40);
        }
    });

}, 20);