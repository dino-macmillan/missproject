(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*global require,$ */

//  Macmillan Main Script - Modified: 30th July 2015
//  ------------------------------------------------
//    1. Module Requires


//  1. Module Requires
//  ------------------

// Include Macmillan Form
var macmillanForm = require('./modules/macmillan.form');

// Include Macmillan Map
var macmillanMap = require('./modules/macmillan.map');

// Include Macmillan Filters
var macmillanFilters = require('./modules/macmillan.filters');

// Include Macmillan Filters
var macmillanSearchBar = require('./modules/macmillan.searchbar');

// Include Macmillan List view
var macmillanListView = require('./modules/macmillan.listview');

// Include Macmillan List view
var macmillanProfile = require('./modules/macmillan.profile');

// Include Macmillan Sub Navigation
var macmillanSubNavigation = require('./modules/macmillan.navigation');

// Include Macmillan Page Scroll
var macmillanPageScroll = require('./modules/macmillan.pagescroll');

// Include Macmillan Page Scroll
var macmillanSocialShare = require('./modules/macmillan.socialshare');

// FastClick
// Prevents 300ms delay between a physical tap and the 
// firing of a click event on mobile browsers
var fastClickJs = require('../libs/fastclick.min');

$(document).ready(function () {
    
  'use strict';
  
  // Run FastClick
  fastClickJs.FastClick.attach(document.body);

  // Run the Macmillan Forms module
  if ($('.macmillan-form').length > 0) {
      macmillanForm.init();
  }

  // Run the Macmillan Map module
  if ($('#opportunity-map').length > 0) {
      macmillanMap.init();
  }
  
  // Run the Macmillan Filters module
  if ($('#filter-form').length > 0) {
      macmillanFilters.init();
  }

  // Run the Macmillan Search bar module
  if ($('.js-search-bar').length > 0) {
      macmillanSearchBar.init();
  }

  // Run the Macmillan List view module
  if ($('#list').length > 0) {
      macmillanListView.init();
  }

  // Run the My Mac view module
  if ($('.js-profile').length > 0) {
    macmillanProfile.init();
  }

  // Run the Sub Navigation module
  if ($('.js-sub-navigation').length > 0) {
      macmillanSubNavigation.init();
  }
 
  // Run the PageScroll module
  if ($('.js-page-scroll').length > 0) {
      macmillanPageScroll.init();
  }

  // Run the PageScroll module
  if ($('#socialShare').length > 0 && !Modernizr.touch) {
      macmillanSocialShare.init();
  }

});
},{"../libs/fastclick.min":12,"./modules/macmillan.filters":2,"./modules/macmillan.form":3,"./modules/macmillan.listview":5,"./modules/macmillan.map":6,"./modules/macmillan.navigation":7,"./modules/macmillan.pagescroll":8,"./modules/macmillan.profile":9,"./modules/macmillan.searchbar":10,"./modules/macmillan.socialshare":11}],2:[function(require,module,exports){
/*global require,module,$*/
/*jslint nomen: true*/

//  Macmillan Map - Modified: 11 August 2015
//  ------------------------------------------
//    1. Initialisation
//    2. Filter Clicked
//    3. Filter Select
//    4. runSearch
//    5. listViewClick
//    6. mapViewClick
//    7. Module Exports

//  Include Macmillan Functions
var macmillanMap = require('./macmillan.map');
var macmillanListView = require('./macmillan.listview');

var MacmillanFilters = {

    //  1. Initialisation
    //  -----------------
    //  Initialise the base function
    init: function () {

        'use strict';

        MacmillanFilters.filterClick();
        MacmillanFilters.filterSelect();
        MacmillanFilters.listViewClick();
        MacmillanFilters.mapViewClick();
        MacmillanFilters.mobileClick();
    },

    //  2. Filter Clicked
    //  -----------------
    //  The filter checkboxes have been clicked.

    filterClick: function () {

        'use strict';

        $('.map-filters input[type="checkbox"]').on('change', function () {
            MacmillanFilters.runSearch();
        });

        $('.keywords-search').on('click', function (e) {
            e.preventDefault();
            MacmillanFilters.runSearch();
        });
    },

    //  3. Filter Select
    //  -----------------
    //  updates the map/list view when filter selectmenu has been selected
    filterSelect: function () {

        'use strict';

        // Radius filter selectmenu
        $('.js-radius-selectmenu').on('change', function () {
            MacmillanFilters.runSearch();
        });
    },

    //  4. runSearch
    //  -----------------
    //  Runs the search for the current search format - list or map.
    runSearch: function () {

        'use strict';

        if ($('#map').length > 0) {
            // updates the Map if it exists in the DOM
            var model = $('#search-form').serialize() + '&' + $('#filter-form').serialize() + '&' + $('#sort-form').serialize();    // TODO: Remove need for this.

            if ($('.js-not-region input').is(':checked')) {
                macmillanMap.message();

            } else {
                $('.info-message').hide();
                macmillanMap.update(model);
            }
        } else if ($('#list').length > 0) {
            // updates the list view if it exists in the DOM
            MacmillanFilters.addAlertActiveClass();
            macmillanListView.update();
        }
    },

    //  5. listViewClick
    //  -----------------
    listViewClick: function () {

        'use strict';

        $('.btn.list-view').on('click', function (event) {
            event.preventDefault();
            $('.results-filter').removeClass('hidden');
            // accessibility
            $('.btn.map-view').attr('aria-selected', 'false');
            $(this).attr('aria-selected', 'true');

            $('.search-format').val('List');
            macmillanListView.show();
            $('.btn.list-view').removeClass('inactive');
            $('.btn.map-view').addClass('inactive');
        });
    },

    //  6. mapViewClick
    //  -----------------
    mapViewClick: function () {

        'use strict';

        $('.btn.map-view').on('click', function (event) {
            event.preventDefault();
            $('.results-filter').addClass('hidden');
            // accessibility
            $(this).attr('aria-selected', 'true');
            $('.btn.list-view').attr('aria-selected', 'false');

            $('.search-format').val('Map');
            var model = $('#search-form').serialize() + '&' + $('#filter-form').serialize() + '&' + $('#sort-form').serialize();    // TODO: Remove need for this.
            if ($(window).width() < 640) {
                macmillanMap.show(model, true);
            } else {
                macmillanMap.show(model, null);
            }
            $('.btn.map-view').removeClass('inactive');
            $('.btn.list-view').addClass('inactive');
            if ($('.js-not-region input').is(':checked')) {
                macmillanMap.message();
            }

        });
    },

    //  7. Mobile Click
    //  ---------------
    mobileClick: function () {

        'use strict';

        var $filters = $('.mobile-filters');

        if ($(window).width() < 640) {
            $('.mobile-filters .filter-wrap').each(function (index, object) {
                $(object).attr('data-height', $(object).height()).height(0);
                $(object).addClass('hide');
            });
        }

        $('.js-filter-btn').one('click', function (event) {
            event.preventDefault();
            // Clone the Sort type filter onto the mobile filter once only
            $('#SortType').clone().appendTo('.js-sortby-wrapper');
            $('#SortType').selectBoxIt();
        });

        $('.js-filter-btn').on('click', function (event) {
            event.preventDefault();
            if ($filters.hasClass('open')) {
                $filters.animate({ 'right': '-100%' }, function () {
                    $filters.removeClass('open');
                    $filters.addClass('hide-filter');
                });
            } else {
                $filters.removeClass('hide-filter');
                $('.js-keywords-wrapper').attr('tabindex', '-1').focus();
                $filters.animate({ 'right': '0' }, function () {
                    $filters.addClass('open');
                   
                });
            }
        });

        $('.btn.apply-filters').on('click', function (event) {
            event.preventDefault();
            if ($('.map-filters input[type="checkbox"]').is(':checked') || $('.map-filters #keywords').val() !== '') {
                //$('.filters .icon').show();
                //$('.filters .chevron').hide();
                $('.filters').addClass('tick');
            }
            MacmillanFilters.runSearch();
            if ($filters.hasClass('open')) {
                $('.js-keywords-wrapper').attr('tabindex', '0').blur();
                $filters.animate({ 'right': '-100%' }, function () {
                    $filters.removeClass('open');
                    $filters.addClass('hide-filter');
                    
                });
            } else {
                $filters.animate({ 'right': '0' }, function () {
                    $filters.addClass('open');
                    $filters.removeClass('hide-filter');
                });
            }
        });

        $('.btn.cancel-filters').on('click', function (event) {
            event.preventDefault();
            $('.filters .icon').hide();
            $('.filters .chevron').show();
            $('.map-filters input[type="checkbox"]').prop('checked', false);
            $('.map-filters #keywords').val('');
            MacmillanFilters.runSearch();
            if ($filters.hasClass('open')) {
                $('.js-keywords-wrapper').attr('tabindex', '0').blur();
                $filters.animate({ 'right': '-100%' }, function () {
                    $filters.removeClass('open');
                    $filters.addClass('hide-filter');
                    
                });
            }
        });

        $('.js-filter-chevron').on('click', function (e) {
            e.preventDefault();
            var $height = $(this).closest('.filter-wrapper').find('.filter-wrap').attr('data-height') + 'px';

            if ($(this).closest('.filter-wrapper').hasClass('open')) {
                $(this).closest('.filter-wrapper').removeClass('open');
                $(this).closest('.filter-wrapper').find('.filter-wrap').height(0);
                $(this).closest('.filter-wrapper').find('.filter-wrap').addClass('hide');
            } else {
                $(this).closest('.filter-wrapper').addClass('open');
                $(this).closest('.filter-wrapper').find('.filter-wrap').removeClass('hide');
                $(this).closest('.filter-wrapper').find('.filter-wrap').height($height);
            }
        });

        $(window).resize(function () {
            var $windowWidth = $(window).width();

            if ($windowWidth >= 640) {
                $('.filter-wrap').height('auto');
                $('.filter-wrap').removeClass('hide');
            } else {
                $('.filter-wrap').height(0);
                $('.filter-wrap').addClass('hide');
                $('.filter-wrapper').removeClass('open');
            }
        });
    },

    //
    //  8. Activate alert
    //  ---------------
    addAlertActiveClass: function () {

        'use strict';

        $('#filtersAlert').find('.alert-message').addClass('active');
    }

};

// 9. Module Exports
//  -----------------
module.exports = {
    init: MacmillanFilters.init,
    activateAlert: MacmillanFilters.addAlertActiveClass
};
},{"./macmillan.listview":5,"./macmillan.map":6}],3:[function(require,module,exports){
/*global require,module,$*/
/*jslint nomen: true*/

//  Macmillan Forms - Modified: 21st April 2016
//  ------------------------------------------
//    1. Module Requires
//    2. Initialisation
//    3. Select Menu Function
//    4. Postcode Finder
//    5. Postcode Hidden Fields
//    6. Radio button Hidden Options
//    7. Custom Submit Button
//    8. Show Other Option
//    9. Show/Hide Content
//    10. File Upload
//    11. Form Validation
//    12. Module Exports

//  1. Module Requires
//  ------------------

//  Include Macmillan Functions
var macmillanFunctions = require('./macmillan.functions');
//  Include jQuery validate plugin
var jqueryValidate = require('jquery-validate');
//  Include SelectBoxIt plugin
var jquerySelectBoxIt = require('../../libs/jquery.selectBoxIt.min');

var MacmillanForm = {

    //  2. Initialisation
    //  -----------------
    //  Initialise the base function
    init: function () {

        'use strict';

        // Run SelectMenu function only if the
        // browser is not IE7
        if (!macmillanFunctions.isIE7()) {
            MacmillanForm.selectMenu();
        }

        MacmillanForm.postCodeFinder();
        MacmillanForm.formValidation();
        MacmillanForm.toggleMoreOptions();
        MacmillanForm.customFormSubmit();
        MacmillanForm.showOtherOption();
        MacmillanForm.initialiseTooltips();
        MacmillanForm.toggleContent();
        MacmillanForm.showFileName();
    },

    //  3. Select Menu Function
    //  -----------------------
    //  Function to enable all select menus
    //  to utilise SelectBoxIt plugin.
    //  Relies on a custom select box to set the menu
    //  width dynamically. Collision is turned off to
    //  force the menu to always appear underneath the dropdown.
    selectMenu: function () {

        'use strict';

        var $customSelectBox = $('.js-macmillan-form').find('select');

        $.each($customSelectBox, function () {
            $(this).selectBoxIt();
            $(this).on('change', function () {
                $('.js-macmillan-form').validate().element($(this));
                if ($(this).val() === '') {
                    $(this).closest('.row').addClass('error');
                }
            });
        });
    },

    //  4. Postcode Finder
    //  ------------------
    //  Allows for multiple address finders
    //  to be present on the page. Each one must be in
    //  a separate .macmillan-form form wrapper.
    postCodeFinder: function () {

        'use strict';

        // Format address for the postcode finder dropdown
        //  -------------------------
        //  Output: address line 1, address line 2, address line city, address line postcode
        //
        var postcodeHelper = {
            formatAddressDropdown: function (addressObject) {

                var addressLine = addressObject.line1 + ', ';

                if (!postcodeHelper.isEmpty(addressObject.line2))
                    addressLine = addressLine + addressObject.line2 + ', ';

                addressLine = addressLine + addressObject.city + ', ' + addressObject.postcode;

                return addressLine;
            },

            isEmpty: function (str) {
                return (!str || 0 === str.length);
            }
        }

        $('.js-find-postcode').each(function () {

            var postcodeFinder = $(this),
              manualPostCode = $('.js-postcode-manual', postcodeFinder),
              findAddress = $('.js-postcode-find', postcodeFinder),
              hiddenSelector = $('.js-postcode-hidden-selector', postcodeFinder),
              hiddenFields = $('.js-postcode-hidden-fields', postcodeFinder),
              postcodeInput = $('.js-postcode-input', postcodeFinder),
              addressUse = $('.js-address-use', postcodeFinder),
              addressLine1 = $('.js-address-line-one', postcodeFinder),
              addressResults;

            if ($(postcodeInput).val() !== '' && $(addressLine1).val() !== '') {
                //  Show the hidden address fields
                MacmillanForm.postcodeHiddenFields(postcodeFinder);
            }

            //  Enter Postcode Manually
            //  -----------------------
            //  When clicked, the hidden address fields will
            //  slide down. Utilises CSS3 animations so will just
            //  appear in IE 7/8/9 instead of being animated.
            $(manualPostCode).on('click', function (event) {

                //  Hide the postcode select dropdown if it
                //  has been shown
                $(hiddenSelector).css({ 'visibility': 'hidden', 'height': '0' });

                //  Show the hidden address fields
                MacmillanForm.postcodeHiddenFields(postcodeFinder);

                $(manualPostCode).hide();

                event.preventDefault();
            });

            //  Find Address
            //  ------------
            //  Takes the users postcode and sends it as an
            //  ajax request to the API. A JSON response
            //  containing the address details is received on
            //  success.
            $(findAddress).on('click', function (event) {

                event.preventDefault();

                // validate postcode field on click
                if (postcodeInput.valid()) {
                    $(postcodeInput).parent().removeClass('error');
                } else {
                    $(postcodeInput).parent().addClass('error');
                }

                if (!$(postcodeInput).hasClass('error')) {

                    var postcode = $(postcodeInput).val();

                    //  Clear the select menu of its current
                    //  options.
                    $(hiddenSelector).find('select').val('');

                    $.ajax({
                        type: 'GET',
                        url: '/Opportunity/GetAddressOptions',
                        data: { 'postcode': postcode },
                        dataType: 'html',
                        success: function (data) {
                            addressResults = data;

                            //  Parse the returned JSON
                            addressResults = JSON.parse(addressResults);

                            if (addressResults.status === 'ok' && addressResults.count > 0) {
                                $(manualPostCode).show();

                                //  Append each JSON object to the select
                                //  menu.
                                $(hiddenSelector).find('select').html('');
                                $.each(addressResults.addressList, function (key, addressObject) {
                                    $(hiddenSelector).find('select').append('<option value="' + key + '">' + postcodeHelper.formatAddressDropdown(addressObject) + '</option>');
                                });

                                //  Show the hidden postcode selector
                                //  and refresh it to update to the latest
                                //  values added to it.
                                $(hiddenSelector).css({ 'visibility': '', 'height': '' });
                                $(hiddenSelector).slideDown();

                                if (!macmillanFunctions.isIE7()) {
                                    $(hiddenSelector).find('select').selectBoxIt('refresh');
                                }
                            } else {
                                $(hiddenSelector).slideUp();
                                $(hiddenSelector).css({ 'visibility': 0, 'height': 0 });
                            }
                        }
                    });
                    //event.preventDefault();
                }
            });

            //  Use Address
            //  -----------
            $(addressUse).on('click', function (event) {

                var selectedAddress = $(hiddenSelector).find('select').val(),
                  chosenResult = addressResults.addressList[selectedAddress];

                //  Populate the address fields from the JSON object
                $(hiddenFields).find('.js-address-line-one').val(chosenResult.line1);
                $(hiddenFields).find('.js-address-line-two').val(chosenResult.line2);
                $(hiddenFields).find('.js-address-line-three').val(chosenResult.line3);
                $(hiddenFields).find('.js-address-line-city').val(chosenResult.city);

                //  Show the hidden address fields
                MacmillanForm.postcodeHiddenFields(postcodeFinder);

                $('.js-postcode-hidden-selector').slideUp();

                event.preventDefault();

            });
        });
    },

    //  5. Postcode Hidden Fields
    //  -------------------------
    //  Function to show the hidden address
    //  fields when either the manual button is pressed
    //  or "use this address" is pressed.
    postcodeHiddenFields: function (element) {

        'use strict';

        var height = 0,
            hiddenFields = $('.js-postcode-hidden-fields', element);

        $(hiddenFields).children('.row').each(function () {
            height = height + $(this).outerHeight(true);
        });

        $(hiddenFields).css({ 'visibility': 'visible' }).slideDown();

        $('.js-postcode-manual').closest('.row').hide();

    },

    //  6. Radio button Hidden Options
    //  -------------------------
    //  Function to show and hide hidden rows 
    //  when radio button value changes
    toggleMoreOptions: function () {

        'use strict';

        $('.js-toggle-radio').each(function () {
            if ($(this).children('input:checked').val() === 'True') {
                $(this).closest('.row').next('.js-hidden-rows').removeClass('hidden-rows');
            }

            $(this).children('input:radio').on('change', function () {
                if ($(this).val() === 'True') {
                    $(this).closest('.row').next('.js-hidden-rows').removeClass('hidden-rows');
                } else {
                    $(this).closest('.row').next('.js-hidden-rows').addClass('hidden-rows');
                }
            });
        });
    },

    // 7. Custom form submit
    //  -------------------------
    //  Function to handle the custom submit button
    //  
    customFormSubmit: function () {

        'use strict';

        var $submitButton = $('.js-macmillan-form').find('.js-submit');

        $($submitButton).on('click', function () {

            if ($('.js-macmillan-form').valid({ ignore: '.hidden-rows :input, .js-dob-field :input' })) {
                return true;
            } else {
                if ($('.js-macmillan-form .js-address-line-one')) {
                    if ($('.js-address-line-one').val() == '') {
                        $('.js-postcode-manual').trigger('click');
                        return false;
                    }
                }
            }
            return false;
        });
    },

    //  8. Show other option
    //  ------------------
    //  Function to handle Other options in form inputs.
    showOtherOption: function () {

        'use strict';

        // Select elements with "Other" option.
        $('select.show-other').on('change', function () {
            var selectedOption = $(this).find('option:selected').text();
            if (selectedOption.indexOf('Other') >= 0) {
                $(this).closest('.row').next('.row').removeClass('hidden-rows');
            } else {
                $(this).closest('.row').next('.row').addClass('hidden-rows');
            }
        });

        // Initialise.
        $('select.show-other').each(function () {
            var selectedOption = $(this).find('option:selected').text();
            if (selectedOption.indexOf('Other') >= 0) {
                $(this).closest('.row').next('.row').removeClass('hidden-rows');
            } else {
                $(this).closest('.row').next('.row').addClass('hidden-rows');
            }
        });

        // Checkbox elements with "Other" option.
        $('input.show-other[type=checkbox]').on('change', function () {
            if ($(this).is(':checked')) {
                $(this).parent().next('.row').removeClass('hidden-rows');
                $(this).closest('.checkbox-column').siblings('.other-field').removeClass('hidden-rows');
            } else {
                $(this).parent().next('.row').addClass('hidden-rows');
                $(this).closest('.checkbox-column').siblings('.other-field').addClass('hidden-rows');
            }
        });
        // Initialise.
        $('input.show-other[type=checkbox]').each(function () {
            if ($(this).is(':checked')) {
                $(this).parent().next('.row').removeClass('hidden-rows');
                $(this).closest('.checkbox-column').siblings('.other-field').removeClass('hidden-rows');
            } else {
                $(this).parent().next('.row').addClass('hidden-rows');
                $(this).closest('.checkbox-column').siblings('.other-field').addClass('hidden-rows');
            }
        });
    },

    //  9. toggle show/hide content
    //  ------------------
    //  Show/hide content on click event

    toggleContent: function () {

        'use strict';

        var $toggleContent = $('.js-toggle-content'),
            $toggleShow = $toggleContent.find('.js-toggle-show'),
            $toggleHide = $toggleContent.find('.js-toggle-hide'),
            $toggleTxt = $toggleContent.find('.js-toggle-text');

        $toggleTxt.hide();
        $toggleShow.on('click', function (e) {
            e.preventDefault();
            $(this).addClass('hidden');
            $(this).next().slideToggle('fast');
        });
        $toggleHide.on('click', function (e) {
            e.preventDefault();

            $(this).parent().slideToggle('fast');
            $(this).parent().prev().removeClass('hidden');
        });
    },

    // 10. File upload
    //  ------------------
    //  Displays file name and extension
    showFileName: function () {

        'use strict';

        var $fileInput = $('.file-upload').find('.upload-input'),
            $fileNameDiv = $('.file-upload').find('.file-name');

        $fileInput.on('change', function () {
            var filepath = $(this).val(),
                filename = filepath.replace(/^.*[\\\/]/, ''); //gets only the file name instead of full path
            $fileNameDiv.html('<span class="valid-status"></span>' + filename);
        });
    },
    
    //  11. Form Validation
    //  ------------------
    //  Initialisation of the form validation
    formValidation: function () {

        'use strict';

        // Method to ensures a given number of fields in a group are complete
        // eg: references email and address fields
        $.validator.addMethod('require_from_group', function (value, element, options) {
            var $fields = $(options[1], element.form),
                $fieldsFirst = $fields.eq(0),
                validator = $fieldsFirst.data('valid_req_grp') ? $fieldsFirst.data('valid_req_grp') : $.extend({}, this),
                isValid = $fields.filter(function () {
                    return validator.elementValue(this);
                }).length >= options[0];


            // Store the cloned validator for future validation
            $fieldsFirst.data('valid_req_grp', validator);

            // If element isn't being validated, run each require_from_group field's validation rules
            if (!$(element).data('being_validated')) {
                $fields.data('being_validated', true);
                $fields.each(function () {
                    validator.element(this);
                });
                $fields.data('being_validated', false);
            }

            // Reference Email and Address
            if (isValid) {
                $(element).each(function (index, element) {
                    $(element).closest('.row').removeClass('error');
                })
            } else {
                $(element).each(function (index, element) {
                    $(element).closest('.row').addClass('error');
                })
            }
            return isValid;
        }, $.validator.format('Please fill at least {0} of these fields.'));

        // Method to validate UK Postcode
        $.validator.addMethod('postcode', function (value, element) {
            var $val = value.toUpperCase();
            return this.optional(element) || /^(GIR 0AA|[A-PR-UWYZ]([0-9]{1,2}|([A-HK-Y][0-9]|[A-HK-Y][0-9]([0-9]|[ABEHMNPRV-Y]))|[0-9][A-HJKS-UW])( |)[0-9][ABD-HJLNP-UW-Z]{2})$/.test($val);
        });

        // Method to validate UK phone numbers
        $.validator.addMethod('phoneUK', function (phoneNumber, element) {
            return this.optional(element) || phoneNumber.length > 9 &&
            phoneNumber.match(/^(\(?(0|\+44)[1-9]{1}\d{1,4}?\)?\s?\d{3,4}\s?\d{3,4})$/);
        });

        $.validator.addMethod('hasToBeYes', function (value, element) {
            var elemName = $(element).attr('name');
            value = $('input:radio[name="' + elemName + '"]:checked').val();
            return (value == 'True');
        });

        // Method to validate date of birth
        $.validator.addMethod('multidate', function (value, element, params) {
            function isValidDate(s) {
                var bits = s.split('/');
                var y = bits[2], m = bits[1], d = bits[0];
                // Assume not leap year by default (note zero index for Jan)
                var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                // If evenly divisible by 4 and not evenly divisible by 100,
                // or is evenly divisible by 400, then a leap year
                if ((!(y % 4) && y % 100) || !(y % 400)) {
                    daysInMonth[1] = 29;
                }
                return d <= daysInMonth[--m]
            }

            var day = $(params[0]).val()
                , month = $(params[1]).val()
                , year = $(params[2]).val(),
                joined = day + '/' + month + '/' + year;

            if (year < 1900 || day === '' || !isValidDate(joined)) {
                $(element).closest('.row').addClass('error');
                return false;
            }
            return true;

        }, 'Please enter a valid date of birth');

        // Gets the current year
        var currentYear = new Date().getFullYear();

        // Method to validate file extension. Old docs: http://docs.jquery.com/Plugins/Validation/Methods/accept
        $.validator.addMethod('extension', function (value, element, param) {
            param = typeof param === 'string' ? param.replace(/,/g, '|') : 'doc|docx|pdf';
            return this.optional(element) || value.match(new RegExp('\\.(' + param + ')$', 'i'));
        }, $.validator.format('This file type is not supported, please upload a .pdf, .doc or .docx file'));

        // Method to validate file size. NOTE: It does not work on iE8 and older
        $.validator.addMethod('uploadFile', function (val, element) {
            var size = element.files[0].size;
            console.log(size);
            // checks the file more than 1 MB
            if (size > 1048576) {
                console.log('returning false');
                return false;
            } else {
                console.log('returning true');
                return true;
            }
        },'This file exceeds the maximum file size. Please try again using a file under 1 MB');


        $('.js-macmillan-form').each(function () {
            // Defines DOB groups
            var dateFields = ['#MyDetails_DayBirth', '#MyDetails_MonthBirth', '#MyDetails_YearBirth'];
            var dateFieldsMymac = ['#DayBirth', '#MonthBirth', '#YearBirth'];

            $(this).validate({
                //  Ignore nothing, including hidden fields.
                //  This is needed for select validation to work
                ignore: '.hidden-rows :input, .js-dob-field :input',

                //  Auto validate the input on keyup
                onkeyup: function (element) {
                    if (this.element(element)) {
                        $(element).closest('.row').removeClass('error');
                    } else {
                        $(element).closest('.row').addClass('error');
                    }
                },

                //  Validate the input field on focus out
                onfocusout: function (element) {
                    if (this.element(element)) {
                        $(element).closest('.row').removeClass('error');
                    } else {
                        $(element).closest('.row').addClass('error');
                    }
                },

                //  Wrap the error text inside a paragraph
                //  tag.
                errorElement: 'p',

                //  Control where the error message is placed
                //  and what it is wrapped in. Placed differently
                //  for when the input is a select field

                errorPlacement: function (error, element) {

                    // DOB
                    if (element.parents('.js-dob-field').length) {

                        if ($('body').hasClass('tablet') || $('body').hasClass('smartphone')) {
                            console.log(element);
                            $(element).parent().closest('div').append(error);
                            error.wrap('<div class="error-message" role="alert"><div class="error-text"></div></div>');
                            error.after('<div class="error-bg"></div>');
                            return false;

                        } else {
                            $(element).parent().append(error);
                            error.wrap('<div class="error-message" role="alert"><div class="error-text"></div></div>');
                            error.after('<div class="error-bg"></div>');
                            return false;
                        }
                    }

                    // Cancer Affected
                    if (element.attr('name') === 'ApplicationCancerVoiceViewModel.AffectedByCancer.HowAffectedIds[]') {
                        $(element).parent().parent().children('.form-checkbox:last').append(error);
                        error.wrap('<div class="error-message" role="alert"><div class="error-text"></div></div>');
                        error.after('<div class="error-bg"></div>');
                        return false;
                    }

                    // Cancer Experiences
                    if (element.attr('name') === 'ApplicationCancerVoiceViewModel.AffectedByCancer.CancerTypeIds[]') {
                        $(element).parent().parent().children('.form-checkbox:last').append(error);
                        error.wrap('<div class="error-message" role="alert"><div class="error-text"></div></div>');
                        error.after('<div class="error-bg"></div>');
                        return false;
                    }

                    // Selectmenu
                    if (element[0].nodeName === 'SELECT') {
                        //  Check if IE7 and show the error in
                        //  a different place due to select boxes
                        //  not being used
                        if (macmillanFunctions.isIE7()) {
                            error.insertAfter($(element))
                              .wrap('<div class="error-message" role="alert"><div class="error-text"></div></div>');
                            error.after('<div class="error-bg"></div>');
                        } else if (Modernizr.touch) {
                            // For smartphone and tablet
                            $(element).parent().append(error);
                            error.wrap('<div class="error-message" role="alert"><div class="error-text"></div></div>');
                            error.after('<div class="error-bg"></div>');
                        } else {
                            error.insertAfter($(element).next('span'))
                              .wrap('<div class="error-message" role="alert"><div class="error-text"></div></div>');
                            error.after('<div class="error-bg"></div>');
                        }
                    } else if (element[0].type === 'checkbox') { //Checkbox
                        $(element).parent().append(error);
                        error.wrap('<div class="error-message" role="alert"><div class="error-text"></div></div>');
                        error.after('<div class="error-bg"></div>');
                    } else if (element[0].type === 'radio') { //Radio
                        $(element).parent().append(error);
                        error.wrap('<div class="error-message" role="alert"><div class="error-text"></div></div>');
                        error.after('<div class="error-bg"></div>');
                    } else {
                        error.insertAfter(element)
                          .wrap('<div class="error-message" role="alert"><div class="error-text"></div></div>');
                        error.after('<div class="error-bg"></div>');
                    }
                },

                //  Run through each error and add the "error"
                //  class to its parent row
                invalidHandler: function (event, validator) {
                    console.log('err');
                    var errors = validator.numberOfInvalids(),
                      errorList = validator.errorList,
                      i = 0;

                    if (errors) {
                        for (i; i < errorList.length; i += 1) {
                            $(errorList[i].element).closest('.row').addClass('error');
                        }
                        $('html, body').animate({ scrollTop: $('.row.error').offset().top });

                        // Keyboard focus to the first error input
                        var firstInvalidElement = $(validator.errorList[0].element);
                        firstInvalidElement.focus();
                    }
                },

                //  Remove the error class if no longer needed
                //  from the parent row.
                success: function (error) {
                    error.closest('.error.row').removeClass('error');
                },

                groups: {
                    date: 'MyDetails.DayBirth MyDetails.MonthBirth MyDetails.YearBirth',
                    dateMymac: 'DayBirth MonthBirth YearBirth'
                },

                //  Validation Rules
                //  May be moved to an external file at some point
                rules: {

                    //  Initial Rules
                    UploadedFile: {
                        required: true,
                        extension: true
                        //uploadFile: true
                    },
                    TermsAndCondition: {
                        required: true
                    },
                    HowCanWeHelp: {
                        required: true
                    },
                    HowDidYouHear: {
                        required: true
                    },
                    CurrentSituation: {
                        required: true
                    },
                    'ApplicationStep1ViewModel.UserTitle': {
                        required: true
                    },
                    'ApplicationStep1ViewModel.FirstName': {
                        required: true
                    },
                    'ApplicationStep1ViewModel.LastName': {
                        required: true
                    },
                    'ApplicationStep1ViewModel.AddressPostCode': {
                        required: true,
                        postcode: true
                    },
                    'ApplicationStep1ViewModel.Address1': {
                        required: true
                    },
                    'ApplicationStep1ViewModel.Telephone': {
                        required: true,
                        phoneUK: true
                    },
                    'ApplicationStep1ViewModel.Email': {
                        required: true,
                        email: true
                    },
                    Password: {
                        required: true,
                        minlength: '6'
                    },
                    'ApplicationStep1ViewModel.EmergencyContactName': {
                        required: true
                    },
                    'ApplicationStep1ViewModel.EmergencyContactNumber': {
                        required: true,
                        phoneUK: true
                    },
                    DayBirth: {
                        multidate: dateFieldsMymac
                    },
                    MonthBirth: {
                        multidate: dateFieldsMymac
                    },
                    YearBirth: {
                        multidate: dateFieldsMymac,
                        number: true,
                        max: currentYear
                    },
                    'MyDetails.DayBirth': {
                        multidate: dateFields
                    },
                    'MyDetails.MonthBirth': {
                        multidate: dateFields
                    },
                    'MyDetails.YearBirth': {
                        multidate: dateFields,
                        number: true,
                        max: currentYear
                    },
                    'ApplicationCategory1ViewModel.Motivation.Reason': {
                        required: true
                    },
                    'ApplicationCategory2ViewModel.Motivation.Reason': {
                        required: true
                    },
                    'ApplicationCategory3ViewModel.Motivation.Reason': {
                        required: true
                    },
                    'ApplicationCategory4ViewModel.Motivation.Reason': {
                        required: true
                    },
                    'ApplicationCancerVoiceViewModel.Motivation.Reason': {
                        required: true
                    },
                    'ApplicationCategory1ViewModel.Motivation.WhySuitableForRole': {
                        required: true,
                        maxlength: '1000'
                    },
                    'ApplicationCategory2ViewModel.Motivation.WhySuitableForRole': {
                        required: true,
                        maxlength: '1000'
                    },
                    'ApplicationCategory3ViewModel.Motivation.WhySuitableForRole': {
                        required: true,
                        maxlength: '1000'
                    },
                    'ApplicationCategory4ViewModel.Motivation.WhySuitableForRole': {
                        required: true,
                        maxlength: '1000'
                    },
                    'ApplicationCancerVoiceViewModel.Motivation.WhySuitableForRole': {
                        required: true,
                        maxlength: '1000'
                    },
                    'ApplicationCancerVoiceViewModel.AffectedByCancer.BeenAffectedPersonally': {
                        hasToBeYes: true
                    },
                    'ApplicationCategory2ViewModel.Reference.ReferenceName': {
                        required: true
                    },
                    'ApplicationCategory2ViewModel.Reference.ReferenceContactNumber': {
                        required: true,
                        phoneUK: true
                    },
                    'ApplicationCategory2ViewModel.Reference.ReferenceEmail': {
                        require_from_group: [1, '.js-ref-group'],
                        email: true
                    },
                    'ApplicationCategory2ViewModel.Reference.ReferenceAddress': {
                        require_from_group: [1, '.js-ref-group']
                    },
                    'ApplicationCategory3ViewModel.ReferencePair.Reference1Name': {
                        required: true
                    },
                    'ApplicationCategory3ViewModel.ReferencePair.Reference1ContactNumber': {
                        required: true,
                        phoneUK: true
                    },
                    'ApplicationCategory3ViewModel.ReferencePair.Reference1Email': {
                        require_from_group: [1, '.js-ref-group'],
                        email: true
                    },
                    'ApplicationCategory3ViewModel.ReferencePair.Reference1Address': {
                        require_from_group: [1, '.js-ref-group']
                    },
                    'ApplicationCategory3ViewModel.ReferencePair.Reference2Name': {
                        required: true
                    },
                    'ApplicationCategory3ViewModel.ReferencePair.Reference2ContactNumber': {
                        required: true,
                        phoneUK: true
                    },
                    'ApplicationCategory3ViewModel.ReferencePair.Reference2Address': {
                        require_from_group: [1, '.js-ref-group2']
                    },
                    'ApplicationCategory3ViewModel.ReferencePair.Reference2Email': {
                        require_from_group: [1, '.js-ref-group2'],
                        email: true
                    },
                    'ApplicationCategory4ViewModel.ReferencePair.Reference1Name': {
                        required: true
                    },
                    'ApplicationCategory4ViewModel.ReferencePair.Reference1ContactNumber': {
                        required: true,
                        phoneUK: true
                    },
                    'ApplicationCategory4ViewModel.ReferencePair.Reference1Email': {
                        require_from_group: [1, '.js-ref-group'],
                        email: true
                    },
                    'ApplicationCategory4ViewModel.ReferencePair.Reference1Address': {
                        require_from_group: [1, '.js-ref-group']
                    },
                    'ApplicationCategory4ViewModel.ReferencePair.Reference2Name': {
                        required: true
                    },
                    'ApplicationCategory4ViewModel.ReferencePair.Reference2ContactNumber': {
                        required: true,
                        phoneUK: true
                    },
                    'ApplicationCategory4ViewModel.ReferencePair.Reference2Email': {
                        require_from_group: [1, '.js-ref-group2'],
                        email: true
                    },
                    'ApplicationCategory4ViewModel.ReferencePair.Reference2Address': {
                        require_from_group: [1, '.js-ref-group2']
                    },
                    'ApplicationCategory1ViewModel.Background.WorksForCorporatePartner': {
                        required: true
                    },
                    'ApplicationCategory2ViewModel.Background.WorksForCorporatePartner': {
                        required: true
                    },
                    'ApplicationInternshipsViewModel.ReferencePair.Reference1Name': {
                        required: true
                    },
                    'ApplicationInternshipsViewModel.ReferencePair.Reference1Email': {
                        require_from_group: [1, '.js-ref-group'],
                        email: true
                    },
                    'ApplicationInternshipsViewModel.ReferencePair.Reference1Address': {
                        require_from_group: [1, '.js-ref-group']
                    },

                    'ApplicationInternshipsViewModel.ReferencePair.Reference1ContactNumber': {
                        required: true,
                        phoneUK: true
                    },
                    'ApplicationInternshipsViewModel.ReferencePair.Reference2Name': {
                        required: true
                    },
                    'ApplicationInternshipsViewModel.ReferencePair.Reference2Email': {
                        require_from_group: [1, '.js-ref-group2'],
                        email: true
                    },
                    'ApplicationInternshipsViewModel.ReferencePair.Reference2Address': {
                        require_from_group: [1, '.js-ref-group2']
                    },
                    'ApplicationInternshipsViewModel.ReferencePair.Reference2ContactNumber': {
                        required: true,
                        phoneUK: true
                    },
                    'ApplicationCategory3ViewModel.Background.WorksForCorporatePartner': { required: true },
                    'ApplicationCategory4ViewModel.Background.WorksForCorporatePartner': { required: true },
                    'ApplicationCancerVoiceViewModel.Background.WorksForCorporatePartner': { required: true },
                    'ApplicationEventSupportViewModel.Background.WorksForCorporatePartner': { required: true },
                    'ApplicationCategory1ViewModel.Background.CorporatePartnerId': { required: true },
                    'ApplicationCategory2ViewModel.Background.CorporatePartnerId': { required: true },
                    'ApplicationCategory3ViewModel.Background.CorporatePartnerId': { required: true },
                    'ApplicationCategory4ViewModel.Background.CorporatePartnerId': { required: true },
                    'ApplicationCancerVoiceViewModel.Background.CorporatePartnerId': { required: true },
                    'ApplicationCategory1ViewModel.LegalConfirmations.ConfirmAge': { required: true },
                    'ApplicationCategory2ViewModel.LegalConfirmations.ConfirmAge': { required: true },
                    'ApplicationCategory3ViewModel.LegalConfirmations.ConfirmAge': { required: true },
                    'ApplicationCategory4ViewModel.LegalConfirmations.ConfirmAge': { required: true },
                    'ApplicationCancerVoiceViewModel.LegalConfirmations.ConfirmAge': { required: true },
                    'ApplicationCategory1ViewModel.LegalConfirmations.ConfirmsInformationAccurate': { required: true },
                    'ApplicationCategory2ViewModel.LegalConfirmations.ConfirmsInformationAccurate': { required: true },
                    'ApplicationCategory3ViewModel.LegalConfirmations.ConfirmsInformationAccurate': { required: true },
                    'ApplicationCategory4ViewModel.LegalConfirmations.ConfirmsInformationAccurate': { required: true },
                    'ApplicationCancerVoiceViewModel.LegalConfirmations.ConfirmsInformationAccurate': { required: true },
                    'ApplicationCategory1ViewModel.LegalConfirmations.ConfirmsDataProtection': { required: true },
                    'ApplicationCategory2ViewModel.LegalConfirmations.ConfirmsDataProtection': { required: true },
                    'ApplicationCategory3ViewModel.LegalConfirmations.ConfirmsDataProtection': { required: true },
                    'ApplicationCategory4ViewModel.LegalConfirmations.ConfirmsDataProtection': { required: true },
                    'ApplicationCancerVoiceViewModel.LegalConfirmations.ConfirmsDataProtection': { required: true },
                    'ApplicationInternshipsViewModel.Internship.WhySuitableForRole': {
                        required: true,
                        maxlength: '3000'
                    },
                    'ApplicationInternshipsViewModel.Motivation.Reason': { required: true },
                    'ApplicationInternshipsViewModel.Internship.WhyUndertakeInternship': {
                        required: true,
                        maxlength: '3500'
                    },
                    'ApplicationInternshipsViewModel.LegalConfirmations.ConfirmAge': { required: true },
                    'ApplicationInternshipsViewModel.LegalConfirmations.ConfirmsInformationAccurate': { required: true },
                    'ApplicationInternshipsViewModel.LegalConfirmations.ConfirmsDataProtection': { required: true },
                    // challenge event
                    'ApplicationEventSupportViewModel.Motivation.Reason': { required: true },
                    'ApplicationEventSupportViewModel.CustomQuestion.AnswerId': { required: true },
                    'ApplicationEventSupportViewModel.Motivation.WhySuitableForRole': {
                        required: true,
                        maxlength: '1000'
                    },
                    'ApplicationEventSupportViewModel.Background.CorporatePartnerId': { required: true },
                    'ApplicationEventSupportViewModel.LegalConfirmations.ConfirmAge': { required: true },
                    'ApplicationEventSupportViewModel.LegalConfirmations.ConfirmsInformationAccurate': { required: true },
                    'ApplicationEventSupportViewModel.LegalConfirmations.ConfirmsDataProtection': { required: true },
                    'ApplicationEventSupportViewModel.TShirt.TShirtSize': { required: true },
                    'ApplicationEventSupportViewModel.TShirt.TShirtWanted': { required: true }
                    
                },

                //  Custom error messages
                messages: {
                    Password: 'The password field is required',
                    TermsAndCondition: 'Please accept the terms and conditions',
                    HowCanWeHelp: 'Please let us know how we can help',
                    HowDidYouHear: 'Please let us know how you heard about legacy giving',
                    CurrentSituation: 'Please let us know your current situation',
                    'ApplicationStep1ViewModel.UserTitle': 'The title field is required',
                    'ApplicationStep1ViewModel.FirstName': 'The first name field is required',
                    'ApplicationStep1ViewModel.LastName': 'The last name field is required',
                    'ApplicationStep1ViewModel.AddressPostCode': {
                        required: 'The postcode field is required',
                        postcode: 'Sorry your postcode was not recognised. Please search again or enter your postcode manually'
                    },
                    'ApplicationStep1ViewModel.Address1': 'Address 1 field is required',
                    'ApplicationStep1ViewModel.Telephone': {
                        required: 'The telephone field is required',
                        phoneUK: 'Sorry your telephone number is not valid. Please try again'
                    },
                    'ApplicationStep1ViewModel.Email': {
                        required: 'The email address field is required',
                        email: 'Sorry your email address is not valid. Please try again'
                    },
                    'ApplicationStep1ViewModel.EmergencyContactName': 'The emergency contact name field is required',
                    'ApplicationStep1ViewModel.EmergencyContactNumber': {
                        required: 'The emergency contact number field is required',
                        phoneUK: 'Sorry your emergency contact number is not valid. Please try again'
                    },
                    'ApplicationCategory1ViewModel.Motivation.Reason': 'Please tell us your main motivation for applying for this role',
                    'ApplicationCategory2ViewModel.Motivation.Reason': 'Please tell us your main motivation for applying for this role',
                    'ApplicationCategory3ViewModel.Motivation.Reason': 'Please tell us your main motivation for applying for this role',
                    'ApplicationCategory4ViewModel.Motivation.Reason': 'Please tell us your main motivation for applying for this role',
                    'ApplicationCancerVoiceViewModel.Motivation.Reason': 'Please tell us your main motivation for applying for this role',
                    'ApplicationEventSupportViewModel.Motivation.Reason': 'Please tell us your main motivation for applying for this role',
                    

                    'ApplicationCategory1ViewModel.Motivation.WhySuitableForRole': {
                        required: 'Please tell us a bit about yourself',
                        maxlength: 'Please use 1000 characters or less'
                    },
                    'ApplicationCategory2ViewModel.Motivation.WhySuitableForRole': {
                        required: 'Please tell us a bit about yourself',
                        maxlength: 'Please use 1000 characters or less'
                    },
                    'ApplicationCategory3ViewModel.Motivation.WhySuitableForRole': {
                        required: 'Please tell us a bit about yourself',
                        maxlength: 'Please use 1000 characters or less'
                    },
                    'ApplicationCategory4ViewModel.Motivation.WhySuitableForRole': {
                        required: 'Please tell us a bit about yourself',
                        maxlength: 'Please use 1000 characters or less'
                    },
                    'ApplicationCancerVoiceViewModel.Motivation.WhySuitableForRole': {
                        required: 'Please tell us a bit about yourself',
                        maxlength: 'Please use 1000 characters or less'
                    },

                    'ApplicationInternshipsViewModel.Internship.WhySuitableForRole': {
                        required: 'Please tell us why you feel your skills and experience make you suitable for this role',
                        maxLength: 'You have exceeded the 3000 character maximum length. Please try again'
                    },

                    'ApplicationCancerVoiceViewModel.AffectedByCancer.BeenAffectedPersonally': {
                        hasToBeYes: 'This opportunity requires applicants to have a personal experience of cancer'
                    },

                    'ApplicationCategory2ViewModel.Reference.ReferenceName': {
                        required: 'This field is required'
                    },
                    'ApplicationCategory2ViewModel.Reference.ReferenceContactNumber': {
                        required: 'This field is required',
                        phoneUK: 'Sorry your telephone number is not valid. Please try again'
                    },
                    'ApplicationCategory2ViewModel.Reference.ReferenceEmail': {
                        require_from_group: 'Either email or address is required',
                        email: 'Sorry your email address is not valid. Please try again'
                    },
                    'ApplicationCategory2ViewModel.Reference.ReferenceAddress': {
                        require_from_group: 'Either email or address is required'
                    },
                    'ApplicationCategory3ViewModel.ReferencePair.Reference1Name': {
                        required: 'This field is required'
                    },
                    'ApplicationCategory3ViewModel.ReferencePair.Reference1ContactNumber': {
                        required: 'This field is required',
                        phoneUK: 'Sorry your telephone number is not valid. Please try again'
                    },
                    'ApplicationCategory3ViewModel.ReferencePair.Reference1Email': {
                        require_from_group: 'Either email or address is required',
                        email: 'Sorry your email address is not valid. Please try again'
                    },
                    'ApplicationCategory3ViewModel.ReferencePair.Reference1Address': {
                        require_from_group: 'Either email or address is required'
                    },

                    'ApplicationInternshipsViewModel.ReferencePair.Reference1ContactNumber': {
                        required: 'The reference contact number is required',
                        phoneUK: 'Sorry your telephone number is not valid. Please try again'
                    },


                    'ApplicationInternshipsViewModel.ReferencePair.Reference2ContactNumber': {
                        required: 'The reference contact number is required',
                        phoneUK: 'Sorry your telephone number is not valid. Please try again'
                    },

                    'ApplicationInternshipsViewModel.ReferencePair.Reference1Email': {
                        require_from_group: 'Either email or address is required',
                        email: 'Sorry your email address is not valid. Please try again'
                    },

                    'ApplicationInternshipsViewModel.ReferencePair.Reference1Address': {
                        require_from_group: 'Either email or address is required'
                    },

                    'ApplicationInternshipsViewModel.ReferencePair.Reference2Email': {
                        require_from_group: 'Either email or address is required',
                        email: 'Sorry your email address is not valid. Please try again'
                    },

                    'ApplicationInternshipsViewModel.ReferencePair.Reference2Address': {
                        require_from_group: 'Either email or address is required'
                    },

                    'ApplicationCategory3ViewModel.ReferencePair.Reference2Name': {
                        required: 'This field is required'
                    },
                    'ApplicationCategory3ViewModel.ReferencePair.Reference2ContactNumber': {
                        required: 'This field is required',
                        phoneUK: 'Sorry your telephone number is not valid. Please try again'
                    },
                    'ApplicationCategory3ViewModel.ReferencePair.Reference2Email': {
                        require_from_group: 'Either email or address is required',
                        email: 'Sorry your email address is not valid. Please try again'
                    },
                    'ApplicationCategory3ViewModel.ReferencePair.Reference2Address': {
                        require_from_group: 'Either email or address is required'
                    },
                    'ApplicationCategory4ViewModel.ReferencePair.Reference1Name': {
                        required: 'This field is required'
                    },
                    'ApplicationCategory4ViewModel.ReferencePair.Reference1ContactNumber': {
                        required: 'This field is required',
                        phoneUK: 'Sorry your telephone number is not valid. Please try again'
                    },
                    'ApplicationCategory4ViewModel.ReferencePair.Reference1Email': {
                        require_from_group: 'Either email or address is required',
                        email: 'Sorry your email address is not valid. Please try again'
                    },
                    'ApplicationCategory4ViewModel.ReferencePair.Reference1Address': {
                        require_from_group: 'Either email or address is required'
                    },
                    'ApplicationCategory4ViewModel.ReferencePair.Reference2Name': {
                        required: 'This field is required'
                    },
                    'ApplicationCategory4ViewModel.ReferencePair.Reference2ContactNumber': {
                        required: 'This field is required',
                        phoneUK: 'Sorry your telephone number is not valid. Please try again'
                    },
                    'ApplicationCategory4ViewModel.ReferencePair.Reference2Email': {
                        require_from_group: 'Either email or address is required',
                        email: 'Sorry your email address is not valid. Please try again'
                    },
                    'ApplicationCategory4ViewModel.ReferencePair.Reference2Address': {
                        require_from_group: 'Either email or address is required'
                    },
                    'ApplicationInternshipsViewModel.Internship.WhyUndertakeInternship': {
                        required: 'Please tell us why you want to undertake an internship with Macmillan',
                        maxLength: 'You have exceeded the 3500 character maximum length. Please try again'
                    },
                    'ApplicationInternshipsViewModel.Motivation.Reason': {
                        required: 'Please tell us your main motivation for applying for this role'
                    },
                    'ApplicationInternshipsViewModel.ReferencePair.Reference1Name': {
                        required: 'The full name field is required'
                    },
                    'ApplicationInternshipsViewModel.ReferencePair.Reference2Name': {
                        required: 'The full name field is required'
                    },
                    'ApplicationCategory1ViewModel.Background.CorporatePartnersList': 'Please provide a corporate partner',
                    'ApplicationCategory2ViewModel.Background.CorporatePartnersList': 'Please provide a corporate partner',
                    'ApplicationCategory3ViewModel.Background.CorporatePartnersList': 'Please provide a corporate partner',
                    'ApplicationCategory4ViewModel.Background.CorporatePartnersList': 'Please provide a corporate partner',
                    'ApplicationCancerVoiceViewModel.Background.CorporatePartnersList': 'Please provide a corporate partner',
                    'ApplicationCategory1ViewModel.Background.CorporatePartnerId': 'Please provide a corporate partner',
                    'ApplicationCategory2ViewModel.Background.CorporatePartnerId': 'Please provide a corporate partner',
                    'ApplicationCategory3ViewModel.Background.CorporatePartnerId': 'Please provide a corporate partner',
                    'ApplicationCategory4ViewModel.Background.CorporatePartnerId': 'Please provide a corporate partner',
                    'ApplicationCancerVoiceViewModel.Background.CorporatePartnerId': 'Please provide a corporate partner',
                    'ApplicationCategory1ViewModel.LegalConfirmations.ConfirmAge': 'Please confirm your age',
                    'ApplicationCategory2ViewModel.LegalConfirmations.ConfirmAge': 'Please confirm your age',
                    'ApplicationCategory3ViewModel.LegalConfirmations.ConfirmAge': 'Please confirm your age',
                    'ApplicationCategory4ViewModel.LegalConfirmations.ConfirmAge': 'Please confirm your age',
                    'ApplicationInternshipsViewModel.LegalConfirmations.ConfirmAge': 'Please confirm your age',
                    'ApplicationCancerVoiceViewModel.LegalConfirmations.ConfirmAge': 'Please confirm your age',
                    'ApplicationCategory1ViewModel.LegalConfirmations.ConfirmsInformationAccurate': 'Please confirm that the information is accurate',
                    'ApplicationCategory2ViewModel.LegalConfirmations.ConfirmsInformationAccurate': 'Please confirm that the information is accurate',
                    'ApplicationCategory3ViewModel.LegalConfirmations.ConfirmsInformationAccurate': 'Please confirm that the information is accurate',
                    'ApplicationCategory4ViewModel.LegalConfirmations.ConfirmsInformationAccurate': 'Please confirm that the information is accurate',
                    'ApplicationCancerVoiceViewModel.LegalConfirmations.ConfirmsInformationAccurate': 'Please confirm that the information is accurate',
                    'ApplicationInternshipsViewModel.LegalConfirmations.ConfirmsInformationAccurate': 'Please confirm that the information is accurate',
                    'ApplicationCategory1ViewModel.LegalConfirmations.ConfirmsDataProtection': 'Please confirm that you understand these requirements',
                    'ApplicationCategory2ViewModel.LegalConfirmations.ConfirmsDataProtection': 'Please confirm that you understand these requirements',
                    'ApplicationCategory3ViewModel.LegalConfirmations.ConfirmsDataProtection': 'Please confirm that you understand these requirements',
                    'ApplicationCategory4ViewModel.LegalConfirmations.ConfirmsDataProtection': 'Please confirm that you understand these requirements',
                    'ApplicationCancerVoiceViewModel.LegalConfirmations.ConfirmsDataProtection': 'Please confirm that you understand these requirements',
                    'ApplicationInternshipsViewModel.LegalConfirmations.ConfirmsDataProtection': 'Please confirm that you understand these requirements',
                    'ApplicationEventSupportViewModel.CustomQuestion.AnswerId': 'Please tell us which cheer point you would like to attend',
                    'ApplicationEventSupportViewModel.Motivation.WhySuitableForRole': {
                        required: 'Please tell us a bit about yourself',
                        maxlength: 'Please use 1000 characters or less'
                    },
                    'ApplicationEventSupportViewModel.Background.CorporatePartnerId': 'Please provide a corporate partner',
                    'ApplicationEventSupportViewModel.LegalConfirmations.ConfirmAge': 'Please confirm your age',
                    'ApplicationEventSupportViewModel.LegalConfirmations.ConfirmsInformationAccurate': 'Please confirm that the information is accurate',
                    'ApplicationEventSupportViewModel.LegalConfirmations.ConfirmsDataProtection': 'Please confirm that you understand these requirements',
                    'ApplicationEventSupportViewModel.TShirt.TShirtSize': 'Please select the t-shirt size you would like'
                    

                }
            });
        });
    },

    initialiseTooltips: function () {

        'use strict';

        $(document).on('click', '.hinttrigger', function (event) {
            var $thisHintTrigger = $(event.target),
                $thisToolTip = $thisHintTrigger.parent().next('.form-tooltip');

            event.preventDefault();

            // Show the tooltip if it's not already visible.
            if (!$thisToolTip.is(':visible')) {
                // Hide any other visible tooltips.
                $('.form-tooltip').hide().removeClass('tooltip-on-left');

                // Volunteering adds 'tablet' class on desktop when width reduced.
                if ($('body').hasClass('tablet') || $('body').hasClass('smartphone')) {
                    $thisToolTip.removeAttr('style').fadeIn(200);
                } else {
                    var triggerPosition = $thisHintTrigger.position(),
                        triggerWidth = $thisHintTrigger.width(),
                        positionTooltipOnLeft = (triggerPosition.left + triggerWidth + 20 + $thisToolTip.outerWidth()) > $(window).width() ? true : false,
                        marginTop = '-' + (($thisToolTip.outerHeight(false) / 2) - ($thisHintTrigger.outerHeight(false) / 2)) + 'px',
                        top = $thisHintTrigger.position().top + 'px',
                        left = positionTooltipOnLeft ?
                            (triggerPosition.left - $thisToolTip.outerWidth() - 20) + 'px' :
                            (triggerPosition.left + triggerWidth + 20) + 'px';

                    $thisToolTip.css({ 'margin-top': marginTop, 'top': top, 'left': left }).fadeIn(200);
                    if (positionTooltipOnLeft) {
                        $thisToolTip.addClass('tooltip-on-left');
                    }
                }
            }
        });

        $(document).on('click', '.tooltip-close', function () {
            var $tooltip = $(event.target).parent();
            $tooltip.fadeOut(200, function () {
                $tooltip.removeClass('tooltip-on-left');
            });
        });
    }
};

//  12. Module Exports
//  -----------------
module.exports = {
    init: MacmillanForm.init
};
},{"../../libs/jquery.selectBoxIt.min":14,"./macmillan.functions":4,"jquery-validate":13}],4:[function(require,module,exports){
/*global module*/

//  Macmillan Functions - Modified: 30th July 2015
//  ----------------------------------------------
//  Contains any global functions for Macmillan
//  projects.
//    1. Browser Checks
//    2. Module Exports

var MacmillanFunctions = {
  
  //  1. Browser Checks
  //  -----------------
  //  Use the navigator appVersion to determine 
  //  the version of the browser. Returns anything
  //  -1 if it is the browser being checked
  isIE7: function () {
    'use strict';
    if (navigator.appVersion.indexOf("MSIE 7.") !== -1) {
      return true;
    }
  },
  
  isIE8: function () {
    'use strict';
    if (navigator.appVersion.indexOf("MSIE 8.") !== -1) {
      return true;
    }
  }
};

//  2. Module Exports
//  -----------------
module.exports = {
  isIE7: MacmillanFunctions.isIE7,
  isIE8: MacmillanFunctions.isIE8
};
},{}],5:[function(require,module,exports){
/*global require,module,$*/
/*jslint nomen: true*/

//  Macmillan ListView - Modified: 23 September 2015
//  ------------------------------------------
//    1. Initialisation
//    2. listGenerate
//    3. listClear
//    4. listUpdate
//    5. applyDefaultSort
//    6. bindPaginationEvents
//    7. refreshPaginationElement
//    8. setPaginationPageInput
//    9. setPaginationItemsPerPage
//    10. bindSortingEvents
//    11. getListView
//    12. Module Exports

//  Include Macmillan Functions
var macmillanFunctions = require('./macmillan.functions');

var MacmillanListView = {
    fields: {
        wasLastSearchByLocation: false,
        defaultLocationSort: 'ClosestToLocation',
        defaultLocationSortText: 'Closest to me',
        defaultNonLocationSort: 'EndingSoonest',
        defaultNonLocationSortText: 'Ending soon'
    },

    //  1. Initialisation
    //  -----------------
    //  Initialise the base function
    init: function () {
        'use strict';

        if ($('#list').length > 0) {
            MacmillanListView.bindSortingEvents();
            MacmillanListView.bindPaginationEvents();

            var ret = MacmillanListView.applyDefaultSort();

            if (!ret)
                MacmillanListView.listGenerate();
        }
    },

    //  2. listGenerate
    //  -----------------
    //  Runs an AJAX call to populate the list view with the data
    listGenerate: function () {
        var alertMsg = $('#filtersAlert').find('.alert-message'),
            infoMsg = $('.js-no-results').find('.info-message'),
            resultDivs = $('.js-with-results');

        if (alertMsg.hasClass('active')) {
            alertMsg.hide();
        }

        $('.js-spinner').show();
        $('.search-format').val('List');

        var options = {
            cache: false,
            url: '/Search/SearchJson',
            data: $('#search-form').serialize() + '&' + $('#filter-form').serialize() + '&' + $('#sort-form').serialize(),
            dataType: 'json',
            success: function (data) {

                
                if (data.byLocation) {
                    // Hides region filters if searched by location
                    $('.when-filter').attr('data-height', '138');
                    $('.where-filter').attr('data-height', '30');

                    $('.js-region-filter').hide();
                    // Shows radius filter if searched by location
                    $('.js-radius-filter').show();
                } else {
                    $('.when-filter').attr('data-height', '138');
                    $('.where-filter').attr('data-height', '490');

                    // Shows region filters if not searched by location
                    $('.js-region-filter').show();
                    // Hides radius filter if not searched by location
                    $('.js-radius-filter').hide();
                }

                // Set hidden input to flag whether this search was by location.
                MacmillanListView.fields.wasLastSearchByLocation = data.byLocation;

                // Displays the number of results.
                $('#totalRecords').html(data.totalRecords);
                $('.js-results-number').html(data.totalRecords);

                if (parseInt(data.opportunities.length) === 0) {
                    resultDivs.hide();
                    $('.pagination').hide();
                    infoMsg.show();
                } else {
                    infoMsg.hide();
                    resultDivs.show();
                    // Construct result divs.
                    var html = [];

                    $.each(data.opportunities, function (index, item) {
                        if (item.isHighLighted === true) {
                            html.push('<div class="result highlighted">', '<p>Highlighted opportunity</p>', '<h3 class="small">');
                        } else {
                            html.push('<div class="result">', '<h3 class="small">');
                        }

                        // appends home icon for home based opportunities
                        if (item.isHomeBased === true) {
                            html.push('<span class="icon icon-home"></span>');
                        }

                        // appends highlighted div for highlighted opportunity
                        if (item.isHighLighted === true) {
                            html.push('<span class="icon icon-star"></span>');
                        }

                        // appends ribon icon for highlighted opportunity
                        if (item.isHighLighted === true && item.isHomeBased === true) {
                            html.push('<span class="icon icon-star"></span>');
                        }

                        html.push('<a href="/Opportunity/Details/',
                            item.opportunityId,
                            '">',
                            item.title,
                            '</a>',
                            '</h3>',
                            '<p class="xsmall distance">',
                            item.distance,
                            '</p>',
                            '<p class="small">',
                            item.categories,
                            '</p>',
                            '<p class="xsmall">',
                            item.date,
                            '</p>',
                            '</div>');
                    });

                    $('.js-results-list').append(html.join(''));

                    if (data.pagingInfo !== undefined) {
                        MacmillanListView.refreshPaginationElement(data.pagingInfo);
                        $('.pagination').show();
                    } else {
                        $('.pagination').hide();
                    }
                }

                $('.js-spinner').hide();
                if (alertMsg.hasClass('active')) {
                    alertMsg.show();
                }
            }
        };

        $.ajax(options);

    },

    //  3. listClear
    //  -----------------
    //  Deletes the list of results
    listClear: function () {
        $('.js-results-list').empty();
    },

    //  4. listUpdate
    //  -----------------
    //  Clears the list view and then runs an AJAX call to
    //  repopulate the list view with the updated data
    listUpdate: function (stayOnTargetPage, dontTouchMySort) {

        MacmillanListView.listClear();

        if (stayOnTargetPage !== true) {
            MacmillanListView.setPaginationPageInput(1);
        }
        if (dontTouchMySort !== true) {
            var ret = MacmillanListView.applyDefaultSort();
        }

        if (!ret)
            MacmillanListView.listGenerate();
    },

    //  5. applyDefaultSort
    //  -----------------
    //  Apply default sort for current search based on any applicable business rules.
    //  Note - this must be done before serialising search criteria.
    applyDefaultSort: function () {
        if (!MacmillanListView.fields.wasLastSearchByLocation && $('#Location').val()) {
            // Set default location sort when switching to searching by location.
            var $defaultLocationSort = $('#SortType option[value=' + MacmillanListView.fields.defaultLocationSort + ']');
            if ($defaultLocationSort.length > 0) {
                $('#SortType option:selected').removeAttr('selected');
                $defaultLocationSort.attr('selected', 'selected');
                var selectBox = $("#SortType").selectBoxIt().data("selectBox-selectBoxIt");
                selectBox.selectOption(MacmillanListView.fields.defaultLocationSortText);
                $('#SortTypeSelectBoxIt .selectboxit-text').html(MacmillanListView.fields.defaultLocationSortText);

                return true;
            }
        } else if (MacmillanListView.fields.wasLastSearchByLocation && $('#Location').val() === '') {
            // Set default location sort when switching from searching by location.
            var $defaultNonLocationSort = $('#SortType option[value=' + MacmillanListView.fields.defaultNonLocationSort + ']');
            if ($defaultNonLocationSort.length > 0) {
                $('#SortType option:selected').removeAttr('selected');
                $defaultNonLocationSort.attr('selected', 'selected');
                var selectBox = $("#SortType").selectBoxIt().data("selectBox-selectBoxIt");
                selectBox.selectOption(MacmillanListView.fields.defaultNonLocationSortText);
                $('#SortTypeSelectBoxIt .selectboxit-text').html(MacmillanListView.fields.defaultNonLocationSortText);

                return true;
            }
        }

        return false;
    },

    //  6. bindPaginationEvents
    //  -----------------
    //  Bind events for pagination elements to their handlers.
    bindPaginationEvents: function () {
        // Page size selector.
        $('.pagination [data-page-size]').unbind().click(function () {
            MacmillanListView.setPaginationItemsPerPage($(this).attr('data-page-size'));
            MacmillanListView.listUpdate();
            $(document).scrollTop($('.search-bar').offset().top);
        });

        // Page selector.
        $('.pagination [data-target-page]').unbind().click(function () {
            if ($(this).hasClass('disabled')) {
                return false;
            }

            MacmillanListView.setPaginationPageInput($(this).attr('data-target-page'));
            MacmillanListView.listUpdate(true);
            $(document).scrollTop($('.search-bar').offset().top);
        });
    },

    //  7. refreshPaginationElement
    //  -----------------
    //  Refreshes a page element containing pagination controls.
    refreshPaginationElement: function (pagingInfo) {

        var totalPages = Math.ceil(pagingInfo.totalRecords / pagingInfo.itemsPerPage);
        var currentRange = Math.ceil(pagingInfo.currentPageNum / pagingInfo.pageGroupingOnPage) - 1;
        var startPage = pagingInfo.pageGroupingOnPage * currentRange + 1;
        var endPage = Math.min(startPage + pagingInfo.pageGroupingOnPage - 1, totalPages);
        var currentPage = pagingInfo.currentPageNum;

        var fullpagination = $('.pagination > .page-menu.full-pagination');
        var shortpagination = $('.pagination > .page-menu.short-pagination');

        $(fullpagination).html('');
        $(shortpagination).html('');

        if (currentPage > 1) {
            fullpagination.append('<li class="page-previous-page"><button type="button" data-target-page="' + (currentPage - 1) + '">Prev</button></li>');
            shortpagination.append('<li class="page-previous-page"><button type="button" data-target-page="' + (currentPage - 1) + '">Previous</button></li>');
        } else {
            shortpagination.append('<li class="page-previous-page"><span class="hidden">Previous</span></li>');
        }

        for (var n = startPage; n <= endPage; ++n) {
            if (n == currentPage) {
                fullpagination.append('<li class=""><button type="button" class="active" disabled data-target-page="' + n + '">' + '<span class="hidden">Page: </span>' + n + '</button></li>');
            } else {
                fullpagination.append('<li class=""><button type="button" data-target-page="' + n + '">' + '<span class="hidden">Page: </span>' + n + '</button></li>');
            }
        }
        shortpagination.append('<li class="page-number">Page: <span>' + currentPage + '</span></li>');

        if (currentPage != totalPages) {
            fullpagination.append('<li class="page-next-page"><button type="button" data-target-page="' + (currentPage + 1) + '">Next</button></li>');
            shortpagination.append('<li class="page-next-page"><button type="button" data-target-page="' + (currentPage + 1) + '">Next</button></li>');
        }
        else {
            shortpagination.append('<li class="page-next-page"><span class="hidden">Next</span></li>');
        }

        MacmillanListView.bindPaginationEvents();
    },

    //  8. setPaginationPageInput
    //  -----------------
    //  Sets the page number to be requested.
    setPaginationPageInput: function (page) {
        $('.pagination-page').val(page);
    },

    //  9. setPaginationItemsPerPage
    //  -----------------
    //  Sets the number of list results be request per page.
    setPaginationItemsPerPage: function (itemsPerPage) {
        $('.pagination-items-per-page').val(itemsPerPage);
    },

    //  10. bindSortingEvents
    //  -----------------
    //  Bind events for sort elements to their handlers.
    bindSortingEvents: function () {
        $('.js-sorting-filter').on('change', function () {
            if ($('#list').length > 0) {
                MacmillanListView.listUpdate(false, true);
                $('#filtersAlert').find('.alert-message').addClass('active');
            }
        });
    },

    //  11. getListView
    //  -----------------
    //  
    getListView: function () {
        // Get the partial view 1. Ajax call
        $.ajax({
            url: '/Search/GetListview',
            data: $('#search-form').serialize() + '&' + $('#filter-form').serialize() + '&' + $('#sort-form').serialize(),
            success: function (data) {

                $('#ResultView').empty();
                $('#ResultView').append(data);
                // Rebind events now the associated elements are in the DOM.
                MacmillanListView.bindSortingEvents();
                MacmillanListView.bindPaginationEvents();
                // Populate the list 2. Ajax call
                MacmillanListView.listUpdate();
                // Rebuild the selectbox
                $('select').selectBoxIt();
            }
        });
    }
};

//  12. Module Exports
//  -----------------
module.exports = {
    init: MacmillanListView.init,
    update: MacmillanListView.listUpdate,
    show: MacmillanListView.getListView
};

},{"./macmillan.functions":4}],6:[function(require,module,exports){
/*global require,module,$*/
/*jslint nomen: true*/

//  Macmillan Map - Modified: 11 August 2015
//  ------------------------------------------
//    1. Module Requires
//    2. Initialisation
//    3. Module Exports

//  1. Module Requires
//  ------------------

//  Include Macmillan Functions
var macmillanFunctions = require('./macmillan.functions');
var leafletJs = require('../../libs/leaflet');
var leafletMarkerCluster = require('../../libs/leaflet.markercluster');

// Markers Variable
var markers,
    myIcon = L.icon({
        iconUrl: '../Content/images/macmillan-marker.png',
        shadowUrl: '../Content/images/macmillan-marker-shadow.png',
        iconSize: [30, 36],
        iconAnchor: [15, 36],
        shadowSize: [49, 30],
        shadowAnchor: [10, 27],
        popupAnchor: [-156, 0]
    });
var map;

var MacmillanMap = {

    //  2. Initialisation
    //  -----------------
    //  Initialise the base function
    init: function () {

        'use strict';

        if ($('#map').length > 0) {
            MacmillanMap.mapGenerate();
            //MacmillanMap.filterHide();
        }

        if ($('#opportunity-map').length > 0) {
            var lat = $('#opportunity-map').attr('data-lat'),
                lng = $('#opportunity-map').attr('data-lng');

            if (lat && lng) {
                MacmillanMap.opMapGenerate(lat, lng);
            } else {
                $('#opportunity-map').hide();
            }
        }

        if ($('#opportunity-map-mobile').length > 0) {
            var lat = $('#opportunity-map').attr('data-lat'),
                lng = $('#opportunity-map').attr('data-lng');

            if (lat && lng) {
                MacmillanMap.mobileMapGenerate(lat, lng);
            } else {
                $('#opportunity-map-mobile').hide();
            }
        }
    },

    messageShow: function () {
        $('.js-info-message').show();
        
        $('.js-message-close').on('click', function (e) {
            e.preventDefault();
            $('.js-info-message').hide();
            $('#map').attr('tabindex', -1).focus();
        });
    },

    messageClose: function () {
        $('.js-message-close').on('click', function (e) {
            e.preventDefault();
            $('.js-info-message').hide();
            $('#map').attr('tabindex', -1).focus();
        });
    },

    filterHide: function () {

        $('#map').on('mousedown', function () {
            $('.map-filters').css({ 'height': '160px' });
            $('.keywords-wrapper').prev('.sub-title').html('<a href="#" class="show-filters">Show Filters</a>');
        });

        $('.filter-wrapper .sub-title').on('click', function (e) {
            e.preventDefault();
            $('.keywords-wrapper').prev('.sub-title').html('Keywords');
            $('.map-filters').css({ 'height': '1000px' });
        });

    },

    mapGenerate: function (filterArray) {

        //var southWest = L.latLng(49.87471224890479, -14.239404),
        //    northEast = L.latLng(59.119587533804996, 3.64833984375),
        //    bounds = L.latLngBounds(southWest, northEast);


        var southWest = L.latLng(48.57471224890479, -14.239404),
            northEast = L.latLng(60.919587533804996, 3.64833984375),
            bounds = L.latLngBounds(southWest, northEast);

        //  Create a new map
        map = L.map('map', {
            attributionControl: false,
            maxBounds: bounds,
            minZoom: 6,
            zoomControl: false,
            zoomAnimation: false,
            zoom: 6
        });

        //  Set the title layerhttp://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png
        //L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png').addTo(map);
        var tile_layer = L.tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png');
        tile_layer.addTo(map);

        // Accessibility: add aria-hidden to tile images once map is fully loaded
        tile_layer.on('load', function () {
            $("#map img").attr('aria-hidden', 'true');
        });


        //  Add the zoom controls to the right side of the map
        new L.Control.Zoom({ position: 'topright' }).addTo(map);

        markers = new L.MarkerClusterGroup({ showCoverageOnHover: false, spiderfyOnMaxZoom: false });

        MacmillanMap.loadData(filterArray);

        markers.on('click', function (a) {
            var popupHeight = $(a.layer._popup._container).height() - 45;
            $(a.layer._popup._container).parent().css({ 'margin-top': popupHeight + 'px' });
        });

        markers.on('clusterclick', function (a) {
            if (a.layer._childClusters.length === 0) {

                $('.leaflet-popup-pane').css({ 'margin-top': '0px' });

                var offset = [],
                    results = a.layer._childCount;

                if (results === 2) {
                    offset = [-170, 356];
                }

                if (results >= 3) {
                    offset = [-170, 446];
                }

                var content = '<div class="result-number">' + results + ' results in this location</div><ul class="result-inner-wrapper">';

                for (var i = 0; i < a.layer._markers.length; i++) {
                    content += '<li>';
                    content += a.layer._markers[i]._popup._content;
                    content += '</li>';
                }

                content += '</div></div>';

                L.popup({ className: 'clustered-popup', maxWidth: 327, offset: offset })
                .setLatLng([a.layer._cLatLng.lat, a.layer._cLatLng.lng])
                .setContent(content)
                .openOn(map);
            }
        });

        map.addLayer(markers);
    },

    loadData: function (filterArray) {

        var ajax = $.ajax({
            url: '/Search/SearchJson',
            dataType: 'json',
            data: filterArray,
            success: function (data) {

                if (data.byLocation) {
                    // hides region filters if searched by location
                    $('.js-region-filter').hide();
                    // shows radius filter if searched by location
                    $('.js-radius-filter').show();
                } else {
                    // shows region filters if not searched by location
                    $('.js-region-filter').show();
                    // hides radius filter if not searched by location
                    $('.js-radius-filter').hide();
                }

                if (data.location[0] != null && data.location[1] != null) {
                    map.setView(data.location, 9, { reset: true });
                } else {
                    map.setView([55, -5], 6, { reset: true });
                }

                $('#totalRecords').html(data.totalRecords);

                var geoLayer = L.geoJson(data.opportunities, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { icon: myIcon });
                    },
                    onEachFeature: function (feature, layer) {
                        var message = feature.message.split(', '),
                            formattedMessage = '';
                        $.each(message, function (i) {
                            formattedMessage += '<div class="message-line">' + message[i] + '</div>';
                        });
                        layer.bindPopup(
                            '<a class="title" href="/Opportunity/Details/' + feature.opportunityId + '">' + feature.title + '</a><div class="distance">' + feature.distance + '</div><div class="date">' + feature.date + '</div><div class="message">' + formattedMessage + '</div>');
                    }
                });

                markers.addLayer(geoLayer);

            }

        });
    },

    opMapGenerate: function (lat, lng) {

        //  Create a new map
        var opMap = L.map('opportunity-map', {
            attributionControl: false,
            zoomControl: false,
            center: [lat, lng],
            zoom: 13,
            dragging: false,
            touchZoom: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            keyboard: false
        });

        //  Set the title layer
        //L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png').addTo(opMap);
        var tile_layer = L.tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png');
        tile_layer.addTo(opMap);

        // Accessibility: add aria-hidden to tile images once map is fully loaded
        tile_layer.on('load', function () {
            $("#opportunity-map img").attr('aria-hidden', 'true');
        });

        //  Custom marker icon
        var myIcon = L.icon({
            iconUrl: '../../Content/images/macmillan-marker.png',
            shadowUrl: '../../Content/images/macmillan-marker-shadow.png',
            iconSize: [30, 36],
            iconAnchor: [15, 36],
            shadowSize: [49, 30],
            shadowAnchor: [10, 27]
        });

        var marker = L.marker([lat, lng], { icon: myIcon, clickable: false, keyboard: false });

        opMap.addLayer(marker);
    },

    mobileMapGenerate: function (lat, lng) {
        
        //  Create a new map
        var opMap = L.map('opportunity-map-mobile', {
            attributionControl: false,
            zoomControl: false,
            center: [lat, lng],
            zoom: 11,
            dragging: false,
            touchZoom: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            keyboard: false
        });

        //  Set the title layer
        //L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png').addTo(opMap);

        var tile_layer = L.tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png');
        tile_layer.addTo(opMap);

        // Accessibility: add aria-hidden to tile images once map is fully loaded
        tile_layer.on('load', function () {
            $("#opportunity-map-mobile img").attr('aria-hidden', 'true');
        });

        //  Custom marker icon
        var myIcon = L.icon({
            iconUrl: '../../Content/images/macmillan-marker.png',
            shadowUrl: '../../Content/images/macmillan-marker-shadow.png',
            iconSize: [30, 36],
            iconAnchor: [15, 36],
            shadowSize: [49, 30],
            shadowAnchor: [10, 27]
        });

        var marker = L.marker([lat, lng], { icon: myIcon, clickable: false, keyboard: false });

        opMap.addLayer(marker);
    },

    clearMap: function () {
        markers.clearLayers();
    },

    //  Clears the map and then runs an AJAX call to
    //  repopulate the map with the correct data
    mapUpdate: function (filterArray) {

        MacmillanMap.clearMap();

        var ajax = $.ajax({
            url: '/Search/SearchJson',
            dataType: 'json',
            data: filterArray,
            success: function (data) {

                if (data.byLocation) {
                    // hides region filters if searched by location
                    $('.js-region-filter').hide();
                    // shows radius filter if searched by location
                    $('.js-radius-filter').show();
                } else {
                    // shows region filters if not searched by location
                    $('.js-region-filter').show();
                    // hides radius filter if not searched by location
                    $('.js-radius-filter').hide();
                }

                if (data.location[0] != null && data.location[1] != null) {
                    map.setView(data.location, 9, { reset: true });

                } else {
                    map.setView([53, -3], 6, { reset: true });
                }

                $('#totalRecords').html(data.totalRecords);

                var geoLayer = L.geoJson(data.opportunities, {
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, { icon: myIcon });
                    },
                    onEachFeature: function (feature, layer) {
                        var message = feature.message.split(', '),
                            formattedMessage = '';
                        $.each(message, function (i) {
                            formattedMessage += '<div class="message-line">' + message[i] + '</div>';
                        });
                        layer.bindPopup(
                            '<a class="title" href="/Opportunity/Details/' + feature.opportunityId + '">' + feature.title + '</a><div class="distance">' + feature.distance + '</div><div class="date">' + feature.date + '</div><div class="message">' + formattedMessage + '</div>');
                    }
                });

                markers.addLayer(geoLayer);

                map.fitBounds(geoLayer.getBounds());
            }

        });
    },

    getMapView: function (filterArray, mobile) {
        // Get the partial view 1. Ajax call
        var ajax = $.ajax({
            url: '/Search/GetMapview',
            data: $('#search-form').serialize() + '&' + $('#filter-form').serialize() + '&' + $('#sort-form').serialize(),
            success: function (data) {

                if (mobile) {

                    // Append map view to a position absolute div
                    // with a close icon. Will need to reset the "map" button
                    // to not be clicked once the map is closed.

                    $('body').append('<div class="map-overlay"><a class="js-map-close-icon map-close-icon" href="#"><span aria-hidden="true">x</span> <span class="hidden">Close map</span></a></div>');
                    $('.map-overlay').append(data);

                    //Focus on map overlay DIV
                    $('.map-overlay').attr('tabindex', -1).focus();

                    $('.js-map-close-icon').on('click', function (event) {
                        event.preventDefault();
                        $('.btn.map-view').removeClass('inactive');
                        $('.btn.list-view').addClass('inactive');
                        $('.map-overlay').remove();
                        $('.search-format').val('List'); // Need to set the search format back to List when leaving Map view.
                    });
                    $('.btn.list-view').removeClass('inactive');
                    $('.btn.map-view').addClass('inactive');

                } else {
                    $("#ResultView").empty();
                    $("#ResultView").append(data);
                }
                MacmillanMap.mapGenerate(filterArray);
                if ($('.js-not-region input').is(':checked')) {
                    MacmillanMap.messageShow();
                } else {
                    MacmillanMap.messageClose();
                }
            }
        });
    }
};

//  4. Module Exports
//  -----------------
module.exports = {
    init: MacmillanMap.init,
    update: MacmillanMap.mapUpdate,
    show: MacmillanMap.getMapView,
    message: MacmillanMap.messageShow
};
},{"../../libs/leaflet":15,"../../libs/leaflet.markercluster":16,"./macmillan.functions":4}],7:[function(require,module,exports){
/*global require,module,$*/
/*jslint nomen: true*/

//  Macmillan Sub Navigation - Modified: 23 October 2015
//  ------------------------------------------
//    1. Initialisation
//    2. setSubNav
//    3. setDeviceClass
//    4. cssCalcAvailable
//    5. buildSubNav
//    6. moreMenuInteractions
//    7. touchEvents
//    8. handleFocusState
//    9. alignSubMenus
//    10. Module Exports

//  Include Macmillan Functions
var macmillanFunctions = require('./macmillan.functions');

var MacmillanSubNavigation = {

    //  1. Initialisation
    //  -----------------
    //  Initialise the base function
    init: function () {

        'use strict';

        var _this = this;

        MacmillanSubNavigation.buildSubNav();
        MacmillanSubNavigation.setDeviceClass();
        MacmillanSubNavigation.setSubNav();

        $(window).on('resize', function () {
            MacmillanSubNavigation.setDeviceClass();
            MacmillanSubNavigation.setSubNav();
        });
    },

    
    
    //  2. setSubNav
    //  -----------------
    //  sets different nav functionalities depending on the device type
    setSubNav: function () {

        'use strict';

        //check the current body classes
        if (!$('body').hasClass('smartphone')) {
            MacmillanSubNavigation.alignSubMenus();
        }

        if ($('body').hasClass('tablet') || $('body').hasClass('smartphone')) {
            // tablet and smartphone
            MacmillanSubNavigation.touchEvents();
        } else {
            // desktop
            MacmillanSubNavigation.moreMenuInteractions();
            MacmillanSubNavigation.handleFocusState();
        }
    
    },
    
    //  3. setDeviceClass
    //  -----------------
    //  sets class to body element on various window widths
    setDeviceClass: function () {

        'use strict';

        var windowSize = $(window).width(),
            smallBreakPoint = 640,
            largeBreakPoint = 1000,
            bodyEl = $('body');

        if (windowSize <= (smallBreakPoint - 1)) {
            bodyEl.removeClass('tablet');
            bodyEl.addClass('smartphone');
        }

        else if (windowSize <= (largeBreakPoint - 1)) {
            bodyEl.removeClass('smartphone');
            bodyEl.addClass('tablet');
        }

        else if (windowSize >= largeBreakPoint) {
            bodyEl.removeClass();
        }

    },

    //  4. cssCalcAvailable
    //  -----------------
    //  Initialise the base function
    cssCalcAvailable: function () {

        'use strict';

        var prop = 'width:',
            value = 'calc(10px);',
            el = document.createElement('div'),
            iosRegex = /(iPad|iPhone);.*CPU.*OS [0-7]/i, // iOS 7 has broken viewport unit implementation, detect that too
            badiOS = iosRegex.test(navigator.userAgent),
            result = !badiOS && !!el.style.length; // DEBUG

        el.style.cssText = "width:calc(10px);width:-webkit-calc(10px);width:-moz-calc(10px);width:-o-calc(10px);width:-ms-calc(10px);";

        return !badiOS && !!el.style.length;
    },

    //  5. buildSubNav
    //  -----------------
    //  Initialise the base function
    buildSubNav: function () {

        'use strict';

        // first run doesn't calc width correctly, do it again
        $(window).load(resetFunc);

        // calculate device width and apply pixel width values
        // this is required for older devices that do not support csscalc
        if (!MacmillanSubNavigation.cssCalcAvailable()) {
            var deviceWidth = Math.min(1000, $(window).width());
            $('.tab-content, .tab-content-wrapper').css({ "width": deviceWidth - 24 });

            if (deviceWidth <= 1024) {
                $('.sub-navigation-list').css({ "max-width": deviceWidth });
                $('.sub-navigation-cts ~ .sub-navigation-list').css({ "max-width": deviceWidth - 325 });
            } else {
                $('.sub-navigation-list').css({ "max-width": deviceWidth });
                $('.sub-navigation-cts ~ .sub-navigation-list').css({ "max-width": deviceWidth - 305 });
            }
        }

        var $menuContainer = $('.js-sub-navigation'),
            $menuItem = $('.js-sub-navigation-list > li').not('.js-more-items'),
            $menu = $('.js-sub-navigation-list'),
            $moreItems = $('.js-more-items'), // items which don't fit go in here
            moreItemsWidth = $moreItems.outerWidth(true), // width of the 'more-items' list item
            lastAddedWidth = 0,
            totalMenuWidth = 0, // total width of list items
            resetTime = 100,
            lastWidth = $(window).width();

        $menuItem.each(function (index) {

            lastAddedWidth = Number($(this).outerWidth());
            totalMenuWidth += lastAddedWidth;

            // Show 'More' option if the menu width exceeds the maximum width of the container
            if (totalMenuWidth > $menu.outerWidth()) {
                // this item isn't going to fit in the main nav so
                $moreItems.addClass('active'); // display 'more' menu
                $(this).addClass('js-hidden-item'); // hide the item which won't fit /
            } else {
                $(this).removeClass('js-hidden-item');
            }
        });

        // handle keyboard navigation
        $menuContainer.keyup(function (e) {
            var $this = $(e.target), // keyup target is the newly focussed element instead of old
                key = e.keyCode || e.which;

            // go down a level on enter
            if (key === 13 && $this.is('li:has(ul)')) { // is an expandable item, key was enter
                $this.addClass('sfhover'); // force show dropdown
                $this.find('>ul>li>a, >ul>li:has(ul)').attr('tabindex', '0'); // make sub-items tab-able

                // focus the first sub-item
                if ($this.hasClass('js-more-items')) {
                    // we dunno if it's gonna be a top level list or link
                    var nextElem = $this.find('>ul>li').eq(0);
                    nextElem = nextElem.find('>a').length > 0 ? nextElem.find('>a') : nextElem;
                    nextElem.focus();
                } else {
                    $this.find('>ul>li a').eq(0).focus();
                }

                $this.on('focusout', function (e) {
                    // focus lost from expandable item
                    if (!($.contains($this.get(0), (e.relatedTarget || e.toElement)))) {
                        $this.removeClass('sfhover'); // hide dropdown
                        $this.find('>ul>li>a, >ul>li:has(ul)').attr('tabindex', '-1'); // make sub-items not tab-able
                        $this.off('focusout'); // remove handler til next time
                    }
                });
            }

            // go up a level on esc
            if (key === 27 && $this.closest('li:has(ul)').length > 0) { // esc key, is a sub menu item
                $this.closest('li:has(ul)').focus(); // focus up one level
            }
        });

        if ($('.js-hidden-item span').hasClass('sub-navigation-selected')) {
            $moreItems.addClass('sub-navigation-selected').find('span').first().addClass('sub-navigation-selected');
        }

        // move all items which don't fit in to the 'more' menu
        $moreItems.find('> ul').append($('.js-hidden-item'));

        // make sure 'more' isn't pushed on to next line
        if ($moreItems.hasClass('active')) {
            totalMenuWidth = 0;
            var visibleItems = $menuItem.filter(':visible');

            visibleItems.each(function () {
                totalMenuWidth += $(this).outerWidth(true);
            });
            totalMenuWidth += $moreItems.outerWidth(true);
            //totalMenuWidth -= lastAddedWidth;

            while ($menu.width() > $moreItems.width() && totalMenuWidth > $menu.width()) {
                visibleItems = $menuItem.filter(':visible'); // refresh the list
                var prevItem = visibleItems.eq(visibleItems.length - 1);
                var prevWidth = prevItem.outerWidth(true); // get this before hiding or it's wrong
                prevItem.addClass('js-hidden-item').prependTo($moreItems.find('>ul'));
                totalMenuWidth -= prevWidth;
            }
        }

        // update tabindex for 'more-items' sub-menus/links
        // stop focus disappearing in to invisible menus
        $moreItems.find('> ul li[tabindex], > ul li a').attr('tabindex', '-1');

        $(window).on('resize orientationchange', function (e) {
            // don't need to do anything if only height changed
            if (widthChanged()) {

                //close menu on devices the do not support css calc()
                //This will allow the menu items to be recalculated correctly - RobW
                if (!MacmillanSubNavigation.cssCalcAvailable()) {
                    $('.current').removeClass('current');
                }

                // don't let stuff overflow while resizing
                $menuContainer.css('overflow', 'hidden');
                // applies to touch devices and only if width changed
                if ($('body').hasClass('tablet') || $('body').hasClass('smartphone')) {
                    $('.sub-navigation-indicator').removeClass('sub-navigation-indicator-active');
                }

                if ($('body').hasClass('smartphone')) {
                    $('.js-sub-navigation').removeAttr('style');
                }

                clearTimeout(this.id);
                // prevents window resize from firing twice
                this.id = setTimeout(resetFunc, resetTime);
            }
        });

        function widthChanged() {
            var newWidth = $(window).width(),
                changed = (newWidth !== lastWidth);
            lastWidth = newWidth;
            return changed;
        }

        function maxMenuWidth(elWidth) {
            var $navList = $('.js-sub-navigation-list'),
                moreWidth = $('.js-more-items').outerWidth(), // temporarily force it to fill space
                availWidth = parseFloat($navList.css('width')); // remove any trace we were here

            return availWidth;
        }

        function resetFunc() {
            // restore full navigation list and re-evaluate which items can fit
            $menuContainer.css('overflow', 'visible');
            // make top level items focusable again
            $moreItems.find('> ul li[tabindex], > ul li a').attr('tabindex', '0');

            $moreItems.find('> ul').children('.js-hidden-item').insertBefore('.js-more-items');
            $moreItems.find('> ul li').removeClass('.js-hidden-item');
            $moreItems.removeClass('active');
            MacmillanSubNavigation.buildSubNav();
            // update lastWidth reference now that we've rebuilt
            lastWidth = $(window).width();
        }
    },

    //  6. moreMenuInteractions
    //  -----------------
    //  Initialise the base function
    moreMenuInteractions: function () {

        'use strict';
        
        // update appearance of 3rd level subnavs
        var $moreThirdLevelListItem = $('.more-items > ul .sub-navigation-indicator + ul > li');
        $moreThirdLevelListItem.hover(
            function () {
                $(this).parent().parent().addClass('active-level-3');
            }, function () {
                $(this).parent().parent().removeClass('active-level-3');
            }
        );

    },

    //  7. touchEvents
    //  -----------------
    //  Initialise the base function
    touchEvents: function () {

        'use strict';

        // handles sticky nav item show/hide on touch devices
        // also closes nav items when touching outside
        $('body').on('click', function (e) {
            var $clickEl = $(e.target),
                activeClassName = 'sub-navigation-indicator-active',
                subNavIndicitarBool = $($clickEl.parents('.js-sub-navigation-list').find('.' + activeClassName)).hasClass(activeClassName),
                clickElClass = $clickEl.attr('class'),
                patt = /^sub-navigation-indicator/g,
                classTest = patt.test(clickElClass), // click was on a nav element
                navContainer = $('.js-sub-navigation');

            function closeMainMenu() {
                var mainMenu = $('#main-header').find('.toggle-nav>a.active');
                if (mainMenu.length) {
                    mainMenu.click();
                }
            }

            if (classTest && subNavIndicitarBool) { // item is at least one level deep
                closeMainMenu();
                if ($clickEl.hasClass(activeClassName)) { // if clicked active item
                    $clickEl.removeClass(activeClassName); // deactivate it
                    $clickEl.next().find('.' + activeClassName).removeClass(activeClassName); // as well as any active children
                } else { // if clicked inactive item
                    $clickEl.parent().siblings().find('.' + activeClassName).removeClass(activeClassName); // deactivate any active siblings
                    $clickEl.addClass(activeClassName); // and activate this one
                }
            } else if (classTest) { // top level item
                closeMainMenu();
                if ($clickEl.hasClass(activeClassName)) { // if active
                    $clickEl.removeClass(activeClassName); // deactivate
                } else { // if clicked inactive item
                    $clickEl.parent().find('.' + activeClassName).removeClass(activeClassName); // deactive siblings
                    $clickEl.addClass(activeClassName); // you guessed it, activate this one
                }
            } else { // clicked outside nav
                $('.sub-navigation-indicator').removeClass(activeClassName);
            }

            if ($('body').hasClass('smartphone')) { // adjust margin to push content below open nav
                var openNav = navContainer.find('li>span.' + activeClassName + '~ul').eq(0);
                navContainer.css('margin-bottom', openNav.length ? openNav.outerHeight() + 15 : '');
            }
        });
    },

    //  8. handleFocusState
    //  -----------------
    //  Initialise the base function
    handleFocusState: function () {

        'use strict';

        // track if focus caused by key or mouse

        var $menuContainer = $('.js-sub-navigation');
        var keypress;

        $('body').on('keydown mousedown', function (e) {
            keypress = (e.type === 'keydown');
            //console.log(keypress);
        });
        // don't let mouse trigger focus styles
        $menuContainer.on('focusin', '.js-sub-navigation-list li:has(ul), .tab-link.cts', function (e) {
            //console.log('focusin, keypress is ' + keypress);
            if (!keypress) {
                $(e.target).blur();
            }
        });
    },

    //  9. alignSubMenus
    //  -----------------
    //  Initialise the base function
    alignSubMenus: function () {

        'use strict';

        var $menuContainer = $('.js-sub-navigation'),
            $wrapper = $('.sub-navigation-wrapper'),
            isTablet = $('body').hasClass('tablet'), // tablet expands on click instead of hover
            eventName = isTablet ? 'click' : 'mouseenter'; // cancels click event if you do anything on mouseenter

        $menuContainer.find('li:has(ul)').on(eventName, function (e) {
            // recalc as they change with resize
            var leftLimit = $wrapper.offset().left,
                rightLimit = leftLimit + $wrapper.width(),
                $subMenu = $(e.currentTarget).find('ul').eq(0);

            if ($subMenu.length) {
                if (!isTablet) e.stopPropagation(); // don't need to trigger on parent too

                var subLeft = $(e.currentTarget).offset().left,
                    subRight = subLeft + $subMenu.outerWidth();

                // check it's not overflowing
                if (subRight > rightLimit && !$subMenu.is('.js-more-items ul *')) {
                    $subMenu.css({
                        left: 'auto',
                        right: '0'
                    });
                } else if (subLeft < leftLimit) {
                    $subMenu.css({
                        left: '0',
                        right: 'auto'
                    });
                }
            }
        });
    }
};

//  10. Module Exports
//  -----------------
module.exports = {
    init: MacmillanSubNavigation.init
};

},{"./macmillan.functions":4}],8:[function(require,module,exports){
/*global require,module,$*/
/*jslint nomen: true*/

//  PageScroll - Modified: 16th November 2015
//  ------------------------------------------
//    1. Initialisation
//    2. Scroll Up
//    3. Module Exports

//  Include Macmillan Functions
var macmillanFunctions = require('./macmillan.functions');

var PageScroll = {

    //  1. Initialisation
    //  -----------------
    //  Initialise the base function
    init: function () {

        'use strict';

        PageScroll.scrollUp();
    },

    //  2. scrollUp
    //  -----------------
    //  Scrolls to top of the page with animation
    scrollUp: function () {

        'use strict';

        $('.js-page-scroll').on('click', function () {

            // Removes the focus
            $(this).blur();

            $('html, body').animate({
                scrollTop: 0
            }, 400);
            return false;
        });
          
    }
};

// 3. Module Exports
//  -----------------
module.exports = {
    init: PageScroll.init
};
},{"./macmillan.functions":4}],9:[function(require,module,exports){
/*global require,module,$*/
/*jslint nomen: true*/

//  Profile - Modified: 16th October 2015
//  ------------------------------------------
//    1. Initialisation
//    2. Edit mode
//    3. Module Exports

//  Include Macmillan Functions
var macmillanFunctions = require('./macmillan.functions');

var Profile = {

    //  1. Initialisation
    //  -----------------
    //  Initialise the base function
    init: function () {

        'use strict';

        Profile.editMode();
    },

    //  2. Edit Mode
    //  -----------------
    //  Enter and exit profile edit mode
    editMode: function () {

        'use strict';

        var editableSection = $('.js-editable'),
            editBtn = $('.js-edit-btn'),
            readOnlySection = $('.js-read-only'),
            cancelBtn = $('.js-cancel-btn'),
            saveBtn = $('.js-save-btn'),
            hooks = {   // Attributes, classes, etc available to enable functionality when applied to DOM elements.
                ajaxTargetAttribute: 'data-mac-ajax-target',        // Selector of an element to be updated by an ajax operation.
                ajaxUrlAttribute: 'data-mac-ajax-url',              // An api url for an ajax call.
                uncheckedValueAttribute: 'data-mac-unchecked-value' // Value to use for an unchecked checkbox.
            };

        function exitEditMode() {
            editableSection.addClass('hide');
            // Use the jquery method only if the browser is IE8
            if (!macmillanFunctions.isIE8()) {
                readOnlySection.removeClass('faded');
            } else {
                readOnlySection.css('opacity', '1');
            }

            editBtn.removeClass('hide');
            readOnlySection.removeClass('hide');
        }

        function getSavedProfileSection(url, resultTargetSelector) {
            var options = {
                type: 'GET',
                url: url,
                cache: false,
                dataType: 'html',
                success: function (data) {
                    $(resultTargetSelector).html(data);
                    readOnlySection = $('.js-read-only');   // Update this var so the script using it still works.
                }
            };
            $.ajax(options);
        }

        editBtn.on('click', function (event) {
            event.preventDefault();
            editBtn.addClass('hide');
            $(this).parents().prev('.js-sections').find(readOnlySection).addClass('hide');
            $(this).parents().prev('.js-sections').find(editableSection).removeClass('hide');

            // Use the jquery method only if the browser is IE8
            if (!macmillanFunctions.isIE8()) {
                readOnlySection.addClass('faded');
            } else {
                readOnlySection.css('opacity', '0.1');
            }
        });

        cancelBtn.on('click', function (event) {
            event.preventDefault();
            exitEditMode();
        });

        saveBtn.on('click', function (event) {
            event.preventDefault();

            var $inputContainer = $(this).closest('.js-editable'),
                inputData = $inputContainer.find('input, select').serialize(),    // $inputContainer.serialize() doesn't support fieldset elements in IE.
                postUrl = $(this).attr(hooks.ajaxUrlAttribute),
                resultTargetSelector = $(this).attr(hooks.ajaxTargetAttribute);

            // Include unchecked checkboxes that have an unchecked value attribute.
            $.each($inputContainer.find('input[type=checkbox][' + hooks.uncheckedValueAttribute + ']')
                .filter(function () {
                    return $(this).prop('checked') === false;
                }),
                function (idx, el) {
                    inputData += '&' + $(el).attr('name') + '=' + $(el).attr(hooks.uncheckedValueAttribute);
                }
            );

            $('.js-spinner').show();
            var options = {
                type: 'POST',
                url: postUrl,
                data: inputData,
                dataType: 'json',
                success: function (data, textStatus, jqXhr) {
                    var location = jqXhr.getResponseHeader('Location');
                    if (location) getSavedProfileSection(location, resultTargetSelector);
                    $('.js-spinner').hide();
                },
                error: function () {
                    $('.js-spinner').hide();
                }
            };
            $.ajax(options);

            exitEditMode();
        });
    }
};

// 3. Module Exports
//  -----------------
module.exports = {
    init: Profile.init
};
},{"./macmillan.functions":4}],10:[function(require,module,exports){
/*global require,module,$*/
/*jslint nomen: true*/

//  Macmillan Map - Modified: 28 August 2015
//  ------------------------------------------
//    1. Initialisation
//    2. Geolocation
//    3. Filter Search Selection
//    4. Filter Tabbing
//    5. Search
//    6. Module Exports

//  Include Macmillan Functions
var macmillanFunctions = require('./macmillan.functions');
var macmillanMap = require('./macmillan.map');
var macmillanListView = require('./macmillan.listview');
var macmillanFilters = require('./macmillan.filters');

var MacmillanSearchBar = {

    //  1. Initialisation
    //  ------------------
    init: function () {

        'use strict';

        // Run locateMe function only if the
        // browser is not IE8
        if (!macmillanFunctions.isIE8()) {
            MacmillanSearchBar.locateMe();
        }

        // Filter Selection Update
        MacmillanSearchBar.searchSelection();

        // Filter Focus function
        MacmillanSearchBar.filterFocus();

        $('.js-search-btn').unbind('click').click(function (e) {
            e.preventDefault();
            $('.js-filter-container').removeClass('active');
            MacmillanSearchBar.search();

            // activate alert message if list view exists in the DOM
            if ($('#list').length > 0) {
                macmillanFilters.activateAlert();
            }
        });

        // Show the search bar when the page is ready.
        $(".search-wrap").removeClass("hidden");
    },

    //  2. Geolocation
    //  ------------------
    locateMe: function () {
        'use strict';

        var $searchBox = $('.js-search-box');

        //Show the postcode in search box
        function showGeoData(geoData) {
            var lat = geoData.coords.latitude,
                lon = geoData.coords.longitude;
            $.ajax({
                url: '//api.postcodes.io/postcodes',
                type: 'GET',
                data: { lat: lat, lon: lon },
                success: function (data) {
                    $searchBox.val(data.result[0].postcode);
                    $('.icon-locate').removeClass('icon-locate').addClass('icon-close');
                }
            });
        }

        function errorCallback(err) {
            console.log(err);
        }

        function getLocation() {
          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(showGeoData, errorCallback, { timeout: 10000 });
          }
        }

        $('.js-locate-btn').on('click', function (e) {
            e.preventDefault();
            if ($(this).hasClass('icon-close')) {
                $searchBox.val('');
                $(this).removeClass('icon-close').addClass('icon-locate');
            } else {
                getLocation();
            }
        });
    },
    
    //  3. Filter Search Selection
    //  -------------------------
    searchSelection: function () {
        var $selected = 0,
            $filterTab = $('.js-filter-tab'),
            $moreText = $filterTab.find('.more-text'),
            $filterSpan = $filterTab.find('span:first-of-type');
        
        $('.filter-content input').on('change', function () {
   
            var $truncated = $('.filter-content input:checked:first').next('label').text().substring(0, 25);

            function truncate(truncated) {
                if (truncated.length === 25) {
                    $filterSpan.text(truncated + '...');
                } else {
                    $filterSpan.text(truncated);
                }
            }

            if ($(this).is(':checked')) {
                $selected++;

                if ($selected === 1) {
                    truncate($truncated);
                } else {
                    $moreText.text(' (+ ' + ($selected - 1) + ')');
                }
            } else {
                if ($selected > 0) {
                    $selected--;
                    
                    if ($selected === 0) {
                        $filterSpan.text('Search by category');
                    } else if ($selected === 1) {
                        $moreText.text('');
                        truncate($truncated);
                    } else {
                        truncate($truncated);
                        $moreText.text(' (+ ' + ($selected - 1) + ')');
                    }
                }
            }
        });

        $('.filter-content input:checked').trigger('change');
    },

    //  4. Filter Tabbing
    //  -----
    filterFocus: function () {
        'use strict';

        var $filterTab = $('.js-filter-tab'),
            $filterContainer = $('.js-filter-container'),
            $filterDropdown = $('.js-filter-dropdown'),
            $lastInput = $('.js-filter-dropdown input:last');

        $filterTab.on('click', function (e) {
            e.preventDefault();
          
            if ($filterContainer.hasClass('active')) {
                $filterContainer.removeClass('active');
                // accessibility
                $filterTab.attr('aria-selected', 'false');
                $filterTab.attr('aria-expanded', 'false');
                $filterDropdown.attr('aria-hidden', 'true');
               
            } else {
                $filterContainer.addClass('active');
                // accessibility
                $filterTab.attr('aria-selected', 'true');
                $filterTab.attr('aria-expanded', 'true');
                $filterDropdown.attr('aria-hidden', 'false');
            }
        });
     
        $(document).mouseup(function (e) {

            if (!$filterContainer.is(e.target) && $filterContainer.has(e.target).length === 0) {
                $filterContainer.removeClass('active');
            }
        });
       
    },

    //  5. Search
    //  -----------------
    search: function () {
        if ($('#map').length > 0) {
            // updates the Map if it exists in the DOM
            var model = $('#search-form').serialize() + '&' + $('#filter-form').serialize() + '&' + $('#sort-form').serialize();    // TODO: Remove need for this.
            macmillanMap.update(model);
        } else if ($('#list').length > 0) {
            // updates the list view if it exists in the DOM
            macmillanListView.update();
        } else {
            window.location.href = '/Search/SearchDashboard?' + $('#search-form').serialize() + '&' + $('#filter-form').serialize() + '&' + $('#sort-form').serialize();
        }
    }
};

//  6. Module Exports
//  -----------------
module.exports = {
    init: MacmillanSearchBar.init
};
},{"./macmillan.filters":2,"./macmillan.functions":4,"./macmillan.listview":5,"./macmillan.map":6}],11:[function(require,module,exports){
/*global require,module,$*/
/*jslint nomen: true*/

//  PageScroll - Modified: 27th May 2016
//  ------------------------------------------
//    1. Initialisation
//    2. Module Exports

//  Include Macmillan Functions
var macmillanFunctions = require('./macmillan.functions');

var SocialShare = {

    //  1. Initialisation
    //  -----------------
    //  Initialise the base function
    init: function () {

        'use strict';

        var $socialIcon = $('#socialShare').find('.social-icon');

        $socialIcon.on('click', function (e) {

            e.preventDefault();
            var $this = $(this),
                url = $this.attr('href'),
                type = $this.data('socialtype'),
                width = $this.data('width'),
                height = $this.data('height'),
                left = (screen.width - width) / 2,
                top = (screen.height - height) / 2,
                params = 'width=' + width + ', height=' + height + ', top=' + top + ', left=' + left + ', resizable, scrollbars=yes';

            window.open(url, 'Share', params);
            return false;
        });
    }
};

// 2. Module Exports
//  -----------------
module.exports = {
    init: SocialShare.init
};
},{"./macmillan.functions":4}],12:[function(require,module,exports){
!function () { "use strict"; function t(e, o) { function i(t, e) { return function () { return t.apply(e, arguments) } } var r; if (o = o || {}, this.trackingClick = !1, this.trackingClickStart = 0, this.targetElement = null, this.touchStartX = 0, this.touchStartY = 0, this.lastTouchIdentifier = 0, this.touchBoundary = o.touchBoundary || 10, this.layer = e, this.tapDelay = o.tapDelay || 200, this.tapTimeout = o.tapTimeout || 700, !t.notNeeded(e)) { for (var a = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], c = this, s = 0, u = a.length; u > s; s++) c[a[s]] = i(c[a[s]], c); n && (e.addEventListener("mouseover", this.onMouse, !0), e.addEventListener("mousedown", this.onMouse, !0), e.addEventListener("mouseup", this.onMouse, !0)), e.addEventListener("click", this.onClick, !0), e.addEventListener("touchstart", this.onTouchStart, !1), e.addEventListener("touchmove", this.onTouchMove, !1), e.addEventListener("touchend", this.onTouchEnd, !1), e.addEventListener("touchcancel", this.onTouchCancel, !1), Event.prototype.stopImmediatePropagation || (e.removeEventListener = function (t, n, o) { var i = Node.prototype.removeEventListener; "click" === t ? i.call(e, t, n.hijacked || n, o) : i.call(e, t, n, o) }, e.addEventListener = function (t, n, o) { var i = Node.prototype.addEventListener; "click" === t ? i.call(e, t, n.hijacked || (n.hijacked = function (t) { t.propagationStopped || n(t) }), o) : i.call(e, t, n, o) }), "function" == typeof e.onclick && (r = e.onclick, e.addEventListener("click", function (t) { r(t) }, !1), e.onclick = null) } } var e = navigator.userAgent.indexOf("Windows Phone") >= 0, n = navigator.userAgent.indexOf("Android") > 0 && !e, o = /iP(ad|hone|od)/.test(navigator.userAgent) && !e, i = o && /OS 4_\d(_\d)?/.test(navigator.userAgent), r = o && /OS [6-7]_\d/.test(navigator.userAgent), a = navigator.userAgent.indexOf("BB10") > 0; t.prototype.needsClick = function (t) { switch (t.nodeName.toLowerCase()) { case "button": case "select": case "textarea": if (t.disabled) return !0; break; case "input": if (o && "file" === t.type || t.disabled) return !0; break; case "label": case "iframe": case "video": return !0 } return /\bneedsclick\b/.test(t.className) }, t.prototype.needsFocus = function (t) { switch (t.nodeName.toLowerCase()) { case "textarea": return !0; case "select": return !n; case "input": switch (t.type) { case "button": case "checkbox": case "file": case "image": case "radio": case "submit": return !1 } return !t.disabled && !t.readOnly; default: return /\bneedsfocus\b/.test(t.className) } }, t.prototype.sendClick = function (t, e) { var n, o; document.activeElement && document.activeElement !== t && document.activeElement.blur(), o = e.changedTouches[0], n = document.createEvent("MouseEvents"), n.initMouseEvent(this.determineEventType(t), !0, !0, window, 1, o.screenX, o.screenY, o.clientX, o.clientY, !1, !1, !1, !1, 0, null), n.forwardedTouchEvent = !0, t.dispatchEvent(n) }, t.prototype.determineEventType = function (t) { return n && "select" === t.tagName.toLowerCase() ? "mousedown" : "click" }, t.prototype.focus = function (t) { var e; o && t.setSelectionRange && 0 !== t.type.indexOf("date") && "time" !== t.type && "month" !== t.type ? (e = t.value.length, t.setSelectionRange(e, e)) : t.focus() }, t.prototype.updateScrollParent = function (t) { var e, n; if (e = t.fastClickScrollParent, !e || !e.contains(t)) { n = t; do { if (n.scrollHeight > n.offsetHeight) { e = n, t.fastClickScrollParent = n; break } n = n.parentElement } while (n) } e && (e.fastClickLastScrollTop = e.scrollTop) }, t.prototype.getTargetElementFromEventTarget = function (t) { return t.nodeType === Node.TEXT_NODE ? t.parentNode : t }, t.prototype.onTouchStart = function (t) { var e, n, r; if (t.targetTouches.length > 1) return !0; if (e = this.getTargetElementFromEventTarget(t.target), n = t.targetTouches[0], o) { if (r = window.getSelection(), r.rangeCount && !r.isCollapsed) return !0; if (!i) { if (n.identifier && n.identifier === this.lastTouchIdentifier) return t.preventDefault(), !1; this.lastTouchIdentifier = n.identifier, this.updateScrollParent(e) } } return this.trackingClick = !0, this.trackingClickStart = t.timeStamp, this.targetElement = e, this.touchStartX = n.pageX, this.touchStartY = n.pageY, t.timeStamp - this.lastClickTime < this.tapDelay && t.preventDefault(), !0 }, t.prototype.touchHasMoved = function (t) { var e = t.changedTouches[0], n = this.touchBoundary; return Math.abs(e.pageX - this.touchStartX) > n || Math.abs(e.pageY - this.touchStartY) > n ? !0 : !1 }, t.prototype.onTouchMove = function (t) { return this.trackingClick ? ((this.targetElement !== this.getTargetElementFromEventTarget(t.target) || this.touchHasMoved(t)) && (this.trackingClick = !1, this.targetElement = null), !0) : !0 }, t.prototype.findControl = function (t) { return void 0 !== t.control ? t.control : t.htmlFor ? document.getElementById(t.htmlFor) : t.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea") }, t.prototype.onTouchEnd = function (t) { var e, a, c, s, u, l = this.targetElement; if (!this.trackingClick) return !0; if (t.timeStamp - this.lastClickTime < this.tapDelay) return this.cancelNextClick = !0, !0; if (t.timeStamp - this.trackingClickStart > this.tapTimeout) return !0; if (this.cancelNextClick = !1, this.lastClickTime = t.timeStamp, a = this.trackingClickStart, this.trackingClick = !1, this.trackingClickStart = 0, r && (u = t.changedTouches[0], l = document.elementFromPoint(u.pageX - window.pageXOffset, u.pageY - window.pageYOffset) || l, l.fastClickScrollParent = this.targetElement.fastClickScrollParent), c = l.tagName.toLowerCase(), "label" === c) { if (e = this.findControl(l)) { if (this.focus(l), n) return !1; l = e } } else if (this.needsFocus(l)) return t.timeStamp - a > 100 || o && window.top !== window && "input" === c ? (this.targetElement = null, !1) : (this.focus(l), this.sendClick(l, t), o && "select" === c || (this.targetElement = null, t.preventDefault()), !1); return o && !i && (s = l.fastClickScrollParent, s && s.fastClickLastScrollTop !== s.scrollTop) ? !0 : (this.needsClick(l) || (t.preventDefault(), this.sendClick(l, t)), !1) }, t.prototype.onTouchCancel = function () { this.trackingClick = !1, this.targetElement = null }, t.prototype.onMouse = function (t) { return this.targetElement ? t.forwardedTouchEvent ? !0 : t.cancelable && (!this.needsClick(this.targetElement) || this.cancelNextClick) ? (t.stopImmediatePropagation ? t.stopImmediatePropagation() : t.propagationStopped = !0, t.stopPropagation(), t.preventDefault(), !1) : !0 : !0 }, t.prototype.onClick = function (t) { var e; return this.trackingClick ? (this.targetElement = null, this.trackingClick = !1, !0) : "submit" === t.target.type && 0 === t.detail ? !0 : (e = this.onMouse(t), e || (this.targetElement = null), e) }, t.prototype.destroy = function () { var t = this.layer; n && (t.removeEventListener("mouseover", this.onMouse, !0), t.removeEventListener("mousedown", this.onMouse, !0), t.removeEventListener("mouseup", this.onMouse, !0)), t.removeEventListener("click", this.onClick, !0), t.removeEventListener("touchstart", this.onTouchStart, !1), t.removeEventListener("touchmove", this.onTouchMove, !1), t.removeEventListener("touchend", this.onTouchEnd, !1), t.removeEventListener("touchcancel", this.onTouchCancel, !1) }, t.notNeeded = function (t) { var e, o, i, r; if ("undefined" == typeof window.ontouchstart) return !0; if (o = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) { if (!n) return !0; if (e = document.querySelector("meta[name=viewport]")) { if (-1 !== e.content.indexOf("user-scalable=no")) return !0; if (o > 31 && document.documentElement.scrollWidth <= window.outerWidth) return !0 } } if (a && (i = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/), i[1] >= 10 && i[2] >= 3 && (e = document.querySelector("meta[name=viewport]")))) { if (-1 !== e.content.indexOf("user-scalable=no")) return !0; if (document.documentElement.scrollWidth <= window.outerWidth) return !0 } return "none" === t.style.msTouchAction || "manipulation" === t.style.touchAction ? !0 : (r = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1], r >= 27 && (e = document.querySelector("meta[name=viewport]"), e && (-1 !== e.content.indexOf("user-scalable=no") || document.documentElement.scrollWidth <= window.outerWidth)) ? !0 : "none" === t.style.touchAction || "manipulation" === t.style.touchAction ? !0 : !1) }, t.attach = function (e, n) { return new t(e, n) }, "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function () { return t }) : "undefined" != typeof module && module.exports ? (module.exports = t.attach, module.exports.FastClick = t) : window.FastClick = t }();
},{}],13:[function(require,module,exports){
/*! jQuery Validation Plugin - v1.11.0 - 2/4/2013
* https://github.com/jzaefferer/jquery-validation
* Copyright (c) 2013 JÃ¶rn Zaefferer; Licensed MIT */
(function(e){e.extend(e.fn,{validate:function(t){if(!this.length){t&&t.debug&&window.console&&console.warn("Nothing selected, can't validate, returning nothing.");return}var n=e.data(this[0],"validator");return n?n:(this.attr("novalidate","novalidate"),n=new e.validator(t,this[0]),e.data(this[0],"validator",n),n.settings.onsubmit&&(this.validateDelegate(":submit","click",function(t){n.settings.submitHandler&&(n.submitButton=t.target),e(t.target).hasClass("cancel")&&(n.cancelSubmit=!0)}),this.submit(function(t){function r(){var r;return n.settings.submitHandler?(n.submitButton&&(r=e("<input type='hidden'/>").attr("name",n.submitButton.name).val(n.submitButton.value).appendTo(n.currentForm)),n.settings.submitHandler.call(n,n.currentForm,t),n.submitButton&&r.remove(),!1):!0}return n.settings.debug&&t.preventDefault(),n.cancelSubmit?(n.cancelSubmit=!1,r()):n.form()?n.pendingRequest?(n.formSubmitted=!0,!1):r():(n.focusInvalid(),!1)})),n)},valid:function(){if(e(this[0]).is("form"))return this.validate().form();var t=!0,n=e(this[0].form).validate();return this.each(function(){t&=n.element(this)}),t},removeAttrs:function(t){var n={},r=this;return e.each(t.split(/\s/),function(e,t){n[t]=r.attr(t),r.removeAttr(t)}),n},rules:function(t,n){var r=this[0];if(t){var i=e.data(r.form,"validator").settings,s=i.rules,o=e.validator.staticRules(r);switch(t){case"add":e.extend(o,e.validator.normalizeRule(n)),s[r.name]=o,n.messages&&(i.messages[r.name]=e.extend(i.messages[r.name],n.messages));break;case"remove":if(!n)return delete s[r.name],o;var u={};return e.each(n.split(/\s/),function(e,t){u[t]=o[t],delete o[t]}),u}}var a=e.validator.normalizeRules(e.extend({},e.validator.classRules(r),e.validator.attributeRules(r),e.validator.dataRules(r),e.validator.staticRules(r)),r);if(a.required){var f=a.required;delete a.required,a=e.extend({required:f},a)}return a}}),e.extend(e.expr[":"],{blank:function(t){return!e.trim(""+t.value)},filled:function(t){return!!e.trim(""+t.value)},unchecked:function(e){return!e.checked}}),e.validator=function(t,n){this.settings=e.extend(!0,{},e.validator.defaults,t),this.currentForm=n,this.init()},e.validator.format=function(t,n){return arguments.length===1?function(){var n=e.makeArray(arguments);return n.unshift(t),e.validator.format.apply(this,n)}:(arguments.length>2&&n.constructor!==Array&&(n=e.makeArray(arguments).slice(1)),n.constructor!==Array&&(n=[n]),e.each(n,function(e,n){t=t.replace(new RegExp("\\{"+e+"\\}","g"),function(){return n})}),t)},e.extend(e.validator,{defaults:{messages:{},groups:{},rules:{},errorClass:"error",validClass:"valid",errorElement:"label",focusInvalid:!0,errorContainer:e([]),errorLabelContainer:e([]),onsubmit:!0,ignore:":hidden",ignoreTitle:!1,onfocusin:function(e,t){this.lastActive=e,this.settings.focusCleanup&&!this.blockFocusCleanup&&(this.settings.unhighlight&&this.settings.unhighlight.call(this,e,this.settings.errorClass,this.settings.validClass),this.addWrapper(this.errorsFor(e)).hide())},onfocusout:function(e,t){!this.checkable(e)&&(e.name in this.submitted||!this.optional(e))&&this.element(e)},onkeyup:function(e,t){if(t.which===9&&this.elementValue(e)==="")return;(e.name in this.submitted||e===this.lastElement)&&this.element(e)},onclick:function(e,t){e.name in this.submitted?this.element(e):e.parentNode.name in this.submitted&&this.element(e.parentNode)},highlight:function(t,n,r){t.type==="radio"?this.findByName(t.name).addClass(n).removeClass(r):e(t).addClass(n).removeClass(r)},unhighlight:function(t,n,r){t.type==="radio"?this.findByName(t.name).removeClass(n).addClass(r):e(t).removeClass(n).addClass(r)}},setDefaults:function(t){e.extend(e.validator.defaults,t)},messages:{required:"This field is required.",remote:"Please fix this field.",email:"Please enter a valid email address.",url:"Please enter a valid URL.",date:"Please enter a valid date.",dateISO:"Please enter a valid date (ISO).",number:"Please enter a valid number.",digits:"Please enter only digits.",creditcard:"Please enter a valid credit card number.",equalTo:"Please enter the same value again.",maxlength:e.validator.format("Please enter no more than {0} characters."),minlength:e.validator.format("Please enter at least {0} characters."),rangelength:e.validator.format("Please enter a value between {0} and {1} characters long."),range:e.validator.format("Please enter a value between {0} and {1}."),max:e.validator.format("Please enter a value less than or equal to {0}."),min:e.validator.format("Please enter a value greater than or equal to {0}.")},autoCreateRanges:!1,prototype:{init:function(){function r(t){var n=e.data(this[0].form,"validator"),r="on"+t.type.replace(/^validate/,"");n.settings[r]&&n.settings[r].call(n,this[0],t)}this.labelContainer=e(this.settings.errorLabelContainer),this.errorContext=this.labelContainer.length&&this.labelContainer||e(this.currentForm),this.containers=e(this.settings.errorContainer).add(this.settings.errorLabelContainer),this.submitted={},this.valueCache={},this.pendingRequest=0,this.pending={},this.invalid={},this.reset();var t=this.groups={};e.each(this.settings.groups,function(n,r){typeof r=="string"&&(r=r.split(/\s/)),e.each(r,function(e,r){t[r]=n})});var n=this.settings.rules;e.each(n,function(t,r){n[t]=e.validator.normalizeRule(r)}),e(this.currentForm).validateDelegate(":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'] ,[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'] ","focusin focusout keyup",r).validateDelegate("[type='radio'], [type='checkbox'], select, option","click",r),this.settings.invalidHandler&&e(this.currentForm).bind("invalid-form.validate",this.settings.invalidHandler)},form:function(){return this.checkForm(),e.extend(this.submitted,this.errorMap),this.invalid=e.extend({},this.errorMap),this.valid()||e(this.currentForm).triggerHandler("invalid-form",[this]),this.showErrors(),this.valid()},checkForm:function(){this.prepareForm();for(var e=0,t=this.currentElements=this.elements();t[e];e++)this.check(t[e]);return this.valid()},element:function(t){t=this.validationTargetFor(this.clean(t)),this.lastElement=t,this.prepareElement(t),this.currentElements=e(t);var n=this.check(t)!==!1;return n?delete this.invalid[t.name]:this.invalid[t.name]=!0,this.numberOfInvalids()||(this.toHide=this.toHide.add(this.containers)),this.showErrors(),n},showErrors:function(t){if(t){e.extend(this.errorMap,t),this.errorList=[];for(var n in t)this.errorList.push({message:t[n],element:this.findByName(n)[0]});this.successList=e.grep(this.successList,function(e){return!(e.name in t)})}this.settings.showErrors?this.settings.showErrors.call(this,this.errorMap,this.errorList):this.defaultShowErrors()},resetForm:function(){e.fn.resetForm&&e(this.currentForm).resetForm(),this.submitted={},this.lastElement=null,this.prepareForm(),this.hideErrors(),this.elements().removeClass(this.settings.errorClass).removeData("previousValue")},numberOfInvalids:function(){return this.objectLength(this.invalid)},objectLength:function(e){var t=0;for(var n in e)t++;return t},hideErrors:function(){this.addWrapper(this.toHide).hide()},valid:function(){return this.size()===0},size:function(){return this.errorList.length},focusInvalid:function(){if(this.settings.focusInvalid)try{e(this.findLastActive()||this.errorList.length&&this.errorList[0].element||[]).filter(":visible").focus().trigger("focusin")}catch(t){}},findLastActive:function(){var t=this.lastActive;return t&&e.grep(this.errorList,function(e){return e.element.name===t.name}).length===1&&t},elements:function(){var t=this,n={};return e(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function(){return!this.name&&t.settings.debug&&window.console&&console.error("%o has no name assigned",this),this.name in n||!t.objectLength(e(this).rules())?!1:(n[this.name]=!0,!0)})},clean:function(t){return e(t)[0]},errors:function(){var t=this.settings.errorClass.replace(" ",".");return e(this.settings.errorElement+"."+t,this.errorContext)},reset:function(){this.successList=[],this.errorList=[],this.errorMap={},this.toShow=e([]),this.toHide=e([]),this.currentElements=e([])},prepareForm:function(){this.reset(),this.toHide=this.errors().add(this.containers)},prepareElement:function(e){this.reset(),this.toHide=this.errorsFor(e)},elementValue:function(t){var n=e(t).attr("type"),r=e(t).val();return n==="radio"||n==="checkbox"?e("input[name='"+e(t).attr("name")+"']:checked").val():typeof r=="string"?r.replace(/\r/g,""):r},check:function(t){t=this.validationTargetFor(this.clean(t));var n=e(t).rules(),r=!1,i=this.elementValue(t),s;for(var o in n){var u={method:o,parameters:n[o]};try{s=e.validator.methods[o].call(this,i,t,u.parameters);if(s==="dependency-mismatch"){r=!0;continue}r=!1;if(s==="pending"){this.toHide=this.toHide.not(this.errorsFor(t));return}if(!s)return this.formatAndAdd(t,u),!1}catch(a){throw this.settings.debug&&window.console&&console.log("Exception occured when checking element "+t.id+", check the '"+u.method+"' method.",a),a}}if(r)return;return this.objectLength(n)&&this.successList.push(t),!0},customDataMessage:function(t,n){return e(t).data("msg-"+n.toLowerCase())||t.attributes&&e(t).attr("data-msg-"+n.toLowerCase())},customMessage:function(e,t){var n=this.settings.messages[e];return n&&(n.constructor===String?n:n[t])},findDefined:function(){for(var e=0;e<arguments.length;e++)if(arguments[e]!==undefined)return arguments[e];return undefined},defaultMessage:function(t,n){return this.findDefined(this.customMessage(t.name,n),this.customDataMessage(t,n),!this.settings.ignoreTitle&&t.title||undefined,e.validator.messages[n],"<strong>Warning: No message defined for "+t.name+"</strong>")},formatAndAdd:function(t,n){var r=this.defaultMessage(t,n.method),i=/\$?\{(\d+)\}/g;typeof r=="function"?r=r.call(this,n.parameters,t):i.test(r)&&(r=e.validator.format(r.replace(i,"{$1}"),n.parameters)),this.errorList.push({message:r,element:t}),this.errorMap[t.name]=r,this.submitted[t.name]=r},addWrapper:function(e){return this.settings.wrapper&&(e=e.add(e.parent(this.settings.wrapper))),e},defaultShowErrors:function(){var e,t;for(e=0;this.errorList[e];e++){var n=this.errorList[e];this.settings.highlight&&this.settings.highlight.call(this,n.element,this.settings.errorClass,this.settings.validClass),this.showLabel(n.element,n.message)}this.errorList.length&&(this.toShow=this.toShow.add(this.containers));if(this.settings.success)for(e=0;this.successList[e];e++)this.showLabel(this.successList[e]);if(this.settings.unhighlight)for(e=0,t=this.validElements();t[e];e++)this.settings.unhighlight.call(this,t[e],this.settings.errorClass,this.settings.validClass);this.toHide=this.toHide.not(this.toShow),this.hideErrors(),this.addWrapper(this.toShow).show()},validElements:function(){return this.currentElements.not(this.invalidElements())},invalidElements:function(){return e(this.errorList).map(function(){return this.element})},showLabel:function(t,n){var r=this.errorsFor(t);r.length?(r.removeClass(this.settings.validClass).addClass(this.settings.errorClass),r.html(n)):(r=e("<"+this.settings.errorElement+">").attr("for",this.idOrName(t)).addClass(this.settings.errorClass).html(n||""),this.settings.wrapper&&(r=r.hide().show().wrap("<"+this.settings.wrapper+"/>").parent()),this.labelContainer.append(r).length||(this.settings.errorPlacement?this.settings.errorPlacement(r,e(t)):r.insertAfter(t))),!n&&this.settings.success&&(r.text(""),typeof this.settings.success=="string"?r.addClass(this.settings.success):this.settings.success(r,t)),this.toShow=this.toShow.add(r)},errorsFor:function(t){var n=this.idOrName(t);return this.errors().filter(function(){return e(this).attr("for")===n})},idOrName:function(e){return this.groups[e.name]||(this.checkable(e)?e.name:e.id||e.name)},validationTargetFor:function(e){return this.checkable(e)&&(e=this.findByName(e.name).not(this.settings.ignore)[0]),e},checkable:function(e){return/radio|checkbox/i.test(e.type)},findByName:function(t){return e(this.currentForm).find("[name='"+t+"']")},getLength:function(t,n){switch(n.nodeName.toLowerCase()){case"select":return e("option:selected",n).length;case"input":if(this.checkable(n))return this.findByName(n.name).filter(":checked").length}return t.length},depend:function(e,t){return this.dependTypes[typeof e]?this.dependTypes[typeof e](e,t):!0},dependTypes:{"boolean":function(e,t){return e},string:function(t,n){return!!e(t,n.form).length},"function":function(e,t){return e(t)}},optional:function(t){var n=this.elementValue(t);return!e.validator.methods.required.call(this,n,t)&&"dependency-mismatch"},startRequest:function(e){this.pending[e.name]||(this.pendingRequest++,this.pending[e.name]=!0)},stopRequest:function(t,n){this.pendingRequest--,this.pendingRequest<0&&(this.pendingRequest=0),delete this.pending[t.name],n&&this.pendingRequest===0&&this.formSubmitted&&this.form()?(e(this.currentForm).submit(),this.formSubmitted=!1):!n&&this.pendingRequest===0&&this.formSubmitted&&(e(this.currentForm).triggerHandler("invalid-form",[this]),this.formSubmitted=!1)},previousValue:function(t){return e.data(t,"previousValue")||e.data(t,"previousValue",{old:null,valid:!0,message:this.defaultMessage(t,"remote")})}},classRuleSettings:{required:{required:!0},email:{email:!0},url:{url:!0},date:{date:!0},dateISO:{dateISO:!0},number:{number:!0},digits:{digits:!0},creditcard:{creditcard:!0}},addClassRules:function(t,n){t.constructor===String?this.classRuleSettings[t]=n:e.extend(this.classRuleSettings,t)},classRules:function(t){var n={},r=e(t).attr("class");return r&&e.each(r.split(" "),function(){this in e.validator.classRuleSettings&&e.extend(n,e.validator.classRuleSettings[this])}),n},attributeRules:function(t){var n={},r=e(t);for(var i in e.validator.methods){var s;i==="required"?(s=r.get(0).getAttribute(i),s===""&&(s=!0),s=!!s):s=r.attr(i),s?n[i]=s:r[0].getAttribute("type")===i&&(n[i]=!0)}return n.maxlength&&/-1|2147483647|524288/.test(n.maxlength)&&delete n.maxlength,n},dataRules:function(t){var n,r,i={},s=e(t);for(n in e.validator.methods)r=s.data("rule-"+n.toLowerCase()),r!==undefined&&(i[n]=r);return i},staticRules:function(t){var n={},r=e.data(t.form,"validator");return r.settings.rules&&(n=e.validator.normalizeRule(r.settings.rules[t.name])||{}),n},normalizeRules:function(t,n){return e.each(t,function(r,i){if(i===!1){delete t[r];return}if(i.param||i.depends){var s=!0;switch(typeof i.depends){case"string":s=!!e(i.depends,n.form).length;break;case"function":s=i.depends.call(n,n)}s?t[r]=i.param!==undefined?i.param:!0:delete t[r]}}),e.each(t,function(r,i){t[r]=e.isFunction(i)?i(n):i}),e.each(["minlength","maxlength"],function(){t[this]&&(t[this]=Number(t[this]))}),e.each(["rangelength"],function(){var n;t[this]&&(e.isArray(t[this])?t[this]=[Number(t[this][0]),Number(t[this][1])]:typeof t[this]=="string"&&(n=t[this].split(/[\s,]+/),t[this]=[Number(n[0]),Number(n[1])]))}),e.validator.autoCreateRanges&&(t.min&&t.max&&(t.range=[t.min,t.max],delete t.min,delete t.max),t.minlength&&t.maxlength&&(t.rangelength=[t.minlength,t.maxlength],delete t.minlength,delete t.maxlength)),t},normalizeRule:function(t){if(typeof t=="string"){var n={};e.each(t.split(/\s/),function(){n[this]=!0}),t=n}return t},addMethod:function(t,n,r){e.validator.methods[t]=n,e.validator.messages[t]=r!==undefined?r:e.validator.messages[t],n.length<3&&e.validator.addClassRules(t,e.validator.normalizeRule(t))},methods:{required:function(t,n,r){if(!this.depend(r,n))return"dependency-mismatch";if(n.nodeName.toLowerCase()==="select"){var i=e(n).val();return i&&i.length>0}return this.checkable(n)?this.getLength(t,n)>0:e.trim(t).length>0},remote:function(t,n,r){if(this.optional(n))return"dependency-mismatch";var i=this.previousValue(n);this.settings.messages[n.name]||(this.settings.messages[n.name]={}),i.originalMessage=this.settings.messages[n.name].remote,this.settings.messages[n.name].remote=i.message,r=typeof r=="string"&&{url:r}||r;if(i.old===t)return i.valid;i.old=t;var s=this;this.startRequest(n);var o={};return o[n.name]=t,e.ajax(e.extend(!0,{url:r,mode:"abort",port:"validate"+n.name,dataType:"json",data:o,success:function(r){s.settings.messages[n.name].remote=i.originalMessage;var o=r===!0||r==="true";if(o){var u=s.formSubmitted;s.prepareElement(n),s.formSubmitted=u,s.successList.push(n),delete s.invalid[n.name],s.showErrors()}else{var a={},f=r||s.defaultMessage(n,"remote");a[n.name]=i.message=e.isFunction(f)?f(t):f,s.invalid[n.name]=!0,s.showErrors(a)}i.valid=o,s.stopRequest(n,o)}},r)),"pending"},minlength:function(t,n,r){var i=e.isArray(t)?t.length:this.getLength(e.trim(t),n);return this.optional(n)||i>=r},maxlength:function(t,n,r){var i=e.isArray(t)?t.length:this.getLength(e.trim(t),n);return this.optional(n)||i<=r},rangelength:function(t,n,r){var i=e.isArray(t)?t.length:this.getLength(e.trim(t),n);return this.optional(n)||i>=r[0]&&i<=r[1]},min:function(e,t,n){return this.optional(t)||e>=n},max:function(e,t,n){return this.optional(t)||e<=n},range:function(e,t,n){return this.optional(t)||e>=n[0]&&e<=n[1]},email:function(e,t){return this.optional(t)||/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(e)},url:function(e,t){return this.optional(t)||/^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(e)},date:function(e,t){return this.optional(t)||!/Invalid|NaN/.test((new Date(e)).toString())},dateISO:function(e,t){return this.optional(t)||/^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(e)},number:function(e,t){return this.optional(t)||/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(e)},digits:function(e,t){return this.optional(t)||/^\d+$/.test(e)},creditcard:function(e,t){if(this.optional(t))return"dependency-mismatch";if(/[^0-9 \-]+/.test(e))return!1;var n=0,r=0,i=!1;e=e.replace(/\D/g,"");for(var s=e.length-1;s>=0;s--){var o=e.charAt(s);r=parseInt(o,10),i&&(r*=2)>9&&(r-=9),n+=r,i=!i}return n%10===0},equalTo:function(t,n,r){var i=e(r);return this.settings.onfocusout&&i.unbind(".validate-equalTo").bind("blur.validate-equalTo",function(){e(n).valid()}),t===i.val()}}}),e.format=e.validator.format})(jQuery),function(e){var t={};if(e.ajaxPrefilter)e.ajaxPrefilter(function(e,n,r){var i=e.port;e.mode==="abort"&&(t[i]&&t[i].abort(),t[i]=r)});else{var n=e.ajax;e.ajax=function(r){var i=("mode"in r?r:e.ajaxSettings).mode,s=("port"in r?r:e.ajaxSettings).port;return i==="abort"?(t[s]&&t[s].abort(),t[s]=n.apply(this,arguments)):n.apply(this,arguments)}}}(jQuery),function(e){e.extend(e.fn,{validateDelegate:function(t,n,r){return this.bind(n,function(n){var i=e(n.target);if(i.is(t))return r.apply(i,arguments)})}})}(jQuery);
},{}],14:[function(require,module,exports){
(function (c) { c(window.jQuery, window, document) })(function (c, q, x, y) {
    c.widget("selectBox.selectBoxIt", {
        VERSION: "3.8.1", options: {
            showEffect: "none", showEffectOptions: {}, showEffectSpeed: "medium", hideEffect: "none", hideEffectOptions: {}, hideEffectSpeed: "medium", showFirstOption: !0, defaultText: "", defaultIcon: "", downArrowIcon: "", theme: "default", keydownOpen: !0, isMobile: function () { return /iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/.test(navigator.userAgent || navigator.vendor || q.opera) }, "native": !1,
            aggressiveChange: !1, selectWhenHidden: !0, viewport: c(q), similarSearch: !1, copyAttributes: ["title", "rel"], copyClasses: "button", nativeMousedown: !1, customShowHideEvent: !1, autoWidth: !0, html: !0, populate: "", dynamicPositioning: !0, hideCurrent: !1
        }, getThemes: function () {
            var a = c(this.element).attr("data-theme") || "c"; return {
                bootstrap: { focus: "active", hover: "", enabled: "enabled", disabled: "disabled", arrow: "caret", button: "btn", list: "dropdown-menu", container: "bootstrap", open: "open" }, jqueryui: {
                    focus: "ui-state-focus", hover: "ui-state-hover",
                    enabled: "ui-state-enabled", disabled: "ui-state-disabled", arrow: "ui-icon ui-icon-triangle-1-s", button: "ui-widget ui-state-default", list: "ui-widget ui-widget-content", container: "jqueryui", open: "selectboxit-open"
                }, jquerymobile: {
                    focus: "ui-btn-down-" + a, hover: "ui-btn-hover-" + a, enabled: "ui-enabled", disabled: "ui-disabled", arrow: "ui-icon ui-icon-arrow-d ui-icon-shadow", button: "ui-btn ui-btn-icon-right ui-btn-corner-all ui-shadow ui-btn-up-" + a, list: "ui-btn ui-btn-icon-right ui-btn-corner-all ui-shadow ui-btn-up-" +
                    a, container: "jquerymobile", open: "selectboxit-open"
                }, "default": { focus: "selectboxit-focus", hover: "selectboxit-hover", enabled: "selectboxit-enabled", disabled: "selectboxit-disabled", arrow: "selectboxit-default-arrow", button: "selectboxit-btn", list: "selectboxit-list", container: "selectboxit-container", open: "selectboxit-open" }
            }
        }, isDeferred: function (a) { return c.isPlainObject(a) && a.promise && a.done }, _create: function (a) {
            var b = this.options.populate, d = this.options.theme; if (this.element.is("select")) return this.widgetProto =
            c.Widget.prototype, this.originalElem = this.element[0], this.selectBox = this.element, this.options.populate && this.add && !a && this.add(b), this.selectItems = this.element.find("option"), this.firstSelectItem = this.selectItems.slice(0, 1), this.documentHeight = c(x).height(), this.theme = c.isPlainObject(d) ? c.extend({}, this.getThemes()["default"], d) : this.getThemes()[d] ? this.getThemes()[d] : this.getThemes()["default"], this.currentFocus = 0, this.blur = !0, this.textArray = [], this.currentIndex = 0, this.currentText = "", this.flipped =
            !1, a || (this.selectBoxStyles = this.selectBox.attr("style")), this._createDropdownButton()._createUnorderedList()._copyAttributes()._replaceSelectBox()._addClasses(this.theme)._eventHandlers(), this.originalElem.disabled && this.disable && this.disable(), this._ariaAccessibility && this._ariaAccessibility(), this.isMobile = this.options.isMobile(), this._mobile && this._mobile(), this.options["native"] && this._applyNativeSelect(), this.triggerEvent("create"), this
        }, _createDropdownButton: function () {
            var a = this.originalElemId =
            this.originalElem.id || "", b = this.originalElemValue = this.originalElem.value || "", d = this.originalElemName = this.originalElem.name || "", f = this.options.copyClasses, h = this.selectBox.attr("class") || ""; this.dropdownText = c("<span/>", { id: a && a + "SelectBoxItText", "class": "selectboxit-text", unselectable: "on", text: this.firstSelectItem.text() }).attr("data-val", b); this.dropdownImageContainer = c("<span/>", { "class": "selectboxit-option-icon-container" }); this.dropdownImage = c("<i/>", {
                id: a && a + "SelectBoxItDefaultIcon", "class": "selectboxit-default-icon",
                unselectable: "on"
            }); this.dropdown = c("<span/>", { id: a && a + "SelectBoxIt", "class": "selectboxit " + ("button" === f ? h : "") + " " + (this.selectBox.prop("disabled") ? this.theme.disabled : this.theme.enabled), name: d, tabindex: this.selectBox.attr("tabindex") || "0", unselectable: "on" }).append(this.dropdownImageContainer.append(this.dropdownImage)).append(this.dropdownText); this.dropdownContainer = c("<span/>", { id: a && a + "SelectBoxItContainer", "class": "selectboxit-container " + this.theme.container + " " + ("container" === f ? h : "") }).append(this.dropdown);
            return this
        }, _createUnorderedList: function () {
            var a = this, b, d, f, h, g, e, l, k = "", p = a.originalElemId || "", p = c("<ul/>", { id: p && p + "SelectBoxItOptions", "class": "selectboxit-options", tabindex: -1 }), v, w, u, r, m, t; a.options.showFirstOption || (a.selectItems.first().attr("disabled", "disabled"), a.selectItems = a.selectBox.find("option").slice(1)); a.selectItems.each(function (p) {
                m = c(this); f = d = ""; b = m.prop("disabled"); h = m.attr("data-icon") || ""; e = (g = m.attr("data-iconurl") || "") ? "selectboxit-option-icon-url" : ""; l = g ? "style=\"background-image:url('" +
                g + "');\"" : ""; v = m.attr("data-selectedtext"); r = (w = m.attr("data-text")) ? w : m.text(); t = m.parent(); t.is("optgroup") && (d = "selectboxit-optgroup-option", 0 === m.index() && (f = '<span class="selectboxit-optgroup-header ' + t.first().attr("class") + '"data-disabled="true">' + t.first().attr("label") + "</span>")); m.attr("value", this.value); k += f + '<li data-id="' + p + '" data-val="' + this.value + '" data-disabled="' + b + '" class="' + d + " selectboxit-option " + (c(this).attr("class") || "") + '"><a class="selectboxit-option-anchor"><span class="selectboxit-option-icon-container"><i class="selectboxit-option-icon ' +
                h + " " + (e || a.theme.container) + '"' + l + "></i></span>" + (a.options.html ? r : a.htmlEscape(r)) + "</a></li>"; u = m.attr("data-search"); a.textArray[p] = b ? "" : u ? u : r; this.selected && (a._setText(a.dropdownText, v || r), a.currentFocus = p)
            }); if (a.options.defaultText || a.selectBox.attr("data-text")) { var q = a.options.defaultText || a.selectBox.attr("data-text"); a._setText(a.dropdownText, q); a.options.defaultText = q } p.append(k); a.list = p; a.dropdownContainer.append(a.list); a.listItems = a.list.children("li"); a.listAnchors = a.list.find("a");
            a.listItems.first().addClass("selectboxit-option-first"); a.listItems.last().addClass("selectboxit-option-last"); a.list.find("li[data-disabled='true']").not(".optgroupHeader").addClass(a.theme.disabled); a.dropdownImage.addClass(a.selectBox.attr("data-icon") || a.options.defaultIcon || a.listItems.eq(a.currentFocus).find("i").attr("class")); a.dropdownImage.attr("style", a.listItems.eq(a.currentFocus).find("i").attr("style")); return a
        }, _replaceSelectBox: function () {
            var a = this.originalElem.id || "", b = this.selectBox.attr("data-size"),
            b = this.listSize = b === y ? "auto" : "0" === b ? "auto" : +b, d; this.selectBox.css("display", "none").after(this.dropdownContainer); this.dropdownContainer.appendTo("body").addClass("selectboxit-rendering"); this.dropdown.height(); this.downArrow = c("<i/>", { id: a && a + "SelectBoxItArrow", "class": "selectboxit-arrow", unselectable: "on" }); this.downArrowContainer = c("<span/>", { id: a && a + "SelectBoxItArrowContainer", "class": "selectboxit-arrow-container", unselectable: "on" }).append(this.downArrow); this.dropdown.append(this.downArrowContainer);
            this.listItems.removeClass("selectboxit-selected").eq(this.currentFocus).addClass("selectboxit-selected"); a = this.downArrowContainer.outerWidth(!0); d = this.dropdownImage.outerWidth(!0); this.options.autoWidth && (this.dropdown.css({ width: "auto" }).css({ width: this.list.outerWidth(!0) + a + d }), this.list.css({ "min-width": this.dropdown.width() })); this.dropdownText.css({ "max-width": this.dropdownContainer.outerWidth(!0) - (a + d) }); this.selectBox.after(this.dropdownContainer); this.dropdownContainer.removeClass("selectboxit-rendering");
            "number" === c.type(b) && (this.maxHeight = this.listAnchors.outerHeight(!0) * b); return this
        }, _scrollToView: function (a) { var b = this.listItems.eq(this.currentFocus), d = this.list.scrollTop(), f = b.height(), b = b.position().top, c = Math.abs(b), g = this.list.height(); "search" === a ? g - b < f ? this.list.scrollTop(d + (b - (g - f))) : -1 > b && this.list.scrollTop(b - f) : "up" === a ? -1 > b && this.list.scrollTop(d - c) : "down" === a && g - b < f && this.list.scrollTop(d + (c - g + f)); return this }, _callbackSupport: function (a) {
            c.isFunction(a) && a.call(this, this.dropdown);
            return this
        }, _setText: function (a, b) { this.options.html ? a.html(b) : a.text(b); return this }, open: function (a) {
            var b = this, d = b.options.showEffect, c = b.options.showEffectSpeed, h = b.options.showEffectOptions, g = b.options["native"], e = b.isMobile; if (!b.listItems.length || b.dropdown.hasClass(b.theme.disabled)) return b; if (!g && !e && !this.list.is(":visible")) {
                b.triggerEvent("open"); b._dynamicPositioning && b.options.dynamicPositioning && b._dynamicPositioning(); if ("none" === d) b.list.show(); else if ("show" === d || "slideDown" ===
                d || "fadeIn" === d) b.list[d](c); else b.list.show(d, h, c); b.list.promise().done(function () { b._scrollToView("search"); b.triggerEvent("opened") })
            } b._callbackSupport(a); return b
        }, close: function (a) {
            var b = this, d = b.options.hideEffect, c = b.options.hideEffectSpeed, h = b.options.hideEffectOptions, g = b.isMobile; if (!b.options["native"] && !g && b.list.is(":visible")) { b.triggerEvent("close"); if ("none" === d) b.list.hide(); else if ("hide" === d || "slideUp" === d || "fadeOut" === d) b.list[d](c); else b.list.hide(d, h, c); b.list.promise().done(function () { b.triggerEvent("closed") }) } b._callbackSupport(a);
            return b
        }, toggle: function () { var a = this.list.is(":visible"); a ? this.close() : a || this.open() }, _keyMappings: { 38: "up", 40: "down", 13: "enter", 8: "backspace", 9: "tab", 32: "space", 27: "esc" }, _keydownMethods: function () {
            var a = this, b = a.list.is(":visible") || !a.options.keydownOpen; return {
                down: function () { a.moveDown && b && a.moveDown() }, up: function () { a.moveUp && b && a.moveUp() }, enter: function () { var b = a.listItems.eq(a.currentFocus); a._update(b); "true" !== b.attr("data-preventclose") && a.close(); a.triggerEvent("enter") }, tab: function () {
                    a.triggerEvent("tab-blur");
                    a.close()
                }, backspace: function () { a.triggerEvent("backspace") }, esc: function () { a.close() }
            }
        }, _eventHandlers: function () {
            var a = this, b = a.options.nativeMousedown, d = a.options.customShowHideEvent, f, h, g = a.focusClass, e = a.hoverClass, l = a.openClass; this.dropdown.on({
                "click.selectBoxIt": function () { a.dropdown.trigger("focus", !0); a.originalElem.disabled || (a.triggerEvent("click"), b || d || a.toggle()) }, "mousedown.selectBoxIt": function () { c(this).data("mdown", !0); a.triggerEvent("mousedown"); b && !d && a.toggle() }, "mouseup.selectBoxIt": function () { a.triggerEvent("mouseup") },
                "blur.selectBoxIt": function () { a.blur && (a.triggerEvent("blur"), a.close(), c(this).removeClass(g)) }, "focus.selectBoxIt": function (b, d) { var f = c(this).data("mdown"); c(this).removeData("mdown"); f || d || setTimeout(function () { a.triggerEvent("tab-focus") }, 0); d || (c(this).hasClass(a.theme.disabled) || c(this).addClass(g), a.triggerEvent("focus")) }, "keydown.selectBoxIt": function (b) {
                    var d = a._keyMappings[b.keyCode], c = a._keydownMethods()[d]; c && (c(), !a.options.keydownOpen || "up" !== d && "down" !== d || a.open()); c && "tab" !== d &&
                    b.preventDefault()
                }, "keypress.selectBoxIt": function (b) { var d = a._keyMappings[b.charCode || b.keyCode], c = String.fromCharCode(b.charCode || b.keyCode); a.search && (!d || d && "space" === d) && a.search(c, !0, !0); "space" === d && b.preventDefault() }, "mouseenter.selectBoxIt": function () { a.triggerEvent("mouseenter") }, "mouseleave.selectBoxIt": function () { a.triggerEvent("mouseleave") }
            }); a.list.on({
                "mouseover.selectBoxIt": function () { a.blur = !1 }, "mouseout.selectBoxIt": function () { a.blur = !0 }, "focusin.selectBoxIt": function () {
                    a.dropdown.trigger("focus",
                    !0)
                }
            }); a.list.on({
                "mousedown.selectBoxIt": function () { a._update(c(this)); a.triggerEvent("option-click"); "false" === c(this).attr("data-disabled") && "true" !== c(this).attr("data-preventclose") && a.close(); setTimeout(function () { a.dropdown.trigger("focus", !0) }, 0) }, "focusin.selectBoxIt": function () {
                    a.listItems.not(c(this)).removeAttr("data-active"); c(this).attr("data-active", ""); var b = a.list.is(":hidden"); (a.options.searchWhenHidden && b || a.options.aggressiveChange || b && a.options.selectWhenHidden) && a._update(c(this));
                    c(this).addClass(g)
                }, "mouseup.selectBoxIt": function () { b && !d && (a._update(c(this)), a.triggerEvent("option-mouseup"), "false" === c(this).attr("data-disabled") && "true" !== c(this).attr("data-preventclose") && a.close()) }, "mouseenter.selectBoxIt": function () { "false" === c(this).attr("data-disabled") && (a.listItems.removeAttr("data-active"), c(this).addClass(g).attr("data-active", ""), a.listItems.not(c(this)).removeClass(g), c(this).addClass(g), a.currentFocus = +c(this).attr("data-id")) }, "mouseleave.selectBoxIt": function () {
                    "false" ===
                    c(this).attr("data-disabled") && (a.listItems.not(c(this)).removeClass(g).removeAttr("data-active"), c(this).addClass(g), a.currentFocus = +c(this).attr("data-id"))
                }, "blur.selectBoxIt": function () { c(this).removeClass(g) }
            }, ".selectboxit-option"); a.list.on({ "click.selectBoxIt": function (a) { a.preventDefault() } }, "a"); a.selectBox.on({
                "change.selectBoxIt, internal-change.selectBoxIt": function (b, d) {
                    var c, g; d || (c = a.list.find('li[data-val="' + a.originalElem.value + '"]'), c.length && (a.listItems.eq(a.currentFocus).removeClass(a.focusClass),
                    a.currentFocus = +c.attr("data-id"))); c = a.listItems.eq(a.currentFocus); g = c.attr("data-selectedtext"); h = (f = c.attr("data-text")) ? f : c.find("a").text(); a._setText(a.dropdownText, g || h); a.dropdownText.attr("data-val", a.originalElem.value); c.find("i").attr("class") && (a.dropdownImage.attr("class", c.find("i").attr("class")).addClass("selectboxit-default-icon"), a.dropdownImage.attr("style", c.find("i").attr("style"))); a.triggerEvent("changed")
                }, "disable.selectBoxIt": function () { a.dropdown.addClass(a.theme.disabled) },
                "enable.selectBoxIt": function () { a.dropdown.removeClass(a.theme.disabled) }, "open.selectBoxIt": function () {
                    var b = a.list.find("li[data-val='" + a.dropdownText.attr("data-val") + "']"); b.length || (b = a.listItems.not("[data-disabled=true]").first()); a.currentFocus = +b.attr("data-id"); b = a.listItems.eq(a.currentFocus); a.dropdown.addClass(l).removeClass(e).addClass(g); a.listItems.removeClass(a.selectedClass).removeAttr("data-active").not(b).removeClass(g); b.addClass(a.selectedClass).addClass(g); a.options.hideCurrent &&
                    (a.listItems.show(), b.hide())
                }, "close.selectBoxIt": function () { a.dropdown.removeClass(l) }, "blur.selectBoxIt": function () { a.dropdown.removeClass(g) }, "mouseenter.selectBoxIt": function () { c(this).hasClass(a.theme.disabled) || a.dropdown.addClass(e) }, "mouseleave.selectBoxIt": function () { a.dropdown.removeClass(e) }, destroy: function (a) { a.preventDefault(); a.stopPropagation() }
            }); return a
        }, _update: function (a) {
            var b, d = this.options.defaultText || this.selectBox.attr("data-text"), c = this.listItems.eq(this.currentFocus);
            "false" === a.attr("data-disabled") && (this.listItems.eq(this.currentFocus).attr("data-selectedtext"), (b = c.attr("data-text")) || c.text(), (d && this.options.html ? this.dropdownText.html() === d : this.dropdownText.text() === d) && this.selectBox.val() === a.attr("data-val") ? this.triggerEvent("change") : (this.selectBox.val(a.attr("data-val")), this.currentFocus = +a.attr("data-id"), this.originalElem.value !== this.dropdownText.attr("data-val") && this.triggerEvent("change")))
        }, _addClasses: function (a) {
            this.focusClass = a.focus;
            this.hoverClass = a.hover; var b = a.button, d = a.list, c = a.arrow, h = a.container; this.openClass = a.open; this.selectedClass = "selectboxit-selected"; this.downArrow.addClass(this.selectBox.attr("data-downarrow") || this.options.downArrowIcon || c); this.dropdownContainer.addClass(h); this.dropdown.addClass(b); this.list.addClass(d); return this
        }, refresh: function (a, b) { this._destroySelectBoxIt()._create(!0); b || this.triggerEvent("refresh"); this._callbackSupport(a); return this }, htmlEscape: function (a) {
            return String(a).replace(/&/g,
            "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        }, triggerEvent: function (a) { this.selectBox.trigger(a, { selectbox: this.selectBox, selectboxOption: this.selectItems.eq(this.options.showFirstOption ? this.currentFocus : 0 <= this.currentFocus - 1 ? this.currentFocus : 0), dropdown: this.dropdown, dropdownOption: this.listItems.eq(this.currentFocus) }); return this }, _copyAttributes: function () { this._addSelectBoxAttributes && this._addSelectBoxAttributes(); return this }, _realOuterWidth: function (a) {
            if (a.is(":visible")) return a.outerWidth(!0);
            a = a.clone(); var b; a.css({ visibility: "hidden", display: "block", position: "absolute" }).appendTo("body"); b = a.outerWidth(!0); a.remove(); return b
        }
    }); var e = c.selectBox.selectBoxIt.prototype; e._ariaAccessibility = function () {
        var a = this, b = c("label[for='" + a.originalElem.id + "']"); a.dropdownContainer.attr({ role: "combobox", "aria-autocomplete": "list", "aria-haspopup": "true", "aria-expanded": "false", "aria-owns": a.list[0].id }); a.dropdownText.attr({ "aria-live": "polite" }); a.dropdown.on({
            "disable.selectBoxIt": function () {
                a.dropdownContainer.attr("aria-disabled",
                "true")
            }, "enable.selectBoxIt": function () { a.dropdownContainer.attr("aria-disabled", "false") }
        }); b.length && a.dropdownContainer.attr("aria-labelledby", b[0].id); a.list.attr({ role: "listbox", "aria-hidden": "true" }); a.listItems.attr({ role: "option" }); a.selectBox.on({ "open.selectBoxIt": function () { a.list.attr("aria-hidden", "false"); a.dropdownContainer.attr("aria-expanded", "true") }, "close.selectBoxIt": function () { a.list.attr("aria-hidden", "true"); a.dropdownContainer.attr("aria-expanded", "false") } }); return a
    }; e._addSelectBoxAttributes =
    function () { var a = this; a._addAttributes(a.selectBox.prop("attributes"), a.dropdown); a.selectItems.each(function (b) { a._addAttributes(c(this).prop("attributes"), a.listItems.eq(b)) }); return a }; e._addAttributes = function (a, b) { var d = this.options.copyAttributes; a.length && c.each(a, function (a, h) { var g = h.name.toLowerCase(), e = h.value; "null" === e || -1 === c.inArray(g, d) && -1 === g.indexOf("data") || b.attr(g, e) }); return this }; e.destroy = function (a) {
        this._destroySelectBoxIt(); this.widgetProto.destroy.call(this); this._callbackSupport(a);
        return this
    }; e._destroySelectBoxIt = function () { this.dropdown.off(".selectBoxIt"); c.contains(this.dropdownContainer[0], this.originalElem) && this.dropdownContainer.before(this.selectBox); this.dropdownContainer.remove(); this.selectBox.removeAttr("style").attr("style", this.selectBoxStyles); this.triggerEvent("destroy"); return this }; e.disable = function (a) {
        this.options.disabled || (this.close(), this.selectBox.attr("disabled", "disabled"), this.dropdown.removeAttr("tabindex").removeClass(this.theme.enabled).addClass(this.theme.disabled),
        this.setOption("disabled", !0), this.triggerEvent("disable")); this._callbackSupport(a); return this
    }; e.disableOption = function (a, b) {
        var d, f; "number" === c.type(a) && (this.close(), d = this.selectBox.find("option").eq(a), this.triggerEvent("disable-option"), d.attr("disabled", "disabled"), this.listItems.eq(a).attr("data-disabled", "true").addClass(this.theme.disabled), this.currentFocus === a && (d = this.listItems.eq(this.currentFocus).nextAll("li").not("[data-disabled='true']").first().length, f = this.listItems.eq(this.currentFocus).prevAll("li").not("[data-disabled='true']").first().length,
        d ? this.moveDown() : f ? this.moveUp() : this.disable())); this._callbackSupport(b); return this
    }; e._isDisabled = function (a) { this.originalElem.disabled && this.disable(); return this }; e._dynamicPositioning = function () {
        if ("number" === c.type(this.listSize)) this.list.css("max-height", this.maxHeight || "none"); else {
            var a = this.dropdown.offset().top, b = this.list.data("max-height") || this.list.outerHeight(), d = this.dropdown.outerHeight(), f = this.options.viewport, h = f.height(), f = c.isWindow(f.get(0)) ? f.scrollTop() : f.offset().top,
            g = !(a + d + b <= h + f); this.list.data("max-height") || this.list.data("max-height", this.list.outerHeight()); g ? this.dropdown.offset().top - f >= b ? (this.list.css("max-height", b), this.list.css("top", this.dropdown.position().top - this.list.outerHeight())) : (a = Math.abs(a + d + b - (h + f)), h = Math.abs(this.dropdown.offset().top - f - b), a < h ? (this.list.css("max-height", b - a - d / 2), this.list.css("top", "auto")) : (this.list.css("max-height", b - h - d / 2), this.list.css("top", this.dropdown.position().top - this.list.outerHeight()))) : (this.list.css("max-height",
            b), this.list.css("top", "auto"))
        } return this
    }; e.enable = function (a) { this.options.disabled && (this.triggerEvent("enable"), this.selectBox.removeAttr("disabled"), this.dropdown.attr("tabindex", 0).removeClass(this.theme.disabled).addClass(this.theme.enabled), this.setOption("disabled", !1), this._callbackSupport(a)); return this }; e.enableOption = function (a, b) {
        var d; "number" === c.type(a) && (d = this.selectBox.find("option").eq(a), this.triggerEvent("enable-option"), d.removeAttr("disabled"), this.listItems.eq(a).attr("data-disabled",
        "false").removeClass(this.theme.disabled)); this._callbackSupport(b); return this
    }; e.moveDown = function (a) {
        this.currentFocus += 1; var b = "true" === this.listItems.eq(this.currentFocus).attr("data-disabled") ? !0 : !1, d = this.listItems.eq(this.currentFocus).nextAll("li").not("[data-disabled='true']").first().length; if (this.currentFocus === this.listItems.length)--this.currentFocus; else {
            if (b && d) { this.listItems.eq(this.currentFocus - 1).blur(); this.moveDown(); return } b && !d ? --this.currentFocus : (this.listItems.eq(this.currentFocus -
            1).blur().end().eq(this.currentFocus).focusin(), this._scrollToView("down"), this.triggerEvent("moveDown"))
        } this._callbackSupport(a); return this
    }; e.moveUp = function (a) {
        --this.currentFocus; var b = "true" === this.listItems.eq(this.currentFocus).attr("data-disabled") ? !0 : !1, d = this.listItems.eq(this.currentFocus).prevAll("li").not("[data-disabled='true']").first().length; if (-1 === this.currentFocus) this.currentFocus += 1; else {
            if (b && d) { this.listItems.eq(this.currentFocus + 1).blur(); this.moveUp(); return } b && !d ? this.currentFocus +=
            1 : (this.listItems.eq(this.currentFocus + 1).blur().end().eq(this.currentFocus).focusin(), this._scrollToView("up"), this.triggerEvent("moveUp"))
        } this._callbackSupport(a); return this
    }; e._setCurrentSearchOption = function (a) {
        (this.options.aggressiveChange || this.options.selectWhenHidden || this.listItems.eq(a).is(":visible")) && !0 !== this.listItems.eq(a).data("disabled") && (this.listItems.eq(this.currentFocus).blur(), this.currentFocus = this.currentIndex = a, this.listItems.eq(this.currentFocus).focusin(), this._scrollToView("search"),
        this.triggerEvent("search")); return this
    }; e._searchAlgorithm = function (a, b) {
        var d = !1, c, h, g, e, l = this.textArray, k = this.currentText; c = a; for (g = l.length; c < g; c += 1) {
            e = l[c]; for (h = 0; h < g; h += 1) -1 !== l[h].search(b) && (d = !0, h = g); d || (k = this.currentText = this.currentText.charAt(this.currentText.length - 1).replace(/[|()\[{.+*?$\\]/g, "\\$0")); b = new RegExp(k, "gi"); if (3 > k.length) {
                if (b = new RegExp(k.charAt(0), "gi"), -1 !== e.charAt(0).search(b)) {
                    this._setCurrentSearchOption(c); if (e.substring(0, k.length).toLowerCase() !== k.toLowerCase() ||
                    this.options.similarSearch) this.currentIndex += 1; return !1
                }
            } else if (-1 !== e.search(b)) return this._setCurrentSearchOption(c), !1; if (e.toLowerCase() === this.currentText.toLowerCase()) return this._setCurrentSearchOption(c), this.currentText = "", !1
        } return !0
    }; e.search = function (a, b, d) {
        this.currentText = d ? this.currentText + a.replace(/[|()\[{.+*?$\\]/g, "\\$0") : a.replace(/[|()\[{.+*?$\\]/g, "\\$0"); this._searchAlgorithm(this.currentIndex, new RegExp(this.currentText, "gi")) && this._searchAlgorithm(0, this.currentText);
        this._callbackSupport(b); return this
    }; e._updateMobileText = function () { var a, b; a = this.selectBox.find("option").filter(":selected"); b = (b = a.attr("data-text")) ? b : a.text(); this._setText(this.dropdownText, b); this.list.find('li[data-val="' + a.val() + '"]').find("i").attr("class") && this.dropdownImage.attr("class", this.list.find('li[data-val="' + a.val() + '"]').find("i").attr("class")).addClass("selectboxit-default-icon") }; e._applyNativeSelect = function () {
        this.dropdownContainer.append(this.selectBox); this.dropdown.attr("tabindex",
        "-1"); this.selectBox.css({ display: "block", visibility: "visible", width: this._realOuterWidth(this.dropdown), height: this.dropdown.outerHeight(), opacity: "0", position: "absolute", top: "0", left: "0", cursor: "pointer", "z-index": "999999", margin: this.dropdown.css("margin"), padding: "0", "-webkit-appearance": "menulist-button" }); this.originalElem.disabled && this.triggerEvent("disable"); return this
    }; e._mobileEvents = function () {
        var a = this; a.selectBox.on({
            "changed.selectBoxIt": function () {
                a.hasChanged = !0; a._updateMobileText();
                a.triggerEvent("option-click")
            }, "mousedown.selectBoxIt": function () { a.hasChanged || !a.options.defaultText || a.originalElem.disabled || (a._updateMobileText(), a.triggerEvent("option-click")) }, "enable.selectBoxIt": function () { a.selectBox.removeClass("selectboxit-rendering") }, "disable.selectBoxIt": function () { a.selectBox.addClass("selectboxit-rendering") }
        })
    }; e._mobile = function (a) { this.isMobile && (this._applyNativeSelect(), this._mobileEvents()); return this }; e.selectOption = function (a, b) {
        var d = c.type(a); "number" ===
        d ? this.selectBox.val(this.selectItems.eq(a).val()).change() : "string" === d && this.selectBox.val(a).change(); this._callbackSupport(b); return this
    }; e.setOption = function (a, b, d) { var f = this; "string" === c.type(a) && (f.options[a] = b); f.refresh(function () { f._callbackSupport(d) }, !0); return f }; e.setOptions = function (a, b) { var d = this; c.isPlainObject(a) && (d.options = c.extend({}, d.options, a)); d.refresh(function () { d._callbackSupport(b) }, !0); return d }; e.wait = function (a, b) { this.widgetProto._delay.call(this, b, a); return this };
    e.add = function (a, b) {
        this._populate(a, function (a) {
            var f = this, e = c.type(a), g = 0, n, l = [], k = (n = f._isJSON(a)) && f._parseJSON(a); if (a && ("array" === e || n && k.data && "array" === c.type(k.data)) || "object" === e && a.data && "array" === c.type(a.data)) { f._isJSON(a) && (a = k); a.data && (a = a.data); for (n = a.length; g <= n - 1; g += 1) e = a[g], c.isPlainObject(e) ? l.push(c("<option/>", e)) : "string" === c.type(e) && l.push(c("<option/>", { text: e, value: e })); f.selectBox.append(l) } else a && "string" === e && !f._isJSON(a) ? f.selectBox.append(a) : a && "object" === e ? f.selectBox.append(c("<option/>",
            a)) : a && f._isJSON(a) && c.isPlainObject(f._parseJSON(a)) && f.selectBox.append(c("<option/>", f._parseJSON(a))); f.dropdown ? f.refresh(function () { f._callbackSupport(b) }, !0) : f._callbackSupport(b); return f
        })
    }; e._parseJSON = function (a) { return JSON && JSON.parse && JSON.parse(a) || c.parseJSON(a) }; e._isJSON = function (a) { try { return this._parseJSON(a), !0 } catch (b) { return !1 } }; e._populate = function (a, b) { var d = this; a = c.isFunction(a) ? a.call() : a; d.isDeferred(a) ? a.done(function (a) { b.call(d, a) }) : b.call(d, a); return d }; e.remove =
    function (a, b) { var d = this, f = c.type(a), e = 0, g, n = ""; if ("array" === f) { for (g = a.length; e <= g - 1; e += 1) f = a[e], "number" === c.type(f) && (n = n.length ? n + (", option:eq(" + f + ")") : n + ("option:eq(" + f + ")")); d.selectBox.find(n).remove() } else "number" === f ? d.selectBox.find("option").eq(a).remove() : d.selectBox.find("option").remove(); d.dropdown ? d.refresh(function () { d._callbackSupport(b) }, !0) : d._callbackSupport(b); return d }
});
},{}],15:[function(require,module,exports){
/*
 Leaflet, a JavaScript library for mobile-friendly interactive maps. http://leafletjs.com
 (c) 2010-2013, Vladimir Agafonkin
 (c) 2010-2011, CloudMade
*/
!function (t, e, i) {
    var n = t.L, o = {}; o.version = "0.7.5", "object" == typeof module && "object" == typeof module.exports ? module.exports = o : "function" == typeof define && define.amd && define(o), o.noConflict = function () { return t.L = n, this }, t.L = o, o.Util = { extend: function (t) { var e, i, n, o, s = Array.prototype.slice.call(arguments, 1); for (i = 0, n = s.length; n > i; i++) { o = s[i] || {}; for (e in o) o.hasOwnProperty(e) && (t[e] = o[e]) } return t }, bind: function (t, e) { var i = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : null; return function () { return t.apply(e, i || arguments) } }, stamp: function () { var t = 0, e = "_leaflet_id"; return function (i) { return i[e] = i[e] || ++t, i[e] } }(), invokeEach: function (t, e, i) { var n, o; if ("object" == typeof t) { o = Array.prototype.slice.call(arguments, 3); for (n in t) e.apply(i, [n, t[n]].concat(o)); return !0 } return !1 }, limitExecByInterval: function (t, e, i) { var n, o; return function s() { var a = arguments; return n ? void (o = !0) : (n = !0, setTimeout(function () { n = !1, o && (s.apply(i, a), o = !1) }, e), void t.apply(i, a)) } }, falseFn: function () { return !1 }, formatNum: function (t, e) { var i = Math.pow(10, e || 5); return Math.round(t * i) / i }, trim: function (t) { return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "") }, splitWords: function (t) { return o.Util.trim(t).split(/\s+/) }, setOptions: function (t, e) { return t.options = o.extend({}, t.options, e), t.options }, getParamString: function (t, e, i) { var n = []; for (var o in t) n.push(encodeURIComponent(i ? o.toUpperCase() : o) + "=" + encodeURIComponent(t[o])); return (e && -1 !== e.indexOf("?") ? "&" : "?") + n.join("&") }, template: function (t, e) { return t.replace(/\{ *([\w_]+) *\}/g, function (t, n) { var o = e[n]; if (o === i) throw new Error("No value provided for variable " + t); return "function" == typeof o && (o = o(e)), o }) }, isArray: Array.isArray || function (t) { return "[object Array]" === Object.prototype.toString.call(t) }, emptyImageUrl: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" }, function () { function e(e) { var i, n, o = ["webkit", "moz", "o", "ms"]; for (i = 0; i < o.length && !n; i++) n = t[o[i] + e]; return n } function i(e) { var i = +new Date, o = Math.max(0, 16 - (i - n)); return n = i + o, t.setTimeout(e, o) } var n = 0, s = t.requestAnimationFrame || e("RequestAnimationFrame") || i, a = t.cancelAnimationFrame || e("CancelAnimationFrame") || e("CancelRequestAnimationFrame") || function (e) { t.clearTimeout(e) }; o.Util.requestAnimFrame = function (e, n, a, r) { return e = o.bind(e, n), a && s === i ? void e() : s.call(t, e, r) }, o.Util.cancelAnimFrame = function (e) { e && a.call(t, e) } }(), o.extend = o.Util.extend, o.bind = o.Util.bind, o.stamp = o.Util.stamp, o.setOptions = o.Util.setOptions, o.Class = function () { }, o.Class.extend = function (t) { var e = function () { this.initialize && this.initialize.apply(this, arguments), this._initHooks && this.callInitHooks() }, i = function () { }; i.prototype = this.prototype; var n = new i; n.constructor = e, e.prototype = n; for (var s in this) this.hasOwnProperty(s) && "prototype" !== s && (e[s] = this[s]); t.statics && (o.extend(e, t.statics), delete t.statics), t.includes && (o.Util.extend.apply(null, [n].concat(t.includes)), delete t.includes), t.options && n.options && (t.options = o.extend({}, n.options, t.options)), o.extend(n, t), n._initHooks = []; var a = this; return e.__super__ = a.prototype, n.callInitHooks = function () { if (!this._initHooksCalled) { a.prototype.callInitHooks && a.prototype.callInitHooks.call(this), this._initHooksCalled = !0; for (var t = 0, e = n._initHooks.length; e > t; t++) n._initHooks[t].call(this) } }, e }, o.Class.include = function (t) { o.extend(this.prototype, t) }, o.Class.mergeOptions = function (t) { o.extend(this.prototype.options, t) }, o.Class.addInitHook = function (t) { var e = Array.prototype.slice.call(arguments, 1), i = "function" == typeof t ? t : function () { this[t].apply(this, e) }; this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(i) }; var s = "_leaflet_events"; o.Mixin = {}, o.Mixin.Events = { addEventListener: function (t, e, i) { if (o.Util.invokeEach(t, this.addEventListener, this, e, i)) return this; var n, a, r, h, l, u, c, d = this[s] = this[s] || {}, p = i && i !== this && o.stamp(i); for (t = o.Util.splitWords(t), n = 0, a = t.length; a > n; n++) r = { action: e, context: i || this }, h = t[n], p ? (l = h + "_idx", u = l + "_len", c = d[l] = d[l] || {}, c[p] || (c[p] = [], d[u] = (d[u] || 0) + 1), c[p].push(r)) : (d[h] = d[h] || [], d[h].push(r)); return this }, hasEventListeners: function (t) { var e = this[s]; return !!e && (t in e && e[t].length > 0 || t + "_idx" in e && e[t + "_idx_len"] > 0) }, removeEventListener: function (t, e, i) { if (!this[s]) return this; if (!t) return this.clearAllEventListeners(); if (o.Util.invokeEach(t, this.removeEventListener, this, e, i)) return this; var n, a, r, h, l, u, c, d, p, _ = this[s], m = i && i !== this && o.stamp(i); for (t = o.Util.splitWords(t), n = 0, a = t.length; a > n; n++) if (r = t[n], u = r + "_idx", c = u + "_len", d = _[u], e) { if (h = m && d ? d[m] : _[r]) { for (l = h.length - 1; l >= 0; l--) h[l].action !== e || i && h[l].context !== i || (p = h.splice(l, 1), p[0].action = o.Util.falseFn); i && d && 0 === h.length && (delete d[m], _[c]--) } } else delete _[r], delete _[u], delete _[c]; return this }, clearAllEventListeners: function () { return delete this[s], this }, fireEvent: function (t, e) { if (!this.hasEventListeners(t)) return this; var i, n, a, r, h, l = o.Util.extend({}, e, { type: t, target: this }), u = this[s]; if (u[t]) for (i = u[t].slice(), n = 0, a = i.length; a > n; n++) i[n].action.call(i[n].context, l); r = u[t + "_idx"]; for (h in r) if (i = r[h].slice()) for (n = 0, a = i.length; a > n; n++) i[n].action.call(i[n].context, l); return this }, addOneTimeEventListener: function (t, e, i) { if (o.Util.invokeEach(t, this.addOneTimeEventListener, this, e, i)) return this; var n = o.bind(function () { this.removeEventListener(t, e, i).removeEventListener(t, n, i) }, this); return this.addEventListener(t, e, i).addEventListener(t, n, i) } }, o.Mixin.Events.on = o.Mixin.Events.addEventListener, o.Mixin.Events.off = o.Mixin.Events.removeEventListener, o.Mixin.Events.once = o.Mixin.Events.addOneTimeEventListener, o.Mixin.Events.fire = o.Mixin.Events.fireEvent, function () { var n = "ActiveXObject" in t, s = n && !e.addEventListener, a = navigator.userAgent.toLowerCase(), r = -1 !== a.indexOf("webkit"), h = -1 !== a.indexOf("chrome"), l = -1 !== a.indexOf("phantom"), u = -1 !== a.indexOf("android"), c = -1 !== a.search("android [23]"), d = -1 !== a.indexOf("gecko"), p = typeof orientation != i + "", _ = !t.PointerEvent && t.MSPointerEvent, m = t.PointerEvent && t.navigator.pointerEnabled && t.navigator.maxTouchPoints || _, f = "devicePixelRatio" in t && t.devicePixelRatio > 1 || "matchMedia" in t && t.matchMedia("(min-resolution:144dpi)") && t.matchMedia("(min-resolution:144dpi)").matches, g = e.documentElement, v = n && "transition" in g.style, y = "WebKitCSSMatrix" in t && "m11" in new t.WebKitCSSMatrix && !c, P = "MozPerspective" in g.style, L = "OTransition" in g.style, x = !t.L_DISABLE_3D && (v || y || P || L) && !l, w = !t.L_NO_TOUCH && !l && (m || "ontouchstart" in t || t.DocumentTouch && e instanceof t.DocumentTouch); o.Browser = { ie: n, ielt9: s, webkit: r, gecko: d && !r && !t.opera && !n, android: u, android23: c, chrome: h, ie3d: v, webkit3d: y, gecko3d: P, opera3d: L, any3d: x, mobile: p, mobileWebkit: p && r, mobileWebkit3d: p && y, mobileOpera: p && t.opera, touch: w, msPointer: _, pointer: m, retina: f } }(), o.Point = function (t, e, i) { this.x = i ? Math.round(t) : t, this.y = i ? Math.round(e) : e }, o.Point.prototype = { clone: function () { return new o.Point(this.x, this.y) }, add: function (t) { return this.clone()._add(o.point(t)) }, _add: function (t) { return this.x += t.x, this.y += t.y, this }, subtract: function (t) { return this.clone()._subtract(o.point(t)) }, _subtract: function (t) { return this.x -= t.x, this.y -= t.y, this }, divideBy: function (t) { return this.clone()._divideBy(t) }, _divideBy: function (t) { return this.x /= t, this.y /= t, this }, multiplyBy: function (t) { return this.clone()._multiplyBy(t) }, _multiplyBy: function (t) { return this.x *= t, this.y *= t, this }, round: function () { return this.clone()._round() }, _round: function () { return this.x = Math.round(this.x), this.y = Math.round(this.y), this }, floor: function () { return this.clone()._floor() }, _floor: function () { return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this }, distanceTo: function (t) { t = o.point(t); var e = t.x - this.x, i = t.y - this.y; return Math.sqrt(e * e + i * i) }, equals: function (t) { return t = o.point(t), t.x === this.x && t.y === this.y }, contains: function (t) { return t = o.point(t), Math.abs(t.x) <= Math.abs(this.x) && Math.abs(t.y) <= Math.abs(this.y) }, toString: function () { return "Point(" + o.Util.formatNum(this.x) + ", " + o.Util.formatNum(this.y) + ")" } }, o.point = function (t, e, n) { return t instanceof o.Point ? t : o.Util.isArray(t) ? new o.Point(t[0], t[1]) : t === i || null === t ? t : new o.Point(t, e, n) }, o.Bounds = function (t, e) { if (t) for (var i = e ? [t, e] : t, n = 0, o = i.length; o > n; n++) this.extend(i[n]) }, o.Bounds.prototype = { extend: function (t) { return t = o.point(t), this.min || this.max ? (this.min.x = Math.min(t.x, this.min.x), this.max.x = Math.max(t.x, this.max.x), this.min.y = Math.min(t.y, this.min.y), this.max.y = Math.max(t.y, this.max.y)) : (this.min = t.clone(), this.max = t.clone()), this }, getCenter: function (t) { return new o.Point((this.min.x + this.max.x) / 2, (this.min.y + this.max.y) / 2, t) }, getBottomLeft: function () { return new o.Point(this.min.x, this.max.y) }, getTopRight: function () { return new o.Point(this.max.x, this.min.y) }, getSize: function () { return this.max.subtract(this.min) }, contains: function (t) { var e, i; return t = "number" == typeof t[0] || t instanceof o.Point ? o.point(t) : o.bounds(t), t instanceof o.Bounds ? (e = t.min, i = t.max) : e = i = t, e.x >= this.min.x && i.x <= this.max.x && e.y >= this.min.y && i.y <= this.max.y }, intersects: function (t) { t = o.bounds(t); var e = this.min, i = this.max, n = t.min, s = t.max, a = s.x >= e.x && n.x <= i.x, r = s.y >= e.y && n.y <= i.y; return a && r }, isValid: function () { return !(!this.min || !this.max) } }, o.bounds = function (t, e) { return !t || t instanceof o.Bounds ? t : new o.Bounds(t, e) }, o.Transformation = function (t, e, i, n) { this._a = t, this._b = e, this._c = i, this._d = n }, o.Transformation.prototype = { transform: function (t, e) { return this._transform(t.clone(), e) }, _transform: function (t, e) { return e = e || 1, t.x = e * (this._a * t.x + this._b), t.y = e * (this._c * t.y + this._d), t }, untransform: function (t, e) { return e = e || 1, new o.Point((t.x / e - this._b) / this._a, (t.y / e - this._d) / this._c) } }, o.DomUtil = { get: function (t) { return "string" == typeof t ? e.getElementById(t) : t }, getStyle: function (t, i) { var n = t.style[i]; if (!n && t.currentStyle && (n = t.currentStyle[i]), (!n || "auto" === n) && e.defaultView) { var o = e.defaultView.getComputedStyle(t, null); n = o ? o[i] : null } return "auto" === n ? null : n }, getViewportOffset: function (t) { var i, n = 0, s = 0, a = t, r = e.body, h = e.documentElement; do { if (n += a.offsetTop || 0, s += a.offsetLeft || 0, n += parseInt(o.DomUtil.getStyle(a, "borderTopWidth"), 10) || 0, s += parseInt(o.DomUtil.getStyle(a, "borderLeftWidth"), 10) || 0, i = o.DomUtil.getStyle(a, "position"), a.offsetParent === r && "absolute" === i) break; if ("fixed" === i) { n += r.scrollTop || h.scrollTop || 0, s += r.scrollLeft || h.scrollLeft || 0; break } if ("relative" === i && !a.offsetLeft) { var l = o.DomUtil.getStyle(a, "width"), u = o.DomUtil.getStyle(a, "max-width"), c = a.getBoundingClientRect(); ("none" !== l || "none" !== u) && (s += c.left + a.clientLeft), n += c.top + (r.scrollTop || h.scrollTop || 0); break } a = a.offsetParent } while (a); a = t; do { if (a === r) break; n -= a.scrollTop || 0, s -= a.scrollLeft || 0, a = a.parentNode } while (a); return new o.Point(s, n) }, documentIsLtr: function () { return o.DomUtil._docIsLtrCached || (o.DomUtil._docIsLtrCached = !0, o.DomUtil._docIsLtr = "ltr" === o.DomUtil.getStyle(e.body, "direction")), o.DomUtil._docIsLtr }, create: function (t, i, n) { var o = e.createElement(t); return o.className = i, n && n.appendChild(o), o }, hasClass: function (t, e) { if (t.classList !== i) return t.classList.contains(e); var n = o.DomUtil._getClass(t); return n.length > 0 && new RegExp("(^|\\s)" + e + "(\\s|$)").test(n) }, addClass: function (t, e) { if (t.classList !== i) for (var n = o.Util.splitWords(e), s = 0, a = n.length; a > s; s++) t.classList.add(n[s]); else if (!o.DomUtil.hasClass(t, e)) { var r = o.DomUtil._getClass(t); o.DomUtil._setClass(t, (r ? r + " " : "") + e) } }, removeClass: function (t, e) { t.classList !== i ? t.classList.remove(e) : o.DomUtil._setClass(t, o.Util.trim((" " + o.DomUtil._getClass(t) + " ").replace(" " + e + " ", " "))) }, _setClass: function (t, e) { t.className.baseVal === i ? t.className = e : t.className.baseVal = e }, _getClass: function (t) { return t.className.baseVal === i ? t.className : t.className.baseVal }, setOpacity: function (t, e) { if ("opacity" in t.style) t.style.opacity = e; else if ("filter" in t.style) { var i = !1, n = "DXImageTransform.Microsoft.Alpha"; try { i = t.filters.item(n) } catch (o) { if (1 === e) return } e = Math.round(100 * e), i ? (i.Enabled = 100 !== e, i.Opacity = e) : t.style.filter += " progid:" + n + "(opacity=" + e + ")" } }, testProp: function (t) { for (var i = e.documentElement.style, n = 0; n < t.length; n++) if (t[n] in i) return t[n]; return !1 }, getTranslateString: function (t) { var e = o.Browser.webkit3d, i = "translate" + (e ? "3d" : "") + "(", n = (e ? ",0" : "") + ")"; return i + t.x + "px," + t.y + "px" + n }, getScaleString: function (t, e) { var i = o.DomUtil.getTranslateString(e.add(e.multiplyBy(-1 * t))), n = " scale(" + t + ") "; return i + n }, setPosition: function (t, e, i) { t._leaflet_pos = e, !i && o.Browser.any3d ? t.style[o.DomUtil.TRANSFORM] = o.DomUtil.getTranslateString(e) : (t.style.left = e.x + "px", t.style.top = e.y + "px") }, getPosition: function (t) { return t._leaflet_pos } }, o.DomUtil.TRANSFORM = o.DomUtil.testProp(["transform", "WebkitTransform", "OTransform", "MozTransform", "msTransform"]), o.DomUtil.TRANSITION = o.DomUtil.testProp(["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]), o.DomUtil.TRANSITION_END = "webkitTransition" === o.DomUtil.TRANSITION || "OTransition" === o.DomUtil.TRANSITION ? o.DomUtil.TRANSITION + "End" : "transitionend", function () { if ("onselectstart" in e) o.extend(o.DomUtil, { disableTextSelection: function () { o.DomEvent.on(t, "selectstart", o.DomEvent.preventDefault) }, enableTextSelection: function () { o.DomEvent.off(t, "selectstart", o.DomEvent.preventDefault) } }); else { var i = o.DomUtil.testProp(["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]); o.extend(o.DomUtil, { disableTextSelection: function () { if (i) { var t = e.documentElement.style; this._userSelect = t[i], t[i] = "none" } }, enableTextSelection: function () { i && (e.documentElement.style[i] = this._userSelect, delete this._userSelect) } }) } o.extend(o.DomUtil, { disableImageDrag: function () { o.DomEvent.on(t, "dragstart", o.DomEvent.preventDefault) }, enableImageDrag: function () { o.DomEvent.off(t, "dragstart", o.DomEvent.preventDefault) } }) }(), o.LatLng = function (t, e, n) { if (t = parseFloat(t), e = parseFloat(e), isNaN(t) || isNaN(e)) throw new Error("Invalid LatLng object: (" + t + ", " + e + ")"); this.lat = t, this.lng = e, n !== i && (this.alt = parseFloat(n)) }, o.extend(o.LatLng, { DEG_TO_RAD: Math.PI / 180, RAD_TO_DEG: 180 / Math.PI, MAX_MARGIN: 1e-9 }), o.LatLng.prototype = { equals: function (t) { if (!t) return !1; t = o.latLng(t); var e = Math.max(Math.abs(this.lat - t.lat), Math.abs(this.lng - t.lng)); return e <= o.LatLng.MAX_MARGIN }, toString: function (t) { return "LatLng(" + o.Util.formatNum(this.lat, t) + ", " + o.Util.formatNum(this.lng, t) + ")" }, distanceTo: function (t) { t = o.latLng(t); var e = 6378137, i = o.LatLng.DEG_TO_RAD, n = (t.lat - this.lat) * i, s = (t.lng - this.lng) * i, a = this.lat * i, r = t.lat * i, h = Math.sin(n / 2), l = Math.sin(s / 2), u = h * h + l * l * Math.cos(a) * Math.cos(r); return 2 * e * Math.atan2(Math.sqrt(u), Math.sqrt(1 - u)) }, wrap: function (t, e) { var i = this.lng; return t = t || -180, e = e || 180, i = (i + e) % (e - t) + (t > i || i === e ? e : t), new o.LatLng(this.lat, i) } }, o.latLng = function (t, e) { return t instanceof o.LatLng ? t : o.Util.isArray(t) ? "number" == typeof t[0] || "string" == typeof t[0] ? new o.LatLng(t[0], t[1], t[2]) : null : t === i || null === t ? t : "object" == typeof t && "lat" in t ? new o.LatLng(t.lat, "lng" in t ? t.lng : t.lon) : e === i ? null : new o.LatLng(t, e) }, o.LatLngBounds = function (t, e) { if (t) for (var i = e ? [t, e] : t, n = 0, o = i.length; o > n; n++) this.extend(i[n]) }, o.LatLngBounds.prototype = { extend: function (t) { if (!t) return this; var e = o.latLng(t); return t = null !== e ? e : o.latLngBounds(t), t instanceof o.LatLng ? this._southWest || this._northEast ? (this._southWest.lat = Math.min(t.lat, this._southWest.lat), this._southWest.lng = Math.min(t.lng, this._southWest.lng), this._northEast.lat = Math.max(t.lat, this._northEast.lat), this._northEast.lng = Math.max(t.lng, this._northEast.lng)) : (this._southWest = new o.LatLng(t.lat, t.lng), this._northEast = new o.LatLng(t.lat, t.lng)) : t instanceof o.LatLngBounds && (this.extend(t._southWest), this.extend(t._northEast)), this }, pad: function (t) { var e = this._southWest, i = this._northEast, n = Math.abs(e.lat - i.lat) * t, s = Math.abs(e.lng - i.lng) * t; return new o.LatLngBounds(new o.LatLng(e.lat - n, e.lng - s), new o.LatLng(i.lat + n, i.lng + s)) }, getCenter: function () { return new o.LatLng((this._southWest.lat + this._northEast.lat) / 2, (this._southWest.lng + this._northEast.lng) / 2) }, getSouthWest: function () { return this._southWest }, getNorthEast: function () { return this._northEast }, getNorthWest: function () { return new o.LatLng(this.getNorth(), this.getWest()) }, getSouthEast: function () { return new o.LatLng(this.getSouth(), this.getEast()) }, getWest: function () { return this._southWest.lng }, getSouth: function () { return this._southWest.lat }, getEast: function () { return this._northEast.lng }, getNorth: function () { return this._northEast.lat }, contains: function (t) { t = "number" == typeof t[0] || t instanceof o.LatLng ? o.latLng(t) : o.latLngBounds(t); var e, i, n = this._southWest, s = this._northEast; return t instanceof o.LatLngBounds ? (e = t.getSouthWest(), i = t.getNorthEast()) : e = i = t, e.lat >= n.lat && i.lat <= s.lat && e.lng >= n.lng && i.lng <= s.lng }, intersects: function (t) { t = o.latLngBounds(t); var e = this._southWest, i = this._northEast, n = t.getSouthWest(), s = t.getNorthEast(), a = s.lat >= e.lat && n.lat <= i.lat, r = s.lng >= e.lng && n.lng <= i.lng; return a && r }, toBBoxString: function () { return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(",") }, equals: function (t) { return t ? (t = o.latLngBounds(t), this._southWest.equals(t.getSouthWest()) && this._northEast.equals(t.getNorthEast())) : !1 }, isValid: function () { return !(!this._southWest || !this._northEast) } }, o.latLngBounds = function (t, e) { return !t || t instanceof o.LatLngBounds ? t : new o.LatLngBounds(t, e) }, o.Projection = {}, o.Projection.SphericalMercator = { MAX_LATITUDE: 85.0511287798, project: function (t) { var e = o.LatLng.DEG_TO_RAD, i = this.MAX_LATITUDE, n = Math.max(Math.min(i, t.lat), -i), s = t.lng * e, a = n * e; return a = Math.log(Math.tan(Math.PI / 4 + a / 2)), new o.Point(s, a) }, unproject: function (t) { var e = o.LatLng.RAD_TO_DEG, i = t.x * e, n = (2 * Math.atan(Math.exp(t.y)) - Math.PI / 2) * e; return new o.LatLng(n, i) } }, o.Projection.LonLat = { project: function (t) { return new o.Point(t.lng, t.lat) }, unproject: function (t) { return new o.LatLng(t.y, t.x) } }, o.CRS = { latLngToPoint: function (t, e) { var i = this.projection.project(t), n = this.scale(e); return this.transformation._transform(i, n) }, pointToLatLng: function (t, e) { var i = this.scale(e), n = this.transformation.untransform(t, i); return this.projection.unproject(n) }, project: function (t) { return this.projection.project(t) }, scale: function (t) { return 256 * Math.pow(2, t) }, getSize: function (t) { var e = this.scale(t); return o.point(e, e) } }, o.CRS.Simple = o.extend({}, o.CRS, { projection: o.Projection.LonLat, transformation: new o.Transformation(1, 0, -1, 0), scale: function (t) { return Math.pow(2, t) } }), o.CRS.EPSG3857 = o.extend({}, o.CRS, { code: "EPSG:3857", projection: o.Projection.SphericalMercator, transformation: new o.Transformation(.5 / Math.PI, .5, -.5 / Math.PI, .5), project: function (t) { var e = this.projection.project(t), i = 6378137; return e.multiplyBy(i) } }), o.CRS.EPSG900913 = o.extend({}, o.CRS.EPSG3857, { code: "EPSG:900913" }), o.CRS.EPSG4326 = o.extend({}, o.CRS, { code: "EPSG:4326", projection: o.Projection.LonLat, transformation: new o.Transformation(1 / 360, .5, -1 / 360, .5) }), o.Map = o.Class.extend({ includes: o.Mixin.Events, options: { crs: o.CRS.EPSG3857, fadeAnimation: o.DomUtil.TRANSITION && !o.Browser.android23, trackResize: !0, markerZoomAnimation: o.DomUtil.TRANSITION && o.Browser.any3d }, initialize: function (t, e) { e = o.setOptions(this, e), this._initContainer(t), this._initLayout(), this._onResize = o.bind(this._onResize, this), this._initEvents(), e.maxBounds && this.setMaxBounds(e.maxBounds), e.center && e.zoom !== i && this.setView(o.latLng(e.center), e.zoom, { reset: !0 }), this._handlers = [], this._layers = {}, this._zoomBoundLayers = {}, this._tileLayersNum = 0, this.callInitHooks(), this._addLayers(e.layers) }, setView: function (t, e) { return e = e === i ? this.getZoom() : e, this._resetView(o.latLng(t), this._limitZoom(e)), this }, setZoom: function (t, e) { return this._loaded ? this.setView(this.getCenter(), t, { zoom: e }) : (this._zoom = this._limitZoom(t), this) }, zoomIn: function (t, e) { return this.setZoom(this._zoom + (t || 1), e) }, zoomOut: function (t, e) { return this.setZoom(this._zoom - (t || 1), e) }, setZoomAround: function (t, e, i) { var n = this.getZoomScale(e), s = this.getSize().divideBy(2), a = t instanceof o.Point ? t : this.latLngToContainerPoint(t), r = a.subtract(s).multiplyBy(1 - 1 / n), h = this.containerPointToLatLng(s.add(r)); return this.setView(h, e, { zoom: i }) }, fitBounds: function (t, e) { e = e || {}, t = t.getBounds ? t.getBounds() : o.latLngBounds(t); var i = o.point(e.paddingTopLeft || e.padding || [0, 0]), n = o.point(e.paddingBottomRight || e.padding || [0, 0]), s = this.getBoundsZoom(t, !1, i.add(n)); s = e.maxZoom ? Math.min(e.maxZoom, s) : s; var a = n.subtract(i).divideBy(2), r = this.project(t.getSouthWest(), s), h = this.project(t.getNorthEast(), s), l = this.unproject(r.add(h).divideBy(2).add(a), s); return this.setView(l, s, e) }, fitWorld: function (t) { return this.fitBounds([[-90, -180], [90, 180]], t) }, panTo: function (t, e) { return this.setView(t, this._zoom, { pan: e }) }, panBy: function (t) { return this.fire("movestart"), this._rawPanBy(o.point(t)), this.fire("move"), this.fire("moveend") }, setMaxBounds: function (t) { return t = o.latLngBounds(t), this.options.maxBounds = t, t ? (this._loaded && this._panInsideMaxBounds(), this.on("moveend", this._panInsideMaxBounds, this)) : this.off("moveend", this._panInsideMaxBounds, this) }, panInsideBounds: function (t, e) { var i = this.getCenter(), n = this._limitCenter(i, this._zoom, t); return i.equals(n) ? this : this.panTo(n, e) }, addLayer: function (t) { var e = o.stamp(t); return this._layers[e] ? this : (this._layers[e] = t, !t.options || isNaN(t.options.maxZoom) && isNaN(t.options.minZoom) || (this._zoomBoundLayers[e] = t, this._updateZoomLevels()), this.options.zoomAnimation && o.TileLayer && t instanceof o.TileLayer && (this._tileLayersNum++, this._tileLayersToLoad++, t.on("load", this._onTileLayerLoad, this)), this._loaded && this._layerAdd(t), this) }, removeLayer: function (t) { var e = o.stamp(t); return this._layers[e] ? (this._loaded && t.onRemove(this), delete this._layers[e], this._loaded && this.fire("layerremove", { layer: t }), this._zoomBoundLayers[e] && (delete this._zoomBoundLayers[e], this._updateZoomLevels()), this.options.zoomAnimation && o.TileLayer && t instanceof o.TileLayer && (this._tileLayersNum--, this._tileLayersToLoad--, t.off("load", this._onTileLayerLoad, this)), this) : this }, hasLayer: function (t) { return t ? o.stamp(t) in this._layers : !1 }, eachLayer: function (t, e) { for (var i in this._layers) t.call(e, this._layers[i]); return this }, invalidateSize: function (t) { if (!this._loaded) return this; t = o.extend({ animate: !1, pan: !0 }, t === !0 ? { animate: !0 } : t); var e = this.getSize(); this._sizeChanged = !0, this._initialCenter = null; var i = this.getSize(), n = e.divideBy(2).round(), s = i.divideBy(2).round(), a = n.subtract(s); return a.x || a.y ? (t.animate && t.pan ? this.panBy(a) : (t.pan && this._rawPanBy(a), this.fire("move"), t.debounceMoveend ? (clearTimeout(this._sizeTimer), this._sizeTimer = setTimeout(o.bind(this.fire, this, "moveend"), 200)) : this.fire("moveend")), this.fire("resize", { oldSize: e, newSize: i })) : this }, addHandler: function (t, e) { if (!e) return this; var i = this[t] = new e(this); return this._handlers.push(i), this.options[t] && i.enable(), this }, remove: function () { this._loaded && this.fire("unload"), this._initEvents("off"); try { delete this._container._leaflet } catch (t) { this._container._leaflet = i } return this._clearPanes(), this._clearControlPos && this._clearControlPos(), this._clearHandlers(), this }, getCenter: function () { return this._checkIfLoaded(), this._initialCenter && !this._moved() ? this._initialCenter : this.layerPointToLatLng(this._getCenterLayerPoint()) }, getZoom: function () { return this._zoom }, getBounds: function () { var t = this.getPixelBounds(), e = this.unproject(t.getBottomLeft()), i = this.unproject(t.getTopRight()); return new o.LatLngBounds(e, i) }, getMinZoom: function () { return this.options.minZoom === i ? this._layersMinZoom === i ? 0 : this._layersMinZoom : this.options.minZoom }, getMaxZoom: function () { return this.options.maxZoom === i ? this._layersMaxZoom === i ? 1 / 0 : this._layersMaxZoom : this.options.maxZoom }, getBoundsZoom: function (t, e, i) { t = o.latLngBounds(t); var n, s = this.getMinZoom() - (e ? 1 : 0), a = this.getMaxZoom(), r = this.getSize(), h = t.getNorthWest(), l = t.getSouthEast(), u = !0; i = o.point(i || [0, 0]); do s++, n = this.project(l, s).subtract(this.project(h, s)).add(i), u = e ? n.x < r.x || n.y < r.y : r.contains(n); while (u && a >= s); return u && e ? null : e ? s : s - 1 }, getSize: function () { return (!this._size || this._sizeChanged) && (this._size = new o.Point(this._container.clientWidth, this._container.clientHeight), this._sizeChanged = !1), this._size.clone() }, getPixelBounds: function () { var t = this._getTopLeftPoint(); return new o.Bounds(t, t.add(this.getSize())) }, getPixelOrigin: function () { return this._checkIfLoaded(), this._initialTopLeftPoint }, getPanes: function () { return this._panes }, getContainer: function () { return this._container }, getZoomScale: function (t) { var e = this.options.crs; return e.scale(t) / e.scale(this._zoom) }, getScaleZoom: function (t) { return this._zoom + Math.log(t) / Math.LN2 }, project: function (t, e) { return e = e === i ? this._zoom : e, this.options.crs.latLngToPoint(o.latLng(t), e) }, unproject: function (t, e) { return e = e === i ? this._zoom : e, this.options.crs.pointToLatLng(o.point(t), e) }, layerPointToLatLng: function (t) { var e = o.point(t).add(this.getPixelOrigin()); return this.unproject(e) }, latLngToLayerPoint: function (t) { var e = this.project(o.latLng(t))._round(); return e._subtract(this.getPixelOrigin()) }, containerPointToLayerPoint: function (t) { return o.point(t).subtract(this._getMapPanePos()) }, layerPointToContainerPoint: function (t) { return o.point(t).add(this._getMapPanePos()) }, containerPointToLatLng: function (t) { var e = this.containerPointToLayerPoint(o.point(t)); return this.layerPointToLatLng(e) }, latLngToContainerPoint: function (t) { return this.layerPointToContainerPoint(this.latLngToLayerPoint(o.latLng(t))) }, mouseEventToContainerPoint: function (t) { return o.DomEvent.getMousePosition(t, this._container) }, mouseEventToLayerPoint: function (t) { return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(t)) }, mouseEventToLatLng: function (t) { return this.layerPointToLatLng(this.mouseEventToLayerPoint(t)) }, _initContainer: function (t) { var e = this._container = o.DomUtil.get(t); if (!e) throw new Error("Map container not found."); if (e._leaflet) throw new Error("Map container is already initialized."); e._leaflet = !0 }, _initLayout: function () { var t = this._container; o.DomUtil.addClass(t, "leaflet-container" + (o.Browser.touch ? " leaflet-touch" : "") + (o.Browser.retina ? " leaflet-retina" : "") + (o.Browser.ielt9 ? " leaflet-oldie" : "") + (this.options.fadeAnimation ? " leaflet-fade-anim" : "")); var e = o.DomUtil.getStyle(t, "position"); "absolute" !== e && "relative" !== e && "fixed" !== e && (t.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos() }, _initPanes: function () { var t = this._panes = {}; this._mapPane = t.mapPane = this._createPane("leaflet-map-pane", this._container), this._tilePane = t.tilePane = this._createPane("leaflet-tile-pane", this._mapPane), t.objectsPane = this._createPane("leaflet-objects-pane", this._mapPane), t.shadowPane = this._createPane("leaflet-shadow-pane"), t.overlayPane = this._createPane("leaflet-overlay-pane"), t.markerPane = this._createPane("leaflet-marker-pane"), t.popupPane = this._createPane("leaflet-popup-pane"); var e = " leaflet-zoom-hide"; this.options.markerZoomAnimation || (o.DomUtil.addClass(t.markerPane, e), o.DomUtil.addClass(t.shadowPane, e), o.DomUtil.addClass(t.popupPane, e)) }, _createPane: function (t, e) { return o.DomUtil.create("div", t, e || this._panes.objectsPane) }, _clearPanes: function () { this._container.removeChild(this._mapPane) }, _addLayers: function (t) { t = t ? o.Util.isArray(t) ? t : [t] : []; for (var e = 0, i = t.length; i > e; e++) this.addLayer(t[e]) }, _resetView: function (t, e, i, n) { var s = this._zoom !== e; n || (this.fire("movestart"), s && this.fire("zoomstart")), this._zoom = e, this._initialCenter = t, this._initialTopLeftPoint = this._getNewTopLeftPoint(t), i ? this._initialTopLeftPoint._add(this._getMapPanePos()) : o.DomUtil.setPosition(this._mapPane, new o.Point(0, 0)), this._tileLayersToLoad = this._tileLayersNum; var a = !this._loaded; this._loaded = !0, this.fire("viewreset", { hard: !i }), a && (this.fire("load"), this.eachLayer(this._layerAdd, this)), this.fire("move"), (s || n) && this.fire("zoomend"), this.fire("moveend", { hard: !i }) }, _rawPanBy: function (t) { o.DomUtil.setPosition(this._mapPane, this._getMapPanePos().subtract(t)) }, _getZoomSpan: function () { return this.getMaxZoom() - this.getMinZoom() }, _updateZoomLevels: function () { var t, e = 1 / 0, n = -(1 / 0), o = this._getZoomSpan(); for (t in this._zoomBoundLayers) { var s = this._zoomBoundLayers[t]; isNaN(s.options.minZoom) || (e = Math.min(e, s.options.minZoom)), isNaN(s.options.maxZoom) || (n = Math.max(n, s.options.maxZoom)) } t === i ? this._layersMaxZoom = this._layersMinZoom = i : (this._layersMaxZoom = n, this._layersMinZoom = e), o !== this._getZoomSpan() && this.fire("zoomlevelschange") }, _panInsideMaxBounds: function () { this.panInsideBounds(this.options.maxBounds) }, _checkIfLoaded: function () { if (!this._loaded) throw new Error("Set map center and zoom first.") }, _initEvents: function (e) { if (o.DomEvent) { e = e || "on", o.DomEvent[e](this._container, "click", this._onMouseClick, this); var i, n, s = ["dblclick", "mousedown", "mouseup", "mouseenter", "mouseleave", "mousemove", "contextmenu"]; for (i = 0, n = s.length; n > i; i++) o.DomEvent[e](this._container, s[i], this._fireMouseEvent, this); this.options.trackResize && o.DomEvent[e](t, "resize", this._onResize, this) } }, _onResize: function () { o.Util.cancelAnimFrame(this._resizeRequest), this._resizeRequest = o.Util.requestAnimFrame(function () { this.invalidateSize({ debounceMoveend: !0 }) }, this, !1, this._container) }, _onMouseClick: function (t) { !this._loaded || !t._simulated && (this.dragging && this.dragging.moved() || this.boxZoom && this.boxZoom.moved()) || o.DomEvent._skipped(t) || (this.fire("preclick"), this._fireMouseEvent(t)) }, _fireMouseEvent: function (t) { if (this._loaded && !o.DomEvent._skipped(t)) { var e = t.type; if (e = "mouseenter" === e ? "mouseover" : "mouseleave" === e ? "mouseout" : e, this.hasEventListeners(e)) { "contextmenu" === e && o.DomEvent.preventDefault(t); var i = this.mouseEventToContainerPoint(t), n = this.containerPointToLayerPoint(i), s = this.layerPointToLatLng(n); this.fire(e, { latlng: s, layerPoint: n, containerPoint: i, originalEvent: t }) } } }, _onTileLayerLoad: function () { this._tileLayersToLoad--, this._tileLayersNum && !this._tileLayersToLoad && this.fire("tilelayersload") }, _clearHandlers: function () { for (var t = 0, e = this._handlers.length; e > t; t++) this._handlers[t].disable() }, whenReady: function (t, e) { return this._loaded ? t.call(e || this, this) : this.on("load", t, e), this }, _layerAdd: function (t) { t.onAdd(this), this.fire("layeradd", { layer: t }) }, _getMapPanePos: function () { return o.DomUtil.getPosition(this._mapPane) }, _moved: function () { var t = this._getMapPanePos(); return t && !t.equals([0, 0]) }, _getTopLeftPoint: function () { return this.getPixelOrigin().subtract(this._getMapPanePos()) }, _getNewTopLeftPoint: function (t, e) { var i = this.getSize()._divideBy(2); return this.project(t, e)._subtract(i)._round() }, _latLngToNewLayerPoint: function (t, e, i) { var n = this._getNewTopLeftPoint(i, e).add(this._getMapPanePos()); return this.project(t, e)._subtract(n) }, _getCenterLayerPoint: function () { return this.containerPointToLayerPoint(this.getSize()._divideBy(2)) }, _getCenterOffset: function (t) { return this.latLngToLayerPoint(t).subtract(this._getCenterLayerPoint()) }, _limitCenter: function (t, e, i) { if (!i) return t; var n = this.project(t, e), s = this.getSize().divideBy(2), a = new o.Bounds(n.subtract(s), n.add(s)), r = this._getBoundsOffset(a, i, e); return this.unproject(n.add(r), e) }, _limitOffset: function (t, e) { if (!e) return t; var i = this.getPixelBounds(), n = new o.Bounds(i.min.add(t), i.max.add(t)); return t.add(this._getBoundsOffset(n, e)) }, _getBoundsOffset: function (t, e, i) { var n = this.project(e.getNorthWest(), i).subtract(t.min), s = this.project(e.getSouthEast(), i).subtract(t.max), a = this._rebound(n.x, -s.x), r = this._rebound(n.y, -s.y); return new o.Point(a, r) }, _rebound: function (t, e) { return t + e > 0 ? Math.round(t - e) / 2 : Math.max(0, Math.ceil(t)) - Math.max(0, Math.floor(e)) }, _limitZoom: function (t) { var e = this.getMinZoom(), i = this.getMaxZoom(); return Math.max(e, Math.min(i, t)) } }), o.map = function (t, e) { return new o.Map(t, e) }, o.Projection.Mercator = { MAX_LATITUDE: 85.0840591556, R_MINOR: 6356752.314245179, R_MAJOR: 6378137, project: function (t) { var e = o.LatLng.DEG_TO_RAD, i = this.MAX_LATITUDE, n = Math.max(Math.min(i, t.lat), -i), s = this.R_MAJOR, a = this.R_MINOR, r = t.lng * e * s, h = n * e, l = a / s, u = Math.sqrt(1 - l * l), c = u * Math.sin(h); c = Math.pow((1 - c) / (1 + c), .5 * u); var d = Math.tan(.5 * (.5 * Math.PI - h)) / c; return h = -s * Math.log(d), new o.Point(r, h) }, unproject: function (t) { for (var e, i = o.LatLng.RAD_TO_DEG, n = this.R_MAJOR, s = this.R_MINOR, a = t.x * i / n, r = s / n, h = Math.sqrt(1 - r * r), l = Math.exp(-t.y / n), u = Math.PI / 2 - 2 * Math.atan(l), c = 15, d = 1e-7, p = c, _ = .1; Math.abs(_) > d && --p > 0;) e = h * Math.sin(u), _ = Math.PI / 2 - 2 * Math.atan(l * Math.pow((1 - e) / (1 + e), .5 * h)) - u, u += _; return new o.LatLng(u * i, a) } }, o.CRS.EPSG3395 = o.extend({}, o.CRS, {
        code: "EPSG:3395",
        projection: o.Projection.Mercator, transformation: function () { var t = o.Projection.Mercator, e = t.R_MAJOR, i = .5 / (Math.PI * e); return new o.Transformation(i, .5, -i, .5) }()
    }), o.TileLayer = o.Class.extend({ includes: o.Mixin.Events, options: { minZoom: 0, maxZoom: 18, tileSize: 256, subdomains: "abc", errorTileUrl: "", attribution: "", zoomOffset: 0, opacity: 1, unloadInvisibleTiles: o.Browser.mobile, updateWhenIdle: o.Browser.mobile }, initialize: function (t, e) { e = o.setOptions(this, e), e.detectRetina && o.Browser.retina && e.maxZoom > 0 && (e.tileSize = Math.floor(e.tileSize / 2), e.zoomOffset++, e.minZoom > 0 && e.minZoom--, this.options.maxZoom--), e.bounds && (e.bounds = o.latLngBounds(e.bounds)), this._url = t; var i = this.options.subdomains; "string" == typeof i && (this.options.subdomains = i.split("")) }, onAdd: function (t) { this._map = t, this._animated = t._zoomAnimated, this._initContainer(), t.on({ viewreset: this._reset, moveend: this._update }, this), this._animated && t.on({ zoomanim: this._animateZoom, zoomend: this._endZoomAnim }, this), this.options.updateWhenIdle || (this._limitedUpdate = o.Util.limitExecByInterval(this._update, 150, this), t.on("move", this._limitedUpdate, this)), this._reset(), this._update() }, addTo: function (t) { return t.addLayer(this), this }, onRemove: function (t) { this._container.parentNode.removeChild(this._container), t.off({ viewreset: this._reset, moveend: this._update }, this), this._animated && t.off({ zoomanim: this._animateZoom, zoomend: this._endZoomAnim }, this), this.options.updateWhenIdle || t.off("move", this._limitedUpdate, this), this._container = null, this._map = null }, bringToFront: function () { var t = this._map._panes.tilePane; return this._container && (t.appendChild(this._container), this._setAutoZIndex(t, Math.max)), this }, bringToBack: function () { var t = this._map._panes.tilePane; return this._container && (t.insertBefore(this._container, t.firstChild), this._setAutoZIndex(t, Math.min)), this }, getAttribution: function () { return this.options.attribution }, getContainer: function () { return this._container }, setOpacity: function (t) { return this.options.opacity = t, this._map && this._updateOpacity(), this }, setZIndex: function (t) { return this.options.zIndex = t, this._updateZIndex(), this }, setUrl: function (t, e) { return this._url = t, e || this.redraw(), this }, redraw: function () { return this._map && (this._reset({ hard: !0 }), this._update()), this }, _updateZIndex: function () { this._container && this.options.zIndex !== i && (this._container.style.zIndex = this.options.zIndex) }, _setAutoZIndex: function (t, e) { var i, n, o, s = t.children, a = -e(1 / 0, -(1 / 0)); for (n = 0, o = s.length; o > n; n++) s[n] !== this._container && (i = parseInt(s[n].style.zIndex, 10), isNaN(i) || (a = e(a, i))); this.options.zIndex = this._container.style.zIndex = (isFinite(a) ? a : 0) + e(1, -1) }, _updateOpacity: function () { var t, e = this._tiles; if (o.Browser.ielt9) for (t in e) o.DomUtil.setOpacity(e[t], this.options.opacity); else o.DomUtil.setOpacity(this._container, this.options.opacity) }, _initContainer: function () { var t = this._map._panes.tilePane; if (!this._container) { if (this._container = o.DomUtil.create("div", "leaflet-layer"), this._updateZIndex(), this._animated) { var e = "leaflet-tile-container"; this._bgBuffer = o.DomUtil.create("div", e, this._container), this._tileContainer = o.DomUtil.create("div", e, this._container) } else this._tileContainer = this._container; t.appendChild(this._container), this.options.opacity < 1 && this._updateOpacity() } }, _reset: function (t) { for (var e in this._tiles) this.fire("tileunload", { tile: this._tiles[e] }); this._tiles = {}, this._tilesToLoad = 0, this.options.reuseTiles && (this._unusedTiles = []), this._tileContainer.innerHTML = "", this._animated && t && t.hard && this._clearBgBuffer(), this._initContainer() }, _getTileSize: function () { var t = this._map, e = t.getZoom() + this.options.zoomOffset, i = this.options.maxNativeZoom, n = this.options.tileSize; return i && e > i && (n = Math.round(t.getZoomScale(e) / t.getZoomScale(i) * n)), n }, _update: function () { if (this._map) { var t = this._map, e = t.getPixelBounds(), i = t.getZoom(), n = this._getTileSize(); if (!(i > this.options.maxZoom || i < this.options.minZoom)) { var s = o.bounds(e.min.divideBy(n)._floor(), e.max.divideBy(n)._floor()); this._addTilesFromCenterOut(s), (this.options.unloadInvisibleTiles || this.options.reuseTiles) && this._removeOtherTiles(s) } } }, _addTilesFromCenterOut: function (t) { var i, n, s, a = [], r = t.getCenter(); for (i = t.min.y; i <= t.max.y; i++) for (n = t.min.x; n <= t.max.x; n++) s = new o.Point(n, i), this._tileShouldBeLoaded(s) && a.push(s); var h = a.length; if (0 !== h) { a.sort(function (t, e) { return t.distanceTo(r) - e.distanceTo(r) }); var l = e.createDocumentFragment(); for (this._tilesToLoad || this.fire("loading"), this._tilesToLoad += h, n = 0; h > n; n++) this._addTile(a[n], l); this._tileContainer.appendChild(l) } }, _tileShouldBeLoaded: function (t) { if (t.x + ":" + t.y in this._tiles) return !1; var e = this.options; if (!e.continuousWorld) { var i = this._getWrapTileNum(); if (e.noWrap && (t.x < 0 || t.x >= i.x) || t.y < 0 || t.y >= i.y) return !1 } if (e.bounds) { var n = this._getTileSize(), o = t.multiplyBy(n), s = o.add([n, n]), a = this._map.unproject(o), r = this._map.unproject(s); if (e.continuousWorld || e.noWrap || (a = a.wrap(), r = r.wrap()), !e.bounds.intersects([a, r])) return !1 } return !0 }, _removeOtherTiles: function (t) { var e, i, n, o; for (o in this._tiles) e = o.split(":"), i = parseInt(e[0], 10), n = parseInt(e[1], 10), (i < t.min.x || i > t.max.x || n < t.min.y || n > t.max.y) && this._removeTile(o) }, _removeTile: function (t) { var e = this._tiles[t]; this.fire("tileunload", { tile: e, url: e.src }), this.options.reuseTiles ? (o.DomUtil.removeClass(e, "leaflet-tile-loaded"), this._unusedTiles.push(e)) : e.parentNode === this._tileContainer && this._tileContainer.removeChild(e), o.Browser.android || (e.onload = null, e.src = o.Util.emptyImageUrl), delete this._tiles[t] }, _addTile: function (t, e) { var i = this._getTilePos(t), n = this._getTile(); o.DomUtil.setPosition(n, i, o.Browser.chrome), this._tiles[t.x + ":" + t.y] = n, this._loadTile(n, t), n.parentNode !== this._tileContainer && e.appendChild(n) }, _getZoomForUrl: function () { var t = this.options, e = this._map.getZoom(); return t.zoomReverse && (e = t.maxZoom - e), e += t.zoomOffset, t.maxNativeZoom ? Math.min(e, t.maxNativeZoom) : e }, _getTilePos: function (t) { var e = this._map.getPixelOrigin(), i = this._getTileSize(); return t.multiplyBy(i).subtract(e) }, getTileUrl: function (t) { return o.Util.template(this._url, o.extend({ s: this._getSubdomain(t), z: t.z, x: t.x, y: t.y }, this.options)) }, _getWrapTileNum: function () { var t = this._map.options.crs, e = t.getSize(this._map.getZoom()); return e.divideBy(this._getTileSize())._floor() }, _adjustTilePoint: function (t) { var e = this._getWrapTileNum(); this.options.continuousWorld || this.options.noWrap || (t.x = (t.x % e.x + e.x) % e.x), this.options.tms && (t.y = e.y - t.y - 1), t.z = this._getZoomForUrl() }, _getSubdomain: function (t) { var e = Math.abs(t.x + t.y) % this.options.subdomains.length; return this.options.subdomains[e] }, _getTile: function () { if (this.options.reuseTiles && this._unusedTiles.length > 0) { var t = this._unusedTiles.pop(); return this._resetTile(t), t } return this._createTile() }, _resetTile: function () { }, _createTile: function () { var t = o.DomUtil.create("img", "leaflet-tile"); return t.style.width = t.style.height = this._getTileSize() + "px", t.galleryimg = "no", t.onselectstart = t.onmousemove = o.Util.falseFn, o.Browser.ielt9 && this.options.opacity !== i && o.DomUtil.setOpacity(t, this.options.opacity), o.Browser.mobileWebkit3d && (t.style.WebkitBackfaceVisibility = "hidden"), t }, _loadTile: function (t, e) { t._layer = this, t.onload = this._tileOnLoad, t.onerror = this._tileOnError, this._adjustTilePoint(e), t.src = this.getTileUrl(e), this.fire("tileloadstart", { tile: t, url: t.src }) }, _tileLoaded: function () { this._tilesToLoad--, this._animated && o.DomUtil.addClass(this._tileContainer, "leaflet-zoom-animated"), this._tilesToLoad || (this.fire("load"), this._animated && (clearTimeout(this._clearBgBufferTimer), this._clearBgBufferTimer = setTimeout(o.bind(this._clearBgBuffer, this), 500))) }, _tileOnLoad: function () { var t = this._layer; this.src !== o.Util.emptyImageUrl && (o.DomUtil.addClass(this, "leaflet-tile-loaded"), t.fire("tileload", { tile: this, url: this.src })), t._tileLoaded() }, _tileOnError: function () { var t = this._layer; t.fire("tileerror", { tile: this, url: this.src }); var e = t.options.errorTileUrl; e && (this.src = e), t._tileLoaded() } }), o.tileLayer = function (t, e) { return new o.TileLayer(t, e) }, o.TileLayer.WMS = o.TileLayer.extend({ defaultWmsParams: { service: "WMS", request: "GetMap", version: "1.1.1", layers: "", styles: "", format: "image/jpeg", transparent: !1 }, initialize: function (t, e) { this._url = t; var i = o.extend({}, this.defaultWmsParams), n = e.tileSize || this.options.tileSize; e.detectRetina && o.Browser.retina ? i.width = i.height = 2 * n : i.width = i.height = n; for (var s in e) this.options.hasOwnProperty(s) || "crs" === s || (i[s] = e[s]); this.wmsParams = i, o.setOptions(this, e) }, onAdd: function (t) { this._crs = this.options.crs || t.options.crs, this._wmsVersion = parseFloat(this.wmsParams.version); var e = this._wmsVersion >= 1.3 ? "crs" : "srs"; this.wmsParams[e] = this._crs.code, o.TileLayer.prototype.onAdd.call(this, t) }, getTileUrl: function (t) { var e = this._map, i = this.options.tileSize, n = t.multiplyBy(i), s = n.add([i, i]), a = this._crs.project(e.unproject(n, t.z)), r = this._crs.project(e.unproject(s, t.z)), h = this._wmsVersion >= 1.3 && this._crs === o.CRS.EPSG4326 ? [r.y, a.x, a.y, r.x].join(",") : [a.x, r.y, r.x, a.y].join(","), l = o.Util.template(this._url, { s: this._getSubdomain(t) }); return l + o.Util.getParamString(this.wmsParams, l, !0) + "&BBOX=" + h }, setParams: function (t, e) { return o.extend(this.wmsParams, t), e || this.redraw(), this } }), o.tileLayer.wms = function (t, e) { return new o.TileLayer.WMS(t, e) }, o.TileLayer.Canvas = o.TileLayer.extend({ options: { async: !1 }, initialize: function (t) { o.setOptions(this, t) }, redraw: function () { this._map && (this._reset({ hard: !0 }), this._update()); for (var t in this._tiles) this._redrawTile(this._tiles[t]); return this }, _redrawTile: function (t) { this.drawTile(t, t._tilePoint, this._map._zoom) }, _createTile: function () { var t = o.DomUtil.create("canvas", "leaflet-tile"); return t.width = t.height = this.options.tileSize, t.onselectstart = t.onmousemove = o.Util.falseFn, t }, _loadTile: function (t, e) { t._layer = this, t._tilePoint = e, this._redrawTile(t), this.options.async || this.tileDrawn(t) }, drawTile: function () { }, tileDrawn: function (t) { this._tileOnLoad.call(t) } }), o.tileLayer.canvas = function (t) { return new o.TileLayer.Canvas(t) }, o.ImageOverlay = o.Class.extend({ includes: o.Mixin.Events, options: { opacity: 1 }, initialize: function (t, e, i) { this._url = t, this._bounds = o.latLngBounds(e), o.setOptions(this, i) }, onAdd: function (t) { this._map = t, this._image || this._initImage(), t._panes.overlayPane.appendChild(this._image), t.on("viewreset", this._reset, this), t.options.zoomAnimation && o.Browser.any3d && t.on("zoomanim", this._animateZoom, this), this._reset() }, onRemove: function (t) { t.getPanes().overlayPane.removeChild(this._image), t.off("viewreset", this._reset, this), t.options.zoomAnimation && t.off("zoomanim", this._animateZoom, this) }, addTo: function (t) { return t.addLayer(this), this }, setOpacity: function (t) { return this.options.opacity = t, this._updateOpacity(), this }, bringToFront: function () { return this._image && this._map._panes.overlayPane.appendChild(this._image), this }, bringToBack: function () { var t = this._map._panes.overlayPane; return this._image && t.insertBefore(this._image, t.firstChild), this }, setUrl: function (t) { this._url = t, this._image.src = this._url }, getAttribution: function () { return this.options.attribution }, _initImage: function () { this._image = o.DomUtil.create("img", "leaflet-image-layer"), this._map.options.zoomAnimation && o.Browser.any3d ? o.DomUtil.addClass(this._image, "leaflet-zoom-animated") : o.DomUtil.addClass(this._image, "leaflet-zoom-hide"), this._updateOpacity(), o.extend(this._image, { galleryimg: "no", onselectstart: o.Util.falseFn, onmousemove: o.Util.falseFn, onload: o.bind(this._onImageLoad, this), src: this._url }) }, _animateZoom: function (t) { var e = this._map, i = this._image, n = e.getZoomScale(t.zoom), s = this._bounds.getNorthWest(), a = this._bounds.getSouthEast(), r = e._latLngToNewLayerPoint(s, t.zoom, t.center), h = e._latLngToNewLayerPoint(a, t.zoom, t.center)._subtract(r), l = r._add(h._multiplyBy(.5 * (1 - 1 / n))); i.style[o.DomUtil.TRANSFORM] = o.DomUtil.getTranslateString(l) + " scale(" + n + ") " }, _reset: function () { var t = this._image, e = this._map.latLngToLayerPoint(this._bounds.getNorthWest()), i = this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(e); o.DomUtil.setPosition(t, e), t.style.width = i.x + "px", t.style.height = i.y + "px" }, _onImageLoad: function () { this.fire("load") }, _updateOpacity: function () { o.DomUtil.setOpacity(this._image, this.options.opacity) } }), o.imageOverlay = function (t, e, i) { return new o.ImageOverlay(t, e, i) }, o.Icon = o.Class.extend({ options: { className: "" }, initialize: function (t) { o.setOptions(this, t) }, createIcon: function (t) { return this._createIcon("icon", t) }, createShadow: function (t) { return this._createIcon("shadow", t) }, _createIcon: function (t, e) { var i = this._getIconUrl(t); if (!i) { if ("icon" === t) throw new Error("iconUrl not set in Icon options (see the docs)."); return null } var n; return n = e && "IMG" === e.tagName ? this._createImg(i, e) : this._createImg(i), this._setIconStyles(n, t), n }, _setIconStyles: function (t, e) { var i, n = this.options, s = o.point(n[e + "Size"]); i = "shadow" === e ? o.point(n.shadowAnchor || n.iconAnchor) : o.point(n.iconAnchor), !i && s && (i = s.divideBy(2, !0)), t.className = "leaflet-marker-" + e + " " + n.className, i && (t.style.marginLeft = -i.x + "px", t.style.marginTop = -i.y + "px"), s && (t.style.width = s.x + "px", t.style.height = s.y + "px") }, _createImg: function (t, i) { return i = i || e.createElement("img"), i.src = t, i }, _getIconUrl: function (t) { return o.Browser.retina && this.options[t + "RetinaUrl"] ? this.options[t + "RetinaUrl"] : this.options[t + "Url"] } }), o.icon = function (t) { return new o.Icon(t) }, o.Icon.Default = o.Icon.extend({ options: { iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] }, _getIconUrl: function (t) { var e = t + "Url"; if (this.options[e]) return this.options[e]; o.Browser.retina && "icon" === t && (t += "-2x"); var i = o.Icon.Default.imagePath; if (!i) throw new Error("Couldn't autodetect L.Icon.Default.imagePath, set it manually."); return i + "/marker-" + t + ".png" } }), o.Icon.Default.imagePath = function () { var t, i, n, o, s, a = e.getElementsByTagName("script"), r = /[\/^]leaflet[\-\._]?([\w\-\._]*)\.js\??/; for (t = 0, i = a.length; i > t; t++) if (n = a[t].src, o = n.match(r)) return s = n.split(r)[0], (s ? s + "/" : "") + "images" }(), o.Marker = o.Class.extend({ includes: o.Mixin.Events, options: { icon: new o.Icon.Default, title: "", alt: "", clickable: !0, draggable: !1, keyboard: !0, zIndexOffset: 0, opacity: 1, riseOnHover: !1, riseOffset: 250 }, initialize: function (t, e) { o.setOptions(this, e), this._latlng = o.latLng(t) }, onAdd: function (t) { this._map = t, t.on("viewreset", this.update, this), this._initIcon(), this.update(), this.fire("add"), t.options.zoomAnimation && t.options.markerZoomAnimation && t.on("zoomanim", this._animateZoom, this) }, addTo: function (t) { return t.addLayer(this), this }, onRemove: function (t) { this.dragging && this.dragging.disable(), this._removeIcon(), this._removeShadow(), this.fire("remove"), t.off({ viewreset: this.update, zoomanim: this._animateZoom }, this), this._map = null }, getLatLng: function () { return this._latlng }, setLatLng: function (t) { return this._latlng = o.latLng(t), this.update(), this.fire("move", { latlng: this._latlng }) }, setZIndexOffset: function (t) { return this.options.zIndexOffset = t, this.update(), this }, setIcon: function (t) { return this.options.icon = t, this._map && (this._initIcon(), this.update()), this._popup && this.bindPopup(this._popup), this }, update: function () { return this._icon && this._setPos(this._map.latLngToLayerPoint(this._latlng).round()), this }, _initIcon: function () { var t = this.options, e = this._map, i = e.options.zoomAnimation && e.options.markerZoomAnimation, n = i ? "leaflet-zoom-animated" : "leaflet-zoom-hide", s = t.icon.createIcon(this._icon), a = !1; s !== this._icon && (this._icon && this._removeIcon(), a = !0, t.title && (s.title = t.title), t.alt && (s.alt = t.alt)), o.DomUtil.addClass(s, n), t.keyboard && (s.tabIndex = "0"), this._icon = s, this._initInteraction(), t.riseOnHover && o.DomEvent.on(s, "mouseover", this._bringToFront, this).on(s, "mouseout", this._resetZIndex, this); var r = t.icon.createShadow(this._shadow), h = !1; r !== this._shadow && (this._removeShadow(), h = !0), r && o.DomUtil.addClass(r, n), this._shadow = r, t.opacity < 1 && this._updateOpacity(); var l = this._map._panes; a && l.markerPane.appendChild(this._icon), r && h && l.shadowPane.appendChild(this._shadow) }, _removeIcon: function () { this.options.riseOnHover && o.DomEvent.off(this._icon, "mouseover", this._bringToFront).off(this._icon, "mouseout", this._resetZIndex), this._map._panes.markerPane.removeChild(this._icon), this._icon = null }, _removeShadow: function () { this._shadow && this._map._panes.shadowPane.removeChild(this._shadow), this._shadow = null }, _setPos: function (t) { o.DomUtil.setPosition(this._icon, t), this._shadow && o.DomUtil.setPosition(this._shadow, t), this._zIndex = t.y + this.options.zIndexOffset, this._resetZIndex() }, _updateZIndex: function (t) { this._icon.style.zIndex = this._zIndex + t }, _animateZoom: function (t) { var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center).round(); this._setPos(e) }, _initInteraction: function () { if (this.options.clickable) { var t = this._icon, e = ["dblclick", "mousedown", "mouseover", "mouseout", "contextmenu"]; o.DomUtil.addClass(t, "leaflet-clickable"), o.DomEvent.on(t, "click", this._onMouseClick, this), o.DomEvent.on(t, "keypress", this._onKeyPress, this); for (var i = 0; i < e.length; i++) o.DomEvent.on(t, e[i], this._fireMouseEvent, this); o.Handler.MarkerDrag && (this.dragging = new o.Handler.MarkerDrag(this), this.options.draggable && this.dragging.enable()) } }, _onMouseClick: function (t) { var e = this.dragging && this.dragging.moved(); (this.hasEventListeners(t.type) || e) && o.DomEvent.stopPropagation(t), e || (this.dragging && this.dragging._enabled || !this._map.dragging || !this._map.dragging.moved()) && this.fire(t.type, { originalEvent: t, latlng: this._latlng }) }, _onKeyPress: function (t) { 13 === t.keyCode && this.fire("click", { originalEvent: t, latlng: this._latlng }) }, _fireMouseEvent: function (t) { this.fire(t.type, { originalEvent: t, latlng: this._latlng }), "contextmenu" === t.type && this.hasEventListeners(t.type) && o.DomEvent.preventDefault(t), "mousedown" !== t.type ? o.DomEvent.stopPropagation(t) : o.DomEvent.preventDefault(t) }, setOpacity: function (t) { return this.options.opacity = t, this._map && this._updateOpacity(), this }, _updateOpacity: function () { o.DomUtil.setOpacity(this._icon, this.options.opacity), this._shadow && o.DomUtil.setOpacity(this._shadow, this.options.opacity) }, _bringToFront: function () { this._updateZIndex(this.options.riseOffset) }, _resetZIndex: function () { this._updateZIndex(0) } }), o.marker = function (t, e) { return new o.Marker(t, e) }, o.DivIcon = o.Icon.extend({ options: { iconSize: [12, 12], className: "leaflet-div-icon", html: !1 }, createIcon: function (t) { var i = t && "DIV" === t.tagName ? t : e.createElement("div"), n = this.options; return n.html !== !1 ? i.innerHTML = n.html : i.innerHTML = "", n.bgPos && (i.style.backgroundPosition = -n.bgPos.x + "px " + -n.bgPos.y + "px"), this._setIconStyles(i, "icon"), i }, createShadow: function () { return null } }), o.divIcon = function (t) { return new o.DivIcon(t) }, o.Map.mergeOptions({ closePopupOnClick: !0 }), o.Popup = o.Class.extend({ includes: o.Mixin.Events, options: { minWidth: 50, maxWidth: 300, autoPan: !0, closeButton: !0, offset: [0, 7], autoPanPadding: [5, 5], keepInView: !1, className: "", zoomAnimation: !0 }, initialize: function (t, e) { o.setOptions(this, t), this._source = e, this._animated = o.Browser.any3d && this.options.zoomAnimation, this._isOpen = !1 }, onAdd: function (t) { this._map = t, this._container || this._initLayout(); var e = t.options.fadeAnimation; e && o.DomUtil.setOpacity(this._container, 0), t._panes.popupPane.appendChild(this._container), t.on(this._getEvents(), this), this.update(), e && o.DomUtil.setOpacity(this._container, 1), this.fire("open"), t.fire("popupopen", { popup: this }), this._source && this._source.fire("popupopen", { popup: this }) }, addTo: function (t) { return t.addLayer(this), this }, openOn: function (t) { return t.openPopup(this), this }, onRemove: function (t) { t._panes.popupPane.removeChild(this._container), o.Util.falseFn(this._container.offsetWidth), t.off(this._getEvents(), this), t.options.fadeAnimation && o.DomUtil.setOpacity(this._container, 0), this._map = null, this.fire("close"), t.fire("popupclose", { popup: this }), this._source && this._source.fire("popupclose", { popup: this }) }, getLatLng: function () { return this._latlng }, setLatLng: function (t) { return this._latlng = o.latLng(t), this._map && (this._updatePosition(), this._adjustPan()), this }, getContent: function () { return this._content }, setContent: function (t) { return this._content = t, this.update(), this }, update: function () { this._map && (this._container.style.visibility = "hidden", this._updateContent(), this._updateLayout(), this._updatePosition(), this._container.style.visibility = "", this._adjustPan()) }, _getEvents: function () { var t = { viewreset: this._updatePosition }; return this._animated && (t.zoomanim = this._zoomAnimation), ("closeOnClick" in this.options ? this.options.closeOnClick : this._map.options.closePopupOnClick) && (t.preclick = this._close), this.options.keepInView && (t.moveend = this._adjustPan), t }, _close: function () { this._map && this._map.closePopup(this) }, _initLayout: function () { var t, e = "leaflet-popup", i = e + " " + this.options.className + " leaflet-zoom-" + (this._animated ? "animated" : "hide"), n = this._container = o.DomUtil.create("div", i); this.options.closeButton && (t = this._closeButton = o.DomUtil.create("a", e + "-close-button", n), t.href = "#close", t.innerHTML = "&#215;", o.DomEvent.disableClickPropagation(t), o.DomEvent.on(t, "click", this._onCloseButtonClick, this)); var s = this._wrapper = o.DomUtil.create("div", e + "-content-wrapper", n); o.DomEvent.disableClickPropagation(s), this._contentNode = o.DomUtil.create("div", e + "-content", s), o.DomEvent.disableScrollPropagation(this._contentNode), o.DomEvent.on(s, "contextmenu", o.DomEvent.stopPropagation), this._tipContainer = o.DomUtil.create("div", e + "-tip-container", n), this._tip = o.DomUtil.create("div", e + "-tip", this._tipContainer) }, _updateContent: function () { if (this._content) { if ("string" == typeof this._content) this._contentNode.innerHTML = this._content; else { for (; this._contentNode.hasChildNodes() ;) this._contentNode.removeChild(this._contentNode.firstChild); this._contentNode.appendChild(this._content) } this.fire("contentupdate") } }, _updateLayout: function () { var t = this._contentNode, e = t.style; e.width = "", e.whiteSpace = "nowrap"; var i = t.offsetWidth; i = Math.min(i, this.options.maxWidth), i = Math.max(i, this.options.minWidth), e.width = i + 1 + "px", e.whiteSpace = "", e.height = ""; var n = t.offsetHeight, s = this.options.maxHeight, a = "leaflet-popup-scrolled"; s && n > s ? (e.height = s + "px", o.DomUtil.addClass(t, a)) : o.DomUtil.removeClass(t, a), this._containerWidth = this._container.offsetWidth }, _updatePosition: function () { if (this._map) { var t = this._map.latLngToLayerPoint(this._latlng), e = this._animated, i = o.point(this.options.offset); e && o.DomUtil.setPosition(this._container, t), this._containerBottom = -i.y - (e ? 0 : t.y), this._containerLeft = -Math.round(this._containerWidth / 2) + i.x + (e ? 0 : t.x), this._container.style.bottom = this._containerBottom + "px", this._container.style.left = this._containerLeft + "px" } }, _zoomAnimation: function (t) { var e = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center); o.DomUtil.setPosition(this._container, e) }, _adjustPan: function () { if (this.options.autoPan) { var t = this._map, e = this._container.offsetHeight, i = this._containerWidth, n = new o.Point(this._containerLeft, -e - this._containerBottom); this._animated && n._add(o.DomUtil.getPosition(this._container)); var s = t.layerPointToContainerPoint(n), a = o.point(this.options.autoPanPadding), r = o.point(this.options.autoPanPaddingTopLeft || a), h = o.point(this.options.autoPanPaddingBottomRight || a), l = t.getSize(), u = 0, c = 0; s.x + i + h.x > l.x && (u = s.x + i - l.x + h.x), s.x - u - r.x < 0 && (u = s.x - r.x), s.y + e + h.y > l.y && (c = s.y + e - l.y + h.y), s.y - c - r.y < 0 && (c = s.y - r.y), (u || c) && t.fire("autopanstart").panBy([u, c]) } }, _onCloseButtonClick: function (t) { this._close(), o.DomEvent.stop(t) } }), o.popup = function (t, e) { return new o.Popup(t, e) }, o.Map.include({ openPopup: function (t, e, i) { if (this.closePopup(), !(t instanceof o.Popup)) { var n = t; t = new o.Popup(i).setLatLng(e).setContent(n) } return t._isOpen = !0, this._popup = t, this.addLayer(t) }, closePopup: function (t) { return t && t !== this._popup || (t = this._popup, this._popup = null), t && (this.removeLayer(t), t._isOpen = !1), this } }), o.Marker.include({ openPopup: function () { return this._popup && this._map && !this._map.hasLayer(this._popup) && (this._popup.setLatLng(this._latlng), this._map.openPopup(this._popup)), this }, closePopup: function () { return this._popup && this._popup._close(), this }, togglePopup: function () { return this._popup && (this._popup._isOpen ? this.closePopup() : this.openPopup()), this }, bindPopup: function (t, e) { var i = o.point(this.options.icon.options.popupAnchor || [0, 0]); return i = i.add(o.Popup.prototype.options.offset), e && e.offset && (i = i.add(e.offset)), e = o.extend({ offset: i }, e), this._popupHandlersAdded || (this.on("click", this.togglePopup, this).on("remove", this.closePopup, this).on("move", this._movePopup, this), this._popupHandlersAdded = !0), t instanceof o.Popup ? (o.setOptions(t, e), this._popup = t, t._source = this) : this._popup = new o.Popup(e, this).setContent(t), this }, setPopupContent: function (t) { return this._popup && this._popup.setContent(t), this }, unbindPopup: function () { return this._popup && (this._popup = null, this.off("click", this.togglePopup, this).off("remove", this.closePopup, this).off("move", this._movePopup, this), this._popupHandlersAdded = !1), this }, getPopup: function () { return this._popup }, _movePopup: function (t) { this._popup.setLatLng(t.latlng) } }), o.LayerGroup = o.Class.extend({ initialize: function (t) { this._layers = {}; var e, i; if (t) for (e = 0, i = t.length; i > e; e++) this.addLayer(t[e]) }, addLayer: function (t) { var e = this.getLayerId(t); return this._layers[e] = t, this._map && this._map.addLayer(t), this }, removeLayer: function (t) { var e = t in this._layers ? t : this.getLayerId(t); return this._map && this._layers[e] && this._map.removeLayer(this._layers[e]), delete this._layers[e], this }, hasLayer: function (t) { return t ? t in this._layers || this.getLayerId(t) in this._layers : !1 }, clearLayers: function () { return this.eachLayer(this.removeLayer, this), this }, invoke: function (t) { var e, i, n = Array.prototype.slice.call(arguments, 1); for (e in this._layers) i = this._layers[e], i[t] && i[t].apply(i, n); return this }, onAdd: function (t) { this._map = t, this.eachLayer(t.addLayer, t) }, onRemove: function (t) { this.eachLayer(t.removeLayer, t), this._map = null }, addTo: function (t) { return t.addLayer(this), this }, eachLayer: function (t, e) { for (var i in this._layers) t.call(e, this._layers[i]); return this }, getLayer: function (t) { return this._layers[t] }, getLayers: function () { var t = []; for (var e in this._layers) t.push(this._layers[e]); return t }, setZIndex: function (t) { return this.invoke("setZIndex", t) }, getLayerId: function (t) { return o.stamp(t) } }), o.layerGroup = function (t) { return new o.LayerGroup(t) }, o.FeatureGroup = o.LayerGroup.extend({ includes: o.Mixin.Events, statics: { EVENTS: "click dblclick mouseover mouseout mousemove contextmenu popupopen popupclose" }, addLayer: function (t) { return this.hasLayer(t) ? this : ("on" in t && t.on(o.FeatureGroup.EVENTS, this._propagateEvent, this), o.LayerGroup.prototype.addLayer.call(this, t), this._popupContent && t.bindPopup && t.bindPopup(this._popupContent, this._popupOptions), this.fire("layeradd", { layer: t })) }, removeLayer: function (t) { return this.hasLayer(t) ? (t in this._layers && (t = this._layers[t]), t.off(o.FeatureGroup.EVENTS, this._propagateEvent, this), o.LayerGroup.prototype.removeLayer.call(this, t), this._popupContent && this.invoke("unbindPopup"), this.fire("layerremove", { layer: t })) : this }, bindPopup: function (t, e) { return this._popupContent = t, this._popupOptions = e, this.invoke("bindPopup", t, e) }, openPopup: function (t) { for (var e in this._layers) { this._layers[e].openPopup(t); break } return this }, setStyle: function (t) { return this.invoke("setStyle", t) }, bringToFront: function () { return this.invoke("bringToFront") }, bringToBack: function () { return this.invoke("bringToBack") }, getBounds: function () { var t = new o.LatLngBounds; return this.eachLayer(function (e) { t.extend(e instanceof o.Marker ? e.getLatLng() : e.getBounds()) }), t }, _propagateEvent: function (t) { t = o.extend({ layer: t.target, target: this }, t), this.fire(t.type, t) } }), o.featureGroup = function (t) { return new o.FeatureGroup(t) }, o.Path = o.Class.extend({ includes: [o.Mixin.Events], statics: { CLIP_PADDING: function () { var e = o.Browser.mobile ? 1280 : 2e3, i = (e / Math.max(t.outerWidth, t.outerHeight) - 1) / 2; return Math.max(0, Math.min(.5, i)) }() }, options: { stroke: !0, color: "#0033ff", dashArray: null, lineCap: null, lineJoin: null, weight: 5, opacity: .5, fill: !1, fillColor: null, fillOpacity: .2, clickable: !0 }, initialize: function (t) { o.setOptions(this, t) }, onAdd: function (t) { this._map = t, this._container || (this._initElements(), this._initEvents()), this.projectLatlngs(), this._updatePath(), this._container && this._map._pathRoot.appendChild(this._container), this.fire("add"), t.on({ viewreset: this.projectLatlngs, moveend: this._updatePath }, this) }, addTo: function (t) { return t.addLayer(this), this }, onRemove: function (t) { t._pathRoot.removeChild(this._container), this.fire("remove"), this._map = null, o.Browser.vml && (this._container = null, this._stroke = null, this._fill = null), t.off({ viewreset: this.projectLatlngs, moveend: this._updatePath }, this) }, projectLatlngs: function () { }, setStyle: function (t) { return o.setOptions(this, t), this._container && this._updateStyle(), this }, redraw: function () { return this._map && (this.projectLatlngs(), this._updatePath()), this } }), o.Map.include({ _updatePathViewport: function () { var t = o.Path.CLIP_PADDING, e = this.getSize(), i = o.DomUtil.getPosition(this._mapPane), n = i.multiplyBy(-1)._subtract(e.multiplyBy(t)._round()), s = n.add(e.multiplyBy(1 + 2 * t)._round()); this._pathViewport = new o.Bounds(n, s) } }), o.Path.SVG_NS = "http://www.w3.org/2000/svg", o.Browser.svg = !(!e.createElementNS || !e.createElementNS(o.Path.SVG_NS, "svg").createSVGRect), o.Path = o.Path.extend({ statics: { SVG: o.Browser.svg }, bringToFront: function () { var t = this._map._pathRoot, e = this._container; return e && t.lastChild !== e && t.appendChild(e), this }, bringToBack: function () { var t = this._map._pathRoot, e = this._container, i = t.firstChild; return e && i !== e && t.insertBefore(e, i), this }, getPathString: function () { }, _createElement: function (t) { return e.createElementNS(o.Path.SVG_NS, t) }, _initElements: function () { this._map._initPathRoot(), this._initPath(), this._initStyle() }, _initPath: function () { this._container = this._createElement("g"), this._path = this._createElement("path"), this.options.className && o.DomUtil.addClass(this._path, this.options.className), this._container.appendChild(this._path) }, _initStyle: function () { this.options.stroke && (this._path.setAttribute("stroke-linejoin", "round"), this._path.setAttribute("stroke-linecap", "round")), this.options.fill && this._path.setAttribute("fill-rule", "evenodd"), this.options.pointerEvents && this._path.setAttribute("pointer-events", this.options.pointerEvents), this.options.clickable || this.options.pointerEvents || this._path.setAttribute("pointer-events", "none"), this._updateStyle() }, _updateStyle: function () { this.options.stroke ? (this._path.setAttribute("stroke", this.options.color), this._path.setAttribute("stroke-opacity", this.options.opacity), this._path.setAttribute("stroke-width", this.options.weight), this.options.dashArray ? this._path.setAttribute("stroke-dasharray", this.options.dashArray) : this._path.removeAttribute("stroke-dasharray"), this.options.lineCap && this._path.setAttribute("stroke-linecap", this.options.lineCap), this.options.lineJoin && this._path.setAttribute("stroke-linejoin", this.options.lineJoin)) : this._path.setAttribute("stroke", "none"), this.options.fill ? (this._path.setAttribute("fill", this.options.fillColor || this.options.color), this._path.setAttribute("fill-opacity", this.options.fillOpacity)) : this._path.setAttribute("fill", "none") }, _updatePath: function () { var t = this.getPathString(); t || (t = "M0 0"), this._path.setAttribute("d", t) }, _initEvents: function () { if (this.options.clickable) { (o.Browser.svg || !o.Browser.vml) && o.DomUtil.addClass(this._path, "leaflet-clickable"), o.DomEvent.on(this._container, "click", this._onMouseClick, this); for (var t = ["dblclick", "mousedown", "mouseover", "mouseout", "mousemove", "contextmenu"], e = 0; e < t.length; e++) o.DomEvent.on(this._container, t[e], this._fireMouseEvent, this) } }, _onMouseClick: function (t) { this._map.dragging && this._map.dragging.moved() || this._fireMouseEvent(t) }, _fireMouseEvent: function (t) { if (this.hasEventListeners(t.type)) { var e = this._map, i = e.mouseEventToContainerPoint(t), n = e.containerPointToLayerPoint(i), s = e.layerPointToLatLng(n); this.fire(t.type, { latlng: s, layerPoint: n, containerPoint: i, originalEvent: t }), "contextmenu" === t.type && o.DomEvent.preventDefault(t), "mousemove" !== t.type && o.DomEvent.stopPropagation(t) } } }), o.Map.include({
        _initPathRoot: function () {
            this._pathRoot || (this._pathRoot = o.Path.prototype._createElement("svg"), this._panes.overlayPane.appendChild(this._pathRoot), this.options.zoomAnimation && o.Browser.any3d ? (o.DomUtil.addClass(this._pathRoot, "leaflet-zoom-animated"),
            this.on({ zoomanim: this._animatePathZoom, zoomend: this._endPathZoom })) : o.DomUtil.addClass(this._pathRoot, "leaflet-zoom-hide"), this.on("moveend", this._updateSvgViewport), this._updateSvgViewport())
        }, _animatePathZoom: function (t) { var e = this.getZoomScale(t.zoom), i = this._getCenterOffset(t.center)._multiplyBy(-e)._add(this._pathViewport.min); this._pathRoot.style[o.DomUtil.TRANSFORM] = o.DomUtil.getTranslateString(i) + " scale(" + e + ") ", this._pathZooming = !0 }, _endPathZoom: function () { this._pathZooming = !1 }, _updateSvgViewport: function () { if (!this._pathZooming) { this._updatePathViewport(); var t = this._pathViewport, e = t.min, i = t.max, n = i.x - e.x, s = i.y - e.y, a = this._pathRoot, r = this._panes.overlayPane; o.Browser.mobileWebkit && r.removeChild(a), o.DomUtil.setPosition(a, e), a.setAttribute("width", n), a.setAttribute("height", s), a.setAttribute("viewBox", [e.x, e.y, n, s].join(" ")), o.Browser.mobileWebkit && r.appendChild(a) } }
    }), o.Path.include({ bindPopup: function (t, e) { return t instanceof o.Popup ? this._popup = t : ((!this._popup || e) && (this._popup = new o.Popup(e, this)), this._popup.setContent(t)), this._popupHandlersAdded || (this.on("click", this._openPopup, this).on("remove", this.closePopup, this), this._popupHandlersAdded = !0), this }, unbindPopup: function () { return this._popup && (this._popup = null, this.off("click", this._openPopup).off("remove", this.closePopup), this._popupHandlersAdded = !1), this }, openPopup: function (t) { return this._popup && (t = t || this._latlng || this._latlngs[Math.floor(this._latlngs.length / 2)], this._openPopup({ latlng: t })), this }, closePopup: function () { return this._popup && this._popup._close(), this }, _openPopup: function (t) { this._popup.setLatLng(t.latlng), this._map.openPopup(this._popup) } }), o.Browser.vml = !o.Browser.svg && function () { try { var t = e.createElement("div"); t.innerHTML = '<v:shape adj="1"/>'; var i = t.firstChild; return i.style.behavior = "url(#default#VML)", i && "object" == typeof i.adj } catch (n) { return !1 } }(), o.Path = o.Browser.svg || !o.Browser.vml ? o.Path : o.Path.extend({ statics: { VML: !0, CLIP_PADDING: .02 }, _createElement: function () { try { return e.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"), function (t) { return e.createElement("<lvml:" + t + ' class="lvml">') } } catch (t) { return function (t) { return e.createElement("<" + t + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">') } } }(), _initPath: function () { var t = this._container = this._createElement("shape"); o.DomUtil.addClass(t, "leaflet-vml-shape" + (this.options.className ? " " + this.options.className : "")), this.options.clickable && o.DomUtil.addClass(t, "leaflet-clickable"), t.coordsize = "1 1", this._path = this._createElement("path"), t.appendChild(this._path), this._map._pathRoot.appendChild(t) }, _initStyle: function () { this._updateStyle() }, _updateStyle: function () { var t = this._stroke, e = this._fill, i = this.options, n = this._container; n.stroked = i.stroke, n.filled = i.fill, i.stroke ? (t || (t = this._stroke = this._createElement("stroke"), t.endcap = "round", n.appendChild(t)), t.weight = i.weight + "px", t.color = i.color, t.opacity = i.opacity, i.dashArray ? t.dashStyle = o.Util.isArray(i.dashArray) ? i.dashArray.join(" ") : i.dashArray.replace(/( *, *)/g, " ") : t.dashStyle = "", i.lineCap && (t.endcap = i.lineCap.replace("butt", "flat")), i.lineJoin && (t.joinstyle = i.lineJoin)) : t && (n.removeChild(t), this._stroke = null), i.fill ? (e || (e = this._fill = this._createElement("fill"), n.appendChild(e)), e.color = i.fillColor || i.color, e.opacity = i.fillOpacity) : e && (n.removeChild(e), this._fill = null) }, _updatePath: function () { var t = this._container.style; t.display = "none", this._path.v = this.getPathString() + " ", t.display = "" } }), o.Map.include(o.Browser.svg || !o.Browser.vml ? {} : { _initPathRoot: function () { if (!this._pathRoot) { var t = this._pathRoot = e.createElement("div"); t.className = "leaflet-vml-container", this._panes.overlayPane.appendChild(t), this.on("moveend", this._updatePathViewport), this._updatePathViewport() } } }), o.Browser.canvas = function () { return !!e.createElement("canvas").getContext }(), o.Path = o.Path.SVG && !t.L_PREFER_CANVAS || !o.Browser.canvas ? o.Path : o.Path.extend({ statics: { CANVAS: !0, SVG: !1 }, redraw: function () { return this._map && (this.projectLatlngs(), this._requestUpdate()), this }, setStyle: function (t) { return o.setOptions(this, t), this._map && (this._updateStyle(), this._requestUpdate()), this }, onRemove: function (t) { t.off("viewreset", this.projectLatlngs, this).off("moveend", this._updatePath, this), this.options.clickable && (this._map.off("click", this._onClick, this), this._map.off("mousemove", this._onMouseMove, this)), this._requestUpdate(), this.fire("remove"), this._map = null }, _requestUpdate: function () { this._map && !o.Path._updateRequest && (o.Path._updateRequest = o.Util.requestAnimFrame(this._fireMapMoveEnd, this._map)) }, _fireMapMoveEnd: function () { o.Path._updateRequest = null, this.fire("moveend") }, _initElements: function () { this._map._initPathRoot(), this._ctx = this._map._canvasCtx }, _updateStyle: function () { var t = this.options; t.stroke && (this._ctx.lineWidth = t.weight, this._ctx.strokeStyle = t.color), t.fill && (this._ctx.fillStyle = t.fillColor || t.color), t.lineCap && (this._ctx.lineCap = t.lineCap), t.lineJoin && (this._ctx.lineJoin = t.lineJoin) }, _drawPath: function () { var t, e, i, n, s, a; for (this._ctx.beginPath(), t = 0, i = this._parts.length; i > t; t++) { for (e = 0, n = this._parts[t].length; n > e; e++) s = this._parts[t][e], a = (0 === e ? "move" : "line") + "To", this._ctx[a](s.x, s.y); this instanceof o.Polygon && this._ctx.closePath() } }, _checkIfEmpty: function () { return !this._parts.length }, _updatePath: function () { if (!this._checkIfEmpty()) { var t = this._ctx, e = this.options; this._drawPath(), t.save(), this._updateStyle(), e.fill && (t.globalAlpha = e.fillOpacity, t.fill(e.fillRule || "evenodd")), e.stroke && (t.globalAlpha = e.opacity, t.stroke()), t.restore() } }, _initEvents: function () { this.options.clickable && (this._map.on("mousemove", this._onMouseMove, this), this._map.on("click dblclick contextmenu", this._fireMouseEvent, this)) }, _fireMouseEvent: function (t) { this._containsPoint(t.layerPoint) && this.fire(t.type, t) }, _onMouseMove: function (t) { this._map && !this._map._animatingZoom && (this._containsPoint(t.layerPoint) ? (this._ctx.canvas.style.cursor = "pointer", this._mouseInside = !0, this.fire("mouseover", t)) : this._mouseInside && (this._ctx.canvas.style.cursor = "", this._mouseInside = !1, this.fire("mouseout", t))) } }), o.Map.include(o.Path.SVG && !t.L_PREFER_CANVAS || !o.Browser.canvas ? {} : { _initPathRoot: function () { var t, i = this._pathRoot; i || (i = this._pathRoot = e.createElement("canvas"), i.style.position = "absolute", t = this._canvasCtx = i.getContext("2d"), t.lineCap = "round", t.lineJoin = "round", this._panes.overlayPane.appendChild(i), this.options.zoomAnimation && (this._pathRoot.className = "leaflet-zoom-animated", this.on("zoomanim", this._animatePathZoom), this.on("zoomend", this._endPathZoom)), this.on("moveend", this._updateCanvasViewport), this._updateCanvasViewport()) }, _updateCanvasViewport: function () { if (!this._pathZooming) { this._updatePathViewport(); var t = this._pathViewport, e = t.min, i = t.max.subtract(e), n = this._pathRoot; o.DomUtil.setPosition(n, e), n.width = i.x, n.height = i.y, n.getContext("2d").translate(-e.x, -e.y) } } }), o.LineUtil = { simplify: function (t, e) { if (!e || !t.length) return t.slice(); var i = e * e; return t = this._reducePoints(t, i), t = this._simplifyDP(t, i) }, pointToSegmentDistance: function (t, e, i) { return Math.sqrt(this._sqClosestPointOnSegment(t, e, i, !0)) }, closestPointOnSegment: function (t, e, i) { return this._sqClosestPointOnSegment(t, e, i) }, _simplifyDP: function (t, e) { var n = t.length, o = typeof Uint8Array != i + "" ? Uint8Array : Array, s = new o(n); s[0] = s[n - 1] = 1, this._simplifyDPStep(t, s, e, 0, n - 1); var a, r = []; for (a = 0; n > a; a++) s[a] && r.push(t[a]); return r }, _simplifyDPStep: function (t, e, i, n, o) { var s, a, r, h = 0; for (a = n + 1; o - 1 >= a; a++) r = this._sqClosestPointOnSegment(t[a], t[n], t[o], !0), r > h && (s = a, h = r); h > i && (e[s] = 1, this._simplifyDPStep(t, e, i, n, s), this._simplifyDPStep(t, e, i, s, o)) }, _reducePoints: function (t, e) { for (var i = [t[0]], n = 1, o = 0, s = t.length; s > n; n++) this._sqDist(t[n], t[o]) > e && (i.push(t[n]), o = n); return s - 1 > o && i.push(t[s - 1]), i }, clipSegment: function (t, e, i, n) { var o, s, a, r = n ? this._lastCode : this._getBitCode(t, i), h = this._getBitCode(e, i); for (this._lastCode = h; ;) { if (!(r | h)) return [t, e]; if (r & h) return !1; o = r || h, s = this._getEdgeIntersection(t, e, o, i), a = this._getBitCode(s, i), o === r ? (t = s, r = a) : (e = s, h = a) } }, _getEdgeIntersection: function (t, e, i, n) { var s = e.x - t.x, a = e.y - t.y, r = n.min, h = n.max; return 8 & i ? new o.Point(t.x + s * (h.y - t.y) / a, h.y) : 4 & i ? new o.Point(t.x + s * (r.y - t.y) / a, r.y) : 2 & i ? new o.Point(h.x, t.y + a * (h.x - t.x) / s) : 1 & i ? new o.Point(r.x, t.y + a * (r.x - t.x) / s) : void 0 }, _getBitCode: function (t, e) { var i = 0; return t.x < e.min.x ? i |= 1 : t.x > e.max.x && (i |= 2), t.y < e.min.y ? i |= 4 : t.y > e.max.y && (i |= 8), i }, _sqDist: function (t, e) { var i = e.x - t.x, n = e.y - t.y; return i * i + n * n }, _sqClosestPointOnSegment: function (t, e, i, n) { var s, a = e.x, r = e.y, h = i.x - a, l = i.y - r, u = h * h + l * l; return u > 0 && (s = ((t.x - a) * h + (t.y - r) * l) / u, s > 1 ? (a = i.x, r = i.y) : s > 0 && (a += h * s, r += l * s)), h = t.x - a, l = t.y - r, n ? h * h + l * l : new o.Point(a, r) } }, o.Polyline = o.Path.extend({ initialize: function (t, e) { o.Path.prototype.initialize.call(this, e), this._latlngs = this._convertLatLngs(t) }, options: { smoothFactor: 1, noClip: !1 }, projectLatlngs: function () { this._originalPoints = []; for (var t = 0, e = this._latlngs.length; e > t; t++) this._originalPoints[t] = this._map.latLngToLayerPoint(this._latlngs[t]) }, getPathString: function () { for (var t = 0, e = this._parts.length, i = ""; e > t; t++) i += this._getPathPartStr(this._parts[t]); return i }, getLatLngs: function () { return this._latlngs }, setLatLngs: function (t) { return this._latlngs = this._convertLatLngs(t), this.redraw() }, addLatLng: function (t) { return this._latlngs.push(o.latLng(t)), this.redraw() }, spliceLatLngs: function () { var t = [].splice.apply(this._latlngs, arguments); return this._convertLatLngs(this._latlngs, !0), this.redraw(), t }, closestLayerPoint: function (t) { for (var e, i, n = 1 / 0, s = this._parts, a = null, r = 0, h = s.length; h > r; r++) for (var l = s[r], u = 1, c = l.length; c > u; u++) { e = l[u - 1], i = l[u]; var d = o.LineUtil._sqClosestPointOnSegment(t, e, i, !0); n > d && (n = d, a = o.LineUtil._sqClosestPointOnSegment(t, e, i)) } return a && (a.distance = Math.sqrt(n)), a }, getBounds: function () { return new o.LatLngBounds(this.getLatLngs()) }, _convertLatLngs: function (t, e) { var i, n, s = e ? t : []; for (i = 0, n = t.length; n > i; i++) { if (o.Util.isArray(t[i]) && "number" != typeof t[i][0]) return; s[i] = o.latLng(t[i]) } return s }, _initEvents: function () { o.Path.prototype._initEvents.call(this) }, _getPathPartStr: function (t) { for (var e, i = o.Path.VML, n = 0, s = t.length, a = ""; s > n; n++) e = t[n], i && e._round(), a += (n ? "L" : "M") + e.x + " " + e.y; return a }, _clipPoints: function () { var t, e, i, n = this._originalPoints, s = n.length; if (this.options.noClip) return void (this._parts = [n]); this._parts = []; var a = this._parts, r = this._map._pathViewport, h = o.LineUtil; for (t = 0, e = 0; s - 1 > t; t++) i = h.clipSegment(n[t], n[t + 1], r, t), i && (a[e] = a[e] || [], a[e].push(i[0]), (i[1] !== n[t + 1] || t === s - 2) && (a[e].push(i[1]), e++)) }, _simplifyPoints: function () { for (var t = this._parts, e = o.LineUtil, i = 0, n = t.length; n > i; i++) t[i] = e.simplify(t[i], this.options.smoothFactor) }, _updatePath: function () { this._map && (this._clipPoints(), this._simplifyPoints(), o.Path.prototype._updatePath.call(this)) } }), o.polyline = function (t, e) { return new o.Polyline(t, e) }, o.PolyUtil = {}, o.PolyUtil.clipPolygon = function (t, e) { var i, n, s, a, r, h, l, u, c, d = [1, 4, 2, 8], p = o.LineUtil; for (n = 0, l = t.length; l > n; n++) t[n]._code = p._getBitCode(t[n], e); for (a = 0; 4 > a; a++) { for (u = d[a], i = [], n = 0, l = t.length, s = l - 1; l > n; s = n++) r = t[n], h = t[s], r._code & u ? h._code & u || (c = p._getEdgeIntersection(h, r, u, e), c._code = p._getBitCode(c, e), i.push(c)) : (h._code & u && (c = p._getEdgeIntersection(h, r, u, e), c._code = p._getBitCode(c, e), i.push(c)), i.push(r)); t = i } return t }, o.Polygon = o.Polyline.extend({ options: { fill: !0 }, initialize: function (t, e) { o.Polyline.prototype.initialize.call(this, t, e), this._initWithHoles(t) }, _initWithHoles: function (t) { var e, i, n; if (t && o.Util.isArray(t[0]) && "number" != typeof t[0][0]) for (this._latlngs = this._convertLatLngs(t[0]), this._holes = t.slice(1), e = 0, i = this._holes.length; i > e; e++) n = this._holes[e] = this._convertLatLngs(this._holes[e]), n[0].equals(n[n.length - 1]) && n.pop(); t = this._latlngs, t.length >= 2 && t[0].equals(t[t.length - 1]) && t.pop() }, projectLatlngs: function () { if (o.Polyline.prototype.projectLatlngs.call(this), this._holePoints = [], this._holes) { var t, e, i, n; for (t = 0, i = this._holes.length; i > t; t++) for (this._holePoints[t] = [], e = 0, n = this._holes[t].length; n > e; e++) this._holePoints[t][e] = this._map.latLngToLayerPoint(this._holes[t][e]) } }, setLatLngs: function (t) { return t && o.Util.isArray(t[0]) && "number" != typeof t[0][0] ? (this._initWithHoles(t), this.redraw()) : o.Polyline.prototype.setLatLngs.call(this, t) }, _clipPoints: function () { var t = this._originalPoints, e = []; if (this._parts = [t].concat(this._holePoints), !this.options.noClip) { for (var i = 0, n = this._parts.length; n > i; i++) { var s = o.PolyUtil.clipPolygon(this._parts[i], this._map._pathViewport); s.length && e.push(s) } this._parts = e } }, _getPathPartStr: function (t) { var e = o.Polyline.prototype._getPathPartStr.call(this, t); return e + (o.Browser.svg ? "z" : "x") } }), o.polygon = function (t, e) { return new o.Polygon(t, e) }, function () { function t(t) { return o.FeatureGroup.extend({ initialize: function (t, e) { this._layers = {}, this._options = e, this.setLatLngs(t) }, setLatLngs: function (e) { var i = 0, n = e.length; for (this.eachLayer(function (t) { n > i ? t.setLatLngs(e[i++]) : this.removeLayer(t) }, this) ; n > i;) this.addLayer(new t(e[i++], this._options)); return this }, getLatLngs: function () { var t = []; return this.eachLayer(function (e) { t.push(e.getLatLngs()) }), t } }) } o.MultiPolyline = t(o.Polyline), o.MultiPolygon = t(o.Polygon), o.multiPolyline = function (t, e) { return new o.MultiPolyline(t, e) }, o.multiPolygon = function (t, e) { return new o.MultiPolygon(t, e) } }(), o.Rectangle = o.Polygon.extend({ initialize: function (t, e) { o.Polygon.prototype.initialize.call(this, this._boundsToLatLngs(t), e) }, setBounds: function (t) { this.setLatLngs(this._boundsToLatLngs(t)) }, _boundsToLatLngs: function (t) { return t = o.latLngBounds(t), [t.getSouthWest(), t.getNorthWest(), t.getNorthEast(), t.getSouthEast()] } }), o.rectangle = function (t, e) { return new o.Rectangle(t, e) }, o.Circle = o.Path.extend({ initialize: function (t, e, i) { o.Path.prototype.initialize.call(this, i), this._latlng = o.latLng(t), this._mRadius = e }, options: { fill: !0 }, setLatLng: function (t) { return this._latlng = o.latLng(t), this.redraw() }, setRadius: function (t) { return this._mRadius = t, this.redraw() }, projectLatlngs: function () { var t = this._getLngRadius(), e = this._latlng, i = this._map.latLngToLayerPoint([e.lat, e.lng - t]); this._point = this._map.latLngToLayerPoint(e), this._radius = Math.max(this._point.x - i.x, 1) }, getBounds: function () { var t = this._getLngRadius(), e = this._mRadius / 40075017 * 360, i = this._latlng; return new o.LatLngBounds([i.lat - e, i.lng - t], [i.lat + e, i.lng + t]) }, getLatLng: function () { return this._latlng }, getPathString: function () { var t = this._point, e = this._radius; return this._checkIfEmpty() ? "" : o.Browser.svg ? "M" + t.x + "," + (t.y - e) + "A" + e + "," + e + ",0,1,1," + (t.x - .1) + "," + (t.y - e) + " z" : (t._round(), e = Math.round(e), "AL " + t.x + "," + t.y + " " + e + "," + e + " 0,23592600") }, getRadius: function () { return this._mRadius }, _getLatRadius: function () { return this._mRadius / 40075017 * 360 }, _getLngRadius: function () { return this._getLatRadius() / Math.cos(o.LatLng.DEG_TO_RAD * this._latlng.lat) }, _checkIfEmpty: function () { if (!this._map) return !1; var t = this._map._pathViewport, e = this._radius, i = this._point; return i.x - e > t.max.x || i.y - e > t.max.y || i.x + e < t.min.x || i.y + e < t.min.y } }), o.circle = function (t, e, i) { return new o.Circle(t, e, i) }, o.CircleMarker = o.Circle.extend({ options: { radius: 10, weight: 2 }, initialize: function (t, e) { o.Circle.prototype.initialize.call(this, t, null, e), this._radius = this.options.radius }, projectLatlngs: function () { this._point = this._map.latLngToLayerPoint(this._latlng) }, _updateStyle: function () { o.Circle.prototype._updateStyle.call(this), this.setRadius(this.options.radius) }, setLatLng: function (t) { return o.Circle.prototype.setLatLng.call(this, t), this._popup && this._popup._isOpen && this._popup.setLatLng(t), this }, setRadius: function (t) { return this.options.radius = this._radius = t, this.redraw() }, getRadius: function () { return this._radius } }), o.circleMarker = function (t, e) { return new o.CircleMarker(t, e) }, o.Polyline.include(o.Path.CANVAS ? { _containsPoint: function (t, e) { var i, n, s, a, r, h, l, u = this.options.weight / 2; for (o.Browser.touch && (u += 10), i = 0, a = this._parts.length; a > i; i++) for (l = this._parts[i], n = 0, r = l.length, s = r - 1; r > n; s = n++) if ((e || 0 !== n) && (h = o.LineUtil.pointToSegmentDistance(t, l[s], l[n]), u >= h)) return !0; return !1 } } : {}), o.Polygon.include(o.Path.CANVAS ? { _containsPoint: function (t) { var e, i, n, s, a, r, h, l, u = !1; if (o.Polyline.prototype._containsPoint.call(this, t, !0)) return !0; for (s = 0, h = this._parts.length; h > s; s++) for (e = this._parts[s], a = 0, l = e.length, r = l - 1; l > a; r = a++) i = e[a], n = e[r], i.y > t.y != n.y > t.y && t.x < (n.x - i.x) * (t.y - i.y) / (n.y - i.y) + i.x && (u = !u); return u } } : {}), o.Circle.include(o.Path.CANVAS ? { _drawPath: function () { var t = this._point; this._ctx.beginPath(), this._ctx.arc(t.x, t.y, this._radius, 0, 2 * Math.PI, !1) }, _containsPoint: function (t) { var e = this._point, i = this.options.stroke ? this.options.weight / 2 : 0; return t.distanceTo(e) <= this._radius + i } } : {}), o.CircleMarker.include(o.Path.CANVAS ? { _updateStyle: function () { o.Path.prototype._updateStyle.call(this) } } : {}), o.GeoJSON = o.FeatureGroup.extend({ initialize: function (t, e) { o.setOptions(this, e), this._layers = {}, t && this.addData(t) }, addData: function (t) { var e, i, n, s = o.Util.isArray(t) ? t : t.features; if (s) { for (e = 0, i = s.length; i > e; e++) n = s[e], (n.geometries || n.geometry || n.features || n.coordinates) && this.addData(s[e]); return this } var a = this.options; if (!a.filter || a.filter(t)) { var r = o.GeoJSON.geometryToLayer(t, a.pointToLayer, a.coordsToLatLng, a); return r.feature = o.GeoJSON.asFeature(t), r.defaultOptions = r.options, this.resetStyle(r), a.onEachFeature && a.onEachFeature(t, r), this.addLayer(r) } }, resetStyle: function (t) { var e = this.options.style; e && (o.Util.extend(t.options, t.defaultOptions), this._setLayerStyle(t, e)) }, setStyle: function (t) { this.eachLayer(function (e) { this._setLayerStyle(e, t) }, this) }, _setLayerStyle: function (t, e) { "function" == typeof e && (e = e(t.feature)), t.setStyle && t.setStyle(e) } }), o.extend(o.GeoJSON, { geometryToLayer: function (t, e, i, n) { var s, a, r, h, l = "Feature" === t.type ? t.geometry : t, u = l.coordinates, c = []; switch (i = i || this.coordsToLatLng, l.type) { case "Point": return s = i(u), e ? e(t, s) : new o.Marker(s); case "MultiPoint": for (r = 0, h = u.length; h > r; r++) s = i(u[r]), c.push(e ? e(t, s) : new o.Marker(s)); return new o.FeatureGroup(c); case "LineString": return a = this.coordsToLatLngs(u, 0, i), new o.Polyline(a, n); case "Polygon": if (2 === u.length && !u[1].length) throw new Error("Invalid GeoJSON object."); return a = this.coordsToLatLngs(u, 1, i), new o.Polygon(a, n); case "MultiLineString": return a = this.coordsToLatLngs(u, 1, i), new o.MultiPolyline(a, n); case "MultiPolygon": return a = this.coordsToLatLngs(u, 2, i), new o.MultiPolygon(a, n); case "GeometryCollection": for (r = 0, h = l.geometries.length; h > r; r++) c.push(this.geometryToLayer({ geometry: l.geometries[r], type: "Feature", properties: t.properties }, e, i, n)); return new o.FeatureGroup(c); default: throw new Error("Invalid GeoJSON object.") } }, coordsToLatLng: function (t) { return new o.LatLng(t[1], t[0], t[2]) }, coordsToLatLngs: function (t, e, i) { var n, o, s, a = []; for (o = 0, s = t.length; s > o; o++) n = e ? this.coordsToLatLngs(t[o], e - 1, i) : (i || this.coordsToLatLng)(t[o]), a.push(n); return a }, latLngToCoords: function (t) { var e = [t.lng, t.lat]; return t.alt !== i && e.push(t.alt), e }, latLngsToCoords: function (t) { for (var e = [], i = 0, n = t.length; n > i; i++) e.push(o.GeoJSON.latLngToCoords(t[i])); return e }, getFeature: function (t, e) { return t.feature ? o.extend({}, t.feature, { geometry: e }) : o.GeoJSON.asFeature(e) }, asFeature: function (t) { return "Feature" === t.type ? t : { type: "Feature", properties: {}, geometry: t } } }); var a = { toGeoJSON: function () { return o.GeoJSON.getFeature(this, { type: "Point", coordinates: o.GeoJSON.latLngToCoords(this.getLatLng()) }) } }; o.Marker.include(a), o.Circle.include(a), o.CircleMarker.include(a), o.Polyline.include({ toGeoJSON: function () { return o.GeoJSON.getFeature(this, { type: "LineString", coordinates: o.GeoJSON.latLngsToCoords(this.getLatLngs()) }) } }), o.Polygon.include({ toGeoJSON: function () { var t, e, i, n = [o.GeoJSON.latLngsToCoords(this.getLatLngs())]; if (n[0].push(n[0][0]), this._holes) for (t = 0, e = this._holes.length; e > t; t++) i = o.GeoJSON.latLngsToCoords(this._holes[t]), i.push(i[0]), n.push(i); return o.GeoJSON.getFeature(this, { type: "Polygon", coordinates: n }) } }), function () { function t(t) { return function () { var e = []; return this.eachLayer(function (t) { e.push(t.toGeoJSON().geometry.coordinates) }), o.GeoJSON.getFeature(this, { type: t, coordinates: e }) } } o.MultiPolyline.include({ toGeoJSON: t("MultiLineString") }), o.MultiPolygon.include({ toGeoJSON: t("MultiPolygon") }), o.LayerGroup.include({ toGeoJSON: function () { var e, i = this.feature && this.feature.geometry, n = []; if (i && "MultiPoint" === i.type) return t("MultiPoint").call(this); var s = i && "GeometryCollection" === i.type; return this.eachLayer(function (t) { t.toGeoJSON && (e = t.toGeoJSON(), n.push(s ? e.geometry : o.GeoJSON.asFeature(e))) }), s ? o.GeoJSON.getFeature(this, { geometries: n, type: "GeometryCollection" }) : { type: "FeatureCollection", features: n } } }) }(), o.geoJson = function (t, e) { return new o.GeoJSON(t, e) }, o.DomEvent = { addListener: function (t, e, i, n) { var s, a, r, h = o.stamp(i), l = "_leaflet_" + e + h; return t[l] ? this : (s = function (e) { return i.call(n || t, e || o.DomEvent._getEvent()) }, o.Browser.pointer && 0 === e.indexOf("touch") ? this.addPointerListener(t, e, s, h) : (o.Browser.touch && "dblclick" === e && this.addDoubleTapListener && this.addDoubleTapListener(t, s, h), "addEventListener" in t ? "mousewheel" === e ? (t.addEventListener("DOMMouseScroll", s, !1), t.addEventListener(e, s, !1)) : "mouseenter" === e || "mouseleave" === e ? (a = s, r = "mouseenter" === e ? "mouseover" : "mouseout", s = function (e) { return o.DomEvent._checkMouse(t, e) ? a(e) : void 0 }, t.addEventListener(r, s, !1)) : "click" === e && o.Browser.android ? (a = s, s = function (t) { return o.DomEvent._filterClick(t, a) }, t.addEventListener(e, s, !1)) : t.addEventListener(e, s, !1) : "attachEvent" in t && t.attachEvent("on" + e, s), t[l] = s, this)) }, removeListener: function (t, e, i) { var n = o.stamp(i), s = "_leaflet_" + e + n, a = t[s]; return a ? (o.Browser.pointer && 0 === e.indexOf("touch") ? this.removePointerListener(t, e, n) : o.Browser.touch && "dblclick" === e && this.removeDoubleTapListener ? this.removeDoubleTapListener(t, n) : "removeEventListener" in t ? "mousewheel" === e ? (t.removeEventListener("DOMMouseScroll", a, !1), t.removeEventListener(e, a, !1)) : "mouseenter" === e || "mouseleave" === e ? t.removeEventListener("mouseenter" === e ? "mouseover" : "mouseout", a, !1) : t.removeEventListener(e, a, !1) : "detachEvent" in t && t.detachEvent("on" + e, a), t[s] = null, this) : this }, stopPropagation: function (t) { return t.stopPropagation ? t.stopPropagation() : t.cancelBubble = !0, o.DomEvent._skipped(t), this }, disableScrollPropagation: function (t) { var e = o.DomEvent.stopPropagation; return o.DomEvent.on(t, "mousewheel", e).on(t, "MozMousePixelScroll", e) }, disableClickPropagation: function (t) { for (var e = o.DomEvent.stopPropagation, i = o.Draggable.START.length - 1; i >= 0; i--) o.DomEvent.on(t, o.Draggable.START[i], e); return o.DomEvent.on(t, "click", o.DomEvent._fakeStop).on(t, "dblclick", e) }, preventDefault: function (t) { return t.preventDefault ? t.preventDefault() : t.returnValue = !1, this }, stop: function (t) { return o.DomEvent.preventDefault(t).stopPropagation(t) }, getMousePosition: function (t, e) { if (!e) return new o.Point(t.clientX, t.clientY); var i = e.getBoundingClientRect(); return new o.Point(t.clientX - i.left - e.clientLeft, t.clientY - i.top - e.clientTop) }, getWheelDelta: function (t) { var e = 0; return t.wheelDelta && (e = t.wheelDelta / 120), t.detail && (e = -t.detail / 3), e }, _skipEvents: {}, _fakeStop: function (t) { o.DomEvent._skipEvents[t.type] = !0 }, _skipped: function (t) { var e = this._skipEvents[t.type]; return this._skipEvents[t.type] = !1, e }, _checkMouse: function (t, e) { var i = e.relatedTarget; if (!i) return !0; try { for (; i && i !== t;) i = i.parentNode } catch (n) { return !1 } return i !== t }, _getEvent: function () { var e = t.event; if (!e) for (var i = arguments.callee.caller; i && (e = i.arguments[0], !e || t.Event !== e.constructor) ;) i = i.caller; return e }, _filterClick: function (t, e) { var i = t.timeStamp || t.originalEvent.timeStamp, n = o.DomEvent._lastClick && i - o.DomEvent._lastClick; return n && n > 100 && 500 > n || t.target._simulatedClick && !t._simulated ? void o.DomEvent.stop(t) : (o.DomEvent._lastClick = i, e(t)) } }, o.DomEvent.on = o.DomEvent.addListener, o.DomEvent.off = o.DomEvent.removeListener, o.Draggable = o.Class.extend({ includes: o.Mixin.Events, statics: { START: o.Browser.touch ? ["touchstart", "mousedown"] : ["mousedown"], END: { mousedown: "mouseup", touchstart: "touchend", pointerdown: "touchend", MSPointerDown: "touchend" }, MOVE: { mousedown: "mousemove", touchstart: "touchmove", pointerdown: "touchmove", MSPointerDown: "touchmove" } }, initialize: function (t, e) { this._element = t, this._dragStartTarget = e || t }, enable: function () { if (!this._enabled) { for (var t = o.Draggable.START.length - 1; t >= 0; t--) o.DomEvent.on(this._dragStartTarget, o.Draggable.START[t], this._onDown, this); this._enabled = !0 } }, disable: function () { if (this._enabled) { for (var t = o.Draggable.START.length - 1; t >= 0; t--) o.DomEvent.off(this._dragStartTarget, o.Draggable.START[t], this._onDown, this); this._enabled = !1, this._moved = !1 } }, _onDown: function (t) { if (this._moved = !1, !(t.shiftKey || 1 !== t.which && 1 !== t.button && !t.touches || (o.DomEvent.stopPropagation(t), o.Draggable._disabled || (o.DomUtil.disableImageDrag(), o.DomUtil.disableTextSelection(), this._moving)))) { var i = t.touches ? t.touches[0] : t; this._startPoint = new o.Point(i.clientX, i.clientY), this._startPos = this._newPos = o.DomUtil.getPosition(this._element), o.DomEvent.on(e, o.Draggable.MOVE[t.type], this._onMove, this).on(e, o.Draggable.END[t.type], this._onUp, this) } }, _onMove: function (t) { if (t.touches && t.touches.length > 1) return void (this._moved = !0); var i = t.touches && 1 === t.touches.length ? t.touches[0] : t, n = new o.Point(i.clientX, i.clientY), s = n.subtract(this._startPoint); (s.x || s.y) && (o.Browser.touch && Math.abs(s.x) + Math.abs(s.y) < 3 || (o.DomEvent.preventDefault(t), this._moved || (this.fire("dragstart"), this._moved = !0, this._startPos = o.DomUtil.getPosition(this._element).subtract(s), o.DomUtil.addClass(e.body, "leaflet-dragging"), this._lastTarget = t.target || t.srcElement, o.DomUtil.addClass(this._lastTarget, "leaflet-drag-target")), this._newPos = this._startPos.add(s), this._moving = !0, o.Util.cancelAnimFrame(this._animRequest), this._animRequest = o.Util.requestAnimFrame(this._updatePosition, this, !0, this._dragStartTarget))) }, _updatePosition: function () { this.fire("predrag"), o.DomUtil.setPosition(this._element, this._newPos), this.fire("drag") }, _onUp: function () { o.DomUtil.removeClass(e.body, "leaflet-dragging"), this._lastTarget && (o.DomUtil.removeClass(this._lastTarget, "leaflet-drag-target"), this._lastTarget = null); for (var t in o.Draggable.MOVE) o.DomEvent.off(e, o.Draggable.MOVE[t], this._onMove).off(e, o.Draggable.END[t], this._onUp); o.DomUtil.enableImageDrag(), o.DomUtil.enableTextSelection(), this._moved && this._moving && (o.Util.cancelAnimFrame(this._animRequest), this.fire("dragend", { distance: this._newPos.distanceTo(this._startPos) })), this._moving = !1 } }), o.Handler = o.Class.extend({ initialize: function (t) { this._map = t }, enable: function () { this._enabled || (this._enabled = !0, this.addHooks()) }, disable: function () { this._enabled && (this._enabled = !1, this.removeHooks()) }, enabled: function () { return !!this._enabled } }), o.Map.mergeOptions({ dragging: !0, inertia: !o.Browser.android23, inertiaDeceleration: 3400, inertiaMaxSpeed: 1 / 0, inertiaThreshold: o.Browser.touch ? 32 : 18, easeLinearity: .25, worldCopyJump: !1 }), o.Map.Drag = o.Handler.extend({ addHooks: function () { if (!this._draggable) { var t = this._map; this._draggable = new o.Draggable(t._mapPane, t._container), this._draggable.on({ dragstart: this._onDragStart, drag: this._onDrag, dragend: this._onDragEnd }, this), t.options.worldCopyJump && (this._draggable.on("predrag", this._onPreDrag, this), t.on("viewreset", this._onViewReset, this), t.whenReady(this._onViewReset, this)) } this._draggable.enable() }, removeHooks: function () { this._draggable.disable() }, moved: function () { return this._draggable && this._draggable._moved }, _onDragStart: function () { var t = this._map; t._panAnim && t._panAnim.stop(), t.fire("movestart").fire("dragstart"), t.options.inertia && (this._positions = [], this._times = []) }, _onDrag: function () { if (this._map.options.inertia) { var t = this._lastTime = +new Date, e = this._lastPos = this._draggable._newPos; this._positions.push(e), this._times.push(t), t - this._times[0] > 200 && (this._positions.shift(), this._times.shift()) } this._map.fire("move").fire("drag") }, _onViewReset: function () { var t = this._map.getSize()._divideBy(2), e = this._map.latLngToLayerPoint([0, 0]); this._initialWorldOffset = e.subtract(t).x, this._worldWidth = this._map.project([0, 180]).x }, _onPreDrag: function () { var t = this._worldWidth, e = Math.round(t / 2), i = this._initialWorldOffset, n = this._draggable._newPos.x, o = (n - e + i) % t + e - i, s = (n + e + i) % t - e - i, a = Math.abs(o + i) < Math.abs(s + i) ? o : s; this._draggable._newPos.x = a }, _onDragEnd: function (t) { var e = this._map, i = e.options, n = +new Date - this._lastTime, s = !i.inertia || n > i.inertiaThreshold || !this._positions[0]; if (e.fire("dragend", t), s) e.fire("moveend"); else { var a = this._lastPos.subtract(this._positions[0]), r = (this._lastTime + n - this._times[0]) / 1e3, h = i.easeLinearity, l = a.multiplyBy(h / r), u = l.distanceTo([0, 0]), c = Math.min(i.inertiaMaxSpeed, u), d = l.multiplyBy(c / u), p = c / (i.inertiaDeceleration * h), _ = d.multiplyBy(-p / 2).round(); _.x && _.y ? (_ = e._limitOffset(_, e.options.maxBounds), o.Util.requestAnimFrame(function () { e.panBy(_, { duration: p, easeLinearity: h, noMoveStart: !0 }) })) : e.fire("moveend") } } }), o.Map.addInitHook("addHandler", "dragging", o.Map.Drag), o.Map.mergeOptions({ doubleClickZoom: !0 }), o.Map.DoubleClickZoom = o.Handler.extend({ addHooks: function () { this._map.on("dblclick", this._onDoubleClick, this) }, removeHooks: function () { this._map.off("dblclick", this._onDoubleClick, this) }, _onDoubleClick: function (t) { var e = this._map, i = e.getZoom() + (t.originalEvent.shiftKey ? -1 : 1); "center" === e.options.doubleClickZoom ? e.setZoom(i) : e.setZoomAround(t.containerPoint, i) } }), o.Map.addInitHook("addHandler", "doubleClickZoom", o.Map.DoubleClickZoom), o.Map.mergeOptions({ scrollWheelZoom: !0 }), o.Map.ScrollWheelZoom = o.Handler.extend({ addHooks: function () { o.DomEvent.on(this._map._container, "mousewheel", this._onWheelScroll, this), o.DomEvent.on(this._map._container, "MozMousePixelScroll", o.DomEvent.preventDefault), this._delta = 0 }, removeHooks: function () { o.DomEvent.off(this._map._container, "mousewheel", this._onWheelScroll), o.DomEvent.off(this._map._container, "MozMousePixelScroll", o.DomEvent.preventDefault) }, _onWheelScroll: function (t) { var e = o.DomEvent.getWheelDelta(t); this._delta += e, this._lastMousePos = this._map.mouseEventToContainerPoint(t), this._startTime || (this._startTime = +new Date); var i = Math.max(40 - (+new Date - this._startTime), 0); clearTimeout(this._timer), this._timer = setTimeout(o.bind(this._performZoom, this), i), o.DomEvent.preventDefault(t), o.DomEvent.stopPropagation(t) }, _performZoom: function () { var t = this._map, e = this._delta, i = t.getZoom(); e = e > 0 ? Math.ceil(e) : Math.floor(e), e = Math.max(Math.min(e, 4), -4), e = t._limitZoom(i + e) - i, this._delta = 0, this._startTime = null, e && ("center" === t.options.scrollWheelZoom ? t.setZoom(i + e) : t.setZoomAround(this._lastMousePos, i + e)) } }), o.Map.addInitHook("addHandler", "scrollWheelZoom", o.Map.ScrollWheelZoom), o.extend(o.DomEvent, { _touchstart: o.Browser.msPointer ? "MSPointerDown" : o.Browser.pointer ? "pointerdown" : "touchstart", _touchend: o.Browser.msPointer ? "MSPointerUp" : o.Browser.pointer ? "pointerup" : "touchend", addDoubleTapListener: function (t, i, n) { function s(t) { var e; if (o.Browser.pointer ? (_.push(t.pointerId), e = _.length) : e = t.touches.length, !(e > 1)) { var i = Date.now(), n = i - (r || i); h = t.touches ? t.touches[0] : t, l = n > 0 && u >= n, r = i } } function a(t) { if (o.Browser.pointer) { var e = _.indexOf(t.pointerId); if (-1 === e) return; _.splice(e, 1) } if (l) { if (o.Browser.pointer) { var n, s = {}; for (var a in h) n = h[a], "function" == typeof n ? s[a] = n.bind(h) : s[a] = n; h = s } h.type = "dblclick", i(h), r = null } } var r, h, l = !1, u = 250, c = "_leaflet_", d = this._touchstart, p = this._touchend, _ = []; t[c + d + n] = s, t[c + p + n] = a; var m = o.Browser.pointer ? e.documentElement : t; return t.addEventListener(d, s, !1), m.addEventListener(p, a, !1), o.Browser.pointer && m.addEventListener(o.DomEvent.POINTER_CANCEL, a, !1), this }, removeDoubleTapListener: function (t, i) { var n = "_leaflet_"; return t.removeEventListener(this._touchstart, t[n + this._touchstart + i], !1), (o.Browser.pointer ? e.documentElement : t).removeEventListener(this._touchend, t[n + this._touchend + i], !1), o.Browser.pointer && e.documentElement.removeEventListener(o.DomEvent.POINTER_CANCEL, t[n + this._touchend + i], !1), this } }), o.extend(o.DomEvent, {
        POINTER_DOWN: o.Browser.msPointer ? "MSPointerDown" : "pointerdown", POINTER_MOVE: o.Browser.msPointer ? "MSPointerMove" : "pointermove", POINTER_UP: o.Browser.msPointer ? "MSPointerUp" : "pointerup", POINTER_CANCEL: o.Browser.msPointer ? "MSPointerCancel" : "pointercancel", _pointers: [], _pointerDocumentListener: !1, addPointerListener: function (t, e, i, n) {
            switch (e) {
                case "touchstart": return this.addPointerListenerStart(t, e, i, n);
                case "touchend": return this.addPointerListenerEnd(t, e, i, n); case "touchmove": return this.addPointerListenerMove(t, e, i, n); default: throw "Unknown touch event type"
            }
        }, addPointerListenerStart: function (t, i, n, s) { var a = "_leaflet_", r = this._pointers, h = function (t) { o.DomEvent.preventDefault(t); for (var e = !1, i = 0; i < r.length; i++) if (r[i].pointerId === t.pointerId) { e = !0; break } e || r.push(t), t.touches = r.slice(), t.changedTouches = [t], n(t) }; if (t[a + "touchstart" + s] = h, t.addEventListener(this.POINTER_DOWN, h, !1), !this._pointerDocumentListener) { var l = function (t) { for (var e = 0; e < r.length; e++) if (r[e].pointerId === t.pointerId) { r.splice(e, 1); break } }; e.documentElement.addEventListener(this.POINTER_UP, l, !1), e.documentElement.addEventListener(this.POINTER_CANCEL, l, !1), this._pointerDocumentListener = !0 } return this }, addPointerListenerMove: function (t, e, i, n) { function o(t) { if (t.pointerType !== t.MSPOINTER_TYPE_MOUSE && "mouse" !== t.pointerType || 0 !== t.buttons) { for (var e = 0; e < a.length; e++) if (a[e].pointerId === t.pointerId) { a[e] = t; break } t.touches = a.slice(), t.changedTouches = [t], i(t) } } var s = "_leaflet_", a = this._pointers; return t[s + "touchmove" + n] = o, t.addEventListener(this.POINTER_MOVE, o, !1), this }, addPointerListenerEnd: function (t, e, i, n) { var o = "_leaflet_", s = this._pointers, a = function (t) { for (var e = 0; e < s.length; e++) if (s[e].pointerId === t.pointerId) { s.splice(e, 1); break } t.touches = s.slice(), t.changedTouches = [t], i(t) }; return t[o + "touchend" + n] = a, t.addEventListener(this.POINTER_UP, a, !1), t.addEventListener(this.POINTER_CANCEL, a, !1), this }, removePointerListener: function (t, e, i) { var n = "_leaflet_", o = t[n + e + i]; switch (e) { case "touchstart": t.removeEventListener(this.POINTER_DOWN, o, !1); break; case "touchmove": t.removeEventListener(this.POINTER_MOVE, o, !1); break; case "touchend": t.removeEventListener(this.POINTER_UP, o, !1), t.removeEventListener(this.POINTER_CANCEL, o, !1) } return this }
    }), o.Map.mergeOptions({ touchZoom: o.Browser.touch && !o.Browser.android23, bounceAtZoomLimits: !0 }), o.Map.TouchZoom = o.Handler.extend({ addHooks: function () { o.DomEvent.on(this._map._container, "touchstart", this._onTouchStart, this) }, removeHooks: function () { o.DomEvent.off(this._map._container, "touchstart", this._onTouchStart, this) }, _onTouchStart: function (t) { var i = this._map; if (t.touches && 2 === t.touches.length && !i._animatingZoom && !this._zooming) { var n = i.mouseEventToLayerPoint(t.touches[0]), s = i.mouseEventToLayerPoint(t.touches[1]), a = i._getCenterLayerPoint(); this._startCenter = n.add(s)._divideBy(2), this._startDist = n.distanceTo(s), this._moved = !1, this._zooming = !0, this._centerOffset = a.subtract(this._startCenter), i._panAnim && i._panAnim.stop(), o.DomEvent.on(e, "touchmove", this._onTouchMove, this).on(e, "touchend", this._onTouchEnd, this), o.DomEvent.preventDefault(t) } }, _onTouchMove: function (t) { var e = this._map; if (t.touches && 2 === t.touches.length && this._zooming) { var i = e.mouseEventToLayerPoint(t.touches[0]), n = e.mouseEventToLayerPoint(t.touches[1]); this._scale = i.distanceTo(n) / this._startDist, this._delta = i._add(n)._divideBy(2)._subtract(this._startCenter), 1 !== this._scale && (e.options.bounceAtZoomLimits || !(e.getZoom() === e.getMinZoom() && this._scale < 1 || e.getZoom() === e.getMaxZoom() && this._scale > 1)) && (this._moved || (o.DomUtil.addClass(e._mapPane, "leaflet-touching"), e.fire("movestart").fire("zoomstart"), this._moved = !0), o.Util.cancelAnimFrame(this._animRequest), this._animRequest = o.Util.requestAnimFrame(this._updateOnMove, this, !0, this._map._container), o.DomEvent.preventDefault(t)) } }, _updateOnMove: function () { var t = this._map, e = this._getScaleOrigin(), i = t.layerPointToLatLng(e), n = t.getScaleZoom(this._scale); t._animateZoom(i, n, this._startCenter, this._scale, this._delta, !1, !0) }, _onTouchEnd: function () { if (!this._moved || !this._zooming) return void (this._zooming = !1); var t = this._map; this._zooming = !1, o.DomUtil.removeClass(t._mapPane, "leaflet-touching"), o.Util.cancelAnimFrame(this._animRequest), o.DomEvent.off(e, "touchmove", this._onTouchMove).off(e, "touchend", this._onTouchEnd); var i = this._getScaleOrigin(), n = t.layerPointToLatLng(i), s = t.getZoom(), a = t.getScaleZoom(this._scale) - s, r = a > 0 ? Math.ceil(a) : Math.floor(a), h = t._limitZoom(s + r), l = t.getZoomScale(h) / this._scale; t._animateZoom(n, h, i, l) }, _getScaleOrigin: function () { var t = this._centerOffset.subtract(this._delta).divideBy(this._scale); return this._startCenter.add(t) } }), o.Map.addInitHook("addHandler", "touchZoom", o.Map.TouchZoom), o.Map.mergeOptions({ tap: !0, tapTolerance: 15 }), o.Map.Tap = o.Handler.extend({ addHooks: function () { o.DomEvent.on(this._map._container, "touchstart", this._onDown, this) }, removeHooks: function () { o.DomEvent.off(this._map._container, "touchstart", this._onDown, this) }, _onDown: function (t) { if (t.touches) { if (o.DomEvent.preventDefault(t), this._fireClick = !0, t.touches.length > 1) return this._fireClick = !1, void clearTimeout(this._holdTimeout); var i = t.touches[0], n = i.target; this._startPos = this._newPos = new o.Point(i.clientX, i.clientY), n.tagName && "a" === n.tagName.toLowerCase() && o.DomUtil.addClass(n, "leaflet-active"), this._holdTimeout = setTimeout(o.bind(function () { this._isTapValid() && (this._fireClick = !1, this._onUp(), this._simulateEvent("contextmenu", i)) }, this), 1e3), o.DomEvent.on(e, "touchmove", this._onMove, this).on(e, "touchend", this._onUp, this) } }, _onUp: function (t) { if (clearTimeout(this._holdTimeout), o.DomEvent.off(e, "touchmove", this._onMove, this).off(e, "touchend", this._onUp, this), this._fireClick && t && t.changedTouches) { var i = t.changedTouches[0], n = i.target; n && n.tagName && "a" === n.tagName.toLowerCase() && o.DomUtil.removeClass(n, "leaflet-active"), this._isTapValid() && this._simulateEvent("click", i) } }, _isTapValid: function () { return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance }, _onMove: function (t) { var e = t.touches[0]; this._newPos = new o.Point(e.clientX, e.clientY) }, _simulateEvent: function (i, n) { var o = e.createEvent("MouseEvents"); o._simulated = !0, n.target._simulatedClick = !0, o.initMouseEvent(i, !0, !0, t, 1, n.screenX, n.screenY, n.clientX, n.clientY, !1, !1, !1, !1, 0, null), n.target.dispatchEvent(o) } }), o.Browser.touch && !o.Browser.pointer && o.Map.addInitHook("addHandler", "tap", o.Map.Tap), o.Map.mergeOptions({ boxZoom: !0 }), o.Map.BoxZoom = o.Handler.extend({ initialize: function (t) { this._map = t, this._container = t._container, this._pane = t._panes.overlayPane, this._moved = !1 }, addHooks: function () { o.DomEvent.on(this._container, "mousedown", this._onMouseDown, this) }, removeHooks: function () { o.DomEvent.off(this._container, "mousedown", this._onMouseDown), this._moved = !1 }, moved: function () { return this._moved }, _onMouseDown: function (t) { return this._moved = !1, !t.shiftKey || 1 !== t.which && 1 !== t.button ? !1 : (o.DomUtil.disableTextSelection(), o.DomUtil.disableImageDrag(), this._startLayerPoint = this._map.mouseEventToLayerPoint(t), void o.DomEvent.on(e, "mousemove", this._onMouseMove, this).on(e, "mouseup", this._onMouseUp, this).on(e, "keydown", this._onKeyDown, this)) }, _onMouseMove: function (t) { this._moved || (this._box = o.DomUtil.create("div", "leaflet-zoom-box", this._pane), o.DomUtil.setPosition(this._box, this._startLayerPoint), this._container.style.cursor = "crosshair", this._map.fire("boxzoomstart")); var e = this._startLayerPoint, i = this._box, n = this._map.mouseEventToLayerPoint(t), s = n.subtract(e), a = new o.Point(Math.min(n.x, e.x), Math.min(n.y, e.y)); o.DomUtil.setPosition(i, a), this._moved = !0, i.style.width = Math.max(0, Math.abs(s.x) - 4) + "px", i.style.height = Math.max(0, Math.abs(s.y) - 4) + "px" }, _finish: function () { this._moved && (this._pane.removeChild(this._box), this._container.style.cursor = ""), o.DomUtil.enableTextSelection(), o.DomUtil.enableImageDrag(), o.DomEvent.off(e, "mousemove", this._onMouseMove).off(e, "mouseup", this._onMouseUp).off(e, "keydown", this._onKeyDown) }, _onMouseUp: function (t) { this._finish(); var e = this._map, i = e.mouseEventToLayerPoint(t); if (!this._startLayerPoint.equals(i)) { var n = new o.LatLngBounds(e.layerPointToLatLng(this._startLayerPoint), e.layerPointToLatLng(i)); e.fitBounds(n), e.fire("boxzoomend", { boxZoomBounds: n }) } }, _onKeyDown: function (t) { 27 === t.keyCode && this._finish() } }), o.Map.addInitHook("addHandler", "boxZoom", o.Map.BoxZoom), o.Map.mergeOptions({ keyboard: !0, keyboardPanOffset: 80, keyboardZoomOffset: 1 }), o.Map.Keyboard = o.Handler.extend({ keyCodes: { left: [37], right: [39], down: [40], up: [38], zoomIn: [187, 107, 61, 171], zoomOut: [189, 109, 173] }, initialize: function (t) { this._map = t, this._setPanOffset(t.options.keyboardPanOffset), this._setZoomOffset(t.options.keyboardZoomOffset) }, addHooks: function () { var t = this._map._container; -1 === t.tabIndex && (t.tabIndex = "0"), o.DomEvent.on(t, "focus", this._onFocus, this).on(t, "blur", this._onBlur, this).on(t, "mousedown", this._onMouseDown, this), this._map.on("focus", this._addHooks, this).on("blur", this._removeHooks, this) }, removeHooks: function () { this._removeHooks(); var t = this._map._container; o.DomEvent.off(t, "focus", this._onFocus, this).off(t, "blur", this._onBlur, this).off(t, "mousedown", this._onMouseDown, this), this._map.off("focus", this._addHooks, this).off("blur", this._removeHooks, this) }, _onMouseDown: function () { if (!this._focused) { var i = e.body, n = e.documentElement, o = i.scrollTop || n.scrollTop, s = i.scrollLeft || n.scrollLeft; this._map._container.focus(), t.scrollTo(s, o) } }, _onFocus: function () { this._focused = !0, this._map.fire("focus") }, _onBlur: function () { this._focused = !1, this._map.fire("blur") }, _setPanOffset: function (t) { var e, i, n = this._panKeys = {}, o = this.keyCodes; for (e = 0, i = o.left.length; i > e; e++) n[o.left[e]] = [-1 * t, 0]; for (e = 0, i = o.right.length; i > e; e++) n[o.right[e]] = [t, 0]; for (e = 0, i = o.down.length; i > e; e++) n[o.down[e]] = [0, t]; for (e = 0, i = o.up.length; i > e; e++) n[o.up[e]] = [0, -1 * t] }, _setZoomOffset: function (t) { var e, i, n = this._zoomKeys = {}, o = this.keyCodes; for (e = 0, i = o.zoomIn.length; i > e; e++) n[o.zoomIn[e]] = t; for (e = 0, i = o.zoomOut.length; i > e; e++) n[o.zoomOut[e]] = -t }, _addHooks: function () { o.DomEvent.on(e, "keydown", this._onKeyDown, this) }, _removeHooks: function () { o.DomEvent.off(e, "keydown", this._onKeyDown, this) }, _onKeyDown: function (t) { var e = t.keyCode, i = this._map; if (e in this._panKeys) { if (i._panAnim && i._panAnim._inProgress) return; i.panBy(this._panKeys[e]), i.options.maxBounds && i.panInsideBounds(i.options.maxBounds) } else { if (!(e in this._zoomKeys)) return; i.setZoom(i.getZoom() + this._zoomKeys[e]) } o.DomEvent.stop(t) } }), o.Map.addInitHook("addHandler", "keyboard", o.Map.Keyboard), o.Handler.MarkerDrag = o.Handler.extend({ initialize: function (t) { this._marker = t }, addHooks: function () { var t = this._marker._icon; this._draggable || (this._draggable = new o.Draggable(t, t)), this._draggable.on("dragstart", this._onDragStart, this).on("drag", this._onDrag, this).on("dragend", this._onDragEnd, this), this._draggable.enable(), o.DomUtil.addClass(this._marker._icon, "leaflet-marker-draggable") }, removeHooks: function () { this._draggable.off("dragstart", this._onDragStart, this).off("drag", this._onDrag, this).off("dragend", this._onDragEnd, this), this._draggable.disable(), o.DomUtil.removeClass(this._marker._icon, "leaflet-marker-draggable") }, moved: function () { return this._draggable && this._draggable._moved }, _onDragStart: function () { this._marker.closePopup().fire("movestart").fire("dragstart") }, _onDrag: function () { var t = this._marker, e = t._shadow, i = o.DomUtil.getPosition(t._icon), n = t._map.layerPointToLatLng(i); e && o.DomUtil.setPosition(e, i), t._latlng = n, t.fire("move", { latlng: n }).fire("drag") }, _onDragEnd: function (t) { this._marker.fire("moveend").fire("dragend", t) } }), o.Control = o.Class.extend({ options: { position: "topright" }, initialize: function (t) { o.setOptions(this, t) }, getPosition: function () { return this.options.position }, setPosition: function (t) { var e = this._map; return e && e.removeControl(this), this.options.position = t, e && e.addControl(this), this }, getContainer: function () { return this._container }, addTo: function (t) { this._map = t; var e = this._container = this.onAdd(t), i = this.getPosition(), n = t._controlCorners[i]; return o.DomUtil.addClass(e, "leaflet-control"), -1 !== i.indexOf("bottom") ? n.insertBefore(e, n.firstChild) : n.appendChild(e), this }, removeFrom: function (t) { var e = this.getPosition(), i = t._controlCorners[e]; return i.removeChild(this._container), this._map = null, this.onRemove && this.onRemove(t), this }, _refocusOnMap: function () { this._map && this._map.getContainer().focus() } }), o.control = function (t) { return new o.Control(t) }, o.Map.include({ addControl: function (t) { return t.addTo(this), this }, removeControl: function (t) { return t.removeFrom(this), this }, _initControlPos: function () { function t(t, s) { var a = i + t + " " + i + s; e[t + s] = o.DomUtil.create("div", a, n) } var e = this._controlCorners = {}, i = "leaflet-", n = this._controlContainer = o.DomUtil.create("div", i + "control-container", this._container); t("top", "left"), t("top", "right"), t("bottom", "left"), t("bottom", "right") }, _clearControlPos: function () { this._container.removeChild(this._controlContainer) } }), o.Control.Zoom = o.Control.extend({ options: { position: "topleft", zoomInText: "+", zoomInTitle: "Zoom in", zoomOutText: "-", zoomOutTitle: "Zoom out" }, onAdd: function (t) { var e = "leaflet-control-zoom", i = o.DomUtil.create("div", e + " leaflet-bar"); return this._map = t, this._zoomInButton = this._createButton(this.options.zoomInText, this.options.zoomInTitle, e + "-in", i, this._zoomIn, this), this._zoomOutButton = this._createButton(this.options.zoomOutText, this.options.zoomOutTitle, e + "-out", i, this._zoomOut, this), this._updateDisabled(), t.on("zoomend zoomlevelschange", this._updateDisabled, this), i }, onRemove: function (t) { t.off("zoomend zoomlevelschange", this._updateDisabled, this) }, _zoomIn: function (t) { this._map.zoomIn(t.shiftKey ? 3 : 1) }, _zoomOut: function (t) { this._map.zoomOut(t.shiftKey ? 3 : 1) }, _createButton: function (t, e, i, n, s, a) { var r = o.DomUtil.create("a", i, n); r.innerHTML = t, r.href = "#", r.title = e; var h = o.DomEvent.stopPropagation; return o.DomEvent.on(r, "click", h).on(r, "mousedown", h).on(r, "dblclick", h).on(r, "click", o.DomEvent.preventDefault).on(r, "click", s, a).on(r, "click", this._refocusOnMap, a), r }, _updateDisabled: function () { var t = this._map, e = "leaflet-disabled"; o.DomUtil.removeClass(this._zoomInButton, e), o.DomUtil.removeClass(this._zoomOutButton, e), t._zoom === t.getMinZoom() && o.DomUtil.addClass(this._zoomOutButton, e), t._zoom === t.getMaxZoom() && o.DomUtil.addClass(this._zoomInButton, e) } }), o.Map.mergeOptions({ zoomControl: !0 }), o.Map.addInitHook(function () { this.options.zoomControl && (this.zoomControl = new o.Control.Zoom, this.addControl(this.zoomControl)) }), o.control.zoom = function (t) { return new o.Control.Zoom(t) }, o.Control.Attribution = o.Control.extend({ options: { position: "bottomright", prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>' }, initialize: function (t) { o.setOptions(this, t), this._attributions = {} }, onAdd: function (t) { this._container = o.DomUtil.create("div", "leaflet-control-attribution"), o.DomEvent.disableClickPropagation(this._container); for (var e in t._layers) t._layers[e].getAttribution && this.addAttribution(t._layers[e].getAttribution()); return t.on("layeradd", this._onLayerAdd, this).on("layerremove", this._onLayerRemove, this), this._update(), this._container }, onRemove: function (t) { t.off("layeradd", this._onLayerAdd).off("layerremove", this._onLayerRemove) }, setPrefix: function (t) { return this.options.prefix = t, this._update(), this }, addAttribution: function (t) { return t ? (this._attributions[t] || (this._attributions[t] = 0), this._attributions[t]++, this._update(), this) : void 0 }, removeAttribution: function (t) { return t ? (this._attributions[t] && (this._attributions[t]--, this._update()), this) : void 0 }, _update: function () { if (this._map) { var t = []; for (var e in this._attributions) this._attributions[e] && t.push(e); var i = []; this.options.prefix && i.push(this.options.prefix), t.length && i.push(t.join(", ")), this._container.innerHTML = i.join(" | ") } }, _onLayerAdd: function (t) { t.layer.getAttribution && this.addAttribution(t.layer.getAttribution()) }, _onLayerRemove: function (t) { t.layer.getAttribution && this.removeAttribution(t.layer.getAttribution()) } }), o.Map.mergeOptions({ attributionControl: !0 }), o.Map.addInitHook(function () { this.options.attributionControl && (this.attributionControl = (new o.Control.Attribution).addTo(this)) }), o.control.attribution = function (t) { return new o.Control.Attribution(t) }, o.Control.Scale = o.Control.extend({ options: { position: "bottomleft", maxWidth: 100, metric: !0, imperial: !0, updateWhenIdle: !1 }, onAdd: function (t) { this._map = t; var e = "leaflet-control-scale", i = o.DomUtil.create("div", e), n = this.options; return this._addScales(n, e, i), t.on(n.updateWhenIdle ? "moveend" : "move", this._update, this), t.whenReady(this._update, this), i }, onRemove: function (t) { t.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this) }, _addScales: function (t, e, i) { t.metric && (this._mScale = o.DomUtil.create("div", e + "-line", i)), t.imperial && (this._iScale = o.DomUtil.create("div", e + "-line", i)) }, _update: function () { var t = this._map.getBounds(), e = t.getCenter().lat, i = 6378137 * Math.PI * Math.cos(e * Math.PI / 180), n = i * (t.getNorthEast().lng - t.getSouthWest().lng) / 180, o = this._map.getSize(), s = this.options, a = 0; o.x > 0 && (a = n * (s.maxWidth / o.x)), this._updateScales(s, a) }, _updateScales: function (t, e) { t.metric && e && this._updateMetric(e), t.imperial && e && this._updateImperial(e) }, _updateMetric: function (t) { var e = this._getRoundNum(t); this._mScale.style.width = this._getScaleWidth(e / t) + "px", this._mScale.innerHTML = 1e3 > e ? e + " m" : e / 1e3 + " km" }, _updateImperial: function (t) { var e, i, n, o = 3.2808399 * t, s = this._iScale; o > 5280 ? (e = o / 5280, i = this._getRoundNum(e), s.style.width = this._getScaleWidth(i / e) + "px", s.innerHTML = i + " mi") : (n = this._getRoundNum(o), s.style.width = this._getScaleWidth(n / o) + "px", s.innerHTML = n + " ft") }, _getScaleWidth: function (t) { return Math.round(this.options.maxWidth * t) - 10 }, _getRoundNum: function (t) { var e = Math.pow(10, (Math.floor(t) + "").length - 1), i = t / e; return i = i >= 10 ? 10 : i >= 5 ? 5 : i >= 3 ? 3 : i >= 2 ? 2 : 1, e * i } }), o.control.scale = function (t) { return new o.Control.Scale(t) }, o.Control.Layers = o.Control.extend({ options: { collapsed: !0, position: "topright", autoZIndex: !0 }, initialize: function (t, e, i) { o.setOptions(this, i), this._layers = {}, this._lastZIndex = 0, this._handlingClick = !1; for (var n in t) this._addLayer(t[n], n); for (n in e) this._addLayer(e[n], n, !0) }, onAdd: function (t) { return this._initLayout(), this._update(), t.on("layeradd", this._onLayerChange, this).on("layerremove", this._onLayerChange, this), this._container }, onRemove: function (t) { t.off("layeradd", this._onLayerChange, this).off("layerremove", this._onLayerChange, this) }, addBaseLayer: function (t, e) { return this._addLayer(t, e), this._update(), this }, addOverlay: function (t, e) { return this._addLayer(t, e, !0), this._update(), this }, removeLayer: function (t) { var e = o.stamp(t); return delete this._layers[e], this._update(), this }, _initLayout: function () { var t = "leaflet-control-layers", e = this._container = o.DomUtil.create("div", t); e.setAttribute("aria-haspopup", !0), o.Browser.touch ? o.DomEvent.on(e, "click", o.DomEvent.stopPropagation) : o.DomEvent.disableClickPropagation(e).disableScrollPropagation(e); var i = this._form = o.DomUtil.create("form", t + "-list"); if (this.options.collapsed) { o.Browser.android || o.DomEvent.on(e, "mouseover", this._expand, this).on(e, "mouseout", this._collapse, this); var n = this._layersLink = o.DomUtil.create("a", t + "-toggle", e); n.href = "#", n.title = "Layers", o.Browser.touch ? o.DomEvent.on(n, "click", o.DomEvent.stop).on(n, "click", this._expand, this) : o.DomEvent.on(n, "focus", this._expand, this), o.DomEvent.on(i, "click", function () { setTimeout(o.bind(this._onInputClick, this), 0) }, this), this._map.on("click", this._collapse, this) } else this._expand(); this._baseLayersList = o.DomUtil.create("div", t + "-base", i), this._separator = o.DomUtil.create("div", t + "-separator", i), this._overlaysList = o.DomUtil.create("div", t + "-overlays", i), e.appendChild(i) }, _addLayer: function (t, e, i) { var n = o.stamp(t); this._layers[n] = { layer: t, name: e, overlay: i }, this.options.autoZIndex && t.setZIndex && (this._lastZIndex++, t.setZIndex(this._lastZIndex)) }, _update: function () { if (this._container) { this._baseLayersList.innerHTML = "", this._overlaysList.innerHTML = ""; var t, e, i = !1, n = !1; for (t in this._layers) e = this._layers[t], this._addItem(e), n = n || e.overlay, i = i || !e.overlay; this._separator.style.display = n && i ? "" : "none" } }, _onLayerChange: function (t) { var e = this._layers[o.stamp(t.layer)]; if (e) { this._handlingClick || this._update(); var i = e.overlay ? "layeradd" === t.type ? "overlayadd" : "overlayremove" : "layeradd" === t.type ? "baselayerchange" : null; i && this._map.fire(i, e) } }, _createRadioElement: function (t, i) { var n = '<input type="radio" class="leaflet-control-layers-selector" name="' + t + '"'; i && (n += ' checked="checked"'), n += "/>"; var o = e.createElement("div"); return o.innerHTML = n, o.firstChild }, _addItem: function (t) { var i, n = e.createElement("label"), s = this._map.hasLayer(t.layer); t.overlay ? (i = e.createElement("input"), i.type = "checkbox", i.className = "leaflet-control-layers-selector", i.defaultChecked = s) : i = this._createRadioElement("leaflet-base-layers", s), i.layerId = o.stamp(t.layer), o.DomEvent.on(i, "click", this._onInputClick, this); var a = e.createElement("span"); a.innerHTML = " " + t.name, n.appendChild(i), n.appendChild(a); var r = t.overlay ? this._overlaysList : this._baseLayersList; return r.appendChild(n), n }, _onInputClick: function () { var t, e, i, n = this._form.getElementsByTagName("input"), o = n.length; for (this._handlingClick = !0, t = 0; o > t; t++) e = n[t], i = this._layers[e.layerId], e.checked && !this._map.hasLayer(i.layer) ? this._map.addLayer(i.layer) : !e.checked && this._map.hasLayer(i.layer) && this._map.removeLayer(i.layer); this._handlingClick = !1, this._refocusOnMap() }, _expand: function () { o.DomUtil.addClass(this._container, "leaflet-control-layers-expanded") }, _collapse: function () { this._container.className = this._container.className.replace(" leaflet-control-layers-expanded", "") } }), o.control.layers = function (t, e, i) { return new o.Control.Layers(t, e, i) }, o.PosAnimation = o.Class.extend({ includes: o.Mixin.Events, run: function (t, e, i, n) { this.stop(), this._el = t, this._inProgress = !0, this._newPos = e, this.fire("start"), t.style[o.DomUtil.TRANSITION] = "all " + (i || .25) + "s cubic-bezier(0,0," + (n || .5) + ",1)", o.DomEvent.on(t, o.DomUtil.TRANSITION_END, this._onTransitionEnd, this), o.DomUtil.setPosition(t, e), o.Util.falseFn(t.offsetWidth), this._stepTimer = setInterval(o.bind(this._onStep, this), 50) }, stop: function () { this._inProgress && (o.DomUtil.setPosition(this._el, this._getPos()), this._onTransitionEnd(), o.Util.falseFn(this._el.offsetWidth)) }, _onStep: function () { var t = this._getPos(); return t ? (this._el._leaflet_pos = t, void this.fire("step")) : void this._onTransitionEnd() }, _transformRe: /([-+]?(?:\d*\.)?\d+)\D*, ([-+]?(?:\d*\.)?\d+)\D*\)/, _getPos: function () { var e, i, n, s = this._el, a = t.getComputedStyle(s); if (o.Browser.any3d) { if (n = a[o.DomUtil.TRANSFORM].match(this._transformRe), !n) return; e = parseFloat(n[1]), i = parseFloat(n[2]) } else e = parseFloat(a.left), i = parseFloat(a.top); return new o.Point(e, i, !0) }, _onTransitionEnd: function () { o.DomEvent.off(this._el, o.DomUtil.TRANSITION_END, this._onTransitionEnd, this), this._inProgress && (this._inProgress = !1, this._el.style[o.DomUtil.TRANSITION] = "", this._el._leaflet_pos = this._newPos, clearInterval(this._stepTimer), this.fire("step").fire("end")) } }), o.Map.include({ setView: function (t, e, n) { if (e = e === i ? this._zoom : this._limitZoom(e), t = this._limitCenter(o.latLng(t), e, this.options.maxBounds), n = n || {}, this._panAnim && this._panAnim.stop(), this._loaded && !n.reset && n !== !0) { n.animate !== i && (n.zoom = o.extend({ animate: n.animate }, n.zoom), n.pan = o.extend({ animate: n.animate }, n.pan)); var s = this._zoom !== e ? this._tryAnimatedZoom && this._tryAnimatedZoom(t, e, n.zoom) : this._tryAnimatedPan(t, n.pan); if (s) return clearTimeout(this._sizeTimer), this } return this._resetView(t, e), this }, panBy: function (t, e) { if (t = o.point(t).round(), e = e || {}, !t.x && !t.y) return this; if (this._panAnim || (this._panAnim = new o.PosAnimation, this._panAnim.on({ step: this._onPanTransitionStep, end: this._onPanTransitionEnd }, this)), e.noMoveStart || this.fire("movestart"), e.animate !== !1) { o.DomUtil.addClass(this._mapPane, "leaflet-pan-anim"); var i = this._getMapPanePos().subtract(t); this._panAnim.run(this._mapPane, i, e.duration || .25, e.easeLinearity) } else this._rawPanBy(t), this.fire("move").fire("moveend"); return this }, _onPanTransitionStep: function () { this.fire("move") }, _onPanTransitionEnd: function () { o.DomUtil.removeClass(this._mapPane, "leaflet-pan-anim"), this.fire("moveend") }, _tryAnimatedPan: function (t, e) { var i = this._getCenterOffset(t)._floor(); return (e && e.animate) === !0 || this.getSize().contains(i) ? (this.panBy(i, e), !0) : !1 } }), o.PosAnimation = o.DomUtil.TRANSITION ? o.PosAnimation : o.PosAnimation.extend({ run: function (t, e, i, n) { this.stop(), this._el = t, this._inProgress = !0, this._duration = i || .25, this._easeOutPower = 1 / Math.max(n || .5, .2), this._startPos = o.DomUtil.getPosition(t), this._offset = e.subtract(this._startPos), this._startTime = +new Date, this.fire("start"), this._animate() }, stop: function () { this._inProgress && (this._step(), this._complete()) }, _animate: function () { this._animId = o.Util.requestAnimFrame(this._animate, this), this._step() }, _step: function () { var t = +new Date - this._startTime, e = 1e3 * this._duration; e > t ? this._runFrame(this._easeOut(t / e)) : (this._runFrame(1), this._complete()) }, _runFrame: function (t) { var e = this._startPos.add(this._offset.multiplyBy(t)); o.DomUtil.setPosition(this._el, e), this.fire("step") }, _complete: function () { o.Util.cancelAnimFrame(this._animId), this._inProgress = !1, this.fire("end") }, _easeOut: function (t) { return 1 - Math.pow(1 - t, this._easeOutPower) } }), o.Map.mergeOptions({ zoomAnimation: !0, zoomAnimationThreshold: 4 }), o.DomUtil.TRANSITION && o.Map.addInitHook(function () { this._zoomAnimated = this.options.zoomAnimation && o.DomUtil.TRANSITION && o.Browser.any3d && !o.Browser.android23 && !o.Browser.mobileOpera, this._zoomAnimated && o.DomEvent.on(this._mapPane, o.DomUtil.TRANSITION_END, this._catchTransitionEnd, this) }), o.Map.include(o.DomUtil.TRANSITION ? { _catchTransitionEnd: function (t) { this._animatingZoom && t.propertyName.indexOf("transform") >= 0 && this._onZoomTransitionEnd() }, _nothingToAnimate: function () { return !this._container.getElementsByClassName("leaflet-zoom-animated").length }, _tryAnimatedZoom: function (t, e, i) { if (this._animatingZoom) return !0; if (i = i || {}, !this._zoomAnimated || i.animate === !1 || this._nothingToAnimate() || Math.abs(e - this._zoom) > this.options.zoomAnimationThreshold) return !1; var n = this.getZoomScale(e), o = this._getCenterOffset(t)._divideBy(1 - 1 / n), s = this._getCenterLayerPoint()._add(o); return i.animate === !0 || this.getSize().contains(o) ? (this.fire("movestart").fire("zoomstart"), this._animateZoom(t, e, s, n, null, !0), !0) : !1 }, _animateZoom: function (t, e, i, n, s, a, r) { r || (this._animatingZoom = !0), o.DomUtil.addClass(this._mapPane, "leaflet-zoom-anim"), this._animateToCenter = t, this._animateToZoom = e, o.Draggable && (o.Draggable._disabled = !0), o.Util.requestAnimFrame(function () { this.fire("zoomanim", { center: t, zoom: e, origin: i, scale: n, delta: s, backwards: a }), setTimeout(o.bind(this._onZoomTransitionEnd, this), 250) }, this) }, _onZoomTransitionEnd: function () { this._animatingZoom && (this._animatingZoom = !1, o.DomUtil.removeClass(this._mapPane, "leaflet-zoom-anim"), this._resetView(this._animateToCenter, this._animateToZoom, !0, !0), o.Draggable && (o.Draggable._disabled = !1)) } } : {}), o.TileLayer.include({ _animateZoom: function (t) { this._animating || (this._animating = !0, this._prepareBgBuffer()); var e = this._bgBuffer, i = o.DomUtil.TRANSFORM, n = t.delta ? o.DomUtil.getTranslateString(t.delta) : e.style[i], s = o.DomUtil.getScaleString(t.scale, t.origin); e.style[i] = t.backwards ? s + " " + n : n + " " + s }, _endZoomAnim: function () { var t = this._tileContainer, e = this._bgBuffer; t.style.visibility = "", t.parentNode.appendChild(t), o.Util.falseFn(e.offsetWidth); var i = this._map.getZoom(); (i > this.options.maxZoom || i < this.options.minZoom) && this._clearBgBuffer(), this._animating = !1 }, _clearBgBuffer: function () { var t = this._map; !t || t._animatingZoom || t.touchZoom._zooming || (this._bgBuffer.innerHTML = "", this._bgBuffer.style[o.DomUtil.TRANSFORM] = "") }, _prepareBgBuffer: function () { var t = this._tileContainer, e = this._bgBuffer, i = this._getLoadedTilesPercentage(e), n = this._getLoadedTilesPercentage(t); return e && i > .5 && .5 > n ? (t.style.visibility = "hidden", void this._stopLoadingImages(t)) : (e.style.visibility = "hidden", e.style[o.DomUtil.TRANSFORM] = "", this._tileContainer = e, e = this._bgBuffer = t, this._stopLoadingImages(e), void clearTimeout(this._clearBgBufferTimer)) }, _getLoadedTilesPercentage: function (t) { var e, i, n = t.getElementsByTagName("img"), o = 0; for (e = 0, i = n.length; i > e; e++) n[e].complete && o++; return o / i }, _stopLoadingImages: function (t) { var e, i, n, s = Array.prototype.slice.call(t.getElementsByTagName("img")); for (e = 0, i = s.length; i > e; e++) n = s[e], n.complete || (n.onload = o.Util.falseFn, n.onerror = o.Util.falseFn, n.src = o.Util.emptyImageUrl, n.parentNode.removeChild(n)) } }), o.Map.include({ _defaultLocateOptions: { watch: !1, setView: !1, maxZoom: 1 / 0, timeout: 1e4, maximumAge: 0, enableHighAccuracy: !1 }, locate: function (t) { if (t = this._locateOptions = o.extend(this._defaultLocateOptions, t), !navigator.geolocation) return this._handleGeolocationError({ code: 0, message: "Geolocation not supported." }), this; var e = o.bind(this._handleGeolocationResponse, this), i = o.bind(this._handleGeolocationError, this); return t.watch ? this._locationWatchId = navigator.geolocation.watchPosition(e, i, t) : navigator.geolocation.getCurrentPosition(e, i, t), this }, stopLocate: function () { return navigator.geolocation && navigator.geolocation.clearWatch(this._locationWatchId), this._locateOptions && (this._locateOptions.setView = !1), this }, _handleGeolocationError: function (t) { var e = t.code, i = t.message || (1 === e ? "permission denied" : 2 === e ? "position unavailable" : "timeout"); this._locateOptions.setView && !this._loaded && this.fitWorld(), this.fire("locationerror", { code: e, message: "Geolocation error: " + i + "." }) }, _handleGeolocationResponse: function (t) { var e = t.coords.latitude, i = t.coords.longitude, n = new o.LatLng(e, i), s = 180 * t.coords.accuracy / 40075017, a = s / Math.cos(o.LatLng.DEG_TO_RAD * e), r = o.latLngBounds([e - s, i - a], [e + s, i + a]), h = this._locateOptions; if (h.setView) { var l = Math.min(this.getBoundsZoom(r), h.maxZoom); this.setView(n, l) } var u = { latlng: n, bounds: r, timestamp: t.timestamp }; for (var c in t.coords) "number" == typeof t.coords[c] && (u[c] = t.coords[c]); this.fire("locationfound", u) } })
}(window, document);
},{}],16:[function(require,module,exports){
/*
 Leaflet.markercluster, Provides Beautiful Animated Marker Clustering functionality for Leaflet, a JS library for interactive maps.
 https://github.com/Leaflet/Leaflet.markercluster
 (c) 2012-2013, Dave Leaver, smartrak
*/
!function(t,e){L.MarkerClusterGroup=L.FeatureGroup.extend({options:{maxClusterRadius:80,iconCreateFunction:null,spiderfyOnMaxZoom:!0,showCoverageOnHover:!0,zoomToBoundsOnClick:!0,singleMarkerMode:!1,disableClusteringAtZoom:null,removeOutsideVisibleBounds:!0,animateAddingMarkers:!1,spiderfyDistanceMultiplier:1,chunkedLoading:!1,chunkInterval:200,chunkDelay:50,chunkProgress:null,polygonOptions:{}},initialize:function(t){L.Util.setOptions(this,t),this.options.iconCreateFunction||(this.options.iconCreateFunction=this._defaultIconCreateFunction),this._featureGroup=L.featureGroup(),this._featureGroup.on(L.FeatureGroup.EVENTS,this._propagateEvent,this),this._nonPointGroup=L.featureGroup(),this._nonPointGroup.on(L.FeatureGroup.EVENTS,this._propagateEvent,this),this._inZoomAnimation=0,this._needsClustering=[],this._needsRemoving=[],this._currentShownBounds=null,this._queue=[]},addLayer:function(t){if(t instanceof L.LayerGroup){var e=[];for(var i in t._layers)e.push(t._layers[i]);return this.addLayers(e)}if(!t.getLatLng)return this._nonPointGroup.addLayer(t),this;if(!this._map)return this._needsClustering.push(t),this;if(this.hasLayer(t))return this;this._unspiderfy&&this._unspiderfy(),this._addLayer(t,this._maxZoom);var n=t,s=this._map.getZoom();if(t.__parent)for(;n.__parent._zoom>=s;)n=n.__parent;return this._currentShownBounds.contains(n.getLatLng())&&(this.options.animateAddingMarkers?this._animationAddLayer(t,n):this._animationAddLayerNonAnimated(t,n)),this},removeLayer:function(t){if(t instanceof L.LayerGroup){var e=[];for(var i in t._layers)e.push(t._layers[i]);return this.removeLayers(e)}return t.getLatLng?this._map?t.__parent?(this._unspiderfy&&(this._unspiderfy(),this._unspiderfyLayer(t)),this._removeLayer(t,!0),this._featureGroup.hasLayer(t)&&(this._featureGroup.removeLayer(t),t.setOpacity&&t.setOpacity(1)),this):this:(!this._arraySplice(this._needsClustering,t)&&this.hasLayer(t)&&this._needsRemoving.push(t),this):(this._nonPointGroup.removeLayer(t),this)},addLayers:function(t){var e,i,n,s,r=this._featureGroup,o=this._nonPointGroup,a=this.options.chunkedLoading,h=this.options.chunkInterval,_=this.options.chunkProgress;if(this._map){var u=0,l=(new Date).getTime(),d=L.bind(function(){for(var e=(new Date).getTime();u<t.length;u++){if(a&&0===u%200){var i=(new Date).getTime()-e;if(i>h)break}if(s=t[u],s.getLatLng){if(!this.hasLayer(s)&&(this._addLayer(s,this._maxZoom),s.__parent&&2===s.__parent.getChildCount())){var n=s.__parent.getAllChildMarkers(),p=n[0]===s?n[1]:n[0];r.removeLayer(p)}}else o.addLayer(s)}_&&_(u,t.length,(new Date).getTime()-l),u===t.length?(this._featureGroup.eachLayer(function(t){t instanceof L.MarkerCluster&&t._iconNeedsUpdate&&t._updateIcon()}),this._topClusterLevel._recursivelyAddChildrenToMap(null,this._zoom,this._currentShownBounds)):setTimeout(d,this.options.chunkDelay)},this);d()}else{for(e=[],i=0,n=t.length;n>i;i++)s=t[i],s.getLatLng?this.hasLayer(s)||e.push(s):o.addLayer(s);this._needsClustering=this._needsClustering.concat(e)}return this},removeLayers:function(t){var e,i,n,s=this._featureGroup,r=this._nonPointGroup;if(!this._map){for(e=0,i=t.length;i>e;e++)n=t[e],this._arraySplice(this._needsClustering,n),r.removeLayer(n);return this}for(e=0,i=t.length;i>e;e++)n=t[e],n.__parent?(this._removeLayer(n,!0,!0),s.hasLayer(n)&&(s.removeLayer(n),n.setOpacity&&n.setOpacity(1))):r.removeLayer(n);return this._topClusterLevel._recursivelyAddChildrenToMap(null,this._zoom,this._currentShownBounds),s.eachLayer(function(t){t instanceof L.MarkerCluster&&t._updateIcon()}),this},clearLayers:function(){return this._map||(this._needsClustering=[],delete this._gridClusters,delete this._gridUnclustered),this._noanimationUnspiderfy&&this._noanimationUnspiderfy(),this._featureGroup.clearLayers(),this._nonPointGroup.clearLayers(),this.eachLayer(function(t){delete t.__parent}),this._map&&this._generateInitialClusters(),this},getBounds:function(){var t=new L.LatLngBounds;this._topClusterLevel&&t.extend(this._topClusterLevel._bounds);for(var e=this._needsClustering.length-1;e>=0;e--)t.extend(this._needsClustering[e].getLatLng());return t.extend(this._nonPointGroup.getBounds()),t},eachLayer:function(t,e){var i,n=this._needsClustering.slice();for(this._topClusterLevel&&this._topClusterLevel.getAllChildMarkers(n),i=n.length-1;i>=0;i--)t.call(e,n[i]);this._nonPointGroup.eachLayer(t,e)},getLayers:function(){var t=[];return this.eachLayer(function(e){t.push(e)}),t},getLayer:function(t){var e=null;return this.eachLayer(function(i){L.stamp(i)===t&&(e=i)}),e},hasLayer:function(t){if(!t)return!1;var e,i=this._needsClustering;for(e=i.length-1;e>=0;e--)if(i[e]===t)return!0;for(i=this._needsRemoving,e=i.length-1;e>=0;e--)if(i[e]===t)return!1;return!(!t.__parent||t.__parent._group!==this)||this._nonPointGroup.hasLayer(t)},zoomToShowLayer:function(t,e){var i=function(){if((t._icon||t.__parent._icon)&&!this._inZoomAnimation)if(this._map.off("moveend",i,this),this.off("animationend",i,this),t._icon)e();else if(t.__parent._icon){var n=function(){this.off("spiderfied",n,this),e()};this.on("spiderfied",n,this),t.__parent.spiderfy()}};if(t._icon&&this._map.getBounds().contains(t.getLatLng()))e();else if(t.__parent._zoom<this._map.getZoom())this._map.on("moveend",i,this),this._map.panTo(t.getLatLng());else{var n=function(){this._map.off("movestart",n,this),n=null};this._map.on("movestart",n,this),this._map.on("moveend",i,this),this.on("animationend",i,this),t.__parent.zoomToBounds(),n&&i.call(this)}},onAdd:function(t){this._map=t;var e,i,n;if(!isFinite(this._map.getMaxZoom()))throw"Map has no maxZoom specified";for(this._featureGroup.onAdd(t),this._nonPointGroup.onAdd(t),this._gridClusters||this._generateInitialClusters(),e=0,i=this._needsRemoving.length;i>e;e++)n=this._needsRemoving[e],this._removeLayer(n,!0);this._needsRemoving=[],this._zoom=this._map.getZoom(),this._currentShownBounds=this._getExpandedVisibleBounds(),this._map.on("zoomend",this._zoomEnd,this),this._map.on("moveend",this._moveEnd,this),this._spiderfierOnAdd&&this._spiderfierOnAdd(),this._bindEvents(),i=this._needsClustering,this._needsClustering=[],this.addLayers(i)},onRemove:function(t){t.off("zoomend",this._zoomEnd,this),t.off("moveend",this._moveEnd,this),this._unbindEvents(),this._map._mapPane.className=this._map._mapPane.className.replace(" leaflet-cluster-anim",""),this._spiderfierOnRemove&&this._spiderfierOnRemove(),this._hideCoverage(),this._featureGroup.onRemove(t),this._nonPointGroup.onRemove(t),this._featureGroup.clearLayers(),this._map=null},getVisibleParent:function(t){for(var e=t;e&&!e._icon;)e=e.__parent;return e||null},_arraySplice:function(t,e){for(var i=t.length-1;i>=0;i--)if(t[i]===e)return t.splice(i,1),!0},_removeLayer:function(t,e,i){var n=this._gridClusters,s=this._gridUnclustered,r=this._featureGroup,o=this._map;if(e)for(var a=this._maxZoom;a>=0&&s[a].removeObject(t,o.project(t.getLatLng(),a));a--);var h,_=t.__parent,u=_._markers;for(this._arraySplice(u,t);_&&(_._childCount--,!(_._zoom<0));)e&&_._childCount<=1?(h=_._markers[0]===t?_._markers[1]:_._markers[0],n[_._zoom].removeObject(_,o.project(_._cLatLng,_._zoom)),s[_._zoom].addObject(h,o.project(h.getLatLng(),_._zoom)),this._arraySplice(_.__parent._childClusters,_),_.__parent._markers.push(h),h.__parent=_.__parent,_._icon&&(r.removeLayer(_),i||r.addLayer(h))):(_._recalculateBounds(),i&&_._icon||_._updateIcon()),_=_.__parent;delete t.__parent},_isOrIsParent:function(t,e){for(;e;){if(t===e)return!0;e=e.parentNode}return!1},_propagateEvent:function(t){if(t.layer instanceof L.MarkerCluster){if(t.originalEvent&&this._isOrIsParent(t.layer._icon,t.originalEvent.relatedTarget))return;t.type="cluster"+t.type}this.fire(t.type,t)},_defaultIconCreateFunction:function(t){var e=t.getChildCount(),i=" marker-cluster-";return i+=10>e?"small":100>e?"medium":"large",new L.DivIcon({html:"<div><span>"+e+"</span></div>",className:"marker-cluster"+i,iconSize:new L.Point(40,40)})},_bindEvents:function(){var t=this._map,e=this.options.spiderfyOnMaxZoom,i=this.options.showCoverageOnHover,n=this.options.zoomToBoundsOnClick;(e||n)&&this.on("clusterclick",this._zoomOrSpiderfy,this),i&&(this.on("clustermouseover",this._showCoverage,this),this.on("clustermouseout",this._hideCoverage,this),t.on("zoomend",this._hideCoverage,this))},_zoomOrSpiderfy:function(t){var e=this._map;e.getMaxZoom()===e.getZoom()?this.options.spiderfyOnMaxZoom&&t.layer.spiderfy():this.options.zoomToBoundsOnClick&&t.layer.zoomToBounds(),t.originalEvent&&13===t.originalEvent.keyCode&&e._container.focus()},_showCoverage:function(t){var e=this._map;this._inZoomAnimation||(this._shownPolygon&&e.removeLayer(this._shownPolygon),t.layer.getChildCount()>2&&t.layer!==this._spiderfied&&(this._shownPolygon=new L.Polygon(t.layer.getConvexHull(),this.options.polygonOptions),e.addLayer(this._shownPolygon)))},_hideCoverage:function(){this._shownPolygon&&(this._map.removeLayer(this._shownPolygon),this._shownPolygon=null)},_unbindEvents:function(){var t=this.options.spiderfyOnMaxZoom,e=this.options.showCoverageOnHover,i=this.options.zoomToBoundsOnClick,n=this._map;(t||i)&&this.off("clusterclick",this._zoomOrSpiderfy,this),e&&(this.off("clustermouseover",this._showCoverage,this),this.off("clustermouseout",this._hideCoverage,this),n.off("zoomend",this._hideCoverage,this))},_zoomEnd:function(){this._map&&(this._mergeSplitClusters(),this._zoom=this._map._zoom,this._currentShownBounds=this._getExpandedVisibleBounds())},_moveEnd:function(){if(!this._inZoomAnimation){var t=this._getExpandedVisibleBounds();this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,this._zoom,t),this._topClusterLevel._recursivelyAddChildrenToMap(null,this._map._zoom,t),this._currentShownBounds=t}},_generateInitialClusters:function(){var t=this._map.getMaxZoom(),e=this.options.maxClusterRadius,i=e;"function"!=typeof e&&(i=function(){return e}),this.options.disableClusteringAtZoom&&(t=this.options.disableClusteringAtZoom-1),this._maxZoom=t,this._gridClusters={},this._gridUnclustered={};for(var n=t;n>=0;n--)this._gridClusters[n]=new L.DistanceGrid(i(n)),this._gridUnclustered[n]=new L.DistanceGrid(i(n));this._topClusterLevel=new L.MarkerCluster(this,-1)},_addLayer:function(t,e){var i,n,s=this._gridClusters,r=this._gridUnclustered;for(this.options.singleMarkerMode&&(t.options.icon=this.options.iconCreateFunction({getChildCount:function(){return 1},getAllChildMarkers:function(){return[t]}}));e>=0;e--){i=this._map.project(t.getLatLng(),e);var o=s[e].getNearObject(i);if(o)return o._addChild(t),t.__parent=o,void 0;if(o=r[e].getNearObject(i)){var a=o.__parent;a&&this._removeLayer(o,!1);var h=new L.MarkerCluster(this,e,o,t);s[e].addObject(h,this._map.project(h._cLatLng,e)),o.__parent=h,t.__parent=h;var _=h;for(n=e-1;n>a._zoom;n--)_=new L.MarkerCluster(this,n,_),s[n].addObject(_,this._map.project(o.getLatLng(),n));for(a._addChild(_),n=e;n>=0&&r[n].removeObject(o,this._map.project(o.getLatLng(),n));n--);return}r[e].addObject(t,i)}this._topClusterLevel._addChild(t),t.__parent=this._topClusterLevel},_enqueue:function(t){this._queue.push(t),this._queueTimeout||(this._queueTimeout=setTimeout(L.bind(this._processQueue,this),300))},_processQueue:function(){for(var t=0;t<this._queue.length;t++)this._queue[t].call(this);this._queue.length=0,clearTimeout(this._queueTimeout),this._queueTimeout=null},_mergeSplitClusters:function(){this._processQueue(),this._zoom<this._map._zoom&&this._currentShownBounds.intersects(this._getExpandedVisibleBounds())?(this._animationStart(),this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,this._zoom,this._getExpandedVisibleBounds()),this._animationZoomIn(this._zoom,this._map._zoom)):this._zoom>this._map._zoom?(this._animationStart(),this._animationZoomOut(this._zoom,this._map._zoom)):this._moveEnd()},_getExpandedVisibleBounds:function(){if(!this.options.removeOutsideVisibleBounds)return this._map.getBounds();var t=this._map,e=t.getBounds(),i=e._southWest,n=e._northEast,s=L.Browser.mobile?0:Math.abs(i.lat-n.lat),r=L.Browser.mobile?0:Math.abs(i.lng-n.lng);return new L.LatLngBounds(new L.LatLng(i.lat-s,i.lng-r,!0),new L.LatLng(n.lat+s,n.lng+r,!0))},_animationAddLayerNonAnimated:function(t,e){if(e===t)this._featureGroup.addLayer(t);else if(2===e._childCount){e._addToMap();var i=e.getAllChildMarkers();this._featureGroup.removeLayer(i[0]),this._featureGroup.removeLayer(i[1])}else e._updateIcon()}}),L.MarkerClusterGroup.include(L.DomUtil.TRANSITION?{_animationStart:function(){this._map._mapPane.className+=" leaflet-cluster-anim",this._inZoomAnimation++},_animationEnd:function(){this._map&&(this._map._mapPane.className=this._map._mapPane.className.replace(" leaflet-cluster-anim","")),this._inZoomAnimation--,this.fire("animationend")},_animationZoomIn:function(t,e){var i,n=this._getExpandedVisibleBounds(),s=this._featureGroup;this._topClusterLevel._recursively(n,t,0,function(r){var o,a=r._latlng,h=r._markers;for(n.contains(a)||(a=null),r._isSingleParent()&&t+1===e?(s.removeLayer(r),r._recursivelyAddChildrenToMap(null,e,n)):(r.setOpacity(0),r._recursivelyAddChildrenToMap(a,e,n)),i=h.length-1;i>=0;i--)o=h[i],n.contains(o._latlng)||s.removeLayer(o)}),this._forceLayout(),this._topClusterLevel._recursivelyBecomeVisible(n,e),s.eachLayer(function(t){t instanceof L.MarkerCluster||!t._icon||t.setOpacity(1)}),this._topClusterLevel._recursively(n,t,e,function(t){t._recursivelyRestoreChildPositions(e)}),this._enqueue(function(){this._topClusterLevel._recursively(n,t,0,function(t){s.removeLayer(t),t.setOpacity(1)}),this._animationEnd()})},_animationZoomOut:function(t,e){this._animationZoomOutSingle(this._topClusterLevel,t-1,e),this._topClusterLevel._recursivelyAddChildrenToMap(null,e,this._getExpandedVisibleBounds()),this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,t,this._getExpandedVisibleBounds())},_animationZoomOutSingle:function(t,e,i){var n=this._getExpandedVisibleBounds();t._recursivelyAnimateChildrenInAndAddSelfToMap(n,e+1,i);var s=this;this._forceLayout(),t._recursivelyBecomeVisible(n,i),this._enqueue(function(){if(1===t._childCount){var r=t._markers[0];r.setLatLng(r.getLatLng()),r.setOpacity&&r.setOpacity(1)}else t._recursively(n,i,0,function(t){t._recursivelyRemoveChildrenFromMap(n,e+1)});s._animationEnd()})},_animationAddLayer:function(t,e){var i=this,n=this._featureGroup;n.addLayer(t),e!==t&&(e._childCount>2?(e._updateIcon(),this._forceLayout(),this._animationStart(),t._setPos(this._map.latLngToLayerPoint(e.getLatLng())),t.setOpacity(0),this._enqueue(function(){n.removeLayer(t),t.setOpacity(1),i._animationEnd()})):(this._forceLayout(),i._animationStart(),i._animationZoomOutSingle(e,this._map.getMaxZoom(),this._map.getZoom())))},_forceLayout:function(){L.Util.falseFn(e.body.offsetWidth)}}:{_animationStart:function(){},_animationZoomIn:function(t,e){this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,t),this._topClusterLevel._recursivelyAddChildrenToMap(null,e,this._getExpandedVisibleBounds()),this.fire("animationend")},_animationZoomOut:function(t,e){this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds,t),this._topClusterLevel._recursivelyAddChildrenToMap(null,e,this._getExpandedVisibleBounds()),this.fire("animationend")},_animationAddLayer:function(t,e){this._animationAddLayerNonAnimated(t,e)}}),L.markerClusterGroup=function(t){return new L.MarkerClusterGroup(t)},L.MarkerCluster=L.Marker.extend({initialize:function(t,e,i,n){L.Marker.prototype.initialize.call(this,i?i._cLatLng||i.getLatLng():new L.LatLng(0,0),{icon:this}),this._group=t,this._zoom=e,this._markers=[],this._childClusters=[],this._childCount=0,this._iconNeedsUpdate=!0,this._bounds=new L.LatLngBounds,i&&this._addChild(i),n&&this._addChild(n)},getAllChildMarkers:function(t){t=t||[];for(var e=this._childClusters.length-1;e>=0;e--)this._childClusters[e].getAllChildMarkers(t);for(var i=this._markers.length-1;i>=0;i--)t.push(this._markers[i]);return t},getChildCount:function(){return this._childCount},zoomToBounds:function(){for(var t,e=this._childClusters.slice(),i=this._group._map,n=i.getBoundsZoom(this._bounds),s=this._zoom+1,r=i.getZoom();e.length>0&&n>s;){s++;var o=[];for(t=0;t<e.length;t++)o=o.concat(e[t]._childClusters);e=o}n>s?this._group._map.setView(this._latlng,s):r>=n?this._group._map.setView(this._latlng,r+1):this._group._map.fitBounds(this._bounds)},getBounds:function(){var t=new L.LatLngBounds;return t.extend(this._bounds),t},_updateIcon:function(){this._iconNeedsUpdate=!0,this._icon&&this.setIcon(this)},createIcon:function(){return this._iconNeedsUpdate&&(this._iconObj=this._group.options.iconCreateFunction(this),this._iconNeedsUpdate=!1),this._iconObj.createIcon()},createShadow:function(){return this._iconObj.createShadow()},_addChild:function(t,e){this._iconNeedsUpdate=!0,this._expandBounds(t),t instanceof L.MarkerCluster?(e||(this._childClusters.push(t),t.__parent=this),this._childCount+=t._childCount):(e||this._markers.push(t),this._childCount++),this.__parent&&this.__parent._addChild(t,!0)},_expandBounds:function(t){var e,i=t._wLatLng||t._latlng;t instanceof L.MarkerCluster?(this._bounds.extend(t._bounds),e=t._childCount):(this._bounds.extend(i),e=1),this._cLatLng||(this._cLatLng=t._cLatLng||i);var n=this._childCount+e;this._wLatLng?(this._wLatLng.lat=(i.lat*e+this._wLatLng.lat*this._childCount)/n,this._wLatLng.lng=(i.lng*e+this._wLatLng.lng*this._childCount)/n):this._latlng=this._wLatLng=new L.LatLng(i.lat,i.lng)},_addToMap:function(t){t&&(this._backupLatlng=this._latlng,this.setLatLng(t)),this._group._featureGroup.addLayer(this)},_recursivelyAnimateChildrenIn:function(t,e,i){this._recursively(t,0,i-1,function(t){var i,n,s=t._markers;for(i=s.length-1;i>=0;i--)n=s[i],n._icon&&(n._setPos(e),n.setOpacity(0))},function(t){var i,n,s=t._childClusters;for(i=s.length-1;i>=0;i--)n=s[i],n._icon&&(n._setPos(e),n.setOpacity(0))})},_recursivelyAnimateChildrenInAndAddSelfToMap:function(t,e,i){this._recursively(t,i,0,function(n){n._recursivelyAnimateChildrenIn(t,n._group._map.latLngToLayerPoint(n.getLatLng()).round(),e),n._isSingleParent()&&e-1===i?(n.setOpacity(1),n._recursivelyRemoveChildrenFromMap(t,e)):n.setOpacity(0),n._addToMap()})},_recursivelyBecomeVisible:function(t,e){this._recursively(t,0,e,null,function(t){t.setOpacity(1)})},_recursivelyAddChildrenToMap:function(t,e,i){this._recursively(i,-1,e,function(n){if(e!==n._zoom)for(var s=n._markers.length-1;s>=0;s--){var r=n._markers[s];i.contains(r._latlng)&&(t&&(r._backupLatlng=r.getLatLng(),r.setLatLng(t),r.setOpacity&&r.setOpacity(0)),n._group._featureGroup.addLayer(r))}},function(e){e._addToMap(t)})},_recursivelyRestoreChildPositions:function(t){for(var e=this._markers.length-1;e>=0;e--){var i=this._markers[e];i._backupLatlng&&(i.setLatLng(i._backupLatlng),delete i._backupLatlng)}if(t-1===this._zoom)for(var n=this._childClusters.length-1;n>=0;n--)this._childClusters[n]._restorePosition();else for(var s=this._childClusters.length-1;s>=0;s--)this._childClusters[s]._recursivelyRestoreChildPositions(t)},_restorePosition:function(){this._backupLatlng&&(this.setLatLng(this._backupLatlng),delete this._backupLatlng)},_recursivelyRemoveChildrenFromMap:function(t,e,i){var n,s;this._recursively(t,-1,e-1,function(t){for(s=t._markers.length-1;s>=0;s--)n=t._markers[s],i&&i.contains(n._latlng)||(t._group._featureGroup.removeLayer(n),n.setOpacity&&n.setOpacity(1))},function(t){for(s=t._childClusters.length-1;s>=0;s--)n=t._childClusters[s],i&&i.contains(n._latlng)||(t._group._featureGroup.removeLayer(n),n.setOpacity&&n.setOpacity(1))})},_recursively:function(t,e,i,n,s){var r,o,a=this._childClusters,h=this._zoom;if(e>h)for(r=a.length-1;r>=0;r--)o=a[r],t.intersects(o._bounds)&&o._recursively(t,e,i,n,s);else if(n&&n(this),s&&this._zoom===i&&s(this),i>h)for(r=a.length-1;r>=0;r--)o=a[r],t.intersects(o._bounds)&&o._recursively(t,e,i,n,s)},_recalculateBounds:function(){var t,e=this._markers,i=this._childClusters;for(this._bounds=new L.LatLngBounds,delete this._wLatLng,t=e.length-1;t>=0;t--)this._expandBounds(e[t]);for(t=i.length-1;t>=0;t--)this._expandBounds(i[t])},_isSingleParent:function(){return this._childClusters.length>0&&this._childClusters[0]._childCount===this._childCount}}),L.DistanceGrid=function(t){this._cellSize=t,this._sqCellSize=t*t,this._grid={},this._objectPoint={}},L.DistanceGrid.prototype={addObject:function(t,e){var i=this._getCoord(e.x),n=this._getCoord(e.y),s=this._grid,r=s[n]=s[n]||{},o=r[i]=r[i]||[],a=L.Util.stamp(t);this._objectPoint[a]=e,o.push(t)},updateObject:function(t,e){this.removeObject(t),this.addObject(t,e)},removeObject:function(t,e){var i,n,s=this._getCoord(e.x),r=this._getCoord(e.y),o=this._grid,a=o[r]=o[r]||{},h=a[s]=a[s]||[];for(delete this._objectPoint[L.Util.stamp(t)],i=0,n=h.length;n>i;i++)if(h[i]===t)return h.splice(i,1),1===n&&delete a[s],!0},eachObject:function(t,e){var i,n,s,r,o,a,h,_=this._grid;for(i in _){o=_[i];for(n in o)for(a=o[n],s=0,r=a.length;r>s;s++)h=t.call(e,a[s]),h&&(s--,r--)}},getNearObject:function(t){var e,i,n,s,r,o,a,h,_=this._getCoord(t.x),u=this._getCoord(t.y),l=this._objectPoint,d=this._sqCellSize,p=null;for(e=u-1;u+1>=e;e++)if(s=this._grid[e])for(i=_-1;_+1>=i;i++)if(r=s[i])for(n=0,o=r.length;o>n;n++)a=r[n],h=this._sqDist(l[L.Util.stamp(a)],t),d>h&&(d=h,p=a);return p},_getCoord:function(t){return Math.floor(t/this._cellSize)},_sqDist:function(t,e){var i=e.x-t.x,n=e.y-t.y;return i*i+n*n}},function(){L.QuickHull={getDistant:function(t,e){var i=e[1].lat-e[0].lat,n=e[0].lng-e[1].lng;return n*(t.lat-e[0].lat)+i*(t.lng-e[0].lng)},findMostDistantPointFromBaseLine:function(t,e){var i,n,s,r=0,o=null,a=[];for(i=e.length-1;i>=0;i--)n=e[i],s=this.getDistant(n,t),s>0&&(a.push(n),s>r&&(r=s,o=n));return{maxPoint:o,newPoints:a}},buildConvexHull:function(t,e){var i=[],n=this.findMostDistantPointFromBaseLine(t,e);return n.maxPoint?(i=i.concat(this.buildConvexHull([t[0],n.maxPoint],n.newPoints)),i=i.concat(this.buildConvexHull([n.maxPoint,t[1]],n.newPoints))):[t[0]]},getConvexHull:function(t){var e,i=!1,n=!1,s=null,r=null;for(e=t.length-1;e>=0;e--){var o=t[e];(i===!1||o.lat>i)&&(s=o,i=o.lat),(n===!1||o.lat<n)&&(r=o,n=o.lat)}var a=[].concat(this.buildConvexHull([r,s],t),this.buildConvexHull([s,r],t));return a}}}(),L.MarkerCluster.include({getConvexHull:function(){var t,e,i=this.getAllChildMarkers(),n=[];for(e=i.length-1;e>=0;e--)t=i[e].getLatLng(),n.push(t);return L.QuickHull.getConvexHull(n)}}),L.MarkerCluster.include({_2PI:2*Math.PI,_circleFootSeparation:25,_circleStartAngle:Math.PI/6,_spiralFootSeparation:28,_spiralLengthStart:11,_spiralLengthFactor:5,_circleSpiralSwitchover:9,spiderfy:function(){if(this._group._spiderfied!==this&&!this._group._inZoomAnimation){var t,e=this.getAllChildMarkers(),i=this._group,n=i._map,s=n.latLngToLayerPoint(this._latlng);this._group._unspiderfy(),this._group._spiderfied=this,e.length>=this._circleSpiralSwitchover?t=this._generatePointsSpiral(e.length,s):(s.y+=10,t=this._generatePointsCircle(e.length,s)),this._animationSpiderfy(e,t)}},unspiderfy:function(t){this._group._inZoomAnimation||(this._animationUnspiderfy(t),this._group._spiderfied=null)},_generatePointsCircle:function(t,e){var i,n,s=this._group.options.spiderfyDistanceMultiplier*this._circleFootSeparation*(2+t),r=s/this._2PI,o=this._2PI/t,a=[];for(a.length=t,i=t-1;i>=0;i--)n=this._circleStartAngle+i*o,a[i]=new L.Point(e.x+r*Math.cos(n),e.y+r*Math.sin(n))._round();return a},_generatePointsSpiral:function(t,e){var i,n=this._group.options.spiderfyDistanceMultiplier*this._spiralLengthStart,s=this._group.options.spiderfyDistanceMultiplier*this._spiralFootSeparation,r=this._group.options.spiderfyDistanceMultiplier*this._spiralLengthFactor,o=0,a=[];for(a.length=t,i=t-1;i>=0;i--)o+=s/n+5e-4*i,a[i]=new L.Point(e.x+n*Math.cos(o),e.y+n*Math.sin(o))._round(),n+=this._2PI*r/o;return a},_noanimationUnspiderfy:function(){var t,e,i=this._group,n=i._map,s=i._featureGroup,r=this.getAllChildMarkers();for(this.setOpacity(1),e=r.length-1;e>=0;e--)t=r[e],s.removeLayer(t),t._preSpiderfyLatlng&&(t.setLatLng(t._preSpiderfyLatlng),delete t._preSpiderfyLatlng),t.setZIndexOffset&&t.setZIndexOffset(0),t._spiderLeg&&(n.removeLayer(t._spiderLeg),delete t._spiderLeg);i._spiderfied=null}}),L.MarkerCluster.include(L.DomUtil.TRANSITION?{SVG_ANIMATION:function(){return e.createElementNS("http://www.w3.org/2000/svg","animate").toString().indexOf("SVGAnimate")>-1}(),_animationSpiderfy:function(t,i){var n,s,r,o,a=this,h=this._group,_=h._map,u=h._featureGroup,l=_.latLngToLayerPoint(this._latlng);for(n=t.length-1;n>=0;n--)s=t[n],s.setOpacity?(s.setZIndexOffset(1e6),s.setOpacity(0),u.addLayer(s),s._setPos(l)):u.addLayer(s);h._forceLayout(),h._animationStart();var d=L.Path.SVG?0:.3,p=L.Path.SVG_NS;for(n=t.length-1;n>=0;n--)if(o=_.layerPointToLatLng(i[n]),s=t[n],s._preSpiderfyLatlng=s._latlng,s.setLatLng(o),s.setOpacity&&s.setOpacity(1),r=new L.Polyline([a._latlng,o],{weight:1.5,color:"#222",opacity:d}),_.addLayer(r),s._spiderLeg=r,L.Path.SVG&&this.SVG_ANIMATION){var c=r._path.getTotalLength();r._path.setAttribute("stroke-dasharray",c+","+c);var f=e.createElementNS(p,"animate");f.setAttribute("attributeName","stroke-dashoffset"),f.setAttribute("begin","indefinite"),f.setAttribute("from",c),f.setAttribute("to",0),f.setAttribute("dur",.25),r._path.appendChild(f),f.beginElement(),f=e.createElementNS(p,"animate"),f.setAttribute("attributeName","stroke-opacity"),f.setAttribute("attributeName","stroke-opacity"),f.setAttribute("begin","indefinite"),f.setAttribute("from",0),f.setAttribute("to",.5),f.setAttribute("dur",.25),r._path.appendChild(f),f.beginElement()}if(a.setOpacity(.3),L.Path.SVG)for(this._group._forceLayout(),n=t.length-1;n>=0;n--)s=t[n]._spiderLeg,s.options.opacity=.5,s._path.setAttribute("stroke-opacity",.5);setTimeout(function(){h._animationEnd(),h.fire("spiderfied")},200)},_animationUnspiderfy:function(t){var e,i,n,s=this._group,r=s._map,o=s._featureGroup,a=t?r._latLngToNewLayerPoint(this._latlng,t.zoom,t.center):r.latLngToLayerPoint(this._latlng),h=this.getAllChildMarkers(),_=L.Path.SVG&&this.SVG_ANIMATION;for(s._animationStart(),this.setOpacity(1),i=h.length-1;i>=0;i--)e=h[i],e._preSpiderfyLatlng&&(e.setLatLng(e._preSpiderfyLatlng),delete e._preSpiderfyLatlng,e.setOpacity?(e._setPos(a),e.setOpacity(0)):o.removeLayer(e),_&&(n=e._spiderLeg._path.childNodes[0],n.setAttribute("to",n.getAttribute("from")),n.setAttribute("from",0),n.beginElement(),n=e._spiderLeg._path.childNodes[1],n.setAttribute("from",.5),n.setAttribute("to",0),n.setAttribute("stroke-opacity",0),n.beginElement(),e._spiderLeg._path.setAttribute("stroke-opacity",0)));setTimeout(function(){var t=0;for(i=h.length-1;i>=0;i--)e=h[i],e._spiderLeg&&t++;for(i=h.length-1;i>=0;i--)e=h[i],e._spiderLeg&&(e.setOpacity&&(e.setOpacity(1),e.setZIndexOffset(0)),t>1&&o.removeLayer(e),r.removeLayer(e._spiderLeg),delete e._spiderLeg);s._animationEnd()},200)}}:{_animationSpiderfy:function(t,e){var i,n,s,r,o=this._group,a=o._map,h=o._featureGroup;for(i=t.length-1;i>=0;i--)r=a.layerPointToLatLng(e[i]),n=t[i],n._preSpiderfyLatlng=n._latlng,n.setLatLng(r),n.setZIndexOffset&&n.setZIndexOffset(1e6),h.addLayer(n),s=new L.Polyline([this._latlng,r],{weight:1.5,color:"#222"}),a.addLayer(s),n._spiderLeg=s;this.setOpacity(.3),o.fire("spiderfied")},_animationUnspiderfy:function(){this._noanimationUnspiderfy()}}),L.MarkerClusterGroup.include({_spiderfied:null,_spiderfierOnAdd:function(){this._map.on("click",this._unspiderfyWrapper,this),this._map.options.zoomAnimation&&this._map.on("zoomstart",this._unspiderfyZoomStart,this),this._map.on("zoomend",this._noanimationUnspiderfy,this),L.Path.SVG&&!L.Browser.touch&&this._map._initPathRoot()},_spiderfierOnRemove:function(){this._map.off("click",this._unspiderfyWrapper,this),this._map.off("zoomstart",this._unspiderfyZoomStart,this),this._map.off("zoomanim",this._unspiderfyZoomAnim,this),this._unspiderfy()},_unspiderfyZoomStart:function(){this._map&&this._map.on("zoomanim",this._unspiderfyZoomAnim,this)},_unspiderfyZoomAnim:function(t){L.DomUtil.hasClass(this._map._mapPane,"leaflet-touching")||(this._map.off("zoomanim",this._unspiderfyZoomAnim,this),this._unspiderfy(t))},_unspiderfyWrapper:function(){this._unspiderfy()},_unspiderfy:function(t){this._spiderfied&&this._spiderfied.unspiderfy(t)},_noanimationUnspiderfy:function(){this._spiderfied&&this._spiderfied._noanimationUnspiderfy()},_unspiderfyLayer:function(t){t._spiderLeg&&(this._featureGroup.removeLayer(t),t.setOpacity(1),t.setZIndexOffset(0),this._map.removeLayer(t._spiderLeg),delete t._spiderLeg)}})}(window,document);
},{}]},{},[1]);
