const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {  
    var initialValue = 0;
    var sum = blogs.reduce(
        (accumulator, currentValue) => accumulator + currentValue.likes
        ,initialValue
    );
    return sum
}

const favoriteBlog = (blogs) => {
    const max = blogs.reduce(function(prev, current) {
    return (prev.likes > current.likes) ? prev : current
})
return max
}

module.exports = {
  dummy, totalLikes, favoriteBlog
}