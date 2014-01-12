function login() {

    FB.login(function (response) {
        if (response.authResponse) {
            show_notification('Authorization', 'You successfully logged in using Facebook. Now we can load your groups.');
            $("#get_groups").removeAttr('disabled');
            $("#login").attr('disabled', 'disabled');
        } else {
            show_notification('Authorization', 'We could not log you in to Facebook. We are very sad that it failed.', 'error');
        }
    }, {scope: 'publish_stream,user_groups'});

}

function getGroups() {

    FB.api("/me/groups", function (response) {
        $("#groups").css('overflow-y', 'scroll');
        $("#groups").html("");
        data = response['data'];
        for (var x in data) {
            addCheckbox(data[x].name, data[x].id)
        }
        
        $("#post").removeAttr('disabled');
        show_notification('Groups', 'Groups loaded. Select a few of them. Write a post and share with the selected groups', 'notice');
    });


}

function addCheckbox(name, id) {
    var container = $('#groups');
    var html = '<input type="checkbox" id="cb' + id + '" value="' + id + '" /> <label for="cb' + id + '">' + name + '</label><br/>';
    container.append($(html));
}

function makePost(groupId, message) {
    FB.api("/" + groupId + "/feed", "post", {"message": message}, function (resp) {
        if (resp.id) {
            show_notification('Posted', "Posted to: '" + $("#groups").find("label[for=cb" + groupId + "]").html() + "'", 'success');
        } else {
            show_notification('Failed', "Failed to post to the selected groups", 'error');
        }
    })
}

function sendPosts() {
    var message = $("#msg").val();
    input_list = $("#groups").find('input')
    for (var x in input_list) {
        if (input_list[x].checked) {
            makePost(input_list[x].value, message)
        }
    }
}

function show_notification(title, message, type) {
    console.log(type);
    switch (type) {
        case undefined:
            $.growl({title: title, message: message });
            break;
        case 'error':
            $.growl.error({title: title, message: message });
            break;
        case 'notice':
        case 'success':
            $.growl.notice({title: title, message: message });
            break;
        case 'warning':
            $.growl.warning({title: title, message: message });
            break;

    }
}

$(document).ready(function () {
    $("#login").removeAttr('disabled');
});