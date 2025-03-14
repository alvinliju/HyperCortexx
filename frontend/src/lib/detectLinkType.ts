
const paperPattern = /https?:\/\/(?:arxiv\.org\/abs\/\d{4}\.\d{4,5}|ieeexplore\.ieee\.org\/document\/\d+|link\.springer\.com\/article\/10\.\d{4,9}\/[a-zA-Z0-9\-]+|www\.sciencedirect\.com\/science\/article\/pii\/[A-Z0-9]+|dl\.acm\.org\/doi\/10\.\d{4,9}\/\d+\.\d+)/;

export const detectLinkType = (url: string) => {
    if(url.includes('x.com') || url.includes('twitter')){
        return 'twitter';
    }

    if(url.includes('youtube') || url.includes('youtu.be') || url.includes('youtube.com') || url.includes('youtube.com/watch?v=')){
        return 'youtube'
    }
    

    if(url.includes('.pdf') || url.includes('pdf') || url.includes('doc') || paperPattern.test(url)){
        return 'papers'
    }

    return 'others'
}