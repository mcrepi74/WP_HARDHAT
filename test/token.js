const {expect} = require("chai");
const {ethers} = require("hardhat");

// describe("Token", function(){
//     it("Deployment should assing the total supply to the owner", async function (){
//         const[owner]=await ethers.getSigners();
//         const Token = await ethers.getContractFactory("Token");
//         const hardhatToken = await Token.deploy();

//         const ownerBalance = await hardhatToken.balanceOf(owner.address);
//         console.log("Owner Address:",owner.address);
//         expect(await hardhatToken.totalSupply()).to.be.equal(ownerBalance); //100000
//     })

//     it("Should transfer tokens between accounts", async function (){
//         const[owner, addr1, addr2]=await ethers.getSigners();
//         const Token = await ethers.getContractFactory("Token");
//         const hardhatToken = await Token.deploy();

//         // Transfer 50 tokens from owner to addr1
//         await hardhatToken.transfer(addr1.address,50);
//         expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);

//         //Transfer 25 tokens from addr1 to addr2
//         await hardhatToken.connect(addr1).transfer(addr2.address,25);
//         expect(await hardhatToken.balanceOf(addr2.address)).to.equal(25);
//     })
// })

describe("Token", function(){
    let Token;
    let hardhatToken;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function(){
        Token = await ethers.getContractFactory("Token");
        [owner,addr1,addr2,...addrs]= await ethers.getSigners();
        hardhatToken = await Token.deploy();
    })

    describe("Deployment", function(){
        it("Should set the right owner", async function(){
            expect(await hardhatToken.owner()).to.equal(owner.address);
        })
        it("Should assign the total supply of token to the owner", async function(){
            const ownerBalance = await hardhatToken.balanceOf(owner.address);
            expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
        });
    })

    describe("Transactions", function(){
        it("Should transfer tokens between accounts", async function(){
           //own to addr1 
           await hardhatToken.transfer(addr1.address,50);
           const addr1Balance= await hardhatToken.balanceOf(addr1.address);
           expect(addr1Balance).to.equal(50);
           
           // addr1 to addr2

           await hardhatToken.connect(addr1).transfer(addr2.address,25);
           const addr2Balance= await hardhatToken.balanceOf(addr2.address);
           expect(addr2Balance).to.equal(25);
        })
        it("Should fail if sender does not have enough tokens", async function(){
            const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
            await expect(hardhatToken.connect(addr1).transfer(owner.address,100)).to.be.revertedWith("Not enough tokens"); //0
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
        })

        it("Should update balances after transfers", async function(){
            const initialOwnerBalance= await hardhatToken.balanceOf(owner.address);
            await hardhatToken.transfer(addr1.address,10);
            await hardhatToken.transfer(addr2.address,20);

            const finalOwnerBalance = await hardhatToken.balanceOf(owner.address);
            expect(finalOwnerBalance).to.equal(initialOwnerBalance-30);

            const addr1Balance = await hardhatToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(10);

            const addr2Balance = await hardhatToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(20);

        })
    })
})