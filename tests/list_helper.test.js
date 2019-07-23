const listHelper = require('../utils/list_helper')

blog1 = {
    title: "soinin ploki",
    author: "timo soini",
    url: "www.ploki.fi",
    likes: 32
}

blog2 = {
    title: "väyrysen ploki",
    author: "paavo väyrynen",
    url: "www.paavonploki.fi",
    likes: 17
}

blog3 = {
    title: "väyrysen ploki2",
    author: "paavo väyrynen",
    url: "www.paavonploki.fi",
    likes: 14
}

const blogs = [blog1,blog2,blog3]

describe('dummy', () => {
    test('dummy returns one', () => {
    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
    })
})

describe('total likes', () => {
    test("tykkäysten määrä lasketaan oikein",() => {
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(63)
    })
})

describe('most likes', () => {
    test("palauttaa eniten tykkäyksiä saaneen blogin",() =>{
        const result = listHelper.favoriteBlog(blogs)
        expect(result).toEqual(blog1)
    })
})