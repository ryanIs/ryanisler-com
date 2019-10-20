var cl = function(_) { return console.log(_); };

var random = function(_) { return Math.floor( Math.random() * _ ); };

var introSound;

$(document).ready(function() {
    initCanvas();

    // Objective: check cookie for playing sound
    playSound();

    createFeatured();
});

// Plays the intro soundtrack
function playSound() {
    /*
    introSound = new Audio("../media/intro.mp3")
    if(introSound != undefined) {
        introSound.play().then(function(e) {
            cl(e);
        })
        .catch(function(e) {
            cl("catch");
            cl(e);
        });
    }
    */
}

// Loads featured objects from the featured.json file
function createFeatured() {

    loadJSON(FEATURED_JSON, function(objectData) {

        console.log(objectData);

        for(var i = 0; i < objectData.featured.length; i++) {

            var imageSrc = objectData.featured[i].featuredIcon;
            var featureTitle = objectData.featured[i].title;
            var featureDescription = objectData.featured[i].description;
            var featureSite = objectData.featured[i].site;
            var featureReleased = objectData.featured[i].released;

            // Create element
            var newFeature = document.createElement("div");

            // Extract template HTML
            var copyHtml = $("#feature-template").html();

            // Place into new template
            $(newFeature).html(copyHtml);
            $(newFeature).addClass("feature-wrapper");

            // Setup UI
            $(newFeature).find(".banner-image").attr("src", imageSrc);
            $(newFeature).find(".feature-title").html(featureTitle);
            $(newFeature).find(".feature-description").html(featureDescription);

            if(featureReleased) {
                $(newFeature).find(".feature-btn").click(function(){
                    window.location.href = featureSite;
                });
            } else {
                $(newFeature).find(".feature-btn").hide();
            }

            // Append to DOM
            $(".featured-container").append(newFeature);

            console.log(newFeature);

        }

        // Remove template
        $("#feature-template").remove();

    });

}