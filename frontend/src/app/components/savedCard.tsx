"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import Image from "next/image";
import { Share2, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import {
  fetchMetaDataYoutube,
  youTubeGetID,
  type YouTubeMetadata,
} from "@/lib/youtube";
import { Tweet } from "react-tweet";
import { detectLinkType } from "@/lib/detectLinkType";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ArticleMetadata = {
  title: string;
  description: string;
  image: string;
  siteName: string;
  url: string;
};

function SavedCard({ key ,url }) {
  const urlType = detectLinkType(url);
  const [renderType, setRenderType] = useState("");
  const [metaData, setMetaData] = useState<YouTubeMetadata | ArticleMetadata | string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const videoId = youTubeGetID(url);

  useEffect(() => {
    const renderAccordingToType = async () => {
      setIsLoading(true);
      
      if (urlType === "youtube") {
        setRenderType("youtube");
        const data = fetchMetaDataYoutube(url);
        setMetaData(data);
      }
      else if (urlType === "twitter") {
        setRenderType('twitter');
        const pattern = /\/status\/(\d+)/;
        const match = url.match(pattern);
        if (match && match[1]) {
          const id = match[1].toString();
          setMetaData(id);
        }
      }
      else if (urlType === 'others' || urlType === 'article' || urlType === 'paper') {
        setRenderType(urlType);
        const token = localStorage.getItem('token');
        try {
          const res = await fetch(`http://localhost:8000/preview/metadata?url=${url}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          setMetaData(data);
        } catch (error) {
          console.error("Error fetching metadata:", error);
        }
      }
      
      setIsLoading(false);
    };
    
    renderAccordingToType();
  }, [url, urlType]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: typeof metaData !== 'string' && 'title' in metaData ? metaData.title : 'Shared content',
        url: url
      }).catch(err => console.error('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(url)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error('Error copying link:', err));
    }
  };

  const handleDelete = () => {
    // Implement your delete logic here
    console.log('Deleting item:', url);
    // You would typically call an API endpoint or update state in a parent component
  };

  const openExternalLink = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Common card wrapper with consistent styling and actions
  return (
    <Card key={key} 
      className="w-full max-w-sm transition-all duration-200 hover:shadow-md relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Action buttons that appear on hover */}
      <div className={`absolute top-2 right-2 flex gap-1 z-10 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                onClick={openExternalLink}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Open link</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="secondary" 
                size="icon" 
                className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/90 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this saved item.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <CardContent className="p-4 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* YouTube Content */}
            {renderType === "youtube" && metaData && (
              <div className="space-y-3">
                <h2 className="text-lg font-medium line-clamp-2 leading-tight">
                  {typeof metaData !== 'string' && 'title' in metaData ? metaData.title : 'YouTube Video'}
                </h2>
                <div className="relative rounded-lg overflow-hidden aspect-video">
                  <YouTube
                    className="w-full h-full"
                    iframeClassName="w-full h-full"
                    videoId={videoId}
                    opts={{
                      width: '100%',
                      height: '100%',
                      playerVars: {
                        modestbranding: 1,
                      },
                    }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  youtube.com
                </div>
              </div>
            )}
            
            {/* Article/Paper/Other Content */}
            {(renderType === "others" || renderType === "article" || renderType === "paper") && 
             typeof metaData !== 'string' && metaData && 'image' in metaData && (
              <div className="space-y-3">
                <h2 className="text-lg font-medium line-clamp-2 leading-tight">
                  {metaData.title || 'Article'}
                </h2>
                
                {metaData.image && (
                  <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-muted/20">
                    <Image 
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      src={metaData.image || "/placeholder.svg"}
                      alt={metaData.title || "Article preview"}
                    />
                  </div>
                )}
                
                {metaData.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{metaData.description}</p>
                )}
                
                <div className="text-xs text-muted-foreground">
                  {metaData.siteName || new URL(url).hostname.replace('www.', '')}
                </div>
              </div>
            )}

            {/* Twitter Content */}
            {renderType === "twitter" && typeof metaData === 'string' && (
              <div className="twitter-embed-container">
                <Tweet id={metaData} />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default SavedCard;
