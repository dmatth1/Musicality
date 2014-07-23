/////////////////////////////////////////////////////////////////////////////
// Constants
/////////////////////////////////////////////////////////////////////////////

// Class name for hidden button
var HIDDEN_BUTTON_CLASS = "hidden_button";

// Class name for subdued button
var SUBDUED_BUTTON_CLASS = "subdued_button";

// Class name for dim button
var DIM_BUTTON_CLASS = "dim_button";

// Class name for visible button
var VISIBLE_BUTTON_CLASS = "visible_button";


/////////////////////////////////////////////////////////////////////////////
// Member Variables
/////////////////////////////////////////////////////////////////////////////

// Whether or not we should debug
var mDebug = false;

// The background page
var mBackground = chrome.extension.getBackgroundPage();

// The player details
var mPlayerDetails = mBackground.mPlayerDetails;

/////////////////////////////////////////////////////////////////////////////
// Functions
/////////////////////////////////////////////////////////////////////////////

// Update the information displayed within the extension
function UpdateInformation(){

    if (mDebug){
        console.log("popup.js::UpdateInformation()");
    }

    // Tell the background to update too
    mBackground.UpdateInformation();

    // Re-grab the player details in case they changed
    mPlayerDetails = mBackground.mPlayerDetails;

    // Populate the information
    PopulateInformation();
}

// Populate the actual extension contents
function PopulateInformation(){

    // Grab the player details again
    mPlayerDetails = mBackground.mPlayerDetails;
    
    // Get the artist from the background
    var artist = mBackground.mArtist;
    
    if (mDebug){
        console.log("popup.js::PopulateInfo -- artist: " + artist);
    }

    // Get the track from the background
    var track = mBackground.mTrack;

    if (mDebug){
        console.log("popup.js::PopulateInfo -- track: " + track);
    }

    // Get handles to different elements we need
    var playPauseElement = $("#playPauseButton");
    var nextTrackElement = $("#nextButton");
    var prevTrackElement = $("#previousButton");
    var shuffleButtonElement = $("#shuffleButton");
    var repeatButtonElement = $("#repeatButton");
    var thumbsUpButtonElement = $("#thumbsUpButton");
    var thumbsDownButtonElement = $("#thumbsDownButton");
    var trackElement = $("#track");
    var artistElement = $("#artist");
    var artClass = $(".art");
    var playbackControlsImgElement = $("#playbackControlsBackgroundImage");
    var trackInfoImgElement = $("#trackInfoBackgroundImage");
    var totalTimeElement = $("#totalTime");
    var curTimeElement = $("#currentTime");
    
    if (track && track != null && track != "" && mPlayerDetails){
        trackElement.text(track);

        // Set the play/pause opacity
        if (mPlayerDetails.has_play_pause){
            UpdateButton(playPauseElement, VISIBLE_BUTTON_CLASS);
        }else{
            UpdateButton(playPauseElement, HIDDEN_BUTTON_CLASS);
        }

        // Set the next track opacity
        if (mPlayerDetails.has_next_track){
            UpdateButton(nextTrackElement, VISIBLE_BUTTON_CLASS);
        }else{
            UpdateButton(nextTrackElement, HIDDEN_BUTTON_CLASS);
        }

        // Set the prev track opacity
        if (mPlayerDetails.has_prev_track){
            UpdateButton(prevTrackElement, VISIBLE_BUTTON_CLASS);
        }else{
            UpdateButton(prevTrackElement, HIDDEN_BUTTON_CLASS);
        }

        // Set the shuffle button opacity
        if (mPlayerDetails.has_shuffle){
            UpdateButton(shuffleButtonElement, SUBDUED_BUTTON_CLASS);
        }else{
            UpdateButton(shuffleButtonElement, HIDDEN_BUTTON_CLASS);
        }

        // Set the repeat button opacity
        if (mPlayerDetails.has_repeat){
            UpdateButton(repeatButtonElement, SUBDUED_BUTTON_CLASS);
        }else{
            UpdateButton(repeatButtonElement, HIDDEN_BUTTON_CLASS);
        }

        // Set the thumbs up button opacity
        if (mPlayerDetails.has_thumbs_up){
            UpdateButton(thumbsUpButtonElement, SUBDUED_BUTTON_CLASS);
        }else{
            UpdateButton(thumbsUpButtonElement, HIDDEN_BUTTON_CLASS);
        }

        // Set the thumbs down button opacity
        if (mPlayerDetails.has_thumbs_down){
            UpdateButton(thumbsDownButtonElement, SUBDUED_BUTTON_CLASS);
        }else{
            UpdateButton(thumbsDownButtonElement, HIDDEN_BUTTON_CLASS);
        }                
        
        // Store the track for now
        mCurTrack = track;

        // Display the name of the player that is playing
        var playerName = mPlayerDetails.name;
        if (playerName != null && playerName != ""){
 
           // Let's push the player name as a custom GA variable
           _gaq.push(['_setCustomVar',
            1,
            'Player Name',
            mPlayerDetails.name,
            3]);

           // Track the event
           _gaq.push(['_trackEvent',
            'Found Player',
            'Popup'
            ])
       }

        // Check the artist information and populate
        if (artist != null && artist != ""){
            artistElement.text(artist);
        }else{
            // No artist. Update text appropriately
            artistElement.text("");
        }

        // Get the album art from the background
        var art_url = mBackground.mArtUrl;
        
        // Log it if we've found the art
        if (mDebug){
            console.log("popup.js::PopulateInfo -- art URL: " + art_url);
        }

        // Check if we have art        
        if (art_url && art_url != null && art_url != ""){
            // Update the art to display the now playing art
            artClass.attr("src", art_url);
        }else{
            // Not found, so revert it to the empty art
            artClass.attr("src", "/images/empty.png");
        }

        // Get the current time from the player
        var current_time = mBackground.GetTimeStringForMilliseconds(mBackground.mCurrentTime);
        
        // Log it if we've found the current time
        if (mDebug){
            console.log("popup.js::PopulateInfo -- current time: " + current_time);
        }

        // Update the info
        if (current_time != null && current_time != "" && mBackground.mCurrentTime > 0){
            curTimeElement.text(current_time + "/");
        }else{
            curTimeElement.text("");
        }

        // Get the total time
        var total_time = mBackground.GetTimeStringForMilliseconds(mBackground.mTotalTime);

        // Log it if we've found the total time
        if (mDebug){
            console.log("popup.js::PopulateInfo -- total time: " + total_time);
        }

        // Update the info
        if (total_time != null && total_time != "" && mBackground.mTotalTime > 0 &&
            curTimeElement.text() != ""){
            totalTimeElement.text(total_time);
        }else{
            totalTimeElement.text("");
        }

        // Get is playing from background
        var playing = mBackground.mIsPlaying;

        // Log whatever we have got
        if (mDebug){
            console.log("popup.js::PopulateInfo -- is playing: " + playing);
        }

        // Set the class of the element
        if (playing){
            playPauseElement.removeClass("play");
            playPauseElement.addClass("pause");
        }else{
            playPauseElement.removeClass("pause");
            playPauseElement.addClass("play");
        }

        // Get whether or not it's shuffled
        var shuffled = mBackground.mIsShuffled;

        // Log whatever we have got
        if (mDebug){
            console.log("popup.js::PopulateInfo -- is shuffled: " + shuffled);
        }

        if (shuffled){
            shuffleButtonElement.addClass("active");
        }else{
            shuffleButtonElement.removeClass("active");
        }
        
        // Get whether or not repeat is off
        var repeat_off = mBackground.mIsRepeatOff;
        
        // Log whatever we have got
        if (mDebug){
            console.log("popup.js::PopulateInfo -- is repeat off: " + repeat_off);
        }

        // Get the element
        if (repeat_off){
            repeatButtonElement.addClass("glyphicon-refresh");
            repeatButtonElement.removeClass("glyphicon-repeat");
            repeatButtonElement.removeClass("active");
        }

        // Get whether or not repeat is on (1)
        var repeat_one = mBackground.mIsRepeatOne;

        // Log whatever we have got
        if (mDebug){
            console.log("popup.js::PopulateInfo -- is repeat one: " + repeat_one);
        }

        // Get the element
        if (repeat_one){
            repeatButtonElement.addClass("active");
            repeatButtonElement.addClass("glyphicon-repeat");
            repeatButtonElement.removeClass("glyphicon-refresh");
        }

        // Get whether or not it's repeat all
        var repeat_all = mBackground.mIsRepeatAll;

        // Log whatever we have got
        if (mDebug){
            console.log("popup.js::PopulateInfo -- is repeat all: " + repeat_all);
        }

        // Get the element
        if (repeat_all){
            repeatButtonElement.addClass("active");
            repeatButtonElement.addClass("glyphicon-refresh");
            repeatButtonElement.removeClass("glyphicon-repeat");
        }

        // Get the thumbs up state
        var thumbed_up = mBackground.mIsThumbedUp;
        
        // Log whatever we have got
        if (mDebug){
            console.log("popup.js::PopulateInfo -- is thumbed up: " + thumbed_up);
        }

        // Toggle the thumbs up button
        if (thumbed_up){
            thumbsUpButtonElement.addClass("active");
        }else{
            thumbsUpButtonElement.removeClass("active");
        }

        // Get the thumbed down state
        var thumbed_down = mBackground.mIsThumbedDown;

        // Log whatever we have got
        if (mDebug){
            console.log("popup.js::PopulateInfo -- is thumbed down: " + thumbed_down);
        }

        // Toggle the thumbs down button
        if (thumbed_down){
            thumbsDownButtonElement.addClass("active");
        }else{
            thumbsDownButtonElement.removeClass("active");
        }
    }else{
        // Looks like we have to disable some buttons
        UpdateButton(playPauseElement, DIM_BUTTON_CLASS);
        UpdateButton(nextTrackElement, DIM_BUTTON_CLASS);
        UpdateButton(prevTrackElement, DIM_BUTTON_CLASS);
        UpdateButton(shuffleButtonElement, DIM_BUTTON_CLASS);
        UpdateButton(repeatButtonElement, DIM_BUTTON_CLASS);
        UpdateButton(thumbsUpButtonElement, DIM_BUTTON_CLASS);
        UpdateButton(thumbsDownButtonElement, DIM_BUTTON_CLASS);

        // Tell the user nothing is playing
        trackElement.text("Play a song.");

        // Empty the other pieces as well
        artistElement.text("");
        artClass.attr("src", "/images/empty.png");
        curTimeElement.text("");
        totalTimeElement.text("");
    }
}

// A function to change the class of the provided element
function UpdateButton(buttonToUpdate, updatedClass){
    // Remove all button classes
    buttonToUpdate.removeClass(HIDDEN_BUTTON_CLASS);
    buttonToUpdate.removeClass(SUBDUED_BUTTON_CLASS);
    buttonToUpdate.removeClass(DIM_BUTTON_CLASS);
    buttonToUpdate.removeClass(VISIBLE_BUTTON_CLASS);

    // Add the new class
    buttonToUpdate.addClass(updatedClass);
}

//// Click Functions ////

// Method executed when extensions shuffle is clicked
function ShuffleClick(){
    // Call the master clicker
    ClickSomething(CLICK_SHUFFLE);
}

// Method executed when extensions repeat is clicked
function RepeatClick(){
    ClickSomething(CLICK_REPEAT);
}

// Method executed when extensions prev track is clicked
function PrevTrackClick(){
    ClickSomething(CLICK_PREV_TRACK);
}

// Method executed when extensions play is clicked
function PlayClick(){
    ClickSomething(CLICK_PLAY);
}

// Method executed when extensions pause is clicked
function PauseClick(){
    ClickSomething(CLICK_PAUSE);
}

// Method executed when extensions next track is clicked
function NextTrackClick(){
    ClickSomething(CLICK_NEXT_TRACK);
}

// Method executed when extensions thumbs up is clicked
function ThumbsUpClick(){
    ClickSomething(CLICK_THUMBS_UP);
}

// Method executed when extensions thumbs down is clicked
function ThumbsDownClick(){
    ClickSomething(CLICK_THUMBS_DOWN);
}

// General method for dealing with clicking anything
function ClickSomething(clickWhat){
    // Tell the background to take care of this
    mBackground.ClickSomething(clickWhat);
}

// A function to start the marquee when hovered over
function startMarquee(){
    // Get the width of the item
    var width = $(this).width();
    var parentWidth = $(this).parent().width();

    // Check if we are overflowing
    if(width > parentWidth) {

        // Get the distance to scroll (10 pixel buffer)
        var scrollDistance = width - parentWidth + 10;

        // Get the item to scroll
        var itemToScroll = $(this).parent();

        // Stop any current animation on that item
        itemToScroll.stop();
        
        // Start animating
        itemToScroll.animate({scrollLeft: scrollDistance}, 2000 * (scrollDistance/parentWidth), 'linear');
    }
}

// A function to stop the marquee when it's no longer hovered over
function stopMarquee(){
    // Get the item that could be scrolling
    var itemToStop = $(this).parent();

    // Stop the animation
    itemToStop.stop();

    // Swing it back to the original position
    itemToStop.animate({scrollLeft: 0}, 'medium', 'swing');
}

/////////////////////////////////////////////////////////////////////////////
// Execution Start
/////////////////////////////////////////////////////////////////////////////

// Once the document is ready, bind all of the functions.
$(function(){
    // Immediately update our information
    UpdateInformation();
    
    //Update our information once every quarter second.
    window.setInterval(function() {
        UpdateInformation();
    }, 1000)

    // Get the clickable elements ready!

    // Shuffle button
    $("#shuffleButton").bind('click', function(){
        ShuffleClick();
    });

    // Repeat button
    $("#repeatButton").bind('click', function(){
        RepeatClick();
    });
    
    // Previous track
    $("#previousButton").bind('click', function(){
       PrevTrackClick();
    });

    // Play/pause

    // Get the elemtn
    var playPauseElement = $("#playPauseButton");
    playPauseElement.bind('click', function(handler){
        // Be smart about what we are clicking
        if (playPauseElement.hasClass("play")){
            // Click play
            PlayClick();
        }else if (playPauseElement.hasClass("pause")){
            // Click pause
            PauseClick();
        }
    });

    // Next track
    $("#nextButton").bind('click', function(){
        NextTrackClick();
    });

    // Thumbs up
    $("#thumbsUpButton").bind('click', function(){
        ThumbsUpClick();
    });

    // Thumbs down
    $("#thumbsDownButton").bind('click', function(){
        ThumbsDownClick();
    });

    // Player name
    $('#art').bind('click', function(){
        mBackground.GoToNowPlayingTab();
    });

    // Register all marquee items to marquee
    $(".marqueeItem").hover(startMarquee, stopMarquee);

    // Tell background to open the default player, if there is one set
    mBackground.OpenDefaultPlayer();
});
