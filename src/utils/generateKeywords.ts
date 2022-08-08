export const generateKeywords = (name: string) => {
   const nameSplitted = name.split(' ').filter((w) => w.toLowerCase());

   const length = nameSplitted.length;
   const arrAfterPermute: Array<string> = [];
   const check: Array<boolean> = new Array(length).fill(false);
   const result: Array<string> = [];
   let keywords: Array<string> = [];

   const createKeywords = (name: string) => {
      const arrName: Array<string> = [];
      let currentName = '';
      name.split('').forEach((letter) => {
         currentName += letter;
         arrName.push(currentName);
      });
      return arrName;
   };

   const Try = (n: number) => {
      for (let i = 0; i < length; i++) {
         if (!check[i]) {
            result[n] = nameSplitted[i];
            check[i] = true;
            if (n === length - 1) {
               arrAfterPermute.push(result.join(' '));
            }
            Try(n + 1);
            check[i] = false;
         }
      }
   };

   Try(0);

   for (const item of arrAfterPermute) {
      const words = createKeywords(item);
      keywords = keywords.concat(words);
   }

   return keywords;
};
