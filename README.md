# picick
Lightweight Picture Resizer/Cropper and Selector in Javascript

This is just a small side project I'm working on to use in my own site.
I'm using it as a profile picture selector but someone else might find it useful as a general picture cropper on the user's end as well.

1. Open picick.js and adjust options and styling to your liking.
    (Editable areas should be clearly marked when reading from the top-down)

2. Insert "<script id='picick' src='[path_to_picick]/picickjs'></script>" into the div within which you want picick to be displayed.
    A canvas and it's wrapper along with some buttons will be inserted where the script tag is.

3. Declare "function picSet(imgasDataURL)". It will be fired when the set button is pressed. 
    The DataURL passed to the picSet function is the image that the user sees on their canvas when the press set, with the exception that 
    the picture is not cropped off at the selector circle. The DataURL is always a rectangle.
    If you choose to require the entirety of the Canvas to be filled for the user to set/upload their picture,
    set "filledCanvasRequirement=true" in order to prevent the calling of the picSet function with an unfilled canvas.
    In said case, "function notFilled(imgasDataURL)" would be called with the contents of the unfilled canvas being passed to it.

4. If you would like picick to automatically load and insert itself on pageload, set "loadOnPageLoad=true".
   It is set to false by default. To load it at any other time, call "loadpicick();".
   
 # Known Deficiencies
 Oh where do I start...
 
 • While I've implemented dragging the image via touchscreen, currently the zoom buttons must be used in place of two-finger touch 
   zooming. I'll try to get around to fixing this.
   
# Feel free to use this as you please.
Credit would be nice, but I'm no stickler ;p
   
#Message me with any Suggestions or bugs.
diffrican@gmail.com
