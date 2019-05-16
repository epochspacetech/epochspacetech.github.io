// cet-app
// Created May 16, 2019

/* ***********************************************************************************************/
/* BEGIN CONSTANTS *******************************************************************************/
/* ***********************************************************************************************/

// Update rate in milliseconds (denominator is frames per second (fps)).
const UPDATE_RATE = 1000/30; // 30 fps

// Keyboard input codes for easy reference.
const CODE_A = 65;
const CODE_B = 66;
const CODE_D = 68;
const CODE_F = 70;
const CODE_J = 74;
const CODE_K = 75;
const CODE_L = 76;
const CODE_M = 77;
const CODE_N = 78;
const CODE_P = 80;
const CODE_S = 83;
const CODE_W = 87;
const CODE_Z = 90;
const CODE_SPACE = 32;
const CODE_LARROW = 37;
const CODE_UARROW = 38;
const CODE_RARROW = 39;
const CODE_DARROW = 40;
const MOUSE_L = 0;
const MOUSE_M = 1;
const MOUSE_R = 2;

var BACKEND_IP = "127.0.0.1";
var BACKEND_PORT = "5202";

var SELECTIONPANEL_WIDTH_PC = 0.27;
var SELECTIONPANEL_BUTTON_HEIGHT = 60;

var INFOPANEL_BACKGROUND_COLOR = "#242429";
var INFOPANEL_HEIGHT_PC = 0.3;

var PANEL_BACKGROUND_COLOR = "#2a2a30";
var PANEL_BORDER_COLOR = "#5c5c66";
var PANEL_BORDER_THICKNESS = 4;
var PANEL_TEXT_COLOR = "#f0f0ff";
var PANEL_HOVER_COLOR = "#383840";

var MAIN_BACKGROUND_COLOR = "#1a1a20";

var BORDERS = true;

/* ***********************************************************************************************/
/* END CONSTANTS *********************************************************************************/
/* ***********************************************************************************************/

/* ***********************************************************************************************/
/* BEGIN CLASSES *********************************************************************************/
/* ***********************************************************************************************/

/* 2D Vector class */
class V2 { constructor(x, y) { this.x = x; this.y = y; } }

/*
SelectionPanel is an object that handles
*/
class SelectionPanel
{
    constructor()
    {
        this.size = new V2(0, 0);

        this.color = PANEL_BACKGROUND_COLOR;

        this.buttons = [];
        this.selected_button = 0;

        let ychunk = SELECTIONPANEL_BUTTON_HEIGHT;
        this.buttons.push(new SelectionButton(0, 0, this.size.x, ychunk, "Overview", true));
        this.buttons.push(new SelectionButton(0, ychunk * 1, this.size.x, ychunk, "Structure"));
        this.buttons.push(new SelectionButton(0, ychunk * 2, this.size.x, ychunk, "Photovoltaics"));
        this.buttons.push(new SelectionButton(0, ychunk * 3, this.size.x, ychunk, "Electronics"));

        this.exitbutton = new SelectionButton(0, canvas.height - ychunk, this.size.x, ychunk,
                                              "Exit");
                                              
        this.updateSize();
    }

    /*
    When the screen is resized, this object will need to adjust accordingly. Global variables are
    used in this function (canvas).
    */
    updateSize()
    {
        this.size.x = canvas.width * SELECTIONPANEL_WIDTH_PC;
        this.size.y = canvas.height;

        if (this.buttons)
        {
            for (let i = 0; i < this.buttons.length; i++)
            {
                this.buttons[i].pos.y = SELECTIONPANEL_BUTTON_HEIGHT * i;
                this.buttons[i].size.x = this.size.x;
            }
        }

        this.exitbutton.pos.y = canvas.height - SELECTIONPANEL_BUTTON_HEIGHT;
        this.exitbutton.size.x = this.size.x;
    }

    /*
    Given a 2d Vector to check for click on this entity and sub-entites.

    @param c: V2 of click location
    */
    click(c)
    {
        if (c.x > this.size.x){ return; }

        if (this.exitbutton.click(c))
        {
            let response = confirm("You will lose unsaved changes!");
            if (response)
            {
                window.location.href = "http://epochspacetech.com";
            }
            this.exitbutton.selected = false;
        }

        let clickcollider = -1;
        for (let i = 0; i < this.buttons.length; i++)
        {
            if (this.buttons[i].click(c))
            {
                clickcollider = i;
            }
        }

        if (clickcollider != -1)
        {
            for (let i = 0; i < this.buttons.length; i++)
            {
                if (i != clickcollider)
                {
                    this.buttons[i].selected = false;
                }
            }

            this.selected_button = clickcollider;
        }
    }

    /*
    Given a 2d vector to check for hover on this entity and sub-entities.

    @param c: V2 of mouse location
    */
    hover(c)
    {
        for (let i = 0; i < this.buttons.length; i++)
        {
            this.buttons[i].hover(c);
        }

        this.exitbutton.hover(c);
    }

    draw()
    {
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.size.x, this.size.y);

        for (let i = 0; i < this.buttons.length; i++)
        {
            this.buttons[i].draw();
        }

        this.exitbutton.draw();

        if (BORDERS)
        {
            ctx.fillStyle = PANEL_BORDER_COLOR;
            ctx.fillRect(this.size.x-PANEL_BORDER_THICKNESS, 0, 
                         PANEL_BORDER_THICKNESS, this.size.y);
        }
    }
}

class SelectionButton
{
    constructor(x, y, w, h, text, sel=false)
    {
        this.pos = new V2(x, y);
        this.size = new V2(w, h);
        this.color = PANEL_TEXT_COLOR;
        this.text = text;
        this.selected = sel;
        this.hovered = false;
    }

    /*
    Function to handle clicks for this object.

    @param c: V2 representing the click location
    @return bool: true if click is contained in this, else false
    */
    click(c)
    {
        if (c.x > this.pos.x + this.size.x || c.y < this.pos.y || c.y > this.pos.y + this.size.y)
        {
            return false;
        }

        this.selected = true;

        return true;
    }
    
    /*
    Given a 2d vector to check for hover on this entity and sub-entities.

    @param c: V2 of mouse location
    */
    hover(c)
    {
        if (c.x > this.pos.x + this.size.x || c.y < this.pos.y || c.y > this.pos.y + this.size.y)
        {
            this.hovered = false;
            return;
        }

        this.hovered = true;
    }

    draw()
    {
        if (this.hovered)
        {
            ctx.fillStyle = PANEL_HOVER_COLOR;
            ctx.fillRect(this.pos.x, this.pos.y + PANEL_BORDER_THICKNESS/2,
                         this.size.x, this.size.y - PANEL_BORDER_THICKNESS);
        }

        // If selected, draw an outline around this button.
        if (this.selected)
        {
            ctx.fillStyle = PANEL_BORDER_COLOR;
            ctx.fillRect(this.pos.x, this.pos.y - PANEL_BORDER_THICKNESS/2,
                         this.size.x, PANEL_BORDER_THICKNESS);
            ctx.fillRect(this.pos.x, this.pos.y + this.size.y - PANEL_BORDER_THICKNESS/2,
                         this.size.x, PANEL_BORDER_THICKNESS);
            ctx.fillRect(this.pos.x, this.pos.y, PANEL_BORDER_THICKNESS, this.size.y);
            ctx.fillRect(this.pos.x + this.size.x - PANEL_BORDER_THICKNESS, this.pos.y,
                         PANEL_BORDER_THICKNESS, this.size.y);
        }

        ctx.font = "24px Verdana";
        ctx.fillStyle = this.color;
        ctx.textAlign = "center";
        ctx.fillText(this.text, this.pos.x + this.size.x/2, this.pos.y + this.size.y/2 + 6,
                     this.size.x * 0.8);
    }
}

class InfoPanel
{
    constructor()
    {
        this.pos = new V2(0, 0);
        this.size = new V2(0, 0);
        this.updateSize();
        
        this.color = PANEL_TEXT_COLOR;
    }

    /*
    When the screen is resized, this object will need to adjust accordingly. Global variables are
    used in this function (canvas).
    */
    updateSize()
    {
        this.pos.x = canvas.width * SELECTIONPANEL_WIDTH_PC - 1;
        this.size.x = canvas.width - this.pos.x;
        this.size.y = canvas.height * INFOPANEL_HEIGHT_PC;
        this.pos.y = canvas.height - this.size.y;
    }

    /*
    Given a 2d Vector to check for click on this entity and sub-entites.

    @param c: V2 of click location
    */
    click(c)
    {
        if (c.x < this.pos.x){ return; }
        if (c.y < this.pos.y){ return; }

        console.log("DEBUG: click on info panel.");
    }

    /*
    Given a 2d vector to check for hover on this entity and sub-entities.

    @param c: V2 of mouse location
    */
    hover(c)
    {
    }

    draw()
    {
        ctx.fillStyle = INFOPANEL_BACKGROUND_COLOR;
        ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);

        if (BORDERS)
        {
            ctx.fillStyle = PANEL_BORDER_COLOR;
            ctx.fillRect(this.pos.x, this.pos.y - PANEL_BORDER_THICKNESS/2,
                         this.size.x, PANEL_BORDER_THICKNESS);
        }

        // DEBUG
        ctx.font = "16px Verdana";
        ctx.textAlign = "left";
        ctx.fillStyle = this.color;
        ctx.fillText("Information about this selection goes here!",
                      this.pos.x + 10, this.pos.y + 24, this.size.x);
    }
}

/* ***********************************************************************************************/
/* END CLASSES ***********************************************************************************/
/* ***********************************************************************************************/

/* ***********************************************************************************************/
/* BEGIN GLOBALS *********************************************************************************/
/* ***********************************************************************************************/

// Grab the canvas from the html document and set things for it
var canvas = document.getElementById("main_canvas");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
var ctx = canvas.getContext("2d");

// Check if the device being used is mobile. We do not support that currently.
if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)))
{
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px Verdana";
    ctx.textAlign = "center";
    ctx.fillText("CET is not supported on mobile devices :`(", canvas.width/2, 
                 100, canvas.width * 0.8);
    throw new Error("Mobile is not supported.");
}

var passphrase = prompt("Enter your public passphrase.");

while (true)
{
    String.prototype.hashCode = function() {
        var hash = 0, i, chr;
        if (this.length === 0) return hash;
        for (i = 0; i < this.length; i++) {
            chr   = this.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };

    if (passphrase && passphrase.hashCode() == -1423908334) { break; }

    passphrase = prompt("Unkown public passphrase. Try again.");
}

var last_time = new Date().getTime();

var sel_panel = new SelectionPanel();
var info_panel = new InfoPanel();

var mousepos = new V2(0, 0);
var mousedown = [false, false, false];
var keys = [];
for (let i = 0; i < 256; i++){ keys.push(false); }

setInterval(update, UPDATE_RATE);

canvas.addEventListener("mousedown", function(evt)
{
    if (evt.button < 3)
    {
        mousedown[evt.button] = true;
    }
}, false);

canvas.addEventListener("mousemove", function(evt)
{
    sel_panel.hover(new V2(evt.x, evt.y));
    info_panel.hover(new V2(evt.x, evt.y));

    if (keys[CODE_P])
    {
        if (mousedown[MOUSE_L])
        {
            SELECTIONPANEL_WIDTH_PC += (evt.x - mousepos.x)/1000;
            SELECTIONPANEL_WIDTH_PC = SELECTIONPANEL_WIDTH_PC < 0 ? 0 : SELECTIONPANEL_WIDTH_PC;
            INFOPANEL_HEIGHT_PC -= (evt.y - mousepos.y)/1000;
            INFOPANEL_HEIGHT_PC = INFOPANEL_HEIGHT_PC < 0 ? 0 : INFOPANEL_HEIGHT_PC;
            sel_panel.updateSize();
            info_panel.updateSize();
        }
    }

    mousepos.x = evt.x;
    mousepos.y = evt.y;
}, false);

canvas.addEventListener("mouseup", function(evt)
{
    if (evt.button < 3)
    {
        mousedown[evt.button] = false;
    }

    sel_panel.click(new V2(evt.x, evt.y));
    info_panel.click(new V2(evt.x, evt.y));
}, false);

canvas.addEventListener("mousewheel", function(evt)
{
    var delta = Math.max(-1, Math.min(1, (evt.wheelDelta || -evt.detail)));
}, false);

document.body.onkeydown = function(e)
{
    keys[e.keyCode] = true;

    if (e.keyCode == CODE_B)
    {
        BORDERS = !BORDERS;
    }

    if (keys[CODE_N])
    {
        if (e.keyCode == CODE_UARROW)
        {
            PANEL_BORDER_THICKNESS++;
        }
        else if (e.keyCode == CODE_DARROW)
        {
            PANEL_BORDER_THICKNESS--;
        }
        PANEL_BORDER_THICKNESS = PANEL_BORDER_THICKNESS < 1 ? 1 : PANEL_BORDER_THICKNESS;
    }
}

document.body.onkeyup = function(e)
{
    keys[e.keyCode] = false;
}

/* ***********************************************************************************************/
/* END GLOBALS ***********************************************************************************/
/* ***********************************************************************************************/

/**
Main update function! This is called once every UPDATE_RATE milliseconds. 
*/
function update()
{
    // If the screen size was changed, adjust!
    // Oooooh, responsive!
    if (document.body.clientWidth != canvas.width || document.body.clientHeight != canvas.height)
    {
        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;

        sel_panel.updateSize();
        info_panel.updateSize();
    }

    // Clear the screen by drawing the background.
    ctx.fillStyle = MAIN_BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Find how long this update took.
    var this_time = new Date().getTime();
    var dur = this_time - last_time;
    last_time = this_time;

    // If the user left this window/tab, don"t jump too far
    if (dur > UPDATE_RATE)
    {
        dur = UPDATE_RATE;
    }

    draw();
}

function draw()
{
    info_panel.draw();
    sel_panel.draw();
}
