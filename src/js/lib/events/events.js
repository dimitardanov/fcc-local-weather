

function _c2fButtonToggleHandler (e) {
  var $this = $(e.target);
  var $other = $($this.data('other-btn'));
  $('#temp-val').text($this.data('temp-val'));
  $this.removeClass('btn-default')
       .addClass('btn-primary');
  $other.addClass('btn-default')
        .removeClass('btn-primary');
}

function c2fButtonToggle () {
  $('#weather-today').on('click', '#c-btn, #f-btn', _c2fButtonToggleHandler);
}

function activateCredits () {
  $('#credits-toggle').on('click', function () {
    $('.credits').toggleClass('open');
  });
}


module.exports = {
  c2fButtonToggle: c2fButtonToggle,
  activateCredits: activateCredits
};
