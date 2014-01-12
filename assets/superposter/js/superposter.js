// globals
var blacklist = [];
var appId = '';


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

function loadBlacklist() {

    $.ajax({
        'async': false,
        'global': false,
        'url': 'blacklist.json',
        'dataType': "json",
        'success': function (data) {
            blacklist = data;
        }
    })

}

function filterPost(text) {
    text = text.toLowerCase();
    var x = 0;

    while (x <= (blacklist.length - 1)) {
        if (text.search(blacklist[x]) !== -1) {
            return blacklist[x];
        }
        x++;
    }

    return false;
}

function getGroups() {

    FB.api("/me/groups", function (response) {
        var container = $('#groups');
        container.css('overflow-y', 'scroll');
        container.html("");
        data = response['data'];
        for (var x in data) {
            addCheckbox(data[x].name, data[x].id)
        }

        $("#post").removeAttr('disabled');
        show_notification('Groups', 'Groups loaded. Select a few of them. Write a post and share with the selected groups', 'notice');

        loadBlacklist();
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

function startPosting() {
    var message = $("#msg").val();
    var blackListedWord = filterPost(message);

    if (!blackListedWord) {
        input_list = $("#groups").find('input')
        for (var x in input_list) {
            if (input_list[x].checked) {
                makePost(input_list[x].value, message)
            }
        }
    }
    else {
        show_notification('Blacklisted Word', 'Your post contains the word \'' + blackListedWord
            + '\' which is in our blacklisted word list. Sorry, we can not allow this post!', 'error');
    }


}

function show_notification(title, message, type) {
    //console.log(type);
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

function setAppId() {
    appId = $("#appIdInput").val();
    $('#appIdModal').modal('hide');
    fbAsyncInit();
    var url = "http://super-poster.net/?appId=" + appId
    $("#url").attr('href', url).html(url);
    $("#urlContainer").show();

}

function getQSParam(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');

    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

$(document).ready(function () {
    $("#login").removeAttr('disabled');
    appId = getQSParam('appId');
    if (appId) {
        if (window.FB) {
            fbAsyncInit();
        }

        var url = "http://super-poster.net/?appId=" + appId
        $("#url").attr('href', url).html(url)

        $("#appIdButton").hide();
        $("#spam-notice").hide();
    } else {
        $("#urlContainer").hide();
    }
});
