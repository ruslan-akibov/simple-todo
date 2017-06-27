function root() {}

root.prototype.instances = [];

root.prototype.init = function() {
	this.instance = 'root.prototype.instances[' + ( this.instances.push( this ) - 1 ) + ']';
}




function ToDo( params ) {
	this.params = params;
	this.init();

	this.model		= params.model;
	this.model_id	= params.model_id || 'todo-list';
	this._load();

	this.container = document.getElementById( params.container );
	this._markup();
	
	this.paint();
}

ToDo.prototype = Object.create( root.prototype );	// ie8 != happy

ToDo.prototype._load = function() {
	this.data = JSON.parse( this.model[ this.model_id ] || '[]' );
}

ToDo.prototype._store = function() {
	// reverse order
	this.data.sort( function( a, b ) {
		return ( a.name < b.name )? 1 : -1;
	} );

	this.model[ this.model_id ] = JSON.stringify( this.data );
}

ToDo.prototype._control = function( selector ) {
	return document.querySelector( '#' + this.params.container + ' ' + selector );
}


ToDo.prototype._markup = function() {
	this.container.innerHTML =
		'<div class="todo-view">' +
			'<div class="todo-header">' +
				'<button class="add" onclick="' + this.instance + '.add()">Add new</button>' +
			'</div>' +
			'<div class="todo-view-content">' +
			'</div>' +
		'</div>' +
		'<div class="todo-edit">' +
			'<div class="todo-edit-name">' +
				'<input type="text" />' +
			'</div>' +
			'<div class="todo-edit-task">' +
				'<textarea></textarea>' +
			'</div>' +
			'<div class="todo-edit-buttons">' +
				'<button class="cancel" onclick="' + this.instance + '.cancel()">Cancel</button>' +
				'<button class="save" onclick="' + this.instance + '.save()">Save</button>' +
			'</div>' +
		'</div>';

	
	this._controls = {
		view_panel	: this.container.firstChild,
		edit_panel	: this.container.firstChild.nextSibling,
		
		name		: this._control( '.todo-edit-name input' ),
		task		: this._control( '.todo-edit-task textarea' ),
		
		content		: this._control( '.todo-view-content' )
	};
}

ToDo.prototype._editable = function( edit ) {
	this._controls.view_panel.style.display = edit? 'none' : '';
	this._controls.edit_panel.style.display = edit? '' : 'none';
}

ToDo.prototype.paint = function() {
	this._editable( false );

	var list =  this.data;
	
	var html = '';
	for ( var i = 0, i_ln = list.length; i < i_ln; i++ ) {
		html +=
			'<div class="todo-item">' +
				'<div class="todo-item-name">' +
					( list[ i ].done? list[ i ].name : '<a onclick="' + this.instance + '.edit(' + i + ')">' + list[ i ].name + '</a>' ) + 
				'</div>' +
				'<div class="todo-item-controls">' +
					( list[ i ].done? '' : '<button class="mark" onclick="' + this.instance + '.mark(' + i + ')">Mark</button>' ) +
					'<button class="delete" onclick="' + this.instance + '.delete(' + i + ')">Delete</button>' +
				'</div>' +
			'</div>';
	}
	
	this._controls.content.innerHTML = html;	
}

ToDo.prototype.add = function() {
	this.edit( false );
}

ToDo.prototype.edit = function( idx ) {
	this._current = idx;

	if ( idx === false ) {
		this._controls.name.value = '';
		this._controls.task.value = '';
	}
	else {
		this._controls.name.value = this.data[ idx ].name;
		this._controls.task.value = this.data[ idx ].task;	
	}
	
	this._editable( true );
}

ToDo.prototype.cancel = function() {
	this._editable( false );
}

ToDo.prototype.save = function() {
	var obj = {
		name	: this._controls.name.value,
		task	: this._controls.task.value,
		
		done	: false
	};
	
	if ( this._current === false ) {
		this.data.push( obj );
	}
	else {
		this.data[ this._current ] = obj;
	}
		
	this._store();
	this.paint();
}

ToDo.prototype.mark = function( idx ) {
	this.data[ idx ].done = true;
	this._store();
	this.paint();
}

ToDo.prototype.delete = function( idx ) {
	this.data.splice( idx, 1 );
	this._store();
	this.paint();
}


