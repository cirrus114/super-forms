/* eslint-disable no-undef */
(function($) { // Hide scope, no $ conflict
    "use strict";

    SUPER.Stripe = {};

    SUPER.Stripe.StripesIdeal = [];
    SUPER.Stripe.StripesIban = [];
    SUPER.Stripe.StripesCc = [];
    SUPER.Stripe.elements = [];
    SUPER.Stripe.cards = [];
    SUPER.Stripe.ideal = [];
    SUPER.Stripe.iban = [];
    SUPER.Stripe.forms = document.querySelectorAll('.super-form, .super-preview-elements');
    console.log(SUPER.Stripe.forms);

    var classes = {
        base: 'super-stripe-base',
        complete: 'super-stripe-complete',
        empty: 'super-stripe-empty',
        focus: 'super-stripe-focus',
        invalid: 'super-stripe-invalid',
        webkitAutofill: 'super-stripe-autofill'
    };

    console.log(super_stripe_i18n.styles.idealPadding);

    var style = {
        base: {
            color: super_stripe_i18n.styles.color,
            iconColor: super_stripe_i18n.styles.iconColor,
            fontFamily: super_stripe_i18n.styles.fontFamily,
            fontSize: super_stripe_i18n.styles.fontSize+'px',
            padding: super_stripe_i18n.styles.idealPadding, // padding // available for the idealBank Element. Accepts integer px values.
            ':focus': {
                color: super_stripe_i18n.styles.colorFocus,
                iconColor: super_stripe_i18n.styles.iconColorFocus,
                '::placeholder': {
                    color: super_stripe_i18n.styles.placeholderFocus
                },
            },
            '::placeholder': {
                color: super_stripe_i18n.styles.placeholder
            },
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    };

    // Initialize Stripe Elements
    SUPER.init_stripe_elements = function() {
        console.log('test1');
        console.log(SUPER.Stripe.forms);
        SUPER.Stripe.forms = document.querySelectorAll('.super-form, .super-preview-elements');
        SUPER.Stripe.forms.forEach(function(form, index) {
            console.log('test2');
            if(SUPER.Stripe.forms[index].querySelector('.super-stripe-iban-element')){
                console.log('test3');
                // Check if not yet initialized
                if(!SUPER.Stripe.forms[index].querySelector('.super-stripe-iban-element').classList.contains('super-stripe-initialized')){
                    console.log('test4');
                    // Add initialized class
                    SUPER.Stripe.forms[index].querySelector('.super-stripe-iban-element').classList.add('super-stripe-initialized');
                    // Create an instance of Elements.
                    SUPER.Stripe.StripesIban[index] = Stripe(super_stripe_i18n.stripe_pk);
                    SUPER.Stripe.elements[index] = SUPER.Stripe.StripesIban[index].elements();
                    console.log(style);
                    SUPER.Stripe.iban[index] = SUPER.Stripe.elements[index].create('iban', {
                        supportedCountries: ['SEPA'],
                        classes: classes,
                        style: style,
                        hidePostalCode: true, // Hide the postal code field. Default is false. If you are already collecting a full billing address or postal code elsewhere, set this to true.
                        iconStyle: 'solid', // Appearance of the icon in the Element. Either 'solid' or 'default'.
                        hideIcon: false // Hides the icon in the Element. Default is false.
                    });
                    SUPER.Stripe.iban[index].mount(SUPER.Stripe.forms[index].querySelector('.super-stripe-iban-element'));
                }
            }
            if(SUPER.Stripe.forms[index].querySelector('.super-stripe-ideal-element')){
                console.log('test3');
                // Check if not yet initialized
                if(!SUPER.Stripe.forms[index].querySelector('.super-stripe-ideal-element').classList.contains('super-stripe-initialized')){
                    console.log('test4');
                    // Add initialized class
                    SUPER.Stripe.forms[index].querySelector('.super-stripe-ideal-element').classList.add('super-stripe-initialized');
                    // Create an instance of Elements.
                    SUPER.Stripe.StripesIdeal[index] = Stripe(super_stripe_i18n.stripe_pk);
                    SUPER.Stripe.elements[index] = SUPER.Stripe.StripesIdeal[index].elements();
                    console.log(style);
                    SUPER.Stripe.ideal[index] = SUPER.Stripe.elements[index].create('idealBank', {
                        classes: classes,
                        style: style,
                        hidePostalCode: true, // Hide the postal code field. Default is false. If you are already collecting a full billing address or postal code elsewhere, set this to true.
                        iconStyle: 'solid', // Appearance of the icon in the Element. Either 'solid' or 'default'.
                        hideIcon: false // Hides the icon in the Element. Default is false.
                    });
                    SUPER.Stripe.ideal[index].mount(SUPER.Stripe.forms[index].querySelector('.super-stripe-ideal-element'));
                }
            }
            if(SUPER.Stripe.forms[index].querySelector('.super-stripe-cc-element')){
                // Check if not yet initialized
                if(!SUPER.Stripe.forms[index].querySelector('.super-stripe-cc-element').classList.contains('super-stripe-initialized')){
                    // Add initialized class
                    SUPER.Stripe.forms[index].querySelector('.super-stripe-cc-element').classList.add('super-stripe-initialized');
                    // Create an instance of Elements.
                    SUPER.Stripe.StripesCc[index] = Stripe(super_stripe_i18n.stripe_pk);
                    SUPER.Stripe.elements[index] = SUPER.Stripe.StripesCc[index].elements();
                    SUPER.Stripe.cards[index] = SUPER.Stripe.elements[index].create('card', {
                        classes: classes,
                        style: style,
                        hidePostalCode: true, // Hide the postal code field. Default is false. If you are already collecting a full billing address or postal code elsewhere, set this to true.
                        iconStyle: 'solid', // Appearance of the icon in the Element. Either 'solid' or 'default'.
                        hideIcon: false // Hides the icon in the Element. Default is false.
                    });
                    SUPER.Stripe.cards[index].mount(SUPER.Stripe.forms[index].querySelector('.super-stripe-cc-element'));
                    SUPER.Stripe.cards[index].addEventListener('change', function(event) {
                        var $parent = $(SUPER.Stripe.cards[index]._parent).parents('.super-field:eq(0)');
                        if (event.error) {
                            if($parent.children('.super-error-msg').length===0) {
                                $('<div class="super-error-msg">' + event.error.message + '</div>').appendTo($parent);
                            }
                            $parent.addClass('super-error-active');
                        }else{
                            $parent.removeClass('super-error-active');
                        }
                    });
                }
            }
        });
    };

    // Handle form submission.
    SUPER.stripe_ideal_create_payment_method = function($form, $data, $old_html, $response) {
        SUPER.Stripe.forms = document.querySelectorAll('.super-form, .super-preview-elements');
        SUPER.Stripe.forms.forEach(function(form, index) {
            if( ($form[0] == form) && (SUPER.Stripe.forms[index].querySelector('.super-stripe-ideal-element')) ) {
                console.log('match ideal!');
                // Only if element is not conditionally hidden
                var $this = $(SUPER.Stripe.forms[index].querySelector('.super-stripe-ideal-element')),
                    $hidden = false,
                    $parent = $this.parents('.super-shortcode:eq(0)');
                $this.parents('.super-shortcode.super-column').each(function() {
                    if ($(this).css('display') == 'none') {
                        $hidden = true;
                    }
                });
                console.log($parent);
                if (($hidden === true) || (($parent.css('display') == 'none') && (!$parent.hasClass('super-hidden')))) {
                    // Conditionally hidden
                    console.log('test1');
                } else {
                    console.log('test2');
                    // First make sure that the form will not hide, otherwise the data would be gone, and stripe won't know the credit card information
                    $form.data('is-redirecting', 'true');
                    // Make payment intent
                    $.ajax({
                        url: super_stripe_i18n.ajaxurl,
                        type: 'post',
                        data: {
                            action: 'super_stripe_prepare_payment',
                            payment_method: 'ideal',
                            data: $data,
                            response: $response
                        },
                        success: function(result) {
                            result = JSON.parse(result);
                            if( result.method=='subscription' ) {
                                alert('Subscriptions can not be paid through iDeal, please choose a different payment method!');
                            }else{
                                // Single payment checkout
                                // Redirect to Stripe iDeal payment page
                                SUPER.Stripe.StripesIdeal[index].confirmIdealPayment(result.client_secret, {
                                    payment_method: {
                                        ideal: SUPER.Stripe.ideal[index],
                                    },
                                    return_url: result.return_url //'http://f4d.nl/dev/checkout/complete',
                                });
                            }
                        },
                        complete: function() {
                            console.log('completed');
                        },
                        error: function(xhr, ajaxOptions, thrownError) {
                            console.log(xhr, ajaxOptions, thrownError);
                            alert('Failed to process data, please try again');
                        }
                    });
                }
            }
        });
    };

    // Handle form submission.
    SUPER.stripe_iban_create_payment_method = function($form, $data, $old_html, $response) {
        SUPER.Stripe.forms = document.querySelectorAll('.super-form, .super-preview-elements');
        SUPER.Stripe.forms.forEach(function(form, index) {
            if( ($form[0] == form) && (SUPER.Stripe.forms[index].querySelector('.super-stripe-iban-element')) ) {
                console.log('match iban!');
                // Only if element is not conditionally hidden
                var $this = $(SUPER.Stripe.forms[index].querySelector('.super-stripe-iban-element')),
                    $hidden = false,
                    $parent = $this.parents('.super-shortcode:eq(0)');
                $this.parents('.super-shortcode.super-column').each(function() {
                    if ($(this).css('display') == 'none') {
                        $hidden = true;
                    }
                });
                console.log($parent);
                if (($hidden === true) || (($parent.css('display') == 'none') && (!$parent.hasClass('super-hidden')))) {
                    // Conditionally hidden
                    console.log('test1');
                } else {
                    console.log('test2');
                    // First make sure that the form will not hide, otherwise the data would be gone, and stripe won't know the credit card information
                    $form.data('is-redirecting', 'true');
                    // Make payment intent
                    $.ajax({
                        url: super_stripe_i18n.ajaxurl,
                        type: 'post',
                        data: {
                            action: 'super_stripe_prepare_payment',
                            payment_method: 'sepa_debit',
                            data: $data,
                            response: $response
                        },
                        success: function(result) {
                            result = JSON.parse(result);
                            if( result.method=='subscription' ) {
                                // Subscription checkout
                                // In case of subscription we must provide it with billing details
                                if( result.sepa_debit ) {
                                    // Because this is a subscription that is paid via iDeal we must create a source to handle Sepa Debit
                                    console.log(SUPER.Stripe.iban[index]);
                                    console.log(result.source.id);
                                    SUPER.Stripe.StripesIban[index].createSource({
                                        type: 'sepa_debit',
                                        sepa_debit: {
                                            ideal: result.source.id,
                                        },
                                        currency: 'eur',
                                        owner: {
                                            name: 'Jenny SEPA',
                                        },
                                    }).then(function(result) {
                                        console.log(result);
                                        // payment_method_not_available
                                        // processing_error
                                        // invalid_bank_account_iban
                                        // invalid_owner_name

                                        // handle result.error or result.source
                                    });
                                }
                            }else{
                                // Single payment checkout
                                // Create a charge?
                            }
                        },
                        complete: function() {
                            console.log('completed');
                        },
                        error: function(xhr, ajaxOptions, thrownError) {
                            console.log(xhr, ajaxOptions, thrownError);
                            alert('Failed to process data, please try again');
                        }
                    });
                }
            }
        });
    };


    // Handle error
    SUPER.stripe_proceed = function(result, $form, $old_html, $data, stripe){
        if (result.error) {
            // Display error.message in your UI.
            console.log(result.error.message);
            $('.super-msg').remove();
            var $html = '<div class="super-msg super-error">';
            $html += result.error.message;
            $html += '<span class="close"></span>';
            $html += '</div>';
            $($html).prependTo($form);
            // keep loading state active
            var $proceed = SUPER.before_scrolling_to_message_hook($form, $form.offset().top - 30);
            if ($proceed === true) {
                $('html, body').animate({
                    scrollTop: $form.offset().top - 200
                }, 1000);
            }
            $form.find('.super-form-button.super-loading .super-button-name').html($old_html);
            $form.find('.super-form-button.super-loading').removeClass('super-loading');
        } else {
            if(typeof result.paymentMethod !== 'undefined'){
                console.log(result);
                console.log(result.paymentMethod.id);
                // Create the subscriptions
                $.ajax({
                    url: super_stripe_i18n.ajaxurl,
                    type: 'post',
                    data: {
                        action: 'super_stripe_create_subscription',
                        payment_method: result.paymentMethod.id,
                        data: $data
                    },
                    success: function(result) {
                        result = JSON.parse(result);
                        console.log(result);
                        // If an error occured
                        if(result.error){
                            SUPER.stripe_proceed(result, $form, $old_html, $data, stripe);
                        }
                        // Outcome 1: Payment succeeds
                        if( (result.subscription_status=='active') && (result.invoice_status=='paid') && (result.paymentintent_status=='succeeded') ) {
                            console.log('Payment succeeds');
                            // The payment has succeeded. Display a success message.
                            console.log('The payment has succeeded, show success message1.');
                            $form.data('is-doing-things', ''); // Finish form submission
                        }
                        // Outcome 2: Trial starts
                        if( (result.subscription_status=='trialing') && (result.invoice_status=='paid') ) {
                            console.log('Trial starts');
                            $form.data('is-doing-things', ''); // Finish form submission
                        }
                        // Outcome 3: Payment fails
                        if( (result.subscription_status=='incomplete') && (result.invoice_status=='open') && (result.paymentintent_status=='requires_payment_method') ) {
                            console.log('Payment fails');
                            console.log(result);
                            // result.error = {message: 'The charge attempt for the subscription failed, please try with a new payment method'};

                        }
                        // Outcome 4: Requires action
                        if( (result.subscription_status=='incomplete') && (result.invoice_status=='open') && (result.paymentintent_status=='requires_action') ) {
                            // Notify customer that further action is required
                            stripe.confirmCardPayment(result.client_secret).then(function(result) {
                                if (result.error) {
                                    // Display error.message in your UI.
                                    SUPER.stripe_proceed(result, $form, $old_html, $data, stripe);
                                } else {
                                    // The payment has succeeded. Display a success message.
                                    console.log('The payment has succeeded, show success message2.');
                                    $form.data('is-doing-things', ''); // Finish form submission
                                }
                            });
                        }
                    },
                    complete: function() {
                        console.log('completed');
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        console.log(xhr, ajaxOptions, thrownError);
                        alert('Failed to process data, please try again');
                    }
                });
            }else{
                if (result.paymentIntent.status === 'succeeded') {
                    // The payment has succeeded. Display a success message.
                    console.log('The payment has succeeded, show success message3.');
                    $form.data('is-doing-things', ''); // Finish form submission
                }
            }
        }
    };

    // Handle form submission.
    SUPER.stripe_cc_create_payment_method = function($form, $data, $old_html, $response) {
        console.log('test2222');
        SUPER.Stripe.forms = document.querySelectorAll('.super-form, .super-preview-elements');
        SUPER.Stripe.forms.forEach(function(form, index) {
            if( ($form[0] == form) && (SUPER.Stripe.forms[index].querySelector('.super-stripe-cc-element')) ) {
                console.log('match cc!');
                // Only if element is not conditionally hidden
                var $this = $(SUPER.Stripe.forms[index].querySelector('.super-stripe-cc-element')),
                    $hidden = false,
                    $parent = $this.parents('.super-shortcode:eq(0)');

                console.log($this);

                $this.parents('.super-shortcode.super-column').each(function() {
                    if ($(this).css('display') == 'none') {
                        $hidden = true;
                    }
                });
                console.log($parent);
                if (($hidden === true) || (($parent.css('display') == 'none') && (!$parent.hasClass('super-hidden')))) {
                    // Conditionally hidden
                    console.log('test1');
                } else {
                    console.log('test2');
                    $form.data('is-redirecting', 'true');
                    $form.data('is-doing-things', 'true');
                    // Submit form data so that we can prepare for a payment
                    $.ajax({
                        url: super_stripe_i18n.ajaxurl,
                        type: 'post',
                        data: {
                            action: 'super_stripe_prepare_payment',
                            payment_method: 'card',
                            data: $data,
                            response: $response
                        },
                        success: function(result) {
                            result = JSON.parse(result);
                            if( result.method=='subscription' ) {
                                // Subscription checkout
                                // In case of subscription we must provide it with billing details
                                var $atts = {};
                                if( result.ideal ) {
                                    // Because this is a subscription that is paid via iDeal we must create a source to handle Sepa Debit
                                    console.log(SUPER.Stripe.ideal[index]);
                                    // stripe.createSource({
                                    //   type: 'sepa_debit',
                                    //   sepa_debit: {
                                    //     ideal: 'src_16xhynE8WzK49JbAs9M21jaR',
                                    //   },
                                    //   currency: 'eur',
                                    //   owner: {
                                    //     name: 'Jenny Rosen',
                                    //   },
                                    // }).then(function(result) {
                                    //   // handle result.error or result.source
                                    // });
                                    // $atts.type = 'ideal';
                                    // $atts.ideal = SUPER.Stripe.ideal[index];
                                }else{
                                    // if( result.sepa_debit ) {
                                    //     $atts.type = 'sepa_debit';
                                    //     $atts.sepa_debit.iban = '';
                                    //     $atts.card = SUPER.Stripe.cards[index];
                                    // }else{
                                    //     $atts.type = 'card';
                                    //     $atts.card = SUPER.Stripe.cards[index];
                                    // }
                                    $atts.type = 'card';
                                    $atts.card = SUPER.Stripe.cards[index];
                                }
                                $atts.billing_details = {
                                    name: 'Rens Tillmann'
                                };
                                SUPER.Stripe.StripesCc[index].createPaymentMethod($atts).then(function(result) {
                                    // It will return "result.paymentMethod.id" which is the payment ID e.g: pm_XXXXXXX
                                    SUPER.stripe_proceed(result, $form, $old_html, $data, SUPER.Stripe.StripesCc[index]);
                                });
                            }else{
                                // Single payment checkout
                                SUPER.Stripe.StripesCc[index].confirmCardPayment(result.client_secret, {
                                    payment_method: {
                                        card: SUPER.Stripe.cards[index],
                                        billing_details: {
                                            name: 'Rens Tillmann'
                                        }
                                    }
                                }).then(function(result) {
                                    SUPER.stripe_proceed(result, $form, $old_html, $data, SUPER.Stripe.StripesCc[index]);
                                });
                            }
                        },
                        complete: function() {
                            console.log('completed');
                        },
                        error: function(xhr, ajaxOptions, thrownError) {
                            console.log(xhr, ajaxOptions, thrownError);
                            alert('Failed to process data, please try again');
                        }
                    });
                }
            }
        });
    }

})(jQuery);