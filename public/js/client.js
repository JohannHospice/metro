Math.round5 = function (x) {
    return this.ceil(x / 5) * 5;
}
Number.prototype.toStringFormated = function (length) {
    var value = this.valueOf()
    if (value < 0)
        throw 'not my problem'
    if (value == 0)
        return '00'
    var str = ""
    for (let i = length - 1; value < Math.pow(10, i); i--)
        str += '0'
    str += value
    return str
}



$(document).ready(function () {
    // Static Func
    function setClassDanger($element) {
        return $element.removeClass('uk-form-success').addClass('uk-form-danger')
    }

    function setClassSuccess($element) {
        return $element.removeClass('uk-form-danger').addClass('uk-form-success')
    }

    function HTMLBuilder() {
        var html = ""
        return {
            add: function (elem, str) {
                this.open(elem).text(str).close(elem)
                return this
            },
            open: function (elem) {
                html += '<' + elem + '>'
                return this
            },
            close: function (elem) {
                html += '</' + elem + '>'
                return this
            },
            text: function (str) {
                html += str
                return this
            },
            build: function () {
                return html
            }
        }
    }

    function formValidator(departure, arrival, time, sens) {
        var notNow = sens == 'arrive' || sens == 'leave'
        var timeParsed = notNow ? Time.parse(time) : Time.parseByDate(new Date())
        var valid = {
            arrival: arrival.length != 0,
            departure: departure.length != 0,
            diffRouteArrival: arrival !== departure,
            time: Time.isValid(timeParsed)
        }
        valid.all = valid.time && valid.diffRouteArrival && valid.departure && valid.arrival
        return {
            data: {
                time: timeParsed,
                departure,
                notNow,
                arrival,
                sens
            },
            valid
        }
    }

    // RequestFactory
    const requestFactory = {
        ajax: function (url, type, data) {
            return $.ajax({
                url,
                type,
                data
            })
        },
        route: function (departure, arrival, sens, time) {
            return this.ajax('/query/route', 'GET', {
                arrival,
                departure,
                sens,
                time
            })
        },
        search: function (location) {
            return this.ajax('/query/search', 'GET', {
                location
            })
        }
    }

    const Time = {
        composeByDate: function (date) {
            return date.getHours() + ':' + date.getMinutes()
        },
        compose: function (hours, minutes) {
            return hours.toStringFormated(2) + ':' + minutes.toStringFormated(2)
        },
        parseByDate: function (date) {
            return [date.getHours(), date.getMinutes()]
        },
        parse: function (timeStr) {
            if (timeStr.length != 5)
                return [NaN, NaN]
            return timeStr.split(':').map(function (time) {
                return parseInt(time)
            })
        },
        isValid: function (time) {
            return !Number.isNaN(time[0]) && time[0] < 24 && !Number.isNaN(time[1]) && time[1] < 60
        }
    }

    // Init vars
    const $route = $('#route')
    const $result = $route.find('#result')
    const $form = $route.find('#form')

    const $timeContainer = $form.find('#time-container')
    const $sens = $form.find('[name=sens]')
    const $inputs = $form.find('input[type=text]')

    const $departure = $inputs.filter('[name=departure]')
    const $arrival = $inputs.filter('[name=arrival]')
    const $time = $inputs.filter('[name=time]')

    // Init elements
    // Set default time value to time input
    ;
    (function () {
        var now = new Date()
        now.setMinutes(Math.round5(now.getMinutes()))
        $time.val(Time.composeByDate(now))
    })()

    // Autocompletion
    ;
    (function () {
        const options = {
            minLength: 1,
            source: function (release) {
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
        $('.uk-autocomplete').each(function (i, element) {
            $.UIkit.autocomplete(element, options)
        })
    })()

    function updateHandler() {
        var $this = $(this)
        if ($this.hasClass('uk-form-danger'))
            $this.removeClass('uk-form-danger')
    }
    // Init event handlers
    // for user
    $inputs.keyup(updateHandler)
    $time.keyup(function () {
        var $this = $(this)
        if (!Time.isValid(Time.parse($this.val())))
            $this.addClass('uk-form-danger')
        else if ($this.hasClass('uk-form-danger'))
            $this.removeClass('uk-form-danger')
    })
    //for timepicker
    $time.change(function () {
        var $this = $(this)
        if ($this.hasClass('uk-form-danger'))
            $this.removeClass('uk-form-danger')
    })
    
    $sens.change(function () {
        var value = $(this).val()
        if (value === "now") {
            $timeContainer.addClass('uk-hidden')
            $time.removeClass('uk-form-danger')
        } else if (value === "leave" || value === "arrive") {
            $timeContainer.removeClass('uk-hidden')
        }
    })

    // Request Submited to get Route
    $form.submit(function (event) {
        event.preventDefault()
        var validator = formValidator($departure.val(), $arrival.val(), $time.val(), $sens.val())
        if (validator.valid.all) {
            var data = validator.data
            requestFactory.route(data.departure, data.arrival, data.sens, data.time)
                .done(function (data) {
                    setClassSuccess($departure)
                    setClassSuccess($arrival)
                    setClassSuccess($time)
                    $result.html(data)
                })
                .fail(function (jqXHR) {
                    var htmlBld = new HTMLBuilder()
                        .add('p', 'Thoses stations does not exist')
                        .open('ul class="uk-margin-remove"')

                    if (!jqXHR.responseJSON.departure) {
                        setClassDanger($departure)
                        htmlBld.add('li', 'Departure')
                    }

                    if (!jqXHR.responseJSON.arrival) {
                        setClassDanger($arrival)
                        htmlBld.add('li', 'Arrival')
                    }

                    htmlBld.close('ul')

                    UIkit.notify({
                        message: htmlBld.build(),
                        status: 'danger',
                        timeout: 5000,
                        pos: 'top-center'
                    })
                })
        } else {
            var valid = validator.valid
            var htmlBld = new HTMLBuilder().open('ul class="uk-margin-remove"')

            if (!valid.departure || !valid.arrival) {
                htmlBld.add('li', 'Please fill in the field(s)').open('ul class="uk-margin-remove"')

                if (!valid.departure) {
                    setClassDanger($departure)
                    htmlBld.add('li', 'departure')
                }

                if (!valid.arrival) {
                    setClassDanger($arrival)
                    htmlBld.add('li', 'arrival')
                }
                htmlBld.close('ul')
            } else if (!valid.diffRouteArrival) {
                setClassDanger($arrival)
                setClassDanger($departure)
                htmlBld.add('li', 'The place of departure and arrival must be different.')
            }

            if (!valid.time) {
                setClassDanger($time)
                htmlBld.add('li', 'Time field was not valid')
            }

            UIkit.notify({
                message: htmlBld.close('ul').build(),
                status: 'danger',
                pos: 'top-center',
                timeout: 5000
            })
        }
    })
})