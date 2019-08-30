const expect = require("chai").expect;
process.env.NODE_ENV = "test";
const polygon = require("../functions/polygonshuffle");

describe("polygonShuffle()", () => {
    beforeEach(() => {
        var players = ['A', 'B', 'C', 'D']
    })
    it("should properly 'rotate' the polygon for an even number of players", () => {
        //PREP
        players = ['A', 'B', 'C', 'D']

        //ACT
        players = polygon.polygonShuffle(players);
        var expPlayers = ['B', 'C', 'A', 'D'];

        //ASSERT
        expect(players).to.eql(expPlayers); 
    })

    it("should properly 'rotate' the polygon for an odd number of players", () => {
        //PREP
        players = ['A', 'B', 'C', 'D', 'E']

        //ACT
        players = polygon.polygonShuffle(players);
        var expPlayers = ['B', 'C', 'D', 'E', 'A'];

        //ASSERT
        expect(players).to.eql(expPlayers); 
    })

    it("should properly 'rotate' the polygon for a small number of players", () => {
        //PREP
        players = ['A', 'B', 'C']

        //ACT
        players = polygon.polygonShuffle(players);
        var expPlayers = ['B', 'C', 'A'];

        //ASSERT
        expect(players).to.eql(expPlayers); 
    })

    it("should properly 'rotate' the polygon for a large number of players", () => {
        //PREP
        players = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

        //ACT
        players = polygon.polygonShuffle(players);
        var expPlayers = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'A', 'Z'];

        //ASSERT
        expect(players).to.eql(expPlayers); 
    })

    it("should properly 'rotate' the polygon when called multiple times", () => {
        //PREP
        players = ['A', 'B', 'C', 'D']

        //ACT
        players = polygon.polygonShuffle(players);
        players = polygon.polygonShuffle(players);
        var expPlayers = ['C', 'A', 'B', 'D'];

        //ASSERT
        expect(players).to.eql(expPlayers); 
    })
});