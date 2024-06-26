function findRepeatingPatterns(str) {
    const regex = /(.+?)\1+/g;
    let matches = [];
    let match;
    while ((match = regex.exec(str)) !== null) {
        matches.push(match[0]);
    }
    return matches;
}

const inputString = "T#TNTMTMTNTNTDDTDTMTDMTMTMMDTNMDMTN#MDMTN#MTMMDNTMDNTMDNTNMDNTNMDNTNMDNTNMDNTNMDNTNMDNTNMDNTMDNTNMDNTNMDNTNMDNTNMDNTNMDNTNMDNTNMDNTNMDNTNMDNTNMDNTNMDNTNMDNTNMDNTNMDNTNMDNTMDNTNMDNTNMDNTMDNTMDNTNMDNTNMT#TNTMTMTNTNTDDTDTMTDMTMTDNTNMDNTNMDNTNMDNTNMDNTNMDNTMDNTMDNTNMDNTMDNTMDNTNMDNTNMDNTNMDNTNMDNTMDNTNMDNTNMDNTNMDNTNMTNMDTMDTMTMTMMMT#TNTMTMTNTNTDDTDTMTDMTMTMTMTMTMTMTMTMTMTMTMT";
const repeatingPatterns = findRepeatingPatterns(inputString);

console.log(repeatingPatterns);
