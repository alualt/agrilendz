async function main() {
    const MyContract = await ethers.getContractFactory("Box");
    const contract = MyContract.attach(
    "0x343F69cC115Cc3aF1cd051756F00DE10526C693C"
    );
    console.log((await contract.retrieve()).toString())
}
main().then(()=>{process.exit(0)})