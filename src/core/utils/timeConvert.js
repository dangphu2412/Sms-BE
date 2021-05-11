export const toTimestamp = strDate => {
    const splDate = strDate.split('/');
    const date = new Date(splDate[2], splDate[1] - 1, splDate[0]);
    return date.getTime();
   };
