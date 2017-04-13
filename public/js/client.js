Math.round5 = function (x) {
    return this.ceil(x / 5) * 5;
}
Number.prototype.toStringFormated = function (length) {
    var value = this.valueOf()
    if (value <= 0) return '00'
    var str = ""
    for (let i = length - 1; value < Math.pow(10, i); i--)
        str += '0'
    str += value
    return str
}

/**
 * 
 */
$(document).ready(function () {
    /**
     * 
     */
    function RequestFactory() {}
    RequestFactory.prototype.route = function (departure, arrival, sens, time) {
        return $.ajax({
            url: '/query/route',
            type: 'GET',
            data: {
                arrival,
                departure,
                sens,
                time
            }
        })
    }
    RequestFactory.prototype.search = function (location) {
        return $.ajax({
            url: '/query/search',
            type: 'GET',
            data: {
                location
            }
        })
    }
    var requestFactory = new RequestFactory()

    /**
     * Static Func
     */
    function setClassDanger($input) {
        return $input.removeClass('uk-form-success').addClass('uk-form-danger')
    }

    function setClassSuccess($input) {
        return $input.removeClass('uk-form-danger').addClass('uk-form-success')
    }

    function inputKeyup() {
        $(this).removeClass('uk-form-danger')
    }

    /**
     * Init vars
     */
    const $route = $('#route')
    const $result = $route.find('#result')
    const $form = $route.find('#form')

    const $timeContainer = $form.find('#time-container')
    const $sens = $form.find('[name=sens]')
    const $inputs = $form.find('input[type=text]')

    const $departure = $inputs.filter('[name=departure]')
    const $arrival = $inputs.filter('[name=arrival]')
    const $time = $inputs.filter('[name=time]')

    /**
     * Init elements
     */
    ;
    (function () {
        var now = new Date()
        var minutes = Math.round5(now.getMinutes()).toStringFormated(2)
        var hours = now.getHours().toStringFormated(2)
        $time.val(hours + ':' + minutes)
    })()

    /**
     * Init behaviors
     */
    $inputs.keyup(inputKeyup)

    $sens.change(function () {
        var value = $(this).val()
        if (value === "now") {
            $timeContainer.addClass('uk-hidden')
            $time.removeClass('uk-form-danger')
        } else if (value === "leave" || value === "arrive") {
            $timeContainer.removeClass('uk-hidden')
        }
    })

    /**
     * Request Submited to get Route
     */
    $form.submit(function (event) {
        event.preventDefault()

        var departure = $departure.val()
        var arrival = $arrival.val()
        var sens = $sens.val()

        var notNow = sens == 'arrive' || sens == 'leave'
        var time = null
        var valid = true

        if (typeof departure !== 'string' || departure.length == 0) {
            setClassDanger($departure)
            valid = false
        }

        if (typeof arrival !== 'string' || arrival.length == 0) {
            setClassDanger($arrival)
            valid = false
        }

        if (notNow) {
            try {
                var timeValue = $time.val()
                var timeValueSplited = timeValue.split(':')
                var hours = parseInt(timeValueSplited[0], 10)
                var minutes = parseInt(timeValueSplited[1], 10)
                if (timeValue.length == 5 && minutes != NaN && hours != NaN) {
                    time = [hours, minutes]
                } else throw 'err'
            } catch (e) {
                setClassDanger($time)
                valid = false
            }
        } else {
            var date = new Date()
            time = [date.getHours(), date.getMinutes()]
        }

        if (valid) {
            requestFactory.route(departure, arrival, sens, time)
                .done(function (data) {
                    setClassSuccess($departure)
                    setClassSuccess($arrival)
                    if (notNow)
                        setClassSuccess($time)
                    $result.html(data)
                })
                .fail(function (jqXHR) {
                    var departure = jqXHR.responseJSON.departure,
                        arrival = jqXHR.responseJSON.arrival
                    if (!departure) setClassDanger($departure)
                    if (!arrival) setClassDanger($arrival)
                    UIkit.notify({
                        message: "Station(s) do(es) not exist(s)",
                        status: 'danger',
                        timeout: 5000,
                        pos: 'top-center'
                    });
                })
        } else {
            UIkit.notify({
                message: "Please fill in the fields",
                status: 'danger',
                pos: 'top-center',
                timeout: 5000
            });
        }
    })

    /**
     * Autocompletion
     */
    const autocompleteOptions = {
        'minLength': 1,
        'source': function (release) {
            let value = this.input.val()
            requestFactory.search(value)
                .done(function (stations) {
                    release(stations.map(function (station) {
                        return {
                            value: station.label
                        }
                    }))
                })
                .fail(function () {
                    release([])
                })
        }
    }
    $.UIkit.autocomplete($('#autocomplete-departure'), autocompleteOptions);
    $.UIkit.autocomplete($('#autocomplete-arrival'), autocompleteOptions);
})