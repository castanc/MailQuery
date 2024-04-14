function moneyOnly(newPages)
{
    newPages.forEach(np=>{
        let newRows = [];
        let re = /^M+$/
        let startMoney = -1;
        let endMoney = -1;
        for(let i=0;i<np.Rows.length-2;i++)
        {
            if ( re.test(np.Rows[i].LineMask && re.test(np.Rows[i+1].LineMask))) 
            {
                if ( startMoney == -1) startMoney = i;
                i++;
            }
            newRows.push(np.Rows[i]);
        }
        np.Rows = newRows;
        np.StartMoney = startMoney;
        np.endMoney = endMoney;

    });
    return newPages;
}