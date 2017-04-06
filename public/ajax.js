$(".edit-item-form").hide();
$("#todo-list").on('click', '.edit-item-btn', function(){
	$(this).parent().siblings('.edit-item-form').slideToggle();
})

$('#new').submit(function(e){
	e.preventDefault();
	var todoItem = $(this).serialize();
	$.post("/new", todoItem, function(data){
		$('#todo-list').append(
		`
			<div class="list-group-item pull-left" style="margin-top: 5px; width: 100%;">
            <!-- Show Item -->
                <p style="width: 70%; float: left">${data.todo}</p>
                <div style="float: left">
                    <form class="form-delete" style="display: inline;" action="/${data._id}/delete" method="POST">
                        <button class="btn btn-danger btn-sm pull-right" style="margin: 0;">Delete</button>
                    </form>
                    <button class="btn btn-warning btn-sm pull-right edit-item-btn" style="margin: 0; margin-right: 4px">Edit</button>
                </div>
            <!-- Edit Item From -->
                <form action="/${data._id}/edit" method="POST" class="edit-item-form">
                    <div class="form-group">
                        <label for="edit-todo">Edit ${data.todo}</lable>
                        <input id="edit-todo" class="form-control" type="text" name="todo" value="${data.todo}">
                    </div>
                    <button class="btn btn-primary btn-sm">Update</button>
                </form>
            </div>      
		`	
		)
		$('#new').find('.new').val('');
		$('.edit-item-form').hide();
	});
});

$('#todo-list').on('submit', '.edit-item-form', function(e){
	e.preventDefault();
	var formData = $(this).serialize();
	var formAction = $(this).attr('action');
	$originalItem = $(this).closest('.list-group-item');
	$.ajax({
		url: formAction,
		data: formData,
		type: 'PUT',
		originalItem: $originalItem,
		success: function(data){
			this.originalItem.html(
				`
				<p style="width: 70%; float: left">${data.todo}</p>
                <div style="float: left">
                    <form class="form-delete" style="display: inline;" action="/${data._id}/delete" method="POST">
                        <button class="btn btn-danger btn-sm pull-right" style="margin: 0;">Delete</button>
                    </form>
                    <button class="btn btn-warning btn-sm pull-right edit-item-btn" style="margin: 0; margin-right: 4px">Edit</button>
                </div>

                <form action="/${data._id}/edit" method="POST" class="edit-item-form">
                    <div class="form-group">
                        <label for="edit-todo">Edit ${data.todo}</lable>
                        <input id="edit-todo" class="form-control" type="text" name="todo" value="${data.todo}">
                    </div>
                    <button class="btn btn-primary btn-sm">Update</button>
                </form>
				`
			);
			$('.edit-item-form').hide();
		}
	});
});

$('#todo-list').on('submit', '.form-delete', function(e){
	e.preventDefault();
	var comfirmResponse = confirm('Are you sure?');
	if(comfirmResponse){
		var formActionUrl = $(this).attr('action');
		var itemToDelete = $(this).parent().parent('.list-group-item');
		$.ajax({
			url: formActionUrl,
			itemToDelete: itemToDelete,
			type: 'DELETE',
			success: function(data){
				itemToDelete.remove();
			}
		});
	} else {
		$(this).find('button').blur();
	}
});

//search function
$('#search').on('submit', function(e){
	e.preventDefault();
	var searchKeyword = $(this).children('.form-group').children('input').val();
	$.ajax({
		url: '/?keyword=' + searchKeyword,
		type: 'GET',
		success: function(data){
			debugger;
			$('#todo-list').html('');
			data.forEach(function(todo){
				$('#todo-list').append(
				`
					<div class="list-group-item pull-left" style="margin-top: 5px; width: 100%;">
		            <!-- Show Item -->
		                <p style="width: 70%; float: left">${todo.todo}</p>
		                <div style="float: left">
		                    <form class="form-delete" style="display: inline;" action="/${todo._id}/delete" method="POST">
		                        <button class="btn btn-danger btn-sm pull-right" style="margin: 0;">Delete</button>
		                    </form>
		                    <button class="btn btn-warning btn-sm pull-right edit-item-btn" style="margin: 0; margin-right: 4px">Edit</button>
		                </div>
		            <!-- Edit Item From -->
		                <form action="/${todo._id}/edit" method="POST" class="edit-item-form">
		                    <div class="form-group">
		                        <label for="edit-todo">Edit ${todo.todo}</lable>
		                        <input id="edit-todo" class="form-control" type="text" name="todo" value="${todo.todo}">
		                    </div>
		                    <button class="btn btn-primary btn-sm">Update</button>
		                </form>
		            </div>         
				`
				)
			});

		}
	});
});