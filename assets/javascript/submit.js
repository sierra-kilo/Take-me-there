$('.btn[name=submit]').click(function() {

    var radius = $("input[name='distance']:checked").val();
    localStorage.setItem("radius", radius);
    console.log(radius);
    var minRating = $("input[name='stars']:checked").val();
    localStorage.setItem("minRating", minRating);
    console.log(minRating);
    var maxPrice = $("input[name='dollars']:checked").val();
    localStorage.setItem("maxPrice", maxPrice);
    console.log(maxPrice);

});
