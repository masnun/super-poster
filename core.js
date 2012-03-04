function login() {

    FB.login(function (response) {
        if (response.authResponse) {
            $("#notification").html("Logged In");
            $("#get_groups").removeAttr('disabled');
        } else {
            $("#notification").html("Login Failed");
        }
    }, {scope:'publish_stream,user_groups'});

}

function getGroups() {
    $("#groups").html("");
    FB.api("/me/groups", function (response) {
        data = response['data'];
        for (x in data) {
            if (x < 10) {
                addCheckbox(data[x].name, data[x].id)
            }

        }
    })

    $("#post").removeAttr('disabled');
}

function addCheckbox(name, id) {
    var container = $('#groups');
    var html = '<input type="checkbox" id="cb' + id + '" value="' + id + '" /> <label for="cb' + id + '">' + name + '</label><br/>';
    container.append($(html));
}

function makePost(groupId, message) {
    FB.api("/" + groupId + "/feed", "post", {"message":message}, function (resp) {
        if (resp.id) {
            $("#notification").html("Posted to: '" + $("#groups").find("label[for=cb" + groupId + "]").html() + "'");
        } else {
            $("#notification").html("Posting failed!");
        }
    })
}

function sendPosts() {
    var message = $("#msg").val();
    input_list = $("#groups").find('input')
    for (x in input_list) {
        if (input_list[x].checked) {
            makePost(input_list[x].value, message)
        }
    }
}

$(document).ready(function () {
    $("#login").removeAttr('disabled');

})