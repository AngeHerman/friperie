
$(document).ready(function (){
    
    let slideIndex = [];
    let slideId = [];
    var nextSlides = document.getElementsByClassName('next');
    var prevSlides = document.getElementsByClassName('prev');
    for(var i = 0; i < nextSlides.length; i++){
        slideIndex.push(1);
        slideId.push("slide"+i);
        console.log(1+","+i);
        nextSlides[i].addEventListener('click', function() {
            var index = parseInt(this.getAttribute('value'));
            plusSlides(1,index);
        });
        prevSlides[i].addEventListener('click', function() {
            var index = parseInt(this.getAttribute('value'));
            plusSlides(-1,index);
        });
    }

    for(var i = 0; i < slideId.length; i++){
        showSlides(1,i);
    }

    // Next/previous controls
    function plusSlides(n,num) {
        console.log(n,num);
        showSlides(slideIndex[num] += n,num);
    }

    function showSlides(n,num) {
        let i;
        let slide = document.getElementsByClassName(slideId[num]);
        if (n > slide.length) {slideIndex[num] = 1}
        if (n < 1) {slideIndex[num] = slide.length}
        for (i = 0; i < slide.length; i++) {
            slide[i].style.display = "none";
        }
        console.log(nextSlides);
        slide[(slideIndex[num]) -1].style.display = "block";
    } 

});
