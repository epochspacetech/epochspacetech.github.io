
var appear_offset = 100;
var start_time = 0;
var started = false;

var fadechecks = setInterval(update, 1000/30);

var fades = [
    {"class": "index_header", "start_time": 100, "duration": 400, "type": "onstart", "alive": true},
    {"class": "index_main_image", "start_time": 500, "duration": 800, "type": "onstart", "alive": true},
    {"class": "index_tagline", "start_time": 0, "duration": 1500, "type": "onscreen", "activated": false, "alive": true},
    {"class": "index_motto", "start_time": 0, "duration": 1500, "type": "onscreen", "activated": false, "alive": true},
    {"class": "index_cubesat_img", "start_time": 0, "duration": 1500, "type": "onscreen", "activated": false, "alive": true},
    {"class": "index_cubesat_description", "start_time": 0, "duration": 1500, "type": "onscreen", "activated": false, "alive": true},
    {"class": "index_cubesat_link", "start_time": 0, "duration": 1500, "type": "onscreen", "activated": false, "alive": true}
];

function update()
{
    // wait until ready
    if (document.readyState != "complete"){ return; }

    // set start time on first entrance
    if (!started){ start_time = new Date().getTime(); started = true; }

    // find the elapsed time since start
    var elapsed = (new Date().getTime() - start_time);

    for (var i = 0; i < fades.length; i++)
    {
        if (fades[i].alive)
        {
            if (fades[i].type == "onstart")
            {
                if (elapsed > fades[i].start_time)
                {
                    var myelapsed = elapsed - fades[i].start_time;
                    document.getElementsByClassName(fades[i].class)[0].style.opacity = myelapsed / fades[i].duration;

                    if (myelapsed > fades[i].duration)
                    {
                        fades[i].alive = false;
                    }
                }
            }
            else if (fades[i].type == "onscreen")
            {
                if (fades[i].activated)
                {
                    var myelapsed = elapsed - fades[i].start_time;
                    document.getElementsByClassName(fades[i].class)[0].style.opacity = myelapsed / fades[i].duration;

                    if (myelapsed > fades[i].duration)
                    {
                        fades[i].alive = false;
                    }
                }
                else
                {
                    if (document.getElementsByClassName(fades[i].class)[0].getBoundingClientRect().top < window.innerHeight - appear_offset)
                    {
                        fades[i].activated = true;
                        fades[i].start_time = new Date().getTime() - start_time;
                    }
                }
            }
        }
    }
}
