




var Boxes;


var InitBoxes;


var BoxState;


var NONE   = 0;
var CENTER = 1;
var TL     = 2;
var BL     = 3;
var TR     = 4;
var BR     = 5;
var LSIDE  = 6;
var RSIDE  = 7;
var TSIDE  = 8;
var BSIDE  = 9;





function BoxGetElementPosition (id)
{
    e = document.getElementById(id);

    var left = 0;
    var top  = 0;
    
    while (e.offsetParent){
	left += e.offsetLeft;
	top  += e.offsetTop;
	e     = e.offsetParent;
    }
    
    left += e.offsetLeft;
    top  += e.offsetTop;

    

    return {x:left, y:top};
}


function BoxMouseCoords (ev) 
{
    
    if (ev.pageX || ev.pageY){
	return {x:ev.pageX, y:ev.pageY};
    }
    
    return {
	x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
	y:ev.clientY + document.body.scrollTop  - document.body.clientTop
    };
}


function BoxMouseMove (event) 
{
    
    if (!BoxState.dragging) return;

    event = event || window.event;
    
    var mousePos = BoxMouseCoords (event);
    var x = mousePos.x;
    var y = mousePos.y;

    var keep_size = false;

    
    x -= BoxState.bound_left;
    y -= BoxState.bound_top;

    var box = Boxes[BoxState.cur_box];

    if (BoxState.starting_new) {
	
	if (x - BoxState.start_x >= 4  &&
	    y - BoxState.start_y >= 4) {
	    BoxState.starting_new = false;
	    box.left   = BoxState.start_x;
	    box.top    = BoxState.start_y;
	    box.width  = 0;
	    box.height = 0;
	}
	else return;
    }

    
    switch (BoxState.cur_piece) {
	case NONE:
	    
	    box.width  = x - box.left;
	    box.height = y - box.top;
	    break;
	case CENTER:
	    box.left = x - box.width/2;
	    box.top  = y - box.height/2;
	    keep_size = true;
	    break;
	case TL:
	    box.width -= (x - box.left);
	    box.height -= (y - box.top);
	    box.left = x;
	    box.top = y;
	    break;
	case TR:
	    box.width = (x - box.left);
	    box.height -= (y - box.top);
	    box.top = y;
	    break;
	case TSIDE:
	    box.height -= (y - box.top);
	    box.top = y;
	    break;
	case BSIDE:
	    box.height += 
		(y - box.top - box.height);
	    break;
	case RSIDE:
	    box.width = (x - box.left);
	    break;
	case LSIDE:
	    box.width -= (x - box.left);
	    box.left = x;
	    break;
	case BR:
	    box.height += 
		(y - box.top - box.height);
	    box.width = (x - box.left);
	    break;
	case BL:
	    box.height += 
		(y - box.top - box.height);
	    box.width -= (x - box.left);
	    box.left = x;
	    break;
    }

    
    if (box.height < BoxState.min_height) box.height = BoxState.min_height;
    if (box.width < BoxState.min_width) box.width = BoxState.min_width;


    
    if (box.left < 0) box.left = 0;
    if (box.top < 0) box.top = 0;

    

    
    if (box.left + box.width >= BoxState.bound_width) {
	if (keep_size) {
	    
	    box.left = BoxState.bound_width - box.width;
	}
	else {
	    
	    box.width = BoxState.bound_width - box.left;
	}
    }
    
    if (box.top + box.height >= BoxState.bound_height) {
	if (keep_size) {
	    
	    box.top = BoxState.bound_height - box.height;
	}
	else {
	    
	    box.height = BoxState.bound_height - box.top;
	}
    }

    DrawBoxes ();
}


function BoxMouseDown (event)
{
    event = event || window.event;

    var mousePos = BoxMouseCoords (event);
    var x = mousePos.x;
    var y = mousePos.y;

    
    x -= BoxState.bound_left;
    y -= BoxState.bound_top;

    if (BoxState.multi) {
	
	for (i = 0; i < Boxes.length; i++) {
	    if (BoxContains (Boxes[i], x, y)) {
		BoxState.dragging = true;
		BoxState.cur_box = i;
		return;
	    }
	}
    }
    else {
	var box = Boxes[BoxState.cur_box];
	
	if (BoxContains (box, x, y)) {
	    BoxState.dragging = true;
	}
	else {
	    
	    BoxState.cur_piece = NONE;
	    BoxState.starting_new = true;
	    BoxState.start_x = x;
	    BoxState.start_y = y;
	    BoxState.dragging = true;
	}
    }
}


function BoxMouseUp (event)
{
    var was_dragging = BoxState.dragging;

    event = event || window.event;

    
    BoxState.dragging = false;

    
    BoxState.starting_new = false;

    if (was_dragging)
	BoxUpdated (BoxState.cur_box);

    var mousePos = BoxMouseCoords (event);
    var x = mousePos.x;
    var y = mousePos.y;

    
    mousePos.x -= BoxState.bound_left;
    mousePos.y -= BoxState.bound_top;

    BoxMouseReleasedAt (event, mousePos);
}


function BoxContains (box, x, y)
{
    
    if (x >= box.left &&
	x <= (box.left + box.width) &&
	y >= box.top &&
	y <= (box.top + box.height)) {
	
	
	var small_dim = Math.min (box.width, box.height);
	var radius = Math.max (BoxState.handle_radius, small_dim/6);

	
	var nearLeft = (x-box.left < radius);
	var nearRight = 
	    ((box.left + box.width) - x < radius);
	var nearTop = (y-(box.top) < radius);
	var nearBottom = 
	    ((box.top + box.height) - y < radius);

	if (BoxState.br_only) {
	    if (box.sizeable == false)        BoxState.cur_piece = CENTER;
	    if (nearRight && nearBottom)      BoxState.cur_piece = BR;
	    else                              BoxState.cur_piece = CENTER;
	}
	else {
	    if (box.sizeable == false)        BoxState.cur_piece = CENTER;
	    else if (nearLeft && nearTop)     BoxState.cur_piece = TL;
	    else if (nearLeft && nearBottom)  BoxState.cur_piece = BL;
	    else if (nearRight && nearTop)    BoxState.cur_piece = TR;
	    else if (nearRight && nearBottom) BoxState.cur_piece = BR;
	    else if (nearLeft)                BoxState.cur_piece = LSIDE;
	    else if (nearRight)               BoxState.cur_piece = RSIDE;
	    else if (nearTop)                 BoxState.cur_piece = TSIDE;
	    else if (nearBottom)              BoxState.cur_piece = BSIDE;
	    else                              BoxState.cur_piece = CENTER;
	}
	return true;
    }
    return false;
}


function BoxMouseReleasedAt (event, pos)
{
}


function BoxUpdated (box)
{
}


function DrawRect (color, 
		   x,     
		   y,     
		   width, 
		   height 
    )
{
    
    var color_gif = '1pix' + color + '.gif';
    var out = '<img src="' + color_gif + '" width=' + width + 
	' height=' + height + ' style="position: absolute; left: ' + x + 
	'px; top: ' + y + 'px; z-index: 3" onmouseup="BoxMouseUp()" onmousedown="BoxMouseDown()" onmousemove="BoxMouseMove()">';
    return out;
}


function DrawBox (box)
{
    var out = "";
    var tx, ty;
    var width = box.width;
    var height = box.height;
    var color;
    var top, left;

    
    if (width <= 0 || height <= 0) return out;

    if (box.hilight) color = box.hcolor;
    else color = box.color;

    top = box.top;
    left = box.left;

    
    

    tx = left + BoxState.bound_left;
    ty = top + BoxState.bound_top;

    
    out += DrawRect (color, tx, ty, width, 1);
    
    out += DrawRect (color, tx, ty, 1, height);

    
    ty  = top + BoxState.bound_top + height;
    out += DrawRect (color, tx, ty, width, 1);

    
    ty = top + BoxState.bound_top;
    tx = left + BoxState.bound_left + width;
    out += DrawRect (color, tx, ty, 1, height);

    
    if (box.sizeable || BoxState.multi) {
	var handle_size = BoxState.handle_radius;
	tx = left + BoxState.bound_left;
	ty = top + BoxState.bound_top;
	
	out += DrawRect (color, (tx + width)-handle_size,
			 (ty + height)-handle_size,
			 handle_size, handle_size);
	if (BoxState.br_only == false) {
	    
	    out += DrawRect (color, tx, ty, handle_size, handle_size);
	    
	    out += DrawRect (color, (tx + width)-handle_size, ty, handle_size,
			     handle_size);
	    
	    out += DrawRect (color, tx, (ty + height)-handle_size,
			     handle_size, handle_size);
	    
	    out += DrawRect (color, tx + (width-handle_size)/2,
			     ty, handle_size,
			     handle_size);
	    
	    out += DrawRect (color, tx,
			     ty + (height-handle_size)/2,
			 handle_size, handle_size);
	    
	    out += DrawRect (color, tx + (width-handle_size),
			     ty + (height-handle_size)/2,
			     handle_size, handle_size);
	    
	    out += DrawRect (color, tx + (width-handle_size)/2,
			     ty + (height-handle_size),
			     handle_size, handle_size);
	}
    }

    return out;
}

function DrawBoxes ()
{
    var out = "";

    if (!Boxes) return;
    for (i = 0; i < Boxes.length; i++) {
	if (Boxes[i].visible)
	    out += DrawBox (Boxes[i]);
    }
    
    document.getElementById(BoxState.box_id).innerHTML = out;
}


function Box (left, top, width, height)
{
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.sizeable = false;
    this.color = 'blue';
    this.visible = true;
    this.hcolor = 'blue';
    this.hilight = false;
}

function BoxSetColor (index)
{
    Boxes[index].color = index;
}

function BoxSetCur (index)
{
    if (!BoxState) return;
    Boxes[BoxState.cur_box].sizeable = false;
    BoxState.cur_box = index;
    Boxes[BoxState.cur_box].sizeable = true;
}

function BoxGetCur ()
{
     if (!BoxState) return 0;
     return BoxState.cur_box;
}


function BoxInit (bound_id,      
		  box_id,        
		  bound_width,   
		  bound_height,  
		  num_boxes,     
		  selected,      
		  dsfactor       
    )
{
    
    
    var IE = document.all?true:false;
    
    BoxState = new Object ();
    BoxState.IE            = IE;
    BoxState.handle_radius = 6;
    BoxState.min_width     = 15;
    BoxState.min_height    = 15;

    var bound_pos = BoxGetElementPosition (bound_id);

    BoxState.bound_left    = bound_pos.x;
    BoxState.bound_top     = bound_pos.y;
    BoxState.bound_width   = bound_width;
    BoxState.bound_height  = bound_height;
    BoxState.bound_right   = BoxState.bound_left + BoxState.bound_width;
    BoxState.bound_bottom  = BoxState.bound_top + BoxState.bound_height;
    BoxState.box_id        = box_id;
    BoxState.bound_id      = bound_id;
    BoxState.cur_box       = selected;
    BoxState.dragging      = false;
    BoxState.ds_factor     = dsfactor;
    BoxState.x_shift       = 0;
    BoxState.y_shift       = 0;
    BoxState.img_left      = 0;
    BoxState.img_top       = 0;
    BoxState.br_only       = false;
    BoxState.multi         = false; 

    Boxes = new Array (num_boxes);
    InitBoxes = new Array (num_boxes);
    for (i = 0; i < num_boxes; i++) {
	Boxes[i] = new Box (0, 0, 0, 0);
	InitBoxes[i] = new Box (0, 0, 0, 0);
    }
    BoxSetCur (selected);

    if (window.Event) { 
	document.captureEvents(Event.MOUSEUP);
	document.captureEvents(Event.MOUSEDOWN);
	document.captureEvents(Event.MOUSEMOVE);
    }

    var obj = document.getElementById (bound_id);
    obj.onmouseup   = BoxMouseUp;
    obj.onmousedown = BoxMouseDown;
    obj.onmousemove = BoxMouseMove;
}

function BoxSetDim (index, x, y, w, h)
{
    BoxSetX (index, x);
    BoxSetY (index, y);
    BoxSetW (index, w);
    BoxSetH (index, h);
}

function BoxSetX (index, x)
{
    InitBoxes[index].left = x;

    Boxes[index].left = (x - BoxState.x_shift)/BoxState.ds_factor;
}

function BoxSetY (index, y)
{
    InitBoxes[index].top  = y;

    Boxes[index].top = (y - BoxState.y_shift)/BoxState.ds_factor;
}

function BoxSetW (index, w)
{
    InitBoxes[index].width = w;
    Boxes[index].width = w/BoxState.ds_factor;
}

function BoxSetH (index, h)
{
    InitBoxes[index].height = h;
    Boxes[index].height = h/BoxState.ds_factor;
}

function BoxGetDim (index)
{
    if (index < 0 || index >= Boxes.length) {
	return -1;
    }
    
    var box = Boxes[index];
    var init = InitBoxes[index];
    var ds_factor = BoxState.ds_factor;

    x = Math.round((ds_factor * box.left + BoxState.x_shift));
    if (Math.abs(x - init.left) < ds_factor) x = init.left;

    y = Math.round((ds_factor * box.top + BoxState.y_shift));
    if (Math.abs(y - init.top) < ds_factor) y = init.top;

    w = Math.round((ds_factor * box.width));
    if (Math.abs(w - init.width) < ds_factor) w = init.width;

    h = Math.round((ds_factor * box.height));
    if (Math.abs(h - init.height) < ds_factor) h = init.height;

    return {left:x, top:y, width:w, height:h};
}

function BoxSetColor (index, color)
{
    Boxes[index].color = color;
}

function BoxSetHcolor (index, color)
{
    Boxes[index].hcolor = color;
}

function BoxSetVisible (index, visible)
{
    Boxes[index].visible = visible;
}

function BoxHilight (index, hilight)
{
    Boxes[index].hilight = hilight;
}

function BoxHilighted (index)
{
    return Boxes[index].hilight;
}

function BoxSetXshift (shift)
{
     BoxState.x_shift = shift;
}

function BoxSetYshift (shift)
{
     BoxState.y_shift = shift;
}


function BoxSetBROnly (val)
{
     BoxState.br_only = val;
}


function BoxSetMulti (val)
{
    BoxState.multi = val;
}
