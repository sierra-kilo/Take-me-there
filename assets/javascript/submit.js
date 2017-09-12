$('.btn[name=submit]').click(function() {
    var radius = $("input[name='distance']:checked").val();
    console.log(radius);
    var minRating = $("input[name='stars']:checked").val();
    console.log(minRating);
    var maxPrice = $("input[name='dollars']:checked").val();
    console.log(maxPrice);

});
