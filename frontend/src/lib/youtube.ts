export interface YouTubeMetadata {
  title: string;
  author: string;
  thumbnailUrl: string;
}


export const getYoutubeMetadata = async (url: string) => {
  const res = await fetch(`https://noembed.com/embed?url=${url}`);
  const data = await res.json();
  return data.title
};

export const youTubeGetID = (url: string) => {
  const res = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  return res[2] !== undefined ? res[2].split(/[^0-9a-z_\-]/i)[0] : res[0];
};

export const fetchMetaDataYoutube = async (url:string) => {
  try{
      const data = await getYoutubeMetadata(url);
      return data
  } catch (error) {
      console.error('Failed to fetch metadata:', error);
  }
}