onmessage = async function () {
   for(let i = 0; i< 10000; i++) {
       console.log(i)
   }
   this.postMessage('end')
}