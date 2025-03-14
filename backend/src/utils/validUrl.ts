
const isValidUrl = (url: string): boolean => {
  try{
    new URL(url);
    return true;
  }catch(error){
    console.log(error);
    return false
  }
}

  
  const getBasicFallback = (url: string) => ({
    title: new URL(url).hostname,
    image: `${new URL(url).origin}/favicon.ico`
  });

export { isValidUrl, getBasicFallback };