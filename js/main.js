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
  mapLeft = Math.abs(map.offset().left);
  mapTop = Math.abs(map.offset().top);
  varianceW = (map.width() - mapLeft) - windowWidth;
  varianceH = (map.height() - mapTop) - windowHeight;

  if (keyCode === 38 || keyCode === 40 ) {
    if(varianceH >= 0){
      if(keyCode === 38) {
        if(mapTop !== 0 && mapTop >= 5){
          //move map down
          map.css('top', map.offset().top + 5);
        }
      } else {
        if(varianceH >= 5) {
          //move map up
          map.css('top', map.offset().top - 5);
        }
      }
    }
  } else {
    if(varianceW >= 0) {
      if(keyCode === 37) {
        if(mapLeft !== 0 && mapLeft >= 5) {
          //move map right
          map.css('left', map.offset().left + 5);
        }
      } else {
        if(varianceW >= 5) {
          //move map left
          map.css('left', map.offset().left - 5);
        }
      }
    }
  }
}

function interact () {
  var places = $('.place');
  var charOffset = character.offset();
  var offsetX = (charOffset.left + character.width()) - 10;
  var offsetY = (charOffset.top + character.height()) - 10;

  places.each(function () {
    var offset = $(this).offset();
    if (offsetX >= offset.left && charOffset.left <= offset.left + 90 && offsetY >= offset.top && (charOffset.top + (character.height() / 2)) <= offset.top + 90) {
      console.log($(this).attr('id'));
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

    if (keysPressed[32] && !fired) {
      fired = true;
      interact();
    }

}, 20);