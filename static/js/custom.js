function initTable(val, result) {
    let container = $("#dataContainer");
    container.empty();
    if (val === "Article") {
        $(document).prop('title', 'Articles');
        $('h1').text('Articles');
        $('#articleBlock').css({"display": ""});
        $('#authorBlock').css({"display": "none"});
        $('#regionBlock').css({"display": "none"});
        let tableData = '<table><thead><th>Id</th><th>Title</th><th>Content</th><th>Regions</th><th>Authors</th></thead>';
        $.each(result, function (index, record) {
            tableData += '<tr data-resource="Article" data-href="/api/v1/article/' + record.id + '/"><td>' + record.id + '</td><td>' + record.title + '</td><td>' + record.content + '</td><td>' + record.regions + '</td><td>' + record.authors + '</td></tr>';
        });
        container.append(tableData);
    }
    if (val === "Author") {
        $(document).prop('title', 'Authors');
        $('h1').text('Authors');
        $('#regionBlock').css({"display": "none"});
        $('#articleBlock').css("display", "none");
        $('#authorBlock').css("display", "");
        let tableData = '<table><thead><th>Id</th><th>First Name</th><th>Last Name</th></thead>';
        $.each(result, function (index, record) {
            tableData += '<tr data-resource="Author" data-href="/api/v1/author/' + record.id + '/"><td>' + record.id + '</td><td>' + record.first_name + '</td><td>' + record.last_name + '</td></>';
        });
        container.append(tableData);

    }
    if (val === "Region") {
        $('#regionBlock').css({"display": ""});
        $('#articleBlock').css("display", "none");
        $('#authorBlock').css("display", "none");
        $(document).prop('title', 'Regions');
        $('h1').text('Regions');
        let tableData = '<table><thead><th>Id</th><th>Code</th><th>Name</th></thead>';
        $.each(result, function (index, record) {
            tableData += '<tr data-resource="Region" data-href="/api/v1/region/' + record.id + '/"><td>' + record.id + '</td><td>' + record.code + '</td><td>' + record.name + '</td></tr>';
        });
        container.append(tableData);
    }

    $('#dataContainer table').addClass("table table-striped table-hover").dataTable({
        "bLengthChange": false,
    });
    $('#dataContainer table tr').addClass("custom-clickable-row")
}

function initOnClickNavItem() {
    $('#articleLink,#authorLink,#regionLink',).click(function (e) {
        e.preventDefault();
        const url = $(this).attr('href');
        const text = $(this).text();
        initData(text, url);
    })
}

function initData(text, url) {
    getJSON(url)
        .then(response => {
            initTable(text, response);
        })
        .catch(error => {
            alert(error.toString());
        });
}


function initAuthors() {
    getJSON('/api/v1/authors/')
        .then(response => {
            $.each(response, function (index, record) {
                $('#authors').append(
                    $('<option />')
                        .text(record.first_name)
                        .val(record.id)
                );
            });
        })
        .catch(error => {
            alert(error.toString());
        });
}

function initRegions() {
    getJSON('/api/v1/regions/')
        .then(response => {
            $.each(response, function (index, record) {
                console.log(response);
                $('#regions').append(
                    $('<option />')
                        .text(record.name)
                        .val(record.id)
                );
            });

        })
        .catch(error => {
            alert(error.toString());
        });
}

function submitArticle(event) {
    event.preventDefault();
    const form = document.getElementById('addArticleForm');
    const buttonClicked = event.target;
    buttonClicked.setAttribute('disabled', 'disabled');
    const data = {
        "title": $('#title').val(),
        "content": $('#content').val(),
        "regions": convertArrayToJson($('#regions').val()),
        "authors": convertArrayToJson($('#authors').val())
    }
    setFormLoading(form, true);
    postJSON(form.action, data)
        .then(response => {
            if (response.status === 201) {
                setFormLoading(form, false);
                alert('Successfully saved Article');
                window.location.href = '';
            } else {
                console.log(`Unknown error saving Article: ${response.status} (${response.statusText})`);
            }
        })
        .catch(error => {
            alert(error.toString());
            setFormLoading(form, false);
        });
}

function submitAuthor(event) {
    event.preventDefault();
    const form = document.getElementById('addAuthorForm');
    const buttonClicked = event.target;
    buttonClicked.setAttribute('disabled', 'disabled');
    const data = {
        "first_name": $('#first_name').val(),
        "last_name": $('#last_name').val(),
    }
    setFormLoading(form, true);
    postJSON(form.action, data)
        .then(response => {
            if (response.status === 201) {
                setFormLoading(form, false);
                alert('Successfully saved Author');
                window.location.href = '';
            } else {
                console.log(`Unknown error saving Author: ${response.status} (${response.statusText})`);
            }
        })
        .catch(error => {
            alert(error.toString());
            setFormLoading(form, false);
        });
}

function initArticle() {
    const url = $('#editArticleModal').attr("data-target");
    getJSON(url)
        .then(response => {
          $('#id_edit_title').val(response.title);
          $('#id_edit_content').val(response.content);
        })
        .catch(error => {
            alert(error.toString());
        });

}

function submitRegion(event) {
    event.preventDefault();
    const form = document.getElementById('addRegionForm');
    const buttonClicked = event.target;
    buttonClicked.setAttribute('disabled', 'disabled');
    const data = {
        "code": $('#code').val(),
        "name": $('#name').val(),
    }
    setFormLoading(form, true);
    postJSON(form.action, data)
        .then(response => {
            if (response.status === 201) {
                setFormLoading(form, false);
                alert('Successfully saved Region');
                window.location.href = '';
            } else {
                console.log(`Unknown error saving Region: ${response.status} (${response.statusText})`);
            }
        })
        .catch(error => {
            alert(error.toString());
            setFormLoading(form, false);
        });
}


function initSubmitArticle() {
    const addArticleBtn = document.getElementById('addArticleBtn');
    addArticleBtn.addEventListener('click', submitArticle);
}

function initSubmitAuthor() {
    const addAuthorBtn = document.getElementById('addAuthorBtn');
    addAuthorBtn.addEventListener('click', submitAuthor);
}

function initSubmitRegion() {
    const addRegionBtn = document.getElementById('addRegionBtn');
    addRegionBtn.addEventListener('click', submitRegion);
}

function initDataTableRowClick() {
    $(document).on('click', '.custom-clickable-row', function (e) {
        let url = $(this).data('href');
        let resource = $(this).data('resource');
        $(`#edit${resource}Modal`).modal('show');
        $(`#edit${resource}Modal`).attr('data-target', url)
    });
}

function initOnOpenModal() {
    $(document).on('shown.bs.modal', '#editArticleModal', function (e) {
        initArticle();
    });

}

$(document).ready(function () {
    initData('Article', $('#articleLink').attr('href'))
    initOnClickNavItem();
    initSubmitArticle();
    initSubmitAuthor();
    initSubmitRegion();
    initAuthors();
    initRegions();
    initDataTableRowClick();
    initOnOpenModal();
});
