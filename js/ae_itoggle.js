/**
 * Implementation of Drupal behavior.
 */
(function($) {
Drupal.behaviors.ae_itoggle = {
  attach: function(context) {

  var load = true;

  // change itoggle if checkbox is changed
  function toggleTheIToggle(elem) {
    var self = $(elem);
    if (self.is(':enabled')) {
      if (self.is(':checked')) {
        self.siblings('label.itoggle')
        .animate({backgroundPosition: '0% -27px'}, 300, 'easeOutExpo', function () {
          $(this).removeClass('iToff').addClass('iTon');
        });
      } else {
        self.siblings('label.itoggle')
        .animate({backgroundPosition: '100% -27px'}, 300, 'easeOutExpo', function () {
          $(this).removeClass('iToff').addClass('iTon');
          });
      }
    }
  }
  // do not load for IE6, IE7, IE8
  var htmlElem = $('html');
  if (htmlElem.hasClass('ie6')) {
    load = false;
  }
  if (htmlElem.hasClass('ie7')) {
    load = false;
  }
  if (htmlElem.hasClass('ie8')) {
    load = false;
  }

  if (load) {
    // substitute all checkboxes found by .form-type-checkbox
    $('.form-type-checkbox', context).once('ae_itoggle', function() {
      $(this).iToggle({
        easing: 'easeOutExpo',
        keepLabel: true,
        speed: 300,
        onClickOn: function() {
          var idToClick = $(this).attr('for');
          if(idToClick && idToClick.length > 0) {
            $('#' + idToClick).attr('checked', 'checked');
            $('#' + idToClick).change().trigger('click', ['itoggle']);
          }
        },
        onClickOff: function() {
          var idToClick = $(this).attr('for');
          if(idToClick && idToClick.length > 0) {
            $('#' + idToClick).removeAttr('checked');
            $('#' + idToClick).change().trigger('click', ['itoggle']);
          }
        }
      });
    });

    // on every change of an iT_checkbox, that was generated by clicking on the checkbox
    // and NOT on the related itoggle call toggleTheIToggle
    // if param is set to 'itoggle' we know, the event was fired by the itoggle
    $('.form-type-checkbox input:checkbox.iT_checkbox').bind('click', function(e, param) {
      if (!param || param !== 'itoggle') {
        toggleTheIToggle(this);
      }
    });

    // tables with .select-all checkbox: toggle the tables itoggles
    $('thead .select-all input:checkbox', context).change(function() {
      var toggle = $(this);
      if (toggle.is(':checked')) {
        toggle.closest('table').find('label.itoggle').each(function() {
          subtoggle = $(this);
          subtoggle.animate({backgroundPosition: '0% -27px'}, 300, 'easeOutExpo', function () {
            subtoggle.removeClass('iToff').addClass('iTon');
          });
        });
      } else {
        toggle.closest('table').find('label.itoggle').each(function() {
          subtoggle = $(this);
          subtoggle.animate({backgroundPosition: '100% -27px'}, 300, 'easeOutExpo', function () {
            subtoggle.removeClass('iToff').addClass('iTon');
          });
        });
      }
    });


    // permissions: add real resp. dummy checkbox to itoggles
    // disabled checkboxes are not visible as disabled, when substituted with 
    // an itoggle
    $('#permissions .form-type-checkbox label.itoggle', context).each(function() {
      // classes setzen
      self = $(this);
      if (self.next('input').is('.dummy-checkbox')) {
        // (assuming) every .dummy-checkbox was disabled from the
        // user.permissions.js script --> doing it for the itoggles
        self.addClass('dummy-checkbox').addClass('disabled-itoggle');
      } else if (self.next('input').is('.real-checkbox')) {
        self.addClass('real-checkbox');
      }
    });

    // permissions: after setting the read/dummy classes: set toggle on/off
    // depending on the checkbox for 'authenticated user' i.e. .rid-2
    // cf. modules/user/user.permissions.js
    $('#permissions .rid-2').each(function() {
      var authCheckbox = this, $row = $(this).closest('tr');
      $row.find('.real-checkbox').each(function () {
        this.style.display = (authCheckbox.checked ? 'none' : '');
      });
      $row.find('.dummy-checkbox').each(function () {
        this.style.display = (authCheckbox.checked ? '' : 'none');
      });
    });
  }


  } // attach
};
})(jQuery);
