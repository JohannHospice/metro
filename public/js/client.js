$(document).ready(function () {
    const tools = {
        ajaxFactory: {
            route: function (departure, arrival) {
                return $.ajax('/query/route', {
                    type: 'GET',
                    data: {
                        arrival,
                        departure
                    },
                    // use done failure instead
                    success: function (data) {
                        $('input[name=departure]')
                            .removeClass('uk-form-danger')
                            .addClass('uk-form-success')
                        $('input[name=arrival]')
                            .removeClass('uk-form-danger')
                            .addClass('uk-form-success')
                        $('#result').html(data)
                    },
                    error: function(info, info2){
                        UIkit.notify({
                            message: searchErrorString(
                                info.responseJSON.departure, 
                                info.responseJSON.arrival),
                            status: 'danger',
                            timeout: 5000,
                            pos: 'top-center'
                        });
                        console.log(info.responseJSON)
                        if(info.responseJSON.departure)
                            $('input[name=departure]')
                                .addClass('uk-form-danger')
                        if(info.responseJSON.arrival)
                            $('input[name=arrival]')
                                .addClass('uk-form-danger')
                    },
                })
            },
            search: function (location, success, error) {
                return $.ajax('/query/search', {
                    type: 'GET',
                    data: {location},
                    success,
                    error,
                })
            }
        },
        validateInputs: function ($inputs) {
            var valid = true
            $inputs.each(function () {
                var $this = $(this)
                var value = $this.val()
                if (typeof value !== 'string' || value.length == 0) {
                    $this.removeClass('uk-form-success')
                    $this.addClass('uk-form-danger')
                    valid = false
                }
            });
            return valid
        }
    }

    $('input').keyup(function () {
        $(this).removeClass('uk-form-danger')
    })
    $('#route form').submit(function (event) {
        event.preventDefault();
        var $inputs = $(this).find('input[type=text]')
        if (tools.validateInputs($inputs))
            tools.ajaxFactory.route(
                $inputs.filter('[name=departure]').val(), 
                $inputs.filter('[name=arrival]').val())
        else
            UIkit.notify({
                message: "Please fill in the fields",
                status: 'danger',
                timeout: 5000,
                pos: 'top-center'
            });
    })

    $('#search form').submit(function (event) {
        event.preventDefault();
        var $inputs = $(this).find('input[type=text]')
        if (tools.validateInputs($inputs))
            tools.ajaxFactory.search($inputs.find('[name=location]').val())
    })
    var autocompleteOptions = {
        'source': function (release) {
            tools.ajaxFactory.search(
                this.input.val(),
                function(data){
                    release(data.map(function(obj){
                        return{value: obj.label}
                    }))
                },
                function(){release([])})
        },
        'minLength': 1
    }
    $.UIkit.autocomplete($('#autocomplete-departure'), autocompleteOptions);
    $.UIkit.autocomplete($('#autocomplete-arrival'), autocompleteOptions);

})

function searchErrorString(departure, arrival){
    var str = "These field locations do not exist: "
    if(!arrival){
        str += 'departure'
        if(!departure)
            str +=', arrival'
    }
    else if(!departure)
        str +='arrival'
    return str
}