function initTable(val, result) {
    let container = $("#dataContainer");
    container.empty();
    if (val === "Article") {
        $(document).prop('title', 'Articles');
        $('h1').text('Articles');
        $('#articleBlock').css({"display": ""});
        $('#authorBlock').css({"display": "none"});
        $('#regionBlock').css({"display": "none"});
        let tableData = '<table><thead><th>Id</th><th>Title</th><th>Content</th><th></th></thead>';
        $.each(result, function (index, record) {
            tableData += '<tr data-resource="Article" data-href="/api/v1/article/' + record.id + '/"><td>' + record.id + '</td><td>' + record.title + '</td><td>' + record.content + '</td><td><a href="#" class="edit"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>\n</td></tr>';
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
        createdRow: function (row, data, dataIndex) {
            $(row).addClass('custom-clickable-row');
        }
    });
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
                $('#add_authors').append('<input type="checkbox" id="id_add_authors" value="' + record.id + '"/> ' + record.first_name + '<br />')
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
                $('#add_regions').append('<input type="checkbox" id="id_add_regions" value="' + record.id + '"/> ' + record.name + '<br />')
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
    let regions = $.map($('input[id="id_add_regions"]:checked'), function (c) {
        return c.value;
    })
    let authors = $.map($('input[id="id_add_authors"]:checked'), function (c) {
        return c.value;
    })
    const data = {
        "title": $('#title').val(),
        "content": $('#content').val(),
        "regions": convertArrayToJson(regions),
        "authors": convertArrayToJson(authors)
    }
    setFormLoading(form, true);
    postJSON(form.action, data)
        .then(response => {
            if (response.status === 201) {
                setFormLoading(form, false);
                alert('Successfully saved Article');
                form.reset();
                $(`#addArticleModal`).modal('hide');
                initData('Article', $('#articleLink').attr('href'));
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
    const data = {
        "first_name": $('#first_name').val(),
        "last_name": $('#last_name').val(),
    }
    setFormLoading(form, true);
    postJSON(form.action, data)
        .then(response => {
            if (response.status === 201) {
                setFormLoading(form, false);
                form.reset();
                alert('Successfully saved Author');
                $(`#addAuthorModal`).modal('hide');
                initData('Author', $('#authorLink').attr('href'));
            } else {
                console.log(`Unknown error saving Author: ${response.status} (${response.statusText})`);
            }
        })
        .catch(error => {
            alert(error.toString());
            setFormLoading(form, false);
        });
}

function editAuthor(event) {
    event.preventDefault();
    const form = document.getElementById('editAuthorForm');
    const data = {
        "first_name": $('#id_edit_first_name').val(),
        "last_name": $('#id_edit_last_name').val(),
    }
    setFormLoading(form, true);
    putJSON(form.action, data)
        .then(response => {
            if (response.status === 200) {
                setFormLoading(form, false);
                alert('Successfully edited Author');
                $(`#editAuthorModal`).modal('hide');
                initData('Author', $('#authorLink').attr('href'));
            } else {
                console.log(`Unknown error saving Author: ${response.status} (${response.statusText})`);
            }
        })
        .catch(error => {
            alert(error.toString());
            setFormLoading(form, false);
        });
}

function editArticle(event) {
    event.preventDefault();
    const form = document.getElementById('editArticleForm');
    let regions = $.map($('input[id="id_regions_list"]:checked'), function (c) {
        return c.value;
    })
    let authors = $.map($('input[id="id_authors_list"]:checked'), function (c) {
        return c.value;
    })
    const data = {
        "title": $('#id_edit_title').val(),
        "content": $('#id_edit_content').val(),
        "regions": convertArrayToJson(regions),
        "authors": convertArrayToJson(authors)
    }
    setFormLoading(form, true);
    putJSON(form.action, data)
        .then(response => {
            if (response.status === 200) {
                setFormLoading(form, false);
                alert('Successfully edited Article');
                $(`#editArticleModal`).modal('hide');
                initData('Article', $('#articleLink').attr('href'));
            } else {
                console.log(`Unknown error saving Article: ${response.status} (${response.statusText})`);
            }
        })
        .catch(error => {
            alert(error.toString());
            setFormLoading(form, false);
        });
}

function editRegion(event) {
    event.preventDefault();
    const form = document.getElementById('editRegionForm');
    const data = {
        "code": $('#id_edit_code').val(),
        "name": $('#id_edit_name').val(),
    }
    setFormLoading(form, true);
    putJSON(form.action, data)
        .then(response => {
            if (response.status === 200) {
                setFormLoading(form, false);
                alert('Successfully edited Region');
                $(`#editRegionModal`).modal('hide');
                initData('Region', $('#regionLink').attr('href'));
            } else {
                console.log(`Unknown error saving Region: ${response.status} (${response.statusText})`);
            }
        })
        .catch(error => {
            alert(error.toString());
            setFormLoading(form, false);
        });
}

function deleteArticle(event) {
    event.preventDefault();
    const form = document.getElementById('editArticleForm');
    setFormLoading(form, true);
    deleteresource(form.action)
        .then(response => {
            if (response.status === 200) {
                alert('Successfully deleted Article');
                setFormLoading(form, false);
                $('#editArticleModal').modal('hide');
                initData('Article', $('#articleLink').attr('href'));
            } else {
                alert(`Error deleting article: ${response.status} ${response.statusText}`);
            }
        })
        .catch(error => {
            alert(error.toString());
        });
}

function deleteRegion(event) {
    event.preventDefault();
    const form = document.getElementById('editRegionForm');
    setFormLoading(form, true);
    deleteresource(form.action)
        .then(response => {
            if (response.status === 200) {
                alert('Successfully deleted Region');
                setFormLoading(form, false);
                $('#editRegionModal').modal('hide');
                initData('Region', $('#regionLink').attr('href'));
            } else {
                alert(`Error deleting region: ${response.status} ${response.statusText}`);
            }
        })
        .catch(error => {
            alert(error.toString());
        });
}

function deleteAuthor(event) {
    event.preventDefault();
    const form = document.getElementById('editAuthorForm');
    setFormLoading(form, true);
    deleteresource(form.action)
        .then(response => {
            if (response.status === 200) {
                alert('Successfully deleted Author');
                setFormLoading(form, false);
                $('#editAuthorModal').modal('hide');
                initData('Author', $('#authorLink').attr('href'));
            } else {
                alert(`Error deleting author: ${response.status} ${response.statusText}`);
            }
        })
        .catch(error => {
            alert(error.toString());
        });
}

function initArticle() {
    const url = $('#editArticleForm').attr("action");
    getJSON(url)
        .then(response => {
            $('#id_edit_title').val(response.title);
            $('#id_edit_content').val(response.content);
            $('#authors_list').empty();
            $('#regions_list').empty();
            let authors = response.authors;
            for (let i = 0; i < authors.length; i++) {
                $('#authors_list').append('<input type="checkbox" checked id="id_authors_list" value="' + authors[i].id + '"/> ' + authors[i].first_name + '<br />');
            }
            let regions = response.regions;
            for (let i = 0; i < regions.length; i++) {
                $('#regions_list').append('<input type="checkbox" checked id="id_regions_list" value="' + regions[i].id + '"/> ' + regions[i].name + '<br />');
            }
        })
        .catch(error => {
            alert(error.toString());
        });

}

function initAuthor() {
    const url = $('#editAuthorForm').attr("action");
    getJSON(url)
        .then(response => {
            $('#id_edit_first_name').val(response.first_name);
            $('#id_edit_last_name').val(response.last_name);
        })
        .catch(error => {
            alert(error.toString());
        });

}

function initRegion() {
    const url = $('#editRegionForm').attr("action");
    getJSON(url)
        .then(response => {
            $('#id_edit_code').val(response.code);
            $('#id_edit_name').val(response.name);
        })
        .catch(error => {
            alert(error.toString());
        });

}

function submitRegion(event) {
    event.preventDefault();
    const form = document.getElementById('addRegionForm');
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
                form.reset();
                $(`#addRegionModal`).modal('hide');
                initData('Region', $('#regionLink').attr('href'));
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
    const addArticleForm = document.getElementById('addArticleForm');
    addArticleForm.addEventListener('submit', submitArticle);
}

function initSubmitAuthor() {
    const addAuthorForm = document.getElementById('addAuthorForm');
    addAuthorForm.addEventListener('submit', submitAuthor);
}

function initSubmitRegion() {
    const addRegionForm = document.getElementById('addRegionForm');
    addRegionForm.addEventListener('submit', submitRegion);
}

function initEditArticle() {
    const editArticleBtn = document.getElementById('editArticleBtn');
    editArticleBtn.addEventListener('click', editArticle);
}

function initEditAuthor() {
    const editAuthorBtn = document.getElementById('editAuthorBtn');
    editAuthorBtn.addEventListener('click', editAuthor);
}

function initEditRegion() {
    const editRegionBtn = document.getElementById('editRegionBtn');
    editRegionBtn.addEventListener('click', editRegion);
}

function initDeleteArticle() {
    const deleteArticleBtn = document.getElementById('deleteArticleBtn');
    deleteArticleBtn.addEventListener('click', deleteArticle);
}

function initDeleteAuthor() {
    const deleteAuthorBtn = document.getElementById('deleteAuthorBtn');
    deleteAuthorBtn.addEventListener('click', deleteAuthor);
}

function initDeleteRegion() {
    const deleteRegionBtn = document.getElementById('deleteRegionBtn');
    deleteRegionBtn.addEventListener('click', deleteRegion);
}

function initDataTableRowClick() {
    $(document).on('click', '.custom-clickable-row', function (e) {
        let url = $(this).data('href');
        let resource = $(this).data('resource');
        $(`#edit${resource}Modal`).modal('show');
        $(`#edit${resource}Form`).attr('action', url)
    });
}

function initOnOpenModal() {
    $(document).on('shown.bs.modal', '#editArticleModal', function (e) {
        initArticle();
    });
    $(document).on('shown.bs.modal', '#editAuthorModal', function (e) {
        initAuthor();
    });
    $(document).on('shown.bs.modal', '#editRegionModal', function (e) {
        initRegion();
    });

}

$(document).ready(function () {
    initData($('#articleLink').text(), $('#articleLink').attr('href'));
    initOnClickNavItem();
    initSubmitArticle();
    initSubmitAuthor();
    initSubmitRegion();
    initEditArticle();
    initEditAuthor();
    initEditRegion();
    initDeleteArticle();
    initDeleteAuthor();
    initDeleteRegion();
    initAuthors();
    initRegions();
    initDataTableRowClick();
    initOnOpenModal();
});
